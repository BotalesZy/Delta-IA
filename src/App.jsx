// src/App.jsx

import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import OrientationBlocker from "./components/orientationBlock";
import './index.css';


const PageOverlay = ({ state }) => {

  if (!state) return null;

  return (
    <div className={`page-transition-overlay ${state}`} />
  );

};

function App() {
  const navigate = useNavigate();
  const [transitionState, setTransitionState] = useState('');
  const triggerPageTransition = useCallback((targetPath)=>{


    setTransitionState('covering');
    setTimeout(()=>{
      navigate(targetPath);
      setTransitionState('uncovering');

      setTimeout(()=>{
        setTransitionState('');
      },500);
    },500);
  },[navigate]);
  return (
    <>
      {/* Bloquea landscape en móviles */}
      <OrientationBlocker />

      {/* Animación de cambio de página */}
      <PageOverlay state={transitionState}/>

      <Routes>
        <Route
          path="/"
          element={
            <AuthPage 
              onLoginSuccess={
                ()=>triggerPageTransition('/dashboard')
              }
            />
          }
        />
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />
      </Routes>
    </>
  );
}

export default App;