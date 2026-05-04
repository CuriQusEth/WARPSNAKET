import { useSendTransaction } from 'wagmi';
import { appendAttribution } from '../utils';

export function useERC8021Transaction() {
  const { sendTransaction, ...rest } = useSendTransaction();

  const sendAttributedTransaction = (args: any, options?: any) => {
    const data = appendAttribution(args.data || '0x');
    return sendTransaction({ ...args, data }, options);
  };
  
  return { ...rest, sendTransaction: sendAttributedTransaction };
}
