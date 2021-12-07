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


      if(window.localStorage.tokensLoading && window.localStorage.tokensLoading == 1){
        logger('Skiped')
        return
      }


      window.localStorage.tokensLoading = 1

      if(window.localStorage.token_last_updated_){
        const last_updated = parseInt(window.localStorage.token_last_updated_)
        if(cur_date - last_updated >= TOKEN_UPDATE_INTERVAL || last_updated < 1638191914){
          need_to_update = true
        }
      }
      else
      {
        need_to_update = true
      }

      if(!DEVNET_MODE )
      {
        if(need_to_update == false)
        {
          const tokens = JSON.parse(window.localStorage.tokens)
  
          for (const [key, value] of Object.entries(tokens)) {
            TOKENS[key] = value
          }

          if(Object.entries(TOKENS).length == 0)
          {
            need_to_update = true
          }
        }

        if(need_to_update)
        {
          let myJson:any = await (await fetch('https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json')).json()
          const tokens = myJson.tokens

          let allowed = await fetch('https://api.cropper.finance/tokens/').then((res) => res.json())

          tokens.forEach((itemToken: any) => {

            if(itemToken.chainId != 101) return

            if (itemToken.tags && 
              ( 
                itemToken.tags.includes('lp-token') || 
                itemToken.tags.includes('lending') ||
                itemToken.tags.includes('stake-pool') || 
                !allowed[itemToken.address] ||
                itemToken.name.includes("(Allbridge")
              )
              && itemToken.symbol != 'wUSDT'
              && itemToken.symbol != 'wSOL'
              && itemToken.symbol != 'USDC'
            ) {
              return
            }


            if(itemToken.address == 'FCqfQSujuPxy6V42UvafBhsysWtEq1vhjfMN1PUbgaxA') { return ; }

              if(itemToken.symbol == 'PANDA'){
                itemToken.decimals = 9;
              }

              if(itemToken.symbol == 'FLOOF'){
                itemToken.decimals = 1;
              }

            const token = Object.values(TOKENS).find((item) => item.mintAddress === itemToken.address)
            if (!token) {// + itemToken.address + 'solana'
              let key = POP_TOKENS[itemToken.address] ?? itemToken.address
              let wt = '';
              if(itemToken.extensions && itemToken.extensions.twitter){
                wt = itemToken.extensions.twitter;
              }

              TOKENS[key] = {
                symbol: itemToken.symbol,
                name: itemToken.name,
                mintAddress: itemToken.address,
                decimals: itemToken.decimals,
                twitter: wt,
                picUrl: itemToken.logoURI,
                tags: ['solana']
              }

              if(itemToken.extensions){
                TOKENS[key].twitter = itemToken.extensions.twitter
              }

            } else {
              token.picUrl = itemToken.logoURI

              if (token.symbol !== itemToken.symbol && !token.tags.includes('cropper')) {
                let wt = '';
                if(itemToken.extensions && itemToken.extensions.twitter){
                  wt = itemToken.extensions.twitter;
                }
                token.symbol = itemToken.symbol
                token.name = itemToken.name
                token.mintAddress = itemToken.address
                token.decimals = itemToken.decimals
                token.twitter = wt
                token.tags.push('solana')
              }

              if(itemToken.extensions){
                token.twitter = itemToken.extensions.twitter
              }

            }

            
          })
          TOKENS['WSOL'] = cloneDeep(WRAPPED_SOL)
          window.localStorage.token_last_updated_ = new Date().getTime()
          window.localStorage.tokens = JSON.stringify(TOKENS)
        }

      }

      window.localStorage.tokensLoading = 0

      logger('Token list updated - ' + need_to_update + ' | ' + (new Date().getTime() - cur_date))
      commit('setInitialized')
      commit('setLoading', false)
    }
  }
)
