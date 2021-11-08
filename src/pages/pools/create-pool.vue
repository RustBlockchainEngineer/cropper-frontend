<template>
  <div class="container create-pool">
    <CoinSelect
      v-if="coinSelectShow && wallet.connected"
      :farmTokenASelect="selectTokenA"
      :farmTokenBSelect="selectTokenB"
      :allowedAllFarm="$wallet.publicKey.toBase58() === allowedFarmCreator"
      @onClose="() => ((coinSelectShow = false), (selectTokenB = false), (selectTokenA = false))"
      @onSelect="onCoinSelect"
    />
    <AmmIdSelect
      :show="ammIdSelectShow"
      :liquidity-list="ammIdSelectList"
      :user-close="true"
      @onClose="() => (ammIdSelectShow = false)"
      @onSelect="onAmmIdSelect"
    />
    <div class="card">
      <div class="card-body">
        <div class="page-head fs-container">
          <span class="title">Liquidity pool creation</span>
          <span class="buttonsd">
            <a
              href="https://cropper-finance.gitbook.io/cropperfinance/cropperfinance-platform-1/builder-tutorial/create-a-permissionless-pool"
              target="_blank"
            >
              <div class="create">
                <Button size="large" ghost>Detailed guide </Button>
              </div>
            </a>
            <a href="https://t.me/CropperFinance" target="_blank">
              <div class="create">
                <Button size="large" ghost>Get support </Button>
              </div>
            </a>
          </span>
        </div>
        <div class="design-farm">
          <div class="page-head fs-container">
            <span class="title">Design your own pool</span>
          </div>

          <Row>
            <Col :span="isMobile ? 24 : 6" class="step" :class="{ 'bordered-right': !wallet.connected }">
              <Steps :current="current" size="small" direction="vertical" style="width: auto" :status="stepsStatus">
                <Step>
                  <p slot="title" style="color: #13ecab">
                    {{ stepTitleInputMarket }}
                  </p>
                </Step>
                <Step
                  ><template slot="title">
                    <div v-if="current > 1 || (current === 1 && stepsStatus !== 'error')">
                      {{ stepTitleMarketInfo }}
                    </div>
                    <div v-else-if="current === 1 && stepsStatus === 'error'" style="color: red">
                      {{ stepTitleMarketInfo }}
                    </div>
                    <div v-else style="color: #40426c">{{ stepTitleMarketInfo }}</div>
                  </template></Step
                >
                <Step
                  ><template slot="title">
                    <div v-if="current > 2 && stepsStatus !== 'error'">Pool Created</div>
                    <div v-else-if="current === 2 && stepsStatus === 'error'" style="color: red">Pool Created</div>
                    <div v-else slot="title" style="color: #40426c">Pool Created</div>
                  </template></Step
                >
              </Steps>
            </Col>

            <Col :span="isMobile ? 24 : 18" class="notstep" :class="{ 'bordered-left': wallet.connected }">
              <Row v-if="current === 0 && !wallet.connected">
                <Col :span="isMobile ? 24 : 24" style="text-align: center" class="item-title">
                  <div v-if="!wallet.connected" class="next">
                    <Button size="large" ghost style="width: 100%" @click="$accessor.wallet.openModal">
                      Connect wallet
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row v-if="current === 0 && wallet.connected">
                <Col :span="24" class="item-title">
                  <div>
                    <b>Create a new liquidity pool:</b>
                  </div>
                  <div class="inner-content max-80">
                    <label>Input market Id here</label>
                    <input
                      v-model="inputMarket"
                      :disabled="!marketInputFlag"
                      placeholder="Eg. 3iCYi5bQxXN5X4omCxME1jj9D91vNpYYqzbiSr9u7ccG"
                    />
                    <div class="detailed-guide">
                      <em
                        ><u>Note:</u> This tool is for advanced users. Before attempting to create a new liquidity pool,
                        we suggest going through this
                        <a
                          href="https://cropper-finance.gitbook.io/cropperfinance/cropperfinance-platform-1/builder-tutorial/create-a-permissionless-pool"
                          target="_blank"
                        >
                          detailed guide.</a
                        ></em
                      >
                    </div>
                  </div>
                </Col>
                <Col :span="isMobile ? 24 : 24" class="item-title">
                  <div class="next">
                    <Button
                      v-if="!wallet.connected"
                      size="large"
                      ghost
                      style="width: 100%"
                      @click="$accessor.wallet.openModal"
                    >
                      Connect wallet
                    </Button>
                    <Button
                      v-else
                      size="large"
                      ghost
                      class="button_div"
                      :disabled="!wallet.connected || alreadyExists"
                      style="z-index: 999"
                      :loading="getMarketLoading"
                      @click="marketInputFlag ? getMarketMsg() : rewriteMarket()"
                    >
                      {{
                        !wallet.connected
                          ? 'Connect'
                          : getMarketLoading
                          ? ''
                          : marketInputFlag
                          ? alreadyExists
                            ? 'This market already exists'
                            : 'Confirm'
                          : 'Cancel'
                      }}
                    </Button>
                  </div>
                </Col>
              </Row>

              <div v-if="current === 1">
                <Row>
                  <Col :span="isMobile ? 24 : 24" class="item-title">
                    <b>Market Information:</b>
                    <div class="inner-content">
                      <div class="market-info">
                        <div>Tick Size: {{ marketTickSize }}</div>
                        <div>Min Order Size: {{ marketMsg.minOrderSize }}</div>
                        <div>
                          Current Price:
                          {{
                            marketMsg.tickSize.toString().split('.').length === 2
                              ? marketPrice.toFixed(marketMsg.tickSize.toString().split('.')[1].length)
                              : parseInt((marketPrice / marketMsg.tickSize).toFixed(0)) * marketMsg.tickSize
                          }}
                        </div>
                      </div>
                    </div>
                    <Row class="token-mint-address">
                      <Col span="11" class="mint-address">
                        <b>Base Token Mint Address:</b> <br />
                        {{ getNameForMint(marketMsg.baseMintAddress.toBase58()) }}
                      </Col>

                      <Col span="11" class="mint-address">
                        <b>Quote Token Mint Address:</b> <br />
                        {{ getNameForMint(marketMsg.quoteMintAddress.toBase58()) }}
                      </Col>
                    </Row>
                  </Col>

                  <div class="item-title">
                    <div class="inner-content market-input-group">
                      <Col span="12" class="market-input-info">
                        Set <b>{{ getSymbolForMint(marketMsg.baseMintAddress.toBase58()) }}</b> Starting Price in
                        <b>{{ getSymbolForMint(marketMsg.quoteMintAddress.toBase58()) }}</b
                        >:
                      </Col>
                      <Col span="12" class="market-input-form">
                        <input
                          v-model="inputPrice"
                          type="number"
                          :disabled="createAmmFlag"
                          :step="1"
                          accuracy="2"
                          style="width: 100%"
                          placeholder="input amount"
                        />
                      </Col>
                    </div>

                    <div class="inner-content market-input-group">
                      <Col span="12" class="market-input-info">
                        <b>{{ getSymbolForMint(marketMsg.baseMintAddress.toBase58()) }}</b> Initial Liquidity:
                      </Col>
                      <Col span="12" class="market-input-form">
                        <input
                          v-model="inputBaseValue"
                          type="number"
                          :disabled="createAmmFlag"
                          :step="1"
                          accuracy="2"
                          style="width: 100%"
                          placeholder="input amount"
                        />
                      </Col>
                    </div>

                    <div class="inner-content market-input-group">
                      <Col span="12" class="market-input-info">
                        <b>{{ getSymbolForMint(marketMsg.quoteMintAddress.toBase58()) }}</b> Initial Liquidity:
                      </Col>
                      <Col span="12" class="market-input-form">
                        <input
                          v-model="inputQuoteValue"
                          type="number"
                          :disabled="createAmmFlag"
                          :step="1"
                          accuracy="2"
                          style="width: 100%"
                          placeholder="input amount"
                        />
                      </Col>
                    </div>

                    <div class="inner-content max-100">
                      <div class="detailed-guide">
                        <em>
                          <u>Note:</u>
                          after clicking on "confirm" you will need to
                          <b>approve two transactions</b>
                          to initialize the pool, create the AMM account, and add liquidity.
                        </em>
                      </div>
                    </div>

                    <div class="inner-content max-100">
                      <div class="next" v-if="!wallet.connected">
                        <Button
                          style="position: absolute; z-index: 999; width: 100%"
                          size="large"
                          ghost
                          @click="$accessor.wallet.openModal"
                        >
                          Connect wallet
                        </Button>
                      </div>

                      <div class="next" v-else>
                        <Button
                          size="large"
                          ghost
                          class="button_div"
                          style="z-index: 999"
                          :loading="createAmmFlag"
                          :disabled="createAmmFlag || !(inputPrice !== null && isAmountValid)"
                          @click="createKey"
                        >
                          {{
                            createAmmFlag
                              ? ''
                              : isAmountValid == false
                              ? 'Insufficient amount'
                              : 'Confirm'
                          }}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Row>
              </div>

              <Row v-if="current === 2">
                <Col :span="24" class="item-title">
                  <div class="pool-created">
                    <b>Congratulations! Your pool has been successfully created!</b>
                  </div>
                </Col>
                <Col class="lp-icons" :span="24">
                  <div class="lp-icons-group">
                    <div class="icons">
                      <CoinIcon :mint-address="getNameForMint(marketMsg.baseMintAddress.toBase58())" />
                      <span>{{ getSymbolForMint(marketMsg.baseMintAddress.toBase58()) }} - </span>
                      <CoinIcon :mint-address="getNameForMint(marketMsg.baseMintAddress.toBase58())" />
                      <span>{{ getSymbolForMint(marketMsg.quoteMintAddress.toBase58()) }}</span>
                    </div>
                  </div>
                </Col>
                <Col class="item-title">
                  <div class="created-amm-id">
                    <b>AMM ID:</b> {{ userCreateAmmId }}
                  </div>
                </Col>
                <Col :span="isMobile ? 24 : 24">
                  <div class="next">
                    <Button
                      v-if="!wallet.connected"
                      size="large"
                      ghost
                      style="width: 100%"
                      @click="$accessor.wallet.openModal"
                    >
                      Connect wallet
                    </Button>
                    <NuxtLink to="/pools/" v-else>
                      <div class="next">
                        <Button size="large" ghost> View pool </Button>
                      </div>
                    </NuxtLink>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { Steps, Row, Col, Button, Tooltip, Icon, DatePicker } from 'ant-design-vue'
