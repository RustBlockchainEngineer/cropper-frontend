<template>
  <div class="pool container">
    <img class="planet-left" src="@/assets/Green Planet 1.png" />

    <coinModalMulti
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
          <span class="details noDesktop">
            <div
              class="openButton"
              :class="displayfilters ? 'openButton-active' : ''"
              @click="
                () => {
                  if (displayfilters == true) {
                    displayfilters = false
                  } else {
                    displayfilters = true
                  }
                }
              "
            >
              <button>
                Search
                <img src="@/assets/icons/arrow-down.svg" />

              </button>
            </div>
          </span>

          <span class="title noMobile">Liquidity Pools</span>
          <span class="title noDesktop">Pools</span>

          <span class="buttonsd">
            <NuxtLink to="/pools/create-pool/">
              <div class="create">
                <Button size="large" ghost>+ Create a pool </Button>
              </div>
            </NuxtLink>

            <div class="farm-button-group">
              <div class="count-down-group">
                <div class="count-down">
                  <span v-if="autoRefreshTime - countdown < 10">0</span>
                  {{ autoRefreshTime - countdown }}
                  <div
                    class="reload-btn"
                    @click="
                      () => {
                        flush()
                        $accessor.wallet.getTokenAccounts()
                      }
                    "
                  >
                    <img src="@/assets/icons/loading.svg" />
                  </div>
                </div>
              </div>
            </div>
          </span>
        </div>

        <div class="tool-bar noMobile">
          <div class="tool-option">
            <Input v-model="searchName" size="large" class="input-search" placeholder="Search by name">
              <Icon slot="prefix" type="search" />
            </Input>
          </div>
          <div class="tool-option"></div>
          <div class="tool-option"></div>

          <div class="tool-option last-option">
            <div class="toggle">
              <label class="label">Staked only</label>
              <Toggle v-model="stakedOnly" :disabled="!wallet.connected" />
            </div>
          </div>
        </div>

        <div class="tool-bar noDesktop" v-if="displayfilters">
          <div class="tool-option">
            <Input v-model="searchName" size="large" class="input-search largeserach" placeholder="Search by name">
              <Icon slot="prefix" type="search" />
            </Input>
          </div>

          <div class="tool-option last-option">
            <div class="toggle">
              <label class="label">Staked only</label>
              <Toggle v-model="stakedOnly" :disabled="!wallet.connected" />
            </div>
          </div>
        </div>

        <div v-if="poolLoaded" class="mobilescroller">
          <Table :columns="columns" :data-source="poolsShow" :pagination="false" row-key="lp_mint" class="pools-table-pc">
            <span slot="name" slot-scope="text" class="lp-icons">
              {{ void (pool = getPoolByLpMintAddress(text)) }}
              <span class="lp-iconscontainer">
                <div class="icons">
                  <CoinIcon :mint-address="pool ? getPoolByLpMintAddress(text).lp.coin.mintAddress : ''" />
                  {{ getPoolByLpMintAddress(text).lp.coin.symbol }} -
                  <CoinIcon :mint-address="pool ? getPoolByLpMintAddress(text).lp.pc.mintAddress : ''" />
                  {{ getPoolByLpMintAddress(text).lp.pc.symbol }}
                </div>
              </span>
            </span>
            <span slot="liquidity" slot-scope="text"> ${{ new TokenAmount(text, 2, false).format() }}</span>
            <span slot="volume_24h" slot-scope="text"> ${{ new TokenAmount(text, 2, false).format() }}</span>
            <span slot="volume_7d" slot-scope="text"> ${{ new TokenAmount(text, 2, false).format() }}</span>
            <span slot="fee_24h" slot-scope="text"> ${{ new TokenAmount(text, 2, false).format() }}</span>
            <span slot="apy" slot-scope="text"> {{ new TokenAmount(text, 2, false).format() }}%</span>
            <span slot="current" slot-scope="text"> ${{ new TokenAmount(text, 2, false).format() }}</span>
            <span slot="apu" slot-scope="text, pool"
              >{{ text }}

              <div class="btncontainer small plus-btn">
                <Button size="small" ghost :disabled="!wallet.connected" @click="openPoolAddModal(pool)">
                  <Icon type="plus" />
                </Button>
              </div>

              &nbsp;

              <div class="btncontainer small minus-btn">
                <Button
                  size="small"
                  class="minus"
                  ghost
                  :disabled="!wallet.connected || !pool.current"
                  @click="openUnstakeModal(pool, pool.lp, 1)"
                >
                  <Icon type="minus" />
                </Button>
              </div>
            </span>
          </Table>
        </div>

        <div v-if="poolLoaded" class="noDesktop">
          <Collapse v-model="showCollapse" expand-icon-position="right" class="pools-table-mobile">
            <CollapsePanel v-for="data in poolsShow" :key="data.lp_mint" v-show="true" :show-arrow="poolCollapse">
              <Row slot="header" class="farm-head">
                <Col class="lp-icons" :span="24">
                  <div class="icons">
                    <CoinIcon :mint-address="data ? data.lp.coin.mintAddress : ''" />
                    {{ data.lp.coin.symbol }}
                    <span>-</span>
                    <CoinIcon :mint-address="data ? data.lp.pc.mintAddress : ''" />
                    {{ data.lp.pc.symbol }}
                  </div>
                </Col>

                <div class="detailButton">
                  <button>Details</button>
                </div>
              </Row>

              <Row v-if="poolCollapse" class="collapse-row">
                <Col class="state" span="24">
                  <div class="value">
                    <span class="labmobile">Liquidity</span>
                    ${{ new TokenAmount(data.liquidity, 2, false).format() }}
                  </div>
                </Col>
                <Col class="state" span="24">
                  <div class="value">
                    <span class="labmobile">24h / Volume</span>
                    ${{ new TokenAmount(data.volume_24h, 2, false).format() }}
                  </div>
                </Col>
                <Col class="state" span="24">
                  <div class="value">
                    <span class="labmobile">7d / Volume</span>
                    ${{ new TokenAmount(data.volume_7d, 2, false).format() }}
                  </div>
                </Col>
                <Col class="state" span="24">
                  <div class="value">
                    <span class="labmobile">24h / Fees</span>
                    ${{ new TokenAmount(data.fee_24h, 2, false).format() }}
                  </div>
                </Col>
                <Col class="state" span="24">
                  <div class="value">
                    <span class="labmobile">APY</span>
                    {{ new TokenAmount(data.apy, 2, false).format() }}%
                  </div>
                </Col>
                <Col class="current-liquidity" span="24">
                  <div class="liquidity-content">Your liquidity</div>
                  <div class="liquidity-value">${{ new TokenAmount(data.current, 2, false).format() }}</div>
                  <div class="btncontainer small plus-btn">
                    <Button size="small" ghost :disabled="!wallet.connected" @click="openPoolAddModal(data)">
                      <Icon type="plus" />
                    </Button>
                  </div>

                  &nbsp;

                  <div class="btncontainer small minus-btn">
                    <Button
                      size="small"
                      class="minus"
                      ghost
                      :disabled="!wallet.connected || !data.current"
                      @click="openUnstakeModal(data, data.lp, 1)"
                    >
                      <Icon type="minus" />
                    </Button>
                  </div>
                </Col>
              </Row>
            </CollapsePanel>
          </Collapse>

          <div style="text-align: center; width: 100%">
            <div style="width: 80%; display: inline-block">
              <Pagination :total="totalCount" :pageSize="pageSize" :defaultCurrent="1" v-model="currentPage">
              </Pagination>
            </div>
          </div>
        </div>
        <div v-else class="fc-container">
          <Spin :spinning="true">
            <Icon slot="indicator" type="loading" style="font-size: 24px" spin />
          </Spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { get, cloneDeep } from 'lodash-es'
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { Table, Radio, Tooltip, Collapse, Row, Spin, Button, Input, Icon, Pagination, Switch as Toggle } from 'ant-design-vue'
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
      currentPage: 1
    }
  },

  components: {
    Table,
    Collapse,
    CollapsePanel,
    Row,
    RadioGroup,
    RadioButton,
    Toggle,
    Tooltip,
    Button,
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

    const pools = getAllCropperPools()
    return { pools }
  }
})
export default class Pools extends Vue {
  columns = [
    {
      title: 'Name',
      dataIndex: 'lp_mint',
      key: 'lp_mint',
      scopedSlots: { customRender: 'name' }
    },
    {
      title: 'Liquidity',
      dataIndex: 'liquidity',
      key: 'liquidity',
      scopedSlots: { customRender: 'liquidity' },
      defaultSortOrder: 'descend',
      sorter: (a: any, b: any) => a.liquidity - b.liquidity
    },
    {
      title: 'Volume (24hrs)',
      dataIndex: 'volume_24h',
      key: 'volume_24h',
      scopedSlots: { customRender: 'volume_24h' },
      sorter: (a: any, b: any) => a.volume_24h - b.volume_24h
    },
    {
      title: 'Volume (7d)',
      dataIndex: 'volume_7d',
      key: 'volume_7d',
      scopedSlots: { customRender: 'volume_7d' },
      sorter: (a: any, b: any) => a.volume_7d - b.volume_7d
    },
    {
      title: 'Fees (24hrs)',
      dataIndex: 'fee_24h',
      key: 'fee_24h',
      scopedSlots: { customRender: 'fee_24h' },
      sorter: (a: any, b: any) => a.fee_24h - b.fee_24h
    },

    {
      title: 'APY',
      dataIndex: 'apy',
      key: 'apy',
      scopedSlots: { customRender: 'apy' },
      sorter: (a: any, b: any) => a.apy - b.apy
    },

    {
      title: 'Your Liquidity',
      dataIndex: 'current',
      key: 'current',
      scopedSlots: { customRender: 'current' },
      sorter: (a: any, b: any) => a.current - b.current
    },

    {
      title: 'Add / Remove',
      dataIndex: 'apu',
      scopedSlots: { customRender: 'apu' },
      key: 'apu'
    }
  ]
  poolCollapse: any = true
  showCollapse: any = []
  pools: any = []
  poolsShow: any = []
  poolType: string = 'RaydiumPools'
  fromCoin: any = false
  staking: any = false
  lp: any = false
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
  loading: boolean = false
  stakedOnly: boolean = false
  searchButton = true
  searchName = ''
  totalCount = 110
  pageSize = 50
  currentPage = 1

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

