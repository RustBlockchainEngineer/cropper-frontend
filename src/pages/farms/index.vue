<template>
  <div class="farm container">
    <img class="planet-left" src="@/assets/Green Planet 1.png" />

    <CreateFarmProgram
      v-if="!farmProgramCreated && wallet.connected"
      :isSuperOwner="wallet.address === superOwnerAddress"
      @onCreate="createFarmProgram"
    />
    <StakeModel
      v-if="stakeModalOpening"
      title="Supply & Stake LP"
      :loading="staking"
      :farmInfo="farmInfo"
      :labelizedPermission="labelizedPermission"
      @onOk="supplyAndStake"
      @onCancel="cancelStake"
    />
    <StakeErrorModal
      v-if="stakeLPError"
      @onRetry="onRetryStakeLP"
      @onRemove="onRemoveLiquidity"
      @onNothing="onNothing"
    />

    <CoinModal
      v-if="unstakeModalOpening"
      title="Unstake LP"
      :coin="lp"
      :loading="unstaking"
      @onOk="unstakeAndRemove"
      @onCancel="cancelUnstake"
      text="You will have to validate 2 operations, Unstake LP & Unstake Liquidity.
      If the pop up for the second operation does not appear, it may have popped up behind your browser. You can check this by minimizing your browser."
    />

    <CoinModal
      v-if="addRewardModalOpening"
      title="Add Reward"
      :coin="rewardCoin"
      :loading="adding"
      @onOk="addReward"
      @onCancel="cancelAddReward"
    />

    <CoinModal
      v-if="stakeModalOpeningLP"
      title="Stake LP"
      :coin="lp"
      :farmInfo="farmInfo"
      :loading="staking"
      @onOk="stake"
      @onCancel="cancelStakeLP"
    />

    <FarmMigration
      v-if="userMigrations.length > 0"
      title="Farm Migration"
      :migrationFarms="userMigrations"
      @onMigrate="migrateFarm"
      @onCancel="cancelStake"
    />

    <div class="card">
      <div class="card-body">
        <div class="update-note">
          <div class="update-title">
            <img src="@/assets/icons/info-icon.svg" />
            The Farms Are Being Improved
          </div>
          <div class="update-description">
            Smart Contracts V2 Update
          </div>
          <hr />
          <div class="update-content">
            We’re now updating from V1 to V2 of our smart contracts. Farms will be reopened as soon as the update is complete. We expect the update to be completed within 60 minutes. 
            <br /> We appreciate your patience.
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  Tooltip,
  // Progress,
  //Collapse,
  //Spin,
  Icon,
  Row,
  Col,
  Button,
  Radio,
  Input,
  Select,
  Switch as Toggle,
  Pagination
} from 'ant-design-vue'
import { get, cloneDeep, forIn } from 'lodash-es'
import { TokenAmount } from '@/utils/safe-math'
import { FarmInfo } from '@/utils/farms'
import { deposit, withdraw } from '@/utils/stake'
import { getUnixTs } from '@/utils'
import { getBigNumber } from '@/utils/layouts'
import { LiquidityPoolInfo, LIQUIDITY_POOLS } from '@/utils/pools'
import moment from 'moment'
import {
  FarmProgram,
  FarmProgramAccountLayout,
  FARM_PREFIX,
  PAY_FARM_FEE,
  REWARD_MULTIPLER,
  YieldFarm
} from '@/utils/farm'
import { PublicKey } from '@solana/web3.js'
import { DEVNET_MODE, FARM_PROGRAM_ID, FARM_INITIAL_SUPER_OWNER, FARM_VERSION } from '@/utils/ids'
import { TOKENS } from '@/utils/tokens'
import { addLiquidity, removeLiquidity } from '@/utils/liquidity'
import { loadAccount } from '@/utils/account'
import BigNumber from 'bignumber.js'
const CollapsePanel = Collapse.Panel

