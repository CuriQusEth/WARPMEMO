import { useSendCalls } from 'wagmi';
import { createERC8021Suffix } from '../utils';
import { GAME_CODE } from '../constants';

export function useERC8021BatchTransaction() {
  const { sendCalls, ...rest } = useSendCalls();

  const sendBatchWithAttribution = (args: any, options?: any) => {
    const suffix = createERC8021Suffix({ schemaId: 0, codes: [GAME_CODE] });
    
    const capabilities = args.capabilities || {};
    capabilities.dataSuffix = {
      value: suffix,
      optional: true
    };

    return sendCalls({
      ...args,
      capabilities
    }, options);
  };

  return { sendCalls: sendBatchWithAttribution, ...rest };
}
