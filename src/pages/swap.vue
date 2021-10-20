<template>
  <div class="swapWrapper">
    <img src="@/assets/icons/greenPlanet2.svg" class="planetMiddle" />
    <div class="swapHead">
      <h1>Swap</h1>
      <div class="buttonGroup">
        <div class="count-down-group">
          <div class="count-down">
            <span v-if="autoRefreshTime - countdown < 10">0</span>
            {{ autoRefreshTime - countdown }}
            <div
              class="reload-btn"
              @click="
                () => {
                  getOrderBooks()
                  $accessor.wallet.getTokenAccounts()
                }
              "
            >
              <Icon type="loading" theme="outlined" />
            </div>
          </div>
        </div>
        <Tooltip placement="bottomLeft">
          <template slot="title">
            <div class="swap-info tooltipOne">
              <!-- <InputNumber
                type="number"
                style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.14); width: 200px"
                v-model="setting.slippage"
                @keypress="validateNumber"
              /> -->
              <input
                class="tooltip-input"
                id="number"
                type="number"
                min="1"
                max="100"
                v-model="setting.slippage"
                @keypress="validateNumber"
              />
            </div>
          </template>
          <button class="btn-grad">
            <!-- @click="$accessor.setting.open" -->
            <img src="@/assets/icons/setting.svg" />
            Swap Slippage
          </button>
        </Tooltip>
        <Tooltip placement="bottomLeft">
          <template slot="title">
            <div class="swap-info">
              <div v-if="fromCoin" class="info">
                <div class="action">
                  <a :href="`${url.explorer}/token/${fromCoin.mintAddress}`" target="_blank">
                    <img src="@/assets/icons/link_grey.svg" />
                  </a>
                   <img src="@/assets/icons/copy.png" @click="$accessor.copy(fromCoin.mintAddress)" />
                </div>
                <div class="symbol">{{ fromCoin.symbol }}</div>
                <div class="address">
                  {{ fromCoin.mintAddress.substr(0, 14) }}
                  ...
                  {{ fromCoin.mintAddress.substr(fromCoin.mintAddress.length - 14, 14) }}
                </div>
              </div>
              <div v-if="toCoin" class="info">
                <div class="action">
                  <a :href="`${url.explorer}/token/${toCoin.mintAddress}`" target="_blank">
                    <img src="@/assets/icons/link_grey.svg" />
                  </a>
                  <img src="@/assets/icons/copy.png" @click="$accessor.copy(toCoin.mintAddress)" />
                </div>
                <div class="symbol">{{ toCoin.symbol }}</div>
                <div class="address">
                  {{ toCoin.mintAddress.substr(0, 14) }}
                  ...
                  {{ toCoin.mintAddress.substr(toCoin.mintAddress.length - 14, 14) }}
                </div>
              </div>
              <div v-if="marketAddress" class="info">
                <div class="action">
                  <a v-if="!officialPool" :href="`${url.explorer}/account/${marketAddress}`" target="_blank">
                    <img src="@/assets/icons/link_grey.svg" />
                  </a>
                  <a v-else :href="`${url.trade}/${marketAddress}`" target="_blank">
                    <img src="@/assets/icons/link_grey.svg" />
                  </a>
                  <img src="@/assets/icons/copy.png" @click="$accessor.copy(marketAddress)" />
                </div>
                <div class="symbol">Market</div>
                <div class="address">
                  {{ marketAddress.substr(0, 14) }}
                  ...
                  {{ marketAddress.substr(marketAddress.length - 14, 14) }}
                </div>
              </div>
              <div v-if="mainAmmId && best_dex_type == 'single'" class="info">
                <div class="action">
                  <a :href="`${url.explorer}/account/${mainAmmId}`" target="_blank">
                    <img src="@/assets/icons/link_grey.svg" />
                  </a>
                   <img src="@/assets/icons/copy.png" @click="$accessor.copy(mainAmmId)" />
                </div>
                <div class="symbol">AMM ID</div>
                <div class="address">
                  {{ mainAmmId ? mainAmmId.substr(0, 14) : '' }}
                  ...
                  {{ mainAmmId ? mainAmmId.substr(mainAmmId.length - 14, 14) : '' }}
                </div>
              </div>
              <div v-if="best_dex_type == 'multi'" class="info">
                <p>Swaping via multistep scenario</p>
              </div>
              <div v-if="best_dex_type == 'multi'" class="info">
                <div class="action">
                  <a :href="`${url.explorer}/account/${mainAmmId}`" target="_blank">
                    <img src="@/assets/icons/link_grey.svg" />
                  </a>
                  <img src="@/assets/icons/copy.png" @click="$accessor.copy(mainAmmId)" />
                </div>
                <div class="symbol">{{ fromCoin.symbol + ' - ' + midTokenSymbol }}</div>
                <div class="address">
                  {{ mainAmmId ? mainAmmId.substr(0, 14) : '' }}
                  ...
                  {{ mainAmmId ? mainAmmId.substr(mainAmmId.length - 14, 14) : '' }}
                </div>
              </div>
              <div v-if="best_dex_type == 'multi'" class="info">
                <div class="action">
                  <a :href="`${url.explorer}/account/${extAmmId}`" target="_blank">
                    <img src="@/assets/icons/link_grey.svg" />
                  </a>
                  <img src="@/assets/icons/copy.png" @click="$accessor.copy(extAmmId)" />
                </div>
                <div class="symbol">{{ 'CRP - ' + toCoin.symbol }}</div>
                <div class="address">
                  {{ extAmmId ? extAmmId.substr(0, 14) : '' }}
                  ...
                  {{ extAmmId ? extAmmId.substr(extAmmId.length - 14, 14) : '' }}
                </div>
              </div>
            </div>
          </template>
          <button class="btn-grad">
            <img src="@/assets/icons/wow.svg" />
            Informations
          </button>
        </Tooltip>
      </div>
    </div>
    <div class="container">
      <CoinSelect v-if="coinSelectShow" @onClose="() => (coinSelectShow = false)" @onSelect="onCoinSelect" />
      <AmmIdSelect
        :show="ammIdSelectShow"
        :liquidity-list="ammIdSelectList"
        :user-close="true"
        @onClose="() => ((ammIdSelectShow = false), (ammIdSelectOld = true))"
        @onSelect="onAmmIdSelect"
      />

      <UnofficialPoolConfirmUser
        v-if="userCheckUnofficialShow"
        @onClose="() => (userCheckUnofficialShow = false)"
        @onSelect="onUserCheckUnofficialSelect"
      />

      <InputAmmIdOrMarket
        v-if="ammIdOrMarketSearchShow"
        @onClose="() => (ammIdOrMarketSearchShow = false)"
        @onInput="onAmmIdOrMarketInput"
      ></InputAmmIdOrMarket>

      <div class="card">
        <div class="card-body">
          <CoinInput
            v-model="fromCoinAmount"
            label="From"
            :balance-offset="fromCoin && fromCoin.symbol === 'SOL' ? -0.05 : 0"
            :mint-address="fromCoin ? fromCoin.mintAddress : ''"
            :coin-name="fromCoin ? fromCoin.symbol : ''"
            :balance="fromCoin ? fromCoin.balance : null"
            :show-half="true"
            @onInput="(amount) => (fromCoinAmount = amount)"
            @onFocus="
              () => {
                fixedFromCoin = true
              }
            "
            @onMax="
              () => {
                fixedFromCoin = true
                fromCoinAmount = fromCoin && fromCoin.balance ? fromCoin.balance.fixed() : '0'
              }
            "
            @onSelect="openFromCoinSelect"
          />

          <div class="change-side fc-container">
            <div class="fc-container" @click="changeCoinPosition">
              <Icon type="arrow-up" /><Icon type="arrow-down" />
            </div>
          </div>

          <CoinInput
            v-model="toCoinAmount"
            label="To (Estimate)"
            :mint-address="toCoin ? toCoin.mintAddress : ''"
            :coin-name="toCoin ? toCoin.symbol : ''"
            :balance="toCoin ? toCoin.balance : null"
            :show-max="false"
            :disabled="true"
            @onInput="(amount) => (toCoinAmount = amount)"
            @onFocus="
              () => {
                fixedFromCoin = false
              }
            "
            @onMax="
              () => {
                fixedFromCoin = false
                toCoinAmount = toCoin.balance.fixed()
              }
            "
            @onSelect="openToCoinSelect"
          />
          <div class="price-info" style="padding: 0 12px">
            <div v-if="fromCoin && toCoin && isWrap && fromCoinAmount" class="price-base fc-container">
              <span>
                1 {{ fromCoin.symbol }} = 1
                {{ toCoin.symbol }}
              </span>
            </div>
            <div v-else-if="fromCoin && toCoin && lpMintAddress && fromCoinAmount" class="price-base fc-container">
              <span>
                1 {{ hasPriceSwapped ? toCoin.symbol : fromCoin.symbol }} ≈
                {{ hasPriceSwapped ? (1 / outToPirceValue).toFixed(6) : outToPirceValue }}
                {{ hasPriceSwapped ? fromCoin.symbol : toCoin.symbol }}
                <Icon type="swap" @click="() => (hasPriceSwapped = !hasPriceSwapped)" />
              </span>
            </div>
            <div
              v-else-if="fromCoin && toCoin && marketAddress && market && asks && bids && fromCoinAmount"
              class="price-base fc-container"
            >
              <span>
                1 {{ hasPriceSwapped ? toCoin.symbol : fromCoin.symbol }} ≈
                {{ hasPriceSwapped ? (1 / outToPirceValue).toFixed(6) : outToPirceValue }}
                {{ hasPriceSwapped ? fromCoin.symbol : toCoin.symbol }}
                <Icon type="swap" @click="() => (hasPriceSwapped = !hasPriceSwapped)" />
              </span>
            </div>

            <div class="fs-container flexDiv pathway">
              <span class="name">
                <label>Pathway</label>
                <Tooltip placement="bottomLeft">
                  <template slot="title">
                    The maximum difference between your estimated price and execution price.
                  </template>
                  <img src="@/assets/icons/wow.svg" class="tooltipIcon" />
                </Tooltip>
              </span>
              <span v-if="fromCoin && toCoin" style="display: flex">
                <div class="coin-budge">
                  <CoinIcon :mint-address="fromCoin.mintAddress" />
                  <span>{{ fromCoin.symbol }}</span>
                </div>
                <Icon class="fst" type="arrow-up"/>
                <div class="coin-budge">
                  <CoinIcon :mint-address="toCoin.mintAddress" />
                  <span>{{ toCoin.symbol }}</span>
                </div>
              </span>
            </div>

            <div v-if="endpoint" class="fs-container flexDiv swapping">
              <span class="name">
                <label>Swapping Through</label>
                <Tooltip placement="bottomLeft">
                  <template slot="title"> This venue gave the best price for your trade </template>
                  <img src="@/assets/icons/wow.svg" class="tooltipIcon" />
                </Tooltip>
              </span>
              <div>
                <span
                  class="
                    swapThrough
                    {
                    green
                    :
                    endpoint
                    ===
                    'CropperFinace
                    Pool',
                    purple:
                    endpoint
                    ===
                    'Raydium
                    Pool',
                    cyan:
                    endpoint
                    ===
                    'Serum
                    orderbook'}
                  "
                >
                  {{ endpoint }}
                </span>
              </div>
            </div>

            <div class="fs-container flexDiv slippage">
              <span class="name">
                <label>Slippage Tolerance</label>
                <Tooltip placement="bottomLeft">
                  <template slot="title">
                    The maximum difference between your estimated price and execution price.
                  </template>
                  <img src="@/assets/icons/wow.svg" class="tooltipIcon" />
                </Tooltip>
              </span>
              <span class="name">
                <label>{{ $accessor.setting.slippage }}% </label></span
              >
            </div>

            <div v-if="fromCoin && toCoin && fromCoinAmount && toCoinWithSlippage" class="fs-container flexDiv minimum">
              <span class="name">
                <label>Minimum Received</label>
                <Tooltip placement="bottomLeft">
                  <template slot="title"> The least amount of tokens you will recieve on this trade </template>
                  <img src="@/assets/icons/wow.svg" class="tooltipIcon" />
                </Tooltip>
              </span>
              <span class="name"
                ><label> {{ toCoinWithSlippage }} {{ toCoin.symbol }} </label></span
              >
            </div>
            <!-- <div
              v-if="
                endpoint && endpoint.toLowerCase().includes('raydium') && fromCoin && fromCoin.symbol && fromCoinAmount
              "
              class="fs-container"
            >
              <span class="name">
                Liquidity Provider Fee
                <Tooltip placement="right">
                  <template slot="title">
                    A portion of each trade (0.x%) goes to liquidity providers as a protocol incentive
                  </template>
                  <Icon type="question-circle" /> </Tooltip
              ></span>
              <span> {{ Number(fromCoinAmount * x).toFixed(fromCoin.decimals) }} {{ fromCoin.symbol }} </span>
            </div>  Temporary-->
          </div>

          <div v-if="officialPool === false">
            <div style="margin: 10px">
              <div>AMM ID:</div>
              <div>
                {{ mainAmmId ? mainAmmId.substr(0, 14) : '' }}
                ...
                {{ mainAmmId ? mainAmmId.substr(mainAmmId.length - 14, 14) : '' }}
              </div>
            </div>
          </div>

          <div v-if="!wallet.connected" class="btncontainer">
            <Button size="large" ghost @click="$accessor.wallet.openModal"> Swap now </Button>
          </div>

          <div v-else-if="!(officialPool || (!officialPool && userCheckUnofficial))" class="btncontainer">
            <Button
              size="large"
              ghost
              @click="
                () => {
                  setTimeout(() => {
                    userCheckUnofficialShow = true
                  }, 1)
                }
              "
            >
              Confirm Risk Warning
            </Button>
          </div>

          <div v-else class="btncontainer">
            <Button
              size="large"
              ghost
              :disabled="
                !fromCoin ||
                !fromCoinAmount ||
                !toCoin ||
                !this.mainAmmId ||
                (!marketAddress && !lpMintAddress && !isWrap && !best_dex_type) ||
                !initialized ||
                loading ||
                gt(
                  fromCoinAmount,
                  fromCoin && fromCoin.balance
                    ? fromCoin.symbol === 'SOL'
                      ? fromCoin.balance.toEther().minus(0.05).toFixed(fromCoin.balance.decimals)
                      : fromCoin.balance.fixed()
                    : '0'
                ) || // not enough SOL to swap SOL to another coin
                (get(liquidity.infos, `${lpMintAddress}.status`) &&
                  get(liquidity.infos, `${lpMintAddress}.status`) !== 1) ||
                swaping ||
                (fromCoin.mintAddress === TOKENS.xCOPE.mintAddress && gt(5, fromCoinAmount)) ||
                (toCoin.mintAddress === TOKENS.xCOPE.mintAddress && gt(5, toCoinAmount))
              "
              :loading="swaping"
              style="width: 100%"
              :class="`swap-btn ${priceImpact > 10 ? '' : priceImpact > 5 ? '' : ''}`"
              @click="placeOrder"
            >
              <template v-if="!fromCoin || !toCoin"> Select a token</template>
              <template v-else-if="(!marketAddress && !lpMintAddress && !isWrap && !best_dex_type) || !initialized">
                Insufficient liquidity for this trade
              </template>
              <template v-else-if="!fromCoinAmount"> Enter an amount </template>
              <template v-else-if="loading"> Updating price information </template>
              <template
                v-else-if="
                  gt(
                    fromCoinAmount,
                    fromCoin && fromCoin.balance
                      ? fromCoin.symbol === 'SOL'
                        ? fromCoin.balance.toEther().minus(0.05).toFixed(fromCoin.balance.decimals)
                        : fromCoin.balance.fixed()
                      : '0'
                  )
                "
              >
                Insufficient {{ fromCoin.symbol }} balance
              </template>
              <template
                v-else-if="
                  get(liquidity.infos, `${lpMintAddress}.status`) &&
                  get(liquidity.infos, `${lpMintAddress}.status`) !== 1
                "
              >
                Pool coming soon
              </template>
              <template v-else-if="fromCoin.mintAddress === TOKENS.xCOPE.mintAddress && gt(5, fromCoinAmount)">
                xCOPE amount must greater than 5
              </template>
              <template v-else-if="toCoin.mintAddress === TOKENS.xCOPE.mintAddress && gt(5, toCoinAmount)">
                xCOPE amount must greater than 5
              </template>
              <template v-else>{{ isWrap ? 'Unwrap' : priceImpact > 5 ? 'Swap' : 'Swap' }}</template>
            </Button>
          </div>
          <div v-if="solBalance && +solBalance.balance.fixed() - 0.05 <= 0" class="not-enough-sol-alert">
            <span class="caution-text">Caution: Your SOL balance is low</span>

            <Tooltip placement="bottomLeft">
              <template slot="title">
                SOL is needed for Solana network fees. A minimum balance of 0.05 SOL is recommended to avoid failed
                transactions.
              </template>
              <Icon type="question-circle" />
            </Tooltip>
          </div>
        </div>
      </div>

      <div
        v-if="(!baseSymbol && !quoteSymbol && isFetchingUnsettled) || baseUnsettledAmount || quoteUnsettledAmount"
        class="card extra"
      >
        <div class="settle card-body">
          <div v-if="!baseSymbol && !quoteSymbol && isFetchingUnsettled" class="fetching-unsettled">
            <Spin :spinning="true">
              <Icon slot="indicator" type="loading" style="font-size: 24px" spin />
            </Spin>
            <span>Fetching info from market. Please wait.</span>
          </div>

          <table
            v-else-if="
              (baseSymbol && quoteSymbol && !isFetchingUnsettled && baseUnsettledAmount) || quoteUnsettledAmount
            "
            class="settel-panel"
          >
            <thead>
              <tr>
                <th colspan="2">You have unsettled balances:</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="baseSymbol && baseUnsettledAmount" class="row">
                <td>{{ baseSymbol }}</td>
                <td>{{ baseUnsettledAmount }}</td>
                <td class="align-right" rowspan="2">
                  <Button class="btn" :loading="isSettlingBase" ghost @click="settleFunds('base')">Settle</Button>
                </td>
              </tr>

              <tr v-if="quoteSymbol && quoteUnsettledAmount" class="row">
                <td>{{ quoteSymbol }}</td>
                <td>{{ quoteUnsettledAmount }}</td>
                <td v-if="!baseUnsettledAmount" class="align-right" rowspan="2">
                  <Button class="btn" :loading="isSettlingBase" ghost @click="settleFunds('base')">Settle</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Icon, Tooltip, Button, Progress, Spin, Select, InputNumber } from 'ant-design-vue'
