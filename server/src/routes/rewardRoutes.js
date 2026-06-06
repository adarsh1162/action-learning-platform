const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { openMysteryBox } = require('../controllers/rewardController');

router.post('/open-box', protect, openMysteryBox);

module.exports = router;
