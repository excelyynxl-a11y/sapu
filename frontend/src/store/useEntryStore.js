import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useEntryStore = create((set, get) => ({
    entries: [],
    
    getAllEntries: () => {

    },

    createEntry: () => {

    },

    deleteEntry: () => {
        
    }
}))