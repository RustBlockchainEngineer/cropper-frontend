<template>
  <div class="staking container">
    <BaseDetailModal
      :show="baseModalShow"
      :estimatedapy="estimatedAPY"
      @onCancel="() => (baseModalShow = false)"
      @onSelect="onBaseDetailSelect"
    />

    <StakeModal
      :show="stakeModalShow"
      :enddatemin="endDateOfLock"
      :crpbalance="crpbalance"
      :userStaked="userStaked"
      :estimatedapy="estimatedAPY"
      @onCancel="() => (stakeModalShow = false)"
    />

    <div class="card">
      <div class="card-body">
        <div class="staking-head fcb-container">
          <h3 class="title weightB">Staking</h3>
          <div class="information">
            <div class="tvl-info">
              <p class="textL weightS">TVL : ${{ TVL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</p>
            </div>

            <div class="action-btn-group">
              <div class="reload-btn icon-cursor" :class="activeSpinning ? 'active' : ''" @click="reloadTimer">
                <img class="reload-icon" src="@/assets/icons/reload.svg" />
              </div>
            </div>
          </div>
        </div>

        <div class="staking-content fcb-container">
          <div class="staking-body">
            <h4 class="weightB">$CRP Staking</h4>
            <div class="staking-progress">
              <div class="staking-progress-label fcb-container">
                <span class="bodyXS weightB">Tier {{ currentTiers }}</span>
                <span class="bodyXS weightB">Tier {{ nextTiers }}</span>
              </div>
              <Progress
                type="line"
                :stroke-width="14"
                :percent="Number(pctToNexttiers.toFixed(1))"
                :show-info="false"
              />
              <label
                class="staking-progress-percent bodyXS"
                :style="'margin-left: ' + Number(pctToNexttiers.toFixed(1)) + '%'"
              >
                {{ Number(pctToNexttiers.toFixed(1)) }}%
              </label>
            </div>

            <div class="staking-infos-group">
              <div class="staking-info fcb-container">
                <div class="label textM weightS letterS">
                  Estimated APY
                  <Tooltip placement="bottomLeft">
                    <template slot="title">
                      <div>Potential Annual Percentage Yield based on a daily compounding</div>
                    </template>
                    <img class="tooltip-icon" src="@/assets/icons/info.svg" />
                  </Tooltip>
                </div>
                <div class="value textM weightB">
                  {{ Math.round(estimatedAPY * 2 * 100) / 100 }} %
                  <img
                    class="calc-icon icon-cursor"
                    src="@/assets/icons/calculator.svg"
                    @click="
                      () => {
                        this.baseModalShow = true
                      }
                    "
                  />
                </div>
              </div>

              <div class="staking-info fcb-container">
                <div class="label textM weightS letterS">
                  Total Staked
                  <Tooltip placement="bottomLeft">
                    <template slot="title">
                      <div>Total staked CRP token amount</div>
                    </template>
                    <img class="tooltip-icon" src="@/assets/icons/info.svg" />
                  </Tooltip>
                </div>
                <div class="value textM weightB">{{ totalStaked }}</div>
              </div>

              <div class="staking-info fcb-container">
                <div class="label textM weightS letterS">
                  Total Value
                  <Tooltip placement="bottomLeft">
                    <template slot="title">
                      <div>Total Value staked (USD)</div>
                    </template>
                    <img class="tooltip-icon" src="@/assets/icons/info.svg" />
                  </Tooltip>
                </div>

                <div class="value textM weightB">{{ totalStakedPrice }}</div>
              </div>
            </div>

            <div class="staking-actions-group">
              <div class="staking-action-item fcb-container">
                <div class="reward-pending">
                  <label class="label textM">Reward Pending</label>
                  <label class="value textL weightB">{{ pendingReward }}</label>
                </div>
                <div class="btn-container">
                  <Button
                    class="btn-primary weightS letterL"
                    :disabled="!wallet.connected || pendingReward == 0"
                    @click="harvestReward"
                    >Harvest</Button
                  >
                </div>
              </div>

              <div v-if="!wallet.connected" class="btn-container btn-large fcc-container">
                <Button class="btn-transparent textL weightB" @click="$accessor.wallet.openModal"
                  >Connect Wallet</Button
                >
              </div>

              <div v-else>
                <div v-if="userStaked > 0" class="staking-action-item fcb-container">
                  <div class="reward-pending">
                    <label class="label textM">CRP Staked</label>
                    <label class="value textL weightB">{{ userStaked }}</label>
                  </div>
                  <div class="stake-btn-group fcc-container">
                    <div class="btn-container">
                      <Button
                        class="btn-primary weightS letterL"
                        :disabled="!wallet.connected || userStaked == 0 || canUnstake == false"
                        @click="unstakeToken"
                        >Unstake</Button
                      >
                    </div>
                    <div class="btn-container">
                      <Button
                        class="btn-transparent weightS letterL"
                        id="stake"
                        @click="
                          () => {
                            this.stakeModalShow = true
                          }
                        "
                        >Stake</Button
                      >
                    </div>
                  </div>
                </div>

                <div v-else class="btn-container btn-large fcc-container">
                  <Button
                    class="btn-transparent textL weightB"
                    id="stake"
                    @click="
                      () => {
                        this.stakeModalShow = true
                      }
                    "
                    >Stake</Button
                  >
                </div>
              </div>
            </div>

            <div class="staking-footer">
              <div class="lock-tokens fcb-container">
                <label class="label textS weightS letterL">
                  {{ endOfLock ? 'End of lock' : 'Lock tokens for' }}
                </label>
                <label class="value textS weightS letterL">
                  {{ endOfLock ? endOfLock : '0 Day(s)' }}
                </label>
              </div>
              <div v-if="!endOfLock" class="get-crp fcc-container">
                <label class="textM weightS">Get CRP</label>
                <img class="union-icon" src="@/assets/icons/union.svg" />
              </div>
            </div>
          </div>

          <div class="staking-tiers">
            <Carousel ref="tierCarousel" :before-change="getCurrentTier" arrows>
              <div slot="prevArrow" class="custom-slick-arrow prev-arrow">
                <Icon type="left" />
              </div>
              <div slot="nextArrow" class="custom-slick-arrow next-arrow">
                <Icon type="right" />
              </div>

              <div class="staking-tier-item">
                <div class="staking-tier-preview"></div>
                <div class="fcb-container">
                  <div class="tier-info">
                    <label class="textL weightB">Tier 1</label>
                  </div>
                  <div class="btn-container">
                    <a
                      class="btn-primary textM weightS fcc-container"
                      href="#staking-tiers-details"
                      @click="setTierTabs"
                      >About Tiers</a
                    >
                  </div>
                </div>
              </div>
              <div class="staking-tier-item">
                <div class="staking-tier-preview"></div>
                <div class="fcb-container">
                  <div class="tier-info">
                    <label class="textL weightB">Tier 2</label>
                  </div>
                  <div class="btn-container">
                    <a
                      class="btn-primary textM weightS fcc-container"
                      href="#staking-tiers-details"
                      @click="setTierTabs"
                      >About Tiers</a
                    >
                  </div>
                </div>
              </div>
              <div class="staking-tier-item">
                <div class="staking-tier-preview"></div>
                <div class="fcb-container">
                  <div class="tier-info">
                    <label class="textL weightB">Tier 3</label>
                  </div>
                  <div class="btn-container">
                    <a
                      class="btn-primary textM weightS fcc-container"
                      href="#staking-tiers-details"
                      @click="setTierTabs"
                      >About Tiers</a
                    >
                  </div>
                </div>
              </div>
              <div class="staking-tier-item">
                <div class="staking-tier-preview"></div>
                <div class="fcb-container">
                  <div class="tier-info">
                    <label class="textL weightB">Tier 4</label>
                  </div>
                  <div class="btn-container">
                    <a
                      class="btn-primary textM weightS fcc-container"
                      href="#staking-tiers-details"
                      @click="setTierTabs"
                      >About Tiers</a
                    >
                  </div>
                </div>
              </div>
              <div class="staking-tier-item">
                <div class="staking-tier-preview"></div>
                <div class="fcb-container">
                  <div class="tier-info">
                    <label class="textL weightB">Tier 5</label>
                  </div>
                  <div class="btn-container">
                    <a
                      class="btn-primary textM weightS fcc-container"
                      href="#staking-tiers-details"
                      @click="setTierTabs"
                      >About Tiers</a
                    >
                  </div>
                </div>
              </div>
            </Carousel>
          </div>
        </div>

        <div class="staking-tiers-details" id="staking-tiers-details">
          <span class="textL weightB">About Tiers</span>
          <div class="staking-tiers-features">
            <Tabs v-model="activeTab">
              <TabPane tab="Tier 1" key="1">
                <Row :gutter="56" class="staking-tier-container fcb-container">
                  <Col :sm="12" :xs="24" class="staking-tier-tab">
                    <span class="textM weightS">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book.
                      <br /><br />
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book.
                    </span>
                  </Col>
                  <Col :sm="12" :xs="24" class="staking-tier-preview">
                    <div class="staking-tier-item-box"></div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Tier 2" key="2">
                <Row :gutter="56" class="staking-tier-container fcb-container">
                  <Col :sm="12" :xs="24" class="staking-tier-tab">
                    <span class="textM weightS">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book.
                      <br /><br />
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book.
                    </span>
                  </Col>
                  <Col :sm="12" :xs="24" class="staking-tier-preview">
                    <div class="staking-tier-item-box"></div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Tier 3" key="3">
                <Row :gutter="56" class="staking-tier-container fcb-container">
                  <Col :span="12" class="staking-tier-tab">
                    <span class="textM weightS">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book.
                      <br /><br />
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book.
                    </span>
                  </Col>
                  <Col :span="12" class="staking-tier-preview">
                    <div class="staking-tier-item-box"></div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Tier 4" key="4">
                <Row :gutter="56" class="staking-tier-container fcb-container">
                  <Col :span="12" class="staking-tier-tab">
                    <span class="textM weightS">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book.
                      <br /><br />
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book.
                    </span>
                  </Col>
                  <Col :span="12" class="staking-tier-preview">
                    <div class="staking-tier-item-box"></div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Tier 5" key="5">
                <Row :gutter="56" class="staking-tier-container fcb-container">
                  <Col :span="12" class="staking-tier-tab">
                    <span class="textM weightS">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book.
                      <br /><br />
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book.
                    </span>
                  </Col>
                  <Col :span="12" class="staking-tier-preview">
                    <div class="staking-tier-item-box"></div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Icon, Tooltip, Button, Progress, Tabs, Carousel, Row, Col } from 'ant-design-vue'
import { cloneDeep, get } from 'lodash-es'
import { getTokenBySymbol, TokenInfo, NATIVE_SOL, TOKENS } from '@/utils/tokens'
import { getMultipleAccounts, commitment } from '@/utils/web3'
import { PublicKey } from '@solana/web3.js'
import { getUnixTs } from '@/utils'
import BigNumber from 'bignumber.js'
import { TokenAmount, gt } from '@/utils/safe-math'
import * as anchor from '@project-serum/anchor'
const { BN } = anchor
import moment from 'moment'
const { TabPane } = Tabs
Vue.prototype.moment = moment

import {
  setAnchorProvider,
  createFarmState,
  fundToProgram,
  setExtraReward,
  createExtraReward,
  createPool,
  changePoolAmountMultipler,
  changeTokenPerSecond,
  changePoolPoint,
  getFarmStateAddress,
  getFarmState,
  getExtraRewardConfigs,
  getAllPools,
  getPoolUserAccount,
  estimateRewards,
  calculateTiers,
  TIERS_XCRP,
  stake,
  unstake,
  harvest
} from '@/utils/crp-stake'

export default Vue.extend({
  components: {
    Button,
    Tooltip,
    Progress,
    Carousel,
    Row,
    Col,
    Icon,
    Tabs,
    TabPane
  },
  data() {
    return {
      baseModalShow: false as boolean,
      stakeModalShow: false as boolean,
      estimatedAPY: 0 as number,
      lockDuration: 0 as number,
      crpbalance: 0 as any,
      endDateOfLock: 0 as any,

      totalStaked: '0' as string,
      userStaked: 0 as number,
      pendingReward: '0' as string,
      totalStakedPrice: '0' as string,
      TVL: 0 as number,
      timer: null as any,
      autoRefreshTime: 60 as number,
      countdown: 0 as number,
      activeSpinning: false as boolean,
      endOfLock: '' as string,
      canUnstake: false as boolean,

      pctToNexttiers: 0 as number,
      currentTiers: 4 as number,
      nextTiers: 5 as number,
      selectedTier: 0 as number,
      activeTab: '0' as string
    }
  },
  head: {
    title: 'CropperFinance Swap'
  },
  computed: {
    ...mapState(['wallet', 'swap', 'liquidity', 'url', 'setting', 'price', 'token'])
  },
  watch: {
    'wallet.tokenAccounts': {
      handler(newTokenAccounts: any) {
        if (this.$wallet?.connected) {
          this.getUserState()
          this.getGlobalState()
        }
      },
      deep: true
    },
    'wallet.connected': {
      handler(connected: any) {
        this.getUserState()
      },
      deep: true
    },
    'token.initialized': {
      handler(newState: boolean) {
        this.getGlobalState()
        this.getUserState()
      },
      deep: true
    }
  },
  mounted() {
    this.getTvl()
    setAnchorProvider(this.$web3, this.$wallet)
    this.getGlobalState()
    this.getUserState()

    if (this.currentTiers > 1) {
      this.setTierCarousel(this.currentTiers - 1)
      this.selectedTier = this.currentTiers
      this.activeTab = this.currentTiers.toString()
    } else {
      this.setTierCarousel(this.currentTiers - 2)
      this.selectedTier = 1
      this.activeTab = this.currentTiers.toString()
    }

    this.setTimer()
  },
  methods: {
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
          if ((responseData as any)[key as any].tvl * 1 < 2000000) {
            tvl = tvl * 1 + (responseData as any)[key as any].tvl * 1
          }
        })
      } catch {
        // dummy data
      } finally {
      }

      try {
        responseData = await fetch('https://api.cropper.finance/staking/').then((res) => res.json())
        tvl = tvl * 1 + (responseData as any).value * 1
      } catch {
        // dummy data
      } finally {
      }

      this.TVL = Math.round(tvl)

      window.localStorage.TVL_last_updated = new Date().getTime()
      window.localStorage.TVL = this.TVL
    },

    async getGlobalState() {
      if (!this.$accessor.token.initialized) return

      const pools = await getAllPools()
      const current_pool = pools[0]

      const farm_state = await getFarmState()
      const stakedAmount = new TokenAmount(current_pool.account.amount, TOKENS['CRP'].decimals)

      if (this.price.prices['CRP']) {
        this.totalStakedPrice =
          '$' +
          (Math.round(parseFloat(stakedAmount.fixed()) * this.price.prices['CRP'] * 1000) / 1000)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        this.totalStakedPrice = '$ ' + parseFloat(stakedAmount.fixed())
      }

      this.totalStaked =
        'CRP ' +
        (Math.round(parseFloat(stakedAmount.fixed()) * 1000) / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

      // const apr = Number(farm_state.tokenPerSecond.muln(YEAR2SECOND).div(current_pool.account.amount).toString());
      // this.estimatedAPY = Number((((1 + (apr / 100)/ 365)) ** 365 - 1) * 100);

      const apr =
        (Number(new TokenAmount(farm_state.tokenPerSecond, TOKENS['CRP'].decimals).fixed()) * 365 * 24 * 3600) /
        Number(new TokenAmount(current_pool.account.amount, TOKENS['CRP'].decimals).fixed())

      this.estimatedAPY =
        (Number(new TokenAmount(farm_state.tokenPerSecond, TOKENS['CRP'].decimals).fixed()) * 365 * 24 * 3600) /
        Number(new TokenAmount(current_pool.account.amount, TOKENS['CRP'].decimals).fixed())

      this.estimatedAPY = Number(((1 + this.estimatedAPY / 365) ** 365 - 1) * 100)
    },

    async getUserState() {
      if (!this.$accessor.token.initialized || !this.$wallet?.connected) {
        return
      }
      let crpbalanceDatas = this.wallet.tokenAccounts[TOKENS['CRP'].mintAddress]

      if (crpbalanceDatas) {
        this.crpbalance = crpbalanceDatas.balance.fixed() * 1
      }

      const farm_state = await getFarmState()
      const extraRewardConfigs = await getExtraRewardConfigs()
      const pools = await getAllPools()
      const current_pool = pools[0]
      const userAccount = await getPoolUserAccount(this.$wallet, current_pool.publicKey)

      const endDateOfLock = userAccount.lastStakeTime.toNumber() + userAccount.lockDuration.toNumber()
      const unlockDateString = moment(new Date(endDateOfLock * 1000)).format('MM/DD/YYYY HH:mm:SS')
      this.endDateOfLock = endDateOfLock
      this.endOfLock = unlockDateString
      this.canUnstake = !(
        (userAccount.lastStakeTime.toNumber() + userAccount.lockDuration.toNumber()) * 1000 >
        new Date().getTime()
      )

      //@ts-ignore
      this.userStaked = Number(new TokenAmount(userAccount.amount, TOKENS['CRP'].decimals).fixed(3))

      const rewardAmount = estimateRewards(farm_state, extraRewardConfigs, current_pool.account, userAccount)
      const tiers_info = calculateTiers(this.userStaked, userAccount.lockDuration.toNumber())
      this.$accessor.wallet.setStakingTiers(tiers_info)
      this.pendingReward = new TokenAmount(rewardAmount, TOKENS['CRP'].decimals).fixed()

      this.currentTiers = tiers_info.tiers
      this.nextTiers = tiers_info.tiers + 1

      if (this.nextTiers == TIERS_XCRP.length) {
        this.nextTiers--
        this.currentTiers--
        this.pctToNexttiers = 100
      } else {
        this.pctToNexttiers =
          ((tiers_info.xCRP - TIERS_XCRP[this.currentTiers]) /
            (TIERS_XCRP[this.nextTiers] - TIERS_XCRP[this.currentTiers])) *
          100
      }
      if (this.currentTiers > 1) {
        this.setTierCarousel(this.currentTiers - 1)
        this.selectedTier = this.currentTiers
        this.activeTab = this.currentTiers.toString()
      } else {
        this.setTierCarousel(this.currentTiers - 2)
        this.selectedTier = 1
        this.activeTab = this.currentTiers.toString()
      }
    },
    onBaseDetailSelect(lock_duration: number, estimated_apy: number) {
      this.baseModalShow = false
      this.estimatedAPY = estimated_apy
      this.lockDuration = lock_duration
    },

    async unstakeToken() {
      const pools = await getAllPools()
      const current_pool = pools[0]
      const poolSigner = current_pool.publicKey.toString()
      const rewardMint = current_pool.account.mint.toString()
      const rewardPoolVault = current_pool.account.vault.toString()

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      unstake(
        this.$web3,
        this.$wallet,
        poolSigner,
        rewardMint,
        rewardPoolVault,

        get(this.wallet.tokenAccounts, `${rewardMint}.tokenAccountAddress`),

        this.userStaked * Math.pow(10, TOKENS['CRP'].decimals)
      )
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h(
                  'a',
                  {
                    attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' }
                  },
                  'here'
                )
              ])
          })

          const description = 'Unstaking CRP'

          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Unstaking failed',
            description: error.message
          })
        })
        .finally(() => {
          this.$accessor.wallet.getTokenAccounts()
        })
    },
    async getUserAccount() {
      const pools = await getAllPools()
      const current_pool = pools[0]
      const userAccount = await getPoolUserAccount(this.$wallet, current_pool.publicKey)
      console.log(userAccount)
    },
    async harvestReward() {
      const programState = await getFarmState()

      const pools = await getAllPools()
      const current_pool = pools[0]
      const poolSigner = current_pool.publicKey.toString()
      const rewardMint = current_pool.account.mint.toString()
      const rewardPoolVault = current_pool.account.vault.toString()

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      harvest(
        this.$web3,
        this.$wallet,

        poolSigner,
        rewardMint,
        get(this.wallet.tokenAccounts, `${rewardMint}.tokenAccountAddress`),
        programState.rewardVault
      )
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h(
                  'a',
                  {
                    attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' }
                  },
                  'here'
                )
              ])
          })

          const description = 'Harvesting CRP'

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
          this.$accessor.wallet.getTokenAccounts()
        })
    },
    setTimer() {
      this.timer = setInterval(async () => {
        if (this.countdown < this.autoRefreshTime) {
          this.countdown += 1
          if (this.countdown === this.autoRefreshTime) {
            await this.flush()
          }
        }
      }, 1000)
    },
    async flush() {
      this.countdown = 0
      this.getGlobalState()
      if (this.$wallet?.connected) {
        this.getUserState()
      }
    },
    reloadTimer() {
      this.activeSpinning = true
      setTimeout(() => {
        this.activeSpinning = false
      }, 1000)
      this.flush()
      this.$accessor.wallet.getTokenAccounts()
    },
    getCurrentTier(from: any, to: any) {
      this.selectedTier = to
    },
    setTierCarousel(idx: number) {
      if (idx >= 0) (this.$refs.tierCarousel as Vue & { goTo: (idx: number) => number }).goTo(idx)
    },
    setTierTabs() {
      this.activeTab = (this.selectedTier + 1).toString()
    }
  }
})
</script>

