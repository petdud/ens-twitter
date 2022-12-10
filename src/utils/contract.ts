import type { Chain, SendTransactionResult } from '@wagmi/core/dist'

export const getEtherscanUrl = (data: SendTransactionResult, chain?: Chain) => {
  return chain?.id === 5
    ? `https://goerli.etherscan.io/tx/${data.hash}`
    : `https://etherscan.io/tx/${data.hash}`
}

/**
 * ==============================
 * ENS CONTRACT CONSTANTS
 * ==============================
 */

export const ENS_RESOLVER_ABI = [
  {
    constant: false,
    inputs: [
      { internalType: 'bytes32', name: 'node', type: 'bytes32' },
      { internalType: 'string', name: 'key', type: 'string' },
      { internalType: 'string', name: 'value', type: 'string' },
    ],
    name: 'setText',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
