const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    // The starter code shown in the editor — intentionally buggy
    buggyCode: { type: String, required: true },
    // A working reference solution (never sent to the client)
    solutionCode: { type: String, default: '' },
    // Hidden test cases that the Web Worker runs against user code
    testCases: [
        {
            description: { type: String, required: true },
            assertion:   { type: String, required: true }, // JS expression string
        }
    ],
    microTags: [{ type: String }],
    missionType: { type: String, enum: ['Warmup', 'Concept', 'Curious', 'Boss'], required: true },
    rewardCoins: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);