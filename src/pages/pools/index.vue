<template>
  <div class="pool container">

    <CoinModalMulti
      v-if="stakeModalOpening"
      title="Add Liquidity"
      :loading="staking"
      :farmInfo="poolInf"
      @onOk="stake"
      @onCancel="cancelPoolAdd"
    />

    <CoinModal
      v-if="unstakeModalOpening"
      title="Remove Liquidity"
      :coin="lp"
      :loading="unstaking"
      @onOk="unstake"
      @onCancel="cancelUnstake"
    />

    <div class="card">
      <div class="card-body">
        <div class="page-head fs-container">
          <span class="title noMobile">
            Liquidity Pools
          </span>
          <span class="title noDesktop">
            Pools
          </span>
        </div>

        <div v-if="poolLoaded" class="noMobile pools-table">
          <Row class="pools-table-header">
            <Col class="header-column" span="5">  </Col>
            <Col class="header-column" span="2">
            </Col>
            <Col class="header-column" span="3">
            </Col>
            <Col class="header-column" span="3">
            </Col>
            <Col class="header-column" span="3">
            </Col>
            <Col class="header-column" span="2">
            </Col>
            <Col class="header-column" span="3">
            </Col>
            <Col class="header-column" span="3"></Col>
          </Row>

          <div class="pools-table-body">
            <Row class="pools-table-item" v-for="data in poolsShow" :key="data.lp_mint">
              <pre span="5">
    {
      "chainId": 101,
      "address": "{{data.lp_mint}}",
      "symbol": "{{ data.lp.coin.symbol }}/{{ data.lp.pc.symbol }}",
      "name": "Cropper LP token ({{ data.lp.coin.symbol }}/{{ data.lp.pc.symbol }})",
      "decimals": 8,
      "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2Da82KXrqcUnv9oRcoKKUYRWM2yjPesi31GmrgMjZZ6h/logo.png",
      "tags": [
        "lp-token"
      ],
      "extensions": {
        "twitter": "https://twitter.com/CropperFinance",
        "website": "https://cropper.finance/"
      }
    },</pre>

            </Row>
          </div>

        </div>


      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { get, cloneDeep } from 'lodash-es'
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import {
  Table,
  Radio,
  Tooltip,
  Collapse,
  Row,
  Col,
  Spin,
  Select,
  Button,
  Input,
  Icon,
  Pagination,
  Switch as Toggle
} from 'ant-design-vue'
import { getPoolByLpMintAddress, getAllCropperPools } from '@/utils/pools'
import { TokenAmount } from '@/utils/safe-math'
import { getBigNumber } from '@/utils/layouts'
import { addLiquidity, removeLiquidity } from '@/utils/liquidity'
import { LiquidityPoolInfo } from '@/utils/pools'
import { getUnixTs } from '@/utils'
import { DEVNET_MODE } from '../../utils/ids'
const CollapsePanel = Collapse.Panel
const RadioGroup = Radio.Group
const poolAdd = false
const RadioButton = Radio.Button
declare const window: any
@Component({
  head: {
    title: 'Cropper Finance Pools'
  },

  computed: {
    ...mapState([
      // 'wallet',
      'swap',
      'liquidity',
      'price',
      'url',
      'setting'
    ])
  },

  data() {
    return {
      isMobile: false,
      farms: [] as any,
      fromCoin: false,
      lpMintAddress: false,
      toCoin: false,
      poolAdd: false,
      totalCount: 110,
      pageSize: 50,
      TVL : 0,
  existing: [] as any,
      currentPage: 1
    }
  },

  components: {
    Table,
    Collapse,
    CollapsePanel,
    Row,
    Col,
    RadioGroup,
    RadioButton,
    Toggle,
    Tooltip,
    Button,
    Select,
    Input,
    Icon,
    Spin,
    Pagination
  },
  async asyncData({ $api }) {



    window.poolsDatas = {} as any

    try {
      window.poolsDatas = await fetch('https://api.cropper.finance/pools/').then((res) => res.json())
    } catch {
      window.poolsDatas = []
    } finally {
    }

    try {
      window.labelised = await fetch('https://api.cropper.finance/pool/').then((res) => res.json())
    } catch {
    } finally {
    }



    try {
      let git = await fetch('https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json').then((res) => res.json())

      window.gitDatas = git.tokens
    } catch {





    } finally {

    }




    const pools = getAllCropperPools()
    return { pools }
  }
})
export default class Pools extends Vue {
  poolCollapse: any = true
  showCollapse: any = []
  pools: any = []
  displayPoolID: any = 0
  poolsShow: any = []
  poolType: string = 'RaydiumPools'
  fromCoin: any = false
  staking: any = false
  lp: any = false
  TVL: any = 0

