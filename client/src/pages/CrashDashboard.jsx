import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skull, ShieldAlert, Crosshair, Bug, TerminalSquare, Search, Check } from 'lucide-react';
import { crashChallenges } from '../data/crashChallenges';
import './CrashDashboard.css';

export default function CrashDashboard() {
  const navigate = useNavigate();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Extract unique categories dynamically from the data
  const allCategories = useMemo(() => {
    const cats = new Set(crashChallenges.map(c => c.category));
    return Array.from(cats).sort();
  }, []);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Type Errors': return <Bug size={16} />;
      case 'Logic Flaws': return <Crosshair size={16} />;
      case 'Security': return <ShieldAlert size={16} />;
      case 'Edge Cases': return <TerminalSquare size={16} />;
      default: return <Skull size={16} />;
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Filter logic
  const filteredChallenges = useMemo(() => {
    return crashChallenges.filter(challenge => {
      // Search
      if (searchQuery && !challenge.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // Difficulty
      if (selectedDifficulty !== 'All' && challenge.difficulty !== selectedDifficulty) return false;
      // Category
      if (selectedCategories.length > 0 && !selectedCategories.includes(challenge.category)) return false;
      
      return true;
    });
  }, [searchQuery, selectedDifficulty, selectedCategories]);

  return (
    <div className="crash-dashboard-root">
      <div className="crash-dashboard-container">
        
        {/* Left Sidebar */}
        <div className="crash-sidebar">
          {/* Search */}
          <div className="sidebar-section">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search missions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Difficulty Filters */}
          <div className="sidebar-section">
            <div className="sidebar-title">Difficulty</div>
            <div className="difficulty-filters">
              {['All', 'Beginner', 'Intermediate', 'Pro'].map(diff => (
                <div 
                  key={diff} 
                  className={`diff-pill ${selectedDifficulty === diff ? 'active' : ''}`}
                  onClick={() => setSelectedDifficulty(diff)}
                >
                  {diff}
                </div>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="sidebar-section">
            <div className="sidebar-title">Categories</div>
            <div className="category-filters">
              {allCategories.map(cat => (
                <div 
                  key={cat} 
                  className={`category-item ${selectedCategories.includes(cat) ? 'active' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  <div className="checkbox">
                    {selectedCategories.includes(cat) && <Check size={12} color="white" strokeWidth={3} />}
                  </div>
                  {getCategoryIcon(cat)} {cat}
                </div>
              ))}
            </div>
          </div>
          
          <div className="sidebar-section" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            <div className="sidebar-title" style={{ fontSize: '0.75rem' }}>Total Available Missions</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e2e8f0' }}>{crashChallenges.length}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="crash-main-content">
          <div className="crash-dashboard-header">
            <h1 className="crash-dashboard-title">Crash The Code</h1>
            <p className="crash-dashboard-subtitle">
              Welcome to the Red Team. Select a target function below. Your mission is to find the vulnerability and write an exploit payload that makes the system crash.
            </p>
          </div>

          <div className="crash-table-wrapper">
            <table className="crash-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Target Mission</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredChallenges.length > 0 ? (
                  filteredChallenges.map((challenge) => (
                    <tr 
                      key={challenge.id} 
                      className="crash-table-row"
                      onClick={() => navigate(`/crash/${challenge.id}`)}
                    >
                      <td style={{ color: '#475569' }}>
                        <Skull size={18} />
                      </td>
                      <td>
                        <div className="crash-row-title">{challenge.title}</div>
                        <div className="crash-row-desc">
                          {challenge.description}
                        </div>
                      </td>
                      <td>
                        <div className="cat-badge">
                          {getCategoryIcon(challenge.category)} {challenge.category}
                        </div>
                      </td>
                      <td>
                        <span className={`diff-badge diff-${challenge.difficulty}`}>
                          {challenge.difficulty}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="solve-btn">
                          Attack Target
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <Skull size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        No missions match your filters. Try adjusting your search criteria.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
