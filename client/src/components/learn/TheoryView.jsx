import React from 'react';
import { Tag, ArrowRight, Lightbulb, Terminal } from 'lucide-react';

/**
 * TheoryView — Phase 2, Step 1
 * Displays: micro-tag chip, crisp theory text, a working code EXAMPLE,
 * then a CTA button to advance to the Misconception Trap.
 */
const TheoryView = ({ topic, moduleColor, onNext }) => {
    return (
        <div className="view-container theory-view">

            {/* ── Header ── */}
            <div className="view-header">
                <div className="phase-chip">
                    <Lightbulb size={12} />
                    Phase 2 · Theory
                </div>
                <div className="tag-group">
                    {topic.microTags.map(tag => (
                        <span key={tag} className="micro-tag">
                            <Tag size={10} />
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── Topic Title ── */}
            <h1 className="view-title">{topic.title}</h1>

            {/* ── Theory Block ── */}
            <div className="theory-card">
                <p
                    className="theory-text"
                    dangerouslySetInnerHTML={{ __html: topic.theory }}
                />
            </div>

            {/* ── Example Block (THE KEY ADDITION) ── */}
            <div className="example-block">
                <div className="example-header">
                    <Terminal size={14} />
                    <span>Live Example</span>
                </div>
                <pre className="example-code">{topic.example.code}</pre>
                <div className="example-output">
                    <span className="output-label">Output:</span>
                    <pre className="output-text">{topic.example.output}</pre>
                </div>
            </div>

            {/* ── CTA ── */}
            <div className="cta-row">
                <div className="cta-hint">
                    <span className="cta-hint-dot" />
                    Got it? Now spot the trap →
                </div>
                <button
                    onClick={onNext}
                    className="cta-btn"
                    style={{ '--btn-color': moduleColor }}
                >
                    I Got It · See the Trap
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default TheoryView;
