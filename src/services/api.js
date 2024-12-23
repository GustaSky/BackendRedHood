const API_URL = 'https://redhood-api-production.up.railway.app/api';

export const api = {
    async register(userData) {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'no-cors',
            body: JSON.stringify(userData)
        });

        if (response.type === 'opaque') {
            return { success: true };
        }

        return response.json();
    },

    async login(credentials) {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://gustasky.github.io'
            },
            body: JSON.stringify(credentials)
        });
        return response.json();
    },

    async verifyPin(email, pin) {
        const response = await fetch(`${API_URL}/users/verify-pin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pin })
        });
        return response.json();
    },

    async updateProfile(userData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    async resetPassword(email, pin, newPassword) {
        const response = await fetch(`${API_URL}/users/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email, 
                pin, 
                newPassword
            })
        });
        return response.json();
    }
}; 