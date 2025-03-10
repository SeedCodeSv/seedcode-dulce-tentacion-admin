import { CategoryProduct } from "../../../types/categories.types";

export interface MobileViewProps {
    deletePopover: ({ category }: { category: CategoryProduct }) => JSX.Element;
    handleEdit: (category: CategoryProduct) => void;
    actions: string[];
    handleActive: (id: number) => void;
}

export interface GridProps {
    category: CategoryProduct,
    layout: "grid" | "list",
    deletePopover: ({ category }: { category: CategoryProduct }) => JSX.Element,
    handleEdit: (category: CategoryProduct) => void,
    actions: string[],
    handleActive: (id: number) => void
}

export interface IPropsSearchCategoryProduct {
     nameCategoryProduct: (name : string ) => void
}