const Challenge = require('../models/Challenge');
const SkillGraph = require('../models/SkillGraph');
const User      = require('../models/User');

/**
 * GET /api/challenges
 * Returns all challenges.
 * testCases are INCLUDED so the client can pass them to the Web Worker.
 * solutionCode is EXCLUDED from the response (it stays server-only).
 */
const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({}).select('-solutionCode');
        res.status(200).json({ success: true, challenges });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/challenges/:id
 * Returns a single challenge by its MongoDB _id.
 * solutionCode is EXCLUDED.
 */
const getChallengeById = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id).select('-solutionCode');
        if (!challenge) {
            return res.status(404).json({ success: false, message: 'Challenge not found.' });
        }
        res.status(200).json({ success: true, challenge });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * POST /api/challenges/submit  (Protected — requires JWT)
 * Body: { challengeId, passed: Boolean, failedTags: [String] }
 *
 * What this does:
 *  1. If the user PASSED: add rewardCoins to their User document.
 *  2. If the user FAILED: increase the weaknessScore for each failing microTag
 *     in the user's SkillGraph. If no SkillGraph exists yet, create one.
 */
const submitChallenge = async (req, res) => {
    try {
        const userId = req.user.id; // set by authMiddleware
        const { topicId, passed, failedTags, passedTags, rewardCoins } = req.body;

        // 1. If the user passed, reward them with coins, mystery boxes, and clear passedTags weakness
        if (passed) {
            const user = await User.findById(userId);
            const isFirstTime = !user.completedChallenges.includes(topicId);

            let coinsToAward = 0;
            let boxAwarded = 0;

            if (isFirstTime) {
                // 30% chance to drop a mystery box
                boxAwarded = Math.random() < 0.3 ? 1 : 0;
                coinsToAward = rewardCoins || 10;

                await User.findByIdAndUpdate(userId, {
                    $inc: { coins: coinsToAward, challengesDone: 1, mysteryBoxes: boxAwarded },
                    $addToSet: { completedChallenges: topicId }
                });
            }

            // Clear weakness scores for the tags they just mastered
            if (passedTags && passedTags.length > 0) {
                let skillGraph = await SkillGraph.findOne({ user: userId });
                if (skillGraph) {
                    let updated = false;
                    for (const tagName of passedTags) {
                        const existingTag = skillGraph.tags.find(t => t.tagName === tagName);
                        if (existingTag && existingTag.weaknessScore > 0) {
                            existingTag.weaknessScore = 0;
                            existingTag.lastTested = new Date();
                            updated = true;
                        }
                    }
                    if (updated) await skillGraph.save();
                }
            }

            return res.status(200).json({
                success: true,
                message: isFirstTime 
                    ? `Mission accomplished! +${coinsToAward} coins awarded.${boxAwarded ? ' You found a Mystery Box!' : ''}`
                    : `Mission accomplished! (Already completed previously)`,
                coinsAwarded: coinsToAward,
                boxAwarded: boxAwarded > 0,
                isFirstTime
            });
        }

        // 2. If the user failed, increment weakness scores for failedTags
        if (failedTags && failedTags.length > 0) {
            // Find or create the user's skill graph
            let skillGraph = await SkillGraph.findOne({ user: userId });

            if (!skillGraph) {
                skillGraph = await SkillGraph.create({
                    user: userId,
                    tags: []
                });
            }

            // For each failing tag, increment its weakness score
            for (const tagName of failedTags) {
                const existingTag = skillGraph.tags.find(t => t.tagName === tagName);

                if (existingTag) {
                    existingTag.weaknessScore += 10;
                    existingTag.lastTested = new Date();
                } else {
                    // First time this tag has been tested and failed
                    skillGraph.tags.push({
                        tagName,
                        weaknessScore: 10,
                        lastTested: new Date()
                    });
                }
            }

            await skillGraph.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Attempt recorded. Weakness scores updated.',
            failedTags
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getChallenges, getChallengeById, submitChallenge };
