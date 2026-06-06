const express = require('express');
const router = express.Router();
const { getDailyWarmup, submitWarmup } = require('../controllers/warmupController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/daily', protect, getDailyWarmup);
router.post('/submit', protect, submitWarmup);

module.exports = router;
