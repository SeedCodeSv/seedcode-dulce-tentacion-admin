import { BranchPointOfSale } from "@/types/point-of-sales.types";
export interface MobileViewProps {
    layout: 'grid' | 'list';
    deletePopover: ({ category }: { category: BranchPointOfSale }) => JSX.Element;
    handleEdit: (category: BranchPointOfSale) => void;
    actions: string[];
    handleActive: (id: number) => void;
}

export interface GridProps {
    category: BranchPointOfSale,
    layout: "grid" | "list",
    deletePopover: ({ category }: { category: BranchPointOfSale }) => JSX.Element,
    handleEdit: (category: BranchPointOfSale) => void,
    actions: string[],
    handleActive: (id: number) => void
}

export interface IPropsSearchCategoryProduct {
     nameCategoryProduct: (name : string ) => void
}