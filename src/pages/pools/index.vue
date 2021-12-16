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
        <div v-if="showGuide" class="guide-card">
          <div class="guide-content">
            <label class="textL weightB">Learn about providing <br /> liquidity </label>
            <img 
              class="icon-cursor close-icon"
              src="@/assets/icons/close-circle-icon.svg"
              @click="() => { this.showGuide = false }"
            />
            <Row class="guide-detail">
              <Col span="14">
                <label class="textS weightS letterL">Check out our v3 LP walkthrough and migration guides.</label>
                <div class="learn-btn-container">
                  <Button class="learn-btn textS weightS letterL">Learn more</Button>
                </div>
              </Col>
              <Col span="10">
                <img src="@/assets/background/guide.svg" />
              </Col>
            </Row>
          </div>
        </div>

        <div class="page-head fs-container">
          <h3 class="title weightB">Liquidity Pools</h3>
          <div class="information">
            <div class="tvl-info">
              <p class="textL weightS">
                TVL : ${{ TVL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </p>
            </div>

            <div class="action-btn-group">
              <div
                class="reload-btn icon-cursor"
                :class="activeSpinning ? 'active' : ''"
                @click="reloadTimer"
              >
                <img src="@/assets/icons/reload.svg" />
              </div>

              <NuxtLink to="/pools/create-pool/" class="create-btn icon-cursor">
                <div class="create-plus-btn textS weightS">+ Create pool</div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="page-option-bar fs-container">
          <div class="option-tab-group">
            <div class="option-tab">
              <Button
                class="textL weightS"
                :class="!searchCertifiedFarm ? 'active-tab' : ''"
                @click="activeSearch('labelized')"
                >Labelized</Button
              >
              <div v-if="!searchCertifiedFarm" class="active-underline"></div>
            </div>
            <div class="option-tab">
              <Button
                class="textL weightS"
                :class="searchCertifiedFarm ? 'active-tab' : ''"
                @click="activeSearch('permissionless')"
              >
                Permissionless
              </Button>
              <div v-if="searchCertifiedFarm" class="active-underline"></div>
            </div>
            <div class="option-tab">
              <Button
                class="textL weightS"
                :class="stakedOnly ? 'active-tab' : ''"
                @click="activeSearch('deposit')"
              >
                <img class="deposit-icon" src="@/assets/icons/deposit.svg" />
                My Deposit
              </Button>
              <div v-if="stakedOnly" class="active-underline"></div>
            </div>
          </div>
          <div class="option-select-group">
            <div class="option-select fc-container icon-cursor">
              <img src="@/assets/icons/search.svg" />
            </div>
            <div
              class="option-select fc-container icon-cursor"
              @click="
                () => {
                  this.showSortMenu = !this.showSortMenu;
                }
              "
            >
              <span class="bodyM weightS option-select-sort fc-container">
                <label>Sort by:</label>
                <span class="sort-detail">
                  Liquidity (dsc)
                  <img
                    class="arrow-icon"
                    :class="showSortMenu ? 'up' : ''"
                    src="@/assets/icons/arrow-down.svg"
                  />
                </span>
              </span>
            </div>

            <div v-if="showSortMenu" class="option-select-menu">
              <div
                class="option-select-item textM weightS icon-cursor"
                :class="sortMethod === 'liquidity' && sortLiquidityAsc"
              >
                Liquidity A -> Z
              </div>
              <div
                class="option-select-item textM weightS icon-cursor"
                :class="sortMethod === 'liquidity' && !sortLiquidityAsc"
              >
                Liquidity Z -> A
              </div>
            </div>
          </div>
        </div>

        <div v-if="poolLoaded" class="noMobile pools-table">
          <Row class="pools-table-header">
            <Col class="header-column textS weightB text-left header-column-start" span="4"> Name </Col>
            <Col class="header-column textS weightB" span="3">
              <div class="header-column-title" @click="sortbyColumn('liquidity')">
                Liquidity
                <Icon
                  v-if="sortLiquidityAsc"
                  type="arrow-down"
                  :class="sortMethod === 'liquidity' ? 'sort-icon-active' : ''"
                />
                <Icon
                  v-else
                  type="arrow-up"
                  :class="sortMethod === 'liquidity' ? 'sort-icon-active' : ''"
                />
              </div>
            </Col>
            <Col class="header-column textS weightB" span="3">
              <div class="header-column-title" @click="sortbyColumn('volh')">
                Volume (24hrs)
                <Icon
                  v-if="sortVolHAsc"
                  type="arrow-down"
                  :class="sortMethod === 'volh' ? 'sort-icon-active' : ''"
                />
                <Icon
                  v-else
                  type="arrow-up"
                  :class="sortMethod === 'volh' ? 'sort-icon-active' : ''"
                />
              </div>
            </Col>
            <Col class="header-column textS weightB" span="3">
              <div class="header-column-title" @click="sortbyColumn('vold')">
                Volume (7d)
                <Icon
                  v-if="sortVolDAsc"
                  type="arrow-down"
                  :class="sortMethod === 'vold' ? 'sort-icon-active' : ''"
                />
                <Icon
                  v-else
                  type="arrow-up"
                  :class="sortMethod === 'vold' ? 'sort-icon-active' : ''"
                />
              </div>
            </Col>
            <Col class="header-column textS weightB" span="3">
              <div class="header-column-title" @click="sortbyColumn('feesh')">
                Fees (24 hrs)
                <Icon
                  v-if="sortFeesAsc"
                  type="arrow-down"
                  :class="sortMethod === 'feesh' ? 'sort-icon-active' : ''"
                />
                <Icon
                  v-else
                  type="arrow-up"
                  :class="sortMethod === 'feesh' ? 'sort-icon-active' : ''"
                />
              </div>
            </Col>
            <Col class="header-column textS weightB" span="3">
              <div class="header-column-title" @click="sortbyColumn('apy')">
                APY
                <Icon
                  v-if="sortAPYAsc"
                  type="arrow-down"
                  :class="sortMethod === 'apy' ? 'sort-icon-active' : ''"
                />
                <Icon
                  v-else
                  type="arrow-up"
                  :class="sortMethod === 'apy' ? 'sort-icon-active' : ''"
                />
              </div>
            </Col>
            <Col class="header-column textS weightB" span="2">
              <div class="header-column-title" @click="sortbyColumn('yliquidity')">
                Your Liquidity
                <Icon
                  v-if="sortCurrentAsc"
                  type="arrow-down"
                  :class="sortMethod === 'yliquidity' ? 'sort-icon-active' : ''"
                />
                <Icon
                  v-else
                  type="arrow-up"
                  :class="sortMethod === 'yliquidity' ? 'sort-icon-active' : ''"
                />
              </div>
            </Col>
          </Row>

          <div class="pools-table-body">
            <Row class="pools-table-item" v-for="data in poolsShow" :key="data.lp_mint">
              <Col class="state" span="4">
                <div class="lp-iconscontainer">
                  <div class="icons textL weightS">
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

              <Col class="state textM weightS" span="3">
                ${{ new TokenAmount(data.liquidity, 2, false).format() }}
              </Col>

              <Col class="state textM weightS" span="3">
                ${{ new TokenAmount(data.volume_24h, 2, false).format() }}
              </Col>
              <Col class="state textM weightS" span="3">
                ${{ new TokenAmount(data.volume_7d, 2, false).format() }}
              </Col>
              <Col class="state textM weightS" span="3">
                ${{ new TokenAmount(data.fee_24h, 2, false).format() }}
              </Col>
              <Col class="state textM weightS" span="3">
                {{ new TokenAmount(data.apy, 2, false).format() }}%
              </Col>
              <Col class="state textM weightS" span="3">
                ${{ new TokenAmount(data.current, 2, false).format() }}
              </Col>
              <Col class="state textM weightS" span="2">
                <div class="btn-container">
                  <Button class="btn-transparent textS weightB" @click="openPoolAddModal(data)">Add</Button>
                </div>
                <div class="btn-container">
                  <Button 
                    class="btn-primary textS weightB"
                    :disabled="!wallet.connected || !data.current"
                    @click="openUnstakeModal(data, data.lp, 1)"
                  >
                    Remove
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

        <!-- <div v-if="poolLoaded" class="noDesktop">
          <Collapse
            v-model="showCollapse"
            expand-icon-position="right"
            class="pools-table-mobile"
          >
            <CollapsePanel
              v-for="data in poolsShow"
              :key="data.lp_mint"
              v-show="true"
              :show-arrow="poolCollapse"
            >
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
                  <div class="liquidity-value">
                    ${{ new TokenAmount(data.current, 2, false).format() }}
                  </div>
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
        </div> -->

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
import { get, cloneDeep } from "lodash-es";
import { Vue, Component, Watch } from "nuxt-property-decorator";
import { mapState } from "vuex";
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
  Switch as Toggle,
} from "ant-design-vue";
import { getPoolByLpMintAddress, getAllCropperPools } from "@/utils/pools";
import { TokenAmount } from "@/utils/safe-math";
import { getBigNumber } from "@/utils/layouts";
import { addLiquidity, removeLiquidity } from "@/utils/liquidity";
import { LiquidityPoolInfo } from "@/utils/pools";
import { getUnixTs } from "@/utils";
import { DEVNET_MODE } from "../../utils/ids";
const CollapsePanel = Collapse.Panel;
const RadioGroup = Radio.Group;
const poolAdd = false;
const RadioButton = Radio.Button;
declare const window: any;
@Component({
  head: {
    title: "Cropper Finance Pools",
  },

  computed: {
    ...mapState([
      // 'wallet',
      "swap",
      "liquidity",
      "price",
      "url",
      "setting",
    ]),
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
      TVL: 0,
      currentPage: 1,
    };
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
    Pagination,
  },
  async asyncData({ $api }) {
    window.poolsDatas = {} as any;

    try {
      window.poolsDatas = await fetch("https://api.cropper.finance/pools/").then((res) =>
        res.json()
      );
    } catch {
      window.poolsDatas = [];
    } finally {
    }

    try {
      window.labelised = await fetch("https://api.cropper.finance/pool/").then((res) =>
        res.json()
      );
    } catch {
    } finally {
    }

    const pools = getAllCropperPools();
    return { pools };
  },
})
export default class Pools extends Vue {
  poolCollapse: any = true;
  showCollapse: any = [];
  pools: any = [];
  displayPoolID: any = 0;
  poolsShow: any = [];
  poolType: string = "RaydiumPools";
  fromCoin: any = false;
  staking: any = false;
  lp: any = false;
  TVL: any = 0;
  unstaking: any = false;
  wallet: any = this.$accessor.wallet;
  lpMintAddress: any = false;
  stakeModalOpening: any = false;
  unstakeModalOpening: any = false;
  toCoin: any = false;
  displayfilters: any = false;
  poolAdd: any = false;
  poolInf: any = false;
  lptoken: any = false;
  poolLoaded: any = false;
  autoRefreshTime: number = 60;
  countdown: number = 0;
  timer: any = null;
  timer_init: any = null;
  loading: boolean = false;
  stakedOnly: boolean = false;
  searchButton = true;
  searchName = "";
  totalCount = 110;
  pageSize = 50;
  currentPage = 1;
  searchCertifiedFarm: boolean = false;
  sortMethod: string = "liquidity";
  sortLiquidityAsc: boolean = true;
  sortVolHAsc: boolean = false;
  sortVolDAsc: boolean = false;
  sortFeesAsc: boolean = false;
  sortAPYAsc: boolean = false;
  sortCurrentAsc: boolean = false;
  activeSpinning: boolean = false;
  showGuide: boolean = true;
  showSortMenu: boolean = false;
  showSearchMenu: boolean = false;

