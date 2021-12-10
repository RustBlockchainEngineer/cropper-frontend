<template>
  <div class="wallet">
    <div class="wallet-btn">
      <div class="btncontainer" :class="!wallet.connected ? 'unconnected' : 'connected'" v-if="!wallet.connected" ghost @click="openPopIn">
        <Button>
          <img src="@/assets/icons/wallet.svg" style="margin: 0 10px" />
          Connect wallet
        </Button>
      </div>

      <div class="btncontainer" :class="!wallet.connected ? 'unconnected' : 'connected'" v-else ghost @click="$accessor.wallet.openModal">
        <Button>
          <img src="@/assets/icons/wallet.svg" style="margin: 0 10px" />
          {{ wallet.address.substr(0, 4) }}
          ...
          {{ wallet.address.substr(wallet.address.length - 4, 4) }}
        </Button>
      </div>

      <a v-if="wallet.connected" :href="this.sonarUrl" target="_blank" class="sonar-container">
        <div class="btncontainer sonar connected" ghost>
          <Button>
            <img src="@/assets/icons/sonar-watch.svg"/>
          </Button>
        </div>
        <div class="sonar-dashboard">
          My dashboard
        </div>
      </a>

      <Modal
        :title="!wallet.connected ? 'Connect to a wallet' : 'Your wallet'"
        :visible="wallet.modalShow && isModal"
        :footer="null"
        centered
        @cancel="$accessor.wallet.closeModal"
      >
        <div v-if="!wallet.connected" class="select-wallet">
          <Button v-for="(info, name) in wallets" :key="name" ghost @click="connect(name, info)">
            <img :src="importIcon(`/wallets/${name.replace(' ', '-').toLowerCase()}.png`)" />
            <span>{{ name }}</span>
          </Button>
        </div>
        <div v-else class="wallet-info">
          <p class="address">{{ wallet.address }}</p>

          <div class="stdGradientButton">
            <Button ghost @click="disconnect"> DISCONNECT </Button>
          </div>
        </div>
      </Modal>
    </div>
    
    <div v-if="!wallet.connected && popIn" class="wallet-list" v-click-outside="outPopIn">
      <div class="select-wallet-header">
        <div class="select-wallet-header-title">
          <b>Connect wallet</b>
        </div>
        <div class="select-wallet-header-close">
          <img src="@/assets/icons/close-icon.svg" @click="closePopIn" />
        </div>
      </div>

      <div v-if="!wallet.connected" class="select-wallet">
        <Button v-for="(info, name) in wallets" :key="name" ghost @click="connect(name, info)">
          <img :src="importIcon(`/wallets/${name.replace(' ', '-').toLowerCase()}.png`)" />
          <span>{{ name }}</span>
        </Button>
      </div>
      <div v-else class="wallet-info">
        <p class="address">{{ wallet.address }}</p>

        <div class="stdGradientButton">
          <Button ghost @click="disconnect"> DISCONNECT </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Button, Modal, Icon } from 'ant-design-vue'
import {
  AccountInfo,
  Context
  // PublicKey
} from '@solana/web3.js'

