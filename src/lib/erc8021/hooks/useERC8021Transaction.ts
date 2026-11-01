import { useSendTransaction, useSendCalls } from 'wagmi';
import { createERC8021Suffix } from '../utils';
import { GAME_CODE } from '../constants';
import { useWalletCapabilities } from '../../../hooks/useWalletCapabilities';

export function useERC8021Transaction() {
  const { sendTransactionAsync, isPending: isPendingTx, isSuccess: isSuccessTx } = useSendTransaction();
  const { sendCallsAsync, isPending: isPendingCalls, isSuccess: isSuccessCalls } = useSendCalls();
  const { supportsBatching } = useWalletCapabilities();

  const isPending = isPendingTx || isPendingCalls;
  const isSuccess = isSuccessTx || isSuccessCalls;

  const sendTransactionWrapper = async (args: any, options?: any) => {
    const suffix = createERC8021Suffix({ schemaId: 0, codes: [GAME_CODE] });
    let result: string;

    try {
      if (supportsBatching) {
        const capabilities: any = args.capabilities || {};
        capabilities.dataSuffix = {
          value: suffix,
          optional: true
        };
        
        const callsResult = await sendCallsAsync({
          calls: [args],
          capabilities
        }, options);
        result = typeof callsResult === 'string' ? callsResult : (callsResult as any)?.id || String(callsResult);
      } else {
        const data = args.data ? `${args.data}${suffix.slice(2)}` : suffix;
        result = await sendTransactionAsync({
          ...args,
          data
        }, options);
      }

      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (error) {
      if (options?.onError) {
        options.onError(error);
      }
      throw error;
    }
  };

  return { 
    sendTransaction: sendTransactionWrapper, 
    sendTransactionAsync: sendTransactionWrapper, 
    isPending, 
    isSuccess 
  };
}
