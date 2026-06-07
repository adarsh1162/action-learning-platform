const SkillGraph = require('../models/SkillGraph');
const User = require('../models/User');

/**
 * GET /api/progress/skill-graph
 * Fetch the user's SkillGraph (weakness tags) and coin balance
 */
const getSkillGraph = async (req, res) => {
    try {
        const userId = req.user.id;
        
        let skillGraph = await SkillGraph.findOne({ user: userId });
        const user = await User.findById(userId).select('coins challengesDone streak retentionScore');

        if (!skillGraph) {
            skillGraph = { tags: [] };
        }

        res.status(200).json({
            success: true,
            skillGraph,
            coins: user ? user.coins : 0,
            challengesDone: user ? (user.challengesDone || 0) : 0,
            completedChallenges: user ? (user.completedChallenges || []) : [],
            streak: user ? (user.streak || 0) : 0,
            retentionScore: user ? (user.retentionScore || 100) : 100,
            mysteryBoxes: user ? (user.mysteryBoxes || 0) : 0
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getSkillGraph };
