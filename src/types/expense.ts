export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  expenseTitle: string;
  date: string;
  createdAt: string;
}

export interface ExpenseFormData {
  amount: string;
  category: string;
  description: string;
  expenseTitle: string;
  userId: string;
  date: string;
}

export interface ExpensesState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  fetchExpenseById: (id: string) => Promise<Expense | null>;
  addExpense: (data: ExpenseFormData) => Promise<Expense | null>;
  deleteExpense: (id: string) => Promise<boolean>;
  clearError: () => void;
}