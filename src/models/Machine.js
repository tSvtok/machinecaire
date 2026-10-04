const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    reference: {
        type: String, 
        required: true, 
        unique: true 
    },
    name: {
        type: String,
        required: true
    }, 
    atelier: {
        type: String,
        required: true
    },
    etat: {
        type: String,
        enum: ['operationel', 'maintenance', 'out_of_order'],
        default: 'operationel'
    }
}, { timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);