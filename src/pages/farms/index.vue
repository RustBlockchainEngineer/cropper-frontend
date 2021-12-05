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
      :suppling="suppling"
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
      text="You will have to validate 2 operations, Unstake LP & Unstake Liquidity.<br />
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
      text="<div style='text-align:center'>You now need to <b>stake your LP tokens</b> to start farming</div>"
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
        <div class="page-head fs-container">
          <span class="title">
            Farms
            <NuxtLink to="/farms/create-farm/" class="create-btn-desktop">
              <div class="create-plus-btn">+ Create farm</div>
            </NuxtLink>

            <NuxtLink to="/farms/create-farm/" class="create-btn-mobile">
              <div class="create-plus-btn">+</div>
            </NuxtLink>
          </span>

          <span class="information">
            <div class="my-info">
              <p>
                TVL : <b>{{ TVL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} $</b>
              </p>
              <!-- <p>Your deposit: <b>28,009 $</b></p> -->
            </div>

            <!-- {{ farm.autoRefreshTime - farm.countdown }} -->
            <div class="reload-btn" :class="activeSpinning ? 'active' : ''" @click="reloadTimer">
              <img src="@/assets/icons/loading.svg" />
            </div>
          </span>
        </div>

        <div class="page-content">
          <!-- Filter bar for desktop -->
          <Row class="tool-bar noMobile">
            <Col span="5" class="tool-option">
              <Input v-model="searchName" size="large" class="input-search" placeholder="Search by name">
                <Icon slot="prefix" type="search" />
              </Input>
            </Col>
            <Col span="6" class="tool-option">
              <div class="toggle">
                <label
                  class="label"
                  :class="!searchCertifiedFarm ? 'active-label' : ''"
                  @click="activeSearch('labelized')">
                  Labelized
                  <Tooltip placement="bottom">
                    <template slot="title">
                      <div>
                        <div class="tooltip-text">
                          <b>Labelized:</b> Cropper labelized this farm after running due diligence on its team and project.
                        </div>
                      </div>
                    </template>
                    <div class="info-icon labelized">
                      <img src="@/assets/icons/info-icon.svg" width="12" height="12" />
                    </div>
                  </Tooltip>
                </label>
                <Toggle v-model="searchCertifiedFarm" />
                <label
                  class="label"
                  :class="searchCertifiedFarm ? 'active-label' : ''"
                  @click="activeSearch('permissionless')"
                  >Permissionless
                  <Tooltip placement="bottom">
                    <template slot="title">
                      <div>
                        <div class="tooltip-text">
                          <b>Permissionless:</b> This project created its farm without any review from the Cropper Team.
                        </div>
                      </div>
                    </template>
                    <div class="info-icon">
                      <img src="@/assets/icons/info-icon.svg" width="12" height="12" />
                    </div>
                  </Tooltip>
                </label>
              </div>
            </Col>
            <Col span="5" class="tool-option">
              <div class="toggle">
                <label class="label" :class="!searchLifeFarm ? 'active-label' : ''" @click="activeSearch('open')"
                  >Open</label
                >
                <Toggle v-model="searchLifeFarm" />
                <label class="label" :class="searchLifeFarm ? 'active-label' : ''" @click="activeSearch('ended')"
                  >Ended</label
                >
              </div>
            </Col>
            <Col span="4" class="tool-option">
              <div class="toggle deposit-toggle">
                <Toggle v-model="stakedOnly" :disabled="!wallet.connected" />
                <label class="label" :class="stakedOnly ? 'active-label' : ''" @click="activeSearch('deposit')">
                  My deposit
                </label>
              </div>
            </Col>
            <Col span="4" class="tool-option">
              <div class="sort-by">
                <label class="label">Sort by:</label>
                <label
                  class="label active-label"
                  @click="
                    () => {
                      this.showSortOption = !this.showSortOption
                    }
                  "
                >
                  {{ this.sortMethod === 'liquidity' ? 'Liquidity' : 'APR %' }} ({{ !this.sortAsc ? 'asc' : 'dsc' }})
                </label>
                <img
                  :class="showSortOption ? 'collapse-down' : 'collapse-up'"
                  src="@/assets/icons/collapse-arrow.svg"
                  @click="
                    () => {
                      this.showSortOption = !this.showSortOption
                    }
                  "
                />
              </div>
              <div v-if="showSortOption" class="sort-options">
                <div class="option" @click="setSortOption('liquidity', true)">Liquidity (dsc)</div>
                <div class="option" @click="setSortOption('liquidity', false)">Liquidity (asc)</div>
                <div class="option" @click="setSortOption('apr', false)">APR % (asc)</div>
                <div class="option" @click="setSortOption('apr', true)">APR % (dsc)</div>
              </div>
            </Col>
          </Row>

          <!-- Filter bar for mobile -->

          <Row class="tool-bar noDesktop">
            <Col span="12" class="tool-option">
              <Input v-model="searchName" size="large" class="input-search" placeholder="Search by name">
                <Icon slot="prefix" type="search" />
              </Input>
            </Col>
            <Col span="12" class="tool-option">
              <div class="toggle deposit-toggle">
                <Toggle v-model="stakedOnly" :disabled="!wallet.connected"/>
                <label class="label" :class="stakedOnly ? 'active-label' : ''" @click="activeSearch('deposit')">Deposited</label>
              </div>
            </Col>
          </Row>
          <Row class="tool-bar noDesktop">
            <Col span="24" class="tool-option">
              <div class="toggle">
                <label
                  class="label"
                  :class="!searchCertifiedFarm ? 'active-label' : ''"
                  @click="activeSearch('labelized')">
                  Labelized
                  <Tooltip placement="bottom">
                    <template slot="title">
                      <div>
                        <div class="tooltip-text">
                          <b>Labelized:</b> Cropper labelized this farm after running due diligence on its team and project.
                        </div>
                      </div>
                    </template>
                    <div class="info-icon labelized">
                      <img src="@/assets/icons/info-icon.svg" width="12" height="12" />
                    </div>
                  </Tooltip>
                </label>
                <Toggle v-model="searchCertifiedFarm" />
                <label
                  class="label"
                  :class="searchCertifiedFarm ? 'active-label' : ''"
                  @click="activeSearch('permissionless')"
                  >Permissionless
                  <Tooltip placement="bottom">
                    <template slot="title">
                      <div>
                        <div class="tooltip-text">
                          <b>Permissionless:</b> This project created its farm without any review from the Cropper Team.
                        </div>
                      </div>
                    </template>
                    <div class="info-icon">
                      <img src="@/assets/icons/info-icon.svg" width="12" height="12" />
                    </div>
                  </Tooltip>
                </label>
              </div>
            </Col>

          </Row>
          <Row class="tool-bar noDesktop">

            <Col span="24" class="tool-option">
              <div class="toggle">
                <label class="label" :class="!searchLifeFarm ? 'active-label' : ''" @click="activeSearch('open')"
                  >Open</label
                >
                <Toggle v-model="searchLifeFarm" />
                <label class="label" :class="searchLifeFarm ? 'active-label' : ''" @click="activeSearch('ended')"
                  >Ended</label
                >
              </div>
            </Col>

          </Row>
          <Row class="tool-bar noDesktop">
            <Col span="24" class="tool-option">
              <div class="sort-by">
                <label class="label">Sort by:</label>
                <label
                  class="label active-label"
                  @click="
                    () => {
                      this.showSortOption = !this.showSortOption
                    }
                  "
                >
                  {{ this.sortMethod === 'liquidity' ? 'Liquidity' : 'APR %' }} ({{ !this.sortAsc ? 'asc' : 'dsc' }})
                </label>
                <img
                  :class="showSortOption ? 'collapse-down' : 'collapse-up'"
                  src="@/assets/icons/collapse-arrow.svg"
                  @click="
                    () => {
                      this.showSortOption = !this.showSortOption
                    }
                  "
                />
              </div>
              <div v-if="showSortOption" class="sort-options">
                <div class="option" @click="setSortOption('liquidity', true)">Liquidity (dsc)</div>
                <div class="option" @click="setSortOption('liquidity', false)">Liquidity (asc)</div>
                <div class="option" @click="setSortOption('apr', false)">APR % (asc)</div>
                <div class="option" @click="setSortOption('apr', true)">APR % (dsc)</div>
              </div>
            </Col>
          </Row>

          <!-- Pre list -->

          <div class="farm-shortcut">
            <button
              class="farm-prelist"
              v-for="list in preList"
              :key="list.symbol"
              @click="searchByShortcut(list.symbol)"
            >
              <CoinIcon v-if="list.mintAddress != ''" :mint-address="list.mintAddress" />
              {{ list.symbol }}
            </button>
          </div>
        </div>
        <div v-if="farm.initialized" class="page-content">
          <div class="farm-table">
            <!-- Farm table for desktop -->
            <Row
              class="farm-item noMobile"
              :class="farm.labelized ? 'labelized' : 'permissionless'"
              v-for="farm in showFarms"
              :key="farm.farmInfo.poolId"
            >
              <Col class="lp-icons" span="7">
                <div class="lp-farm">
                  <div class="lp-icons-group">
                    <div class="icons">
                      <CoinIcon :mint-address="farm.farmInfo.lp.coin.mintAddress" />
                      <span>{{ farm.farmInfo.lp.coin.symbol }} - </span>
                      <CoinIcon :mint-address="farm.farmInfo.lp.pc.mintAddress" />
                      <span>{{ farm.farmInfo.lp.pc.symbol }}</span>
                    </div>
                  </div>
                  <div class="social-icons-group">
                    <a :href="farm.farmInfo.twitterShare" target="_blank" class="social-icon">
                      <img src="@/assets/icons/share-icon.svg" />
                    </a>
                    <a
                      v-if="farm.farmInfo.twitterLink"
                      :href="farm.farmInfo.twitterLink"
                      target="_blank"
                      class="social-icon"
                    >
                      <img src="@/assets/icons/twitter-icon.svg" />
                    </a>
                  </div>
                </div>

                <div class="farm-labels">
                  <div v-if="farm.labelized" class="label labelized">Labelized</div>
                  <div v-else class="label permissionless">Permissionless</div>

                  <div v-if="currentTimestamp > farm.farmInfo.poolInfo.end_timestamp" class="label ended">Ended</div>
                  <div
                    v-if="currentTimestamp < farm.farmInfo.poolInfo.start_timestamp * 1 + 86400 * 7"
                    class="label new"
                  >
                    New
                  </div>
                </div>

                <div class="farm-infos">
                  <div class="farm-info-group">
                    <div class="farm-info-img">
                      <img src="@/assets/icons/time-icon.svg" />
                    </div>
                    from
                    {{ new Date(farm.farmInfo.poolInfo.start_timestamp * 1e3).toLocaleDateString('en-US') }}
                    to
                    {{ new Date(farm.farmInfo.poolInfo.end_timestamp * 1e3).toLocaleDateString('en-US') }}
                  </div>
                  <!--
                  <div>
                    <div class="farm-info-group">
                      <div class="farm-info-img">
                        <img src="@/assets/icons/reward-icon.svg" />
                      </div>
                      Remaining rewards
                      {{
                        Math.round(
                          new TokenAmount(farm.farmInfo.reward.balance.wei, farm.farmInfo.reward.decimals).toEther() *
                            1000
                        ) / 1000
                      }}
                      {{ farm.farmInfo.lp.coin.symbol }}
                    </div>
                  </div>
                  -->
                </div>
              </Col>

              <Col class="state" span="3">
                <div class="title">Total Deposited</div>
                <div
                  v-if="
                    farm.farmInfo.poolInfo.start_timestamp > currentTimestamp ||
                    currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                  "
                  class="value"
                >
                  -
                </div>
                <div v-else class="value">
                  {{
                    Math.round(farm.farmInfo.liquidityUsdValue)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }}$
                </div>
              </Col>

              <Col class="state" span="4">
                <div class="title">
                  Total APR
                  <Tooltip
                    placement="bottomLeft"
                    v-if="
                      !(
                        farm.farmInfo.poolInfo.start_timestamp > currentTimestamp ||
                        currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                      )
                    "
                  >
                    <template slot="title">
                      <div>
                        <div class="tooltip-line">
                          Fees <span>{{ farm.farmInfo.apr_details.apy }}%</span>
                        </div>
                        <hr />
                        <div class="tooltip-line">
                          Rewards <span>{{ farm.farmInfo.apr_details.apr }}%</span>
                        </div>
                      </div>
                    </template>
                    <div class="info-icon">
                      <img src="@/assets/icons/info-icon.svg" width="16" height="16" />
                    </div>
                  </Tooltip>
                </div>
                <div
                  v-if="
                    farm.farmInfo.poolInfo.start_timestamp > currentTimestamp ||
                    currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                  "
                  class="value"
                >
                  -
                </div>
                <div v-else class="value">
                  {{ Math.round(farm.farmInfo.apr * 100 ) / 100 }}%
                  <img v-if="farm.farmInfo.apr > 300" src="@/assets/icons/fire-icon.svg" />
                  <img v-if="farm.farmInfo.apr > 1000" src="@/assets/icons/fire-icon.svg" />
                </div>
              </Col>

              <Col class="state" span="3">
                <div class="title">Pending Rewards</div>
                <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="value">-</div>
                <div v-else class="value">
                  {{ ((
                    !wallet.connected || 
                    (Math.round(farm.userInfo.pendingReward.format().replace(/,/g, '') * 100000) / 100000) &lt; 0 
                    ) ? 0 : (Math.round(farm.userInfo.pendingReward.format().replace(/,/g, '') * 100000) / 100000)) }}
                </div>

                <div class="btn-container btn-container-harvest">
                  <Button
                    v-if="farm.farmInfo.poolInfo.end_timestamp < currentTimestamp"
                    :disabled="!wallet.connected || farm.userInfo.depositBalance.isNullOrZero()"
                    size="large"
                    ghost
                    @click.stop="openUnstakeModal(farm.farmInfo, farm.farmInfo.lp, farm.userInfo.depositBalance)"
                  >
                    Harvest & Withdraw
                  </Button>

                  <Button
                    v-else
                    size="large"
                    ghost
                    :disabled="!wallet.connected || harvesting || farm.userInfo.pendingReward.isNullOrZero()"
                    :loading="harvesting"
                    @click="harvest(farm.farmInfo)"
                  >
                    Harvest
                  </Button>
                </div>
              </Col>

              <Col class="state" span="4">
                <div class="title">
                  Value Deposited
                  <Tooltip
                    placement="bottomLeft"
                    v-if="
                      !(farm.farmInfo.poolInfo.start_timestamp > currentTimestamp) && farm.userInfo.depositBalance.format() > 0
                    "
                  >
                    <template slot="title">
                      <div>
                        <div class="tooltip-line">
                          LP Tokens <span>{{ farm.userInfo.depositFormat.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</span>
                        </div>
                        <hr />
                        <div class="tooltip-line">
                          {{ farm.farmInfo.lp.coin.symbol }}
                          <span> {{ farm.userInfo.depositCoin.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} </span>
                        </div>
                        <hr />
                        <div class="tooltip-line">
                          {{ farm.farmInfo.lp.pc.symbol }}
                          <span> {{ farm.userInfo.depositPc.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} </span>
                        </div>
                      </div>
                    </template>
                    <div class="info-icon">
                      <img src="@/assets/icons/info-icon.svg" width="16" height="16" />
                    </div>
                  </Tooltip>
                </div>
                <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="value">-</div>
                <div v-else class="value">
                  {{
                    !wallet.connected
                      ? 0
                      : farm.userInfo.depositBalanceUSD
                      ? '$ ' + farm.userInfo.depositBalanceUSD
                      : farm.userInfo.depositBalance.format()
                  }}
                </div>
              </Col>

              <Col class="state" span="3">
                <div class="action-btn-group">
                  <div
                    class="btn-container btn-container-fill"
                    v-if="
                      currentTimestamp < farm.farmInfo.poolInfo.end_timestamp &&
                      farm.farmInfo.poolInfo.start_timestamp < currentTimestamp
                    "
                  >
                    <Button
                      size="large"
                      v-if="wallet.connected"
                      :disabled="
                        !wallet.connected ||
                        !farm.farmInfo.poolInfo.is_allowed ||
                        farm.farmInfo.poolInfo.end_timestamp < currentTimestamp ||
                        farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                      "
                      @click="openStakeModal(farm.labelized, farm.farmInfo, farm.farmInfo.lp)"
                    >
                      {{
                        !farm.farmInfo.poolInfo.is_allowed
                          ? 'Not Allowed'
                          : currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                          ? 'Ended'
                          : farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                          ? 'Unstarted'
                          : 'Deposit'
                      }}
                    </Button>


                    <Button
                      size="large"
                      v-else
                      @click="$accessor.wallet.openModal"
                    >
                      {{
                        !farm.farmInfo.poolInfo.is_allowed
                          ? 'Not Allowed'
                          : currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                          ? 'Ended'
                          : farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                          ? 'Unstarted'
                          : 'Deposit'
                      }}
                    </Button>


                  </div>

                  <div
                    class="btn-container btn-container-outline"
                    v-if="
                      currentTimestamp < farm.farmInfo.poolInfo.end_timestamp &&
                      farm.farmInfo.poolInfo.start_timestamp < currentTimestamp &&
                      farm.farmInfo.currentLPtokens > 0.001
                    "
                  >
                    <Button
                      size="large"
                      ghost
                      :disabled="
                        !wallet.connected ||
                        !farm.farmInfo.poolInfo.is_allowed ||
                        farm.farmInfo.poolInfo.end_timestamp < currentTimestamp ||
                        farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                      "
                      @click="openStakeModalLP(farm.farmInfo, farm.farmInfo.lp)"
                    >
                      {{
                        !farm.farmInfo.poolInfo.is_allowed
                          ? 'Not Allowed'
                          : currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                          ? 'Ended'
                          : farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                          ? 'Unstarted'
                          : 'Deposit LP'
                      }}
                    </Button>
                  </div>

                  <!-- <div
                    class="btn-container btn-container-outline"
                    v-if="farm.farmInfo.poolInfo.end_timestamp < currentTimestamp"
                  > -->
                  <div class="btn-container btn-container-outline">
                    <Button
                      size="large"
                      ghost
                      :disabled="!wallet.connected || farm.userInfo.depositBalance.isNullOrZero()"
                      @click.stop="openUnstakeModal(farm.farmInfo, farm.farmInfo.lp, farm.userInfo.depositBalance)"
                    >
                      Withdraw
                    </Button>
                  </div>



                    <div
                      class="owner"
                      v-if="
                        farm.farmInfo.poolInfo.owner.toBase58() == wallet.address &&
                        farm.farmInfo.poolInfo.is_allowed &&
                        currentTimestamp < farm.farmInfo.poolInfo.end_timestamp
                      "
                    >
                      <br />
                      <hr />
                      <br />

                      <div class="title" style="text-align: left">
                        <div><b>Remaining rewards : </b
                        ></div><br />{{
                          Math.round(
                            new TokenAmount(farm.farmInfo.reward.balance.wei, farm.farmInfo.reward.decimals).toEther() *
                              1000
                          ) / 1000
                        }}
                      </div>

                      <div class="title" style="text-align: left">
                        <div><b>End time : </b></div>{{ new Date(farm.farmInfo.poolInfo.end_timestamp * 1e3).toISOString() }}
                      </div>

                      

                      <div
                        class="btncontainer noMobile"
                        v-if="
                          farm.farmInfo.poolInfo.owner.toBase58() == wallet.address &&
                          farm.farmInfo.poolInfo.is_allowed &&
                          currentTimestamp < farm.farmInfo.poolInfo.end_timestamp
                        "
                      >
                        <Button size="large" ghost @click="openAddRewardModal(farm)"> Add Rewards </Button>
                      </div>
                    </div>
                </div>
              </Col>
            </Row>

            <!-- Farm table for mobile -->

            <Collapse v-model="showCollapse" class="noDesktop farm-table-mobile" accordion>
              <CollapsePanel v-for="farm in showFarms" v-show="true" :key="farm.farmInfo.poolId">
                <Row slot="header" class="farm-item noDesktop">
                  <Col class="lp-icons farm-mobile-section" span="24">
                    <div class="lp-farm">
                      <div class="lp-icons-group">
                        <div class="icons">
                          <CoinIcon :mint-address="farm.farmInfo.lp.coin.mintAddress" />
                          <span>{{ farm.farmInfo.lp.coin.symbol }} - </span>
                          <CoinIcon :mint-address="farm.farmInfo.lp.pc.mintAddress" />
                          <span>{{ farm.farmInfo.lp.pc.symbol }}</span>
                        </div>
                      </div>
                      <div class="farm-labels">
                        <div v-if="farm.labelized" class="label labelized">Labelized</div>
                        <div v-else class="label permissionless">Permissionless</div>

                        <div v-if="currentTimestamp > farm.farmInfo.poolInfo.end_timestamp" class="label ended">
                          Ended
                        </div>
                        <div
                          v-if="currentTimestamp < farm.farmInfo.poolInfo.start_timestamp * 1 + 86400 * 7"
                          class="label new"
                        >
                          New
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col class="farm-mobile-section" span="24">
                    <Col class="state" span="7">
                      <div class="title">Liquidity</div>
                      <div
                        v-if="
                          farm.farmInfo.poolInfo.start_timestamp > currentTimestamp ||
                          currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                        "
                        class="value"
                      >
                        -
                      </div>
                      <div v-else class="value">
                        {{
                          Math.round(farm.farmInfo.liquidityUsdValue)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }}$
                      </div>
                    </Col>

                    <Col class="state" span="10">
                      <div class="title">Total APR</div>
                      <div
                        v-if="
                          farm.farmInfo.poolInfo.start_timestamp > currentTimestamp ||
                          currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                        "
                        class="value"
                      >
                        -
                      </div>
                      <div v-else class="value">
                        {{ Math.round(farm.farmInfo.apr * 100 ) / 100 }}%
                        <img v-if="farm.farmInfo.apr > 300" src="@/assets/icons/fire-icon.svg" />
                        <img v-if="farm.farmInfo.apr > 1000" src="@/assets/icons/fire-icon.svg" />
                      </div>
                    </Col>

                    <Col class="state" span="7">
                      <div class="title">Pending Reward</div>
                      <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="value">-</div>
                      <div v-else class="value">
                        {{ (!wallet.connected || (Math.round(farm.userInfo.pendingReward.format().replace(/,/g, '') * 100000) / 100000) &lt; 0) ? 0 : (Math.round(farm.userInfo.pendingReward.format().replace(/,/g, '') * 100000) / 100000) }}
                      </div>
                    </Col>
                  </Col>

                  <Col
                    v-if="farm.farmInfo.poolId != showCollapse"
                    class="farm-mobile-section btn-show-collapse"
                    span="24"
                  >
                    <img src="@/assets/icons/collapse-arrow-mobile.svg" />
                  </Col>
                </Row>

                <Row class="farm-item noDesktop">
                  <Col class="farm-mobile-section" span="24">
                    <Col class="state" span="6">
                      <div class="title">Staked</div>
                      <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="value">-</div>
                      <div v-else class="value">
                        {{
                          !wallet.connected
                            ? 0
                            : farm.userInfo.depositBalanceUSD
                            ? '$ ' + farm.userInfo.depositBalanceUSD
                            : farm.userInfo.depositBalance.format()
                        }}
                      </div>
                    </Col>
                    <Col class="state" span="18">
                      <div class="farm-infos">
                        <div class="farm-info-group">
                          <div class="farm-info-img">
                            <img src="@/assets/icons/time-icon.svg" />
                          </div>
                          from
                          {{ new Date(farm.farmInfo.poolInfo.start_timestamp * 1e3).toLocaleDateString('en-US') }}
                          to
                          {{ new Date(farm.farmInfo.poolInfo.end_timestamp * 1e3).toLocaleDateString('en-US') }}
                        </div>
                        <!--
                        <div>
                          <div class="farm-info-group">
                            <div class="farm-info-img">
                              <img src="@/assets/icons/reward-icon.svg" />
                            </div>
                            Remaining rewards
                            {{
                              Math.round(
                                new TokenAmount(
                                  farm.farmInfo.reward.balance.wei,
                                  farm.farmInfo.reward.decimals
                                ).toEther() * 1000
                              ) / 1000
                            }}
                            {{ farm.farmInfo.lp.coin.symbol }}
                          </div>
                        </div>
                        -->
                      </div>
                    </Col>
                  </Col>

                  <Col class="farm-mobile-section btn-hide-collapse" span="24" @click="hideCollapse">
                    <Col class="state" span="12">
                      <div
                        class="btn-container btn-container-outline"
                        v-if="
                          currentTimestamp < farm.farmInfo.poolInfo.end_timestamp &&
                          farm.farmInfo.poolInfo.start_timestamp < currentTimestamp &&
                          farm.farmInfo.currentLPtokens > 0.001
                        "
                      >
                        <Button
                          size="large"
                          ghost
                          :disabled="
                            !farm.farmInfo.poolInfo.is_allowed ||
                            farm.farmInfo.poolInfo.end_timestamp < currentTimestamp ||
                            farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                          "
                          @click="openStakeModalLP(farm.farmInfo, farm.farmInfo.lp)"
                        >
                          {{
                            !farm.farmInfo.poolInfo.is_allowed
                              ? 'Not Allowed'
                              : currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                              ? 'Ended'
                              : farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                              ? 'Unstarted'
                              : 'Deposit LP'
                          }}
                        </Button>


                      </div>

                      <!-- <div
                        class="btn-container btn-container-outline"
                        v-if="farm.farmInfo.poolInfo.end_timestamp < currentTimestamp"
                      > -->
                      <div class="btn-container btn-container-outline">
                        <Button
                          size="large"
                          ghost
                          :disabled="!wallet.connected || farm.userInfo.depositBalance.isNullOrZero()"
                          @click.stop="openUnstakeModal(farm.farmInfo, farm.farmInfo.lp, farm.userInfo.depositBalance)"
                        >
                          Withdraw
                        </Button>
                      </div>

                      <div class="social-icons-group">
                        <a :href="farm.farmInfo.twitterShare" target="_blank" class="social-icon">
                          <img src="@/assets/icons/share-icon.svg" />
                        </a>
                        <a 
                      v-if="farm.farmInfo.twitterLink"
                      :href="farm.farmInfo.twitterLink" class="social-icon">
                          <img src="@/assets/icons/twitter-icon.svg" />
                        </a>
                      </div>
                    </Col>

                    <Col class="state" span="12">
                      <div
                        class="btn-container btn-container-fill"
                        v-if="
                          currentTimestamp < farm.farmInfo.poolInfo.end_timestamp &&
                          farm.farmInfo.poolInfo.start_timestamp < currentTimestamp
                        "
                      >
                        <Button
                          size="large"
                          v-if="wallet.connected"
                          :disabled="
                            !wallet.connected ||
                            !farm.farmInfo.poolInfo.is_allowed ||
                            farm.farmInfo.poolInfo.end_timestamp < currentTimestamp ||
                            farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                          "
                          @click="openStakeModal(farm.labelized, farm.farmInfo, farm.farmInfo.lp)"
                        >
                          {{
                            !farm.farmInfo.poolInfo.is_allowed
                              ? 'Not Allowed'
                              : currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                              ? 'Ended'
                              : farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                              ? 'Unstarted'
                              : 'Deposit'
                          }}
                        </Button>

                        <Button
                          size="large"
                          v-else
                         @click="$accessor.wallet.openModal"
                        >
                          {{
                            !farm.farmInfo.poolInfo.is_allowed
                              ? 'Not Allowed'
                              : currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                              ? 'Ended'
                              : farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                              ? 'Unstarted'
                              : 'Deposit'
                          }}
                        </Button>

                      </div>

                      <div class="btn-container btn-container-harvest">
                        <Button
                          v-if="farm.farmInfo.poolInfo.end_timestamp < currentTimestamp"
                          :disabled="!wallet.connected || farm.userInfo.depositBalance.isNullOrZero()"
                          size="large"
                          ghost
                          @click.stop="openUnstakeModal(farm.farmInfo, farm.farmInfo.lp, farm.userInfo.depositBalance)"
                        >
                          Harvest & Withdraw
                        </Button>

                        <Button
                          v-else
                          size="large"
                          ghost
                          :disabled="!wallet.connected || harvesting || farm.userInfo.pendingReward.isNullOrZero()"
                          :loading="harvesting"
                          @click="harvest(farm.farmInfo)"
                        >
                          Harvest
                        </Button>
                      </div>
                    </Col>

                    <img class="btn-hide-collapse-icon" src="@/assets/icons/collapse-arrow-mobile.svg" />
                  </Col>
                </Row>
              </CollapsePanel>
            </Collapse>

            <div class="pagination-container">
              <div class="pagination-body">
                <Pagination
                  v-if="totalCount > pageSize"
                  :total="totalCount"
                  :pageSize="pageSize"
                  :defaultCurrent="1"
                  v-model="currentPage"
                >
                </Pagination>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="fc-container">
          <Spin :spinning="true">
            <Icon slot="indicator" type="loading" style="font-size: 24px" spin />
          </Spin>
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
  Collapse,
  Spin,
  Icon,
  Row,
  Col,
  Button,
  // Radio,
  Input,
  // Select,
  Switch as Toggle,
  Pagination
} from 'ant-design-vue'
import { get, cloneDeep, forIn, indexOf } from 'lodash-es'
import { TokenAmount } from '@/utils/safe-math'
import { FarmInfo } from '@/utils/farms'
import { deposit, withdraw } from '@/utils/stake'
import { getUnixTs } from '@/utils'
import { getBigNumber, toBigNumber } from '@/utils/layouts'
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
    Tooltip,
    Toggle,
    Input,
    // Progress,
    Collapse,
    CollapsePanel,
    Spin,
    Icon,
    Row,
    Col,
    Button,
    // Radio,
    // Select,
    Pagination
  },

  //    ,
  //    RadioGroup,
  //    RadioButton

  data() {
    return {
      isMobile: false,

      farmProgramCreated: true,
      superOwnerAddress: FARM_INITIAL_SUPER_OWNER,

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
      TVL: 0,
      suppling: false,
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
      searchCertifiedFarm: false as boolean,
      searchLifeFarm: false as boolean,
      stakedOnly: false as boolean,
      showSortOption: false as boolean,
      totalCount: 110,
      pageSize: 50,
      displaynoticeupdate: false,
      currentPage: 1,
      labelizedPermission: false as any,
      sortMethod: 'liquidity' as string,
      sortAsc: true as boolean,
      preList: [
        {
          symbol: 'All',
          mintAddress: ''
        },
        {
          symbol: 'CRP',
          mintAddress: 'DubwWZNWiNGMMeeQHPnMATNj77YZPZSAz2WVR5WjLJqz'
        },
        {
          symbol: 'USDC',
          mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        },
        {
          symbol: 'SOL',
          mintAddress: '11111111111111111111111111111111'
        }
      ],
      activeSpinning: false as boolean,
      userMigrations: [] as any[]
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
        this.updateFarms()
        this.checkFarmMigration()
      },
      deep: true
    },
    showCollapse: {
      handler() {
        // if (!this.poolType && this.showCollapse.length > 0) {
        //   this.showCollapse.splice(0, this.showCollapse.length)
        // }
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
    this.getTvl();
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
    async checkFarmMigration() {
      this.userMigrations = []

      try {
        const migrations = await fetch('https://api.cropper.finance/migrate/').then((res) => res.json())
        //const migrations = {"G8V86qfLq3v4EXrZxpUWS4yufDymsddMJkve46z4tnry":"B8XAiSowXmqKbcvhuQKemPwReXTFLPTQdTyMm1xANZpK"}

        forIn(migrations, (newFarmId, oldFarmId, _object) => {
          let userInfoNew = get(this.farm.stakeAccounts, newFarmId)
          let userInfoOld = get(this.farm.stakeAccounts, oldFarmId)
          if (userInfoNew === undefined && userInfoOld != undefined && userInfoOld.depositBalance.wei.toNumber() > 0) {
            this.userMigrations.push({
              oldFarmId,
              newFarmId,
              depositBalance:
                userInfoOld.depositBalance.wei.toNumber() / Math.pow(10, userInfoOld.depositBalance.decimals)
            })
          }
        })
      } catch {
        // dummy data
        this.userMigrations = []
      } finally {
      }
    },
    migrateFarm(migrationFarm: any) {
      const amount = migrationFarm.depositBalance

      const oldFarm = get(this.farm.infos, migrationFarm.oldFarmId)
      const oldFarmInfo = cloneDeep(oldFarm)

      const newFarm = get(this.farm.infos, migrationFarm.newFarmId)
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
                h(
                  'a',
                  {
                    attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' }
                  },
                  'here'
                )
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
      let responseData = []
      try {
        responseData = await fetch('https://api.cropper.finance/farms/').then((res) => res.json())
      } catch {
        // dummy data
      } finally {
        ;(responseData as any).forEach((element: any) => {
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

    async getTvl() {
      let cur_date = new Date().getTime()
      if (window.localStorage.TVL_last_updated) {
        const last_updated = parseInt(window.localStorage.TVL_last_updated)
        if (cur_date - last_updated <= 600000) {
          this.TVL = window.localStorage.TVL
          return
        }
      }

      let responseData: any = []
      let tvl = 0
      try {
        responseData = await fetch('https://api.cropper.finance/cmc/').then((res) => res.json())

        Object.keys(responseData).forEach(function (key) {
          if(((responseData as any)[key as any].tvl * 1) < 2000000){
            tvl = (tvl * 1) + ((responseData as any)[key as any].tvl * 1);
          }
        })
      } catch {
        // dummy data
      } finally {
      }

      this.TVL = Math.round(tvl)

      window.localStorage.TVL_last_updated = new Date().getTime()
      window.localStorage.TVL = this.TVL
    },

    async updateFarms() {
    this.$accessor.token.loadTokens()
      console.log('updating farms ...')
      await this.updateLabelizedAmms()
      this.currentTimestamp = moment().unix()

      const conn = this.$web3
      const wallet = (this as any).$accessor.wallet
      const liquidity = (this as any).$accessor.liquidity

      const farms: any = []
      const endedFarmsPoolId: string[] = []
      for (const [poolId, farmInfo] of Object.entries(this.farm.infos)) {
        let isPFO = false

        // @ts-ignore
        const { reward_per_share_net, last_timestamp, end_timestamp, reward_per_timestamp_or_remained_reward_amount } = farmInfo.poolInfo

        // @ts-ignore
        const { reward, lp } = farmInfo

        const newFarmInfo: any = cloneDeep(farmInfo)

        if (end_timestamp.toNumber() < 1635452141) {
          continue
        }

        let partCoin = toBigNumber(0)
        let partPc = toBigNumber(0)

        if (reward && lp) {
          const rewardPerTimestamp = toBigNumber(reward_per_timestamp_or_remained_reward_amount).dividedBy(
            toBigNumber(end_timestamp).minus(toBigNumber(last_timestamp))
          )

          const rewardPerTimestampAmount = new TokenAmount(rewardPerTimestamp, reward.decimals)
          const liquidityItem = get(this.liquidity.infos, lp.mintAddress)

          let newCoin = 0
          let newPc = 0

          if (
            !this.price.prices[liquidityItem?.coin.symbol as string] &&
            this.price.prices[liquidityItem?.pc.symbol as string]
          ) {
            this.price.prices[liquidityItem?.coin.symbol as string] =
              (this.price.prices[liquidityItem?.pc.symbol as string] *
                getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther())) /
              getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther())
            newCoin = 1
          }

          if (
            !this.price.prices[liquidityItem?.pc.symbol as string] &&
            this.price.prices[liquidityItem?.coin.symbol as string]
          ) {
            this.price.prices[liquidityItem?.pc.symbol as string] =
              (this.price.prices[liquidityItem?.coin.symbol as string] *
                getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther())) /
              getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther())
            newPc = 1
          }

          const rewardPerTimestampAmountTotalValue =
            rewardPerTimestampAmount.toEther().multipliedBy(new BigNumber(60 * 60 * 24 * 365 * this.price.prices[reward.symbol as string]))

          const liquidityCoinValue =
            (liquidityItem?.coin.balance as TokenAmount).toEther()
            .multipliedBy(new BigNumber(this.price.prices[liquidityItem?.coin.symbol as string]))
            
          const liquidityPcValue =
            (liquidityItem?.pc.balance as TokenAmount).toEther()
            .multipliedBy(new BigNumber(this.price.prices[liquidityItem?.pc.symbol as string]))
            
          let liquidityTotalValue = liquidityPcValue.plus(liquidityCoinValue);

          if(this.price.prices[liquidityItem?.pc.symbol as string] == 1){
             liquidityTotalValue = liquidityPcValue.multipliedBy(2)
          }

          const liquidityTotalSupply = (liquidityItem?.lp.totalSupply as TokenAmount).toEther()

          partCoin = (liquidityItem?.coin.balance as TokenAmount).toEther().dividedBy(liquidityTotalSupply)
          partPc = (liquidityItem?.pc.balance as TokenAmount).toEther().dividedBy(liquidityTotalSupply)

          const liquidityItemValue = liquidityTotalValue.dividedBy(liquidityTotalSupply)
          let liquidityUsdValue = lp.balance.toEther().multipliedBy(liquidityItemValue)
          newFarmInfo.lpUSDvalue = liquidityItemValue

          let farmUsdValue = newFarmInfo.lp.balance.toEther().multipliedBy(liquidityItemValue)

          let baseCalculation = getBigNumber(farmUsdValue)
          if (baseCalculation < 0.01) {
            baseCalculation = 1
          }

          let apr = ((getBigNumber(rewardPerTimestampAmountTotalValue) / baseCalculation) * 100).toFixed(2)

          if (apr === 'NaN' || apr === 'Infinity') {
            apr = '0'
          }

          if (isNaN(liquidityUsdValue)) {
            liquidityUsdValue = 0
          }

          if(this.currentTimestamp < newFarmInfo.poolInfo.end_timestamp && ((rewardPerTimestampAmountTotalValue as any) * 86400 * 7) < 1 && liquidityUsdValue < 2 && !window.localStorage['owner_'+newFarmInfo.poolId]) { continue; }

          // @ts-ignore
          newFarmInfo.apr = apr

          newFarmInfo.apr_details = {
            apr: Math.round((apr as any) * 100) / 100,
            apy: 0
          } as any

          if (
            this.poolsDatas[liquidityItem.ammId] &&
            this.poolsDatas[liquidityItem.ammId]['fees'] &&
            (liquidityTotalValue as any) > 0
          ) {
            let apy = (this.poolsDatas[liquidityItem.ammId]['fees'] * 365 * 100) / (liquidityTotalValue as any)
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

          if (newCoin) {
            delete this.price.prices[liquidityItem?.coin.symbol as string]
          }

          if (newPc) {
            delete this.price.prices[liquidityItem?.pc.symbol as string]
          }
        }


          let userInfo = get(this.farm.stakeAccounts, poolId)
          if (userInfo && lp && FARM_VERSION === 1) {
            userInfo = cloneDeep(userInfo)

            const { rewardDebt, depositBalance } = userInfo
            let currentTimestamp = this.currentTimestamp

            if (currentTimestamp > end_timestamp.toNumber()) {
              currentTimestamp = end_timestamp.toNumber()
            }

            const duration = currentTimestamp - last_timestamp.toNumber()

            const rewardPerTimestamp = toBigNumber(reward_per_timestamp_or_remained_reward_amount)
            const liquidityItem = get(this.liquidity.infos, lp.mintAddress)
            const lpTotalSupply = (liquidityItem?.lp.totalSupply as TokenAmount).wei
            const rewardPerShareCalc = rewardPerTimestamp
              .multipliedBy(duration)
              .multipliedBy(REWARD_MULTIPLER)
              .dividedBy(lpTotalSupply)
              .plus(getBigNumber(reward_per_share_net))

            let pendingReward = depositBalance.wei
              .multipliedBy(rewardPerShareCalc)
              .dividedBy(REWARD_MULTIPLER)
              .minus(rewardDebt.wei)

            userInfo.needRefresh = false

            if (pendingReward.toNumber() > newFarmInfo.reward.balance.wei.toNumber()) {
              pendingReward = newFarmInfo.reward.balance.wei
              userInfo.needRefresh = true
              this.displaynoticeupdate = true
            }

            userInfo.depositFormat = (Math.round(userInfo.depositBalance.format() * 100000) / 100000).toFixed(2)

            userInfo.depositCoin = (Math.round((partCoin as any) * userInfo.depositBalance.format() * 10000) / 10000).toFixed(2)

            userInfo.depositPc = (Math.round((partPc as any) * userInfo.depositBalance.format() * 10000) / 10000).toFixed(2)

            if (newFarmInfo.lpUSDvalue) {
              userInfo.depositBalanceUSD = (
                Math.round(newFarmInfo.lpUSDvalue * userInfo.depositBalance.format() * 100) / 100
              )
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }

            userInfo.pendingReward = new TokenAmount(pendingReward, newFarmInfo.reward.decimals)
          } else if (userInfo && lp && FARM_VERSION > 1) {
            userInfo = cloneDeep(userInfo)

            const { rewardDebt, depositBalance } = userInfo
            let currentTimestamp = this.currentTimestamp

            if (currentTimestamp > end_timestamp.toNumber()) {
              currentTimestamp = end_timestamp.toNumber()
            }

            const duration = currentTimestamp - last_timestamp.toNumber()

            const rewardPerTimestamp = toBigNumber(reward_per_timestamp_or_remained_reward_amount).dividedBy(
              toBigNumber(end_timestamp).minus(toBigNumber(last_timestamp))
            )

            const rewardPerShareCalc = rewardPerTimestamp
              .multipliedBy(duration)
              .multipliedBy(REWARD_MULTIPLER)
              .dividedBy(newFarmInfo.lp.balance.wei)
              .plus(getBigNumber(reward_per_share_net))

            const JUMP_DEBT = new BigNumber(10000000000000000000)
            const _rewardDebt = rewardDebt.wei.minus(JUMP_DEBT)
            let pendingReward = depositBalance.wei
              .multipliedBy(rewardPerShareCalc)
              .dividedBy(REWARD_MULTIPLER)
              .minus(_rewardDebt)

            userInfo.needRefresh = false

            if (pendingReward.toNumber() > newFarmInfo.reward.balance.wei.toNumber()) {
              pendingReward = newFarmInfo.reward.balance.wei
              userInfo.needRefresh = true
              this.displaynoticeupdate = true
            }

            userInfo.depositFormat = (Math.round(userInfo.depositBalance.format().replace(/,/g, '') * 100000) / 100000).toFixed(2)

            userInfo.depositCoin = (Math.round((partCoin as any) * userInfo.depositBalance.format().replace(/,/g, '') * 10000) / 10000).toFixed(2)

            userInfo.depositPc = (Math.round((partPc as any) * userInfo.depositBalance.format().replace(/,/g, '') * 10000) / 10000).toFixed(2)

            if (newFarmInfo.lpUSDvalue) {
              userInfo.depositBalanceUSD = (
                Math.round(newFarmInfo.lpUSDvalue * userInfo.depositBalance.format().replace(/,/g, '') * 100) / 100
              )
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }

            userInfo.pendingReward = new TokenAmount(pendingReward, newFarmInfo.reward.decimals)
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
            const liquidityItem = get(this.liquidity.infos, lp.mintAddress)

            if (this.labelizedAmms[newFarmInfo.poolId]) {
              if (this.labelizedAmmsExtended[newFarmInfo.poolId].farmhidden == true) {
                continue
              }

              if (this.labelizedAmmsExtended[newFarmInfo.poolId].labelized == true) {
                labelized = true
              }

            }
          }

          if (TOKENS[newFarmInfo.lp.coin.mintAddress] && TOKENS[newFarmInfo.lp.coin.mintAddress].twitter) {
            ;(newFarmInfo as any).twitterLink = TOKENS[newFarmInfo.lp.coin.mintAddress].twitter
          }

          if(newFarmInfo.lp.coin.symbol == 'CRP'){
            (newFarmInfo as any).twitterLink = 'https://twitter.com/CropperFinance'
          } else if(newFarmInfo.lp.coin.symbol == 'wCAPS'){
            (newFarmInfo as any).twitterLink = 'https://twitter.com/Ternoa_'
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

      if (this.sortAsc) {
        if (this.sortMethod == 'apr') {
          this.farms = farms.sort((a: any, b: any) => b.farmInfo.apr - a.farmInfo.apr)
        } else if (this.sortMethod == 'liquidity') {
          this.farms = farms.sort((a: any, b: any) => b.farmInfo.liquidityUsdValue - a.farmInfo.liquidityUsdValue)
        }
      } else {
        if (this.sortMethod == 'apr') {
          this.farms = farms.sort((a: any, b: any) => a.farmInfo.apr - b.farmInfo.apr)
        } else if (this.sortMethod == 'liquidity') {
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
      searchCertifiedFarm: boolean,
      searchLifeFarm: boolean,
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
      } else if (
        searchName != '' &&
        this.farms.filter(
          (farm: any) =>
            (farm.farmInfo.lp.pc.symbol as string).toLowerCase() == (searchName as string).toLowerCase() ||
            (farm.farmInfo.lp.coin.symbol as string).toLowerCase() == (searchName as string).toLowerCase()
        ).length > 0
      ) {
        this.showFarms = this.farms.filter(
          (farm: any) =>
            (farm.farmInfo.lp.pc.symbol as string).toLowerCase() == (searchName as string).toLowerCase() ||
            (farm.farmInfo.lp.coin.symbol as string).toLowerCase() == (searchName as string).toLowerCase()
        )
      } else if (searchName != '') {
        this.showFarms = this.farms.filter((farm: any) =>
          (farm.farmInfo.lp.symbol as string).toLowerCase().includes((searchName as string).toLowerCase())
        )
      }

      if (!searchCertifiedFarm) {
        //labelized
        this.showFarms = this.showFarms.filter((farm: any) => farm.labelized)
      } else {
        //permissionless
        this.showFarms = this.showFarms.filter((farm: any) => !farm.labelized)
      }

      const currentTimestamp = moment().unix()
      if (!searchLifeFarm) {
        //Opened
        this.showFarms = this.showFarms.filter(
          (farm: any) =>
            farm.farmInfo.poolInfo.start_timestamp < currentTimestamp &&
            farm.farmInfo.poolInfo.end_timestamp > currentTimestamp
        )
      } else {
        //Ended
        this.showFarms = this.showFarms.filter((farm: any) => farm.farmInfo.poolInfo.end_timestamp < currentTimestamp)
      }

      if (stakedOnly) {
        this.showFarms = this.showFarms.filter((farm: any) => farm.userInfo.depositBalance.wei.toNumber() > 0)
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
      
      const coin = cloneDeep(lp)
      const lpBalance = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
      coin.balance = lpBalance

      this.lp = coin
      
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
                  h(
                    'a',
                    {
                      attrs: {
                        href: `${this.url.explorer}/tx/${txid}`,
                        target: '_blank'
                      }
                    },
                    'here'
                  )
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
                  h(
                    'a',
                    {
                      attrs: {
                        href: `${this.url.explorer}/tx/${txid}`,
                        target: '_blank'
                      }
                    },
                    'here'
                  )
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
                h(
                  'a',
                  {
                    attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' }
                  },
                  'here'
                )
              ])
          })

          this.suppling = true;

          const description = `Add liquidity for ${fromCoinAmount} ${this.farmInfo.lp.coin?.symbol} and ${toCoinAmount} ${this.farmInfo.lp.pc?.symbol}`
          this.$accessor.transaction.sub({ txid, description })

          txStatus = this.$accessor.transaction.history[txid].status
          let totalDelayTime = 0
          while (txStatus === 'Pending' && totalDelayTime < 45000) {
            let delayTime = 500
            await this.delay(delayTime)
            totalDelayTime += delayTime
            txStatus = this.$accessor.transaction.history[txid].status
            console.log('h1', totalDelayTime, txStatus);
          }

          if (txStatus === 'Fail') {
            console.log('add lp failed')
            return
          }

          //update wallet token account infos
          
          let delayForUpdate = 500
          await this.$accessor.wallet.getTokenAccounts()
          this.stakeModalOpening = false
          this.staking = false
            await this.delay(400)




          this.stakeModalOpeningLP = true;


        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Add liquidity failed',
            description: error.message
          })
        })
        .finally(async () => {
          this.suppling = false;
        })
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
                h(
                  'a',
                  {
                    attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' }
                  },
                  'here'
                )
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
                h(
                  'a',
                  {
                    attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' }
                  },
                  'here'
                )
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
                h(
                  'a',
                  {
                    attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' }
                  },
                  'here'
                )
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
                h(
                  'a',
                  {
                    attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' }
                  },
                  'here'
                )
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
    searchByShortcut(option: string) {
      option = option.toLowerCase()
      if (option == 'all') option = ''
      this.searchName = option
    },
    setSortOption(mode: string, asc: boolean) {
      this.sortMethod = mode
      this.sortAsc = asc
      this.showSortOption = false
      this.updateFarms()
    },
    activeSearch(mode: string) {
      if (mode === 'labelized') this.searchCertifiedFarm = false
      else if (mode === 'permissionless') this.searchCertifiedFarm = true
      else if (mode === 'open') this.searchLifeFarm = false
      else if (mode === 'ended') this.searchLifeFarm = true
      else if (mode === 'deposit' && this.wallet.connected) this.stakedOnly = !this.stakedOnly
    },
    hideCollapse() {
      this.showCollapse = []
    },
    reloadTimer() {
      this.activeSpinning = true
      setTimeout(() => {
        this.activeSpinning = false
      }, 1000)
      this.$accessor.farm.requestInfos()
      this.$accessor.wallet.getTokenAccounts()
    }
  }
})
</script>

