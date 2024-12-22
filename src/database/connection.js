const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

const testConnection = async () => {
    try {
        const connection = await mysql.createConnection({
            ...dbConfig,
            database: null // Tenta conectar sem especificar o banco
        });
        
        // Tenta criar o banco se não existir
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await connection.query(`USE ${dbConfig.database}`);
        
        console.log('Banco de dados conectado com sucesso!');
        await connection.end();
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
};

// Executa o teste de conexão
testConnection();

// Cria o pool de conexões
const pool = mysql.createPool(dbConfig);

// Adiciona handler para erros de conexão
pool.on('error', (err) => {
    console.error('Erro no pool de conexões:', err);
});

module.exports = pool; 