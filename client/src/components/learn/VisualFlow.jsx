import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Check, ChevronRight } from 'lucide-react';
import './VisualFlow.css';

/**
 * VisualFlow
 * A Brilliant-style interactive execution visualizer.
 * Takes a `steps` prop: array of objects { label: string, code: string, state: object, duration: number }
 */
const VisualFlow = ({ stepsData }) => {
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        try {
            if (typeof stepsData === 'string') {
                setSteps(JSON.parse(stepsData));
            } else if (Array.isArray(stepsData)) {
                setSteps(stepsData);
            }
        } catch (e) {
            console.error("Failed to parse VisualFlow steps:", e);
            setSteps([]);
        }
    }, [stepsData]);

    useEffect(() => {
        if (isPlaying && currentStepIndex < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, steps[currentStepIndex + 1]?.duration || 1500);
            return () => clearTimeout(timer);
        } else if (currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }
    }, [isPlaying, currentStepIndex, steps]);

    const handlePlay = () => {
        if (currentStepIndex >= steps.length - 1) {
            setCurrentStepIndex(-1);
            setTimeout(() => setIsPlaying(true), 100);
        } else {
            setIsPlaying(true);
        }
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStepIndex(-1);
    };

    if (!steps || steps.length === 0) return null;

    const currentState = currentStepIndex >= 0 ? steps[currentStepIndex].state : steps[0]?.initialState || {};

    return (
        <div className="visual-flow-container">
            <div className="visual-flow-header">
                <span className="visual-flow-badge">Execution Flow</span>
                <div className="visual-flow-controls">
                    <button onClick={handleReset} className="visual-btn" title="Reset" disabled={currentStepIndex < 0}>
                        <RotateCcw size={14} />
                    </button>
                    <button onClick={handlePlay} className="visual-btn visual-btn-primary" title="Play">
                        {isPlaying ? <span className="pulsing-dot" /> : <Play size={14} />}
                        {isPlaying ? 'Running...' : 'Run Simulation'}
                    </button>
                </div>
            </div>

            <div className="visual-flow-body">
                {/* Left: Code execution tracker */}
                <div className="visual-code-panel">
                    {steps.map((step, idx) => (
                        <div key={idx} className={`visual-step ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'completed' : ''}`}>
                            <div className="visual-step-indicator">
                                {idx < currentStepIndex ? <Check size={12} /> : (idx === currentStepIndex ? <ChevronRight size={12} /> : null)}
                            </div>
                            <div className="visual-step-content">
                                <div className="visual-step-code">{step.code}</div>
                                {step.label && <div className="visual-step-label">{step.label}</div>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: State / Memory visualizer */}
                <div className="visual-state-panel">
                    <div className="state-header">Memory / Console</div>
                    <div className="state-variables">
                        {Object.entries(currentState).map(([key, value]) => (
                            <div key={key} className={`state-variable ${currentStepIndex >= 0 && steps[currentStepIndex]?.changed === key ? 'changed' : ''}`}>
                                <span className="state-key">{key}</span>
                                <span className="state-value">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualFlow;
