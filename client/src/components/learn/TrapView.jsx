import React, { useState } from 'react';
import { AlertTriangle, Eye, ArrowRight, Bug } from 'lucide-react';

/**
 * TrapView — Phase 2, Step 2
 * Shows the intentionally broken code snippet.
 * User reads it and spots the bug, then clicks "Reveal Flaw".
 * The flaw explanation animates in below.
 * Then a CTA advances to the Code Editor.
 */
const TrapView = ({ topic, moduleColor, onNext }) => {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="view-container trap-view theory-view">

            {/* ── Header ── */}
            <div className="view-header">
                <div className="phase-chip phase-chip--red pulse-anim">
                    <AlertTriangle size={12} />
                    Threat Detected
                </div>
            </div>

            <h1 className="view-title">Analyze the Threat</h1>
            <p className="trap-prompt">
                This code has a hidden bug that trips up most developers.
                <br />
                <span className="trap-prompt--highlight">Read it carefully. What will actually happen when this runs?</span>
            </p>

            {/* ── Broken Code Box ── */}
            <div className="broken-code-box">
                <div className="broken-label">
                    <AlertTriangle size={12} className="text-red-400" />
                    Vulnerable Code Segment
                </div>
                <pre className="broken-code">{topic.trap.code}</pre>
            </div>

            {/* ── Reveal Button / Flaw Explanation ── */}
            {!revealed ? (
                <button
                    onClick={() => setRevealed(true)}
                    className="reveal-btn"
                >
                    <Eye size={16} />
                    Bug Analysis
                </button>
            ) : (
                <div className="flaw-reveal">
                    <div className="flaw-reveal-header">
                        <AlertTriangle size={14} className="flaw-icon" />
                        <span>The Flaw Explained</span>
                    </div>
                    <p
                        className="flaw-text"
                        dangerouslySetInnerHTML={{ __html: topic.trap.flaw }}
                    />
                </div>
            )}

            {/* ── CTA — only shown after reveal ── */}
            {revealed && (
                <div className="cta-row" style={{ marginTop: '1.5rem' }}>
                    <div className="cta-hint">
                        <span className="cta-hint-dot" style={{ background: '#E24B4A' }} />
                        Threat neutralized. Proceed to Field Exercise →
                    </div>
                    <button
                        onClick={onNext}
                        className="cta-btn"
                        style={{ '--btn-color': moduleColor }}
                    >
                        Real World Challenge
                        <ArrowRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TrapView;
