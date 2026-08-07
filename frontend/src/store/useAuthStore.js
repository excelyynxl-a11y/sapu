import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    register: async (data) => {
        try {
            await axiosInstance.post("/auth/register", data);
        } catch (error) {
            throw error.response?.data?.detail || "Registration failed";
        }
    },

    login: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/login", data);
            localStorage.setItem("token", res.data.access_token);
            set({ authUser: res.data });
        } catch (error) {
            throw error.response?.data?.detail || "Login failed";
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (error) {
            console.log("Error in logout:", error);
        } finally {
            localStorage.removeItem("token");
            set({ authUser: null });
        }
    }
}))