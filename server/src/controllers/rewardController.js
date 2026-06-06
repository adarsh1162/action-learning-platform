const User = require('../models/User');

/**
 * POST /api/rewards/open-box
 * Deduct a mystery box and grant random coins
 */
const openMysteryBox = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.mysteryBoxes <= 0) {
            return res.status(400).json({ success: false, message: 'No mystery boxes available' });
        }

        // Deduct 1 box
        user.mysteryBoxes -= 1;
        
        // Grant random coins (e.g., between 50 and 200)
        const coinsAwarded = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
        user.coins += coinsAwarded;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Mystery Box Opened!',
            coinsAwarded,
            mysteryBoxes: user.mysteryBoxes,
            totalCoins: user.coins
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { openMysteryBox };
