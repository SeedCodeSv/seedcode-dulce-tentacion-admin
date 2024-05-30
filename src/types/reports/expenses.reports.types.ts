export interface ExpenseByBranch {
  branch: string;
  total: number;
}

export interface IResponseDataExpensesGrafic {
  ok: boolean;
  data: IDataExpensesGrafic[];
}

export interface IDataExpensesGrafic {
  branch: string;
  totalExpenses: string;
}

export interface IGetExpensesByBranch {
  ok: boolean;
  expenses: ExpenseByBranch[];
}

export interface IGetExpensesByDay {
  ok: boolean;
  expenses: number;
}
