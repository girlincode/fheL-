import { sepolia } from 'wagmi/chains'

export const FHEL_CHAIN = sepolia

export function getFhelAddress(): `0x${string}` | null {
  const raw = process.env.NEXT_PUBLIC_FHEL_CONTRACT_ADDRESS
  if (!raw || !raw.startsWith('0x') || raw.length < 42) return null
  return raw as `0x${string}`
}
