import CategoryModel from "./category-model";
import { Category } from "./category-types";
import categoryModel from "./category-model";

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CategoryModel(category);

        return newCategory.save();
    }

    async update(id: string, category: Category) {
        const updateCategory = await CategoryModel.findByIdAndUpdate(
            id,
            category,
            { returnDocument: "after" },
        );
        return updateCategory;
    }
    async delete(id: string) {
        const deleteCategory = await CategoryModel.findByIdAndDelete(id);
        return deleteCategory;
    }
    async getAll() {
        return await CategoryModel.find();
    }
    async get(id: string) {
        return await categoryModel.findById(id);
    }
}
