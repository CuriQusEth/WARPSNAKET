// If using wagmi's sendCalls (experimental ERC-5792)
import { useSendCalls } from 'wagmi/experimental';
import { getBuilderCodeSuffix } from '../utils';

export function useERC8021BatchTransaction() {
  // @ts-ignore - experimental wagmi api
  const { sendCalls, ...rest } = useSendCalls ? useSendCalls() : { sendCalls: null };

  const sendAttributedBatch = (args: any, options?: any) => {
      if (!sendCalls) throw new Error('useSendCalls not available. Ensure wagmi experimental is configured.');
      
      const capabilities = args.capabilities || {};
      
      capabilities.dataSuffix = {
          value: `0x${getBuilderCodeSuffix()}`,
          optional: true
      };

      return sendCalls({ ...args, capabilities }, options);
  };
  
  return { ...rest, sendCalls: sendAttributedBatch };
}
