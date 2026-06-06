import { create } from 'zustand';

const useStore = create((set) => ({
    // State Variables
    user: JSON.parse(localStorage.getItem('user')) || null,
    coins: 0,
    retentionScore: 100,
    challengesDone: 0,
    streak: 0,
    mysteryBoxes: 0,
    skillGraph: { tags: [] },
    hasPendingWarmup: false,

    // Actions (Functions to update state)
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
    setCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
    setRetentionScore: (score) => set({ retentionScore: score }),
    setStats: (stats) => set((state) => ({ 
        challengesDone: stats.challengesDone !== undefined ? stats.challengesDone : state.challengesDone, 
        streak: stats.streak !== undefined ? stats.streak : state.streak, 
        retentionScore: stats.retentionScore !== undefined ? stats.retentionScore : state.retentionScore,
        mysteryBoxes: stats.mysteryBoxes !== undefined ? stats.mysteryBoxes : state.mysteryBoxes
    })),
    addMysteryBox: () => set((state) => ({ mysteryBoxes: state.mysteryBoxes + 1 })),
    setSkillGraph: (skillGraph) => set({ skillGraph }),
    setPendingWarmup: (status) => set({ hasPendingWarmup: status }),
    
    // Clear state on logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, coins: 0, retentionScore: 100, mysteryBoxes: 0, skillGraph: { tags: [] }, hasPendingWarmup: false });
    },
}));

export default useStore;