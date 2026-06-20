// src/components/Button.jsx
import React from 'react';

const Button = ({ children, onClick, style, disabled }) => { // 👈 Recibimos 'disabled'
  return (
    <button 
      className="boton" 
      onClick={onClick} 
      style={{
        ...style,
        // Si está deshabilitado, cambia el cursor y reduce la opacidad
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }} 
      disabled={disabled} // 👈 ¡Esto es lo que bloquea el clic nativo!
    >
      {children}
    </button>
  );
};

export default Button;