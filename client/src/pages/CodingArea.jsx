import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '../components/CodeEditor';
import { CheckCircle, XCircle, AlertTriangle, Tag, Coins, ChevronLeft, ChevronRight, Loader2, ChevronDown, ChevronUp, Terminal, FlaskConical, Sparkles, Clock, Target, Zap } from 'lucide-react';
import useStore from '../store/useStore';
import { getChallenges, submitChallengeResult } from '../services/api';

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Skeleton loader shown while the challenge is fetching from the API */
const ChallengeSkeleton = () => (
    <div className="flex h-full flex-col lg:flex-row bg-gray-950 p-4 gap-4 animate-pulse">
        <div className="flex-1 flex flex-col gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="h-8 bg-gray-800 rounded w-3/5 mb-4" />
                <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                <div className="h-4 bg-gray-800 rounded w-4/5 mb-2" />
                <div className="h-4 bg-gray-800 rounded w-2/3" />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg flex-1 p-6">
                <div className="h-6 bg-gray-800 rounded w-1/3 mb-4" />
            </div>
        </div>
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg h-[600px] lg:h-auto" />
    </div>
);

/** Error state shown when the API call fails */
const ErrorState = ({ message, onRetry }) => (
    <div className="flex h-full items-center justify-center bg-gray-950">
        <div className="text-center bg-gray-900 border border-red-900/50 rounded-xl p-10 max-w-md">
            <XCircle className="text-red-400 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-white mb-2">Could Not Load Challenge</h2>
            <p className="text-gray-400 text-sm mb-6">{message}</p>
            <button
                onClick={onRetry}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
                Retry
            </button>
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const CodingArea = () => {
    // Challenge list from the API
    const [challenges, setChallenges]         = useState([]);
    const [currentIndex, setCurrentIndex]     = useState(0);
    const [isLoading, setIsLoading]           = useState(true);
    const [fetchError, setFetchError]         = useState(null);

    // Execution state driven by the Web Worker
    const [executionResult, setExecutionResult] = useState(null);
    const [isRunning, setIsRunning]             = useState(false);

    // Submission state (to the backend)
    const [isSubmitting, setIsSubmitting]     = useState(false);
    const [submitMessage, setSubmitMessage]   = useState(null);

    // Ref to hold the Web Worker instance
    const workerRef = useRef(null);

    const { addCoins, user } = useStore();

    // Split Pane State
    const [leftPaneWidth, setLeftPaneWidth] = useState(45);
    const isDraggingRef = useRef(false);
    const containerRef = useRef(null);

    // Editor Environment State
    const [hintOpen, setHintOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('tests'); // 'console' | 'tests' | 'ai'
    const [aiHint, setAiHint] = useState(null);
    const [isGeneratingHint, setIsGeneratingHint] = useState(false);
    const [lastRunCode, setLastRunCode] = useState("");

    // Vertical Split Pane State (Right Side)
    const [topPaneHeight, setTopPaneHeight] = useState(65);
    const isVerticalDraggingRef = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            
            // Horizontal resizing (Left/Right panes)
            if (isDraggingRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const newWidthPct = ((e.clientX - containerRect.left) / containerRect.width) * 100;
                if (newWidthPct >= 20 && newWidthPct <= 80) setLeftPaneWidth(newWidthPct);
            }

            // Vertical resizing (Editor/Terminal panes)
            if (isVerticalDraggingRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const newHeightPct = ((e.clientY - containerRect.top) / containerRect.height) * 100;
                if (newHeightPct >= 20 && newHeightPct <= 80) setTopPaneHeight(newHeightPct);
            }
        };
        
        const handleMouseUp = () => {
            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
            if (isVerticalDraggingRef.current) {
                isVerticalDraggingRef.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleResizerMouseDown = () => {
        isDraggingRef.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    const handleVerticalResizerMouseDown = () => {
        isVerticalDraggingRef.current = true;
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
    };

    const handleAskAI = async () => {
        if (!executionResult || !user?.token) return;
        setActiveTab('ai');
        setIsGeneratingHint(true);
        setAiHint(null);

        try {
            const errorOutput = executionResult.testResults
                .filter(t => !t.passed)
                .map(t => `${t.description}: ${t.error}`)
                .join('\n');

            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ai/hint`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${user.token}` 
                },
                body: JSON.stringify({ 
                    code: lastRunCode, 
                    errorOutput, 
                    topicTitle: challenges[currentIndex].title 
                })
            });
            
            const data = await res.json();
            if(data.success) {
                setAiHint(data.hint);
            } else {
                setAiHint(`Sorry, AI Mentor is unavailable right now.\nError: ${data.message}`);
            }
        } catch (err) {
            setAiHint("Failed to connect to AI Mentor.");
        } finally {
            setIsGeneratingHint(false);
        }
    };

    // ── Fetch challenges on mount ──────────────────────────────────────────────
    const fetchChallenges = async () => {
        setIsLoading(true);
        setFetchError(null);
        setExecutionResult(null);
        setSubmitMessage(null);

        try {
            const data = await getChallenges();
            if (!data.challenges || data.challenges.length === 0) {
                throw new Error('No challenges found in the database. Please run the seed script.');
            }
            setChallenges(data.challenges);
        } catch (err) {
            setFetchError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    // ── Spin up / tear down the Web Worker ────────────────────────────────────
    useEffect(() => {
        workerRef.current = new Worker(
            new URL('../workers/codeWorker.js', import.meta.url),
            { type: 'module' }
        );

        workerRef.current.onmessage = async (e) => {
            const result = e.data;
            setIsRunning(false);
            setExecutionResult(result);

            // ── Auto-submit the result to the backend ──────────────────────────
            const currentChallenge = challenges[currentIndex];
            if (!currentChallenge) return;

            // Determine which micro-tags to penalise (only on failure)
            const passed = result.success && result.allPassed;

            if (passed && !user?.token) {
                // Reward coins locally via Zustand immediately if not logged in
                addCoins(currentChallenge.rewardCoins || 10);
            }

            // Only submit to backend if user is logged in
            if (user?.token) {
                setIsSubmitting(true);
                try {
                    const failedTags = passed ? [] : currentChallenge.microTags || [];
                    const serverResponse = await submitChallengeResult(
                        currentChallenge._id,
                        passed,
                        failedTags,
                        user.token
                    );
                    setSubmitMessage(serverResponse.message);

                    if (passed && serverResponse.isFirstTime) {
                        addCoins(currentChallenge.rewardCoins || 10);
                    }
                } catch (err) {
                    // Non-critical — UI still shows test results even if submit fails
                    console.warn('Submission to backend failed:', err.message);
                } finally {
                    setIsSubmitting(false);
                }
            }
        };

        workerRef.current.onerror = (e) => {
            setIsRunning(false);
            setExecutionResult({ success: false, error: `Worker error: ${e.message}` });
        };

        return () => {
            workerRef.current?.terminate();
        };
    // Re-create worker when challenges load (so the onmessage closure has fresh data)
    }, [challenges, currentIndex, addCoins, user]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleRunCode = (code) => {
        if (!workerRef.current) return;
        setIsRunning(true);
        setExecutionResult(null);
        setSubmitMessage(null);
        setLastRunCode(code);

        const currentChallenge = challenges[currentIndex];
        workerRef.current.postMessage({
            id:    Date.now(),
            code,
            tests: currentChallenge?.testCases || []
        });
    };

    const handlePrevChallenge = () => {
        setCurrentIndex(i => Math.max(0, i - 1));
        setExecutionResult(null);
        setSubmitMessage(null);
    };

    const handleNextChallenge = () => {
        setCurrentIndex(i => Math.min(challenges.length - 1, i + 1));
        setExecutionResult(null);
        setSubmitMessage(null);
    };

    // ── Render Guards ─────────────────────────────────────────────────────────
    if (isLoading) return <ChallengeSkeleton />;
    if (fetchError) return <ErrorState message={fetchError} onRetry={fetchChallenges} />;

    const challenge = challenges[currentIndex];

    // ── Main UI ───────────────────────────────────────────────────────────────
    return (
        <div className="flex h-full flex-col bg-[#0E0F14] text-white">

            {/* ── Top Bar: challenge navigation ── */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#13141C] border-b border-white/5 flex-shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
                        Mission Progress
                        <span className="font-mono text-[#A89CFF] tracking-widest ml-2">
                            {(() => {
                                const progress = ((currentIndex) / challenges.length) * 100;
                                const totalBlocks = 10;
                                const filledBlocks = Math.round((progress / 100) * totalBlocks);
                                return (
                                    "█".repeat(filledBlocks) + "░".repeat(totalBlocks - filledBlocks) + ` ${Math.round(progress)}%`
                                );
                            })()}
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevChallenge}
                        disabled={currentIndex === 0}
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Previous Challenge"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={handleNextChallenge}
                        disabled={currentIndex === challenges.length - 1}
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Next Challenge"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* ── Body: split panel ── */}
            <div className="flex flex-1 overflow-hidden" ref={containerRef}>

                {/* LEFT: Problem */}
                <div 
                    className="flex flex-col bg-[#111218]" 
                    style={{ width: `${leftPaneWidth}%` }}
                >
                    <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10">
                        {/* Mission type badge */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-[#EF9F27]/15 text-[#EF9F27] border border-[#EF9F27]/30 shadow-[0_0_10px_rgba(239,159,39,0.1)]">
                                MISSION
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-[#5DCAA5]/10 text-[#5DCAA5] border border-[#5DCAA5]/20">
                                <Zap size={12} /> +{challenge.rewardCoins} XP
                            </span>
                        </div>

                        <h1 className="text-[24px] font-bold text-white mb-2 leading-tight">{challenge.title}</h1>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                                <Target size={12}/> Medium
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                                <Clock size={12}/> 7 min
                            </span>
                        </div>

                        <p className="text-gray-300 text-[14px] leading-relaxed mb-6">{challenge.description}</p>

                        {/* Interactive Tags */}
                        {challenge.microTags && challenge.microTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {challenge.microTags.map(tag => (
                                    <div key={tag} className="relative group inline-block">
                                        <span className="inline-flex items-center px-3 py-1 bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 rounded-full text-[11px] font-semibold text-[#A89CFF] cursor-default transition-colors group-hover:bg-[#6C5CE7]/20 group-hover:border-[#6C5CE7]/40">
                                            {tag}
                                        </span>
                                        <div className="absolute bottom-[120%] left-1/2 -translate-x-1/2 bg-[#252630] border border-white/10 px-3 py-2 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl whitespace-nowrap z-20">
                                            <div className="text-[11px] font-bold text-white mb-0.5">Accuracy: {Math.floor(Math.random() * 40 + 50)}%</div>
                                            <div className="text-[10px] text-gray-400">Practice Available</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Concept hint accordion */}
                        <div className="bg-transparent border border-white/10 rounded-lg overflow-hidden">
                            <button 
                                className="w-full flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 transition-colors text-[13px] font-semibold text-white cursor-pointer border-none"
                                onClick={() => setHintOpen(!hintOpen)}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-sm">💡</span> Concept Hint
                                </span>
                                {hintOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {hintOpen && (
                                <div className="p-4 bg-black/20 border-t border-white/5 text-[13px] text-gray-400 leading-relaxed">
                                    Pay close attention to the micro-tags on this challenge — they point directly
                                    to the JavaScript concept you need to apply. Think about what each method or
                                    keyword is <strong className="text-white">actually supposed to do</strong> before editing the code.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* DRAGGABLE DIVIDER */}
                <div 
                    className="w-[6px] bg-[#0E0F14] cursor-col-resize flex justify-center items-center hover:bg-white/5 active:bg-white/5 transition-colors z-10 group"
                    onMouseDown={handleResizerMouseDown}
                >
                    <div className="w-[2px] h-[40px] bg-white/10 rounded-sm group-hover:bg-[#EF9F27]/50 transition-colors"></div>
                </div>

                {/* RIGHT: Editor + Output */}
                <div 
                    className="flex flex-col bg-[#1E1E1E]" 
                    style={{ width: `${100 - leftPaneWidth}%` }}
                >
                    {/* Editor Area */}
                    <div className="flex-col flex" style={{ height: `${topPaneHeight}%` }}>
                        <CodeEditor
                            key={challenge._id}
                            initialCode={challenge.buggyCode}
                            onRun={handleRunCode}
                            isRunning={isRunning}
                        />
                    </div>

                    {/* DRAGGABLE HORIZONTAL DIVIDER */}
                    <div 
                        className="h-[6px] bg-[#0E0F14] cursor-row-resize flex justify-center items-center hover:bg-white/5 active:bg-white/5 transition-colors z-10 group"
                        onMouseDown={handleVerticalResizerMouseDown}
                    >
                        <div className="h-[2px] w-[40px] bg-white/10 rounded-sm group-hover:bg-[#EF9F27]/50 transition-colors"></div>
                    </div>

                    {/* Output Tabs */}
                    <div className="flex-1 flex flex-col bg-[#18181B] border-t border-black/50 min-h-[50px]">
                        <div className="flex bg-[#1E1E1E] border-b border-black/50 px-4">
                            <button 
                                className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'console' ? 'border-[#6C5CE7] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                onClick={() => setActiveTab('console')}
                            >
                                <Terminal size={14} /> Console
                            </button>
                            <button 
                                className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'tests' ? 'border-[#6C5CE7] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'} ${executionResult?.allPassed ? '!text-[#5DCAA5]' : executionResult ? '!text-[#E24B4A]' : ''}`}
                                onClick={() => setActiveTab('tests')}
                            >
                                <FlaskConical size={14} /> Tests
                            </button>
                            <button 
                                className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'ai' ? 'border-[#6C5CE7] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'} ${aiHint ? '!text-[#A89CFF]' : ''}`}
                                onClick={() => setActiveTab('ai')}
                            >
                                <Sparkles size={14} /> AI Mentor
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
                            
                            {activeTab === 'console' && (
                                <div className="h-full">
                                    {executionResult?.logs && executionResult.logs.length > 0 ? (
                                        <div className="font-mono text-xs text-gray-300 space-y-1">
                                            {executionResult.logs.map((log, i) => (
                                                <div key={i}>&gt; {log}</div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-gray-600 text-[12px] font-mono">No console output...</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'tests' && (
                                <div className="flex flex-col h-full gap-2">
                                    {!executionResult ? (
                                        <div className="text-gray-600 text-[12px] font-mono">Run your code to see results here.</div>
                                    ) : (
                                        <>
                                            {executionResult.testResults.map((test, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`p-3 rounded-md border flex items-start gap-3 text-[13px] bg-white/5
                                                        ${test.passed
                                                            ? 'border-l-4 border-l-[#5DCAA5] border-transparent'
                                                            : 'border-l-4 border-l-[#E24B4A] border-transparent bg-[#E24B4A]/5'}
                                                    `}
                                                >
                                                    {test.passed
                                                        ? <CheckCircle size={15} className="mt-0.5 flex-shrink-0 text-[#5DCAA5]" />
                                                        : <XCircle    size={15} className="mt-0.5 flex-shrink-0 text-[#E24B4A]" />
                                                    }
                                                    <div>
                                                        <div className="font-medium text-gray-200">{test.description}</div>
                                                        {!test.passed && test.error && (
                                                            <div className="text-[11px] mt-1 text-[#E24B4A] font-mono">{test.error}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {executionResult.allPassed && (
                                                <div className="mt-2 p-4 bg-[#5DCAA5]/10 border border-[#5DCAA5]/20 rounded-lg flex items-center justify-between shadow-[0_0_20px_rgba(93,202,165,0.1)] animate-fade-in">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#5DCAA5]/20 flex items-center justify-center animate-bounce-short">
                                                            <CheckCircle size={16} className="text-[#5DCAA5]" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[13px] font-bold text-white tracking-wide">MISSION ACCOMPLISHED!</div>
                                                            <div className="text-[11px] text-[#5DCAA5] mt-0.5">+{challenge.rewardCoins} XP Earned</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {!executionResult.allPassed && !aiHint && !isGeneratingHint && (
                                                <button 
                                                    className="inline-flex items-center self-start gap-2 mt-2 px-4 py-2 bg-[#6C5CE7]/10 text-[#A89CFF] border border-[#6C5CE7]/30 border-dashed rounded-md text-[12px] font-medium hover:bg-[#6C5CE7]/20 hover:shadow-[0_0_15px_rgba(108,92,231,0.15)] transition-all"
                                                    onClick={handleAskAI}
                                                >
                                                    <Sparkles size={14} className="animate-pulse" /> Failed tests? Ask AI Mentor for a hint
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {activeTab === 'ai' && (
                                <div className="h-full">
                                    {!aiHint && !isGeneratingHint ? (
                                        <div className="text-gray-600 text-[12px] font-mono">Run tests first, or click "Ask AI Mentor" on failed tests.</div>
                                    ) : isGeneratingHint ? (
                                        <div className="flex items-center gap-2 text-[#A89CFF] text-[13px] font-mono animate-pulse">
                                            <Sparkles size={14} className="animate-spin" /> AI is analyzing your code...
                                        </div>
                                    ) : (
                                        <div className="text-[13px] text-gray-300 leading-relaxed animate-fade-in" dangerouslySetInnerHTML={{ __html: aiHint.replace(/`([^`]+)`/g, '<code class="bg-[#6C5CE7]/15 text-[#A89CFF] px-1.5 py-0.5 rounded font-mono text-[12px]">$1</code>').replace(/\n/g, '<br/>') }} />
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CodingArea;
