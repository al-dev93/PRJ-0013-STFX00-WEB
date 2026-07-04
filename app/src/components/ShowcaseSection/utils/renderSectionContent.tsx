import { ReactElement, ReactNode } from 'react';

import { DetailEntity, DetailSection, Item } from '@/types';
import { DynamicElement } from '@components/DynamicElement';
import { DynamicElementContainer } from '@components/DynamicElementContainer';
import { isComponentTag } from '@utils/componentElementHelpers';
import { isHtmlTag } from '@utils/htmlElementHelpers';
import { renderFormattedText } from '@utils/stylizedString';

import { resolveStyleClass } from './styleHelpers';
import { RenderContext } from '../types';

function isDetailSection(node: DetailEntity): node is DetailSection {
  return node.level === 'section';
}

function isItem(node: DetailEntity): node is Item {
  return node.level === 'item';
}

function formatText(value?: string): React.ReactNode | undefined {
  return typeof value === 'string' ? renderFormattedText(value) : undefined;
}

function getHeroNodeRef(
  node: DetailSection,
  context: RenderContext,
): React.RefObject<HTMLParagraphElement | HTMLHeadingElement> | undefined {
  if (['hero_kicker_ref', 'hero_title_ref'].includes(node.blockKey ?? '')) {
    return undefined;
  }
  if (node.blockKey === 'hero_kicker_ref') return context.kickerRef;
  return context.titleRef;
}

function renderNode(node: DetailEntity, context: RenderContext, children?: ReactNode) {
  const className = resolveStyleClass(context.style, node.styleKey);
  const ref = isDetailSection(node) && context.isHero ? getHeroNodeRef(node, context) : undefined;
  const introduction = isDetailSection(node) && node.sectionIntroduction ? node.sectionIntroduction : undefined;

  if (node.tagKind === 'html') {
    const { tag, content } = node;

    if (!isHtmlTag(tag)) return null;

    return (
      <DynamicElement
        key={node.id}
        tagKind='html'
        tag={tag}
        className={className}
        id={isDetailSection(node) && tag === 'h1' && context.anchor ? `${context.anchor}-title` : undefined}
        ref={ref}
      >
        {formatText(content)}
        {children}
      </DynamicElement>
    );
  }

  if (node.tagKind === 'react_component') {
    const { tag, variant, endpoint, name, content, iconName, wrapped } = node;

    if (!isComponentTag(tag)) return null;

    if (wrapped) {
      return (
        <DynamicElementContainer
          key={node.id}
          tagKind='react_component'
          tag={tag}
          className={className}
          endpoint={endpoint}
          introduction={introduction}
          method='POST'
        />
      );
    }

    return (
      <DynamicElement
        key={node.id}
        tagKind='react_component'
        tag={tag}
        className={className}
        variant={variant}
        endpoint={endpoint}
        name={formatText(name)}
        content={formatText(content)}
        iconName={iconName}
        blockKey={isDetailSection(node) ? node.blockKey : undefined}
        itemKey={isItem(node) ? node.itemKey : undefined}
        introduction={introduction}
        ref={ref}
      >
        {children}
      </DynamicElement>
    );
  }
  return null;
}

function renderItem(item: Item, context: RenderContext): ReactElement | null {
  return renderNode(item, context);
}

function renderDetailSection(section: DetailSection, context: RenderContext): ReactElement | null {
  const itemChildren = section.wrapped ? undefined : section.items.map((item) => renderItem(item, context));

  return renderNode(section, context, itemChildren);
}

export function renderSectionContent(detailSections: DetailSection[], context: RenderContext): ReactElement[] {
  return detailSections
    .map((section) => renderDetailSection(section, context))
    .filter((element): element is ReactElement => element !== null);
}
