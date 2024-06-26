import { SubCategory } from "../../types/sub-category.types";
import { IGetSubCategoriesPaginated } from "../../types/sub_categories.types";

export interface ISubCategoryStore{
    subcategories: SubCategory[];
    getSubcategories: (id:number) => void;
}