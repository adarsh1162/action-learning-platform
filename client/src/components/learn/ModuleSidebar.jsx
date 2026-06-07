import React from 'react';
import { CheckCircle, Lock, ChevronRight, Zap, AlertTriangle, Menu, ChevronLeft } from 'lucide-react';
import useStore from '../../store/useStore';
import { curriculum } from '../../data/curriculum';

/**
 * ModuleSidebar
 * Left navigation panel showing all modules and their topics.
 * Each topic has a status dot: completed (green) / active (purple) / locked (grey).
 */
const ModuleSidebar = ({ modules, activeModuleId, activeTopicId, completedTopics, onSelectTopic, onSelectMission, activeMissionId, isCollapsed, setIsCollapsed }) => {

    const getTopicStatus = (moduleId, topicId) => {
        if (completedTopics.has(topicId)) return 'done';
        if (activeModuleId === moduleId && activeTopicId === topicId) return 'active';
        return 'idle';
    };

    const { skillGraph } = useStore();
    const hasCriticalWeakness = skillGraph?.tags?.some(t => t.weaknessScore >= 30);
    const criticalTags = skillGraph?.tags?.filter(t => t.weaknessScore >= 30).map(t => t.tagName) || [];

    // Find the highest module ID where the critical weakness occurred
    // This ensures we only lock modules *after* the weakness, 
    // rather than locking the user out of the module they are currently practicing!
    let maxCriticalModuleId = 0;
    if (hasCriticalWeakness) {
        for (const mod of curriculum.modules) {
            for (const topic of mod.topics) {
                if (topic.microTags && topic.microTags.some(tag => criticalTags.includes(tag))) {
                    if (mod.id > maxCriticalModuleId) maxCriticalModuleId = mod.id;
                }
            }
        }
    }

    if (isCollapsed) {
        return (
            <aside className="sidebar-container sidebar-container--collapsed">
                <button className="sidebar-expand-btn" onClick={() => setIsCollapsed(false)} title="Expand Curriculum">
                    <Menu size={18} />
                </button>
            </aside>
        );
    }

    return (
        <aside className="sidebar-container">
            <div className="sidebar-header">
                <span className="sidebar-label">CURRICULUM</span>
                <button className="sidebar-collapse-btn" onClick={() => setIsCollapsed(true)} title="Focus Mode">
                    <ChevronLeft size={16} />
                </button>
            </div>

            {hasCriticalWeakness && (
                <div className="weakness-banner">
                    <div className="weakness-glow"></div>
                    <div className="weakness-content">
                        <div className="weakness-header">
                            <AlertTriangle size={14} className="weakness-icon pulse-anim" /> 
                            <span>THREAT DETECTED</span>
                        </div>
                        <p className="weakness-text">
                            System lock engaged. Mastery required in:
                        </p>
                        <div className="weakness-tags">
                            {criticalTags.map(tag => <span key={tag} className="weakness-tag">{tag}</span>)}
                        </div>
                    </div>
                </div>
            )}

            <div className="sidebar-scroll">
                {modules.map((mod) => {
                    const isActiveModule = mod.id === activeModuleId;
                    const completedCount = mod.topics.filter(t =>
                        completedTopics.has(t.id)
                    ).length;
                    const allDone = completedCount === mod.topics.length;
                    
                    // Lock modules only if they come strictly *after* the highest module containing a weakness.
                    const isModuleLocked = hasCriticalWeakness && mod.id > maxCriticalModuleId;

                    return (
                        <div key={mod.id} className="module-group">
                            {/* Module Header */}
                            <div className={`module-header ${isActiveModule ? 'module-header--active' : ''} ${isModuleLocked ? 'module-header--locked' : ''}`}>
                                <div className="module-icon" style={isModuleLocked ? { background: '#1c1d29', color: '#555' } : { background: `${mod.color}20`, color: mod.color }}>
                                    {mod.icon}
                                </div>
                                <div className="module-meta">
                                    <span className="module-num">Module {mod.id}</span>
                                    <span className="module-title" style={isModuleLocked ? { color: '#666' } : {}}>{mod.title}</span>
                                </div>
                                {allDone && <CheckCircle size={14} className="module-done-icon" />}
                                {isModuleLocked && <Lock size={14} className="module-locked-icon" />}
                            </div>

                            {/* Topics List */}
                            <div className="topics-list">
                                {mod.topics.map((topic) => {
                                    const status = getTopicStatus(mod.id, topic.id);
                                    return (
                                        <button
                                            key={topic.id}
                                            onClick={() => onSelectTopic(mod.id, topic.id)}
                                            className={`topic-item topic-item--${status}`}
                                            disabled={isModuleLocked}
                                            style={{ opacity: isModuleLocked ? 0.5 : 1, cursor: isModuleLocked ? 'not-allowed' : 'pointer' }}
                                        >
                                            <span className={`topic-dot topic-dot--${status}`} />
                                            <span className="topic-name">{topic.title}</span>
                                            {status === 'active' && <ChevronRight size={12} className="topic-arrow" />}
                                        </button>
                                    );
                                })}

                                {/* Boss Mission */}
                                <button
                                    onClick={() => onSelectMission(mod.id)}
                                    className={`mission-item ${activeMissionId === mod.id ? 'mission-item--active' : ''} ${allDone && !isModuleLocked ? 'mission-item--unlocked' : 'mission-item--locked'}`}
                                    disabled={!allDone || isModuleLocked}
                                    style={{ opacity: isModuleLocked ? 0.5 : 1, cursor: isModuleLocked ? 'not-allowed' : (allDone ? 'pointer' : 'not-allowed') }}
                                >
                                    <span className="mission-dot">
                                        {allDone && !isModuleLocked
                                            ? <Zap size={10} />
                                            : <Lock size={9} />
                                        }
                                    </span>
                                    <span className="topic-name">
                                        {allDone && !isModuleLocked ? `⚔ Deployment` : `🔒 Deployment`}
                                    </span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default ModuleSidebar;
