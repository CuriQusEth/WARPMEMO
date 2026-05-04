import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'

export const BUILDER_CODE = 'batchwizard'

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Batch Wizard' })
  ],
  transports: {
    [base.id]: http(),
  },
})
