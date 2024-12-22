import React, { useState } from 'react';
import { authService } from '../services/auth';

function Register() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        pin: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData);
            // Redirecionar para login após registro
            window.location.href = '/login';
        } catch (error) {
            setError(error.error || 'Erro ao registrar');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nome:</label>
                <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Senha:</label>
                <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>PIN:</label>
                <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    maxLength="6"
                />
            </div>
            {error && <div style={{color: 'red'}}>{error}</div>}
            <button type="submit">Registrar</button>
        </form>
    );
}

export default Register; 