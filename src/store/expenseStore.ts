import { create } from 'zustand';
import api from '@/services/api';
import { Expense, ExpenseFormData, ExpensesState } from '@/types/expense';
import useAuthStore from './authStore';
import { useReducer } from 'react';

const useExpensesStore = create<ExpensesState>((set, get) => ({
  expenses: [],
  isLoading: false,
  error: null,
  fetchExpenses: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      
      const response = await api.get(`/expenses?userId=${user.id}`);

      const expenses = response.data;
      
      set({ 
        expenses,
        isLoading: false 
      });
      
      return expenses;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        expenses:[]
       
      });
      return [];
    }
  },
  
  fetchExpenseById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await api.get(`/expenses/${id}`);
      set({ isLoading: false });
      
      return response.data;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || `Failed to fetch expense with ID: ${id}` 
      });
      return null;
    }
  },
  
  addExpense: async (data: ExpenseFormData) => {
    try {
      set({ isLoading: true, error: null });
      
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Validate input
      if (!data.amount || isNaN(parseFloat(data.amount))) {
        throw new Error('Please enter a valid amount');
      }
      
      if (!data.category) {
        throw new Error('Please select a category');
      }
      if(parseFloat(data.amount) <= 0){
        throw new Error('Amount should be positive');
      }
      
      if (!data.description) {
        throw new Error('Please enter a description');
      }
      
      if (!data.date) {
        throw new Error('Please select a date');
      }
      
      const newExpense = {
        userId: user.id,
        amount: parseFloat(data.amount),
        category: data.category,
        description: data.description,
        date: data.date,
      };
      
      const response = await api.post('/expenses', newExpense);
      
      // Update the expenses list
      const expenses = [...get().expenses, response.data];
      set({ expenses, isLoading: false });
      
      return response.data;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to add expense' 
      });
      return null;
    }
  },
  
  deleteExpense: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await api.delete(`/expenses/${id}`);
      const expenses = get().expenses.filter(expense => expense.id !== id);
      set({ expenses, isLoading: false });
      
      return true;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || `Failed to delete expense with ID: ${id}` 
      });
      return false;
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

export default useExpensesStore;