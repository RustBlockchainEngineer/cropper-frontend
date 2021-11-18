<template>
  <div class="coin-select">
    <div class="label fs-container" :class="disabled ? 'disabled' : '' ">
      <span>{{ label }}</span>
    </div>
    <div class="coin-input">
      <div class="main-input fs-container">
        <button class="select-button fc-container" @click="selectCoin">
          <div v-if="coinName" class="fc-container">
            <CoinIcon :mint-address="mintAddress" />
            <span :class="disabled ? 'coin-disabled' : '' ">{{ coinName }}</span>
          </div>
          <span v-else :class="disabled ? 'coin-disabled' : '' ">Select a token</span>
          <img v-if="!disabled" src="@/assets/icons/arrow-down.svg" />
          <img v-else src="@/assets/icons/arrow-down-grey.svg" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { lt } from '@/utils/safe-math'

export default Vue.extend({
  model: {
    prop: 'value',
    event: 'onInput'
  },

  props: {
    label: {
      type: String,
      default: 'From'
    },
    coinName: {
      type: String,
      default: ''
    },
    mintAddress: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    balance: {
      type: Object,
      default: null
    },
    balanceOffset: {
      type: Number,
      default: 0
    },
    showMax: {
      type: Boolean,
      default: true
    },
    showHalf: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    lt,
    focusInput() {
      const input = this.$refs.input as HTMLInputElement
      input.focus()
    },
    inputBalanceByPercent(percent: number) {
      // error balance
      if (!this.balance || this.balance.wei.isNaN()) return

      const availableBalance = Number(this.balance.toEther()) + (this.balanceOffset ?? 0)

      // can't send negative balance
      if (availableBalance < 0) return

      const inputValue = (availableBalance * percent).toFixed(this.balance.decimals)
      this.focusInput()
      this.$emit('onInput', inputValue)
    },
    selectCoin() {
      if (this.disabled == false) this.$emit('onSelect')
    }
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables';

.coin-select {
  display: flex;
  align-items: center;
  
  .label {
    margin-right: 15px;
    font-size: 15px !important;
    line-height: 18px;
    color: #fff;
  }

  .label.disabled {
    color: #40426C;
  }
  
  .coin-input {
    background: linear-gradient(97.63deg, #280C86 -29.92%, #22B5B6 103.89%);
    background-origin: border-box;
    padding: 2px;
    border-radius: 8px;

    button {
      border: none;
      background-color: @color-bg;
      font-weight: 600;
      font-size: 14px;
      line-height: 22px;
      border-radius: 8px;
      white-space: nowrap;
      cursor: pointer;

      &:active,
      &:focus,
      &:hover {
        outline: 0;
      }

      &:hover {
        background-color: @modal-header-bg;
      }
    }
    .select-button {
      padding: 10px 18px;
      line-height: 24px;
      width: 130px;

      .anticon {
        margin-left: 4px;
        font-size: 8px;
      }
      
      img {
        width: 11px;
        height: 6px;
        margin-left: 10px;
      }

      .coin-disabled {
        color: #40426C;
      }

      .fc-container {
        img {
          height: 18px;
          width: 18px;
          margin-left: 0;
        }

        span {
          margin-left: 7px;
          font-size: 18px;
          line-height: 22px;
          font-weight: 400;
        }
      }
    }

    .shortcut-btns {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
