import Link from 'next/link'

const stats = [
  { label: 'Max borrow', value: '80%', hint: 'of encrypted collateral (BPS)' },
  { label: 'Liquidation line', value: '75%', hint: 'debt above this vs collateral' },
  { label: 'On-chain types', value: 'euint64', hint: 'FHE handles, not plaintext' },
]

const pillars = [
  {
    title: 'Encrypted positions',
    body: 'Collateral and debt live as FHE ciphertext handles. Observers see that you interacted with the contract — not how much you deposited or borrowed.',
  },
  {
    title: 'Homomorphic policy',
    body: 'Borrow caps and liquidation rules use public basis-point constants. Comparisons and selections run on encrypted values via the CoFHE coprocessor.',
  },
  {
    title: 'Fair liquidations',
    body: 'Anyone can attempt liquidation when the encrypted condition holds. There is no public “health factor” number for bots to race against.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Connect on Sepolia',
    text: 'Use an injected wallet (e.g. MetaMask). Add the Sepolia test network if needed and get test ETH from a faucet.',
  },
  {
    n: '02',
    title: 'Encrypt & deposit',
    text: 'The app uses @cofhe/sdk to build ZK-backed inputs. Your amounts are encrypted before they ever reach the chain.',
  },
  {
    n: '03',
    title: 'Borrow within limit',
    text: 'New debt is only applied if encrypted debt stays within the max LTV. Otherwise the contract keeps your previous debt.',
  },
  {
    n: '04',
    title: 'Decrypt your view',
    text: 'With a CoFHE permit, you can decrypt your own position off-chain for display — others cannot decrypt your handles by default.',
  },
]

const faq = [
  {
    q: 'Is this production-ready money?',
    a: 'No. This is a Sepolia testnet demo for learning and experimentation. It is not audited and not financial advice.',
  },
  {
    q: 'What are “units” in the form?',
    a: 'Abstract uint64 units in this MVP — not USD or ETH with an oracle. Think of them as a consistent scale for demo collateral and debt.',
  },
  {
    q: 'Why can I borrow between 75% and 80% of collateral?',
    a: 'Max borrow is 80%. Liquidation triggers when debt is above 75% of collateral — so a band in between can be liquidatable.',
  },
  {
    q: 'What if CoFHE or decrypt feels slow?',
    a: 'First-time encryption fetches keys; ZK proving can take a few seconds. Check the CoFHE docs and your network connection.',
  },
]

