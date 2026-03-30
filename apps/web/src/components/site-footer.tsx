import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--fhe-border)] bg-[var(--fhe-base)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-[var(--fhe-muted)]">
            Built with Fhenix CoFHE on Ethereum Sepolia. Encrypted positions; public policy params.
          </p>
          <p className="mt-1 text-xs text-[var(--fhe-muted)]">
            Testnet demo — not audited financial advice.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="text-sm text-[var(--fhe-cyan)] hover:underline">
            Home
          </Link>
          <Link href="/app" className="text-sm text-[var(--fhe-cyan)] hover:underline">
            App
          </Link>
          <Link href="/liquidate" className="text-sm text-[var(--fhe-cyan)] hover:underline">
            Liquidate
          </Link>
          <a
            href="https://cofhe-docs.fhenix.zone"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[var(--fhe-violet)] hover:underline"
          >
            CoFHE docs
          </a>
        </div>
        <div className="fhel-brand text-right md:text-left">
          <span className="fhel-slide text-2xl font-bold tracking-tight">fheL</span>
        </div>
      </div>
    </footer>
  )
}
