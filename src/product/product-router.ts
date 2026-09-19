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
import createProductValidator from "./cerate-product-validator";
import { ProductController } from "./product-controller";
import { ProductService } from "./product-service";
import fileUpload from "express-fileupload";
import { S3Storage } from "../common/services/S3Storage";
import updateProductValidator from "./update-product-validator";

const router = express.Router();
const productService = new ProductService();
const storage = new S3Storage();
const productController = new ProductController(productService, storage);

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
    fileUpload({
        limits: { fileSize: 1024 * 500 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceed the limits");
            next(error);
        },
    }),
    createProductValidator,
    asyncWrapper(productController.create),
);
router.put(
    "/:productId",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 1024 * 500 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceed the limits");
            next(error);
        },
    }),
    updateProductValidator,
    asyncWrapper(productController.update),
);

export default router;
