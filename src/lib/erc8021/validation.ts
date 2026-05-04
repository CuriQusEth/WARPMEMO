import { ValidationLevel } from './types';
import { ERC8021_MARKER } from './constants';

export function validateERC8021Suffix(suffix: string, level: ValidationLevel = 'standard'): boolean {
  if (!suffix.toLowerCase().endsWith(ERC8021_MARKER.toLowerCase())) {
    return false;
  }
  
  if (level === 'strict' && suffix.length < 34) {
    // 0x + 32 chars marker = 34 minimum
    return false;
  }
  
  return true;
}
