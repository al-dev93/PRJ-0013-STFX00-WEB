import { DetailSection } from '@/types';

type ShowcaseSectionColumn = 'main' | 'secondary';

interface ShowcaseSectionColumns {
  main: DetailSection[];
  secondary: DetailSection[];
}

const SECTION_COLUMN_BY_BLOCK_KEY: Readonly<Record<string, ShowcaseSectionColumn>> = {
  intervention_areas: 'main',
  technical_foudation: 'main',
  complement: 'main',
  cross_cutting_skills: 'main',
  summary: 'secondary',
  methodology: 'secondary',
};

export function getShowcaseSectionColumn(detailSections: DetailSection[]): ShowcaseSectionColumns {
  const layoutSection = detailSections.reduce(
    (acc: ShowcaseSectionColumns, section) => {
      return SECTION_COLUMN_BY_BLOCK_KEY[`${section.blockKey}`] === 'secondary'
        ? { ...acc, secondary: [...acc.secondary, section] }
        : { ...acc, main: [...acc.main, section] };
    },
    { main: [], secondary: [] },
  );
  return layoutSection;
}
