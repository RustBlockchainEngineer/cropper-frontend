<template>
  <Modal title="Stake $CRP TOKEN" :visible="show" :footer="null" :mask-closable="false" @cancel="$emit('onClose')" centered>
    <div class="stake-container">
      <Row class="balance-form">
        <input type="number" />
      </Row>
      <Row>
        <Col class="tier-group" span="6" v-for="data in lockData" :key="data.tier">
          Tier {{ data.tier }}
          <span>{{ data.time >= 12 ? data.time / 12 + 'Y' : data.time + 'M'}}</span>
          {{ data.boost }}x
        </Col>
      </Row>
      <Row class="calc-box">
        <Col span="24" class="calc-info">
          <label class="label">Total lock (CRP)</label>
          <label class="value">10,000.00</label>
        </Col>
        <Col span="24" class="calc-info">
          <label class="label">Base APY (%)</label>
          <label class="value">13.12</label>
        </Col>
        <Col span="24" class="calc-info">
          <label class="label">Estimated reward (CRP)</label>
          <label class="value">10,000.00</label>
        </Col>
        <Col span="24" class="calc-info">
          <label class="label">Boost for 1 year locked</label>
          <label class="value">13.12</label>
        </Col>
        <Col span="24" class="calc-info">
          <label class="label">Total estimate reward</label>
          <label class="reward-value">2,623.95 CRP</label>
        </Col>
      </Row>
      <Row class="calc-footer">
        <p>Your total staked tokens will be locked until 10/11/2022</p>
        <div class="cc-btn-group">
          <div class="btn-container">
            <Button class="btn-outline">Cancel</Button>
          </div>
          <div class="btn-container">
            <Button class="btn-fill">Confirm</Button>
          </div>
        </div>
      </Row>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Modal, Row, Col } from 'ant-design-vue'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Row,
    Col
  },
  data() {
    return {
      lockData: [
        {
          tier: 1,
          time: 1,
          boost: 1,
          apy: 11.1
        },
        {
          tier: 2,
          time: 3,
          boost: 1.1,
          apy: 12.21
        },
        {
          tier: 3,
          time: 6,
          boost: 1.3,
          apy: 14.43
        },
        {
          tier: 4,
          time: 12,
          boost: 2,
          apy: 22.19
        }
      ]
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
})
</script>
<style lang="less">
.stake-container {
  .balance-form {
    color: #000;
    margin-bottom: 30px;
  }

  .tier-group {
    display: inline-grid;
    text-align: center;
    font-size: 12px;
    line-height: 14px;
    color: @color-gray;

    span {
      padding: 10px 0;
      width: 80%;
      background: #32476C;
      border-radius: 20px;
      margin: 10px auto;
      font-weight: bold;
      font-size: 18px;
      line-height: 22px;
      letter-spacing: 0.1em;
      color: #6D7583;
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
        border-bottom: 1px solid #384D71;
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
      margin-top: 30px auto 0 auto;
      display: flex;

      // .btn-container {
      //   width: 120px;
      //   height: 42px;
      // }
    }
  }
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
    border-radius: 8px;

    &:disabled {
      opacity: 0.5;
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
    border-radius: 8px;
  }
}
</style>
