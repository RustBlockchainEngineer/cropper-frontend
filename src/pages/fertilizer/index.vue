<template>
  <div class="fertilizer container">
    <div class="card">
      <div class="card-body">
        <div class="fertilizer-head fcsb-container">
          <h3 class="title weight-bold">Fertilizer / Admin panel <span v-if="mint == 'new'">New</span> <span v-else-if="mint">Update</span></h3>
        </div>



          <div class="create">
              <Button @click="create" ghost>Create launchpad</Button>
          </div>

          <div class="create">
              <NuxtLink to="/fertilizer/project/?mint=BT37QA8Az1zJWQG3L5yeyHPeM99pkGcWTpwjrQ5M42Xs"><button>Create a new project</button></NuxtLink>
          </div>


          <div class="projectList">

            <div class="item" 
                        v-for="item in projects"
                        :key="item.mint">
              <button style="color:#000" @click="goTo(item.mint)">{{item.title}} - {{item.mint}}</button>
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
import { Collapse, Row, Col, Pagination, Button, Statistic, Tooltip } from 'ant-design-vue'
import { get, cloneDeep } from 'lodash-es'
import { TokenAmount } from '@/utils/safe-math'
import { getUnixTs } from '@/utils'
import moment from 'moment'
import { TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import { TOKENS, NATIVE_SOL } from '@/utils/tokens'

import {setAnchorProvider, createLaunchpad, getLaunchpad} from '@/utils/crp-launchpad'


const Vco = require('v-click-outside')
Vue.use(Vco)
const CollapsePanel = Collapse.Panel
const Countdown = Statistic.Countdown

export default Vue.extend({
  components: {
    // Spin,
    // Icon,
    // Collapse,
    // CollapsePanel,
    // Row,
    // Col,
    // Button
    // Countdown,
    // Tooltip
  },
  data() {
    return {
      searchName: '',
      coinPicUrl: '',
      mint: '',
      initialized: false as boolean,
      labelizedAmms: {} as any,
      currentPage: 1,
      coinName: '',
      mintAddress: '',
      scValues: {

      } as any,
      apiValues: {
        title : '',
        ath: '',
        hard_cap: '',
      } as any,

      projects: {} as any,
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
      showFilterMenu: false as boolean,
      showMoreMenu: [] as boolean[],
      currentShowMore: -1 as number,
      sortUpcoming: 'All' as string,
      sortFunded: 'Subscribers' as string,
      sortAsc: false as boolean,
      filterOptions: {
        all: 'All',
        whitelist: 'Whitelist Open',
        sales: 'Sales',
        distribution: 'Distribution',
        upcoming: 'Upcoming',
        preparation: 'Preparation',
        funded: 'Funded'
      },
      sortOptions: {
        subscribers: 'Subscribers',
        total_raised: 'Total raise',
        token_price: 'Token price',
        ath: 'ATH Since IDO',
        end_date: 'Ended in UTC'
      },
      filterProject: 'Upcoming' as string,
      fertilizerItems: [] as any[],
      fertilizerData: [
        {
          status: 'Upcoming',
          key: 'k13',
          picture: '/fertilizer/banner/winerz.png',
          title: 'Winerz',
          short_desc: 'Experience a new way of playing by betting on your victory.',
        },
        {
          status: 'Upcoming',
          key: 'k14',
          picture: '/fertilizer/banner/secretum.png',
          title: 'Secretum Protocol',
          short_desc: 'Blockchain-based messaging app where every conversation is private by design.',
        },
        {
          status: 'Upcoming',
          key: 'k15',
          picture: '/fertilizer/banner/zebec.png',
          title: 'Zebec Protocol',
          short_desc: 'Continuous Settlement Protocol.',
        }
      ],
      currentTimestamp: 0
    }
  },
  head: {
    title: 'Fertilizer'
  },
  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },
  async mounted() {

    setAnchorProvider(this.$web3, this.$wallet)
    console.log(await getLaunchpad());

    // this.$router.push({ path: `/swap/` })
    this.$accessor.token.loadTokens()


    const query = new URLSearchParams(window.location.search)
    if (query.get('mint')) {
      this.mint = query.get('mint') as string
    }

    let responseData = {} as any

      try {
        responseData =  await fetch('https://api.croppppp.com/launchpad/?list=1').then((res) => res.json())
      } catch {
        // dummy data
      } finally {
        this.projects = responseData.message
      }

    this.currentTimestamp = moment().valueOf()
    this.updateFertilizer()
  },
  watch: {
  },
  methods: {
    importIcon,
    TokenAmount,
    async flush() {},
    async updateLabelizedAmms() {},
    async delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    setTimer() {},
    reloadTimer() {},
    updateFertilizer() {
    },
    filterFertilizer(searchName: string, filterProject: string) {},
    moment() {
      return moment()
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
    goToProject(fertilizer: any) {
      this.$router.push({
        path: '/fertilizer/project/?f=' + fertilizer.uniqueKey
      })
    },
    goTo(mint:any){
      this.$router.push({
        path: '/fertilizer/project/?mint=' + mint
      })
    },
    sortByStatus(option: string) {
      this.sortUpcoming = option
      this.showFilterMenu = false
      this.filterFertilizer(this.searchName, this.filterProject)
    },
    sortByColumn(option: string) {
      if (this.sortFunded === option) this.sortAsc = !this.sortAsc
      this.sortFunded = option
      this.filterFertilizer(this.searchName, this.filterProject)
    },
    sortByColumnMenu(option: string, asc: boolean) {
      this.sortFunded = option
      this.sortAsc = asc
      this.showFilterMenu = false
      this.filterFertilizer(this.searchName, this.filterProject)
    },
    showMore(idx: number) {
      if (idx != this.currentShowMore) {
        this.showMoreMenu = this.showMoreMenu.map((item) => {
          return false
        })
      }
      this.showMoreMenu = this.showMoreMenu.map((item, i) => {
        if (i === idx) {
          this.currentShowMore = idx
          return !item
        }
        return item
      })
      console.log(this.showMoreMenu)
    },
    hideMore() {
      if (this.currentShowMore != -1) {
        this.showMoreMenu = this.showMoreMenu.map((item) => {
          return false
        })
        this.currentShowMore = -1
      }
    },
    create() {
      // TODO - SC PART
      createLaunchpad(this.$web3, this.$wallet)
    }

  }
})
</script>

<style lang="less" scoped>
// global stylesheet
.btn-container {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 48px;
  padding: 3px;
  height: auto;
}

.btn-transparent {
  background: transparent;
  border-radius: 48px;
  border: none;
  height: auto;
  width: 100%;
  padding: 7.5px 0;
}

.btn-primary {
  background: @color-blue700;
  border-radius: 48px;
  border: none;
  height: auto;
  width: auto;
  padding: 4.5px 23.5px;
}

.option-sort-collapse {
  position: absolute;
  top: 50px;
  background: @gradient-color-primary;
  background-origin: border-box;
  border: 2px solid rgba(255, 255, 255, 0.14);
  box-shadow: 18px 11px 14px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  min-width: 188px;
  z-index: 999;

  &.collapse-left {
    left: 0;
  }

  &.collapse-right {
    right: 0;
  }

  .collapse-item {
    padding: 18px 0;
    border-bottom: 1px solid #c4c4c420;

    &:last-child {
      border-bottom: 0;
    }

    &.active-item {
      color: @color-petrol500;
    }

    a {
      color: #fff;
    }
  }
}

.project-status {
  padding: 4px 8px;
  border-radius: 6px;

  &.upcoming {
    background: #a262ac;
  }

  &.whitelist {
    background: @color-red600;
  }

  &.sales {
    background: @color-purple500;
  }

  &.distribution {
    background: @color-yellow600;
    color: @color-neutral900;
  }

  &.preparation {
    background: @color-pink600;
  }

  &.open {
    background: @color-green500;
  }
}

.project-name {
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 18px;
  }

  .title {
    text-align: left;

    .short-desc {
      display: block;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.project-ath {
  .value {
    background: @color-petrol400;
    color: @color-blue800;
    padding: 4px 8px;
    border-radius: 4px;
  }
}

.info-icon {
  img {
    width: 12px;
    height: 12px;
    margin-right: 8px;
  }
}

input.std,
select.std,
textarea.std{
  width:100%;
  color:#000;
  padding:5px 10px;
}

label{
  margin-bottom:20px;
  display:block
}

.arrow-icon {
  transition: all 0.3s;

  &.arrow-up {
    transform: rotate(180deg);
  }
}

.social-link {
  color: #fff;

  .social-icon {
    width: 18px;
    height: 18px;
    margin-left: 8px;
  }
}

.detail-btn {
  position: absolute;
  right: 0;
  background: none;
  border: none;
  display: flex;
  align-items: center;
}

.isDesktop {
  @media @max-lg-tablet {
    display: none;
  }
}

.isTablet {
  display: none;

  @media @max-lg-tablet {
    display: unset;
  }

  @media @max-sl-mobile {
    display: none;
  }
}

.isMobile {
  display: none;

  @media @max-sl-mobile {
    display: unset;
  }
}

// class stylesheet
.fertilizer.container {
  margin: 38px 0;

  @media @max-sl-mobile {
    margin: 28px 0;
  }

  .card {
    .card-body {
      padding: 0;

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
            margin-right: 38px;

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

        .option-filter-group {
          position: relative;
          display: flex;
          align-items: center;

          .option-filter {
            border: 2px solid @color-blue500;
            border-radius: 8px;
            padding: 0 8px;
            height: 40px;
            margin-left: 18px;

            @media @max-sl-mobile {
              height: 32px;
              padding: 0 4px;
            }

            &:first-child {
              margin-left: 0;
            }

            &.option-filter-fixed {
              width: 40px;

              @media @max-sl-mobile {
                width: 32px;
              }
            }

            &.option-filter-collapse {
              display: none !important;

              @media @max-md-tablet {
                display: flex !important;
              }
            }

            &.option-sort {
              @media @max-md-tablet {
                display: none !important;
              }
            }

            .option-sort-item {
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

          .option-search-collapse {
            position: absolute;
            top: 0;
            left: -209px;
            transition: visibility 0s, opacity 0.5s linear;
            background: @color-blue700;
            border: 2px solid @color-blue500;
            border-radius: 8px;
            padding: 18px;
            z-index: 999;
            width: 250px;

            .collapse-item-header {
              margin-bottom: 10px;
            }

            .collapse-item-body {
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
            }
          }
        }
      }

      .fertilizer-content {
        .fertilizer-project-table {
          background: @color-blue700;
          border: 3px solid @color-blue500;
          border-radius: 18px;

          .project-banner {
            position: relative;
            border-bottom: 3px solid @color-blue500;
            height: 190px;

            .banner {
              width: 100%;
              height: 100%;
              border-radius: 18px 18px 0 0;
            }

            .project-status {
              position: absolute;
              top: 9px;
              left: 13px;
            }
          }

          &.first {
            border: 3px solid @color-petrol500;

            .project-banner {
              border-bottom: 3px solid @color-petrol500;
            }
          }

          .project-details {
            padding: 14px;

            .project-title {
              height: 170px;

              @media @max-sl-mobile {
                height: 111px;
              }

              .short-desc {
                display: block;
                margin-top: 4px;
              }
            }

            .project-info {
              margin-top: 18px;
              height: 48px;

              .project-balance {
                @media @max-lg-tablet {
                  height: 48px;
                }

                .label {
                  color: rgba(255, 255, 255, 0.6);
                }

                .value {
                  .coin-icon {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    margin-right: 8px;
                  }
                }
              }

              &.whitelist-countdown {
                height: 48px;
                // height: 114px;
                // background: @color-blue800;
                // padding: 8px;
                // border-radius: 18px;
              }

              &.fcsb-container {
                @media @max-lg-tablet {
                  display: inline-block !important;

                  .project-balance {
                    margin-bottom: 18px;

                    &:last-child {
                      margin-bottom: 0;
                    }
                  }
                }
              }
            }

            .project-desc {
              &.project-desc-whitelist {
                @media @max-sl-mobile {
                  display: inline-block !important;
                }

                .project-title {
                  width: 50%;

                  @media @max-lg-tablet {
                    width: 60%;
                  }

                  @media @max-sl-mobile {
                    width: 100%;
                  }
                }

                .project-info {
                  margin-top: 0;
                  height: auto;
                  width: 50%;

                  @media @max-lg-tablet {
                    width: 40%;
                  }

                  @media @max-sl-mobile {
                    width: 100%;
                    margin-top: 18px;
                  }
                }
              }
            }
          }

          .btn-container {
            margin-top: 18px;
          }
        }

        .fertilizer-funded-table {
          width: 100%;

          .fertilizer-funded-table-header {
            &.scrollFixed {
              position: sticky;
              background: @color-blue800;
              top: 70px;
              z-index: 999;
              width: 100%;
              transition: 0.3s all ease-in-out;
            }

            .header-column {
              text-align: center;
              padding: 18px 0;
              color: @color-neutral400;

              .header-column-title {
                cursor: pointer;
                display: flex;
                justify-content: center;

                .arrow-icon {
                  margin-left: 4px;
                }

                .sort-icon-active {
                  color: #13ecab;
                }
              }
            }
          }

          .fertilizer-funded-table-body {
            .fertilizer-funded-table-item {
              display: flex;
              align-items: center;
              background: rgba(23, 32, 88, 0.9);
              border-radius: 8px;
              padding: 18px;
              margin-bottom: 8px;
              border: 3px solid transparent;

              &:hover {
                border-color: @color-blue500;
              }

              &:last-child {
                margin-bottom: 0;
              }

              .state {
                text-align: center;

                .show-more {
                  position: relative;
                  width: 20px;
                  margin: auto;

                  .option-sort-collapse {
                    top: 0;
                    right: 25px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media @max-lg-tablet {
  .fertilizer.container {
    .state {
      .label {
        display: block;
        color: @color-neutral400;
      }

      .project-ath .value {
        margin-top: 4px;
      }
    }

    .collapse-row {
      background: @color-blue800;
      border-radius: 8px;
      padding: 18px;

      .btn-group {
        .btn-group-item {
          &:last-child {
            margin-top: 18px;
          }
        }

        .btn-container,
        .social-link {
          margin-right: 18px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
.fertilizer {
  .ant-collapse {
    background: transparent;
    border: none;

    .ant-collapse-item {
      position: relative;
      background: rgba(23, 32, 88, 0.9);
      border-radius: 8px !important;
      margin-bottom: 8px;
      border-bottom: 0;
      border: 3px solid transparent;

      &:hover {
        border-color: @color-blue500;
      }

      .ant-collapse-header {
        padding: 18px;

        .ant-collapse-arrow {
          display: none;
        }
      }

      .ant-collapse-content {
        border: none;
        background: transparent;

        .ant-collapse-content-box {
          padding: 18px;
        }
      }
    }
  }

  .project-info .project-balance .value .ant-statistic-content-value {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0.15px;
  }
}

.ant-tooltip .ant-tooltip-inner {
  width: 180px !important;
}
</style>
