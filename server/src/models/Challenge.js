const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    buggyCode: { type: String, required: true },
    microTags: [{ type: String }],
    missionType: { type: String, enum: ['Warmup', 'Concept', 'Curious', 'Boss'], required: true },
    rewardCoins: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);