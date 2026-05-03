import { toHex } from 'viem';

// Base Builder Code from User
export const BUILDER_CODE = "bc_9wa9nlu4";

/**
 * Generates the ERC-8021 transaction attribution suffix
 * Schema 0: {codesLength}{codes}{schemaId}{ercMarker}
 */
export function getBuilderCodeSuffix(code: string): string {
  const codeHex = toHex(code).replace('0x', '');
  const lengthHex = code.length.toString(16).padStart(2, '0');
  const schemaId = '00';
  const marker = '80218021802180218021802180218021';
  return `${codeHex}${lengthHex}${schemaId}${marker}`;
}

export const BUILDER_CODE_SUFFIX = getBuilderCodeSuffix(BUILDER_CODE);

/**
 * Appends the attribution suffix to standard EOA transaction data
 */
export function appendAttribution(data: `0x${string}` = '0x'): `0x${string}` {
  const cleanData = data === '0x' ? '' : data.replace('0x', '');
  return `0x${cleanData}${BUILDER_CODE_SUFFIX}` as `0x${string}`;
}
