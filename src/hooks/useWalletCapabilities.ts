import { useCapabilities, useAccount } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { useMemo } from 'react';

export function useWalletCapabilities() {
  const { chainId } = useAccount();
  const { data: capabilities } = useCapabilities();
  const activeChainId = chainId || base.id;

  const supportsBatching = useMemo(() => {
    const chainCapabilities = capabilities?.[activeChainId] || capabilities?.[base.id] || capabilities?.[baseSepolia.id];
    const atomic = chainCapabilities?.atomic;
    return atomic?.status === 'ready' || atomic?.status === 'supported';
  }, [capabilities, activeChainId]);

  const supportsPaymaster = useMemo(() => {
    const chainCapabilities = capabilities?.[activeChainId] || capabilities?.[base.id] || capabilities?.[baseSepolia.id];
    return chainCapabilities?.paymasterService?.supported === true;
  }, [capabilities, activeChainId]);

  return { supportsBatching, supportsPaymaster };
}

