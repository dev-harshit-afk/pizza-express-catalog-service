import productModel from "./product-model";
import { Product } from "./product-types";

export class ProductService {
    async create(product: Product) {
        // eslint-disable-next-line
        return await productModel.create(product as any);
    }
}