<style lang="less" scoped>

// global stylesheet

.info-icon {
  margin: -10px 0 0 10px;
  display: flex;
  align-items: center;

  @media @max-b-mobile {
    margin-left: 5px;
  }
}

.planet-img-left {
  position: absolute;
  left: 0;
  top: 35%;
}

// class stylesheet

.farm.container {
  max-width: 1350px;
  width: 100%;
  background: @color-bg;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;

  @media @max-b-mobile {
    margin-top: 0;
  }

  .planet-left {
    position: absolute;
    left: 0;
    top: 35%;

    @media @max-b-mobile {
      display: none;
    }
  }

  .card {
    .card-body {
      padding: 0;

      .farm-shortcut {
        display: inline-flex;
        padding: 10px;

        @media @max-b-mobile {
          display: none;
        }

        .farm-prelist {
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 6px;
          padding: 6px 24px;
          font-size: 14px;
          line-height: 17px;
          text-transform: uppercase;
          margin-right: 5px;
          width: 75px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          img {
            width: 15px;
            height: 15px;
            margin-right: 5px;
            border-radius: 50%;
          }
        }
      }

      .page-head {
        margin-top: 10px;

        .title {
          text-align: center;
          position: relative;
          float: left;

          a {
            position: absolute;

            &.create-btn-desktop {
              top: 20px;
              right: -90px;
              .create-plus-btn {
                font-weight: 400;
                background: @color-outline;
                box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
                align-items: center;
                display: flex;
                justify-content: center;
                color: white;
                padding: 3px 7px;
                border-radius: 4px;
                font-size: 10px;
                line-height: 12px;

                @media @max-b-mobile {
                  display: none;
                }
              }
            }

            &.create-btn-mobile {
              top: 5px;
              right: -25px;

              .create-plus-btn {
                font-weight: 400;
                background: @color-outline;
                box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
                border-radius: 8px;
                width: 18px;
                height: 18px;
                display: none;

                @media @max-b-mobile {
                  display: flex;
                }
              }
            }
          }
        }

        .information {
          display: flex;
          align-items: center;
          text-align: right;

          .my-info {
            font-size: 15px;
            line-height: 18px;

            @media @max-b-mobile {
              font-size: 12px;
              line-height: 15px;
            }
          }

          .reload-btn {
            width: 30px;
            height: 30px;
            border-radius: 15px;
            background: @gradient-color-primary;
            background-origin: border-box;
            margin-left: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            @media @max-b-mobile {
              margin-left: 5px;
            }

            img {
              width: 18px;
              height: 18px;
            }

            &.active img {
              transform: rotate(360deg);
              transition: all 1s ease-in-out;
            }
          }
        }
      }

      .page-content {
        .tool-bar {
          height: 64px;
          border-radius: 14px;
          border: 4px solid @color-outline;
          width: 100%;

          @media @max-b-mobile {
            margin-bottom: 5px;
            height: 54px;

            &:last-child {
              margin-bottom: 0;
            }
          }

          .tool-option {
            height: 100%;
            display: inline-block;
            border-right: 4px solid @color-outline;
            position: relative;

            &:last-child {
              border-right: none !important;
            }

            .input-search {
              height: 100%;
              position: absolute;
              width: 100%;
            }

            .toggle {
              position: absolute;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: space-evenly;

              .label {
                opacity: 0.5;
                font-size: 16px;
                color: #fff;
                cursor: pointer;
                position: relative;

                .info-icon {
                  margin: 0;
                  position: absolute;
                  top: -5px;
                  right: -20px;

                  &.labelized {
                    left: -20px;
                  }
                }

                &.active-label {
                  font-weight: 700;
                  opacity: 1;
                }
              }

              &.deposit-toggle {
                .ant-switch {
                  background-color: @color-disable !important;
                }
                .ant-switch-checked {
                  background-color: #fff !important;
                }
              }
            }

            .sort-by {
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: space-evenly;

              .label {
                font-size: 16px;
                opacity: 0.5;
                cursor: pointer;

                &.active-label {
                  font-weight: 700;
                  opacity: 1;
                }

                .sort-up,
                .sort-down {
                  margin-right: 5px;
                  transition: 0.5s;
                }

                .sort-down {
                  transform: rotate(180deg);
                }
              }

              .collapse-down,
              .collapse-up {
                cursor: pointer;
                transition: 0.5s;
              }

              .collapse-down {
                transform: rotate(180deg);
              }
            }

            .sort-options {
              position: absolute;
              width: 100%;
              top: 64px;
              padding: 18px;
              background: @gradient-color-primary;
              background-origin: border-box;
              border: 2px solid rgba(255, 255, 255, 0.1);
              box-shadow: 18px 11px 14px rgba(0, 0, 0, 0.25);
              border-radius: 8px;
              z-index: 999;

              .option {
                display: flex;
                align-items: center;
                padding: 10px;
                border-bottom: 1px solid #c4c4c420;
                font-size: 16px;
                line-height: 19px;
                cursor: pointer;

                &:hover {
                  background: @gradient-color-primary;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 6px;
                }

                &.active {
                  background: @gradient-color-primary;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                }

                &:last-child {
                  border-bottom: none;
                }

                img {
                  margin-right: 20px;
                }
              }
            }
          }
        }

        .farm-table {
          .farm-table-mobile {
            margin-top: 15px;
            background: transparent;
          }

          .farm-item {
            display: flex;
            padding: 24px 18px;
            background: @gradient-color-labelized;
            border-radius: 5px;
            margin-top: 10px;

            @media @max-b-mobile {
              display: block;
              padding: 0;
              background: @color-bg-dark !important;
              border-radius: 0;
              margin-top: 0;
            }

            &:first-child {
              margin-top: 0;
            }

            &.permissionless {
              background: @gradient-color-permissionless;

              &:hover {
                background: @gradient-color-permissionless-brighter;
              }
            }

            &.labelized {
              background: @gradient-color-labelized;
              &:hover {
                background: @gradient-color-labelized-brighter;
              }
            }

            .state {
              .title {
                font-size: 18px;
                line-height: 15px;
                font-weight: 400;
                display: flex;

                @media @max-b-mobile {
                  font-size: 12px;
                  color: rgba(255, 255, 255, 0.5);
                }
              }

              .value {
                margin-top: 10px;
                font-size: 20px;
                line-height: 24px;
                font-weight: 400;
                word-break: break-all;

                @media @max-b-mobile {
                  margin-top: 5px;
                  font-size: 14px;
                  line-height: 17px;
                }
              }

              .btn-container-harvest {
                position: absolute;
                bottom: 10px;

                @media @max-b-mobile {
                  position: relative;
                  bottom: unset;
                }
              }
            }

            .lp-icons {
              .lp-farm {
                display: flex;
                align-items: center;

                @media @max-b-mobile {
                  justify-content: space-between;
                }

                .lp-icons-group {
                  height: 44px;
                  background: @gradient-color-outline;
                  background-origin: border-box;
                  border-radius: 8px;
                  padding: 2px;
                  width: 240px;

                  @media @max-b-mobile {
                    height: 30px;
                    width: 160px;
                  }

                  .icons {
                    height: 100%;
                    background-color: @color-bg;
                    border-radius: 8px;
                    align-items: center;
                    justify-content: center;

                    img {
                      @media @max-b-mobile {
                        width: 12px;
                        height: 12px;
                      }
                    }

                    span {
                      margin-left: 5px;
                      margin-right: 5px;
                      font-weight: 400;
                      font-size: 18px;
                      line-height: 21px;

                      &:last-child {
                        margin-right: 0;
                      }

                      @media @max-b-mobile {
                        font-size: 15px;
                        line-height: 18px;
                      }
                    }
                  }
                }
              }

              .farm-labels {
                margin-top: 15px;
                display: flex;

                @media @max-b-mobile {
                  margin-top: 0;
                }

                .label {
                  border-radius: 6px;
                  padding: 5px 9px;
                  font-size: 14px;
                  font-weight: 400;
                  width: fit-content;
                  margin-right: 10px;

                  &:last-child {
                    margin-right: 0;
                  }

                  &.labelized {
                    background: @color-labelized;
                  }

                  &.permissionless {
                    background: @color-permissionless;
                  }

                  &.ended {
                    border: 2px solid @color-ended;
                    font-size: 14px;
                    line-height: 17px;
                    color: @color-ended;
                    text-transform: uppercase;
                  }

                  &.dual {
                    border: 2px solid @color-dual;
                    font-size: 14px;
                    line-height: 17px;
                    color: @color-dual;
                    text-transform: uppercase;
                  }

                  &.new {
                    border: 2px solid @color-new;
                    font-size: 14px;
                    line-height: 17px;
                    color: @color-new;
                    text-transform: uppercase;
                  }

                  @media @max-b-mobile {
                    font-weight: 600 !important;
                    font-size: 10px !important;
                    padding: 0 4px;
                    margin-right: 5px;

                    &.ended,
                    &.dual,
                    &.new {
                      text-transform: unset;
                    }
                  }
                }
              }
            }

            .farm-mobile-section {
              padding: 10px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.2);

              &.btn-show-collapse {
                text-align: center;
                cursor: pointer;
                border-bottom: none;

                @media @max-b-mobile {
                  padding: 5px;
                }
              }

              &.btn-hide-collapse {
                text-align: center;
                cursor: pointer;
                border-bottom: none;

                .btn-hide-collapse-icon {
                  margin-top: 5px;
                  transform: rotate(180deg);
                }
              }
            }

            .social-icons-group {
              display: flex;
              margin-left: 15px;

              @media @max-b-mobile {
                margin-left: 0;
              }

              .social-icon {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: @gradient-color-icon;

                @media @max-b-mobile {
                  width: 24px;
                  height: 24px;
                  background: @gradient-color-social;
                }

                &:first-child {
                  margin-right: 5px;
                }
              }
            }

            .farm-infos {
              margin-top: 15px;

              @media @max-b-mobile {
                margin-top: 0;
              }

              .farm-info-group {
                display: flex;
                align-items: center;

                @media @max-b-mobile {
                  font-size: 12px;
                  line-height: 15px;
                }

                .farm-info-img {
                  width: 20px;
                  display: flex;
                  opacity: 0.5;
                }
              }
            }

            .details {
              top: 50%;
              transform: translate(0, -50%);
              position: absolute;
              right: 17px;
              margin-top: unset;
            }
          }
        }
      }
    }
  }

  // global used styles
  p {
    margin-bottom: 0;
  }

  .pagination-container {
    text-align: center;
    width: 100%;
    margin-top: 30px;

    .pagination-body {
      width: 80%;
      display: inline-block;
    }
  }

  .btn-container {
    width: 100%;
    max-width: 150px;
    background: @gradient-color-fill;
    border-radius: 8px;
    border: none;
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0;
    }

    button {
      height: 100%;
      width: 100%;
      border-radius: 8px;
      border: none;
      color: #fff;

      @media @max-b-mobile {
        font-size: 12px !important;
        line-height: 14px !important;
        font-weight: 600 !important;
      }
    }

    &.btn-container-outline {
      height: 28px;
      padding: 2px;

      @media @max-b-mobile {
        height: 35px;
      }

      button {
        font-size: 10px;
        line-height: 24px;
        font-weight: 400;
        background: #0b2e6a !important;
      }
    }

    &.btn-container-fill {
      height: 52px;

      @media @max-b-mobile {
        margin-bottom: 10px;
      }

      button {
        font-size: 14px;
        line-height: 24px;
        font-weight: 600;
        background: transparent !important;
      }
    }

    &.btn-container-harvest {
      height: 28px;
      background: @gradient-color-outline;

      @media @max-b-mobile {
        height: 35px;
      }

      button {
        font-size: 12px;
        line-height: 24px;
        font-weight: 400;
        background: transparent !important;
      }
    }

    &.btn-container-harvest button:disabled {
      background: @gradient-color-disable !important;
      color: #fff;
    }
  }

  .noDesktop {
    display: none;

    @media @max-b-mobile {
      display: block;
    }
  }

  .noMobile {
    @media @max-b-mobile {
      display: none !important;
    }
  }
}
</style>

