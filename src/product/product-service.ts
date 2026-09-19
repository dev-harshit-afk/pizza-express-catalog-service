import productModel from "./product-model";
import { Product } from "./product-types";

export class ProductService {
    async create(product: Product) {
        // eslint-disable-next-line
        return await productModel.create(product as any);
    }

    async getProductImage(productId: string) {
        const product = await productModel.findById(productId);
        return product?.image;
    }
    async updateProduct(productId: string, product: Product) {
        return productModel.findOneAndUpdate({ _id: productId }, product);
    }
}