import { getMarket, createAmm, clearLocal } from '@/utils/market'
import BigNumber from '@/../node_modules/bignumber.js/bignumber'
import { NATIVE_SOL, TokenInfo, TOKENS } from '@/utils/tokens'
import { TokenAmount } from '@/utils/safe-math'
import { createAssociatedId } from '@/utils/web3'
import { PublicKey } from '@solana/web3.js'
import { DEVNET_MODE } from '../../utils/ids'
import {
  AMM_ASSOCIATED_SEED,
  FARM_PROGRAM_ID,
  LIQUIDITY_POOL_PROGRAM_ID_V4,
  FARM_INITIAL_ALLOWED_CREATOR
} from '@/utils/ids'
import { getBigNumber } from '@/utils/layouts'
import { cloneDeep, get } from 'lodash-es'
import moment from 'moment'
import { YieldFarm } from '@/utils/farm'
import {
  getPoolListByTokenMintAddresses,
  getPoolByLpMintAddress,
  getAllCropperPools,
  LIQUIDITY_POOLS,
  LiquidityPoolInfo
} from '@/utils/pools'
const Step = Steps.Step
declare const window: any

@Component({
  head: {
    title: 'CropperFinance Create Pool'
  },
  components: {
    Steps,
    Row,
    Col,
    Button,
    Step,
    Tooltip,
    Icon,
    DatePicker
  }
})
export default class CreatePool extends Vue {
  rewardCoin: TokenInfo | null = null
  tokenA: TokenInfo | null = null
  tokenB: TokenInfo | null = null
  fromCoinAmount: string = ''
  fixedFromCoin: boolean = true
  selectFromCoin: boolean = false
  selectTokenA: boolean = false
  selectTokenB: boolean = false
  allowedFarmCreator: string = FARM_INITIAL_ALLOWED_CREATOR
  coinSelectShow: boolean = false
  startTime: any = moment()
  endTime: any = moment()
  endOpen: any = false
  isCRPTokenPair: boolean = false
  ammIdSelectShow: boolean = false
  ammIdSelectList: any = []