  gitDatas: any = []
  existing: any = []
  unstaking: any = false
  wallet: any = this.$accessor.wallet
  lpMintAddress: any = false
  stakeModalOpening: any = false
  unstakeModalOpening: any = false
  toCoin: any = false
  displayfilters: any = false
  poolAdd: any = false
  poolInf: any = false
  lptoken: any = false
  poolLoaded: any = false
  autoRefreshTime: number = 60
  countdown: number = 0
  timer: any = null
  timer_init: any = null
  loading: boolean = false
  stakedOnly: boolean = false
  searchButton = true
  searchName = ''
  totalCount = 110
  pageSize = 50
  currentPage = 1
  searchCertifiedFarm: boolean = false
  sortMethod: string = 'liquidity'
  sortLiquidityAsc: boolean = true
  sortVolHAsc: boolean = false
  sortVolDAsc: boolean = false
  sortFeesAsc: boolean = false
  sortAPYAsc: boolean = false
  sortCurrentAsc: boolean = false
  activeSpinning: boolean = false

  get liquidity() {
    this.$accessor.wallet.getTokenAccounts()
    return this.$accessor.liquidity
  }
  @Watch('$accessor.liquidity.initialized', { immediate: true, deep: true })
  refreshThePage() {
    this.showPool(this.searchName, this.stakedOnly, this.currentPage)
  }
  @Watch('showCollapse', { immediate: true, deep: true }) handler() {
    if (!this.poolType && this.showCollapse.length > 0) {
      this.showCollapse.splice(0, this.showCollapse.length)
    }
  }
  @Watch('$accessor.liquidity.info', { immediate: true, deep: true })
  async onLiquidityChanged() {
    this.pools = this.poolsFormated()
    this.showPool(this.searchName, this.stakedOnly, this.currentPage)
  }

  @Watch('currentPage', { immediate: true, deep: true })
  async onpageChange(newPage: number) {
    this.showPool(this.searchName, this.stakedOnly, newPage)
  }

  @Watch('stakedOnly', { immediate: true, deep: true })
  async onStckChange(newStakedOnly: any) {
    this.showPool(this.searchName, newStakedOnly)
  }

  @Watch('searchName', { immediate: true, deep: true })
  async onSearchChange(newSearchName: string) {
    this.showPool(newSearchName, this.stakedOnly)
  }
  @Watch('searchCertifiedFarm', { immediate: true, deep: true })
  selectHandler(newSearchCertifiedFarm: boolean = false) {
    this.pools = this.poolsFormated()
    this.showPool(this.searchName, this.stakedOnly, this.currentPage)
  }

  sortbyColumn(col: string) {
    this.sortMethod = col
    if (this.sortMethod == 'liquidity') {
      if (this.sortLiquidityAsc) {
        this.sortLiquidityAsc = false
      } else {
        this.sortLiquidityAsc = true
      }
    } else if (this.sortMethod == 'volh') {
      if (this.sortVolHAsc) {
        this.sortVolHAsc = false
      } else {
        this.sortVolHAsc = true
      }
    } else if (this.sortMethod == 'vold') {
      if (this.sortVolDAsc) {
        this.sortVolDAsc = false
      } else {
        this.sortVolDAsc = true
      }
    } else if (this.sortMethod == 'feesh') {
      if (this.sortFeesAsc) {
        this.sortFeesAsc = false
      } else {
        this.sortFeesAsc = true
      }
    } else if (this.sortMethod == 'apy') {
      if (this.sortAPYAsc) {
        this.sortAPYAsc = false
      } else {
        this.sortAPYAsc = true
      }
    } else if (this.sortMethod == 'yliquidity') {
      if (this.sortCurrentAsc) {
        this.sortCurrentAsc = false
      } else {
        this.sortCurrentAsc = true
      }
    }
    this.showPool(this.searchName, this.stakedOnly, this.currentPage)
  }

