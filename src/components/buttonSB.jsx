import React from 'react';
import '../pages/css/movile/bSB.css';

const BotonSB = ({ isExpanded, setIsExpanded }) => {
  return (
    <button 
      className={`boton-flotante-movil ${isExpanded ? 'expanded' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
      aria-label="Toggle Sidebar"
    >
      <div className="hamburger-btn">
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>
    </button>
  );
};

export default BotonSB;