  current: number = 0

  marketInputFlag: boolean = true
  marketFlag: boolean = false
  inputMarket: string = '' //'HPU7v2yCGM6sRujWEMaTPiiiX2qMb6fun3eWjTzSgSw1'//3iCYi5bQxXN5X4omCxME1jj9D91vNpYYqzbiSw9u7tcG
  isAmountValid: boolean = false
  inputQuoteValue: number | null = null
  inputBaseValue: number | null = null
  inputPrice: number | null = null
  marketMsg: any | null = null
  getMarketLoading: boolean = false
  marketError: null | string = null
  stepsStatus: string = 'process'
  marketStr: string | null = null
  marketPrice: number | null = null
  baseMintDecimals: number | null = null
  quoteMintDecimals: number | null = null
  pools: any = []
  alreadyExists: boolean = false

  createAmmFlag: boolean = false

  stepTitleInputMarket: string = 'Market ID'
  stepTitleMarketInfo: string = 'Price & Initial Liquidity'
  stepTitleInit: string = 'Initialize'

  marketTickSize: number = 1

  userCreateAmmId: string = ''

  liquidityValueChangeFlag: boolean = true

  userLocalAmmIdList: string[] = []

  expectAmmId: undefined | string

  get rewardPerWeek() {
    let result = 0
    let initialAmount = Number.parseFloat(this.fromCoinAmount)

    let duration = 0
    if (this.startTime != null && this.endTime != null) {
      duration = this.endTime.unix() - this.startTime.unix()
    }
    if (duration > 0) {
      result = (initialAmount * 7 * 24 * 3600) / duration
    }
    return result
  }
  get isMobile() {
    return this.$accessor.isMobile
  }

  get wallet() {
    return this.$accessor.wallet
  }

  @Watch('startTime')
  onStartTimeChanged(val: any) {
    console.log('start time changed !')
  }

  @Watch('inputQuoteValue')
  oniIputQuoteValueChanged(val: string) {
    if (
      this.inputPrice !== null &&
      this.baseMintDecimals !== null &&
      this.quoteMintDecimals !== null &&
      this.liquidityValueChangeFlag
    ) {
      this.liquidityValueChangeFlag = false
      if (val.toString().split('.').length > 1 && val.toString().split('.')[1].length > this.quoteMintDecimals) {
        this.inputQuoteValue = parseFloat(parseFloat(val).toFixed(this.quoteMintDecimals))
      }
      this.inputBaseValue =
        Math.floor(((this.inputQuoteValue ?? parseFloat(val)) / this.inputPrice) * 10 ** this.baseMintDecimals) /
        10 ** this.baseMintDecimals
      this.validateAmount()
    }
    setTimeout(() => {
      this.liquidityValueChangeFlag = true
    }, 1)
  }