  showPool(searchName: any = '', stakedOnly: boolean = false, pageNum: any = 1) {
    const pool = []

    this.pools = this.poolsFormated()



    this.pools.sort(function (a: any, b: any) {
      return b.name - a.name
    })

    for (const item of this.pools) {
      pool.push(item)
    }
    this.poolsShow = pool

    if (
      searchName != '' &&
      this.poolsShow.filter((pool: any) => (pool.ammId as string).toLowerCase() == (searchName as string).toLowerCase())
        .length > 0
    ) {
      this.poolsShow = this.poolsShow.filter(
        (pool: any) => (pool.ammId as string).toLowerCase() == (searchName as string).toLowerCase()
      )
    } else if (searchName != '') {
      this.poolsShow = this.poolsShow.filter((pool: any) =>
        (pool.nameSymbol as string).toLowerCase().includes((searchName as string).toLowerCase())
      )
    }


    this.currentPage = pageNum

    this.totalCount = this.poolsShow.length

    let max = this.poolsShow.length
    let start = (this.currentPage - 1) * this.pageSize
    let end = this.currentPage * this.pageSize < max ? this.currentPage * this.pageSize : max
    this.poolsShow = this.poolsShow.slice(start, end)
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  openUnstakeModal(poolInfo: any, lp: any, lpBalance: any) {
    const coin = cloneDeep(lp)
    coin.balance = get(this.wallet.tokenAccounts, `${coin.mintAddress}.balance`)
    this.lp = coin

    this.poolInf = cloneDeep(poolInfo)

    this.unstakeModalOpening = true
  }

  cancelUnstake() {
    this.unstakeModalOpening = false
  }

  unstake(amount: string) {}

  stake(fromCoinAmount: string, toCoinAmount: string, fixedCoin: string) {}

  poolsFormated() {
    const conn = this.$web3
    const wallet = (this as any).$accessor.wallet
    const liquidity = (this as any).$accessor.liquidity
    const price = (this as any).$accessor.price

    const polo: any = []

    const existing: any = [];
    const existingAddresses: any = [];

    window.gitDatas.forEach(function (value: any) {
      existingAddresses[value.address] = 1;
      existingAddresses[value.name] = 1;
    });

    console.log(existingAddresses);


    getAllCropperPools().forEach(function (value: any) {
      const liquidityItem = get(liquidity.infos, value.lp_mint)
      console.log(
        window.gitDatas.filter((pool: any) => (pool.address) == (value.lp_mint))
          .length > 0)

      if (
        window.gitDatas.filter((pool: any) => (pool.address) == (value.lp_mint))
          .length > 0
      ) {

        console.log('continue');
        return;
      }


      if (!liquidityItem) {
        return
      }

      let lp = getPoolByLpMintAddress(value.lp_mint)

      //@ts-ignore
      if(lp.pc.symbol == 'unknown' || lp.coin.symbol == 'unknown'){
        return;
      }

      value.lp = lp
      let newCoin = 0
      let newPc = 0

      if (!price.prices[liquidityItem?.coin.symbol as string] && price.prices[liquidityItem?.pc.symbol as string]) {
        price.prices[liquidityItem?.coin.symbol as string] =
          (price.prices[liquidityItem?.pc.symbol as string] *
            getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther())) /
          getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther())
        newCoin = 1
      }

      if (!price.prices[liquidityItem?.pc.symbol as string] && price.prices[liquidityItem?.coin.symbol as string]) {
        price.prices[liquidityItem?.pc.symbol as string] =
          (price.prices[liquidityItem?.coin.symbol as string] *
            getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther())) /
          getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther())
        newPc = 1
      }

