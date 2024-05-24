import { IExpense } from "../../../types/expenses.types";

export interface IMobileView {
    layout: 'grid' | 'list';
    deletePopover: ({ expenses }: { expenses: IExpense }) => JSX.Element;
    handleEdit: (expenses: IExpense) => void;
}

export interface GridProps extends IMobileView {
    expenses: IExpense;
}