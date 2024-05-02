import { useNotification } from '@web3uikit/core';
import { AlertCircle, CheckCircle } from '@web3uikit/icons';
import { useCallback } from 'react';
import { BaseError, Hex } from 'viem';
import { TxHashLink } from '../components/tx-link/TxHashLink';
import { CustomError } from '../components/models/CustomError';

export const useNotificationHandlers = () => {
  const dispatch = useNotification();

  const showErrorNotification = useCallback(
    (e: BaseError) => {
      console.error('### ~ e:', e);
      let message = '';
      let title = 'Error!';

      if (e instanceof BaseError) {
        const customError = CustomError.fromBaseError(e);
        message = customError.message;
        title = customError.title;
      }

      dispatch({
        type: 'error',
        message,
        title,
        icon: <AlertCircle fontSize={20} />,
        position: 'topR',
      });
    },
    [dispatch]
  );

  const showSubmittedTxNotification = useCallback(
    (txHash: Hex) => {
      dispatch({
        type: 'info',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message: TxHashLink({ txHash }),
        title: 'Tx submitted!',
        icon: <AlertCircle fontSize={20} />,
        position: 'topR',
      });
    },
    [dispatch]
  );

  const showTxCompleteNotification = useCallback(() => {
    dispatch({
      type: 'success',
      message: 'Transaction completed!',
      title: 'Hooray!',
      icon: <CheckCircle fontSize={20} />,
      position: 'topR',
    });
  }, [dispatch]);

  return { showErrorNotification, showSubmittedTxNotification, showTxCompleteNotification };
};
