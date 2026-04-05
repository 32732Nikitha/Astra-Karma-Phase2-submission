import api from './axiosInstance'

export const workerApi = {
  register: (data) =>
    api.post('/workers/register', data),

  getMe: () =>
    api.get('/workers/me'),

  updateMe: (data) =>
    api.patch('/workers/me', data),

  getRiskScore: () =>
    api.get('/workers/me/risk-score'),
}