import React, { useState } from 'react';
import { Tag, ArrowRight, BookOpen, Terminal, CheckCircle, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import VisualFlow from './VisualFlow';

/**
 * TheoryView — Phase 2, Step 1
 * Displays: micro-tag chip, crisp theory text via Markdown,
 * then a CTA button to advance to the Misconception Trap.
 */
const TheoryView = ({ topic, moduleColor, onNext }) => {
    return (
        <div className="view-container theory-view">
            <div className="theory-main-content">
                {/* ── Header ── */}
            <div className="view-header">
                <div className="phase-chip">
                    <BookOpen size={12} />
                    Intel Briefing
                </div>
                <div className="tag-group">
                    {topic.microTags && topic.microTags.map(tag => (
                        <span key={tag} className="micro-tag">
                            <Tag size={10} />
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── Topic Title ── */}
            <h1 className="view-title">{topic.title}</h1>

            {/* ── Theory Block (Markdown Rendered) ── */}
            <div className="theory-card markdown-body" style={{ '--theme-color': moduleColor }}>
                <ReactMarkdown 
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeString = String(children).replace(/\n$/, '');
                            const [copied, setCopied] = useState(false);

                            if (!inline && match && match[1] === 'visual-flow') {
                                return <VisualFlow stepsData={codeString} />;
                            }

                            const handleCopy = () => {
                                navigator.clipboard.writeText(codeString);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            };

                            return !inline && match ? (
                                <div className="premium-code-block">
                                    <div className="premium-code-header">
                                        <div className="premium-code-badge">
                                            <span className="js-badge">JS</span>
                                            JavaScript
                                        </div>
                                        <div className="premium-code-actions">
                                            <button className="premium-code-btn" onClick={handleCopy}>
                                                {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        className="md-code-block"
                                        customStyle={{ margin: 0, padding: '16px', background: 'transparent' }}
                                        {...props}
                                    >
                                        {codeString}
                                    </SyntaxHighlighter>
                                </div>
                            ) : (
                                <code className="md-inline-code" {...props}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                >
                    {topic.theory}
                </ReactMarkdown>
            </div>

            {/* ── CTA ── */}
            <div className="cta-row" style={{ marginTop: '30px' }}>
                <div className="cta-hint">
                    <span className="cta-hint-dot" />
                    Briefing complete. Prepare for threat analysis →
                </div>
                <button
                    onClick={onNext}
                    className="cta-btn"
                    style={{ '--btn-color': moduleColor }}
                >
                    Find the Bug
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>

        {/* ── Right Gutter HUD ── */}
        <aside className="theory-hud">
            <div className="theory-hud-sticky">
                {/* Placeholder for AI tips or extracted anchors */}
                <div className="hud-card hud-card--ai">
                    <div className="hud-card-header">
                        <BookOpen size={14} className="hud-icon pulse-anim" style={{ color: '#00f2fe' }} />
                        <span>Tips</span>
                    </div>
                    <p className="hud-card-text">
                        Read the briefing carefully. Predictive learning enhances retention by 40%.
                    </p>
                </div>
            </div>
        </aside>
    </div>
    );
};

export default TheoryView;