  showPool(searchName: any = '', stakedOnly: boolean = false, pageNum: any = 1) {
    const pool = []
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
        (pool.name as string).toLowerCase().includes((searchName as string).toLowerCase())
      )
    }

    if (stakedOnly) {
      this.poolsShow = this.poolsShow.filter((pool: any) => pool.current > 0.01)
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

  unstake(amount: string) {
    this.unstaking = true

    const conn = this.$web3
    const wallet = (this as any).$wallet
    const coin = this.poolInf.lp.coin
    const pc = this.poolInf.lp.pc
    const lp = this.poolInf.lp

    const lpAccount = get(this.wallet.tokenAccounts, `${this.poolInf.lp.mintAddress}.tokenAccountAddress`)
    const fromCoinAccount = get(this.wallet.tokenAccounts, `${coin.mintAddress}.tokenAccountAddress`)
    const toCoinAccount = get(this.wallet.tokenAccounts, `${pc.mintAddress}.tokenAccountAddress`)

    const key = getUnixTs().toString()
    this.$notify.info({
      key,
      message: 'Making transaction...',
      description: '',
      duration: 0
    })

    const poolInfo = get(this.liquidity.infos, lp.mintAddress)
    //remove whole lp amount
    removeLiquidity(conn, wallet, poolInfo, lpAccount, fromCoinAccount, toCoinAccount, amount)
      .then((txid) => {
        this.$notify.info({
          key,
          message: 'Transaction has been sent',
          description: (h: any) => h('div', ['Confirmation is in progress.'])
        })

        const description = `Remove liquidity for ${amount} LP Token`

        this.$accessor.transaction.sub({ txid, description })
      })
      .catch((error) => {
        this.$notify.error({
          key,
          message: 'Remove liquidity failed',
          description: error.message
        })
      })
      .finally(() => {
        this.flush()
        this.$accessor.wallet.getTokenAccounts()
        this.unstaking = false
        this.unstakeModalOpening = false
      })
  }

  stake(fromCoinAmount: string, toCoinAmount: string, fixedCoin: string) {
    this.staking = true

    const conn = this.$web3
    const wallet = (this as any).$wallet

    const poolInfo = get(this.liquidity.infos, this.poolInf.lp.mintAddress)

    const lpAccount = get(this.wallet.tokenAccounts, `${this.poolInf.lp.mintAddress}.tokenAccountAddress`)
    // @ts-ignore
    const fromCoinAccount = get(this.wallet.tokenAccounts, `${this.poolInf.lp.coin.mintAddress}.tokenAccountAddress`)
    // @ts-ignore
    const toCoinAccount = get(this.wallet.tokenAccounts, `${this.poolInf.lp.pc.mintAddress}.tokenAccountAddress`)

    const key = getUnixTs().toString()
    this.$notify.info({
      key,
      message: 'Making transaction...',
      description: '',
      duration: 0
    })
    addLiquidity(
      conn,
      wallet,
      poolInfo,
      fromCoinAccount,
      toCoinAccount,
      lpAccount,
      this.poolInf.lp.coin,
      this.poolInf.lp.pc,
      fromCoinAmount,
      toCoinAmount,
      fixedCoin
    )
      .then(async (txid) => {
        this.$notify.info({
          key,
          message: 'Transaction has been sent',
          description: (h: any) => h('div', ['Confirmation is in progress.'])
        })

        const description = `Add liquidity for ${fromCoinAmount} ${this.poolInf.lp.coin?.symbol} and ${toCoinAmount} ${this.poolInf.lp.pc?.symbol}`
        this.$accessor.transaction.sub({ txid, description })

        let txStatus = this.$accessor.transaction.history[txid].status
        while (txStatus === 'Pending') {
          await this.delay(500)
          txStatus = this.$accessor.transaction.history[txid].status
          await this.delay(500)
        }
        if (txStatus === 'Fail') {
          console.log('add lp failed')
          return
        }
        let amount = get(this.wallet.tokenAccounts, `${this.poolInf.lp.mintAddress}.balance`)
        //stake whole lp amount
        amount = amount.wei.toNumber() / Math.pow(10, amount.decimals)
        let delayTime = 0
        while (amount <= 0 && delayTime < 10000) {
          //after 4 seconds ,it's failed
          await this.delay(200)
          delayTime += 200
          amount = get(this.wallet.tokenAccounts, `${this.poolInf.lp.mintAddress}.balance`)
          amount = amount.wei.toNumber() / Math.pow(10, amount.decimals)
        }
        if (amount <= 0) {
          console.log('added lp amount is 0')
          return
        }
      })
      .catch((error) => {
        this.$notify.error({
          key,
          message: 'Add liquidity failed',
          description: error.message
        })
      })
      .finally(async () => {
        this.flush()
        this.$accessor.wallet.getTokenAccounts()
        this.staking = false
        this.stakeModalOpening = false
      })
  }

  poolsFormated() {
    const conn = this.$web3
    const wallet = (this as any).$accessor.wallet
    const liquidity = (this as any).$accessor.liquidity
    const price = (this as any).$accessor.price

    const polo: any = []





    getAllCropperPools().forEach(function (value: any) {
      const liquidityItem = get(liquidity.infos, value.lp_mint)
      let lp = getPoolByLpMintAddress(value.lp_mint)


      if(!price.prices[liquidityItem?.coin.symbol as string] && price.prices[liquidityItem?.pc.symbol as string]){
        price.prices[liquidityItem?.coin.symbol as string] = price.prices[liquidityItem?.pc.symbol as string] * getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther()) / getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther());
      }


      if(!price.prices[liquidityItem?.pc.symbol as string] && price.prices[liquidityItem?.coin.symbol as string]){
        price.prices[liquidityItem?.pc.symbol as string] = price.prices[liquidityItem?.coin.symbol as string] * getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther()) / getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther());
      }



      const liquidityCoinValue =
        getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther()) *
        price.prices[liquidityItem?.coin.symbol as string]
      const liquidityPcValue =
        getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther()) *
        price.prices[liquidityItem?.pc.symbol as string]
      const liquidityTotalValue = liquidityPcValue + liquidityCoinValue

      const liquidityTotalSupply = getBigNumber((liquidityItem?.lp.totalSupply as TokenAmount).toEther())
      const liquidityItemValue = liquidityTotalValue / liquidityTotalSupply


      value.liquidity = liquidityTotalValue

      if (!window.poolsDatas) {
        window.poolsDatas = {}
      }

      if (window.poolsDatas[value.ammId] && window.poolsDatas[value.ammId]['1day']) {
        value.volume_24h = window.poolsDatas[value.ammId]['1day']
      } else {
        value.volume_24h = 0
      }

      if (window.poolsDatas[value.ammId] && window.poolsDatas[value.ammId]['7day']) {
        value.volume_7d = window.poolsDatas[value.ammId]['7day']
      } else {
        value.volume_7d = 0
      }

      if (window.poolsDatas[value.ammId] && window.poolsDatas[value.ammId]['fees']) {
        value.fee_24h = window.poolsDatas[value.ammId]['fees']
      } else {
        value.fee_24h = 0
      }

      if (window.poolsDatas[value.ammId] && window.poolsDatas[value.ammId]['fees']) {
        value.apy = (window.poolsDatas[value.ammId]['fees'] * 365 * 100) / liquidityTotalValue
      } else {
        value.apy = 0
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
    this.poolInf = cloneDeep(poolInfo)
    const coinBalance = get(this.wallet.tokenAccounts, `${this.poolInf.coin1.mintAddress}.balance`)
    const pcBalance = get(this.wallet.tokenAccounts, `${this.poolInf.coin2.mintAddress}.balance`)
    this.poolInf.lp.coin.balance = coinBalance
    this.poolInf.lp.pc.balance = pcBalance
    this.stakeModalOpening = true
  }

  cancelPoolAdd() {
    this.fromCoin = null
    this.toCoin = null
    this.lptoken = null
    this.lpMintAddress = null
    this.stakeModalOpening = false
  }

  mounted() {
    this.timer = setInterval(async () => {
      await this.flush()
      if (this.pools.length > 0) {
        var hash = window.location.hash
        if (hash) {
          hash = hash.substring(1)
          this.searchName = hash
        } else {
          const query = new URLSearchParams(window.location.search)
          if (query.get('s')) this.searchName = query.get('s') as string
        }
        this.poolLoaded = true
        this.setTimer()
      }
    }, 1000)

          const query = new URLSearchParams(window.location.search)
          if (query.get('r')) 
        this.$router.push('/fertilizer/project/?f=cropper');
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
  async flush() {
    this.loading = true
    this.pools = this.poolsFormated()
    this.showPool(this.searchName, this.stakedOnly, this.currentPage)
    this.loading = false
    this.countdown = 0
  }
  getPoolByLpMintAddress = getPoolByLpMintAddress
  TokenAmount = TokenAmount
}
</script>

