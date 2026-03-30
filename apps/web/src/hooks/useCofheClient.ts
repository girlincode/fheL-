'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  const initRef = useRef(false)

  const disconnectCofhe = useCallback(() => {
    initRef.current = false
    setReady(false)
    setClient((c) => {
      c?.disconnect()
      return null
    })
  }, [])

  useEffect(() => {
    if (!isConnected || !address || !publicClient || !walletClient) {
      disconnectCofhe()
      setError(null)
      return
    }

    let cancelled = false

    ;(async () => {
      try {
        setError(null)
        const config = await createCofheConfig({
          environment: 'TESTNET',
          supportedChains: [cofheSepolia],
        })
        const c = createCofheClient(config)
        const adapted = await WagmiAdapter(walletClient, publicClient)
        await c.connect(adapted.publicClient, adapted.walletClient)
        await c.permits.getOrCreateSelfPermit()
        if (cancelled) {
          c.disconnect()
          return
        }
        setClient(c)
        setReady(true)
        initRef.current = true
      } catch (e) {
        console.error(e)
        setError(e instanceof Error ? e.message : 'CoFHE init failed')
        setReady(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isConnected, address, publicClient, walletClient, disconnectCofhe])

  return { cofheClient: client, cofheReady: ready, cofheError: error }
}
