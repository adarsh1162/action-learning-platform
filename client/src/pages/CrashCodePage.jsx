import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Skull, ShieldAlert, Terminal, Trash2, ArrowLeft, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { crashChallenges } from '../data/crashChallenges';
import './CrashCodePage.css';

export default function CrashCodePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const challenge = crashChallenges.find(c => c.id === id) || crashChallenges[0];

  const [blueCode, setBlueCode] = useState(challenge.blueTeamCode);
  const [exploitCode, setExploitCode] = useState(challenge.redTeamCode);
  
  // Re-initialize if ID changes
  useEffect(() => {
    if (challenge) {
      setBlueCode(challenge.blueTeamCode);
      setExploitCode(challenge.redTeamCode);
      setLogs([]);
    }
  }, [challenge]);

  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);

  // Resize State
  // "Editors 10% bada kar dena" -> Initial topHeight 65% instead of 50/50 split
  const [topHeight, setTopHeight] = useState(65); 
  const [leftWidth, setLeftWidth] = useState(50);

  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);

  const containerRef = useRef(null);
  const topContainerRef = useRef(null);

  // Horizontal Resize (Top/Bottom)
  const startDragHorizontal = useCallback((e) => {
    e.preventDefault();
    setIsDraggingHorizontal(true);
  }, []);

  // Vertical Resize (Left/Right)
  const startDragVertical = useCallback((e) => {
    e.preventDefault();
    setIsDraggingVertical(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingHorizontal && containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        let newHeight = ((e.clientY - bounds.top) / bounds.height) * 100;
        newHeight = Math.max(20, Math.min(newHeight, 80));
        setTopHeight(newHeight);
      }
      
      if (isDraggingVertical && topContainerRef.current) {
        const bounds = topContainerRef.current.getBoundingClientRect();
        let newWidth = ((e.clientX - bounds.left) / bounds.width) * 100;
        newWidth = Math.max(20, Math.min(newWidth, 80));
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingHorizontal(false);
      setIsDraggingVertical(false);
    };

    if (isDraggingHorizontal || isDraggingVertical) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDraggingHorizontal ? 'row-resize' : 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingHorizontal, isDraggingVertical]);

  const handleLaunchExploit = () => {
    setIsRunning(true);
    setLogs(['[SYSTEM] Launching Exploit...', 'Injecting payload into target function...']);

    setTimeout(() => {
      try {
        const consoleOutput = [];
        const safeConsole = {
          log: (...args) => consoleOutput.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          warn: (...args) => consoleOutput.push('⚠️ ' + args.join(' ')),
          error: (...args) => consoleOutput.push('❌ ' + args.join(' ')),
        };

        const combinedCode = `
          ${blueCode}
          
          ${exploitCode}
          
          try {
            // Find the function name automatically or use a generic approach based on the challenge if needed
            // For now, since exploit code usually calls the function, we just execute the exploit code
            // But if exploitCode only defines the payload, we need to run it.
            // All our challenges are structured to either define myPayload or call it.
            
            // Generic execution assuming exploit code is self-contained or sets up myPayload for target function.
            // Note: Since each challenge has different function names, the exploit code MUST contain the call
            // OR we append the call if myPayload is defined. Let's just execute the combined code.
          } catch(e) {
            throw e;
          }
        `;

        const execute = new Function('console', `
          try {
            ${blueCode}
            ${exploitCode}
            
            if (typeof myPayload !== 'undefined') {
                // If it's challenge 1:
                if (typeof authenticateAdmin === 'function') {
                    const res = authenticateAdmin(myPayload);
                    if (res === true) console.log("💥 CRITICAL BYPASS: You gained access!");
                }
                // If it's challenge 2:
                else if (typeof processTransactions === 'function') {
                    processTransactions(myPayload);
                    console.log("🛡️ Target survived: Processed fine.");
                }
                // If it's challenge 3:
                else if (typeof connectToDatabase === 'function') {
                    connectToDatabase(myPayload);
                    console.log("🛡️ Target survived: Handled correctly.");
                }
                // If it's challenge 4:
                else if (typeof deepMerge === 'function') {
                    deepMerge({}, myPayload);
                    console.log("🛡️ Target survived.");
                }
            } else {
               // Exploit code should execute its own attack
            }

          } catch(e) {
            throw e;
          }
        `);

        execute(safeConsole);

        if (consoleOutput.length > 0) {
          setLogs(prev => [...prev, ...consoleOutput]);
        }
      } catch (err) {
        // Crash caught!
        setLogs(prev => [
          ...prev, 
          `❌ CRASH DETECTED: ${err.message}`,
          '🎯 EXPLOIT SUCCESSFUL! The target function broke!'
        ]);
        setTimeout(() => setIsCrashed(true), 1000);
      } finally {
        setIsRunning(false);
      }
    }, 800);
  };

  const monacoOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: "'Fira Code', Consolas, monospace",
    scrollBeyondLastLine: false,
    padding: { top: 16 }
  };

  const editorThemeSetup = (editor, monaco) => {
    monaco.editor.defineTheme('hacker-theme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF6B6B' },
            { token: 'identifier', foreground: 'E2E8F0' },
            { token: 'string', foreground: 'A3E635' },
            { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
        ],
        colors: {
            'editor.background': '#0A0A0C',
            'editor.foreground': '#E2E8F0',
            'editorCursor.foreground': '#FF6B6B',
            'editor.lineHighlightBackground': '#1A1B23',
            'editorLineNumber.foreground': '#475569',
        }
    });
    monaco.editor.setTheme('hacker-theme');
  };

  if (!challenge) return <div>Loading...</div>;

  return (
    <div className="crash-root">
      <div className="crash-header">
        <div className="crash-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <button className="btn-back" onClick={() => navigate('/crash')}>
              <ArrowLeft size={14} /> Back to Missions
            </button>
            <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {challenge.difficulty} / {challenge.category}
            </span>
          </div>
          <h1 className="crash-title" style={{ fontSize: '1.5rem' }}>Mission: {challenge.title}</h1>
        </div>
        <div className="crash-actions">
          <button
            className="btn-exploit"
            onClick={handleLaunchExploit}
            disabled={isRunning}
          >
            <Skull size={16} /> {isRunning ? 'Injecting...' : 'Launch Exploit'}
          </button>
        </div>
      </div>

      <div className="crash-workspace-flex" ref={containerRef}>
        {/* Top Split Pane (Editors) */}
        <div 
          className="crash-editors-container" 
          ref={topContainerRef}
          style={{ height: `${topHeight}%` }}
        >
          {/* Blue Team Pane */}
          <div className="crash-pane crash-pane-blue" style={{ width: `${leftWidth}%` }}>
            <div className="pane-header blue-team">
              <ShieldAlert size={14} />
              Target Area (Blue Team)
            </div>
            <div className="pane-editor-wrapper">
              <Editor
                height="100%"
                language="javascript"
                value={blueCode}
                options={{ ...monacoOptions, readOnly: true }}
                onMount={editorThemeSetup}
              />
            </div>
          </div>

          {/* Vertical Resizer */}
          <div 
            className={`crash-resizer-vertical ${isDraggingVertical ? 'active' : ''}`}
            onMouseDown={startDragVertical}
          ></div>

          {/* Red Team Pane */}
          <div className="crash-pane crash-pane-red" style={{ width: `${100 - leftWidth}%` }}>
            <div className="pane-header red-team">
              <Skull size={14} />
              Exploit Console (Red Team)
            </div>
            <div className="pane-editor-wrapper">
              <Editor
                height="100%"
                language="javascript"
                value={exploitCode}
                onChange={(val) => setExploitCode(val || '')}
                options={monacoOptions}
                onMount={editorThemeSetup}
              />
            </div>
          </div>
        </div>

        {/* Horizontal Resizer */}
        <div 
          className={`crash-resizer-horizontal ${isDraggingHorizontal ? 'active' : ''}`}
          onMouseDown={startDragHorizontal}
        ></div>

        {/* Console Output */}
        <div className="crash-pane crash-pane-console" style={{ height: `${100 - topHeight}%` }}>
          <div className="pane-header console-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={14} />
              System Output Logs
            </div>
            <button
              onClick={() => setLogs([])}
              style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', textTransform: 'uppercase' }}
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>
          <div className="crash-console-output">
            {logs.length === 0 ? (
              <div className="crash-empty-console">Awaiting payload injection...</div>
            ) : (
              logs.map((log, idx) => {
                let className = 'crash-log-row';
                if (log.includes('EXPLOIT SUCCESSFUL') || log.includes('CRITICAL BYPASS')) className = 'crash-log-success';
                else if (log.includes('CRASH DETECTED')) className = 'crash-log-error';
                return (
                  <div key={idx} className={className}>
                    {log}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Mission Debrief Modal */}
      {isCrashed && (
        <div className="crash-debrief-overlay">
          <div className="crash-debrief-modal">
            <div className="debrief-header">
              <div className="debrief-title">
                <CheckCircle2 size={24} color="#4ade80" />
                <h2>Mission Debrief</h2>
              </div>
              <button className="debrief-close-btn" onClick={() => navigate('/crash')}>
                Return to Base
              </button>
            </div>
            
            <div className="debrief-content">
              <p className="debrief-success-msg">Target successfully compromised! Here is the post-mortem analysis of the vulnerability.</p>
              
              <div className="debrief-section">
                <h3><Unlock size={16} /> The Exploit (Solution)</h3>
                <div className="debrief-code-block">
                  <code>{challenge.solution}</code>
                </div>
              </div>

              <div className="debrief-section">
                <h3><Skull size={16} /> Vulnerability Analysis (Why it Breaks)</h3>
                <div className="debrief-text-block">
                  <p>{challenge.whyItBreaks}</p>
                </div>
              </div>

              <div className="debrief-section">
                <h3><Lock size={16} /> Secure Patch (How to Fix)</h3>
                <div className="debrief-code-block secure">
                  <code>{challenge.secureFix}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
