<template>
  <div class="swap container">
    <img src="@/assets/icons/greenPlanet2.svg" class="planetMiddle" />
    <div class="page-head fs-container">
      <span class="title"> Swap </span>
      <span class="information">
        <div class="setting-btn-group">
          <div
            class="setting-btn-container"
            :class="this.showInformations ? 'active' : ''"
            @click="
              () => {
                this.showInformations = !this.showInformations
              }
            "
          >
            <div class="sort-by">
              <label class="label">
                <img class="info-icon" src="@/assets/icons/wow.svg" />
              </label>
            </div>
            <div v-if="showInformations" class="sort-options left">
              <div class="swap-info">
                Informations
                <div v-if="fromCoin" class="info">
                  <div class="action">
                    <a :href="`${url.explorer}/token/${fromCoin.mintAddress}`" target="_blank">
                      <img class="action-icon" src="@/assets/icons/link-icon.svg" />
                    </a>
                    <img
                      class="action-icon"
                      src="@/assets/icons/copy-icon.svg"
                      @click="$accessor.copy(fromCoin.mintAddress)"
                    />
                  </div>
                  <div class="symbol">{{ fromCoin.symbol }}</div>
                  <div class="address">
                    {{ fromCoin.mintAddress.substr(0, 14) }}
                    ...
                    <!-- {{ fromCoin.mintAddress.substr(fromCoin.mintAddress.length - 14, 14) }} -->
                  </div>
                </div>
                <div v-if="toCoin" class="info">
                  <div class="action">
                    <a :href="`${url.explorer}/token/${toCoin.mintAddress}`" target="_blank">
                      <img class="action-icon" src="@/assets/icons/link-icon.svg" />
                    </a>
                    <img
                      class="action-icon"
                      src="@/assets/icons/copy-icon.svg"
                      @click="$accessor.copy(toCoin.mintAddress)"
                    />
                  </div>
                  <div class="symbol">{{ toCoin.symbol }}</div>
                  <div class="address">
                    {{ toCoin.mintAddress.substr(0, 14) }}
                    ...
                    <!-- {{ toCoin.mintAddress.substr(toCoin.mintAddress.length - 14, 14) }} -->
                  </div>
                </div>
                <div v-if="marketAddress" class="info">
                  <div class="action">
                    <a v-if="!officialPool" :href="`${url.explorer}/account/${marketAddress}`" target="_blank">
                      <img class="action-icon" src="@/assets/icons/link-icon.svg" />
                    </a>
                    <a v-else :href="`${url.trade}/${marketAddress}`" target="_blank">
                      <img class="action-icon" src="@/assets/icons/link-icon.svg" />
                    </a>
                    <img
                      class="action-icon"
                      src="@/assets/icons/copy-icon.svg"
                      @click="$accessor.copy(marketAddress)"
                    />
                  </div>
                  <div class="symbol">Market</div>
                  <div class="address">
                    {{ marketAddress.substr(0, 14) }}
                    ...
                    <!-- {{ marketAddress.substr(marketAddress.length - 14, 14) }} -->
                  </div>
                </div>
                <div v-if="mainAmmId && best_dex_type == 'single'" class="info">
                  <div class="action">
                    <a :href="`${url.explorer}/account/${mainAmmId}`" target="_blank">
                      <img class="action-icon" src="@/assets/icons/link-icon.svg" />
                    </a>
                    <img class="action-icon" src="@/assets/icons/copy-icon.svg" @click="$accessor.copy(mainAmmId)" />
                  </div>
                  <div class="symbol">AMM ID</div>
                  <div class="address">
                    {{ mainAmmId ? mainAmmId.substr(0, 14) : '' }}
                    ...
                    <!-- {{ mainAmmId ? mainAmmId.substr(mainAmmId.length - 14, 14) : '' }} -->
                  </div>
                </div>
                <div v-if="best_dex_type == 'multi'" class="info">
                  <p>Swaping via multistep scenario</p>
                </div>
                <div v-if="best_dex_type == 'multi'" class="info">
                  <div class="action">
                    <a :href="`${url.explorer}/account/${mainAmmId}`" target="_blank">
                      <img class="action-icon" src="@/assets/icons/link-icon.svg" />
                    </a>
                    <img class="action-icon" src="@/assets/icons/copy-icon.svg" @click="$accessor.copy(mainAmmId)" />
                  </div>
                  <div class="symbol">{{ fromCoin.symbol + ' - ' + midTokenSymbol }}</div>
                  <div class="address">
                    {{ mainAmmId ? mainAmmId.substr(0, 14) : '' }}
                    ...
                    <!-- {{ mainAmmId ? mainAmmId.substr(mainAmmId.length - 14, 14) : '' }} -->
                  </div>
                </div>
                <div v-if="best_dex_type == 'multi'" class="info">
                  <div class="action">
                    <a :href="`${url.explorer}/account/${extAmmId}`" target="_blank">
                      <img class="action-icon" src="@/assets/icons/link-icon.svg" />
                    </a>
                    <img class="action-icon" src="@/assets/icons/copy-icon.svg" @click="$accessor.copy(extAmmId)" />
                  </div>
                  <div class="symbol">{{ midTokenSymbol + ' - ' + toCoin.symbol }}</div>
                  <div class="address">
                    {{ extAmmId ? extAmmId.substr(0, 14) : '' }}
                    ...
                    <!-- {{ extAmmId ? extAmmId.substr(extAmmId.length - 14, 14) : '' }} -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="setting-btn-container"
            :class="this.showSlippage ? 'active' : ''"
            @click="
              () => {
                this.showSlippage = !this.showSlippage
              }
            "
          >
            <div class="sort-by">
              <label class="label">
                <img class="setting-icon" src="@/assets/icons/setting.svg" />
              </label>
            </div>
            <div v-if="showSlippage" class="sort-options right">
              Swap Slippage
              <div class="swap-info tooltipOne">
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
            </div>
          </div>
        </div>
        <div class="my-info">
          <label>
            TVL : <b>{{ TVL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} $</b>
          </label>
        </div>

        <!-- {{ autoRefreshTime - countdown }} -->

        <div class="reload-btn" :class="activeSpinning ? 'active' : ''" @click="reloadTimer">
          <img class="load-icon" src="@/assets/icons/loading.svg" />
        </div>
      </span>
    </div>
    <div class="swap-content">
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
            label="To (estimate)"
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
            <div v-else-if="fromCoin && toCoin && !isWrap && fromCoinAmount" class="price-base fc-container">
              <span>
                1 {{ hasPriceSwapped ? toCoin.symbol : fromCoin.symbol }} ≈
                {{ hasPriceSwapped ? (1 / outToPirceValue).toFixed(6) : outToPirceValue }}
                {{ hasPriceSwapped ? fromCoin.symbol : toCoin.symbol }}
                <img
                  src="@/assets/icons/swap-icon.svg"
                  @click="() => (hasPriceSwapped = !hasPriceSwapped)"
                  class="swap-icon"
                />
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
                <img
                  src="@/assets/icons/swap-icon.svg"
                  @click="() => (hasPriceSwapped = !hasPriceSwapped)"
                  class="swap-icon"
                />
              </span>
            </div>

            <div class="fs-container flexDiv pathway">
              <span class="name">
                <label>Pathway</label>
                <Tooltip placement="bottomLeft">
                  <template slot="title">
                    This trade routes though the following tokens to give you the best price
                  </template>
                  <img src="@/assets/icons/wow.svg" class="tooltipIcon" />
                </Tooltip>
              </span>
              <span v-if="fromCoin && toCoin" style="display: flex">
                <div class="coin-budge">
                  <CoinIcon :mint-address="fromCoin.mintAddress" />
                  <span>{{ fromCoin.symbol }}</span>
                </div>
                <Icon class="fst" type="arrow-up" />
                <div class="coin-budge" v-if="midTokenSymbol">
                  <CoinIcon :mint-address="midTokenMint" />
                  <span>{{ midTokenSymbol }}</span>
                </div>
                <Icon v-if="midTokenSymbol" class="fst" type="arrow-up" />
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
                  <template slot="title"> This venue gave the best price for this trade </template>
                  <img src="@/assets/icons/wow.svg" class="tooltipIcon" />
                </Tooltip>
              </span>
              <div v-if="endpoint == endpoint_multi_crp || endpoint == endpoint_multi_usdc">
                <span class="swapThrough green">
                  {{ sub_endpoint_1 }}
                </span>
                <span v-if="sub_endpoint_1 != sub_endpoint_2" class="swapThrough purple">
                  {{ sub_endpoint_2 }}
                </span>
              </div>
              <div v-else>
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
                    The maximum difference between your estimate price and execution price
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
                  <template slot="title"> The least amount of tokens you will receive for this trade </template>
                  <img src="@/assets/icons/wow.svg" class="tooltipIcon" />
                </Tooltip>
              </span>
              <span class="name">
                <label> {{ toCoinWithSlippage }} {{ toCoin.symbol }} </label>
              </span>
            </div>

            <div v-if="priceImpact" class="fs-container flexDiv minimum">
              <span class="name">
                <label :class="`price-impact-${priceImpact > 5 ? 'red' : priceImpact > 2 ? 'orange' : 'white'}`"
                  >Price Impact</label
                >
                <Tooltip placement="bottomLeft">
                  <template slot="title">
                    The difference between the market price and estimated price due to trade size
                  </template>
                  <img src="@/assets/icons/wow.svg" class="tooltipIcon" />
                </Tooltip>
              </span>
              <span
                class="name"
                :class="`price-impact-${priceImpact > 5 ? 'red' : priceImpact > 2 ? 'orange' : 'white'}`"
              >
                <label> {{ priceImpact.toFixed(2) }}% </label>
              </span>
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
            <Button size="large" ghost @click="$accessor.wallet.openModal"> Swap </Button>
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
                checkFromCoinAmount() || // not enough SOL to swap SOL to another coin
                (get(liquidity.infos, `${lpMintAddress}.status`) &&
                  get(liquidity.infos, `${lpMintAddress}.status`) !== 1) ||
                swaping ||
                (fromCoin.mintAddress === TOKENS.xCOPE.mintAddress && gt(5, fromCoinAmount)) ||
                (toCoin.mintAddress === TOKENS.xCOPE.mintAddress && gt(5, toCoinAmount))
              "
              :loading="swaping"
              style="width: 100%"
              :class="`swap-btn ${priceImpact > 5 ? '' : priceImpact > 2 ? '' : ''}`"
              @click="placeOrder"
            >
              <template v-if="!fromCoin || !toCoin"> Select</template>
              <template v-else-if="(!marketAddress && !lpMintAddress && !isWrap && !best_dex_type) || !initialized">
                Insufficient liquidity for this trade
              </template>
              <template v-else-if="!fromCoinAmount"> Enter an amount </template>
              <template v-else-if="loading"> Updating price information </template>
              <template v-else-if="checkFromCoinAmount()"> Insufficient {{ fromCoin.symbol }} balance </template>
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
              <template v-else-if="best_dex_type === 'multi' && (needWrapSol() || needCreateTokens())"
                >Prepare two-step swap</template
              >
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
import { Icon, Tooltip, Button, Spin } from 'ant-design-vue'
import { cloneDeep, get } from 'lodash-es'
import { Market, Orderbook } from '@project-serum/serum/lib/market.js'
import { getTokenBySymbol, TokenInfo, NATIVE_SOL, TOKENS } from '@/utils/tokens'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import { getMultipleAccounts, commitment } from '@/utils/web3'
import { PublicKey } from '@solana/web3.js'
import { SERUM_PROGRAM_ID_V3, ENDPOINT_CRP, ENDPOINT_RAY, ENDPOINT_SRM } from '@/utils/ids'
import {
  getOutAmount,
  getSwapOutAmount,
  place,
  swap,
  twoStepSwap,
  wrap,
  checkUnsettledInfo,
  settleFund,
  prepareTwoStepSwap
} from '@/utils/swap'
import BigNumber from 'bignumber.js'
import { TokenAmount, gt } from '@/utils/safe-math'
import { getUnixTs } from '@/utils'
import { canWrap, getLiquidityInfoSimilar } from '@/utils/liquidity'
import { getPoolLocation } from '@/utils/pools'

import {
  getLpListByTokenMintAddresses,
  getPoolListByTokenMintAddresses,
  getCropperPoolListByTokenMintAddresses,
  getRaydiumPoolListByTokenMintAddresses,
  findBestLP,
  findBestCropperLP,
  isOfficalMarket,
  LiquidityPoolInfo
} from '@/utils/pools'

const ENDPOINT_MULTI_CRP = 'Two-Step Swap with CRP'
const ENDPOINT_MULTI_USDC = 'Two-Step Swap with USDC'
const ENDPOINT_MULTI_CRP_MIXED = 'Mixed two-Step Swap with CRP '
const ENDPOINT_MULTI_USDC_MIXED = 'Mixed Two-Step Swap with USDC'

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
      fromCoin: null as TokenInfo | null,
      toCoin: null as TokenInfo | null,
      fromCoinAmount: '',
      toCoinAmount: '',
      toCoinWithSlippage: '',
      midAmount: '', //multistep-swap
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
      mainAmmId: undefined as string | undefined,

      available_dex: [] as string[],
      best_dex_type: undefined as string | undefined,
      midTokenSymbol: undefined as string | undefined,
      midTokenMint: undefined as string | undefined,
      extAmmId: undefined as string | undefined,
      ammIdSelectShow: false,
      ammIdSelectList: [] as LiquidityPoolInfo[] | [],
      ammIdSelectOld: false,
      ammIdOrMarketSearchShow: false,
      userNeedAmmIdOrMarket: undefined as string | undefined,
      setCoinFromMintLoading: false,
      asksAndBidsLoading: true,
      windowWidth: 0,
      // endpoint_crp: 'CropperFinance Pool',
      // endpoint_ray: 'Raydium Pool',
      sub_endpoint_1: undefined as string | undefined,
      sub_endpoint_2: undefined as string | undefined,

      endpoint_multi_crp: 'Two-Step Swap with CRP',
      endpoint_multi_usdc: 'Two-Step Swap with USDC',
      TVL: 0 as number,
      activeSpinning: false as boolean,
      showInformations: false as boolean,
      showSlippage: false as boolean
    }
  },
  head: {
    title: 'CropperFinance Swap'
  },
  computed: {
    ...mapState(['wallet', 'swap', 'liquidity', 'url', 'setting', 'token'])
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
        this.flush()
      },
      deep: true
    },
    fromCoin(newCoin, oldCoin) {
      if (
        !this.setCoinFromMintLoading &&
        (oldCoin === null || newCoin === null || newCoin.mintAddress !== oldCoin.mintAddress)
      ) {
        this.userNeedAmmIdOrMarket = undefined
        this.best_dex_type = undefined
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
        this.best_dex_type = undefined
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
        // @ts-ignore
        this.setCoinFromMint(ammId, from, to)
        this.findMarket()
      },
      deep: true
    },
    'token.initialized': {
      handler(newState: boolean) {
        this.fromCoin = getTokenBySymbol('CRP')
        const { from, to, ammId } = this.$route.query
        // @ts-ignore
        this.setCoinFromMint(ammId, from, to)
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
    this.getTvl()
    this.$accessor.token.loadTokens()
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
    async getTvl() {
      let cur_date = new Date().getTime()
      if (window.localStorage.TVL_last_updated) {
        const last_updated = parseInt(window.localStorage.TVL_last_updated)
        if (cur_date - last_updated <= 600000) {
          this.TVL = window.localStorage.TVL
          return
        }
      }

      let responseData: any = []
      let tvl = 0
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

      this.TVL = Math.round(tvl)

      window.localStorage.TVL_last_updated = new Date().getTime()
      window.localStorage.TVL = this.TVL
    },
    async flush() {
      clearInterval(this.marketTimer)
      this.countdown = 0
      this.setMarketTimer()
      this.$accessor.token.loadTokens()
      this.updateCoinInfo(this.wallet.tokenAccounts)
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

        fromCoin =
          from == NATIVE_SOL.mintAddress ? NATIVE_SOL : Object.values(TOKENS).find((item) => item.mintAddress === from)
        toCoin =
          to == NATIVE_SOL.mintAddress ? NATIVE_SOL : Object.values(TOKENS).find((item) => item.mintAddress === to)
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
      } catch (error: any) {
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
    checkFromCoinAmount() {
      return (
        parseFloat(this.fromCoinAmount) >
        parseFloat(
          this.fromCoin && this.fromCoin.balance
            ? this.fromCoin.symbol === 'SOL'
              ? this.fromCoin.balance
                  .toEther()
                  .minus(0.05)
                  .plus(
                    get(this.wallet.tokenAccounts, `${TOKENS.WSOL.mintAddress}.balance`)
                      ? get(this.wallet.tokenAccounts, `${TOKENS.WSOL.mintAddress}.balance`).toEther()
                      : 0
                  )
                  .toFixed(this.fromCoin.balance.decimals)
              : this.fromCoin.balance.fixed()
            : '0'
        )
      )
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
          do {
            // mono-step swap
            const crpLPList = getCropperPoolListByTokenMintAddresses(
              this.fromCoin.mintAddress === TOKENS.WSOL.mintAddress
                ? NATIVE_SOL.mintAddress
                : this.fromCoin.mintAddress,
              this.toCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.toCoin.mintAddress,
              typeof InputAmmIdOrMarket === 'string' ? InputAmmIdOrMarket : undefined
            )
            if (crpLPList.length > 0) {
              this.available_dex.push(ENDPOINT_CRP)
            }

            //two-step swap with CRP
            const lpList_crp_1 = getCropperPoolListByTokenMintAddresses(
              this.fromCoin.mintAddress === TOKENS.WSOL.mintAddress
                ? NATIVE_SOL.mintAddress
                : this.fromCoin.mintAddress,
              TOKENS.CRP.mintAddress,
              undefined
            )
            const lpList_crp_2 = getCropperPoolListByTokenMintAddresses(
              TOKENS.CRP.mintAddress,
              this.toCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.toCoin.mintAddress,
              undefined
            )
            if (lpList_crp_1.length > 0 && lpList_crp_2.length > 0) {
              this.available_dex.push(ENDPOINT_MULTI_CRP)
            }

            //two-step swap with USDC
            const lpList_usdc_1 = getCropperPoolListByTokenMintAddresses(
              this.fromCoin.mintAddress === TOKENS.WSOL.mintAddress
                ? NATIVE_SOL.mintAddress
                : this.fromCoin.mintAddress,
              TOKENS.USDC.mintAddress,
              undefined
            )
            const lpList_usdc_2 = getCropperPoolListByTokenMintAddresses(
              TOKENS.USDC.mintAddress,
              this.toCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.toCoin.mintAddress,
              undefined
            )

            if (lpList_usdc_1.length > 0 && lpList_usdc_2.length > 0) {
              this.available_dex.push(ENDPOINT_MULTI_USDC)
            }

            if (this.available_dex.length > 0) {
              break
            }

            // mono-step swap using raydium
            const rayLPList = getRaydiumPoolListByTokenMintAddresses(
              this.fromCoin.mintAddress === TOKENS.WSOL.mintAddress
                ? NATIVE_SOL.mintAddress
                : this.fromCoin.mintAddress,
              this.toCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.toCoin.mintAddress,
              typeof InputAmmIdOrMarket === 'string' ? InputAmmIdOrMarket : undefined
            )

            if (rayLPList.length > 0) {
              this.available_dex.push(ENDPOINT_RAY)
              break
            }

            // mono-step swap using serum market
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
                  this.market = market
                  this.getOrderBooks()
                  this.available_dex.push(ENDPOINT_SRM)
                }
              )
            }

            //two-step swap with CRP
            const lpList_crp_11 = getPoolListByTokenMintAddresses(
              this.fromCoin.mintAddress === TOKENS.WSOL.mintAddress
                ? NATIVE_SOL.mintAddress
                : this.fromCoin.mintAddress,
              TOKENS.CRP.mintAddress,
              undefined
            )
            const lpList_crp_12 = getPoolListByTokenMintAddresses(
              TOKENS.CRP.mintAddress,
              this.toCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.toCoin.mintAddress,
              undefined
            )
            if (lpList_crp_11.length > 0 && lpList_crp_12.length > 0) {
              this.available_dex.push(ENDPOINT_MULTI_CRP_MIXED)
              break
            }

            //two-step swap with USDC
            const lpList_usdc_11 = getPoolListByTokenMintAddresses(
              this.fromCoin.mintAddress === TOKENS.WSOL.mintAddress
                ? NATIVE_SOL.mintAddress
                : this.fromCoin.mintAddress,
              TOKENS.USDC.mintAddress,
              undefined
            )
            const lpList_usdc_12 = getPoolListByTokenMintAddresses(
              TOKENS.USDC.mintAddress,
              this.toCoin.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.toCoin.mintAddress,
              undefined
            )
            if (lpList_usdc_11.length > 0 && lpList_usdc_12.length > 0) {
              this.available_dex.push(ENDPOINT_MULTI_USDC_MIXED)
              break
            }
          } while (false)
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
      
      try{

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
                      this.toCoinAmount = out.fixed()
                      this.toCoinWithSlippage = outWithSlippage.fixed()
                      this.outToPirceValue = +new TokenAmount(
                        parseFloat(this.toCoinAmount) / parseFloat(this.fromCoinAmount),
                        // @ts-ignore
                        this.toCoin.decimals,
                        false
                      ).fixed()
                      this.priceImpact = priceImpact
                      this.endpoint = ENDPOINT_SRM
                      this.best_dex_type = 'dex'
                    }
                  }
                }
              }
            } else if (dex_type == ENDPOINT_CRP || dex_type == ENDPOINT_RAY) {
              // @ts-ignore
              const poolInfo = (dex_type == ENDPOINT_CRP ? findBestCropperLP : findBestLP)(
                this.$accessor.liquidity.infos,
                this.fromCoin!.mintAddress,
                this.toCoin!.mintAddress,
                this.fromCoinAmount,
                this.setting.slippage
              )
              
              if(!poolInfo) return;
              
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

                  this.toCoinAmount = amountOut.fixed()
                  this.toCoinWithSlippage = amountOutWithSlippage.fixed()
                  this.outToPirceValue = +new TokenAmount(
                    parseFloat(this.toCoinAmount) / parseFloat(this.fromCoinAmount),
                    // @ts-ignore
                    this.toCoin.decimals,
                    false
                  ).fixed()
                  this.priceImpact = priceImpact
                  this.endpoint = dex_type

                  this.best_dex_type = 'single'
                  this.mainAmmId = poolInfo.ammId
                }
              }
            } else if (dex_type == ENDPOINT_MULTI_CRP || dex_type == ENDPOINT_MULTI_CRP_MIXED) {
              let midTokenMint = TOKENS.CRP.mintAddress
              this.midTokenMint = midTokenMint
              // @ts-ignore
              const fromPoolInfo = (dex_type == ENDPOINT_MULTI_CRP ? findBestCropperLP : findBestLP)(
                this.$accessor.liquidity.infos,
                this.fromCoin!.mintAddress,
                midTokenMint,
                this.fromCoinAmount,
                this.setting.slippage
              )
              
              if(!fromPoolInfo) return;

              let { amountOut, amountOutWithSlippage, priceImpact } = getSwapOutAmount(
                fromPoolInfo,
                // @ts-ignore
                this.fromCoin!.mintAddress,
                midTokenMint,
                this.fromCoinAmount,
                this.setting.slippage
              )

              // @ts-ignore
              const toPoolInfo = (dex_type == ENDPOINT_MULTI_CRP ? findBestCropperLP : findBestLP)(
                this.$accessor.liquidity.infos,
                midTokenMint,
                this.toCoin!.mintAddress,
                amountOut.fixed(),
                this.setting.slippage
              )
              
              if(!toPoolInfo) return;

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
                  this.toCoinAmount = final.amountOut.fixed()
                  this.toCoinWithSlippage = final.amountOutWithSlippage.fixed()
                  this.midAmountWithSlippage = amountOutWithSlippage.fixed()
                  this.midAmount = amountOut.fixed()
                  this.outToPirceValue = +new TokenAmount(
                    parseFloat(this.toCoinAmount) / parseFloat(this.fromCoinAmount),
                    // @ts-ignore
                    this.toCoin.decimals,
                    false
                  ).fixed()

                  this.priceImpact = final.priceImpact
                  this.endpoint = ENDPOINT_MULTI_CRP

                  this.best_dex_type = 'multi'
                  this.midTokenSymbol = 'CRP'

                  this.sub_endpoint_1 = getPoolLocation(fromPoolInfo.version)
                  this.sub_endpoint_2 = getPoolLocation(toPoolInfo.version)
                  this.mainAmmId = fromPoolInfo.ammId
                  this.extAmmId = toPoolInfo.ammId
                }
              }
            } else if (dex_type == ENDPOINT_MULTI_USDC || dex_type == ENDPOINT_MULTI_USDC_MIXED) {
              let midTokenMint = TOKENS.USDC.mintAddress
              this.midTokenMint = midTokenMint

              // @ts-ignore
              const fromPoolInfo = (dex_type == ENDPOINT_MULTI_USDC ? findBestCropperLP : findBestLP)(
                this.$accessor.liquidity.infos,
                this.fromCoin!.mintAddress,
                midTokenMint,
                this.fromCoinAmount,
                this.setting.slippage
              )
              
              if(!fromPoolInfo) return;
              
              let { amountOut, amountOutWithSlippage, priceImpact } = getSwapOutAmount(
                fromPoolInfo,
                // @ts-ignore
                this.fromCoin.mintAddress,
                midTokenMint,
                this.fromCoinAmount,
                this.setting.slippage
              )

              // @ts-ignore
              const toPoolInfo = (dex_type == ENDPOINT_MULTI_USDC ? findBestCropperLP : findBestLP)(
                this.$accessor.liquidity.infos,
                midTokenMint,
                this.toCoin!.mintAddress,
                amountOut.fixed(),
                this.setting.slippage
              )

              if(!toPoolInfo) return;

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
                  this.toCoinAmount = final.amountOut.fixed()
                  this.toCoinWithSlippage = final.amountOutWithSlippage.fixed()
                  this.midAmountWithSlippage = amountOutWithSlippage.fixed()
                  this.outToPirceValue = +new TokenAmount(
                    parseFloat(this.toCoinAmount) / parseFloat(this.fromCoinAmount),
                    // @ts-ignore
                    this.toCoin.decimals,
                    false
                  ).fixed()
                  this.priceImpact = final.priceImpact
                  this.endpoint = ENDPOINT_MULTI_USDC

                  this.best_dex_type = 'multi'
                  this.midTokenSymbol = 'USDC'

                  this.sub_endpoint_1 = getPoolLocation(fromPoolInfo.version)
                  this.sub_endpoint_2 = getPoolLocation(toPoolInfo.version)

                  this.mainAmmId = fromPoolInfo.ammId
                  this.extAmmId = toPoolInfo.ammId
                }
              }
            }
          })
        }
      }catch{

      }

      if (max_coinAmount === 0) {
        this.toCoinAmount = ''
        this.toCoinWithSlippage = ''
        this.outToPirceValue = 0
        this.priceImpact = 0
        this.endpoint = ''
        this.midTokenSymbol = undefined
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
    needCreateTokens() {
      if (this.fromCoin !== null && this.toCoin !== null) {
        let fromMint = this.fromCoin.mintAddress
        let midMint = this.midTokenMint
        let toMint = this.toCoin.mintAddress
        if (fromMint === NATIVE_SOL.mintAddress) fromMint = TOKENS.WSOL.mintAddress
        if (midMint === NATIVE_SOL.mintAddress) midMint = TOKENS.WSOL.mintAddress
        if (toMint === NATIVE_SOL.mintAddress) toMint = TOKENS.WSOL.mintAddress
        return !(
          get(this.wallet.tokenAccounts, `${fromMint}.tokenAccountAddress`) &&
          get(this.wallet.tokenAccounts, `${midMint}.tokenAccountAddress`) &&
          get(this.wallet.tokenAccounts, `${toMint}.tokenAccountAddress`)
        )
      }
      return false
    },

    needWrapSol() {
      if (this.fromCoin !== null) {
        if ([NATIVE_SOL.mintAddress, TOKENS.WSOL.mintAddress].includes(this.fromCoin.mintAddress)) {
          let amount = get(this.wallet.tokenAccounts, `${TOKENS.WSOL.mintAddress}.balance`)
          amount = Math.ceil((amount ? Number(amount.fixed()) : 0) * 10 ** 9)
          const fromCoinAmountData = Math.ceil(Number(this.fromCoinAmount) * 10 ** 9)
          if (fromCoinAmountData > amount) return fromCoinAmountData - amount
        }
      }
      return 0
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
            this.flush()
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
          this.toCoinWithSlippage,
          get(this.wallet.tokenAccounts, `${TOKENS.WSOL.mintAddress}.tokenAccountAddress`)
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
            this.flush()
          })
      } else if (this.endpoint === ENDPOINT_MULTI_CRP || this.endpoint === ENDPOINT_MULTI_USDC) {
        if (this.needCreateTokens() || this.needWrapSol()) {
          let fromMint = this.fromCoin?.mintAddress
          let midMint = this.midTokenMint
          let toMint = this.toCoin?.mintAddress
          if (fromMint === NATIVE_SOL.mintAddress) fromMint = TOKENS.WSOL.mintAddress
          if (midMint === NATIVE_SOL.mintAddress) midMint = TOKENS.WSOL.mintAddress
          if (toMint === NATIVE_SOL.mintAddress) toMint = TOKENS.WSOL.mintAddress
          prepareTwoStepSwap(
            this.$web3,
            // @ts-ignore
            this.$wallet,
            // @ts-ignore
            fromMint,
            // @ts-ignore
            get(this.wallet.tokenAccounts, `${fromMint}.tokenAccountAddress`),
            // @ts-ignore
            midMint,
            get(this.wallet.tokenAccounts, `${midMint}.tokenAccountAddress`),
            // @ts-ignore
            toMint,
            // @ts-ignore
            get(this.wallet.tokenAccounts, `${toMint}.tokenAccountAddress`),
            this.needWrapSol()
          )
            .then((txid: string) => {
              this.$notify.info({
                key,
                message: 'Transaction has been sent',
                description: (h: any) =>
                  h('div', [
                    'Confirmation is in progress.  Check your transaction on ',
                    h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
                  ])
              })
              const description = `Create Tokens`
              this.$accessor.transaction.sub({ txid, description })
            })
            .catch((error: Error) => {
              this.$notify.error({
                key,
                message: 'Create Tokens failed',
                description: error.message
              })
            })
            .finally(() => {
              this.swaping = false
              this.flush()
            })
        } else {
          const fromPoolInfo = Object.values(this.$accessor.liquidity.infos).find(
            (p: any) => p.ammId === this.mainAmmId
          )
          const toPoolInfo = Object.values(this.$accessor.liquidity.infos).find((p: any) => p.ammId === this.extAmmId)
          const midTokenSymbol = this.endpoint === ENDPOINT_MULTI_CRP ? TOKENS.CRP.symbol : TOKENS.USDC.symbol

          let fromMint = this.fromCoin?.mintAddress
          let midMint = this.midTokenMint
          let toMint = this.toCoin?.mintAddress

          if (fromMint === NATIVE_SOL.mintAddress) fromMint = TOKENS.WSOL.mintAddress
          if (midMint === NATIVE_SOL.mintAddress) midMint = TOKENS.WSOL.mintAddress
          if (toMint === NATIVE_SOL.mintAddress) toMint = TOKENS.WSOL.mintAddress

          twoStepSwap(
            this.$web3,
            // @ts-ignore
            this.$wallet,
            fromPoolInfo,
            toPoolInfo,
            // @ts-ignore
            this.fromCoin.mintAddress,
            // @ts-ignore
            this.midTokenMint,
            // @ts-ignore
            this.toCoin.mintAddress,
            // @ts-ignore
            get(this.wallet.tokenAccounts, `${fromMint}.tokenAccountAddress`),
            // @ts-ignore
            get(this.wallet.tokenAccounts, `${midMint}.tokenAccountAddress`),
            // @ts-ignore
            get(this.wallet.tokenAccounts, `${toMint}.tokenAccountAddress`),
            this.fromCoinAmount,
            this.midAmountWithSlippage,
            get(this.wallet.tokenAccounts, `${TOKENS.WSOL.mintAddress}.tokenAccountAddress`)
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
              this.flush()
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
              this.flush()
            })
        }
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
            this.flush()
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
            this.flush()
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
        this.flush()
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
          this.flush()
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
    },
    reloadTimer() {
      this.activeSpinning = true
      setTimeout(() => {
        this.activeSpinning = false
      }, 1000)
      this.getOrderBooks()
      this.flush()
      this.$accessor.wallet.getTokenAccounts()
    }
  }
})
</script>

