import { ERC8021_MARKER } from './constants';
import { hexToString } from 'viem';

export const parseAttribution = (dataHex: string) => {
  if (!dataHex.endsWith(ERC8021_MARKER)) return null;
  
  // Minimal schema 0 extraction logic
  try {
    const dataWithoutMarker = dataHex.slice(0, -32);
    const schemaIdHex = dataWithoutMarker.slice(-2);
    const schemaId = parseInt(schemaIdHex, 16);
    
    if (schemaId === 0) {
      const lengthHex = dataWithoutMarker.slice(-4, -2);
      const length = parseInt(lengthHex, 16);
      const codesHex = dataWithoutMarker.slice(-4 - (length * 2), -4);
      const codesStr = hexToString(`0x${codesHex}`);
      return { schemaId, codes: codesStr.split(',') };
    }
  } catch (e) {
    return null;
  }
  return null;
};
