import { Dispatch } from 'react';

import type {
  ContactFormInput,
  ContactFormModal,
  DialogFormInputElement,
  ErrorMessage,
  FormInput,
  SetStateBoolean,
  TooltipContent,
} from '@/types';

import {
  AUTO_COMPLETION,
  DELETE_ERROR_TAG_NAME,
  DELETE_INPUT_ERROR,
  DELETE_INPUT_VALUE,
  FULL_HISTORY,
  IN_EDIT_MODE,
  INIT_DIALOG_CONTACT_FORM_STATE,
  RESET_AUTO_COMPLETE_OVERLAY,
  SET_AUTO_COMPLETE,
  SET_ERROR_TAG_NAME,
  SET_INPUT_BORDER_BOX,
  SET_INPUT_ERROR,
  SET_INPUT_FOCUS,
  SET_INPUT_HOVER,
  SET_INPUT_NODE,
  SET_INPUT_VALUE,
  SET_IS_STORED,
  SET_POPOVER_LIST_FOCUSED_INDEX,
  SET_POPOVER_MODE,
} from './utils/constants';

//* ***** TYPES USED BY MODALDIALOGCONTACTFORM MODULE COMPONENTS ****

/**
 * this object specifies the props used by the ModalDialogContactForm component.
 *
 * @type {Object} ModalDialogContactFormProps
 * @property {boolean} open - state to manage the open/close status of the modale window.
 * @property {SetStateBoolean} setOpen - function to set the open state of the modale window.
 * @property {string} modalId - the id of the modale window.
 * @property {ContactFormModal} [data] - the data used to create the contact form modal.
 * Either `data` or `url` must be provided
 * @property {string | string[]} [url] - URL or array of URLs to fetch the data used to create the contact form modal.
 * Either `data` or `url` must be provided
 *
 * @al-dev93
 */
export type ModalDialogContactFormProps = {
  open: boolean;
  setOpen: SetStateBoolean;
  modalId: string;
} & ({ data: ContactFormModal; url?: never } | { data?: never; url: string | string[] });

/**
 * Represents the configuration object for the component DialogFormInput
 * used in the module ModalDialogContactForm
 *
 * @type {Object} DialogFormInputProps
 * @property {Dispatch<ModalDialogContactFormAction>} dispatch - the dispatch function
 * to handle actions related to the modal dialog contact form
 * @property {FormInput} formInput - the definition of the input or textarea element of the form
 * @property {string} label - the label for the input element
 * @property {string} name - the nameattribute for the input element
 * @property {ModalDialogContactFormState} formState - the current state of the modal dialog
 * contact form
 * @property {TooltipContent[]} [tooltipContent] - content for tooltips associated with
 * the input element (optional)
 *
 * @al-dev93
 */
export type DialogFormInputProps = {
  formInput: FormInput;
  label: string;
  name: string;
  tooltipContent?: TooltipContent[];
};

/**
 * Represents the configuration object for the component Popover
 * used in the module ModalDialogContactForm
 *
 * @type {Object} PopoverProps
 * @property {string} name - The name of the input element.
 * @property {string} [errorMessage] - Error messages associated with input validation.
 * @property {(content: string) => void} inputAutocomplete - Callback function to handle input autocomplete.
 *
 * @al-dev93
 */
export type PopoverProps = {
  name: string;
  errorMessage?: string;
  inputAutocomplete: (content: string) => void;
};

/**
 * @description
 *
 * @type {Object} AlertProps
 * @property {boolean} showAlert - A boolean that controls whether the alert modal is open.
 * @property {SetStateBoolean} setShowAlert - A function to toggle the open/close state of the alert modal.
 * @property {(string | string[])} message - The message(s) to display in the alert. Can be a string or an array of strings.
 * @property {SetStateBoolean} [closeParentModal] - A function to close the parent modal, if necessary (optional).
 *
 * @al-dev93
 */
