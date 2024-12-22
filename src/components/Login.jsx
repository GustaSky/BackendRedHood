import React, { useState } from 'react';
import { authService } from '../services/auth';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        senha: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const loginData = {
                email: formData.email,
                senha: formData.senha
            };

            console.log('Tentando login com:', { email: loginData.email, senha: '***' });

            const response = await fetch('https://redhood-api-production.up.railway.app/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();
            console.log('Resposta do login:', data);

            if (response.status === 404) {
                alert('Usuário não encontrado');
                return;
            }

            if (response.status === 401) {
                alert('Senha incorreta');
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login');
            }

            // Login bem sucedido
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('Login realizado com sucesso!');
                // Limpa o formulário
                setFormData({
                    email: '',
                    senha: ''
                });
                // Redireciona ou atualiza o estado da aplicação
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Erro ao fazer login. Por favor, tente novamente.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
                required
            />
            <button type="submit">Entrar</button>
        </form>
    );
}

export default Login; 