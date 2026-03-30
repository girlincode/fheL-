'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="rounded-lg border border-[var(--fhe-border)] px-3 py-1.5 font-mono text-xs text-[var(--fhe-cyan)] transition hover:border-[var(--fhe-violet)]"
      >
        {address.slice(0, 6)}…{address.slice(-4)} · Disconnect
      </button>
    )
  }

  const injected = connectors.find((c) => c.id === 'injected') ?? connectors[0]

  return (
    <button
      type="button"
      disabled={isPending || !injected}
      onClick={() => injected && connect({ connector: injected })}
      className="rounded-lg bg-[var(--fhe-cyan)] px-4 py-2 text-sm font-semibold text-[var(--fhe-base)] disabled:opacity-50"
    >
      {isPending ? 'Connecting…' : 'Connect wallet'}
    </button>
  )
}