export type AlertProps = {
  closeParentModal?: SetStateBoolean;
  message: string | string[];
  showAlert: boolean;
  setShowAlert: SetStateBoolean;
};

/**
 * Represents the form embedded in the contact modal window and the dialogue with the api.
 *
 * @type {Object} FormProps
 * @property {string} idForm - The form identifier in HTML.
 * @property {string} apiEndpointUrl - URL allowing dialogue with the API.
 * @property {string} [urlFormContent] - URL to fetch the elements embedded in the FormContent component
 * (optional, used if dataFormContent is not used).
 * @property {ContactFormInput[]} [dataFormContent] - Data on elements embedded in the FormContent component
 * (optional,used if urlFormContent is not used).
 * @property {SetStateBoolean} setShowAlert - A function to toggle the open/close state of the alert modal.
 * @property {SetStateBoolean} onRenderComplete - Function to toggle the flag that tracks whether the
 * FormContent component is rendered.
 *
 * @al-dev93
 */
export type FormProps = {
  idForm: string;
  apiEndpointUrl: string;
  setShowAlert: SetStateBoolean;
  onRenderComplete: SetStateBoolean;
} & (
  | { dataFormContent: ContactFormInput[]; urlFormContent?: never }
  | { dataFormContent?: never; urlFormContent: string }
);

/**
 * Represents the content of the form embedded in the contact modal window.
 *
 * @type {Object} FormContentProps
 * @property {string} [urlFormContent] - URL to fetch the elements embedded in the FormContent component
 * (optional, used if dataFormContent is not used)
 * @property {ContactFormInput[]} [dataFormContent] - Data on elements embedded in the FormContent component
 * (optional,used if urlFormContent is not used)
 * @property {ModalDialogContactFormState} formState - the current state of the modal dialog contact form.
 * @property {Dispatch<ModalDialogContactFormAction>} dispatch - the dispatch function to handle actions
 * related to the modal dialog contact form.
 * @property {SetStateBoolean} onRenderComplete - Function to toggle the flag that tracks whether the
 * FormContent component is rendered.
 *
 * @al-dev93
 */
export type FormContentProps = Omit<FormProps, 'idForm' | 'apiEndpointUrl' | 'setShowAlert'>;

//* *************************** MISCELLANEOUS TYPES ******************************

/**
 * Represents the values assignable to the input field name.
 *
 * @export
 * @type {('name' | 'company' | 'email' | 'tel' | 'message' | 'consent')} FormInputName
 */
export type FormInputName = 'name' | 'company' | 'email' | 'tel' | 'message' | 'consent';

/**
 * Represents the autocomplete overlay type.
 *
 * @type {typeof AUTO_COMPLETION | typeof FULL_HISTORY}
 *
 * @al-dev93
 */
export type OverlayType = typeof AUTO_COMPLETION | typeof FULL_HISTORY;

/**
 * Represents a mapping of input names to their corresponding error messages
 *
 * @type {Object} InputErrorMessage
 * @property {Object.<string, ErrorMessage>} - a map where the key is a string
 * representing the input name and the value is an ErrorMessage object.
 *
 * @al-dev93
 */
export type InputErrorMessage = {
  [key: string]: ErrorMessage;
};

/**
 * Represents the validity state of the contact form field (input or textarea)
 *
 * @type {Object} Validity
 * @property {number} [minLength] - the minimum length required for the field (optional)
 * @property {boolean} [patternMismatch] - indicates if the value does not match
 * the specific pattern (optional)
 * @property {boolean} [tooShort] - indicates if the value is shorter than the required
 * minimum length (optional)
 * @property {boolean} [tooLong] - indicates if the value is longer than the required
 * maximum length (optional)
 * @property {boolean} valid - indicates if the field is valid
 * @property {boolean} [valueMissing] - indicates if the field is required
 * but not filled (optional)
 *
 * @al-dev93
 */
