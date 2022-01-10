<template>
  <div class="fertilizer-project container">
    <div class="card">
      <div class="card-body">
        <section class="project-header">
          <div class="back-to-list icon-cursor fcl-container">
            <img class="back-icon" src="@/assets/icons/back.svg" />
            <span class="back-label textM weightB">Go back</span>
          </div>
        </section>

        <section class="project-content">
          <Row :gutter="20">
            <Col :span="6" class="project-preview-container">
              <div class="project-preview">
                <div class="project-overview fcb-container">
                  <div class="project-title fcl-container">
                    <img class="project-logo" :src="fertilizer.logo" />
                    <span class="textL weightB">{{ fertilizer.title }}</span>
                  </div>
                  <div
                    class="project-status"
                    :class="
                      fertilizer.status === filterOptions.whitelist
                        ? 'whitelist'
                        : fertilizer.status === filterOptions.sales
                        ? 'sales'
                        : fertilizer.status === filterOptions.distribution
                        ? 'distribution'
                        : fertilizer.status === filterOptions.preparation
                        ? 'preparation'
                        : ''
                  ">
                    <span class="bodyXS weightB">{{ fertilizer.status }}</span>
                  </div>
                </div>
                <div class="project-countdown">
                  <Countdown
                    :title="
                      fertilizer.status === filterOptions.whitelist
                        ? 'End of the whitelist in'
                        : fertilizer.status === filterOptions.sales && currentTimestamp < fertilizer.sales_start_date
                        ? 'Sales starts in'
                        : fertilizer.status === filterOptions.sales && currentTimestamp > fertilizer.sales_start_date
                        ? 'End of the sales in'
                        : fertilizer.status === filterOptions.distribution
                        ? 'Distribution starts in'
                        : fertilizer.status === filterOptions.preparation
                        ? 'Whitelist starts in'
                        : ''
                    "
                    :value="
                      fertilizer.status === filterOptions.whitelist
                        ? fertilizer.whitelist_end_date
                        : fertilizer.status === filterOptions.sales && currentTimestamp < fertilizer.sales_start_date
                        ? fertilizer.sales_start_date
                        : fertilizer.status === filterOptions.sales && currentTimestamp > fertilizer.sales_start_date
                        ? fertilizer.sales_end_date
                        : fertilizer.status === filterOptions.distribution
                        ? fertilizer.distribution_start_date
                        : fertilizer.status === filterOptions.preparation
                        ? fertilizer.whitelist_start_date
                        : ''
                    "
                    format="DD:HH:mm:ss"
                  />
                </div>
                <div class="btn-container">
                  <Button class="btn-transparent textM weightS">Subscribe Whitelist</Button>
                </div>
              </div>
              <div class="project-ido-container">
                <div class="project-ido-process">
                  <Steps :current="0" size="small" direction="vertical" :status="stepsStatus">
                    <Step>
                      <template slot="title">
                        <span class="textS weightB">Preparation</span>
                      </template>
                    </Step>
                    <Step>
                      <template slot="title">
                        <span class="textS weightB">Whitelist</span>
                      </template>
                    </Step>
                    <Step>
                      <template slot="title">
                        <span class="textS weightB">Sales</span>
                      </template>
                    </Step>
                    <Step>
                      <template slot="title">
                        <span class="textS weightB">Distribution</span>
                      </template>
                    </Step>
                  </Steps>
                </div>
              </div>
            </Col>
            <Col :span="18" class="project-detail-container">
              <div class="project-detail-item">
                <Row :gutter="24">
                  <Col :span="10">
                    <div class="project-detail-desc">
                      <div class="project-title fcl-container">
                        <img class="project-logo" :src="fertilizer.logo" />
                        <h4 class="weightB letterM">{{ fertilizer.title }}</h4>
                      </div>
                      <div class="project-short-desc">
                        <span class="textM weightS">{{ fertilizer.short_desc }}</span>
                      </div>
                      <span class="textM">{{ fertilizer.long_desc }}</span>
                    </div>
                  </Col>
                  <Col :span="14">
                    <div class="project-detail-info-group">
                      <Row :gutter="[28, 40]">
                        <Col :span="8" class="project-detail-info-item">
                          <span class="title textS weightS letterL">Token Price</span>
                          <div class="value fcl-container">
                            <CoinIcon class="coin-icon" :mint-address="fertilizer.mint" />
                            <span class="textM"><b>{{ fertilizer.token_price }}</b> USDC</span>
                          </div>
                        </Col>
                        <Col :span="8" class="project-detail-info-item">
                          <span class="title textS weightS letterL">Hard Cap</span>
                          <div class="value fcl-container">
                            <CoinIcon class="coin-icon" :mint-address="fertilizer.mint" />
                            <span class="textM"><b>{{ fertilizer.hard_cap }}</b> USDC</span>
                          </div>
                        </Col>
                        <Col :span="8" class="project-detail-info-item">
                          <span class="title textS weightS letterL">Pool Size</span>
                          <div class="value fcl-container">
                            <img class="coin-icon" :src="fertilizer.logo" />
                            <span class="textM"><b>{{ fertilizer.pool_size }}</b> {{ fertilizer.token_symbol }}</span>
                          </div>
                        </Col>
                        <Col :span="8" class="project-detail-info-item">
                          <span class="title textS weightS letterL">Type</span>
                          <div class="value fcl-container">
                            <img class="lock-icon" src="@/assets/icons/lock.svg" />
                            <span class="textM weightS">Vested</span>
                          </div>
                        </Col>
                        <Col :span="8" class="project-detail-info-item">
                          <span class="title textS weightS letterL">Participants</span>
                          <div class="value fcl-container">
                            <span class="textM weightS">{{ fertilizer.participants }}</span>
                          </div>
                        </Col>
                        <Col :span="8" class="project-detail-info-item">
                          <span class="title textS weightS letterL">Website</span>
                          <div class="value fcl-container">
                            <a class="website textM weightS" :href="fertilizer.website_url" target="_blank">{{ fertilizer.website }}</a>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
              <div class="project-detail-item banner fcb-container">
                <div class="project-detail-stake">
                  <h4 class="weightS">Develop your Tier to have more allocation</h4>
                  <div class="btn-container">
                    <Button class="btn-transparent textM weightS">Stake CRP</Button>
                  </div>
                </div>
                <img class="farmer-img" src="@/assets/background/farmer.png" />
              </div>
              <div class="project-detail-item transparent">
                <h3 class="weightS">Project Details</h3>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="weightS">About</h3>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="weightS">Features</h3>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="weightS">Roadmap</h3>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="weightS">Team & Backers</h3>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="weightS">Tokenomics</h3>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="weightS">Token Distribution</h3>
              </div>
            </Col>
          </Row>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Row, Col, Statistic, Steps } from 'ant-design-vue'
