const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coins: { type: Number, default: 0 },
    cashBalance: { type: Number, default: 0 },
    retentionScore: { type: Number, default: 100 },
    challengesDone: { type: Number, default: 0 },
    completedChallenges: [{ type: String }],
    streak: { type: Number, default: 0 },
    mysteryBoxes: { type: Number, default: 0 },
    lastActiveDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);