require('dotenv').config({ path: 'c:/Users/adars/Downloads/CodeCamp/action-learning-platform/server/.env' });
const { generateHint } = require('./server/src/utils/geminiAI');

(async () => {
    try {
        const result = await generateHint("const a = 1;", "SyntaxError: Unexpected token", "Variables");
        console.log("RESULT:", result);
    } catch (e) {
        console.error("ERROR:", e);
    }
})();
