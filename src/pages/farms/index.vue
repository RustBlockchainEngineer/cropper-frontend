<template>
  <div class="farm container">
    <img class="planet-left" src="@/assets/Green Planet 1.png" />
    <div class="page-head fs-container">
      <span class="title">Farms</span>
      <div class="farm-button-group">
        <div class="count-down-group">
          <div class="count-down">
            <span v-if="farm.autoRefreshTime - farm.countdown < 10">0</span>
            {{ farm.autoRefreshTime - farm.countdown }}
            <div
              class="reload-btn"
              @click="
                () => {
                  $accessor.farm.requestInfos()
                  $accessor.wallet.getTokenAccounts()
                }
              "
            >
              <Icon type="loading" theme="outlined" />
            </div>
            <!-- <Progress
              type="circle"
              :width="20"
              :stroke-width="10"
              :percent="(100 / farm.autoRefreshTime) * farm.countdown"
              :show-info="false"
              :class="farm.loading ? 'disabled' : ''"
              @click="
                () => {
                  $accessor.farm.requestInfos()
                  $accessor.wallet.getTokenAccounts()
                }
              "
            /> -->
          </div>
        </div>
        <NuxtLink to="/farms/create-farm/">
          <div class="btncontainer">
            <Button size="large" ghost> Create a farm </Button>
          </div>
        </NuxtLink>
      </div>
    </div>
    <StakeModel
      v-if="stakeModalOpening"
      title="Supply & Stake LP"
      :loading="staking"
      :farmInfo="farmInfo"
      @onOk="supplyAndStake"
      @onCancel="cancelStake"
    />
    <StakeErrorModal
      v-if="stakeLPError"
      @onRetry="onRetryStakeLP"
      @onRemove="onRemoveLiquidity"
      @onNothing="onNothing"
    />

    <CoinModal
      v-if="unstakeModalOpening"
      title="Unstake LP"
      :coin="lp"
      :loading="unstaking"
      @onOk="unstakeAndRemove"
      @onCancel="cancelUnstake"
    />
    <CoinModal
      v-if="addRewardModalOpening"
      title="Add Reward"
      :coin="rewardCoin"
      :loading="adding"
      @onOk="addReward"
      @onCancel="cancelAddReward"
    />

    <CoinModal
      v-if="stakeModalOpeningLP"
      title="Stake LP"
      :coin="lp"
      :farmInfo="farmInfo"
      :loading="staking"
      @onOk="stake"
      @onCancel="cancelStakeLP"
    />

    <div v-if="farm.initialized">
      <div class="card">
        <div class="card-body">
          <div class="tool-bar">
            <div class="tool-option">
              <Input v-model="searchName" size="large" class="input-search" placeholder="Search by name">
                <Icon slot="prefix" type="search" />
              </Input>
            </div>
            <div class="tool-option">
              <Select :options="certifiedOptions" v-model="searchCertifiedFarm"> </Select>
            </div>
            <div class="tool-option">
              <Select :options="lifeOptions" v-model="searchLifeFarm"> </Select>
            </div>
            <div class="tool-option last-option">
              <div class="toggle">
                <label class="label">Staked Only</label>
                <Toggle v-model="stakedOnly" :disabled="!wallet.connected || searchLifeFarm === 1" />
              </div>
            </div>
          </div>

          <Row class="farm-head table-head">
            <Col class="lp-icons" :span="isMobile ? 12 : 6">
              <div class="title">Labelized</div>
            </Col>
            <Col class="state" :span="isMobile ? 6 : 3">
              <div class="title">Status</div>
            </Col>
            <Col class="state reward-col" :span="isMobile ? 12 : 6">
              <div class="title">{{ isMobile ? 'Reward' : 'Pending Reward' }}</div>
            </Col>
            <Col class="state" :span="isMobile ? 6 : 3">
              <div class="title">Staked</div>
            </Col>
            <Col class="state" :span="isMobile ? 6 : 3">
              <div class="title">Total Apr</div>
            </Col>
            <Col class="state" :span="isMobile ? 6 : 3">
              <div class="title">Liquidity</div>
            </Col>
          </Row>
          <Collapse v-model="showCollapse" expand-icon-position="right">
            <CollapsePanel v-for="farm in showFarms" v-show="true" :key="farm.farmInfo.poolId" :show-arrow="poolType">
              <Row slot="header" class="farm-head" :class="isMobile ? 'is-mobile' : ''" :gutter="0">
                <Col class="lp-icons" :span="isMobile ? 12 : 6">
                  <div class="lp-icons-group">
                    <div class="icons">
                      <CoinIcon :mint-address="farm.farmInfo.lp.coin.mintAddress" />
                      <span>{{ farm.farmInfo.lp.coin.symbol }} - </span>
                      <CoinIcon :mint-address="farm.farmInfo.lp.pc.mintAddress" />
                      <span>{{ farm.farmInfo.lp.pc.symbol }}</span>
                    </div>
                  </div>
                </Col>

                <Col class="state" :span="isMobile ? 6 : 3">
                  <div v-if="currentTimestamp > farm.farmInfo.poolInfo.end_timestamp" class="label ended">Ended</div>
                  <div
                    v-if="
                      currentTimestamp < farm.farmInfo.poolInfo.start_timestamp &&
                      currentTimestamp < farm.farmInfo.poolInfo.end_timestamp
                    "
                    class="label soon"
                  >
                    Soon
                  </div>
                </Col>

                <Col class="state reward-col" :span="isMobile ? 12 : 6">
                  <Col span="12">
                    <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="value">-</div>
                    <div v-else class="value">{{ !wallet.connected ? 0 : farm.userInfo.pendingReward.format() }}</div>
                  </Col>
                  <Col span="12">
                    <div v-if="farm.labelized" class="labelized">Labelized</div>
                  </Col>
                </Col>

                <Col v-if="!isMobile" class="state" :span="3">
                  <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="value">-</div>
                  <div v-else class="value">
                    {{ !wallet.connected ? 0 : farm.userInfo.depositBalance.format() }}
                  </div>
                </Col>

                <Col class="state" :span="isMobile ? 6 : 3">
                  <div
                    v-if="
                      farm.farmInfo.poolInfo.start_timestamp > currentTimestamp ||
                      currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                    "
                    class="value"
                  >
                    -
                  </div>
                  <div v-else class="value">{{ farm.farmInfo.apr }}%</div>

                  <Tooltip
                    placement="bottomLeft"
                    v-if="
                      !(
                        farm.farmInfo.poolInfo.start_timestamp > currentTimestamp ||
                        currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                      )
                    "
                  >
                    <template slot="title">
                      <div>
                        <div class="tooltip-line">
                          Fees <span>{{ farm.farmInfo.apr_details.apy }}%</span>
                        </div>
                        <hr />
                        <div class="tooltip-line">
                          Ray <span>{{ farm.farmInfo.apr_details.apr }}%</span>
                        </div>
                      </div>
                    </template>
                    <div class="info-icon"><img src="@/assets/info2.png" width="16" height="16" /></div>
                  </Tooltip>
                </Col>

                <Col v-if="!isMobile && poolType" class="state" :span="3">
                  <div
                    v-if="
                      farm.farmInfo.poolInfo.start_timestamp > currentTimestamp ||
                      currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                    "
                    class="value"
                  >
                    -
                  </div>
                  <div v-else class="value">
                    ${{
                      Math.round(farm.farmInfo.liquidityUsdValue)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }}
                  </div>
                </Col>

                <Col v-if="!isMobile && !poolType" class="state" :span="3">
                  <Button v-if="!wallet.connected" size="large" ghost @click.stop="$accessor.wallet.openModal">
                    Connect Wallet
                  </Button>
                  <div v-else class="fs-container">
                    <Button
                      :disabled="!wallet.connected || farm.userInfo.depositBalance.isNullOrZero()"
                      size="large"
                      ghost
                      @click.stop="openUnstakeModal(farm.farmInfo, farm.farmInfo.lp, farm.userInfo.depositBalance)"
                    >
                      Harvest & Unstake
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row v-if="poolType" :class="isMobile ? 'is-mobile' : '' + 'collapse-row'" :gutter="48">
                <Col :span="isMobile ? 24 : 4"> </Col>

                <Col :span="isMobile ? 24 : 8">
                  <div class="harvest">
                    <div class="title">Pending Reward</div>
                    <div class="pending">
                      <div class="reward">
                        <div class="token">
                          {{ farm.farmInfo.reward.symbol }}
                          {{ !wallet.connected ? 0 : farm.userInfo.pendingReward.format() }}
                        </div>
                      </div>
                      <div class="btncontainer">
                        <Button
                          size="large"
                          ghost
                          :disabled="!wallet.connected || harvesting || farm.userInfo.pendingReward.isNullOrZero()"
                          :loading="harvesting"
                          @click="harvest(farm.farmInfo)"
                        >
                          Harvest
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col :span="isMobile ? 24 : 8">
                  <div class="start">
                    <div class="title">Start farming</div>
                    <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="unstarted">
                      <div class="token">
                        {{ getCountdownFromPeriod(farm.farmInfo.poolInfo.start_timestamp - currentTimestamp) }}
                      </div>
                    </div>
                    <div>
                      <div v-if="!wallet.connected" @click="$accessor.wallet.openModal" class="btncontainer">
                        <Button size="large" ghost> Connect Wallet </Button>
                      </div>
                      <div v-else class="fs-container">
                        <div class="btncontainer" v-if="!farm.userInfo.depositBalance.isNullOrZero()">
                          <Button
                            class="unstake btn-bg-fill"
                            size="large"
                            ghost
                            @click="openUnstakeModal(farm.farmInfo, farm.farmInfo.lp, farm.userInfo.depositBalance)"
                          >
                            <Icon type="minus" />
                          </Button>
                        </div>

                        <div
                          class="btncontainer"
                          v-if="
                            currentTimestamp < farm.farmInfo.poolInfo.end_timestamp &&
                            farm.farmInfo.poolInfo.start_timestamp < currentTimestamp
                          "
                        >
                          <Button
                            class="btn-bg-fill"
                            size="large"
                            ghost
                            :disabled="
                              !farm.farmInfo.poolInfo.is_allowed ||
                              farm.farmInfo.poolInfo.end_timestamp < currentTimestamp ||
                              farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                            "
                            @click="openStakeModal(farm.farmInfo, farm.farmInfo.lp)"
                          >
                            {{
                              !farm.farmInfo.poolInfo.is_allowed
                                ? 'Not Allowed'
                                : currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                                ? 'Ended'
                                : farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                                ? 'Unstarted'
                                : 'Stake'
                            }}
                          </Button>
                        </div>

                        <div
                          class="btncontainer"
                          v-if="
                            currentTimestamp < farm.farmInfo.poolInfo.end_timestamp &&
                            farm.farmInfo.poolInfo.start_timestamp < currentTimestamp &&
                            farm.farmInfo.currentLPtokens > 0.001
                          "
                        >
                          <Button
                            class="btn-bg-fill"
                            size="large"
                            ghost
                            :disabled="
                              !farm.farmInfo.poolInfo.is_allowed ||
                              farm.farmInfo.poolInfo.end_timestamp < currentTimestamp ||
                              farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                            "
                            @click="openStakeModalLP(farm.farmInfo, farm.farmInfo.lp)"
                          >
                            {{
                              !farm.farmInfo.poolInfo.is_allowed
                                ? 'Not Allowed'
                                : currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                                ? 'Ended'
                                : farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                                ? 'Unstarted'
                                : 'Stake LP'
                            }}
                          </Button>
                        </div>

                        <div class="btncontainer">
                          <a target="_blank" :href="farm.farmInfo.twitterShare">
                            <Button size="large" ghost style="background-color: #01033c !important"> Share </Button>
                          </a>
                        </div>

                        <div
                          class="btncontainer"
                          v-if="
                            farm.farmInfo.poolInfo.owner.toBase58() == wallet.address &&
                            farm.farmInfo.poolInfo.is_allowed &&
                            currentTimestamp < farm.farmInfo.poolInfo.end_timestamp
                          "
                        >
                          <Button size="large" ghost @click="openAddRewardModal(farm)"> Add Reward </Button>
                        </div>

                        <div
                          class="btncontainer"
                          v-if="
                            farm.farmInfo.poolInfo.owner.toBase58() == wallet.address &&
                            !farm.farmInfo.poolInfo.is_allowed &&
                            currentTimestamp < farm.farmInfo.poolInfo.end_timestamp
                          "
                        >
                          <Button size="large" ghost @click="payFarmFee(farm)"> Pay Farm Fee </Button>
                        </div>
                      </div>
                    </div>
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
      </div>
    </div>
    <div v-else class="fc-container">
      <Spin :spinning="true">
        <Icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </Spin>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  Tooltip,
  // Progress,
  Collapse,
  Spin,
  Icon,
  Row,
  Col,
  Button,
  Radio,
  Input,
  Select,
  Switch as Toggle,
  Pagination
} from 'ant-design-vue'
import { get, cloneDeep } from 'lodash-es'
import { TokenAmount } from '@/utils/safe-math'
import { FarmInfo } from '@/utils/farms'
import { deposit, withdraw } from '@/utils/stake'
import { getUnixTs } from '@/utils'
import { getBigNumber } from '@/utils/layouts'
import { LiquidityPoolInfo, LIQUIDITY_POOLS } from '@/utils/pools'
import moment from 'moment'
import { TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import { PAY_FARM_FEE, YieldFarm } from '@/utils/farm'
import { PublicKey } from '@solana/web3.js'
import { DEVNET_MODE, FARM_PROGRAM_ID } from '@/utils/ids'
import { TOKENS } from '@/utils/tokens'
import { addLiquidity, removeLiquidity } from '@/utils/liquidity'
const CollapsePanel = Collapse.Panel
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

export default Vue.extend({
  components: {
    Tooltip,
    Toggle,
    Input,
    // Progress,
    Collapse,
    CollapsePanel,
    Spin,
    Icon,
    Row,
    Col,
    Button,
    Select,
    Pagination
  },

  //    ,
  //    RadioGroup,
  //    RadioButton

  data() {
    return {
      isMobile: false,

      farms: [] as any[],
      showFarms: [] as any[],
      searchName: '',

      lp: null,
      rewardCoin: null,
      farmInfo: null as any,
      harvesting: false,
      stakeModalOpening: false,
      stakeModalOpeningLP: false,
      addRewardModalOpening: false,
      staking: false,
      adding: false,
      paying: false,
      unstakeModalOpening: false,
      unstaking: false,
      poolType: true,
      endedFarmsPoolId: [] as string[],
      showCollapse: [] as any[],
      currentTimestamp: 0,
      tempInfo: null as any,
      stakeLPError: false,
      labelizedAmms: {} as any,
      labelizedAmmsExtended: {} as any,
      poolsDatas: {} as any,
      certifiedOptions: [
        { value: 0, label: 'Labelized' },
        { value: 1, label: 'Permissionless' },
        { value: 2, label: 'All' }
      ],
      lifeOptions: [
        { value: 0, label: 'Opened' },
        { value: 1, label: 'Future' },
        { value: 2, label: 'Ended' },
        { value: 3, label: 'All' }
      ],
      searchCertifiedFarm: 0,
      searchLifeFarm: 0,
      stakedOnly: false,
      totalCount: 110,
      pageSize: 10,
      currentPage: 1
    }
  },

  head: {
    title: 'CropperFinance Farm'
  },

  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  watch: {
    'wallet.tokenAccounts': {
      handler(newTokenAccounts: any) {
        this.updateCurrentLp(newTokenAccounts)
      },
      deep: true
    },

    'farm.infos': {
      handler() {
        this.updateFarms()
      },
      deep: true
    },

    'farm.stakeAccounts': {
      handler() {
        this.updateFarms()
      },
      deep: true
    },
    showCollapse: {
      handler() {
        if (!this.poolType && this.showCollapse.length > 0) {
          this.showCollapse.splice(0, this.showCollapse.length)
        }
      },
      deep: true
    },
    searchName: {
      handler(newSearchName: string) {
        this.filterFarms(newSearchName, this.searchCertifiedFarm, this.searchLifeFarm, this.stakedOnly)
      },
      deep: true
    },
    searchCertifiedFarm: {
      handler(newSearchCertifiedFarm: any) {
        this.filterFarms(this.searchName, newSearchCertifiedFarm, this.searchLifeFarm, this.stakedOnly)
      },
      deep: true
    },
    searchLifeFarm: {
      handler(newSearchLifeFarm: any) {
        this.filterFarms(this.searchName, this.searchCertifiedFarm, newSearchLifeFarm, this.stakedOnly)
      },
      deep: true
    },
    stakedOnly: {
      handler(newStakedOnly: any) {
        this.filterFarms(this.searchName, this.searchCertifiedFarm, this.searchLifeFarm, newStakedOnly)
      },
      deep: true
    },
    currentPage: {
      handler(newPage: number) {
        this.filterFarms(this.searchName, this.searchCertifiedFarm, this.searchLifeFarm, this.stakedOnly, newPage)
      },
      deep: true
    }
  },

  mounted() {
    this.updateFarms()

    var hash = window.location.hash
    if (hash) {
      hash = hash.substring(1)
      this.searchName = hash
    } else {
      const query = new URLSearchParams(window.location.search)
      if (query.get('s')) this.searchName = query.get('s') as string
    }

    if (this.searchName) {
      this.searchCertifiedFarm = 2
      this.searchLifeFarm = 3
    }
  },

  methods: {
    TokenAmount,
    async updateLabelizedAmms() {
      this.labelizedAmms = {}
      this.labelizedAmmsExtended = {}
      let responseData
      try {
        responseData = await fetch('https://api.cropper.finance/farms/').then((res) => res.json())
      } catch {
        // dummy data
        responseData = [
          { ammID: 'ADjGcPYAu5VZWdKwhqU3cLCgX733tEaGTYaXS2TsB2hF', labelized: true },
          { ammID: '8j7uY3UiVkJprJnczC7x5c1S6kPYQnpxVUiPD7NBnKAo', labelized: true }
        ]
      } finally {
        responseData.forEach((element: any) => {
          this.labelizedAmms[element.ammID] = element.labelized
          this.labelizedAmmsExtended[element.ammID] = element
        })
      }

      try {
        this.poolsDatas = await fetch(
          DEVNET_MODE ? 'https://api.croppppp.com/' : 'https://api.cropper.finance/pools/'
        ).then((res) => res.json())
      } catch {
        this.poolsDatas = []
      } finally {
        // nothing to do ..
      }
    },

    async updateFarms() {
      await this.updateLabelizedAmms()
      this.currentTimestamp = moment().unix()

      const conn = this.$web3
      const wallet = (this as any).$accessor.wallet
      const liquidity = (this as any).$accessor.liquidity

      const farms: any = []
      const endedFarmsPoolId: string[] = []
      for (const [poolId, farmInfo] of Object.entries(this.farm.infos)) {
        let userInfo = get(this.farm.stakeAccounts, poolId)
        let isPFO = false

        // @ts-ignore
        const { reward_per_share_net, reward_per_timestamp, last_timestamp } = farmInfo.poolInfo

        // @ts-ignore
        const { reward, lp } = farmInfo

        const newFarmInfo: any = cloneDeep(farmInfo)

        if (reward && lp) {
          const rewardPerTimestampAmount = new TokenAmount(getBigNumber(reward_per_timestamp), reward.decimals)
          const liquidityItem = get(this.liquidity.infos, lp.mintAddress)

          const rewardPerTimestampAmountTotalValue =
            getBigNumber(rewardPerTimestampAmount.toEther()) *
            2 *
            60 *
            60 *
            24 *
            365 *
            this.price.prices[reward.symbol as string]

          const liquidityCoinValue =
            getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther()) *
            this.price.prices[liquidityItem?.coin.symbol as string]
          const liquidityPcValue =
            getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther()) *
            this.price.prices[liquidityItem?.pc.symbol as string]
          const liquidityTotalValue = liquidityPcValue + liquidityCoinValue

          const liquidityTotalSupply = getBigNumber((liquidityItem?.lp.totalSupply as TokenAmount).toEther())
          const liquidityItemValue = liquidityTotalValue / liquidityTotalSupply
          let liquidityUsdValue = getBigNumber(lp.balance.toEther()) * liquidityItemValue
          let apr = ((rewardPerTimestampAmountTotalValue / liquidityUsdValue) * 100).toFixed(2)
          if (apr === 'NaN' || apr === 'Infinity') {
            apr = '0'
          }
          if (isNaN(liquidityUsdValue)) {
            liquidityUsdValue = 0
          }
          // @ts-ignore
          newFarmInfo.apr = apr

          newFarmInfo.apr_details = {
            apr: Math.round((apr as any) * 100) / 100,
            apy: 0
          } as any

          if (
            this.poolsDatas[liquidityItem.ammId] &&
            this.poolsDatas[liquidityItem.ammId]['fees'] &&
            liquidityTotalValue > 0
          ) {
            let apy = (this.poolsDatas[liquidityItem.ammId]['fees'] * 365 * 100) / liquidityTotalValue
            newFarmInfo.apr = Math.round(((apr as any) * 1 - (apy as any) * -1) * 100) / 100
            newFarmInfo.apr_details.apy = Math.round(apy * 100) / 100
          }

          if (wallet) {
            let unstaked = get(wallet.tokenAccounts, `${liquidityItem.lp.mintAddress}.balance`)
            //getBigNumber((liquidityItem?.lp.totalSupply as TokenAmount).toEther());
            if (unstaked) {
              newFarmInfo.currentLPtokens = getBigNumber((unstaked as TokenAmount).toEther())
            } else {
              newFarmInfo.currentLPtokens = 0
            }
          } else {
            newFarmInfo.currentLPtokens = 0
          }

          // @ts-ignore
          newFarmInfo.liquidityUsdValue = liquidityUsdValue

          if (rewardPerTimestampAmount.toEther().toString() === '0') {
            //endedFarmsPoolId.push(poolId)
          }
        }

        if (userInfo && lp) {
          userInfo = cloneDeep(userInfo)

          const { rewardDebt, depositBalance } = userInfo
          const liquidityItem = get(this.liquidity.infos, lp.mintAddress)
          const currentTimestamp = this.currentTimestamp
          const duration = currentTimestamp - last_timestamp.toNumber()
          const rewardPerShareCalc =
            reward_per_share_net.toNumber() +
            (1000000000 * reward_per_timestamp.toNumber() * duration) / liquidityItem.lp.totalSupply.wei.toNumber()

          const pendingReward = depositBalance.wei
            .multipliedBy(getBigNumber(rewardPerShareCalc))
            .dividedBy(1e9)
            .minus(rewardDebt.wei)
          userInfo.pendingReward = new TokenAmount(pendingReward, rewardDebt.decimals)
        } else {
          userInfo = {
            // @ts-ignore
            depositBalance: new TokenAmount(0, farmInfo.lp.decimals),
            // @ts-ignore
            pendingReward: new TokenAmount(0, farmInfo.reward.decimals)
          }
        }
        if (
          (newFarmInfo as any).poolInfo.is_allowed > 0 ||
          (newFarmInfo as any).poolInfo.owner.toBase58() === this.wallet.address
        ) {
          let labelized = false
          if (lp) {
            const liquidityItem = get(this.liquidity.infos, lp.mintAddress)

            if (this.labelizedAmms[newFarmInfo.poolId]) {
              labelized = true
              if (
                this.labelizedAmmsExtended[newFarmInfo.poolId].pfo == true &&
                newFarmInfo.poolId == this.labelizedAmmsExtended[newFarmInfo.poolId].pfarmID
              ) {
                isPFO = true
              }
            }
          }

          ;(newFarmInfo as any).twitterShare = `http://twitter.com/share?text=Earn ${
            (newFarmInfo as any).reward.name
          } with our new farm on @CropperFinance&url=https://cropper.finance/farms/?s=${
            (newFarmInfo as any).poolId
          } &hashtags=${(newFarmInfo as any).lp.coin.symbol},${(newFarmInfo as any).lp.pc.symbol},yieldfarming,Solana`

          if (!isPFO) {
            farms.push({
              labelized,
              userInfo,
              farmInfo: newFarmInfo
            })
          }
        }
      }

      this.farms = farms.sort((a: any, b: any) => b.farmInfo.liquidityUsdValue - a.farmInfo.liquidityUsdValue)
      this.endedFarmsPoolId = endedFarmsPoolId
      this.filterFarms(
        this.searchName,
        this.searchCertifiedFarm,
        this.searchLifeFarm,
        this.stakedOnly,
        this.currentPage
      )
    },
    filterFarms(
      searchName: string,
      searchCertifiedFarm: number,
      searchLifeFarm: number,
      stakedOnly: boolean,
      pageNum: number = 1
    ) {
      this.currentPage = pageNum
      this.showFarms = this.farms

      //filter for not allowed famrs
      this.showFarms = this.showFarms.filter(
        (farm: any) =>
          farm.farmInfo.poolInfo.is_allowed > 0 ||
          (farm.farmInfo.poolInfo.owner.toBase58() === this.wallet.address && farm.farmInfo.poolInfo.is_allowed === 0)
      )

      if (
        searchName != '' &&
        this.farms.filter(
          (farm: any) => (farm.farmInfo.poolId as string).toLowerCase() == (searchName as string).toLowerCase()
        ).length > 0
      ) {
        this.showFarms = this.farms.filter(
          (farm: any) => (farm.farmInfo.poolId as string).toLowerCase() == (searchName as string).toLowerCase()
        )
      } else if (searchName != '') {
        this.showFarms = this.farms.filter((farm: any) =>
          (farm.farmInfo.lp.symbol as string).toLowerCase().includes((searchName as string).toLowerCase())
        )
      }

      if (searchCertifiedFarm == 0) {
        //labelized
        this.showFarms = this.showFarms.filter((farm: any) => farm.labelized)
      } else if (searchCertifiedFarm == 1) {
        //permissionless
        this.showFarms = this.showFarms.filter((farm: any) => !farm.labelized)
      }

      const currentTimestamp = moment().unix()
      if (searchLifeFarm == 0) {
        //Opened
        this.showFarms = this.showFarms.filter(
          (farm: any) =>
            farm.farmInfo.poolInfo.start_timestamp < currentTimestamp &&
            farm.farmInfo.poolInfo.end_timestamp > currentTimestamp
        )
      } else if (searchLifeFarm == 1) {
        //Future
        this.showFarms = this.showFarms.filter((farm: any) => farm.farmInfo.poolInfo.start_timestamp > currentTimestamp)
      } else if (searchLifeFarm == 2) {
        //Ended
        this.showFarms = this.showFarms.filter((farm: any) => farm.farmInfo.poolInfo.end_timestamp < currentTimestamp)
      }

      if (stakedOnly) {
        this.showFarms = this.showFarms.filter((farm: any) => farm.userInfo.depositBalance.wei.toNumber() > 0)
      }

      this.totalCount = this.showFarms.length

      let max = this.showFarms.length
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize < max ? this.currentPage * this.pageSize : max
      this.showFarms = this.showFarms.slice(start, end)
    },

    updateCurrentLp(newTokenAccounts: any) {
      if (this.lp) {
        const coin = cloneDeep(this.lp)
        // @ts-ignore
        const lpBalance = get(newTokenAccounts, `${this.lp.mintAddress}.balance`)
        // @ts-ignore
        coin.balance = lpBalance

        this.lp = coin
      }
    },

    openStakeModal(poolInfo: FarmInfo, lp: any) {
      /*
      const coin = cloneDeep(lp)
      const lpBalance = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
      coin.balance = lpBalance

      this.lp = coin
      */
      this.farmInfo = cloneDeep(poolInfo)
      const coinBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.coin.mintAddress}.balance`)
      const pcBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.pc.mintAddress}.balance`)
      this.farmInfo.lp.coin.balance = coinBalance
      this.farmInfo.lp.pc.balance = pcBalance
      this.stakeModalOpening = true
    },

    openStakeModalLP(poolInfo: FarmInfo, lp: any) {
      const coin = cloneDeep(lp)
      const lpBalance = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
      coin.balance = lpBalance

      this.lp = coin
      this.farmInfo = cloneDeep(poolInfo)
      const coinBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.coin.mintAddress}.balance`)
      const pcBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.pc.mintAddress}.balance`)
      this.farmInfo.lp.coin.balance = coinBalance
      this.farmInfo.lp.pc.balance = pcBalance
      this.stakeModalOpeningLP = true
    },

    openAddRewardModal(farm: any) {
      const rewardCoin = farm.farmInfo.reward
      const coin = cloneDeep(rewardCoin)
      const rewardBalance = get(this.wallet.tokenAccounts, `${rewardCoin.mintAddress}.balance`)
      coin.balance = rewardBalance

      this.rewardCoin = coin
      this.farmInfo = cloneDeep(farm.farmInfo)
      this.addRewardModalOpening = true
    },
    async addReward(amount: string) {
      this.adding = true
      const conn = this.$web3
      const wallet = (this as any).$wallet
      const rewardAccountAddress = get(
        this.wallet.tokenAccounts,
        `${this.farmInfo.reward.mintAddress}.tokenAccountAddress`
      )

      let fetchedFarm = await YieldFarm.loadFarm(
        conn,
        new PublicKey(this.farmInfo.poolId),
        new PublicKey(FARM_PROGRAM_ID)
      )

      if (fetchedFarm) {
        //transfer reward amount
        let addRewardAmount: number = Number.parseFloat(amount)
        let userRwardTokenPubkey = new PublicKey(rewardAccountAddress)

        const key = getUnixTs().toString()
        this.$notify.info({
          key,
          message: 'Making transaction...',
          description: '',
          duration: 0
        })
        fetchedFarm
          .addReward(wallet, userRwardTokenPubkey, addRewardAmount * Math.pow(10, this.farmInfo.reward.decimals))
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

            const description = `Add ${amount} ${this.farmInfo.reward.name}`
            this.$accessor.transaction.sub({ txid, description })
          })
          .catch((error) => {
            this.$notify.error({
              key,
              message: 'Adding Reward failed',
              description: error.message
            })
          })
          .finally(() => {
            this.adding = false
            this.addRewardModalOpening = false
          })
      }
    },
    async payFarmFee(farm: any) {
      this.paying = true
      const conn = this.$web3
      const wallet = (this as any).$wallet
      let key = 'USDC'
      const usdcCoin = TOKENS[key] // to test. real - USDC
      const usdcAccountAddress = get(this.wallet.tokenAccounts, `${usdcCoin.mintAddress}.tokenAccountAddress`)
      const usdcBalance = get(this.wallet.tokenAccounts, `${usdcCoin.mintAddress}.balance`)
      if (usdcAccountAddress === undefined || usdcAccountAddress === '') {
        this.$notify.error({
          key,
          message: 'Paying farm fee failed',
          description: 'Add USDC token in your wallet, please'
        })
        return
      }

      // check balance if wallet has enough fee
      if (usdcBalance < PAY_FARM_FEE) {
        this.$notify.error({
          key,
          message: 'Paying farm fee failed',
          description: 'Your USDC balance is low than farm fee'
        })
        return
      }

      let fetchedFarm = await YieldFarm.loadFarm(
        conn,
        new PublicKey(farm.farmInfo.poolId),
        new PublicKey(FARM_PROGRAM_ID)
      )

      if (fetchedFarm) {
        //pay farm fee
        let userUSDCTokenPubkey = new PublicKey(usdcAccountAddress)

        const key = getUnixTs().toString()
        this.$notify.info({
          key,
          message: 'Making transaction...',
          description: '',
          duration: 0
        })
        fetchedFarm
          .payFarmFee(wallet, userUSDCTokenPubkey, PAY_FARM_FEE * Math.pow(10, usdcCoin.decimals))
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

            const description = `Pay ${PAY_FARM_FEE} ${usdcCoin.name}`
            this.$accessor.transaction.sub({ txid, description })
          })
          .catch((error) => {
            this.$notify.error({
              key,
              message: 'Paying farm fee failed',
              description: error.message
            })
          })
          .finally(() => {
            this.paying = false
          })
      }
    },

    stake(amount: number) {
      this.staking = true

      const conn = this.$web3
      const wallet = (this as any).$wallet

      const lpAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${this.farmInfo.poolId}.stakeAccountAddress`)

      const key = getUnixTs().toString()

      if (amount <= 0) {
        this.$notify.error({
          key,
          message: 'Add liquidity failed',
          description: 'Added LP token amount is 0'
        })
        console.log('added lp amount is 0')
        return
      }

      this.stakeLP(conn, wallet, this.farmInfo, lpAccount, rewardAccount, infoAccount, amount)

      this.staking = false
      this.stakeModalOpeningLP = false
    },
    supplyAndStake(fromCoinAmount: string, toCoinAmount: string, fixedCoin: string) {
      this.staking = true

      const conn = this.$web3
      const wallet = (this as any).$wallet

      const poolInfo = get(this.liquidity.infos, this.farmInfo.lp.mintAddress)

      const lpAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${this.farmInfo.poolId}.stakeAccountAddress`)
      // @ts-ignore
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.coin.mintAddress}.tokenAccountAddress`)
      // @ts-ignore
      const toCoinAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.pc.mintAddress}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      let txStatus = ''
      addLiquidity(
        conn,
        wallet,
        poolInfo,
        fromCoinAccount,
        toCoinAccount,
        lpAccount,
        this.farmInfo.lp.coin,
        this.farmInfo.lp.pc,
        fromCoinAmount,
        toCoinAmount,
        fixedCoin
      )
        .then(async (txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Add liquidity for ${fromCoinAmount} ${this.farmInfo.lp.coin?.symbol} and ${toCoinAmount} ${this.farmInfo.lp.pc?.symbol}`
          this.$accessor.transaction.sub({ txid, description })

          txStatus = this.$accessor.transaction.history[txid].status
          let totalDelayTime = 0
          while (txStatus === 'Pending' && totalDelayTime < 10000) {
            let delayTime = 500
            await this.delay(delayTime)
            totalDelayTime += delayTime
            txStatus = this.$accessor.transaction.history[txid].status
            await this.delay(delayTime)
            totalDelayTime += delayTime
          }
          if (txStatus === 'Fail') {
            console.log('add lp failed')
            return
          }
          //update wallet token account infos
          this.$accessor.wallet.getTokenAccounts()
          let delayForUpdate = 500
          await this.delay(delayForUpdate)

          let amount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.balance`)
          if (amount) {
            amount = amount.wei.toNumber() / Math.pow(10, amount.decimals)
          } else {
            amount = 0
          }

          totalDelayTime = 0
          while (amount <= 0 && totalDelayTime < 10000) {
            let dealyTime = 200
            await this.delay(dealyTime)
            totalDelayTime += dealyTime
            amount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.balance`)
            if (amount) {
              amount = amount.wei.toNumber() / Math.pow(10, amount.decimals)
            } else {
              amount = 0
            }
          }

          if (amount <= 0) {
            this.$notify.error({
              key,
              message: 'Add liquidity failed',
              description: 'Added LP token amount is 0'
            })
            console.log('added lp amount is 0')
            return
          }

          this.stakeLP(conn, wallet, this.farmInfo, lpAccount, rewardAccount, infoAccount, amount)
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Add liquidity failed',
            description: error.message
          })
        })
        .finally(async () => {})
    },
    async stakeLP(
      conn: any,
      wallet: any,
      farmInfo: any,
      lpAccount: any,
      rewardAccount: any,
      infoAccount: any,
      amount: number
    ) {
      const key = getUnixTs().toString()

      deposit(conn, wallet, farmInfo, lpAccount, rewardAccount, infoAccount, amount)
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

          const description = `Stake ${amount} ${this.farmInfo.lp.name}`
          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Stake failed',
            description: error.message
          })
          this.tempInfo = {
            conn: conn,
            wallet: wallet,
            farmInfo: farmInfo,
            lpAccount: lpAccount,
            rewardAccount: rewardAccount,
            infoAccount: infoAccount,
            amount: amount
          }
          this.stakeLPError = true
        })
        .finally(() => {
          this.staking = false
          this.stakeModalOpening = false
          this.farmInfo = null
        })
    },
    onRetryStakeLP() {
      this.stakeLPError = false
      if (!this.tempInfo) {
        return
      }

      this.stakeLP(
        this.tempInfo.conn,
        this.tempInfo.wallet,
        this.tempInfo.farmInfo,
        this.tempInfo.lpAccount,
        this.tempInfo.rewardAccount,
        this.tempInfo.infoAccount,
        this.tempInfo.amount
      )
      this.tempInfo = null
    },
    onRemoveLiquidity() {
      this.stakeLPError = false
      if (!this.tempInfo) {
        return
      }

      const fromCoinAccount = get(
        this.wallet.tokenAccounts,
        `${this.tempInfo.farmInfo.lp.coin.mintAddress}.tokenAccountAddress`
      )
      const toCoinAccount = get(
        this.wallet.tokenAccounts,
        `${this.tempInfo.farmInfo.lp.pc.mintAddress}.tokenAccountAddress`
      )
      this.removeLP(
        this.tempInfo.conn,
        this.tempInfo.wallet,
        this.tempInfo.farmInfo.lp,
        this.tempInfo.lpAccount,
        fromCoinAccount,
        toCoinAccount,
        this.tempInfo.amount
      )

      this.tempInfo = null
    },
    async delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    cancelStake() {
      this.lp = null
      this.farmInfo = null
      this.stakeModalOpening = false
    },
    cancelStakeLP() {
      this.lp = null
      this.farmInfo = null
      this.stakeModalOpeningLP = false
    },
    onNothing() {
      this.stakeLPError = false
      this.tempInfo = null
    },
    cancelAddReward() {
      this.rewardCoin = null
      this.farmInfo = null
      this.addRewardModalOpening = false
    },

    openUnstakeModal(poolInfo: FarmInfo, lp: any, lpBalance: any) {
      const coin = cloneDeep(lp)
      coin.balance = lpBalance

      this.lp = coin
      this.farmInfo = cloneDeep(poolInfo)
      this.unstakeModalOpening = true
    },

    unstakeAndRemove(amount: string) {
      this.unstaking = true

      const conn = this.$web3
      const wallet = (this as any).$wallet
      const coin = this.farmInfo.lp.coin
      const pc = this.farmInfo.lp.pc
      const lp = this.farmInfo.lp

      const lpAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${this.farmInfo.poolId}.stakeAccountAddress`)
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${coin.mintAddress}.tokenAccountAddress`)
      const toCoinAccount = get(this.wallet.tokenAccounts, `${pc.mintAddress}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      withdraw(conn, wallet, this.farmInfo, lpAccount, rewardAccount, infoAccount, amount)
        .then(async (txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Unstake ${amount} ${lp.name}`
          this.$accessor.transaction.sub({ txid, description })

          let txStatus = this.$accessor.transaction.history[txid].status
          while (txStatus === 'Pending') {
            await this.delay(500)
            txStatus = this.$accessor.transaction.history[txid].status
            await this.delay(500)
          }
          if(txStatus === "Fail"){
            console.log("unstake transaction failed")
            this.unstaking = false
            this.unstakeModalOpening = false
            return;
          }

          //update wallet token account infos
          this.$accessor.wallet.getTokenAccounts();
          let delayForUpdate = 1000;
          await this.delay(delayForUpdate);
          
          let value = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
          value = value.wei.toNumber() / Math.pow(10,value.decimals);
          if(value <= 0){
            console.log("remove lp amount is 0")
            this.unstaking = false
            this.unstakeModalOpening = false
            return;
          }
          value = value.toString()

          this.removeLP(conn, wallet, lp, lpAccount, fromCoinAccount, toCoinAccount, value)
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Stake failed',
            description: error.message
          })
        })
        .finally(() => {})
    },
    removeLP(conn: any, wallet: any, lp: any, lpAccount: any, fromCoinAccount: any, toCoinAccount: any, value: any) {
      const key = getUnixTs().toString()
      const poolInfo = get(this.liquidity.infos, lp.mintAddress)
      //remove whole lp amount
      removeLiquidity(conn, wallet, poolInfo, lpAccount, fromCoinAccount, toCoinAccount, value)
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

          const description = `Remove liquidity for ${value} ${lp.name}`

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
          this.unstaking = false
          this.unstakeModalOpening = false
        })
    },

    cancelUnstake() {
      this.lp = null
      this.farmInfo = null
      this.unstakeModalOpening = false
    },
    getAmmId(farmInfo: FarmInfo) {
      //get liquidity pool info
      let liquidityPoolInfo: LiquidityPoolInfo = LIQUIDITY_POOLS.find(
        (item) => item.lp.mintAddress === farmInfo.lp.mintAddress
      ) as any

      //check liquidity pool
      if (liquidityPoolInfo == undefined) {
        console.log('find liquidity pool error')
        return ''
      }
      return liquidityPoolInfo.ammId
    },

    harvest(farmInfo: FarmInfo) {
      this.harvesting = true

      const conn = this.$web3
      const wallet = (this as any).$wallet

      const lpAccount = get(this.wallet.tokenAccounts, `${farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${farmInfo.poolId}.stakeAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      deposit(conn, wallet, farmInfo, lpAccount, rewardAccount, infoAccount, '0')
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

          const description = `Harvest ${farmInfo.reward.symbol} from ${farmInfo.lp.name}`
          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Harvest failed',
            description: error.message
          })
        })
        .finally(() => {
          this.$accessor.farm.requestInfos()
          this.harvesting = false
        })
    },
    getCountdownFromPeriod(period: number) {
      let remain = period
      let days = Math.floor(remain / (24 * 3600))
      remain = remain % (24 * 3600)
      let hours = Math.floor(remain / 3600)
      remain = remain % 3600
      let minutes = Math.floor(remain / 60)
      remain = remain % 60
      let seconds = remain

      return '' + days + 'd : ' + hours + 'h : ' + minutes + 'm'
    }
  }
})
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.card-body {
  padding: 0;
  margin: 0;
}

.farm-button-group {
  position: absolute;
  right: 0;
  display: inline-flex;
  align-items: center;
}

.farm.container {
  max-width: 1350px;
  width: 100%;
  background: #01033C;
  margin-top:20px;
  margin-bottom:20px;
  padding: 15px;

  .page-head a {
    background: #01033c;
    margin-left: 20px;
    .btncontainer {
      display: inline-block;
    }
  }

  .card {
    margin-top: 70px;

    .card-body {
      padding: 0;
      overflow-x: scroll;
      scrollbar-width: none;
      -ms-overflow-style: none;

      .ant-collapse {
        border: 0;
        .ant-collapse-item {
          border-bottom: 0;
        }

        .ant-collapse-item:not(:last-child) {
          border-bottom: 1px solid #ffffff20;
        }
      }

      .start .btncontainer {
        display: inline-block;
      }
    }
  }

  .harvest {
    text-align: center;
    max-width: 420px;
    min-height: 186px;
    display: grid;
    align-items: center;

    .reward {
      .token {
        font-weight: normal;
        font-size: 40px;
        line-height: 47px;
        margin-bottom: 10px;
      }

      .value {
        font-size: 12px;
      }
    }

    button {
      padding: 0 30px;
    }
  }

  .start {
    text-align: center;
    max-width: 420px;
    min-height: 186px;
    display: grid;
    align-items: center;
    
    .unstarted {
      width: 100%;

      .token {
        font-weight: normal;
        font-size: 40px;
        line-height: 47px;
        margin-bottom: 10px;
      }

      .value {
        font-size: 12px;
      }
    }

    .unstake {
      margin-right: 10px;
    }

    button {
      width: 100%;
    }
  }

  .harvest,
  .start {
    border: 4px solid #16164a;
    box-sizing: border-box;
    border-radius: 14px;
    padding: 16px;

    .title {
      font-weight: normal;
      font-size: 18px;
      line-height: 21px;
      color: #fff;
      opacity: 0.5;
      margin-bottom: 8px;
    }
  }

  .table-head {
    border-bottom: 1px solid #ffffff20;
  }

  .farm-head {
    display: flex;
    align-items: center;
    min-width: 768px;

    .lp-icons {
      .lp-icons-group {
        height: 51px;
        background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
        border-radius: 8px;
        padding: 2px;

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

    .state {
      display: flex;
      text-align: left;

      .title {
        font-weight: normal;
        font-size: 18px;
        line-height: 21px;
        color: #fff;
        opacity: 0.5;
      }

      .value {
        font-size: 18px;
        line-height: 21.19px;
        font-weight: 400;
      }
    }
  }

  .farm-head.is-mobile {
    padding: 24px 16px !important;
  }

  .is-mobile {
    .harvest,
    .start {
      margin-top: 16px;
    }
  }

  p {
    margin-bottom: 0;
  }
}
.radioButtonStyle {
  width: 50%;
  text-align: center;
}
</style>

<style lang="less">
.farm {
  .page-head .title {
    position: absolute;
    left: 0 !important;
    transform: translate(0, 0) !important;
  }

  .farm-head {
    padding: 30px 5px !important;
  }

  .ant-collapse-header {
    padding: 0 !important;

    .farm-head {
      padding: 30px 5px !important;
    }
  }

  .ant-collapse-content {
    background-color: #01033c;
    border-top: none !important;
  }
}

.farm.container {
  .btncontainer {
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%) !important;
    display: inline-block;
    width: unset;
    text-align: center;
    position: relative;
    max-width: 400px;
    padding: 2px;
    border-radius: 8px !important;
    max-height: 60px !important;

    button {
      background: transparent !important;
      position: relative;
      border-radius: 8px !important;
      border-color: transparent !important;
      height: 56px !important;
    }
  }

  .fs-container {
    justify-content: space-evenly;

    .btncontainer {
      .btn-bg-fill {
        background-color: #01033c !important;
      }
    }
  }
}

.ant-alert-warning {
  width: 500px;
  margin-top: 30px;
  background-color: transparent;
  border: 1px solid #85858d;

  .anticon-close {
    color: #fff;
  }
}

.count-down-group {
  background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
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
    text-align: center;
    cursor: pointer;

    .anticon {
      font-size: 16px !important;
      color: white !important;
    }
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
.label.soon {
  background: #48a469;
  border-radius: 4px;
  right: 110px;
  font-size: 14px;
  font-weight: 400;
  padding: 5px;
  width: 53px;
}

.label.ended {
  background: #ef745d;
  border-radius: 4px;
  right: 110px;
  font-size: 14px;
  font-weight: 400;
  padding: 5px;
  width: 53px;
}

.labelized {
  background: #724cee;
  border-radius: 6px;
  padding: 5px 9px;
  font-size: 14px;
  font-weight: 400;
  width: fit-content;
}

.reward-col {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
}

.collapse-row {
  display: flex;
  align-items: center;
}

.info-icon {
  margin-left: 12px;
}

.planet-left {
  position: absolute;
  left: 0;
  top: 35%;
}

main {
  background-color: #01033c;
  background-image: unset;
  background-size: cover;
  background-position: center bottom;
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

.ant-collapse {
  background-color: #01033c;
}
</style>
