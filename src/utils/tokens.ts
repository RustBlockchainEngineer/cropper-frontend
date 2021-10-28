import { TokenAmount } from '@/utils/safe-math'
import { cloneDeep } from 'lodash-es'

import { DEVNET_MODE } from './ids'

export interface TokenInfo {
  symbol: string
  name: string

  mintAddress: string
  decimals: number
  totalSupply?: TokenAmount

  referrer?: string

  details?: string
  docs?: object
  socials?: object

  tokenAccountAddress?: string
  balance?: TokenAmount
  tags: string[]
}

export interface Tokens {
  [key: string]: any
  [index: number]: any
}

export const NATIVE_SOL: TokenInfo = {
  symbol: 'SOL',
  name: 'Native Solana',
  mintAddress: '11111111111111111111111111111111',
  decimals: 9,
  tags:['cropper']
}

const TOKENBASE_MAIN: Tokens = {
  CRP: {
    symbol: 'CRP',
    name: 'CRP',
    mintAddress: 'DubwWZNWiNGMMeeQHPnMATNj77YZPZSAz2WVR5WjLJqz',
    decimals: 9,
    referrer: 'FKocyVJptELTbnkUkDRmT7y6hUem2JYrqHoph9uyvQXt',
    tags: ['cropper']
  },
  WSOL: {
    symbol: 'WSOL',
    name: 'Wrapped Solana',
    mintAddress: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    referrer: 'HTcarLHe7WRxBQCWvhVB8AP56pnEtJUV2jDGvcpY3xo5',
    tags:['cropper']
  },
  BTC: {
    symbol: 'BTC',
    name: 'Wrapped Bitcoin',
    mintAddress: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
    decimals: 6,
    referrer: 'GZpS8cY8Nt8HuqxzJh6PXTdSxc38vFUjBmi7eEUkkQtG',
    tags:['cropper']
  },
  ETH: {
    symbol: 'ETH',
    name: 'Wrapped Ethereum',
    mintAddress: '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
    decimals: 6,
    referrer: 'CXPTcSxxh4AT38gtv3SPbLS7oZVgXzLbMb83o4ziXjjN',
    tags:['cropper']
  },
  USDT: {
    symbol: 'USDT',
    name: 'USDT',
    mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
    referrer: '8DwwDNagph8SdwMUdcXS5L9YAyutTyDJmK6cTKrmNFk3',
    tags:['cropper']
  },
  WUSDT: {
    symbol: 'WUSDT',
    name: 'Wrapped USDT',
    mintAddress: 'BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4',
    decimals: 6,
    referrer: 'CA98hYunCLKgBuD6N8MJSgq1GbW9CXdksLf5mw736tS3',
    tags:['cropper']
  },
  USDC: {
    symbol: 'USDC',
    name: 'USDC',
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    referrer: '92vdtNjEg6Zth3UU1MgPgTVFjSEzTHx66aCdqWdcRkrg',
    tags:['cropper']
  },
  xCOPE: {
    symbol: 'xCOPE',
    name: 'xCOPE',
    mintAddress: '3K6rftdAaQYMPunrtNRHgnK2UAtjm2JwyT2oCiTDouYE',
    decimals: 0,
    referrer: '8DTehuES4tfnd2SrqcjN52XofxWXGjiLZRgM12U9pB6f',
    tags: ['cropper']
  },
  RAY: {
    symbol: 'RAY',
    name: 'Raydium',
    mintAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    decimals: 6,
    referrer: '33XpMmMQRf6tSPpmYyzpwU4uXpZHkFwCZsusD9dMYkjy',
    tags: ['cropper']
  },
  SRM: {
    symbol: 'SRM',
    name: 'Serum',
    mintAddress: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    decimals: 6,
    referrer: 'HYxa4Ea1dz7ya17Cx18rEGUA1WbCvKjXjFKrnu8CwugH',
    tags: ['cropper']
  },
}
const TOKENBASE_DEVNET: Tokens = {
  CRP: {
    symbol: 'CRP',
    name: 'CRP',
    // mintAddress : '67P8nMeC7dbqBVeJNRMfAj1Js8XZEPUhch9F7gVNH1nX',
    mintAddress: 'GGaUYeET8HXK34H2D1ieh4YYQPhkWcfWBZ4rdp6iCZtG',
    // decimals: 6,
    decimals: 6,
    // referrer : '67P8nMeC7dbqBVeJNRMfAj1Js8XZEPUhch9F7gVNH1nX',
    // referrer: 'GGaUYeET8HXK34H2D1ieh4YYQPhkWcfWBZ4rdp6iCZtG',
    tags:['cropper']
  },
  
  USDT: {
    symbol: 'USDT',
    name: 'USDT',
    mintAddress: '6La9ryWrDPByZViuQCizmo6aW98cK8DSL7angqmTFf9i',
    decimals: 9,
    // referrer: '6La9ryWrDPByZViuQCizmo6aW98cK8DSL7angqmTFf9i',
    tags:['cropper']
  },

  USDC: {
    symbol: 'USDC',
    name: 'USDC',
    mintAddress: '6MBRfPbzejwVpADXq3LCotZetje3N16m5Yn7LCs2ffU4',
    decimals: 9,
    // referrer: '6MBRfPbzejwVpADXq3LCotZetje3N16m5Yn7LCs2ffU4',
    tags:['cropper']
  },
  B2B: {
    symbol: 'B2B',
    name: 'B2B',
    mintAddress: 'ECe1Hak68wLS44NEwBVNtZDMxap1bX3jPCoAnDLFWDHz',
    decimals: 9,
    // referrer: 'ECe1Hak68wLS44NEwBVNtZDMxap1bX3jPCoAnDLFWDHz',
    tags:['cropper']
  },
  ETH: {
    symbol: 'ETH',
    name: 'ETH',
    mintAddress: 'G4UK7D15rHE85Q8HLKQ9BBafd2n2sUCkCRWwvWtBfuPe',
    decimals: 9,
    // referrer: 'G4UK7D15rHE85Q8HLKQ9BBafd2n2sUCkCRWwvWtBfuPe',
    tags:['cropper']
  },
  WSOL: {
    symbol: 'WSOL',
    name: 'Wrapped Solana',
    mintAddress: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    // referrer: 'HTcarLHe7WRxBQCWvhVB8AP56pnEtJUV2jDGvcpY3xo5',
    tags:['cropper']
  },
  WUSDT: {
    symbol: 'WUSDT',
    name: 'Wrapped USDT',
    mintAddress: 'BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4',
    decimals: 6,
    // referrer: 'CA98hYunCLKgBuD6N8MJSgq1GbW9CXdksLf5mw736tS3',
    tags:['cropper']
  },
  WUSDC: {
    symbol: 'WUSDC',
    name: 'Wrapped USDC',
    mintAddress: 'BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW',
    decimals: 6,
    tags:['cropper']
  },
  xCOPE: {
    symbol: 'xCOPE',
    name: 'xCOPE',
    mintAddress: '3K6rftdAaQYMPunrtNRHgnK2UAtjm2JwyT2oCiTDouYE',
    decimals: 0,
    // referrer: '8DTehuES4tfnd2SrqcjN52XofxWXGjiLZRgM12U9pB6f',
    tags:['cropper']
  },
}

