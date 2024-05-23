import {
  IGetCategoryExpensesPaginated,
  CategoryExpense,
  CategoryExpensePayload,
} from '../../types/categories_expenses.types';
export interface ICategoriesExpensesStore {
  paginated_categories_expenses: IGetCategoryExpensesPaginated;
  list_categories_expenses: CategoryExpense[];

  getListCategoriesExpenses: () => void;
  getPaginatedCategoriesExpenses: (page: number, limit: number, name: string) => void;
  postCategoriesExpenses: (payload: CategoryExpensePayload) => void;
  pathCategoriesExpenses: (id: number, payload: CategoryExpensePayload) => void;
  deleteCategoriesExpenses: (id: number) => Promise<boolean>;
}
