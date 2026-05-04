export type SchemaId = 0 | 1 | 2;

export interface Schema0Data {
  codes: string[];
}

export interface Schema1Data extends Schema0Data {
  codeRegistryChainId: number;
  codeRegistryAddress: string;
}

export interface Schema2Data {
  a?: string; // App code
  w?: string; // Wallet code
  s?: string[]; // Services
  r?: {
    a?: { c: string; a: string };
    w?: { c: string; a: string };
  };
  m?: Record<string, unknown>; // Metadata
}
