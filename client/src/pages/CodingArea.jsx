import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '../components/CodeEditor';
import { CheckCircle, XCircle, AlertTriangle, Tag, Coins, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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

            if (passed) {
                // Reward coins locally via Zustand
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
        <div className="flex h-full flex-col bg-gray-950">

            {/* ── Top Bar: challenge navigation ── */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                        Mission
                    </span>
                    <span className="text-sm font-bold text-white">
                        {currentIndex + 1} / {challenges.length}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevChallenge}
                        disabled={currentIndex === 0}
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Previous Challenge"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={handleNextChallenge}
                        disabled={currentIndex === challenges.length - 1}
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Next Challenge"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* ── Body: split panel ── */}
            <div className="flex flex-1 flex-col lg:flex-row overflow-hidden p-4 gap-4">

                {/* LEFT: Problem + Output */}
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">

                    {/* Problem Statement */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm flex-shrink-0">
                        {/* Mission type badge */}
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                                ${challenge.missionType === 'Boss'    ? 'bg-red-900/60 text-red-300'     : ''}
                                ${challenge.missionType === 'Curious' ? 'bg-purple-900/60 text-purple-300' : ''}
                                ${challenge.missionType === 'Concept' ? 'bg-blue-900/60 text-blue-300'   : ''}
                                ${challenge.missionType === 'Warmup'  ? 'bg-green-900/60 text-green-300' : ''}
                            `}>
                                {challenge.missionType}
                            </span>
                            <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                                <Coins size={15} />
                                +{challenge.rewardCoins} coins
                            </span>
                        </div>

                        <h1 className="text-xl font-bold text-white mb-3">{challenge.title}</h1>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">{challenge.description}</p>

                        {/* Micro-tags */}
                        {challenge.microTags && challenge.microTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {challenge.microTags.map(tag => (
                                    <span
                                        key={tag}
                                        className="flex items-center gap-1 bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full border border-gray-700"
                                    >
                                        <Tag size={10} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Concept hint box */}
                        <div className="mt-5 bg-blue-950/30 border border-blue-800/40 rounded-lg p-4">
                            <h3 className="text-blue-400 font-semibold mb-1 flex items-center gap-2 text-sm">
                                <AlertTriangle size={14} /> Concept Hint
                            </h3>
                            <p className="text-blue-200 text-xs leading-relaxed">
                                Pay close attention to the micro-tags on this challenge — they point directly
                                to the JavaScript concept you need to apply. Think about what each method or
                                keyword is <strong>actually supposed to do</strong> before editing the code.
                            </p>
                        </div>
                    </div>

                    {/* Execution Output Panel */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl flex-1 p-6 flex flex-col min-h-[200px]">
                        <h2 className="text-base font-semibold text-white border-b border-gray-800 pb-2 mb-4 flex items-center gap-2">
                            Execution Output
                            {isSubmitting && (
                                <span className="flex items-center gap-1 text-xs text-gray-500 font-normal">
                                    <Loader2 size={12} className="animate-spin" />
                                    Syncing with server...
                                </span>
                            )}
                        </h2>

                        {isRunning ? (
                            <div className="flex flex-col items-center justify-center h-32 gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                                <span className="text-gray-500 text-sm">Running your code securely...</span>
                            </div>

                        ) : executionResult ? (
                            <div className="space-y-3">
                                {/* Syntax / runtime error from the worker */}
                                {!executionResult.success ? (
                                    <div className="bg-red-950/40 border border-red-900 rounded-lg p-4 text-red-400 font-mono text-xs whitespace-pre-wrap">
                                        <div className="text-red-300 font-bold mb-1">Runtime Error</div>
                                        {executionResult.error}
                                    </div>
                                ) : (
                                    <>
                                        {/* Console logs */}
                                        {executionResult.logs && executionResult.logs.length > 0 && (
                                            <div className="bg-gray-950 border border-gray-700 rounded-lg p-4 font-mono text-xs text-gray-300">
                                                <div className="text-gray-500 mb-2 text-xs uppercase tracking-wider">Console</div>
                                                {executionResult.logs.map((log, i) => (
                                                    <div key={i} className="text-gray-300">&gt; {log}</div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Individual test results */}
                                        <div className="space-y-2">
                                            {executionResult.testResults.map((test, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`p-3 rounded-lg border flex items-start gap-3 text-sm
                                                        ${test.passed
                                                            ? 'bg-green-950/20 border-green-900/50 text-green-300'
                                                            : 'bg-red-950/20 border-red-900/50 text-red-300'}
                                                    `}
                                                >
                                                    {test.passed
                                                        ? <CheckCircle size={17} className="mt-0.5 flex-shrink-0" />
                                                        : <XCircle    size={17} className="mt-0.5 flex-shrink-0" />
                                                    }
                                                    <div>
                                                        <div className="font-medium">{test.description}</div>
                                                        {!test.passed && (
                                                            <div className="text-xs mt-1 opacity-75 font-mono">{test.error}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* All passed — Mission Accomplished */}
                                        {executionResult.allPassed && (
                                            <div className="mt-4 p-5 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-xl text-center">
                                                <CheckCircle className="text-green-400 mx-auto mb-2" size={32} />
                                                <h3 className="text-lg font-bold text-green-300 mb-1">Mission Accomplished!</h3>
                                                <p className="text-green-200 text-sm">
                                                    All test cases passed. +{challenge.rewardCoins} coins added.
                                                </p>
                                                {submitMessage && (
                                                    <p className="text-green-400/70 text-xs mt-2">{submitMessage}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Some failed — Try Again */}
                                        {!executionResult.allPassed && (
                                            <div className="mt-4 p-4 bg-red-950/20 border border-red-900/30 rounded-xl text-center">
                                                <p className="text-red-300 text-sm font-medium">
                                                    Some tests failed. Study the errors above and try again.
                                                </p>
                                                {submitMessage && (
                                                    <p className="text-red-400/60 text-xs mt-1">{submitMessage}</p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                        ) : (
                            <div className="text-gray-600 text-sm text-center py-10">
                                Run your code to see results here.
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Monaco Editor */}
                <div className="flex-1 h-[600px] lg:h-auto border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                    <CodeEditor
                        key={challenge._id}
                        initialCode={challenge.buggyCode}
                        onRun={handleRunCode}
                        isRunning={isRunning}
                    />
                </div>
            </div>
        </div>
    );
};

export default CodingArea;
