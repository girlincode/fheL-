'use client'

import { useEffect, useState } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { WagmiAdapter } from '@cofhe/sdk/adapters'
import { createCofheClient, createCofheConfig } from '@cofhe/sdk/web'
import { sepolia as cofheSepolia } from '@cofhe/sdk/chains'
import type { CofheClient } from '@cofhe/sdk'

export function useCofheClient() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const [client, setClient] = useState<CofheClient | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected || !address || !publicClient || !walletClient) {
      setClient((c) => {
        c?.disconnect()
        return null
      })
      setReady(false)
      setError(null)
      return
    }

    let cancelled = false
    let active: CofheClient | null = null

    ;(async () => {
      try {
        setError(null)
        const config = await createCofheConfig({
          environment: 'web',
          supportedChains: [cofheSepolia],
        })
        const c = createCofheClient(config)
        active = c
        const adapted = await WagmiAdapter(walletClient, publicClient)
        await c.connect(
          adapted.publicClient as Parameters<typeof c.connect>[0],
          adapted.walletClient as Parameters<typeof c.connect>[1]
        )
        await c.permits.getOrCreateSelfPermit()
        if (cancelled) {
          c.disconnect()
          return
        }
        setClient(c)
        setReady(true)
      } catch (e) {
        console.error(e)
        setError(e instanceof Error ? e.message : 'CoFHE init failed')
        setReady(false)
        setClient(null)
      }
    })()

    return () => {
      cancelled = true
      active?.disconnect()
    }
  }, [isConnected, address, publicClient, walletClient])

  return { cofheClient: client, cofheReady: ready, cofheError: error }
}
