<template>
  <div class="container" :class="isMobile ? 'create-pool-mobile' : 'create-pool'">
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
      <div class="card-body" style="grid-row-gap: 0; row-gap: 0; padding-bottom: 15px">
        <div class="page-head fs-container">
          <span class="title">Design your own farm</span>
        </div>

        <Row>
          <Col :span="isMobile ? 24 : 6" :class="isMobile ? '' : 'step'">
            <Steps :current="current" size="small" direction="vertical" style="width: auto" :status="stepsStatus">
              <Step
                ><template slot="title">
                  <div style="color: #13ecab">Select options</div>
                </template></Step
              >
              <Step>
                <p slot="title" :style="current > 1 ? '' : 'color: #40426C'">
                  {{ stepTitleInputMarket }}
                  <Tooltip placement="right">
                    <div slot="title">
                      For details on creating a market ID,
                      <a
                        href="//cropper-finance.gitbook.io/cropperfinance/cropperfinance-platform-1/builder-tutorial/create-a-permissionless-pool"
                        target="_blank"
                      >
                        click here</a
                      >
                    </div>
                    <Icon type="info-circle" />
                  </Tooltip>
                </p>
              </Step>
              <Step
                ><template slot="title">
                  <div v-if="current > 2 || (current === 2 && stepsStatus !== 'error')">{{ stepTitleMarketInfo }}</div>
                  <div v-else-if="current === 2 && stepsStatus === 'error'" style="color: red">
                    {{ stepTitleMarketInfo }}
                  </div>
                  <div v-else style="color: #40426c">{{ stepTitleMarketInfo }}</div>
                </template></Step
              >
              <Step
                ><template slot="title">
                  <div v-if="current > 3 || (current === 3 && stepsStatus !== 'error')">{{ stepTitleInit }}</div>
                  <div v-else-if="current === 3 && stepsStatus === 'error'" style="color: red">{{ stepTitleInit }}</div>
                  <div v-else style="color: #40426c">{{ stepTitleInit }}</div>
                </template></Step
              >

              <Step
                ><template slot="title">
                  <div v-if="current > 4 && stepsStatus !== 'error'">Pool & Farm Created</div>
                  <div v-else-if="current === 4 && stepsStatus === 'error'" style="color: red">Pool & Farm Created</div>
                  <div v-else slot="title" style="color: #40426c">Pool Created</div>
                </template></Step
              >
              <Step
                ><template slot="title">
                  <div v-if="current > 5 || (current === 5 && stepsStatus !== 'error')">Farm Informations</div>
                  <div v-else-if="current === 5 && stepsStatus === 'error'" style="color: red">Farm Informations</div>
                  <div v-else style="color: #40426c">Farm Initialization</div>
                </template></Step
              >
              <Step
                ><template slot="title">
                  <div v-if="current > 6 || (current === 6 && stepsStatus !== 'error')">Farm Created</div>
                  <div v-else-if="current === 6 && stepsStatus === 'error'" style="color: red">Farm Created</div>
                  <div v-else style="color: #40426c">Farm Created</div>
                </template></Step
              >
            </Steps>
          </Col>

          <Col :span="isMobile ? 24 : 18" class="notstep">
            <Row v-if="current === 0 && wallet.connected">
              <Col :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'">
                <div>
                  <b>Farm Type:</b>
                  <br />
                  <RadioGroup v-model="farmType" @change="selectFarm">
                    <Radio :value="1">Single yield farm</Radio>
                    <Radio :value="2">Dual yield farm (Soon)</Radio>
                  </RadioGroup>
                </div>
              </Col>
              <Col :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'">
                <div>
                  <b>Token pairing and AMM ID:</b>
                  <br />
                  <RadioGroup v-model="ammType" @change="selectAMM">
                    <Radio :value="1">Use existing CropperFinance's AMM ID</Radio>
                    <Row class="existing-amm">
                      <Col
                        :span="isMobile ? 24 : 8"
                      >
                        <CoinNameInput
                          :label="'Token A'"
                          :mint-address="tokenA ? tokenA.mintAddress : ''"
                          :coin-name="tokenA ? tokenA.symbol : ''"
                          @onSelect="openTokenASelect"
                        />
                      </Col>
                      <Col
                        :span="isMobile ? 24 : 8"
                      >
                        <CoinNameInput
                          :label="'Token B'"
                          :mint-address="tokenB ? tokenB.mintAddress : ''"
                          :coin-name="tokenB ? tokenB.symbol : ''"
                          @onSelect="openTokenBSelect"
                        />
                      </Col>
                    </Row>
                    <Radio :value="2">Create a new AMM ID</Radio>
                  </RadioGroup>
                </div>
              </Col>
              <!-- <Col :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'">
                <div>AMM ID:</div>
              </Col>
              <Col :span="24"><input v-model="userCreateAmmId" /></Col> -->
              <Col
                v-if="ammType === 1"
                :span="isMobile ? 24 : 24"
                style="padding-bottom: 20px; padding-top: 10px; text-align: center"
              >
                <div class="create">
                  <Button
                    size="large"
                    ghost
                    class="button_div"
                    :disabled="!wallet.connected"
                    style="z-index: 999; width: 100%"
                    @click="useExistingAMMID()"
                  >
                    Use existing
                  </Button>
                </div>
              </Col>
              <Col
                v-if="ammType === 2"
                :span="isMobile ? 24 : 24"
                style="padding-bottom: 20px; padding-top: 10px; text-align: center"
              >
                <div class="create">
                  <Button
                    size="large"
                    ghost
                    class="button_div"
                    :disabled="!wallet.connected"
                    style="z-index: 999; width: 100%"
                    @click="createNewAMMID()"
                  >
                    Create a new
                  </Button>
                </div>
              </Col>
            </Row>
            <Row
              v-if="current === 0 && !wallet.connected"
              style="align-items: baseline; line-height: 40px; padding-bottom: 20px"
            >
              <Col :span="isMobile ? 24 : 24" style="padding-bottom: 20px; padding-top: 10px; text-align: center">
                <div v-if="!wallet.connected" class="create">
                  <Button size="large" ghost style="width: 100%" @click="$accessor.wallet.openModal">
                    Connect wallet
                  </Button>
                </div>
              </Col>
            </Row>
            <Row v-if="current === 1" style="align-items: baseline; line-height: 40px; padding-bottom: 20px">
              <Col :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'">
                <div style="padding-bottom: 10px; word-break: break-word">
                  This tool is for advanced users. Before attempting to create a new liquidity pool, we suggest going
                  through this
                  <a
                    href="https://cropper-finance.gitbook.io/cropperfinance/cropperfinance-platform-1/builder-tutorial/create-a-permissionless-pool"
                    target="_blank"
                  >
                    detailed guide.</a
                  >
                </div>
                <div>Input Serum Market ID:</div>
                <div>CRP/USDC: HPU7v2yCGM6sRujWEMaTPiiiX2qMb6fun3eWjTzSgSw1</div>
                <div>CRP/USDT: 3iCYi5bQxXN5X4omCxME1jj9D91vNpYYqzbiSw9u7tcG</div>
                <div>B2B/CRP: 2hEeVE354k6mpvHvzg8K8HvEAkL9HUMiZbcjarkuy7W7</div>
              </Col>
              <Col style="line-height: 20px" :span="24"
                ><input v-model="inputMarket" :disabled="!marketInputFlag"
              /></Col>

              <Col :span="isMobile ? 24 : 24" style="padding-bottom: 20px; padding-top: 10px; text-align: center">
                <div class="create">
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
                    :disabled="!wallet.connected"
                    style="z-index: 999; width: 100%"
                    :loading="getMarketLoading"
                    @click="marketInputFlag ? getMarketMsg() : rewriteMarket()"
                  >
                    {{ !wallet.connected ? 'Connect' : getMarketLoading ? '' : marketInputFlag ? 'Confirm' : 'Cancel' }}
                  </Button>
                </div>
              </Col>
            </Row>
            <div v-if="current >= 2 && current < 5" style="margin-top: 10px" class="msgClass">
              <Row>
                <Col :span="isMobile ? 24 : 24" :class="isMobile ? 'item-title-mobile' : 'item-title'"
                  ><b>Market Info:</b></Col
                >
                <Col :span="isMobile ? 24 : 24">
                  <div style="padding-left: 10px">
                    <div
                      style="width: 100%; display: inline-block"
                      :class="isMobile ? 'item-title-mobile' : 'item-title'"
                    >
                      Base Token Mint Address:
                      {{ getNameForMint(marketMsg.baseMintAddress.toBase58()) }}
                    </div>
                    <div
                      style="width: 100%; display: inline-block"
                      :class="isMobile ? 'item-title-mobile' : 'item-title'"
                    >
                      Quote Token Mint Address:
                      {{ getNameForMint(marketMsg.quoteMintAddress.toBase58()) }}
                    </div>

                    <div
                      style="width: 32%; display: inline-block"
                      :class="isMobile ? 'item-title-mobile' : 'item-title'"
                    >
                      Tick Size: {{ marketTickSize }}
                    </div>

                    <div
                      style="width: 32%; display: inline-block"
                      :class="isMobile ? 'item-title-mobile' : 'item-title'"
                    >
                      Min Order Size: {{ marketMsg.minOrderSize }}
                    </div>

                    <div
                      style="width: 32%; display: inline-block"
                      :class="isMobile ? 'item-title-mobile' : 'item-title'"
                    >
                      Current Price:
                      {{
                        marketMsg.tickSize.toString().split('.').length === 2
                          ? marketPrice.toFixed(marketMsg.tickSize.toString().split('.')[1].length)
                          : parseInt((marketPrice / marketMsg.tickSize).toFixed(0)) * marketMsg.tickSize
                      }}
                    </div>
                  </div>
                </Col>
                <div
                  style="margin-left: 20%; margin-top: 30px; width: 40%; display: inline-block"
                  :class="isMobile ? 'item-title-mobile' : 'item-title'"
                >
                  Set <b>{{ getSymbolForMint(marketMsg.baseMintAddress.toBase58()) }}</b> Starting Price in
                  <b>{{ getSymbolForMint(marketMsg.quoteMintAddress.toBase58()) }}</b
                  >:
                </div>
                <div style="width: 20%; display: inline-block">
                  <input
                    v-model="inputPrice"
                    type="number"
                    :disabled="createAmmFlag"
                    :step="1"
                    accuracy="2"
                    style="width: 100%"
                  />
                </div>
                <div
                  style="margin-left: 20%; margin-top: 10px; width: 40%; display: inline-block"
                  :class="isMobile ? 'item-title-mobile' : 'item-title'"
                >
                  <b>{{ getSymbolForMint(marketMsg.baseMintAddress.toBase58()) }}</b> Initial Liquidity:
                </div>
                <div style="width: 20%; display: inline-block">
                  <input
                    v-model="inputBaseValue"
                    type="number"
                    :disabled="createAmmFlag"
                    :step="1"
                    accuracy="2"
                    style="width: 100%"
                  />
                </div>
                <div
                  style="margin-left: 20%; margin-top: 10px; width: 40%; display: inline-block"
                  :class="isMobile ? 'item-title-mobile' : 'item-title'"
                >
                  <b>{{ getSymbolForMint(marketMsg.quoteMintAddress.toBase58()) }}</b> Initial Liquidity:
                </div>
                <div style="width: 20%; display: inline-block">
                  <input
                    v-model="inputQuoteValue"
                    type="number"
                    :disabled="createAmmFlag"
                    :step="1"
                    accuracy="2"
                    style="width: 100%"
                  />
                </div>
                <Col :span="24" style="padding-top: 10px">
                  <div class="create" v-if="!wallet.connected">
                    <Button
                      style="position: absolute; z-index: 999; width: 100%"
                      size="large"
                      ghost
                      @click="$accessor.wallet.openModal"
                    >
                      Connect wallet
                    </Button>
                  </div>
                  <Row v-else-if="current == 4">
                    <Col span="24" style="text-align: center; margin-top: 10px"
                      ><br /><br /><strong>Pool has been successfully created!</strong></Col
                    >
                    <!-- <Col
                  style="margin-top: 10px"
                  :span="isMobile ? 24 : 6"
                  :class="isMobile ? 'item-title-mobile' : 'item-title'"
                  >New AMM ID:</Col
                >
                <Col style="margin-top: 10px" :span="isMobile ? 24 : 18">
                  {{ userCreateAmmId }}
                </Col> -->
                    <Col span="24" style="word-break: break-word; line-height: 20px; text-align: center">
                      <div class="create">
                        <Button
                          size="large"
                          :disabled="!wallet.connected"
                          ghost
                          style="z-index: 999; width: 100%"
                          @click="goToFarmInfo"
                        >
                          Input Farm Info
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <div v-else style="text-align: center; padding-top: 20px">
                    <!--
                <Button
                  size="large"
                  ghost
                  class="button_div"
                  :disabled="!wallet.connected"
                  style="z-index: 999; width: 20%"
                  :loading="getMarketLoading"
                  @click="marketInputFlag ? getMarketMsg() : rewriteMarket()"
                >
                  {{ !wallet.connected ? 'Connect' : getMarketLoading ? '' : marketInputFlag ? 'OK' : 'Cancel' }}
                </Button> -->

                    <p
                      style="
                        padding-top: 20px;
                        padding-left: 20%;
                        padding-right: 20%;
                        word-break: break-word;
                        line-height: 20px;
                        margin: 0;
                      "
                    >
                      After clicking 'Confirm' you will need to approve two transactions in your wallet to initialize
                      the pool, create the AMM account, and add liquidity.
                    </p>
                    <br />
                    <div class="create">
                      <Button
                        size="large"
                        ghost
                        class="button_div"
                        style="z-index: 999"
                        :loading="createAmmFlag"
                        :disabled="createAmmFlag || !(inputPrice !== null && isAmountValid)"
                        @click="createKey"
                      >
                        {{ createAmmFlag ? '' : 'Confirm and initialize Liquidity Pool' }}
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <!-- Create Farm -->
            <Row v-if="current === 5" style="align-items: baseline; line-height: 40px; padding-bottom: 20px">
              <Col style="line-height: 20px" :span="24">
                <CoinInput
                  v-model="fromCoinAmount"
                  label="Initial Reward Token Amount"
                  :balance-offset="rewardCoin && rewardCoin.symbol === 'SOL' ? -0.05 : 0"
                  :mint-address="rewardCoin ? rewardCoin.mintAddress : ''"
                  :coin-name="rewardCoin ? rewardCoin.symbol : ''"
                  :balance="rewardCoin ? rewardCoin.balance : null"
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
                      fromCoinAmount = rewardCoin && rewardCoin.balance ? rewardCoin.balance.fixed() : '0'
                    }
                  "
                  @onSelect="openFromCoinSelect"
                />
              </Col>

              <Col
                style="line-height: 20px"
                :span="isMobile ? 24 : 12"
                :class="isMobile ? 'item-title-mobile' : 'item-title'"
              >
                <DatePicker
                  v-model="startTime"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Start"
                  @openChange="handleStartOpenChange"
                />
              </Col>

              <Col
                style="line-height: 20px"
                :span="isMobile ? 24 : 12"
                :class="isMobile ? 'item-title-mobile' : 'item-title'"
              >
                <DatePicker
                  v-model="endTime"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="End"
                  @openChange="handleEndOpenChange"
                />
              </Col>
              <Col style="line-height: 20px" :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'">
                <div>
                  Reward Per Week:&nbsp;{{ rewardPerWeek }} &nbsp;{{ rewardCoin != null ? rewardCoin.symbol : '' }}
                </div>
              </Col>
              <Col style="line-height: 20px" :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'">
                <div>AMM ID:&nbsp;{{ userCreateAmmId }}</div>
              </Col>

              <Col :span="isMobile ? 24 : 24" style="padding-bottom: 20px; padding-top: 10px; text-align: center">
                <div class="create">
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
                    @click="confirmFarmInfo"
                  >
                    Confirm
                  </Button>
                </div>
              </Col>
            </Row>
            <Row v-if="current === 6" style="align-items: baseline; line-height: 40px; padding-bottom: 20px">
              <Col
                v-if="!isCRPTokenPair"
                style="line-height: 20px"
                :span="24"
                :class="isMobile ? 'item-title-mobile' : 'item-title'"
              >
                <div>Farm has been successfully created!</div>
              </Col>
              <Col :span="isMobile ? 24 : 24" style="padding-bottom: 20px; padding-top: 10px; text-align: center">
                <div class="create">
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
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { Steps, Row, Col, Button, Tooltip, Icon, DatePicker, Checkbox, Radio } from 'ant-design-vue'
import { getMarket, createAmm, clearLocal } from '@/utils/market'
import BigNumber from '@/../node_modules/bignumber.js/bignumber'
import { NATIVE_SOL, TokenInfo, TOKENS } from '@/utils/tokens'
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
import { getPoolListByTokenMintAddresses, LIQUIDITY_POOLS, LiquidityPoolInfo } from '@/utils/pools'
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
    Checkbox,
    RadioGroup,
    Radio
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
  endTime: any = moment()
  endOpen: any = false
  isCRPTokenPair: boolean = false
  ammIdSelectShow: boolean = false
  ammIdSelectList: any = []

  farmId: any = null
  current: number = 0

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

  liquidityValueChangeFlag: boolean = true

  userLocalAmmIdList: string[] = []

  expectAmmId: undefined | string

  farmType: number = 1
  ammType: number = 1

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

      this.farmId = createdFarm.farmId
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
    this.current = 5
  }
  createNewAMMID() {
    this.userCreateAmmId = ''
    this.current++
  }
  onAmmIdSelect(liquidityInfo: LiquidityPoolInfo | undefined) {
    this.ammIdSelectShow = false
    if (liquidityInfo) {
      this.userCreateAmmId = liquidityInfo.ammId
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
        this.current = 5
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
    console.log(e.target.value);
  }

  selectAMM(e: { target: { value: any } }) {
    console.log(e.target.value);
  }
}
</script>

