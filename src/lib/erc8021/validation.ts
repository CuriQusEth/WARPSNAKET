import { ERC8021_MARKER } from './constants';

export const validateERC8021Suffix = (suffixHex: string): boolean => {
  return suffixHex.endsWith(ERC8021_MARKER);
};

export const hasValidCode = (code: string): boolean => {
  return typeof code === 'string' && code.length > 0 && /^[x20-x7E]*$/.test(code) && !code.includes(',');
};
