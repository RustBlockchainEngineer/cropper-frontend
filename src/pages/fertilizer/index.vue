<template>
  <div class="fertilizer container">
    <div class="card">
      <div class="card-body">
        <div class="fertilizer-head fs-container">
          <h3 class="title weightB">Fertilizer</h3>
          <div class="information">
            <div class="tvl-info">
              <p class="textL weightS">
                TVL : ${{ TVL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </p>
            </div>

            <div class="action-btn-group">
              <div
                class="reload-btn icon-cursor"
                :class="activeSpinning ? 'active' : ''"
                @click="reloadTimer"
              >
                <img src="@/assets/icons/reload.svg" />
              </div>
            </div>
          </div>
        </div>

        <div class="fertilizer-option-bar fs-container">
          <div class="option-tab-group">
            <div class="option-tab">
              <Button
                class="textL weightS icon-cursor"
                :class="projectOption === 'upcoming' ? 'active-tab' : ''"
                @click="() => { this.projectOption = 'upcoming' }"
                >Upcoming Projects</Button
              >
              <div
                v-if="projectOption === 'upcoming'"
                class="active-underline"
              ></div>
            </div>
            <div class="option-tab">
              <Button
                class="textL weightS icon-cursor"
                :class="projectOption === 'preparation' ? 'active-tab' : ''"
                @click="() => { this.projectOption = 'preparation' }"
              >
                Preparation Projects
              </Button>
              <div
                v-if="projectOption === 'preparation'"
                class="active-underline"
              ></div>
            </div>
            <div class="option-tab">
              <Button
                class="textL weightS icon-cursor"
                :class="projectOption === 'funded' ? 'active-tab' : ''"
                @click="() => { this.projectOption = 'funded' }"
              >
                Funded Projects
              </Button>
              <div
                v-if="projectOption === 'funded'"
                class="active-underline"
              ></div>
            </div>
          </div>

          <div
            class="option-tab-group option-tab-collapse icon-cursor"
            @click="
              () => {
                this.showTabMenu = !this.showTabMenu;
              }
            "
          >
            <label class="textL weightS icon-cursor">
              {{
                projectOption === 'upcoming'
                  ? "Upcoming Projects"
                  : projectOption === 'preparation'
                  ? "Preparation Projects"
                  : projectOption === 'funded'
                  ? "Funded Projects"
                  : ""
              }}
            </label>
            <img
              class="arrow-icon"
              :class="showTabMenu ? 'arrow-up' : 'arrow-down'"
              src="@/assets/icons/arrow-down-white.svg"
            />

            <div v-if="showTabMenu" class="option-collapse-menu collapse-left">
              <div
                class="option-collapse-item text-center textM weightS icon-cursor"
                :class="projectOption === 'upcoming' ? 'active-item' : ''"
                @click="() => { this.projectOption = 'upcoming' }"
              >
                Upcoming Projects
              </div>
              <div
                class="option-collapse-item text-center textM weightS icon-cursor"
                :class="projectOption === 'preparation' ? 'active-item' : ''"
                @click="() => { this.projectOption = 'preparation' }"
              >
                Preparation Projects
              </div>
              <div
                class="option-collapse-item text-center textM weightS icon-cursor"
                :class="projectOption === 'funded' ? 'active-item' : ''"
                @click="() => { this.projectOption = 'funded' }"
              >
                Funded Projects
              </div>
            </div>
          </div>
          <div class="option-select-group">
            <div class="option-select fc-container icon-cursor">
              <img
                src="@/assets/icons/search.svg"
                @click="
                  () => {
                    this.showSearchMenu = !this.showSearchMenu;
                  }
                "
              />
            </div>

            <div
              class="option-search-collapse"
              :class="showSearchMenu ? 'visible' : 'hidden'"
            >
              <div class="select-token-header fs-container">
                <label class="textL weightB">Search</label>
                <img
                  class="icon-cursor"
                  src="@/assets/icons/close-circle-icon.svg"
                  @click="
                    () => {
                      this.showSearchMenu = false;
                    }
                  "
                />
              </div>
              <div class="select-token-search">
                <input
                  ref="userInput"
                  v-model="searchName"
                  class="textM"
                  placeholder="Search"
                />
                <!-- <div class="shortcut-list">
                  <label class="textS weightS">Most Used</label>
                  <div class="shortcut-group">
                    <div
                      v-for="item in mostUsed"
                      :key="item.symbol"
                      class="shortcut-container icon-cursor"
                      @click="searchShortcut(item.symbol)"
                    >
                      <div class="shortcut-box fc-container">
                        <CoinIcon class="coin-icon" :mint-address="item.mintAddress" />
                        {{ item.symbol }}
                      </div>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>

            <!-- option collapse > 768px -->
            <div
              class="option-select option-sort fc-container icon-cursor"
              @click="
                () => {
                  this.showSortMenu = !this.showSortMenu;
                }
              "
            >
              <span class="bodyM weightS option-select-sort fc-container">
                <label>Sort by:</label>
                <span class="sort-detail">
                  All
                  <img
                    class="arrow-icon"
                    :class="showSortMenu ? 'arrow-up' : 'arrow-down'"
                    src="@/assets/icons/arrow-down-white.svg"
                  />
                </span>
              </span>
            </div>

            <!-- option collapse < 768px -->
            <img
              class="option-collapse icon-cursor"
              src="@/assets/icons/menu-collapse.svg"
              @click="
                () => {
                  this.showSortMenu = !this.showSortMenu;
                }
              "
            />

            <div v-if="showSortMenu" class="option-collapse-menu collapse-right">
              <div
                class="option-collapse-item text-center texts weightB icon-cursor"
                :class="sortOption === 'all' ? 'active-item' : ''"
                @click="setSortOption('all')"
              >
                All
              </div>
              <div
                class="option-collapse-item text-center texts weightB icon-cursor"
                :class="sortOption === 'whitelist' ? 'active-item' : ''"
                @click="setSortOption('whitelist')"
              >
                Whitelist Open
              </div>
              <div
                class="option-collapse-item text-center texts weightB icon-cursor"
                :class="sortOption === 'sales' ? 'active-item' : ''"
                @click="setSortOption('sales')"
              >
                Open Sales
              </div>
              <div
                class="option-collapse-item text-center texts weightB icon-cursor"
                :class="sortOption === 'distribution' ? 'active-item' : ''"
                @click="setSortOption('distribution')"
              >
                Distribution
              </div>
            </div>
          </div>
        </div>

        <div v-if="initialized">
          <div class="list pc-list" >
            <Row class="farm-head table-head">
              <Col class="lp-icons" :span="isMobile ? 9 : 6">
                <div class="title">Farm name</div>
              </Col>
              <Col class="state" :span="isMobile ? 6 : 4">
                <div class="title">Status</div>
              </Col>
              <Col class="state" :span="isMobile ? 9 : 5">
                <div class="title">Project website</div>
              </Col>
              <Col class="state" :span="isMobile ? 6 : 3">
                <div class="title">Airdrop event</div>
              </Col>
              <Col class="state" :span="isMobile ? 5 : 3">
                <div class="title">Farm duration</div>
              </Col>
              <Col class="state" :span="isMobile ? 6 : 3">
                <div class="title">Followers</div>
              </Col>
            </Row>

            <Collapse v-model="showCollapse" expand-icon-position="right">
              <CollapsePanel v-for="farm in labelizedAmms" v-show="true" :key="farm.slug" :show-arrow="poolType">
                <Row slot="header" class="farm-head" :class="isMobile ? 'is-mobile' : ''" :gutter="0">
                  <Col class="lp-icons" :span="isMobile ? 9 : 6">
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

                  <Col class="state" :span="isMobile ? 6 : 4"> 
                    <div class="label" :style="'background-color: ' + farm.current_status.color"> {{farm.current_status.label}} 
                    </div>
                  </Col>

                  <Col v-if="!isMobile" class="state" :span="isMobile ? 6 : 5">
                    <a :href="farm.website.url" target="_blank">{{ farm.website.display }}</a>
                  </Col>

                  <Col class="state" :span="isMobile ? 6 : 3"> {{ farm.airdrop.amount }} ${{ farm.airdrop.symbol }} </Col>

                  <Col v-if="!isMobile" class="state" :span="3">
                    {{ farm.duration }}
                  </Col>

                  <Col v-if="!isMobile" class="state" :span="3">
                    {{ farm.followers }}
                  </Col>
                </Row>

                <Row v-if="poolType" :class="isMobile ? 'is-mobile' : '' + 'collapse-row'" :gutter="48">
                  <Col :span="!isMobile ? 14 : 10">
                    <div class="banner">
                      <img :src="farm.links.banner" class="large" alt=""/>
                    </div>
                  </Col>

                  <Col :span="!isMobile ? 10 : 10">
                    <div class="title">
                      {{ farm.title }}
                      <a v-show="farm.links.banner" :href="farm.website.url" target="_blank">
                        <img class="social-icon" src="@/assets/icons/link_grey.svg"/>
                      </a>
                      <a v-show="farm.links.twitter" :href="farm.links.twitter" target="_blank">
                        <img class="social-icon" src="@/assets/icons/twitter_grey.svg"/>
                      </a>
                      <a v-show="farm.links.telegram" :href="farm.links.telegram" target="_blank">
                        <img class="social-icon" src="@/assets/icons/telegram_grey.svg"/>
                      </a>
                    </div>
                    <div class="tags-group">
                      <div v-for="tag in farm.tags" :key="tag.label" class="tag label" :style="'background-color: ' + tag.color">{{tag.label}}</div>
                    </div>
                    <div class="desc">{{ farm.desc }}</div>

                  </Col>
                </Row>
              </CollapsePanel>
            </Collapse>
          </div>

          <!-- Mobile list -->
          <div class="list mobile-list">
            <Collapse v-model="showCollapse" expand-icon-position="right">
              <CollapsePanel v-for="farm in labelizedAmms" v-show="true" :key="farm.slug" :show-arrow="poolType">
                <Row slot="header" class="farm-head">
                  <Col :span="24">
                    <div class="title"> {{ farm.title }} </div>

                    <div class="detailButton">
                      <button>Details</button>
                    </div>
                  </Col>
                </Row>
                <Row class="farm-head">
                  <Col :span="24">
                    <div class="followerscount">
                      <span>{{ farm.followers }} </span> Followers
                    </div>
                    <div class="tags-group">
                      <div v-for="tag in farm.tags" :key="tag.label" class="tag label" :style="'background-color: ' + tag.color">{{tag.label}}</div>
                    </div>
                  </Col>
                </Row>
                <Row class="farm-head">
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
                    <div class="title">Status</div>
                  </Col>
                  <Col class="state" :span="12">
                    <div class="label" :style="'background-color: ' + farm.current_status.color">
                      {{ farm.current_status.label }}
                    </div>
                  </Col>
                </Row>
              </CollapsePanel>
            </Collapse>
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
import importIcon from '@/utils/import-icon'
import { Spin, Icon, Collapse, Col, Radio, Row, Select, Switch as Toggle, Pagination } from 'ant-design-vue'
import { get, cloneDeep } from 'lodash-es'
import { TokenAmount } from '@/utils/safe-math'
import { getUnixTs } from '@/utils'
import moment from 'moment'
import { TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import { TOKENS, NATIVE_SOL } from '@/utils/tokens'
const CollapsePanel = Collapse.Panel
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

export default Vue.extend({
  components: {
    //Toggle,
    //Collapse,
    CollapsePanel,
    Spin,
    Icon,
    Collapse,
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
      searchName: '',
      coinPicUrl: '',
      initialized: false as boolean,
      labelizedAmms: {} as any,
      currentPage: 1,
      coinName: '',
      mintAddress: '',
      poolLoaded: false,
      autoRefreshTime: 60 as number,
      countdown: 0,
      showCollapse: [] as any[],
      timer: null as any,
      loading: false as boolean,
      nbFarmsLoaded: 0 as number,
      poolType: true as boolean,
      TVL: 0,
      activeSpinning: false as boolean,
      showTabMenu: false as boolean,
      showSearchMenu: false as boolean,
      showSortMenu: false as boolean,
      projectOption: 'upcoming' as string,
      sortOption: 'all' as string
    }
  },

  head: {
    title: 'CropperFinance'
  },

  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },
  async mounted() {
    this.getTvl();
    this.$accessor.token.loadTokens()
    await this.updateLabelizedAmms()

    let timer = setInterval(async () => {
      if (this.nbFarmsLoaded == Object.keys(this.labelizedAmms).length) {
        this.initialized = true
      }
    }, 1000)

    this.timer = setInterval(async () => {
      clearInterval(this.timer)
      this.setTimer()
    }, 1000)
  },

  watch: {
    showCollapse: {
      handler() {
        if (!this.poolType && this.showCollapse.length > 0) {
          alert('here')
          this.showCollapse.splice(0, this.showCollapse.length)
        }
      },
      deep: true
    }
  },

  methods: {
    importIcon,
    async getTvl() {
      let cur_date = new Date().getTime();
      if (window.localStorage.TVL_last_updated) {
        const last_updated = parseInt(window.localStorage.TVL_last_updated);
        if (cur_date - last_updated <= 600000) {
          this.TVL = window.localStorage.TVL;
          return;
        }
      }

      let responseData: any = [];
      let tvl = 0;
      try {
        responseData = await fetch("https://api.cropper.finance/cmc/").then((res) =>
          res.json()
        );

        Object.keys(responseData).forEach(function (key) {
          if ((responseData as any)[key as any].tvl * 1 < 2000000) {
            tvl = tvl * 1 + (responseData as any)[key as any].tvl * 1;
          }
        });
      } catch {
        // dummy data
      } finally {
      }

      try {
        responseData = await fetch("https://api.cropper.finance/staking/").then((res) =>
          res.json()
        );
        tvl = tvl * 1 + (responseData as any).value * 1;
      } catch {
        // dummy data
      } finally {
      }

      this.TVL = Math.round(tvl);

      window.localStorage.TVL_last_updated = new Date().getTime();
      window.localStorage.TVL = this.TVL;
    },
    async flush() {
      await this.updateLabelizedAmms()
      clearInterval(this.timer)
      this.poolLoaded = true
      this.countdown = 0
      this.setTimer()
    },
    setTimer() {
      this.timer = setInterval(async () => {
        if (!this.loading) {
          if (this.countdown < this.autoRefreshTime) {
            this.countdown += 1
            if (this.countdown === this.autoRefreshTime) {
              await this.flush()
            }
          }
        }
      }, 1000)
    },
    reloadtimer() {
      this.flush()
      this.$accessor.wallet.getTokenAccounts()
      this.activeSpinning = true
      setTimeout(() => {
        this.activeSpinning = false
      }, 1000)
    },
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
    TokenAmount,
    goToProject(farm: any) {
      this.$router.push({
        path: '/fertilizer/project/?f=' + farm.slug
      })
    },
    async updateLabelizedAmms() {
      this.labelizedAmms = {}
      let responseData2 = {}
      let responseData
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
            element.calculateNextStep = 'Bla bla bla'

            this.labelizedAmms[element.slug] = element
            try {
              responseData2 = await fetch(
                'https://api.cropper.finance/pfo/?farmId=' +
                  this.labelizedAmms[element.slug].pfarmID +
                  '&t=' +
                  Math.round(moment().unix() / 60000)
              ).then((res) => res.json())
            } catch {
            } finally {
              this.labelizedAmms[element.slug]['followers'] = Object.keys(responseData2).length
              this.nbFarmsLoaded++
            }
          }
        })
      }
    },
    async delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    setSortOption(option: string) {
      this.sortOption = option;
      this.showSortMenu = false;
      // this.updateFarms();
    }
  }
})
</script>

