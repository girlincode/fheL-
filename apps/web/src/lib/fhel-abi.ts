export const fhelAbi = [
  {
    inputs: [],
    name: 'BPS',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'LIQUIDATION_BPS',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_BORROW_BPS',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'ctHash', type: 'uint256' },
          { internalType: 'uint8', name: 'securityZone', type: 'uint8' },
          { internalType: 'uint8', name: 'utype', type: 'uint8' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct InEuint64',
        name: 'encAmount',
        type: 'tuple',
      },
    ],
    name: 'borrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'ctHash', type: 'uint256' },
          { internalType: 'uint8', name: 'securityZone', type: 'uint8' },
          { internalType: 'uint8', name: 'utype', type: 'uint8' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct InEuint64',
        name: 'encAmount',
        type: 'tuple',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'liquidate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'positionOf',
    outputs: [
      { internalType: 'euint64', name: 'collateral', type: 'bytes32' },
      { internalType: 'euint64', name: 'debt', type: 'bytes32' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
