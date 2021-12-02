<template>
  <div class="staking container">
    <BaseDetailModal :show="baseModalShow" :estimatedapy="estimatedAPY" @onCancel="() => (baseModalShow = false)" @onSelect="onBaseDetailSelect" />
    <StakeModal :show="stakeModalShow" :crpbalance="crpbalance" :userStaked="userStaked" :estimatedapy="estimatedAPY" @onCancel="() => (stakeModalShow = false)" />
    
    <div class="card">
      <div class="card-body">
        <div class="page-head fs-container">
          <span class="title">
            Staking
          </span>
          <span class="information">
            <div class="my-info">
              <p>TVL : <b>{{TVL.toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}} $</b></p>
            </div>

            <!-- {{ autoRefreshTime - countdown }} -->
            <div class="reload-btn" :class="activeSpinning ? 'active' : ''" @click="reloadTimer">
              <img class="load-icon" src="@/assets/icons/loading.svg" />
            </div>
          </span>
        </div>
        <div class="staking-body">
          <h1>$CRP Staking</h1>
          <Row class="staking-infos-group">
            <Col span="24" class="staking-info">
              <div class="label">
                Estimated APY
                <Tooltip placement="bottomLeft">
                  <template slot="title">
                    <div>Potential Annual Percentage Yield based on a daily compounding</div>
                  </template>
                  <div class="info-icon">
                    <img class="tooltip-icon" src="@/assets/icons/info-icon.svg" />
                  </div>
                </Tooltip>
              </div>
              <div class="value">
                {{ Math.round(estimatedAPY * 100) / 100 }} %
                <img
                  class="clickable-icon"
                  src="@/assets/icons/calculator.svg"
                  @click="
                    () => {
                      this.baseModalShow = true
                    }
                  "
                />
              </div>
            </Col>

            <Col span="24" class="staking-info">
              <div class="label">
                Total Staked
                <Tooltip placement="bottomLeft">
                  <template slot="title">
                    <div>Total staked CRP token amount</div>
                  </template>
                  <div class="info-icon">
                    <img class="tooltip-icon" src="@/assets/icons/info-icon.svg" />
                  </div>
                </Tooltip>

              </div>
              <div class="value">{{totalStaked}}</div>
            </Col>
            <Col span="24" class="staking-info">
              <div class="label">
                Total Value
                <Tooltip placement="bottomLeft">
                  <template slot="title">
                    <div>Total Value staked (USD)</div>
                  </template>
                  <div class="info-icon">
                    <img class="tooltip-icon" src="@/assets/icons/info-icon.svg" />
                  </div>
                </Tooltip>
              </div>

              <div class="value">{{totalStakedPrice}}</div>
            </Col>
          </Row>

          <Row class="staking-actions-group">
            <Col span="24" class="reward-pending">
              <div class="reward-value">
                <label class="box-title">Reward Pending</label>
                <label class="value">{{pendingReward}}</label>
              </div>
              <div class="btn-container">
                <Button class="btn-fill" :disabled="!wallet.connected || pendingReward == 0" @click = "harvestReward">Harvest</Button>
              </div>
            </Col>
            <Col span="24" class="crp-staked" :class="!wallet.connected ? 'crp-staked-block' : 'crp-staked-flex'">
              <div class="staked-value">
                <label class="box-title">CRP Staked</label>
                <label v-if="wallet.connected" class="value">{{userStaked}}</label>
              </div>
              <div v-if="wallet.connected" class="stake-btn-group">
                <div class="btn-container">
                  <Button
                    class="btn-fill"
                    @click="
                      () => {
                        this.stakeModalShow = true
                      }
                    "
                    >Stake</Button
                  >
                </div>
                <div class="btn-container">
                  <Button class="btn-outline" :disabled="!wallet.connected || userStaked == 0 || canUnstake == false" @click = "unstakeToken">Unstake</Button>
                </div>
              </div>

              <div v-if="!wallet.connected" class="connect-wallet">
                <Button class="btn-primary" @click="$accessor.wallet.openModal">Connect Wallet</Button>
              </div>
            </Col>
          </Row>

          <Row class="staking-footer">
            <Col span="24" class="lock-tokens" v-if="userStaked > 0">
              <label class="label">End of Lock</label>
              <label class="value">{{ endOfLock }}</label>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Icon, Tooltip, Button, Col, Row, Progress, Spin, Select, InputNumber } from 'ant-design-vue'
import { cloneDeep, get } from 'lodash-es'
import { getTokenBySymbol, TokenInfo, NATIVE_SOL, TOKENS } from '@/utils/tokens'
import { getMultipleAccounts, commitment } from '@/utils/web3'
import { PublicKey } from '@solana/web3.js'
import { getUnixTs } from '@/utils'
import BigNumber from 'bignumber.js'
import { TokenAmount, gt } from '@/utils/safe-math'
import * as anchor from '@project-serum/anchor';
const { BN } = anchor
import moment from 'moment'
Vue.prototype.moment = moment

