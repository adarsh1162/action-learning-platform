const cron = require('node-cron');
const SkillGraph = require('../models/SkillGraph');

// Run every night at midnight
const startRevisionScheduler = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('[CRON] Running nightly revision analysis...');
        try {
            const skillGraphs = await SkillGraph.find({});
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

            let updatedUsers = 0;

            for (const graph of skillGraphs) {
                let needsUpdate = false;
                
                graph.tags.forEach(tag => {
                    // If weakness score is > 0 and it hasn't been tested in 24 hours
                    if (tag.weaknessScore > 0 && tag.lastTested < yesterday) {
                        tag.needsRevision = true;
                        needsUpdate = true;
                    }
                });

                if (needsUpdate) {
                    await graph.save();
                    updatedUsers++;
                }
            }

            console.log(`[CRON] Nightly analysis complete. Flagged revision for ${updatedUsers} users.`);
        } catch (error) {
            console.error('[CRON] Error during nightly analysis:', error);
        }
    });
    console.log('[CRON] Revision scheduler initialized.');
};

module.exports = startRevisionScheduler;
