import React, { memo, useCallback, useEffect, useId, useMemo } from 'react';

import { createError } from '@/modules/Error/utils/errorHandling';
import { Modal } from '@components/Modal';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { isPrimitiveArray } from '@utils/typeHelpers';

import style from './style.module.css';
import type { AlertProps } from '../../types';
/**
 * Render the alert messages based on the input message.
 * If the message is an array of strings, render each string as a separate paragraph.
 * If the message is a single string, render it as a single paragraph.
 *
 * @component Alert
 * @param {AlertProps} props - The properties for the Alert component.
 * @property {boolean} showAlert - A boolean that controls whether the alert modal is open.
 * @property {SetStateBoolean} setShowAlert - A function to toggle the open/close state of the alert modal.
 * @property {(string | string[])} message - The message(s) to display in the alert. Can be a string or an array of strings.
 * @property {SetStateBoolean} [closeParentModal] - A function to close the parent modal, if necessary (optional).
 * @returns {(React.JSX.Element | null)} The rendered Alert component.
 *
 * @al-dev93
 */
function MemoizedAlert({
  showAlert,
  setShowAlert,
  message: alertMessage,
  closeParentModal,
}: AlertProps): React.JSX.Element | null {
  const modalId = useId();
  const handleError = useErrorHandler();

  const renderMessage: React.JSX.Element | null = useMemo(() => {
    if (Array.isArray(alertMessage) && isPrimitiveArray(alertMessage, 'string')) {
      return (
        <div className={style.wrapperAlert}>
          {alertMessage.map((value, index) => (
            <span key={`id-${index + 1}`} className={style.bodyAlert}>
              {value}
            </span>
          ))}
        </div>
      );
    }
    if (typeof alertMessage === 'string') {
      return (
        <div className={style.wrapperAlert}>
          <span className={style.bodyAlert}>{alertMessage}</span>
        </div>
      );
    }
    return null;
  }, [alertMessage]);

  const handlePropsValidity = useCallback(
    async (checkCategory?: 'type') => {
      const { code, message, context } = ((): { code: 1001 | 1002; message: string; context: object } => {
        if (checkCategory === 'type') {
          return {
            code: 1002,
            message: 'wrong type of one of the message properties',
            context: {
              messageAlert:
                typeof alertMessage === 'string' || isPrimitiveArray(alertMessage, 'string')
                  ? alertMessage
                  : 'unknown type',
            },
          };
        }
        return {
          code: 1001,
          message: 'wrong value of one of the cardData properties',
          context: {
            messageAlert: !alertMessage || !alertMessage.length ? 'empty message' : alertMessage,
          },
        };
      })();

      await handleError(
        createError(code, message, {
          ...context,
          component: 'Alert',
          operation: 'render',
          category: 'UI Component',
          url: window.location.href,
        }),
      );
    },
    [alertMessage, handleError],
  );

  useEffect(() => {
    const isValueInvalid = !alertMessage || !alertMessage.length;
    const isTypeInvalid = typeof alertMessage !== 'string' && !isPrimitiveArray(alertMessage, 'string');

    if (isTypeInvalid) {
      handlePropsValidity('type');
    } else if (isValueInvalid) {
      handlePropsValidity();
    }
  });

  return (
    <Modal
      open={showAlert}
      setOpen={setShowAlert}
      closeIcon
      closeParentModal={closeParentModal}
      customStyle='alert'
      modalId={modalId}
    >
      {renderMessage}
    </Modal>
  );
}

export const Alert = memo(MemoizedAlert);