export type Validity = {
  maxLength?: number;
  minLength?: number;
  patternMismatch?: boolean;
  tooShort?: boolean;
  tooLong?: boolean;
  valid: boolean;
  valueMissing?: boolean;
};

/**
 * Represents the error status of an input field. This type can either be
 * 'remplir' (indicating the field needs to be filled) or 'modifier' (indicating the field needs to be modified).
 *
 * @type {('remplir' | 'modifier')} InputStatus
 *
 * @al-dev93
 */
export type InputStatus = 'remplir' | 'modifier';

/**
 * Represents the visual styling of an input field's border box.
 * This type can either be 'edited' (indicating the input field is valid and has been edited)
 * or 'error' (indicating the input field is invalid).
 *
 * @type {('edited' | 'error')} InputBorderBox
 *
 * @al-dev93
 */
export type InputBorderBox = 'edited' | 'error';

//* *************************** STATE ******************************

/**
 * Represents the state of a contact form in a modal dialog.
 *
 * Each form field (represented by `name`) holds its own state object containing
 * validation, focus, input value, autocomplete options, and visual styling properties.
 *
 * @type {Object, <string, FieldState>} ModalDialogContactFormState
 * @property {Validity} [inputError] - Optional validation error for the input field, indicating its validity.
 * @property {boolean} isFocused - Indicates whether the input field is currently focused.
 * @property {boolean} [isStored] - Indicates whether the input field value is stored in local storage.
 * @property {HTMLInputElement | HTMLTextAreaElement} inputElement - The HTML element representing the input field.
 * @property {InputStatus} [inputStatusTag] - Optional tag representing the current status of the input
 * field (e.g. `remplir`, `modifier`).
 * @property {InputBorderBox} [inputBorderBox] - Optional styling for the input field's border box.
 * @property {string} [inputValue] - The current value of the input field.
 * @property {string[]} [autoComplete] - Optional array of autocomplete suggestions for the input field.
 * @property {number} [listItemFocused] - The index of the focused item in the autocomplete list.
 * @property {(string | null)} [applyAutoCompleteToInput] - The value to apply from the autocomplete suggestions,
 * or null if not applicable.
 * @property {OverlayType} [popoverMode] - The type of overlay to display (if applicable).
 * @property {boolean} [inEdition] - Indicates whether the input field is in edition mode.
 * @property {boolean} [isHovered] - Indicates whether the input field is currently hovered.
 *
 * @al-dev93
 */
export type ModalDialogContactFormState = {
  [name: string]: FieldState;
};

/**
 * Represents the state of a single form field in the contact form.
 *
 * @type {Object} FieldState
 * @property {Validity} [inputError] - Optional validation error for the input field, indicating its validity.
 * @property {boolean} isFocused - Indicates whether the input field is currently focused.
 * @property {boolean} [isStored] - Indicates whether the input field value is stored in local storage.
 * @property {DialogFormInputElement} inputElement - The HTML element representing the input field.
 * @property {InputStatus} [inputStatusTag] - Optional tag representing the current status of the input
 * field (e.g. `remplir`, `modifier`).
 * @property {InputBorderBox} [inputBorderBox] - Optional styling for the input field's border box.
 * @property {string} [inputValue] - The current value of the input field.
 * @property {string[]} [autoComplete] - Optional array of autocomplete suggestions for the input field.
 * @property {number} [listItemFocused] - The index of the focused item in the autocomplete list.
 * @property {(string | null)} [applyAutoCompleteToInput] - The value to apply from the autocomplete suggestions,
 * or null if not applicable.
 * @property {OverlayType} [popoverMode] - The type of overlay to display (if applicable).
 * @property {boolean} [inEdition] - Indicates whether the input field is in edition mode.
 * @property {boolean} [isHovered] - Indicates whether the input field is currently hovered.
 *
 * @al-dev93
 */