<style lang="less">
.ant-steps-vertical {
  .ant-steps-item-content {
    min-height: 60px;
  }

  .ant-steps-item-active {
    .ant-steps-item-tail::after,
    .ant-steps-item-icon {
      background-color: #13ecab !important;
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
        font-weight: 700;
      }
    }
  }
}

.ant-radio-group {
  width: 100%;
  padding-left: 30px;
}

.ant-radio-wrapper{
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 25px;
  color: #40426C;
  margin-top: 20px;
}

.ant-radio-wrapper-checked{
  color: #fff;
}

.ant-radio {
  .ant-radio-inner {
    background: #16164A;
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
    border-color: #EF745D;
  }

  .ant-radio-inner::after {
    background-color: #EF745D;
  }
}

.ant-radio-checked::after {
  border: none;
}

.ant-radio-wrapper:hover .ant-radio-inner, .ant-radio:hover .ant-radio-inner{
  border-color: #EF745D;
}

.ant-radio .ant-radio-input:focus + .ant-radio-inner  {
  border-color: #40426c;
}

.ant-radio-checked .ant-radio-input:focus + .ant-radio-inner  {
  border-color: #EF745D;
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

  .ant-calendar-date:hover {
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
  }

  .create {
    padding: 9px 19px;
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
    border: 2px solid rgba(255, 255, 255, 0.14);
    border-radius: 8px;
    display: inline-block;

    button {
      background: unset !important;
      color: #fff;
      border-color: transparent;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 42px;
      letter-spacing: -0.05em;
    }
  }

  .card {
    background: #16164A;
    border: 4px solid #16164A;
    border-radius: 14px;
  }

  .card-body {
    padding: 40px 60px;
    background-color: #16164A;

    .title {
      font-size: 30px;
      font-weight: 600;
      line-height: 37px;
      background: transparent;
    }
  }

  .step {
    border-right: 3px solid #ffffff30;
    padding-top: 20px;
  }

  .notstep {
    vertical-align: middle;
    padding: 0 50px;

    .ant-row {
      align-items: baseline;
      line-height: 40px;

      .item-title {
        margin-bottom: 50px;

        b {
          font-weight: bold;
          font-size: 20px;
          line-height: 25px;
        }

        .existing-amm {
          padding: 25px 0 25px 30px;
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
.msgClass div {
  line-height: 30px;
}
</style>
