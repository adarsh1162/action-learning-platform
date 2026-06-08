const mongoose = require('mongoose');

const bountySchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    rewardType: { type: String, enum: ['giftcard', 'coins', 'interview', 'swag', 'cash'], required: true },
    rewardText: { type: String, required: true },
    rewardAmount: { type: Number, default: 0 }, // For coins/cash numerical value
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Hard', 'Pro'], required: true },
    tags: [{ type: String }],
    buggyCode: { type: String, required: true },
    validationRegex: { type: String, required: true },
    status: { type: String, enum: ['open', 'claimed'], default: 'open' },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    postedDaysAgo: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Bounty', bountySchema);
