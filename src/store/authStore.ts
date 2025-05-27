import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/auth";
import { AxiosError } from "axios";

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          // Validate credentials
          if (!credentials.username || !credentials.password) {
            set({ isLoading: false, error: "Email and password are required" });
            return;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(credentials.username)) {
            set({
              isLoading: false,
              error: "Please enter a valid email address",
            });
            return;
          }

          // Attempt to find user
          const response = await api.get(
            `/users?username=${credentials.username}`
          );

          if (!response.data || response.data.length === 0) {
            set({ isLoading: false, error: "Invalid email or password" });
            throw new Error("Invalid email or password");
          }

          const user = response.data[0];
           console.log(user)

          // Compare passwords (in a real app, use proper password hashing)
          if (credentials.password != user.password) {
            set({ isLoading: false, error: "Invalid email or password" });
            throw new Error("Invalid email or password");
          }

          // Login successful
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return user;
        } catch (error) {
          // Handle API errors
          if (error instanceof AxiosError) {
            set({
              isLoading: false,
              error:
                error.response?.status === 404
                  ? "Invalid email or password"
                  : "Login failed. Please try again.",
            });
          } else {
            set({
              isLoading: false,
              error: "An unexpected error occurred. Please try again.",
            });
          }
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
      },

      clearError: () => {
        
        set({ error: null,isLoading:false });
      },

      register: async (credentials: RegisterCredentials) => {
        try {
          // Reset state and start loading
          set({ isLoading: true, error: null });

          // Validate required fields
          if (!credentials.username || !credentials.password) {
            set({ isLoading: false, error: "All fields are required" });
            return;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(credentials.username)) {
            set({
              isLoading: false,
              error: "Please enter a valid email address",
            });
            return;
          }

          // Check if user already exists
          const response = await api.get(
            `/users?username=${credentials.username}`
          );
          if (response.data && response.data.length > 0) {
            set({ isLoading: false, error: "User already exists" });
            return;
          }

          // Create new user
          const newUser: User = {
            id: Date.now().toString(),
            username: credentials.username,
            password: credentials.password, // In a real app, hash the password
            createdAt: new Date().toISOString(),
          };

          await api.post("/users", newUser);

          // Auto login after registration
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({
              isLoading: false,
              error:
                error.response?.data?.message ||
                "Registration failed. Please try again.",
            });
          } else {
            set({
              isLoading: false,
              error: "An unexpected error occurred. Please try again.",
            });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