      const liquidityCoinValue =
        getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther()) *
        price.prices[liquidityItem?.coin.symbol as string]
      const liquidityPcValue =
        getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther()) *
        price.prices[liquidityItem?.pc.symbol as string]

      let liquidityTotalValue = liquidityPcValue + liquidityCoinValue;
      if(price.prices[liquidityItem?.pc.symbol as string] == 1){
         liquidityTotalValue = liquidityPcValue * 2
      }


      const liquidityTotalSupply = getBigNumber((liquidityItem?.lp.totalSupply as TokenAmount).toEther())
      const liquidityItemValue = liquidityTotalValue / liquidityTotalSupply

      value.liquidity = liquidityTotalValue

      //@ts-ignore
      value.name = lp.pc.symbol + lp.coin.symbol

      console.log(value.name, existing[value.name])

      if(existing[value.name]){
      console.log('in existing');
      return;
      }

      existing[value.name] = 1


      if(existingAddresses[value.name]){
        console.log('in existingAddresses');
        return;
      }




      if (!window.poolsDatas) {
        window.poolsDatas = {}
      }

      if (window.poolsDatas[value.ammId]) {
        value.volume_24h = 0
        if (
          window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress] &&
          window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress]['1day']
        ) {
          value.volume_24h +=
            window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress]['1day'] *
            price.prices[liquidityItem?.coin.symbol as string]
        }

        if (
          window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress] &&
          window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress]['1day']
        ) {
          value.volume_24h +=
            window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress]['1day'] *
            price.prices[liquidityItem?.pc.symbol as string]
        }

      } else {
        value.volume_24h = 0
      }

      if (window.poolsDatas[value.ammId]) {
        value.volume_7d = 0
        if (
          window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress] &&
          window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress]['7day']
        ) {
          value.volume_7d +=
            window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress]['7day'] *
            price.prices[liquidityItem?.coin.symbol as string]
        }

        if (
          window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress] &&
          window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress]['7day']
        ) {
          value.volume_7d +=
            window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress]['7day'] *
            price.prices[liquidityItem?.pc.symbol as string]
        }
      } else {
        value.volume_7d = 0
      }

      if (window.poolsDatas[value.ammId]) {
        value.fee_24h = value.volume_24h * 0.003
      } else {
        value.fee_24h = 0
      }

      if (window.poolsDatas[value.ammId]) {
        value.apy = (value.fee_24h * 365 * 100) / liquidityTotalValue
      } else {
        value.apy = 0
      }

      value.nameSymbol = value.coin1.symbol + ' - ' + value.coin2.symbol

      if (window.labelised.includes(value.ammId)) {
        value.labelized = 1
      }

      if (liquidityPcValue != 0 && liquidityCoinValue != 0) {
        if (wallet) {
          value.current = get(wallet.tokenAccounts, `${value.lp_mint}.balance`)
          if (value.current) {
            value.current = (value.current.wei.toNumber() / Math.pow(10, value.current.decimals)) * liquidityItemValue
          } else {
            value.current = 0
          }
        } else {
          value.current = 0
        }
        polo.push(value)
      }

    })
    return polo
  }

  openPoolAddModal(poolInfo: any) {
    if (!this.wallet.connected) {
      this.$accessor.wallet.openModal()
    } else {
      this.poolInf = cloneDeep(poolInfo)
      const coinBalance = get(this.wallet.tokenAccounts, `${this.poolInf.coin1.mintAddress}.balance`)
      const pcBalance = get(this.wallet.tokenAccounts, `${this.poolInf.coin2.mintAddress}.balance`)
      this.poolInf.lp.coin.balance = coinBalance
      this.poolInf.lp.pc.balance = pcBalance
      this.stakeModalOpening = true
    }
  }

  cancelPoolAdd() {
    this.fromCoin = null
    this.toCoin = null
    this.lptoken = null
    this.lpMintAddress = null
    this.stakeModalOpening = false
  }

  mounted() {
    this.getTvl();
    this.$accessor.token.loadTokens()
    this.timer_init = setInterval(async () => {
      if (!this.poolLoaded) {
        await this.flush()
        if (this.pools.length > 0) {
          var hash = window.location.hash
          if (hash) {
            hash = hash.substring(1)
            this.searchName = hash
          } else {
            const query = new URLSearchParams(window.location.search)
            if (query.get('s')) this.searchName = query.get('s') as string

            if (query.get('d')) this.displayPoolID = query.get('d') as string
          }

          this.poolLoaded = true
        }
      }
    }, 1000)
    this.setTimer()
  }

  setTimer() {


    this.timer = setInterval(async () => {
      if (!this.loading) {
        if (this.countdown < this.autoRefreshTime) {
          this.countdown += 1
          if (this.countdown === this.autoRefreshTime) {
            await this.flush()
          }
        }
      }
    }, 1000)
  }

  async getTvl(){


      let cur_date = new Date().getTime()
      if(window.localStorage.TVL_last_updated){
        const last_updated = parseInt(window.localStorage.TVL_last_updated)
        if(cur_date - last_updated <= 600000){
          this.TVL = window.localStorage.TVL
          return
        }
      }

      let responseData:any = []
      let tvl = 0;
      try {
        responseData = await fetch('https://api.cropper.finance/cmc/').then((res) => res.json())
        
        Object.keys(responseData).forEach(function (key) {
          if(((responseData as any)[key as any].tvl * 1) < 2000000){
            tvl = (tvl * 1) + ((responseData as any)[key as any].tvl * 1);
          }
        })
      } catch {
        // dummy data
      } finally {

      }

      try {
        responseData = await fetch('https://api.cropper.finance/staking/').then((res) => res.json())
        tvl = (tvl * 1) + ((responseData as any).value * 1)
      } catch {
        // dummy data
      } finally {

      }

      this.TVL = Math.round(tvl);

      window.localStorage.TVL_last_updated = new Date().getTime()
      window.localStorage.TVL = this.TVL
  }

  async flush() {
    this.loading = true
    this.pools = this.poolsFormated()
    this.showPool(this.searchName, this.stakedOnly, this.currentPage)
    this.loading = false
    this.countdown = 0
  }

  getPoolByLpMintAddress = getPoolByLpMintAddress
  TokenAmount = TokenAmount

  reloadTimer() {
    this.activeSpinning = true
    setTimeout(() => {
      this.activeSpinning = false
    }, 1000)
    this.flush()
    this.$accessor.wallet.getTokenAccounts()
  }

  activeSearch(mode: string) {
    if (mode === 'labelized') this.searchCertifiedFarm = false
    else if (mode === 'permissionless') this.searchCertifiedFarm = true
    else if (mode === 'deposit' && this.wallet.connected) this.stakedOnly = !this.stakedOnly
  }
}
</script>

