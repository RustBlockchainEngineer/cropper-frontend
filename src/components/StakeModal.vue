<template>
  <Modal
    title="Stake $CRP TOKEN"
    :visible="show"
    :footer="null"
    :mask-closable="true"
    @cancel="$emit('onCancel')"
    centered
  >
    <div class="stake-container">
      <Row class="balance-form">
        <div class="value-balance">Balance {{ this.crpbalance }}</div>
        <div class="input-form">
          <input type="number" 
          v-model="toStake" placeholder="Input amount"/>
          <Button class="btn-max" 
          @click="setMax">MAX</Button>
          <span class="symbol">CRP</span>
        </div>
        <div class="value-total">Total: <span>{{ this.userStaked }}</span></div>
      </Row>
      <Row>
        <Col class="tier-group" span="6" v-for="data in lockData" :key="data.tier" @click="displayTiers(data.tier)">
          <span :class="(data.tier === tierActive) ? 'tier-active' : 'tier-inactive'">{{
            data.time >= 12 ? data.time / 12 + 'Y' : data.time + 'M'
          }}</span>
          {{ data.boost }}x
        </Col>
      </Row>
      <Row class="calc-box">
        <Col span="24" class="calc-info">
          <label class="label">Total lock (CRP)</label>
          <label class="value">{{ this.userStaked * 1 + toStake * 1 }}</label>
        </Col>
        <Col span="24" class="calc-info">
          <label class="label">Base APY (%)</label>
          <label class="value">{{ Math.round(this.estimatedapy * 100) / 100 }}</label>
        </Col>
        <Col span="24" class="calc-info">
          <label class="label">Estimated reward (CRP) / year</label>
          <label class="value">{{ Math.round(100000 * (this.userStaked * 1 + toStake * 1) * (Math.round(this.estimatedapy * 100) /100) / 100) / 100000  }}</label>
        </Col>
        <Col span="24" class="calc-info">
          <label class="label">{{ boostText }}</label>
          <label class="value">x {{ boostAPY }}</label>
        </Col>
        <Col span="24" class="calc-info">
          <label class="label">Total estimate reward / year</label>
          <label class="reward-value">{{ Math.round(100000 * (this.userStaked * 1 + toStake * 1) * (Math.round(this.estimatedapy * 100) /100) * boostAPY / 100) / 100000  }}CRP</label>
        </Col>
      </Row>
      <Row class="calc-footer">
        <p class="red">Your total staked tokens will be locked until {{ unstakeDate }}</p>
        <div class="cc-btn-group">
          <div class="btn-container">
            <Button class="btn-outline" @click="() => {$emit('onCancel')}">Cancel</Button>
          </div>
          <Button class="btn-primary" :disabled="this.crpbalance < toStake || toStake * 1 <= 0" @click="stakeToken">Confirm</Button>
        </div>
      </Row>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Modal, Row, Col } from 'ant-design-vue'
import { cloneDeep, get } from 'lodash-es'
import { getUnixTs } from '@/utils'

import moment from 'moment'

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



Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Row,
    Col
  },
  data() {
    return {
      toStake : null as any,
      tierActive : 4,
      boostAPY : 1,
      unstakeDate : '',
      minutesLock :  null as any,
      boostText : '',
      lockData: [
        {
          tier: 1,
          time: 1,
          minutesLock: 43200,
          boost: 1,
          apy: 11.1,
          text: 'Boost for 1 month locked'
        },
        {
          tier: 2,
          time: 3,
          minutesLock: 129600,
          boost: 1.1,
          apy: 12.21,
          text: 'Boost for 3 months locked'
        },
        {
          tier: 3,
          time: 6,
          minutesLock: 259200,
          boost: 1.3,
          apy: 14.43,
          text: 'Boost for 6 months locked'
        },
        {
          tier: 4,
          time: 12,
          minutesLock: 525600,
          boost: 2,
          apy: 22.19,
          text: 'Boost for 1 year locked'
        }
      ]
    }
  },
  computed: {
    ...mapState(['wallet', 'url'])
  },

  mounted() {
    this.displayTiers(this.tierActive)
  },

  methods: {
    displayTiers(tier: any) {
      this.tierActive = tier;
      let currentTier = this.lockData.filter(
          (tierSearch: any) => (tierSearch.tier as string) == (tier as string)
        )

      console.log(currentTier);  
      this.boostAPY = currentTier[0].boost;
      this.boostText = currentTier[0].text;
      this.minutesLock = currentTier[0].minutesLock;

      var currentDate = moment();
      var futureMonth = moment(currentDate).add(currentTier[0].time, 'M');

      this.unstakeDate = futureMonth.format('MM/DD/YYYY')


    },
    setMax() 
    {
      this.toStake  = this.crpbalance 
      
    },

    async stakeToken(){
      const pools = await getAllPools()

      console.log(this.minutesLock);

      const current_pool = pools[0]
      const poolSigner = current_pool.publicKey.toString()
      const rewardMint = current_pool.account.mint.toString()
      const rewardPoolVault = current_pool.account.vault.toString()
      const lock_duration = this.minutesLock * 60



      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })



      stake(
        this.$web3, 
        this.$wallet,

        poolSigner,
        rewardMint,
        rewardPoolVault,

        get(this.wallet.tokenAccounts, `${rewardMint}.tokenAccountAddress`),
        
        this.toStake * 1000000,
        lock_duration
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
            
      const description = `Staking ${this.toStake} CRP`

      this.$accessor.transaction.sub({ txid, description })
    })
    .catch((error) => {
      this.$notify.error({
        key,
        message: 'Staking failed',
        description: error.message
      })
    })
    .finally(() => {
      this.$accessor.wallet.getTokenAccounts()
      this.$emit('onCancel');

    });



    }

  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    crpbalance: {
      type: Number,
      default: 0
    },
    estimatedapy: {
      type: Number,
      default: 0
    },
    userStaked: {
      type: Number,
      default: 0
    }
  }
})
</script>
<style lang="less">
// global styles

