/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Filter, Product } from "./product-types";
import { ProductService } from "./product-service";
import { FileStorage } from "../common/types/storage";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { Roles } from "../common/constants";
import mongoose from "mongoose";
import { Logger } from "winston";
export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
        private logger: Logger,
    ) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        const results = validationResult(req);
        if (!results.isEmpty()) {
            return next(createHttpError(400, results.array()[0].msg as string));
        }

        const image = req.files!.image as UploadedFile;
        const imageName = uuidv4();

        await this.storage.uploadFile({
            fileName: imageName,
            fileData: image.data.buffer,
        });

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublished,
        } = req.body as unknown as Product;
        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration),
            attributes:
                // eslint-disable-next-line
                typeof attributes === "string"
                    ? JSON.parse(attributes)
                    : attributes,
            tenantId,
            categoryId,
            isPublished,
            image: imageName,
        };
        const newProduct = await this.productService.create(product);

        const productId = (newProduct as unknown as { _id: string })._id;
        res.json({ id: productId });
    };
    update = async (req: Request, res: Response, next: NextFunction) => {
        const results = validationResult(req);
        if (!results.isEmpty()) {
            return next(createHttpError(400, results.array()[0].msg as string));
        }

        const { productId } = req.params;

        const product = await this.productService.getProduct(productId);
        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

        const requestedTenantId = req.auth?.tenant;

        if (
            requestedTenantId !== product.tenantId &&
            req.auth?.role !== Roles.ADMIN
        ) {
            return next(
                createHttpError(
                    403,
                    "You are not authorized to update this product",
                ),
            );
        }

        let imageName: string | undefined;

        const oldImage = (await this.productService.getProductImage(
            productId,
        )) as string;

        if (req.files?.image) {
            imageName = uuidv4();
            const image = req.files.image as UploadedFile;

            await this.storage.uploadFile({
                fileName: imageName,
                fileData: image.data.buffer,
            });

            await this.storage.deleteFile(oldImage);
        }
        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublished,
        } = req.body as unknown as Product;
        const newProduct = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration),
            attributes:
                // eslint-disable-next-line
                typeof attributes === "string"
                    ? JSON.parse(attributes)
                    : attributes,
            tenantId,
            categoryId,
            isPublished,
            image: imageName ? imageName : oldImage,
        };

        await this.productService.updateProduct(productId, newProduct);

        return res.json({ id: productId });
    };

    index = async (req: Request, res: Response) => {
        const { q, tenantId, categoryId, isPublish } = req.query;

        const filter = {} as Filter;

        if (isPublish === "true") {
            filter.isPublish = true;
        }
        if (tenantId) filter.tenantId = tenantId as string;

        if (
            categoryId &&
            mongoose.Types.ObjectId.isValid(categoryId as string)
        ) {
            filter.categoryId = new mongoose.Types.ObjectId(
                categoryId as string,
            );
        }

        const products = await this.productService.getProducts(
            q as string,
            filter,
        );
        this.logger.info("Fetched all products");
        return res.json(products);
    };
}
