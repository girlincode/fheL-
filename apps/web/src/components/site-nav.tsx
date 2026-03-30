import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--fhe-border)] bg-[var(--fhe-base)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="fhel-slide text-xl font-bold tracking-tight">fheL</span>
          <span className="hidden text-xs text-[var(--fhe-muted)] sm:inline">
            Private Liquidation Engine
          </span>
        </Link>
        <nav className="flex items-center gap-4">
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
          <ConnectButton showBalance={false} chainStatus="icon" />
        </nav>
      </div>
    </header>
  )
}
