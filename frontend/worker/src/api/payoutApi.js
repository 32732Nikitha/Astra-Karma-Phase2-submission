import api from './axiosInstance'

export const payoutApi = {
  getHistory: (params) =>
    api.get('/payouts/', { params }),

  getSummary: () =>
    api.get('/payouts/summary'),

  exportCsv: () =>
    api.get('/payouts/export', { responseType: 'blob' }),
}