import { Dispatch, MouseEventHandler, MutableRefObject, SetStateAction } from 'react';

import { FetchErrorContext } from '@/modules/Error/types';

import type { IconType } from '.';

export type StringObject = {
  readonly [key: string]: string;
};

/**
 * @description A function that updates the state of boolean value.
 * This is used specifically to control boolean state, such as opening/closing dialogs.
 *
 * @type {Dispatch<SetStateAction<boolean>>} SetStateBoolean
 */
export type SetStateBoolean = Dispatch<SetStateAction<boolean>>;

/**
 * @description Type used to handle mouse events on an HTML button element
 * (HTMLButtonElement)
 */
export type MouseEventButton = MouseEventHandler<HTMLButtonElement>;

/**
 * @description Type used for an event object representing a keyboard event bound
 * to an HTML button element and contains details about the keyboard interaction.
 */
export type KeyboardEventButton = KeyboardEvent<HTMLButtonElement>;

/**
 * @description Type used for an event object representing a keyboard event bound
 * to an HTML div element and contains details about the keyboard interaction.
 */
export type KeyboardEventDiv = KeyboardEvent<HTMLDivElement>;

/**
 * @description
 */
export type DialogFormInputElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * @description
 */
export type DialogFormElement = DialogFormInputElement | HTMLElement;

// export type PrimitiveType = 'string' | 'number' | 'boolean' | 'symbol' | 'bigint' | 'undefined';

/**
 * @description on the main page as the layout
 */

/**
 * @description Represents the basic structure of a menu item.
 *
 * @type {object} MenuItemType
 * @property {string} id - The unique identifier for the menu item.
 * @property {string} label - The label or text displayed for the menu item.
 * @property {SectionsRef} anchor - A string reference to the section the menu item links to.
 *
 * @al-dev93
 */
export type MenuItemType = {
  id: string;
  label: string;
  anchor: SectionsRef;
};

/**
 * @description Type use to represent a link to a user account on an external service.
 */
export type AccountLink = {
  id: string;
  service: string;
  icon: IconType;
  onPage?: boolean;
  address?: string;
};

// NOTE: on the index page
/**
 * @description The type of tag to determine its style.
 */
export type TagType = 'alerted' | 'filled' | 'thinned';

/**
 * @description
 */
export type SectionsRef = 'home' | 'work' | 'about' | 'services';

/**
 * @description
 *
 * @type {object} IndexPageSection
 * @extends {Omit<MenuItemType, 'label'>}
 * @property {string} [title] -
 * @property {DetailSection[]} content -
 *
 * @al-dev93
 */
export type IndexPageSection = Omit<MenuItemType, 'label' | 'anchor'> & {
  title?: string;
  content: DetailSection[];
  order: number;
  anchor?: SectionsRef;
};

/**
 * @description Represents the context passed to the page sections from a React Router outlet.
 *
 * @type {object} OutletContextPage
 * @property {MutableRefObject<MenuSectionsVisibility>} viewSectionContext - A mutable reference to the current
 * visible sections of the page.
 * @property {SetStateBoolean} setOpenContactFormDialog - A function to toggle the state of the contact form dialog.
 * @property {boolean} openContactFormDialog - The current state of the contact form dialog.
 * @property {string} modalId - The id of the modal.
 *
 * @al-dev93
 */
export type OutletContextPage = {
  viewSectionContext: MutableRefObject<MenuSectionsVisibility>;
  setOpenContactFormDialog: SetStateBoolean;
  openContactFormDialog: boolean;
  modalId: string;
};

/**
 * @description Represents the visibility state of multiple sections on the page and the active menu item(s)
 * because linked to the section(s).
 * The keys are  section names (strings) and the values are booleans indicating
 * whether each section is visible (`true`) or hidden (`false`).
 *
 * @type {Record<string, boolean>} MenuSectionsVisibility
 */
export type MenuSectionsVisibility = Record<string, boolean>;

export type DetailSection = {
  id: string;
  tag: string;
  wrapped?: boolean;
  name?: string;
  content?: string;
  endpoint?: string;
  boldContent?: DetailSection[];
};

// TODO add comments
/**
 * @description Represents a deliverable of a project.
 *
 * @type {object} Deliverable
 * @property {string} id - The unique identifier for the deliverable.
 * @property {string} service - The service associated with the deliverable.
 * @property {IconType} icon - The icon of the service.
 * @property {string} address - The address of the deliverable on the service.
 * @property {string} [path] - The path of the deliverable.
 */
export type Deliverable = Omit<AccountLink, 'onPage'> & {
  address: string;
  path?: string;
};

