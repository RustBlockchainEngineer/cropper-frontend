<template>
  <div class="swapWrapper">
    <img src="@/assets/icons/greenPlanet2.svg" class="planetMiddle" />
    <div class="swapHead">
      <h1>Staking Tier demo</h1>
    </div>
    <div class="container">
      <br>Master action
      <div>
        <Button ghost @click = "createStakingProgramState">Create global state</Button>
        <Button ghost @click = "getStakingProgramState" >Get global state</Button>
        <Button ghost @click = "supplyRewards" >Fund to program</Button>
      </div>
      <div>
        <Button ghost @click = "creteExtraRewardsAccount" >Create extra rewards</Button>
        <Button ghost @click = "setExtraRewardsAccount" >Set extra rewards</Button>
        <Button ghost @click = "getExtraRewardsAccount" >Get extra rewards</Button>

      </div>
      <br>Owner action
      <div>
        <Button ghost @click = "createStakingPool" >Create Staking Pool</Button>
        <Button ghost @click = "getPools" >Get Staking Pools</Button>
      </div>
      <br>
      <div>
        <Button ghost @click = "changeMultiplier" >Change Amount Multiplier</Button>
        <Button ghost @click = "changeStakingPoolPoint" >Change Pool Point</Button>
        <Button ghost @click = "changeTokenPS" >Change Token Per Second</Button>
      </div>
      <br> User action
      <div>
        <Button ghost @click = "createUserAccount" >Create User</Button>
        <Button ghost @click = "stakeToken" >Stake</Button>
        <Button ghost @click = "unstakeToken" >Unstake</Button>
        <Button ghost @click = "harvestReward" >Harvest</Button>
        <Button ghost @click = "getUserAccount" >Get user Account</Button>
      </div>

    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Icon, Tooltip, Button, Progress, Spin, Select, InputNumber } from 'ant-design-vue'
import { cloneDeep, get } from 'lodash-es'
import { getTokenBySymbol, TokenInfo, NATIVE_SOL, TOKENS } from '@/utils/tokens'
import { getMultipleAccounts, commitment } from '@/utils/web3'
import { PublicKey } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import { TokenAmount, gt } from '@/utils/safe-math'
import * as anchor from '@project-serum/anchor';
const { BN } = anchor


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

  createUser,
  stake,
  unstake,
  harvest,
} from '@/utils/crp-stake'



export default Vue.extend({
  components: {
    Button,
  },
  data() {
    return {
    }
  },
  head: {
    title: 'CropperFinance Swap'
  },
  computed: {
    ...mapState(['wallet', 'swap', 'liquidity', 'url', 'setting', 'token'])
  },
  watch: {
    'wallet.tokenAccounts': {
      handler(newTokenAccounts: any) {
        setAnchorProvider(this.$web3, this.$wallet)
      },
      deep: true
    },
  },
  mounted() {
    if(this.$wallet)
    {
      setAnchorProvider(this.$web3, this.$wallet)
    }
  },
  methods: {
    async createStakingProgramState(){
        createFarmState(
        this.$web3,
        this.$wallet,
        10,
        TOKENS['CRP'].mintAddress,
      )
    },
    async getStakingProgramState(){
      console.log(await getFarmState())
    },
    async supplyRewards(){
      const pools = await getAllPools()
      const current_pool = pools[0]
      console.log(current_pool)
      fundToProgram(
        this.$web3, 
        this.$wallet,
        current_pool.publicKey.toString(),
        get(this.wallet.tokenAccounts, `${TOKENS['CRP'].mintAddress}.tokenAccountAddress`),
        
        100 * 1000000,
        )
    },
    async creteExtraRewardsAccount(){
      createExtraReward(this.$web3, this.$wallet)
    },
    async setExtraRewardsAccount(){
      setExtraReward(this.$web3, this.$wallet, [
        { duration: new BN(0 * 60), extraPercentage: new BN(0) },
        { duration: new BN(10 * 60), extraPercentage: new BN(30) },
        { duration: new BN(30 * 60), extraPercentage: new BN(50) },
        { duration: new BN(60 * 60), extraPercentage: new BN(100) },
      ])
    },
    async getExtraRewardsAccount(){
      console.log(await getExtraRewardConfigs());
    },
    async createStakingPool(){
      const pools = await getAllPools()

      createPool(
        this.$web3, 
        this.$wallet,
        TOKENS['CRP'].mintAddress,
        pools
      )
    },
    async getPools(){
      const pools = await getAllPools()
      console.log(pools)
    },

    async changeMultiplier(){
      const pools = await getAllPools()
      pools.forEach(async (p: any) =>{
        await changePoolAmountMultipler(this.$web3, this.$wallet, p.publicKey.toString())
      })
    },
    async changeStakingPoolPoint(){
      const pools = await getAllPools()
      pools.forEach(async (p: any) =>{
        await changePoolPoint(this.$web3, this.$wallet, p.publicKey.toString())
      })
    },
    async changeTokenPS(){
      const pools = await getAllPools()
      console.log(pools)
      await changeTokenPerSecond(this.$web3, this.$wallet, pools)
    },
    async createUserAccount(){
      const pools = await getAllPools()
      const current_pool = pools[0]
      const poolSigner = current_pool.publicKey.toString()
      await createUser(this.$web3, this.$wallet, poolSigner)
    },    

    async stakeToken(){
      const pools = await getAllPools()
      const current_pool = pools[0]
      const poolSigner = current_pool.publicKey.toString()
      const rewardMint = current_pool.account.mint.toString()
      const rewardPoolVault = current_pool.account.vault.toString()
      const lock_duration = 10 * 60
      stake(
        this.$web3, 
        this.$wallet,

        poolSigner,
        rewardMint,
        rewardPoolVault,

        get(this.wallet.tokenAccounts, `${rewardMint}.tokenAccountAddress`),
        
        10 * 1000000,
        lock_duration
        )
    },

    async unstakeToken(){
      const pools = await getAllPools()
      const current_pool = pools[0]
      const poolSigner = current_pool.publicKey.toString()
      const rewardMint = current_pool.account.mint.toString()
      const rewardPoolVault = current_pool.account.vault.toString()
      
      unstake(
        this.$web3, 
        this.$wallet,
        poolSigner,
        rewardMint,
        rewardPoolVault,

        get(this.wallet.tokenAccounts, `${rewardMint}.tokenAccountAddress`),

        3 * 1000000,
        )
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
      
      harvest(
        this.$web3, 
        this.$wallet,
        
        poolSigner,
        rewardMint,
        get(this.wallet.tokenAccounts, `${rewardMint}.tokenAccountAddress`),
        programState.rewardVault,
      )
      }
    }
})
</script>

