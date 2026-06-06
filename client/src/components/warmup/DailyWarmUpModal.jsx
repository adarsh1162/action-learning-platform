import React, { useEffect, useState } from 'react';
import { Zap, Loader2, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import useStore from '../../store/useStore';

const DailyWarmUpModal = ({ onClose }) => {
    const { user } = useStore();
    const [warmupData, setWarmupData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [code, setCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchWarmup = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/warmup/daily`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.needsWarmup && data.challenges.length > 0) {
                    setWarmupData(data);
                    setCode(data.challenges[0].buggyCode);
                } else {
                    onClose(); // No warmup needed
                }
            } catch (error) {
                console.error("Failed to fetch warmup:", error);
                onClose(); // Failsafe: close modal on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchWarmup();
    }, [onClose]);

    const handleRunCode = async () => {
        if (!warmupData || isRunning) return;
        setIsRunning(true);
        setTestResults(null);
        
        const challenge = warmupData.challenges[0];
        
        // Simulating the worker run here (since we can't easily import the worker cleanly here without same setup)
        // Note: For a real app, you'd extract the worker logic into a shared utility hook.
        // For this milestone, we'll instantiate a quick worker.
        const worker = new Worker(new URL('../../workers/codeWorker.js', import.meta.url), { type: 'module' });
        
        const tests = challenge.testCases.map(t => ({
            ...t,
            assertion: t.assertion.replace(/\$\{code\}/g, code).replace(/__userCode__/g, code).replace(/__rawCode__/g, JSON.stringify(code))
        }));

        worker.postMessage({ code, tests, id: 'warmup' });
        
        worker.onmessage = async (e) => {
            const result = e.data;
            setTestResults(result);
            worker.terminate();
            setIsRunning(false);

            if (result.allPassed) {
                setShowSuccess(true);
                try {
                    const token = localStorage.getItem('token');
                    await fetch(`${import.meta.env.VITE_API_URL || ''}/api/warmup/submit`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` 
                        },
                        body: JSON.stringify({ passedTags: warmupData.weakTags })
                    });
                } catch (err) {
                    console.error("Failed to submit warmup", err);
                }
                
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        };
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 bg-[#0E0F14]/90 backdrop-blur-sm flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-[#6C5CE7]" />
            </div>
        );
    }

    if (!warmupData) return null;

    const challenge = warmupData.challenges[0];

    return (
        <div className="fixed inset-0 z-50 bg-[#0E0F14]/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#1A1B25] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-[#6C5CE7]/20 to-transparent border-b border-white/5 p-6 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C5CE7]/10 rounded-full blur-[40px] -translate-y-1/2"></div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] text-white flex items-center justify-center">
                            <Zap size={18} className="fill-current" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Daily Warm-Up</h2>
                    </div>
                    <p className="text-gray-400 text-sm">
                        You're struggling with <span className="text-[#A89CFF] font-semibold">{warmupData.weakTags.join(', ')}</span>. 
                        Complete this quick challenge to unlock the platform.
                    </p>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col min-h-[400px]">
                    <div className="p-4 border-b border-white/5 bg-[#13141C]">
                        <h3 className="text-sm font-semibold text-gray-200 mb-1">{challenge.title}</h3>
                        <p className="text-xs text-gray-500">{challenge.description}</p>
                    </div>

                    <div className="flex-1 relative">
                        <div className="absolute inset-0">
                            <Editor
                                height="100%"
                                defaultLanguage="javascript"
                                theme="vs-dark"
                                value={code}
                                onChange={val => setCode(val || '')}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    fontFamily: "'Fira Code', Consolas, monospace",
                                    padding: { top: 16 },
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                }}
                            />
                        </div>
                    </div>

                    {/* Results Area */}
                    {testResults && (
                        <div className="bg-[#0E0F14] border-t border-white/5 p-4 max-h-48 overflow-y-auto">
                            {testResults.testResults?.map((t, i) => (
                                <div key={i} className={`flex items-start gap-3 p-2 rounded-lg mb-2 ${t.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                    {t.passed ? <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />}
                                    <div>
                                        <div className={`text-xs ${t.passed ? 'text-green-400' : 'text-red-400'}`}>{t.description}</div>
                                        {!t.passed && t.error && <div className="text-[10px] text-red-400/70 mt-1 font-mono break-all">{t.error}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="bg-[#13141C] border-t border-white/5 p-4 flex items-center justify-between">
                    <button 
                        onClick={() => setCode(challenge.buggyCode)}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                        <RotateCcw size={14} /> Reset Code
                    </button>
                    
                    <button 
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="bg-[#6C5CE7] hover:bg-[#5b4cdb] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#6C5CE7]/20"
                    >
                        {isRunning ? <><Loader2 size={16} className="animate-spin" /> Running...</> : <><Play size={16} className="fill-current" /> Submit & Unlock</>}
                    </button>
                </div>

                {/* Success Overlay */}
                {showSuccess && (
                    <div className="absolute inset-0 bg-[#0E0F14]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in">
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Warm-Up Complete!</h2>
                        <p className="text-gray-400">Your memory has been reinforced. Platform unlocking...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyWarmUpModal;
