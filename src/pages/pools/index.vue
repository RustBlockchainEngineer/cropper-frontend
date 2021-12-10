<template>
  <div class="pool container">
    <img class="planet-left" src="@/assets/Green Planet 1.png" />

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
            <NuxtLink to="/pools/create-pool/" class="create-btn-desktop">
              <div class="create-plus-btn">+ Create pool</div>
            </NuxtLink>
          </span>
          <span class="title noDesktop">
            Pools
            <NuxtLink to="/pools/create-pool/" class="create-btn-mobile">
              <div class="create-plus-btn">
                <img src="@/assets/icons/plus-icon-10.svg" />
              </div>
            </NuxtLink>
          </span>
          <span class="information">
            <div class="my-info">
              <p>TVL : <b>{{TVL.toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}} $</b></p>
              <!-- <p>Your deposit: <b>28,009 $</b></p> -->
            </div>

            <!-- {{ autoRefreshTime - countdown }} -->
            <div class="reload-btn" :class="activeSpinning ? 'active' : ''" @click="reloadTimer">
              <img src="@/assets/icons/loading.svg" />
            </div>
          </span>
        </div>

        <div class="page-content">
          <!-- Filter bar for desktop -->
          <Row class="tool-bar noMobile">
            <Col span="5" class="tool-option">
              <Input v-model="searchName" size="large" class="input-search" placeholder="Search by name">
                <Icon slot="prefix" type="search" />
              </Input>
            </Col>
            <Col span="6" class="tool-option">
              <div class="toggle">
                <label
                  class="label"
                  :class="!searchCertifiedFarm ? 'active-label' : ''"
                  @click="activeSearch('labelized')">
                  Labelized
                  <Tooltip placement="bottom">
                    <template slot="title">
                      <div>
                        <div class="tooltip-text">
                          <b>Labelized:</b> Cropper labelized this pool after running due diligence on its team and project.
                        </div>
                      </div>
                    </template>
                    <div class="info-icon labelized">
                      <img src="@/assets/icons/info-icon.svg" width="12" height="12" />
                    </div>
                  </Tooltip>
                </label>
                <Toggle v-model="searchCertifiedFarm" />
                <label
                  class="label"
                  :class="searchCertifiedFarm ? 'active-label' : ''"
                  @click="activeSearch('permissionless')"
                  >Permissionless
                  <Tooltip placement="bottom">
                    <template slot="title">
                      <div>
                        <div class="tooltip-text">
                          <b>Permissionless:</b> This project created its pool without any review from the Cropper Team.
                        </div>
                      </div>
                    </template>
                    <div class="info-icon">
                      <img src="@/assets/icons/info-icon.svg" width="12" height="12" />
                    </div>
                  </Tooltip>
                </label>
              </div>
            </Col>
            <Col span="5" class="tool-option"> </Col>
            <Col span="4" class="tool-option"> </Col>
            <Col span="4" class="tool-option">
              <div class="toggle deposit-toggle">
                <Toggle v-model="stakedOnly" :disabled="!wallet.connected" />
                <label class="label" :class="stakedOnly ? 'active-label' : ''" @click="activeSearch('deposit')">My deposit</label>
              </div>
            </Col>
          </Row>

          <!-- Filter bar for mobile -->

          <Row class="tool-bar noDesktop">
            <Col span="12" class="tool-option">
              <Input v-model="searchName" size="large" class="input-search" placeholder="Search by name">
                <Icon slot="prefix" type="search" />
              </Input>
            </Col>
            <Col span="12" class="tool-option">
              <div class="toggle deposit-toggle">
                <Toggle v-model="stakedOnly" :disabled="!wallet.connected"/>
                <label class="label" :class="stakedOnly ? 'active-label' : ''" @click="activeSearch('deposit')">Deposited</label>
              </div>
            </Col>
          </Row>
          <Row class="tool-bar noDesktop">
            <Col span="24" class="tool-option">
              <div class="toggle">
                <label
                  class="label"
                  :class="!searchCertifiedFarm ? 'active-label' : ''"
                  @click="activeSearch('labelized')">
                  Labelized
                  <Tooltip placement="bottom">
                    <template slot="title">
                      <div>
                        <div class="tooltip-text">
                          <b>Labelized:</b> Cropper labelized this pool after running due diligence on its team and project.
                        </div>
                      </div>
                    </template>
                    <div class="info-icon labelized">
                      <img src="@/assets/icons/info-icon.svg" width="12" height="12" />
                    </div>
                  </Tooltip>
                </label>
                <Toggle v-model="searchCertifiedFarm" />
                <label
                  class="label"
                  :class="searchCertifiedFarm ? 'active-label' : ''"
                  @click="activeSearch('permissionless')"
                  >Permissionless
                  <Tooltip placement="bottom">
                    <template slot="title">
                      <div>
                        <div class="tooltip-text">
                          <b>Permissionless:</b> This project created its pool without any review from the Cropper Team.
                        </div>
                      </div>
                    </template>
                    <div class="info-icon">
                      <img src="@/assets/icons/info-icon.svg" width="12" height="12" />
                    </div>
                  </Tooltip>
                </label>
              </div>
            </Col>
          </Row>
        </div>
        <div v-if="poolLoaded" class="noMobile pools-table">
          <Row class="pools-table-header">
            <Col class="header-column" span="5"> Name </Col>
            <Col class="header-column" span="2">
              <div class="header-column-title" @click="sortbyColumn('liquidity')">
                Liquidity
                <Icon
                  v-if="sortLiquidityAsc"
                  type="arrow-down"
                  :class="sortMethod === 'liquidity' ? 'sort-icon-active' : ''"
                />
                <Icon v-else type="arrow-up" :class="sortMethod === 'liquidity' ? 'sort-icon-active' : ''" />
              </div>
            </Col>
            <Col class="header-column" span="3">
              <div class="header-column-title" @click="sortbyColumn('volh')">
                Volume (24hrs)
                <Icon v-if="sortVolHAsc" type="arrow-down" :class="sortMethod === 'volh' ? 'sort-icon-active' : ''" />
                <Icon v-else type="arrow-up" :class="sortMethod === 'volh' ? 'sort-icon-active' : ''" />
              </div>
            </Col>
            <Col class="header-column" span="3">
              <div class="header-column-title" @click="sortbyColumn('vold')">
                Volume (7d)
                <Icon v-if="sortVolDAsc" type="arrow-down" :class="sortMethod === 'vold' ? 'sort-icon-active' : ''" />
                <Icon v-else type="arrow-up" :class="sortMethod === 'vold' ? 'sort-icon-active' : ''" />
              </div>
            </Col>
            <Col class="header-column" span="3">
              <div class="header-column-title" @click="sortbyColumn('feesh')">
                Fees (24 hrs)
                <Icon v-if="sortFeesAsc" type="arrow-down" :class="sortMethod === 'feesh' ? 'sort-icon-active' : ''" />
                <Icon v-else type="arrow-up" :class="sortMethod === 'feesh' ? 'sort-icon-active' : ''" />
              </div>
            </Col>
            <Col class="header-column" span="2">
              <div class="header-column-title" @click="sortbyColumn('apy')">
                APY
                <Icon v-if="sortAPYAsc" type="arrow-down" :class="sortMethod === 'apy' ? 'sort-icon-active' : ''" />
                <Icon v-else type="arrow-up" :class="sortMethod === 'apy' ? 'sort-icon-active' : ''" />
              </div>
            </Col>
            <Col class="header-column" span="3">
              <div class="header-column-title" @click="sortbyColumn('yliquidity')">
                Your Liquidity
                <Icon
                  v-if="sortCurrentAsc"
                  type="arrow-down"
                  :class="sortMethod === 'yliquidity' ? 'sort-icon-active' : ''"
                />
                <Icon v-else type="arrow-up" :class="sortMethod === 'yliquidity' ? 'sort-icon-active' : ''" />
              </div>
            </Col>
            <Col class="header-column" span="3"> Add / Remove </Col>
          </Row>

          <div class="pools-table-body">
            <Row class="pools-table-item" v-for="data in poolsShow" :key="data.lp_mint">
              <Col span="5">
                <div class="lp-iconscontainer">
                  <div class="icons">
                    <CoinIcon :mint-address="data ? data.lp.coin.mintAddress : ''" />
                    {{ data.lp.coin.symbol }}
                    <span>-</span>
                    <CoinIcon :mint-address="data ? data.lp.pc.mintAddress : ''" />
                    {{ data.lp.pc.symbol }}
                  </div>

                  <div v-if="displayPoolID">
                    AMMID : {{ data.ammId }}<br />
                    SerumMarket : {{ data.serumMarket }}
                  </div>
                </div>
              </Col>

              <Col class="state" span="2"> ${{ new TokenAmount(data.liquidity, 2, false).format() }} </Col>

              <Col class="state" span="3"> ${{ new TokenAmount(data.volume_24h, 2, false).format() }} </Col>
              <Col class="state" span="3"> ${{ new TokenAmount(data.volume_7d, 2, false).format() }} </Col>
              <Col class="state" span="3"> ${{ new TokenAmount(data.fee_24h, 2, false).format() }} </Col>
              <Col class="state" span="2"> {{ new TokenAmount(data.apy, 2, false).format() }}% </Col>
              <Col class="state" span="3"> ${{ new TokenAmount(data.current, 2, false).format() }} </Col>
              <Col class="state" span="3">
                <div class="btncontainer small plus-btn">
                  <Button size="small" ghost @click="openPoolAddModal(data)">
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
          </div>

          <div class="pagination-container">
            <div class="pagination-body">
              <Pagination
                v-if="totalCount > pageSize"
                :total="totalCount"
                :pageSize="pageSize"
                :defaultCurrent="1"
                v-model="currentPage"
              >
              </Pagination>
            </div>
          </div>
        </div>

        <div v-if="poolLoaded" class="noDesktop">
          <Collapse v-model="showCollapse" expand-icon-position="right" class="pools-table-mobile">
            <CollapsePanel v-for="data in poolsShow" :key="data.lp_mint" v-show="true" :show-arrow="poolCollapse">
              <Row slot="header" class="pool-head">
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
                    <Button size="small" ghost @click="openPoolAddModal(data)">
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

          <div class="pagination-container">
            <div class="pagination-body">
              <Pagination
                v-if="totalCount > pageSize"
                :total="totalCount"
                :pageSize="pageSize"
                :defaultCurrent="1"
                v-model="currentPage"
              >
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
    if (!newSearchCertifiedFarm) {
      //labelized
      this.pools = this.pools.filter((pool: any) => pool.labelized)
    } else if (newSearchCertifiedFarm) {
      //permissionless
      this.pools = this.pools.filter((pool: any) => !pool.labelized)
    }
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

    if (!this.searchCertifiedFarm) {
      //labelized
      this.pools = this.pools.filter((pool: any) => pool.labelized)
    } else if (this.searchCertifiedFarm) {
      //permissionless
      this.pools = this.pools.filter((pool: any) => !pool.labelized)
    }

    // sort by column
    if (this.sortMethod == 'liquidity') {
      if (this.sortLiquidityAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.liquidity - a.liquidity
        })
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.liquidity - b.liquidity
        })
      }
    } else if (this.sortMethod == 'volh') {
      if (this.sortVolHAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.volume_24h - a.volume_24h
        })
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.volume_24h - b.volume_24h
        })
      }
    } else if (this.sortMethod == 'vold') {
      if (this.sortVolDAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.volume_7d - a.volume_7d
        })
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.volume_7d - b.volume_7d
        })
      }
    } else if (this.sortMethod == 'feesh') {
      if (this.sortFeesAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.fee_24h - a.fee_24h
        })
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.fee_24h - b.fee_24h
        })
      }
    } else if (this.sortMethod == 'apy') {
      if (this.sortAPYAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.apy - a.apy
        })
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.apy - b.apy
        })
      }
    } else if (this.sortMethod == 'yliquidity') {
      if (this.sortCurrentAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.current - a.current
        })
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.current - b.current
        })
      }
    }

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

      if (!liquidityItem) {
        return
      }

      let lp = getPoolByLpMintAddress(value.lp_mint)

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
.ant-layout,
.ant-layout-content {
  background: @color-bg !important;
}

