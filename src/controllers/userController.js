const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../database/connection');
const mysql = require('mysql2/promise');

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
        let conn;
        try {
            console.log('Iniciando login...');
            const { email, senha } = req.body;

            // Cria uma nova conexão para esta requisição
            conn = await mysql.createConnection({
                host: 'autorack.proxy.rlwy.net',
                user: 'root',
                password: 'OAKzWvPgHpIdBzZTGWREOElaVpWLqhpD',
                database: 'railway',
                port: 47222
            });

            // Busca usuário
            console.log('Buscando usuário...');
            const [users] = await conn.execute(
                'SELECT * FROM usuarios WHERE email = ?',
                [email]
            );

            const user = users[0];
            if (!user) {
                return res.status(404).json({
                    error: 'user_not_found',
                    message: 'Usuário não encontrado'
                });
            }

            // Verifica a senha
            const senhaValida = await bcrypt.compare(senha, user.senha);
            if (!senhaValida) {
                return res.status(401).json({
                    error: 'invalid_password',
                    message: 'Senha incorreta'
                });
            }

            // Gera o token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                'sua_chave_secreta', // Chave fixa para teste
                { expiresIn: '24h' }
            );

            // Remove a senha do objeto do usuário
            const { senha: _, ...userWithoutPassword } = user;

            return res.json({
                token,
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Erro completo:', error);
            return res.status(500).json({
                error: 'server_error',
                message: 'Erro interno do servidor',
                details: error.message
            });
        } finally {
            if (conn) {
                await conn.end();
            }
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
        let conn;
        try {
            console.log('Iniciando verificação de PIN...');
            const { email, pin } = req.body;

            if (!email || !pin) {
                return res.status(400).json({
                    error: 'missing_fields',
                    message: 'Email e PIN são obrigatórios'
                });
            }

            // Cria uma nova conexão
            conn = await mysql.createConnection({
                host: 'autorack.proxy.rlwy.net',
                user: 'root',
                password: 'OAKzWvPgHpIdBzZTGWREOElaVpWLqhpD',
                database: 'railway',
                port: 47222
            });

            // Busca usuário pelo email e PIN
            const [users] = await conn.execute(
                'SELECT id, nome, email, pin FROM usuarios WHERE email = ? AND pin = ?',
                [email, pin]
            );

            if (!users.length) {
                return res.status(401).json({
                    error: 'invalid_pin',
                    message: 'Email ou PIN inválido'
                });
            }

            // Gera um token temporário para reset de senha
            const token = jwt.sign(
                {
                    id: users[0].id,
                    email: users[0].email,
                    purpose: 'reset_password'
                },
                'sua_chave_secreta',
                { expiresIn: '1h' }
            );

            return res.json({
                message: 'PIN verificado com sucesso',
                token
            });

        } catch (error) {
            console.error('Erro na verificação do PIN:', error);
            return res.status(500).json({
                error: 'server_error',
                message: 'Erro ao verificar PIN',
                details: error.message
            });
        } finally {
            if (conn) {
                await conn.end();
            }
        }
    },

    // Método para redefinir senha
    async resetPassword(req, res) {
        let conn;
        try {
            const { email, pin, newPassword } = req.body;

            if (!email || !pin || !newPassword) {
                return res.status(400).json({
                    error: 'missing_fields',
                    message: 'Email, PIN e nova senha são obrigatórios'
                });
            }

            // Cria uma nova conexão
            conn = await mysql.createConnection({
                host: 'autorack.proxy.rlwy.net',
                user: 'root',
                password: 'OAKzWvPgHpIdBzZTGWREOElaVpWLqhpD',
                database: 'railway',
                port: 47222
            });

            // Verifica se o usuário existe e o PIN está correto
            const [users] = await conn.execute(
                'SELECT id FROM usuarios WHERE email = ? AND pin = ?',
                [email, pin]
            );

            if (!users.length) {
                return res.status(401).json({
                    error: 'invalid_credentials',
                    message: 'Email ou PIN inválido'
                });
            }

            // Hash da nova senha
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Atualiza a senha
            await conn.execute(
                'UPDATE usuarios SET senha = ? WHERE id = ?',
                [hashedPassword, users[0].id]
            );

            return res.json({
                message: 'Senha atualizada com sucesso'
            });

        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            return res.status(500).json({
                error: 'server_error',
                message: 'Erro ao redefinir senha',
                details: error.message
            });
        } finally {
            if (conn) {
                await conn.end();
            }
        }
    }
};

module.exports = userController; 