  @Watch('inputBaseValue')
  onInputBaseValueChanged(val: string) {
    if (
      this.inputPrice !== null &&
      this.baseMintDecimals !== null &&
      this.quoteMintDecimals !== null &&
      this.liquidityValueChangeFlag
    ) {
      this.liquidityValueChangeFlag = false
      if (val.toString().split('.').length > 1 && val.toString().split('.')[1].length > this.baseMintDecimals) {
        this.inputBaseValue = parseFloat(parseFloat(val).toFixed(this.baseMintDecimals))
      }
      this.inputQuoteValue =
        Math.floor((this.inputBaseValue ?? parseFloat(val)) * this.inputPrice * 10 ** this.quoteMintDecimals) /
        10 ** this.quoteMintDecimals
      this.validateAmount()
    }
    setTimeout(() => {
      this.liquidityValueChangeFlag = true
    }, 1)
  }

  @Watch('inputPrice')
  onInputPriceValueChanged(val: number) {
    if (this.inputPrice) {
      if (this.inputBaseValue && this.quoteMintDecimals) {
        this.inputQuoteValue =
          Math.floor(val * this.inputPrice * 10 ** this.quoteMintDecimals) / 10 ** this.quoteMintDecimals
      } else if (this.inputQuoteValue && this.baseMintDecimals) {
        this.inputBaseValue =
          Math.floor((val / this.inputPrice) * 10 ** this.baseMintDecimals) / 10 ** this.baseMintDecimals
      }
      this.validateAmount()
    }
  }

