// src/components/InputField.jsx
import React, { useState } from 'react';

// Añadimos 'value' y 'onChange' a la destructuración de props
const InputField = ({ type = 'text', placeholder, icon, showEye = false, style, value, onChange }) => {
  // Estado local para ver/ocultar contraseña
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determina el tipo de input actual
  const currentType = showEye ? (isPasswordVisible ? 'text' : 'password') : type;

  return (
    <div className="input-icon" style={style}>
      {icon && <img src={icon} className="icon" alt="input icon" />}
      
      {/* CORRECCIÓN: Mapeamos de forma explícita el value y el onChange 
        para que los estados de React en AuthPage se actualicen en tiempo real.
      */}
      <input 
        type={currentType} 
        placeholder={placeholder} 
        style={style} 
        value={value}
        onChange={onChange}
      />
      
      {showEye && (
        <img
          /* Nota: Agregué una barra '/' al inicio por si manejas rutas relativas en subcarpetas */
          src={isPasswordVisible ? '/svg/eyeClosed.svg' : '/svg/eyeOpen.svg'}
          className="icon-eye"
          alt="toggle visibility"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          style={{ cursor: 'pointer' }}
        />
      )}
    </div>
  );
};

export default InputField;