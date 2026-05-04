import { toHex, hexToString, isHex } from 'viem';
import { ERC8021_MARKER, GAME_CODE } from './constants';
import { SchemaId } from './types';

/**
 * Generates the ERC-8021 transaction attribution suffix
 * Schema 0: {codesLength}{codes}{schemaId}{ercMarker}
 */
export function getBuilderCodeSuffix(codes: string[] = [GAME_CODE], schemaId: SchemaId = 0): string {
  if (schemaId === 0) {
    const codesStr = codes.join(',');
    const codeHex = toHex(codesStr).replace('0x', '');
    const lengthHex = codesStr.length.toString(16).padStart(2, '0');
    const schemaHex = schemaId.toString(16).padStart(2, '0');
    return `${codeHex}${lengthHex}${schemaHex}${ERC8021_MARKER}`;
  }
  // Implement other schemas if needed
  return '';
}

/**
 * Appends the attribution suffix to standard EOA transaction data
 */
export function appendAttribution(data: `0x${string}` = '0x', codes: string[] = [GAME_CODE]): `0x${string}` {
  const cleanData = data === '0x' ? '' : data.replace('0x', '');
  return `0x${cleanData}${getBuilderCodeSuffix(codes, 0)}` as `0x${string}`;
}
