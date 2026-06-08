const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

// Fetch all quizzes (summarized, without answers)
router.get('/', protect, async (req, res) => {
    try {
        const dbUser = await User.findById(req.user.id);
        const quizzes = await Quiz.find({}, 'moduleId title questions.id questions.text');
        
        // Return summary with completed status
        const summary = quizzes.map(q => ({
            _id: q._id,
            moduleId: q.moduleId,
            title: q.title,
            questionCount: q.questions.length,
            isCompleted: dbUser && dbUser.completedQuizzes ? dbUser.completedQuizzes.includes(q.moduleId) : false
        })).sort((a, b) => a.moduleId - b.moduleId);

        res.json({ success: true, quizzes: summary });
    } catch (error) {
        console.error("Quiz Fetch Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
    }
});

// Fetch a specific quiz by module ID (without answers)
router.get('/:moduleId', protect, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ moduleId: req.params.moduleId });
        if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

        // Send correct answers to client for instant feedback
        const fullQuiz = {
            _id: quiz._id,
            moduleId: quiz.moduleId,
            title: quiz.title,
            questions: quiz.questions.map(q => ({
                id: q.id.trim(), // Trim ID to ensure no whitespace issues
                text: q.text,
                codeSnippet: q.codeSnippet,
                options: q.options,
                correctAnswers: q.correctAnswers
            }))
        };

        res.json({ success: true, quiz: fullQuiz });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch quiz" });
    }
});

// Submit quiz answers
router.post('/:moduleId/submit', protect, async (req, res) => {
    try {
        const { answers } = req.body; // { "Q1": ["A", "C"], "Q2": ["B"] }
        const moduleId = parseInt(req.params.moduleId);
        
        const quiz = await Quiz.findOne({ moduleId });
        if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

        const dbUser = await User.findById(req.user.id);
        if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });

        let correctCount = 0;
        const results = {}; // detailed results per question

        quiz.questions.forEach(q => {
            const qIdTrimmed = q.id.trim();
            const userAns = answers[qIdTrimmed] || [];
            
            // Trim correctAnswers just in case
            const trimmedCorrect = q.correctAnswers.map(c => c.trim());
            
            // Partial marking logic
            const correctSelected = userAns.filter(ans => trimmedCorrect.includes(ans.trim())).length;
            const incorrectSelected = userAns.length - correctSelected;
            
            // Score for this question: (correct_selected - incorrect_selected) / total_correct
            // Minimum score for a question is 0.
            let qScore = 0;
            if (trimmedCorrect.length > 0) {
                qScore = Math.max(0, (correctSelected - incorrectSelected) / trimmedCorrect.length);
            }
            
            correctCount += qScore;
            
            const isPerfect = qScore === 1;
            
            results[q.id] = {
                correct: isPerfect,
                partialScore: qScore,
                correctAnswers: q.correctAnswers
            };
        });

        const score = Math.round((correctCount / quiz.questions.length) * 100);
        let rewardedCoins = 0;
        let newlyCompleted = false;

        // Reward 100 coins if passed (score >= 80%) and taking for the first time
        if (score >= 80 && (!dbUser.completedQuizzes || !dbUser.completedQuizzes.includes(moduleId))) {
            if (!dbUser.completedQuizzes) dbUser.completedQuizzes = [];
            dbUser.completedQuizzes.push(moduleId);
            dbUser.coins += 100;
            rewardedCoins = 100;
            newlyCompleted = true;
            await dbUser.save();
        }

        res.json({ 
            success: true, 
            score, 
            correctCount: parseFloat(correctCount.toFixed(1)), // format for partial UI
            totalQuestions: quiz.questions.length,
            results,
            rewardedCoins,
            newlyCompleted,
            newCoinsTotal: dbUser.coins
        });
    } catch (error) {
        console.error("Quiz Submit Error:", error);
        res.status(500).json({ success: false, message: "Failed to submit quiz" });
    }
});

module.exports = router;
