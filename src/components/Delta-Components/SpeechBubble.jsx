import React, { useState, useEffect, useMemo, useRef } from 'react';
import './SpeechBubble.css';
import './SpeechBubbleM.css';

const CHARACTER_LIMIT = 250;

const isSegmentArray = (val) =>
  Array.isArray(val) && val.length > 0 &&
  typeof val[0] === 'object' && val[0] !== null && 'type' in val[0];

const splitTextToBlocks = (text) => {
  if (!text) return [];
  const blocks = [];
  let remaining = text.trim();
  while (remaining.length > 0) {
    if (remaining.length <= CHARACTER_LIMIT) { blocks.push(remaining); break; }
    let chunk = remaining.slice(0, CHARACTER_LIMIT);
    let cut = chunk.lastIndexOf('.');
    if (cut === -1) cut = chunk.lastIndexOf(' ');
    if (cut <= 0)   cut = CHARACTER_LIMIT;
    else            cut++;
    blocks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  return blocks;
};

// ─── COMPONENTE ÚNICO Y UNIFICADO: SPEECHBUBBLE ───
const SpeechBubble = ({ text, initialPositionLeft = false }) => {
  // 1. SERIALIZACIÓN Y CANDADO ABSOLUTO DE ENTRADA
  const serializedText = useMemo(() => {
    if (!text && text !== 0) return '';
    if (typeof text === 'string') return text;
    return JSON.stringify(text);
  }, [text]);

  // Almacena el texto que se está procesando actualmente de manera inmutable
  const currentProcessingTextRef = useRef('');

  // 2. ESTADOS DE CONTROL DE FLUJO
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCharCount, setVisibleCharCount] = useState(0);
  const [hasFinishedEntirely, setHasFinishedEntirely] = useState(false);

  const transitionTimerRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // 3. FRAGMENTACIÓN DE BLOQUES
  const bubbleBlocks = useMemo(() => {
    if (!serializedText) return [];
    if (serializedText.startsWith('[') || serializedText.startsWith('{')) {
      try {
        const parsed = JSON.parse(serializedText);
        if (isSegmentArray(parsed)) return [parsed];
        if (Array.isArray(parsed)) {
          return parsed.flatMap(item => typeof item === 'string' ? splitTextToBlocks(item) : [item]);
        }
      } catch (e) {}
    }
    return splitTextToBlocks(serializedText);
  }, [serializedText]);

  // 4. DETECTOR DE NUEVO MENSAJE (RESET SEGURO)
  useEffect(() => {
    // Si el texto entrante es idéntico al que ya procesamos o estamos procesando, bloqueamos el reset
    if (currentProcessingTextRef.current === serializedText) {
      return; 
    }

    // Si es un mensaje genuinamente nuevo de la IA:
    currentProcessingTextRef.current = serializedText;
    
    // Limpieza radical de timers previos
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    // Inicialización limpia
    setActiveBlockIndex(0);
    setVisibleCharCount(0);
    setIsVisible(true);
    setHasFinishedEntirely(false);
  }, [serializedText]);

  // 5. MOTOR DE ESCRITURA INTEGRADO (Mapea longitud total del bloque)
  const currentBlockContent = bubbleBlocks[Math.min(activeBlockIndex, bubbleBlocks.length - 1)];
  const isComplex = Array.isArray(currentBlockContent);

  // Calcula el total de caracteres a escribir (sea String o Array de objetos)
  const targetLength = useMemo(() => {
    if (!currentBlockContent) return 0;
    if (!isComplex) return currentBlockContent.length;
    // Si es complejo, suma los .value de los nodos de texto. Los nodos especiales cuentan como longitud estática.
    return currentBlockContent.reduce((acc, nodo) => {
      if (nodo.type === 'text' && nodo.value) return acc + nodo.value.length;
      if (nodo.type === 'wavy-him') return acc + 3; // "him" tiene longitud 3
      return acc + 5;
    }, 0);
  }, [currentBlockContent, isComplex]);

  useEffect(() => {
    if (hasFinishedEntirely || !isVisible || !currentBlockContent) return;

    // Reiniciamos el conteo de caracteres al cambiar de bloque
    setVisibleCharCount(0);
    let currentLength = 0;

    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      currentLength += 1;
      setVisibleCharCount(currentLength);

      // Cuando termina de escribir el bloque actual
      if (currentLength >= targetLength) {
        clearInterval(typingIntervalRef.current);
        handleBlockExecutionFinished();
      }
    }, 22); // Velocidad de escritura

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [currentBlockContent, activeBlockIndex, isVisible, hasFinishedEntirely, targetLength]);

  // 6. CONTROLADOR DE TRANSICIONES ENTRE BLOQUES / APAGADO
  const handleBlockExecutionFinished = () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);

    const isLastBlock = activeBlockIndex >= bubbleBlocks.length - 1;

    if (isLastBlock) {
      // Tiempo de gracia para leer el final del mensaje (4 segundos fijos)
      transitionTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setHasFinishedEntirely(true); // Bloqueo total para este texto
      }, 4000);
    } else {
      // Transición al siguiente bloque de texto (3.5 segundos de lectura)
      transitionTimerRef.current = setTimeout(() => {
        setIsVisible(false); // Fade out
        
        transitionTimerRef.current = setTimeout(() => {
          setActiveBlockIndex(prev => prev + 1);
          setVisibleCharCount(0);
          setIsVisible(true); // Fade in con nuevo bloque
        }, 300); // Duración de la animación CSS
      }, 3500);
    }
  };

  // 7. RENDERIZADOR COMPLEJO DE MÁQUINA DE ESCRIBIR
  // Esta función recorta el contenido de forma progresiva respetando los objetos y clases CSS
  const renderRichText = () => {
    if (!isComplex) {
      return currentBlockContent.slice(0, visibleCharCount);
    }

    let charsAcumulados = 0;

    return currentBlockContent.map((nodo, index) => {
      if (charsAcumulados >= visibleCharCount) return null;

      if (nodo.type === 'text') {
        const textoRestante = visibleCharCount - charsAcumulados;
        const textoAPintar = nodo.value.slice(0, textoRestante);
        charsAcumulados += nodo.value.length;
        return <span key={index}>{textoAPintar}</span>;
      }

if (nodo.type === 'wavy-him') {
        charsAcumulados += 3; // "him"
        
        // Si la máquina de escribir ya llegó a este punto, renderizamos las letras separadas para la ola
        return (
          <span key={index} className="delta-wavy-container">
            <span className="delta-wavy-letter">h</span>
            <span className="delta-wavy-letter">i</span>
            <span className="delta-wavy-letter">m</span>
          </span>
        );
      }

      return null;
    });
  };

  // Limpieza al desmontar el componente por completo
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  // Renderizado condicional estricto
  if (!serializedText || bubbleBlocks.length === 0 || hasFinishedEntirely) return null;

  const isLeft = activeBlockIndex % 2 === 0 ? initialPositionLeft : !initialPositionLeft;

  if (!isVisible) {
    return <div className="delta-speech-bubble-spacer" style={{ height: '40px' }} />;
  }

  return (
    <div 
      className={`delta-speech-bubble ${isLeft ? 'to-left' : 'to-right'}`}
      key={`fixed-bubble-node-${serializedText.slice(0, 10)}`}
    >
      <div className="bubble-content">
        <p>{renderRichText()}</p>
      </div>
      <div className="bubble-arrow"></div>
    </div>
  );
};

export default SpeechBubble;