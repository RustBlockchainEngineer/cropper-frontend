<template>
  <Modal
    title="Confirm the AMM ID"
    :visible="show"
    :footer="null"
    :mask-closable="false"
    @cancel="$emit('onClose')"
  >
    <div class="select-token">
      <div class="token-list">
        <div
          v-for="liquidity in liquidityList"
          :key="liquidity.ammId"
          class="token-info"
          @click="$emit('onSelect', liquidity)"
        >
          <div>
            AMM ID:
            <span>{{ liquidity.ammId}}</span>
          </div>

          <div>
            Pool liquidity:
            <span>
              {{ liquidity.coin.balance ? liquidity.coin.balance.toEther() : 0 }}
              {{ liquidity.coin.symbol }} | 
              {{ liquidity.pc.balance ? liquidity.pc.balance.toEther() : 0 }}
              {{ liquidity.pc.symbol }}
            </span>
          </div>
        </div>
      </div>
      <div class="stdGradientButton" :style="userClose ? '' : 'display: none'">
        <Button v-if="userClose" size="large" ghost @click="$emit('onSelect', undefined)">Create a new one</Button>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Modal, Button } from 'ant-design-vue'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Button
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    liquidityList: {
      // type: List,
      default: []
    },
    userClose: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables';

.select-token {
  display: grid;
  grid-auto-rows: auto;
  row-gap: 14px;

  .token-list {
    max-height: 60vh;
    overflow: auto;
    direction: ltr;
    will-change: transform;

    .token-info {
      width: 100%;
      padding: 17px 0;
      cursor: pointer;
      opacity: 1;
      font-size: 18px;
      line-height: 22px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      text-align: center;
      border-radius: 6px;
      margin-bottom: 6px;

      @media (max-width: @mobile-b-width) {
        padding: 10px;
        text-align: left;
        font-size: 15px;
        line-height: 18px;
      }

      div:nth-child(1) {
        margin-bottom: 12px;
      }

      &:hover,
      &:active {
        background: rgb(107, 128, 185);
      }

      span {
        @media (max-width: @mobile-b-width) {
          display: block;
        }
      }
    }

    .token-info[disabled] {
      cursor: not-allowed;
      // pointer-events: none;
      opacity: 0.5;
    }
  }
}
</style>
