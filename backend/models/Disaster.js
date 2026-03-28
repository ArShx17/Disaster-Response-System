const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
    type: { type: String, required: true },
    description: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    casualties: { type: Number, required: true, default: 0 },
    economic_loss: { type: Number, required: true, default: 0 },
    priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
    status: { type: String, default: 'Reported' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Disaster', disasterSchema);