export default function HomePage() {
  return (
    <div className="relative">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="fhe-orb absolute -left-24 top-10 h-80 w-80 bg-[var(--fhe-cyan)]"
          style={{ opacity: 0.25 }}
        />
        <div
          className="fhe-orb fhe-orb-delay absolute -right-20 top-40 h-96 w-96 bg-[var(--fhe-violet)]"
          style={{ opacity: 0.2 }}
        />
        <div
          className="fhe-orb absolute bottom-20 left-1/3 h-64 w-64 bg-[var(--fhe-cyan)]"
          style={{ opacity: 0.15 }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="fhe-fade-in mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[var(--fhe-cyan)]">
            Fhenix CoFHE · Ethereum Sepolia
          </p>
          <h1 className="fhel-slide fhe-fade-in fhe-delay-1 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            Private liquidations. Encrypted risk.
          </h1>
          <p className="fhe-fade-in fhe-delay-2 mt-6 text-lg leading-relaxed text-[var(--fhe-muted)] md:text-xl">
            fheL is a <strong className="font-semibold text-white/90">Private Liquidation Engine</strong> demo:
            collateral and debt stay encrypted on-chain, policy checks run in FHE, and liquidations do not require
            broadcasting your position size to the world.
          </p>
          <p className="fhe-fade-in fhe-delay-3 mt-4 text-sm leading-relaxed text-[var(--fhe-muted)]">
            Built for builders exploring confidential DeFi — combine this idea with oracles, multi-asset pools, and
            audits for real-world use.
          </p>
          <div className="fhe-fade-in fhe-delay-4 mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/app"
              className="rounded-xl bg-[var(--fhe-cyan)] px-8 py-3.5 text-sm font-semibold text-[var(--fhe-base)] shadow-lg shadow-cyan-500/25 transition hover:scale-[1.02] hover:shadow-cyan-500/35 active:scale-[0.98]"
            >
              Open app
            </Link>
            <Link
              href="/liquidate"
              className="rounded-xl border border-[var(--fhe-border)] px-8 py-3.5 text-sm font-semibold text-[var(--fhe-cyan)] transition hover:scale-[1.02] hover:border-[var(--fhe-violet)] hover:text-[var(--fhe-violet)] active:scale-[0.98]"
            >
              Liquidate
            </Link>
          </div>
          <div className="fhe-fade-in fhe-delay-5 mx-auto mt-8 flex flex-wrap justify-center gap-2 text-xs text-[var(--fhe-muted)]">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Open source</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Wallet-first</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Sepolia only</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`fhe-card-interactive fhe-fade-in rounded-2xl border border-[var(--fhe-border)] bg-[var(--fhe-base)]/50 p-6 text-center backdrop-blur-sm ${
                i === 0 ? 'fhe-delay-1' : i === 1 ? 'fhe-delay-2' : 'fhe-delay-3'
              }`}
            >
              <div className="text-2xl font-bold text-[var(--fhe-cyan)] md:text-3xl">{s.value}</div>
              <div className="mt-1 text-sm font-medium text-white/90">{s.label}</div>
              <div className="mt-2 text-xs text-[var(--fhe-muted)]">{s.hint}</div>
            </div>
          ))}
        </div>

        {/* Problem / solution */}
        <div className="mx-auto mt-24 max-w-5xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Why fheL exists</h2>
            <div className="fhe-shimmer-line mx-auto mt-4 max-w-xs" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-red-500/[0.06] p-6 md:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-red-300/90">Classic lending</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--fhe-muted)]">
                Public protocols expose balances and health factors. Searchers and liquidation bots compete on the same
                public signals — often leading to gas wars and worse outcomes for borrowers.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--fhe-border)] bg-emerald-500/[0.06] p-6 md:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300/90">fheL direction</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--fhe-muted)]">
                Keep sensitive numeric state encrypted on-chain, enforce policy with FHE, and let users decrypt only
                what they should see. This repo is a small, honest slice of that vision on testnet.
              </p>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="mt-24 grid gap-6 md:grid-cols-3">
          {pillars.map((c) => (
            <div
              key={c.title}
              className="fhe-card-interactive rounded-2xl border border-[var(--fhe-border)] bg-[var(--fhe-base)]/55 p-6 backdrop-blur-md"
            >
              <h2 className="text-lg font-semibold text-[var(--fhe-violet)]">{c.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--fhe-muted)]">{c.body}</p>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="mx-auto mt-24 max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">End-to-end flow</h2>
            <p className="mt-2 text-sm text-[var(--fhe-muted)]">From wallet connection to encrypted state updates</p>
            <div className="fhe-shimmer-line mx-auto mt-4 max-w-xs" />
          </div>
          <ol className="space-y-5">
            {steps.map((s) => (
              <li
                key={s.n}
                className="flex gap-4 rounded-2xl border border-[var(--fhe-border)] bg-[var(--fhe-base)]/40 p-5 backdrop-blur-sm transition hover:border-[var(--fhe-violet)]/30"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--fhe-cyan)]/20 to-[var(--fhe-violet)]/20 font-mono text-sm font-bold text-[var(--fhe-cyan)]">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-semibold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--fhe-muted)]">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-white md:text-3xl">Questions</h2>
          <div className="fhe-shimmer-line mx-auto mt-4 max-w-xs" />
          <div className="mt-10 space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="fhe-details group rounded-xl border border-[var(--fhe-border)] bg-[var(--fhe-base)]/45 px-5 py-4 backdrop-blur-sm open:border-[var(--fhe-violet)]/40"
              >
                <summary className="flex items-center justify-between gap-2 text-left font-medium text-[var(--fhe-cyan)]">
                  {item.q}
                  <span className="text-[var(--fhe-violet)] transition group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--fhe-muted)]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto mt-24 max-w-3xl overflow-hidden rounded-2xl border border-[var(--fhe-border)] bg-gradient-to-r from-[var(--fhe-cyan)]/10 via-[var(--fhe-base)] to-[var(--fhe-violet)]/10 p-8 text-center md:p-12">
          <h2 className="text-xl font-bold text-white md:text-2xl">Ready to try encrypted positions?</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--fhe-muted)]">
            Connect your wallet on Sepolia, fund it with test ETH, then deposit and borrow — decrypt your balances when
            you want a plaintext view.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/app"
              className="rounded-xl bg-[var(--fhe-cyan)] px-8 py-3 text-sm font-semibold text-[var(--fhe-base)] shadow-lg transition hover:opacity-90"
            >
              Go to dashboard
            </Link>
            <a
              href="https://cofhe-docs.fhenix.zone"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[var(--fhe-border)] px-8 py-3 text-sm font-semibold text-white/90 transition hover:border-[var(--fhe-cyan)]"
            >
              Read CoFHE docs
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
