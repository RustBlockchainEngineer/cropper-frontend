import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { cloneDeep } from 'lodash-es'
import logger from '@/utils/logger'

import { DEVNET_MODE } from '@/utils/ids'
import { TOKENS } from '@/utils/tokens'

export const state = () => ({
  initialized: false,
  loading: false,
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {
  setInitialized(state) {
    state.initialized = true
  },

  setLoading(state, loading: boolean) {
    state.loading = loading
  },
})

export const actions:any = actionTree(
  { state, getters, mutations },
  {
    async loadTokens({ commit }) {
      commit('setLoading', true)
      if(DEVNET_MODE == false){
        let myJson:any = await (await fetch('https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json')).json()
        const tokens = myJson.tokens
        tokens.forEach((itemToken: any) => {

          if (itemToken.chainId != 101) {
            return
          }
          if (itemToken.tags && 
            ( 
              itemToken.tags.includes('lp-token') || 
              itemToken.tags.includes('wormhole') ||
              itemToken.tags.includes('lending') ||
              itemToken.tags.includes('wrapped-sollet') ||
              itemToken.tags.includes('stake-pool')
            )
          ) {
            return
          }

          if (itemToken.name.includes("(Allbridge") || itemToken.name.includes("((Wormhole") ) {
            return
          }

          if (!Object.values(TOKENS).find((item) => item.mintAddress === itemToken.address)) {
            TOKENS[itemToken.symbol + itemToken.address + 'solana'] = {
              symbol: itemToken.symbol,
              name: itemToken.name,
              mintAddress: itemToken.address,
              decimals: itemToken.decimals,
              picUrl: itemToken.logoURI,
              tags: ['solana']
            }
          } else {
            const token = Object.values(TOKENS).find((item) => item.mintAddress === itemToken.address)
            if (token.symbol !== itemToken.symbol && !token.tags.includes('cropper')) {
              token.symbol = itemToken.symbol
              token.name = itemToken.name
              token.decimals = itemToken.decimals
              token.tags.push('solana')
            }
            const picToken = Object.values(TOKENS).find((item) => item.mintAddress === itemToken.address)
            if (picToken) {
              picToken.picUrl = itemToken.logoURI
            }
          }
        })
      }

      logger('Token list updated')

      commit('setInitialized')
      commit('setLoading', false)
    }
  }
)
