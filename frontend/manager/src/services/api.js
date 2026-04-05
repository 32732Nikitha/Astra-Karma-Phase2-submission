import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dt_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  me:    ()               => api.get("/auth/me"),
};

// ── Incidents ─────────────────────────────────────────────────────────────────
export const incidentsAPI = {
  getAll:       (params) => api.get("/incidents", { params }),
  getById:      (id)     => api.get(`/incidents/${id}`),
  create:       (data)   => api.post("/incidents", data),
  updateStatus: (id, status) => api.patch(`/incidents/${id}/status`, { status }),
  delete:       (id)     => api.delete(`/incidents/${id}`),
};

// ── Payouts ───────────────────────────────────────────────────────────────────
export const payoutsAPI = {
  getAll:       (params) => api.get("/payouts", { params }),
  getById:      (id)     => api.get(`/payouts/${id}`),
  create:       (data)   => api.post("/payouts", data),
  updateStatus: (id, status) => api.patch(`/payouts/${id}/status`, { status }),
};

// ── Deliveries ────────────────────────────────────────────────────────────────
export const deliveriesAPI = {
  getAll:    (params) => api.get("/deliveries", { params }),
  getById:   (id)     => api.get(`/deliveries/${id}`),
  getMine:   ()       => api.get("/deliveries/mine"),
  update:    (id, d)  => api.patch(`/deliveries/${id}`, d),
};

// ── Risk Zones ────────────────────────────────────────────────────────────────
export const riskZonesAPI = {
  getAll:  () => api.get("/risk-zones"),
  getById: (id) => api.get(`/risk-zones/${id}`),
  create:  (data) => api.post("/risk-zones", data),
  update:  (id, data) => api.patch(`/risk-zones/${id}`, data),
  delete:  (id) => api.delete(`/risk-zones/${id}`),
};

// ── Workers ───────────────────────────────────────────────────────────────────
export const workersAPI = {
  getLocations: () => api.get("/workers/locations"),
  updateLocation: (lat, lng) => api.patch("/workers/location", { lat, lng }),
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export const statsAPI = {
  getDashboard: () => api.get("/stats/dashboard"),
};

// ── Proof Upload (multipart) ───────────────────────────────────────────────────
export const uploadProof = (file, deliveryId, gpsCoords) => {
  const form = new FormData();
  form.append("proof", file);
  form.append("deliveryId", deliveryId);
  form.append("gpsLat", gpsCoords.lat);
  form.append("gpsLng", gpsCoords.lng);
  return api.post("/payouts/submit-proof", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default api;
