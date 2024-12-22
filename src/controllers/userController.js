const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../database/connection');

const userController = {
    // Registro de novo usuário
    async register(req, res) {
        try {
            console.log('Iniciando registro...');
            const { nome, email, senha, data_nascimento } = req.body;
            
            // Log dos dados recebidos
            console.log('Dados recebidos:', {
                nome,
                email,
                data_nascimento,
                senhaLength: senha ? senha.length : 0
            });

            // Validações
            if (!nome || !email || !senha || !data_nascimento) {
                return res.status(400).json({
                    error: 'Dados incompletos',
                    message: 'Todos os campos são obrigatórios'
                });
            }

            // Gera PIN
            const pin = Math.floor(100000 + Math.random() * 900000).toString();
            console.log('PIN gerado:', pin);

            // Verifica usuário existente
            console.log('Verificando email existente...');
            const [existingUser] = await connection.execute(
                'SELECT id FROM usuarios WHERE email = ?',
                [email]
            );

            if (existingUser.length) {
                return res.status(400).json({ 
                    error: 'email_exists',
                    message: 'Email já cadastrado' 
                });
            }

            // Hash da senha
            console.log('Gerando hash da senha...');
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Insere usuário
            console.log('Inserindo novo usuário...');
            await connection.execute(
                'INSERT INTO usuarios (nome, email, senha, pin, data_nascimento) VALUES (?, ?, ?, ?, ?)',
                [nome, email, hashedPassword, pin, data_nascimento]
            );

            console.log('Usuário registrado com sucesso!');
            res.status(201).json({ 
                message: 'Usuário cadastrado com sucesso',
                pin: pin
            });
        } catch (error) {
            console.error('Erro detalhado:', error);
            console.error('Stack trace:', error.stack);
            res.status(500).json({ 
                error: 'server_error',
                message: 'Erro interno do servidor',
                details: error.message
            });
        }
    },

    // Login atualizado com mais logs
    async login(req, res) {
        try {
            console.log('Iniciando login...');
            const { email, senha } = req.body;

            console.log('Dados recebidos:', { email, senhaLength: senha?.length });

            if (!email || !senha) {
                return res.status(400).json({
                    error: 'missing_fields',
                    message: 'Email e senha são obrigatórios'
                });
            }

            // Busca usuário
            console.log('Buscando usuário...');
            const [users] = await connection.execute(
                'SELECT * FROM usuarios WHERE email = ?',
                [email]
            );

            console.log('Usuários encontrados:', users.length);

            const user = users[0];
            if (!user) {
                return res.status(404).json({
                    error: 'user_not_found',
                    message: 'Usuário não encontrado'
                });
            }

            // Verifica a senha
            console.log('Verificando senha...');
            const senhaValida = await bcrypt.compare(senha, user.senha);
            
            if (!senhaValida) {
                return res.status(401).json({
                    error: 'invalid_password',
                    message: 'Senha incorreta'
                });
            }

            console.log('Senha válida, gerando token...');
            
            // Gera o token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    admin: user.admin
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log('Login realizado com sucesso');

            // Remove a senha antes de enviar
            const { senha: _, ...userWithoutPassword } = user;

            res.json({
                token,
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({
                error: 'server_error',
                message: 'Erro interno do servidor',
                details: error.message
            });
        }
    },

    // Atualizar usuário com melhor tratamento de erros
    async update(req, res) {
        try {
            const { nome, email, senha, pin, data_nascimento } = req.body;
            const userId = req.user.id;

            // Verifica se o usuário existe
            const [user] = await connection.execute(
                'SELECT id FROM usuarios WHERE id = ?',
                [userId]
            );

            if (!user.length) {
                return res.status(404).json({ 
                    error: 'user_not_found',
                    message: 'Usuário não encontrado'
                });
            }

            let updates = [];
            let values = [];

            if (nome) {
                updates.push('nome = ?');
                values.push(nome);
            }
            if (email) {
                // Verifica se o email já está em uso por outro usuário
                const [existingEmail] = await connection.execute(
                    'SELECT id FROM usuarios WHERE email = ? AND id != ?',
                    [email, userId]
                );
                if (existingEmail.length) {
                    return res.status(400).json({ 
                        error: 'email_in_use',
                        message: 'Este email já está em uso'
                    });
                }
                updates.push('email = ?');
                values.push(email);
            }
            if (senha) {
                updates.push('senha = ?');
                values.push(await bcrypt.hash(senha, 10));
            }
            if (pin) {
                updates.push('pin = ?');
                values.push(pin);
            }
            if (data_nascimento) {
                updates.push('data_nascimento = ?');
                values.push(data_nascimento);
            }

            if (updates.length === 0) {
                return res.status(400).json({ 
                    error: 'no_updates',
                    message: 'Nenhum dado para atualizar'
                });
            }

            values.push(userId);

            await connection.execute(
                `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            res.json({ 
                message: 'Usuário atualizado com sucesso',
                updates: Object.keys(req.body).filter(key => req.body[key])
            });
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            res.status(500).json({ 
                error: 'server_error',
                message: 'Erro ao atualizar usuário'
            });
        }
    },

    // Adicionar novo método para verificação de PIN
    async verifyPin(req, res) {
        try {
            const { email, pin } = req.body;

            // Busca usuário pelo email
            const [users] = await connection.execute(
                'SELECT id, pin, nome, admin FROM usuarios WHERE email = ?',
                [email]
            );

            const user = users[0];

            // Verifica se o usuário existe
            if (!user) {
                return res.status(404).json({
                    error: 'user_not_found',
                    message: 'Usuário não encontrado'
                });
            }

            // Verifica se o PIN está correto
            if (user.pin !== pin) {
                return res.status(401).json({
                    error: 'invalid_pin',
                    message: 'PIN incorreto'
                });
            }

            // Se o PIN estiver correto, gera um token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: email,
                    admin: user.admin
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Retorna sucesso com token e dados do usuário
            res.json({
                message: 'PIN verificado com sucesso',
                token,
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: email,
                    admin: user.admin
                }
            });
        } catch (error) {
            console.error('Erro ao verificar PIN:', error);
            res.status(500).json({
                error: 'server_error',
                message: 'Erro ao verificar PIN'
            });
        }
    },

    // Método para redefinir senha
    async resetPassword(req, res) {
        try {
            const { email, pin, newPassword } = req.body;
            
            // Busca usuário pelo email
            const [users] = await connection.execute(
                'SELECT id, pin FROM usuarios WHERE email = ?',
                [email]
            );

            const user = users[0];

            if (!user) {
                return res.status(404).json({
                    error: 'user_not_found',
                    message: 'Usuário não encontrado'
                });
            }

            if (user.pin !== pin) {
                return res.status(401).json({
                    error: 'invalid_pin',
                    message: 'PIN incorreto'
                });
            }

            // Hash da nova senha
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await connection.execute(
                'UPDATE usuarios SET senha = ? WHERE id = ?',
                [hashedPassword, user.id]
            );

            res.json({
                message: 'Senha atualizada com sucesso'
            });
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            res.status(500).json({
                error: 'server_error',
                message: 'Erro ao redefinir senha'
            });
        }
    }
};

module.exports = userController; 