import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Category name is required")
        .isString()
        .withMessage("Category name should be name"),
    body("description").exists().withMessage("Description is required"),
    body("priceConfiguration")
        .exists()
        .withMessage("Price configuration is required"),
    body("attributes").exists().withMessage("attributes fields are required"),
    body("tenantId").exists().withMessage("Tenant id field is required"),
    body("categoryId").exists().withMessage("Category id field is required"),
];