<style lang="less">
::-webkit-scrollbar {
  @media @max-b-mobile {
    display: none; /* Chrome Safari */
  }
}

// ant design customization

.farm {
  .page-content {
    .tool-bar {
      .tool-option {
        .input-search {
          .ant-input-prefix {
            left: 10%;
            font-size: 20px;
            color: white;
          }

          .ant-input {
            padding: 0 10% 0 25%;
            height: 100% !important;
            border: none;
            border-radius: 14px;

            @media @max-b-mobile {
              font-size: 14px;
              line-height: 17px;
            }

            &::placeholder {
              color: white;
              opacity: 0.5;
            }

            &:focus {
              box-shadow: none;
            }
          }
        }
      }
    }
  }
}

.ant-collapse {
  border: none;

  .ant-collapse-item {
    border: none !important;
    margin-bottom: 12px;
    border-radius: 8px;
    overflow: hidden;

    &:last-child {
      margin-bottom: 0;
    }

    .ant-collapse-header {
      padding: 0 !important;
    }

    .ant-collapse-content {
      border: none !important;

      .ant-collapse-content-box {
        padding: 0;
      }
    }
  }

  .ant-collapse-item-disabled > .ant-collapse-header {
    color: unset;
  }
}

.ant-tooltip-arrow {
  display: none;
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
</style>