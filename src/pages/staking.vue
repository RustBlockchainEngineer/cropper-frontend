<template>
  <div class="staking container">
    <BaseDetailModal :show="baseModalShow" @onClose="() => (baseModalShow = false)" @onSelect="onBaseDetailSelect" />
    <StakeModal :show="stakeModalShow" @onClose="() => (stakeModalShow = false)" />

    <div class="staking-body">
      <h1>$CRP Staking</h1>
      <Row class="staking-infos-group">
        <Col span="24" class="staking-info">
          <div class="label">
            Estimated APY
            <Tooltip placement="bottomLeft">
              <template slot="title">
                <div>Potential Annual Percentage Yield</div>
              </template>
              <div class="info-icon">
                <img class="tooltip-icon" src="@/assets/icons/info-icon.svg" />
              </div>
            </Tooltip>
          </div>
          <div class="value">
            {{ estimatedAPY }} %
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
          <div class="value">2,841,752</div>
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
            <Button class="btn-fill" :disabled="!wallet.connected">Harvest</Button>
          </div>
        </Col>
        <Col span="24" class="crp-staked" :class="!wallet.connected ? 'crp-staked-block' : 'crp-staked-flex'">
          <div class="staked-value">
            <label class="box-title">CRP Staked</label>
            <label v-if="wallet.connected" class="value">10,000.00</label>
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
              <Button class="btn-outline">Unstake</Button>
            </div>
          </div>

          <div v-if="!wallet.connected" class="connect-wallet">
            <Button class="btn-primary" @click="$accessor.wallet.openModal">Connect Wallet</Button>
          </div>
        </Col>
      </Row>

      <Row class="staking-footer">
        <Col span="24" class="lock-tokens">
          <label class="label">Lock tokens for</label>
          <label class="value">{{ lockDuration * 30 }} day(s)</label>
        </Col>

        <Col span="24" class="get-crp">
          <label class="label">Get CRP</label>
          <img class="clickable-icon" src="@/assets/icons/union.svg" />
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Row, Col, Button, Tooltip } from 'ant-design-vue'

export default Vue.extend({
  components: {
    Row,
    Col,
    Button,
    Tooltip
  },
  data() {
    return {
      baseModalShow: false as boolean,
      stakeModalShow: false as boolean,
      estimatedAPY: 0 as number,
      lockDuration: 0 as number
    }
  },
  computed: {
    ...mapState(['wallet'])
  },
  methods: {
    onBaseDetailSelect(lock_duration: number, estimated_apy: number) {
      this.baseModalShow = false
      this.estimatedAPY = estimated_apy
      this.lockDuration = lock_duration
    }
  }
})
</script>

<style lang="less" scoped>
.staking.container {
  margin-top: 30px;

  // global styles

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