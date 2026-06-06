const { generateHint } = require('../utils/geminiAI');

/**
 * @route POST /api/ai/hint
 * @desc Generate an AI mentor hint for failed code
 * @access Private
 */
const getHint = async (req, res) => {
    try {
        const { code, errorOutput, topicTitle } = req.body;

        if (!code || !errorOutput || !topicTitle) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const hint = await generateHint(code, errorOutput, topicTitle);

        res.json({
            success: true,
            hint
        });
    } catch (error) {
        console.error('Error generating AI hint:', error);
        res.status(500).json({ success: false, message: 'Failed to communicate with AI Mentor' });
    }
};

module.exports = {
    getHint
};
