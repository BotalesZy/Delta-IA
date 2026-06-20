import { useEffect } from 'react';

export default function SEOManager({ title, faviconUrl }) {
  useEffect(() => {
    // 1. Actualizar el título de la pestaña
    if (title) {
      document.title = title;
    }

    // 2. Actualizar el icono de la pestaña (Favicon)
    if (faviconUrl) {
      const link = document.querySelector("link[rel~='icon']");
      
      if (link) {
        link.href = faviconUrl;
      } else {
        // Por si acaso no existe la etiqueta link en tu index.html, la crea
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = faviconUrl;
        document.head.appendChild(newLink);
      }
    }
  }, [title, faviconUrl]); // Se vuelve a ejecutar si el título o la ruta del icono cambian

  return null; // Este componente no renderiza HTML, solo maneja lógica del navegador
}