import { useSendTransaction } from 'wagmi';
import { createERC8021Suffix } from '../utils';
import { GAME_CODE } from '../constants';

export function useERC8021Transaction() {
  const { sendTransaction, ...rest } = useSendTransaction();

  const sendWithAttribution = (args: any, options?: any) => {
    const suffix = createERC8021Suffix({ schemaId: 0, codes: [GAME_CODE] });
    const data = args.data ? `${args.data}${suffix.slice(2)}` : suffix;
    
    return sendTransaction({
      ...args,
      data
    }, options);
  };

  return { sendTransaction: sendWithAttribution, ...rest };
}
