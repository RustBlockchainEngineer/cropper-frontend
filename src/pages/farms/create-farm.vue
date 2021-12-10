<template>
  <div class="container create-farm">
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
      :userClose="false"
      @onClose="() => (ammIdSelectShow = false)"
      @onSelect="onAmmIdSelect"
    />
    <div class="card">
      <div class="card-body">
        <div class="page-head fs-container">
          <span class="title">Farm creation</span>
          <span class="buttonsd">
            <a href="https://docs.cropper.finance/cropperfinance/cropperfinance-platform-1/builder-tutorial/create-a-permissionless-farm" target="_blank">
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
            <span class="title">Design your own farm</span>
          </div>

          <Row>
            <Col
              :span="isMobile ? 24 : 6"
              class="step"
              :class="{ 'bordered-right': !wallet.connected }"
            >
              <Steps :current="current" size="small" direction="vertical" style="width: auto" :status="stepsStatus">
                <Step
                  ><template slot="title">
                    <div style="color: #13ecab">Select options</div>
                  </template></Step
                >
                <Step>
                  <template slot="title">
                    <div v-if="current > 1 || (current === 1 && stepsStatus !== 'error')">Farm Initialization</div>
                    <div v-else-if="current === 1 && stepsStatus === 'error'" style="color: red">
                      Farm Initialization
                    </div>
                    <div v-else style="color: #40426c">Farm Initialization</div>
                  </template></Step
                >
                <Step>
                  <template slot="title">
                    <div v-if="current > 2 || (current === 2 && stepsStatus !== 'error')">Farm Created</div>
                    <div v-else-if="current === 2 && stepsStatus === 'error'" style="color: red">Farm Created</div>
                    <div v-else style="color: #40426c">Farm Created</div>
                  </template></Step
                >
              </Steps>
            </Col>

            <Col
              :span="isMobile ? 24 : 18"
              class="notstep"
              :class="{ 'bordered-left': wallet.connected }"
            >
              <Row v-if="current === 0 && !wallet.connected">
                <Col
                  :span="isMobile ? 24 : 24"
                  style="text-align: center"
                  class="item-title"
                >
                  <div v-if="!wallet.connected" class="create">
                    <Button size="large" ghost style="width: 100%" @click="$accessor.wallet.openModal">
                      Connect wallet
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row v-if="current === 0 && wallet.connected">
                <Col :span="24" class="item-title">
                  <div>
                    <b>Farm Type:</b>
                  </div>
                  <div class="inner-content">
                    <RadioGroup v-model="farmType" @change="selectFarm">
                      <Radio :value="1">Single yield farm</Radio>
                      <Radio :value="2" disabled>Dual yield farm (Soon)</Radio>
                    </RadioGroup>
                  </div>
                </Col>
                <Col :span="24" class="item-title">
                  <div>
                    <b>Token pairing and AMM ID:</b>
                  </div>
                  <div class="inner-content max-100">
                    <RadioGroup v-model="ammType" @change="selectAMM">
                      <Radio :value="1" v-if="isMobile">Use existing AMM ID</Radio>
                      <Radio :value="1" v-if="!isMobile">Use existing CropperFinance's AMM ID</Radio>
                      <Row class="existing-amm">
                        <Col :span="isMobile ? 24 : 12">
                          <CoinNameInput
                            :label="'Token A'"
                            :mint-address="tokenA ? tokenA.mintAddress : ''"
                            :coin-name="tokenA ? tokenA.symbol : ''"
                            @onSelect="openTokenASelect"
                            :disabled="ammType != 1 ? true : false"
                          />
                        </Col>
                        <Col :span="isMobile ? 24 : 12">
                          <CoinNameInput
                            :label="'Token B'"
                            :mint-address="tokenB ? tokenB.mintAddress : ''"
                            :coin-name="tokenB ? tokenB.symbol : ''"
                            @onSelect="openTokenBSelect"
                            :disabled="ammType != 1 ? true : false"
                          />
                        </Col>
                      </Row>
                      <div class="selected-pool" v-if="showSelectedPool && ammType == 1">
                        Selected Pool
                        <div class="selected-pool-box">
                          <div class="pool-info">AMM ID: <span>{{ userCreateAmmId }}</span></div>
                          <div v-if="userCreatePoolLiquidity" class="pool-info">Pool Liquidity: <span>{{ userCreatePoolLiquidity }}</span></div>
                          <img src="@/assets/icons/close-icon.svg" @click="removeSelected" />
                        </div>
                      </div>
                      <Radio :value="2">Create a new AMM ID</Radio>
                      <Row class="create-amm" v-if="ammType != 1">
                        <NuxtLink to="/pools/create-pool" class="link-pool">
                          <u><em>https://cropper.finance/pools/create-pool/</em></u>
                        </NuxtLink>
                        <div class="note-reminder">
                          <em><u>Note:</u> Only USDC, USDT, SOL and CRP pairs will be eligible to farm creation.</em>
                        </div>
                      </Row>
                    </RadioGroup>
                    <div class="info-guide">
                      <img src="@/assets/icons/info-icon.svg" />
                      <em>
                        This tool is for advanced users. Before attempting to create a new farm, we suggest going through this
                        <a
                          href="https://docs.cropper.finance/cropperfinance/cropperfinance-platform-1/builder-tutorial/create-a-permissionless-farm"
                          target="_blank"
                        >
                          detailed guide.</a
                        ></em>
                    </div>
                  </div>
                </Col>
                <Col
                  v-if="ammType === 1"
                  :span="isMobile ? 24 : 24"
                  style="text-align: center"
                  class="item-title"
                >
                  <div class="next">
                    <Button
                      size="large"
                      ghost
                      class="button_div"
                      :disabled="!wallet.connected"
                      style="z-index: 999; width: 100%"
                      @click="useExistingAMMID()"
                    >
                      Next
                    </Button>
                  </div>
                </Col>
                <Col
                  v-if="ammType === 2"
                  :span="isMobile ? 24 : 24"
                  style="text-align: center"
                  class="item-title"
                >
                  <div class="next disable-next">
                    <Button
                      size="large"
                      ghost
                      class="button_div"
                      :disabled="true"
                      style="z-index: 999; width: 100%"
                      @click="createNewAMMID()"
                    >
                      Next
                    </Button>
                  </div>
                </Col>
              </Row>

              <!-- Create Farm -->
              <Row v-if="current === 1">
                <Col :span="isMobile ? 24 : 24" class="item-title">
                  <div>
                    <b>Reward emission:</b>
                  </div>
                  <div class="inner-content reward-emission">
                    <CoinInput
                      v-model="fromCoinAmount"
                      label="Initial Reward Token Amount"
                      :balance-offset="rewardCoin && rewardCoin.symbol === 'SOL' ? -0.05 : 0"
                      :mint-address="rewardCoin ? rewardCoin.mintAddress : ''"
                      :coin-name="rewardCoin ? rewardCoin.symbol : ''"
                      :balance="rewardCoin ? rewardCoin.balance : null"
                      :show-half="true"
                      :show-arrow="false"
                      @onInput="(amount) => (fromCoinAmount = amount)"
                      @onFocus="
                        () => {
                          fixedFromCoin = true
                        }
                      "
                      @onMax="
                        () => {
                          fixedFromCoin = true
                          fromCoinAmount = rewardCoin && rewardCoin.balance ? rewardCoin.balance.fixed() : '0'
                        }
                      "
                    />
                    <!-- <CoinInput
                      @onSelect="openFromCoinSelect"
                    /> -->
                    <div class="label">
                      <span
                        ><em><u>Note:</u> you will be able to add rewards into your farm whenever you want.</em></span
                      >
                    </div>
                  </div>
                </Col>
                <Col :span="isMobile ? 24 : 24" class="item-title">
                  <div>
                    <b>Farm duration:</b>
                  </div>
                  <div class="inner-content farm-duration">
                    <label class="label-today">From today</label>
                    <div class="calendar-from">
                      <img src="@/assets/icons/calendar-from.svg" />
                      <DatePicker
                        v-model="startTime"
                        format="dddd, DD MMMM YYYY"
                        @openChange="handleStartOpenChange"
                        disabled
                      />
                    </div>
                    <label class="label-to">To</label>
                    <div class="calendar-to">
                      <img src="@/assets/icons/calendar-to.svg" />
                      <DatePicker v-model="endTime" format="dddd, DD MMMM YYYY" @openChange="handleEndOpenChange" />
                      <img src="@/assets/icons/arrow-down.svg" :style="endOpen ? 'transform: rotate(180deg);' : ''"/>
                    </div>
                    <div class="reward-weekly">
                      <b>Reward per week:</b>&nbsp; {{ rewardPerWeek }} &nbsp;{{
                        rewardCoin != null ? rewardCoin.symbol : ''
                      }}
                    </div>
                    <div class="amm-id"><b>AMM ID:</b>&nbsp;{{ userCreateAmmId }}</div>
                    <div class="info-guide">
                      <img src="@/assets/icons/info-icon.svg" />
                      <em>
                        You will have to <b>validate 2 transactions.</b>
                      </em>
                    </div>
                  </div>
                </Col>

                <Col :span="isMobile ? 24 : 24" style="text-align: center">
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
                      v-else-if="farm_created"
                      size="large"
                      :disabled="!wallet.connected"
                      ghost
                      style="z-index: 999; width: 100%"
                      @click="addRewardToFarm"
                    >
                      

                      <span v-if="activeSpin">
                        Please wait &nbsp; &nbsp; 
                      </span>
                      <span v-else>
                        Add rewards
                      </span>

                      <div v-if="activeSpin" class="spinner-container">
                        <Spin :spinning="true">
                          <Icon slot="indicator" type="loading" style="font-size: 24px" spin />
                        </Spin>
                      </div>
                    </Button>
                    <Button
                      v-else
                      size="large"
                      :disabled="!wallet.connected"
                      ghost
                      style="z-index: 999; width: 100%"
                      @click="confirmFarmInfo"
                    >
                      <span v-if="activeSpin">
                        Please wait &nbsp; &nbsp; 
                      </span>
                      <span v-else>
                        Confirm
                      </span>
                      <div v-if="activeSpin" class="spinner-container">
                        <Spin :spinning="true">
                          <Icon slot="indicator" type="loading" style="font-size: 24px" spin />
                        </Spin>
                      </div>
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row v-if="current === 2">
                <Col
                  v-if="!isCRPTokenPair"
                  :span="24"
                  class="item-title"
                >
                  <div class="farm-created">
                    <b>Congratulations! Your farm has been successfully created!</b>
                  </div>
                </Col>
                <Col class="lp-icons" :span="24">
                  <div class="lp-icons-group">
                    <div class="icons">
                      <CoinIcon :mint-address="tokenA.mintAddress" />
                      <span>{{ tokenA.symbol }} - </span>
                      <CoinIcon :mint-address="tokenB.mintAddress" />
                      <span>{{ tokenB.symbol }}</span>
                    </div>
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
                    <Button
                      v-else
                      size="large"
                      :disabled="!wallet.connected"
                      ghost
                      style="z-index: 999; width: 100%"
                      @click="gotoFarms"
                    >
                      View Farms
                    </Button>
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
import { Steps, Row, Col, Button, Tooltip, Icon, DatePicker, Radio, Spin } from 'ant-design-vue'
import { getMarket, createAmm, clearLocal } from '@/utils/market'
import BigNumber from '@/../node_modules/bignumber.js/bignumber'
import { TokenAmount } from '@/utils/safe-math'
import { NATIVE_SOL, TokenInfo, TOKENS, getTokenByMintAddress } from '@/utils/tokens'
import { createAssociatedId } from '@/utils/web3'
import { PublicKey } from '@solana/web3.js'
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
import { getCropperPoolListByTokenMintAddresses, LIQUIDITY_POOLS, LiquidityPoolInfo } from '@/utils/pools'
import { Token } from '@solana/spl-token'
const Step = Steps.Step
const RadioGroup = Radio.Group

