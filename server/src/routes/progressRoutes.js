const express = require('express');
const router = express.Router();
const { getSkillGraph } = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

// Protected route — only logged-in users can fetch their skill graph
router.get('/skill-graph', protect, getSkillGraph);

module.exports = router;