export type FieldState = {
  inputError?: Validity;
  isFocused: boolean;
  isHovered?: boolean;
  isStored?: boolean;
  inputNode?: DialogFormInputElement;
  inputStatusTag?: InputStatus;
  inputBorderBox?: InputBorderBox;
  inputValue?: string;
  autoComplete?: string[];
  listItemFocused?: number;
  applyAutoCompleteToInput?: string | null;
  popoverMode?: OverlayType;
  inEdition?: boolean;
};

/**
 * Represents an action to manage the autocomplete overlay for a form input.
 *
 * @type {Object} AutoComplete
 * @property {typeof RESET_AUTO_COMPLETE_OVERLAY | typeof SET_AUTO_COMPLETE | typeof SET_OVERLAY_FIRST_ITEM_FOCUS |
 * typeof SET_IS_STORED | typeof SET_POPUP_MODE} type - The type of action to perform.
 * @property {Object} payload - The payload of the action.
 * @property {string} payload.name - The name of the input field.
 * @property {string[]} [payload.autoComplete] - An array of autocomplete suggestions (if applicable).
 * @property {number} [payload.listItemFocused] - The index of the focused item in the autocomplete list (if applicable).
 * @property {boolean} [payload.isStored] - Indicates whether the input field is currently stored (if applicable).
 * @property {OverlayType | undefined} [payload.popoverMode] - The type of popover mode (if applicable).
 *
 * @al-dev93
 */
type AutoComplete =
  | {
      /**
       * Action to reset the autocomplete overlay for a form input.
       */
      type: typeof RESET_AUTO_COMPLETE_OVERLAY;
      payload: {
        name: string;
      };
    }
  | {
      /**
       * Action to set the autocomplete overlay for a form input.
       */
      type: typeof SET_AUTO_COMPLETE;
      payload: {
        name: string;
        autoComplete: string[];
      };
    }
  | {
      /**
       * Action to set the index of the focused item in the autocomplete list for a form input.
       */
      type: typeof SET_POPOVER_LIST_FOCUSED_INDEX;
      payload: {
        name: string;
        listItemFocused: number;
      };
    }
  | {
      /**
       * Action to set the input as stored for a form input.
       */
      type: typeof SET_IS_STORED;
      payload: {
        name: string;
        isStored: boolean;
      };
    }
  | {
      /**
       * Action to set the popover mode for a form input.
       */
      type: typeof SET_POPOVER_MODE;
      payload: {
        name: string;
        popoverMode: OverlayType | undefined;
      };
    };

/**
 * Represents an action to manage the error tag for a form input.
 *
 * This includes actions for:
 *   - Deleting the error tag
 *   - Setting the error tag
 *
 * @type {Object} ErrorTagComponent
 * @property {typeof DELETE_ERROR_TAG_NAME | typeof SET_ERROR_TAG_NAME} type - The type of action to perform.
 * @property {Object} payload - The payload of the action.
 * @property {string} payload.name - The name of the input field.
 * @property {InputStatus | undefined} [payload.errorTagName] - The error tag to set, or undefined to delete.
 *
 * @al-dev93
 */
export type ErrorTagComponent =
  | {
      /**
       * Action to delete the error tag for a form input.
       */
      type: typeof DELETE_ERROR_TAG_NAME;
      payload: {
        name: string;
        errorTagName?: undefined;
      };
    }
  | {
      /**
       * Action to set the error tag for a form input.
       */
      type: typeof SET_ERROR_TAG_NAME;
      payload: {
        name: string;
        errorTagName?: InputStatus;
      };
    };

/**
 * Action to initialize the state of the contact form.
 *
 * @type {object} InitDialogContactFormState
 * @property {typeof INIT_DIALOG_CONTACT_FORM_STATE} type - The type of action to perform.
 * @property {string[]} payload - The names of the form inputs in the contact form.
 *
 * @al-dev93
 */
type InitDialogContactFormState = {
  type: typeof INIT_DIALOG_CONTACT_FORM_STATE;
  payload: string[];
};

