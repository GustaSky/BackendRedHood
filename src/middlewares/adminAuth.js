const adminAuth = (req, res, next) => {
    if (!req.user || !req.user.admin) {
        return res.status(403).json({ 
            error: 'Acesso negado. Apenas administradores podem acessar este recurso.' 
        });
    }
    next();
};

module.exports = adminAuth; 