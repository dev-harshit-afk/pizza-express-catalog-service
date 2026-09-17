/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Product } from "./product-types";
import { ProductService } from "./product-service";
export class ProductController {
    constructor(private productService: ProductService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        const results = validationResult(req);
        if (!results.isEmpty()) {
            return next(createHttpError(400, results.array()[0].msg as string));
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
            image: "image",
        };
        const newProduct = await this.productService.create(product);

        const productId = (newProduct as unknown as { _id: string })._id;
        res.json({ id: productId });
    };
}
