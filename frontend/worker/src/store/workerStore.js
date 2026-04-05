import { create } from 'zustand'

export const useWorkerStore = create((set) => ({
  profile: null,
  riskScore: null,
  riskLoading: false,

  setProfile: (profile) => set({ profile }),
  updateProfile: (partial) =>
    set((state) => ({ profile: { ...state.profile, ...partial } })),

  setRiskScore: (riskScore) => set({ riskScore }),
  setRiskLoading: (riskLoading) => set({ riskLoading }),

  clearWorker: () => set({ profile: null, riskScore: null }),
}))