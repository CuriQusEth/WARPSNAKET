import { useSendCalls } from 'wagmi';
import { getBuilderCodeSuffix } from '../utils';

export function useERC8021BatchTransaction() {
  const { sendCalls, ...rest } = useSendCalls();

  const sendAttributedBatch = (args: any, options?: any) => {
      const capabilities = args.capabilities || {};
      
      capabilities.dataSuffix = {
          value: `0x${getBuilderCodeSuffix()}`,
          optional: true
      };

      return sendCalls({ ...args, capabilities }, options);
  };
  
  return { ...rest, sendCalls: sendAttributedBatch };
}