  get liquidity() {
    this.$accessor.wallet.getTokenAccounts();
    return this.$accessor.liquidity;
  }
  @Watch("$accessor.liquidity.initialized", { immediate: true, deep: true })
  refreshThePage() {
    this.showPool(this.searchName, this.stakedOnly, this.currentPage);
  }
  @Watch("showCollapse", { immediate: true, deep: true }) handler() {
    if (!this.poolType && this.showCollapse.length > 0) {
      this.showCollapse.splice(0, this.showCollapse.length);
    }
  }
  @Watch("$accessor.liquidity.info", { immediate: true, deep: true })
  async onLiquidityChanged() {
    this.pools = this.poolsFormated();
    this.showPool(this.searchName, this.stakedOnly, this.currentPage);
  }

  @Watch("currentPage", { immediate: true, deep: true })
  async onpageChange(newPage: number) {
    this.showPool(this.searchName, this.stakedOnly, newPage);
  }

  @Watch("stakedOnly", { immediate: true, deep: true })
  async onStckChange(newStakedOnly: any) {
    this.showPool(this.searchName, newStakedOnly);
  }

  @Watch("searchName", { immediate: true, deep: true })
  async onSearchChange(newSearchName: string) {
    this.showPool(newSearchName, this.stakedOnly);
  }
  @Watch("searchCertifiedFarm", { immediate: true, deep: true })
  selectHandler(newSearchCertifiedFarm: boolean = false) {
    this.pools = this.poolsFormated();
    if (!newSearchCertifiedFarm) {
      //labelized
      this.pools = this.pools.filter((pool: any) => pool.labelized);
    } else if (newSearchCertifiedFarm) {
      //permissionless
      this.pools = this.pools.filter((pool: any) => !pool.labelized);
    }
    this.showPool(this.searchName, this.stakedOnly, this.currentPage);
  }