<style lang="less" scoped>
.staking {
  // global styles

  .btn-container {
    background: @gradient-color01;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 48px;
    padding: 3px;
    width: 85px;
    height: auto;

    &.btn-large {
      width: 100%;
      height: 50px;
    }
  }

  .btn-transparent {
    background: transparent;
    padding: 4.5px 0;
    border-radius: 48px;
    border: none;
    width: 100%;
    height: auto;
  }

  .btn-primary {
    background: #2b3367;
    padding: 4.5px 0;
    border-radius: 48px;
    border: none;
    width: 100%;
    height: auto;
    color: #fff;

    &:disabled {
      color: rgba(255, 255, 255, 0.4);
    }
  }

  // class styles

  &.container {
    margin-top: 38px;

    @media @max-sl-mobile {
      margin-top: 28px;
    }

    .card {
      .card-body {
        padding: 0;

        .staking-head {
          @media @max-sl-mobile {
            display: block !important;
          }

          .title {
            text-align: center;
            position: relative;
            float: left;

            @media @max-sl-mobile {
              margin-bottom: 18px !important;
            }
          }

          .information {
            display: flex;
            align-items: center;
            justify-content: space-between;

            @media @max-sl-mobile {
              width: 100%;
            }

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
                  margin-left: 4px;
                }

                .reload-icon {
                  width: 18px;
                  height: 18px;
                }

                &.active .reload-icon {
                  transform: rotate(360deg);
                  transition: all 1s ease-in-out;
                }
              }
            }
          }
        }

        .staking-content {
          max-width: 870px;
          width: 100%;
          margin: auto !important;
          background: @color-blue700;
          border: 3px solid @color-blue500;
          padding: 18px;
          box-shadow: 0 40px 70px rgba(0, 0, 0, 0.3);
          border-radius: 18px;

          @media @max-sl-mobile {
            display: inline-block !important;
          }

          .staking-tiers {
            max-width: 370px;
            margin: auto;
            width: 100%;
            background: @color-blue800;
            border: 4px solid @color-petrol500;
            border-radius: 18px;
            padding: 24px !important;

            @media @max-md-tablet {
              max-width: 320px;
            }

            @media @max-sm-mobile {
              max-width: 290px;
            }

            .staking-tier-item {
              padding: 0 4px;

              .staking-tier-preview {
                background: @color-blue-dark;
                border-radius: 18px;
                margin-bottom: 28px;
                height: 277px;
              }

              .tier-info {
                display: inline-grid;
                row-gap: 4px;
              }

              .btn-container {
                width: 120px;

                .btn-primary {
                  background: @color-blue800;
                }
              }
            }
          }

          .staking-body {
            width: calc(100% - 398px);
            margin-right: 28px;

            @media @max-md-tablet {
              width: calc(100% - 348px);
            }

            @media @max-sl-mobile {
              width: 100%;
              margin-right: 0;
              margin-bottom: 28px;
            }

            .staking-progress {
              margin-top: 28px;

              .staking-progress-label {
                margin-bottom: 4px;
              }

              .staking-progress-percent {
                margin-top: 4px;
              }
            }

            .staking-infos-group {
              margin-top: 28px;

              .staking-info {
                margin-bottom: 8px;

                &:last-child {
                  margin-bottom: 0;
                }

                .label {
                  color: @color-gray;
                  display: flex;
                  align-items: center;

                  .tooltip-icon {
                    width: 12px;
                    height: 12px;
                    margin-left: 4px;
                  }
                }

                .value {
                  display: flex;
                  align-items: center;
                  text-align: right;
                  color: #fff;

                  .calc-icon {
                    margin-left: 8px;
                  }
                }
              }
            }

            .staking-actions-group {
              margin: 18px 0;

              .staking-action-item {
                background: rgba(226, 227, 236, 0.1);
                border-radius: 18px;
                padding: 16px;
                margin-bottom: 18px;

                &:last-child {
                  margin-bottom: 0;
                }

                .label {
                  color: @color-gray;
                }

                .value {
                  font-weight: bold;
                  font-size: 20px;
                  line-height: 25px;
                  color: #fff;
                  display: block;
                }

                .stake-btn-group {
                  .btn-container {
                    margin-right: 8px;

                    &:last-child {
                      margin-right: 0;
                    }
                  }
                }
              }
            }

            .staking-footer {
              .lock-tokens {
                .label {
                  color: @color-gray;
                }
              }

              .get-crp {
                margin-top: 18px;

                .union-icon {
                  margin-left: 8px;
                }
              }
            }
          }
        }

        .staking-tiers-details {
          max-width: 870px;
          width: 100%;
          margin: 30px auto !important;
          background: @color-blue700;
          border: 3px solid @color-blue500;
          padding: 18px;
          border-radius: 18px;

          .staking-tiers-features {
            margin: 18px 0;

            .staking-tier-container {
              margin: 0 !important;

              @media @max-sl-mobile {
                display: inline-block !important;
              }

              .staking-tier-tab {
                padding-left: 0 !important;

                @media @max-sl-mobile {
                  padding-right: 0 !important;
                  width: 100%;
                }
              }

              .staking-tier-preview {
                padding-right: 0 !important;

                @media @max-sl-mobile {
                  margin-top: 28px;
                  width: 100%;
                  padding-left: 0 !important;
                }

                .staking-tier-item-box {
                  background: #0b2e6a;
                  border-radius: 18px;
                  width: 100%;
                  height: 300px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.staking {
  // ant carousel
  .ant-carousel {
    .custom-slick-arrow {
      top: 35%;
      width: 25px;
      height: 25px;
      font-size: 25px;
      color: #fff;
      background-color: rgba(31, 45, 61, 0.11);
      opacity: 0.3;

      &.prev-arrow {
        left: 10px;
        z-index: 1;
      }

      &.next-arrow {
        right: 10px;
      }

      &::before {
        display: none;
      }

      &:hover {
        opacity: 0.5;
      }
    }

    .slick-dots {
      position: relative;
      margin-top: 28px;
      bottom: 0;
      height: auto;

      li {
        margin-left: 0;
        margin-right: 18px;
        width: 24px;
        height: 24px;
        padding: 3px;
        background: transparent;
        border-radius: 50%;

        &:last-child {
          margin-right: 0;
        }

        button {
          width: 18px !important;
          height: 18px !important;
          padding: 4px;
          border: 4px solid @color-blue800;
          border-radius: 50%;
          background: @color-petrol400;
          opacity: 0.4;
        }

        &.slick-active {
          background: #a1dfe5;

          button {
            background: @color-petrol500;
            opacity: 1;
          }
        }
      }
    }
  }

  // ant progress
  .ant-progress {
    background: transparent !important;
    width: 100%;

    .ant-progress-outer {
      display: flex;
      margin: 0;
      padding: 4px;
      box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.85);
      border-radius: 50px;
      height: 22px;
      background: @color-blue800;

      .ant-progress-inner {
        background: transparent;

        .ant-progress-bg {
          background: linear-gradient(215.52deg, #273592 0.03%, #23adb4 99.97%);
          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.55);
          border-radius: 50px 0 0 50px !important;
        }
      }
    }
  }

  // ant tabs
  .ant-tabs-bar {
    border-bottom: 0;
    margin: 0 0 28px 0;

    .ant-tabs-nav {
      .ant-tabs-tab {
        margin: 0 18px 0 0;
        font-weight: 600;
        font-size: 20px;
        line-height: 30px;
        color: #eae8f1;
      }

      .ant-tabs-tab-active {
        color: @color-petrol500;
      }

      .ant-tabs-ink-bar {
        position: relative;
        margin-top: 8px;
        width: 50px !important;
        height: 4px;
        background: @color-petrol400;
        border-radius: 10px;
      }
    }
  }
}
</style>
