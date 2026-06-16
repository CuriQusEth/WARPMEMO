import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { toHex } from 'viem'
import { createSiweMessage, generateSiweNonce } from 'viem/siwe'
import { useState } from 'react'
import { useERC8021Transaction } from '../lib/erc8021/hooks/useERC8021Transaction'

export function WalletConnect() {
  const { address, isConnected, chainId } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { sendTransaction, isPending, isSuccess } = useERC8021Transaction()
  const { signMessageAsync } = useSignMessage()
  const [txHash, setTxHash] = useState<string | null>(null)
  const [isSigning, setIsSigning] = useState(false)

  const handleSayGM = () => {
    if (!address) return
    
    // ERC-8021 is handled by the hook
    // It will append the "batchwizard" attribution
    sendTransaction(
      {
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3', // Score tracking address
        value: 0n,
      },
      {
        onSuccess: (hash) => setTxHash(hash as string),
      }
    )
  }

  const handleSignLeaderboard = async () => {
    if (!address || !chainId) return;
    setIsSigning(true);
    try {
      const message = createSiweMessage({
        address,
        chainId,
        domain: window.location.host,
        nonce: generateSiweNonce(),
        uri: window.location.origin,
        version: '1',
        statement: `I am confirming my identity to join the Warp Memory leaderboard.`,
      });
      const signature = await signMessageAsync({ account: address, message });
      alert('Identity verified via SIWE:\\n' + signature.slice(0, 40) + '...');
    } catch (e) {
      console.error(e)
    }
    setIsSigning(false);
  }

  if (isConnected) {
    return (
      <div className="absolute top-4 right-4 z-[60] flex flex-col items-end gap-2 text-right pointer-events-auto">
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
          onClick={handleSignLeaderboard}
          disabled={isSigning}
          className="bg-[#00F3FF]/10 border border-[#00F3FF] text-[#00F3FF] px-4 py-2 rounded text-[10px] uppercase font-bold tracking-[1px] hover:bg-[#00F3FF] hover:text-[#050508] transition-colors disabled:opacity-50"
        >
          {isSigning ? 'Signing...' : 'Sign SIWE Identity'}
        </button>

        <button 
          onClick={handleSayGM}
          disabled={isPending}
          className="bg-[#FF00E5]/10 border border-[#FF00E5] text-[#FF00E5] px-4 py-2 rounded text-[10px] uppercase font-bold tracking-[1px] hover:bg-[#FF00E5] hover:text-white transition-colors disabled:opacity-50"
        >
          {isPending ? 'Sending Tx...' : 'Say GM (On-chain)'}
        </button>

        {isSuccess && (
          <div className="text-[10px] text-[#00F3FF] max-w-[200px] truncate">
            Tx Sent: {txHash}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="absolute top-4 right-4 z-[60] flex flex-col gap-2 relative pointer-events-auto">
      {connectors.map((connector) => (
        <button 
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="bg-[#0A1128] border border-[#00F3FF] text-[#00F3FF] px-4 py-2 rounded text-[10px] uppercase font-bold tracking-[1px] shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:bg-[#00F3FF] hover:text-[#050508] transition-colors"
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  )
}
