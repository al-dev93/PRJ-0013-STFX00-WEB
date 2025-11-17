const OFFSET_TOP_KICKER = 14.115;
const RAIL_MARGIN_FROM_TEXT = 8; // espace entre rail et colonne texte
const LEFT_GUTTER_MIN = 0; // gouttière gauche minimale
const OFFSET_UNDER_H1 = 14; // vertical-align du rail sous le H1
const CTA_CLEAR = 10; // distance au-dessus du CTA (ne pas toucher)
const MIN_AFTER_H1 = 28; // “air” après le bord droit du H1 si besoin
const TAN_60 = Math.tan(Math.PI / 3); // ≈ 1.732 (oblique 60°)
const MIN_OBLIQUE_DX = 60; // longueur min de l’oblique en x
const CORNER_RADII_DEFAULT = 18; // rayon d’arrondi par défaut
const DISPLAY_BRAND_ELEMENT = false;

export {
  CORNER_RADII_DEFAULT,
  CTA_CLEAR,
  LEFT_GUTTER_MIN,
  MIN_AFTER_H1,
  MIN_OBLIQUE_DX,
  OFFSET_TOP_KICKER,
  OFFSET_UNDER_H1,
  RAIL_MARGIN_FROM_TEXT,
  TAN_60,
  DISPLAY_BRAND_ELEMENT,
};
