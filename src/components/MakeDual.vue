<template>
  <Modal :title="title" :visible="true" :footer="null" :width="400" centered @cancel="$emit('onCancel')">
    <div class="card">
      <div class="card-body">
        <CoinInput
          v-model="fromCoinAmount"
          label="Initial Reward Token Amount"
          :balance-offset="dualRewardCoin && dualRewardCoin.symbol === 'SOL' ? -0.05 : 0"
          :mint-address="dualRewardCoin ? dualRewardCoin.mintAddress : ''"
          :coin-name="dualRewardCoin ? dualRewardCoin.symbol : ''"
          :balance="dualRewardCoin ? dualRewardCoin.balance : null"
          :show-half="true"
          :show-arrow="false"
          @onSelect="$emit('onSelect')"
          @onInput="(amount) => (fromCoinAmount = amount)"
          @onFocus="
            () => {
              fixedFromCoin = true
            }
          "
          @onMax="
            () => {
              fixedFromCoin = true
              fromCoinAmount = dualRewardCoin && dualRewardCoin.balance ? dualRewardCoin.balance.fixed() : '0'
            }
          "
        />

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
          <b>Reward per week:</b>&nbsp; {{ rewardPerWeek(fromCoinAmount, startTime, endTime) }} &nbsp;{{
            dualRewardCoin != null ? dualRewardCoin.symbol : ''
          }}
        </div>

        <div class="stdGradientButton">
          <Button
            size="large"
            ghost
            :loading="loading"
             @click="$emit('onOk', dualRewardCoin.mintAddress, fromCoinAmount, startTime.unix(), endTime.unix());"
          >
            <template>Confirm</template>
          </Button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Modal,  Button, DatePicker } from 'ant-design-vue'
import { mapState } from 'vuex'
import { gt } from '@/utils/safe-math'
import moment from 'moment'

// fix: Failed to resolve directive: ant-portal
Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Button,
    DatePicker
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    farmInfo:{
      type: Object,
      required: true
    },
    dualRewardCoin:{
      type: Object,
      required: false
    }
  },
  data() {
    return {
      fromCoinAmount: '',
      fixedFromCoin: false,
      startTime: moment(),
      endTime: moment().add(28, 'days'),
      endOpen: false,
      
    }
  },
  computed: {
      ...mapState([ 'liquidity','setting'])
  },
    
  methods: {
    gt,
    handleStartOpenChange(open: any) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open: any) {
      this.endOpen = open
    },
    rewardPerWeek(fromCoinAmount:any, startTime:any, endTime:any) {
      let result = 0
      let initialAmount = Number.parseFloat(fromCoinAmount)

      if ((startTime.unix() + (14 * 86400)) > endTime.unix()) {
        endTime = moment().set('second', (14 * 86400));
      }

      let duration = 0
      if (startTime != null && endTime != null) {
        duration = endTime.unix() - startTime.unix()
      }

      if (duration > 0) {
        result = (initialAmount * 7 * 24 * 3600) / duration
      }
      return result
    }
    
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables';
.info-guide {
  font-size: 15px;
  line-height: 18px;
  display: flex;
  align-items: flex-start;
  margin: 10px 0;
  
  em b {
    font-size: 15px;
    line-height: 18px;
  }

  img {
    margin-right: 10px;
  }
}

</style>
