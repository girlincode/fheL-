import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[var(--fhe-cyan)]">
          Fhenix CoFHE · Ethereum Sepolia
        </p>
        <h1 className="fhel-slide text-4xl font-bold tracking-tight md:text-6xl">
          Private liquidations. Encrypted risk.
        </h1>
        <p className="mt-6 text-lg text-[var(--fhe-muted)]">
          fheL is a testnet demo of a private liquidation engine: collateral and debt stay encrypted on-chain,
          health checks run in FHE, and liquidations execute without broadcasting your position size to the world.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/app"
            className="rounded-lg bg-[var(--fhe-cyan)] px-6 py-3 text-sm font-semibold text-[var(--fhe-base)] shadow-lg shadow-cyan-500/20 transition hover:opacity-90"
          >
            Open app
          </Link>
          <Link
            href="/liquidate"
            className="rounded-lg border border-[var(--fhe-border)] px-6 py-3 text-sm font-semibold text-[var(--fhe-cyan)] transition hover:border-[var(--fhe-violet)] hover:text-[var(--fhe-violet)]"
          >
            Liquidate
          </Link>
        </div>
      </div>

      <div className="mt-24 grid gap-8 md:grid-cols-3">
        {[
          {
            title: 'Encrypted positions',
            body: 'Deposits and borrows are euint64 handles. Outsiders see activity, not your exact balances.',
          },
          {
            title: 'FHE policy',
            body: 'Max borrow and liquidation thresholds use public basis points; comparisons run on ciphertext.',
          },
          {
            title: 'Fair liquidations',
            body: 'Anyone can call liquidate when the encrypted rule fires — no public health score to front-run.',
          },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-[var(--fhe-border)] bg-[var(--fhe-base)]/60 p-6 backdrop-blur"
          >
            <h2 className="text-lg font-semibold text-[var(--fhe-violet)]">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fhe-muted)]">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-2xl rounded-2xl border border-dashed border-[var(--fhe-border)] p-8 text-center">
        <h3 className="text-lg font-semibold text-[var(--fhe-cyan)]">How it works</h3>
        <ol className="mt-4 space-y-3 text-left text-sm text-[var(--fhe-muted)]">
          <li>1. Connect a wallet on Sepolia and open the app.</li>
          <li>2. Encrypt deposit and borrow amounts with the CoFHE client (ZK + threshold flow).</li>
          <li>3. The contract updates encrypted state; you decrypt your own position with a permit.</li>
          <li>4. Liquidators trigger liquidation when encrypted debt crosses the liquidation line.</li>
        </ol>
      </div>
    </div>
  )
}