<style lang="less" scoped>
.swap.container {
  max-width: 1350px;
  width: 100%;
  background: @color-bg;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;
  margin-left: auto;
  margin-right: auto;

  .ant-layout {
    background: #000 !important;
  }

  button.ant-btn-background-ghost[disabled] {
    background: #80819d !important;
    border: 2px solid rgba(255, 255, 255, 0.14);
  }

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

            @media @max-b-mobile {
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

            @media @max-b-mobile {
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

      .setting-btn-group {
        display: flex;

        .setting-btn-container {
          position: relative;
          border: 3px solid #273d94;
          box-sizing: border-box;
          border-radius: 14px;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 5px;
          cursor: pointer;
          
          &.active {
            background: #172058;
          }

          &:last-child {
            margin-right: 30px;
          }

          .input-search {
            height: 100%;
            position: absolute;
            width: 100%;
          }

          .sort-by {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-evenly;

            .label {
              font-size: 16px;
              cursor: pointer;
              display: flex;
              align-items: center;

              .info-icon,
              .setting-icon {
                width: 16px;
                height: 16px;
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

          .sort-options {
            position: absolute;
            width: 180px;
            top: 45px;
            left: -10px;
            padding: 6px 12px 12px 12px;
            background: @gradient-color-primary;
            background-origin: border-box;
            border: 2px solid rgba(255, 255, 255, 0.1);
            box-shadow: 18px 11px 14px rgba(0, 0, 0, 0.25);
            border-radius: 8px;
            z-index: 999;
            font-size: 9px;
            text-align: left;

            .swap-info {
              .tooltip-input {
                background: @gradient-color-primary;
                background-origin: border-box;
                border: 1px solid rgba(255, 255, 255, 0.14);
                width: 100%;
                outline: none;
                border-radius: 6px;
                font-size: 12px;
                line-height: 15px;
                padding: 5px 12px;
                margin-top: 5px;

                &::-webkit-outer-spin-button,
                &::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
              }

              .info {
                background: @gradient-color-primary;
                background-origin: border-box;
                border: 1px solid rgba(255, 255, 255, 0.14);
                width: 100%;
                outline: none;
                border-radius: 6px;
                font-size: 12px;
                line-height: 15px;
                padding: 5px 8px;
                margin-top: 5px;
                display: flex;
                align-items: center;

                .symbol {
                  font-weight: bold;
                  font-size: 8px;
                  line-height: 10px;
                  margin-left: 10px;
                  margin-right: 5px;
                }

                .address {
                  font-size: 8px;
                  line-height: 10px;
                }

                .action {
                  display: flex;
                  align-items: center;

                  .action-icon {
                    width: 11px;
                    height: 11px;
                    cursor: pointer;
                    margin-left: 5px;

                    &:first-child {
                      margin-left: 0;
                    }
                  }
                }
              }

              .info:nth-child(1) {
                margin-top: 0 !important;
              }
            }
          }
        }
      }

      .my-info {
        font-size: 15px;
        line-height: 18px;
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

        .load-icon {
          width: 18px;
          height: 18px;
        }

        &.active .load-icon {
          transform: rotate(360deg);
          transition: all 1s ease-in-out;
        }
      }
    }
  }

  .swap-content {
    max-width: 662px; //550
    margin: auto;

    .coin-budge {
      align-items: center;
      border: solid 1px rgba(255, 255, 255, 0.5);
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

    .card {
      border: 1px solid #4d4d4d;
      background: rgba(255, 2255, 255, 0.05);
      border-radius: 15px;

      .card-body {
        row-gap: 5px;
        width: 600px !important;
        background: none;

        .price-info {
          display: grid;
          grid-auto-rows: auto;
          grid-row-gap: 8px;
          row-gap: 8px;
          padding: 0 12px;
          font-size: 12px;
          line-height: 20px;
          margin-bottom: 6px;
          .swap-icon {
            margin-left: 10px;
            cursor: pointer;
          }
          .price-base {
            font-size: 12px;
            line-height: 15px;
            opacity: 0.5;
          }
          .fs-container {
            margin-top: 20px;
            .name {
              color: #fff;
              font-size: 18px;
              display: flex;
              align-items: center;
              label {
                opacity: 0.5;
              }
              .tooltipIcon {
                margin-left: 5px;
                width: 15px;
              }
            }
            .price-impact-orange {
              color: #ffb900 !important;
              label {
                opacity: 1 !important;
              }
            }
            .price-impact-red {
              color: #f00 !important;
              font-weight: bold !important;
              label {
                opacity: 1 !important;
              }
            }
            .swapThrough {
              text-transform: capitalize;
              border-radius: 5px;
              padding: 4px 8px;
              margin-left: 5px;
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
        background: @gradient-color-icon !important;
        background-origin: border-box !important;
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
      margin: 10px;
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

  .ant-menu-horizontal,
  .ant-layout-header,
  .ant-layout-footer {
    background: @color-bg !important;
  }
  .ant-layout-content {
    background: @color-bg !important;
  }
}

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

.planetMiddle {
  position: absolute;
  left: -150px;
  top: 446px;
  transform: rotate(90deg);
}

.ant-tooltip-inner {
  background: @gradient-color-icon !important;
  background-origin: border-box !important;
  border: 2px solid rgba(255, 255, 255, 0.14);
  box-shadow: 18px 11px 14px rgb(0 0 0 / 25%);
  border-radius: 8px;
  display: inline-block;
  width: auto;
  color: rgba(255, 255, 255, 0.5) !important;
}

.ant-tooltip-arrow {
  display: none;
}

@media @max-b-mobile {
  .swap.container {
    margin: auto;
    padding: 0 22px;
    min-width: 375px;

    .planetMiddle {
      display: none;
    }

    .swap-content {
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
            }

            .pathway {
              span:nth-of-type(2) {
                justify-content: center;
              }
            }

            .pathway,
            .swapping {
              padding-bottom: 15px;

              .name {
                margin-bottom: 10px;
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
      background: rgba(255, 255, 255, 0.1);
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
    border-radius: 10px;
    padding: 5px 10px !important;
    margin: 5px 0;
    background: rgba(255, 255, 255, 0.1) !important;
  }
}
</style>