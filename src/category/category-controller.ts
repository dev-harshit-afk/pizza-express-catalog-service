import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Category } from "./category-types";
import { CategoryService } from "./category-service";
import { Logger } from "winston";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    async create(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { name, priceConfiguration, attributes } = req.body as Category;
        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes,
        });

        this.logger.info("created category", { id: category._id });

        res.json({ id: category._id });
    }
    async update(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { name, priceConfiguration, attributes } = req.body as Category;
        const { id } = req.params;
        if (!id) {
            return next(createHttpError(400, "id is missing or invalid"));
        }
        const category = await this.categoryService.update(id, {
            name,
            priceConfiguration,
            attributes,
        });

        this.logger.info("updated category", { id: category?._id });

        res.json({ id: category?._id });
    }
    async delete(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { id } = req.params;

        if (!id) {
            return next(createHttpError(400, "id is missing or invalid"));
        }

        const category = await this.categoryService.delete(id);

        this.logger.info("deleted category", { id: category?._id });

        res.json({ message: "category deleted successfully" });
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const categories = await this.categoryService.getAll();
        this.logger.info("Feteched all category");

        res.json({
            message: "category fetched successfully",
            data: categories,
        });
    }
    async get(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        if (!id) {
            return next(createHttpError(400, "id is missing or invalid"));
        }

        const category = await this.categoryService.get(id);
        this.logger.info("Feteched category", { id: category?._id });

        res.json({ message: "category feteched successfully", data: category });
    }
}
