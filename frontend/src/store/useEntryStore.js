import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';

export const useEntryStore = create((set, get) => ({
    entries: { recurring: [], onetime: [] },

    getAllEntries: async () => {
        try {
            const res = await axiosInstance.get("/entries/me");
            set({ entries: res.data });
        } catch (error) {
            console.log("Error in getAllEntries:", error);
            set({ entries: { recurring: [], onetime: [] } });
        }
    },

    createEntry: () => {

    },

    deleteEntry: async (entry_id) => {
        try {
            await axiosInstance.delete(`/entries/${entry_id}`);
            const { entries } = get();
            set({
                entries: {
                    recurring: entries.recurring.filter(e => e.entry_id !== entry_id),
                    onetime: entries.onetime.filter(e => e.entry_id !== entry_id),
                }
            });
            toast.success('Delete successful')
        } catch (error) {
            console.log("Error in deleteEntry:", error);
            throw error;
        }
    }
}))
