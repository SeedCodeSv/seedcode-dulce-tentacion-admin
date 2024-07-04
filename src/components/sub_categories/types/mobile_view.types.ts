import { ISubCategory } from "../../../types/sub_categories.types";

export interface MobileViewProps {
    layout: 'grid' | 'list';
    // deletePopover: ({ subCategory }: { subCategory: ISubCategory }) => JSX.Element;
    deletePopover: ({ subcategory } : { subcategory: ISubCategory }) => JSX.Element;
    handleEdit: (subcategory: ISubCategory) => void;
    actions: string[];
    handleActive: (id: number) => void;
}

export interface GridProps extends MobileViewProps {
    subcategory: ISubCategory
}

// export interface GridProps {
//     category: CategoryProduct,
//     layout: "grid" | "list",
//     deletePopover: ({ category }: { category: CategoryProduct }) => JSX.Element,
//     handleEdit: (category: CategoryProduct) => void,
//     actions: string[],
//     handleActive: (id: number) => void
// }