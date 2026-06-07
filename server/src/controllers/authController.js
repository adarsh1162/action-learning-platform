const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup logic
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login logic
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Streak calculation
        const now = new Date();
        const lastActive = user.lastActiveDate;
        let newStreak = user.streak || 0;

        if (lastActive) {
            const todayDate = new Date(now);
            todayDate.setHours(0,0,0,0);
            const lastDate = new Date(lastActive);
            lastDate.setHours(0,0,0,0);
            
            const msInDay = 24 * 60 * 60 * 1000;
            const diffDays = Math.round((todayDate - lastDate) / msInDay);

            if (diffDays === 1) {
                // Logged in the next calendar day
                newStreak += 1;
            } else if (diffDays > 1) {
                // Streak broken
                newStreak = 1;
            }
            // if diffDays === 0, they logged in on the same day, do nothing (keep current streak)
        } else {
            newStreak = 1; // First time logging in
        }

        user.streak = newStreak;
        user.lastActiveDate = now;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { name: user.name, email: user.email, streak: newStreak, challengesDone: user.challengesDone } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { signup, login };