import { create } from 'zustand'

export const usePolicyStore = create((set) => ({
  activePolicy: null,
  policies: [],
  loading: false,
  error: null,

  setActivePolicy: (policy) => set({ activePolicy: policy }),
  setPolicies: (policies) => set({ policies }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clearPolicy: () => set({ activePolicy: null, policies: [] }),
}))