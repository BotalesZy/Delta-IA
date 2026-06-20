// src/components/ForgotOverlay.jsx
import React, { useState } from 'react';
import Button from './Button';

const ForgotOverlay = ({ 
  isOpen, 
  onClose, 
  onResetPassword, 
  forgotSuccess, 
  forgotSuccessClosing, 
  forgotCountdown,
  isForgotLoading 
}) => {
  // Estado local para capturar lo que el usuario escribe en el input
  const [email, setEmail] = useState('');
  // Estado local para manejar los errores específicos del overlay (ej: campo vacío)
  const [localError, setLocalError] = useState('');
  const [localErrorClosing, setLocalErrorClosing] = useState(false);

  // 🚫 BORRAMOS LA LÍNEA DEL 'return null' PARA QUE EL CSS MANEJE LAS ANIMACIONES

  // Función para limpiar el error local con animación de salida antes de borrarlo
  const triggerLocalErrorClear = () => {
    if (localError && !localErrorClosing) {
      setLocalErrorClosing(true);
      setTimeout(() => {
        setLocalError('');
        setLocalErrorClosing(false);
      }, 200); 
    }
  };

  const handleSubmit = async () => {
    setLocalError('');
    setLocalErrorClosing(false);

    // VALIDACIÓN: Si el espacio está vacío
    if (!email.trim()) {
      setLocalError("Por favor, introduce tu correo electrónico.");
      return;
    }

    try {
      await onResetPassword(email);
    } catch (err) {
      console.error("Error en Overlay:", err.message);
      if (err.code === 'auth/user-not-found') {
        setLocalError("El correo electrónico no está registrado.");
      } else if (err.code === 'auth/invalid-email') {
        setLocalError("El formato del correo electrónico no es válido.");
      } else {
        setLocalError("Hubo un error al enviar el correo. Inténtalo de nuevo.");
      }
    }
  };

  let buttonText = "Send Reset Link";
  if (isForgotLoading) buttonText = "Sending...";
  if (forgotCountdown > 0) buttonText = `Sent (${forgotCountdown}s)`;

  return (
    // Aquí el CSS vuelve a tomar el control total del fade-in / fade-out gracias a la clase dinámia
    <div className={`forgot-overlay ${isOpen ? 'active' : ''}`} id="forgot-overlay">
      <div className="forgot-form">
        <h2>Reset Password</h2>
        <p>Enter your email and we'll send you a link to reset your password.</p>
        
        <div className="input-icon" style={{ width: '100%', maxWidth: '300px' }}>
          <img src="svg/letter.svg" className="icon" alt="email icon" />
          <input 
            type="email" 
            placeholder="Your email" 
            style={{ width: '100%' }} 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              triggerLocalErrorClear(); 
            }}
            disabled={forgotCountdown > 0 || isForgotLoading} 
          />
        </div>

        {/* ALERTA VERDE MENTA (Caso Positivo) */}
        {forgotSuccess && (
          <div 
            className={`correct-message-inline ${forgotSuccessClosing ? 'correct-scale-out' : 'correct-scale-in'}`}
            style={{ width: '100%', maxWidth: '300px', marginTop: '15px' }}
          >
            {forgotSuccess}
          </div>
        )}

        {/* ALERTA ROJA (Caso Negativo) */}
        {localError && !forgotSuccess && (
          <div 
            className={`error-message-inline ${localErrorClosing ? 'error-scale-out' : 'error-scale-in'}`}
            style={{ width: '100%', maxWidth: '300px', marginTop: '15px' }}
          >
            {localError}
          </div>
        )}
        
        <Button 
          style={{ maxWidth: '300px', marginTop: '15px' }}
          onClick={handleSubmit}
          disabled={isForgotLoading || forgotCountdown > 0}
        >
          {buttonText}
        </Button>
        
        <span 
          className="forgot-back" 
          onClick={() => {
            setEmail('');
            setLocalError('');
            onClose();
          }}
          style={{ cursor: isForgotLoading ? 'not-allowed' : 'pointer' }}
        >
          {isForgotLoading ? 'Please wait...' : '← Back to Sign In'}
        </span>
      </div>
    </div>
  );
};

export default ForgotOverlay;