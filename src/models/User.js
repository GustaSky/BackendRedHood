const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        maxLength: 6
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Isso criará automaticamente created_at e updated_at
});

module.exports = mongoose.model('User', userSchema); 