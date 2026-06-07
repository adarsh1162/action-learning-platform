import React, { useEffect, useState } from 'react';
import { Target, Zap, ShieldAlert, Award, ChevronRight, Activity, Code2, Flame, Crosshair } from 'lucide-react';
import useStore from '../store/useStore';
import { Link } from 'react-router-dom';
import { curriculum } from '../data/curriculum';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import MysteryBoxModal from '../components/rewards/MysteryBoxModal';

const Dashboard = () => {
    const { user, coins, retentionScore, challengesDone, streak, mysteryBoxes, skillGraph, setSkillGraph, setCoins, setStats } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const [showMysteryBox, setShowMysteryBox] = useState(false);

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

    return (
        <div className="h-full overflow-y-auto bg-[#0E0F14] text-white p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#13141C] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C5CE7]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="z-10">
                        <h1 className="text-2xl md:text-3xl font-semibold text-[#EDEDED] flex items-center gap-2">
                            Good morning, <span className="text-[#6C5CE7]">{user.name}</span> 👋
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Your command center is ready for today's mission.</p>
                    </div>
                    <div className="flex items-center gap-3 z-10">
                        <div className="flex items-center gap-2 bg-[#EF9F27]/10 border border-[#EF9F27]/20 px-4 py-2 rounded-full text-[#EF9F27] text-sm font-medium">
                            <Flame size={16} className="fill-current" />
                            {streak} Day Streak
                        </div>
                    </div>
                </div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#1A1B25] border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Code2 size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Challenges Done</div>
                            <div className="text-2xl font-bold text-gray-100">{challengesDone}</div>
                        </div>
                    </div>
                    <div className="bg-[#1A1B25] border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-[#FAC775]/10 flex items-center justify-center text-[#FAC775]">
                            <Award size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Total Coins</div>
                            <div className="text-2xl font-bold text-gray-100">{coins}</div>
                        </div>
                    </div>
                    <div className="bg-[#1A1B25] border border-white/5 p-5 rounded-2xl flex flex-col justify-center hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Retention Score</div>
                            <span className="text-xl font-bold text-[#EF9F27]">{retentionScore}/100</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className="h-full rounded-full bg-gradient-to-r from-[#EF9F27] to-[#FAC775]" 
                                style={{ width: `${retentionScore}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Left Col: Skill Radar & Weaknesses */}
                    <div className="space-y-6">
                        <div className="bg-[#1A1B25] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-[50px]"></div>
                            <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                                <Activity size={16} className="text-[#5DCAA5]" />
                                Skill Radar
                            </h3>
                            
                            <div className="h-[260px] w-full">
                                {chartData.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-gray-500 italic">Complete challenges to build your skill graph.</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#A89CFF', fontSize: 11 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Accuracy" dataKey="A" stroke="#5DCAA5" fill="#5DCAA5" fillOpacity={0.4} />
                                            <Tooltip contentStyle={{ backgroundColor: '#13141C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#5DCAA5' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Explicit Weaknesses & Strengths */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1A1B25] border border-white/5 p-5 rounded-2xl hover:border-red-500/20 transition-colors flex flex-col justify-between">
                                <div>
                                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-[#E24B4A]"></div> Needs Work
                                    </h4>
                                    {weakTags.length > 0 ? (
                                        <div className="space-y-3">
                                            {weakTags.slice(0,3).map((t, i) => (
                                                <div key={i} className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium text-gray-200">{getTopicTitleForTag(t.tagName)}</span>
                                                    <span className="text-[10px] text-red-400/80">{Math.max(0, 100 - t.weaknessScore)}% accuracy</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-500">No weak areas identified yet.</div>
                                    )}
                                </div>
                                {weakTags.length > 0 && (
                                    <button 
                                        onClick={() => useStore.getState().setPendingWarmup(true)}
                                        className="mt-4 w-full bg-[#E24B4A]/10 hover:bg-[#E24B4A]/20 text-[#E24B4A] border border-[#E24B4A]/20 text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        Fix Weaknesses
                                    </button>
                                )}
                            </div>

                            <div className="bg-[#1A1B25] border border-white/5 p-5 rounded-2xl hover:border-green-500/20 transition-colors">
                                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-[#5DCAA5]"></div> Strong Areas
                                </h4>
                                {strongTags.length > 0 ? (
                                    <div className="space-y-3">
                                        {strongTags.slice(0,3).map((t, i) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-gray-200">{getTopicTitleForTag(t.tagName)}</span>
                                                <span className="text-[10px] text-green-400/80">{Math.max(0, 100 - t.weaknessScore)}% accuracy</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-500">Keep practicing!</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Actions & Missions */}
                    <div className="space-y-6">
                        
                        {/* Daily Warmup Banner */}
                        <div className="bg-gradient-to-br from-[#6C5CE7]/20 to-[#6C5CE7]/5 border border-[#6C5CE7]/30 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/20 text-[#A89CFF] flex items-center justify-center shrink-0">
                                    <Zap size={20} className="fill-current" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Daily Warm-Up is ready!</h3>
                                    <p className="text-xs text-[#A89CFF]/80 mt-1">Targeted challenges based on your weak topics.</p>
                                </div>
                            </div>
                            <Link to="/learn" className="bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1 justify-center shrink-0">
                                Start Now <ChevronRight size={14} />
                            </Link>
                        </div>

                        {/* Mystery Box Banner */}
                        {mysteryBoxes > 0 && (
                            <div className="bg-gradient-to-br from-[#FAC775]/20 to-[#FAC775]/5 border border-[#FAC775]/30 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#FAC775]/20 text-[#FAC775] flex items-center justify-center shrink-0">
                                        <Package size={20} className="fill-current" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Mystery Box Unlocked!</h3>
                                        <p className="text-xs text-[#FAC775]/80 mt-1">You have {mysteryBoxes} unopened box(es).</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowMysteryBox(true)}
                                    className="bg-[#FAC775] hover:bg-[#eab365] text-gray-900 text-xs font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1 justify-center shrink-0"
                                >
                                    Open Box
                                </button>
                            </div>
                        )}

                        {/* Active Missions */}
                        <div className="bg-[#1A1B25] border border-white/5 p-6 rounded-2xl">
                            <h3 className="text-sm font-semibold text-gray-200 mb-5 flex items-center gap-2">
                                <Crosshair size={16} className="text-[#A89CFF]" />
                                Active Missions
                            </h3>
                            <div className="space-y-4">
                                {allMissions.slice(0, 3).map((mission, index) => {
                                    // For visual purposes, we'll make the first one 'Active', second 'Done', third 'Locked' 
                                    // based on challengesDone logic. 
                                    // This gives a dynamic feel based on the user's progress.
                                    let status = 'Locked';
                                    let statusClass = 'bg-white/5 text-gray-500';
                                    let Icon = ShieldAlert;
                                    let opacity = 'opacity-50';
                                    let iconBg = 'bg-white/5 text-gray-500';

                                    if (challengesDone > index * 5 + 5) {
                                        status = 'Done';
                                        statusClass = 'bg-green-500/10 text-green-400';
                                        Icon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
                                        opacity = 'opacity-100 hover:bg-white/[0.02] transition-colors border border-transparent';
                                        iconBg = 'bg-green-500/10 text-green-400';
                                    } else if (challengesDone >= index * 5) {
                                        status = 'Active';
                                        statusClass = 'bg-[#6C5CE7]/20 text-[#A89CFF]';
                                        Icon = Code2;
                                        opacity = 'opacity-100 bg-white/5 border border-white/5 hover:border-white/10 transition-colors';
                                        iconBg = 'bg-[#A89CFF]/10 text-[#A89CFF]';
                                    }

                                    return (
                                        <div key={index} className={`flex items-center justify-between p-3 rounded-xl ${opacity}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                                                    <Icon size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-200">{mission.title}</div>
                                                    <div className="text-[10px] text-gray-500 mt-0.5">Tier {mission.tier} Boss Level</div>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusClass}`}>{status}</span>
                                        </div>
                                    );
                                })}
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