@Component({
  head: {
    title: 'CropperFinance Create Farm'
  },
  components: {
    Steps,
    Row,
    Col,
    Button,
    Step,
    Tooltip,
    Icon,
    DatePicker,
    RadioGroup,
    Radio,
    Spin
  }
})
export default class CreateFarm extends Vue {
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
  endTime: any = moment().add(28, 'days');
  endOpen: any = false
  isCRPTokenPair: boolean = false
  ammIdSelectShow: boolean = false
  ammIdSelectList: any = []

  farmId: any = null
  current: number = 0
  rewardTokenForced: any = null

  marketInputFlag: boolean = true
  marketFlag: boolean = false
  inputMarket: string = ''
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

  createAmmFlag: boolean = false

  stepTitleInputMarket: string = 'Market ID'
  stepTitleMarketInfo: string = 'Price & Initial Liquidity'
  stepTitleInit: string = 'Pool initialization'

  marketTickSize: number = 1

  userCreateAmmId: string = ''
  userCreatePoolLiquidity: string = ''

  liquidityValueChangeFlag: boolean = true

  userLocalAmmIdList: string[] = []

  expectAmmId: undefined | string

  farmType: number = 1
  ammType: number = 1
  showSelectedPool: boolean = false
  activeSpin: boolean = false
  farm_created: boolean = false

