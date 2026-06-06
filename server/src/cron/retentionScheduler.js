const cron = require('node-cron');
const User = require('../models/User');

// Run every night at midnight
const startRetentionScheduler = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running retention decay cron job...');
        try {
            // Find users who have been inactive for more than 48 hours
            const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
            
            const inactiveUsers = await User.find({ 
                lastActiveDate: { $lt: fortyEightHoursAgo },
                retentionScore: { $gt: 0 } // Only penalize if they have a score
            });

            for (const user of inactiveUsers) {
                // Decay retention score by 5 points per inactive period
                user.retentionScore = Math.max(0, user.retentionScore - 5);
                await user.save();
            }

            console.log(`Retention decay applied to ${inactiveUsers.length} users.`);
        } catch (error) {
            console.error('Error running retention scheduler:', error);
        }
    });
};

module.exports = startRetentionScheduler;
