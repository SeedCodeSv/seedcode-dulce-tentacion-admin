import { SubCategory } from "../../types/sub-category.types";

export interface ISubCategoryStore{
    subcategories: SubCategory[];
    getSubcategories: (id:number) => void;
}