import { IExpense } from "../../../types/expenses.types";

export interface IMobileView {
    layout: 'grid' | 'list';
    deletePopover: ({ expenses }: { expenses: IExpense }) => JSX.Element;
    handleDescription: (expenses: IExpense) => void;
    handlePdf: (expenses: IExpense) => void;
    handleImg: (expenses: IExpense) => void;
}

export interface GridProps extends IMobileView {
    expenses: IExpense;
}