import React, { useState } from 'react';

function ResetPassword() {
    const [step, setStep] = useState(1); // 1: verificar PIN, 2: nova senha
    const [formData, setFormData] = useState({
        email: '',
        pin: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [verifiedCredentials, setVerifiedCredentials] = useState(null);

    const handleVerifyPin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://redhood-api-production.up.railway.app/api/users/verify-pin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    pin: formData.pin
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Email ou PIN inválidos');
            }

            // Se a verificação for bem-sucedida, guarda as credenciais e avança
            setVerifiedCredentials({
                email: formData.email,
                pin: formData.pin
            });
            setStep(2);
            setError('');
        } catch (error) {
            console.error('Erro:', error);
            setError(error.message || 'Erro ao verificar credenciais');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            if (formData.newPassword !== formData.confirmPassword) {
                setError('As senhas não coincidem');
                return;
            }

            const response = await fetch('https://redhood-api-production.up.railway.app/api/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: verifiedCredentials.email,
                    pin: verifiedCredentials.pin,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao redefinir senha');
            }

            alert(`Senha atualizada com sucesso! Seu novo PIN é: ${data.newPin}`);
            window.location.href = '/login';
        } catch (error) {
            console.error('Erro:', error);
            setError(error.message || 'Erro ao redefinir senha');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    return (
        <div className="reset-password">
            <h2>Redefinir Senha</h2>
            {error && <div className="error">{error}</div>}
            
            {step === 1 ? (
                <form onSubmit={handleVerifyPin}>
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
                    <button type="submit">Verificar Credenciais</button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <p>Digite sua nova senha para o email: {verifiedCredentials?.email}</p>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Nova Senha"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirme a Nova Senha"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />
                    <button type="submit">Redefinir Senha</button>
                </form>
            )}
        </div>
    );
}

export default ResetPassword; 