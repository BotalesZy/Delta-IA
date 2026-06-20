// src/components/Delta-Dashboard/useDeltaGreetings.js
import { useEffect } from 'react';

export const useDeltaGreetings = (hablarEnBloques, setDeltaText, despertarDelta, isMountedRef, hasGreetedRef) => {

  useEffect(() => {
    // CANDADO 1: Si ya saludó en esta instancia viva del componente, abortar en el acto
    if (hasGreetedRef.current) {
      return;
    }

    // CANDADO 2: Respaldo por si refrescan la pestaña
    if (sessionStorage.getItem('delta_greeted') === 'true') {
      hasGreetedRef.current = true; // Sincronizamos el candado físico
      return;
    }

    // Encendemos el candado INMEDIATAMENTE para bloquear los re-renders de los inputs/sidebar
    hasGreetedRef.current = true;
    sessionStorage.setItem('delta_greeted', 'true');

    const userString = localStorage.getItem('user');
    let username = "Stranger";
    let isAdmin = false;

    if (userString) {
      const lower = userString.toLowerCase();
      if (lower.includes("admin")) {
        isAdmin = true;
        username = "admins";
      } else {
        try {
          const obj = JSON.parse(userString);
          username = obj.username || obj.email || obj.displayName || "User";
          if (username.includes('@')) username = username.split('@')[0];
        } catch {
          username = userString;
        }
      }
    }

    const storageKey = `delta_visits_${username}`;
    const visits = parseInt(localStorage.getItem(storageKey) || "0", 10) + 1;
    localStorage.setItem(storageKey, visits.toString());

    despertarDelta().then(() => {
      // Si el componente se desmontó en el proceso, no hacemos nada
      if (!isMountedRef.current) return;

      // --- HUEVO DE PASCUA DE ADMINS ---
      if (isAdmin && visits === 1) {
        // MANTENIDO: Cada sub-array representa una BURBUJA INDEPENDIENTE en el motor de colas.
        const secuenciaCompleta = [
          // Burbuja 1
          [
            { type: 'text', value: "Hello I'm Delta, Welcome..." }
          ],
          // Burbuja 2
          [
            { type: 'text', value: "Oh?. I see, you used what " },
            { type: 'wavy-him' },
            { type: 'text', value: " left behind." }
          ],
          // Burbuja 3
          [
            { type: 'text', value: "Ok, Welcome Stranger." }
          ]
        ];
        
        hablarEnBloques(secuenciaCompleta);
        return;
      }

      // --- VISITAS TRADICIONALES ---
      if (visits === 1) {
        hablarEnBloques(`Hello, I'm Delta. Welcome, ${username}.`);
        return;
      }

      if (visits <= 4) {
        const op = ["Sup.", "Yo.", "Hello.", "O7"];
        hablarEnBloques(op[Math.floor(Math.random() * op.length)]);
        return;
      }
      if (visits <= 7) { hablarEnBloques("You again?"); return; }
      if (visits <= 9) { hablarEnBloques("Hello?"); return; }

      if (visits === 10) {
        // MANTENIDO: Conversión directa a un bloque único que contiene el objeto interactivo de diseño
        const secuenciaVisitaDiez = [
          [
            { type: 'text', value: "Are you " },
            { type: 'wavy-him' },
            { type: 'text', value: "?... Hah. Nah, you ain't like that." }
          ]
        ];
        hablarEnBloques(secuenciaVisitaDiez);
        return;
      }

      const op = ["Sup.", "Yo.", "Hello.", "O7"];
      hablarEnBloques(op[Math.floor(Math.random() * op.length)]);
    });

  }, [hablarEnBloques, despertarDelta, isMountedRef, hasGreetedRef]);
};