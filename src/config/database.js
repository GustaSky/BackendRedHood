require('dotenv').config();

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'briarnua',
    database: process.env.DB_NAME || 'meu_projeto_db',
    port: process.env.DB_PORT || 3307,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log('Configuração do banco:', {
    ...config,
    password: '****' // Oculta a senha no log
});

module.exports = config; 