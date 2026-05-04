import { ERC8021_MARKER } from './constants';

export function parseERC8021Suffix(calldata: string) {
  if (!calldata.toLowerCase().endsWith(ERC8021_MARKER.toLowerCase())) {
    return { valid: false, reason: 'Missing marker' };
  }
  
  // Basic mock parser
  return { valid: true, schemaId: 0 };
}
