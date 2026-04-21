import React from 'react';

function toRealNewLines(s: string) {
  return s.replaceAll('\\r\\n', '\n').replaceAll('\\n', '\n');
}

export function renderFormattedText(text?: string) {
  if (!text) return undefined;

  // On split avec groupe capturant => parts = [seg, **bold**, seg, **bold**, seg, ...]
  const parts = toRealNewLines(text).split(/(\*\*[^*]+\*\*)/g);

  // On parcourt fonctionnellement en maintenant un offset cumulatif
  let offset = 0;
  return parts.map((part) => {
    // si part est un segment gras **…**
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      const raw = m[0]; // ex: **Mot**
      const inner = m[1]; // ex: Mot
      const start = offset; // position du début du ** dans le texte reconstruit
      const end = start + raw.length;
      offset = end; // avance l’offset pour la suite
      return <strong key={`b:${start}-${end}`}>{inner}</strong>;
    }

    // segment normal : clé = début de segment
    const start = offset;
    const end = start + part.length;
    offset = end;
    return <React.Fragment key={`n:${start}`}>{part}</React.Fragment>;
  });
}
