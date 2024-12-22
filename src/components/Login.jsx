import React, { useState } from 'react';
import { authService } from '../services/auth';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login({ email, senha });
            console.log('Login realizado com sucesso:', response);
            // Redirecionar ou atualizar estado da aplicação
            window.location.href = '/dashboard';
        } catch (error) {
            setError(error.error || 'Erro ao fazer login');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Senha:</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
            </div>
            {error && <div style={{color: 'red'}}>{error}</div>}
            <button type="submit">Entrar</button>
        </form>
    );
}

export default Login; 