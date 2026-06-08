const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const authRoutes      = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const progressRoutes  = require('./routes/progressRoutes');
const aiRoutes        = require('./routes/aiRoutes');
const warmupRoutes    = require('./routes/warmupRoutes');
const rewardRoutes    = require('./routes/rewardRoutes');
const bountyRoutes    = require('./routes/bountyRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Start Cron Jobs
const startRevisionScheduler = require('./cron/revisionScheduler');
const startRetentionScheduler = require('./cron/retentionScheduler');
startRevisionScheduler();
startRetentionScheduler();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/progress',   progressRoutes);
app.use('/api/ai',         aiRoutes);
app.use('/api/warmup',     warmupRoutes);
app.use('/api/rewards',    rewardRoutes);
app.use('/api/bounties',   bountyRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('Action-First Learning Platform API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is operating in deep work mode on port ${PORT}`);
});