<style lang="less" scoped>
.ant-layout,
.ant-layout-content {
  background: #01033c !important;
}

section {
  background: #01033c !important;
}

.pool.container {
  max-width: 1350px;
  width: 100%;
  background: #01033c;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;

  .mobilescroller {
    .pools-table-mobile {
      display: none;
    }
  }

  .planet-left {
    position: absolute;
    left: 0;
    top: 35%;
  }

  .page-head {
    margin-top: 10px;
  }

  .page-head .title {
    position: absolute;
    left: 0 !important;
    transform: translate(0, 0) !important;
  }

  .page-head a {
    z-index: 2;
    background: #01033c;
    float: right;
    margin-left: 20px;

    .btncontainer {
      display: inline-block;
    }
  }

  .page-head .buttons {
    float: right;
  }

  .page-head .farm-button-group {
    float: right;
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
.card-body {
  padding: 0;
}

.noDesktop {
  display: none;
}

@media (max-width: @mobile-b-width) {
  body .pool.container {
    min-width: unset;
    width: 100%;
    max-width: 100%;
    margin-top: 0;
    padding: 20px 20px !important;

    .ant-collapse-content {
      background-color: #01033c;
      border-top: none !important;
    }

    thead.ant-table-thead {
      display: none !important;
    }

    .mobilescroller {
      max-width: calc(100vh - 40px);
      overflow: scroll;

      .pools-table-pc {
        display: none;
      }

      .pools-table-mobile {
        display: block;

        .ant-collapse-item .ant-collapse-content {
          background-color: #01033c;
          border-top: none !important;
        }
      }
    }

    .details {
      float: right;
    }

    .openButton {
      background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
      display: inline-block;
      padding: 2px;
      border-radius: 23px;

      button {
        height: 42px;
        padding: 11px 24px;
        color: #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        background: #01033c;
        border-radius: 22px;
        border: transparent;

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
      background: linear-gradient(97.63deg, #280C86 -29.92%, #22B5B6 103.89%) !important;
      display: inline-block;
      padding: 1px;
      border-radius: 23px;

      button {
        height: 42px;
        padding: 11px 40px 11px 24px;
        color: #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        background: #16164A;
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

    .page-head {
      margin-bottom: 0;
      margin-top: 0;
      .title {
        font-size: 40px;
        position: relative;
        line-height: 50px;
      }
      .buttonsd {
        height: 87px;
        padding: 20px 20px 84px;
        border: 4px solid #16164a;
        box-sizing: border-box;
        border-radius: 14px;
        text-align: center;
        margin-top: 20px;

        a {
          float: right;
          display: inline-block;
        }

        > div {
          float: left;
          margin-right: -66px;
          display: inline-block;
        }
      }
    }

    .fs-container {
      display: inline-block;
    }

    .ant-collapse,
    .ant-collapse > .ant-collapse-item {
      position: relative;
      border-bottom: 1px solid #01033C;
    }

    .farm-head.table-head {
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

    .farm-head {
      min-width: 100%;
      padding-top: 25px !important;
      padding-bottom: 25px !important;
      display: flex;
      align-items: center;
      
      .lp-icons {
        padding: 0 10px;
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
            margin: 0 16px;
          }
        };
        
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
      background: #01033C;
      border-radius: 14px;
      padding: 18px 0;

      .liquidity-content {
        font-weight: normal;
        font-size: 14px;
        line-height: 17px;
        color: #FFFFFF50;
        margin-bottom: 15px;
      }

      .liquidity-value {
        font-size: 26px;
        line-height: 32px;
        color: #FFF;
        margin-bottom: 15px;
      }
    }

    .anticon.anticon-right,
    .info-icon {
      display: none !important;
    }

    .ant-pagination {
      margin-top: 40px;
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
      background: #01033c;
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

    .tool-bar {
      height: unset;
      border: unset;

      .tool-option {
        background: #00033c;
        width: 100%;
        height: 54px;
        display: block;
        position: relative;
        margin: 10px 0;
        border: 4px solid #16164a;
        box-sizing: border-box;
        border-radius: 10px;
        .input-search {
          height: 47px !important;
          .ant-input {
            padding: 19px 60px;
            border: none;
            height: 47px !important;
          }
        }

        .toggle {
          position: absolute;
          width: 100%;
          height: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: left;
          padding-left: 10%;

          .ant-switch {
            position: absolute;
            right: 10%;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.addliq .btnContainer {
  background: transparent !important;
  display: inline-block !important;

  button {
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%) !important;
    border: 2px solid rgba(255, 255, 255, 0.14) !important;
    border-radius: 8px;
  }
}

.tool-bar {
  height: 100px;
  border-radius: 14px;
  border: 4px solid #16164a;
  width: 100%;

  .tool-option {
    width: 24%;
    height: 100%;
    display: inline-block;
    border-right: 3px solid #16164a;
    position: relative;

    .input-search {
      height: 100%;
      position: absolute;
      width: 100%;

      .ant-input-prefix {
        left: 10%;
        font-size: 20px;
        color: white;
      }

      .ant-input {
        padding: 0 10% 0 20%;
        height: 100% !important;
        border: none;
      }

      .ant-input::placeholder {
        color: white;
        opacity: 0.5;
      }
    }

    .ant-select-focused > .ant-select-selection > .ant-select-selection__rendered {
      opacity: 1 !important;
    }

    .ant-select {
      border: none;
      height: 100%;
      position: absolute;
      width: 100%;

      .ant-select-selection {
        height: 100%;
        width: 100%;
        display: inline-flex;
        align-items: center;
        padding-left: 10%;
        border: none;

        .ant-select-selection__rendered {
          margin-left: 0 !important;
          font-size: 16px;
          opacity: 0.5;
        }

        .ant-select-arrow {
          right: 10%;
          font-size: 13px;
        }
      }
    }

    .toggle {
      position: absolute;
      width: 100%;
      height: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      .label {
        font-size: 16px;
        opacity: 0.5;
      }

      .ant-switch {
        margin-left: 14px;
        background-color: white;
        height: 11px;
        border-radius: 30px;
      }

      .ant-switch::after {
        width: 28px;
        height: 28px;
        background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
        top: -10px;
        left: -2px;
      }

      .ant-switch-checked::after {
        margin-left: 2px;
        left: 100%;
      }
    }
  }

  .last-option {
    border-right: none !important;
  }
}

.pool.container {
  .ant-collapse-header {
    @media (max-width: @mobile-b-width) {
      padding-right: 16px !important;
    }
    .ant-collapse-arrow {
      @media (max-width: @mobile-b-width) {
        right: 30px !important;
        z-index: 2;
        }
    }
  }
  .ant-collapse-content {
    @media (max-width: @mobile-b-width) {
      background-color: #16164a;
      border-top: none !important;
    }
  }
  .card .card-body .buttons i {
    margin-right: 0;
  }
  .card-body {
    overflow-x: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .ant-table-thead > tr > th {
    border-bottom: unset !important;
    border-spacing: 0;
  }

  td {
    background: #01033c !important;
    border-bottom: unset !important;
    border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
    padding: 25px 16px;
  }

  .lp-iconscontainer {
    background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
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
      background: #01033c;
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
    padding: 9px 19px;
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
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

      @media (max-width: @mobile-b-width) {
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

  .count-down-group {
    background: linear-gradient(97.63deg, #280C86 -29.92%, #22B5B6 103.89%);
    height: 60px;
    border-radius: 63px;
    position: relative;
    padding-left: 2px;
    padding-right: 2px;
  }

  .count-down {
    background-color: #01033c;
    border-radius: 63px;
    height: 56px;
    top: 2px;
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
      background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
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
    background: #01033c !important;
    padding: 0 !important;
    border-radius: 5px !important;
    display: inline-block;
    width: unset;

    &.small {
      background: linear-gradient(315deg, #21bdb8 0%, #280684 100%) !important;
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
        background: linear-gradient(97.63deg, #280C86 -29.92%, #22B5B6 103.89%) !important;
        padding: 2px !important;
        border-radius: 8px !important;
        border: none !important;
        
        button {
          border-radius: 8px;
          background: #01033C !important;
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
    opacity: 0.5;
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
</style>