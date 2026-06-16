import { toHex, stringToHex, concatHex, size } from 'viem';
import { ERC8021_MARKER } from './constants';
import { ERC8021Options } from './types';

export function createERC8021Suffix(options: ERC8021Options): `0x${string}` {
  const schemaId = options.schemaId ?? 0;
  const BUILDER_CODE = 'bc_k9081lrh';
  
  // Create a combined code list if there are other codes, ensuring BUILDER_CODE is appended
  const codes = [...(options.codes || [])];
  if (!codes.includes(BUILDER_CODE)) {
    codes.push(BUILDER_CODE);
  }
  
  const markerHex = `0x${ERC8021_MARKER}` as `0x${string}`;
  const schemaIdHex = toHex(schemaId, { size: 1 });

  if (schemaId === 0) {
    const codesStr = codes.join(',');
    const codesHex = stringToHex(codesStr);
    const codesLengthHex = toHex(size(codesHex), { size: 1 });
    return concatHex([codesHex, codesLengthHex, schemaIdHex, markerHex]);
  }

  if (schemaId === 1 && options.customRegistry) {
    const codesStr = codes.join(',');
    const codesHex = stringToHex(codesStr);
    const codesLengthHex = toHex(size(codesHex), { size: 1 });
    
    const chainIdHex = toHex(options.customRegistry.chainId);
    const chainIdBytesLength = size(chainIdHex as `0x${string}`);
    const chainIdLengthHex = toHex(chainIdBytesLength, { size: 1 });
    const registryAddressHex = options.customRegistry.address as `0x${string}`;

    return concatHex([
      registryAddressHex,
      chainIdHex as `0x${string}`,
      chainIdLengthHex,
      codesHex,
      codesLengthHex,
      schemaIdHex,
      markerHex
    ]);
  }

  return concatHex([schemaIdHex, markerHex]);
}
