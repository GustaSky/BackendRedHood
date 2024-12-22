const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuração do CORS para desenvolvimento local
app.use(cors({
    origin: '*', // Permite todas as origens durante testes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rotas
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
    res.json({ message: 'API funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 