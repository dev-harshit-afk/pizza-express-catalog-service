import { paginationLabels } from "../config/pagination";
import productModel from "./product-model";
import { Filter, PageQuery, Product } from "./product-types";

export class ProductService {
    async create(product: Product) {
        // eslint-disable-next-line
        return await productModel.create(product as any);
    }

    async getProductImage(productId: string) {
        const product: Product | null = await productModel.findById(productId);
        return product?.image;
    }
    async updateProduct(productId: string, product: Product) {
        return productModel.findOneAndUpdate({ _id: productId }, product);
    }
    async getProduct(productId: string) {
        const product: Product | null = await productModel.findById(productId);
        return product;
    }

    async getProducts(q: string, filter: Filter, pageQuery: PageQuery) {
        const searchQueryRegex = new RegExp(q, "i");

        const matchQuery = {
            ...filter,
            name: searchQueryRegex,
        };

        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                _id: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
        ]);

        return productModel.aggregatePaginate(aggregate, {
            page: pageQuery.page,
            limit: pageQuery.limit,
            customLabels: paginationLabels,
        });
    }
}
