import React from 'react';
import { Tag, ArrowRight, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * TheoryView — Phase 2, Step 1
 * Displays: micro-tag chip, crisp theory text via Markdown,
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
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    className="md-code-block"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
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
