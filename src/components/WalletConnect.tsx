import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi'
import { BUILDER_CODE } from '../wagmiConfig'
import { toHex } from 'viem'
import { useState } from 'react'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { sendTransaction, isPending, isSuccess } = useSendTransaction()
  const [txHash, setTxHash] = useState<string | null>(null)

  // Use the injected connector
  const connector = connectors[0]

  const handleTestAttribution = () => {
    if (!address) return
    
    // ERC-8021 Builder Code Attribution for EOAs
    // We append the hex-encoded builder code to the end of ordinary transaction data.
    // For this example, we send a 0-value transaction to ourselves just to record the attribution onchain.
    const builderCodeHex = toHex(BUILDER_CODE)

    sendTransaction(
      {
        to: address,   // Sending to ourselves as a dummy ping
        value: 0n,
        // The ERC-8021 suffix is simply appended here
        data: builderCodeHex,
      },
      {
        onSuccess: (hash) => setTxHash(hash),
      }
    )
  }

  if (isConnected) {
    return (
      <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2 text-right">
        <div className="bg-[#0A1128] border border-[#2D5A8E] rounded p-3 shadow-[0_0_15px_rgba(0,150,255,0.1)] text-[#E0E0FF] text-[10px] uppercase font-bold tracking-[1px]">
          <div>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</div>
          
          <button 
            onClick={() => disconnect()}
            className="mt-2 text-[#FF00E5] hover:text-white transition-colors"
          >
            Disconnect
          </button>
        </div>

        <button 
          onClick={handleTestAttribution}
          disabled={isPending}
          className="bg-[#00F3FF]/10 border border-[#00F3FF] text-[#00F3FF] px-4 py-2 rounded text-[10px] uppercase font-bold tracking-[1px] hover:bg-[#00F3FF] hover:text-[#050508] transition-colors disabled:opacity-50"
        >
          {isPending ? 'Sending Tx...' : 'Test Builder Code Attribution'}
        </button>

        {isSuccess && (
          <div className="text-[10px] text-[#00F3FF]">
            Tx Sent: {txHash?.slice(0,6)}...
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="absolute top-4 right-4 z-50">
      <button 
        onClick={() => connect({ connector })}
        className="bg-[#0A1128] border border-[#00F3FF] text-[#00F3FF] px-4 py-2 rounded text-[10px] uppercase font-bold tracking-[1px] shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:bg-[#00F3FF] hover:text-[#050508] transition-colors"
      >
        Connect Web3
      </button>
    </div>
  )
}
