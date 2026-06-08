const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    id: { type: String, required: true }, // e.g., "A", "B", "C"
    text: { type: String, required: true }
});

const QuestionSchema = new mongoose.Schema({
    id: { type: String, required: true }, // e.g., "Q1"
    text: { type: String, required: true }, // "Analyze the code:"
    codeSnippet: { type: String, default: "" },
    options: [OptionSchema],
    correctAnswers: [{ type: String, required: true }], // ["A", "C", "D"]
});

const QuizSchema = new mongoose.Schema({
    moduleId: { type: Number, required: true, unique: true }, // e.g., 1
    title: { type: String, required: true }, // e.g., "Module 1 Quiz"
    questions: [QuestionSchema]
});

module.exports = mongoose.model('Quiz', QuizSchema);
