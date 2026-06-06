const { GoogleGenAI } = require('@google/genai');

let ai;
const apiKey = process.env.GEMINI_API_KEY;

// Only initialize if we have a real key, otherwise we'll mock it so the UI still works
const isMockMode = !apiKey || apiKey === 'your_google_gemini_api_key';

if (!isMockMode) {
    ai = new GoogleGenAI({ apiKey });
}

/**
 * Generates an AI hint based on the user's code, the execution error, and the topic context.
 *
 * @param {string} code - The user's buggy code
 * @param {string} errorOutput - The error thrown during execution
 * @param {string} topicTitle - The title of the current topic (e.g., "Variables & Memory Storage")
 * @returns {Promise<string>} The generated hint
 */
const generateHint = async (code, errorOutput, topicTitle) => {
    if (isMockMode) {
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock response for development without API key
        return "I noticed you're returning a string, but the test case expects an array. Remember that in JavaScript, arrays are created using square brackets `[]`. Try wrapping your return value!";
    }

    try {
        const prompt = `
You are an expert AI programming mentor for a student learning JavaScript.
The student is currently learning the topic: "${topicTitle}".

They wrote the following code which failed the test cases:
\`\`\`javascript
${code}
\`\`\`

The execution resulted in this error or failure:
\`\`\`
${errorOutput}
\`\`\`

Your goal is to guide the student to the correct answer WITHOUT giving them the exact code solution.
Provide a concise, encouraging hint (1-2 short paragraphs max).
Explain what went wrong based on the error and the code, and ask a leading question or give a conceptual hint to point them in the right direction. Use markdown for code formatting (e.g., \`const\`).
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 300,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API Error:", error.message || error);
        console.log("Falling back to mock mode due to API error (Quota/Network).");
        // Mock response fallback so the UI doesn't break
        return "I noticed you're returning a string, but the test case expects an array. Remember that in JavaScript, arrays are created using square brackets `[]`. Try wrapping your return value!";
    }
};

module.exports = {
    generateHint
};
