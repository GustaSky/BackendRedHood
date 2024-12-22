import React, { useState } from 'react';

function Register() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        data_nascimento: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://redhood-api-production.up.railway.app/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.pin) {
                alert(`Cadastro realizado com sucesso! Seu PIN é: ${data.pin}`);
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert('Erro ao fazer cadastro');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="nome"
                placeholder="Nome"
                onChange={handleChange}
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
            />
            <input
                type="password"
                name="senha"
                placeholder="Senha"
                onChange={handleChange}
            />
            <input
                type="date"
                name="data_nascimento"
                onChange={handleChange}
            />
            <button type="submit">Cadastrar</button>
        </form>
    );
}

export default Register; 