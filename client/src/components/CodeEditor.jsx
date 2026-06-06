import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Loader2 } from 'lucide-react';

/**
 * CodeEditor
 * Props:
 *  - initialCode  {string}   Starter code shown in the editor (the buggy version)
 *  - onRun        {function} Called with the current code string when Run is clicked
 *  - isRunning    {boolean}  If true, shows a spinner on the Run button and disables it
 */
const CodeEditor = ({ initialCode, onRun, isRunning = false }) => {
    const [code, setCode] = useState(initialCode || '// Write your code here\n');
    const [lineCount, setLineCount] = useState(0);

    // When a new challenge is loaded (initialCode changes), reset the editor
    useEffect(() => {
        setCode(initialCode || '// Write your code here\n');
    }, [initialCode]);

    const handleEditorChange = (value) => {
        setCode(value);
        // Count non-empty lines for the status bar
        setLineCount((value || '').split('\n').length);
    };

    const handleEditorMount = (editor) => {
        // Count lines on initial mount
        setLineCount(editor.getModel()?.getLineCount() || 0);
    };

    const handleReset = () => {
        setCode(initialCode || '');
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">

            {/* ── Top Bar ── */}
            <div className="flex justify-between items-center px-4 py-2.5 bg-gray-800 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-3">
                    {/* Fake traffic lights — visual polish */}
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/70" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                        <span className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-gray-400 text-xs font-mono">main.js</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Reset button */}
                    <button
                        onClick={handleReset}
                        title="Reset to starter code"
                        className="flex items-center gap-1.5 text-gray-400 hover:text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-700 transition-colors"
                    >
                        <RotateCcw size={13} />
                        Reset
                    </button>

                    {/* Run button */}
                    <button
                        onClick={() => onRun(code)}
                        disabled={isRunning}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-green-900 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors"
                    >
                        {isRunning
                            ? <><Loader2 size={15} className="animate-spin" /> Running...</>
                            : <><Play    size={15} />                          Run Code</>
                        }
                    </button>
                </div>
            </div>

            {/* ── Monaco Editor ── */}
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorMount}
                    options={{
                        minimap:             { enabled: false },
                        fontSize:            14,
                        fontFamily:          "'Fira Code', 'Cascadia Code', Consolas, monospace",
                        fontLigatures:       true,
                        wordWrap:            'on',
                        scrollBeyondLastLine: false,
                        padding:             { top: 16, bottom: 16 },
                        renderLineHighlight: 'all',
                        lineNumbers:         'on',
                        glyphMargin:         false,
                        folding:             false,
                        cursorBlinking:      'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        smoothScrolling:     true,
                    }}
                />
            </div>

            {/* ── Status Bar ── */}
            <div className="flex items-center justify-between px-4 py-1 bg-gray-850 bg-gray-800/60 border-t border-gray-700 flex-shrink-0">
                <span className="text-gray-600 text-xs font-mono">JavaScript</span>
                <span className="text-gray-600 text-xs font-mono">{lineCount} lines</span>
            </div>
        </div>
    );
};

export default CodeEditor;
