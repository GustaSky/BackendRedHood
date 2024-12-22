const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    console.error('Erro não capturado:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Promise rejeitada não tratada:', error);
});

// Configuração do CORS mais permissiva
app.use(cors({
    origin: '*',  // Permite todas as origens
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
    credentials: false  // Mudamos para false
}));

// Middleware adicional para headers CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Rotas
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
    res.json({ message: 'API funcionando!' });
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
    });
});

const PORT = process.env.PORT || 3000;

// Inicia o servidor com tratamento de erro
const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}).on('error', (err) => {
    console.error('Erro ao iniciar servidor:', err);
}); 