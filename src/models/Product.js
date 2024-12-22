const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: String,
    preco: {
        type: Number,
        required: true
    },
    estoque: {
        type: Number,
        default: 0
    },
    imagem_url: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 