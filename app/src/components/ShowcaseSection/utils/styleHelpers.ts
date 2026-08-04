type StyleMap = Record<string, string>;

const STYLE_KEY_MAP: StyleMap = {
  hero_kicker: `section__kicker`,
  hero_title: `section__title`,
  hero_pitch: `section__pitch`,
  more_project_cards: `more__cardsWrapper`,
  lead_text: `leadText`,
  section_intro: `sectionIntro`,
  technical_block: `technicalBlock`,
  technical_card: `technicalCard`,
  summary_card: `summaryCard`,
};

export function resolveStyleClass(style: CSSModuleClasses, styleKey: string | undefined): string | undefined {
  if (!styleKey) return undefined;
  const styleProperty = STYLE_KEY_MAP[styleKey];
  return styleProperty ? style[styleProperty] : undefined;
}
