'use client'

import { useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function NetworkPill() {
  const id = useChainId()
  const ok = id === sepolia.id
  return (
    <span
      className={`hidden rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:inline ${
        ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-200'
      }`}
    >
      {ok ? 'Sepolia' : `Chain ${id}`}
    </span>
  )
}
