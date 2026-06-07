const Challenge = require('../models/Challenge');
const SkillGraph = require('../models/SkillGraph');

/**
 * @route GET /api/warmup/daily
 * @desc Get daily warmup challenges based on weak tags
 * @access Private
 */
const getDailyWarmup = async (req, res) => {
    try {
        const userId = req.user.id;
        const skillGraph = await SkillGraph.findOne({ user: userId });

        if (!skillGraph) {
            return res.json({ success: true, needsWarmup: false });
        }

        const force = req.query.force === 'true';

        let tagsToRevise = skillGraph.tags
            .filter(tag => tag.needsRevision)
            .map(tag => tag.tagName);

        if (tagsToRevise.length === 0) {
            if (force) {
                tagsToRevise = skillGraph.tags
                    .sort((a,b) => b.weaknessScore - a.weaknessScore)
                    .slice(0, 3)
                    .map(tag => tag.tagName);
            }
            if (tagsToRevise.length === 0) {
                return res.json({ success: true, needsWarmup: false });
            }
        }

        // Find a challenge that matches one of these tags
        // To simplify, we just pick the first matching challenge, or a random one
        // Ideally, this challenge has missionType: 'Warmup', but we'll fallback to any if none exist.
        let challenges = await Challenge.find({ 
            microTags: { $in: tagsToRevise },
            missionType: 'Warmup'
        }).limit(3);

        if (challenges.length === 0) {
            challenges = await Challenge.find({ 
                microTags: { $in: tagsToRevise }
            }).limit(3);
        }

        if (challenges.length === 0) {
            return res.json({ success: true, needsWarmup: false });
        }

        res.json({
            success: true,
            needsWarmup: true,
            weakTags: tagsToRevise,
            challenges
        });

    } catch (error) {
        console.error('Error fetching warmup:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @route POST /api/warmup/submit
 * @desc Submit warmup completion to clear needsRevision flags
 * @access Private
 */
const submitWarmup = async (req, res) => {
    try {
        const userId = req.user.id;
        const { passedTags } = req.body;

        if (!passedTags || !Array.isArray(passedTags)) {
            return res.status(400).json({ success: false, message: 'Invalid tags provided' });
        }

        const skillGraph = await SkillGraph.findOne({ user: userId });
        
        if (skillGraph) {
            let updated = false;
            skillGraph.tags.forEach(tag => {
                if (passedTags.includes(tag.tagName)) {
                    tag.needsRevision = false;
                    tag.weaknessScore = Math.max(0, tag.weaknessScore - 10);
                    tag.lastTested = Date.now();
                    updated = true;
                }
            });

            if (updated) {
                await skillGraph.save();
            }
        }

        res.json({ success: true, message: 'Warmup completed' });

    } catch (error) {
        console.error('Error submitting warmup:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getDailyWarmup,
    submitWarmup
};
