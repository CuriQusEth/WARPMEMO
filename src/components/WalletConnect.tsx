import { useAccount, useConnect, useDisconnect, useSignMessage, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { createSiweMessage, generateSiweNonce } from 'viem/siwe'
import { useState } from 'react'
import { useERC8021Transaction } from '../lib/erc8021/hooks/useERC8021Transaction'
import { BUILDER_CODE } from '../lib/erc8021/constants'

export function WalletConnect() {
  const { address, isConnected, chainId } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { sendTransaction, isPending } = useERC8021Transaction()
  const { signMessageAsync } = useSignMessage()
  const [txHash, setTxHash] = useState<string | null>(null)
  const [isSigning, setIsSigning] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // Denim 200ms canonical confirmation tracker (polling interval 250ms, no pending tag)
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
    pollingInterval: 250,
  })

  const isBaseSepolia = chainId === baseSepolia.id
  const currentNetworkName = isBaseSepolia ? 'Base Sepolia (Denim Live)' : 'Base Mainnet'
  const explorerUrl = isBaseSepolia ? 'https://sepolia.basescan.org' : 'https://basescan.org'

  const showNotice = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 5000)
  }

  const handleSayGM = () => {
    if (!address) return
    setTxHash(null)
    
    // ERC-8021 with BUILDER_CODE bc_k9081lrh appended
    sendTransaction(
      {
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3', // Score tracking address
        value: 0n,
      },
      {
        onSuccess: (hash) => {
          const hashStr = hash as string
          setTxHash(hashStr)
          showNotice(`Tx submitted to Base Denim! Hash: ${hashStr.slice(0, 10)}...`)
        },
        onError: (err: any) => {
          showNotice(`Tx error: ${err?.message?.slice(0, 40) || 'Rejected'}`)
        }
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
        statement: `I am confirming my identity to join the Warp Memory leaderboard on Base Denim.`,
      });
      const signature = await signMessageAsync({ account: address, message });
      showNotice(`SIWE Verified: ${signature.slice(0, 18)}...`);
    } catch (e: any) {
      console.error(e)
      showNotice(`Sign error: ${e?.message?.slice(0, 30) || 'Failed'}`);
    }
    setIsSigning(false);
  }

  const handleSwitchNetwork = () => {
    if (!switchChain) return
    const targetChainId = isBaseSepolia ? base.id : baseSepolia.id
    switchChain({ chainId: targetChainId })
  }

  if (isConnected) {
    return (
      <div className="absolute top-4 right-4 z-[60] flex flex-col items-end gap-2 text-right pointer-events-auto max-w-[280px]">
        {/* Denim Status & Account Badge */}
        <div className="bg-[#0A1128]/95 backdrop-blur-md border border-[#2D5A8E] rounded p-3 shadow-[0_0_20px_rgba(0,243,255,0.15)] text-[#E0E0FF] text-[10px] uppercase font-bold tracking-[1px] w-full">
          <div className="flex items-center justify-between gap-2 border-b border-[#1A3A5A] pb-1.5 mb-1.5">
            <span className="flex items-center gap-1.5 text-[#00F3FF]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F3FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F3FF]"></span>
              </span>
              DENIM 200MS
            </span>
            <span className="text-[#FF00E5] text-[9px] font-mono">{BUILDER_CODE}</span>
          </div>

          <div className="flex items-center justify-between text-[9px] text-[#A0B0D0] mb-1">
            <span>{currentNetworkName}</span>
            <button 
              onClick={handleSwitchNetwork} 
              className="text-[#00F3FF] underline hover:text-white transition-colors"
            >
              Switch
            </button>
          </div>

          <div className="text-[10px] text-[#E0E0FF] font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#1A3A5A]/60">
            <span className="text-[8px] text-[#00F3FF]/70 tracking-normal normal-case">Canonical blocks (No pending lag)</span>
            <button 
              onClick={() => disconnect()}
              className="text-[#FF00E5] hover:text-white transition-colors text-[9px]"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handleSignLeaderboard}
            disabled={isSigning}
            className="bg-[#00F3FF]/10 border border-[#00F3FF] text-[#00F3FF] px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-[1px] hover:bg-[#00F3FF] hover:text-[#050508] transition-colors disabled:opacity-50"
          >
            {isSigning ? 'Signing...' : 'Sign SIWE'}
          </button>

          <button 
            onClick={handleSayGM}
            disabled={isPending || isConfirming}
            className="bg-[#FF00E5]/10 border border-[#FF00E5] text-[#FF00E5] px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-[1px] hover:bg-[#FF00E5] hover:text-white transition-colors disabled:opacity-50"
          >
            {isPending ? 'Submitting...' : isConfirming ? '200ms Mining...' : 'Say GM'}
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="bg-[#001428] border border-[#00F3FF]/60 text-[#00F3FF] px-2.5 py-1.5 rounded text-[9px] font-mono shadow-[0_0_12px_rgba(0,243,255,0.2)] animate-pulse">
            {notification}
          </div>
        )}

        {/* Live 200ms Canonical Confirmation Status */}
        {txHash && (
          <div className="bg-[#050508]/90 border border-[#1A3A5A] rounded p-2 text-[9px] font-mono text-left w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#A0B0D0]">STATUS:</span>
              {isConfirming && (
                <span className="text-[#E8A020] animate-pulse">Awaiting Block (~200ms)...</span>
              )}
              {isConfirmed && (
                <span className="text-[#00F3FF]">⚡ Canonical Block #{receipt?.blockNumber ? Number(receipt.blockNumber) : ''}</span>
              )}
            </div>
            <a 
              href={`${explorerUrl}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#00F3FF] underline block truncate text-[8px]"
            >
              Tx: {txHash}
            </a>
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
      <div className="text-[9px] text-[#00F3FF]/70 tracking-[1px] uppercase text-right font-mono">
        Denim 200ms Enabled
      </div>
    </div>
  )
}

