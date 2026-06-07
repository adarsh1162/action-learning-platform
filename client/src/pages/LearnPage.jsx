import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Play, RotateCcw, Cpu, ChevronLeft, Sparkles } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { curriculum } from '../data/curriculum';
import ModuleSidebar from '../components/learn/ModuleSidebar';
import TheoryView from '../components/learn/TheoryView';
import TrapView from '../components/learn/TrapView';
import MissionView from '../components/learn/MissionView';
import useStore from '../store/useStore';
import './LearnPage.css';

/**
 * LearnPage — The full learning experience.
 *
 * State machine per topic:
 *   'theory' → 'trap' → 'editor' → (advance to next topic)
 *
 * State machine per module end:
 *   → 'mission' (Phase 3 Boss Battle)
 */
const LearnPage = () => {
    const { coins, setCoins, addCoins, setSkillGraph } = useStore();

    // Navigation state
    const [activeModuleId, setActiveModuleId] = useState(1);
    const [activeTopicId, setActiveTopicId] = useState('1-1');
    const [viewPhase, setViewPhase] = useState('theory'); // 'theory' | 'trap' | 'editor' | 'mission'
    const [activeMissionId, setActiveMissionId] = useState(null);

    // Completion tracking
    const [completedTopics, setCompletedTopics] = useState(new Set());

    // Editor / test state
    const [code, setCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // AI Mentor State
    const [aiHint, setAiHint] = useState(null);
    const [isGeneratingHint, setIsGeneratingHint] = useState(false);
    
    const workerRef = useRef(null);
    const pendingResolveRef = useRef(null);

    const modules = curriculum.modules;

    // Derive active topic object
    const activeModule = modules.find(m => m.id === activeModuleId);
    const activeTopic = activeModule?.topics.find(t => t.id === activeTopicId);

    // ── Initialise code editor when topic changes ────────────────────────────
    useEffect(() => {
        if (activeTopic?.challenge) {
            setCode(activeTopic.challenge.buggyCode);
        }
        setTestResults(null);
        setShowSuccess(false);
    }, [activeTopicId]);

    // ── Fetch Skill Graph on Mount ───────────────────────────────────────────
    useEffect(() => {
        const fetchSkillGraph = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/progress/skill-graph`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setSkillGraph(data.skillGraph);
                    if (data.coins !== undefined) {
                        setCoins(data.coins);
                    }
                    if (data.completedChallenges) {
                        setCompletedTopics(new Set(data.completedChallenges));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch skill graph", error);
            }
        };
        fetchSkillGraph();
    }, [setSkillGraph]);

    // ── Web Worker setup ─────────────────────────────────────────────────────
    useEffect(() => {
        const worker = new Worker(new URL('../workers/codeWorker.js', import.meta.url), { type: 'module' });
        workerRef.current = worker;

        worker.onmessage = (e) => {
            if (pendingResolveRef.current) {
                pendingResolveRef.current(e.data);
                pendingResolveRef.current = null;
            }
        };

        return () => worker.terminate();
    }, []);

    const runInWorker = (payload) => new Promise((resolve) => {
        pendingResolveRef.current = resolve;
        workerRef.current.postMessage(payload);
    });

    // ── Navigation helpers ───────────────────────────────────────────────────
    const selectTopic = (moduleId, topicId) => {
        setActiveModuleId(moduleId);
        setActiveTopicId(topicId);
        setViewPhase('theory');
        setActiveMissionId(null);
        setTestResults(null);
        setShowSuccess(false);
        setAiHint(null);
    };

    const selectMission = (moduleId) => {
        setActiveModuleId(moduleId);
        setActiveMissionId(moduleId);
        setViewPhase('mission');
        setTestResults(null);
        setShowSuccess(false);
        setAiHint(null);
    };

    const advanceToNextTopic = () => {
        const topicIndex = activeModule.topics.findIndex(t => t.id === activeTopicId);
        if (topicIndex < activeModule.topics.length - 1) {
            selectTopic(activeModuleId, activeModule.topics[topicIndex + 1].id);
        } else {
            // All topics done in this module → show mission
            selectMission(activeModuleId);
        }
    };

    // ── Topic completion ─────────────────────────────────────────────────────
    const markTopicDone = () => {
        setCompletedTopics(prev => new Set([...prev, activeTopicId]));
    };

    // ── Code Execution ───────────────────────────────────────────────────────
    const handleRunCode = async () => {
        if (!activeTopic?.challenge || isRunning) return;
        setIsRunning(true);
        setTestResults(null);
        setShowSuccess(false);
        setAiHint(null);

        // Replace ${code} placeholder in test assertions with the actual user code
        const tests = activeTopic.challenge.testCases.map(t => ({
            ...t,
            assertion: t.assertion.replace(/\$\{code\}/g, code).replace(/__userCode__/g, code).replace(/__rawCode__/g, JSON.stringify(code))
        }));

        const result = await runInWorker({
            code,
            tests,
            id: activeTopicId,
        });

        setIsRunning(false);
        setTestResults(result);

        // Submit to backend
        let submitData = null;
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const failedTags = !result.allPassed ? activeTopic.microTags : [];
                const passedTags = result.allPassed ? activeTopic.microTags : [];
                const submitRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/challenges/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        topicId: activeTopic.id,
                        passed: result.allPassed,
                        failedTags,
                        passedTags,
                        rewardCoins: activeTopic.challenge.rewardCoins
                    })
                });
                submitData = await submitRes.json();

                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/progress/skill-graph`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setSkillGraph(data.skillGraph);
                } else {
                    alert('Backend error: ' + (data.message || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error("Failed to submit challenge", error);
            alert("Database Connection Error! Ensure your MongoDB IP whitelist is set to 0.0.0.0/0 on Atlas. The backend is currently unreachable.");
        }

        if (result.allPassed) {
            // If the user is logged out, we add coins locally. If logged in, skill-graph already fetched the absolute latest coins from DB.
            const token = localStorage.getItem('token');
            if (!token) {
                addCoins(activeTopic.challenge.rewardCoins);
            }
            setShowSuccess(true);
            markTopicDone();
            setTimeout(() => {
                setShowSuccess(false);
                advanceToNextTopic();
            }, 2200);
        }
    };

    const handleAskAI = async () => {
        if (!testResults || testResults.allPassed || isGeneratingHint) return;
        
        setIsGeneratingHint(true);
        setAiHint(null);

        try {
            const firstError = testResults.testResults.find(t => !t.passed)?.error || 'Unknown error occurred.';
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ai/hint`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    code,
                    errorOutput: firstError,
                    topicTitle: activeTopic.title
                })
            });

            const data = await res.json();
            if (data.success) {
                setAiHint(data.hint);
            } else {
                setAiHint("I'm sorry, I couldn't generate a hint right now. " + data.message);
            }
        } catch (error) {
            console.error('Failed to get AI hint:', error);
            setAiHint("AI Mentor is currently unavailable. Please check your connection.");
        } finally {
            setIsGeneratingHint(false);
        }
    };

    // ── Derive progress ──────────────────────────────────────────────────────
    const topicIndex = activeModule?.topics.findIndex(t => t.id === activeTopicId) ?? 0;
    const totalTopics = activeModule?.topics.length ?? 1;
    const progressPct = viewPhase === 'theory' ? (topicIndex / totalTopics) * 100
        : viewPhase === 'trap' ? ((topicIndex + 0.33) / totalTopics) * 100
        : ((topicIndex + 0.66) / totalTopics) * 100;

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="learn-page">
            {/* Top Progress Bar */}
            <div className="learn-progress-bar">
                <div
                    className="learn-progress-fill"
                    style={{
                        width: `${progressPct}%`,
                        background: activeModule?.color || '#6C5CE7'
                    }}
                />
            </div>

            {/* Page Layout: Sidebar + Content */}
            <div className="learn-layout">
                {/* Sidebar */}
                <ModuleSidebar
                    modules={modules}
                    activeModuleId={activeModuleId}
                    activeTopicId={activeTopicId}
                    completedTopics={completedTopics}
                    onSelectTopic={selectTopic}
                    onSelectMission={selectMission}
                    activeMissionId={activeMissionId}
                />

                {/* Main Content */}
                <main className="learn-content">

                    {/* ── THEORY ── */}
                    {viewPhase === 'theory' && activeTopic && (
                        <TheoryView
                            topic={activeTopic}
                            moduleColor={activeModule.color}
                            onNext={() => setViewPhase('trap')}
                        />
                    )}

                    {/* ── TRAP ── */}
                    {viewPhase === 'trap' && activeTopic && (
                        <TrapView
                            topic={activeTopic}
                            moduleColor={activeModule.color}
                            onNext={() => setViewPhase('editor')}
                        />
                    )}

                    {/* ── CODE EDITOR ── */}
                    {viewPhase === 'editor' && activeTopic && (
                        <div className="editor-view">
                            {/* Challenge Header */}
                            <div className="challenge-header">
                                <div className="challenge-meta">
                                    <span className="phase-chip phase-chip--purple">
                                        <Cpu size={12} /> Code Challenge
                                    </span>
                                    <div className="tag-group">
                                        {activeTopic.microTags.map(tag => (
                                            <span key={tag} className="micro-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <h2 className="challenge-title">{activeTopic.title}</h2>
                                <p className="challenge-desc">{activeTopic.challenge.description}</p>
                            </div>

                            {/* Editor Container */}
                            <div className="editor-container">
                                {/* Monaco Topbar */}
                                <div className="editor-topbar">
                                    <div className="editor-dots">
                                        <span className="dot-r" />
                                        <span className="dot-y" />
                                        <span className="dot-g" />
                                    </div>
                                    <span className="editor-filename">solution.js</span>
                                    <div className="editor-actions">
                                        <button
                                            onClick={() => {
                                                setCode(activeTopic.challenge.buggyCode);
                                                setTestResults(null);
                                            }}
                                            className="editor-reset-btn"
                                        >
                                            <RotateCcw size={13} /> Reset
                                        </button>
                                        <button
                                            onClick={handleRunCode}
                                            disabled={isRunning}
                                            className="editor-run-btn"
                                        >
                                            {isRunning
                                                ? <><Loader2 size={14} className="spin" /> Running</>
                                                : <><Play size={14} /> Run Code</>
                                            }
                                        </button>
                                    </div>
                                </div>

                                {/* Monaco Editor */}
                                <div className="monaco-wrapper">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="javascript"
                                        theme="vs-dark"
                                        value={code}
                                        onChange={val => setCode(val || '')}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 13,
                                            fontFamily: "'Fira Code', Consolas, monospace",
                                            fontLigatures: true,
                                            wordWrap: 'on',
                                            scrollBeyondLastLine: false,
                                            padding: { top: 14 },
                                            lineNumbers: 'on',
                                            cursorBlinking: 'smooth',
                                            smoothScrolling: true,
                                        }}
                                    />
                                </div>

                                {/* Status bar */}
                                <div className="editor-statusbar">
                                    <span>JavaScript</span>
                                    <span>Topic {topicIndex + 1}/{totalTopics}</span>
                                </div>
                            </div>

                            {/* Test Results Panel */}
                            {testResults && (
                                <div className="results-panel">
                                    <div className="results-title">Execution Output</div>
                                    <div className="results-list">
                                        {testResults.testResults?.map((t, i) => (
                                            <div
                                                key={i}
                                                className={`result-row ${t.passed ? 'result-row--pass' : 'result-row--fail'}`}
                                            >
                                                {t.passed
                                                    ? <CheckCircle size={15} className="result-icon--pass" />
                                                    : <XCircle size={15} className="result-icon--fail" />
                                                }
                                                <div>
                                                    <div className="result-desc">{t.description}</div>
                                                    {!t.passed && t.error && (
                                                        <div className="result-error">{t.error}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* AI Mentor Trigger */}
                                    {!testResults.allPassed && !aiHint && !isGeneratingHint && (
                                        <button className="ai-trigger-btn" onClick={handleAskAI}>
                                            <Sparkles size={16} /> Ask AI Mentor
                                        </button>
                                    )}

                                    {/* AI Mentor Box */}
                                    {(isGeneratingHint || aiHint) && (
                                        <div className="ai-mentor-box">
                                            <div className="ai-mentor-header">
                                                <Sparkles size={16} className="ai-icon" />
                                                AI Mentor
                                                {isGeneratingHint && <span className="ai-status">Analyzing code...</span>}
                                            </div>
                                            <div className="ai-mentor-body">
                                                {isGeneratingHint ? (
                                                    <div className="ai-loader">
                                                        <div className="ai-loader-bar"></div>
                                                    </div>
                                                ) : (
                                                    <div className="ai-hint-text" dangerouslySetInnerHTML={{ __html: aiHint.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>').replace(/\n/g, '<br/>') }} />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Success Banner */}
                            {showSuccess && (
                                <div className="success-banner">
                                    <div className="success-banner-inner">
                                        <span className="success-icon">🎉</span>
                                        <div>
                                            <div className="success-title">Mission Accomplished!</div>
                                            <div className="success-sub">
                                                All test cases passed · +{activeTopic.challenge.rewardCoins} coins added
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── BOSS MISSION ── */}
                    {viewPhase === 'mission' && activeMissionId && activeModule?.mission && (
                        <MissionView
                            mission={activeModule.mission}
                            moduleColor={activeModule.color}
                            moduleId={activeModuleId}
                            onComplete={(completedModuleId) => {
                                // Advance to next module's first topic
                                const nextModule = modules.find(m => m.id === completedModuleId + 1);
                                if (nextModule) {
                                    selectTopic(nextModule.id, nextModule.topics[0].id);
                                }
                            }}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default LearnPage;
