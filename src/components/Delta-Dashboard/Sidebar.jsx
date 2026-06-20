// src/components/Delta-Dashboard/Sidebar.jsx
import React, { useState, useEffect, useRef } from 'react';

const Sidebar = ({
  isSidebarExpanded,
  toggleSidebar,
  viewMode,
  setViewMode,
  chatHistory,       // Array de sesiones (conversaciones)
  activeChatId,      // ID del chat abierto
  onSelectChat,      // Función para cambiar de chat (enviará null)
  onCreateNewChat,   // Función para crear un chat nuevo
  onUpdateChatTitle, // Función integrada para actualizar título
  onDeleteChat,      // Función para borrar
  handleLogout
}) => {
  // Estado para controlar cuál menú de 3 puntos está abierto
  const [activeMenuChatId, setActiveMenuChatId] = useState(null);
  
  // Guarda qué chat está actualmente en modo edición "textbox"
  const [editingChatId, setEditingChatId] = useState(null);

  // Estado para almacenar el nombre del usuario autenticado
  const [username, setUsername] = useState('User');

  // 🛠️ NUEVO: referencia al <aside> completo del sidebar, para poder
  // comparar contra ella en el listener de "clic afuera".
  const sidebarRef = useRef(null);

  // Cerrar el menú desplegable si se hace clic fuera de él y cargar datos de usuario
  useEffect(() => {
    const closeMenu = () => setActiveMenuChatId(null);
    window.addEventListener('click', closeMenu);

    // Recuperar el objeto o string del usuario desde localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUsername(parsedUser.name || parsedUser.username || parsedUser || 'User');
      } catch (e) {
        setUsername(savedUser);
      }
    }

    return () => window.removeEventListener('click', closeMenu);
  }, []);

  // -----------------------------------------------------------
  // 🛠️ NUEVO: cerrar el sidebar al hacer clic fuera de él.
  // -----------------------------------------------------------
  // Funciona tanto en PC como en celular, porque escucha clics en
  // todo el documento, no algo exclusivo de móvil.
  //
  // Dos excepciones importantes que SÍ deben dejar pasar el clic
  // sin cerrar el sidebar:
  //   1. Clics dentro del propio sidebar (sidebarRef) — si no,
  //      jamás podrías hacer clic en nada de adentro.
  //   2. Clics en el botón flotante móvil (.boton-flotante-movil)
  //      — si no, el mismo clic que ABRE el sidebar lo cerraría
  //      de inmediato por este mismo listener, en el mismo evento.
  useEffect(() => {
    if (!isSidebarExpanded) return; // Solo escuchamos cuando está abierto, por eficiencia

    const handleClickOutside = (event) => {
      const clickedInsideSidebar =
        sidebarRef.current && sidebarRef.current.contains(event.target);

      const clickedFloatingButton =
        event.target.closest && event.target.closest('.boton-flotante-movil');

      if (!clickedInsideSidebar && !clickedFloatingButton) {
        toggleSidebar();
      }
    };

    // 🛠️ CONTROL: usamos 'mousedown' en vez de 'click' a propósito.
    // 'mousedown' dispara ANTES que el 'onClick' de otros botones,
    // así evitamos carreras raras entre "cerrar sidebar" y "abrir
    // un chat" cuando ambos clics casi coinciden.
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarExpanded, toggleSidebar]);

  // Manejador del botón de los 3 puntos
  const handleDropdownTrigger = (e, chatId) => {
    e.stopPropagation(); // Evita que se seleccione el chat al abrir el menú
    setActiveMenuChatId(activeMenuChatId === chatId ? null : chatId);
  };

  // Acción al hacer clic en "Edit Title"
  const handleRenameClick = (e, chatId) => {
    e.stopPropagation();
    setActiveMenuChatId(null); // Cierra el menú flotante de 3 puntos
    setEditingChatId(chatId);   // Activamos el permiso de edición exclusivo para este chat

    // Esperamos a que React renderice el cambio de atributo a True para darle Foco
    setTimeout(() => {
      const editableElement = document.getElementById(`title-editable-${chatId}`);
      if (editableElement) {
        editableElement.focus();
        
        // Seleccionar todo el texto automáticamente para reescribir cómodamente
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(editableElement);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 50);
  };

  // Manejador para cuando el usuario hace clic en el Logo/Título Principal
  const handleTitleClick = () => {
    if (onSelectChat) {
      onSelectChat(null); 
    }
    if (isSidebarExpanded) {
      toggleSidebar();
    }
  };

  return (
    <aside className="sidebar" ref={sidebarRef}>
      <div className="sidebar-top-section">
        <div className="hamburger-container">
          <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </button>
          
          <span 
            className="sidebar-delta-logo" 
            onClick={handleTitleClick}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            Δ Delta IA
          </span>
        </div>
      </div>

      <div className="sidebar-toggle-wrapper">
        <div className="pill-toggle-container">
          <div className={`pill-slider ${viewMode}`} />
          <button 
            type="button" 
            className={`toggle-btn ${viewMode === 'simple' ? 'active-label' : ''}`} 
            onClick={() => setViewMode('simple')}
          >
            Simple
          </button>
          <button 
            type="button" 
            className={`toggle-btn ${viewMode === 'interactive' ? 'active-label' : ''}`} 
            onClick={() => setViewMode('interactive')}
          >
            Interactive
          </button>
        </div>
      </div>

      <div className="sidebar-history-section">
        <p className="history-section-title">Recent Chats</p>
        
        <button 
          onClick={() => {
            onCreateNewChat();
            if (isSidebarExpanded) {
              toggleSidebar();
            }
          }} 
          className="sidebar-item primary-item"
        >
          <div className="icon-wrapper">＋</div>
          <span className="history-text">New Chat</span>
        </button>

        <div className="history-list">
          {chatHistory.length === 0 ? (
            <span className="empty-history-text">No chats yet</span>
          ) : (
            chatHistory.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => onSelectChat(chat.id)}
                className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
              >
                <div 
                  className="editable-chat-title-container"
                  style={{ pointerEvents: editingChatId === chat.id ? 'auto' : 'none' }}
                >
                  {isSidebarExpanded && <span className="history-icon">💬</span>}
                  
                  <span 
                    id={`title-editable-${chat.id}`}
                    className={`history-text editable-chat-title ${editingChatId === chat.id ? 'is-editing' : ''}`}
                    contentEditable={editingChatId === chat.id} 
                    suppressContentEditableWarning={true}
                    title={chat.title}
                    onClick={(e) => {
                      if (editingChatId === chat.id) {
                        e.stopPropagation();
                      }
                    }} 
                    onBlur={(e) => {
                      setEditingChatId(null);
                      const text = e.target.innerText.trim();
                      if (text !== "") {
                        onUpdateChatTitle(chat.id, text);
                      } else {
                        e.target.innerText = chat.title || '🌱 New Chat';
                      }
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation(); 
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur();
                      }
                    }}
                    style={{ cursor: editingChatId === chat.id ? 'text' : 'pointer' }}
                  >
                    {chat.title || '🌱 New Chat'}
                  </span>
                </div>

                {isSidebarExpanded && (
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}>
                    <button
                      className="chat-options-trigger"
                      onClick={(e) => handleDropdownTrigger(e, chat.id)}
                      title="Chat options"
                    >
                      ⋮
                    </button>

                    {activeMenuChatId === chat.id && (
                      <div className="sidebar-dropdown-menu">
                        <button
                          className="dropdown-action-btn"
                          onClick={(e) => handleRenameClick(e, chat.id)}
                        >
                          <img src="/svg/pen.svg" alt="Edit" /> Edit Title
                        </button>
                        
                        <button
                          className="dropdown-action-btn delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuChatId(null);
                            onDeleteChat(chat.id, e);
                          }}
                        >
                          <img src="/svg/bin.svg" alt="Delete" /> Delete Chat
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="user-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Contenedor flexible forzado en fila hacia la derecha */}
        <div className="user-profile-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
          <div className="user-avatar-wrapper">
            <img src="/svg/userD.svg" alt="User" className="user-avatar" />
          </div>
          
          {/* Nombre a la derecha, en negrita, itálica y con outline por texto-shadow */}
          {isSidebarExpanded && (
            <span 
              className="sidebar-username-text" 
              title={username}
              style={{
                fontSize: '15px',
                fontWeight: 'bold',
                fontStyle: 'italic',
                color: '#ffffff',
                textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {username}
            </span>
          )}
        </div>

        <button className="logout-icon-btn" onClick={handleLogout} aria-label="Sign Out">
          <svg viewBox="0 0 24 24" className="sidebar-icon">
            <path fill="currentColor" d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;