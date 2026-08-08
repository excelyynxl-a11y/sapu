import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';

function toCents(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return num;
    return Math.round(num * 100) / 100;
}

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

    createEntry: async (entryData) => {
        try {
            const isRecurring = entryData.entry_type === 'recurring';
            const endpoint = isRecurring ? '/entries/recurring' : '/entries/onetime';

            const payload = isRecurring
                ? {
                    name: entryData.name,
                    amount: toCents(entryData.amount),
                    cycle: entryData.cycle,
                    start_date: entryData.start_date,
                    direction: entryData.direction,
                    custom_days: entryData.cycle === 'custom' ? Number(entryData.custom_days) : undefined,
                }
                : {
                    name: entryData.name,
                    amount: toCents(entryData.amount),
                    date: entryData.date,
                    direction: entryData.direction,
                };

            await axiosInstance.post(endpoint, payload);
            toast.success('Added successfully');
            await get().getAllEntries();
        } catch (error) {
            console.log("Error in createEntry:", error);
            throw error;
        }
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
