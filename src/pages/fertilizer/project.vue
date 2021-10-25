<template>
  <div>
    <div class="fertilizeruniq cont" v-if="initialized">
      <img class="planet-left" src="@/assets/Green Planet 1.png" />
      <div
        v-for="farm in labelizedAmms"
        :key="farm.ammId"
        slot="header"
        class="pf-record"
        :class="isMobile ? 'is-mobile card' : ' card'"
        :gutter="0"
      >
        <TwitterRetweetReg
          :farm="farm"
          :show="registerTwitterRetweet"
          @onClose="
            () => {
              registerTwitterRetweet = false
              updateFarms()
            }
          "
        />

        <div class="card-body" style="grid-row-gap: 0; row-gap: 0; padding-bottom: 15px">
          <div class="modTitle">{{ farm.tokenA.symbol }}-{{ farm.tokenB.symbol }}</div>
          <div class="fertilizer-project-header">
            <div class="title">
              {{ farm.title }}
              <a v-show="farm.links.banner" :href="farm.website.url" target="_blank">
                <img class="social-icon" src="@/assets/icons/link_grey.svg" />
              </a>
              <a v-show="farm.links.twitter" :href="farm.links.twitter" target="_blank">
                <img class="social-icon" src="@/assets/icons/twitter_grey.svg" />
              </a>
              <a v-show="farm.links.telegram" :href="farm.links.telegram" target="_blank">
                <img class="social-icon" src="@/assets/icons/telegram_grey.svg" />
              </a>
            </div>

            <Row v-if="poolType" :class="isMobile ? 'is-mobile' : '' + 'collapse-row'" :gutter="24">
              <Col :span="!isMobile ? 12 : 24" class="header-left-col">
                <div class="followerscount">
                  <span>{{ followerCount }} </span> Followers
                </div>

                <div class="tags-group">
                  <div
                    v-for="tag in farm.tags"
                    :key="tag.label"
                    class="tag label"
                    :style="'background-color: ' + tag.color"
                  >
                    {{ tag.label }}
                  </div>
                </div>

                <div class="desc">{{ farm.desc }}</div>
              </Col>

              <Col :span="!isMobile ? 12 : 24" class="header-right-col">
                <div class="largepdding" v-if="!wallet.connected">
                  <div class="btncontainer">
                    <Button
                      size="large"
                      ghost
                      class="button_div"
                      style="z-index: 999; width: 100%"
                      @click="$accessor.wallet.openModal"
                    >
                      Connect wallet
                    </Button>
                  </div>
                </div>

                <div v-else-if="farm.pla_ts > currentTimestamp && !followed" class="largepdding">
                  <div class="share text-center">
                    <div class="btncontainer">
                      <Button
                        size="large"
                        ghost
                        class="button_div"
                        style="z-index: 999; width: 100%"
                        @click="
                          startFollow(
                            'https://api.cropper.finance/pfo/follow/?spl=' +
                              $accessor.wallet.address +
                              '&farmId=' +
                              farm.pfarmID
                          )
                        "
                      >
                        + Follow
                      </Button>
                    </div>
                  </div>
                </div>

                <div v-else-if="farm.pla_ts > currentTimestamp && followed" class="largepdding">
                  <!-- <div class="share text-center">You are following this project</div> -->
                </div>

                <div v-else-if="farm.pla_end_ts > currentTimestamp && !isRegistered" class="largepdding">
                  <div class="btncontainer">
                    <Button
                      size="large"
                      ghost
                      class="button_div"
                      style="z-index: 999; width: 100%"
                      @click="startRegistering()"
                    >
                      + Register for Whitelist
                    </Button>
                  </div>
                </div>

                <div v-else-if="farm.pla_end_ts > currentTimestamp && isRegistered">
                  <div class="share-ticket">Lottery ticket: {{ registeredDatas.submit }}</div>

                  <div class="share-content">Share your referal link to earn more lottery ticket</div>

                  <div class="share-copy-form">
                    <div class="inputContent">
                      <button class="submitbutton" @click="copyToClipboard()">Copy</button>
                      <input type="text" class="twlink" :value="shareWalletAddress" />
                    </div>
                  </div>
                </div>

                <div v-else-if="farm.pla_end_ts < currentTimestamp && isRegistered">
                  <div v-if="farm.airdrop.status == 'lottery'" class="share-ticket">
                    Lottery ticket: {{ registeredDatas.submit }}
                  </div>
                  <div v-if="farm.airdrop.status == 'in progress'" class="share-ticket">
                    Winning ticket: {{ registeredDatas.won }}/{{ registeredDatas.submit }}
                  </div>

                  <div class="share-content">Share your referal link to earn more lottery ticket</div>

                  <div class="share-copy-form">
                    <div class="inputContent">
                      <button class="submitbutton" @click="copyToClipboard()">Copy</button>
                      <input type="text" class="twlink" :value="shareWalletAddress" />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <div class="fertilizer-project-body">
            <Row class="full-border">
              <Col :span="24" class="">
                <div>
                  <img width="100%" :src="farm.links.banner" />
                </div>
              </Col>
            </Row>

            <!-- PC list -->
            <div class="list pc-list" v-if="initialized">
              <Row class="farm-head table-head">
                <Col class="state lp-icons" :span="isMobile ? 24 : 5">
                  <div class="title">Farm name</div>
                </Col>
                <Col class="state" :span="isMobile ? 24 : 3">
                  <div class="title">Farm duration</div>
                </Col>
                <Col class="state" :span="isMobile ? 24 : 4">
                  <div class="title">Project website</div>
                </Col>
                <Col class="state" :span="isMobile ? 24 : 3">
                  <div class="title">Airdrop event</div>
                </Col>
                <Col class="state" :span="isMobile ? 24 : 6">
                  <div class="title">NFT Founders</div>
                </Col>
                <Col class="state" :span="isMobile ? 24 : 3">
                  <div class="title">Status</div>
                </Col>
              </Row>

              <Row slot="header" class="farm-head" :class="isMobile ? 'is-mobile' : ''" :gutter="0">
                <Col class="lp-icons state" :span="isMobile ? 24 : 5">
                  <div class="lp-icons-group">
                    <div class="icons">
                      <CoinIcon :mint-address="farm.tokenA.mint" />
                      <span>{{ farm.tokenA.symbol }}</span>
                      <div>-</div>
                      <CoinIcon :mint-address="farm.tokenB.mint" />
                      <span>{{ farm.tokenB.symbol }}</span>
                    </div>
                  </div>
                </Col>
                <Col class="state" :span="isMobile ? 24 : 3">
                  {{ farm.duration }}
                </Col>
                <Col class="state" :span="isMobile ? 24 : 4">
                  <a :href="farm.website.url" target="_blank">{{ farm.website.display }}</a>
                </Col>
                <Col class="state" :span="isMobile ? 24 : 3">
                  {{ farm.airdrop.amount }} ${{ farm.airdrop.symbol }}
                </Col>
                <Col class="state" :span="isMobile ? 24 : 6">
                  <div v-if="farm.nft_airdrop" class="nft-events-icon">
                    <img v-for="nft in farm.nft_airdrop.list" :key="nft.picto" :src="nft.picto" />
                  </div>
                </Col>
                <Col class="state" :span="isMobile ? 24 : 3">
                  <div class="label" :style="'background-color: ' + farm.current_status.color">
                    {{ farm.current_status.label }}
                  </div>
                </Col>
              </Row>
            </div>

            <!-- Mobile list -->
            <div class="list mobile-list" v-if="initialized">
              <Row slot="header" class="farm-head">
                <Col class="lp-icons" :span="24">
                  <div class="lp-icons-group">
                    <div class="icons">
                      <CoinIcon :mint-address="farm.tokenA.mint" />
                      <span>{{ farm.tokenA.symbol }}</span>
                      <div>-</div>
                      <CoinIcon :mint-address="farm.tokenB.mint" />
                      <span>{{ farm.tokenB.symbol }}</span>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row class="farm-head">
                <Col class="state" :span="12">
                  <div class="title">Farm duration</div>
                </Col>
                <Col class="state" :span="12">
                  {{ farm.duration }}
                </Col>
              </Row>
              <Row class="farm-head">
                <Col class="state" :span="12">
                  <div class="title">Airdrop event</div>
                </Col>
                <Col class="state" :span="12"> {{ farm.airdrop.amount }} ${{ farm.airdrop.symbol }} </Col>
              </Row>
              <Row class="farm-head">
                <Col class="state" :span="12">
                  <div class="title">NFT Founders</div>
                </Col>
                <Col class="state" :span="12">
                  <div v-if="farm.nft_airdrop" class="nft-events-icon">
                    <img v-for="nft in farm.nft_airdrop.list" :key="nft.picto" :src="nft.picto" />
                  </div>
                </Col>
              </Row>
              <Row class="farm-head">
                <Col class="state" :span="12">
                  <div class="title">Status</div>
                </Col>
                <Col class="state" :span="12">
                  <div class="label" :style="'background-color: ' + farm.current_status.color">
                    {{ farm.current_status.label }}
                  </div>
                </Col>
              </Row>
            </div>

            <div class="list" v-if="initialized">
              <Row class="full-border pf-margin-top pf-padding-top" :span="isMobile ? 24 : 12">
                <Col :span="24" class="steps">
                  <div class="done">
                    <span class="span first"><img src="@/assets/icons/check-one.svg" alt="" /></span>
                    <div>
                      <div>Initialisation</div>
                      <label>-</label>
                      This project is in preparation phase. Stay tuned.<br />
                    </div>
                  </div>
                  <div :class="farm.pla_ts < currentTimestamp ? 'done' : 'notdone'">
                    <span v-if="farm.pla_ts > currentTimestamp">2</span>
                    <span v-else class="span"><img src="@/assets/icons/check-one.svg" alt="" /></span>
                    <div>
                      <div>Whitelist</div>
                      <label>-</label>
                      <div class="date" :style="'background-color: ' + farm.current_status.color">{{ farm.pla }}</div>
                      You can now whitelist yourself for the lottery.<br />
                    </div>
                  </div>
                  <div :class="farm.pla_end_ts < currentTimestamp ? 'done' : 'notdone'">
                    <span v-if="farm.pla_end_ts > currentTimestamp">3</span>
                    <span v-else class="span"><img src="@/assets/icons/check-one.svg" alt="" /></span>
                    <div>
                      <div>{{ farm.tokenA.symbol }}-{{ farm.tokenB.symbol }}</div>
                      <label>-</label>
                       <div class="date" :style="'background-color: ' + farm.current_status.color">
                        {{ farm.pla_end }}
                      </div>
                      farm is in preparation.<br />
                    </div>
                  </div>
                  <div :class="farm.pfrom_ts < currentTimestamp ? 'done' : 'notdone'">
                    <span v-if="farm.pfrom_ts > currentTimestamp">4</span>
                    <span v-else class="span"><img src="@/assets/icons/check-one.svg" alt="" /></span>
                    <div>
                      <div>Private Farm</div>
                      <label>-</label>
                      <div class="date" :style="'background-color: ' + farm.current_status.color">{{ farm.pfrom }}</div>
                      You can now stake LP in {{ farm.tokenA.symbol }}-{{ farm.tokenB.symbol }} farm.<br />
                    </div>
                  </div>
                  <div :class="farm.pto_ts < currentTimestamp ? 'done' : 'notdone'">
                    <span v-if="farm.pto_ts > currentTimestamp">5</span>
                    <span v-else class="span"><img src="@/assets/icons/check-one.svg" alt="" /></span>
                    <div>
                      <div>Public Farm</div>
                      <label>-</label>
                      <div class="date" :style="'background-color: ' + farm.current_status.color">{{ farm.pto }}</div>
                      {{ farm.tokenA.symbol }}-{{ farm.tokenB.symbol }} farm goes public + Airdrop lottery<br />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <Row class="copy-link-mobile" :span="24">
              <div v-if="isRegistered">
                <div class="share-content">Share your referal link to earn more lottery ticket</div>

                <div class="share-copy-form">
                  <div class="inputContent">
                    <button class="submitbutton" @click="copyToClipboard()">Copy</button>
                    <input type="text" class="twlink" :value="shareWalletAddress" />
                  </div>
                </div>
              </div>
            </Row>

            <Row class="status-log" :span="24">
              <div class="largepdding" v-if="!wallet.connected">
                <div class="btncontainer">
                  <Button
                    size="large"
                    ghost
                    class="button_div"
                    style="z-index: 999; width: 100%"
                    @click="$accessor.wallet.openModal"
                  >
                    Connect wallet
                  </Button>
                </div>
              </div>

              <div v-else-if="farm.pla_ts > currentTimestamp && !followed" class="largepdding">
                <div class="share text-center">
                  <div class="btncontainer">
                    <Button
                      size="large"
                      ghost
                      class="button_div"
                      style="z-index: 999; width: 100%"
                      @click="
                        startFollow(
                          'https://api.cropper.finance/pfo/follow/?spl=' +
                            $accessor.wallet.address +
                            '&farmId=' +
                            farm.pfarmID
                        )
                      "
                    >
                      + Follow
                    </Button>
                  </div>
                </div>
              </div>

              <div v-else-if="farm.pla_ts > currentTimestamp && followed" class="largepdding">
                <div class="share text-center">You are following this project</div>
              </div>

              <div v-else-if="farm.pla_end_ts > currentTimestamp && !isRegistered" class="largepdding">
                <div class="btncontainer">
                  <Button
                    size="large"
                    ghost
                    class="button_div"
                    style="z-index: 999; width: 100%"
                    @click="startRegistering()"
                  >
                    + Register for Whitelist
                  </Button>
                </div>
              </div>

              <div v-else-if="farm.pla_end_ts > currentTimestamp && isRegistered">
                <div class="share">
                  You’ve well registered into the whitelist. You have {{ registeredDatas.submit }} lottery ticket{{
                    registeredDatas.submit > 1 ? 's' : ''
                  }}
                  !
                </div>
              </div>

              <div v-else-if="farm.pto_ts < currentTimestamp && isRegistered">
                <div class="share">
                  <span v-if="farm.airdrop.status == 'lottery'">
                    You’ve well registered into the whitelist. You have {{ registeredDatas.submit }} lottery ticket{{
                      registeredDatas.submit > 1 ? 's' : ''
                    }}! <br /><br />
                    Lottery in progress...
                  </span>
                  <div v-else-if="farm.airdrop.status == 'in progress'">
                    <span v-if="registeredDatas.won == 0 && registeredDatas.won_nft == 0">
                      Oops! You don't have any winning tickets.
                    </span>
                    <span v-else-if="registeredDatas.won">
                      Congratulation! You've won a {{ farm.airdrop.singleValue }} airdrop.
                    </span>
                    <span v-else-if="registeredDatas.won_nft">
                      Congratulation! You've won a Founder's collector NFT
                    </span>
                    <br /><br />
                    Prize distribution in progress...
                  </div>
                </div>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </div>

    <div v-for="farm in showFarms" :key="farm.farmInfo.poolId">
      <div v-if="farm.labelized.pfrom_ts < currentTimestamp && isRegistered" class="farm container">
        <div class="card">
          <div class="card-body">
            <Collapse v-model="showCollapse" expand-icon-position="right">
              <CollapsePanel v-for="farm in showFarms" v-show="true" :key="farm.farmInfo.poolId" :show-arrow="poolType">
                <Row slot="header" class="farm-head" :class="isMobile ? 'is-mobile' : ''" :gutter="0">
                  <div v-if="farm.labelized" class="labelized">LABELIZED</div>
                  <Col class="lp-icons" :span="isMobile ? 12 : 8">
                    <div v-if="currentTimestamp > farm.farmInfo.poolInfo.end_timestamp" class="label ended">Ended</div>
                    <div
                      v-if="
                        currentTimestamp < farm.farmInfo.poolInfo.start_timestamp &&
                        currentTimestamp < farm.farmInfo.poolInfo.end_timestamp
                      "
                      class="label soon"
                    >
                      Soon
                    </div>

                    <div class="icons">
                      <CoinIcon :mint-address="farm.farmInfo.lp.coin.mintAddress" />
                      <CoinIcon :mint-address="farm.farmInfo.lp.pc.mintAddress" />
                    </div>
                    {{ isMobile ? farm.farmInfo.lp.symbol : farm.farmInfo.lp.name }}
                  </Col>
                  <Col class="state" :span="isMobile ? 6 : 4">
                    <div class="title">{{ isMobile ? 'Reward' : 'Pending Reward' }}</div>

                    <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="value">-</div>
                    <div v-else class="value">{{ !wallet.connected ? 0 : farm.userInfo.pendingReward.format() }}</div>
                  </Col>
                  <Col v-if="!isMobile" class="state" :span="4">
                    <div class="title">
                      Staked
                      <Tooltip
                        placement="right"
                        v-if="
                          wallet &&
                          !(
                            farm.farmInfo.poolInfo.start_timestamp > currentTimestamp ||
                            currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                          ) &&
                          farm.farmInfo.currentLPtokens > 0.001
                        "
                      >
                        <template slot="title">
                          <div>You got {{ farm.farmInfo.currentLPtokens }} unstaked</div>
                        </template>
                        <Icon type="question-circle" style="color: #f00" />
                      </Tooltip>
                    </div>
                    <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="value">-</div>
                    <div v-else class="value">
                      {{ !wallet.connected ? 0 : farm.userInfo.depositBalance.format() }}
                    </div>
                  </Col>
                  <Col class="state" :span="isMobile ? 6 : 4">
                    <div class="title">
                      Total Apr
                      <Tooltip
                        placement="right"
                        v-if="
                          !(
                            farm.farmInfo.poolInfo.start_timestamp > currentTimestamp ||
                            currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                          )
                        "
                      >
                        <template slot="title">
                          <div>
                            Farm APR : {{ farm.farmInfo.apr_details.apr }}%<br />
                            Fees : {{ farm.farmInfo.apr_details.apy }}%
                          </div>
                        </template>
                        <Icon type="question-circle" />
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
                    <div v-else class="value">{{ farm.farmInfo.apr }}%</div>
                  </Col>
                  <Col v-if="!isMobile && poolType" class="state" :span="4">
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
                      ${{
                        Math.round(farm.farmInfo.liquidityUsdValue)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}
                    </div>
                  </Col>
                  <Col v-if="!isMobile && !poolType" class="state" :span="4">
                    <Button v-if="!wallet.connected" size="large" ghost @click.stop="$accessor.wallet.openModal">
                      Connect Wallet
                    </Button>
                    <div v-else class="fs-container">
                      <Button
                        :disabled="!wallet.connected || farm.userInfo.depositBalance.isNullOrZero()"
                        size="large"
                        ghost
                        @click.stop="openUnstakeModal(farm.farmInfo, farm.farmInfo.lp, farm.userInfo.depositBalance)"
                      >
                        Harvest & Unstake
                      </Button>
                    </div>
                  </Col>
                </Row>

                <Row v-if="poolType" :class="isMobile ? 'is-mobile' : ''" :gutter="48">
                  <Col :span="isMobile ? 24 : 4"> </Col>

                  <Col :span="isMobile ? 24 : 10">
                    <div class="harvest">
                      <div class="title">Pending Reward</div>
                      <div class="pending fs-container">
                        <div class="reward">
                          <div class="token">
                            {{ farm.farmInfo.reward.symbol }}
                            {{ !wallet.connected ? 0 : farm.userInfo.pendingReward.format() }}
                          </div>
                        </div>
                        <div class="btncontainer">
                          <Button
                            size="large"
                            ghost
                            :disabled="!wallet.connected || harvesting || farm.userInfo.pendingReward.isNullOrZero()"
                            :loading="harvesting"
                            @click="harvest(farm.farmInfo)"
                          >
                            Harvest
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col :span="isMobile ? 24 : 10">
                    <div class="start">
                      <div class="title">Start farming</div>
                      <div v-if="!wallet.connected" @click="$accessor.wallet.openModal" class="btncontainer">
                        <Button size="large" ghost> Connect Wallet </Button>
                      </div>
                      <div v-else class="fs-container">
                        <div class="btncontainer" v-if="!farm.userInfo.depositBalance.isNullOrZero()">
                          <Button
                            class="unstake"
                            size="large"
                            ghost
                            @click="openUnstakeModal(farm.farmInfo, farm.farmInfo.lp, farm.userInfo.depositBalance)"
                          >
                            <Icon type="minus" />
                          </Button>
                        </div>
                        <div
                          class="btncontainer"
                          v-if="
                            currentTimestamp < farm.farmInfo.poolInfo.end_timestamp &&
                            farm.farmInfo.poolInfo.start_timestamp < currentTimestamp
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
                            @click="openStakeModal(farm.farmInfo, farm.farmInfo.lp)"
                          >
                            {{
                              !farm.farmInfo.poolInfo.is_allowed
                                ? 'Not Allowed'
                                : currentTimestamp > farm.farmInfo.poolInfo.end_timestamp
                                ? 'Ended'
                                : farm.farmInfo.poolInfo.start_timestamp > currentTimestamp
                                ? 'Unstarted'
                                : 'Stake'
                            }}
                          </Button>
                        </div>

                        <div
                          class="btncontainer"
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
                                : 'Stake LP'
                            }}
                          </Button>
                        </div>

                        <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="unstarted">
                          <div class="token">
                            {{ getCountdownFromPeriod(farm.farmInfo.poolInfo.start_timestamp - currentTimestamp) }}
                          </div>
                        </div>

                        <div
                          class="btncontainer"
                          v-if="
                            farm.farmInfo.poolInfo.owner.toBase58() == wallet.address &&
                            farm.farmInfo.poolInfo.is_allowed &&
                            currentTimestamp < farm.farmInfo.poolInfo.end_timestamp
                          "
                        >
                          <Button size="large" ghost @click="openAddRewardModal(farm)"> Add Reward </Button>
                        </div>
                        <div
                          class="btncontainer"
                          v-if="
                            farm.farmInfo.poolInfo.owner.toBase58() == wallet.address &&
                            !farm.farmInfo.poolInfo.is_allowed &&
                            currentTimestamp < farm.farmInfo.poolInfo.end_timestamp
                          "
                        >
                          <Button size="large" ghost @click="payFarmFee(farm)"> Pay Farm Fee </Button>
                        </div>
                      </div>

                      <div class="btncontainer">
                        <a target="_blank" :href="farm.farmInfo.twitterShare">
                          <Button size="large" ghost> Share </Button>
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CollapsePanel>
            </Collapse>
            <div style="text-align: center; width: 100%">
              <div style="width: 80%; display: inline-block">
                <Pagination
                  :total="totalCount"
                  :showTotal="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                  :pageSize="pageSize"
                  :defaultCurrent="1"
                  v-model="currentPage"
                >
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import importIcon from '@/utils/import-icon'
import { Collapse, Col, Radio, Select, Row, Switch as Toggle, Pagination } from 'ant-design-vue'
import { get, cloneDeep } from 'lodash-es'
import { TokenAmount } from '@/utils/safe-math'
import { FarmInfo } from '@/utils/farms'
import { deposit, withdraw } from '@/utils/stake'
import { getUnixTs } from '@/utils'
import { getBigNumber } from '@/utils/layouts'
import { LiquidityPoolInfo, LIQUIDITY_POOLS } from '@/utils/pools'
import moment from 'moment'
import { TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import { FarmProgram, FarmProgramAccountLayout, FARM_PREFIX, PAY_FARM_FEE, REWARD_MULTIPLER, YieldFarm } from '@/utils/farm'
import { PublicKey } from '@solana/web3.js'
import { DEVNET_MODE, FARM_PROGRAM_ID } from '@/utils/ids'
import { TOKENS, NATIVE_SOL } from '@/utils/tokens'
import { addLiquidity, removeLiquidity } from '@/utils/liquidity'
const CollapsePanel = Collapse.Panel
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

export default Vue.extend({
  components: {
    //Toggle,
    //Collapse,
    //CollapsePanel,
    //Spin,
    // Icon,
    Col,
    Row
    //Select,
    //Pagination
  },

  //    ,
  //    RadioGroup,
  //    RadioButton

  data() {
    return {
      isMobile: false,
      ammId: '',
      farms: [] as any[],
      showFarms: [] as any[],
      searchName: '',
      followerCount: 0,
      registeringProcess: false,
      followed: false,
      coinPicUrl: '',
      lp: null,
      isRegistered: false,
      registeredDatas: false,
      shareWalletAddress: '',
      twShareAdress: '',
      tgShareAdress: '',
      rewardCoin: null,
      farmInfo: null as any,
      harvesting: false,
      stakeModalOpening: false,
      addRewardModalOpening: false,
      staking: false,
      coinName: '',
      mintAddress: '',
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
      initialized: false,
      labelizedAmms: {} as any,
      labelizedFarms: {} as any,
      labelizedAmmsExtended: {} as any,
      poolsDatas: {} as any,
      nbFarmsLoaded: 0,
      certifiedOptions: [
        { value: 0, label: 'Labelized' },
        { value: 1, label: 'Permissionless' },
        { value: 2, label: 'All' }
      ],
      lifeOptions: [
        { value: 0, label: 'Opened' },
        { value: 1, label: 'Future' },
        { value: 2, label: 'Ended' },
        { value: 3, label: 'All' }
      ],
      searchCertifiedFarm: 0,
      searchLifeFarm: 0,
      stakedOnly: false,
      totalCount: 110,
      pageSize: 10,
      currentPage: 1,
      current: 0,
      registerTwitterRetweet: false
    }
  },

  head: {
    title: 'CropperFinance x ... '
  },

  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  watch: {
    'wallet.tokenAccounts': {
      handler(newTokenAccounts: any) {
        this.updateFarms()
        this.updateCurrentLp(newTokenAccounts)
      },
      deep: true
    },

    'wallet.address': {
      handler(newTokenAccounts: any) {
        this.updateFarms()
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
    }
  },

  mounted() {
    this.updateFarms()

    var hash = window.location.hash
    if (hash) {
      hash = hash.substring(1)
      this.searchName = hash
    } else {
      const query = new URLSearchParams(window.location.search)
      this.searchName = query.get('s') as string
    }

    let timer = setInterval(async () => {
      if (this.nbFarmsLoaded == Object.keys(this.labelizedAmms).length) {
        this.initialized = true
      }
    }, 1000)
  },

  methods: {
    moment,
    importIcon,
    getCoinPicUrl() {
      let token
      if (this.mintAddress == NATIVE_SOL.mintAddress) {
        token = NATIVE_SOL
      } else {
        token = Object.values(TOKENS).find((item) => item.mintAddress === this.mintAddress)
      }
      if (token) {
        this.coinName = token.symbol.toLowerCase()
        if (token.picUrl) {
          this.coinPicUrl = token.picUrl
        } else {
          this.coinPicUrl = ''
        }
      }
    },
    copyToClipboard() {
      var textField = document.createElement('textarea')
      textField.innerText = this.shareWalletAddress
      document.body.appendChild(textField)
      textField.select()
      document.execCommand('copy')
      textField.remove()
    },
    startRegistering() {
      this.registerTwitterRetweet = true
    },
    async startFollow(u: any) {
      let responseData = {}
      try {
        responseData = await fetch(u).then((res) => res.json())
      } catch {
        // dummy data
        responseData = [
          { ammID: 'ADjGcPYAu5VZWdKwhqU3cLCgX733tEaGTYaXS2TsB2hF', labelized: true },
          { ammID: '8j7uY3UiVkJprJnczC7x5c1S6kPYQnpxVUiPD7NBnKAo', labelized: true }
        ]
      } finally {
        this.followed = true
        this.updateFarms()
      }
    },
    TokenAmount,

    async updateLabelizedAmms() {
      const query = new URLSearchParams(window.location.search)
      //this.labelizedAmms = {}
      let responseData2 = {}
      let responseData: any
      try {
        responseData = await fetch('https://api.cropper.finance/farms/').then((res) => res.json())
      } catch {
        // dummy data
        responseData = [
          { ammID: 'ADjGcPYAu5VZWdKwhqU3cLCgX733tEaGTYaXS2TsB2hF', labelized: true },
          { ammID: '8j7uY3UiVkJprJnczC7x5c1S6kPYQnpxVUiPD7NBnKAo', labelized: true }
        ]
      } finally {
        responseData.forEach(async (element: any) => {
          if (element.pfo == true) {

            if (query.get('f') && element.slug == query.get('f')) {
              element.calculateNextStep = 'Bla bla bla'
              this.ammId = element.ammID
              this.labelizedAmms[element.ammID] = element
              this.labelizedAmmsExtended[element.ammID] = element
              try {
                responseData2 = await fetch(
                  'https://api.cropper.finance/pfo/?farmId=' +
                    this.labelizedAmms[element.ammID].pfarmID +
                    '&t=' +
                    Math.round(moment().unix() / 60)
                ).then((res) => res.json())
              } catch {
              } finally {

                if (responseData[this.wallet.address]) {
                  if (responseData[this.wallet.address].submit > 0) {
                    this.isRegistered = true
                    this.registeredDatas = responseData[this.wallet.address]
                    this.shareWalletAddress =
                      'http://cropper.finance/fertilizer/project/?f=' +
                      this.labelizedAmms[this.ammId].slug +
                      '&r=' +
                      this.wallet.address
                    let shareWalletAddressEsc =
                      'http://cropper.finance/fertilizer/project/?f=' +
                      this.labelizedAmms[this.ammId].slug +
                      '%26r=' +
                      this.wallet.address

                    this.twShareAdress = `http://twitter.com/share?text=Register for whishlist ${
                      document.title
                    }&url=${shareWalletAddressEsc} &hashtags=${this.labelizedAmms[this.ammId].tokenA.symbol},${
                      this.labelizedAmms[this.ammId].tokenB.symbol
                    },fertilizer,Solana,Airdrop`

                    this.tgShareAdress = `https://telegram.me/share/url?text=Register for whishlist ${document.title}&url=${shareWalletAddressEsc} `
                  }
                  this.followed = true
                }

                this.labelizedAmms[element.ammID]['followers'] = Object.keys(responseData2).length
                this.followerCount = Object.keys(responseData2).length

                //this.labelizedAmms[element.ammID].twitterShare = `http://twitter.com/share?text=Earn ${this.labelizedAmms[element.ammID].tokenA.symbol} with our new farm on @CropperFinance&url=https://cropper.finance?s=${newFarmInfo.poolId} &hashtags=${this.labelizedAmms[element.ammID].tokenA.symbol},${this.labelizedAmms[element.ammID].tokenB.symbol},yieldfarming,Solana`

                document.title = 'Fertilizer - CropperFinance x ' + element.name

                this.nbFarmsLoaded++
              }
            }
          }
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
      console.log("updating farms ...")
      await this.updateLabelizedAmms()
      this.currentTimestamp = moment().unix()

      const conn = this.$web3
      const wallet = (this as any).$accessor.wallet
      const liquidity = (this as any).$accessor.liquidity

      const farms: any = []
      const endedFarmsPoolId: string[] = []

          console.log('ici4', this.farm.infos);
      for (const [poolId, farmInfo] of Object.entries(this.farm.infos)) {
        
        let userInfo = get(this.farm.stakeAccounts, poolId)
        let isPFO = false

        // @ts-ignore
        const { reward_per_share_net, last_timestamp, end_timestamp } = farmInfo.poolInfo

        // @ts-ignore
        const { reward, lp } = farmInfo

        const newFarmInfo: any = cloneDeep(farmInfo)

          console.log('ici3', lp);

        if (reward && lp) {
          const rewardPerTimestamp = newFarmInfo.lp.balance.wei.dividedBy(end_timestamp.toNumber() - last_timestamp.toNumber());
          const rewardPerTimestampAmount = new TokenAmount(rewardPerTimestamp, reward.decimals)
          const liquidityItem = get(this.liquidity.infos, lp.mintAddress)

          const rewardPerTimestampAmountTotalValue =
            getBigNumber(rewardPerTimestampAmount.toEther()) *
            2 *
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
          const liquidityItemValue = liquidityTotalValue / liquidityTotalSupply
          let liquidityUsdValue = getBigNumber(lp.balance.toEther()) * liquidityItemValue
          let apr = ((rewardPerTimestampAmountTotalValue / liquidityUsdValue) * 100).toFixed(2)
          if (apr === 'NaN' || apr === 'Infinity') {
            apr = '0'
          }
          if (isNaN(liquidityUsdValue)) {
            liquidityUsdValue = 0
          }
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
        }
        if (userInfo && lp) {
          userInfo = cloneDeep(userInfo)

          const { rewardDebt, depositBalance } = userInfo
          let currentTimestamp = this.currentTimestamp

          
          if(currentTimestamp > end_timestamp.toNumber()){
            currentTimestamp = end_timestamp.toNumber();
          }
          
          const duration = currentTimestamp - last_timestamp.toNumber()
          
          const rewardPerTimestamp = newFarmInfo.reward.balance.wei.dividedBy(end_timestamp.toNumber() - last_timestamp.toNumber());
          const rewardPerShareCalc = rewardPerTimestamp
            .multipliedBy(duration)
            .multipliedBy(REWARD_MULTIPLER)
            .dividedBy(newFarmInfo.lp.balance.wei)
            .plus(getBigNumber(reward_per_share_net));
          
          const pendingReward = depositBalance.wei
            .multipliedBy(rewardPerShareCalc)
            .dividedBy(REWARD_MULTIPLER)
            .minus(rewardDebt.wei)
            
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
          console.log('ic0', 
          lp, 
          this.labelizedAmmsExtended[newFarmInfo.poolId]?.pfo, 
          newFarmInfo.poolId, 
          this.labelizedAmmsExtended[newFarmInfo.poolId]?.pfarmID, newFarmInfo);
              labelized = true
              const query = new URLSearchParams(window.location.search)
              if (
                this.labelizedAmmsExtended[newFarmInfo.poolId]?.pfo == true &&
                (query.get('f') && this.labelizedAmmsExtended[newFarmInfo.poolId]?.slug == query.get('f'))

              ) {
              console.log('hhhhheeee');
                isPFO = true
              }
            }
          }

          ;(newFarmInfo as any).twitterShare = `http://twitter.com/share?text=Earn ${
            (newFarmInfo as any).reward.name
          } with our new farm on @CropperFinance&url=https://cropper.finance/farms/?s=${
            (newFarmInfo as any).poolId
          } &hashtags=${(newFarmInfo as any).lp.coin.symbol},${(newFarmInfo as any).lp.pc.symbol},yieldfarming,Solana`

          if (isPFO) {
            farms.push({
              labelized,
              userInfo,
              farmInfo: newFarmInfo
            })
          }

          console.log('here');
        }
      }

      this.farms = farms.sort((a: any, b: any) => b.farmInfo.liquidityUsdValue - a.farmInfo.liquidityUsdValue)
      this.endedFarmsPoolId = endedFarmsPoolId
      this.showFarms = this.farms

          console.log(this.farms, farms);
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

    openStakeModal(poolInfo: FarmInfo, lp: any) {
      /*
      const coin = cloneDeep(lp)
      const lpBalance = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
      coin.balance = lpBalance

      this.lp = coin
      */
      this.farmInfo = cloneDeep(poolInfo)
      const coinBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.coin.mintAddress}.balance`)
      const pcBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.pc.mintAddress}.balance`)
      this.farmInfo.lp.coin.balance = coinBalance
      this.farmInfo.lp.pc.balance = pcBalance
      this.stakeModalOpening = true
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
          })
          .finally(() => {
            this.adding = false
            this.addRewardModalOpening = false
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
          })
          .finally(() => {
            this.paying = false
          })
      }
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
        })
        .finally(() => {
          this.staking = false
          this.stakeModalOpening = false
          this.farmInfo = null
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
            return
          }
          let value = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
          value = value.wei.toNumber() / Math.pow(10, value.decimals)
          if (value <= 0) {
            console.log('remove lp amount is 0')
            return
          }
          value = value.toString()

          this.removeLP(conn, wallet, lp, lpAccount, fromCoinAccount, toCoinAccount, value)
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Stake failed',
            description: error.message
          })
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
        })
        .finally(() => {
          this.unstaking = false
          this.unstakeModalOpening = false
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
        })
        .finally(() => {
          this.$accessor.farm.requestInfos()
          this.harvesting = false
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
    }
  }
})
</script>

