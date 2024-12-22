const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

const testConnection = async () => {
    try {
        const connection = await mysql.createConnection({
            ...dbConfig,
            database: null // Tenta conectar sem especificar o banco
        });
        
        console.log('🟢 Conexão com MySQL estabelecida com sucesso!');
        
        // Tenta criar o banco se não existir
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await connection.query(`USE ${dbConfig.database}`);
        
        // Testa uma query simples
        const [result] = await connection.query('SELECT 1 + 1 as test');
        console.log('🟢 Teste de query:', result[0].test === 2 ? 'OK' : 'Falhou');
        
        // Verifica se as tabelas existem
        const [tables] = await connection.query('SHOW TABLES');
        console.log('📊 Tabelas encontradas:', tables.map(t => Object.values(t)[0]));
        
        await connection.end();
        return true;
    } catch (error) {
        console.error('🔴 Erro na conexão:', error.message);
        return false;
    }
};

// Executa o teste de conexão
testConnection().then(success => {
    if (!success) {
        console.error('🔴 Falha ao conectar ao banco de dados');
        process.exit(1);
    }
});

// Cria o pool de conexões
const pool = mysql.createPool(dbConfig);

// Adiciona handler para erros de conexão
pool.on('error', (err) => {
    console.error('🔴 Erro no pool de conexões:', err);
});

module.exports = pool; 