const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Enumeration = require('../utils/enumeration');

const Type = new Enumeration({
    SALE: 'Vente',
    RENTAL: 'Location'
});

const PublishStatus = new Enumeration({
    PUBLISHED: 'Publiée',
    UNPUBLISHED: 'Non publiée'
});

const TransactionStatus = new Enumeration({
    AVAILABLE: 'Disponible',
    NOT_AVAILABLE: 'Non disponible'
});

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'identifiant de l\'utilisateur est obligatoire']
    },
    date: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required: [true, 'Le texte du commentaire est obligatoire'],
        trim: true,
        minlength: 2,
        maxlength: 2048
    }
});

const AdSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Le titre est obligatoire'],
        trim: true,
        minlength: 4,
        maxlength: 126
    },
    type: {
        type: String,
        enum: Object.values(Type),
        required: [true, 'Le type de bien est obligatoire'],
    },
    publish_status: {
        type: String,
        enum: Object.values(PublishStatus),
        required: [true, 'Le status de publication est obligatoire']
    },
    transaction_status: {
        type: String,
        enum: Object.values(TransactionStatus),
        required: [true, 'Le status de transaction est obligatoire']
    },
    description: {
        type: String,
        default: '',
        maxlength: 2048
    },
    price: {
        type: Number,
        required: [true, 'Le prix est obligatoire'],
        min: 0
    }
});

module.exports = {
    Ad: mongoose.model('Ad', AdSchema),
    Type,
    PublishStatus,
    TransactionStatus
};