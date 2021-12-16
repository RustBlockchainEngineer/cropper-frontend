<template>
  <Modal
    v-if="!showSelectSourceFlag"
    :closable="false"
    :visible="true"
    :footer="null"
    @cancel="$emit('onClose')"
    class="coin-select-modal"
  >
    <div class="select-token-header fs-container">
      <label class="textL weightB">Select a token</label>
      <img class="icon-cursor" src="@/assets/icons/close-circle-icon.svg" @click="$emit('onClose')"/>
    </div>
    <div class="select-token-search">
      <input ref="userInput" v-model="keyword" class="textM" placeholder="Search name or paste address" />
      <!-- <div v-if="!addUserCoin" class="sort fs-container">
        <span class="title">Token name</span>
        <Icon :type="desc ? 'arrow-up' : 'arrow-down'" @click="setDesc" />
      </div> -->
      <div class="common-bases">
        <label class="textM">Common bases</label>
        <div class="common-bases-group">
          <div v-for="common in commonBases" :key="common.symbol" class="common-select-container icon-cursor" @click="selectCommonToken(common)">
            <div class="common-box fc-container">
              <CoinIcon class="coin-icon" :mint-address="common.mintAddress" />
              {{ common.symbol }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="select-token">
      <div v-if="!addUserCoin" class="token-list">
        <template v-for="token of filteredTokenList()">
          <div
            v-if="token.cache !== true && token.mintAddress !== 'So11111111111111111111111111111111111111112'"
            :key="token.symbol + token.mintAddress"
            class="token-info"
            @click="$emit('onSelect', token)"
            @mouseenter="tokenHover(token)"
            @mouseleave="tokenMove(token)"
          >
            <CoinIcon :mint-address="token.mintAddress" />
            <div class="token-group">
              <span class="token-symbol textS weightS">{{ token.symbol }}</span>
              <span class="token-name bodyXS">{{ token.name }}</span>
            </div>
            <div class="balance">
              <div v-if="wallet.loading">
                <Icon type="loading" />
              </div>
              <div v-else-if="token.tokenAccountAddress">
                {{ token.balance.toEther() }}
              </div>
              <div v-else></div>
            </div>
          </div>
        </template>
      </div>
      <div v-if="addUserCoin" class="sort fs-container">
        <span class="title">Create a name for this token</span>
        <Icon :type="desc ? 'arrow-up' : 'arrow-down'" @click="setDesc" />
      </div>
      <div v-if="addUserCoin" class="token-list">
        <div><input v-model="userInputCoinName" placeholder="Input Name" style="width: 100%; height: 10px" /></div>
        <div style="margin: 5px 0">
          Located from mint address
          <button
            style="
              margin: 0 10px;
              color: rgb(90, 196, 190);
              background-color: transparent;
              outline: none;
              padding: 0;
              border: 0 solid transparent;
            "
            @click="addUserMintToLocal"
          >
            (Add To Attention)
          </button>
        </div>
      </div>
    </div>
  </Modal>
  <CoinSelectSource v-else @onClose="() => (showSelectSourceFlag = false)" />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Modal, Icon } from 'ant-design-vue'

import { TOKENS, TokenInfo, NATIVE_SOL, TOKENS_TAGS } from '@/utils/tokens'
import { cloneDeep } from 'lodash-es'
import { PublicKey } from '@solana/web3.js'
// import { getFilteredProgramAccounts } from '@/utils/web3'
import { MINT_LAYOUT } from '@/utils/layouts'
import { ALLOWED_TOKENB_LIST, LOCKED_TOKENA_LIST } from '@/utils/farm'

