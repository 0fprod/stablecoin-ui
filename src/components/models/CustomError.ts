import { BaseError, ContractFunctionRevertedError, TransactionExecutionError, IntegerOutOfRangeError, InternalRpcError } from "viem";

export class CustomError {
  title: string;
  message: string;

  private constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }

  public static fromBaseError(error: BaseError): CustomError {
    let message = '';
    let title = 'Error!';
    const revertError = error.walk((err) => err instanceof ContractFunctionRevertedError);
    const transactionError = error.walk((err) => err instanceof TransactionExecutionError);
    const rangeError = error.walk(err => err instanceof IntegerOutOfRangeError);
    const rpcError = error.walk(err => err instanceof InternalRpcError);

    if (revertError instanceof ContractFunctionRevertedError) {
      title = 'Transaction Reverted!';
      const contractRevertReason = revertError.data?.errorName ?? '';
      message = this.getFunctionNameAndRevertReason(revertError.shortMessage, contractRevertReason);
    }

    if (transactionError instanceof TransactionExecutionError) {
      title = 'Transaction Error!';
      message = transactionError.shortMessage;
    }

    if (rangeError instanceof IntegerOutOfRangeError) {
      title = 'Validation Error!';
      message = rangeError.shortMessage;
    }

    if (rpcError instanceof InternalRpcError) {
      title = 'Internal Error!';
      message = 'Internal JSON-RPC error. Please try again later.';
    }

    return new CustomError(title, message);
  }

  private static getFunctionNameAndRevertReason(shortMessage: string, revertReason: string): string {
    try {
      const functionName = this.extractFunctionName(shortMessage);
      const formattedRevertReason = this.formatRevertReason(revertReason);
      const formattedErrorMessage = `Function "${functionName}" reverted with "${formattedRevertReason}".`;
      return formattedErrorMessage;
    } catch (error) {
      return shortMessage;
    }
  }

  private static extractFunctionName(shortMessage: string): string {
    const indexOfFunctionName = shortMessage.indexOf('"');
    const lastIndexOfFunctionName = shortMessage.lastIndexOf('"');
    const functionName = shortMessage.slice(indexOfFunctionName + 1, lastIndexOfFunctionName);
    return functionName;
  }

  private static formatRevertReason(revertReason: string): string {
    let formattedRevertReason = revertReason.split('__')[1];
    formattedRevertReason = formattedRevertReason.replace(/([A-Z])/g, ' $1').trim();
    const [firstWord, ...rest] = formattedRevertReason.split(' ');
    formattedRevertReason = firstWord + ' ' + rest.join(' ').toLowerCase();
    return formattedRevertReason;
  }
}