import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { ShieldAlert, ArrowLeft, Terminal, Send, CheckCircle2, Lock, Gift, Briefcase, Coins, Shirt, Banknote } from 'lucide-react';
import useStore from '../store/useStore';
import { bounties as localBounties } from '../data/bounties';
import './BountyArena.css';

const BountyArena = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { coins, setCoins, cashBalance, setCashBalance } = useStore();
    
    const [bounty, setBounty] = useState(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [logs, setLogs] = useState([{ type: 'info', msg: 'System: Bounty context loaded. Awaiting patch deployment...' }]);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchBounty = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/bounties/${id}`);
                const data = await res.json();
                if (data.success && data.bounty) {
                    setBounty(data.bounty);
                    setCode(data.bounty.buggyCode);
                } else {
                    fallbackToLocal();
                }
            } catch (error) {
                fallbackToLocal();
            } finally {
                setLoading(false);
            }
        };

        const fallbackToLocal = () => {
            const localBounty = localBounties.find(b => b.id === id);
            if (localBounty) {
                setBounty(localBounty);
                setCode(localBounty.buggyCode || '');
                setLogs(prev => [...prev, { type: 'info', msg: 'System: Connected to local fallback node.' }]);
            } else {
                setLogs(prev => [...prev, { type: 'error', msg: 'System Error: Bounty not found.' }]);
            }
        };

        fetchBounty();
    }, [id]);

    const handleDeploy = async () => {
        if (!bounty) return;
        setSubmitting(true);
        setLogs(prev => [...prev, { type: 'info', msg: '>> Deploying patch to target environment...' }]);

        const token = localStorage.getItem('token');
        if (!token && !id.startsWith('bty-')) {
            setLogs(prev => [...prev, { type: 'error', msg: 'Auth Error: Invalid clearance. Please login.' }]);
            setSubmitting(false);
            return;
        }

        try {
            // Mock submission for fallback local bounties
            if (id.startsWith('bty-')) {
                setTimeout(() => {
                    setLogs(prev => [...prev, 
                        { type: 'success', msg: '>> Tests Passed! Vulnerability patched locally.' },
                        { type: 'success', msg: `>> REWARD CLAIMED: ${bounty.rewardText}` }
                    ]);
                    setSuccess(true);
                    if ((bounty.rewardType === 'cash' || bounty.rewardType === 'coins' || bounty.rewardType === 'giftcard') && bounty.rewardAmount > 0) {
                        setCoins(coins + bounty.rewardAmount);
                    }
                    setSubmitting(false);
                }, 1000);
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/bounties/${id}/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });
            const data = await res.json();

            if (data.success) {
                setLogs(prev => [...prev, 
                    { type: 'success', msg: '>> Tests Passed! Vulnerability patched successfully.' },
                    { type: 'success', msg: `>> REWARD CLAIMED: ${data.bounty.rewardText}` }
                ]);
                setSuccess(true);
                if (data.newCoins !== undefined) {
                    setCoins(data.newCoins);
                }
                if (data.newCashBalance !== undefined) {
                    setCashBalance(data.newCashBalance);
                } else if (data.bounty.rewardAmount > 0) {
                    if (data.bounty.rewardType === 'coins') setCoins(coins + data.bounty.rewardAmount);
                    if (data.bounty.rewardType === 'cash' || data.bounty.rewardType === 'giftcard') setCashBalance(cashBalance + data.bounty.rewardAmount);
                }
            } else {
                setLogs(prev => [...prev, { type: 'error', msg: `>> Exploit Failed: ${data.message}` }]);
            }
        } catch (error) {
            setLogs(prev => [...prev, { type: 'error', msg: '>> Network Error: Unable to reach validation server.' }]);
        } finally {
            setSubmitting(false);
        }
    };

    const getRewardIcon = (type) => {
        switch(type) {
            case 'giftcard': return <Gift size={16} />;
            case 'interview': return <Briefcase size={16} />;
            case 'coins': return <Coins size={16} />;
            case 'swag': return <Shirt size={16} />;
            case 'cash': return <Banknote size={16} />;
            default: return <Gift size={16} />;
        }
    };

    if (loading) {
        return <div className="arena-root"><div style={{padding: '2rem', color: '#94a3b8'}}>Decrypting Bounty Data...</div></div>;
    }

    if (!bounty) {
        return (
            <div className="arena-root">
                <div style={{padding: '2rem', color: '#ef4444'}}>
                    <h2>Bounty Not Found</h2>
                    <button onClick={() => navigate('/bounties')} className="btn-back">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="arena-root">
            {/* Header */}
            <header className="arena-header">
                <div className="arena-header-left">
                    <button onClick={() => navigate('/bounties')} className="btn-back">
                        <ArrowLeft size={16} /> Retreat
                    </button>
                    <div className="arena-title-box">
                        <h1 className="arena-title">{bounty.title}</h1>
                        <span className="arena-company">{bounty.company}</span>
                    </div>
                </div>
                
                <div className="arena-header-right">
                    <div className="arena-balance">
                        <span className="balance-label">Cash Balance:</span>
                        <span className="balance-val">₹ {(cashBalance || 0).toLocaleString()}</span>
                    </div>
                    {success ? (
                        <div className="btn-deploy btn-success">
                            <CheckCircle2 size={16} /> Patch Verified
                        </div>
                    ) : (
                        <button 
                            className="btn-deploy" 
                            onClick={handleDeploy}
                            disabled={submitting || bounty.status === 'claimed'}
                        >
                            {bounty.status === 'claimed' ? <><Lock size={16}/> Claimed</> : <><Send size={16} /> Deploy Patch</>}
                        </button>
                    )}
                </div>
            </header>

            {/* Workspace */}
            <div className="arena-workspace">
                
                {/* Left Panel: Briefing */}
                <div className="arena-briefing">
                    <div className="briefing-section">
                        <h2 className="briefing-heading"><ShieldAlert size={16}/> Mission Briefing</h2>
                        <p className="briefing-desc">{bounty.description}</p>
                        
                        <div className="briefing-tags">
                            <span className="briefing-tag diff-tag">{bounty.difficulty}</span>
                            {bounty.tags.map(t => <span key={t} className="briefing-tag">{t}</span>)}
                        </div>
                    </div>

                    <div className="briefing-section reward-section">
                        <h2 className="briefing-heading">Bounty Reward</h2>
                        <div className={`reward-box type-${bounty.rewardType}`}>
                            <div className="reward-icon">{getRewardIcon(bounty.rewardType)}</div>
                            <span>{bounty.rewardText}</span>
                        </div>
                    </div>

                    <div className="briefing-section console-section">
                        <h2 className="briefing-heading"><Terminal size={16}/> Execution Logs</h2>
                        <div className="arena-console">
                            {logs.map((log, i) => (
                                <div key={i} className={`log-entry log-${log.type}`}>{log.msg}</div>
                            ))}
                            {submitting && <div className="log-entry log-info animate-pulse">Processing...</div>}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Editor */}
                <div className="arena-editor">
                    <div className="editor-header">
                        <span className="file-name">target_file.js</span>
                    </div>
                    <div className="monaco-wrapper">
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            theme="vs-dark"
                            value={code}
                            onChange={(val) => setCode(val)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'Fira Code', monospace",
                                padding: { top: 16 },
                                scrollBeyondLastLine: false,
                                smoothScrolling: true,
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BountyArena;
