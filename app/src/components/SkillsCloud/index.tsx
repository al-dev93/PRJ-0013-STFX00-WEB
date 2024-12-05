import IonIcon from '@reacticons/ionicons';
import { Text } from '@visx/text';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import React, { KeyboardEvent, memo, useCallback, useMemo, useState } from 'react';

import { useFetchData } from '@hooks/useFetchData';

import style from './style.module.css';
import {
  ARIA_LABEL_CONTRAST_MODE,
  ARIA_LABEL_ROTATE_MODE,
  CONTRAST_MODE_ICON_OFF,
  CONTRAST_MODE_ICON_ON,
  ROTATE_MODE_ICON_OFF,
  ROTATE_MODE_ICON_ON,
  SKILLS_BASE_FONT_SIZE,
  SKILLS_COLOURS,
  SKILLS_FIXED_VALUE_GENERATOR,
  SKILLS_FONT,
  SKILLS_PADDING,
  SKILLS_SPIRAL_TYPE,
} from './utils/constants';

import type { SkillsCloudProps } from './types';
import type { Skill } from '@/types';

/**
 * SkillsCloud component that displays a word cloud of skills.
 *
 * @component
 * @param {SkillsCloudProps} props - The properties for the SkillsCloud component.
 * @property {Skill[]} [data] - Data needed to create the word cloud (optional).
 * @property {string} [url] - URL to download the data needed to create the word cloud (optional).
 * @property {number} [width=800] - Total width of the word cloud. 800px by default.
 * @property {number} [height=400] - Total height of the word cloud. 400px by default.
 * @returns {React.JSX.Element} The rendered skills cloud component.
 *
 * @al-dev93
 */
function MemoizedSkillsCloud({
  data: skillsData,
  url,
  width = 1000,
  height = 400,
}: SkillsCloudProps): React.JSX.Element {
  const [fontSize, setFontSize] = useState<number>(SKILLS_BASE_FONT_SIZE);
  const [contrastMode, setContrastMode] = useState<boolean>(false);
  const [rotateMode, setRotateMode] = useState<boolean>(false);

  // Determine if data should be fetched based on the presence of skills.
  const shouldFetch = !skillsData;
  // Use useFetchData hook if shouldFetch is true
  const { data: fetchedData, error } = useFetchData(shouldFetch ? url : null, { method: 'GET' });
  // Use skillsData if provided, otherwise use fetched data.
  const data = useMemo((): Skill[] => skillsData || (fetchedData as Skill[]), [fetchedData, skillsData]);

  /**
   * Handles the keydown event to adjust the font size of the skills cloud.
   * Increases font size when the ArrowUp key is pressed and decreases it when the ArrowDown key is pressed.
   *
   * @function
   * @param {KeyboardEvent<HTMLButtonElement>} event - The keyboard event triggered by pressing a key on a button element.
   * @returns {void}
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === 'ArrowUp') setFontSize(fontSize + 1);
      else if (event.key === 'ArrowDown') setFontSize(fontSize - 1);
    },
    [fontSize],
  );

  /**
   * Handles the toggle mode event : contrast mode or rotation mode.
   *
   * @function
   * @param {('contrast' | 'rotate')} mode - The mode to toggle.
   * @returns {void}
   */
  const handleToggleMode = useCallback(
    (mode: 'contrast' | 'rotate'): void =>
      mode === 'rotate' ? setRotateMode(!rotateMode) : setContrastMode(!contrastMode),
    [contrastMode, rotateMode],
  );

  /**
   * Returns a random rotation angle for the words in the word cloud.
   *
   * @function
   * @returns {number} The rotation angle.
   *
   */
  const getRotationAngle = useCallback((): number => {
    const rand = Math.random();
    const degree = rand > 0.5 ? 60 : -60;
    return rand * degree;
  }, []);

  /**
   * Calculates the font size for each word in the word cloud based on its value.
   * The font size is proportional to the value of the word.
   *
   * @function
   * @param {number} value - The value to calculate the font size for.
   * @returns {number} The font size.
   */
  const getFontSize = useCallback(
    (value: number, baseFontSize: number = SKILLS_BASE_FONT_SIZE): number => {
      const values = data?.map((skill) => skill.value);
      const maxValue = data && Math.max(...values);

      return Math.round((baseFontSize * value) / maxValue);
    },
    [data],
  );

  const classNameSkillsCloud = style.skillsCloud + (contrastMode ? ` ${style['skillsCloud--contrastMode']}` : '');

  // TODO: sortir l'erreur
  if (error) {
    console.error(`Failed to load skills data: ${error}`);
  }

  return (
    <div
      className={classNameSkillsCloud}
      role='region'
      aria-labelledby='skillsCloud-title'
      aria-describedby='skillsCloud-description'
    >
      <h3 id='skillsCloud-title' className='visually-hidden'>
        Nuage de compétences
      </h3>
      <p id='skillsCloud-description' className='visually-hidden'>
        AlgoNetDesign possède les compétences suivantes, classées de la plus mobilisée à la moins mobilisée:{' '}
        {data
          ?.sort((a, b) => b.value - a.value)
          .map((skill) => skill.text)
          .join(', ')}
      </p>

      <fieldset className={style.skillsCloud__controls}>
        <legend className='visually-hidden'>Change le contraste ou le mode de rotation</legend>
        <button
          className={style.skillsCloud__controls__toggleMode}
          onClick={() => handleToggleMode('contrast')}
          type='button'
          aria-label={ARIA_LABEL_CONTRAST_MODE}
        >
          <IonIcon name={contrastMode ? CONTRAST_MODE_ICON_OFF : CONTRAST_MODE_ICON_ON} aria-hidden='true' />
        </button>
        <button
          className={style.skillsCloud__controls__toggleMode}
          onClick={() => handleToggleMode('rotate')}
          type='button'
          aria-label={ARIA_LABEL_ROTATE_MODE}
        >
          <IonIcon name={rotateMode ? ROTATE_MODE_ICON_OFF : ROTATE_MODE_ICON_ON} aria-hidden='true' />
        </button>
      </fieldset>
      {data && (
        <button
          className={style.skillsCloud__interactiveWrapper}
          onKeyDown={handleKeyDown}
          type='button'
          aria-label='Change la taille des caractères'
        >
          <div aria-hidden='true'>
            <Wordcloud
              width={width}
              height={height}
              words={data as Skill[]}
              font={SKILLS_FONT}
              fontSize={(datum) => getFontSize(datum.value, fontSize)}
              padding={SKILLS_PADDING}
              spiral={SKILLS_SPIRAL_TYPE}
              rotate={rotateMode ? getRotationAngle : 0}
              random={SKILLS_FIXED_VALUE_GENERATOR}
            >
              {(words) =>
                words.map((word, index) => (
                  <Text
                    key={word.text}
                    fill={contrastMode ? '#000' : SKILLS_COLOURS[index % SKILLS_COLOURS.length]}
                    textAnchor='middle'
                    transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
                    fontSize={getFontSize(word.size as number, fontSize)}
                    fontFamily={word.font}
                  >
                    {word.text}
                  </Text>
                ))
              }
            </Wordcloud>
          </div>
        </button>
      )}
    </div>
  );
}

export const SkillsCloud = memo(MemoizedSkillsCloud);