/**
 * Represents the actions that can be dispatched in the InputComponent.
 *
 * This includes actions for:
 *   - Deleting or setting input errors
 *   - Deleting or setting input values
 *   - Setting input border box styles
 *   - Setting input focus
 *
 * @type {Object} InputComponent
 * @property {typeof DELETE_INPUT_ERROR | typeof DELETE_INPUT_VALUE | typeof SET_INPUT_BORDER_BOX | typeof SET_INPUT_ERROR
 * | typeof SET_INPUT_FOCUS | typeof SET_INPUT_HOVER | typeof SET_INPUT_VALUE | typeof IN_EDIT_MODE} type - The type of action to perform.
 * @property {Object} payload - The payload of the action.
 * @property {string} payload.name - The name of the input field.
 * @property {HTMLInputElement | HTMLTextAreaElement} payload.inputNode - The input node for the input field.
 * @property {Validity | undefined} [payload.inputError] - The validity of the input error, if applicable.
 * @property {InputBorderBox | undefined} [payload.borderStyle] - The border style for the input field, if applicable.
 * @property {boolean} [payload.isFocused] - The focus status of the input field.
 * @property {boolean} [payload.isHovered] - The hover status of the input field.
 * @property {string} [payload.inputValue] - The value to set for the input field.
 * @property {boolean} [payload.inEdition] - The edition status of the input field.
 *
 * @al-dev93
 */
export type InputComponent =
  | {
      type: typeof SET_INPUT_NODE;
      payload: {
        name: string;
        inputNode: HTMLInputElement | HTMLTextAreaElement;
      };
    }
  | {
      /**
       * Action to delete or set the input error for a form input.
       */
      type: typeof DELETE_INPUT_ERROR | typeof SET_INPUT_ERROR;
      payload: {
        name: string;
        inputError?: Validity | undefined;
      };
    }
  | {
      /**
       * Action to delete the input value for a form input.
       */
      type: typeof DELETE_INPUT_VALUE;
      payload: {
        name: string;
      };
    }
  | {
      /**
       * Action to set the input border box style for a form input.
       */
      type: typeof SET_INPUT_BORDER_BOX;
      payload: {
        name: string;
        borderStyle: InputBorderBox | undefined;
      };
    }
  | {
      /**
       * Action to set the input focus for a form input.
       */
      type: typeof SET_INPUT_FOCUS;
      payload: {
        name: string;
        isFocused: boolean;
      };
    }
  | {
      /**
       * Action to set the input hover for a form input.
       */
      type: typeof SET_INPUT_HOVER;
      payload: {
        name: string;
        isHovered: boolean;
      };
    }
  | {
      /**
       * Action to set the input value for a form input.
       */
      type: typeof SET_INPUT_VALUE;
      payload: {
        name: string;
        inputValue: string;
      };
    }
  | {
      /**
       * Action to set the edition mode for a form input.
       */
      type: typeof IN_EDIT_MODE;
      payload: {
        name: string;
        inEdition: boolean;
      };
    };

/**
 * Represents the actions that can be dispatched to manage the state of the contact form in the modal dialog.
 *
 * @type {Object} ModalDialogContactFormAction
 * @property {AutoComplete} AutoComplete - Action related to auto-completion features.
 * @property {ErrorTagComponent} ErrorTagComponent - Action for managing error tag components.
 * @property {InitDialogContactFormState} InitDialogContactFormState - Action for initializing the form state.
 * @property {InputComponent} InputComponent - Action for handling input components.
 *
 * @al-dev93
 */
export type ModalDialogContactFormAction =
  | AutoComplete
  | ErrorTagComponent
  | InitDialogContactFormState
  | InputComponent;

export type ContactForm = [
  // currentState: FieldState,
  (inputValue: string) => void,
  tooltipIconName: 'checkmark-circle' | 'create' | 'information-circle',
  isTooltipVisible?: boolean,
];

export type ContactFormContextProps = {
  state: ModalDialogContactFormState;
  dispatch: Dispatch<ModalDialogContactFormAction>;
};
