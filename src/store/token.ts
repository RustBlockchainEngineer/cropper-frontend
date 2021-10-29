import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { cloneDeep } from 'lodash-es'
import logger from '@/utils/logger'

import { DEVNET_MODE, TOKEN_UPDATE_INTERVAL } from '@/utils/ids'
import { POP_TOKENS, TOKENS, WRAPPED_SOL } from '@/utils/tokens'

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

      let need_to_update = false
      let cur_date = new Date().getTime()

      if(window.localStorage.token_last_updated){
        const last_updated = parseInt(window.localStorage.token_last_updated)
        if(cur_date - last_updated >= TOKEN_UPDATE_INTERVAL){
          need_to_update = true
        }
      }
      else
      {
        need_to_update = true
      }

      if(DEVNET_MODE == false && need_to_update == true)
      {
        let myJson:any = await (await fetch('https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json')).json()
        const tokens = myJson.tokens

        let allowed = await fetch('https://api.cropper.finance/tokens/').then((res) => res.json())

        tokens.forEach((itemToken: any) => {

          if(itemToken.chainId != 101) return

          if (itemToken.tags && 
            ( 
              itemToken.tags.includes('lp-token') || 
              itemToken.tags.includes('wormhole') ||
              itemToken.tags.includes('lending') ||
              itemToken.tags.includes('stake-pool') || 
              !allowed[itemToken.address] ||
              itemToken.name.includes("(Allbridge") || 
              itemToken.name.includes("((Wormhole")
            )
             && itemToken.symbol != 'wUSDT'
             && itemToken.symbol != 'wSOL'
             && itemToken.symbol != 'USDC'
          ) {
            return
          }

          const token = Object.values(TOKENS).find((item) => item.mintAddress === itemToken.address)
          if (!token) {// + itemToken.address + 'solana'
            let key = POP_TOKENS[itemToken.address] ?? itemToken.address
            TOKENS[key] = {
              symbol: itemToken.symbol,
              name: itemToken.name,
              mintAddress: itemToken.address,
              decimals: itemToken.decimals,
              picUrl: itemToken.logoURI,
              tags: ['solana']
            }
          } else {
            token.picUrl = itemToken.logoURI
            if (token.symbol !== itemToken.symbol && !token.tags.includes('cropper')) {
              token.symbol = itemToken.symbol
              token.name = itemToken.name
              token.mintAddress = itemToken.address
              token.decimals = itemToken.decimals
              token.tags.push('solana')
            }
          }
        })
        TOKENS['WSOL'] = cloneDeep(WRAPPED_SOL)

      }

      if(need_to_update)
      {
        window.localStorage.token_last_updated = new Date().getTime()
        window.localStorage.tokens = JSON.stringify(TOKENS)
      }
      else
      {
        const tokens = JSON.parse(window.localStorage.tokens)

        for (const [key, value] of Object.entries(tokens)) {
          TOKENS[key] = value
        }
      }

      logger('Token list updated')

      commit('setInitialized')
      commit('setLoading', false)
    }
  }
)
