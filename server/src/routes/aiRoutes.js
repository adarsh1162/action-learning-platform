const express = require('express');
const router = express.Router();
const { getHint } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

// Route to get AI hint, protected route requires authentication
router.post('/hint', protect, getHint);

module.exports = router;
