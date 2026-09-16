import CategoryModel from "./category-model";
import { Category } from "./category-types";
import categoryModel from "./category-model";

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CategoryModel(category);

        return newCategory.save();
    }

    async update(id:number,category:Category){
        const updateCategory=await CategoryModel.findByIdAndUpdate(id,category,{returnDocument:"after"});
        return updateCategory
    }
     async delete(id:number){
        const deleteCategory=await CategoryModel.findByIdAndDelete(id);
        return deleteCategory;
    }
    async getAll(){
        return await CategoryModel.find();
    }
    async get(id:number){
        return await categoryModel.findById(id);
    }
}