// fix: Failed to resolve directive: ant-portal
Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Icon
  },
  props: {
    farmTokenASelect: {
      type: Boolean,
      default: false
    },
    allowedAllFarm: {
      type: Boolean,
      default: false
    },
    farmTokenBSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tokensTags: TOKENS_TAGS,
      keyword: '',
      tokenList: [] as Array<TokenInfo>,
      desc: false,
      addUserCoin: false,
      addUserCoinToken: null as any | null,
      userInputCoinName: undefined,
      showSelectSourceFlag: false,
      showUserButton: {} as { [key: string]: boolean },
      commonBases: [
        {
          mintAddress: "DubwWZNWiNGMMeeQHPnMATNj77YZPZSAz2WVR5WjLJqz",
          symbol: "CRP"
        },
        {
          mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          symbol: "USDC"
        }
      ] as any
    }
  },

  computed: {
    ...mapState(['wallet', 'liquidity'])
  },

  watch: {
    keyword(newKeyword) {
      this.createTokenList(newKeyword)
      this.findMint(newKeyword)
    },

    'wallet.tokenAccounts': {
      handler(_newTokenAccounts: any, _oldTokenAccounts: any) {
        this.createTokenList()
      },
      deep: true
    },

    tokensTags: {
      handler(_newTokenAccounts: any, _oldTokenAccounts: any) {
        this.createTokenList(this.keyword)
        this.findMint(this.keyword)
      },
      deep: true
    },
    'liquidity.initialized': {
      handler(_newTokenAccounts: any, _oldTokenAccounts: any) {
        this.createTokenList(this.keyword)
        this.findMint(this.keyword)
      },
      deep: true
    }
  },

  mounted() {
    this.createTokenList()
    this.$nextTick(function () {
      // @ts-ignore
      this.$refs.userInput.focus()
    })
  },

  methods: {
    selectCommonToken(common: any) {
      let selectedToken = this.tokenList.find((token) => token.symbol === common.symbol)
      console.log(selectedToken)
      this.$emit('onSelect', selectedToken);
    },
    filteredTokenList() {
      let filteredList: TokenInfo[] = []
      if (this.farmTokenASelect && !this.allowedAllFarm) {
        filteredList = this.tokenList.filter((token) => {
          if (LOCKED_TOKENA_LIST.includes(token.symbol)) {
            return false
          } else {
            return true
          }
        })
      } else if (this.farmTokenBSelect) {
        filteredList = this.tokenList.filter((token) => {
          if (ALLOWED_TOKENB_LIST.includes(token.symbol)) {
            return true
          }
        })
      } else {
        filteredList = this.tokenList
      }
      return filteredList
    },
    tokenHover(token: any) {
      this.$set(this.showUserButton, token.symbol + token.mintAddress, true)
    },
    tokenMove(token: any) {
      this.$set(this.showUserButton, token.symbol + token.mintAddress, false)
    },
    addCoinToAttention(token: any) {
      if (token.mintAddress === NATIVE_SOL.mintAddress) {
        NATIVE_SOL.tags.push('userAdd')
      }
      if (TOKENS[token.key] && !TOKENS[token.key].tags.includes('userAdd')) {
        TOKENS[token.key].tags.push('userAdd')
      }
      if (window.localStorage.addSolanaCoin) {
        window.localStorage.addSolanaCoin = window.localStorage.addSolanaCoin + '---' + token.mintAddress
      } else {
        window.localStorage.addSolanaCoin = token.mintAddress
      }
      this.createTokenList(this.keyword)
      this.findMint(this.keyword)
    },
    delCoinToAttention(token: any) {
      if (window.localStorage.addSolanaCoin) {
        window.localStorage.addSolanaCoin = window.localStorage.addSolanaCoin
          .split('---')
          .filter((item: any) => item !== token.mintAddress)
          .join('---')
      }
      this.delUserMintToLocal(token.mintAddress)

      if (TOKENS[token.key] && TOKENS[token.key].tags.includes('userAdd')) {
        this.delTags(TOKENS[token.key], 'userAdd')
      }
      if (NATIVE_SOL.mintAddress === token.mintAddress && NATIVE_SOL.tags.includes('userAdd')) {
        this.delTags(NATIVE_SOL, 'userAdd')
      }
      this.createTokenList(this.keyword)
      this.findMint(this.keyword)
    },

    delTags(token: any, key: string) {
      const indexItem = token.tags.indexOf(key)
      if (indexItem === 0) {
        token.tags = token.tags.splice(1, token.tags.length - 1)
      } else if (indexItem > 0) {
        token.tags = [
          ...token.tags.splice(0, indexItem),
          ...token.tags.splice(indexItem + 1, token.tags.length - indexItem - 1)
        ]
      }
      if (token.tags.length === 0) {
        token.cache = true
        token.symbol = 'unknown'
        token.name = 'unknown'

        window.localStorage.pool_last_updated = 0
      }
    },

    delUserMintToLocal(mintAddress: string) {
      // LOCAL
      const localMintStr = window.localStorage.user_add_coin_mint ?? ''
      const localMintList = localMintStr.split('---')
      const newMintList = []
      for (let index = 0; index < Math.floor(localMintList.length); index += 1) {
        if (
          localMintList[index * 3 + 1] !== '' &&
          localMintList[index * 3 + 1] !== undefined &&
          localMintList[index * 3 + 1] !== mintAddress
        ) {
          newMintList.push(localMintList[index * 3 + 0], localMintList[index * 3 + 1], localMintList[index * 3 + 2])
        }
      }
      window.localStorage.user_add_coin_mint = newMintList.join('---')
    },

    addUserMintToLocal() {
      if (this.userInputCoinName === undefined) {
        this.$notify.warning({
          message: 'Please enter name',
          description: ''
        })
      } else if (Object.values(TOKENS).find((item: any) => item.symbol === this.userInputCoinName)) {
        this.$notify.warning({
          message: 'Duplicate name',
          description: ''
        })
      } else if (this.addUserCoinToken !== null) {
        const key = Object.keys(TOKENS).find((item) => TOKENS[item].mintAddress === this.keyword)
        if (key === undefined) {
          return
        }
        TOKENS[key].name = this.userInputCoinName
        TOKENS[key].symbol = this.userInputCoinName
        TOKENS[key].cache = false
        TOKENS[key].tags.push('userAdd')

        const userAddCoinMintLocal = window.localStorage.user_add_coin_mint ?? ''
        let userAddCoinMintLocalArray = userAddCoinMintLocal.split('---')
        if (userAddCoinMintLocalArray.length % 3 === 0) {
          userAddCoinMintLocalArray.push(
            this.userInputCoinName ?? '',
            this.addUserCoinToken.mintAddress,
            this.addUserCoinToken.decimals
          )
        } else {
          userAddCoinMintLocalArray = [
            this.userInputCoinName ?? '',
            this.addUserCoinToken.mintAddress,
            this.addUserCoinToken.decimals
          ]
        }
        window.localStorage.user_add_coin_mint = userAddCoinMintLocalArray.join('---')

        this.keyword = this.userInputCoinName ?? ''
      }
      this.$accessor.liquidity.requestInfos()
      this.createTokenList(this.keyword)
      this.findMint(this.keyword)
    },

    async findMint(keyword = '') {
      if (keyword.length > 40) {
        const hasTokenKey = Object.keys(TOKENS).find(
          (item) => TOKENS[item].mintAddress === keyword && TOKENS[item].cache === true
        )
        if (hasTokenKey) {
          this.addUserCoinToken = { ...TOKENS[hasTokenKey], key: hasTokenKey }
          this.addUserCoin = true
        } else {
          try {
            const acc = await this.$web3.getAccountInfo(new PublicKey(keyword))
            if (acc != null) {
              const mint = MINT_LAYOUT.decode(acc.data)
              if (mint.initialized === true && this.tokenList.length === 0) {
                TOKENS[this.keyword + 'userSearch'] = {
                  symbol: 'unknown',
                  name: 'unknown',
                  mintAddress: this.keyword,
                  decimals: mint.decimals,
                  cache: true,
                  tags: []
                }
                this.addUserCoinToken = { ...TOKENS[this.keyword + 'userSearch'], key: this.keyword + 'userSearch' }
                this.addUserCoin = true
              } else {
                this.addUserCoin = false
              }
            }
          } catch (error) {
            this.addUserCoin = false
          }
        }
      } else {
        this.addUserCoin = false
      }
    },

    createTokenList(keyword = '') {
      keyword = keyword.trim()
      let tokenList = []

      let crp = {}
      let nativeSol = cloneDeep(NATIVE_SOL)

      let hasBalance = []
      let noBalance = []

      for (const symbol of Object.keys(TOKENS)) {
        let tokenInfo = cloneDeep(TOKENS[symbol])
        const tokenAccount = this.wallet.tokenAccounts[tokenInfo.mintAddress]

        if (tokenAccount) {
          tokenInfo = { ...tokenInfo, ...tokenAccount, key: symbol }

          if (tokenInfo.symbol === 'CRP') {
            crp = cloneDeep({ ...tokenInfo, key: symbol })
          } else {
            hasBalance.push({ ...tokenInfo, key: symbol })
          }
        } else if (tokenInfo.symbol === 'CRP') {
          crp = cloneDeep({ ...tokenInfo, key: symbol })
        } else {
          noBalance.push({ ...tokenInfo, key: symbol })
        }
      }

      const solAccount = this.wallet.tokenAccounts[NATIVE_SOL.mintAddress]

      if (solAccount) {
        nativeSol = { ...nativeSol, ...solAccount }
      }

      // balance sort
      hasBalance = hasBalance.sort((a, b) => {
        return b.balance.toEther() - a.balance.toEther()
      })

      // no balance sort
      noBalance = noBalance.sort((a, b) => {
        return a.symbol.localeCompare(b.symbol)
      })

      if (!this.desc) {
        tokenList = [...[crp, nativeSol], ...hasBalance, ...noBalance]
      } else {
        tokenList = [...[crp, nativeSol], ...noBalance.reverse(), ...hasBalance]
      }

      if (keyword) {
        tokenList = tokenList.filter(
          (token) => token.symbol.toUpperCase().includes(keyword.toUpperCase()) || token.mintAddress === keyword
        )
      }
      const showTagsList: string[] = []
      for (const [itemTagsName, itemTagsValue] of Object.entries(TOKENS_TAGS)) {
        if (itemTagsValue.show) {
          showTagsList.push(itemTagsName)
        }
      }

      const showToken = []
      for (const item of tokenList) {
        const showFlag = item.tags
          ? item.tags.filter((itemTags: string) => (showTagsList.includes(itemTags) ? 1 : null)).length > 0 ||
            item.mintAddress === this.keyword
          : false

        if (showFlag) {
          showToken.push(item)
        }
      }
      this.tokenList = cloneDeep(showToken)
    },

    setDesc() {
      this.desc = !this.desc
      this.createTokenList()
    }
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables';

.select-token-header {
  margin-bottom: 10px;
  padding: 0 15px;
}

.select-token-search {
  padding: 0 15px;

  input {
    border: 1px solid #6574D6;
    border-radius: 8px;
    padding: 8px 18px;
    background-color: transparent;
    color: #CCD1F1;
    width: 100%;

    &:active,
    &:focus,
    &:hover {
      outline: 0;
    }

    &::placeholder {
      color: #CCD1F1;
    }
  }

  // .sort {
  //   .title {
  //     font-size: 14px;
  //     line-height: 36px;
  //     font-weight: 400;
  //   }

  //   @media @max-sl-mobile {
  //     display: none;
  //   }
  // }

  .common-bases {
    margin-top: 8px;
    margin-bottom: 18px;

    .common-bases-group {
      display: flex;
      margin-top: 8px;

      .common-select-container {
        background: linear-gradient(97.63deg, #280C86 -29.92%, #22B5B6 103.89%);
        border-radius: 8px;
        padding: 2px;
        margin-right: 8px;

        &:last-child {
          margin-right: 0;
        }

        .common-box {
          background: @color-bg;
          border-radius: 8px;
          padding: 8px;

          .coin-icon {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}

.select-token {
  display: grid;
  grid-auto-rows: auto;
  row-gap: 14px;
  background: @color-bg;

  .token-list {
    max-height: 50vh;
    overflow: auto;
    direction: ltr;
    will-change: transform;

    .token-info {
      display: grid;
      justify-content: space-between;
      align-items: center;
      padding: 12.5px 25px;
      gap: 9px;
      grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
      border-bottom: 1px solid #0F1757;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      img {
        border-radius: 50%;
        height: 24px;
        width: 24px;
      }

      .token-group {
        .token-symbol {
          display: block;
          letter-spacing: 0.5px;
        }

        .token-name {
          color: #CCD1F1;
        }
      }
      .balance {
        justify-self: flex-end;
        width: fit-content;

        div {
          white-space: nowrap;
          overflow: hidden;
          max-width: 5rem;
          text-overflow: ellipsis;
        }
      }
    }

    .token-info[disabled] {
      cursor: not-allowed;
      // pointer-events: none;
      opacity: 0.5;
    }
  }
}
</style>
<style lang="less">
.coin-select-modal .ant-modal{
  .ant-modal-content {
    background: @color-blue700;
    border: 3px solid #273592;
    box-sizing: border-box;
    border-radius: 18px;
    padding: 10px 0 18px 0;

    .ant-modal-body {
      padding: 0 !important;
    }
  }
}
</style>