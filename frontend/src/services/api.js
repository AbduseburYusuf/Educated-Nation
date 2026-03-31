import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

const personsAPI = {
  getAll: () => api.get('/persons'),
  create: (data) => api.post('/persons', data),
  getById: (id) => api.get(`/persons/${id}`),
  update: (id, data) => api.put(`/persons/${id}`, data),
  delete: (id) => api.delete(`/persons/${id}`),
  myProfile: () => api.get('/persons/my-profile'),
};

const woredasAPI = {
  getAll: () => api.get('/woredas'),
  create: (data) => api.post('/woredas', data),
};

const villagesAPI = {
  getAll: () => api.get('/villages'),
};

const studentsAPI = {
  getAll: () => api.get('/students'),
  create: (data) => api.post('/students', data),
  update: (person_id, data) => api.put(`/students/${person_id}`, data),
};

const workersAPI = {
  getAll: () => api.get('/workers'),
  create: (data) => api.post('/workers', data),
  update: (person_id, data) => api.put(`/workers/${person_id}`, data),
};

const unemployedAPI = {
  getAll: () => api.get('/unemployed'),
  create: (data) => api.post('/unemployed', data),
  update: (person_id, data) => api.put(`/unemployed/${person_id}`, data),
};

const professionsAPI = {
  getAll: () => api.get('/professions'),
};

const educationLevelsAPI = {
  getAll: () => api.get('/education-levels'),
};

const organizationsAPI = {
  getAll: () => api.get('/organizations'),
};

const reportsAPI = {
  stats: () => api.get('/reports/stats'),
  diplomaPerWoreda: () => api.get('/reports/diploma-per-woreda'),
  degreePerWoreda: () => api.get('/reports/degree-per-woreda'),
  profession: () => api.get('/reports/profession'),
  studentsLevel: (level) => api.get(`/reports/students/${level}`),
  educatedPerWoreda: () => api.get('/reports/educated-per-woreda'),
  educatedPerVillage: () => api.get('/reports/educated-per-village'),
};

const adminAPI = {
  users: {
    getAll: () => api.get('/admin/users'),
    create: (data) => api.post('/admin/users', data),
    toggleRole: (id) => api.patch(`/admin/users/${id}/role`),
    delete: (id) => api.delete(`/admin/users/${id}`),
  },
  woredas: {
    getAll: () => api.get('/admin/woredas'),
    create: (data) => api.post('/admin/woredas', data),
    update: (id, data) => api.put(`/admin/woredas/${id}`, data),
    delete: (id) => api.delete(`/admin/woredas/${id}`),
  },
  villages: {
    getAll: (params) => api.get('/admin/villages', { params }),
    create: (data) => api.post('/admin/villages', data),
    update: (id, data) => api.put(`/admin/villages/${id}`, data),
    delete: (id) => api.delete(`/admin/villages/${id}`),
  },
  professions: {
    getAll: () => api.get('/admin/professions'),
    create: (data) => api.post('/admin/professions', data),
    update: (id, data) => api.put(`/admin/professions/${id}`, data),
    delete: (id) => api.delete(`/admin/professions/${id}`),
  },
  organizations: {
    getAll: () => api.get('/admin/organizations'),
    create: (data) => api.post('/admin/organizations', data),
    update: (id, data) => api.put(`/admin/organizations/${id}`, data),
    delete: (id) => api.delete(`/admin/organizations/${id}`),
  },
  persons: {
    approve: (id) => api.patch(`/persons/${id}/approve`),
    reject: (id) => api.patch(`/persons/${id}/reject`),
    getAll: (params) => api.get('/persons', { params }),
  },
};

const exportAPI = {
  persons: () => api.get('/export/persons', { responseType: 'blob' }),
  students: () => api.get('/export/students', { responseType: 'blob' }),
  workers: () => api.get('/export/workers', { responseType: 'blob' }),
};

// Interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthAttempt = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

      if (isAuthAttempt) {
        return Promise.reject(error);
      }

      localStorage.removeItem('token');
      const currentPath = window.location.pathname || '/';
      const redirectPath = currentPath.startsWith('/admin') ? '/admin/login' : '/login';
      window.location.href = redirectPath;
    }
    return Promise.reject(error);
  }
);

export {
  authAPI,
  personsAPI,
  woredasAPI,
  villagesAPI,
  studentsAPI,
  workersAPI,
  unemployedAPI,
  professionsAPI,
  educationLevelsAPI,
  organizationsAPI,
  reportsAPI,
  adminAPI,
  exportAPI,
};

export default api;