import { cloneDeep, get } from 'lodash-es'
import { Market, Orderbook } from '@project-serum/serum/lib/market.js'
import { getTokenBySymbol, TokenInfo, NATIVE_SOL, TOKENS } from '@/utils/tokens'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import { getMultipleAccounts, commitment } from '@/utils/web3'
import { PublicKey } from '@solana/web3.js'
import { SERUM_PROGRAM_ID_V3 } from '@/utils/ids'
import {
  getOutAmount,
  getSwapOutAmount,
  place,
  swap,
  twoStepSwap,
  wrap,
  checkUnsettledInfo,
  settleFund
} from '@/utils/swap'
import { TokenAmount, gt } from '@/utils/safe-math'
import { getUnixTs } from '@/utils'
import { canWrap, getLiquidityInfoSimilar } from '@/utils/liquidity'
import {
  getLpListByTokenMintAddresses,
  getPoolListByTokenMintAddresses,
  findBestLP,
  isOfficalMarket,
  LiquidityPoolInfo
} from '@/utils/pools'
const CRP = getTokenBySymbol('CRP')
const ENDPOINT_SRM = 'Serum Dex'
const ENDPOINT_MONO = 'Mono-step Swap'
const ENDPOINT_CRP = 'CropperFinance Pool'
const ENDPOINT_RAY = 'Raydium Pool'
const ENDPOINT_MULTI_CRP = 'Two-Step Swap with CRP'
const ENDPOINT_MULTI_USDC = 'Two-Step Swap with USDC'
export default Vue.extend({
  components: {
    Icon,
    Tooltip,
    Button,
    Spin
  },
  data() {
    return {
      TOKENS,
      // should check if user have enough SOL to have a swap
      solBalance: null as TokenAmount | null,
      autoRefreshTime: 60,
      countdown: 0,
      marketTimer: null as any,
      initialized: false,
      loading: false,
      // swaping
      swaping: false,
      asks: {} as any,
      bids: {} as any,
      isFetchingUnsettled: false,
      unsettledOpenOrders: null as any,
      // whether have symbol will
      baseSymbol: '',
      baseUnsettledAmount: 0,
      isSettlingBase: false,
      quoteSymbol: '',
      quoteUnsettledAmount: 0,
      isSettlingQuote: false,
      coinSelectShow: false,
      selectFromCoin: true,
      fixedFromCoin: true,
      fromCoin: CRP as TokenInfo | null,
      toCoin: null as TokenInfo | null,
      fromCoinAmount: '',
      toCoinAmount: '',
      toCoinWithSlippage: '',
      midAmountWithSlippage: '', //multistep-swap
      // wrap
      isWrap: false,
      // serum
      market: null as any,
      marketAddress: '',
      // amm
      lpMintAddress: '',
      // trading endpoint
      endpoint: '',
      priceImpact: 0,
      coinBasePrice: true,
      outToPirceValue: 0,
      // whether user has toggle swap button
      hasPriceSwapped: false,
      officialPool: true,
      userCheckUnofficial: true,
      userCheckUnofficialMint: undefined as string | undefined,
      userCheckUnofficialShow: false,
      findUrlAmmId: false,
      mainAmmId: undefined as string | undefined,

      available_dex: [] as string[],
      best_dex_type: undefined as string | undefined,
      midTokenSymbol: undefined as string | undefined,

      extAmmId: undefined as string | undefined,
      ammIdSelectShow: false,
      ammIdSelectList: [] as LiquidityPoolInfo[] | [],
      ammIdSelectOld: false,
      ammIdOrMarketSearchShow: false,
      userNeedAmmIdOrMarket: undefined as string | undefined,
      setCoinFromMintLoading: false,
      asksAndBidsLoading: true,
      windowWidth: 0
    }
  },
  head: {
    title: 'CropperFinance Swap'
  },
  computed: {
    ...mapState(['wallet', 'swap', 'liquidity', 'url', 'setting'])
  },
  watch: {
    fromCoinAmount(newAmount: string, oldAmount: string) {
      this.$nextTick(() => {
        if (!inputRegex.test(escapeRegExp(newAmount))) {
          this.fromCoinAmount = oldAmount
        } else {
          this.updateAmounts()
        }
      })
    },
    'wallet.tokenAccounts': {
      handler(newTokenAccounts: any) {
        this.updateCoinInfo(newTokenAccounts)
        this.findMarket()
        if (this.mainAmmId) {
          this.needUserCheckUnofficialShow(this.mainAmmId)
        }
        if (this.market) {
          this.fetchUnsettledByMarket()
        }
        this.solBalance = this.wallet.tokenAccounts[NATIVE_SOL.mintAddress]
      },
      deep: true
    },
    fromCoin(newCoin, oldCoin) {
      if (
        !this.setCoinFromMintLoading &&
        (oldCoin === null || newCoin === null || newCoin.mintAddress !== oldCoin.mintAddress)
      ) {
        this.userNeedAmmIdOrMarket = undefined
        this.findMarket()
        this.fromCoinAmount = ''
        this.toCoinAmount = ''
        this.ammIdSelectOld = false
      }
    },
    baseUnsettledAmount() {
      this.isSettlingBase = false
    },
    quoteUnsettledAmount() {
      this.isSettlingQuote = false
    },
    toCoin(newCoin, oldCoin) {
      if (
        !this.setCoinFromMintLoading &&
        (oldCoin === null || newCoin === null || newCoin.mintAddress !== oldCoin.mintAddress)
      ) {
        this.userNeedAmmIdOrMarket = undefined
        this.findMarket()
        this.fromCoinAmount = ''
        this.toCoinAmount = ''
        this.ammIdSelectOld = false
      }
    },
    market() {
      this.baseSymbol = ''
      this.baseUnsettledAmount = 0
      this.quoteSymbol = ''
      this.quoteUnsettledAmount = 0
      this.unsettledOpenOrders = null as any
      this.fetchUnsettledByMarket()
    },
    marketAddress() {
      this.updateAmounts()
    },
    asks() {
      this.updateAmounts()
    },
    bids() {
      this.updateAmounts()
    },
    'liquidity.infos': {
      handler(_newInfos: any) {
        this.updateAmounts()
        const { from, to, ammId } = this.$route.query
        if (this.findUrlAmmId) {
          // @ts-ignore
          this.setCoinFromMint(ammId, from, to)
        }
        this.findMarket()
      },
      deep: true
    },
    'swap.markets': {
      handler(_newInfos: any) {
        this.findMarket()
      },
      deep: true
    },
    'setting.slippage': {
      handler() {
        this.updateAmounts()
      },
      deep: true
    }
  },
  mounted() {
    this.updateCoinInfo(this.wallet.tokenAccounts)
    this.setMarketTimer()
    const { from, to, ammId } = this.$route.query
    // @ts-ignore
    this.setCoinFromMint(ammId, from, to)
  },
  methods: {
    gt,
    get,
    validateNumber(event: { target: { value: number }; preventDefault: () => void }) {
      if (event.target.value > 10) {
        event.preventDefault()
      }
    },
    openFromCoinSelect() {
      this.selectFromCoin = true
      this.closeAllModal('coinSelectShow')
      setTimeout(() => {
        this.coinSelectShow = true
      }, 1)
    },
    openToCoinSelect() {
      this.selectFromCoin = false
      this.closeAllModal('coinSelectShow')
      setTimeout(() => {
        this.coinSelectShow = true
      }, 1)
    },
    onCoinSelect(tokenInfo: TokenInfo) {
      if (tokenInfo !== null) {
        if (this.selectFromCoin) {
          this.fromCoin = cloneDeep(tokenInfo)
          if (this.toCoin?.mintAddress === tokenInfo.mintAddress) {
            this.toCoin = null
            this.changeCoinAmountPosition()
          }
        } else {
          this.toCoin = cloneDeep(tokenInfo)
          if (this.fromCoin?.mintAddress === tokenInfo.mintAddress) {
            this.fromCoin = null
            this.changeCoinAmountPosition()
          }
        }
      } else {
        // check coin
        if (this.fromCoin !== null) {
          const newFromCoin = Object.values(TOKENS).find((item) => item.mintAddress === this.fromCoin?.mintAddress)
          if (newFromCoin === null || newFromCoin === undefined) {
            this.fromCoin = null
          }
        }
        if (this.toCoin !== null) {
          const newToCoin = Object.values(TOKENS).find((item) => item.mintAddress === this.toCoin?.mintAddress)
          if (newToCoin === null || newToCoin === undefined) {
            this.toCoin = null
          }
        }
      }
      this.coinSelectShow = false
    },
    setCoinFromMint(ammIdOrMarket: string | undefined, from: string | undefined, to: string | undefined) {
      this.setCoinFromMintLoading = true
      let fromCoin, toCoin
      try {
        this.findUrlAmmId = !this.liquidity.initialized
        this.userNeedAmmIdOrMarket = ammIdOrMarket
        // @ts-ignore
        // const liquidityUser = getLiquidityInfoSimilar(ammIdOrMarket, from, to)
        // if (liquidityUser) {
        //   if (from) {
        //     fromCoin = liquidityUser.coin.mintAddress === from ? liquidityUser.coin : liquidityUser.pc
        //     toCoin = liquidityUser.coin.mintAddress === fromCoin.mintAddress ? liquidityUser.pc : liquidityUser.coin
        //   }
        //   if (to) {
        //     toCoin = liquidityUser.coin.mintAddress === to ? liquidityUser.coin : liquidityUser.pc
        //     fromCoin = liquidityUser.coin.mintAddress === toCoin.mintAddress ? liquidityUser.pc : liquidityUser.coin
        //   }
        //   if (!(from && to)) {
        //     fromCoin = liquidityUser.coin
        //     toCoin = liquidityUser.pc
        //   }
        // }
        fromCoin = Object.values(TOKENS).find((item) => item.mintAddress === from)
        toCoin = Object.values(TOKENS).find((item) => item.mintAddress === to)
        if (fromCoin || toCoin) {
          if (fromCoin) {
            fromCoin.balance = get(this.wallet.tokenAccounts, `${fromCoin.mintAddress}.balance`)
            this.fromCoin = fromCoin
          }
          if (toCoin) {
            toCoin.balance = get(this.wallet.tokenAccounts, `${toCoin.mintAddress}.balance`)
            this.toCoin = toCoin
          }
        }
      } catch (error) {
        this.$notify.warning({
          message: error.message,
          description: ''
        })
      }
      setTimeout(() => {
        this.setCoinFromMintLoading = false
        this.findMarket()
      }, 1)
    },
    needUserCheckUnofficialShow(ammId: string) {
      if (!this.wallet.connected) {
        return
      }
      this.closeAllModal('userCheckUnofficialShow')
      setTimeout(() => {
        this.userCheckUnofficialShow = false
      }, 1)
    },
    onAmmIdSelect(liquidityInfo: LiquidityPoolInfo | undefined) {
      this.ammIdSelectShow = false
      if (liquidityInfo) {
        this.lpMintAddress = liquidityInfo.lp.mintAddress
        this.mainAmmId = liquidityInfo.ammId
        this.userNeedAmmIdOrMarket = this.mainAmmId
        this.officialPool = true
        this.findMarket()
      } else {
        this.ammIdSelectOld = true
        this.findMarket()
      }
    },
    onAmmIdOrMarketInput(ammIdOrMarket: string) {
      this.ammIdOrMarketSearchShow = false
      this.setCoinFromMint(ammIdOrMarket, undefined, undefined)
      this.findMarket()
    },
    onUserCheckUnofficialSelect(userSelect: boolean, userSelectAll: boolean) {
      this.userCheckUnofficialShow = false
      if (userSelect) {
        this.userCheckUnofficial = true
        this.userCheckUnofficialMint = this.mainAmmId
        if (userSelectAll) {
          const localCheckStr = localStorage.getItem(`${this.wallet.address}--checkAmmId`)
          if (localCheckStr) {
            localStorage.setItem(`${this.wallet.address}--checkAmmId`, localCheckStr + `---${this.mainAmmId}`)
          } else {
            localStorage.setItem(`${this.wallet.address}--checkAmmId`, `${this.mainAmmId}`)
          }
        }
      } else {
        this.fromCoin = null
        this.toCoin = null
        this.mainAmmId = undefined
        this.available_dex = []
        this.officialPool = true
      }
    },
    changeCoinPosition() {
      this.setCoinFromMintLoading = true
      const tempFromCoin = this.fromCoin
      const tempToCoin = this.toCoin
      const tempFromAmmId = this.mainAmmId
      const tempToAmmId = this.extAmmId
      setTimeout(() => {
        this.setCoinFromMintLoading = false
      }, 1)
      this.fromCoin = tempToCoin
      this.toCoin = tempFromCoin
      this.mainAmmId = tempToAmmId
      this.extAmmId = tempFromAmmId
      this.changeCoinAmountPosition()
    },
    changeCoinAmountPosition() {
      const tempFromCoinAmount = this.fromCoinAmount
      const tempToCoinAmount = this.toCoinAmount
      this.fromCoinAmount = tempToCoinAmount
      this.toCoinAmount = tempFromCoinAmount
    },
    updateCoinInfo(tokenAccounts: any) {
      if (this.fromCoin) {
        const fromCoin = tokenAccounts[this.fromCoin.mintAddress]
        if (fromCoin) {
          this.fromCoin = { ...this.fromCoin, ...fromCoin }
        }
      }
      if (this.toCoin) {
        const toCoin = tokenAccounts[this.toCoin.mintAddress]
        if (toCoin) {
          this.toCoin = { ...this.toCoin, ...toCoin }
        }
      }
    },
    findMarket() {
      this.available_dex = []
      this.lpMintAddress = ''
      this.initialized = true
      this.mainAmmId = undefined
      this.officialPool = true
      if (this.fromCoin && this.toCoin && this.liquidity.initialized) {
        const InputAmmIdOrMarket = this.userNeedAmmIdOrMarket
        // let userSelectFlag = false
        // wrap & unwrap
        if (canWrap(this.fromCoin.mintAddress, this.toCoin.mintAddress)) {
          this.isWrap = true
          this.initialized = true
          this.officialPool = true
          this.mainAmmId = undefined
          return
        }

        if (this.fromCoin.mintAddress && this.toCoin.mintAddress) {
          // serum market
          let marketAddress = ''
          for (const address of Object.keys(this.swap.markets)) {
            if (isOfficalMarket(address)) {
              const info = cloneDeep(this.swap.markets[address])
              let fromMint = this.fromCoin.mintAddress
              let toMint = this.toCoin.mintAddress
              if (fromMint === NATIVE_SOL.mintAddress) {
                fromMint = TOKENS.WSOL.mintAddress
              }
              if (toMint === NATIVE_SOL.mintAddress) {
                toMint = TOKENS.WSOL.mintAddress
              }
              if (
                (info.baseMint.toBase58() === fromMint && info.quoteMint.toBase58() === toMint) ||
                (info.baseMint.toBase58() === toMint && info.quoteMint.toBase58() === fromMint)
              ) {
                marketAddress = address
                break
              }
            }
          }
          if (marketAddress && this.marketAddress !== marketAddress) {
            this.isWrap = false
            this.marketAddress = marketAddress
            Market.load(this.$web3, new PublicKey(marketAddress), {}, new PublicKey(SERUM_PROGRAM_ID_V3)).then(
              (market) => {
                this.available_dex.push(ENDPOINT_SRM)
                this.market = market
                this.getOrderBooks()
              }
            )
          }

          // mono-step swap
          const lpList = getPoolListByTokenMintAddresses(
            this.fromCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.fromCoin.mintAddress,
            this.toCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.toCoin.mintAddress,
            typeof InputAmmIdOrMarket === 'string' ? InputAmmIdOrMarket : undefined
          )
          if (lpList.length > 0) {
            this.available_dex.push(ENDPOINT_MONO)
          }

          //two-step swap with CRP
          const lpList_crp_1 = getPoolListByTokenMintAddresses(
            this.fromCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.fromCoin.mintAddress,
            TOKENS.CRP.mintAddress,
            undefined
          )
          const lpList_crp_2 = getPoolListByTokenMintAddresses(
            TOKENS.CRP.mintAddress,
            this.toCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.toCoin.mintAddress,
            undefined
          )
          if (lpList_crp_1.length > 0 && lpList_crp_2.length > 0) {
            this.available_dex.push(ENDPOINT_MULTI_CRP)
          }

          //two-step swap with CRP
          const lpList_usdc_1 = getPoolListByTokenMintAddresses(
            this.fromCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.fromCoin.mintAddress,
            TOKENS.USDC.mintAddress,
            undefined
          )
          const lpList_usdc_2 = getPoolListByTokenMintAddresses(
            TOKENS.USDC.mintAddress,
            this.toCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.toCoin.mintAddress,
            undefined
          )
          if (lpList_usdc_1.length > 0 && lpList_usdc_2.length > 0) {
            this.available_dex.push(ENDPOINT_MULTI_USDC)
          }
        }
        this.updateUrl()
        this.updateAmounts()
      } else {
        this.mainAmmId = undefined
        this.endpoint = ''
        this.marketAddress = ''
        this.market = null
        this.lpMintAddress = ''
        this.isWrap = false
      }
    },
    getOrderBooks() {
      this.loading = true
      this.asksAndBidsLoading = true
      this.countdown = this.autoRefreshTime
      const conn = this.$web3
      if (this.marketAddress && get(this.swap.markets, this.marketAddress)) {
        const marketInfo = get(this.swap.markets, this.marketAddress)
        const { bids, asks } = marketInfo
        getMultipleAccounts(conn, [bids, asks], commitment)
          .then((infos) => {
            infos.forEach((info) => {
              // @ts-ignore
              const data = info.account.data
              const orderbook = Orderbook.decode(marketInfo, data)
              const { isBids, slab } = orderbook
              if (isBids) {
                this.bids = slab
              } else {
                this.asks = slab
              }
              this.asksAndBidsLoading = false
            })
          })
          .finally(() => {
            this.initialized = true
            this.loading = false
            this.countdown = 0
          })
      } else {
        this.loading = false
      }
    },
    updateAmounts() {
      let max_coinAmount = 0

      let toCoinAmount = ''
      // @ts-ignore
      let toCoinWithSlippage = null
      let price = 0
      let impact = 0
      let endpoint = ''
      let best_dex_type = undefined
      let midTokenSymbol = undefined
      if (this.fromCoin && this.toCoin && this.fromCoinAmount) {
        if (this.isWrap) {
          // wrap & unwrap
          this.toCoinAmount = this.fromCoinAmount
          return
        }
        this.available_dex.forEach((dex_type) => {
          if (dex_type == ENDPOINT_SRM) {
            if (this.marketAddress && this.market && this.asks && this.bids && !this.asksAndBidsLoading) {
              // serum
              const { amountOut, amountOutWithSlippage, priceImpact } = getOutAmount(
                this.market,
                this.asks,
                this.bids,
                // @ts-ignore
                this.fromCoin.mintAddress,
                // @ts-ignore
                this.toCoin.mintAddress,
                this.fromCoinAmount,
                this.setting.slippage
              )

              // @ts-ignore
              const out = new TokenAmount(amountOut, this.toCoin.decimals, false)
              // @ts-ignore
              const outWithSlippage = new TokenAmount(amountOutWithSlippage, this.toCoin.decimals, false)

              if (!out.isNullOrZero()) {
                // @ts-ignore
                if (!toCoinWithSlippage || toCoinWithSlippage.wei.isLessThan(outWithSlippage.wei)) {
                  if (max_coinAmount < parseFloat(out.fixed())) {
                    max_coinAmount = parseFloat(out.fixed())
                    toCoinAmount = out.fixed()
                    toCoinWithSlippage = outWithSlippage
                    price = +new TokenAmount(
                      parseFloat(toCoinAmount) / parseFloat(this.fromCoinAmount),
                      // @ts-ignore
                      this.toCoin.decimals,
                      false
                    ).fixed()
                    impact = priceImpact
                    endpoint = ENDPOINT_SRM
                    best_dex_type = 'dex'
                  }
                }
              }
            }
          } else if (dex_type == ENDPOINT_MONO) {
            // @ts-ignore
            const poolInfo = findBestLP(
              this.$accessor.liquidity.infos,
              this.fromCoin!.mintAddress,
              this.toCoin!.mintAddress,
              this.fromCoinAmount
            )
            this.mainAmmId = poolInfo.ammId
            const { amountOut, amountOutWithSlippage, priceImpact } = getSwapOutAmount(
              poolInfo,
              // @ts-ignore
              this.fromCoin!.mintAddress,
              // @ts-ignore
              this.toCoin!.mintAddress,
              this.fromCoinAmount,
              this.setting.slippage
            )
            if (!amountOut.isNullOrZero()) {
              if (max_coinAmount < parseFloat(amountOut.fixed())) {
                max_coinAmount = parseFloat(amountOut.fixed())

                toCoinAmount = amountOut.fixed()
                toCoinWithSlippage = amountOutWithSlippage
                price = +new TokenAmount(
                  parseFloat(toCoinAmount) / parseFloat(this.fromCoinAmount),
                  // @ts-ignore
                  this.toCoin.decimals,
                  false
                ).fixed()
                impact = priceImpact
                if (poolInfo.version == 5) endpoint = ENDPOINT_CRP
                else endpoint = ENDPOINT_RAY

                best_dex_type = 'single'
              }
            }
          } else if (dex_type == ENDPOINT_MULTI_CRP) {
            let midTokenMint = TOKENS.CRP.mintAddress

            // @ts-ignore
            const fromPoolInfo = findBestLP(
              this.$accessor.liquidity.infos,
              this.fromCoin!.mintAddress,
              midTokenMint,
              this.fromCoinAmount
            )
            this.mainAmmId = fromPoolInfo.ammId

            let { amountOut, amountOutWithSlippage, priceImpact } = getSwapOutAmount(
              fromPoolInfo,
              // @ts-ignore
              this.fromCoin!.mintAddress,
              midTokenMint,
              this.fromCoinAmount,
              this.setting.slippage
            )

            // @ts-ignore
            const toPoolInfo = findBestLP(
              this.$accessor.liquidity.infos,
              midTokenMint,
              this.toCoin!.mintAddress,
              amountOut.fixed()
            )
            this.extAmmId = toPoolInfo.ammId

            let final = getSwapOutAmount(
              toPoolInfo,
              midTokenMint,
              // @ts-ignore
              this.toCoin.mintAddress,
              amountOut.fixed(),
              this.setting.slippage
            )

            if (!final.amountOut.isNullOrZero()) {
              if (max_coinAmount < parseFloat(final.amountOut.fixed())) {
                max_coinAmount = parseFloat(final.amountOut.fixed())
                toCoinAmount = final.amountOut.fixed()
                toCoinWithSlippage = final.amountOutWithSlippage
                this.midAmountWithSlippage = amountOutWithSlippage.fixed()
                price = +new TokenAmount(
                  parseFloat(toCoinAmount) / parseFloat(this.fromCoinAmount),
                  // @ts-ignore
                  this.toCoin.decimals,
                  false
                ).fixed()
                impact = final.priceImpact
                endpoint = ENDPOINT_MULTI_CRP
                best_dex_type = 'multi'
                midTokenSymbol = 'CRP'
              }
            }
          } else if (dex_type == ENDPOINT_MULTI_USDC) {
            let midTokenMint = TOKENS.USDC.mintAddress

            // @ts-ignore
            const fromPoolInfo = findBestLP(
              this.$accessor.liquidity.infos,
              this.fromCoin!.mintAddress,
              midTokenMint,
              this.fromCoinAmount
            )
            this.mainAmmId = fromPoolInfo.ammId
            let { amountOut, amountOutWithSlippage, priceImpact } = getSwapOutAmount(
              fromPoolInfo,
              // @ts-ignore
              this.fromCoin.mintAddress,
              midTokenMint,
              this.fromCoinAmount,
              this.setting.slippage
            )

            // @ts-ignore
            const toPoolInfo = findBestLP(
              this.$accessor.liquidity.infos,
              midTokenMint,
              this.toCoin!.mintAddress,
              amountOut.fixed()
            )
            this.extAmmId = toPoolInfo.ammId

            let final = getSwapOutAmount(
              toPoolInfo,
              midTokenMint,
              // @ts-ignore
              this.toCoin.mintAddress,
              amountOut.fixed(),
              this.setting.slippage
            )

            if (!final.amountOut.isNullOrZero()) {
              if (max_coinAmount < parseFloat(final.amountOut.fixed())) {
                max_coinAmount = parseFloat(final.amountOut.fixed())
                toCoinAmount = final.amountOut.fixed()
                toCoinWithSlippage = final.amountOutWithSlippage
                this.midAmountWithSlippage = amountOutWithSlippage.fixed()
                const price = +new TokenAmount(
                  parseFloat(toCoinAmount) / parseFloat(this.fromCoinAmount),
                  // @ts-ignore
                  this.toCoin.decimals,
                  false
                ).fixed()
                impact = final.priceImpact
                endpoint = ENDPOINT_MULTI_USDC
                best_dex_type = 'multi'
                midTokenSymbol = 'USDC'
              }
            }
          }
        })
      }
      if (toCoinWithSlippage) {
        this.toCoinAmount = toCoinAmount
        // @ts-ignore
        this.toCoinWithSlippage = toCoinWithSlippage.fixed()
        this.outToPirceValue = price
        this.priceImpact = impact
        this.endpoint = endpoint
        this.best_dex_type = best_dex_type
        this.midTokenSymbol = midTokenSymbol
      } else {
        this.toCoinAmount = ''
        this.toCoinWithSlippage = ''
        this.outToPirceValue = 0
        this.priceImpact = 0
        this.endpoint = ''
      }
    },
    setMarketTimer() {
      this.marketTimer = setInterval(() => {
        if (!this.loading) {
          if (this.countdown < this.autoRefreshTime) {
            this.countdown += 1
            if (this.countdown === this.autoRefreshTime) {
              this.getOrderBooks()
              this.$accessor.wallet.getTokenAccounts()
              this.countdown = 0
            }
          }
        }
      }, 1000)
    },
    placeOrder() {
      this.swaping = true
      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })
      if (this.isWrap) {
        wrap(
          this.$axios,
          this.$web3,
          // @ts-ignore
          this.$wallet,
          // @ts-ignore
          this.fromCoin.mintAddress,
          // @ts-ignore
          this.toCoin.mintAddress,
          // @ts-ignore
          get(this.wallet.tokenAccounts, `${this.fromCoin.mintAddress}.tokenAccountAddress`),
          // @ts-ignore
          get(this.wallet.tokenAccounts, `${this.toCoin.mintAddress}.tokenAccountAddress`),
          this.fromCoinAmount
        )
          .then((txid) => {
            this.$notify.info({
              key,
              message: 'Transaction has been sent',
              description: (h: any) =>
                h('div', [
                  'Confirmation is in progress.  Check your transaction on ',
                  h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
                ])
            })
            const description = `Unwrap ${this.fromCoinAmount} ${this.fromCoin?.symbol} to ${this.toCoinAmount} ${this.toCoin?.symbol}`
            this.$accessor.transaction.sub({ txid, description })
          })
          .catch((error) => {
            this.$notify.error({
              key,
              message: 'Swap failed',
              description: error.message
            })
          })
          .finally(() => {
            this.swaping = false
          })
      } else if (this.endpoint === ENDPOINT_CRP || this.endpoint === ENDPOINT_RAY) {
        const poolInfo = Object.values(this.$accessor.liquidity.infos).find((p: any) => p.ammId === this.mainAmmId)
        swap(
          this.$web3,
          // @ts-ignore
          this.$wallet,
          poolInfo,
          // @ts-ignore
          this.fromCoin.mintAddress,
          // @ts-ignore
          this.toCoin.mintAddress,
          // @ts-ignore
          get(this.wallet.tokenAccounts, `${this.fromCoin.mintAddress}.tokenAccountAddress`),
          // @ts-ignore
          get(this.wallet.tokenAccounts, `${this.toCoin.mintAddress}.tokenAccountAddress`),
          this.fromCoinAmount,
          this.toCoinWithSlippage
        )
          .then((txid) => {
            this.$notify.info({
              key,
              message: 'Transaction has been sent',
              description: (h: any) =>
                h('div', [
                  'Confirmation is in progress.  Check your transaction on ',
                  h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
                ])
            })
            const description = `Swap ${this.fromCoinAmount} ${this.fromCoin?.symbol} to ${this.toCoinAmount} ${this.toCoin?.symbol}`
            this.$accessor.transaction.sub({ txid, description })
          })
          .catch((error) => {
            this.$notify.error({
              key,
              message: 'Swap failed',
              description: error.message
            })
          })
          .finally(() => {
            this.swaping = false
          })
      } else if (this.endpoint === ENDPOINT_MULTI_CRP || this.endpoint === ENDPOINT_MULTI_USDC) {
        const fromPoolInfo = Object.values(this.$accessor.liquidity.infos).find((p: any) => p.ammId === this.mainAmmId)
        const toPoolInfo = Object.values(this.$accessor.liquidity.infos).find((p: any) => p.ammId === this.extAmmId)
        const midTokenMint = this.endpoint === ENDPOINT_MULTI_CRP ? TOKENS.CRP.mintAddress : TOKENS.USDC.mintAddress
        twoStepSwap(
          this.$web3,
          // @ts-ignore
          this.$wallet,
          fromPoolInfo,
          toPoolInfo,
          // @ts-ignore
          this.fromCoin.mintAddress,
          // @ts-ignore
          midTokenMint,
          // @ts-ignore
          this.toCoin.mintAddress,
          // @ts-ignore
          get(this.wallet.tokenAccounts, `${this.fromCoin.mintAddress}.tokenAccountAddress`),
          // @ts-ignore
          get(this.wallet.tokenAccounts, `${midTokenMint}.tokenAccountAddress`),
          // @ts-ignore
          get(this.wallet.tokenAccounts, `${this.toCoin.mintAddress}.tokenAccountAddress`),
          this.fromCoinAmount,
          this.midAmountWithSlippage,
          this.toCoinWithSlippage
        )
          .then((txids) => {
            this.$notify.info({
              key,
              message: 'Transaction has been sent',
              description: (h: any) =>
                h('div', [
                  'Confirmation is in progress.  Check your transaction on ',
                  h('a', { attrs: { href: `${this.url.explorer}/tx/${txids[0]}`, target: '_blank' } }, 'here'),
                  h('a', { attrs: { href: `${this.url.explorer}/tx/${txids[1]}`, target: '_blank' } }, 'here')
                ])
            })
            const description_1 = `Swap ${this.fromCoinAmount} ${this.fromCoin?.symbol} to ${this.midAmountWithSlippage} ${TOKENS.CRP.symbol}`
            this.$accessor.transaction.sub({ txid: txids[0], description: description_1 })

            const description = `Swap ${this.midAmountWithSlippage} ${TOKENS.CRP.symbol} to ${this.toCoinAmount} ${this.toCoin?.symbol}`
            this.$accessor.transaction.sub({ txid: txids[0], description })
          })
          .catch((error) => {
            this.$notify.error({
              key,
              message: 'Swap failed',
              description: error.message
            })
          })
          .finally(() => {
            this.swaping = false
          })
      } else {
        place(
          this.$web3,
          // @ts-ignore
          this.$wallet,
          this.market,
          this.asks,
          this.bids,
          // @ts-ignore
          this.fromCoin.mintAddress,
          // @ts-ignore
          this.toCoin.mintAddress,
          // @ts-ignore
          get(this.wallet.tokenAccounts, `${this.fromCoin.mintAddress}.tokenAccountAddress`),
          // @ts-ignore
          get(this.wallet.tokenAccounts, `${this.toCoin.mintAddress}.tokenAccountAddress`),
          this.fromCoinAmount,
          this.setting.slippage
        )
          .then((txid) => {
            this.$notify.info({
              key,
              message: 'Transaction has been sent',
              description: (h: any) =>
                h('div', [
                  'Confirmation is in progress.  Check your transaction on ',
                  h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
                ])
            })
            const description = `Swap ${this.fromCoinAmount} ${this.fromCoin?.symbol} to ${this.toCoinAmount} ${this.toCoin?.symbol}`
            this.$accessor.transaction.sub({ txid, description })
          })
          .catch((error) => {
            this.$notify.error({
              key,
              message: 'Swap failed',
              description: error.message
            })
          })
          .finally(() => {
            this.swaping = false
          })
      }
    },
    async updateUrl() {
      if (this.$route.path !== '/swap/') {
        return
      }
      const { from, to } = this.$route.query
      // if (this.ammId) {
      //   await this.$router.push({
      //     path: '/swap/',
      //     query: {
      //       ammId: this.ammId
      //     }
      //   })
      // } else
      if (this.fromCoin && this.toCoin) {
        if (this.fromCoin.mintAddress !== from || this.toCoin.mintAddress !== to) {
          await this.$router.push({
            path: '/swap/',
            query: {
              from: this.fromCoin.mintAddress,
              to: this.toCoin.mintAddress
            }
          })
        }
      } else if (!(this.$route.query && Object.keys(this.$route.query).length === 0)) {
        await this.$router.push({
          path: '/swap/'
        })
      }
    },
    closeAllModal(showName: string) {
      if (showName !== 'coinSelectShow') {
        this.coinSelectShow = false
      }
      if (showName !== 'ammIdSelectShow') {
        this.ammIdSelectShow = false
      }
      if (showName !== 'userCheckUnofficialShow') {
        this.userCheckUnofficialShow = false
      }
      if (showName !== 'ammIdOrMarketSearchShow') {
        this.ammIdOrMarketSearchShow = false
      }
    },
    async fetchUnsettledByMarket() {
      if (this.isFetchingUnsettled) return
      if (!this.$web3 || !this.$wallet || !this.market) return
      this.isFetchingUnsettled = true
      try {
        const info = await checkUnsettledInfo(this.$web3, this.$wallet, this.market)
        if (!info) throw new Error('not enough data')
        this.baseSymbol = info.baseSymbol ?? ''
        this.baseUnsettledAmount = info.baseUnsettledAmount
        this.quoteSymbol = info.quoteSymbol ?? ''
        this.quoteUnsettledAmount = info.quoteUnsettledAmount
        this.unsettledOpenOrders = info.openOrders // have to establish an extra state, to store this value
      } catch (e) {
      } finally {
        this.isFetchingUnsettled = false
      }
    },
    settleFunds(from: 'base' | 'quote') {
      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })
      let baseMint = (this.market as Market).baseMintAddress.toBase58()
      let quoteMint = (this.market as Market).quoteMintAddress.toBase58()
      let baseWallet = get(this.wallet.tokenAccounts, `${baseMint}.tokenAccountAddress`)
      let quoteWallet = get(this.wallet.tokenAccounts, `${quoteMint}.tokenAccountAddress`)
      if (from === 'quote') {
        ;[baseWallet, quoteWallet] = [quoteWallet, baseWallet]
        ;[baseMint, quoteMint] = [quoteMint, baseMint]
      }
      if (from === 'quote') {
        this.isSettlingQuote = true
      } else {
        this.isSettlingBase = true
      }
      settleFund(
        this.$web3,
        this.market,
        this.unsettledOpenOrders,
        this.$wallet,
        baseMint,
        quoteMint,
        baseWallet,
        quoteWallet
      )
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })
          const description = `Settle`
          this.$accessor.transaction.sub({ txid, description })
        })
        .then(() => {
          this.fetchUnsettledByMarket()
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Settle failed',
            description: error.message
          })
          this.isSettlingQuote = false
          this.isSettlingBase = false
        })
    }
  }
})
</script>

