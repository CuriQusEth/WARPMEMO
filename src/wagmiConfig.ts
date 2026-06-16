import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

export const BUILDER_CODE = 'batchwizard'

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Batch Wizard' }),
    walletConnect({ projectId: 'c5208447814cc31cf8175d27d9178ad3' })
  ],
  transports: {
    [base.id]: http(),
  },
})
