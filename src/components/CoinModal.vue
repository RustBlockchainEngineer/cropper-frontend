<template>
  <Modal :title="title" :visible="true" :footer="null" :width="400" centered @cancel="$emit('onCancel')">
    <div class="coin-modal">
      <div class="label fs-container">
        <span></span>
        <span v-if="coin.balance && !coin.balance.wei.isNaN()"> Balance: {{ coin.balance.fixed() }} </span>
      </div>
      <div class="coin-input fs-container">
        <input
          v-model="value"
          inputmode="decimal"
          autocomplete="off"
          autocorrect="off"
          placeholder="0.00"
          type="text"
          pattern="^[0-9]*[.,]?[0-9]*$"
          minlength="1"
          maxlength="79"
          spellcheck="false"
        />
        <button
          v-if="coin.balance && (isNullOrZero(value) || lt(value, coin.balance.toEther()))"
          class="max-button"
          @click="setMax"
        >
          MAX
        </button>
        <div v-if="coin.symbol" class="coin-name">
          {{ coin.symbol }}
        </div>
      </div>
    </div>
    <div v-if="title == 'Unstake LP'">
      <h4 class="text-center">LP Breakdown</h4><br />
      <div class="text-center">
        <label class="label-lp-breakdown">{{lpbreakdown.pcSymbol}} {{ Math.round(lpbreakdown.pcBalance * 1000 * ( value / coin.balance.fixed() )) / 1000 }}</label><label class="label-lp-breakdown">{{lpbreakdown.coinSymbol}} {{Math.round(lpbreakdown.coinBalance * 1000 * ( value / coin.balance.fixed() )) / 1000 }}</label>
      </div>
      <br />
    </div>
    <div v-html="text">
      
      {{text}}
    </div>

    <Row :gutter="32" class="actions">
      <Col :span="12" class="text-center">

        <div class="stdEmptyGradientButton">
          <Button ghost @click="$emit('onCancel')"> Cancel </Button>
        </div>
      </Col>
      <Col :span="12" class="text-center">
        <div class="stdGradientButton">
          <Button
            :loading="loading"
            :disabled="loading || isNullOrZero(value) || !lte(value, coin.balance.toEther()) || !validateTotalSupply()"
            ghost
            @click="$emit('onOk', value)"
          >
            Confirm
          </Button>
        </div>
      </Col>
    </Row>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Modal, Row, Col, Button } from 'ant-design-vue'

import { inputRegex, escapeRegExp } from '@/utils/regex'
import { lt, lte, isNullOrZero } from '@/utils/safe-math'
import {getTotalSupply} from '@/store/liquidity'
const MIN_LP_SUPPLY = 0.001
// fix: Failed to resolve directive: ant-portal
Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Row,
    Col,
    Button
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    coin: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    lpbreakdown: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      value: ''
    }
  },
  watch: {
    // input amount change
    value(newValue: string, oldValue: string) {
      this.$nextTick(() => {
        if (!inputRegex.test(escapeRegExp(newValue))) {
          this.value = oldValue
        }
      })
    }
  },

  methods: {
    lt,
    lte,
    isNullOrZero,
    validateTotalSupply()
    {
      if(this.title == "Remove Liquidity")
      {
        const lp_info = Object(this.$accessor.liquidity.infos)[this.coin.mintAddress]
        if(lp_info)
        {
            const totalSupply = lp_info.lp.totalSupply.fixed()
            const res = parseFloat(this.value) <= (parseFloat(totalSupply)  - MIN_LP_SUPPLY)//
            return res
        }
        else
        {
          return false
        }
      }
      return true
    },

    setMax() 
    {

      if(this.title == "Remove Liquidity")
      {
        let self = this

        const lp_info = Object(this.$accessor.liquidity.infos)[this.coin.mintAddress]
        if(lp_info){
          const totalSupply = lp_info.lp.totalSupply.fixed()
          self.value = "" + Math.min(parseFloat(self.coin.balance.fixed()), parseFloat(totalSupply)  - MIN_LP_SUPPLY)
        }
      }
      else
      {
        this.value = this.coin.balance.fixed()
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables';

.actions {
  margin-top: 10px;

  button {
    width: 100%;
  }
}
  .label-lp-breakdown {
    padding: 0.75rem;
    font-size: 15px;
    line-height: 14px;
    color: #85858d;
    background-color: #3f2a83;
    margin: 1rem;
    border-radius: 12px;
  }
.coin-modal {
  .label {
    padding: .75rem 1rem 0;
    font-size: 15px;
    line-height: 14px;
    color: #85858d;
  }

  input {
    width: 0;
    padding: 0;
    border: none;
    background-color: transparent;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    flex: 1 1 auto;
    color: @text-color;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:active,
    &:focus,
    &:hover {
      outline: 0;
    }
  }

  input[disabled] {
    cursor: not-allowed;
  }

  .coin-input {
    padding: 0.75rem 0.75rem 0.75rem 1rem;

    button {
      border: none;
      background-color: transparent;
      font-weight: 600;
      font-size: 14px;
      line-height: 22px;
      border-radius: 4px;
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

    .max-button {
      height: 32px;
      padding: 0 16px;
      color: @primary-color;
    }

    .coin-name {
      padding: 0.5rem;
      line-height: 24px;
      font-weight: 600;
    }
  }
}
</style>
