import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';

function Menu() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleLoginClick = () => {
        setShowLogin(true);
        setShowRegister(false);
        setShowResetPassword(false);
        setShowOptions(false);
    };

    const handleRegisterClick = () => {
        setShowLogin(false);
        setShowRegister(true);
        setShowResetPassword(false);
        setShowOptions(false);
    };

    const handleResetPasswordClick = () => {
        setShowLogin(false);
        setShowRegister(false);
        setShowResetPassword(true);
        setShowOptions(false);
    };

    return (
        <>
            {/* Menu de usuário */}
            <div className="user-container" onClick={toggleOptions}>
                <i className="icone fa-solid fa-user"></i>
                <span className="user-text">
                    Faça seu login<br />ou se cadastre aqui!
                </span>
                {showOptions && (
                    <div className="login-options">
                        <div className="option" onClick={handleLoginClick}>
                            <i className="fa-solid fa-right-to-bracket"></i>
                            <span>Fazer Login</span>
                        </div>
                        <div className="option" onClick={handleRegisterClick}>
                            <i className="fa-solid fa-user-plus"></i>
                            <span>Cadastrar-se</span>
                        </div>
                        <div className="option logout-option" style={{ display: 'none' }}>
                            <i className="fa-solid fa-sign-out-alt"></i>
                            <span>Sair</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Modais */}
            {showLogin && (
                <div className="modal">
                    <Login />
                    <button onClick={handleResetPasswordClick}>
                        Esqueci minha senha
                    </button>
                </div>
            )}

            {showRegister && (
                <div className="modal">
                    <Register />
                </div>
            )}

            {showResetPassword && (
                <div className="modal">
                    <ResetPassword />
                </div>
            )}
        </>
    );
}

export default Menu; 