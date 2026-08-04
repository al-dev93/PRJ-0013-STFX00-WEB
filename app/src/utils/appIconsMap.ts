import figmaIcon from '@iconify-icons/simple-icons/figma';
import githubIcon from '@iconify-icons/simple-icons/github';
import linkedinIcon from '@iconify-icons/simple-icons/linkedin';
import npmIcon from '@iconify-icons/simple-icons/npm';
import reactIcon from '@iconify-icons/simple-icons/react';
// import typescriptIcon from '@iconify-icons/simple-icons/typescript';
import {
  ArrowSquareOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckCircleIcon,
  CodeIcon,
  CubeIcon,
  EarIcon,
  FileTextIcon,
  FlaskIcon,
  FolderOpenIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
  PencilSimpleIcon,
  PersonSimpleCircleIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StackIcon,
  StackPlusIcon,
  TargetIcon,
  TrendUpIcon,
  UsersThreeIcon,
  XIcon,
} from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
import type { ComponentType } from 'react';

export const LOCAL_ICON_NAME = {
  FOLDER_OPEN: 'folderOpen',
  NEXT_CHEVRON: 'next',
  PREV_CHEVRON: 'previous',
  LAYERS: 'stack',
  CLOSE: 'close',
  VALIDATED: 'validated',
  EDIT: 'edit',
  INFO: 'info',
} as const;

export const LOCAL_PHOSPHOR_ICONS = {
  [LOCAL_ICON_NAME.FOLDER_OPEN]: FolderOpenIcon,
  [LOCAL_ICON_NAME.NEXT_CHEVRON]: CaretRightIcon,
  [LOCAL_ICON_NAME.PREV_CHEVRON]: CaretLeftIcon,
  [LOCAL_ICON_NAME.LAYERS]: StackIcon,
  [LOCAL_ICON_NAME.CLOSE]: XIcon,
  [LOCAL_ICON_NAME.VALIDATED]: CheckCircleIcon,
  [LOCAL_ICON_NAME.EDIT]: PencilSimpleIcon,
  [LOCAL_ICON_NAME.INFO]: InfoIcon,
} as const satisfies Record<string, ComponentType<IconProps>>;

export const PHOSPHOR_ICONS = {
  send: PaperPlaneTiltIcon,
  externalLink: ArrowSquareOutIcon,
  document: FileTextIcon,
  stabilize: ShieldCheckIcon,
  optimize: TrendUpIcon,
  modernize: CubeIcon,
  code: CodeIcon,
  accessibility: PersonSimpleCircleIcon,
  tests: FlaskIcon,
  documentation: FileTextIcon,
  stack: StackPlusIcon,
  problemSolving: TargetIcon,
  listening: EarIcon,
  creativity: SparkleIcon,
  curiosity: MagnifyingGlassIcon,
  projectManagement: UsersThreeIcon,
  agility: RocketLaunchIcon,
  success: CheckCircleIcon,
} as const satisfies Record<string, ComponentType<IconProps>>;

export const ICONIFY_ICONS = {
  linkedin: linkedinIcon,
  github: githubIcon,
  npm: npmIcon,
  figma: figmaIcon,
  typescript: 'vscode-icons:file-type-typescript',
  react: reactIcon,
} as const;

export const APP_ICONS = { ...ICONIFY_ICONS, ...PHOSPHOR_ICONS };
