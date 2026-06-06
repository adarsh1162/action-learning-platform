const mongoose = require('mongoose');

const skillGraphSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{
        tagName: { type: String, required: true }, // e.g., "#AsyncAwait"
        weaknessScore: { type: Number, default: 0 },
        lastTested: { type: Date, default: Date.now },
        needsRevision: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('SkillGraph', skillGraphSchema);