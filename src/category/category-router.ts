import express, {
    NextFunction,
    RequestHandler,
    Response,
    Request,
} from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import createHttpError from "http-errors";
import authenticate from "../common/middlewares/authenticate";

const router = express.Router();

const asyncWrapper = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            if (err instanceof Error) {
                next(createHttpError(500, err.message));
            } else {
                next(createHttpError(500, "Internal Server Error"));
            }
        });
    };
};

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    authenticate,
    categoryValidator,
    asyncWrapper(categoryController.create),
);

export default router;
