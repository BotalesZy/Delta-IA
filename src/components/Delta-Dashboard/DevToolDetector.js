// src/components/Delta-Dashboard/useDevToolsDetector.js
import { useEffect, useRef } from 'react';

export const useDevToolsDetector = (eyeState, setEyeStateSynced, setDeltaText, despertarDelta) => {
  const isRegañoActivo = useRef(false);

  useEffect(() => {
    const THRESHOLD = 160;
    let debounceTimer = null;

    const activarRegaño = () => {
      if (isRegañoActivo.current) return;
      isRegañoActivo.current = true; 

      // 👁️ Mandamos directo a la mirada entrecerrada (animada desde cerrado por tu CSS)
      setEyeStateSynced('j-narrow-user');

      // Evaluamos si estaba en un estado de sueño
      const estabaDormida = ['sleepy', 'pre-sleep'].includes(eyeState);

      if (estabaDormida) {
        // Si estaba dormida, el reclamo aparece DE GOLPE para máximo impacto
        setDeltaText("What are you doing? that stuff is Private perv.");
      } else {
        // Si estaba despierta, mantiene tu delay original de 1 segundo
        setDeltaText("");
        setTimeout(() => {
          setDeltaText("What are you doing? that stuff is Private perv.");
        }, 1000);
      }

      // A los 7 segundos se normaliza usando la función despertarDelta
      // (que la regresa a idle y reactiva los timers de inactividad)
      setTimeout(() => {
        despertarDelta().then(() => {
          isRegañoActivo.current = false; // Permite volver a activarse en el futuro
        });
      }, 7000);
    };

    const verificar = () => {
      const diffW = window.outerWidth  - window.innerWidth;
      const diffH = window.outerHeight - window.innerHeight;
      const soloUnEjeGrande = (diffW > THRESHOLD) !== (diffH > THRESHOLD);
      if (soloUnEjeGrande) activarRegaño();
    };

    const onResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(verificar, 400);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(debounceTimer);
    };
    // Añadimos eyeState a las dependencias para que el hook sepa su estado actual
  }, [eyeState, setEyeStateSynced, setDeltaText, despertarDelta]);
};