import { toHex, stringToHex, concatHex } from 'viem';
import { ERC8021_MARKER } from './constants';
import { ERC8021Options } from './types';

export function createERC8021Suffix(options: ERC8021Options): `0x${string}` {
  const schemaId = options.schemaId ?? 0;
  const codes = options.codes || [];
  
  const markerHex = `0x${ERC8021_MARKER}` as `0x${string}`;
  const schemaIdHex = toHex(schemaId, { size: 1 });

  if (schemaId === 0) {
    const codesStr = codes.join(',');
    const codesHex = stringToHex(codesStr);
    const codesLengthHex = toHex(codesHex.length / 2 - 1, { size: 1 });
    return concatHex([codesHex, codesLengthHex, schemaIdHex, markerHex]);
  }

  if (schemaId === 1 && options.customRegistry) {
    const codesStr = codes.join(',');
    const codesHex = stringToHex(codesStr);
    const codesLengthHex = toHex(codesHex.length / 2 - 1, { size: 1 });
    
    const chainIdHex = toHex(options.customRegistry.chainId);
    const chainIdBytesLength = (chainIdHex.length - 2) / 2;
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