export const TOKENS = DEVNET_MODE ? TOKENBASE_DEVNET : TOKENBASE_MAIN
/**
 * Get token use symbol

 * @param {string} symbol

 * @returns {TokenInfo | null} tokenInfo
 */
export function getTokenBySymbol(symbol: string): TokenInfo | null {
  if (symbol === 'SOL') {
    return cloneDeep(NATIVE_SOL)
  }

  let token = cloneDeep(TOKENS[symbol])

  if (!token) {
    token = null
  }

  return token
}

/**
 * Get token use mint addresses

 * @param {string} mintAddress

 * @returns {TokenInfo | null} tokenInfo
 */
export function getTokenByMintAddress(mintAddress: string): TokenInfo | null {
  if (mintAddress === NATIVE_SOL.mintAddress) {
    return cloneDeep(NATIVE_SOL)
  }
  const token = Object.values(TOKENS).find((item) => item.mintAddress === mintAddress)
  return token ? cloneDeep(token) : null
}

export function getTokenSymbolByMint(mint: string) {
  if (mint === NATIVE_SOL.mintAddress) {
    return NATIVE_SOL.symbol
  }

  const token = Object.values({ ...TOKENS }).find((item) => item.mintAddress === mint)

  if (token) {
    return token.symbol
  }
  return 'UNKNOWN'
}

export const TOKENS_TAGS: { [key: string]: { mustShow: boolean; show: boolean; outName: string } } = {
  cropper: { mustShow: true, show: true, outName: 'Cropper Default List' },
  solana: { mustShow: true, show: true, outName: 'Solana Token List' },
}