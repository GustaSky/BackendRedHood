const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'autorack.proxy.rlwy.net',
    user: 'root',
    password: 'OAKzWvPgHpIdBzZTGWREOElaVpWLqhpD',
    database: 'railway',
    port: 47222
});

console.log('Tentando conectar...');

connection.connect(function(err) {
    if (err) {
        console.error('Erro ao conectar:', err);
        console.error('Código do erro:', err.code);
        console.error('Número do erro:', err.errno);
        process.exit(1);
    }

    console.log('Conectado com sucesso!');
    
    // Testa uma query simples
    connection.query('SHOW TABLES', function (error, results) {
        if (error) {
            console.error('Erro na query:', error);
        } else {
            console.log('Tabelas encontradas:', results);
        }
        
        connection.end();
    });
}); 