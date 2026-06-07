const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, 'client', 'src', 'data', 'curriculum.js');

// 1. Read existing curriculum file
let rawData = fs.readFileSync(curriculumPath, 'utf8');

// We need to parse the exported object. We can convert it to a JSON-like string and eval it.
// Removing "export const curriculum = "
const dataToEval = rawData.replace(/export const curriculum = /g, 'return ').replace(/export default curriculum;/g, '').replace(/export { curriculum };/g, '');
const curriculum = new Function(dataToEval)();

const modulesPath = path.join(__dirname, 'modules');

// Helper to parse a theory text file
function parseTheoryFile(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf8');
    // Split by "# 1. " or "#### 1. " etc.
    const sections = [];
    const regex = /(?:^|\n)#+\s+\d+\.\s+([^\n]+)([\s\S]*?)(?=\n#+\s+\d+\.|$)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        sections.push({
            title: match[1].trim(),
            content: match[2].trim()
        });
    }
    return sections;
}

const moduleFiles = [
    'module1theory.txt',
    'module2theory.txt',
    'module3theory.txt',
    'module4theory.txt',
    'module5theory.txt',
    'module6theory.txt'
];

moduleFiles.forEach((file, index) => {
    const moduleId = index + 1;
    const moduleData = curriculum.modules.find(m => m.id === moduleId);
    if (!moduleData) return;

    const sections = parseTheoryFile(path.join(modulesPath, file));
    if (!sections || sections.length === 0) return;

    const newTopics = [];

    sections.forEach((sec, sIndex) => {
        // Find existing topic by matching index
        let existingTopic = moduleData.topics[sIndex];
        
        if (existingTopic) {
            existingTopic.title = sec.title;
            existingTopic.theory = sec.content;
            // The user said we don't need example anymore
            delete existingTopic.example;
            newTopics.push(existingTopic);
        } else {
            // It's a new subtopic!
            newTopics.push({
                id: `${moduleId}-${sIndex + 1}`,
                title: sec.title,
                microTags: ["#Theory", "#Concept"],
                theory: sec.content,
                trap: {
                    code: "// No trap defined yet",
                    flaw: "Understanding the theory deeply is the key here."
                },
                challenge: {
                    description: "Review the theory and experiment with these concepts.",
                    buggyCode: "// Experiment here",
                    testCases: [],
                    rewardCoins: 5,
                    missionType: "Warmup"
                }
            });
        }
    });

    moduleData.topics = newTopics;
});

function serializeData(data, indent = '') {
    if (Array.isArray(data)) {
        if (data.length === 0) return '[]';
        const inner = data.map(item => serializeData(item, indent + '  ')).join(',\n' + indent + '  ');
        return `[\n${indent}  ${inner}\n${indent}]`;
    } else if (data !== null && typeof data === 'object') {
        const keys = Object.keys(data);
        const inner = keys.map(key => {
            let value = serializeData(data[key], indent + '  ');
            let keyStr = /^[a-zA-Z0-9_]+$/.test(key) ? key : `"${key}"`;
            return `${keyStr}: ${value}`;
        }).join(',\n' + indent + '  ');
        return `{\n${indent}  ${inner}\n${indent}}`;
    } else if (typeof data === 'string') {
        let s = data.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
        s = s.replace(/\\\\\`/g, '\\`');
        s = s.replace(/\$\{/g, '\\${');
        return `\`${s}\``;
    } else {
        return JSON.stringify(data);
    }
}

const newOutput = `/**
 * curriculum.js — Single source of truth for all learning content.
 * Updated automatically by buildCurriculum.js
 */

export const curriculum = ${serializeData(curriculum)};
`;

fs.writeFileSync(curriculumPath, newOutput, 'utf8');
console.log('Curriculum updated successfully.');
