import React, { useState, useEffect, useRef } from 'react';
import { Swords, Target, CheckCircle, XCircle, Loader2, RotateCcw, Play, Sparkles } from 'lucide-react';
import Editor from '@monaco-editor/react';
import useStore from '../../store/useStore';

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

const assertEqual = (actual, expected, message) => {
    if (typeof actual === 'object' && actual !== null && typeof expected === 'object' && expected !== null) {
        if (JSON.stringify(actual) !== JSON.stringify(expected))
            throw new Error(message || `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
        return;
    }
    if (actual !== expected)
        throw new Error(message || `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
};

/**
 * MissionView — Phase 3 Boss Challenge
 * Shows the dramatic scenario, objectives list, broken codebase in Monaco editor,
 * and runs the hidden test cases inline (no separate worker needed for missions).
 */
const MissionView = ({ mission, moduleColor, moduleId, onComplete }) => {
    const [phase, setPhase] = useState('briefing'); // 'briefing' | 'editor'
    const [code, setCode] = useState(mission.buggyCode);
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState(null);
    const { setCoins, setSkillGraph } = useStore();
    
    // AI Mentor State
    const [aiHint, setAiHint] = useState(null);
    const [isGeneratingHint, setIsGeneratingHint] = useState(false);

    // Reset when mission changes
    useEffect(() => {
        setPhase('briefing');
        setCode(mission.buggyCode);
        setResults(null);
        setAiHint(null);
    }, [moduleId, mission.buggyCode]);

    const handleRunCode = async () => {
        setIsRunning(true);
        setResults(null);
        setAiHint(null);

        const testResults = [];
        let allPassed = true;
        const logs = [];

        for (const test of mission.testCases) {
            try {
                // Replace ${code} placeholder in assertion with actual user code
                const assertion = test.assertion.replace('${code}', code);

                const combinedBody = `
                    const console = {
                        log: (...args) => { __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')); },
                        warn: () => {}, error: () => {}
                    };
                    ${assertion}
                `;
                const run = new AsyncFunction('assertEqual', '__logs', '__rawCode__', combinedBody);
                await run(assertEqual, logs, code);
                testResults.push({ description: test.description, passed: true });
            } catch (err) {
                allPassed = false;
                testResults.push({ description: test.description, passed: false, error: err.message });
            }
        }

        setIsRunning(false);
        setResults({ allPassed, testResults, logs });

        // Submit to backend
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const failedTags = !allPassed ? mission.microTags : [];
                const passedTags = allPassed ? mission.microTags : [];
                await fetch(`${import.meta.env.VITE_API_URL || ''}/api/challenges/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        topicId: mission.id || `mission-${moduleId}`,
                        passed: allPassed,
                        failedTags,
                        passedTags,
                        rewardCoins: mission.rewardCoins
                    })
                });

                // Refresh skill graph
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
            console.error("Failed to submit mission", error);
            alert("Database Connection Error! Ensure your MongoDB IP whitelist is set to 0.0.0.0/0 on Atlas. The backend is currently unreachable.");
        }

        if (allPassed) {
            setCoins(mission.rewardCoins);
            setTimeout(() => onComplete && onComplete(moduleId), 1500);
        }
    };

    const handleAskAI = async () => {
        if (!results || results.allPassed || isGeneratingHint) return;
        
        setIsGeneratingHint(true);
        setAiHint(null);

        try {
            const firstError = results.testResults.find(t => !t.passed)?.error || 'Unknown error occurred.';
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
                    topicTitle: mission.title
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

    // ── BRIEFING PHASE ──────────────────────────────────────────────────────────
    if (phase === 'briefing') {
        return (
            <div className="view-container mission-view">
                <div className="view-header">
                    <div className="phase-chip phase-chip--gold">
                        <Swords size={12} />
                        Phase 3 · Boss Mission — Tier {mission.tier}
                    </div>
                </div>

                <h1 className="view-title mission-title">
                    ⚔ {mission.title}
                </h1>

                {/* Scenario */}
                <div className="scenario-card">
                    <div className="scenario-label">THE SCENARIO</div>
                    <p className="scenario-text">{mission.scenario}</p>
                </div>

                {/* Objectives */}
                <div className="objectives-card">
                    <div className="objectives-label">
                        <Target size={14} />
                        Your Mission Objectives
                    </div>
                    <ul className="objectives-list">
                        {mission.objectives.map((obj, i) => (
                            <li key={i} className="objective-item">
                                <span className="objective-num">{i + 1}</span>
                                <span>{obj}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Reward Preview */}
                <div className="reward-preview">
                    <span className="reward-coins">🎁 +{mission.rewardCoins} coins</span>
                    <span className="reward-sub">Mystery Box unlocks on success</span>
                </div>

                <button
                    onClick={() => setPhase('editor')}
                    className="cta-btn mission-launch-btn"
                    style={{ '--btn-color': '#EF9F27' }}
                >
                    <Swords size={16} />
                    Accept the Mission
                </button>
            </div>
        );
    }

    // ── EDITOR PHASE ────────────────────────────────────────────────────────────
    return (
        <div className="mission-editor-layout">
            {/* Left: objectives panel */}
            <div className="mission-side-panel">
                <div className="phase-chip phase-chip--gold" style={{ marginBottom: '1rem' }}>
                    <Swords size={12} /> Boss Mission
                </div>
                <h2 className="mission-panel-title">{mission.title}</h2>

                <div className="objectives-mini">
                    {mission.objectives.map((obj, i) => (
                        <div key={i} className="objective-mini-item">
                            <span className="obj-mini-dot" />
                            <span>{obj}</span>
                        </div>
                    ))}
                </div>

                {/* Test Results */}
                {results && (
                    <div className="mission-results">
                        <div className="results-label">Test Results</div>
                        {results.testResults.map((t, i) => (
                            <div key={i} className={`result-item ${t.passed ? 'result-item--pass' : 'result-item--fail'}`}>
                                {t.passed
                                    ? <CheckCircle size={13} />
                                    : <XCircle size={13} />
                                }
                                <div>
                                    <div className="result-desc">{t.description}</div>
                                    {!t.passed && <div className="result-error">{t.error}</div>}
                                </div>
                            </div>
                        ))}

                        {results.allPassed && (
                            <div className="mission-success">
                                <div className="success-title">🏆 Mission Accomplished!</div>
                                <div className="success-sub">+{mission.rewardCoins} coins awarded</div>
                            </div>
                        )}
                        
                        {/* AI Mentor Trigger */}
                        {!results.allPassed && !aiHint && !isGeneratingHint && (
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
            </div>

            {/* Right: Monaco Editor */}
            <div className="mission-editor-panel">
                {/* Editor Top Bar */}
                <div className="editor-topbar">
                    <div className="editor-dots">
                        <span className="dot-r" /><span className="dot-y" /><span className="dot-g" />
                    </div>
                    <span className="editor-filename">mission.js</span>
                    <div className="editor-actions">
                        <button
                            onClick={() => setCode(mission.buggyCode)}
                            className="editor-reset-btn"
                            title="Reset to broken code"
                        >
                            <RotateCcw size={13} /> Reset
                        </button>
                        <button
                            onClick={handleRunCode}
                            disabled={isRunning}
                            className="editor-run-btn"
                        >
                            {isRunning
                                ? <><Loader2 size={14} className="spin" /> Running...</>
                                : <><Play size={14} /> Run Code</>
                            }
                        </button>
                    </div>
                </div>

                {/* Monaco */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
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
                    <span>Mission · Tier {mission.tier}</span>
                </div>
            </div>
        </div>
    );
};

export default MissionView;
