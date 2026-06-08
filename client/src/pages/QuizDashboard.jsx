import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, Lock, ArrowRight, BookOpen } from 'lucide-react';
import useStore from '../store/useStore';
import './QuizDashboard.css';

const QuizDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/quiz`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setQuizzes(data.quizzes);
                }
            } catch (error) {
                console.error("Failed to fetch quizzes", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchQuizzes();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center bg-[#0E0F14] text-gray-400">
                <Lock size={48} className="mb-4 text-gray-600" />
                <h2 className="text-xl font-medium mb-2 text-white">Login Required</h2>
                <p>Please log in to access the Quizzes.</p>
            </div>
        );
    }

    return (
        <div className="quiz-dashboard-root">
            <div className="quiz-dash-container">
                <div className="quiz-dash-hero">
                    <div className="quiz-dash-badge">
                        <Target size={14} /> Knowledge Evaluation
                    </div>
                    <h1 className="quiz-dash-title">Mastery Quizzes</h1>
                    <p className="quiz-dash-subtitle">
                        Test your understanding of each module. Earn <span>100 coins</span> for passing a module quiz for the first time!
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>Loading Modules...</div>
                ) : (
                    <div className="quiz-grid">
                        {quizzes.map((quiz) => (
                            <div 
                                key={quiz._id} 
                                className="quiz-card"
                                onClick={() => navigate(`/quiz/${quiz.moduleId}`)}
                            >
                                <div className="quiz-card-header">
                                    <div className="quiz-module-badge">Module {quiz.moduleId}</div>
                                    <div className={`quiz-status ${quiz.isCompleted ? 'completed' : 'pending'}`}>
                                        {quiz.isCompleted ? <><CheckCircle2 size={16} /> Passed</> : 'Pending'}
                                    </div>
                                </div>
                                <h3 className="quiz-card-title">{quiz.title}</h3>
                                <p className="quiz-card-desc">
                                    made with ❤️ for passionate coders
                                </p>
                                <div className="quiz-card-footer">
                                    <div className="quiz-meta">
                                        <BookOpen size={16} />
                                        {quiz.questionCount} Questions
                                    </div>
                                    <button className="quiz-action-btn">
                                        {quiz.isCompleted ? 'Retake' : 'Start'} <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizDashboard;
