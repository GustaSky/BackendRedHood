require('dotenv').config();

let config;

if (process.env.MYSQL_URL) {
    // Para ambiente de produção (Railway)
    const url = new URL(process.env.MYSQL_URL);
    config = {
        host: url.hostname,
        user: url.username,
        password: url.password,
        database: url.pathname.substr(1),
        port: url.port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
} else {
    // Para ambiente local
    config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
}

console.log('Configuração do banco:', {
    ...config,
    password: '****' // Oculta a senha no log
});

module.exports = config; 