export default Vue.extend({
  components: {
    //Tooltip,
    //Toggle,
    //Input,
    // Progress,
    //Collapse,
    //CollapsePanel,
    //Spin,
    //Icon,
    //Row,
    //Col,
    //Button,
    //Select,
    //Pagination
  },

  //    ,
  //    RadioGroup,
  //    RadioButton

  data() {
    return {
      isMobile: false,

      farmProgramCreated: true,
      superOwnerAddress: FARM_INITIAL_SUPER_OWNER,
      displaynoticeupdate: false,
      farms: [] as any[],
      showFarms: [] as any[],
      searchName: '',
      displayfilters: false,
      lp: null,
      rewardCoin: null,
      farmInfo: null as any,
      harvesting: false,
      stakeModalOpening: false,
      stakeModalOpeningLP: false,
      addRewardModalOpening: false,
      staking: false,
      adding: false,
      paying: false,
      unstakeModalOpening: false,
      unstaking: false,
      poolType: true,
      endedFarmsPoolId: [] as string[],
      showCollapse: [] as any[],
      currentTimestamp: 0,
      tempInfo: null as any,
      stakeLPError: false,
      labelizedAmms: {} as any,
      labelizedAmmsExtended: {} as any,
      poolsDatas: {} as any,
      certifiedOptions: [
        { value: 0, label: 'Labelized' },
        { value: 1, label: 'Permissionless' },
        { value: 2, label: 'All' }
      ],
      lifeOptions: [
        { value: 0, label: 'Opened' },
        //  { value: 1, label: 'Future' },
        { value: 2, label: 'Ended' },
        { value: 3, label: 'All' }
      ],
      searchCertifiedFarm: 0,
      searchLifeFarm: 0,
      stakedOnly: false,
      totalCount: 110,
      pageSize: 50,
      currentPage: 1,
      labelizedPermission: false as any,
      sortAPRAsc: false as boolean,
      sortLiquidityAsc: true as boolean,
      sortMethod: 'liquidity' as string,

      userMigrations: [] as any[],
    }
  },

  head: {
    title: 'CropperFinance Farm'
  },

  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  watch: {
    'wallet.tokenAccounts': {
      handler(newTokenAccounts: any) {
        this.updateCurrentLp(newTokenAccounts)
      },
      deep: true
    },

    'farm.infos': {
      handler() {
        this.updateFarms()
      },
      deep: true
    },

    'farm.stakeAccounts': {
      handler() {
        this.updateFarms();
        this.checkFarmMigration();
      },
      deep: true
    },
    showCollapse: {
      handler() {
        if (!this.poolType && this.showCollapse.length > 0) {
          this.showCollapse.splice(0, this.showCollapse.length)
        }
      },
      deep: true
    },
    searchName: {
      handler(newSearchName: string) {
        this.filterFarms(newSearchName, this.searchCertifiedFarm, this.searchLifeFarm, this.stakedOnly)
      },
      deep: true
    },
    searchCertifiedFarm: {
      handler(newSearchCertifiedFarm: any) {
        this.filterFarms(this.searchName, newSearchCertifiedFarm, this.searchLifeFarm, this.stakedOnly)
      },
      deep: true
    },
    searchLifeFarm: {
      handler(newSearchLifeFarm: any) {
        this.filterFarms(this.searchName, this.searchCertifiedFarm, newSearchLifeFarm, this.stakedOnly)
      },
      deep: true
    },
    stakedOnly: {
      handler(newStakedOnly: any) {
        this.filterFarms(this.searchName, this.searchCertifiedFarm, this.searchLifeFarm, newStakedOnly)
      },
      deep: true
    },
    currentPage: {
      handler(newPage: number) {
        this.filterFarms(this.searchName, this.searchCertifiedFarm, this.searchLifeFarm, this.stakedOnly, newPage)
      },
      deep: true
    }
  },

  mounted() {
    this.$accessor.token.loadTokens()

    this.updateFarms()

    var hash = window.location.hash
    if (hash) {
      hash = hash.substring(1)
      this.searchName = hash
    } else {
      const query = new URLSearchParams(window.location.search)
      if (query.get('s')) this.searchName = query.get('s') as string
    }

    if (this.searchName) {
      this.searchCertifiedFarm = 2
      this.searchLifeFarm = 3
    }

    this.checkIfFarmProgramExist();

  },

  methods: {
    TokenAmount,
    async createFarmProgram() {
      const conn = this.$web3
      const wallet = (this as any).$wallet
      const txid = await FarmProgram.createDefaultProgramData(conn, wallet)
      console.log('create farm program account', txid)

      await this.delay(1500)
      this.checkIfFarmProgramExist()
    },
    async checkFarmMigration(){
      this.userMigrations = [];
      
      try {
        const migrations = await fetch('https://api.cropper.finance/migrate/').then((res) => res.json());
        //const migrations = {"2v6hXFDcekJ9x9PKaJKgzhHWoZJjPqFB9yaHoWUf5KUu":"EgZ3sGnwdiHNTeoqsDCRmKbibqBi4DfoenWwrNDnXo7U"}

        forIn(migrations, (newFarmId, oldFarmId, _object) => {
          
          let userInfoNew = get(this.farm.stakeAccounts, newFarmId)
          let userInfoOld = get(this.farm.stakeAccounts, oldFarmId)
          console.log("userInfoNew",userInfoNew)
          console.log("userInfoOld",userInfoOld)
          console.log("userInfoOld.depositBalance",userInfoOld.depositBalance.wei.toNumber())
          if(userInfoNew === undefined && userInfoOld != undefined && userInfoOld.depositBalance.wei.toNumber() > 0){
            this.userMigrations.push({oldFarmId, newFarmId ,depositBalance:userInfoOld.depositBalance.wei.toNumber() / Math.pow(10, userInfoOld.depositBalance.decimals)});
          }
        });
        
      } catch {
        // dummy data
        this.userMigrations = []
      } finally {
        console.log("this.userMigrations",this.userMigrations)
      }
    },
    migrateFarm(migrationFarm:any){
      const amount = migrationFarm.depositBalance;

      const oldFarm = get(this.farm.infos, migrationFarm.oldFarmId);
      const oldFarmInfo = cloneDeep(oldFarm)

      const newFarm = get(this.farm.infos, migrationFarm.newFarmId);
      const newFarmInfo = cloneDeep(newFarm)

      const conn = this.$web3
      const wallet = (this as any).$wallet
      const lp = oldFarm.lp

      const lpAccount = get(this.wallet.tokenAccounts, `${oldFarmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${oldFarmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${oldFarmInfo.poolId}.stakeAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      YieldFarm.migrate(conn, wallet, oldFarmInfo, newFarmInfo, lpAccount, rewardAccount, infoAccount, amount)
        .then(async (txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Migrate ${amount} ${lp.name}`
          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Migrate failed',
            description: error.message
          })
          this.$accessor.farm.requestInfos()
          this.$accessor.wallet.getTokenAccounts()
        })
        .finally(() => {})

    },
    async checkIfFarmProgramExist() {
      const conn = this.$web3
      const farmProgramId = new PublicKey(FARM_PROGRAM_ID)
      const seeds = [Buffer.from(FARM_PREFIX), farmProgramId.toBuffer()]
      const [programAccount] = await PublicKey.findProgramAddress(seeds, farmProgramId)
      try {
        const accountData = await loadAccount(conn, programAccount, farmProgramId)
        const farmData = FarmProgramAccountLayout.decode(accountData)
        this.farmProgramCreated = true
        this.superOwnerAddress = farmData.super_owner.toBase58()
      } catch {
        this.farmProgramCreated = false
      }
    },
    async updateLabelizedAmms() {
      this.labelizedAmms = {}
      this.labelizedAmmsExtended = {}
      let responseData
      try {
        responseData = await fetch('https://api.cropper.finance/farms/').then((res) => res.json())
      } catch {
        // dummy data
        responseData = []
      } finally {
        responseData.forEach((element: any) => {
          this.labelizedAmms[element.ammID] = element.labelized
          this.labelizedAmmsExtended[element.ammID] = element
        })
      }

      try {
        this.poolsDatas = await fetch('https://api.cropper.finance/pools/').then((res) => res.json())
      } catch {
        this.poolsDatas = []
      } finally {
        // nothing to do ..
      }
    },

    async updateFarms() {
      console.log('updating farms ...')
      await this.updateLabelizedAmms()
      this.currentTimestamp = moment().unix()

      const conn = this.$web3
      const wallet = (this as any).$accessor.wallet
      const liquidity = (this as any).$accessor.liquidity

      const farms: any = []
      const endedFarmsPoolId: string[] = []
      for (const [poolId, farmInfo] of Object.entries(this.farm.infos)) {
        let userInfo = get(this.farm.stakeAccounts, poolId)
        let isPFO = false

        // @ts-ignore
        const { reward_per_share_net, last_timestamp, end_timestamp, reward_per_timestamp_or_remained_reward_amount } = farmInfo.poolInfo

        // @ts-ignore
        const { reward, lp } = farmInfo

        const newFarmInfo: any = cloneDeep(farmInfo)

        if (end_timestamp.toNumber() < 1635452141) {
          continue
        }


        let partCoin = 0;
        let partPc = 0;

        if (reward && lp) {
          const rewardPerTimestamp = reward_per_timestamp_or_remained_reward_amount.toNumber() / (end_timestamp.toNumber() - last_timestamp.toNumber())
          const rewardPerTimestampAmount = new TokenAmount(rewardPerTimestamp, reward.decimals)
          const liquidityItem = get(this.liquidity.infos, lp.mintAddress)
          
          let newCoin = 0;
          let newPc = 0;

          if(!this.price.prices[liquidityItem?.coin.symbol as string] && this.price.prices[liquidityItem?.pc.symbol as string]){
            this.price.prices[liquidityItem?.coin.symbol as string] = this.price.prices[liquidityItem?.pc.symbol as string] * getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther()) / getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther());
            newCoin = 1;
          }

          if(!this.price.prices[liquidityItem?.pc.symbol as string] && this.price.prices[liquidityItem?.coin.symbol as string]){
            this.price.prices[liquidityItem?.pc.symbol as string] = this.price.prices[liquidityItem?.coin.symbol as string] * getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther()) / getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther());
            newPc = 1;
          }

          const rewardPerTimestampAmountTotalValue =
            getBigNumber(rewardPerTimestampAmount.toEther()) *
            60 *
            60 *
            24 *
            365 *
            this.price.prices[reward.symbol as string]

          const liquidityCoinValue =
            getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther()) *
            this.price.prices[liquidityItem?.coin.symbol as string]
          const liquidityPcValue =
            getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther()) *
            this.price.prices[liquidityItem?.pc.symbol as string]
          const liquidityTotalValue = liquidityPcValue + liquidityCoinValue

          const liquidityTotalSupply = getBigNumber((liquidityItem?.lp.totalSupply as TokenAmount).toEther())

          partCoin = (getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther()) / liquidityTotalSupply);
          partPc = (getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther()) / liquidityTotalSupply);

          const liquidityItemValue = liquidityTotalValue / liquidityTotalSupply
          let liquidityUsdValue = getBigNumber(lp.balance.toEther()) * liquidityItemValue
          newFarmInfo.lpUSDvalue = liquidityItemValue

          let farmUsdValue = getBigNumber(newFarmInfo.lp.balance.toEther()) * liquidityItemValue

          let baseCalculation = farmUsdValue;
          if(baseCalculation < 0.01){ baseCalculation = 1 }

          let apr = ((rewardPerTimestampAmountTotalValue / baseCalculation) * 100).toFixed(2)

          if (apr === 'NaN' || apr === 'Infinity') {
            apr = '0'
          }


          if (isNaN(liquidityUsdValue)) {
            liquidityUsdValue = 0
          }

          if(this.currentTimestamp < newFarmInfo.poolInfo.end_timestamp && (rewardPerTimestampAmountTotalValue * 86400 * 7) < 1 && liquidityUsdValue < 2 && !window.localStorage['owner_'+newFarmInfo.poolId]) { continue; }

          // @ts-ignore
          newFarmInfo.apr = apr

          newFarmInfo.apr_details = {
            apr: Math.round((apr as any) * 100) / 100,
            apy: 0
          } as any

          if (
            this.poolsDatas[liquidityItem.ammId] &&
            this.poolsDatas[liquidityItem.ammId]['fees'] &&
            liquidityTotalValue > 0
          ) {
            let apy = (this.poolsDatas[liquidityItem.ammId]['fees'] * 365 * 100) / liquidityTotalValue
            newFarmInfo.apr = Math.round(((apr as any) * 1 - (apy as any) * -1) * 100) / 100
            newFarmInfo.apr_details.apy = Math.round(apy * 100) / 100
          }

          if (wallet) {
            let unstaked = get(wallet.tokenAccounts, `${liquidityItem.lp.mintAddress}.balance`)
            //getBigNumber((liquidityItem?.lp.totalSupply as TokenAmount).toEther());
            if (unstaked) {
              newFarmInfo.currentLPtokens = getBigNumber((unstaked as TokenAmount).toEther())
            } else {
              newFarmInfo.currentLPtokens = 0
            }
          } else {
            newFarmInfo.currentLPtokens = 0
          }

          // @ts-ignore
          newFarmInfo.liquidityUsdValue = liquidityUsdValue

          if (rewardPerTimestampAmount.toEther().toString() === '0') {
            //endedFarmsPoolId.push(poolId)
          }

          if(newCoin){
            delete this.price.prices[liquidityItem?.coin.symbol as string];
          }

          if(newPc){
            delete this.price.prices[liquidityItem?.pc.symbol as string];
          }
        }
        if (userInfo && lp && FARM_VERSION === 1) {
          userInfo = cloneDeep(userInfo)

          const { rewardDebt, depositBalance } = userInfo
          let currentTimestamp = this.currentTimestamp

          if (currentTimestamp > end_timestamp.toNumber()) {
            currentTimestamp = end_timestamp.toNumber()
          }

          const duration = currentTimestamp - last_timestamp.toNumber()

          const rewardPerTimestamp = reward_per_timestamp_or_remained_reward_amount.toNumber()
          const liquidityItem = get(this.liquidity.infos, lp.mintAddress)
          const lpTotalSupply = (liquidityItem?.lp.totalSupply as TokenAmount).wei;
          const rewardPerShareCalc = new BigNumber(rewardPerTimestamp)
            .multipliedBy(duration)
            .multipliedBy(REWARD_MULTIPLER)
            .dividedBy(lpTotalSupply)
            .plus(getBigNumber(reward_per_share_net))

          let pendingReward = depositBalance.wei
            .multipliedBy(rewardPerShareCalc)
            .dividedBy(REWARD_MULTIPLER)
            .minus(rewardDebt.wei)

          userInfo.needRefresh = false;

          if(pendingReward.toNumber() > newFarmInfo.reward.balance.wei.toNumber()){
            pendingReward = newFarmInfo.reward.balance.wei;
            userInfo.needRefresh = true;
            this.displaynoticeupdate = true;
          }

          userInfo.depositFormat = (Math.round(userInfo.depositBalance.format() * 100000) / 100000
            )
              .toString()

          userInfo.depositCoin = (Math.round(partCoin * userInfo.depositBalance.format() * 10000) / 10000
            )
              .toString()

          userInfo.depositPc =  (Math.round(partPc * userInfo.depositBalance.format() * 10000) / 10000
            )
              .toString()



          if (newFarmInfo.lpUSDvalue) {
            userInfo.depositBalanceUSD = (
              Math.round(newFarmInfo.lpUSDvalue * userInfo.depositBalance.format() * 100) / 100
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }

          userInfo.pendingReward = new TokenAmount(pendingReward, newFarmInfo.reward.decimals)
        }
        else if (userInfo && lp && FARM_VERSION > 1) {
          userInfo = cloneDeep(userInfo)

          const { rewardDebt, depositBalance } = userInfo
          let currentTimestamp = this.currentTimestamp

          if (currentTimestamp > end_timestamp.toNumber()) {
            currentTimestamp = end_timestamp.toNumber()
          }

          const duration = currentTimestamp - last_timestamp.toNumber()

          const rewardPerTimestamp = reward_per_timestamp_or_remained_reward_amount.toNumber() / (end_timestamp.toNumber() - last_timestamp.toNumber())
          
          const rewardPerShareCalc = new BigNumber(rewardPerTimestamp)
            .multipliedBy(duration)
            .multipliedBy(REWARD_MULTIPLER)
            .dividedBy(newFarmInfo.lp.balance.wei)
            .plus(getBigNumber(reward_per_share_net))

          const JUMP_DEBT =new BigNumber(10000000000000000000);
          const _rewardDebt = rewardDebt.wei.minus(JUMP_DEBT);
          let pendingReward = depositBalance.wei
            .multipliedBy(rewardPerShareCalc)
            .dividedBy(REWARD_MULTIPLER)
            .minus(_rewardDebt)

          userInfo.needRefresh = false;

          if(pendingReward.toNumber() > newFarmInfo.reward.balance.wei.toNumber()){
            pendingReward = newFarmInfo.reward.balance.wei;
            userInfo.needRefresh = true;
            this.displaynoticeupdate = true;
          } 

          userInfo.depositFormat = (Math.round(userInfo.depositBalance.format() * 100000) / 100000
            )
              .toString()

          userInfo.depositCoin = (Math.round(partCoin * userInfo.depositBalance.format() * 10000) / 10000
            )
              .toString()

          userInfo.depositPc =  (Math.round(partPc * userInfo.depositBalance.format() * 10000) / 10000
            )
              .toString()



          if (newFarmInfo.lpUSDvalue) {
            userInfo.depositBalanceUSD = (
              Math.round(newFarmInfo.lpUSDvalue * userInfo.depositBalance.format() * 100) / 100
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }

          userInfo.pendingReward = new TokenAmount(pendingReward, newFarmInfo.reward.decimals)

          if(userInfo.pendingReward.isNaN()){
            userInfo.pendingReward = new TokenAmount(0, newFarmInfo.reward.decimals);
          }

        } else {
          userInfo = {
            // @ts-ignore
            depositBalance: new TokenAmount(0, farmInfo.lp.decimals),
            // @ts-ignore
            pendingReward: new TokenAmount(0, farmInfo.reward.decimals)
          }
        }

        if (
          (newFarmInfo as any).poolInfo.is_allowed > 0 ||
          (newFarmInfo as any).poolInfo.owner.toBase58() === this.wallet.address
        ) {
          let labelized = false
          if (lp) {
            //const liquidityItem = get(this.liquidity.infos, lp.mintAddress)

            if (this.labelizedAmms[newFarmInfo.poolId]) {
              if (this.labelizedAmmsExtended[newFarmInfo.poolId].farmhidden == true) {
                continue
              }

              if (this.labelizedAmmsExtended[newFarmInfo.poolId].labelized == true) {
                labelized = true
              }

              if (
                this.labelizedAmmsExtended[newFarmInfo.poolId].pfo == true &&
                newFarmInfo.poolId == this.labelizedAmmsExtended[newFarmInfo.poolId].pfarmID
              ) {
                isPFO = true
              }
            }
          }

          ;(newFarmInfo as any).twitterShare = `http://twitter.com/share?text=I am now farming ${
            (newFarmInfo as any).lp.coin.symbol
          }-${(newFarmInfo as any).lp.pc.symbol} on @CropperFinance with ${
            newFarmInfo.apr
          }%25 APR%0A%0ACome and join me at https://cropper.finance/farms/?s=${
            (newFarmInfo as any).poolId
          }%0A%0AFarm now, Harvest later.&url= `

          if (!isPFO || true) {
            farms.push({
              labelized,
              userInfo,
              farmInfo: newFarmInfo
            })
          }
        }
      }

      if (this.sortMethod == 'apr') {
        if (this.sortAPRAsc) {
          this.farms = farms.sort((a: any, b: any) => b.farmInfo.apr - a.farmInfo.apr)
        } else {
          this.farms = farms.sort((a: any, b: any) => a.farmInfo.apr - b.farmInfo.apr)
        }
      } else if(this.sortMethod == 'liquidity') {
        if (this.sortLiquidityAsc) {
          this.farms = farms.sort((a: any, b: any) => b.farmInfo.liquidityUsdValue - a.farmInfo.liquidityUsdValue)
        } else {
          this.farms = farms.sort((a: any, b: any) => a.farmInfo.liquidityUsdValue - b.farmInfo.liquidityUsdValue)
        }
      }
      
      this.endedFarmsPoolId = endedFarmsPoolId
      this.filterFarms(
        this.searchName,
        this.searchCertifiedFarm,
        this.searchLifeFarm,
        this.stakedOnly,
        this.currentPage
      )
    },
    filterFarms(
      searchName: string,
      searchCertifiedFarm: number,
      searchLifeFarm: number,
      stakedOnly: boolean,
      pageNum: number = 1
    ) {
      this.currentPage = pageNum
      this.showFarms = this.farms

      //filter for not allowed famrs
      this.showFarms = this.showFarms.filter(
        (farm: any) =>
          farm.farmInfo.poolInfo.is_allowed > 0 ||
          (farm.farmInfo.poolInfo.owner.toBase58() === this.wallet.address && farm.farmInfo.poolInfo.is_allowed === 0)
      )

      if (
        searchName != '' &&
        this.farms.filter(
          (farm: any) => (farm.farmInfo.poolId as string).toLowerCase() == (searchName as string).toLowerCase()
        ).length > 0
      ) {
        this.showFarms = this.farms.filter(
          (farm: any) => (farm.farmInfo.poolId as string).toLowerCase() == (searchName as string).toLowerCase()
        )
      } else if (searchName != '') {
        this.showFarms = this.farms.filter((farm: any) =>
          (farm.farmInfo.lp.symbol as string).toLowerCase().includes((searchName as string).toLowerCase())
        )
      }

      if (searchCertifiedFarm == 0) {
        //labelized
        this.showFarms = this.showFarms.filter((farm: any) => farm.labelized)
      } else if (searchCertifiedFarm == 1) {
        //permissionless
        this.showFarms = this.showFarms.filter((farm: any) => !farm.labelized)
      }

      const currentTimestamp = moment().unix()
      if (searchLifeFarm == 0) {
        //Opened
        this.showFarms = this.showFarms.filter(
          (farm: any) =>
            farm.farmInfo.poolInfo.start_timestamp < currentTimestamp &&
            farm.farmInfo.poolInfo.end_timestamp > currentTimestamp
        )
      } else if (searchLifeFarm == 1) {
        //Future
        this.showFarms = this.showFarms.filter((farm: any) => farm.farmInfo.poolInfo.start_timestamp > currentTimestamp)
      } else if (searchLifeFarm == 2) {
        //Ended
        this.showFarms = this.showFarms.filter((farm: any) => farm.farmInfo.poolInfo.end_timestamp < currentTimestamp)
      }

      if (stakedOnly) {
        this.showFarms = this.showFarms.filter((farm: any) => farm.userInfo.depositBalance.wei.toNumber() > 0)
      }

      if (this.sortLiquidityAsc) {
        this.showFarms = this.showFarms.sort((a: any, b:any) => b.farmInfo.liquidityUsdValue - a.farmInfo.liquidityUsdValue)
      }

      this.totalCount = this.showFarms.length

      let max = this.showFarms.length
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize < max ? this.currentPage * this.pageSize : max
      this.showFarms = this.showFarms.slice(start, end)
    },

    updateCurrentLp(newTokenAccounts: any) {
      if (this.lp) {
        const coin = cloneDeep(this.lp)
        // @ts-ignore
        const lpBalance = get(newTokenAccounts, `${this.lp.mintAddress}.balance`)
        // @ts-ignore
        coin.balance = lpBalance

        this.lp = coin
      }
    },

    openStakeModal(labelized: any, poolInfo: FarmInfo, lp: any) {
      /*
      const coin = cloneDeep(lp)
      const lpBalance = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
      coin.balance = lpBalance

      this.lp = coin
      */
      this.labelizedPermission = labelized
      this.farmInfo = cloneDeep(poolInfo)
      const coinBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.coin.mintAddress}.balance`)
      const pcBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.pc.mintAddress}.balance`)
      this.farmInfo.lp.coin.balance = coinBalance
      this.farmInfo.lp.pc.balance = pcBalance
      this.stakeModalOpening = true
    },

    openStakeModalLP(poolInfo: FarmInfo, lp: any) {
      const coin = cloneDeep(lp)
      const lpBalance = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
      coin.balance = lpBalance

      this.lp = coin
      this.farmInfo = cloneDeep(poolInfo)
      const coinBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.coin.mintAddress}.balance`)
      const pcBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.pc.mintAddress}.balance`)
      this.farmInfo.lp.coin.balance = coinBalance
      this.farmInfo.lp.pc.balance = pcBalance
      this.stakeModalOpeningLP = true
    },

    openAddRewardModal(farm: any) {
      const rewardCoin = farm.farmInfo.reward
      const coin = cloneDeep(rewardCoin)
      const rewardBalance = get(this.wallet.tokenAccounts, `${rewardCoin.mintAddress}.balance`)
      coin.balance = rewardBalance

      this.rewardCoin = coin
      this.farmInfo = cloneDeep(farm.farmInfo)
      this.addRewardModalOpening = true
    },
    async addReward(amount: string) {
      this.adding = true
      const conn = this.$web3
      const wallet = (this as any).$wallet
      const rewardAccountAddress = get(
        this.wallet.tokenAccounts,
        `${this.farmInfo.reward.mintAddress}.tokenAccountAddress`
      )

      let fetchedFarm = await YieldFarm.loadFarm(
        conn,
        new PublicKey(this.farmInfo.poolId),
        new PublicKey(FARM_PROGRAM_ID)
      )

      if (fetchedFarm) {
        //transfer reward amount
        let addRewardAmount: number = Number.parseFloat(amount)
        let userRwardTokenPubkey = new PublicKey(rewardAccountAddress)

        const key = getUnixTs().toString()
        this.$notify.info({
          key,
          message: 'Making transaction...',
          description: '',
          duration: 0
        })
        fetchedFarm
          .addReward(wallet, userRwardTokenPubkey, addRewardAmount * Math.pow(10, this.farmInfo.reward.decimals))
          .then((txid) => {
            this.$notify.info({
              key,
              message: 'Transaction has been sent',
              description: (h: any) =>
                h('div', [
                  'Confirmation is in progress.  Check your transaction on ',
                  h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
                ])
            })

            const description = `Add ${amount} ${this.farmInfo.reward.name}`
            this.$accessor.transaction.sub({ txid, description })
          })
          .catch((error) => {
            this.$notify.error({
              key,
              message: 'Adding Reward failed',
              description: error.message
            })

            this.$accessor.farm.requestInfos()
            this.$accessor.wallet.getTokenAccounts()
          })
          .finally(() => {
            this.adding = false
            this.addRewardModalOpening = false

            this.$accessor.farm.requestInfos()
            this.$accessor.wallet.getTokenAccounts()
          })
      }
    },
    async payFarmFee(farm: any) {
      this.paying = true
      const conn = this.$web3
      const wallet = (this as any).$wallet
      let key = 'USDC'
      const usdcCoin = TOKENS[key] // to test. real - USDC
      const usdcAccountAddress = get(this.wallet.tokenAccounts, `${usdcCoin.mintAddress}.tokenAccountAddress`)
      const usdcBalance = get(this.wallet.tokenAccounts, `${usdcCoin.mintAddress}.balance`)
      if (usdcAccountAddress === undefined || usdcAccountAddress === '') {
        this.$notify.error({
          key,
          message: 'Paying farm fee failed',
          description: 'Add USDC token in your wallet, please'
        })
        return
      }

      // check balance if wallet has enough fee
      if (usdcBalance < PAY_FARM_FEE) {
        this.$notify.error({
          key,
          message: 'Paying farm fee failed',
          description: 'Your USDC balance is low than farm fee'
        })
        return
      }

      let fetchedFarm = await YieldFarm.loadFarm(
        conn,
        new PublicKey(farm.farmInfo.poolId),
        new PublicKey(FARM_PROGRAM_ID)
      )

      if (fetchedFarm) {
        //pay farm fee
        let userUSDCTokenPubkey = new PublicKey(usdcAccountAddress)

        const key = getUnixTs().toString()
        this.$notify.info({
          key,
          message: 'Making transaction...',
          description: '',
          duration: 0
        })
        fetchedFarm
          .payFarmFee(wallet, userUSDCTokenPubkey, PAY_FARM_FEE * Math.pow(10, usdcCoin.decimals))
          .then((txid) => {
            this.$notify.info({
              key,
              message: 'Transaction has been sent',
              description: (h: any) =>
                h('div', [
                  'Confirmation is in progress.  Check your transaction on ',
                  h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
                ])
            })

            const description = `Pay ${PAY_FARM_FEE} ${usdcCoin.name}`
            this.$accessor.transaction.sub({ txid, description })
          })
          .catch((error) => {
            this.$notify.error({
              key,
              message: 'Paying farm fee failed',
              description: error.message
            })

            this.$accessor.farm.requestInfos()
            this.$accessor.wallet.getTokenAccounts()
          })
          .finally(() => {
            this.paying = false
            this.$accessor.farm.requestInfos()
            this.$accessor.wallet.getTokenAccounts()
          })
      }
    },

    stake(amount: number) {
      this.staking = true

      const conn = this.$web3
      const wallet = (this as any).$wallet

      const lpAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${this.farmInfo.poolId}.stakeAccountAddress`)

      const key = getUnixTs().toString()

      if (amount <= 0) {
        this.$notify.error({
          key,
          message: 'Add liquidity failed',
          description: 'Added LP token amount is 0'
        })
        console.log('added lp amount is 0')
        return
      }

      this.stakeLP(conn, wallet, this.farmInfo, lpAccount, rewardAccount, infoAccount, amount)

      this.staking = false
      this.stakeModalOpeningLP = false
    },
    supplyAndStake(fromCoinAmount: string, toCoinAmount: string, fixedCoin: string) {
      this.staking = true

      const conn = this.$web3
      const wallet = (this as any).$wallet

      const poolInfo = get(this.liquidity.infos, this.farmInfo.lp.mintAddress)

      const lpAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${this.farmInfo.poolId}.stakeAccountAddress`)
      // @ts-ignore
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.coin.mintAddress}.tokenAccountAddress`)
      // @ts-ignore
      const toCoinAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.pc.mintAddress}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      let txStatus = ''
      addLiquidity(
        conn,
        wallet,
        poolInfo,
        fromCoinAccount,
        toCoinAccount,
        lpAccount,
        this.farmInfo.lp.coin,
        this.farmInfo.lp.pc,
        fromCoinAmount,
        toCoinAmount,
        fixedCoin
      )
        .then(async (txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Add liquidity for ${fromCoinAmount} ${this.farmInfo.lp.coin?.symbol} and ${toCoinAmount} ${this.farmInfo.lp.pc?.symbol}`
          this.$accessor.transaction.sub({ txid, description })

          txStatus = this.$accessor.transaction.history[txid].status
          let totalDelayTime = 0
          while (txStatus === 'Pending' && totalDelayTime < 10000) {
            let delayTime = 500
            await this.delay(delayTime)
            totalDelayTime += delayTime
            txStatus = this.$accessor.transaction.history[txid].status
            await this.delay(delayTime)
            totalDelayTime += delayTime
          }
          if (txStatus === 'Fail') {
            console.log('add lp failed')
            return
          }
          //update wallet token account infos
          this.$accessor.wallet.getTokenAccounts()
          let delayForUpdate = 500
          await this.delay(delayForUpdate)

          let amount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.balance`)
          if (amount) {
            amount = amount.wei.toNumber() / Math.pow(10, amount.decimals)
          } else {
            amount = 0
          }

          totalDelayTime = 0
          while (amount <= 0 && totalDelayTime < 10000) {
            let dealyTime = 200
            await this.delay(dealyTime)
            totalDelayTime += dealyTime
            amount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.balance`)
            if (amount) {
              amount = amount.wei.toNumber() / Math.pow(10, amount.decimals)
            } else {
              amount = 0
            }
          }

          if (amount <= 0) {
            this.$notify.error({
              key,
              message: 'Add liquidity failed',
              description: 'Added LP token amount is 0'
            })
            console.log('added lp amount is 0')
            return
          }

          this.stakeLP(conn, wallet, this.farmInfo, lpAccount, rewardAccount, infoAccount, amount)
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Add liquidity failed',
            description: error.message
          })
          
        })
        .finally(async () => {})
    },
    async stakeLP(
      conn: any,
      wallet: any,
      farmInfo: any,
      lpAccount: any,
      rewardAccount: any,
      infoAccount: any,
      amount: number
    ) {
      const key = getUnixTs().toString()

      deposit(conn, wallet, farmInfo, lpAccount, rewardAccount, infoAccount, amount)
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Stake ${amount} ${this.farmInfo.lp.name}`
          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Stake failed',
            description: error.message
          })
          this.tempInfo = {
            conn: conn,
            wallet: wallet,
            farmInfo: farmInfo,
            lpAccount: lpAccount,
            rewardAccount: rewardAccount,
            infoAccount: infoAccount,
            amount: amount
          }
          this.stakeLPError = true
          this.$accessor.farm.requestInfos()
          this.$accessor.wallet.getTokenAccounts()
        })
        .finally(() => {
          this.staking = false
          this.stakeModalOpening = false
          this.farmInfo = null
          this.$accessor.farm.requestInfos()
          this.$accessor.wallet.getTokenAccounts()
        })
    },
    onRetryStakeLP() {
      this.stakeLPError = false
      if (!this.tempInfo) {
        return
      }

      this.stakeLP(
        this.tempInfo.conn,
        this.tempInfo.wallet,
        this.tempInfo.farmInfo,
        this.tempInfo.lpAccount,
        this.tempInfo.rewardAccount,
        this.tempInfo.infoAccount,
        this.tempInfo.amount
      )
      this.tempInfo = null
    },
    onRemoveLiquidity() {
      this.stakeLPError = false
      if (!this.tempInfo) {
        return
      }

      const fromCoinAccount = get(
        this.wallet.tokenAccounts,
        `${this.tempInfo.farmInfo.lp.coin.mintAddress}.tokenAccountAddress`
      )
      const toCoinAccount = get(
        this.wallet.tokenAccounts,
        `${this.tempInfo.farmInfo.lp.pc.mintAddress}.tokenAccountAddress`
      )
      this.removeLP(
        this.tempInfo.conn,
        this.tempInfo.wallet,
        this.tempInfo.farmInfo.lp,
        this.tempInfo.lpAccount,
        fromCoinAccount,
        toCoinAccount,
        this.tempInfo.amount
      )

      this.tempInfo = null
    },
    async delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    cancelStake() {
      this.lp = null
      this.farmInfo = null
      this.stakeModalOpening = false
    },
    cancelStakeLP() {
      this.lp = null
      this.farmInfo = null
      this.stakeModalOpeningLP = false
    },
    onNothing() {
      this.stakeLPError = false
      this.tempInfo = null
    },
    cancelAddReward() {
      this.rewardCoin = null
      this.farmInfo = null
      this.addRewardModalOpening = false
    },

    openUnstakeModal(poolInfo: FarmInfo, lp: any, lpBalance: any) {
      const coin = cloneDeep(lp)
      coin.balance = lpBalance

      this.lp = coin
      this.farmInfo = cloneDeep(poolInfo)
      this.unstakeModalOpening = true
    },

    unstakeAndRemove(amount: string) {
      this.unstaking = true

      const conn = this.$web3
      const wallet = (this as any).$wallet
      const coin = this.farmInfo.lp.coin
      const pc = this.farmInfo.lp.pc
      const lp = this.farmInfo.lp

      const lpAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${this.farmInfo.poolId}.stakeAccountAddress`)
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${coin.mintAddress}.tokenAccountAddress`)
      const toCoinAccount = get(this.wallet.tokenAccounts, `${pc.mintAddress}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      withdraw(conn, wallet, this.farmInfo, lpAccount, rewardAccount, infoAccount, amount)
        .then(async (txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Unstake ${amount} ${lp.name}`
          this.$accessor.transaction.sub({ txid, description })

          let txStatus = this.$accessor.transaction.history[txid].status
          while (txStatus === 'Pending') {
            await this.delay(500)
            txStatus = this.$accessor.transaction.history[txid].status
            await this.delay(500)
          }
          if (txStatus === 'Fail') {
            console.log('unstake transaction failed')
            this.unstaking = false
            this.unstakeModalOpening = false
            return
          }

          //update wallet token account infos
          this.$accessor.wallet.getTokenAccounts()
          let delayForUpdate = 1000
          await this.delay(delayForUpdate)

          let value = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
          value = value.wei.toNumber() / Math.pow(10, value.decimals)
          if (value <= 0) {
            console.log('remove lp amount is 0')
            this.unstaking = false
            this.unstakeModalOpening = false
            return
          }
          value = value.toString()

          this.removeLP(conn, wallet, lp, lpAccount, fromCoinAccount, toCoinAccount, value)
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Unstake failed',
            description: error.message
          })
          this.$accessor.farm.requestInfos()
          this.$accessor.wallet.getTokenAccounts()
        })
        .finally(() => {})
    },
    removeLP(conn: any, wallet: any, lp: any, lpAccount: any, fromCoinAccount: any, toCoinAccount: any, value: any) {
      const key = getUnixTs().toString()
      const poolInfo = get(this.liquidity.infos, lp.mintAddress)
      //remove whole lp amount
      removeLiquidity(conn, wallet, poolInfo, lpAccount, fromCoinAccount, toCoinAccount, value)
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Remove liquidity for ${value} ${lp.name}`

          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Remove liquidity failed',
            description: error.message
          })

          this.$accessor.farm.requestInfos()
          this.$accessor.wallet.getTokenAccounts()
        })
        .finally(() => {
          this.unstaking = false
          this.unstakeModalOpening = false
          this.$accessor.farm.requestInfos()
          this.$accessor.wallet.getTokenAccounts()
        })
    },

    cancelUnstake() {
      this.lp = null
      this.farmInfo = null
      this.unstakeModalOpening = false
    },
    getAmmId(farmInfo: FarmInfo) {
      //get liquidity pool info
      let liquidityPoolInfo: LiquidityPoolInfo = LIQUIDITY_POOLS.find(
        (item) => item.lp.mintAddress === farmInfo.lp.mintAddress
      ) as any

      //check liquidity pool
      if (liquidityPoolInfo == undefined) {
        console.log('find liquidity pool error')
        return ''
      }
      return liquidityPoolInfo.ammId
    },

    harvest(farmInfo: FarmInfo) {
      this.harvesting = true

      const conn = this.$web3
      const wallet = (this as any).$wallet

      const lpAccount = get(this.wallet.tokenAccounts, `${farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${farmInfo.poolId}.stakeAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      deposit(conn, wallet, farmInfo, lpAccount, rewardAccount, infoAccount, '0')
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Harvest ${farmInfo.reward.symbol} from ${farmInfo.lp.name}`
          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Harvest failed',
            description: error.message
          })

          this.$accessor.farm.requestInfos()
          this.$accessor.wallet.getTokenAccounts()
        })
        .finally(() => {
          this.$accessor.farm.requestInfos()
          this.harvesting = false
          this.$accessor.farm.requestInfos()
          this.$accessor.wallet.getTokenAccounts()
        })
    },
    getCountdownFromPeriod(period: number) {
      let remain = period
      let days = Math.floor(remain / (24 * 3600))
      remain = remain % (24 * 3600)
      let hours = Math.floor(remain / 3600)
      remain = remain % 3600
      let minutes = Math.floor(remain / 60)
      remain = remain % 60
      let seconds = remain

      return '' + days + 'd : ' + hours + 'h : ' + minutes + 'm'
    },
    sortByColumn(mode: string) {
      this.sortMethod = mode
      if (mode == 'apr') {
        if (this.sortAPRAsc) {
          this.sortAPRAsc = false;
        } else {
          this.sortAPRAsc = true;
        }
      } else if(mode == 'liquidity') {
        if (this.sortLiquidityAsc) {
          this.sortLiquidityAsc = false;
        } else {
          this.sortLiquidityAsc = true;
        }
      }
      this.updateFarms()
    },
  }
})
</script>