  get rewardPerWeek() {
    let result = 0
    let initialAmount = Number.parseFloat(this.fromCoinAmount)


    if ((this.startTime.unix() + (14 * 86400)) > this.endTime.unix()) {
      this.endTime = moment().set('second', (14 * 86400));
    }

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
      const walletBaseAmount = parseFloat(
        get(this.wallet.tokenAccounts, `${this.marketMsg.baseMintAddress.toBase58()}.balance`).fixed()
      )
      const walletQuoteAmount = parseFloat(
        get(this.wallet.tokenAccounts, `${this.marketMsg.quoteMintAddress.toBase58()}.balance`).fixed()
      )

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

  @Watch('inputMarket')
  onInputMarketChanged(val: string) {
    this.inputMarket = val.replace(/(^\s*)|(\s*$)/g, '')
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


    const query = new URLSearchParams(window.location.search)
    if (query.get('rtf')) this.rewardTokenForced = query.get('rtf') as string
    

  }

  async addRewardToFarm() { 
    this.activeSpin = true
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

    if ((startTimestamp + (14 * 86400)) > endTimestamp) {
      this.$notify.error({
        key: 'Period',
        message: 'Checking period',
        description: 'farm can\'t be shorter than 14 days'
      })
      return
    }
    try {

      let fetchedFarm = await YieldFarm.loadFarm(connection, this.farmId, new PublicKey(FARM_PROGRAM_ID))

      if (fetchedFarm) {
        await fetchedFarm.addReward(wallet, userRewardTokenPubkey, initialRewardAmount * Math.pow(10, rewardDecimals))
        this.current += 1
      }

    } catch {
      this.activeSpin = false;
      console.log('creating farm failed')
    }
  }

  async confirmFarmInfo() {
    this.activeSpin = true
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

    if ((startTimestamp + (14 * 86400)) > endTimestamp) {
      this.$notify.error({
        key: 'Period',
        message: 'Checking period',
        description: 'farm can\'t be shorter than 14 days'
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

      this.farmId = createdFarm.farmId
      window.localStorage['owner_'+ createdFarm.farmId] = 1;

      this.activeSpin = false;
      this.farm_created = true;

    } catch {
      this.activeSpin = false;
      this.farm_created = false;
      console.log('creating farm failed')
    }
  }

  async createFarmAndAddReward() {
    this.activeSpin = true
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
      let createdFarm = await YieldFarm.createFarmAndAddRewardWithParams(
        connection,
        wallet,
        rewardMintPubkey,
        lpMintPubkey,
        ammPubkey,
        startTimestamp,
        endTimestamp,

        userRewardTokenPubkey, 
        initialRewardAmount * Math.pow(10, rewardDecimals)
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

      this.farmId = createdFarm.farmId
      window.localStorage['owner_'+ createdFarm.farmId] = 1;

      this.activeSpin = false;
      this.farm_created = true;

    } catch {
      this.activeSpin = false;
      this.farm_created = false;
      console.log('creating farm failed')
    }

    try {
      let fetchedFarm = await YieldFarm.loadFarm(connection, this.farmId, new PublicKey(FARM_PROGRAM_ID))
      if (!fetchedFarm){
        console.log("can't fetch farm",this.farmId);
      }
    } catch {
      this.activeSpin = false;
      console.log('creating farm failed')
    }

    this.current += 1
  }
  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  gotoFarms() {
    this.$accessor.farm.requestInfos()
    this.$accessor.wallet.getTokenAccounts()
    this.$router.push({ path: `/farms/#${this.farmId}` })
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
    this.current = 1
  }
  createNewAMMID() {
    this.userCreateAmmId = ''
    this.current++
  }
  onAmmIdSelect(liquidityInfo: LiquidityPoolInfo | undefined) {
    this.ammIdSelectShow = false
    if (liquidityInfo) {
      let SymbolA = liquidityInfo.coin.symbol
      let SymbolB = liquidityInfo.pc.symbol
      let SymbolA_value = liquidityInfo.coin.balance
        ? getBigNumber((liquidityInfo.coin.balance as TokenAmount).toEther())
        : 0
      let SymbolB_value = liquidityInfo.pc.balance
        ? getBigNumber((liquidityInfo.pc.balance as TokenAmount).toEther())
        : 0
      this.userCreatePoolLiquidity = SymbolA_value + ' ' + SymbolA + ' | ' + SymbolB_value + ' ' + SymbolB
      this.userCreateAmmId = liquidityInfo.ammId
      this.showSelectedPool = true
    } else {
      this.userCreateAmmId = ''
      this.current++
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
    this.showSelectedPool = false
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
          const liquidityListV5 = getCropperPoolListByTokenMintAddresses(
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
              // @ts-ignore
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

    if(this.rewardTokenForced){
      this.rewardCoin = getTokenByMintAddress(this.rewardTokenForced);
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
    //@zhaohui
    // this.getMarketLoading = true

    // let market_t = {
    //   address: new PublicKey('9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT'),
    //   baseMintAddress: new PublicKey(TOKENS.B2B.mintAddress),
    //   quoteMintAddress: new PublicKey(TOKENS.CRP.mintAddress),
    //   tickSize: 5,
    //   minOrderSize: 10
    // }

    // this.expectAmmId = (
    //     await createAssociatedId(
    //       new PublicKey(LIQUIDITY_POOL_PROGRAM_ID_V4),
    //       new PublicKey('9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT'),
    //       AMM_ASSOCIATED_SEED
    //     )
    //   ).toString()

    // let price_t = 3.5, baseMintDecimals_t = 9, quoteMintDecimals_t = 9
    // this.stepsStatus = 'process'
    // this.stepTitleInputMarket = 'Import Serum Market ID'
    // this.current = 2
    // this.marketMsg = market_t
    // this.marketPrice = price_t
    // this.marketTickSize = getBigNumber(new BigNumber(market_t.tickSize))
    // this.baseMintDecimals = baseMintDecimals_t
    // this.quoteMintDecimals = quoteMintDecimals_t
    // this.marketStr = this.inputMarket
    // this.getMarketLoading = false

    // // let market_info = {
    // //   address: new PublicKey('9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT'),
    // //   baseMintAddress: new PublicKey(TOKENS.USDT.mintAddress),
    // //   quoteMintAddress: new PublicKey(TOKENS.CRP.mintAddress),
    // //   ammId: new PublicKey('3gSjs6MqyHFsp8DXvaKvVUJjV7qg5itf9qmUGuhnSaWH')
    // // }

    // // createAmm(this.$web3, this.$wallet, market_info, 0.5, 1)
    // return;

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
      this.stepTitleInputMarket = 'Import Serum Market ID'
      this.current = 2
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
        this.current = 1
      })
      .catch((error) => {
        this.stepsStatus = 'error'
        this.current = 3
        this.createAmmFlag = false
        this.stepTitleInit = error.message
        throw error
      })
  }

  selectFarm(e: { target: { value: any } }) {
    console.log(e.target.value)
  }

  selectAMM(e: { target: { value: any } }) {
    console.log(e.target.value)
  }

  removeSelected() {
    this.tokenA = null
    this.tokenB = null
    this.userCreateAmmId = ''
    this.userCreatePoolLiquidity = ''
    this.showSelectedPool = false
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
          color: @color-bg;
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

.ant-radio-group {
  width: 100%;
}

.ant-radio-wrapper {
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 25px;
  color: #40426c;
  margin-bottom: 20px;
}

.ant-radio-wrapper-disabled {
  .ant-radio-inner {
    border-color: #40426c !important;
  }
  span {
    color: #40426c;
  }
}
.ant-radio-wrapper-checked {
  color: #fff;
}

.ant-radio {
  .ant-radio-inner {
    background: #16164a;
    border: 2px solid #40426c;
    box-sizing: border-box;
    border-radius: 7px;
    width: 21px;
    height: 21px;
  }

  .ant-radio-inner::after {
    position: absolute;
    width: 13px;
    height: 13px;
    border-radius: 4px;
    top: 2px;
    left: 2px;
    transform: scale(1);
    opacity: 1;
    transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    background-color: transparent;
  }
}

.ant-radio-checked {
  .ant-radio-inner {
    border-color: #ef745d;
  }

  .ant-radio-inner::after {
    background-color: #ef745d;
  }
}

.ant-radio-checked::after {
  border: none;
}

.ant-radio-wrapper:hover .ant-radio-inner,
.ant-radio:hover .ant-radio-inner {
  border-color: #ef745d;
}

.ant-radio .ant-radio-input:focus + .ant-radio-inner {
  border-color: #40426c;
}

.ant-radio-checked .ant-radio-input:focus + .ant-radio-inner {
  border-color: #ef745d;
}

.ant-calendar-picker {
  margin-bottom: 15px;
  width: 100%;

  i {
    display: none;
  }
}

.ant-calendar-picker-input.ant-input {
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 14px;
  padding: 25px 0;
  text-align: center;
  border: none;
  color: #fff;
  font-size: 18px;
  line-height: 22px;
  cursor: pointer;

  @media @max-b-mobile {
    font-size: 14px;
    line-height: 18px;
  }
}

.ant-calendar-picker-input.ant-input[disabled] {
  color: rgba(255,255,255,0.5);
}

.ant-calendar-picker-container {

  @media @max-b-mobile {
    width: calc(100% - 60px);
  }

  .ant-calendar {
    width: 585px;
    top: 60px;
    background: #1a1d6b;
    box-shadow: 0 30px 84px rgba(19, 10, 46, 0.08), 0 8px 32px rgba(19, 10, 46, 0.07), 0 3px 14px rgba(19, 10, 46, 0.03),
      0 1px 3px rgba(19, 10, 46, 0.13);
    border-radius: 12px;
    border: none;

    @media @max-b-mobile {
      max-width: 585px;
      width: 100%;
      margin: auto;
    }

    .ant-calendar-panel {
      width: 100%;

      .ant-calendar-input-wrap {
        display: none;
      }

      // Decade Panel
      .ant-calendar-decade-panel {
        background: #1a1d6b;
        .ant-calendar-decade-panel-header {
          border: none;
        }
        .ant-calendar-decade-panel-footer {
          display: none;
        }
      }

      // Day Panel
      .ant-calendar-date-panel {
        background: #1a1d6b;
        .ant-calendar-header {
          border: none;
        }
        .ant-calendar-footer {
          display: none;
        }
      }

      // Month Panel
      .ant-calendar-month-panel {
        background: #1a1d6b;
        .ant-calendar-month-panel-header {
          border: none;
        }
        .ant-calendar-month-panel-footer {
          display: none;
        }
      }

      // Year Panel
      .ant-calendar-year-panel {
        background: #1a1d6b;
        .ant-calendar-year-panel-header {
          border: none;
        }
        .ant-calendar-year-panel-footer {
          display: none;
        }
      }
    }
  }

  .ant-calendar-last-month-cell,
  .ant-calendar-next-month-btn-day {
    .ant-calendar-date {
      color: #c9c8cc40 !important;
    }
  }

  .ant-calendar table,
  .ant-calendar th {
    // Day Selection
    .ant-calendar-selected-day .ant-calendar-date {
      background: #ef745d;
    }

    .ant-calendar-today .ant-calendar-date {
      border-color: #ef745d;
    }

    .ant-calendar-cell {
      .ant-calendar-date {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        color: #f8f7fa;
      }

      .ant-calendar-date:hover {
        background-color: #ef745d;
      }
    }

    // Month Selection
    .ant-calendar-month-panel-selected-cell .ant-calendar-month-panel-month {
      background: #ef745d;
    }

    .ant-calendar-month-panel-cell {
      .ant-calendar-month-panel-month {
        max-width: 75px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        color: #f8f7fa;
      }

      .ant-calendar-month-panel-month:hover {
        background-color: #ef745d;
      }
    }

    // Year Selection
    .ant-calendar-year-panel-selected-cell .ant-calendar-year-panel-year {
      background: #ef745d;
    }

    .ant-calendar-year-panel-cell {
      .ant-calendar-year-panel-year {
        max-width: 75px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        color: #f8f7fa;
      }

      .ant-calendar-year-panel-year:hover {
        background-color: #ef745d;
      }
    }

    // Decade Selection
    .ant-calendar-decade-panel-selected-cell .ant-calendar-decade-panel-decade {
      background: #ef745d;
    }

    .ant-calendar-decade-panel-cell {
      .ant-calendar-decade-panel-decade {
        max-width: 75px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        color: #f8f7fa;
      }

      .ant-calendar-decade-panel-decade:hover {
        background-color: #ef745d;
      }
    }
  }
}
</style>

<style lang="less" scoped>
main {
  background-color: @color-bg;
  background-image: unset;
  background-size: cover;
  background-position: center bottom;
}

.create-farm {
  max-width: 90%;

  @media @max-b-mobile {
    min-width: 100%;
  }

  .ant-calendar-date:hover {
    background: @gradient-color-icon;
    background-origin: border-box;
  }

  .create {
    display: inline-block;
    margin-right: 10px;
    padding: 9px 0;
    background: @gradient-color-icon;
    background-origin: border-box;
    border: 2px solid rgba(255, 255, 255, 0.14);
    border-radius: 8px;
    width: 163px;
    text-align: center;

    @media @max-b-mobile {
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

      @media @max-b-mobile {
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
    background: @gradient-color-icon;
    background-origin: border-box;
    border: 2px solid rgba(255, 255, 255, 0.14);
    border-radius: 8px;
    width: 163px;
    text-align: center;

    @media @max-b-mobile {
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

      @media @max-b-mobile {
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
    border: 2px solid #FFFFFF24;
  }

  .card-body {
    grid-row-gap: 0;
    row-gap: 0;
    padding-bottom: 15px;

    .fs-container {
      display: flex;
      justify-content: space-between;
      align-items: center;

      @media @max-b-mobile {
        display: block;
      }

      .buttonsd {
        @media @max-b-mobile {
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
    margin-top: 20px;
    border: 4px solid #16164a;
    border-radius: 14px;
    padding: 40px 60px;
    background-color: #16164a;

    @media @max-b-mobile {
      padding: 20px 16px;
    }

    .title {
      font-size: 30px;
      font-weight: 600;
      line-height: 37px;
      background: transparent;

      @media @max-b-mobile {
        font-size: 23px;
        font-weight: 600;
        line-height: 28px;
      }
    }
  }

  .bordered-left {
    border-left: 3px solid rgba(255,255,255,0.3);
  }

  .bordered-right {
    border-right: 3px solid rgba(255,255,255,0.3);
  }

  .bordered-left,
  .bordered-right {
    @media @max-b-mobile {
      border: none;
    }
  }

  .step {
    padding-top: 20px;

    @media @max-b-mobile {
      padding-top: 0;
    }
  }

  .notstep {
    vertical-align: middle;
    padding-left: 50px;

    @media @max-b-mobile {
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

          @media @max-b-mobile {
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

          @media @max-b-mobile {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }

        .inner-content {
          padding: 20px 0 0 30px;
          max-width: 615px;
          
          @media @max-b-mobile {
            max-width: @mobile-b-width;
          }

          b {
            font-weight: bold;
            font-size: 20px;
            line-height: 25px;
          }

          .label {
            font-size: 18px;
            line-height: 22px;
            color: rgb(133, 133, 141);
            width: max-content;
            padding-left: 10px;

            @media @max-b-mobile {
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

            @media @max-b-mobile {
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
          
          .info-guide {
            font-size: 15px;
            line-height: 18px;
            display: flex;
            align-items: flex-start;

            em b {
              font-size: 15px;
              line-height: 18px;
            }

            img {
              margin-right: 10px;
            }
            
            a {
              color: #13ecab;
            }
          }

          .calendar-from,
          .calendar-to {
            position: relative;

            img:nth-child(1) {
              position: absolute;
              top: 15%;
              left: 20%;

              @media @max-b-mobile {
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
        }

        .reward-emission,
        .farm-duration {
          @media @max-b-mobile {
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

          @media @max-b-mobile {
            line-height: 18px;
          }

          em {
            font-size: 18px;
            color: #80819D;

            @media @max-b-mobile {
              font-size: 15px;
            }
          }

          .link-pool {
            margin-bottom: 10px;
            display: block;

            u {
              text-underline-position: under;
              text-decoration-color: #13ECAB;

              em {
                color: #13ECAB;
              }
            }
          }
        }

        .existing-amm,
        .create-amm,
        .selected-pool {
          padding: 0 30px 25px 30px;

          @media @max-b-mobile {
            padding: 0 0 25px 0;
          }
        }

        .reward-weekly,
        .amm-id {
          font-size: 18px;
          line-height: 22px;
          margin-top: 15px;
          padding-left: 10px;

          @media @max-b-mobile {
            word-break: break-all;
            font-size: 15px;
            line-height: 18px;

            b {
              font-size: 15px;
              line-height: 18px;
            }
          }
        }

        .amm-id {
          margin-bottom: 20px;
        }

        .farm-created {
          line-height: 25px;

          @media @max-b-mobile {
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

          @media @max-b-mobile {
            margin: auto;
          }

          .icons {
            height: 47px;
            background-color: @color-bg;
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
  background: @color-bg !important;
}
.msgClass div {
  line-height: 30px;
}
</style>