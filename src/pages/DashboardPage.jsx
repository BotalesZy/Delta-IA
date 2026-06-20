// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Delta-Dashboard/Sidebar';
import BotonSB from '../components/buttonSB'; // ⚡ Importación del nuevo botón independiente
import DeltaDisplay from '../components/Delta-Dashboard/DeltaDisplay';
import ChatForm from '../components/Delta-Dashboard/ChatForm';
import SEOManager from '../components/SEOManager';


import { useDevToolsDetector } from '../components/Delta-Dashboard/DevToolDetector';
import { useDeltaGreetings } from '../components/Delta-Dashboard/useDeltaGreetings';

import './css/chatForm.css';
import './css/chatFeed.css';
import './css/dashBoard.css';
import './css/deltaDisplay.css';
import './css/pillToggle.css';
import './css/sideBar.css';
import './css/simpleMode.css';

import './css/movile/sideBarM.css';
import './css/movile/chatFormM.css';
import './css/movile/dashBoardM.css';
import './css/movile/deltaDisplayM.css';
import './css/movile/chatFeedM.css';

import "../components/Emotions/Sleepy.css";
import "../components/Emotions/Sad.css";
import "../components/Emotions/Wakeup.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [activeMessage, setActiveMessage] = useState('');
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [eyeState, setEyeState] = useState('idle');

  const [deltaText, setDeltaText] = useState('');
  const [deltaPositionLeft, setDeltaPositionLeft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [viewMode, setViewMode] = useState('interactive');
  
  const [conversations, setConversations] = useState({});
  const [activeChatId, setActiveChatId] = useState(null);

  const [isWakingUp, setIsWakingUp] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // REFERENCIAS DE FLUJO
  const timeoutRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const sleepTimeoutRef = useRef(null);
  const speechQueueTimeoutRef = useRef(null);
  const deltaSpeechTimeoutRef = useRef(null);
  const sidebarChangeCount = useRef(0);
  const eyeStateRef = useRef('idle');

  const feedScrollRef = useRef(null);
  const messagesEndRef = useRef(null);

  const hablarEnBloquesRef = useRef(null);
  const despertarDeltaRef = useRef(null);
  const setEyeStateSyncedRef = useRef(null);

  const isMountedRef = useRef(true);
  const hasGreetedRef = useRef(false);
  const hasPlayedJuzgona = useRef(false);
  const hasPlayedFeliz = useRef(false);

  const API_URL = "https://monumental-boba-e5890b.netlify.app/.netlify/functions/clon";


  const setEyeStateSynced = useCallback((val) => {
    if (!isMountedRef.current) return;
    if (typeof val === 'function') {
      setEyeState((prev) => {
        const next = val(prev);
        eyeStateRef.current = next;
        return next;
      });
    } else {
      eyeStateRef.current = val;
      setEyeState(val);
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
    
    if (['sleepy', 'pre-sleep', 'wakeup'].includes(eyeStateRef.current)) {
      setEyeStateSynced('idle');
    }

    sleepTimeoutRef.current = setTimeout(() => {
      setEyeStateSynced('pre-sleep');
      sleepTimeoutRef.current = setTimeout(() => {
        setEyeStateSynced('sleepy');
      }, 118000);
    }, 15000);
  }, [setEyeStateSynced]);

  const despertarDelta = useCallback(() => {
    return new Promise((resolve) => {
      if (!isMountedRef.current) return;
      setIsWakingUp(true);
      setEyeStateSynced('wakeup');
      
      setTimeout(() => {
        if (!isMountedRef.current) return;
        setEyeStateSynced('idle');
        resetInactivityTimer();
        setIsWakingUp(false);
        resolve();
      }, 1200);
    });
  }, [setEyeStateSynced, resetInactivityTimer]);

  const hablarEnBloques = useCallback((entradaTexto) => {
    if (!isMountedRef.current) return;
    if (speechQueueTimeoutRef.current) clearTimeout(speechQueueTimeoutRef.current);
    if (deltaSpeechTimeoutRef.current) clearTimeout(deltaSpeechTimeoutRef.current);

    let bloques = [];

    if (typeof entradaTexto === 'string') {
      bloques = entradaTexto.split(/\n+/).map(b => b.trim()).filter(b => b.length > 0);
    } 
    else if (Array.isArray(entradaTexto)) {
      bloques = entradaTexto;
    }

    if (bloques.length === 0) return;

    let bloqueIndice = 0;

    const procesarSiguienteBloque = () => {
      if (!isMountedRef.current) return;

      if (bloqueIndice < bloques.length) {
        const bloqueActual = bloques[bloqueIndice];
        
        setDeltaText(bloqueActual);
        bloqueIndice++;

        if (viewMode === 'interactive') {
          let longitudTexto = 50; 
          if (typeof bloqueActual === 'string') {
            longitudTexto = bloqueActual.length;
          } else if (Array.isArray(bloqueActual)) {
            longitudTexto = bloqueActual.reduce((acc, current) => acc + (current.value ? current.value.length : 15), 0);
          }

          const tiempoLectura = Math.max(4500, Math.min(8500, longitudTexto * 65));
          
          deltaSpeechTimeoutRef.current = setTimeout(() => {
            setDeltaText('');
            speechQueueTimeoutRef.current = setTimeout(procesarSiguienteBloque, 400);
          }, tiempoLectura);
        }
      } else {
        resetInactivityTimer();
      }
    };

    procesarSiguienteBloque();
  }, [resetInactivityTimer, viewMode]);


  useDevToolsDetector(eyeState, setEyeStateSynced, setDeltaText, despertarDelta);
  useDeltaGreetings(hablarEnBloques, setDeltaText, despertarDelta, isMountedRef, hasGreetedRef);

  // Cargar conversaciones organizadas al iniciar el componente
  useEffect(() => {
    isMountedRef.current = true;
    
    const savedConversations = localStorage.getItem('delta_sessions');
    const savedActiveChat = localStorage.getItem('delta_active_chat_id');
    
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed);
      if (savedActiveChat && parsed[savedActiveChat]) {
        setActiveChatId(savedActiveChat);
      } else {
        const keys = Object.keys(parsed);
        if (keys.length > 0) setActiveChatId(keys[0]);
      }
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/');
  };

  const generarTituloIngenioso = (texto) => {
    const LowerText = texto.toLowerCase();
    if (LowerText.includes('hello') || LowerText.includes('hi') || LowerText.includes('hola')) return '⚡ Connection Established';
    if (LowerText.includes('error') || LowerText.includes('fail') || LowerText.includes('bug')) return '🔍 Crash Analysis';
    if (LowerText.includes('help') || LowerText.includes('how')) return '🧠 Vector Query';
    if (LowerText.includes('code') || LowerText.includes('program')) return '💻 Algorithm Flow';
    
    return `✨ Synergy: "${texto.slice(0, 16)}..."`;
  };

  useEffect(() => {
    hablarEnBloquesRef.current = hablarEnBloques;
    despertarDeltaRef.current = despertarDelta;
    setEyeStateSyncedRef.current = setEyeStateSynced;
  }, [hablarEnBloques, despertarDelta, setEyeStateSynced]);

  useEffect(() => {
    window.delta = {
      setCara: (emocion) => {
        if (setEyeStateSyncedRef.current) setEyeStateSyncedRef.current(emocion);
      },
      despertar: () => {
        if (despertarDeltaRef.current) despertarDeltaRef.current();
      },
      setTexto: (texto) => setDeltaText(texto),
      triste: () => {
        if (setEyeStateSyncedRef.current) setEyeStateSyncedRef.current('sad');
      },
      normal: () => {
        if (setEyeStateSyncedRef.current) setEyeStateSyncedRef.current('idle');
      }
    };
    return () => { delete window.delta; };
  }, []);

  const toggleSidebar = () => {
    sidebarChangeCount.current += 1;
    setIsSidebarExpanded(prev => !prev);
    if (eyeStateRef.current !== 'sleepy' && eyeStateRef.current !== 'pre-sleep') {
      resetInactivityTimer();
    }
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    if (id === null) {
      localStorage.removeItem('delta_active_chat_id');
    } else {
      localStorage.setItem('delta_active_chat_id', id);
    }
    setDeltaText('');
    setActiveMessage('');
    setIsBubbleVisible(false);
  };

  const handleUpdateChatTitle = (id, newTitle) => {
    if (!newTitle || !newTitle.trim()) return;
    
    const updatedConversations = { ...conversations };
    if (updatedConversations[id]) {
      updatedConversations[id].title = newTitle.trim();
      setConversations(updatedConversations);
      localStorage.setItem('delta_sessions', JSON.stringify(updatedConversations));
    }
  };

  const handleCreateNewChat = () => {
    const newId = `chat_${Date.now()}`;
    const newChat = {
      id: newId,
      title: '🌱 New Chat',
      messages: []
    };
    const updatedConversations = { [newId]: newChat, ...conversations };
    setConversations(updatedConversations);
    setActiveChatId(newId);
    localStorage.setItem('delta_sessions', JSON.stringify(updatedConversations));
    localStorage.setItem('delta_active_chat_id', newId);
  };

const handleDeleteChat = (idToDelete, e) => {
  if (e) e.stopPropagation();
  
  const updatedConversations = { ...conversations };
  delete updatedConversations[idToDelete];
  
  setConversations(updatedConversations);
  localStorage.setItem('delta_sessions', JSON.stringify(updatedConversations));
 
  if (activeChatId === idToDelete) {
    const remainingKeys = Object.keys(updatedConversations);
    if (remainingKeys.length > 0) {
      setActiveChatId(remainingKeys[0]);
      localStorage.setItem('delta_active_chat_id', remainingKeys[0]);
    } else {
      setActiveChatId(null);
      localStorage.removeItem('delta_active_chat_id');
    }
    setDeltaText('');
    setActiveMessage('');
    setIsBubbleVisible(false);
  }
};

  const startTimer5s = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsBubbleVisible(false);
      setTimeout(() => setActiveMessage(''), 300);
    }, 5000);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    if (isWakingUp) return;
    
    if (eyeStateRef.current === 'sleepy' && newValue.trim().length > 0) {
      despertarDelta();
    } else if (eyeStateRef.current !== 'sleepy' && eyeStateRef.current !== 'wakeup') {
      resetInactivityTimer();
    }
  };

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  const handleScroll = () => {
    if (!feedScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = feedScrollRef.current;
    
    if (scrollHeight - scrollTop - clientHeight > 300) {
      setShowScrollBtn(true);
    } else {
      setShowScrollBtn(false);
    }
  };

  const activeChatMessages = activeChatId && conversations[activeChatId] && conversations[activeChatId].messages
    ? conversations[activeChatId].messages
    : [];

  useEffect(() => {
    if (viewMode === 'simple') {
      scrollToBottom("smooth");
    }
  }, [activeChatMessages.length, isLoading, viewMode]);

  const handleSendMessage = async () => {
    if (isLoading || !message.trim()) return;
    
    const newMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    if (viewMode === 'interactive') {
      if (isBubbleVisible) {
        setIsBubbleVisible(false);
        setTimeout(() => {
          setActiveMessage(newMessage);
          setIsBubbleVisible(true);
          startTimer5s();
        }, 300);
      } else {
        setActiveMessage(newMessage);
        setIsBubbleVisible(true);
        startTimer5s();
      }
    }

    if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
    setEyeStateSynced('reading-l1');

    const timestampActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let currentChatId = activeChatId;
    let localConversations = { ...conversations };

    if (!currentChatId) {
      currentChatId = `chat_${Date.now()}`;
      localConversations[currentChatId] = {
        id: currentChatId,
        title: generarTituloIngenioso(newMessage),
        messages: []
      };
    } else if (!localConversations[currentChatId].messages || localConversations[currentChatId].messages.length === 0) {
      localConversations[currentChatId].messages = [];
      localConversations[currentChatId].title = generarTituloIngenioso(newMessage);
    }

    const userMessageObj = { id: `msg_${Date.now()}`, sender: 'user', text: newMessage, timestamp: timestampActual };
    localConversations[currentChatId].messages.push(userMessageObj);
    
    setConversations(localConversations);
    setActiveChatId(currentChatId);
    localStorage.setItem('delta_sessions', JSON.stringify(localConversations));
    localStorage.setItem('delta_active_chat_id', currentChatId);

    setTimeout(() => scrollToBottom("smooth"), 50);

    const promptContexto = localConversations[currentChatId].messages.map(m => `${m.sender === 'user' ? 'Usuario' : 'Delta'}: ${m.text}`).join('\n');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: newMessage,
          contexto: promptContexto
        })
      });
      
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      
      const data = await response.json();
      if (!isMountedRef.current) return;

      if (data.emocion === 'sad') {
        setEyeStateSynced('sad');
        
        setTimeout(() => {
          if (!isMountedRef.current) return;
          hablarEnBloques(data.respuesta);

          let longitudTexto = typeof data.respuesta === 'string' ? data.respuesta.length : 50;
          const tiempoLectura = Math.max(4500, Math.min(8500, longitudTexto * 65));

          setTimeout(() => {
            if (!isMountedRef.current) return;
            setEyeStateSynced('idle');
            resetInactivityTimer();
          }, tiempoLectura + 500);

        }, 3200);
      } else {
        setEyeStateSynced('idle');
        hablarEnBloques(data.respuesta);
      }

      const deltaMessageObj = {
        id: `msg_${Date.now() + 1}`,
        sender: 'delta',
        text: data.respuesta,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      localConversations[currentChatId].messages.push(deltaMessageObj);
      setConversations({ ...localConversations });
      localStorage.setItem('delta_sessions', JSON.stringify(localConversations));

    } catch (error) {
      console.error(error);
      if (!isMountedRef.current) return;
      setEyeStateSynced('idle');
      
      const textoError = "Uh... something went wrong on my servers. Please try again.";
      hablarEnBloques(textoError);
      resetInactivityTimer();

      const errorMessageObj = { id: `msg_${Date.now() + 2}`, sender: 'delta', text: textoError, timestamp: timestampActual };
      localConversations[currentChatId].messages.push(errorMessageObj);
      setConversations({ ...localConversations });
      localStorage.setItem('delta_sessions', JSON.stringify(localConversations));
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (sidebarChangeCount.current === 0) return;
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (['sleepy', 'pre-sleep', 'wakeup'].includes(eyeStateRef.current)) return;

    if (isSidebarExpanded) {
      if (hasPlayedJuzgona.current) return;
      hasPlayedJuzgona.current = true;
      setEyeStateSynced('j-look-slide');
      animationTimeoutRef.current = setTimeout(() => {
        setEyeStateSynced('j-look-user');
        animationTimeoutRef.current = setTimeout(() => {
          setEyeStateSynced('j-narrow-user');
          animationTimeoutRef.current = setTimeout(() => {
            setEyeStateSynced('j-narrow-slide');
            animationTimeoutRef.current = setTimeout(() => {
              setEyeStateSynced('j-slow-return');
              animationTimeoutRef.current = setTimeout(() => {
                setEyeStateSynced('idle');
                resetInactivityTimer();
              }, 1500);
            }, 2000);
          }, 800);
        }, 1000);
      }, 2000);
    } else {
      if (hasPlayedFeliz.current) return;
      hasPlayedFeliz.current = true;
      setEyeStateSynced('h-look-nw');
      animationTimeoutRef.current = setTimeout(() => {
        setEyeStateSynced('h-look-se');
        animationTimeoutRef.current = setTimeout(() => {
          setEyeStateSynced('idle');
          resetInactivityTimer();
        }, 500);
      }, 500);
    }
  }, [isSidebarExpanded, resetInactivityTimer]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
      if (speechQueueTimeoutRef.current) clearTimeout(speechQueueTimeoutRef.current);
      if (deltaSpeechTimeoutRef.current) clearTimeout(deltaSpeechTimeoutRef.current);
    };
  }, []);

  const obtenerTituloPestaña = () => {
    const chatActivo = activeChatId && conversations[activeChatId];
    return chatActivo ? `${chatActivo.title} — Delta IA` : "Delta IA";
  };

  return (
    <div className={`dashboard-container ${isSidebarExpanded ? 'expanded' : ''}`}>
      
      <SEOManager 
        title={obtenerTituloPestaña()} 
        faviconUrl="/svg/delta.svg" 
      />

      {/* ⚡ BOTÓN FLOTANTE MÓVIL INDEPENDIENTE */}
      <BotonSB 
        isExpanded={isSidebarExpanded} 
        setIsExpanded={setIsSidebarExpanded} 
      />

      <Sidebar
        isSidebarExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
        viewMode={viewMode}
        setViewMode={setViewMode}
        chatHistory={Object.values(conversations)}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onUpdateChatTitle={handleUpdateChatTitle}
        onCreateNewChat={handleCreateNewChat}
        onDeleteChat={handleDeleteChat}
        handleLogout={handleLogout}
      />

      <main className="main-content">
        {viewMode === 'interactive' ? (
          <DeltaDisplay
            viewMode={viewMode}
            deltaPositionLeft={deltaPositionLeft}
            eyeState={eyeState}
            deltaText={deltaText}
          />
        ) : (
          <div className="chat-feed-wrapper">
            <div 
              className="delta-simple-zone-feed" 
              ref={feedScrollRef} 
              onScroll={handleScroll}
            >
              <div className="simple-messages-wrapper">
                {activeChatMessages.length === 0 ? (
                  <div className="delta-simple-zone-empty">
                    <div className="simple-avatar-header">
                      <div className="delta-greek-avatar">Δ</div>
                      <div className="delta-status-info">
                        <h3 className="delta-status-title">DELTA IA</h3>
                        <p className="delta-status-subtitle">
                          Hello, can I help you with something?
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  activeChatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`simple-msg-row ${msg.sender === 'user' ? 'row-user' : 'row-delta'}`}
                    >
                      <div className="simple-msg-avatar">
                        {msg.sender === 'user' ? (
                          <img src="/svg/userD.svg" alt="User" className="avatar-svg-render" />
                        ) : (
                          <span className="delta-symbol-avatar">Δ</span>
                        )}
                      </div>
                      <div className="simple-msg-bubble">
                        <p>{msg.text}</p>
                        <span className="simple-msg-timestamp">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="simple-msg-row row-delta typing-indicator-row">
                    <div className="simple-msg-avatar">
                      <span className="delta-symbol-avatar">Δ</span>
                    </div>
                    <div className="simple-msg-bubble">
                      <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {showScrollBtn && (
              <button
                className="scroll-to-bottom-btn"
                onClick={() => scrollToBottom("smooth")}
              >
                <span className="scroll-arrow">⬇</span>
                To Bottom
              </button>
            )}
          </div>
        )}

        {viewMode === 'interactive' && (
          <div className={`floating-chat-bubble ${isBubbleVisible ? 'visible' : ''}`}>
            {activeMessage}
          </div>
        )}

        <ChatForm
          message={message}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
};

export default DashboardPage;