const YEAR2SECOND = 365 * 24 * 3600

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

  getFarmState,
  getExtraRewardConfigs,
  getAllPools,
  getPoolUserAccount,
  estimateRewards,

  stake,
  unstake,
  harvest,
} from '@/utils/crp-stake'



export default Vue.extend({
  components: {
    Button,
    Row,
    Col,
    Tooltip
  },
  data() {
    return {
      baseModalShow: false as boolean,
      stakeModalShow: false as boolean,
      estimatedAPY: 0 as number,
      lockDuration: 0 as number,
      crpbalance: 0 as any,

      totalStaked: '0' as string,
      userStaked: 0 as number,
      pendingReward: '0' as string,
      totalStakedPrice: '0' as string,
      TVL : 0 as number,
      timer: null as any,
      autoRefreshTime: 60 as number,
      countdown: 0 as number,
      activeSpinning: false as boolean,
      endOfLock: '' as string,
      canUnstake: false as boolean
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
        if(this.$wallet?.connected){
            this.getUserState();
        }
      },
      deep: true
    },
    'wallet.connected':{
      handler(connected: any) {

        if(connected){
            this.getUserState();
        }
      },
      deep: true
    },
    'token.initialized':{
      handler(newState: boolean) {
        this.getGlobalState();
        if(this.$wallet?.connected){
          this.getUserState();
        }
      },
      deep: true
    },
    
  },
  mounted() {
    this.getTvl();
    setAnchorProvider(this.$web3, this.$wallet)
    
    if(this.$accessor.token.initialized){
        this.getGlobalState();
        if(this.$wallet?.connected){
          this.getUserState();
        }
    }
    
    this.setTimer();
  },
  methods: {
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
        
        Object.keys(responseData).forEach(function(key) {
          tvl = (tvl * 1) + ((responseData as any)[key as any].tvl * 1);
        });
      } catch {
        // dummy data
      } finally {

      }

      this.TVL = Math.round(tvl);

      window.localStorage.TVL_last_updated = new Date().getTime()
      window.localStorage.TVL = this.TVL
    },

    async getGlobalState(){
      const pools = await getAllPools()
      const current_pool = pools[0]


      const farm_state = await getFarmState();
      
      const stakedAmount = new TokenAmount(current_pool.account.amount, TOKENS['CRP'].decimals)

      if(this.price.prices['CRP']){
        this.totalStakedPrice = '$' + (Math.round(parseFloat(stakedAmount.fixed()) * this.price.prices['CRP'] * 1000) / 1000).toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        this.totalStakedPrice = '$ ' + parseFloat(stakedAmount.fixed())
      }

      this.totalStaked = 'CRP ' + (Math.round( parseFloat(stakedAmount.fixed()) * 1000) / 1000).toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      
      // const apr = Number(farm_state.tokenPerSecond.muln(YEAR2SECOND).div(current_pool.account.amount).toString());
      // this.estimatedAPY = Number((((1 + (apr / 100)/ 365)) ** 365 - 1) * 100);

      const apr = Number((new TokenAmount(farm_state.tokenPerSecond, TOKENS['CRP'].decimals)).fixed()) * 365 * 24 * 3600 / Number((new TokenAmount(current_pool.account.amount, TOKENS['CRP'].decimals)).fixed());
      this.estimatedAPY = Number((((1 + (apr / 100)/ 365)) ** 365 - 1) * 100);
    }, 

    async getUserState(){

      let crpbalanceDatas = this.wallet.tokenAccounts[TOKENS['CRP'].mintAddress]

      if(crpbalanceDatas){
        this.crpbalance = crpbalanceDatas.balance.fixed() * 1;
      }

      const farm_state = await getFarmState();
      const extraRewardConfigs = await getExtraRewardConfigs()
      const pools = await getAllPools()
      const current_pool = pools[0]
      const userAccount = await getPoolUserAccount(this.$wallet, current_pool.publicKey)

      const endDateOfLock = userAccount.lastStakeTime.toNumber() + userAccount.lockDuration.toNumber();
      const unlockDateString = moment(new Date(endDateOfLock * 1000)).format('MM/DD/YYYY HH:mm:SS')
      this.endOfLock = unlockDateString
      this.canUnstake = ! ((userAccount.lastStakeTime.toNumber() + userAccount.lockDuration.toNumber()) * 1000 > new Date().getTime())

      //@ts-ignore
      this.userStaked = Math.ceil(parseFloat((new TokenAmount(userAccount.amount, TOKENS['CRP'].decimals)).fixed()) * 1000) / 1000

      const rewardAmount = estimateRewards(
          farm_state,
          extraRewardConfigs,
          current_pool.account,
          userAccount
      )

      this.pendingReward = (new TokenAmount(rewardAmount, TOKENS['CRP'].decimals)).fixed()


    },
    onBaseDetailSelect(lock_duration: number, estimated_apy: number) {
      this.baseModalShow = false
      this.estimatedAPY = estimated_apy
      this.lockDuration = lock_duration
    },

    async unstakeToken(){
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

          this.userStaked * Math.pow(10, TOKENS['CRP'].decimals),
        ).then((txid) => {
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
      });




    },
    async getUserAccount(){
      const pools = await getAllPools()
      const current_pool = pools[0]
      const userAccount = await getPoolUserAccount(this.$wallet, current_pool.publicKey)
      console.log(userAccount)
    },
    async harvestReward(){
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
      ).then((txid) => {
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
      });

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
    },
    reloadTimer() {
      this.activeSpinning = true
      setTimeout(() => {
        this.activeSpinning = false
      }, 1000)
      this.flush()
      this.$accessor.wallet.getTokenAccounts()
    }
  }
})
</script>

