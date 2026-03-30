'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  useAccount,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { Encryptable, FheTypes } from '@cofhe/sdk'
import { toast } from 'sonner'
import { useCofheClient } from '@/hooks/useCofheClient'
import { fhelAbi } from '@/lib/fhel-abi'
import { getFhelAddress } from '@/lib/contract'
import { ContractStatus } from '@/components/contract-status'

export default function AppPage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { cofheClient, cofheReady, cofheError } = useCofheClient()
  const { writeContractAsync, isPending: isWritePending, data: txHash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const contractAddress = getFhelAddress()

  const { data: position, refetch: refetchPosition } = useReadContract({
    address: contractAddress ?? undefined,
    abi: fhelAbi,
    functionName: 'positionOf',
    args: address && contractAddress ? [address] : undefined,
    chainId: sepolia.id,
    query: {
      enabled: Boolean(isConnected && address && contractAddress && chainId === sepolia.id),
    },
  })

  useEffect(() => {
    if (isConfirmed) void refetchPosition()
  }, [isConfirmed, refetchPosition])

  const [depositAmt, setDepositAmt] = useState('100')
  const [borrowAmt, setBorrowAmt] = useState('50')
  const [collateralClear, setCollateralClear] = useState<string | null>(null)
  const [debtClear, setDebtClear] = useState<string | null>(null)
  const [decrypting, setDecrypting] = useState(false)

  const wrongNetwork = isConnected && chainId !== sepolia.id

  const runTx = useCallback(async (label: string, fn: () => Promise<`0x${string}`>) => {
    try {
      const hash = await fn()
      toast.message(`${label} submitted`, { description: hash })
    } catch (e) {
      console.error(e)
      toast.error(`${label} failed`, {
        description: e instanceof Error ? e.message : String(e),
      })
    }
  }, [])

  const onDeposit = async () => {
    if (!cofheClient || !address || !contractAddress) return
    const v = BigInt(depositAmt || '0')
    await runTx('Deposit', async () =>
      writeContractAsync({
        address: contractAddress,
        abi: fhelAbi,
        functionName: 'deposit',
        args: [(await cofheClient.encryptInputs([Encryptable.uint64(v)]).execute())[0] as never],
        chainId: sepolia.id,
      })
    )
  }

  const onBorrow = async () => {
    if (!cofheClient || !address || !contractAddress) return
    const v = BigInt(borrowAmt || '0')
    await runTx('Borrow', async () =>
      writeContractAsync({
        address: contractAddress,
        abi: fhelAbi,
        functionName: 'borrow',
        args: [(await cofheClient.encryptInputs([Encryptable.uint64(v)]).execute())[0] as never],
        chainId: sepolia.id,
      })
    )
  }

  const onDecrypt = async () => {
    if (!cofheClient || !address || !position) return
    setDecrypting(true)
    setCollateralClear(null)
    setDebtClear(null)
    try {
      const [cHash, dHash] = position as [`0x${string}`, `0x${string}`]
      const cBig = BigInt(cHash)
      const dBig = BigInt(dHash)

      const cDec = await cofheClient
        .decryptForView(cBig, FheTypes.Uint64)
        .setChainId(sepolia.id)
        .setAccount(address)
        .withPermit()
        .execute()
      const dDec = await cofheClient
        .decryptForView(dBig, FheTypes.Uint64)
        .setChainId(sepolia.id)
        .setAccount(address)
        .withPermit()
        .execute()

      setCollateralClear(String(cDec as bigint))
      setDebtClear(String(dDec as bigint))
      toast.success('Decrypted your position (local view)')
    } catch (e) {
      console.error(e)
      toast.error('Decrypt failed', {
        description: e instanceof Error ? e.message : String(e),
      })
    } finally {
      setDecrypting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-[var(--fhe-cyan)] to-[var(--fhe-violet)] bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Dashboard
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--fhe-muted)]">
          Deposit and borrow use encrypted uint64 inputs. Max borrow {`≤`} 80% of collateral; liquidation if debt
          {` > `}75% of collateral (both in encrypted arithmetic).
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--fhe-muted)]">
          Use the same number scale for every action (e.g. if you deposit <code className="rounded bg-black/30 px-1 text-xs">100</code>, borrow
          stays comparable in those units). After each successful tx, your on-chain handles update — use{' '}
          <strong className="font-medium text-white/85">Decrypt</strong> to see cleartext only on your machine.
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--fhe-border)] bg-[var(--fhe-cyan)]/[0.06] p-4 text-xs leading-relaxed text-[var(--fhe-muted)]">
          <span className="font-semibold text-[var(--fhe-cyan)]">Quick tip</span>
          <p className="mt-2">
            Approve wallet prompts for CoFHE permits the first time you encrypt or decrypt — that links your keys to
            the coprocessor securely.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--fhe-border)] bg-[var(--fhe-violet)]/[0.06] p-4 text-xs leading-relaxed text-[var(--fhe-muted)]">
          <span className="font-semibold text-[var(--fhe-violet)]">Borrow didn’t change?</span>
          <p className="mt-2">
            The contract only updates debt when the encrypted LTV check passes. Lower the borrow or add collateral, then
            try again.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <ContractStatus />
      </div>

      {!contractAddress && (
        <div className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
          Set <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_FHEL_CONTRACT_ADDRESS</code> in{' '}
          <code className="rounded bg-black/30 px-1">apps/web/.env.local</code> after deploying the contract.
        </div>
      )}

      {wrongNetwork && (
        <div className="mt-6">
          <button
            type="button"
            className="rounded-lg bg-[var(--fhe-violet)] px-4 py-2 text-sm font-medium text-[var(--fhe-base)]"
            onClick={() => switchChain?.({ chainId: sepolia.id })}
          >
            Switch to Sepolia
          </button>
        </div>
      )}

      {cofheError && <p className="mt-4 text-sm text-red-300">CoFHE: {cofheError}</p>}

      {isConnected && !cofheReady && !cofheError && (
        <p className="mt-4 text-sm text-[var(--fhe-muted)]">Initializing CoFHE client…</p>
      )}

      <div className="mt-2 space-y-6 rounded-2xl border border-[var(--fhe-border)] bg-[var(--fhe-base)]/40 p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-[var(--fhe-muted)]">
            Deposit amount (uint64 units)
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-[var(--fhe-border)] bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/30"
            value={depositAmt}
            onChange={(e) => setDepositAmt(e.target.value)}
          />
          <button
            type="button"
            disabled={!cofheReady || !contractAddress || wrongNetwork || isWritePending}
            onClick={onDeposit}
            className="mt-3 w-full rounded-lg bg-[var(--fhe-cyan)] py-2 text-sm font-semibold text-[var(--fhe-base)] disabled:opacity-40"
          >
            Deposit (encrypted)
          </button>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-[var(--fhe-muted)]">
            Borrow amount
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-[var(--fhe-border)] bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/30"
            value={borrowAmt}
            onChange={(e) => setBorrowAmt(e.target.value)}
          />
          <button
            type="button"
            disabled={!cofheReady || !contractAddress || wrongNetwork || isWritePending}
            onClick={onBorrow}
            className="mt-3 w-full rounded-lg border border-[var(--fhe-violet)] py-2 text-sm font-semibold text-[var(--fhe-violet)] disabled:opacity-40"
          >
            Borrow (encrypted)
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--fhe-border)] bg-[var(--fhe-base)]/40 p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-[var(--fhe-violet)]">Your position (decrypt)</h2>
        <p className="mt-1 text-xs text-[var(--fhe-muted)]">
          Uses your active CoFHE permit to seal/unseal handles from <code>positionOf</code>.
        </p>
        <button
          type="button"
          disabled={!cofheReady || !contractAddress || wrongNetwork || decrypting || !position}
          onClick={onDecrypt}
          className="mt-4 rounded-lg bg-[var(--fhe-violet)] px-4 py-2 text-sm font-medium text-[var(--fhe-base)] disabled:opacity-40"
        >
          {decrypting ? 'Decrypting…' : 'Decrypt my collateral & debt'}
        </button>
        {(collateralClear !== null || debtClear !== null) && (
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--fhe-muted)]">Collateral</dt>
              <dd className="font-mono text-[var(--fhe-cyan)]">{collateralClear ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--fhe-muted)]">Debt</dt>
              <dd className="font-mono text-[var(--fhe-cyan)]">{debtClear ?? '—'}</dd>
            </div>
          </dl>
        )}
      </div>

      {(isWritePending || isConfirming) && (
        <p className="mt-4 text-xs text-[var(--fhe-muted)]">Waiting for transaction…</p>
      )}
      {isConfirmed && txHash && (
        <a
          className="mt-2 inline-block text-xs text-[var(--fhe-cyan)] underline"
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
        >
          View on Etherscan
        </a>
      )}
    </div>
  )
}
