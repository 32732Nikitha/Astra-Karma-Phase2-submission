import api from './axiosInstance'

export const policyApi = {
  create: (data) =>
    api.post('/policies/', data),

  getActive: () =>
    api.get('/policies/active'),

  getAll: () =>
    api.get('/policies/'),

  renew: (policyId) =>
    api.post('/policies/renew', { policy_id: policyId }),

  upgrade: (policyId, planTier) =>
    api.post('/policies/upgrade', { policy_id: policyId, plan_tier: planTier }),

  cancel: (policyId) =>
    api.delete(`/policies/${policyId}/cancel`),

  getCertificate: (policyId) =>
    api.get(`/policies/${policyId}/certificate`, { responseType: 'blob' }),
}