<style lang="less" scoped>
.staking.container {
  max-width: 1350px;
  width: 100%;
  background: @color-bg;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;

  // global styles
  p {
    margin-bottom: 0;
  }

  h1 {
    font-weight: bold;
    font-size: 25px;
    line-height: 31px;
  }

  .btn-container {
    background: @gradient-color-primary;
    padding: 2px;
    border-radius: 8px;

    .btn-fill {
      height: 100%;
      width: 100%;
      border: none;
      background: @gradient-color-harvest;
      color: #fff;
      font-weight: 600;
      font-size: 12px;
      line-height: 14px;
      border-radius: 6px;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-outline {
      height: 100%;
      width: 100%;
      border: none;
      background: @color-bg-dark;
      color: #fff;
      font-weight: 600;
      font-size: 12px;
      line-height: 14px;
      border-radius: 6px;
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .btn-primary {
    background: @gradient-color-social;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    border: none;
    height: 42px;
  }

  .tooltip-icon {
    width: 10px;
    position: absolute;
    top: 3px;
    right: -15px;
    cursor: pointer;
  }

  .clickable-icon {
    cursor: pointer;
  }

  // class styles

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

      .staking-body {
        max-width: 450px;
        min-height: 465px;
        margin: auto;
        background: @color-bg-dark;
        padding: 15px;
        border-radius: 5px;

        .staking-footer {
          .lock-tokens {
            display: flex;
            justify-content: space-between;
            font-weight: 600;
            font-size: 12px;
            line-height: 12px;
          }

          .get-crp {
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;

            .label {
              font-weight: 600;
              font-size: 16px;
              line-height: 12px;
            }

            img {
              margin-left: 5px;
            }
          }
        }

        .staking-infos-group {
          .staking-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;

            .label {
              font-weight: bold;
              font-size: 16px;
              line-height: 20px;
              color: @color-gray;
              position: relative;
            }

            .value {
              display: flex;
              align-items: center;
              font-weight: bold;
              font-size: 16px;
              line-height: 20px;
              text-align: right;
              color: #fff;

              img {
                margin-left: 10px;
              }
            }
          }
        }

        .staking-actions-group {
          margin: 20px 0;

          .reward-pending,
          .crp-staked {
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 15px;
          }

          .box-title {
            font-size: 12px;
            line-height: 15px;
            color: @color-gray;
          }

          .reward-pending {
            display: flex;
            justify-content: space-between;

            .reward-value {
              .value {
                font-weight: bold;
                font-size: 20px;
                line-height: 25px;
                color: #fff;
                display: block;
              }
            }

            .btn-container {
              height: 55px;
              width: 140px;
            }
          }

          .crp-staked {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;

            .staked-value {
              .value {
                font-weight: bold;
                font-size: 20px;
                line-height: 25px;
                color: #fff;
                display: block;
              }
            }

            .stake-btn-group {
              .btn-container {
                height: 42px;
                width: 140px;
                margin-bottom: 10px;

                &:last-child {
                  margin-bottom: 0;
                }
              }
            }

            .connect-wallet {
              width: 100%;
              display: flex;
              justify-content: center;
              margin-top: 10px;

              .btn-primary {
                width: 50%;
              }
            }

            &.crp-staked-block {
              display: block;
            }

            &.crp-staked-flex {
              display: flex;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
// ant customization
.ant-tooltip {
  .ant-tooltip-content {
    .ant-tooltip-arrow {
      display: none;
    }

    .ant-tooltip-inner {
      background: @gradient-color-primary !important;
      background-origin: border-box !important;
      border: 2px solid rgba(255, 255, 255, 0.14) !important;
      box-shadow: 18px 11px 14px rgba(0, 0, 0, 0.25) !important;
      border-radius: 8px !important;
      padding: 10px !important;
    }
  }
}
</style>