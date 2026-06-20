// src/components/Delta-Dashboard/ChatForm.jsx
import React, { useEffect, useRef } from 'react';

const ChatForm = ({ message, isLoading, handleInputChange, handleSendMessage }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      const scrollHeight = textareaRef.current.scrollHeight;
      if (scrollHeight > 24) textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Condición estricta: ¿El usuario escribió algo de texto?
  const hasText = message && message.trim().length > 0;

  return (
    <form className="chat-input-container" onSubmit={(e) => e.preventDefault()}>
      <textarea
        ref={textareaRef}
        placeholder={isLoading ? "Delta is processing..." : "Write a message to Delta..."}
        value={message}
        disabled={isLoading}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        maxLength={500}
        className="chat-input"
      />
      <button 
        type="button" 
        onClick={() => handleSendMessage()} 
        // Solo lleva 'has-text' si hay texto real escrito
        className={`chat-send-btn ${hasText ? 'has-text' : ''}`} 
        disabled={isLoading || !hasText}
      >
        <svg viewBox="0 0 24 24" className="send-icon">
          <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </form>
  );
};

export default ChatForm;