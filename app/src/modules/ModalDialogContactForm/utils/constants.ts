import type { ContactFormModal } from '@/types';

/**
 * Default empty contact form modal structure.
 * This object is used as the default state for the modal dialog contact form.
 *
 * @constant EMPTY_MODAL_DIALOG_CONTACT_FORM
 */
const EMPTY_MODAL_DIALOG_CONTACT_FORM: ContactFormModal = {
  id: '',
  title: '',
  subtitle: '',
  submitButtonName: '',
  alertOnSubmit: [],
  dataFormContent: [],
};
/**
 * Code representing an autocomplete feature for input.
 *
 * @constant AUTO_COMPLETION
 */
const AUTO_COMPLETION = 'AUTO_COMPLETION';

/**
 * Code representing a history feature for input.
 *
 * @constant FULL_HISTORY
 */
const FULL_HISTORY = 'FULL_HISTORY';

/**
 * Constants for generating unique IDs for autocomplete items and lists.
 *
 * @constant PREFIX_AUTO_COMPLETE_ITEM_ID
 * @constant SUFFIX_AUTO_COMPLETE_LIST_ID
 */
const PREFIX_AUTO_COMPLETE_ITEM_ID = 'autocomplete-item-';
const SUFFIX_AUTO_COMPLETE_LIST_ID = '-autocomplete-list';

/**
 * Action types for the modal dialog contact form reducer.
 * These actions are dispatched to modify the state of the contact form.
 * Each action type corresponds to a specific action that can be performed on the form.
 *
 * @constant DELETE_ERROR_TAG_NAME
 * @constant DELETE_INPUT_ERROR
 * @constant DELETE_INPUT_VALUE
 * @constant INIT_DIALOG_CONTACT_FORM_STATE
 * @constant RESET_AUTO_COMPLETE_OVERLAY
 * @constant SET_AUTO_COMPLETE
 * @constant SET_ERROR_MESSAGE
 * @constant SET_ERROR_TAG_NAME
 * @constant SET_INPUT_BORDER_BOX
 * @constant SET_INPUT_ERROR
 * @constant SET_INPUT_FOCUS
 * @constant SET_POPOVER_LIST_FOCUSED_INDEX
 * @constant SET_INPUT_VALUE
 * @constant SET_IS_STORED
 * @constant SET_POPOVER_MODE
 * @constant IN_EDIT_MODE
 * @constant SET_INPUT_HOVER
 */
const DELETE_ERROR_TAG_NAME = 'DELETE_ERROR_TAG_NAME';
const DELETE_INPUT_ERROR = 'DELETE_INPUT_ERROR';
const DELETE_INPUT_VALUE = 'DELETE_INPUT_VALUE';
const INIT_DIALOG_CONTACT_FORM_STATE = 'INIT_DIALOG_CONTACT_FORM_STATE';
const RESET_AUTO_COMPLETE_OVERLAY = 'RESET_AUTO_COMPLETE_OVERLAY';
const SET_AUTO_COMPLETE = 'SET_AUTO_COMPLETE';
const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
const SET_ERROR_TAG_NAME = 'SET_ERROR_TAG_NAME';
const SET_INPUT_NODE = 'SET_INPUT_NODE';
const SET_INPUT_BORDER_BOX = 'SET_INPUT_BORDER_BOX';
const SET_INPUT_ERROR = 'SET_INPUT_ERROR';
const SET_INPUT_FOCUS = 'SET_INPUT_FOCUS';
const SET_POPOVER_LIST_FOCUSED_INDEX = 'SET_POPOVER_LIST_FOCUSED_INDEX';
const SET_INPUT_VALUE = 'SET_INPUT_VALUE';
const SET_IS_STORED = 'SET_IS_STORED';
const SET_POPOVER_MODE = 'SET_POPOVER_MODE';
const IN_EDIT_MODE = 'IN_EDIT_MODE';
const SET_INPUT_HOVER = 'SET_INPUT_HOVER';

/**
 * Constants representing different types of modal states.
 *
 * @constant IS_EDITED_BORDER_BOX
 * @constant IS_IN_ERROR
 */
// const HIDDEN_MODAL = 'hidden';
// const SOFT_MODAL = 'soft';
const IS_EDITED_BORDER_BOX = 'edited';
const IS_IN_ERROR = 'error';

export {
  AUTO_COMPLETION,
  DELETE_ERROR_TAG_NAME,
  DELETE_INPUT_ERROR,
  DELETE_INPUT_VALUE,
  EMPTY_MODAL_DIALOG_CONTACT_FORM,
  // HIDDEN_MODAL,
  FULL_HISTORY,
  IN_EDIT_MODE,
  INIT_DIALOG_CONTACT_FORM_STATE,
  IS_EDITED_BORDER_BOX,
  IS_IN_ERROR,
  PREFIX_AUTO_COMPLETE_ITEM_ID,
  RESET_AUTO_COMPLETE_OVERLAY,
  SET_AUTO_COMPLETE,
  SET_ERROR_MESSAGE,
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
  SUFFIX_AUTO_COMPLETE_LIST_ID,
  // SOFT_MODAL,
};
