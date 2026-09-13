import express, { Request, Response } from "express";
import categoryRouter from "./category/category-router";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from server" });
});

app.use(express.json());

app.use("/categories", categoryRouter);
app.use(globalErrorHandler);

export default app;
