import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';
import { router } from 'expo-router';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Mock users for demo purposes
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    phone: '555-123-4567'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = mockUsers.find(u => u.email === email);
          
          if (!user || user.password !== password) {
            throw new Error("Invalid email or password");
          }
          
          const { password: _, ...userWithoutPassword } = user;
          
          set({
            user: userWithoutPassword as User,
            isAuthenticated: true,
            isLoading: false
          });
          
          // Redirect to home page after successful login
          router.replace('/');
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false
          });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user already exists
          if (mockUsers.some(u => u.email === email)) {
            throw new Error("Email already in use");
          }
          
          // In a real app, you would send this to your backend
          const newUser = {
            id: String(mockUsers.length + 1),
            email,
            name,
            password,
            phone: '' // Add default empty phone to satisfy the type
          };
          
          // Add to mock users (for demo only)
          mockUsers.push(newUser);
          
          const { password: _, ...userWithoutPassword } = newUser;
          
          set({
            user: userWithoutPassword as User,
            isAuthenticated: true,
            isLoading: false
          });
          
          // Redirect to home page after successful registration
          router.replace('/');
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        });
        
        // Redirect to login page after logout
        router.replace('/');
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);