<style lang="less" scoped>
@import '../../styles/variables';

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.fertilizeruniq {
  max-width: 1200px;
  margin: 30px auto;

  .planet-left {
    position: absolute;
    left: 0;
    top: 35%;
  }

  .notstep {
    padding: 20px;
  }

  .card-body {
    padding: 0;
    margin: 0;
    border: none;

    .fertilizer-project-header {
      background: #0e1046;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-sizing: border-box;
      border-radius: 14px;
      padding: 32px 50px;

      @media (max-width: @mobile-b-width) {
        margin-left: 20px;
        margin-right: 20px;
        padding: 10px;
      }

      .ant-row {
        height: 100% !important;

        .header-left-col {
          @media (max-width: @mobile-b-width) {
            width: 100%;
          }
        }

        .header-right-col {
          height: 100%;
          justify-content: right;
          display: flex;
          align-items: center;

          @media (max-width: @mobile-b-width) {
            display: none;
          }
        }
      }

      .title {
        font-size: 25px;
        font-style: normal;
        font-weight: 700;
        line-height: 31px;
        letter-spacing: 0;
        text-align: left;

        .social-icon {
          color: #8c8da7;
          margin-left: 16px;
        }
      }

      .tags-group {
        display: flex;
        align-items: center;
        margin: 15px 0;

        .tag {
          margin-right: 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 400;
          padding: 6px;
        }
      }

      .desc {
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0;
        text-align: left;

        @media (max-width: @mobile-b-width) {
          font-size: 16px;
          line-height: 20px;
          font-weight: 700;
        }
      }

      .btncontainer {
        background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
        border: 2px solid rgba(255, 255, 255, 0.14);
        border-radius: 8px;
        color: #fff;
        height: 60px;
        min-width: 163px;
        line-height: 60px;
        display: flex;

        button {
          font-style: normal;
          font-weight: normal;
          font-size: 18px;
          line-height: 42px;
          text-align: center;
          letter-spacing: -0.05em;
          color: #fff;
          background: transparent !important;
          width: 100%;
          height: 100%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .followerscount {
        text-align: left;
        font-weight: normal;
        font-size: 18px;
        line-height: 22px;
        margin-top: 15px;
      }

      .followerscount span {
        font-weight: normal;
        font-size: 25px;
        line-height: 30px;
        color: #00dbb9;
      }
    }

    .fertilizer-project-body {
      margin-top: 15px;
      background: #0e1046;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-sizing: border-box;
      border-radius: 14px;
      padding: 20px 25px;

      @media (max-width: @mobile-b-width) {
        margin-left: 20px;
        margin-right: 20px;
        padding: 10px;
      }

      .status-log {
        display: flex;
        justify-content: center;

        .largepdding .btncontainer {
          background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
          border: 2px solid rgba(255, 255, 255, 0.14);
          border-radius: 8px;
          color: #fff;
          height: 60px;
          min-width: 163px;
          line-height: 60px;
          display: flex;

          @media (max-width: @mobile-b-width) {
            height: 44px;
            min-width: 105px;
          }

          button {
            font-style: normal;
            font-weight: normal;
            font-size: 18px;
            line-height: 42px;
            text-align: center;
            letter-spacing: -0.05em;
            color: #fff;
            background: transparent !important;
            width: 100%;
            height: 100%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;

            @media (max-width: @mobile-b-width) {
              height: 40px;
              font-size: 14px;
            }
          }
        }
      }

      .list {
        text-align: center;
        max-width: 1300px;
        margin-top: 20px;

        .pf-record .pf-record-content {
          padding: 0;
        }

        .farm-head {
          display: flex;
          align-items: center;

          .nft-events-icon {
            display: flex;
            justify-content: space-evenly;
            width: 100%;
          }

          .state {
            font-size: 18px;
            line-height: 22px;
            font-weight: normal;
            display: flex;
            justify-content: space-evenly;

            a {
              color: #5ba5fb;
              text-decoration: underline;
            }

            .title {
              color: #fff;
              opacity: 0.5;
            }

            .label {
              border-radius: 4px;
              font-size: 14px;
              font-weight: 400;
              line-height: 17px;
              padding: 6px 7px 4px 7px;
            }
          }

          .lp-icons {
            font-size: 18px;
            line-height: 22px;
            font-weight: normal;
            display: flex;

            .lp-icons-group {
              height: 51px;
              background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
              border-radius: 8px;
              padding: 2px;

              .icons {
                height: 47px;
                background-color: #01033c;
                border-radius: 8px;
                align-items: center;
                padding: 0 20px;

                img {
                  margin-right: 0;
                  margin-bottom: 0;
                }

                div {
                  margin: 0 16px;
                }

                span {
                  margin-left: 9px;
                  font-weight: 400;
                  font-size: 18px;
                  line-height: 21px;
                }
              }
            }
          }
        }
      }

      .mobile-list {
        display: none;
        padding: 0 10px;

        @media (max-width: @mobile-b-width) {
          display: block;
        }

        .farm-head {
          .lp-icons {
            justify-content: center;
          }

          .state:nth-child(1) {
            justify-content: flex-start;

            .title {
              font-size: 14px;
              line-height: 17px;
            }
          }

          .state:nth-child(2) {
            justify-content: flex-end;
            font-size: 16px;
            font-weight: 600;
          }
        }
      }

      .pc-list {
        @media (max-width: @mobile-b-width) {
          display: none;
        }
      }

      .copy-link-mobile {
        display: none;

        @media (max-width: @mobile-b-width) {
          display: block;
          margin: 20px 20px 0 20px;
          text-align: center;

          div .share-content {
            font-size: 16px;
            line-height: 20px;
          }
        }
      }
    }
  }
}

.pf-record {
  border-bottom: none !important;
}

.radioButtonStyle {
  width: 50%;
  text-align: center;
}
</style>

<style lang="less">
@import '../../styles/variables';

.text-center {
  text-align: center !important;
}

.fertilizeruniq {
  h1 {
    margin: 20px;
    font-size: 30px;
  }

  div.inputContent {
    background: #09b17f;
    padding: 2px;
    display: inline-block;
    border-radius: 5px;
    margin-top: 3px;

    .twlink {
      border: none;
      padding: 9px 10px;
      border-radius: 5px 0 0 5px;
      background: #01033c;
      width: 293px;
    }

    .submitbutton {
      border: none;
      padding: 9px 10px;
      border-radius: 5px;
      margin-right: 5px;
      background: #09b17f;
      cursor: pointer;
    }
  }

  .airdropStatus {
    font-weight: 500;
    font-size: 21px;
    line-height: 25px;
    margin-top: 29px;
  }

  .info {
    font-weight: bold;
    padding: 20px;
  }

  .modTitle {
    font-weight: bold;
    font-size: 64px;
    line-height: 80px;
    letter-spacing: -0.05em;
    margin-bottom: 20px;

    @media (max-width: @mobile-b-width) {
      display: none;
    }
  }

  .walContent {
    background: #000;
    border-radius: 13px;
    margin-top: 9px;
    padding: 16px 12px;
  }

  .airdropWinner {
    color: #13ecab;
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    img {
      margin-left: 10px;
      border-radius: 50%;
      width: 20px;
      position: relative;
      top: -3px;
    }
  }

  .nftWinner {
    color: #13ecab;
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    img {
      margin-left: 10px;
      border-radius: 50%;
      width: 51px;
      position: relative;
      top: -3px;
    }
  }

  input.link {
    color: #000;
    padding: 5px 20px;
    display: inline-block;
    width: 90%;
    border-radius: 5px;
    border: none;
    margin-top: 5px;
  }

  .text-center {
    text-align: center;
  }

  .share-ticket {
    font-weight: bold;
    font-size: 25px;
    line-height: 31px;
    color: #fff;
  }

  .share-content {
    font-weight: normal;
    font-size: 20px;
    line-height: 24px;
    color: #fff;
    margin: 15px 0;
  }

  .share-copy-form {
    .inputContent {
      width: 100%;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.1);
      height: 57px;
      border-radius: 14px;
      padding: 0;

      .submitbutton {
        height: 100%;
        border-radius: 14px;
        padding: 16px 20px;
        background: rgba(255, 255, 255, 0.1);
        margin-right: 0;
      }

      .twlink {
        width: 100%;
        background: transparent;
        outline: 0;
        font-size: 20px;
        line-height: 24px;
        color: #b5b5b5;
      }
    }
  }

  .share {
    text-align: center;
    margin: 30px;
    font-weight: bold;
    font-size: 30px;
    line-height: 37px;
    color: #fff;

    @media (max-width: @mobile-b-width) {
      font-size: 16px;
      line-height: 20px;
    }
  }

  .icons img {
    max-width: 43px;
    margin-right: 4px;
    margin-bottom: 10px;
    border-radius: 50%;
  }

  .steps > div {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    margin: 18px 20px 18px 90px;
    padding: 8px 25px;
    height: 40px;
    position: relative;
    font-weight: normal;
    font-size: 22px;
    line-height: 26px;
    display: flex;
    align-items: center;

    @media (max-width: @mobile-b-width) {
      height: 85px;
      padding: 10px;
      font-size: 14px;
      line-height: 17px;

      div {
        text-align: left;
        display: block !important;

        div {
          margin-bottom: 10px;
          font-weight: 700;
        }

        label {
          display: none;
        }
      }
    }

    @media (max-width: @mobile-m-width) {
      height: 120px;
    }

    & > .span {
      position: absolute;
      left: -60px;
      top: 50%;
      height: 40px;
      width: 40px;
      transform: translate(0, -50%);

      @media (max-width: @mobile-b-width) {
        height: 35px;
        width: 35px;
      }

      img {
        width: 100%;
        height: 100%;
      }

      &:not(.first)::before {
        content: '';
        width: 3px;
        background: #48a46980;
        height: 18px;
        left: 18px;
        position: absolute;
        top: -18px;

        @media (max-width: @mobile-b-width) {
          height: 68px;
          top: -68px;
          left: 16px;
        }

        @media (max-width: @mobile-m-width) {
          height: 103px;
          top: -103px;
          left: 16px;
        }
      }
    }

    & > span:not(.span) {
      position: absolute;
      left: -60px;
      top: 50%;
      transform: translate(0, -50%);
      color: #b5b5b5;
      background: #262859;
      border-radius: 20px;
      width: 40px;
      height: 40px;
      line-height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: @mobile-b-width) {
        height: 35px;
        width: 35px;
      }

      &::before {
        content: '';
        width: 3px;
        background: #262859;
        height: 18px;
        left: 18px;
        position: absolute;
        top: -18px;

        @media (max-width: @mobile-b-width) {
          height: 68px;
          top: -68px;
          left: 16px;
        }

        @media (max-width: @mobile-m-width) {
          height: 103px;
          top: -103px;
          left: 16px;
        }
      }
    }

    &.done {
      background: rgba(72, 164, 105, 0.5);
      color: #5bca83;
    }
  }

  .done > div {
    color: #5bca83 !important;
    display: flex;
    align-items: center;
  }

  .steps > div:not(.done) div.date {
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    padding: 6px 7px 4px 7px;
    display: inline-block;
    color: #fff;
    position: absolute;
    right: calc(12.5% - 45px);

    @media (max-width: @mobile-b-width) {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 8px;
      line-height: 10px;
      font-weight: 400;
      padding: 5px;
    }

     @media (max-width: @mobile-m-width) {
      position: relative;
      top: 0;
      right: 0;
    }
  }

  .steps > div > div {
    color: #c6c6c6;
    display: flex;
    align-items: center;

    .date {
      border-radius: 4px;
      font-size: 14px;
      font-weight: 400;
      line-height: 17px;
      padding: 6px 7px 4px 7px;
      display: inline-block;
      color: #fff;
      position: absolute;
      right: calc(12.5% - 45px);

      @media (max-width: @mobile-b-width) {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 8px;
        line-height: 10px;
        font-weight: 400;
        padding: 5px;
      }

      @media (max-width: @mobile-m-width) {
        position: relative;
        top: 0;
        right: 0;
      }
    }

    .t {
      font-weight: 400;
    }
  }

  .sharer {
    float: right;
    margin-left: 12px;
  }

  .rewardNFT,
  .rewardAmount {
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 25px;
  }

  .airdropInfo {
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    color: #fff;
  }

  .infoTickets {
    font-weight: 500;
    font-size: 21px;
    line-height: 25px;
    color: #fff;
    text-align: center;
    margin-top: 14px;
  }

  .done {
    background: #09b17f;
    color: #fff;
  }

  .page-head .title {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .farm-head {
    padding: 10px 0 !important;
  }

  .ant-collapse-header {
    padding: 0 !important;

    .farm-head {
      padding: 24px 32px !important;
    }
  }

  .ant-collapse-content {
    border-top: 1px solid #1c274f;
    background-color: rgba(0, 0, 0, 0.9471) !important;
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

.btncontainer {
  background: linear-gradient(91.9deg, rgba(19, 236, 171, 0.8) -8.51%, rgba(200, 52, 247, 0.8) 110.83%);
  display: inline-block;
  width: unset;
  text-align: center;
  position: relative;
  max-width: 400px;
  margin: 10px auto;
  border-radius: 30px;
  max-height: 65px;

  button {
    background: #01033c !important;
    position: relative;
    border-radius: 30px;
    border-color: transparent;
    cursor: pointer;

    &.button_div {
      padding: 0 20px;
    }
  }
}

.label.soon {
  border: 1px solid #13d89d;
  color: #13d89d;
  position: absolute;
  padding: 0 20px 0 20px;
  border-radius: 3px;
  right: 60px;
}

.label.ended {
  border: 1px solid #f00;
  color: #f00;
  position: absolute;
  padding: 0 20px 0 20px;
  border-radius: 3px;
  right: 60px;
}

main {
  background-color: #01033c;
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
.input-search {
  border-radius: 5px;
}
.pf-arrow {
  text-align: right;
}
.pf-record {
  background-color: #01033c;
  border-bottom: 1px solid #d9d9d9;

  .pf-record-content {
    padding: 36px 32px 56px 32px;
  }
}
.farm {
  .ant-collapse-header {
    padding: 0 !important;

    .farm-head {
      padding: 24px 32px !important;
    }
  }

  .ant-collapse-content {
    border-top: 1px solid #1c274f;
    background-color: rgba(0, 0, 0, 0.9471) !important;
  }
}

.farm.container {
  max-width: 1200px;
  background: #01033c;
  margin-top: 20px;
  margin-bottom: 20px;

  .card {
    .card-body {
      padding: 0;
      background: #01033c;
      overflow-x: scroll;
      scrollbar-width: none;
      -ms-overflow-style: none;

      .ant-collapse {
        border: 0;
        background-color: rgba(0, 0, 0, 0.9471);

        .ant-collapse-item {
          border-bottom: 0;
        }

        .ant-collapse-item:not(:last-child) {
          border-bottom: 1px solid #d9d9d9;
        }
      }

      .start .btncontainer {
        display: inline-block;
      }
    }
  }

  .harvest {
    .reward {
      .token {
        font-weight: 600;
        font-size: 20px;
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
    .unstarted {
      .token {
        font-weight: 600;
        font-size: 20px;
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
    padding: 16px;
    border: 2px solid #1c274f;
    border-radius: 4px;

    .title {
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
  }

  .farm-head {
    display: flex;
    align-items: center;

    .lp-icons {
      .icons {
        margin-right: 8px;
      }
    }

    .state {
      display: flex;
      flex-direction: column;
      text-align: left;

      .title {
        font-size: 12px;
      }

      .value {
        font-size: 16px;
        line-height: 24px;
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
}

@media (max-width: 700px) {
  .fertilizeruniq .notstep,
  .fertilizeruniq .steps,
  .fertilizeruniq .twlink {
    width: 100%;
  }

  .fertilizeruniq div.inputContent {
    margin-bottom: 5px;
    width: 100%;
  }

  .fertilizeruniq div.inputContent .twlink {
    width: calc(100% - 80px);
  }
}
</style>