<style lang="less" scoped>
// global stylesheet
.btncontainer {
  background: linear-gradient(91.9deg, rgba(19, 236, 171, 0.8) -8.51%, rgba(200, 52, 247, 0.8) 110.83%);
  background-origin: border-box;
  display: inline-block;
  width: unset;
  text-align: center;
  position: relative;
  max-width: 400px;
  margin: 10px auto;
  padding: 2px;
  border-radius: 30px;
  max-height: 65px;

  button {
    background: @color-blue800 !important;
    position: relative;
    border-radius: 30px;
    border-color: transparent;
  }
}

// class stylesheet
.fertilizer.container {
  .fertilizer-head {
    @media @max-sl-mobile {
      display: block !important;
    }

    .title {
      text-align: center;
      position: relative;
      float: left;

      @media @max-sl-mobile {
        margin-bottom: 18px !important;
      }
    }

    .information {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @media @max-sl-mobile {
        width: 100%;
      }

      .tvl-info {
        margin-right: 18px;
      }

      .action-btn-group {
        display: flex;
        align-items: center;

        .reload-btn {
          background: @color-blue600;
          border-radius: 8px;
          padding: 6px;
          margin-right: 18px;
          display: flex;
          align-items: center;
          justify-content: center;

          @media @max-lg-tablet {
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
  }

  .fertilizer-option-bar {
    margin: 38px 0;

    @media @max-sl-mobile {
      margin: 28px 0;
    }

    .option-tab-group {
      display: flex;

      @media @max-sl-mobile {
        display: none;
      }

      &.option-tab-collapse {
        display: none;

        @media @max-sl-mobile {
          position: relative;
          display: flex;
          align-items: center;
          padding: 6px 10px;
          border: 2px solid @color-blue500;
          border-radius: 8px;

          label {
            color: @color-petrol500;
          }

          .arrow-icon {
            margin-left: 4px;
          }
        }
      }

      .option-tab {
        margin-right: 48px;

        &:last-child {
          margin-right: 0;
        }

        button {
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
          margin-bottom: 8px;

          &.active-tab {
            color: @color-petrol500;
          }

          .deposit-icon {
            margin-right: 8px;
          }
        }

        .active-underline {
          height: 4px;
          border-radius: 10px;
          background: @color-petrol400;
        }
      }
    }

    .option-select-group {
      position: relative;
      display: flex;
      align-items: center;

      .option-select {
        border: 2px solid @color-blue500;
        border-radius: 8px;
        padding: 0 8px;
        height: 40px;
        margin-right: 18px;

        @media @max-sl-mobile {
          height: 32px;
          padding: 0 4px;
        }

        &:last-child {
          margin-right: 0;
        }

        &.option-toggle {
          @media @max-md-tablet {
            display: none !important;
          }
        }

        &.option-sort {
          @media @max-md-tablet {
            display: none !important;
          }
        }

        .option-select-sort {
          letter-spacing: 0.15px;

          label {
            color: #eae8f1;
            opacity: 0.5;
            margin-right: 8px;
          }

          .sort-detail {
            display: flex;
            align-items: center;

            .arrow-icon {
              margin-left: 8px;
            }
          }
        }
      }

      .option-collapse {
        display: none;

        @media @max-md-tablet {
          display: block;
        }
      }

      .option-search-collapse {
        position: absolute;
        top: 0;
        left: -209px;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.5s linear;
        background: @color-blue700;
        border: 2px solid @color-blue500;
        border-radius: 8px;
        padding: 18px;
        z-index: 999;
        width: 250px;

        &.visible {
          visibility: visible;
          opacity: 1;
        }

        .select-token-header {
          margin-bottom: 10px;
        }

        .select-token-search {
          input {
            border: 2px solid @color-blue400;
            border-radius: 8px;
            padding: 8px 18px;
            background-color: transparent;
            color: #ccd1f1;
            width: 100%;

            &:active,
            &:focus,
            &:hover {
              outline: 0;
            }

            &::placeholder {
              color: #ccd1f1;
            }
          }

          .shortcut-list {
            margin-top: 8px;

            .shortcut-group {
              display: flex;
              margin-top: 8px;

              .shortcut-container {
                background: linear-gradient(
                  97.63deg,
                  #280c86 -29.92%,
                  #22b5b6 103.89%
                );
                border-radius: 8px;
                padding: 2px;
                margin-right: 8px;

                &:last-child {
                  margin-right: 0;
                }

                .shortcut-box {
                  background: @color-blue800;
                  border-radius: 8px;
                  padding: 8px;

                  .coin-icon {
                    width: 12px;
                    height: 12px;
                    margin-right: 4px;
                    border-radius: 50%;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .list {
    text-align: center;
  }

  .pc-list {
    @media @max-sl-mobile {
      display: none;
    }
  }

  .mobile-list {
    display: none;

    @media @max-sl-mobile {
      display: block;
    }

    .ant-collapse .ant-collapse-item {
      background: #0e1046;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-sizing: border-box;
      border-radius: 14px;
      padding: 10px;
      margin-bottom: 20px;

      .ant-collapse-content .farm-head .btncontainer {
        @media @max-sl-mobile {
          height: 44px;
          width: 105px;
        }

        button {
            @media @max-sl-mobile {
            height: 40px;
            font-size: 14px;
          }
        }
      }

      .ant-collapse-header {
        .farm-head {
          .ant-col {
            display: flex;
            align-items: center;
          }

          .title {
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
            line-height: 31px;
            letter-spacing: 0;
            text-align: left;
          }
          
          .detailButton {
            background: linear-gradient(97.63deg, #280C86 -29.92%, #22B5B6 103.89%) !important;
            background-origin: border-box;
            display: inline-block;
            padding: 1px;
            border-radius: 23px;
            position: absolute;
            right: 0;

            button {
              height: 42px;
              padding: 11px 32px 11px 24px;
              color: #fff;
              font-size: 14px;
              letter-spacing: -0.05em;
              background: #16164A;
              border-radius: 22px;
              border: transparent;
            }
          }
        }
      }

      .ant-collapse-content {
        .farm-head {
          .followerscount {
            text-align: left;
            font-weight: normal;
            font-size: 18px;
            line-height: 22px;

            span {
              font-weight: normal;
              font-size: 25px;
              line-height: 30px;
              color: #00dbb9;
            }
          }

          .tags-group {
            margin-bottom: 0 !important;
          }

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
    }
  }
  
  .ant-collapse {
    background-color: @color-blue800 !important;
  }

  .pf-record .pf-record-content {
    padding: 0;
  }
}
</style>

<style lang="less">
::-webkit-scrollbar {
  @media @max-sl-mobile {
    display: none; /* Chrome Safari */
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

.fertilizer.container {
  .ant-collapse {
    border: unset !important;
  }

  .ant-collapse-arrow {
    z-index: 2;
  }

  .ant-collapse > .ant-collapse-item {
    border-bottom: 1px solid rgba(255,255,255,0.12549) !important;

    .label{
      border-radius: 4px;
      font-size: 14px;
      font-weight: 400;
      line-height: 17px;
      padding: 6px 7px 4px 7px;
    }

    .banner img{
      width: 100%;
      height: 262px;
    }
  }

  .state {
    font-size: 18px;
    line-height: 22px;
  }

  .state a {
    color: #5ba5fb;
    text-decoration: underline;
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
    background-color: @color-blue800;
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
      background: @gradient-color-icon;
      background-origin: border-box;
      margin-left: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .anticon {
        font-size: 16px !important;
        color: white !important;
        margin-right: 0 !important;
        top: 0 !important;
      }

      .anticon:hover {
        background-color: transparent !important;
      }
    }
  }

  .create {
    background: @gradient-color-icon;
    background-origin: border-box;
    border: 2px solid rgba(255, 255, 255, 0.14);
    border-radius: 8px;

    button {
      background: unset !important;
      color: #fff;
      border-color: transparent;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 42px;
      letter-spacing: -0.05em;
      height: 60px;
      width: 163px;
      cursor: pointer;
    }
  }

  .page-head {
    margin-top: 10px;

    @media @max-sl-mobile {
      display: none;
    }
  }

  .ant-collapse-header {
    padding: 0 !important;

    @media @max-sl-mobile {
      margin-bottom: 10px;
    }
  }

  .ant-collapse-content {
    background-color: @color-blue800;
    border-top: 1px solid #1c274f;

    .ant-collapse-content-box .ant-row{
      display: flex;
      align-items: center;
    }
  }

  .ant-collapse-content-active {
    background: #0e1046;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    border-radius: 14px;

    .title {
      font-size: 25px;
      font-style: normal;
      font-weight: 700;
      line-height: 31px;
      letter-spacing: 0;
      text-align: left;

      .social-icon {
        color: #8C8DA7;
        margin-left: 16px;
      }
    }

    .tags-group {
      display: flex;
      align-items: center;
      margin: 15px 0;

      .tag {
        margin-right: 16px;
      }
    }

    .desc {
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 0;
      text-align: left;
    }

    .btncontainer {
      background: @gradient-color-icon;
      background-origin: border-box;
      border: 2px solid rgba(255, 255, 255, 0.14);
      border-radius: 8px;
      color: #fff;
      height: 60px;
      width: 163px;
      line-height: 60px;
      margin-top: 40px;
      display: flex;
      align-items: center;

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
  }

  .page-head a {
    z-index: 2;
    background: @color-blue800;
    float: right;

    .btncontainer {
      display: inline-block;
    }
  }

  .page-head .buttons {
    float: right;
  }

  .page-head .title {
    &::after {
      font-style: italic;
      font-weight: normal;
      font-size: 18px;
      line-height: 22px;
      color: #fff;
    }
  }

  .table-head {
    border-bottom: 1px solid rgba(255,255,255,0.2);
  }

  .farm-head {
    display: flex;
    align-items: center;
    padding: 30px 5px !important;

    @media @max-sl-mobile {
      padding: 10px 5px !important;
    }

    .ant-collapse-header {
      padding: 0 !important;

      .farm-head {
        padding: 30px 5px !important;
      }
    }

    .lp-icons {
      .lp-icons-group {
        height: 51px;
        background: linear-gradient(97.63deg, #280c86 -29.92%, #22b5b6 103.89%);
        background-origin: border-box;
        border-radius: 8px;
        padding: 2px;

        .icons {
          height: 47px;
          background-color: @color-blue800;
          border-radius: 8px;
          align-items: center;
          padding: 0 20px;

          div {
            margin: 0 12px;
          }

          span {
            margin-left: 12px;
            font-weight: 400;
            font-size: 18px;
            line-height: 21px;
          }
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

    .state {
      display: flex;
      text-align: left;

      .title {
        font-weight: normal;
        font-size: 18px;
        line-height: 21px;
        color: #fff;
        opacity: 0.5;
      }

      .value {
        font-size: 18px;
        line-height: 21.19px;
        font-weight: 400;
      }
    }
  }

  .farm-head.is-mobile {
    padding: 24px 16px !important;
  }
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
