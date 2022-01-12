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
                    "
                  >
                    <span class="bodyXS weightB">{{ fertilizer.status }}</span>
                  </div>
                </div>
                <div class="project-countdown">
                  <Countdown
                    v-if="currentStep < 3"
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
                <div class="project-progress">
                  <div v-if="currentStep === 0" class="btn-container">
                    <Button class="btn-transparent textM weightS">Subscribe Whitelist</Button>
                  </div>
                  <div v-else-if="currentStep > 0 && currentStep < 3" class="fcc-container">
                    <img class="check-icon" src="@/assets/icons/check-white.svg" />
                    <span class="textS weightS letterL">Following {{ fertilizer.title }} </span>
                  </div>
                  <div v-else class="btn-container">
                    <Button class="btn-transparent textM weightS">Start Farming</Button>
                  </div>
                </div>
              </div>
              <div class="project-ido-container">
                <div class="project-ido-process">
                  <Steps :current="currentStep" size="small" direction="vertical" :status="stepsStatus">
                    <Step>
                      <template slot="title">
                        <span class="textS weightB">Preparation</span>
                      </template>
                    </Step>
                    <Step>
                      <template slot="title">
                        <div class="fcb-container">
                          <span class="textS weightB">Whitelist</span>
                          <span v-if="currentStep > 1" class="status-label success textS weightB">Registered</span>
                        </div>
                        <span v-if="currentStep === 1" class="status-label description textS"
                          >You can now whitelist yourself for the lottery.</span
                        >
                      </template>
                    </Step>
                    <Step>
                      <template slot="title">
                        <div class="fcb-container">
                          <span class="textS weightB">Sales</span>
                          <span v-if="currentStep > 2" class="status-label closed textS weightB">Closed</span>
                        </div>
                        <span v-if="currentStep === 2" class="status-label description textS"
                          >Winners can participate in the token sale.</span
                        >
                      </template>
                    </Step>
                    <Step>
                      <template slot="title">
                        <div class="fcb-container">
                          <span class="textS weightB">Distribution</span>
                          <span v-if="currentStep >= 3" class="status-label success textS weightB">Distributed</span>
                        </div>
                        <span v-if="currentStep === 3" class="status-label description textS"
                          >The tokens get distributed to Sale participants.</span
                        >
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
                            <span class="textM"
                              ><b>{{ fertilizer.ido_info.sale_rate }}</b> USDC</span
                            >
                          </div>
                        </Col>
                        <Col :span="8" class="project-detail-info-item">
                          <span class="title textS weightS letterL">Hard Cap</span>
                          <div class="value fcl-container">
                            <CoinIcon class="coin-icon" :mint-address="fertilizer.mint" />
                            <span class="textM"
                              ><b>{{ fertilizer.ido_info.hard_cap }}</b> USDC</span
                            >
                          </div>
                        </Col>
                        <Col :span="8" class="project-detail-info-item">
                          <span class="title textS weightS letterL">Pool Size</span>
                          <div class="value fcl-container">
                            <img class="coin-icon" :src="fertilizer.logo" />
                            <span class="textM"
                              ><b>{{ fertilizer.pool_size }}</b> {{ fertilizer.token_info.symbol }}</span
                            >
                          </div>
                        </Col>
                        <Col :span="8" class="project-detail-info-item">
                          <span class="title textS weightS letterL">Type</span>
                          <div class="value fcl-container">
                            <img class="lock-icon" src="@/assets/icons/lock.svg" />
                            <span class="textM weightS">{{ fertilizer.ido_info.sale_type }}</span>
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
                            <a class="website textM weightS" :href="fertilizer.website_url" target="_blank">{{
                              fertilizer.website
                            }}</a>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
              <div v-if="currentStep === 1" class="project-detail-item">
                <h4 class="weightS">Earn Social Pool tickets!</h4>
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
                <h3 class="project-category-title weightS">Project Details</h3>
                <Row :gutter="40">
                  <Col :span="12">
                    <span class="textL weightB">IDO Information</span>
                    <div class="information">
                      <div class="information-item fcb-container">
                        <span class="label textS weightS letterL">Hardcap</span>
                        <span class="textM weightS letterS">{{ fertilizer.ido_info.hard_cap }}</span>
                      </div>
                      <div class="information-item fcb-container">
                        <span class="label textS weightS letterL">Sale rate</span>
                        <span class="textM weightS letterS">{{ fertilizer.ido_info.sale_rate }}</span>
                      </div>
                      <div class="information-item fcb-container">
                        <span class="label textS weightS letterL">Sale type</span>
                        <span class="textM weightS letterS">{{ fertilizer.ido_info.sale_type }}</span>
                      </div>
                      <div class="information-item fcb-container">
                        <span class="label textS weightS letterL">Open Time</span>
                        <span class="textM weightS letterS">{{ fertilizer.ido_info.open_time }}</span>
                      </div>
                      <div class="information-item fcb-container">
                        <span class="label textS weightS letterL">Close Time</span>
                        <span class="textM weightS letterS">{{ fertilizer.ido_info.close_time }}</span>
                      </div>
                    </div>
                  </Col>
                  <Col :span="12">
                    <span class="textL weightB">Token Information</span>
                    <div class="information">
                      <div class="information-item fcb-container">
                        <span class="label textS weightS letterL">Symbol</span>
                        <span class="textM weightS letterS">{{ fertilizer.token_info.symbol }}</span>
                      </div>
                      <div class="information-item fcb-container">
                        <span class="label textS weightS letterL">Category</span>
                        <span class="textM weightS letterS">{{ fertilizer.token_info.category }}</span>
                      </div>
                      <div class="information-item fcb-container">
                        <span class="label textS weightS letterL">Token Distribution</span>
                        <span class="textM weightS letterS">{{ fertilizer.token_info.token_distribution }}</span>
                      </div>
                      <div class="information-item fcb-container">
                        <span class="label textS weightS letterL">Blockchain</span>
                        <span class="textM weightS letterS">{{ fertilizer.token_info.blockchain }}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="project-category-title weightS">About</h3>
                <Row class="project-category-content-about" :gutter="40">
                  <Col :span="12">
                    <span class="textM">
                      Discover, Collect, and Trade NFTs as a team.<br /><br />
                      The first NFT asset management platform providing tools for collectors and investors to power the
                      NFT space. Running cross-chain, powered by Solana.<br /><br />
                      We bring more togetherness to the NFT space<br /><br />
                      Create a club, act as a curator, raise funds to expand your collection, and build a community
                      around it.
                    </span>
                  </Col>
                  <Col :span="12">
                    <img class="banner-img" :src="fertilizer.img.about" />
                  </Col>
                </Row>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="project-category-title weightS">Features</h3>
                <img class="project-category-banner-img" :src="fertilizer.img.features" />
                <div>
                  <div>
                    <span class="textM weightS">Onwership DAOs</span>
                    <br /><br />
                    <span class="textM">
                      You can't just copy trade NFTs since they are unique and have a big social component. That's why
                      UNQ allows you to create Clubs - essentially, ownership DAOs that are led by an experience and
                      dedicated collector, and community can bring additional liquidity, participation, and governance.
                    </span>
                  </div>
                  <br />
                  <div>
                    <span class="textM weightS">Flexible structure</span>
                    <br /><br />
                    <span class="textM">
                      Want to have a better asset management for you play to earn guild? We got it. Want to get buy
                      those expensive NFTs together with a team to de-risk your invetments? Do it. Want to turn
                      collecting into a business, or expand existing gallery business into the digital world and be able
                      to raise funds and get access to the world of NFTs? Explore our Public clubs and social tokens.
                    </span>
                  </div>
                  <br />
                  <div>
                    <span class="textM weightS">Cross-chain transactions</span>
                    <br /><br />
                    <span class="textM">
                      NFT market is growing, and more blockchains are introducing NFT support, which makes collector's
                      life hard. We know that, and we want you to be able to focus on what you do best - buy and sell
                      NFTs. That's why we are developing a solution that will allow you to transact with NFTs across
                      chains from a single trustless Solana-based interface.
                    </span>
                  </div>
                  <br />
                  <div>
                    <span class="textM weightS">Token utility :</span>
                    <br /><br />
                    <span class="textM">
                      -UNQ is a single token utilized across the products.
                      <br /><br />
                      -Transacting Universe NFTs with UNQ gives additional benefits
                      <br /><br />
                      -UNQ is a platform governance token in Clubs
                      <br /><br />
                      -Clubs can upgrade using UNQ
                      <br /><br />
                      -Club tokens can be only traded against UNQ
                      <br /><br />
                      -Rewards for content creators in Worlds are in UNQ
                    </span>
                  </div>
                </div>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="project-category-title weightS">Roadmap</h3>
                <img class="project-category-banner-img" :src="fertilizer.img.roadmap" />
                <div>
                  <span class="textM">
                    <b>Phase 1 - </b>Inception <br /><br />
                    <b>Phase 2 - </b>MVP development , Solana Hackathon participation (winner 3rd place) <br /><br />
                    <b>Phase 3 - </b>Further development, Market research, Private fundraise <br /><br />
                    <b>Phase 4 - </b>Private beta of UNQ Club and UNQ World, NFT collection - UNQ Universe, Public beta
                    of UNQ Club <br /><br />
                    <b>Phase 5 - </b>Release of UNQ Club, Public beta of UNQ World <br /><br />
                    <b>Phase 6 - </b>Release of UNQ World
                  </span>
                </div>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="project-category-title weightS">Team & Backers</h3>
                <img class="project-category-banner-img" :src="fertilizer.img.team" />
                <div>
                  <span class="textM">
                    Co-founder and CEO - Alex Migitko : Entrepreneur, 17 years in IT, of which 10 years in game
                    development, 5 years blockchain.
                    <br /><br />
                    Co-founder and CTO - Uros Sosevic : Software engineer, 17 years of experience as a developer,
                    architect and CTO;5 years of experience working with
                    <br /><br />
                    Co-founder and BD - Martin Kardzhilov - Crypto-native, investor, marketing expert, working for 5
                    years exclusively in the crypto industry.
                    <br /><br />
                    Backers :
                    <br /><br />
                    Solana Foundation, Jump Capital, GSR, Gate.io , MEXC, NGC, WWG, Chainboost, Solanium Ventures, Solar
                    Eco Fund, ZBS, Kernel Ventuires, Basics Capital, Titans Ventures, AU21, DWeb3 Capital, WaterDrip,
                    FBG, Everse Capital, Chain Capital, CryptoJ, Moonedge
                  </span>
                </div>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="project-category-title weightS">Tokenomics</h3>
                <img class="project-category-banner-img" :src="fertilizer.img.tokenomics" />
                <div>
                  <span class="textM">
                    Tokenomics description *
                    <br /><br />
                    Team and Advisors - 20%
                    <br /><br />
                    Seed round - 15%
                    <br /><br />
                    Strategic round - 7.5%
                    <br /><br />
                    Public - 1.5%
                    <br /><br />
                    Marketing - 5%
                    <br /><br />
                    Liquidity - 10%
                    <br /><br />
                    Staking rewards - 25%
                    <br /><br />
                    Treasury - 16%
                  </span>
                </div>
              </div>
              <div class="project-detail-item transparent">
                <h3 class="project-category-title weightS">Token Distribution</h3>
                <img class="project-category-banner-img" :src="fertilizer.img.distribution" />
                <div>
                  <span class="textM">
                    Seed round - $0.02 (10M FDV), 5% TGE, 12 months cliff, 5%/ Daily over 12 months
                    <br /><br />
                    Strategic round - 0.04 (20m FDV), 10% TGE, 9 months cliff, 5%/ Daily over 9 months
                    <br /><br />
                    Public round - 0.0533 (26.7 FDV), 50% TGE, 3 months cliff / 25% / 3 months cliff/ 25%
                    <br /><br />
                    Team and Advisors - 2 years cliff , 3 years daily distribution
                    <br /><br />
                    Total supply - 500 000 000 UNQ tokens
                    <br /><br />
                    Initial Market cap - $700 000
                    <br /><br />
                    Hard cap - $3 400 000
                  </span>
                </div>
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
        long_desc:
          'Whether a professional collector or aspiring enthusiast - UNQ is a place where you can take your game to the next level.',
        hard_cap: '3000K',
        pool_size: 5000,
        participants: 100418,
        website: 'UNQ.club',
        website_url: 'https://UNQ.club',
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        whitelist_end_date: 1643500800000,
        ido_info: {
          hard_cap: 140000,
          sale_rate: 0.028,
          sale_type: 'Vested',
          open_time: 1643500800000,
          close_time: 1643500800000
        },
        token_info: {
          symbol: 'UNQ',
          category: 'NFT',
          token_distribution: 1643500800000,
          blockchain: 'Solana'
        },
        img: {
          about: '/fertilizer/project/unq/about.png',
          features: '/fertilizer/project/unq/features.png',
          roadmap: '/fertilizer/project/unq/roadmap.png',
          team: '/fertilizer/project/unq/team.png',
          tokenomics: '/fertilizer/project/unq/tokenomics.png',
          distribution: '/fertilizer/project/unq/distribution.png'
        }
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
      currentStep: 0 as number,
      stepsStatus: 'process' as string
    }
  },

  head: {
    title: 'Fertilizer Project Details'
  },

  computed: {
    // ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  watch: {},

  mounted() {
    this.currentTimestamp = moment().valueOf()
  },

  methods: {
    moment() {
      return moment()
    }
  }
})
</script>

