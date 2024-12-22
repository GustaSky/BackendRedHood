const connection = require('../database/connection');

const adminController = {
    // Listar todos os usuários
    async listUsers(req, res) {
        try {
            const [users] = await connection.execute(
                'SELECT id, nome, email, admin, created_at FROM usuarios'
            );
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar usuários' });
        }
    },

    // Tornar usuário admin
    async makeAdmin(req, res) {
        try {
            const { userId } = req.params;
            
            await connection.execute(
                'UPDATE usuarios SET admin = 1 WHERE id = ?',
                [userId]
            );

            res.json({ message: 'Usuário promovido a administrador' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao promover usuário' });
        }
    },

    // Remover privilégios de admin
    async removeAdmin(req, res) {
        try {
            const { userId } = req.params;
            
            await connection.execute(
                'UPDATE usuarios SET admin = 0 WHERE id = ?',
                [userId]
            );

            res.json({ message: 'Privilégios de administrador removidos' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover privilégios' });
        }
    }
};

module.exports = adminController; 