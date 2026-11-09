import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

export const BUILDER_CODE = 'bc_k9081lrh'
export const DENIM_BLOCK_TIME_MS = 200 // Base Denim 200ms native block time

// Base Mainnet (Chain ID 8453) - Denim activated on Nov 5, 2026
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Warp Memory' }),
    walletConnect({ projectId: 'c5208447814cc31cf8175d27d9178ad3' })
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org', { batch: true }),
    [baseSepolia.id]: http('https://sepolia.base.org', { batch: true }),
  },
  pollingInterval: 250, // Aligned with Base Mainnet Denim 200ms native block cadence
})


