import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response);
        return Promise.reject(error);
    }
);

// Goal endpoints
api.getGoals = (query = '') => api.get(`/api/goals${query}`);
api.createGoal = (goalData) => api.post('/api/goals', goalData);
api.updateGoal = (goalId, goalData) => api.put(`/api/goals/${goalId}`, goalData);
api.deleteGoal = (goalId) => api.delete(`/api/goals/${goalId}`);
api.updateGoalProgress = (goalId, progress) => api.put(`/api/goals/${goalId}/progress`, { progress });
api.addMilestone = (goalId, milestone) => api.post(`/api/goals/${goalId}/milestones`, milestone);
api.updateMilestone = (goalId, milestoneId, data) => api.put(`/api/goals/${goalId}/milestones/${milestoneId}`, data);

export default api;
