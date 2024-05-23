export interface ExpenseByBranch {
  branch: string;
  total: number;
}

export interface IGetExpensesByBranch {
  ok: boolean;
  expenses: ExpenseByBranch[];
}

export interface IGetExpensesByDay {
  ok: boolean;
  expenses: number;
}