<style lang="less" scoped>


.pool.container {
  max-width: 1350px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;

  @media @max-lg-tablet {
    margin-top: 0;
  }

  .planet-left {
    position: absolute;
    left: 0;
    top: 35%;

    @media @max-lg-tablet {
      display: none;
    }
  }

  .card {
    .card-body {
      padding: 0;
      
      .page-head {
        margin-top: 10px;

        .title {
          text-align: center;
          position: relative;
          float: left;

          a {
            position: absolute;

            &.create-btn-desktop {
              top: 20px;
              right: -90px;
              
              .create-plus-btn {
                font-weight: 400;
                background: @color-outline;
                box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
                align-items: center;
                display: flex;
                justify-content: center;
                color: white;
                padding: 3px 7px;
                border-radius: 4px;
                font-size: 10px;
                line-height: 12px;

                @media @max-lg-tablet {
                  display: none;
                }
              }
            }

            &.create-btn-mobile {
              top: 5px;
              right: -25px;

              .create-plus-btn {
                font-weight: 400;
                background: @color-outline;
                box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
                border-radius: 8px;
                width: 18px;
                height: 18px;
                display: none;

                @media @max-lg-tablet {
                  display: flex;
                }
              }
            }
          }
        }

        .information {
          display: flex;
          align-items: center;
          text-align: right;

          .my-info {
            font-size: 15px;
            line-height: 18px;

            @media @max-lg-tablet {
              font-size: 12px;
              line-height: 15px;
            }
          }

          .reload-btn {
            width: 30px;
            height: 30px;
            border-radius: 15px;
            background: @gradient-color-primary;
            background-origin: border-box;
            margin-left: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            @media @max-lg-tablet {
              margin-left: 5px;
            }

            img {
              width: 18px;
              height: 18px;
            }

            &.active img {
              transform: rotate(360deg);
              transition: all 1s ease-in-out;
            }
          }
        }
      }

      .page-content {
        .tool-bar {
          height: 64px;
          border-radius: 14px;
          border: 4px solid @color-outline;
          width: 100%;

          @media @max-lg-tablet {
            margin-bottom: 5px;
            height: 54px;

            &:last-child {
              margin-bottom: 0;
            }
          }

          .tool-option {
            height: 100%;
            display: inline-block;
            border-right: 4px solid @color-outline;
            position: relative;

            &:last-child {
              border-right: none !important;
            }

            .input-search {
              height: 100%;
              position: absolute;
              width: 100%;
            }

            .toggle {
              position: absolute;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: space-evenly;

              .label {
                opacity: 0.5;
                font-size: 16px;
                color: #fff;
                cursor: pointer;
                position: relative;

                .info-icon {
                  margin: 0;
                  position: absolute;
                  top: -5px;
                  right: -20px;
                  display: flex;
                  align-items: center;
                  width: fit-content;

                  &.labelized {
                    left: -20px;
                  }
                }

                &.active-label {
                  font-weight: 700;
                  opacity: 1;
                }
              }

              &.deposit-toggle {
                .ant-switch {
                  background-color: @color-disable !important;
                }
                .ant-switch-checked {
                  background-color: #fff !important;
                }
              }
            }

            .sort-by {
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: space-evenly;

              .label {
                font-size: 16px;
                opacity: 0.5;

                &.active-label {
                  font-weight: 700;
                  opacity: 1;
                }

                .sort-up,
                .sort-down {
                  margin-right: 5px;
                  transition: 0.5s;
                }

                .sort-down {
                  transform: rotate(180deg);
                }
              }

              .collapse-down,
              .collapse-up {
                cursor: pointer;
                transition: 0.5s;
              }

              .collapse-down {
                transform: rotate(180deg);
              }
            }
          }
        }
      }

      .pools-table {
        .pools-table-header {
          .header-column {
            font-size: 18px;
            line-height: 21px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
            padding: 16px 0;

            .header-column-title {
              cursor: pointer;
              display: flex;

              i {
                color: white;
                margin-left: 10px;
                display: flex;
                align-items: center;
              }

              .sort-icon-active {
                color: #13ecab;
              }
            }
          }
        }

        .pools-table-body {
          .pools-table-item {
            padding: 16px 0;
            border-top: 1px solid hsla(0, 0%, 100%, 0.2);
            display: flex;
            align-items: center;

            .lp-iconscontainer {
              background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
              background-origin: border-box;
              padding: 2px;
              border-radius: 8px;
              width: 100%;

              .icons {
                display: block !important;
                border-radius: 8px;
                font-weight: normal;
                padding: 14px 20px;
                font-size: 18px;
                line-height: 20px;
                white-space: nowrap;
                position: relative;
                text-align: center;
                width: 100%;

                img {
                  border-radius: 50%;
                  width: 24px;
                  height: 24px;
                }
              }
            }

            .state {
              text-align: center;
            }
          }
        }
      }
    }
  }

  .pagination-container {
    margin-top: 30px;
    text-align: center;
    width: 100%;

    .pagination-body {
      width: 80%;
      display: inline-block;
    }
  }

  h6 {
    margin-bottom: 0;
  }

  .action {
    display: grid;
    grid-gap: 4px;
  }
}

