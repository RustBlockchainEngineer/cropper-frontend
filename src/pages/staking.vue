<template>
  <div class="staking container">
    <div class="staking-body">
      <h1>$CRP Staking</h1>
      <Row class="staking-infos-group">
        <Col span="24" class="staking-info">
          <div class="label">
            Estimated APY
            <img class="tooltip-icon" src="@/assets/icons/info-icon.svg" width="10px" />
          </div>
          <div class="value">
            11.1%
            <img src="@/assets/icons/calculator.svg" />
          </div>
        </Col>
        <Col span="24" class="staking-info">
          <div class="label">
            Total Staked
            <img class="tooltip-icon" src="@/assets/icons/info-icon.svg" width="10px" />
          </div>
          <div class="value">2,841,752</div>
        </Col>
        <Col span="24" class="staking-info">
          <div class="label">
            Total Value
            <img class="tooltip-icon" src="@/assets/icons/info-icon.svg" width="10px" />
          </div>
          <div class="value">$3,790,576.436</div>
        </Col>
      </Row>

      <Row class="staking-actions-group">
        <Col span="24" class="reward-pending">
          <div class="reward-value">
            <label class="box-title">Reward Pending</label>
            <label class="value">0</label>
          </div>
          <div class="btn-container">
            <Button class="btn-harvest" :disabled="!wallet.connected">Harvest</Button>
          </div>
        </Col>
        <Col span="24" class="crp-staked">
          <label class="box-title">CRP Staked</label>
          <div v-if="!wallet.connected" class="connect-wallet">
            <Button class="btn-fill">Connect Wallet</Button>
          </div>
        </Col>
      </Row>

      <Row class="staking-footer">
        <Col span="24" class="lock-tokens">
          <label class="label">Lock tokens for</label>
          <label class="value">0 day(s)</label>
        </Col>

        <Col span="24" class="get-crp">
          <label class="label">Get CRP</label>
          <img src="@/assets/icons/union.svg" />
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Row, Col, Button } from 'ant-design-vue'

export default Vue.extend({
  components: {
    Row,
    Col,
    Button
  },
  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  }
})
</script>

<style lang="less" scoped>
.staking.container {
  margin-top: 30px;

  .staking-body {
    max-width: 450px;
    min-height: 465px;
    margin: auto;
    background: @color-bg-dark;
    padding: 15px;
    border-radius: 5px;

    h1 {
      font-weight: bold;
      font-size: 25px;
      line-height: 31px;
    }

    .btn-container {
      background: @gradient-color-primary;
      padding: 2px;
      border-radius: 8px;

      .btn-harvest {
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
    }

    .btn-fill {
      background: @gradient-color-social;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      line-height: 14px;
      border: none;
      height: 42px;
    }

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
          cursor: pointer;
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
        align-items: center;
        justify-content: space-between;

        .reward-value {
          display: inline-grid;

          .value {
            font-weight: bold;
            font-size: 20px;
            line-height: 25px;
            color: #fff;
          }
        }

        .btn-container {
          height: 55px;
          width: 140px;
        }
      }

      .crp-staked {
        margin-top: 10px;

        .connect-wallet {
          width: 100%;
          display: flex;
          justify-content: center;

          .btn-fill {
            width: 50%;
          }
        }
      }
    }

    .tooltip-icon {
      width: 10px;
      position: absolute;
      margin-left: 5px;
      top: 3px;
    }
  }
}
</style>