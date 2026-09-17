import express, {
    NextFunction,
    RequestHandler,
    Response,
    Request,
} from "express";

import createHttpError from "http-errors";
import authenticate from "../common/middlewares/authenticate";
import canAccess from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import productValidator from "./product-validator";
import { ProductController } from "./product-controller";
import { ProductService } from "./product-service";
import fileUpload from "express-fileupload";

const router = express.Router();
const productService = new ProductService();
const productController = new ProductController(productService);

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

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload(),
    productValidator,
    asyncWrapper(productController.create),
);

export default router;