.radioButtonStyle {
  width: 50%;
  text-align: center;
}

.noDesktop {
  display: none;
}

@media @max-lg-tablet {
  body .pool.container {
    .card-body {
      overflow-x: unset !important;
    }

    .ant-collapse-content {
      border-top: none !important;
    }

    thead.ant-table-thead {
      display: none !important;
    }

    .details {
      float: right;
    }

    .openButton {
      background: @gradient-color-icon;
      background-origin: border-box;
      display: inline-block;
      padding: 2px;
      border-radius: 23px;

      button {
        height: 42px;
        padding: 11px 24px;
        color: #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        border-radius: 22px;
        border: transparent;
        cursor: pointer;

        img {
          margin-left: 5px;
          transform: rotate(0);
          transition: transform 0.3s;
        }
      }
    }

    .openButton-active > button > img {
      transform: rotate(180deg);
    }

    .detailButton {
      position: absolute;
      right: 0;
      background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%) !important;
      background-origin: border-box !important;
      display: inline-block;
      padding: 1px;
      border-radius: 23px;

      button {
        height: 42px;
        padding: 11px 40px 11px 24px;
        color: #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        background: #16164a;
        border-radius: 22px;
        border: transparent;
      }
    }

    .bgl {
      background: #16164a !important;
      margin-top: -17px;
      padding-bottom: 10px;
      margin-bottom: -16px;
    }

    .buttonsd {
      display: block;
      background: #00033c;
    }

    .noMobile {
      display: none;
    }

    .noDesktop {
      display: inline-block;
    }

    .largeserach input {
      height: 47px !important;
    }

    .ant-collapse,
    .ant-collapse > .ant-collapse-item {
      position: relative;
    }

    .pool-head.table-head {
      display: none;
    }

    .labmobile {
      float: left;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 21px;
      color: #fff;
      opacity: 0.5;
      display: block;
    }

    .pool-head {
      min-width: 100%;
      padding-top: 25px !important;
      padding-bottom: 25px !important;
      display: flex;
      align-items: center;

      .lp-icons {
        display: block !important;
        width: 100%;
        flex-direction: unset;
        float: unset;
        flex: unset;
        font-size: 15px;
        line-height: 18px;

        .icons {
          display: flex;
          align-items: center;

          img {
            margin-top: -4px;
            margin-right: 10px;
          }

          span {
            margin: 0 10px;
          }
        }

        .lp-icons-group {
          background: transparent;
          .icons {
            padding: 0;
            background-color: transparent;
          }
        }
      }

      .state {
        text-align: right;
        display: none;
        margin-top: 11px;
        .ant-col-12 {
          width: 100%;
        }
      }
    }

    .collapse-row .lp-icons,
    .collapse-row .state {
      padding: 0 10px;
      display: block;
      width: 100%;
      flex-direction: unset;
      float: unset;
      flex: unset;
      text-align: right;
      font-size: 18px;
      margin-bottom: 6px;
      .lp-icons-group {
        background: transparent;
        .icons {
          padding: 0;
          background-color: transparent;
        }
      }
    }

    .collapse-row .current-liquidity {
      display: block;
      width: 100%;
      flex-direction: unset;
      float: unset;
      flex: unset;
      text-align: center;
      font-size: 18px;
      margin-bottom: 6px;
      border-radius: 14px;
      padding: 18px 0;

      .liquidity-content {
        font-weight: normal;
        font-size: 14px;
        line-height: 17px;
        color: rgba(255, 255, 255, 0.5);
        margin-bottom: 15px;
      }

      .liquidity-value {
        font-size: 26px;
        line-height: 32px;
        color: #fff;
        margin-bottom: 15px;
      }
    }

    .anticon.anticon-right {
      display: none !important;
    }

    .ant-collapse.ant-collapse-icon-position-right {
      max-width: 100%;
      background: #16164a;
      border-radius: 10px;
      border: none;

      .ant-collapse-header .ant-collapse-arrow {
        right: 30px !important;
        z-index: 2;
      }
    }

    .reward-col {
      margin-bottom: 30px;
    }

    .ant-collapse-content-box {
      background: #16164a !important;
      .collapse-row {
        display: block;
        align-items: unset;
        .ant-col.ant-col-4,
        .ant-col.ant-col-8 {
          width: 100%;
          display: block;
          flex-direction: unset;
          float: unset;
          flex: unset;
        }
      }
    }

    .start,
    .harvest {
      border-radius: 14px;
      .reward .token {
        font-size: 26px;
        line-height: 31px;
      }
    }

    .btncontainer {
      display: inline-block !important;
    }

    .start .btncontainer:not(.largebtn) {
      width: calc(50% - 20px);
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 10px;
    }

    .start .btncontainer:not(.largebtn):last-of-type {
      width: calc(100% - 30px);
      margin-left: 5px;
      margin-right: 5px;
    }
  }
}

