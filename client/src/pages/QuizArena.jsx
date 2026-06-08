import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X, Award, Coins } from 'lucide-react';
import useStore from '../store/useStore';
import './QuizArena.css';

const QuizArena = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const { user, setCoins } = useStore();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selections, setSelections] = useState({}); // { Q1: ["A", "C"] }
    
    // Results
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/quiz/${moduleId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setQuiz(data.quiz);
                } else {
                    navigate('/quiz'); // Not found
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [moduleId, navigate]);

    const toggleSelection = (qId, optionId) => {
        if (submitted) return; // Prevent changing after submit
        
        setSelections(prev => {
            const current = prev[qId] || [];
            if (current.includes(optionId)) {
                return { ...prev, [qId]: current.filter(id => id !== optionId) };
            } else {
                return { ...prev, [qId]: [...current, optionId] };
            }
        });
    };

    const handleNext = () => {
        if (currentIndex < quiz.questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/quiz/${moduleId}/submit`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ answers: selections })
            });
            const data = await res.json();
            
            if (data.success) {
                setResults(data);
                setSubmitted(true);
                if (data.rewardedCoins > 0 && data.newCoinsTotal) {
                    setCoins(data.newCoinsTotal);
                }
            }
        } catch (error) {
            console.error("Submit failed", error);
        }
    };

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>Loading Quiz Module...</div>;
    }

    if (!quiz) return null;

    // Render Results Screen
    if (submitted && results) {
        const passed = results.score >= 80;
        return (
            <div className="quiz-arena-root">
                <div className="quiz-arena-container">
                    <div className="quiz-results">
                        <div className={`quiz-score-circle ${passed ? 'passed' : 'failed'}`}>
                            <span className="score-val">{results.score}%</span>
                            <span className="score-label">Score</span>
                        </div>
                        
                        <h2 className="quiz-results-title">
                            {passed ? 'Module Mastered! 🏆' : 'Keep Trying! 💪'}
                        </h2>
                        
                        <p className="quiz-results-desc">
                            You got {results.correctCount} out of {results.totalQuestions} questions correct.
                            {passed ? " Outstanding performance!" : " Review the module and try again to hit 80%."}
                        </p>

                        {results.newlyCompleted && results.rewardedCoins > 0 && (
                            <div className="quiz-reward-box">
                                <Award size={24} />
                                <span>Module Cleared! You earned {results.rewardedCoins} Coins!</span>
                                <Coins size={24} />
                            </div>
                        )}

                        <div className="quiz-action-buttons">
                            <button className="btn-secondary" onClick={() => navigate('/quiz')}>
                                Back to Modules
                            </button>
                            <button className="quiz-btn-submit" onClick={() => {
                                setSubmitted(false);
                                setResults(null);
                                setCurrentIndex(0);
                                setSelections({});
                            }}>
                                Retake Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentIndex];
    const progress = ((currentIndex + 1) / quiz.questions.length) * 100;
    const currentSelections = selections[currentQuestion.id] || [];

    return (
        <div className="quiz-arena-root">
            <div className="quiz-arena-container">
                <div className="quiz-header">
                    <button className="quiz-back-btn" onClick={() => navigate('/quiz')}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    
                    <div className="quiz-progress-container">
                        <div className="quiz-progress-text">
                            Question {currentIndex + 1} of {quiz.questions.length}
                        </div>
                        <div className="quiz-progress-bar">
                            <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="quiz-question-card" key={currentQuestion.id}>
                    <h3 className="quiz-question-text">{currentQuestion.id}: {currentQuestion.text}</h3>
                    
                    {currentQuestion.codeSnippet && (
                        <div className="quiz-code-block">
                            <pre><code>{currentQuestion.codeSnippet}</code></pre>
                        </div>
                    )}

                    <div className="quiz-options-grid">
                        {currentQuestion.options.map(opt => {
                            const isSelected = currentSelections.includes(opt.id);
                            
                            let statusClass = '';
                            if (isSelected && currentQuestion.correctAnswers) {
                                // Provide instant feedback since we now fetch correctAnswers
                                const isCorrectOpt = currentQuestion.correctAnswers.some(c => c.trim() === opt.id.trim());
                                statusClass = isCorrectOpt ? 'correct' : 'incorrect';
                            }

                            return (
                                <div 
                                    key={opt.id} 
                                    className={`quiz-option ${statusClass || (isSelected ? 'selected' : '')}`}
                                    onClick={() => toggleSelection(currentQuestion.id, opt.id)}
                                >
                                    <div className="quiz-option-marker">{opt.id}</div>
                                    <div className="quiz-option-text">
                                        {/* Simple rendering, if the text contains code we can split by backticks, 
                                            but since it's simple text we render it directly. */}
                                        {opt.text}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="quiz-footer">
                        <div className="quiz-hint">
                            <Check size={16} /> Select all correct options (MSQ)
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {currentIndex > 0 && (
                                <button className="btn-secondary" onClick={handlePrev}>
                                    Previous
                                </button>
                            )}
                            
                            {currentIndex < quiz.questions.length - 1 ? (
                                <button 
                                    className="quiz-btn-next" 
                                    onClick={handleNext}
                                    disabled={currentSelections.length === 0}
                                >
                                    Next <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button 
                                    className="quiz-btn-submit" 
                                    onClick={handleSubmit}
                                    disabled={currentSelections.length === 0}
                                >
                                    Submit Quiz <Check size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizArena;
