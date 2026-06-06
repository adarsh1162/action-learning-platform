const express = require('express');
const router  = express.Router();
const { getChallenges, getChallengeById, submitChallenge } = require('../controllers/challengeController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes — anyone can fetch challenges (viewing is unrestricted)
router.get('/',     getChallenges);
router.get('/:id',  getChallengeById);

// Protected route — only logged-in users can submit results
router.post('/submit', protect, submitChallenge);

module.exports = router;
