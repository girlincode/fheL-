'use client'

import { useState } from 'react'
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { toast } from 'sonner'
import { fhelAbi } from '@/lib/fhel-abi'
import { getFhelAddress } from '@/lib/contract'

export default function LiquidatePage() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { writeContractAsync, isPending, data: txHash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  const [target, setTarget] = useState('')
  const contractAddress = getFhelAddress()
  const wrongNetwork = isConnected && chainId !== sepolia.id

  const onLiquidate = async () => {
    if (!contractAddress || !target.startsWith('0x') || target.length !== 42) {
      toast.error('Enter a valid address (0x…)')
      return
    }
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: fhelAbi,
        functionName: 'liquidate',
        args: [target as `0x${string}`],
        chainId: sepolia.id,
      })
      toast.message('Liquidation tx sent', { description: hash })
    } catch (e) {
      console.error(e)
      toast.error('Liquidation failed', {
        description: e instanceof Error ? e.message : String(e),
      })
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--fhe-cyan)]">Liquidate</h1>
      <p className="mt-2 text-sm text-[var(--fhe-muted)]">
        Calls <code className="rounded bg-black/30 px-1">liquidate(user)</code>. The contract only clears a position
        when encrypted debt is above the liquidation threshold (75% of collateral in this MVP). You never see
        their balances — only whether your transaction changes state on-chain.
      </p>

      {!contractAddress && (
        <div className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
          Configure <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_FHEL_CONTRACT_ADDRESS</code>.
        </div>
      )}

      {wrongNetwork && (
        <button
          type="button"
          className="mt-6 rounded-lg bg-[var(--fhe-violet)] px-4 py-2 text-sm font-medium text-[var(--fhe-base)]"
          onClick={() => switchChain?.({ chainId: sepolia.id })}
        >
          Switch to Sepolia
        </button>
      )}

      <div className="mt-8 rounded-2xl border border-[var(--fhe-border)] bg-[var(--fhe-base)]/50 p-6">
        <label className="text-xs uppercase text-[var(--fhe-muted)]">Borrower address</label>
        <input
          className="mt-1 w-full rounded border border-[var(--fhe-border)] bg-black/30 px-3 py-2 font-mono text-sm"
          placeholder="0x…"
          value={target}
          onChange={(e) => setTarget(e.target.value.trim())}
        />
        <button
          type="button"
          disabled={!contractAddress || wrongNetwork || isPending || !isConnected}
          onClick={onLiquidate}
          className="mt-4 w-full rounded-lg bg-[var(--fhe-cyan)] py-2 text-sm font-semibold text-[var(--fhe-base)] disabled:opacity-40"
        >
          {isPending || isConfirming ? 'Sending…' : 'Attempt liquidation'}
        </button>
      </div>

      {isSuccess && txHash && (
        <a
          className="mt-4 inline-block text-sm text-[var(--fhe-cyan)] underline"
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
        >
          View transaction
        </a>
      )}
    </div>
  )
}
