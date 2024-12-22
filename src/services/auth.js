import api from './api';

export const authService = {
    // Registro de usuário
    async register(userData) {
        try {
            const response = await api.post('/users/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Login
    async login(credentials) {
        try {
            const response = await api.post('/users/login', credentials);
            const { token, user } = response.data;
            
            // Salva o token e dados do usuário
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Verifica se está autenticado
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    // Obtém usuário atual
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}; 