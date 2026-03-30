'use client'

import { sepolia } from 'wagmi/chains'
import { getFhelAddress } from '@/lib/contract'

export function ContractStatus() {
  const addr = getFhelAddress()
  if (!addr) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90">
        Set <code className="mx-1 rounded bg-black/40 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_FHEL_CONTRACT_ADDRESS</code>
        in <code className="mx-1 rounded bg-black/40 px-1.5 py-0.5 text-xs">.env.local</code>
      </div>
    )
  }

  const short = `${addr.slice(0, 6)}…${addr.slice(-4)}`
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--fhe-border)] bg-gradient-to-r from-[var(--fhe-base)] to-[#0f1729] px-4 py-3 text-sm shadow-lg shadow-cyan-500/5">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--fhe-cyan)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--fhe-cyan)]">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--fhe-cyan)]" />
        Sepolia · {sepolia.id}
      </span>
      <span className="text-[var(--fhe-muted)]">Contract</span>
      <code className="font-mono text-xs text-[var(--fhe-violet)]">{short}</code>
      <a
        href={`https://sepolia.etherscan.io/address/${addr}`}
        target="_blank"
        rel="noreferrer"
        className="ml-auto text-xs font-medium text-[var(--fhe-cyan)] underline-offset-4 hover:underline"
      >
        Etherscan
      </a>
    </div>
  )
}
