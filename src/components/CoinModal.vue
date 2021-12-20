<template>
  <Modal
    :title="title"
    :visible="true"
    :footer="null"
    :closable="false"
    :width="400"
    :mask="true"
    centered
    @cancel="$emit('onCancel')"
  >
    <img
      class="modal-close"
      src="@/assets/icons/close-circle-icon.svg"
      @click="$emit('onCancel')"
    />

    <div class="liquidity-box">
      <div class="fs-container">
        <div class="fc-container">
          <div class="coins-container">
            <div class="coin-group textS weightS">
              <CoinIcon :mint-address="coin ? coin.coin.mintAddress : ''" />
              {{ coin.coin.symbol }}
              <span class="from-to">-</span>
              <CoinIcon :mint-address="coin ? coin.pc.mintAddress : ''" />
              {{ coin.pc.symbol }}
            </div>
          </div>
          <button
            v-if="!showHalf && coin.balance"
            class="input-button bodyXS weightB fc-container"
            @click="setMax(1)"
          >
            Max
          </button>
          <button
            v-if="showHalf && coin.balance"
            class="input-button bodyXS weightB fc-container"
            @click="setMax(0.5)"
          >
            Half
          </button>
        </div>
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
      </div>
    </div>
    <div class="lp-breakdown text-center">
      <label class="textS weightS letterL">LP Breakdown</label>
      <div class="lp-coins-container fc-container">
        <div class="lp-coin-box textS">
          <b>{{ coin.coin.symbol }}</b> {{ coin.balance.toEther().toFixed(coin.coin.decimals) }}
        </div>
        <div class="lp-coin-box textS">
          <b>{{ coin.pc.symbol }}</b> {{ coin.balance.toEther().toFixed(coin.pc.decimals) }}
        </div>
      </div>
    </div>
    <div class="info-box">
      <img class="info-icon" src="@/assets/icons/info.svg" />
      <label class="bodyXS weightB"
        >You will have to validate 2 operations, Unstake LP & Unstake Liquidity.<br /><br />
        If the pop up for the second operations does not appear, it may have popped up
        behind your browser. You an check this by minimizing your browser.
      </label>
    </div>

    <div class="btn-group fs-container">
      <div class="btn-container">
        <Button class="btn-fill textM weightS" @click="$emit('onCancel')">
          Cancel
        </Button>
      </div>
      <div class="btn-container">
        <Button
          class="btn-transparent textM weightS"
          :loading="loading"
          :disabled="
            loading ||
            isNullOrZero(value) ||
            !lte(value, coin.balance.toEther()) ||
            !validateTotalSupply()
          "
          @click="$emit('onOk', value)"
        >
          Confirm
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from "vue";
import { Modal, Button } from "ant-design-vue";

import { inputRegex, escapeRegExp } from "@/utils/regex";
import { lt, lte, isNullOrZero } from "@/utils/safe-math";
import { getTotalSupply } from "@/store/liquidity";
const MIN_LP_SUPPLY = 0.001;
// fix: Failed to resolve directive: ant-portal
Vue.use(Modal);

export default Vue.extend({
  components: {
    Modal,
    Button,
  },

  props: {
    title: {
      type: String,
      default: "",
    },
    coin: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      value: "",
      showHalf: false as boolean,
    };
  },
  watch: {
    // input amount change
    value(newValue: string, oldValue: string) {
      this.$nextTick(() => {
        if (!inputRegex.test(escapeRegExp(newValue))) {
          this.value = oldValue;
        }
      });
    },
  },

  methods: {
    lt,
    lte,
    isNullOrZero,
    validateTotalSupply() {
      if (this.title == "Remove Liquidity") {
        const lp_info = Object(this.$accessor.liquidity.infos)[this.coin.mintAddress];
        if (lp_info) {
          const totalSupply = lp_info.lp.totalSupply.fixed();
          const res = parseFloat(this.value) <= parseFloat(totalSupply) - MIN_LP_SUPPLY; //
          return res;
        } else {
          return false;
        }
      }
      return true;
    },

    setMax(amount: number) {
      this.showHalf = !this.showHalf;

      if (this.title == "Remove Liquidity") {
        let self = this;

        const lp_info = Object(this.$accessor.liquidity.infos)[this.coin.mintAddress];
        if (lp_info) {
          const totalSupply = lp_info.lp.totalSupply.fixed();
          self.value =
            "" +
            Math.min(
              parseFloat(self.coin.balance.fixed()),
              parseFloat(totalSupply) - MIN_LP_SUPPLY
            ) *
              amount;
        }
      } else {
        this.value = this.coin.balance.fixed();
      }
    },
  },
});
</script>

<style lang="less" scoped>
.liquidity-box {
  background: rgba(226, 227, 236, 0.1);
  border-radius: 18px;
  padding: 12px;

  .coins-container {
    background: @gradient-color-outline;
    background-origin: border-box;
    padding: 2px;
    border-radius: 8px;
    margin-right: 8px;

    .coin-group {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      padding: 6px;
      background: @color-blue800;

      img {
        border-radius: 50%;
        width: 12px;
        height: 12px;
        margin-right: 4px;
      }

      .from-to {
        margin: 0 4px;
      }
    }
  }

  .input-button {
    height: 32px;
    width: 32px;
    border: 1px solid #6574d6;
    border-radius: 4px;
    color: #ccd1f1;
    background: transparent;
  }

  input {
    width: 0;
    padding: 0;
    border: none;
    background-color: transparent;
    flex: 1 1 auto;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
    font-weight: 600;
    font-size: 25px;
    line-height: 35px;
    letter-spacing: 0.25px;

    &:active,
    &:focus,
    &:hover {
      outline: 0;
    }
  }

  input[disabled] {
    cursor: not-allowed;
  }
}

.lp-breakdown {
  margin-top: 8px;

  label {
    color: @color-blue200;
  }

  .lp-coins-container {
    margin-top: 18px;

    .lp-coin-box {
      background: @color-blue600;
      padding: 4px 12px;
      border-radius: 8px;
      margin-right: 8px;
      color: @color-blue100;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}

.info-box {
  background: @color-blue800;
  padding: 18px;
  border-radius: 18px;
  margin-top: 18px;
  display: flex;
  align-items: baseline;

  .info-icon {
    width: 12px;
    height: 12px;
    margin-right: 8px;
  }

  label {
    color: @color-blue100;
  }
}

.btn-group {
  margin-top: 8px;

  .btn-container {
    background: @gradient-btn-primary;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 38px;
    padding: 3px;
    height: 50px;
    margin-right: 4px;
    width: calc(50% - 4px);

    &:last-child {
      margin-right: 0;
    }

    .btn-transparent,
    .btn-fill {
      height: 100%;
      width: 100%;
      border-radius: 38px;
      border: 0;
    }

    .btn-transparent {
      background: transparent;
    }

    .btn-fill {
      background: @color-blue700;
    }
  }
}
</style>
