import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'fheL — Private Liquidation Engine',
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '00000000000000000000000000000000',
  chains: [sepolia],
  ssr: true,
})
