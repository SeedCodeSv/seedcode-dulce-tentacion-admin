import { ISubCategory } from '../../../types/sub_categories.types';

export interface MobileViewProps {
  layout: 'grid' | 'list';
  // deletePopover: ({ subCategory }: { subCategory: ISubCategory }) => JSX.Element;
  deletePopover: ({ subcategory }: { subcategory: ISubCategory }) => JSX.Element;
  handleEdit: (subcategory: ISubCategory) => void;
  actions: string[];
  handleActive: (id: number) => void;
}

export interface GridProps extends MobileViewProps {
  subcategory: ISubCategory;
}

export interface IPropsSearchSubCategoryProduct {
  nameSubCategoryProduct: (name: string) => void;
}
