export type ValidationLevel = 'basic' | 'standard' | 'strict';

export interface ERC8021Options {
  schemaId?: number;
  codes?: string[];
  validationLevel?: ValidationLevel;
  customRegistry?: {
    chainId: number;
    address: string;
  };
  cborData?: any;
}

export type Schema2Data = {
  a?: string;
  w?: string;
  s?: string[];
  r?: {
    a?: { c: string; a: string };
    w?: { c: string; a: string };
  };
  m?: Record<string, unknown>;
};