  async validateAmount() {
    this.isAmountValid = false
    if (this.inputBaseValue && this.inputQuoteValue && this.baseMintDecimals && this.quoteMintDecimals) {
      const baseMintAddress =
        this.marketMsg.baseMintAddress.toBase58() == TOKENS.WSOL.mintAddress
          ? NATIVE_SOL.mintAddress
          : this.marketMsg.baseMintAddress.toBase58()
      const quoteMintAddress =
        this.marketMsg.quoteMintAddress.toBase58() == TOKENS.WSOL.mintAddress
          ? NATIVE_SOL.mintAddress
          : this.marketMsg.quoteMintAddress.toBase58()

      const walletBaseAmount = parseFloat(get(this.wallet.tokenAccounts, `${baseMintAddress}.balance`).fixed())
      const walletQuoteAmount = parseFloat(get(this.wallet.tokenAccounts, `${quoteMintAddress}.balance`).fixed())
      console.log(walletBaseAmount)
      console.log(walletQuoteAmount)
      if (
        this.inputBaseValue > 0 &&
        this.inputBaseValue < walletBaseAmount &&
        this.inputQuoteValue > 0 &&
        this.inputQuoteValue < walletQuoteAmount
      ) {
        this.isAmountValid = true
      }
    }
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

      if (liquidityItem?.coin.balance) {
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

        value.current = 0

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
        }

        polo.push(value)
      }
    })

    return polo
  }

  @Watch('inputMarket')
  onInputMarketChanged(val: string) {
    this.alreadyExists = false
    this.inputMarket = val.replace(/(^\s*)|(\s*$)/g, '')

    if (
    // @ts-ignore
      DEVNET_MODE != true &&
      this.pools.filter(
        (pool: any) => (pool.serumMarket as string).toLowerCase() == (this.inputMarket as string).toLowerCase()
      ).length > 0
    ) {
      this.alreadyExists = true
    }
  }

  mounted() {
    const localMarket = localStorage.getItem('createMarket')
    if (localMarket !== null && localMarket.length > 30) {
      this.inputMarket = localMarket
      this.getMarketMsg()
    } else {
      clearLocal()
    }
    this.updateLocalData()

    let timer = setInterval(async () => {
      this.pools = this.poolsFormated()
      if (this.pools.length > 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
  async confirmFarmInfo() {
    //EgaHTGJeDbytze85LqMStxgTJgq22yjTvYSfqoiZevSK
    const connection = this.$web3
    const wallet: any = this.$wallet

    window.localStorage.pool_last_updated = undefined
    await this.$accessor.liquidity.requestInfos()

    //get liquidity pool info
    let liquidityPoolInfo: any = LIQUIDITY_POOLS.find((item) => item.ammId === this.userCreateAmmId)

    //check liquidity pool
    if (liquidityPoolInfo == undefined) {
      this.$notify.error({
        key: 'Liquidity',
        message: 'Finding liquidity pool',
        description: "Can't find liquidity pool"
      })
      return
    }

    //check reward coin
    if (this.rewardCoin === null) {
      this.$notify.error({
        key: 'reward',
        message: 'Checking reward coin',
        description: 'Select reward coin, please'
      })
      return
    }

    let rewardMintPubkey = new PublicKey(this.rewardCoin?.mintAddress as string)
    let rewardDecimals: number = this.rewardCoin?.decimals as any
    let lpMintPubkey = new PublicKey(liquidityPoolInfo.lp.mintAddress)
    let ammPubkey = new PublicKey(this.userCreateAmmId)

    let startTimestamp: any = this.startTime.unix()
    let endTimestamp: any = this.endTime.unix()

    let initialRewardAmount: number = Number.parseFloat(this.fromCoinAmount)
    let userRewardTokenPubkey = new PublicKey(
      get(this.wallet.tokenAccounts, `${rewardMintPubkey.toBase58()}.tokenAccountAddress`)
    )
    let userRewardTokenBalance = get(this.wallet.tokenAccounts, `${rewardMintPubkey.toBase58()}.balance`)

    //check if creator has some reward
    if (userRewardTokenBalance <= 0 || userRewardTokenBalance < initialRewardAmount) {
      this.$notify.error({
        key: 'Initial Balance',
        message: 'Checking Inital Reward',
        description: 'Not enough Initial Reward token balance'
      })
      return
    }

    //check start and end
    if (startTimestamp >= endTimestamp) {
      this.$notify.error({
        key: 'Period',
        message: 'Checking period',
        description: 'end time must be late than start time'
      })
      return
    }
    try {
      let createdFarm = await YieldFarm.createFarmWithParams(
        connection,
        wallet,
        rewardMintPubkey,
        lpMintPubkey,
        ammPubkey,
        startTimestamp,
        endTimestamp
      )
      await this.delay(500)

      // wait for the synchronization
      let loopCount = 0
      while ((await connection.getAccountInfo(createdFarm.farmId)) === null) {
        if (loopCount > 5) {
          // allow loop for 5 times
          break
        }
        loopCount++
      }

      let fetchedFarm = await YieldFarm.loadFarm(connection, createdFarm.farmId, new PublicKey(FARM_PROGRAM_ID))
      if (fetchedFarm) {
        await fetchedFarm.addReward(wallet, userRewardTokenPubkey, initialRewardAmount * Math.pow(10, rewardDecimals))
        this.current += 1
      }
    } catch {
      console.log('creating farm failed')
    }
  }
  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  gotoFarms() {
    this.$router.push({ path: `/farms` })
  }
  goToFarmInfo() {
    this.current++
  }
  useExistingAMMID() {
    if (this.userCreateAmmId === '') {
      this.$notify.error({
        key: 'AMMID',
        message: 'Using Existing Amm Id',
        description: 'Input valid AMM ID'
      })
      return
    }
    this.current = 5
  }
  createNewAMMID() {
    this.current++
  }
  onAmmIdSelect(liquidityInfo: LiquidityPoolInfo | undefined) {
    this.ammIdSelectShow = false
    if (liquidityInfo) {
      this.userCreateAmmId = liquidityInfo.ammId
    }
  }
  openFromCoinSelect() {
    this.selectFromCoin = true
    this.closeAllModal('coinSelectShow')
    setTimeout(() => {
      this.coinSelectShow = true
    }, 1)
  }
  openTokenASelect() {
    this.selectTokenA = true
    this.closeAllModal('coinSelectShow')
    setTimeout(() => {
      this.coinSelectShow = true
    }, 1)
  }
  openTokenBSelect() {
    this.selectTokenB = true
    this.closeAllModal('coinSelectShow')
    setTimeout(() => {
      this.coinSelectShow = true
    }, 1)
  }
  closeAllModal(showName: string) {
    if (showName !== 'coinSelectShow') {
      this.coinSelectShow = false
    }
  }
  onCoinSelect(tokenInfo: TokenInfo) {
    if (tokenInfo !== null) {
      if (this.selectFromCoin) {
        this.rewardCoin = cloneDeep(tokenInfo)
      } else if (this.selectTokenA || this.selectTokenB) {
        if (this.selectTokenA) {
          this.tokenA = cloneDeep(tokenInfo)
          this.rewardCoin = cloneDeep(tokenInfo)
          if (this.tokenB && this.tokenA.mintAddress === this.tokenB.mintAddress) {
            this.tokenB = null
          }
        } else if (this.selectTokenB) {
          this.tokenB = cloneDeep(tokenInfo)
          if (this.tokenA && this.tokenB.mintAddress === this.tokenA.mintAddress) {
            this.tokenA = null
          }
        }
        if (this.tokenA && this.tokenB) {
          const liquidityListV5 = getPoolListByTokenMintAddresses(
            this.tokenA.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.tokenA.mintAddress,
            this.tokenB.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.tokenB.mintAddress,
            undefined
          )
          if (liquidityListV5.length === 1) {
            this.userCreateAmmId = liquidityListV5[0].ammId
          } else if (liquidityListV5.length > 1) {
            // user select amm id
            this.coinSelectShow = false
            setTimeout(() => {
              this.ammIdSelectShow = true

              // @ts-ignore
              this.ammIdSelectList = Object.values(this.$accessor.liquidity.infos).filter((item: LiquidityPoolInfo) =>
                liquidityListV5.find((liquidityItem) => liquidityItem.ammId === item.ammId)
              )
            }, 1)
            return
          }
        } else {
          this.userCreateAmmId = ''
        }
      }
    } else {
      // check coin
      if (this.rewardCoin !== null) {
        const newFromCoin = Object.values(TOKENS).find((item) => item.mintAddress === this.rewardCoin?.mintAddress)
        if (newFromCoin === null || newFromCoin === undefined) {
          this.rewardCoin = null
        }
      }
    }
    this.coinSelectShow = false
    this.selectFromCoin = false
    this.selectTokenA = false
    this.selectTokenB = false
  }

  disabledStartDate(startTime: any) {
    const endTime = this.endTime
    if (!startTime || !endTime) {
      return false
    }
    if (startTime < moment().endOf('day')) {
      return true
    }
    return startTime.valueOf() > endTime.valueOf()
  }
  disabledEndDate(endTime: any) {
    const startTime = this.startTime
    if (!endTime || !startTime) {
      return false
    }
    return startTime.valueOf() >= endTime.valueOf()
  }
  handleStartOpenChange(open: any) {
    if (!open) {
      this.endOpen = true
    }
  }
  handleEndOpenChange(open: any) {
    this.endOpen = open
  }
  updateLocalData() {
    if (localStorage.getItem('userCreateAMMID') !== null) {
      // @ts-ignore
      this.userLocalAmmIdList = localStorage.getItem('userCreateAMMID').split('+++')
    } else {
      this.userLocalAmmIdList = []
    }
  }

  getNameForMint(mint: string) {
    const mintToken = Object.values(TOKENS).find((item) => item.mintAddress === mint)
    if (mintToken) {
      return `${mintToken.symbol}: ${mint}`
    }
    return mint
  }

  getSymbolForMint(mint: string) {
    const mintToken = Object.values(TOKENS).find((item) => item.mintAddress === mint)
    if (mintToken) {
      return `${mintToken.symbol}`
    }
    return mint
  }

  async getMarketMsg() {
    this.getMarketLoading = true
    this.marketInputFlag = !this.marketInputFlag
    const { market, price, msg, baseMintDecimals, quoteMintDecimals } = await getMarket(this.$web3, this.inputMarket)

    if (this.inputMarket && market !== null) {
      this.expectAmmId = (
        await createAssociatedId(
          new PublicKey(LIQUIDITY_POOL_PROGRAM_ID_V4),
          new PublicKey(this.inputMarket),
          AMM_ASSOCIATED_SEED
        )
      ).toString()
    }
    if (market === null) {
      this.marketInputFlag = !this.marketInputFlag
      this.stepsStatus = 'error'
      this.stepTitleInputMarket = msg
    } else {
      this.stepsStatus = 'process'
      this.current = 1
      this.marketMsg = market
      this.marketPrice = price
      this.marketTickSize = getBigNumber(new BigNumber(market.tickSize))
      this.baseMintDecimals = baseMintDecimals
      this.quoteMintDecimals = quoteMintDecimals
      this.marketStr = this.inputMarket
    }
    this.getMarketLoading = false
  }

  rewriteMarket() {
    this.marketInputFlag = !this.marketInputFlag
    this.current = 0
    this.marketMsg = null
    this.inputMarket = ''
    this.inputQuoteValue = 0
    this.inputBaseValue = 0
    this.inputPrice = 0
    this.marketError = null
    this.createAmmFlag = false
    this.userCreateAmmId = ''
    this.stepTitleMarketInfo = 'Price & Initial Liquidity'
    this.stepTitleInit = 'Initialize'
    clearLocal()
  }

  createKey() {
    this.stepTitleMarketInfo = 'Price & Initial Liquidity'
    this.stepTitleInit = 'Initialize'
    if (
      this.marketMsg == null ||
      this.inputQuoteValue === null ||
      this.inputBaseValue === null ||
      this.inputPrice === null ||
      this.inputQuoteValue <= 0 ||
      this.inputBaseValue <= 0 ||
      this.inputPrice <= 0
    ) {
      this.stepTitleMarketInfo = 'Please input coin value'
      this.stepsStatus = 'error'
      return
    } else {
      this.stepTitleMarketInfo = 'Price & Initial Liquidity'
      this.stepsStatus = 'process'
    }

    this.createAmmFlag = true

    createAmm(this.$web3, this.$wallet, this.marketMsg, this.inputBaseValue, this.inputQuoteValue)
      .then(async (data) => {
        this.current = 2
        this.stepsStatus = 'process'
        this.userCreateAmmId = data
        if (localStorage.getItem('userCreateAMMID') !== null) {
          localStorage.setItem('userCreateAMMID', localStorage.getItem('userCreateAMMID') + '+++')
        } else {
          localStorage.setItem('userCreateAMMID', '')
        }
        localStorage.setItem(
          'userCreateAMMID',
          localStorage.getItem('userCreateAMMID') +
            `${new Date().getTime()}---${data}---${
              this.marketMsg.address
            }---${this.marketMsg.baseMintAddress.toString()}---${this.marketMsg.quoteMintAddress.toString()}`
        )
        this.updateLocalData()
        this.createAmmFlag = true
        window.localStorage.pool_last_updated = undefined
        await this.$accessor.liquidity.requestInfos()
      })
      .catch((error) => {
        this.stepsStatus = 'error'
        this.current = 1
        this.createAmmFlag = false
        this.stepTitleInit = error.message
        throw error
      })
  }
}
</script>

<style lang="less">
.ant-steps-vertical {
  .ant-steps-item-content {
    min-height: 60px;
  }

  .ant-steps-item-active,
  .ant-steps-item-finish {
    .ant-steps-item-tail::after,
    .ant-steps-item-icon {
      background-color: #13ecab !important;
    }

    .ant-steps-item-title {
      color: #13ecab !important;
    }
  }

  .ant-steps-item-error {
    .ant-steps-item-icon {
      background-color: red !important;
    }
  }

  .ant-steps-item-process,
  .ant-steps-item-finish {
    .ant-steps-item-title {
      font-weight: 700 !important;
    }
  }

  .ant-steps-item {
    .ant-steps-item-container {
      .ant-steps-item-tail::after {
        background-color: #40426c;
      }

      .ant-steps-item-icon {
        width: 26px;
        height: 26px;
        background-color: #40426c;

        .ant-steps-icon {
          font-size: 20px;
          font-weight: 600;
          line-height: 25px;
          color: #01033c;
        }
      }

      .ant-steps-item-title {
        font-size: 20px;
        line-height: 25px;
        font-weight: normal;
      }
    }
  }
}
</style>

<style lang="less" scoped>
main {
  background-color: #01033c;
  background-image: unset;
  background-size: cover;
  background-position: center bottom;
}

.create-pool {
  max-width: 90%;

  @media (max-width: @mobile-b-width) {
    min-width: 100%;
  }

  input[type='number'] {
    border: unset;
    background: transparent;
    border-bottom: 1px solid #fff;
  }

  .ant-calendar-date:hover {
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
    background-origin: border-box;
  }

  .create {
    display: inline-block;
    margin-right: 10px;
    padding: 9px 0;
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
    background-origin: border-box;
    border: 2px solid rgba(255, 255, 255, 0.14);
    border-radius: 8px;
    width: 163px;
    text-align: center;

    @media (max-width: @mobile-b-width) {
      width: 140px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
    }

    button {
      background: unset !important;
      color: #fff;
      border-color: transparent;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 42px;
      letter-spacing: -0.05em;
      padding: 0;

      @media (max-width: @mobile-b-width) {
        font-size: 14px;
        line-height: 24px;
      }
    }
  }

  .next {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    padding: 9px 0;
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
    background-origin: border-box;
    border: 2px solid rgba(255, 255, 255, 0.14);
    border-radius: 8px;
    width: 163px;
    text-align: center;

    @media (max-width: @mobile-b-width) {
      width: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
    }

    button {
      height: 45px;
      background: unset !important;
      color: #fff;
      border-color: transparent;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 42px;
      letter-spacing: -0.05em;
      padding: 0;

      @media (max-width: @mobile-b-width) {
        font-size: 14px;
        line-height: 24px;
      }

      .spinner-container {
        .ant-spin {
          position: absolute;
          top: 10px;
          right: 15px;
        }
      }
    }
  }

  .disable-next {
    background: #828282;
    border: 2px solid #ffffff24;
  }

  .card-body {
    grid-row-gap: 0;
    row-gap: 0;
    padding-bottom: 15px;

    .fs-container {
      display: flex;
      justify-content: space-between;
      align-items: center;

      @media (max-width: @mobile-b-width) {
        display: block;
      }

      .buttonsd {
        @media (max-width: @mobile-b-width) {
          padding: 20px 15px;
          border: 4px solid #16164a;
          box-sizing: border-box;
          border-radius: 14px;
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }

  .design-farm {
    border: 4px solid #16164a;
    border-radius: 14px;
    padding: 40px 60px;
    background-color: #16164a;

    @media (max-width: @mobile-b-width) {
      padding: 20px 16px;
    }

    .title {
      font-size: 30px;
      font-weight: 600;
      line-height: 37px;
      background: transparent;

      @media (max-width: @mobile-b-width) {
        font-size: 23px;
        font-weight: 600;
        line-height: 28px;
      }
    }
  }

  .bordered-left {
    border-left: 3px solid #ffffff30;
  }

  .bordered-right {
    border-right: 3px solid #ffffff30;
  }

  .bordered-left,
  .bordered-right {
    @media (max-width: @mobile-b-width) {
      border: none;
    }
  }

  .step {
    padding-top: 30px;

    @media (max-width: @mobile-b-width) {
      padding-top: 0;
    }
  }

  .notstep {
    vertical-align: middle;
    padding-top: 30px;
    padding-left: 50px;

    @media (max-width: @mobile-b-width) {
      padding-left: 0;
    }

    .ant-row {
      align-items: baseline;
      line-height: 40px;

      .item-title {
        margin-bottom: 30px;

        .selected-pool {
          font-size: 15px;
          line-height: 18px;

          .selected-pool-box {
            position: relative;
            margin-top: 10px;
            padding: 17px 10px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 6px;
            font-size: 18px;
            line-height: 22px;
            text-align: center;
            color: #fff;
            word-break: break-word;

            .pool-info:nth-child(2) {
              margin-top: 12px;
            }

            img {
              position: absolute;
              top: 6px;
              right: 9px;
              cursor: pointer;
            }
          }

          @media (max-width: @mobile-b-width) {
            margin-left: -30px;

            .selected-pool-box {
              text-align: left;
              font-size: 15px;
              line-height: 18px;

              .pool-info span {
                display: block;
              }
            }
          }
        }

        .max-100 {
          max-width: 100% !important ;
        }

        .max-80 {
          max-width: 80% !important ;

          @media (max-width: @mobile-b-width) {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }

        b {
          font-weight: bold;
          font-size: 20px;
          line-height: 25px;
        }
        
        .created-amm-id {
          font-size: 16px;
          line-height: 18px;
          color: #80819D;

          b {
            font-size: 16px;
          }
        }
        
        .inner-content {
          padding: 20px 0 0 30px;
          max-width: 615px;

          @media (max-width: @mobile-b-width) {
            max-width: @mobile-b-width;
          }

          label {
            font-size: 16px;
            line-height: 19px;
            color: #ffffff50;
          }

          .market-info {
            display: inline-flex;
            font-size: 16px;
            line-height: 20px;
            color: #80819d;

            div {
              margin-right: 10px;
            }
          }

          .label {
            font-size: 18px;
            line-height: 22px;
            color: rgb(133, 133, 141);
            width: max-content;
            padding-left: 10px;

            @media (max-width: @mobile-b-width) {
              width: 100%;
              font-size: 15px;
              line-height: 18px;
              text-align: center;
            }
          }

          .label-today,
          .label-to {
            font-size: 18px;
            line-height: 22px;
            margin-bottom: 10px;
            padding-left: 10px;

            @media (max-width: @mobile-b-width) {
              font-size: 12px;
              line-height: 15px;
            }
          }

          .label-today {
            color: #80819d;
          }

          .label-to {
            color: #fff;
          }

          .calendar-from,
          .calendar-to {
            position: relative;

            img:nth-child(1) {
              position: absolute;
              top: 15%;
              left: 20%;

              @media (max-width: @mobile-b-width) {
                left: 7%;
              }
            }

            img:nth-child(3) {
              position: absolute;
              top: 35%;
              right: 5%;
              width: 11px;
              height: 6px;
              transition: transform 0.3s;
            }
          }

          input {
            border: 4px solid #16164a;
            background: #ffffff10;
            border-radius: 14px;
            padding: 20px 25px;
            font-size: 16px;
            line-height: 19px;
            outline: 0;
            width: 100%;
          }

          .detailed-guide {
            margin-top: 20px;
            font-size: 18px;
            line-height: 22px;
            color: #80819d;
            text-align: center;

            a {
              color: #13ecab;
            }

            b {
              font-size: 18px;
              line-height: 22px;
            }
          }
        }

        .market-input-group {
          display: flex;
          align-items: center;

          .market-input-info {
            font-size: 16px;
            line-height: 19px;

            b {
              font-size: 16px;
            }
          }

          .market-input-form {
            input {
              background: #ffffff10;
              border-radius: 14px;
              padding: 18px;
              font-size: 18px;
              line-height: 22px;
            }
          }
        }

        .token-mint-address {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          
          .mint-address {
            background: #ffffff10;
            border-radius: 14px;
            padding: 15px;
            font-size: 16px;
            line-height: 20px;
            color: #80819d;
            word-break: break-all;

            b {
              font-size: 16px;
            }
          }
        }

        .reward-emission,
        .farm-duration {
          @media (max-width: @mobile-b-width) {
            padding: 0;
            margin: 0 -10px;
          }
        }

        .note-reminder u,
        .reward-emission .label u {
          text-underline-position: under;
        }

        .create-amm {
          line-height: 22px;

          @media (max-width: @mobile-b-width) {
            line-height: 18px;
          }

          em {
            font-size: 18px;
            color: #80819d;

            @media (max-width: @mobile-b-width) {
              font-size: 15px;
            }
          }

          .link-pool {
            margin-bottom: 10px;
            display: block;

            u {
              text-underline-position: under;
              text-decoration-color: #13ecab;

              em {
                color: #13ecab;
              }
            }
          }
        }

        .existing-amm,
        .create-amm,
        .selected-pool {
          padding: 0 30px 25px 30px;

          @media (max-width: @mobile-b-width) {
            padding: 0 0 25px 0;
          }
        }

        .reward-weekly,
        .amm-id {
          font-size: 18px;
          line-height: 22px;
          margin-top: 15px;
          padding-left: 10px;

          @media (max-width: @mobile-b-width) {
            word-break: break-all;
            font-size: 15px;
            line-height: 18px;

            b {
              font-size: 15px;
              line-height: 18px;
            }
          }
        }

        .pool-created {
          line-height: 25px;

          @media (max-width: @mobile-b-width) {
            text-align: center;
          }
        }
      }
      .lp-icons {
        margin-bottom: 30px;

        .lp-icons-group {
          height: 51px;
          background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
          background-origin: border-box;
          border-radius: 8px;
          padding: 2px;

          @media (max-width: @mobile-b-width) {
            margin: auto;
          }

          .icons {
            height: 47px;
            background-color: #01033c;
            border-radius: 8px;
            align-items: center;
            padding: 0 20px;
          }

          .icons span {
            margin-left: 12px;
            margin-right: 12px;
            font-weight: 400;
            font-size: 18px;
            line-height: 21px;
          }
        }

        .title {
          font-weight: normal;
          font-size: 18px;
          line-height: 21px;
          color: #fff;
          opacity: 0.5;
        }
      }
    }
  }
}

.coin-select .coin-input button:hover {
  background-color: rgba(0, 0, 0, 0.9471) !important;
}

.ant-layout {
  background: #01033c !important;
}
</style>