<style lang="less" scoped>
.card-body {
  padding: 0;
  margin: 0;

  .update-note {
    background: #272C61;
    border: 4px solid #273D94;
    border-radius: 14px;
    text-align: center;
    padding: 30px 15%;

    @media (max-width: @mobile-b-width) {
      padding: 20px 5%;
    }

    .update-title {
      font-weight: bold;
      font-size: 25px;
      letter-spacing: -0.05em;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        margin-right: 10px;
      }

      @media (max-width: @mobile-b-width) {
        font-size: 20px;

        img {
          margin-right: 5px;
        }
      }
    }

    .update-description {
      font-weight: 600;
      font-size: 20px;
      letter-spacing: -0.05em;

      @media (max-width: @mobile-b-width) {
        font-size: 15px;
      }
    }

    .update-content {
      font-size: 20px;
      letter-spacing: 0.025em;

      @media (max-width: @mobile-b-width) {
        font-size: 15px;
      }
    }

    hr {
      width: 150px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  }

  .update-note-pending {
    background: #272C61;
    border: 4px solid #273D94;
    border-radius: 14px;
    text-align: center;
    padding: 10px 10%;

    @media (max-width: @mobile-b-width) {
      padding: 10px 5%;
    }

    .update-title {
      font-weight: normal;
      font-size: 17px;
      letter-spacing: 0.025em;

      @media (max-width: @mobile-b-width) {
        font-size: 12px;
      }
    }
  }
}

