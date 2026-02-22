const API_BASE = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic fetch with error handling
const apiFetch = async (url, options = {}) => {
  try {
    const token = getAuthHeader();

    const isFormData = options.body instanceof FormData;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Notifications API
export const notificationsAPI = {
  // Public endpoints
  getAll: () => apiFetch(`${API_BASE}/notifications`),
  getById: (id) => apiFetch(`${API_BASE}/notifications/${id}`),
  
  // Admin endpoints (with auth)
  getAdminAll: () => apiFetch(`${API_BASE}/notifications/admin/all`, {
    headers: getAuthHeader()
  }),
  create: (data) => apiFetch(`${API_BASE}/notifications`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: getAuthHeader()
  }),
  update: (id, data) => apiFetch(`${API_BASE}/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: getAuthHeader()
  }),
  delete: (id) => apiFetch(`${API_BASE}/notifications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  }),
  permanentDelete: (id) => apiFetch(`${API_BASE}/notifications/${id}/permanent`, {
    method: 'DELETE',
    headers: getAuthHeader()
  })
};

// Events API
export const eventsAPI = {
  getAll: () => apiFetch(`${API_BASE}/events`),
  getAdminAll: () => apiFetch(`${API_BASE}/events/admin/all`),
  getById: (id) => apiFetch(`${API_BASE}/events/${id}`),
  create: (formData) => {
    return fetch(`${API_BASE}/events/admin`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    }).then(res => res.json());
  },
  update: (id, formData) => {
    return fetch(`${API_BASE}/events/admin/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: formData
    }).then(res => res.json());
  },
  delete: (id) => apiFetch(`${API_BASE}/events/admin/${id}`, {
    method: 'DELETE'
  })
};

// Gallery API
export const galleryAPI = {
  getAll: () => apiFetch(`${API_BASE}/gallery`),
  getAdminAll: () => apiFetch(`${API_BASE}/gallery/admin/all`),
  getById: (id) => apiFetch(`${API_BASE}/gallery/${id}`),
  upload: (formData) => {
    return fetch(`${API_BASE}/gallery/admin`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    }).then(res => res.json());
  },
  update: (id, data) => apiFetch(`${API_BASE}/gallery/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiFetch(`${API_BASE}/gallery/admin/${id}`, {
    method: 'DELETE'
  }),
  archive: (daysOld = 90) => apiFetch(`${API_BASE}/gallery/admin/archive`, {
    method: 'POST',
    body: JSON.stringify({ daysOld })
  }),
  restore: (id) => apiFetch(`${API_BASE}/gallery/admin/${id}/restore`, {
    method: 'POST'
  })
};

// PDFs API
export const pdfsAPI = {
  getAll: () => apiFetch(`${API_BASE}/pdfs`),
  getAdminAll: () => apiFetch(`${API_BASE}/pdfs/admin/all`),
  getById: (id) => apiFetch(`${API_BASE}/pdfs/${id}`),
  upload: (formData) => {
    return fetch(`${API_BASE}/pdfs/admin`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    }).then(res => res.json());
  },
  update: (id, data) => apiFetch(`${API_BASE}/pdfs/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiFetch(`${API_BASE}/pdfs/admin/${id}`, {
    method: 'DELETE'
  })
};

// Stats API
export const statsAPI = {
  getStorage: () => apiFetch(`${API_BASE}/stats/storage`)
};