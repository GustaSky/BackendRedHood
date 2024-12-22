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

// Configuração do CORS
app.use(cors({
    origin: ['https://gustasky.github.io', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

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