// src/components/SocialLogin.jsx
import React from 'react';

const SocialLogin = ({ marginTop = '20px' }) => {
  return (
    <div className="input-group" style={{ marginTop }}>
      {/* CORREGIDO: align-items por alignItems */}
      <div style={{ display: 'flex', width: '85%', alignItems: 'center', gap: '10px', opacity: 0.5 }}>
        <hr style={{ flex: 1, border: '0.5px solid white' }} /> 
        <span>Or</span> 
        <hr style={{ flex: 1, border: '0.5px solid white' }} />
      </div>
      
      <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
        <div className="social-box">
          <a href="https://www.google.com" target="_blank" rel="noreferrer">
            <img src="svg/googleIco.png" alt="Google" className="img-social" />
          </a>
        </div>
        <div className="social-box">
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
            <img src="svg/facebookIco.png" alt="Facebook" className="img-social" />
          </a>
        </div>
        <div className="social-box">
          <a href="https://www.apple.com" target="_blank" rel="noreferrer">
            <img src="svg/appleIco.png" alt="Apple" className="img-social" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;