<style lang="less" scoped>
// global stylesheet
.btn-container {
  background: @gradient-color01;
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

.status-label {
  &.description {
    color: #fff;
  }

  &.success {
    color: @color-green500;
  }

  &.closed {
    color: @color-red500;
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
            background: @gradient-color04;
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

            .project-progress {
              .check-icon {
                margin-right: 8px;
              }
            }
          }

          .project-ido-container {
            background: linear-gradient(215.52deg, #273592 0.03%, #23adb4 99.97%);
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
              margin-bottom: 60px;

              .project-category-title {
                margin-bottom: 32px !important;
              }

              .project-category-content-about {
                display: flex;
                align-content: stretch;

                .banner-img {
                  width: 100%;
                  height: 100%;
                }
              }

              .project-category-banner-img {
                width: 100%;
                border-radius: 8px;
                margin-bottom: 40px;
              }

              .information {
                .information-item {
                  margin-top: 8px;
                  padding: 8px 0;
                  border-bottom: 1px solid @color-blue200;

                  .label {
                    color: rgba(255, 255, 255, 0.7);
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
            display: flex;
            top: 0;
            font-size: 13px;
            line-height: 19.5px;
            letter-spacing: 0.5px;
            font-weight: 600;
            color: @color-blue700;
          }
        }

        .ant-steps-item-title {
          width: 100%;
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
}
</style>