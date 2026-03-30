'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { Toaster } from 'sonner'
import { useState } from 'react'
import { wagmiConfig } from '@/lib/wagmi'

import '@rainbow-me/rainbowkit/styles.css'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#22d3ee',
            accentColorForeground: '#0b1020',
            borderRadius: 'medium',
          })}
        >
          {children}
          <Toaster richColors position="top-center" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
