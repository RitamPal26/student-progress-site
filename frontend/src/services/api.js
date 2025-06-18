import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const studentAPI = {
  getAll: () => axios.get(`${API_BASE}/students`),
  create: (data) => axios.post(`${API_BASE}/students`, data),
  update: (id, data) => axios.put(`${API_BASE}/students/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/students/${id}`),
  sync: (id) => axios.post(`${API_BASE}/students/${id}/sync`)
};

export const dataAPI = {
  getContests: (studentId, range = 90) => 
    axios.get(`${API_BASE}/data/contests?studentId=${studentId}&range=${range}`),
  getSubmissions: (studentId, after) => 
    axios.get(`${API_BASE}/data/submissions?studentId=${studentId}&after=${after}`)
};

export const summaryAPI = {
  getProblems: (id, range = 30) =>
    axios.get(`${API_BASE}/summary/problems?studentId=${id}&range=${range}`)
};