import importIcon from '@/utils/import-icon'
import logger from '@/utils/logger'
import { commitment } from '@/utils/web3'
import LocalStorage from '@/utils/local-storage'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolongWalletAdapter } from '@solana/wallet-adapter-solong'
import { MathWalletWalletAdapter } from '@solana/wallet-adapter-mathwallet'
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet'
import { LedgerWalletAdapter, getDerivationPath } from '@solana/wallet-adapter-ledger'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { Coin98WalletAdapter } from '@solana/wallet-adapter-coin98'
import { SlopeWalletAdapter } from '@solana/wallet-adapter-slope'
import { SafePalWalletAdapter } from '@solana/wallet-adapter-safepal'
//import { BloctoWalletAdapter } from '@solana/wallet-adapter-blocto'
//import { BitpieWalletAdapter } from '@solana/wallet-adapter-bitpie'
import {
    // getLedgerWallet,
    // getPhantomWallet,
    // getSlopeWallet,
    // getSolflareWallet,
    getSolletExtensionWallet,
    // getSolletWallet,
    // getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
// import { TorusWalletAdapter } from '@solana/wallet-adapter-torus'
const Vco = require('v-click-outside')
const network = WalletAdapterNetwork.Devnet;

// fix: Failed to resolve directive: ant-portal
Vue.use(Modal)
Vue.use(Vco)

interface WalletInfo {
  // official website
  website: string
  // provider url for web wallet
  providerUrl?: string
  // chrome extension install url
  chromeUrl?: string
  // firefox extension install url
  firefoxUrl?: string
  // isExtension: boolean
  getAdapter: (providerUrl?: string) => WalletAdapter
}

@Component({
  components: {
    Button,
    Modal,
    Icon
  }
})

export default class Wallet extends Vue {
  /* ========== DATA ========== */
  // TrustWallet ezDeFi
  wallets: { [key: string]: WalletInfo } = {
    Phantom: {
      website: 'https://phantom.app',
      chromeUrl: 'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
      getAdapter() {
        return new PhantomWalletAdapter()
      }
    },
    'Solflare Extension': {
      website: 'https://solflare.com',
      firefoxUrl: 'https://addons.mozilla.org/en-US/firefox/addon/solflare-wallet',
      getAdapter() {
        return new SolflareWalletAdapter()
      }
    },
    'Sollet Web': {
      website: 'https://www.sollet.io',
      providerUrl: 'https://www.sollet.io',
      getAdapter(providerUrl) {
        return new SolletWalletAdapter({ provider: providerUrl })
      }
    },
    'Sollet Extension': {
      website: '',
      chromeUrl: 'https://chrome.google.com/webstore/detail/sollet/fhmfendgdocmcbmfikdcogofphimnkno',
      getAdapter() {
                return getSolletExtensionWallet().adapter();
      }
    },
    Ledger: {
      website: 'https://www.ledger.com',
      getAdapter() {
        return new LedgerWalletAdapter({ derivationPath: getDerivationPath() })
      }
    },
    MathWallet: {
      website: 'https://mathwallet.org',
      chromeUrl: 'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc',
      getAdapter() {
        return new MathWalletWalletAdapter()
      }
    },
    Solong: {
      website: 'https://solongwallet.com',
      chromeUrl: 'https://chrome.google.com/webstore/detail/solong/memijejgibaodndkimcclfapfladdchj',
      getAdapter() {
        return new SolongWalletAdapter()
      }
    },
    Coin98: {
      website: 'https://www.coin98.com',
      chromeUrl: 'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
      getAdapter() {
        return new Coin98WalletAdapter()
      }
    },
    /* Blocto: {
      website: 'https://blocto.portto.io',
      getAdapter() {
        return new BloctoWalletAdapter()
      }
    }, */
    Safepal: {
      website: 'https://safepal.io',
      getAdapter() {
        return new SafePalWalletAdapter()
      }
    },
    Slope: {
      website: 'https://slope.finance',
      chromeUrl: 'https://chrome.google.com/webstore/detail/slope-finance-wallet/pocmplpaccanhmnllbbkpgfliimjljgo',

      //@ts-ignore
      getAdapter() {
        return new SlopeWalletAdapter()
      }
    },
    /*
    Bitpie: {
      website: 'https://bitpie.com',
      getAdapter() {
        return new BitpieWalletAdapter()
      }
    },
    */
    // Torus: {
    //   website: 'https://tor.us',
    //   getAdapter() {
    //     return new TorusWalletAdapter({
    //       options: {
    //         clientId: ''
    //       }
    //     })
    //   }
    // },
    'Solflare Web': {
      website: 'https://solflare.com',
      providerUrl: 'https://solflare.com/access-wallet',
      getAdapter(providerUrl) {
        return new SolletWalletAdapter({ provider: providerUrl })
      }
    }
  }

  connectingWallet = {
    name: null as string | null,
    adapter: null as WalletAdapter | null
  }

  // autoConnect
  lastWalletName = LocalStorage.get('WALLET_NAME')

  sonarUrl: any = ''

  // auto refresh
  walletTimer: number | undefined = undefined
  priceTimer: number | undefined = undefined
  liquidityTimer: number | undefined = undefined
  farmTimer: number | undefined = undefined
  idoTimer: number | undefined = undefined
  // web3 listener
  walletListenerId = null as number | null

  debugCount = 0

  popIn = false as boolean
  isModal = true as boolean
  /* ========== COMPUTED ========== */
  get wallet() {
    return this.$accessor.wallet
  }

  get price() {
    return this.$accessor.price
  }

  get liquidity() {
    return this.$accessor.liquidity
  }

  get farm() {
    return this.$accessor.farm
  }

  get ido() {
    return this.$accessor.ido
  }

  // history
  get historyList() {
    const rawList = Object.entries(this.$accessor.transaction.history[this.$accessor.wallet.address] ?? {}).map(
      ([txid, txInfo]) => ({
        ...(txInfo as any),
        txid
      })
    )
    return rawList.sort((a, b) => {
      return (b.time || b.t) - (a.time || a.t)
    })
  }

  /* ========== LIFECYCLE ========== */
  async beforeMount() {
    await this.$accessor.token.loadTokens()
    await this.$accessor.price.requestPrices()
    await this.$accessor.liquidity.requestInfos()
    await this.$accessor.swap.getMarkets()
    await this.$accessor.farm.requestInfos()

    this.setWalletTimer()
    this.setPriceTimer()
    this.setLiquidityTimer()
    this.setFarmTimer()
    this.setIdoTimer()
  }

  mounted() {
    this.autoConnect()
  }

  beforeDestroy() {
    window.clearInterval(this.walletTimer)
    window.clearInterval(this.priceTimer)
    window.clearInterval(this.liquidityTimer)
    window.clearInterval(this.farmTimer)
    window.clearInterval(this.idoTimer)
  }

  /* ========== WATCH ========== */

  /* ========== METHODS ========== */
  importIcon = importIcon

  autoConnect() {
    const name = this.lastWalletName
    if (name && !this.$accessor.wallet.connected) {
      const info = this.wallets[name]
      if (info) {
        this.connect(name, info)
      }
    }
  }

  onConnect() {
    const { name, adapter } = this.connectingWallet


    this.$accessor.wallet.closeModal().then(() => {
      if (adapter && adapter.publicKey) {
        // mock wallet
        // const address = new PublicKey('')
        // Vue.prototype.$wallet = {
        //   connected: true,
        //   publicKey: address,
        //   signTransaction: (transaction: any) => {
        //     console.log(transaction)
        //   }
        // }
        // this.$accessor.wallet.setConnected(address.toBase58())

        Vue.prototype.$wallet = adapter
        this.$accessor.wallet.setConnected(adapter.publicKey.toBase58())

        this.subWallet()
        this.$notify.success({
          message: 'Wallet connected',
          description: `Connect to ${name}`
        })

        LocalStorage.set('WALLET_NAME', name)
      }
    })

    this.isModal = true
  }

  onDisconnect() {
    this.disconnect()
  }

  disconnect() {
    this.connectingWallet = {
      name: null,
      adapter: null
    }

    try {
      Vue.prototype.$wallet.disconnect()
    } catch (error) {}

    Vue.prototype.$wallet = null

    this.unsubWallet()

    this.$accessor.wallet.setDisconnected()
    this.$notify.warning({
      message: 'Wallet disconnected',
      description: ''
    })

    this.isModal = false
  }

  onWalletError(error: Error) {
    const { name } = this.connectingWallet

    if (name) {
      const info = this.wallets[name]

      if (info) {
        const { website, chromeUrl, firefoxUrl } = info

        if (['WalletNotFoundError', 'WalletNotInstalledError', 'WalletNotReadyError'].includes(error.name)) {
          const errorName = error.name
            .replace('Error', '')
            .split(/(?=[A-Z])/g)
            .join(' ')

          this.$notify.error({
            message: errorName,
            description: (h: any) => {
              const msg = [
                `Please install and initialize ${name} wallet extension first, `,
                h('a', { attrs: { href: website, target: '_blank' } }, 'click here to visit official website')
              ]

              if (chromeUrl || firefoxUrl) {
                const installUrl = /Firefox/.test(navigator.userAgent) ? firefoxUrl : chromeUrl
                if (installUrl) {
                  msg.push(' or ')
                  msg.push(h('a', { attrs: { href: installUrl, target: '_blank' } }, 'click here to install extension'))
                }
              }

              return h('div', msg)
            }
          })

          return
        }
      }
    }

    if (['SecurityError'].includes(error.name)) {
      this.onConnect()
      return
    }

    this.$notify.error({
      message: 'Connect wallet failed',
      description: `${error.name}`
    })
  }

  connect(name: string, wallet: WalletInfo) {
    const { providerUrl } = wallet

    const adapter = wallet.getAdapter(providerUrl)

    if (adapter) {
      // adapter.on('ready', onReady)
      adapter.on('connect', this.onConnect)
      adapter.on('disconnect', this.onDisconnect)
      adapter.on('error', this.onWalletError)

      this.connectingWallet = {
        name,
        adapter
      }

      adapter.connect()

      return () => {
        // adapter.off('ready', onReady)
        adapter.off('connect', this.onConnect)
        adapter.off('disconnect', this.onDisconnect)
        adapter.off('error', this.onWalletError)
      }
    }
  }

  onWalletChange(_accountInfo: AccountInfo<Buffer>, context: Context): void {
    logger('onAccountChange')

    const { slot } = context

    if (slot !== this.wallet.lastSubBlock) {
      this.$accessor.wallet.setLastSubBlock(slot)
      this.$accessor.wallet.getTokenAccounts()
      this.$accessor.farm.getStakeAccounts()
      this.$accessor.ido.requestInfos()
    }
  }

  subWallet() {
    const wallet = this.$wallet
    if (wallet && wallet.publicKey) {
      this.walletListenerId = this.$web3.onAccountChange(wallet.publicKey, this.onWalletChange, commitment)

      this.$accessor.wallet.getTokenAccounts()
      this.$accessor.farm.getStakeAccounts()
      this.$accessor.ido.requestInfos()
    }
  }

  unsubWallet() {
    if (this.walletListenerId) {
      this.$web3.removeAccountChangeListener(this.walletListenerId)
    }
  }

  debug() {
    if (this.debugCount < 10) {
      this.debugCount += 1
    } else {
      this.$router.push({ path: '/debug/' })
      this.debugCount = 0
    }
  }

  setWalletTimer() {
    this.walletTimer = window.setInterval(async () => {
      if (this.wallet.connected && !this.wallet.loading) {
        // vuex is connected but $wallet not, meaning window closed
        if (this.$wallet && this.$wallet.connected) {
          if (this.wallet.countdown < this.wallet.autoRefreshTime) {
            this.$accessor.wallet.setCountdown(this.$accessor.wallet.countdown + 1)
            if (this.wallet.countdown === this.wallet.autoRefreshTime) {
              await this.$accessor.wallet.getTokenAccounts() 
            }
          }
        } else {
          this.disconnect()
        }
      }

      this.sonarUrl = 'https://sonar.watch/dashboard/' + this.wallet.address;
    }, 1000)
  }

  setPriceTimer() {
    this.priceTimer = window.setInterval(async () => {
      if (!this.price.loading) {
        if (this.price.countdown < this.price.autoRefreshTime) {
          this.$accessor.price.setCountdown(this.$accessor.price.countdown + 1)
          if (this.price.countdown === this.price.autoRefreshTime) {
            await this.$accessor.price.requestPrices()
          }
        }
      }
    }, 1000)
  }

  setLiquidityTimer() {
    this.liquidityTimer = window.setInterval(async () => {
      if (!this.liquidity.loading) {
        if (this.liquidity.countdown < this.liquidity.autoRefreshTime) {
          this.$accessor.liquidity.setCountdown(this.$accessor.liquidity.countdown + 1)
          if (this.liquidity.countdown === this.liquidity.autoRefreshTime) {
            await this.$accessor.liquidity.requestInfos()
          }
        }
      }
    }, 1000)
  }

  setFarmTimer() {
    this.farmTimer = window.setInterval(async () => {
      if (!this.farm.loading) {
        if (this.farm.countdown < this.farm.autoRefreshTime) {
          this.$accessor.farm.setCountdown(this.$accessor.farm.countdown + 1)
          if (this.farm.countdown === this.farm.autoRefreshTime) {
            await this.$accessor.farm.requestInfos()
          }
        }
      }
    }, 1000)
  }

  setIdoTimer() {
    this.idoTimer = window.setInterval(async () => {
      if (!this.ido.loading) {
        if (this.ido.countdown < this.ido.autoRefreshTime) {
          this.$accessor.ido.setCountdown(this.$accessor.ido.countdown + 1)
          if (this.ido.countdown === this.ido.autoRefreshTime) {
            await this.$accessor.ido.requestInfos()
          }
        }
      }
    }, 1000)
  }
  
  openPopIn() {
    this.popIn = true
  }
  
  closePopIn() {
    this.popIn = false
  }

  outPopIn() {
    this.popIn = false
  }
}
</script>

<style lang="less">
@import '../styles/variables';

.btncontainer {
  background: @gradient-color-primary;
  background-origin: border-box;
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;
  margin: auto;
  padding: 3px;
  border-radius: 63px;
  height: 50px;

  button {
    background: transparent;
    position: relative;
    border-radius: 63px;
    height: 100%;
    width: 100%;
    border-color: transparent;
    border: none;
    color: white !important;
  }

  @media @max-sm-mobile {
    height: 46px;
    top: 5px;
  }
}

.ant-modal-body {
  .select-wallet {
    button {
      border: none;
      background: rgba(255, 255, 255, 0.1) !important;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      width: 100%;
      height: 48px;
      text-align: left;
      margin-bottom: 10px;

      img {
        height: 32px;
        width: 32px;
        border-radius: 50%;
      }
    }
  }
}

.wallet-btn {
  display: inline-flex;
  align-items: center;
}

.wallet-list::before {
  content: ' ';
  height: 0;
  position: absolute;
  width: 0;
  right: 20px;
  top: -20px;
  border: 10px solid transparent;
  border-right-color: #3238EA;
  transform: rotate(90deg);
}

.wallet-list {
  position: absolute;
  right: 100px;
  margin-top: 10px;
  z-index: 999;
  background: @gradient-color-wallet;
  box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.5);
  border-radius: 10px;

  @media @max-sm-mobile {
    right: 20px;
  }
  
  .select-wallet {
    max-height: 460px;
    overflow-y: scroll;
    padding: 0 24px;

    @media @max-sm-mobile {
      max-height: 230px;
    }

    button {
      border: none;
      background: rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.4);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      width: 100%;
      height: 48px;
      text-align: left;
      margin-bottom: 10px;

      img {
        height: 32px;
        width: 32px;
        border-radius: 50%;
      }
    }
  }
  
  .select-wallet::-webkit-scrollbar {
    display: block !important; /* Chrome Safari */
  }

  .select-wallet-header {
    padding: 0 15px 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .select-wallet-header-title {
      font-size: 15px;
      line-height: 19px;
      color: #fff;
    }

    .select-wallet-header-close img{
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
}

.btncontainer.unconnected button{
  background: @color-bg;
}

.btncontainer.connected button{
  &:hover, &:focus {
    background: @color-bg;
  }
}
.btncontainer.unconnected button:hover,
.btncontainer.unconnected button:focus
{
  background: transparent;
}

</style>

<style lang="less" scoped>
.wallet-info {
  text-align: center;
}

.wallet-info .address {
  border-radius: 7px;
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 17px;
}

.sonar-container {
  .sonar-dashboard {
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid #fff;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 14px;
    line-height: 17px;
    font-weight: 400;
    color: #fff;
    position: absolute;
    right: 65px;
    margin-top: 10px;
    display: none;
  }

  .btncontainer.sonar {
    margin-left:20px !important;
    width: 50px;
    height: 50px;

    @media @max-sm-mobile {
      margin-left: 10px !important;
      width: 46px;
      height: 46px;
    }

    &:hover ~ .sonar-dashboard {
      display: block;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 26px;
      }
    }
  }

  @media @max-sm-mobile {
    display: none;
  }
}


.tx-history-panel {
  display: none;
  h2 {
    margin-top: 32px;
    text-align: left;
  }
  .tx-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .extra-info {
      font-size: 0.9em;
      opacity: 0.8;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      a {
        font-size: 1.2em;
      }

      .icon {
        margin-right: 8px;
      }
    }
    .extra-info.time {
      flex-shrink: 0;
    }
  }
}
</style>