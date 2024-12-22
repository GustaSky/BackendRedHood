const mysql = require('mysql2');

// Criar conexão simples em vez de pool
const connection = mysql.createConnection({
    host: 'autorack.proxy.rlwy.net',
    user: 'root',
    password: 'OAKzWvPgHpIdBzZTGWREOElaVpWLqhpD',
    database: 'railway',
    port: 47222
});

// Conectar ao banco
connection.connect(error => {
    if (error) {
        console.error('Erro ao conectar ao banco:', error);
        return;
    }
    console.log('✅ Conectado ao banco de dados MySQL');
});

// Reconectar se a conexão for perdida
connection.on('error', function(err) {
    console.log('Erro de banco:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Tentando reconectar...');
        connection.connect();
    } else {
        throw err;
    }
});

// Exportar conexão com promise
module.exports = connection.promise(); 