  sortbyColumn(col: string) {
    this.sortMethod = col;
    if (this.sortMethod == "liquidity") {
      if (this.sortLiquidityAsc) {
        this.sortLiquidityAsc = false;
      } else {
        this.sortLiquidityAsc = true;
      }
    } else if (this.sortMethod == "volh") {
      if (this.sortVolHAsc) {
        this.sortVolHAsc = false;
      } else {
        this.sortVolHAsc = true;
      }
    } else if (this.sortMethod == "vold") {
      if (this.sortVolDAsc) {
        this.sortVolDAsc = false;
      } else {
        this.sortVolDAsc = true;
      }
    } else if (this.sortMethod == "feesh") {
      if (this.sortFeesAsc) {
        this.sortFeesAsc = false;
      } else {
        this.sortFeesAsc = true;
      }
    } else if (this.sortMethod == "apy") {
      if (this.sortAPYAsc) {
        this.sortAPYAsc = false;
      } else {
        this.sortAPYAsc = true;
      }
    } else if (this.sortMethod == "yliquidity") {
      if (this.sortCurrentAsc) {
        this.sortCurrentAsc = false;
      } else {
        this.sortCurrentAsc = true;
      }
    }
    this.showPool(this.searchName, this.stakedOnly, this.currentPage);
  }