<style lang="less" sxcoped>
//sxcoped
.warning-style {
  font-weight: bold;
  color: #f0b90b;
}
.swap-btn.warning-style {
  font-weight: normal;
}
.error-style {
  font-weight: bold;
  color: #ed4b9e;
}
.swap-btn.error-style {
  font-weight: normal;
}
main {
  background-image: unset;
  background-color: #000539;
  background-size: cover;
  background-position: center bottom;
}
.planetMiddle {
  position: absolute;
  left: -150px;
  top: 446px;
  transform: rotate(90deg);
}
.btn-grad {
  background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
  background-origin: border-box;
  border: 2px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  height: 62px;
  margin-left: 20px;
  width: 170px;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 42px;
  letter-spacing: -0.05em;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    margin: 10px 5px;
  }
}
.swapHead {
  align-items: center;
  display: flex;
  margin-top: 10px;
  justify-content: space-between;

  @media (max-width: @mobile-b-width) {
    justify-content: center;
  }

  h1 {
    font-size: 64px;
    font-style: normal;
    font-weight: 700;
    line-height: 80px;
    letter-spacing: -0.05em;
    text-align: left;
    margin-bottom: 0;
  }

  .buttonGroup {
    display: flex;
    justify-content: space-between;
    position: relative;

    @media (max-width: @mobile-b-width) {
      top: -25px;
    }
  }
}
.count-down-group {
  background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
  background-origin: border-box;
  height: 62px;
  border-radius: 63px;
  position: relative;
  padding: 2px;
}
.count-down {
  background-color: #000539;
  border-radius: 63px;
  height: 100%;
  display: inline-flex;
  align-items: center;
  padding: 3px 3px 3px 20px;
  font-size: 26px;
  font-weight: 400;
  line-height: 42px;
  position: relative;

  .ant-progress {
    margin-left: 15px;
  }
  
  .reload-btn {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
    background-origin: border-box;
    margin-left: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .anticon {
      font-size: 16px !important;
      color: white !important;
    }
  }
}
.container {
  max-width: 662px; //550
  .card {
    background: rgba(236, 228, 228, 0.05);
    border-radius: 15px;
  }
  .price-info {
    display: grid;
    grid-auto-rows: auto;
    grid-row-gap: 8px;
    row-gap: 8px;
    padding: 0 12px;
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 6px;
    .swap-icon {
      margin-left: 10px;
      cursor: pointer;
    }
    .price-base {
      font-size: 12px;
      line-height: 15px;
      opacity: 0.5;
    }
    .fs-container {
      margin-top: 20px;
      .name {
        color: #fff;
        font-size: 18px;
        display: flex;
        align-items: center;
        label {
          opacity: 0.5;
        }
        .tooltipIcon {
          margin-left: 5px;
          width: 15px;
        }
      }
      .price-impact-orange {
        color: #ffb900 !important;
        label {
          opacity: 1 !important;
        }
      }
      .price-impact-red {
        color: #f00 !important;
        font-weight: bold !important;
        label {
          opacity: 1 !important;
        }
      }
      .swapThrough {
        text-transform: capitalize;
        border-radius: 5px;
        padding: 4px 8px;
        margin-left: 5px;
      }
      .green {
        background: #0caf7f;
        border: solid 2px #0caf7f;
      }
      .purple {
        background: #69039c;
        border: solid 2px #69039c;
      }
      .cyan {
        background: #4db1c4;
        border: solid 2px #4db1c4;
      }
    }
  }
  .btncontainer {
    background: none;
    display: inline;
    width: unset;
    text-align: center;
    position: relative;
    max-width: 400px;
    margin: 10px auto;
    padding: 2px;
    max-height: 50px;
    border-radius: 8px;

    button {
      background: linear-gradient(315deg, #21bdb8 0%, #280684 100%) !important;
      background-origin: border-box !important;
      border: 2px solid rgba(255, 255, 255, 0.14);
      position: relative;
      border-radius: 8px;
      border-color: transparent;
      color: white;
    }
  }
  .not-enough-sol-alert {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }
  .change-side {
    div {
      height: 32px;
      width: 32px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .fst {
    transform: rotate(90deg);
    margin: 10px;
  }
  .coin-budge {
    align-items: center;
    border: solid 1px #ffffff50;
    border-radius: 6px;
    display: flex;
    padding: 4px 8px;
    img {
      width: 13px;
      height: 13px;
      border-radius: 50%;
    }
    span {
      font-size: 14px;
      margin-left: 5px;
    }
  }
  .fetching-unsettled {
    margin: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #ffffffad;
    span {
      margin-top: 16px;
      text-align: center;
    }
  }
  .settle.card-body {
    padding: 16px 24px;
  }
  .extra {
    margin-top: 32px;
    margin-bottom: 32px;
    .settel-panel {
      .align-right {
        text-align: right;
      }
      th {
        font-weight: normal;
      }
      td {
        padding-bottom: 4px;
        width: 25%;
      }
      thead {
        font-size: 14px;
        tr:first-child {
          margin-top: 8px;
        }
      }
      tbody {
        tr:first-child {
          td {
            padding-top: 6px;
          }
        }
      }
    }
  }
}
.swapWrapper {
  max-width: 1350px;
  width: 100%;
  background: #000539;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;
  margin-left: auto;
  margin-right: auto;

  .ant-layout {
    background: #000 !important;
  }
  button.ant-btn-background-ghost[disabled] {
    background: #80819D !important;
    border: 2px solid rgba(255, 255, 255, 0.14);
  }
  .ant-menu-horizontal > .ant-menu-item:hover,
  .ant-menu-horizontal > .ant-menu-submenu:hover,
  .ant-menu-horizontal > .ant-menu-item-active,
  .ant-menu-horizontal > .ant-menu-submenu-active,
  .ant-menu-horizontal > .ant-menu-item-open,
  .ant-menu-horizontal > .ant-menu-submenu-open,
  .ant-menu-horizontal > .ant-menu-item-selected,
  .ant-menu-horizontal > .ant-menu-submenu-selected {
    border-bottom: none !important;
  }
  .page-head {
    .title {
      font-weight: 600;
      font-size: 24px;
      line-height: 32px;
      text-align: center;
      display: inline-block;
      vertical-align: middle;
      padding-right: 10px;
      z-index: 2;
      padding-left: 15px;
      position: relative;
    }
    .buttons {
      &:hover {
        background: #1b2028;
      }
    }
  }
  .card {
    border: 1px solid #4d4d4d;
    .card-body {
      row-gap: 5px;
      width: 600px !important;
      background: none;
      > .fs-container {
        text-align: center;
      }
    }
  }
  .lp-icons {
    .icons {
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .ant-menu-horizontal,
  .ant-layout-header,
  .ant-layout-footer {
    background: #000539 !important;
  }
  .ant-layout-content {
    background: #000539 !important;
  }
}
.ant-tooltip-inner {
  background: linear-gradient(315deg, #21BDB8 0%, #280684 100%) !important;
  background-origin: border-box !important;
  border: 2px solid rgba(255, 255, 255, 0.14);
  box-shadow: 18px 11px 14px rgb(0 0 0 / 25%);
  border-radius: 8px;
  display: inline-block;
  width: auto;
  color: #ffffff50 !important;

  .swap-info {
    .tooltip-input {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      width: 240px;
      outline: none;
      border-radius: 6px;
      font-size: 16px;
      padding: 10px 13px;
      line-height: 20px;
    }

    .info {
      border-radius: 6px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14);
      padding: 8px;
      margin-top: 10px;
      
      .symbol {
        font-size: 13px;
        line-height: 16px;
        font-weight: 700;
        opacity: 1;
        color: white;
      }

      .address {
        font-size: 13px;
        background: transparent;
        opacity: 1;
        color: white;
      }

      .action img {
        width: 15px;
        height: 15px;
        cursor: pointer;
      }
    }

    .info:nth-child(1) {
      margin-top: 0 !important
    }
  }
}
.ant-tooltip-arrow {
  display: none;
  // top: -8px !important;
  // width: 20px;
  // height: 20px;
}
// .ant-tooltip-arrow::before {
//   background-color: #271789 !important;
//   border-top: 2px solid rgba(255, 255, 255, 0.14);
//   border-left: 2px solid rgba(255, 255, 255, 0.14);
//   width: 10px;
//   height: 10px;
// }
// ******* Mobile *******
@media (max-width: @mobile-b-width) {
  .swapWrapper {
    margin: auto;
    padding: 0;
    width: 375px;
    .planetMiddle {
      display: none;
    }
    .swapHead {
      margin: 40px 22px -25px 22px;
      h1 {
        display: none;
      }
      .buttonGroup {
        .count-down-group {
          height: 40px;

          .count-down {
            font-size: 18px;
            line-height: 28px;

            .reload-btn {
              height: 30px;
              width: 30px;
            }
          }
        }
        .btn-grad {
          height: 40px;
          margin-left: 5px;
          width: 120px;
          font-size: 11px;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          img {
            margin: auto 0;
            width: 15px;
          }
        }
      }
    }
    .container {
      min-width: auto;
      padding: 22px !important;
      .card {
        border: 1px solid #4d4d4d;
        .card-body {
          padding: 20px 5px;
          width: auto !important;
          .price-info {
            font-size: 12px !important;
            .fs-container .name {
              font-size: 14px !important;
              .tooltipIcon {
                width: 12px;
              }
            }
            .coin-budge {
              img {
                width: 15px;
              }
            }
            .flexDiv {
              display: block;
              border-bottom: 1px solid #4d4d4d;
            }

            .pathway {
              span:nth-of-type(2) {
                justify-content: center;
              }
            }

            .pathway,
            .swapping {
              padding-bottom: 15px;

              .name {
                margin-bottom: 10px;
              }
            }

            .slippage,
            .minimum {
              padding-bottom: 20px;
              justify-content: space-between;
              display: flex;
            }
          }
          .coin-select {
            .label {
              font-size: 14px;
            }
            .coin-input {
              .select-button {
                font-size: 12px;
                width: 120px;
              }
              .input-button {
                height: 25px;
                width: 40px;
                margin: 4px;
                button {
                  font-size: 12px;
                }
              }
              .main-input {
                height: 40px;
              }
            }
            input {
              font-size: 14px;
            }
          }
        }
      }
      .btncontainer {
        margin: 20px auto;
        .ant-btn-lg {
          font-size: 14px;
        }
      }
    }
  }
  .ant-notification {
    top: 100px !important;
    margin-left: 18px !important;
    height: 0;
    .ant-notification-notice {
      // background: #222262 !important;
      background: #FFFFFF10;
      border-radius: 14px;
    }
  }
  .ant-tooltip-placement-bottomLeft {
    .ant-tooltip-arrow {
      display: none;
    }
  }

  .ant-modal {
    max-width: 350px;

    .ant-modal-header {
      padding: 16px 12px;
    }
    .ant-modal-body {
      padding: 12px;
    }
  }
  .select-token .token-list .token-info {
    border-radius: 10px;
    padding: 5px 10px !important;
    margin: 5px 0;
    background: rgba(255, 255, 255, 0.1) !important;
  }
}
// @media (max-width: 920px) {
//   .swapWrapper {
//     padding: 50px;
//     margin: 0 auto;
//   }
// }
</style>