<style lang="less" sxcoped>
//sxcoped
.warning-style {
  font-weight: bold;
  color: #f0b90b;
}
.swap-btn.warning-style {
  font-weight: normal;
}
.error-style {
  font-weight: bold;
  color: #ed4b9e;
}
.swap-btn.error-style {
  font-weight: normal;
}
main {
  background-image: unset;
  background-color: #01033c;
  background-size: cover;
  background-position: center bottom;
}
.planetMiddle {
  position: absolute;
  left: -150px;
  top: 446px;
  transform: rotate(90deg);
}
.btn-grad {
  background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
  border: 2px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  height: 62px;
  margin-left: 20px;
  width: 170px;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 42px;
  letter-spacing: -0.05em;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    margin: 10px 5px;
  }
}
.swapHead {
  align-items: center;
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
  h1 {
    // font-family: Gilroy;
    font-size: 64px;
    font-style: normal;
    font-weight: 700;
    line-height: 80px;
    letter-spacing: -0.05em;
    text-align: left;
  }
  .buttonGroup {
    display: flex;
    justify-content: space-between;
    top: -25px;
    position: relative;
  }
}
.count-down-group {
  background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
  height: 62px;
  border-radius: 63px;
  position: relative;
  padding-left: 2px;
  padding-right: 2px;
}
.count-down {
  background-color: #01033c;
  border-radius: 63px;
  height: 58px;
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
    text-align: center;
    cursor: pointer;
    .anticon {
      font-size: 16px !important;
      color: white !important;
    }
  }
}
.container {
  max-width: 662px; //550
  .card {
    background: rgba(236, 228, 228, 0.05);
    border-radius: 15px;
  }
  .price-info {
    display: grid;
    grid-auto-rows: auto;
    grid-row-gap: 8px;
    row-gap: 8px;
    padding: 0 12px;
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 6px;
    .anticon-swap {
      margin-left: 10px;
      padding: 5px;
    }
    .price-base {
      line-height: 24px;
      font-size: 18px;
      opacity: 0.5;
    }
    .fs-container {
      margin-top: 20px;
      .name {
        color: #fff;
        font-size: 18px;
        label {
          opacity: 0.5;
        }
        .tooltipIcon {
          margin-top: -15px;
          width: 15px;
        }
      }
      .swapThrough {
        text-transform: capitalize;
        border-radius: 5px;
        padding: 4px 8px;
      }
      .green {
        background: #0caf7f;
        border: solid 2px #0caf7f;
      }
      .purple {
        background: #69039c;
        border: solid 2px #69039c;
      }
      .cyan {
        background: #4db1c4;
        border: solid 2px #4db1c4;
      }
    }
  }
  .btncontainer {
    background: none;
    display: inline;
    width: unset;
    text-align: center;
    position: relative;
    max-width: 400px;
    margin: 10px auto;
    padding: 2px;
    max-height: 50px;
    border-radius: 8px;
    button {
      background: linear-gradient(315deg, #21bdb8 0%, #280684 100%) !important;
      border: 2px solid rgba(255, 255, 255, 0.14);
      position: relative;
      border-radius: 8px;
      border-color: transparent;
      color: white;
    }
  }
  .not-enough-sol-alert {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-bottom: -18px;
    margin-top: 4px;
  }
  .change-side {
    div {
      height: 32px;
      width: 32px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .fst {
    transform: rotate(90deg);
    margin: 8px;
  }
  .coin-budge {
    align-items: center;
    border: solid 1px;
    border-radius: 6px;
    display: flex;
    padding: 4px 8px;
    img {
      width: 13px;
      height: 13px;
      border-radius: 50%;
    }
    span {
      font-size: 14px;
      margin-left: 5px;
    }
  }
  .fetching-unsettled {
    margin: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #ffffffad;
    span {
      margin-top: 16px;
      text-align: center;
    }
  }
  .settle.card-body {
    padding: 16px 24px;
  }
  .extra {
    margin-top: 32px;
    margin-bottom: 32px;
    .settel-panel {
      .align-right {
        text-align: right;
      }
      th {
        font-weight: normal;
      }
      td {
        padding-bottom: 4px;
        width: 25%;
      }
      thead {
        font-size: 14px;
        tr:first-child {
          margin-top: 8px;
        }
      }
      tbody {
        tr:first-child {
          td {
            padding-top: 6px;
          }
        }
      }
    }
  }
}
.swapWrapper {
  max-width: 1350px;
  width: 100%;
  background: #01033c;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;
  margin-left: auto;
  margin-right: auto;

  .ant-layout {
    background: #000 !important;
  }
  button.ant-btn-background-ghost[disabled] {
    background: #80819D !important;
    border: 2px solid rgba(255, 255, 255, 0.14);
  }
  .ant-menu-horizontal > .ant-menu-item:hover,
  .ant-menu-horizontal > .ant-menu-submenu:hover,
  .ant-menu-horizontal > .ant-menu-item-active,
  .ant-menu-horizontal > .ant-menu-submenu-active,
  .ant-menu-horizontal > .ant-menu-item-open,
  .ant-menu-horizontal > .ant-menu-submenu-open,
  .ant-menu-horizontal > .ant-menu-item-selected,
  .ant-menu-horizontal > .ant-menu-submenu-selected {
    border-bottom: none !important;
  }
  .page-head {
    .title {
      font-weight: 600;
      font-size: 24px;
      line-height: 32px;
      text-align: center;
      display: inline-block;
      vertical-align: middle;
      padding-right: 10px;
      z-index: 2;
      padding-left: 15px;
      position: relative;
    }
    .buttons {
      &:hover {
        background: #1b2028;
      }
    }
  }
  .card {
    border: 1px solid #4d4d4d;
    .card-body {
      row-gap: 5px;
      width: 600px !important;
      background: none;
      > .fs-container {
        text-align: center;
      }
    }
  }
  .lp-icons {
    .icons {
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .ant-menu-horizontal,
  .ant-layout-header,
  .ant-layout-footer {
    background: #01033c !important;
  }
  .ant-layout-content {
    background: #01033c !important;
  }
}
.ant-tooltip-inner {
  background: linear-gradient(315deg, #21BDB8 0%, #280684 100%) !important;
  border: 2px solid rgba(255, 255, 255, 0.14);
  box-shadow: 18px 11px 14px rgb(0 0 0 / 25%);
  border-radius: 8px;
  display: inline-block;
  width: auto;
  color: #ffffff50 !important;

  .swap-info {
    .tooltip-input {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      width: 240px;
      outline: none;
      border-radius: 6px;
      font-size: 16px;
      padding: 10px 13px;
      line-height: 20px;
    }
    .info {
      border-radius: 6px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14);
      padding: 8px;
      margin-bottom: 10px;
      
      .symbol {
        font-size: 13px;
        line-height: 16px;
        font-weight: 700;
        opacity: 1;
        color: white;
      }

      .address {
        font-size: 13px;
        background: transparent;
        opacity: 1;
        color: white;
      }

      .action img {
        width: 15px;
        height: 15px;
        cursor: pointer;
      }
    }
  }
}
.ant-tooltip-arrow {
  display: none;
  // top: -8px !important;
  // width: 20px;
  // height: 20px;
}
// .ant-tooltip-arrow::before {
//   background-color: #271789 !important;
//   border-top: 2px solid rgba(255, 255, 255, 0.14);
//   border-left: 2px solid rgba(255, 255, 255, 0.14);
//   width: 10px;
//   height: 10px;
// }
// ******* Mobile *******
@media (max-width: 780px) {
  .swapWrapper {
    margin: auto;
    padding: 0;
    width: 375px;
    .planetMiddle {
      display: none;
    }
    .swapHead {
      margin: 22px;
      h1 {
        display: none;
      }
      .buttonGroup {
        .count-down-group {
          zoom: 0.66;
        }
        .btn-grad {
          height: 40px;
          margin-left: 5px;
          width: 120px;
          font-size: 11px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          img {
            margin: auto 0;
            width: 15px;
          }
        }
      }
    }
    .container {
      min-width: auto;
      padding: 22px !important;
      .card {
        border: 1px solid #4d4d4d;
        .card-body {
          padding: 20px 5px;
          width: auto !important;
          .price-info {
            font-size: 12px !important;
            .fs-container .name {
              font-size: 14px !important;
              .tooltipIcon {
                margin: 0 5px 0 0;
                width: 12px;
              }
            }
            .coin-budge {
              img {
                width: 15px;
              }
            }
            .flexDiv {
              display: block;
              border-bottom: 1px solid #4d4d4d;
              div {
                margin: 20px;
                float: right;
              }
            }
            .pathway {
              span:nth-of-type(2) {
                justify-content: center;
                margin: 20px;
              }
            }
            .slippage,
            .minimum {
              padding-bottom: 20px;
              justify-content: space-between;
              display: flex;
            }
          }
          .coin-select {
            .label {
              font-size: 14px;
            }
            .coin-input {
              .select-button {
                font-size: 12px;
                width: 120px;
              }
              .input-button {
                height: 25px;
                width: 40px;
                margin: 4px;
                button {
                  font-size: 12px;
                }
              }
              .main-input {
                height: 40px;
              }
            }
            input {
              font-size: 14px;
            }
          }
        }
      }
      .btncontainer {
        margin: 20px auto;
        .ant-btn-lg {
          font-size: 14px;
        }
      }
    }
  }
  .ant-notification {
    top: 100px !important;
    margin-left: 18px !important;
    height: 0;
    .ant-notification-notice {
      // background: #222262 !important;
      background: #FFFFFF10;
      border-radius: 14px;
    }
  }
  .ant-tooltip-placement-bottomLeft {
    .ant-tooltip-arrow {
      display: none;
    }
  }

  .ant-modal {
    max-width: 350px;

    .ant-modal-header {
      padding: 16px 12px;
    }
    .ant-modal-body {
      padding: 12px;
    }
  }
  .select-token .token-list .token-info {
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 10px;
    padding: 5px 10px !important;
    margin: 5px 0;
    background: rgba(255, 255, 255, 0.1) !important;
  }
}
// @media (max-width: 920px) {
//   .swapWrapper {
//     padding: 50px;
//     margin: 0 auto;
//   }
// }
</style>