import moment from 'moment'
const Countdown = Statistic.Countdown
const Step = Steps.Step

export default Vue.extend({
  components: {
    Row,
    Col,
    Countdown,
    Steps,
    Step
  },

  data() {
    return {
      fertilizer: {
        status: 'Whitelist Open',
          picture: '/fertilizer/banner/unq.png',
          logo: '/fertilizer/logo/unq.png',
          title: 'UNQ.club',
          short_desc: 'Social platform for NFT asset management',
          long_desc: 'Whether a professional collector or aspiring enthusiast - UNQ is a place where you can take your game to the next level.',
          hard_cap: '3000K',
          pool_size: 5000,
          participants: 100418,
          token_price: 0.028,
          token_symbol: "UNQ",
          website: 'UNQ.club',
          website_url: 'https://UNQ.club',
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          whitelist_end_date: 1643500800000
      },
      fertilizerData: [
        {
          status: 'Whitelist Open',
          picture: '/fertilizer/banner/unq.png',
          logo: '/fertilizer/logo/unq.png',
          title: 'UNQ.club',
          short_desc: 'Social platform for NFT asset management',
          hard_cap: '3000K',
          token_price: 0.028,
          participants: 100418,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          whitelist_end_date: 1643500800000
        },
        {
          status: 'Sales',
          picture: '/fertilizer/banner/metaprints.png',
          title: 'Metaprints',
          short_desc: 'Blueprints for metaverses',
          hard_cap: '3000K',
          participants: 100418,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          sales_start_date: 1641280215000,
          sales_end_date: 1643500800000
        },
        {
          status: 'Sales',
          picture: '/fertilizer/banner/galaxy.png',
          title: 'Galaxy War',
          short_desc: 'Our galatic adventure awaits',
          hard_cap: '3000K',
          participants: 100418,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          sales_start_date: 1643500800000
        },
        {
          status: 'Distribution',
          picture: '/fertilizer/banner/meanfi.png',
          title: 'MeanFI',
          short_desc: 'Grow your money stash with the best prices across DeFi',
          hard_cap: '3000K',
          participants: 100418,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          distribution_start_date: 1643500800000
        },
        {
          status: 'Preparation',
          picture: '/fertilizer/banner/agoric.png',
          title: 'Agoric',
          short_desc: 'Social platform for NFT asset management',
          hard_cap: '3000K',
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          whitelist_start_date: 1643500800000
        },
        {
          status: 'Preparation',
          picture: '/fertilizer/banner/metaprints.png',
          title: 'Metaprints',
          short_desc: 'Blueprints for metaverses',
          hard_cap: '3000K',
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        },
        {
          status: 'Funded',
          picture: '/fertilizer/logo/defiland.png',
          title: 'DeFi Land',
          short_desc: 'Gamified Decentralized Finance',
          subscribers: 1000,
          hard_cap: 250000,
          token_price: 0.068,
          ath: 526.7,
          distribution_end_date: 1643500800000
        },
        {
          status: 'Funded',
          picture: '/fertilizer/logo/sonar.png',
          title: 'Sonar Watch',
          short_desc: 'Empowering user journey on Solana DeFi',
          subscribers: 1001,
          hard_cap: 249999,
          token_price: 0.069,
          ath: 526.6,
          distribution_end_date: 1643500800000
        },
        {
          status: 'Funded',
          picture: '/fertilizer/logo/goosefx.png',
          title: 'GooseFX',
          short_desc: 'A Complete DeFi Experience',
          subscribers: 1002,
          hard_cap: 249998,
          token_price: 0.07,
          ath: 526.5,
          distribution_end_date: 1643500800000
        },
        {
          status: 'Funded',
          picture: '/fertilizer/logo/waggle.png',
          title: 'Waggle Network',
          short_desc: 'Primary markets for everyone',
          subscribers: 1003,
          hard_cap: 249997,
          token_price: 0.071,
          ath: 526.4,
          distribution_end_date: 1643500800000
        },
        {
          status: 'Funded',
          picture: '/fertilizer/logo/cryowar.png',
          title: 'Cryowar',
          short_desc: 'Next-gen blockchain multiplayer game',
          subscribers: 1004,
          hard_cap: 249996,
          token_price: 0.071,
          ath: 526.3,
          distribution_end_date: 1643500800000
        },
        {
          status: 'Funded',
          picture: '/fertilizer/logo/cyclos.png',
          title: 'Cyclos',
          short_desc: 'Decentralized trading unleashed',
          subscribers: 1005,
          hard_cap: 249995,
          token_price: 0.073,
          ath: 526.2,
          distribution_end_date: 1643500800000
        }
      ],
      filterOptions: {
        all: 'All',
        whitelist: 'Whitelist Open',
        sales: 'Sales',
        distribution: 'Distribution',
        upcoming: 'Upcoming',
        preparation: 'Preparation',
        funded: 'Funded'
      },
      currentTimestamp: 0,
      stepsStatus: 'process' as string
    }
  },

  head: {
    title: 'Fertilizer Project Details'
  },

  computed: {
    // ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  watch: {
  },

  mounted() {
    this.currentTimestamp = moment().valueOf()
  },

  methods: {
    moment() {
      return moment()
    },
  }
})
</script>

