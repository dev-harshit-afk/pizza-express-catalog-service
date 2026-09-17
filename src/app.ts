import express, { Request, Response } from "express";
import categoryRouter from "./category/category-router";
import productRouter from "./product/product-router";

import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from server" });
});

app.use(express.json());
app.use(cookieParser());

app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use(globalErrorHandler);

export default app;
