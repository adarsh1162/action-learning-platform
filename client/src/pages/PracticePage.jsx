import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Terminal, Code2, Trash2 } from 'lucide-react';
import './PracticePage.css';

export default function PracticePage() {
    const [code, setCode] = useState('// Welcome to the Practice\n// Write your JavaScript code with ❤️ here\n\nconsole.log("Hello, World!");\n');
    const [logs, setLogs] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    // Split pane state
    const [topHeight, setTopHeight] = useState(60); // percentage
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    // Handle Resize
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging || !containerRef.current) return;
            const containerBounds = containerRef.current.getBoundingClientRect();
            // Calculate new percentage based on mouse Y position relative to container
            let newHeight = ((e.clientY - containerBounds.top) / containerBounds.height) * 100;
            // Clamp between 20% and 80%
            newHeight = Math.max(20, Math.min(newHeight, 80));
            setTopHeight(newHeight);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'row-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Handle Code Execution safely
    const handleRunCode = () => {
        setIsRunning(true);
        setLogs([]);

        try {
            // Create a safe console mock
            const consoleOutput = [];
            const safeConsole = {
                log: (...args) => consoleOutput.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
                warn: (...args) => consoleOutput.push('⚠️ ' + args.join(' ')),
                error: (...args) => consoleOutput.push('❌ ' + args.join(' ')),
            };

            // Execute the code safely using Function constructor
            const execute = new Function('console', `
                try {
                    ${code}
                } catch(e) {
                    console.error(e.message);
                }
            `);

            execute(safeConsole);

            setLogs(consoleOutput.length > 0 ? consoleOutput : ['<No output>']);
        } catch (err) {
            setLogs([`❌ Syntax Error: ${err.message}`]);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="practice-root">
            <div className="practice-header">
                <div className="practice-title-area">
                    <h1 className="practice-title">JavaScript Practice</h1>
                    <p className="practice-subtitle">We ❤️ JavaScript Coding</p>
                </div>
                <div className="practice-actions">
                    <button
                        className="btn-run"
                        onClick={handleRunCode}
                        disabled={isRunning}
                    >
                        <Play size={14} /> {isRunning ? 'Executing...' : 'Execute Code'}
                    </button>
                </div>
            </div>

            <div className="practice-workspace" ref={containerRef}>
                {/* Top Pane: Editor */}
                <div className="practice-pane-top" style={{ height: `${topHeight}%` }}>
                    <div className="practice-toolbar">
                        <div className="practice-file-tab">
                            <Code2 size={14} /> main.js
                        </div>
                    </div>
                    <div className="practice-monaco-wrapper">
                        <Editor
                            height="100%"
                            language="javascript"
                            theme="antigravity"
                            value={code}
                            onChange={(val) => setCode(val || '')}
                            onMount={(editor, monaco) => {
                                monaco.editor.defineTheme('antigravity', {
                                    base: 'vs-dark',
                                    inherit: true,
                                    rules: [
                                        { token: 'keyword', foreground: 'C678DD' },
                                        { token: 'identifier', foreground: 'E06C75' },
                                        { token: 'string', foreground: '98C379' },
                                        { token: 'comment', foreground: '5C6370', fontStyle: 'italic' },
                                        { token: 'number', foreground: 'D19A66' },
                                        { token: 'type', foreground: '56B6C2' },
                                        { token: 'delimiter', foreground: 'ABB2BF' }
                                    ],
                                    colors: {
                                        'editor.background': '#050506',
                                        'editor.foreground': '#ABB2BF',
                                        'editorCursor.foreground': '#528BFF',
                                        'editor.lineHighlightBackground': '#1A1B23',
                                        'editorLineNumber.foreground': '#495162',
                                        'editorIndentGuide.background': '#2C313A',
                                    }
                                });
                                monaco.editor.setTheme('antigravity');
                            }}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'Fira Code', Consolas, monospace",
                                scrollBeyondLastLine: false,
                                padding: { top: 16 }
                            }}
                        />
                    </div>
                </div>

                {/* Draggable Resizer */}
                <div
                    className={`practice-resizer ${isDragging ? 'active' : ''}`}
                    onMouseDown={handleMouseDown}
                ></div>

                {/* Bottom Pane: Console */}
                <div className="practice-pane-bottom" style={{ height: `${100 - topHeight}%` }}>
                    <div className="practice-console-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Terminal size={14} style={{ color: '#64748B' }} />
                            <span className="practice-console-title">Console Output</span>
                        </div>
                        <button
                            onClick={() => setLogs([])}
                            style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}
                            title="Clear Console"
                        >
                            <Trash2 size={13} /> Clear
                        </button>
                    </div>
                    <div className="practice-console-output">
                        {logs.length === 0 ? (
                            <div className="practice-empty-console">Run code to see output here...</div>
                        ) : (
                            logs.map((log, idx) => (
                                <div key={idx} className={log.startsWith('❌') ? 'practice-log-error' : 'practice-log-row'}>
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
