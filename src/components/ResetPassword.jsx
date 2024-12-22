import React, { useState } from 'react';

function ResetPassword() {
    const [formData, setFormData] = useState({
        email: '',
        pin: '',
        newPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Enviando dados para reset:', {
                email: formData.email,
                pin: formData.pin,
                senhaLength: formData.newPassword?.length
            });

            const response = await fetch('https://redhood-api-production.up.railway.app/api/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    pin: formData.pin,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();
            console.log('Resposta:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao redefinir senha');
            }

            alert('Senha atualizada com sucesso!');
            setFormData({
                email: '',
                pin: '',
                newPassword: ''
            });
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message || 'Erro ao redefinir senha');
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
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="pin"
                placeholder="PIN"
                value={formData.pin}
                onChange={handleChange}
                required
                maxLength="6"
            />
            <input
                type="password"
                name="newPassword"
                placeholder="Nova Senha"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength="6"
            />
            <button type="submit">Redefinir Senha</button>
        </form>
    );
}

export default ResetPassword; 