  showPool(searchName: any = "", stakedOnly: boolean = false, pageNum: any = 1) {
    const pool = [];

    this.pools = this.poolsFormated();

    if (!this.searchCertifiedFarm) {
      //labelized
      this.pools = this.pools.filter((pool: any) => pool.labelized);
    } else if (this.searchCertifiedFarm) {
      //permissionless
      this.pools = this.pools.filter((pool: any) => !pool.labelized);
    }

    // sort by column
    if (this.sortMethod == "liquidity") {
      if (this.sortLiquidityAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.liquidity - a.liquidity;
        });
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.liquidity - b.liquidity;
        });
      }
    } else if (this.sortMethod == "volh") {
      if (this.sortVolHAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.volume_24h - a.volume_24h;
        });
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.volume_24h - b.volume_24h;
        });
      }
    } else if (this.sortMethod == "vold") {
      if (this.sortVolDAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.volume_7d - a.volume_7d;
        });
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.volume_7d - b.volume_7d;
        });
      }
    } else if (this.sortMethod == "feesh") {
      if (this.sortFeesAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.fee_24h - a.fee_24h;
        });
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.fee_24h - b.fee_24h;
        });
      }
    } else if (this.sortMethod == "apy") {
      if (this.sortAPYAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.apy - a.apy;
        });
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.apy - b.apy;
        });
      }
    } else if (this.sortMethod == "yliquidity") {
      if (this.sortCurrentAsc) {
        this.pools.sort(function (a: any, b: any) {
          return b.current - a.current;
        });
      } else {
        this.pools.sort(function (a: any, b: any) {
          return a.current - b.current;
        });
      }
    }

    for (const item of this.pools) {
      pool.push(item);
    }
    this.poolsShow = pool;

    if (
      searchName != "" &&
      this.poolsShow.filter(
        (pool: any) =>
          (pool.ammId as string).toLowerCase() == (searchName as string).toLowerCase()
      ).length > 0
    ) {
      this.poolsShow = this.poolsShow.filter(
        (pool: any) =>
          (pool.ammId as string).toLowerCase() == (searchName as string).toLowerCase()
      );
    } else if (searchName != "") {
      this.poolsShow = this.poolsShow.filter((pool: any) =>
        (pool.nameSymbol as string)
          .toLowerCase()
          .includes((searchName as string).toLowerCase())
      );
    }

    if (stakedOnly) {
      this.poolsShow = this.poolsShow.filter((pool: any) => pool.current > 0.01);
    }

    this.currentPage = pageNum;

    this.totalCount = this.poolsShow.length;

    let max = this.poolsShow.length;
    let start = (this.currentPage - 1) * this.pageSize;
    let end =
      this.currentPage * this.pageSize < max ? this.currentPage * this.pageSize : max;
    this.poolsShow = this.poolsShow.slice(start, end);
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  openUnstakeModal(poolInfo: any, lp: any, lpBalance: any) {
    const coin = cloneDeep(lp);
    coin.balance = get(this.wallet.tokenAccounts, `${coin.mintAddress}.balance`);
    this.lp = coin;

    this.poolInf = cloneDeep(poolInfo);

    this.unstakeModalOpening = true;
  }

  cancelUnstake() {
    this.unstakeModalOpening = false;
  }

  unstake(amount: string) {
    this.unstaking = true;

    const conn = this.$web3;
    const wallet = (this as any).$wallet;
    const coin = this.poolInf.lp.coin;
    const pc = this.poolInf.lp.pc;
    const lp = this.poolInf.lp;

    const lpAccount = get(
      this.wallet.tokenAccounts,
      `${this.poolInf.lp.mintAddress}.tokenAccountAddress`
    );
    const fromCoinAccount = get(
      this.wallet.tokenAccounts,
      `${coin.mintAddress}.tokenAccountAddress`
    );
    const toCoinAccount = get(
      this.wallet.tokenAccounts,
      `${pc.mintAddress}.tokenAccountAddress`
    );

    const key = getUnixTs().toString();
    this.$notify.info({
      key,
      message: "Making transaction...",
      description: "",
      duration: 0,
    });

    const poolInfo = get(this.liquidity.infos, lp.mintAddress);
    //remove whole lp amount
    removeLiquidity(
      conn,
      wallet,
      poolInfo,
      lpAccount,
      fromCoinAccount,
      toCoinAccount,
      amount
    )
      .then((txid) => {
        this.$notify.info({
          key,
          message: "Transaction has been sent",
          description: (h: any) => h("div", ["Confirmation is in progress."]),
        });

        const description = `Remove liquidity for ${amount} LP Token`;

        this.$accessor.transaction.sub({ txid, description });
      })
      .catch((error) => {
        this.$notify.error({
          key,
          message: "Remove liquidity failed",
          description: error.message,
        });
      })
      .finally(() => {
        this.flush();
        this.$accessor.wallet.getTokenAccounts();
        this.unstaking = false;
        this.unstakeModalOpening = false;
      });
  }

  stake(fromCoinAmount: string, toCoinAmount: string, fixedCoin: string) {
    this.staking = true;

    const conn = this.$web3;
    const wallet = (this as any).$wallet;

    const poolInfo = get(this.liquidity.infos, this.poolInf.lp.mintAddress);

    const lpAccount = get(
      this.wallet.tokenAccounts,
      `${this.poolInf.lp.mintAddress}.tokenAccountAddress`
    );
    // @ts-ignore
    const fromCoinAccount = get(
      this.wallet.tokenAccounts,
      `${this.poolInf.lp.coin.mintAddress}.tokenAccountAddress`
    );
    // @ts-ignore
    const toCoinAccount = get(
      this.wallet.tokenAccounts,
      `${this.poolInf.lp.pc.mintAddress}.tokenAccountAddress`
    );

    const key = getUnixTs().toString();
    this.$notify.info({
      key,
      message: "Making transaction...",
      description: "",
      duration: 0,
    });
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
          message: "Transaction has been sent",
          description: (h: any) => h("div", ["Confirmation is in progress."]),
        });

        const description = `Add liquidity for ${fromCoinAmount} ${this.poolInf.lp.coin?.symbol} and ${toCoinAmount} ${this.poolInf.lp.pc?.symbol}`;
        this.$accessor.transaction.sub({ txid, description });

        let txStatus = this.$accessor.transaction.history[txid].status;
        while (txStatus === "Pending") {
          await this.delay(500);
          txStatus = this.$accessor.transaction.history[txid].status;
          await this.delay(500);
        }
        if (txStatus === "Fail") {
          console.log("add lp failed");
          return;
        }
        let amount = get(
          this.wallet.tokenAccounts,
          `${this.poolInf.lp.mintAddress}.balance`
        );
        //stake whole lp amount
        amount = amount.wei.toNumber() / Math.pow(10, amount.decimals);
        let delayTime = 0;
        while (amount <= 0 && delayTime < 10000) {
          //after 4 seconds ,it's failed
          await this.delay(200);
          delayTime += 200;
          amount = get(
            this.wallet.tokenAccounts,
            `${this.poolInf.lp.mintAddress}.balance`
          );
          amount = amount.wei.toNumber() / Math.pow(10, amount.decimals);
        }
        if (amount <= 0) {
          console.log("added lp amount is 0");
          return;
        }
      })
      .catch((error) => {
        this.$notify.error({
          key,
          message: "Add liquidity failed",
          description: error.message,
        });
      })
      .finally(async () => {
        this.flush();
        this.$accessor.wallet.getTokenAccounts();
        this.staking = false;
        this.stakeModalOpening = false;
      });
  }

  poolsFormated() {
    const conn = this.$web3;
    const wallet = (this as any).$accessor.wallet;
    const liquidity = (this as any).$accessor.liquidity;
    const price = (this as any).$accessor.price;

    const polo: any = [];

    getAllCropperPools().forEach(function (value: any) {
      const liquidityItem = get(liquidity.infos, value.lp_mint);

      if (!liquidityItem) {
        return;
      }

      let lp = getPoolByLpMintAddress(value.lp_mint);

      let newCoin = 0;
      let newPc = 0;

      if (
        !price.prices[liquidityItem?.coin.symbol as string] &&
        price.prices[liquidityItem?.pc.symbol as string]
      ) {
        price.prices[liquidityItem?.coin.symbol as string] =
          (price.prices[liquidityItem?.pc.symbol as string] *
            getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther())) /
          getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther());
        newCoin = 1;
      }

      if (
        !price.prices[liquidityItem?.pc.symbol as string] &&
        price.prices[liquidityItem?.coin.symbol as string]
      ) {
        price.prices[liquidityItem?.pc.symbol as string] =
          (price.prices[liquidityItem?.coin.symbol as string] *
            getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther())) /
          getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther());
        newPc = 1;
      }

      const liquidityCoinValue =
        getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther()) *
        price.prices[liquidityItem?.coin.symbol as string];
      const liquidityPcValue =
        getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther()) *
        price.prices[liquidityItem?.pc.symbol as string];

      let liquidityTotalValue = liquidityPcValue + liquidityCoinValue;
      if (price.prices[liquidityItem?.pc.symbol as string] == 1) {
        liquidityTotalValue = liquidityPcValue * 2;
      }

      const liquidityTotalSupply = getBigNumber(
        (liquidityItem?.lp.totalSupply as TokenAmount).toEther()
      );
      const liquidityItemValue = liquidityTotalValue / liquidityTotalSupply;

      value.liquidity = liquidityTotalValue;

      if (!window.poolsDatas) {
        window.poolsDatas = {};
      }

      if (window.poolsDatas[value.ammId]) {
        value.volume_24h = 0;
        if (
          window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress] &&
          window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress]["1day"]
        ) {
          value.volume_24h +=
            window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress]["1day"] *
            price.prices[liquidityItem?.coin.symbol as string];
        }

        if (
          window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress] &&
          window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress]["1day"]
        ) {
          value.volume_24h +=
            window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress]["1day"] *
            price.prices[liquidityItem?.pc.symbol as string];
        }
      } else {
        value.volume_24h = 0;
      }

      if (window.poolsDatas[value.ammId]) {
        value.volume_7d = 0;
        if (
          window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress] &&
          window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress]["7day"]
        ) {
          value.volume_7d +=
            window.poolsDatas[value.ammId][liquidityItem?.coin.mintAddress]["7day"] *
            price.prices[liquidityItem?.coin.symbol as string];
        }

        if (
          window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress] &&
          window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress]["7day"]
        ) {
          value.volume_7d +=
            window.poolsDatas[value.ammId][liquidityItem?.pc.mintAddress]["7day"] *
            price.prices[liquidityItem?.pc.symbol as string];
        }
      } else {
        value.volume_7d = 0;
      }

      if (window.poolsDatas[value.ammId]) {
        value.fee_24h = value.volume_24h * 0.003;
      } else {
        value.fee_24h = 0;
      }

      if (window.poolsDatas[value.ammId]) {
        value.apy = (value.fee_24h * 365 * 100) / liquidityTotalValue;
      } else {
        value.apy = 0;
      }

      value.nameSymbol = value.coin1.symbol + " - " + value.coin2.symbol;

      if (window.labelised.includes(value.ammId)) {
        value.labelized = 1;
      }

      if (liquidityPcValue != 0 && liquidityCoinValue != 0) {
        if (wallet) {
          value.current = get(wallet.tokenAccounts, `${value.lp_mint}.balance`);
          if (value.current) {
            value.current =
              (value.current.wei.toNumber() / Math.pow(10, value.current.decimals)) *
              liquidityItemValue;
          } else {
            value.current = 0;
          }
        } else {
          value.current = 0;
        }
        polo.push(value);
      }
    });
    return polo;
  }

  openPoolAddModal(poolInfo: any) {
    if (!this.wallet.connected) {
      this.$accessor.wallet.openModal();
    } else {
      this.poolInf = cloneDeep(poolInfo);
      const coinBalance = get(
        this.wallet.tokenAccounts,
        `${this.poolInf.coin1.mintAddress}.balance`
      );
      const pcBalance = get(
        this.wallet.tokenAccounts,
        `${this.poolInf.coin2.mintAddress}.balance`
      );
      this.poolInf.lp.coin.balance = coinBalance;
      this.poolInf.lp.pc.balance = pcBalance;
      this.stakeModalOpening = true;
    }
  }

  cancelPoolAdd() {
    this.fromCoin = null;
    this.toCoin = null;
    this.lptoken = null;
    this.lpMintAddress = null;
    this.stakeModalOpening = false;
  }

  mounted() {
    this.getTvl();
    this.$accessor.token.loadTokens();
    this.timer_init = setInterval(async () => {
      if (!this.poolLoaded) {
        await this.flush();
        if (this.pools.length > 0) {
          var hash = window.location.hash;
          if (hash) {
            hash = hash.substring(1);
            this.searchName = hash;
          } else {
            const query = new URLSearchParams(window.location.search);
            if (query.get("s")) this.searchName = query.get("s") as string;

            if (query.get("d")) this.displayPoolID = query.get("d") as string;
          }

          this.poolLoaded = true;
        }
      }
    }, 1000);
    this.setTimer();
  }

  setTimer() {
    this.timer = setInterval(async () => {
      if (!this.loading) {
        if (this.countdown < this.autoRefreshTime) {
          this.countdown += 1;
          if (this.countdown === this.autoRefreshTime) {
            await this.flush();
          }
        }
      }
    }, 1000);
  }

  async getTvl() {
    let cur_date = new Date().getTime();
    if (window.localStorage.TVL_last_updated) {
      const last_updated = parseInt(window.localStorage.TVL_last_updated);
      if (cur_date - last_updated <= 600000) {
        this.TVL = window.localStorage.TVL;
        return;
      }
    }

    let responseData: any = [];
    let tvl = 0;
    try {
      responseData = await fetch("https://api.cropper.finance/cmc/").then((res) =>
        res.json()
      );

      Object.keys(responseData).forEach(function (key) {
        if ((responseData as any)[key as any].tvl * 1 < 2000000) {
          tvl = tvl * 1 + (responseData as any)[key as any].tvl * 1;
        }
      });
    } catch {
      // dummy data
    } finally {
    }

    try {
      responseData = await fetch("https://api.cropper.finance/staking/").then((res) =>
        res.json()
      );
      tvl = tvl * 1 + (responseData as any).value * 1;
    } catch {
      // dummy data
    } finally {
    }

    this.TVL = Math.round(tvl);

    window.localStorage.TVL_last_updated = new Date().getTime();
    window.localStorage.TVL = this.TVL;
  }

  async flush() {
    this.loading = true;
    this.pools = this.poolsFormated();
    this.showPool(this.searchName, this.stakedOnly, this.currentPage);
    this.loading = false;
    this.countdown = 0;
  }

  getPoolByLpMintAddress = getPoolByLpMintAddress;
  TokenAmount = TokenAmount;

  reloadTimer() {
    this.activeSpinning = true;
    setTimeout(() => {
      this.activeSpinning = false;
    }, 1000);
    this.flush();
    this.$accessor.wallet.getTokenAccounts();
  }

  activeSearch(mode: string) {
    if (mode === "labelized") this.searchCertifiedFarm = false;
    else if (mode === "permissionless") this.searchCertifiedFarm = true;
    else if (mode === "deposit") this.stakedOnly = !this.stakedOnly;
  }
}
</script>

