import mongoose from "mongoose";

export interface Attribute {
    name: string;
    value: string;
}

export interface Product {
    name: string;
    description: string;
    priceConfiguration: string;
    attributes: Attribute[];
    tenantId: string;
    categoryId: string;
    image: string;
    isPublished: boolean;
}

export interface Filter {
    tenantId: string;
    isPublish: boolean;
    categoryId: mongoose.Types.ObjectId;
}