/**
 * @description
 * @type
 * @al-dev93
 */
type DisplayMode = 'slideshow' | 'card';
/**
 * @description
 * @type
 * @export
 * @al-dev93
 */
export type ProjectData = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  picture?: string;
  display?: DisplayMode;
  deliverables: Deliverable[];
  projectSheet?: string;
};

export type Skill = {
  id: string;
  text: string;
  value: number;
};

/**
 * Type of the form that is displayed in the contact form modal window and the dialogue with the api.
 *
 * @type {object} ContactFormModal
 * @property {string} id - The unique identifier for the form.
 * @property {string} submitButtonName - The name of the submit button.
 * @property {string} title - The title of the form.
 * @property {string} subtitle - The subtitle of the form.
 * @property {string} [srOnlyDescription] - Descriptive text for SR only.
 * @property {string[]} alertOnSubmit - An array of error messages to display in the alert modal.
 */
export type ContactFormModal = {
  id: string;
  submitButtonName: string;
  title: string;
  subtitle: string;
  srOnlyDescription?: string;
  alertOnSubmit: string[];
  dataFormContent: ContactFormInput[];
};

type InputType = 'text' | 'email' | 'tel' | 'checkbox';
type InputTag = 'input' | 'textarea';

/**
 * Type of content to displayed in the tooltip including
 * text and line spacing size.
 *
 * @type {object} TooltipContent
 * @property {string} id - The unique identifier for the tooltip content.
 * @property {string} line - The text to display in the tooltip.
 * @property {number} [lineHeight] - The line spacing size.
 */
export type TooltipContent = {
  id: string;
  line: string;
  lineHeight?: number;
};

export type ErrorMessage = {
  id: string;
  patternMismatch?: string;
  tooLong?: string;
  tooShort?: string;
  valueMissing?: string;
};

export type FormInput = {
  id: string;
  tag: InputTag;
  type?: InputType;
  placeholder?: string;
  pattern?: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  error?: ErrorMessage;
};

export type ContactFormInput = {
  id: FormInputName;
  label: string;
  input: FormInput;
  tooltipContent?: string | TooltipContent | TooltipContent[];
};

export type ContactMessage = {
  id: string;
  name: string;
  company?: string;
  email: string;
  tel?: string;
  message: string;
  consent: boolean;
};

// NOTE: data fetched via the useFetchData hook

/**
 * Defines the type of parameters used by the custom hook useFetchData
 *
 * @export
 * @type {object} UseFetchDataParams
 * @property {(string | string[] | null)} [endpoint] - final part of the API URL or an array
 * of final part.
 * @property {FetchOptions} initialOptions - The options to use for the fetch request.
 * @property {boolean} [shouldRefetch] - A flag indicating if the data should be refetched.
 * @property {boolean} [edgeFunction] - Whether to target a serverless edge function (true)
 * or the standard API (false).
 */
export type UseFetchDataParams = {
  endpoint?: string | string[] | null;
  initialOptions: FetchOptions;
  shouldRefetch?: boolean;
  edgeFunction?: boolean;
};

// TODO: add comment
/**
 * @description
 * @type
 * @export
 * @al-dev93
 */
export type FetchData =
  | AccountLink[]
  | MenuItemType[]
  | IndexPageSection[]
  | ProjectData[]
  | Skill[]
  | ContactFormModal[]
  | ContactFormInput[]
  | ContactFormModal[]
  | ErrorMessage[]
  | null;

/**
 * Defines the type of the result of the fetch operation with
 * custom hook useFetchData.
 *
 * @export
 * @type {object} FetchResultData
 * @property {(FetchData | FetchData[] | string)} data - The fetched data, either as a single result
 * or an array of results.
 * @property {boolean} isLoaded - Boolean indicating if the fetch is completed.
 * @property {({error: unknown; context?: FetchErrorContext} | null)} fetchError - An error definition object.
 * @property {(url: string | undefined | null, options: FetchOptions) => Promise<void>} refetch - function to
 * manually trigger a fetch request.
 */
export type FetchResultData = {
  data: FetchData | FetchData[] | string;
  isLoaded: boolean;
  fetchError: {
    error: unknown;
    context?: FetchErrorContext;
  } | null;
  refetch: (url: string | undefined | null, options: FetchOptions) => Promise<void>;
};

export type CsrfRecord = {
  token: string;
  fetchedAt: number;
};

/**
 * Options for the fetch request.
 */
export type FetchOptions = RequestInit;

// NOTE: setting up the application operation

/**
 * sets the operating mode
 *
 * @export
 * @type FetchMode
 */
export type FetchMode = 'auto' | 'local' | 'remote';
