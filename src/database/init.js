const mysql = require('mysql2/promise');
require('dotenv').config();

const createTables = async () => {
    let connection;
    try {
        console.log('🔵 Tentando conectar ao banco de dados...');
        
        // Tenta conectar primeiro sem especificar o banco
        connection = await mysql.createConnection(process.env.MYSQL_URL);
        
        console.log('✅ Conexão estabelecida');

        // Força o uso do banco railway
        await connection.query('USE railway');
        console.log('✅ Usando banco railway');

        console.log('🔵 Criando tabelas...');

        // Criar tabela de usuários
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
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
        console.log('✅ Tabela usuarios criada/verificada');

        // Criar tabela de produtos
        await connection.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                descricao TEXT,
                preco DECIMAL(10,2) NOT NULL,
                estoque INT NOT NULL DEFAULT 0,
                imagem_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela produtos criada/verificada');

        console.log('✅ Todas as tabelas foram criadas com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao criar tabelas:', error);
        console.error('Detalhes da conexão:', {
            url: process.env.MYSQL_URL?.replace(/:[^:]*@/, ':****@')
        });
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔵 Conexão encerrada');
        }
        process.exit(0);
    }
};

createTables(); 