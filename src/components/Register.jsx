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
            // Validações no frontend
            if (!formData.nome || !formData.email || !formData.senha || !formData.data_nascimento) {
                alert('Por favor, preencha todos os campos');
                return;
            }

            console.log('Enviando dados:', {
                ...formData,
                senha: '***' // Não loga a senha
            });

            const response = await fetch('https://redhood-api-production.up.railway.app/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Resposta do servidor:', data);

            if (response.status === 400 && data.error === 'email_exists') {
                alert('Este email já está cadastrado');
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || 'Erro no cadastro');
            }

            if (data.pin) {
                alert(`Cadastro realizado com sucesso! Seu PIN é: ${data.pin}`);
                // Limpa o formulário
                setFormData({
                    nome: '',
                    email: '',
                    senha: '',
                    data_nascimento: ''
                });
            }
        } catch (error) {
            console.error('Erro completo:', error);
            alert(error.message || 'Erro ao fazer cadastro. Tente novamente.');
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
                value={formData.nome}
                onChange={handleChange}
                required
            />
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
                minLength="6"
            />
            <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                required
            />
            <button type="submit">Cadastrar</button>
        </form>
    );
}

export default Register; 