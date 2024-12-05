import React, { memo, useId } from 'react';

import { Modal } from '@components/Modal';

import style from './style.module.css';

import type { AlertProps } from '../../types';

/**
 * Render the alert messages based on the input message.
 * If the message is an array of strings, render each string as a separate paragraph.
 * If the message is a single string, render it as a single paragraph.
 *
 * @component Alert
 * @param {AlertProps} props - The properties for the Alert component.
 * @property {boolean} openAlert - A boolean that controls whether the alert modal is open.
 * @property {SetStateBoolean} setOpenAlert - A function to toggle the open/close state of the alert modal.
 * @property {(string | string[])} message - The message(s) to display in the alert. Can be a string or an array of strings.
 * @property {SetStateBoolean} [closeParentModal] - A function to close the parent modal, if necessary (optional).
 * @returns {React.JSX.Element} The rendered Alert component.
 *
 * @al-dev93
 */
function MemoizedAlert({ showAlert, setShowAlert, message, closeParentModal }: AlertProps): React.JSX.Element {
  const modalId = useId();

  return (
    <Modal
      open={showAlert}
      setOpen={setShowAlert}
      closeIcon
      closeParentModal={closeParentModal}
      customStyle='alert'
      modalId={modalId}
    >
      <div className={style.wrapperAlert}>
        {Array.isArray(message) ? (
          message.map((value, index) => (
            <span key={`id-${index + 1}`} className={style.bodyAlert}>
              {value}
            </span>
          ))
        ) : (
          <span className={style.alert}>{message}</span>
        )}
      </div>
    </Modal>
  );
}

export const Alert = memo(MemoizedAlert);