.btn-container {
  background: @gradient-color-primary;
  padding: 2px;
  border-radius: 8px;

  .btn-outline {
    height: 100%;
    width: 100%;
    border: none;
    background: @color-bg-dark;
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
  }
}

.btn-primary {
  background: @gradient-color-social;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:disabled {
        opacity: 0.5;
  }
}

// class styles

.stake-container {

  p.red {
    color: #f00 !important;
  }
  .balance-form {
    margin-bottom: 30px;

    .value-balance {
      font-weight: 600;
      font-size: 12px;
      line-height: 7px;
      color: rgba(255, 255, 255, 0.8);
      width: 100%;
      text-align: right;
    }

    .input-form {
      display: flex;
      align-items: center;
      padding: 12px;
      border: 2px solid @color-light-blue;
      border-radius: 8px;
      margin: 10px 0;

      input {
        color: #fff;
        background: transparent;
        border: none;
        outline: none;
        width: 100%;
        font-weight: bold;
        font-size: 18px;
        line-height: 22px;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
      
      .btn-max {
        background: @color-light-blue;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-weight: 800;
        font-size: 8px;
        line-height: 7px;
        padding: 4px;
      }

      .symbol {
        font-weight: bold;
        font-size: 18px;
        line-height: 22px;
        color: #fff;
        margin-left: 12px;
      }
    }

    .value-total {
      font-weight: 600;
      font-size: 12px;
      line-height: 7px;
      color: rgba(255, 255, 255, 0.8);
      width: 100%;
      text-align: left;
      
      span {
        font-weight: 800;
        color: @color-light-blue;
      }
    }
  }

  .tier-group {
    display: inline-grid;
    text-align: center;
    font-size: 12px;
    line-height: 14px;
    color: @color-gray;
    cursor: pointer;

    .tier-inactive,
    .tier-active {
      padding: 10px 0;
      width: 80%;
      background: #32476c;
      border-radius: 20px;
      margin: 10px auto;
      font-weight: bold;
      font-size: 18px;
      line-height: 22px;
      letter-spacing: 0.1em;
      color: #6d7583;
    }

    .tier-active {
      background: @color-light-blue;
      color: #fff;
    }
  }

  .calc-box {
    margin-top: 30px;
    padding: 12px 25px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;

    .calc-info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:nth-child(odd) {
        padding: 15px 0;
      }

      &:nth-child(even) {
        padding-bottom: 15px;
        border-bottom: 1px solid #384d71;
      }

      .label {
        font-size: 12px;
        line-height: 15px;
        color: rgba(255, 255, 255, 0.5);
      }

      .value {
        font-size: 14px;
        line-height: 17px;
        color: #fff;
      }

      .reward-value {
        font-weight: bold;
        font-size: 20px;
        line-height: 25px;
      }
    }
  }

  .calc-footer {
    margin-top: 15px;
    text-align: center;

    p {
      font-weight: 600;
      font-size: 12px;
      line-height: 12px;
      color: rgba(255, 255, 255, 0.8);
    }

    .cc-btn-group {
      margin-top: 30px;
      display: flex;
      justify-content: center;

      .btn-container,
      .btn-primary {
        width: 120px;
        height: 42px;
        font-weight: 600;
        font-size: 12px;
        line-height: 14px;
      }

      .btn-container {
        margin-right: 15px;
      }
    }
  }
}
</style>
