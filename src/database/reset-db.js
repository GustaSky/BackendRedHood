const mysql = require('mysql2/promise');

const resetDatabase = async () => {
    const connection = await mysql.createConnection({
        host: 'autorack.proxy.rlwy.net',
        user: 'root',
        password: 'OAKzWvPgHpIdBzZTGWREOElaVpWLqhpD',
        database: 'railway',
        port: 47222
    });

    try {
        // Drop tabelas existentes
        await connection.execute('DROP TABLE IF EXISTS usuarios');
        console.log('✅ Tabela usuarios removida');

        // Recriar tabelas
        await connection.execute(`
            CREATE TABLE usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                senha VARCHAR(255) NOT NULL,
                pin VARCHAR(6),
                data_nascimento DATE,
                admin TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela usuarios recriada');

        console.log('✅ Banco de dados resetado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao resetar banco:', error);
    } finally {
        await connection.end();
    }
};

resetDatabase(); 