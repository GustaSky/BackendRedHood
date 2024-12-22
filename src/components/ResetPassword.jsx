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

    const handleVerifyPin = async (e) => {
        e.preventDefault();
        try {
            console.log('Verificando PIN:', {
                email: formData.email,
                pin: formData.pin
            });

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
            console.log('Resposta verificação:', data);

            if (!response.ok) {
                throw new Error(data.message || 'PIN inválido');
            }

            // Se o PIN estiver correto, avança para o próximo passo
            setStep(2);
            setError('');
        } catch (error) {
            console.error('Erro:', error);
            setError(error.message || 'Erro ao verificar PIN');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            if (formData.newPassword !== formData.confirmPassword) {
                setError('As senhas não coincidem');
                return;
            }

            console.log('Redefinindo senha:', {
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
            console.log('Resposta reset:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao redefinir senha');
            }

            alert('Senha atualizada com sucesso!');
            // Redireciona para o login
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
        setError(''); // Limpa erro ao digitar
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
                    <button type="submit">Verificar PIN</button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword}>
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