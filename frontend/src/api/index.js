const API_BASE = 'http://localhost:5000/api';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email, password) => fetchAPI('/auth/login', { method: 'POST', body: { email, password } }),
  register: (data) => fetchAPI('/auth/register', { method: 'POST', body: data }),
  loginAs: (id) => fetchAPI(`/auth/login/${id}`, { method: 'POST' }),

  // Employees
  getEmployees: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchAPI(`/employees?${qs}`);
  },
  getEmployee: (id) => fetchAPI(`/employees/${id}`),
  getLeaveStatus: (id) => fetchAPI(`/employees/${id}/leave-status`),
  createEmployee: (data) => fetchAPI('/employees', { method: 'POST', body: data }),
  updateEmployee: (id, data) => fetchAPI(`/employees/${id}`, { method: 'PUT', body: data }),
  deleteEmployee: (id) => fetchAPI(`/employees/${id}`, { method: 'DELETE' }),

  // Leave Requests
  getLeaves: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchAPI(`/leaves?${qs}`);
  },
  getPendingLeaves: () => fetchAPI('/leaves/pending'),
  getLeaveStats: () => fetchAPI('/leaves/stats'),
  submitLeave: (data) => fetchAPI('/leaves', { method: 'POST', body: data }),
  approveLeave: (id, data) => fetchAPI(`/leaves/${id}/approve`, { method: 'PUT', body: data }),
  rejectLeave: (id, data) => fetchAPI(`/leaves/${id}/reject`, { method: 'PUT', body: data }),
  getLeaveHistory: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchAPI(`/leaves/history?${qs}`);
  },

  // Approvers
  getApprovers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchAPI(`/approvers?${qs}`);
  },
  createApprover: (data) => fetchAPI('/approvers', { method: 'POST', body: data }),
  updateApprover: (id, data) => fetchAPI(`/approvers/${id}`, { method: 'PUT', body: data }),
  deleteApprover: (id) => fetchAPI(`/approvers/${id}`, { method: 'DELETE' }),

  // Criteria
  getCriteria: () => fetchAPI('/criteria'),
  createCriteria: (data) => fetchAPI('/criteria', { method: 'POST', body: data }),
  updateCriteria: (id, data) => fetchAPI(`/criteria/${id}`, { method: 'PUT', body: data }),
  deleteCriteria: (id) => fetchAPI(`/criteria/${id}`, { method: 'DELETE' }),

  // SPK
  getAlternatives: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchAPI(`/spk/alternatives?${qs}`);
  },
  getMatrix: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchAPI(`/spk/matrix?${qs}`);
  },
  getRanking: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchAPI(`/spk/ranking?${qs}`);
  },
};

export default api;
