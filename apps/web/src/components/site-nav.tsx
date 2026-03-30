import Link from 'next/link'
import { ConnectWalletButton } from '@/components/connect-wallet'
import { NetworkPill } from '@/components/network-pill'

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--fhe-border)] bg-[var(--fhe-base)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="fhel-slide text-xl font-bold tracking-tight">fheL</span>
          <span className="hidden text-xs text-[var(--fhe-muted)] sm:inline">
            Private Liquidation Engine
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-4">
          <NetworkPill />
          <Link
            href="/app"
            className="text-sm text-[var(--fhe-cyan)] transition hover:text-[var(--fhe-violet)]"
          >
            App
          </Link>
          <Link
            href="/liquidate"
            className="text-sm text-[var(--fhe-cyan)] transition hover:text-[var(--fhe-violet)]"
          >
            Liquidate
          </Link>
          <ConnectWalletButton />
        </nav>
      </div>
    </header>
  )
}
