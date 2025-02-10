import { createContactFormInitialState } from './modalDialogContactFormInitialState';
import type { ModalDialogContactFormAction, ModalDialogContactFormState } from '../types';
import {
  DELETE_ERROR_TAG_NAME,
  DELETE_INPUT_ERROR,
  DELETE_INPUT_VALUE,
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
} from '../utils/constants';
/**
 * Reducer function to manage the state of the modal dialog contact form.
 *
 * This function handles various actions that modify different aspects of the form
 * state, such as initializing the form, setting input values, handling errors, managing
 * autocomplete suggestions, and updating the UI state properties like focus and border box styling.
 *
 * @function modalDialogContactFormReducer
 * @param {ModalDialogContactFormState} state - The current state of the contact form.
 * @param {ModalDialogContactFormAction} action - An action object that specifies the type of action
 * to perform and any relevant payload to update the state.
 * @returns {ModalDialogContactFormState} - The updated state of the contact form after applying the action.
 * @throws {Error} - Throws an error if an unknown action type is dispatched.
 *
 * @al-dev93
 */
export function modalDialogContactFormReducer(
  state: ModalDialogContactFormState,
  action: ModalDialogContactFormAction,
): ModalDialogContactFormState {
  switch (action.type) {
    case INIT_DIALOG_CONTACT_FORM_STATE:
      return createContactFormInitialState(action.payload);

    case SET_INPUT_NODE:
      return {
        ...state,
        [action.payload.name]: { ...state[action.payload.name], inputNode: action.payload.inputNode },
      };

    case SET_INPUT_BORDER_BOX:
      return {
        ...state,
        [action.payload.name]: { ...state[action.payload.name], inputBorderBox: action.payload.borderStyle },
      };

    case SET_ERROR_TAG_NAME:
      return {
        ...state,
        [action.payload.name]: { ...state[action.payload.name], inputStatusTag: action.payload.errorTagName },
      };
    case DELETE_ERROR_TAG_NAME:
      return { ...state, [action.payload.name]: { ...state[action.payload.name], inputStatusTag: undefined } };

    case SET_INPUT_FOCUS:
      return {
        ...state,
        [action.payload.name]: { ...state[action.payload.name], isFocused: action.payload.isFocused },
      };

    case SET_INPUT_HOVER:
      return {
        ...state,
        [action.payload.name]: { ...state[action.payload.name], isHovered: action.payload.isHovered },
      };

    case SET_INPUT_ERROR:
      return {
        ...state,
        [action.payload.name]: { ...state[action.payload.name], inputError: action.payload.inputError },
      };

    case DELETE_INPUT_ERROR:
      return { ...state, [action.payload.name]: { ...state[action.payload.name], inputError: undefined } };

    case SET_INPUT_VALUE:
      return {
        ...state,
        [action.payload.name]: { ...state[action.payload.name], inputValue: action.payload.inputValue },
      };

    case DELETE_INPUT_VALUE:
      return { ...state, [action.payload.name]: { ...state[action.payload.name], inputValue: undefined } };

    case SET_AUTO_COMPLETE:
      return {
        ...state,
        [action.payload.name]: { ...state[action.payload.name], autoComplete: action.payload.autoComplete },
      };

    case SET_POPOVER_LIST_FOCUSED_INDEX:
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          listItemFocused: action.payload.listItemFocused,
        },
      };

    case RESET_AUTO_COMPLETE_OVERLAY:
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          autoComplete: undefined,
          listItemFocused: undefined,
          popoverMode: undefined,
        },
      };

    case SET_IS_STORED:
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          isStored: action.payload.isStored,
        },
      };

    case SET_POPOVER_MODE:
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          popoverMode: action.payload.popoverMode,
        },
      };

    case IN_EDIT_MODE:
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          inEdition: action.payload.inEdition,
        },
      };

    default:
      // TODO: sortir l'erreur
      throw new Error(`Type d'action inconnu : ${(action as { type: string }).type}`);
  }
}