.farm-button-group {
  position: relative;
  float: right;
  display: inline-flex;
  align-items: center;
}

.farm.container {
  max-width: 1350px;
  width: 100%;
  background: #000539;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;

  .planet-left {
    position: absolute;
    left: 0;
    top: 35%;
  }

  .page-head a {
    background: #000539;
    margin-left: 20px;
    float: right;
    .btncontainer {
      display: inline-block;
    }
  }

  .card {
    .card {
      margin-top: 70px;

      .card-body {
        padding: 0;
        overflow-x: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;

        .ant-collapse {
          border: 0;
          .ant-collapse-item {
            border-bottom: 0;
          }

          .ant-collapse-item:not(:last-child) {
            border-bottom: 1px solid #ffffff20;
          }
        }

        .start .btncontainer {
          display: inline-block;
        }
      }
    }
  }

  .harvest {
    text-align: center;
    max-width: 420px;
    min-height: 186px;
    display: grid;
    align-items: center;

    .reward {
      .token {
        font-weight: normal;
        font-size: 40px;
        line-height: 47px;
        margin-bottom: 10px;
      }

      .value {
        font-size: 12px;
      }
    }

    button {
      padding: 0 30px;
    }
  }

  .start {
    text-align: center;
    max-width: 420px;
    min-height: 186px;
    display: grid;
    align-items: center;

    .unstarted {
      width: 100%;

      .token {
        font-weight: normal;
        font-size: 40px;
        line-height: 47px;
        margin-bottom: 10px;
      }

      .value {
        font-size: 12px;
      }
    }

    .unstake {
      margin-right: 10px;
    }

    button {
      width: 100%;
    }
  }

  .harvest,
  .start {
    border: 4px solid #16164a;
    box-sizing: border-box;
    border-radius: 14px;
    padding: 16px;

    .title {
      font-weight: normal;
      font-size: 18px;
      line-height: 21px;
      color: #fff;
      opacity: 0.5;
      margin-bottom: 8px;
    }
  }

  .farm-head {
    display: flex;
    align-items: center;
    min-width: 768px;

    .lp-icons {
      .lp-icons-group {
        height: 51px;
        background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
        background-origin: border-box;
        border-radius: 8px;
        padding: 2px;
        width: 240px;

        .icons {
          height: 47px;
          background-color: #000539;
          border-radius: 8px;
          align-items: center;
          justify-content: center;

          @media (max-width: @mobile-b-width) {
            justify-content: flex-start;
          }
        }

        .icons span {
          margin-left: 12px;
          margin-right: 12px;
          font-weight: 400;
          font-size: 18px;
          line-height: 21px;
        }
      }

      .title {
        font-weight: normal;
        font-size: 18px;
        line-height: 21px;
        color: #fff;
        opacity: 0.5;
      }
    }

    .details {
      top: 50%;
      transform: translate(0, -50%);
      position: absolute;
      right: 17px;
      margin-top: unset;
    }

    .state {
      display: flex;
      text-align: left;
      flex-direction: row;

      .title {
        font-weight: normal;
        font-size: 18px;
        line-height: 21px;
        color: #ffffff50;
        display: flex;
      }

      .value {
        font-size: 18px;
        line-height: 21.19px;
        font-weight: 400;
        text-align: center;
      }

      .table-apr,
      .table-liquidity {
        cursor: pointer;

        i {
          color: white;
          margin-left: 10px;
          display: flex;
          align-items: center;
        }

        .sort-icon-active {
          color: #13ECAB;
        }
      }
    }
  }

  .farm-head.is-mobile {
    padding: 24px 16px !important;
  }

  .is-mobile {
    .harvest,
    .start {
      margin-top: 16px;
    }
  }

  p {
    margin-bottom: 0;
  }

  .pagination-container {
    text-align: center; 
    width: 100%;

    .pagination-body {
      width: 80%; 
      display: inline-block;
    }
  }
}
.radioButtonStyle {
  width: 50%;
  text-align: center;
}