// global used styles
p {
  margin-bottom: 0;
}
</style>

<style lang="less">
::-webkit-scrollbar {
  @media @max-lg-tablet {
    display: none; /* Chrome Safari */
  }
}

.addliq .btnContainer {
  background: transparent !important;
  display: inline-block !important;

  button {
    background: @gradient-color-icon !important;
    background-origin: border-box !important;
    border: 2px solid rgba(255, 255, 255, 0.14) !important;
    border-radius: 8px;
  }
}

.pool.container {
  .ant-collapse-header {
    @media @max-lg-tablet {
      padding-right: 16px !important;
    }
    .ant-collapse-arrow {
      @media @max-lg-tablet {
        right: 30px !important;
        z-index: 2;
      }
    }
  }
  .ant-collapse-content {
    @media @max-lg-tablet {
      background-color: #16164a;
      border-top: none !important;
    }
  }

  .card .card-body .buttons i {
    margin-right: 0;
  }

  .card-body {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .ant-table-thead > tr > th {
    border-bottom: unset !important;
    border-spacing: 0;
  }

  td {
    border-bottom: unset !important;
    border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
    padding: 5px 16px;
  }

  .lp-iconscontainer {
    background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
    background-origin: border-box;
    padding: 2px;
    border-radius: 8px;
    width: 270px;

    .icons {
      display: block !important;
      border-radius: 8px;
      font-weight: normal;
      padding: 14px 20px;
      font-size: 18px;
      line-height: 20px;
      white-space: nowrap;
      position: relative;
      text-align: center;
      width: 100%;

      img {
        position: relative;
        top: -1px;
      }
    }
  }

  table {
    border-collapse: separate;
  }

  .create {
    padding: 8px 18px;
    background: @gradient-color-icon;
    background-origin: border-box;
    border: 2px solid rgba(255, 255, 255, 0.14);
    border-radius: 8px;

    button {
      background: unset !important;
      color: #fff;
      border-color: transparent;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 42px;
      letter-spacing: -0.05em;

      @media @max-lg-tablet {
        font-size: 14px;
        line-height: 24px;
        padding: 0;
      }
    }
  }

  .ant-table-column-title {
    font-size: 18px;
    line-height: 21px;
    color: #fff;
    opacity: 0.5;
  }

  .ant-table-pagination.ant-pagination {
    text-align: center;
    float: none;
    margin-top: 40px;
  }

  .count-down-group {
    background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
    background-origin: border-box;
    height: 60px;
    border-radius: 63px;
    position: relative;
    padding: 2px;
  }

  .count-down {
    border-radius: 63px;
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: 3px 3px 3px 20px;
    font-size: 26px;
    font-weight: 400;
    line-height: 42px;
    position: relative;

    .ant-progress {
      margin-left: 15px;
    }

    .reload-btn {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      background: @gradient-color-icon;
      background-origin: border-box;
      margin-left: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .anticon {
        font-size: 16px !important;
        color: white !important;
      }
    }
  }

  .btncontainer {
    padding: 0 !important;
    border-radius: 5px !important;
    display: inline-block;
    width: unset;

    &.small {
      background: @gradient-color-icon !important;
      background-origin: border-box !important;
      border: 2px solid rgba(255, 255, 255, 0.14) !important;
      border-radius: 8px;
      width: 48px !important;
      height: 48px !important;

      button {
        border: none !important;
        font-size: 17px;
        line-height: 50px;
        font-weight: 800;
        background: transparent !important;
        width: 100% !important;
        height: 100% !important;
        display: flex;
        align-items: center;
        justify-content: center;

        .anticon {
          font-size: 16px;
          color: white;
        }
      }

      &.minus-btn {
        background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%) !important;
        background-origin: border-box !important;
        padding: 2px !important;
        border-radius: 8px !important;
        border: none !important;

        button[disabled] {
          border-radius: 8px;
        }
      }
    }

    .ant-btn:hover,
    .ant-btn:focus {
      border-color: unset;
      border: unset;
    }

    .minus.ant-btn:hover,
    .minus.ant-btn:focus {
      color: #f00 !important;
    }
  }

  label {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    color: #fff;
  }
}
.ant-table-thead > tr > th.ant-table-column-sort {
  background: transparent;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  color: #fff;
  background: #1c274f;
  border: 1px solid #d9d9d9;
  box-shadow: none;
  border-left-width: 0;
}
.ant-radio-button-wrapper {
  color: #aaa;
  background: transparent;
  // border: 1px solid #d9d9d9;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
  border: 1px solid #d9d9d9;
  box-shadow: none;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
  border: 1px solid #d9d9d9;
}
.search-btn {
  background: transparent !important;
  border: none !important;
}

.ant-table-placeholder {
  background: unset !important;
  border-top: unset !important;
  border-bottom: unset !important;
  color: rgba(255, 255, 255, 0.1);
}

// ant customization
.pool {
  .page-content {
    .tool-bar {
      .tool-option {
        .input-search {
          .ant-input-prefix {
            left: 10%;
            font-size: 20px;
            color: white;
          }

          .ant-input {
            padding: 0 10% 0 25%;
            height: 100% !important;
            border: none;
            border-radius: 14px;

            @media @max-lg-tablet {
              font-size: 14px;
              line-height: 17px;
            }

            &::placeholder {
              color: white;
              opacity: 0.5;
            }

            &:focus {
              box-shadow: none;
            }
          }
        }
      }
    }
  }
}
</style>