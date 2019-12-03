const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Enumeration = require('../utils/enumeration');

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const Role = new Enumeration({
    ADMIN: 'ADMIN',
    REAL_ESTATE: 'REAL_ESTATE',
    USER: 'USER'
}, { reversable: false });

const UserSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Cette adresse e-mail est déjà utilisée'],
        required: [true, 'L\'adresse e-mail est obligatoire'],
        trim: true,
        validate: {
            validator: email => EMAIL_REGEXP.test(email),
            message: () => 'L\'adresse email est invalide'
        }
    },
    firstname: {
        type: String,
        required: [true, 'Le prénom est obligatoire'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe doit être compris entre 8 et 32 caractères']
    },
    role: {
        type: String,
        enum: Object.keys(Role),
        required: [true, 'Le rôle est obligatoire'],
    }
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Role
};