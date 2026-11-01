import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

export const BUILDER_CODE = 'bc_k9081lrh'

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Warp Memory' }),
    walletConnect({ projectId: 'c5208447814cc31cf8175d27d9178ad3' })
  ],
  transports: {
    [base.id]: http(),
  },
})
