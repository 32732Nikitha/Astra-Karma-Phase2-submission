import { create } from 'zustand'

export const useDashboardStore = create((set) => ({
  // Live weather & composite score
  compositeScore: null,
  rainfall: null,
  temperature: null,
  aqi: null,
  trafficIndex: null,
  floodAlert: false,
  lastUpdated: null,

  // Earnings
  todayEarnings: null,
  earningsLoading: false,

  // Payouts
  recentPayouts: [],
  payoutsLoading: false,

  // Connection status
  wsConnected: false,

  setLiveData: (data) =>
    set({
      compositeScore: data.composite_score,
      rainfall: data.rainfall,
      temperature: data.temperature,
      aqi: data.aqi,
      trafficIndex: data.traffic_index,
      floodAlert: data.flood_alert,
      lastUpdated: new Date().toISOString(),
    }),

  setTodayEarnings: (data) => set({ todayEarnings: data }),
  setEarningsLoading: (loading) => set({ earningsLoading: loading }),

  setRecentPayouts: (payouts) => set({ recentPayouts: payouts }),
  setPayoutsLoading: (loading) => set({ payoutsLoading: loading }),

  setWsConnected: (connected) => set({ wsConnected: connected }),
}))