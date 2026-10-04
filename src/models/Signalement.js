const mongoose = require('mongoose');

const signalementSchema = new mongoose.Schema({
    machine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    declarePar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    statut: {
        type: String,
        enum: ['ouvert', 'en_cours', 'resolu'],
        default: 'ouvert'
    },
    noteResolution: {
        type: String,
        default: null
    },
    dateResolution: {
        type: Date,
        default: null
    },
}, { timestamps: true });

module.exports = mongoose.model('Signalement', signalementSchema);