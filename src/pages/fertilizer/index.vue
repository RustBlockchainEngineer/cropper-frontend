<template>
  <div class="fertilizer cont">
    <img class="planet-left" src="@/assets/Green Planet 1.png" />
    <div class="card">
      <div class="card-body">
        <div class="page-head fs-container">
          <span class="title">Fertilizer Beta</span>
          <NuxtLink to="/pools/create-pool/">
            <div class="create">
              <Button size="large" ghost> + &nbsp; Apply </Button>
            </div>
          </NuxtLink>

          <div class="buttons">
            <div class="count-down-group">
              <div class="count-down">
                <span v-if="autoRefreshTime - countdown < 10">0</span>
                {{ autoRefreshTime - countdown }}
                <div
                  class="reload-btn"
                  @click="
                    () => {
                      flush()
                      $accessor.wallet.getTokenAccounts()
                    }
                  "
                >
                  <img src="@/assets/icons/loading.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="list pc-list" v-if="initialized">
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

                  <div class="btncontainer" @click="goToProject(farm)">
                    <Button size="large" ghost> Join now </Button>
                  </div>
                </Col>
              </Row>
            </CollapsePanel>
          </Collapse>
        </div>

        <!-- Mobile list -->
        <div class="list mobile-list" v-if="initialized">
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
              <div class="btncontainer" @click="goToProject(farm)">
                <Button size="large" ghost> Join now </Button>
              </div>
            </CollapsePanel>
          </Collapse>
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
      isMobile: false,
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
      poolType: true as boolean
    }
  },

  head: {
    title: 'CropperFinance'
  },

  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },
  async mounted() {
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
                  Math.round(moment().unix() / 60)
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
    }
  }
})
</script>

<style lang="less" scoped>
@import '../../styles/variables';

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.card-body {
  padding: 0;
  margin: 0;
}
.radioButtonStyle {
  width: 50%;
  text-align: center;
}

.btncontainer {
  background: linear-gradient(91.9deg, rgba(19, 236, 171, 0.8) -8.51%, rgba(200, 52, 247, 0.8) 110.83%);
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
    background: #01033c !important;
    position: relative;
    border-radius: 30px;
    border-color: transparent;
  }
}

.fertilizer {
  .list {
    text-align: center;
  }

  .pc-list {
    @media (max-width: @mobile-b-width) {
      display: none;
    }
  }

  .mobile-list {
    display: none;

    @media (max-width: @mobile-b-width) {
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
        @media (max-width: @mobile-b-width) {
          height: 44px;
          width: 105px;
        }

        button {
            @media (max-width: @mobile-b-width) {
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
    background-color: #01033c !important;
  }

  .pf-record .pf-record-content {
    padding: 0;
  }
}

@media (max-width: @mobile-b-width) {
  .fertilizer.cont {
    max-width: 95%;
  }
}
</style>

<style lang="less">
@import '../../styles/variables';

.ant-alert-warning {
  width: 500px;
  margin-top: 30px;
  background-color: transparent;
  border: 1px solid #85858d;

  .anticon-close {
    color: #fff;
  }
}

.fertilizer.cont {
  max-width: 1350px;
  width: 100%;
  background: #01033c;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;
  margin-left: auto;
  margin-right: auto;

  .planet-left {
    position: absolute;
    left: 0;
    top: 35%;

    @media (max-width: @mobile-b-width) {
      display: none;
    }
  }

  .card-body {
    max-width: 1302px;
    margin: 0 auto;
  }

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
    height: 60px;
    border-radius: 63px;
    position: relative;
    padding-left: 2px;
    padding-right: 2px;
  }

  .count-down {
    background-color: #01033c;
    border-radius: 63px;
    height: 56px;
    top: 2px;
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
    background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
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
    }
  }

  .page-head {
    margin-top: 10px;

    @media (max-width: @mobile-b-width) {
      display: none;
    }
  }

  .ant-collapse-header {
    padding: 0 !important;

    @media (max-width: @mobile-b-width) {
      margin-bottom: 10px;
    }
  }

  .ant-collapse-content {
    background-color: #01033c;
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
      background: linear-gradient(315deg, #21bdb8 0%, #280684 100%);
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
    background: #01033c;
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
    border-bottom: 1px solid #ffffff20;
  }

  .farm-head {
    display: flex;
    align-items: center;
    padding: 30px 5px !important;

    @media (max-width: @mobile-b-width) {
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
        border-radius: 8px;
        padding: 2px;

        .icons {
          height: 47px;
          background-color: #01033c;
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
</style>
