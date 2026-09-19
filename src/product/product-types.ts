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
    _id?: mongoose.Types.ObjectId;
}

export interface Filter {
    tenantId: string;
    isPublish: boolean;
    categoryId: mongoose.Types.ObjectId;
}

export interface PageQuery {
    page: number;
    limit: number;
}