section {
  background: @color-bg !important;
}

.pool.container {
  max-width: 1350px;
  width: 100%;
  background: @color-bg;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;

  @media @max-t-mobile {
    margin-top: 0;
  }

  .planet-left {
    position: absolute;
    left: 0;
    top: 35%;

    @media @max-t-mobile {
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

                @media @max-t-mobile {
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

                @media @max-t-mobile {
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

            @media @max-t-mobile {
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

            @media @max-t-mobile {
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

          @media @max-t-mobile {
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
                background: @color-bg;
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

@media @max-t-mobile {
  body .pool.container {
    .card-body {
      overflow-x: unset !important;
    }

    .ant-collapse-content {
      background-color: @color-bg;
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
        background: @color-bg;
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
      border-bottom: 1px solid @color-bg;
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
      background: @color-bg;
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
      background: @color-bg;
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
  @media @max-t-mobile {
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
    @media @max-t-mobile {
      padding-right: 16px !important;
    }
    .ant-collapse-arrow {
      @media @max-t-mobile {
        right: 30px !important;
        z-index: 2;
      }
    }
  }
  .ant-collapse-content {
    @media @max-t-mobile {
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
    background: @color-bg !important;
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
      background: @color-bg;
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

      @media @max-t-mobile {
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
    background-color: @color-bg;
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
    background: @color-bg !important;
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
          background: @color-bg !important;
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

            @media @max-t-mobile {
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