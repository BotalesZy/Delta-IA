// src/components/Delta-Dashboard/DeltaDisplay.jsx
import React from 'react';
import SpeechBubble from '../Delta-Components/SpeechBubble';

const DeltaDisplay = ({ viewMode, deltaPositionLeft, eyeState, deltaText }) => {
  const isHappyState = eyeState.startsWith('h-');

  if (viewMode !== 'interactive') {
    return (
      <div className="delta-simple-zone">
        <div className="simple-avatar-header">
          <div className="delta-greek-avatar">Δ</div>
          <div className="delta-status-info">
            <h3>Delta AI</h3>
            <p>Modo Eficiente Activo</p>
          </div>
        </div>
        <div className="simple-speech-container">
          <p className="simple-response-text">
            {deltaText || "Modo minimalista iniciado. ¿En qué puedo ayudarte de forma directa?"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`delta-display-zone ${deltaPositionLeft ? 'left-layout' : 'right-layout'}`}>
      <div className="cube-view-container">
        <div className="cube-scene">
          <div className={`cube eye-state-${eyeState} ${isHappyState ? 'happy-eyes' : ''}`}>
            <div className="face front">
              <div className="eyes-container">
                <div className="eye left-eye"></div>
                <div className="eye right-eye"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CORREGIDO: Prop pasada como initialPositionLeft */}
      <SpeechBubble text={deltaText} initialPositionLeft={deltaPositionLeft} />
    </div>
  );
};

export default DeltaDisplay;