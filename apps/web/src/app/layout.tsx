import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Shell } from '@/components/shell'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'fheL — Private Liquidation Engine',
  description:
    'DeFi positions with FHE on Ethereum Sepolia: encrypted collateral and debt, private health checks, CoFHE-powered liquidations.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen font-sans antialiased`}>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  )
}
