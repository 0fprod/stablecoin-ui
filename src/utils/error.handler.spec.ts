import { getDetails } from './error.handler';

describe('getDetails', () => {
  it('should return the Details section of the error message', () => {
    const errorMessage = `TransactionExecutionError: User rejected the request.

Request Arguments:
  from:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  to:    0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26
  data:  0x095ea7b3000000000000000000000000cf7ed3acca5a467e9e704c703e8d87f634fb0fc900000000000000000000000000000000000000000000000029a2241af62c0000

Details: MetaMask Tx Signature: User denied transaction signature.
Version: viem@2.9.26`;

    const expectedDetails = `MetaMask Tx Signature: User denied transaction signature.`;

    const result = getDetails(errorMessage);

    expect(result).toEqual(expectedDetails);
  });

  it('should return an empty string if the Details section is not found', () => {
    const errorMessage = `TransactionExecutionError: User rejected the request.`;

    const expectedDetails = '';

    const result = getDetails(errorMessage);

    expect(result).toEqual(expectedDetails);
  });
});
