import React, { useEffect, useState } from 'react';
import { Target, Zap, ShieldAlert, Award, ChevronRight, Activity, Code2, Flame, Crosshair, Package, Play, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { curriculum } from '../data/curriculum';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import MysteryBoxModal from '../components/rewards/MysteryBoxModal';

const Dashboard = () => {
    const { user, coins, retentionScore, challengesDone, streak, mysteryBoxes, skillGraph, setSkillGraph, setCoins, setStats } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const [showMysteryBox, setShowMysteryBox] = useState(false);
    const navigate = useNavigate();

    const handleStartWarmup = () => {
        if (!skillGraph || !skillGraph.tags) {
            navigate('/learn');
            return;
        }

        const sortedTags = [...skillGraph.tags].sort((a, b) => b.weaknessScore - a.weaknessScore);
        const weakTags = sortedTags.filter(t => t.weaknessScore > 30);

        if (weakTags.length > 0) {
            const sequence = [];
            for (const weakTag of weakTags) {
                let found = false;
                for (const mod of curriculum.modules) {
                    for (const topic of mod.topics) {
                        if (topic.microTags.includes(weakTag.tagName)) {
                            sequence.push({ moduleId: mod.id, topicId: topic.id });
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
            }

            if (sequence.length > 0) {
                navigate('/learn', { state: { warmupSequence: sequence, currentWarmupIndex: 0 } });
                return;
            }
        }
        navigate('/learn');
    };

    useEffect(() => {
        const fetchGraph = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/progress/skill-graph`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success) {
                        setSkillGraph(data.skillGraph);
                        setCoins(data.coins);
                        // It's fine to just set Stats
                        setStats({
                            challengesDone: data.challengesDone,
                            streak: data.streak,
                            retentionScore: data.retentionScore,
                            mysteryBoxes: data.mysteryBoxes
                        });
                    }
                } catch (e) {
                    console.error("Failed to fetch graph", e);
                }
            }
            setIsLoading(false);
        };
        fetchGraph();
    }, [setSkillGraph, setStats]);

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-[#0E0F14]">
                <div className="animate-spin text-[#6C5CE7]"><Activity size={32} /></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center bg-[#0E0F14] text-gray-400">
                <Target size={48} className="mb-4 text-gray-600" />
                <h2 className="text-xl font-medium mb-2 text-white">Welcome to CodeCamp</h2>
                <p>Please log in to view your personalized dashboard.</p>
            </div>
        );
    }

    const tags = skillGraph?.tags || [];

    // Sort tags by weakness (descending for weak areas, ascending for strong)
    const sortedTags = [...tags].sort((a, b) => b.weaknessScore - a.weaknessScore);
    const weakTags = sortedTags.filter(t => t.weaknessScore > 30);
    const strongTags = [...tags].sort((a, b) => a.weaknessScore - b.weaknessScore).filter(t => t.weaknessScore <= 30);

    // Get dynamic missions from curriculum
    const allMissions = curriculum.modules.map(m => m.mission).filter(Boolean);

    // Helper to convert tag to a readable topic title
    const getTopicTitleForTag = (tagName) => {
        for (const mod of curriculum.modules) {
            for (const topic of mod.topics) {
                if (topic.microTags && topic.microTags.includes(tagName)) {
                    let title = topic.title;
                    // Shorten if it has a colon (like "The Output: console.log...")
                    if (title.includes(':')) {
                        title = title.split(':')[0];
                    }
                    // Truncate if too long for UI
                    return title.length > 30 ? title.substring(0, 30) + '...' : title;
                }
            }
        }
        return tagName; // fallback
    };

    // Prepare chart data
    const chartData = tags.map(tag => ({
        subject: getTopicTitleForTag(tag.tagName),
        A: Math.max(0, 100 - tag.weaknessScore),
        fullMark: 100
    }));
    if (chartData.length > 0 && chartData.length < 3) {
        chartData.push({ subject: 'Logic Basics', A: 0, fullMark: 100 });
        chartData.push({ subject: 'Syntax Basics', A: 0, fullMark: 100 });
    }

    // Determine Active Mission for Hero Banner
    const activeMissionIndex = allMissions.findIndex((m, i) => challengesDone < i * 5 + 5);
    const heroMission = activeMissionIndex !== -1 ? allMissions[activeMissionIndex] : null;

    // Dynamic Greeting based on local time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="h-full overflow-y-auto bg-[#0E0F14] text-white p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* ── Header Section ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#13141C] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C5CE7]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="z-10">
                        <h1 className="text-2xl md:text-3xl font-semibold text-[#EDEDED] flex items-center gap-2">
                            {greeting}, <span className="text-[#6C5CE7]">{user.name}</span> 👋
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">we will make you fall in ❤️ with coding.</p>
                    </div>
                    <div className="flex items-center gap-3 z-10">
                        <div className="flex items-center gap-2 bg-[#EF9F27]/10 border border-[#EF9F27]/20 px-4 py-2 rounded-full text-[#EF9F27] text-sm font-medium">
                            <Flame size={16} className="fill-current" />
                            {streak} Day Streak
                        </div>
                    </div>
                </div>

                {/* ── LEVEL 1 & 2: Asymmetric Hero Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEVEL 1 (50% Visual Weight): The Mission Center */}
                    <div className="lg:col-span-8 flex flex-col">
                        {heroMission ? (
                            <div className="bg-gradient-to-br from-[#6C5CE7]/20 via-[#6C5CE7]/10 to-transparent border border-[#6C5CE7]/30 p-8 rounded-2xl relative overflow-hidden flex-1 flex flex-col justify-between group hover:border-[#6C5CE7]/50 transition-all duration-500">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6C5CE7]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                                <div className="z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 bg-[#6C5CE7]/20 text-[#A89CFF] text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                                            <Sparkles size={12} /> Active Mission
                                        </span>
                                    </div>
                                    <h2 className="text-[35px] md:text-[42px] font-bold text-white mb-3 tracking-tight leading-tight">
                                        Start Learning Javascript
                                    </h2>
                                    <p className="text-gray-400 max-w-lg mb-8 text-sm md:text-base leading-relaxed">
                                        Start learning JavaScript in the most unique way that no one has taught you.
                                        Continue learning, continue growing. ❤️
                                    </p>
                                </div>
                                <div className="z-10">
                                    <Link to="/learn" className="inline-flex items-center justify-center gap-2 bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white text-sm font-semibold px-8 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#6C5CE7]/25 w-full sm:w-auto">
                                        <Play size={18} className="fill-current" /> Continue Learning
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 p-8 rounded-2xl flex-1 flex flex-col justify-center items-center text-center">
                                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                                    <Award size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">All Missions Complete!</h2>
                                <p className="text-gray-400">You have conquered the entire curriculum.</p>
                            </div>
                        )}
                    </div>

                    {/* LEVEL 2 & 3: Warmup & Stats */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* LEVEL 2 (25% Visual Weight): Warmup */}
                        <div className="bg-gradient-to-br from-[#1A1B25] to-[#13141C] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors flex-1 flex flex-col justify-center">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-12 h-12 rounded-xl bg-[#5DCAA5]/10 text-[#5DCAA5] flex items-center justify-center shrink-0">
                                    <Zap size={24} className="fill-current" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white leading-tight">Daily Warm-Up</h3>
                                    <p className="text-xs text-gray-500 mt-1">Targeted challenges based on your weak topics.</p>
                                </div>
                            </div>
                            <button
                                onClick={handleStartWarmup}
                                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                Start Warm-Up <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* LEVEL 3 (13% Visual Weight): Coins & Challenges */}
                        <div className="grid grid-cols-2 gap-4 h-[100px]">
                            <div className="bg-[#1A1B25] border border-white/5 p-4 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#FAC775]/30 transition-colors">
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Award size={64} className="text-[#FAC775]" />
                                </div>
                                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FAC775]"></span> 🪙 Coins
                                </div>
                                <div className="text-2xl font-black text-white">{coins}</div>
                            </div>
                            <div className="bg-[#1A1B25] border border-white/5 p-4 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#3B82F6]/30 transition-colors">
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Code2 size={64} className="text-[#3B82F6]" />
                                </div>
                                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span> Challenges
                                    Completed
                                </div>
                                <div className="text-2xl font-black text-white">{challengesDone}</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Mystery Box Banner (Contextual) */}
                {mysteryBoxes > 0 && (
                    <div className="bg-gradient-to-r from-[#FAC775]/20 to-transparent border border-[#FAC775]/30 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#FAC775]/20 text-[#FAC775] flex items-center justify-center shrink-0">
                                <Package size={16} className="fill-current" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Mystery Box Unlocked!</h3>
                                <p className="text-[10px] text-[#FAC775]/80">You have {mysteryBoxes} unopened box(es).</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowMysteryBox(true)}
                            className="bg-[#FAC775] hover:bg-[#eab365] text-gray-900 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                        >
                            Open
                        </button>
                    </div>
                )}

                {/* ── LEVEL 4: Analytics Grid ── */}
                <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Skill Radar - Largest (lg:col-span-7) */}
                        <div className="lg:col-span-7 bg-gradient-to-b from-[#1A1B25] to-[#13141C] border border-white/5 p-6 md:p-8 rounded-3xl relative overflow-hidden group hover:border-[#5DCAA5]/40 transition-all duration-700 hover:shadow-[0_10px_40px_-15px_rgba(93,202,165,0.2)]">
                            <h3 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2">
                                <Activity size={16} className="text-[#5DCAA5] group-hover:scale-125 transition-transform duration-500" /> Skill Radar
                            </h3>
                            <div className="h-[280px] w-full">
                                {chartData.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-xs text-gray-500 italic">Complete challenges to build graph.</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6C5CE7', fontSize: 10 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Accuracy" dataKey="A" stroke="#5DCAA5" fill="#5DCAA5" fillOpacity={0.25} />
                                            <Tooltip contentStyle={{ backgroundColor: '#13141C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', padding: '12px' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Right side container - lg:col-span-5 */}
                        <div className="lg:col-span-5 flex flex-col gap-6">

                            {/* Needs Work - Second Largest */}
                            <div className="flex-1 bg-gradient-to-br from-[#1A1B25] to-[#13141C] border border-white/5 p-6 rounded-3xl group hover:border-[#E24B4A]/40 transition-all duration-500 hover:shadow-[0_10px_30px_-10px_rgba(226,75,74,0.15)] flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-[#E24B4A]/5 rounded-full blur-[40px] group-hover:bg-[#E24B4A]/10 transition-colors duration-700"></div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2 relative z-10">
                                    <div className="w-2 h-2 rounded-full bg-[#E24B4A] animate-pulse"></div> Needs Work
                                </h4>
                                {weakTags.length > 0 ? (
                                    <div className="space-y-4 relative z-10">
                                        {weakTags.slice(0, 3).map((t, i) => (
                                            <div key={i} className="flex flex-col gap-1.5 group/item">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-semibold text-gray-300 group-hover/item:text-white transition-colors">{getTopicTitleForTag(t.tagName)}</span>
                                                    <span className="text-xs text-[#E24B4A] font-bold">{Math.max(0, 100 - t.weaknessScore)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#E24B4A] rounded-full" style={{ width: `${Math.max(0, 100 - t.weaknessScore)}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-600 italic relative z-10">No weak areas yet. You're doing great!</div>
                                )}
                            </div>

                            {/* Row for Strong Areas */}
                            <div className="h-[140px] flex">

                                {/* Strong Areas - Now Full Width */}
                                <div className="flex-1 bg-[#1A1B25] border border-white/5 p-5 rounded-3xl group hover:border-[#5DCAA5]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(93,202,165,0.1)] flex flex-col justify-center">
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5]"></div> Strong Areas
                                    </h4>
                                    {strongTags.length > 0 ? (
                                        <div className="space-y-3">
                                            {strongTags.slice(0, 2).map((t, i) => (
                                                <div key={i} className="flex justify-between items-center">
                                                    <span className="text-xs font-medium text-gray-300 truncate pr-2">{getTopicTitleForTag(t.tagName)}</span>
                                                    <span className="text-[10px] text-[#5DCAA5] font-bold">{Math.max(0, 100 - t.weaknessScore)}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-gray-600 italic">No strong areas yet.</div>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {showMysteryBox && <MysteryBoxModal onClose={() => setShowMysteryBox(false)} />}
        </div>
    );
};

export default Dashboard;