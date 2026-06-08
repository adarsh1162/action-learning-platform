const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const Quiz = require('./src/models/Quiz');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const parseQuizFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    let moduleId = 0;
    let title = "";
    const questions = [];
    
    let currentQuestion = null;
    let inCodeBlock = false;
    let codeContent = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Extract Module ID and Title
        if (line.startsWith('# Module') && line.includes('Quiz')) {
            const match = line.match(/Module (\d+)/);
            if (match) moduleId = parseInt(match[1]);
            title = line.replace('# ', '');
            continue;
        }

        // Start of a new Question
        if (line.startsWith('### Q')) {
            if (currentQuestion) {
                if (codeContent.length > 0) currentQuestion.codeSnippet = codeContent.join('\n');
                questions.push(currentQuestion);
                codeContent = [];
            }
            currentQuestion = {
                id: line.replace('### ', ''),
                text: "",
                codeSnippet: "",
                options: [],
                correctAnswers: []
            };
            // Next non-empty lines before code block or options will be text
            let j = i + 1;
            let qText = [];
            while (j < lines.length && !lines[j].startsWith('```') && !lines[j].startsWith('* A.') && !lines[j].startsWith('**Correct Answers:**')) {
                if (lines[j].trim() !== '') qText.push(lines[j].trim());
                j++;
            }
            currentQuestion.text = qText.join(' ');
            i = j - 1; // skip forward
            continue;
        }

        if (!currentQuestion) continue;

        // Code Blocks
        if (line.startsWith('```')) {
            if (!inCodeBlock) {
                inCodeBlock = true;
                // Ignore the opening ```javascript
            } else {
                inCodeBlock = false;
            }
            continue;
        }

        if (inCodeBlock) {
            codeContent.push(lines[i]); // Keep original spacing
            continue;
        }

        // Options
        if (line.startsWith('* ')) {
            // * A. Some text
            // wait, some options are multi-line if they contain code.
            // Let's handle simple 1-line options first, which these are mostly.
            const match = line.match(/^\*\s+([A-E])\.\s+(.*)/);
            if (match) {
                currentQuestion.options.push({
                    id: match[1],
                    text: match[2]
                });
            }
            // Some options have code blocks inside them. 
            // In the txt file, we have:
            // * A.
            // ```javascript
            // let msg = 'Hello World';
            // ```
            // If the line is just `* A.` we need to look ahead
            if (line.match(/^\*\s+([A-E])\.?$/)) {
                let optId = line.replace('* ', '').replace('.', '');
                let optText = [];
                let k = i + 1;
                let optInCode = false;
                while (k < lines.length && !lines[k].startsWith('* ') && !lines[k].startsWith('**Correct Answers:**')) {
                    if (lines[k].startsWith('```')) {
                        optInCode = !optInCode;
                    } else if (lines[k].trim() !== '') {
                        optText.push(lines[k].trim());
                    }
                    k++;
                }
                currentQuestion.options.push({
                    id: optId,
                    text: optText.join('\n')
                });
                i = k - 1;
            }
            continue;
        }

        // Correct Answers
        if (line.startsWith('**Correct Answers:**')) {
            const answersStr = line.replace('**Correct Answers:**', '').trim();
            currentQuestion.correctAnswers = answersStr.split(',').map(a => a.trim());
        }
    }

    if (currentQuestion) {
        if (codeContent.length > 0) currentQuestion.codeSnippet = codeContent.join('\n');
        questions.push(currentQuestion);
    }

    return { moduleId, title, questions };
};

const seed = async () => {
    try {
        await Quiz.deleteMany({});
        console.log('Cleared old quizzes');

        const quizDir = path.join(__dirname, '..', 'modules', 'quiz');
        const files = fs.readdirSync(quizDir).filter(f => f.endsWith('quiz.txt'));

        for (const file of files) {
            const filePath = path.join(quizDir, file);
            const quizData = parseQuizFile(filePath);
            if (quizData.moduleId > 0) {
                await Quiz.create(quizData);
                console.log(`Seeded Quiz for Module ${quizData.moduleId}: ${quizData.questions.length} questions`);
            }
        }

        console.log('Seeding complete!');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seed();