<style lang="less" scoped>
// global stylesheet
.btn-container {
  background: @gradient-btn-primary;
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

.project-status {
  padding: 4px 8px;
  border-radius: 6px;

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

// class stylesheet
.fertilizer-project.container {
  margin: 38px 0;

  @media @max-sl-mobile {
    margin: 28px 0;
  }

  .card {
    .card-body {
      padding: 0;

      .project-header {
        margin-bottom: 28px;

        .back-to-list {
          opacity: 0.5;

          .back-icon {
            margin-right: 8px;
          }

          .back-label {
            color: #fff;
          }
        }
      }
      
      .project-content {
        .project-preview-container {
          .project-preview {
            background: @gradient-btn-wallet;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;

            .project-overview {
              .project-title {
                .project-logo {
                  border-radius: 50%;
                  margin-right: 8px;
                }
              }
            }
            .project-countdown {
              margin: 16px 0;
            }
          }

          .project-ido-container {
            background: linear-gradient(215.52deg, #273592 0.03%, #23ADB4 99.97%);
            padding: 3px;
            border-radius: 8px;
            
            .project-ido-process {
              height: 100%;
              width: 100%;
              background: @color-blue800;
              border-radius: 8px;
              padding: 13px 21px;
            }
          }
        }

        .project-detail-container {
          .project-detail-item {
            background: @color-blue700;
            border-radius: 8px;
            padding: 32px;
            margin-bottom: 32px;

            &:last-child {
              margin-bottom: 0;
            }

            .project-detail-desc {
              .project-title {
                margin-bottom: 16px;

                .project-logo {
                  margin-right: 8px;
                  border-radius: 50%;
                }
              }

              .project-short-desc {
                margin-bottom: 8px;
              }
            }

            .project-detail-info-group {
              .project-detail-info-item {
                .title {
                  color: rgba(255, 255, 255, 0.6);
                }
                .value {
                  .website {
                    color: #fff;
                    text-decoration: underline;
                    text-underline-position: under;
                  }

                  .coin-icon {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    margin-right: 6px;
                  }
                  
                  .lock-icon {
                    margin-right: 6px;
                  }
                }
              }
            }

            &.banner {
              padding: 0 32px;
              margin-bottom: 132px;

              .project-detail-stake {
                padding: 32px 32px 32px 0;
                width: calc(100% - 350px);

                .btn-container {
                  width: 150px;
                  margin-top: 18px;
                }
              }

              .farmer-img {
                width: 350px;
              }
            }

            &.transparent {
              background: transparent;
              padding: 0;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.fertilizer-project {
  // ant steps
  .ant-steps-vertical {
    .ant-steps-item-content {
      min-height: 45px;
    }

    .ant-steps-item-active,
    .ant-steps-item-finish {
      .ant-steps-item-tail::after,
      .ant-steps-item-icon {
        background-color: @color-petrol500 !important;
      }

      .ant-steps-item-title {
        color: @color-petrol500 !important;
      }
    }

    .ant-steps-item-error {
      .ant-steps-item-icon {
        background-color: red !important;
      }
    }

    .ant-steps-item {
      .ant-steps-item-container {
        .ant-steps-item-tail {
          &::after {
            background-color: rgba(255, 255, 255, 0.4);
          }
        }

        .ant-steps-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          background-color: rgba(255, 255, 255, 0.4);

          .ant-steps-icon {
            top: 0;
            font-size: 13px;
            line-height: 19.5px;
            letter-spacing: 0.5px;
            font-weight: 600;
            color: @color-blue700;
          }
        }

        .ant-steps-item-title {
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
}
</style>