<style lang="less" scoped>
// global stylesheet
.btn-container {
  background: @gradient-btn-primary;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 48px;
  padding: 3px;
  width: 95px;
  height: auto;
}

.btn-transparent {
  background: transparent;
  padding: 4.5px 0;
  border-radius: 48px;
  border: none;
  width: 100%;
}

.btn-primary {
  background: rgba(23, 32, 88, 0.9);
  padding: 4.5px 0;
  border-radius: 48px;
  border: none;
  width: 100%;
  color: #fff;

  &:disabled {
    background: rgba(23, 32, 88, 0.9);
  }
}

// class stylesheet
.pool.container {
  margin-top: 38px;

  .card {
    .card-body {
      position: relative;
      padding: 0;

      .guide-card {
        width: 420px;
        position: absolute;
        top: 30vh;
        right: 0;
        padding: 18px;
        background: linear-gradient(215.52deg, #273592 0.03%, #23ADB4 99.97%);
        border-radius: 18px;
        z-index: 999;

        .guide-content {
          position: relative;

          .guide-detail {
            margin-top: 8px;

            .learn-btn-container {
              height: 45px;
              background: linear-gradient(190.83deg, #23A7B2 -119.02%, #273A93 86.38%);
              padding: 2px;
              border-radius: 48px;
              margin-top: 18px;
              width: fit-content;

              .learn-btn {
                height: 100%;
                background: linear-gradient(97.75deg, #280C86 -29.89%, #22B5B6 150.53%);
                border-radius: 48px;
                padding: 10.5px 23px;
                border: none;
              }
            }
          }

          .close-icon {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }

      .page-head {
        margin-top: 10px;

        .title {
          text-align: center;
          position: relative;
          float: left;
        }

        .information {
          display: flex;
          align-items: center;
          justify-content: space-around;

          .tvl-info {
            margin-right: 18px;
          }

          .action-btn-group {
            display: flex;
            align-items: center;

            .reload-btn {
              background: @color-blue600;
              border-radius: 8px;
              padding: 6px;
              margin-right: 18px;
              display: flex;
              align-items: center;
              justify-content: center;

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

            .create-btn {
              top: 20px;
              right: -90px;

              .create-plus-btn {
                background: @color-blue600;
                border-radius: 8px;
                padding: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;

                @media @max-lg-tablet {
                  display: none;
                }
              }
            }
          }
        }
      }

      .page-option-bar {
        margin: 38px 0;

        .option-tab-group {
          display: flex;

          .option-tab {
            margin-right: 48px;

            &:last-child {
              margin-right: 0;
            }

            button {
              background: transparent;
              border: none;
              outline: none;
              padding: 0;
              margin-bottom: 8px;

              &.active-tab {
                color: @color-petrol500;
              }

              .deposit-icon {
                margin-right: 8px;
              }
            }

            .active-underline {
              height: 4px;
              border-radius: 10px;
              background: @color-petrol400;
            }
          }
        }

        .option-select-group {
          position: relative;
          display: flex;
          align-items: center;

          .option-select {
            border: 2px solid @color-blue500;
            border-radius: 8px;
            padding: 6px 10px;
            height: 40px;

            &:first-child {
              margin-right: 18px;
            }

            .option-select-sort {
              letter-spacing: 0.15px;

              label {
                color: #eae8f1;
                opacity: 0.5;
                margin-right: 8px;
              }

              .sort-detail {
                display: flex;
                align-items: center;

                .arrow-icon {
                  margin-left: 8px;
                  transition: all 0.3s ease-in-out;

                  &.up {
                    transform: rotate(180deg);
                  }
                }
              }
            }
          }

          .option-select-menu {
            position: absolute;
            top: 50px;
            right: 0;
            background: @gradient-color-primary;
            background-origin: border-box;
            border: 2px solid rgba(255, 255, 255, 0.14);
            box-shadow: 18px 11px 14px rgba(0, 0, 0, 0.25);
            border-radius: 8px;
            z-index: 999;

            .option-select-item {
              padding: 16px 32px;
              border-bottom: 1px solid #c4c4c420;

              &:last-child {
                border-bottom: 0;
              }
            }
          }
        }
      }

      .pools-table {
        .pools-table-header {
          .header-column {
            text-align: center;
            padding: 16px 0;
            color: @color-neutral400;

            &.header-column-start {
              margin-left: 5px;
            }

            .header-column-title {
              cursor: pointer;
              display: flex;
              justify-content: center;

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
            display: flex;
            align-items: center;
            background: rgba(23, 32, 88, 0.9);
            border-radius: 8px;
            padding: 30px 18px;
            margin-bottom: 8px;

            &:last-child {
              margin-bottom: 0;
            }

            .state {
              text-align: center;
              
              .lp-iconscontainer {
                background: @gradient-color-outline;
                background-origin: border-box;
                padding: 2px;
                border-radius: 8px;
                width: fit-content;

                .icons {
                  position: relative;
                  display: block !important;
                  border-radius: 8px;
                  padding: 7px 10px;
                  white-space: nowrap;
                  background: @color-bg;
                  text-align: center;
                  height: 100%;
                  width: fit-content;

                  img {
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                  }
                }
              }

              .btn-container {
                margin: auto auto 8px auto;

                &:last-child {
                  margin-bottom: 0;
                }
              }
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
  }
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
        background: linear-gradient(
          97.63deg,
          #280c86 -29.92%,
          #22b5b6 103.89%
        ) !important;
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
  .page-option-bar {
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
