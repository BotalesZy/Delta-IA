// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

import Button from '../components/Button';
import OrientationBlocker from "../components/orientationBlock";
import InputField from '../components/InputField';
import SocialLogin from '../components/SocialLogin';
import SEOManager from '../components/SEOManager';
import ForgotOverlay from '../components/ForgotOverlay';
import './AuthPage.css';

const AuthPage = ({ onLoginSuccess }) => {
  // Detector de dispositivo móvil
  const [isMobile, setIsMobile] = useState(false);

  // Estados de control visual y animaciones
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [isForgotActive, setIsForgotActive] = useState(false);
  const [isIntroFinished, setIsIntroFinished] = useState(false);

  // Estados para LOGIN
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(''); 
  const [loginErrorClosing, setLoginErrorClosing] = useState(false); 

  // Estados para REGISTRO
  const [nombre, setNombre] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState(''); 
  const [registerErrorClosing, setRegisterErrorClosing] = useState(false); 

  // Estados para FORGET PASSWORD
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotSuccessClosing, setForgotSuccessClosing] = useState(false);
  const [forgotCountdown, setForgotCountdown] = useState(0);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Detectar tamaño de pantalla y temporizador de Intro
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Ejecutar al montar
    handleResize();
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      setIsIntroFinished(true); 
    }, 2100); 

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleOpenForgot = () => setIsForgotActive(true);
  const handleCloseForgot = () => {
    setIsForgotActive(false);
    setForgotSuccess('');
    setForgotSuccessClosing(false);
  };

  const navigateToSignIn = () => {
    setLoginIdentifier('');
    setLoginPassword('');
    setLoginError('');
    setLoginErrorClosing(false);
    setIsSignUpActive(false);
  };

  const navigateToSignUp = () => {
    setNombre('');
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
    setRegisterError('');
    setRegisterErrorClosing(false);
    setIsSignUpActive(true);
  };

  const triggerLoginErrorClear = () => {
    if (loginError && !loginErrorClosing) {
      setLoginErrorClosing(true);
      setTimeout(() => {
        setLoginError('');
        setLoginErrorClosing(false);
      }, 200); 
    }
  };

  const triggerRegisterErrorClear = () => {
    if (registerError && !registerErrorClosing) {
      setRegisterErrorClosing(true);
      setTimeout(() => {
        setRegisterError('');
        setRegisterErrorClosing(false);
      }, 200);
    }
  };

  // LÓGICA: RECUPERACIÓN DE CONTRASEÑA
  const handleResetPassword = async (email) => {
    if (!email || email.trim() === '') return;
    setIsForgotLoading(true);
    setForgotSuccess('');
    setForgotSuccessClosing(false);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setForgotSuccess("An email has been sent successfully.");
      setIsForgotLoading(false);
      setForgotCountdown(10);
      
      const interval = setInterval(() => {
        setForgotCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(interval);
            setForgotSuccessClosing(true);
            setTimeout(() => {
              setForgotSuccess('');
              setForgotSuccessClosing(false);
            }, 250);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    } catch (error) {
      setIsForgotLoading(false);
      throw error;
    }
  };

  // LÓGICA: SIGN IN
  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    setLoginError(''); 
    setLoginErrorClosing(false);

    if (!loginIdentifier || !loginPassword) {
      setLoginError("Por favor, llena todos los campos para iniciar sesión.");
      return;
    }

    let emailToAuth = loginIdentifier.trim();
    let finalUsername = "";

    try {
      if (!loginIdentifier.includes('@')) {
        const usersRef = collection(db, "7k9m2bx");
        const q = query(usersRef, where("user", "==", loginIdentifier.trim()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setLoginError("El nombre de usuario introducido no existe.");
          return;
        }

        const userDoc = querySnapshot.docs[0].data();
        emailToAuth = userDoc.email;
        finalUsername = userDoc.user;
      }

      const userCredential = await signInWithEmailAndPassword(auth, emailToAuth, loginPassword);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setLoginError("Tu cuenta aún no está verificada. Revisa tu correo electrónico para activarla.");
        return;
      }

      if (!finalUsername) {
        try {
          const usersRef = collection(db, "7k9m2bx");
          const q = query(usersRef, where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            finalUsername = querySnapshot.docs[0].data().user;
          }
        } catch (dbError) {
          console.error("Error al traer el username:", dbError);
        }
      }

      if (!finalUsername) {
        finalUsername = loginIdentifier.includes('@') ? user.email.split('@')[0] : loginIdentifier.trim();
      }

      const userDataToSave = { uid: user.uid, email: user.email, username: finalUsername };
      localStorage.setItem('user', JSON.stringify(userDataToSave));

      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setLoginError("El usuario o la contraseña son incorrectos.");
      } else {
        setLoginError("Error de credenciales: " + error.message);
      }
    }
  };

  // LÓGICA: SIGN UP
  const handleSignUp = async (e) => {
    if (e) e.preventDefault();
    setRegisterError('');
    setRegisterErrorClosing(false);

    if (!nombre || !registerEmail || !registerPassword || !confirmPassword) {
      setRegisterError("Por favor, llena todos los campos del formulario de registro.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail.trim())) {
      setRegisterError("Por favor, introduce un correo electrónico válido.");
      return;
    }

    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (registerPassword.length < 8) {
      setRegisterError("La contraseña debe tener un mínimo de 8 caracteres.");
      return;
    }
    if (!specialCharRegex.test(registerPassword)) {
      setRegisterError("La contraseña debe contener al menos 1 carácter especial (Ej: @, $, !, #).");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setRegisterError("Las contraseñas introducidas no coinciden.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const userDocRef = doc(db, "7k9m2bx", user.uid); 
      await setDoc(userDocRef, { user: nombre.trim(), email: registerEmail.trim() });

      alert("¡Cuenta registrada con éxito! Te hemos enviado un correo de verificación.");
      
      setNombre('');
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      setIsSignUpActive(false);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setRegisterError("Este correo electrónico ya se encuentra registrado.");
      } else {
        setRegisterError("Hubo un error al crear la cuenta: " + error.message);
      }
    }
  };

  return (
    <>
      <SEOManager title="Login Delta" faviconUrl="/svg/delta.svg" />
      
      {/* Intro Animada Inicial */}
      <section className={`main-wrapper ${isIntroFinished ? 'hidden-welcome' : ''}`}>
        <div className="animate__animated animate__fadeOut delay-out">
          <b className="expand">Welcome</b>
        </div>
      </section>

      {/* =========================================================
          VISTA RENDERIZADA SEGÚN EL DISPOSITIVO
          ========================================================= */}
      {isMobile ? (
        /* --- RENDERIZADO EXCLUSIVO PARA CELULARES --- */
        <div className={`auth-mobile-container ${isSignUpActive ? 'mode-signup' : 'mode-signin'} ${isForgotActive ? 'forgot-active' : ''}`}>
          <div className="glass-card-mobile">
            
            {/* Tabs Superiores */}
            <div className="auth-tabs">
              <button type="button" className={`tab-btn ${!isSignUpActive ? 'active' : ''}`} onClick={navigateToSignIn}>
                Sign In
              </button>
              <button type="button" className={`tab-btn ${isSignUpActive ? 'active' : ''}`} onClick={navigateToSignUp}>
                Sign Up
              </button>
            </div>

            {/* Formulario Único Animado */}
            <form className="auth-form-content" onSubmit={isSignUpActive ? handleSignUp : handleSignIn}>
              <div className="dynamic-input-group">
                
                {/* USERNAME (Aparece arriba en Sign Up) */}
                <div className={`animated-field ${isSignUpActive ? 'show' : 'hide'}`}>
                  <InputField 
                    type="text" placeholder="Username" icon="/svg/user.svg" value={nombre}
                    onChange={(e) => { setNombre(e.target.value); triggerRegisterErrorClear(); }}
                    autoComplete="off"
                  />
                </div>

                {/* EMAIL */}
                <div className="animated-field">
                  <InputField 
                    type={isSignUpActive ? "email" : "text"} 
                    placeholder={isSignUpActive ? "Email" : "Email or Username"} 
                    icon="/svg/letter.svg" 
                    value={isSignUpActive ? registerEmail : loginIdentifier}
                    onChange={(e) => {
                      if (isSignUpActive) { setRegisterEmail(e.target.value); triggerRegisterErrorClear(); }
                      else { setLoginIdentifier(e.target.value); triggerLoginErrorClear(); }
                    }}
                  />
                </div>

                {/* PASSWORD */}
                <div className="animated-field">
                  <InputField 
                    type="password" placeholder="Password" icon="/svg/lock.svg" showEye={true} 
                    value={isSignUpActive ? registerPassword : loginPassword}
                    onChange={(e) => {
                      if (isSignUpActive) { setRegisterPassword(e.target.value); triggerRegisterErrorClear(); }
                      else { setLoginPassword(e.target.value); triggerLoginErrorClear(); }
                    }}
                  />
                </div>

                {/* CONFIRM PASSWORD (Aparece abajo en Sign Up) */}
                <div className={`animated-field ${isSignUpActive ? 'show' : 'hide'}`}>
                  <InputField 
                    type="password" placeholder="Confirm Password" showEye={true} value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); triggerRegisterErrorClear(); }}
                  />
                </div>
              </div>

              {!isSignUpActive && (
                <p className="forgot-text" onClick={handleOpenForgot}>Forgot your password?</p>
              )}

              <ForgotOverlay 
                isOpen={isForgotActive} onClose={handleCloseForgot} onResetPassword={handleResetPassword}
                forgotSuccess={forgotSuccess} forgotSuccessClosing={forgotSuccessClosing}
                forgotCountdown={forgotCountdown} isForgotLoading={isForgotLoading}
              />

              {/* Alertas de error específicas de cada modo */}
              {loginError && !isSignUpActive && (
                <div className={`error-message-inline ${loginErrorClosing ? 'error-scale-out' : 'error-scale-in'}`}>{loginError}</div>
              )}
              {registerError && isSignUpActive && (
                <div className={`error-message-inline ${registerErrorClosing ? 'error-scale-out' : 'error-scale-in'}`}>{registerError}</div>
              )}

              <Button type="submit">
                {isSignUpActive ? "Create Account" : "Sign In"}
              </Button>
              <SocialLogin marginTop="10px" />
            </form>
          </div>
        </div>
      ) : (
        /* --- RENDERIZADO ORIGINAL PARA PC (CONSERVANDO TUS DOS COLUMNAS) --- */
        <div className={`background-container ${isSignUpActive ? 'active-side' : ''} ${isForgotActive ? 'forgot-active' : ''}`} id="main-container">
          <div className="glass-overlay scale-up-hor-left" id="overlay"></div>

          {/* PANEL IZQUIERDO */}
          <div className="left">
            <form className="login-content" onSubmit={handleSignIn}>
              <div className="header-section"><h1>Sign In</h1></div>
              <div className="input-group">
                <InputField 
                  type="text" placeholder="Email or Username" icon="/svg/letter.svg" value={loginIdentifier}
                  onChange={(e) => { setLoginIdentifier(e.target.value); triggerLoginErrorClear(); }}
                />
                <InputField 
                  type="password" placeholder="Password" icon="/svg/lock.svg" showEye={true} value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); triggerLoginErrorClear(); }}
                />
              </div>
              <p className="forgot-text" onClick={handleOpenForgot} style={{ cursor: 'pointer' }}>Forgot your password?</p>
              
              <ForgotOverlay 
                isOpen={isForgotActive} onClose={handleCloseForgot} onResetPassword={handleResetPassword}
                forgotSuccess={forgotSuccess} forgotSuccessClosing={forgotSuccessClosing}
                forgotCountdown={forgotCountdown} isForgotLoading={isForgotLoading}
              />

              {loginError && (
                <div className={`error-message-inline ${loginErrorClosing ? 'error-scale-out' : 'error-scale-in'}`}>{loginError}</div>
              )}
              <Button type="submit">Sign In</Button>
              <SocialLogin marginTop="20px" />
            </form>

            <div className="login-message-back">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <Button onClick={navigateToSignIn}>Sign In</Button>
            </div>
          </div>

          {/* PANEL DERECHO */}
          <div className="right">
            <div className="info-content" id="right-anim">
              <h1>New Here?</h1>
              <p>Join our community and start your adventure today.</p>
              <Button onClick={navigateToSignUp}>Sign Up</Button>
            </div>

            <form className="signup-content" onSubmit={handleSignUp}>
              <div className="header-section"><h2>Create Account</h2></div>
              <div className="input-group">
                <div className="input-row">
                  <InputField 
                    type="text" placeholder="Username" icon="/svg/user.svg" value={nombre}
                    onChange={(e) => { setNombre(e.target.value); triggerRegisterErrorClear(); }} autoComplete="off"
                  />
                </div>
                <InputField 
                  type="email" placeholder="Email" icon="/svg/letter.svg" value={registerEmail}
                  onChange={(e) => { setRegisterEmail(e.target.value); triggerRegisterErrorClear(); }}
                />
                <div className="input-row">
                  <InputField 
                    type="password" placeholder="Password" icon="/svg/lock.svg" showEye={true} value={registerPassword}
                    onChange={(e) => { setRegisterPassword(e.target.value); triggerRegisterErrorClear(); }}
                  />
                  <InputField 
                    type="password" placeholder="Confirm Password" showEye={true} value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); triggerRegisterErrorClear(); }}
                  />
                </div>
              </div>

              {registerError && (
                <div className={`error-message-inline ${registerErrorClosing ? 'error-scale-out' : 'error-scale-in'}`}>{registerError}</div>
              )}
              <Button type="submit">Create Account</Button>
              <SocialLogin marginTop="10px" />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthPage;