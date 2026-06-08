import React, { useState, useEffect } from 'react';
import { Target, Gift, Briefcase, Coins, Shirt, Banknote, Search, ShieldAlert, CheckCircle2, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { bounties as localBounties } from '../data/bounties';
import './BountyBoard.css';

const BountyBoard = () => {
    const [bounties, setBounties] = useState([]);
    const [filter, setFilter] = useState('all'); // all, open, claimed
    const [loading, setLoading] = useState(true);
    const { cashBalance } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBounties();
    }, []);

    const fetchBounties = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/bounties`);
            const data = await res.json();
            if (data.success && data.bounties && data.bounties.length > 0) {
                setBounties(data.bounties);
            } else {
                // Fallback to local mock data if DB is empty (not seeded yet)
                setBounties(localBounties);
            }
        } catch (error) {
            console.error("Failed to fetch bounties", error);
            // Fallback to local mock data if backend is offline
            setBounties(localBounties);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (id) => {
        navigate(`/bounties/${id}`);
    };

    const filteredBounties = bounties.filter(b => {
        if (filter === 'all') return true;
        return b.status === filter;
    });

    const getRewardIcon = (type) => {
        switch(type) {
            case 'giftcard': return <Gift size={20} />;
            case 'interview': return <Briefcase size={20} />;
            case 'coins': return <Coins size={20} />;
            case 'swag': return <Shirt size={20} />;
            case 'cash': return <Banknote size={20} />;
            default: return <Gift size={20} />;
        }
    };

    return (
        <div className="bounty-root">
            <div className="bounty-container">
                
                {/* Hero Section */}
                <div className="bounty-hero">
                    <div className="bounty-hero-badge">
                        <Target size={14} /> Official Bug Bounty Program
                    </div>

                    {/* Premium Balance Display */}
                    <div className="bounty-balance-badge">
                        <div className="balance-label">Cash Balance</div>
                        <div className="balance-amount">
                            <span>₹</span> {(cashBalance || 0).toLocaleString()}
                        </div>
                    </div>

                    <h1 className="bounty-title">Code Bounties</h1>
                    <p style={{ color: '#FAC775', fontSize: '0.9rem', marginBottom: '2rem', marginTop: '-0.5rem', letterSpacing: '0.05em', fontStyle: 'italic' }}>
                        made with ❤️ for passionate coders
                    </p>
                    <p className="bounty-subtitle">
                        Solve real-world open source issues from our partners. 
                        <span> You earn to find bugs.</span>
                    </p>
                </div>

                {/* Filters */}
                <div className="bounty-filters">
                    <button 
                        className={`bounty-filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Bounties
                    </button>
                    <button 
                        className={`bounty-filter-btn ${filter === 'open' ? 'active' : ''}`}
                        onClick={() => setFilter('open')}
                    >
                        Open
                    </button>
                    <button 
                        className={`bounty-filter-btn ${filter === 'claimed' ? 'active' : ''}`}
                        onClick={() => setFilter('claimed')}
                    >
                        Claimed
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>Decrypting Bounties...</div>
                ) : (
                    <div className="bounty-grid">
                        {filteredBounties.map((bounty) => (
                            <div key={bounty._id || bounty.id} className={`bounty-card reward-${bounty.rewardType}`}>
                                
                                <div className="bounty-card-header">
                                    <div className="company-info">
                                        <div className="company-logo">
                                            <Building2 size={18} />
                                        </div>
                                        <span className="company-name">{bounty.company}</span>
                                    </div>
                                    <div className={`bounty-status status-${bounty.status}`}>
                                        {bounty.status}
                                    </div>
                                </div>

                                <h3 className="bounty-card-title">{bounty.title}</h3>
                                <p className="bounty-card-desc">{bounty.description}</p>

                                <div className="bounty-tags">
                                    <span className="bounty-tag" style={{ color: bounty.difficulty === 'Hard' ? '#FF6B6B' : bounty.difficulty === 'Pro' ? '#eab308' : '#4ade80' }}>
                                        {bounty.difficulty}
                                    </span>
                                    {bounty.tags.map(tag => (
                                        <span key={tag} className="bounty-tag">{tag}</span>
                                    ))}
                                </div>

                                <div className="bounty-reward-block">
                                    <div className="reward-info">
                                        <div className={`reward-icon icon-${bounty.rewardType}`}>
                                            {getRewardIcon(bounty.rewardType)}
                                        </div>
                                        <div>
                                            <div className="reward-label">Bounty Reward</div>
                                            <div className="reward-text">{bounty.rewardText}</div>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    className={`bounty-action-btn ${bounty.status === 'open' ? 'btn-hunt' : 'btn-claimed'}`} 
                                    disabled={bounty.status !== 'open'}
                                    onClick={() => handleNavigate(bounty._id || bounty.id)}
                                >
                                    {bounty.status === 'open' ? (
                                        <>Start Hunting <Search size={16} /></>
                                    ) : (
                                        <>Already Claimed <CheckCircle2 size={16} /></>
                                    )}
                                </button>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BountyBoard;
