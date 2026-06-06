import { create } from 'zustand';

const useStore = create((set) => ({
    // State Variables
    user: null,
    coins: 0,
    retentionScore: 100,
    mysteryBoxes: 0,

    // Actions (Functions to update state)
    setUser: (user) => set({ user }),
    setCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
    setRetentionScore: (score) => set({ retentionScore: score }),
    addMysteryBox: () => set((state) => ({ mysteryBoxes: state.mysteryBoxes + 1 })),
    
    // Clear state on logout
    logout: () => set({ user: null, coins: 0, retentionScore: 100, mysteryBoxes: 0 }),
}));

export default useStore;