.noDesktop {
  display: none !important;

  @media (max-width: @mobile-b-width) {
    display: block !important;
  }
}

@media (max-width: @mobile-b-width) {
  body .farm.container {
    min-width: unset;
    width: 100%;
    max-width: 100%;
    margin-top: 0;
    padding: 20px 20px !important;

    .details {
      float: right;
    }

    .detailButton {
      background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
      background-origin: border-box;
      display: inline-block;
      padding: 1px;
      border-radius: 63px;
      width: 45px;
      height: 45px;

      button {
        height: 100%;
        width: 100%;
        color: #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        background: #00033c;
        border-radius: 22px;
        border: transparent;
      }
    }

    .openButton {
      background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
      background-origin: border-box;
      display: inline-block;
      padding: 2px;
      border-radius: 23px;

      button {
        height: 42px;
        padding: 11px 24px;
        color: #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        background: #00033c;
        border-radius: 22px;
        border: transparent;

        img {
          margin-left: 5px;
          transform: rotate(0);
          transition: transform 0.3s;
        }
      }
    }

    .openButton-active > button > img {
      transform: rotate(180deg);
    }

    .bgl {
      background: #16164a !important;
      margin-top: -17px;
      padding-bottom: 10px;
      margin-bottom: -16px;
    }

    .buttonsd {
      display: block;
      background: #00033c;
      margin-top: 10px;
    }

    .noMobile {
      display: none;
    }

    .noDesktop {
      display: inline-block;
    }

    .labells {
      display: inline-flex;
    }

    .largeserach input {
      height: 47px !important;
    }

    .page-head {
      margin-bottom: 0;
      margin-top: 0;
      .title {
        font-size: 40px;
        position: relative;
        line-height: 50px;
      }
      .buttonsd {
        height: 87px;
        padding: 20px 20px 84px;
        border: 4px solid #16164a;
        box-sizing: border-box;
        border-radius: 14px;
        text-align: center;

        a {
          float: right;
          display: inline-block;
        }

        > div {
          float: left;
          margin-right: -66px;
          display: inline-block;
        }
      }
    }

    .fs-container {
      display: inline-block;
    }

    .ant-collapse,
    .ant-collapse > .ant-collapse-item {
      position: relative;
    }

    .ant-collapse::before,
    .ant-collapse > .ant-collapse-item::before {
      content: '';
      height: 4px;
      width: 100%;
      top: 0;
      background: #00033c;
      position: absolute;
    }

    .farm-head.table-head {
      display: none;
    }

    .labmobile {
      float: left;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 21px;
      color: #ffffff50;
      display: flex;
    }

    .farm-head {
      min-width: 100%;
      padding-top: 25px !important;
      padding-bottom: 25px !important;
      display: block;
      align-items: unset;
      .lp-icons {
        display: flex !important;
        align-items: center;
        justify-content: space-between;
        padding: 0 20% 0 10px;
        width: 100%;
        flex-direction: unset;
        float: unset;
        flex: unset;
        img {
          margin-top: -4px;
        }
        .lp-icons-group {
          background: transparent;
          .icons {
            padding: 0;
            background-color: transparent;
          }
        }
      }

      .state {
        text-align: right;
        display: none;
        margin-top: 11px;
        .ant-col-12 {
          width: 100%;
        }
      }

      .state.noDesktop {
        padding: 0 20% 0 10px;
        display: block !important;
        width: 100%;
        flex-direction: unset;
        float: unset;
        flex: unset;
        text-align: right;
        font-size: 18px;
        margin-bottom: 6px;

        .value {
          text-align: unset !important;
        }
      }
    }

    .collapse-row .lp-icons,
    .collapse-row .state {
      padding: 0 10px;
      display: block;
      width: 100%;
      flex-direction: unset;
      float: unset;
      flex: unset;
      text-align: right;
      font-size: 18px;
      margin-bottom: 6px;
      .lp-icons-group {
        background: transparent;
        .icons {
          padding: 0;
          background-color: transparent;
        }
      }
    }

    .ant-pagination {
      margin-top: 40px;
    }
    .ant-collapse.ant-collapse-icon-position-right {
      max-width: 100%;
      background: #16164a;
      border-radius: 14px;
    }

    .reward-col {
      margin-bottom: 30px;
    }

    .ant-collapse-content {
      background: #16164a !important;
    }

    .ant-collapse-content-box {
      background: #16164a !important;
      .collapse-row {
        display: block;
        align-items: unset;
        .ant-col.ant-col-4,
        .ant-col.ant-col-8 {
          width: 100%;
          display: block;
          flex-direction: unset;
          float: unset;
          flex: unset;
        }
      }
    }

    .start,
    .harvest {
      background: #000539;
      border-radius: 14px;
      margin: auto;
      .reward .token {
        font-size: 26px;
        line-height: 31px;
      }
    }

    .btncontainer {
      display: inline-block !important;
    }

    .start .btncontainer:not(.largebtn) {
      width: calc(50% - 20px);
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 10px;
    }

    .start .btncontainer:not(.largebtn):last-of-type {
      width: calc(100% - 30px);
      margin-left: 5px;
      margin-right: 5px;
    }

    .tool-bar {
      height: unset;
      border: unset;

      .tool-option {
        background: #00033c;
        width: 100%;
        height: 54px;
        display: block;
        position: relative;
        margin: 10px 0;
        border: 4px solid #16164a;
        box-sizing: border-box;
        border-radius: 10px;
        .input-search {
          height: 47px !important;
          .ant-input {
            padding: 19px 60px;
            border: none;
            height: 47px !important;
          }
        }

        .toggle {
          position: absolute;
          width: 100%;
          height: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: left;
          padding-left: 10%;

          .ant-switch {
            position: absolute;
            right: 10%;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
::-webkit-scrollbar {
  @media (max-width: @mobile-b-width) {
    display: none; /* Chrome Safari */
  }
}

.ant-tooltip-arrow {
  display: none;
}

.farm {
  .page-head {
    margin-top: 10px;
  }
  .page-head .title {
    position: absolute;
    left: 8px !important;
    transform: translate(0, 0) !important;
  }

  .farm-head {
    padding: 30px 5px !important;
  }

  .ant-collapse-header {
    padding: 0 !important;
    border-top: 1px solid #ffffff20;

    .farm-head {
      padding: 5px 5px !important;
    }

    .ant-collapse-arrow {
      z-index: 2;
      margin-right: 16px;
      margin-top: -1px;
    }
  }

  .ant-collapse-content {
    background-color: #000539;
    border-top: none !important;
  }
}

.ant-collapse {
  background-color: #000539;
}

.farm.container {
  .create {
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
    background-origin: border-box;
    border: 2px solid rgba(255, 255, 255, 0.14);
    border-radius: 8px;

    @media (max-width: @mobile-b-width) {
      padding: 8px 18px;
    }

    button {
      background: unset !important;
      color: #fff;
      border-color: transparent;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 42px;
      letter-spacing: -0.05em;
      height: 56px;
      width: 163px;

      @media (max-width: @mobile-b-width) {
        font-size: 14px;
        line-height: 24px;
        padding: 0;
        width: auto;
        height: 40px;
      }
    }
  }
  .ant-collapse,
  .ant-collapse > .ant-collapse-item {
    border: unset !important;
  }

  .btncontainer {
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%) !important;
    background-origin: border-box !important;
    display: inline-block;
    width: unset;
    text-align: center;
    position: relative;
    max-width: 400px;
    padding: 2px;
    margin: 0;
    border-radius: 8px !important;
    height: auto;
    max-height: 60px !important;

    button {
      background: transparent !important;
      position: relative;
      border-radius: 8px !important;
      border-color: transparent !important;
      height: 56px !important;
    }
  }

  .fs-container {
    justify-content: space-evenly;

    .btncontainer {
      .btn-bg-fill {
        background-color: #000539 !important;
      }
    }
  }
}

.ant-alert-warning {
  width: 500px;
  margin-top: 30px;
  background-color: transparent;
  border: 1px solid #85858d;

  .anticon-close {
    color: #fff;
  }
}

.count-down-group {
  background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
  background-origin: border-box;
  height: 60px;
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

.tool-bar {
  height: 100px;
  border-radius: 14px;
  border: 4px solid #16164a;
  width: 100%;

  .tool-option {
    width: 24%;
    height: 100%;
    display: inline-block;
    border-right: 3px solid #16164a;
    position: relative;

    .input-search {
      height: 100%;
      position: absolute;
      width: 100%;

      .ant-input-prefix {
        left: 10%;
        font-size: 20px;
        color: white;
      }

      .ant-input {
        padding: 0 10% 0 20%;
        height: 100% !important;
        border: none;
      }

      .ant-input::placeholder {
        color: white;
        opacity: 0.5;
      }
    }

    .ant-select-focused > .ant-select-selection > .ant-select-selection__rendered {
      opacity: 1 !important;
    }

    .ant-select {
      border: none;
      height: 100%;
      position: absolute;
      width: 100%;

      .ant-select-selection {
        height: 100%;
        width: 100%;
        display: inline-flex;
        align-items: center;
        padding-left: 10%;
        border: none;

        .ant-select-selection__rendered {
          margin-left: 0 !important;
          font-size: 16px;
          opacity: 0.5;
        }

        .ant-select-arrow {
          right: 10%;
          font-size: 13px;
        }
      }
    }

    .toggle {
      position: absolute;
      width: 100%;
      height: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      .label {
        font-size: 16px;
        opacity: 0.5;
      }

      .ant-switch {
        margin-left: 14px;
        background-color: white;
        height: 11px;
        border-radius: 30px;
      }

      .ant-switch::after {
        width: 28px;
        height: 28px;
        background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
        background-origin: border-box;
        top: -10px;
        left: -2px;
      }

      .ant-switch-checked::after {
        margin-left: 2px;
        left: 100%;
      }
    }
  }

  .last-option {
    border-right: none !important;
  }
}
.label.soon {
  background: #48a469;
  border-radius: 4px;
  right: 110px;
  font-size: 14px;
  font-weight: 400;
  padding: 5px;
  width: 53px;
}

.labmobile {
  display: none;
}

.label.ended {
  background: #ef745d;
  border-radius: 4px;
  right: 110px;
  font-size: 14px;
  font-weight: 400;
  padding: 5px;
  width: 53px;
}

.labelized {
  background: #724cee;
  border-radius: 6px;
  padding: 5px 9px;
  font-size: 14px;
  font-weight: 400;
  width: fit-content;
}

.permissionless {
  background: #ef745d;
  border-radius: 6px;
  padding: 5px 9px;
  font-size: 14px;
  font-weight: 400;
  width: fit-content;
  margin-right: 10px;
}

.reward-col {
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
}

.collapse-row {
  display: flex;
  align-items: center;
}

.info-icon {
  margin-left: 12px;
  display: flex;
  align-items: center;

  @media (max-width: @mobile-b-width) {
    margin-left: 5px;
  }
}

.planet-img-left {
  position: absolute;
  left: 0;
  top: 35%;
}

main {
  background-color: #000539;
  background-image: unset;
  background-size: cover;
  background-position: center bottom;
}

.ant-table-thead > tr > th.ant-table-column-sort {
  background: transparent;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  color: #fff;
  background: #1c274f;
  border: 1px solid #d9d9d9;
  box-shadow: none;
  border-left-width: 0;
}
.ant-radio-button-wrapper {
  color: #aaa;
  background: transparent;
  // border: 1px solid #d9d9d9;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
  border: 1px solid #d9d9d9;
  box-shadow: none;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
  border: 1px solid #d9d9d9;
}
</style>
