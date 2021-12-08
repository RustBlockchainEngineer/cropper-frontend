<template>
  <main class="landing">
    <section class="landing-header">
      <div class="landing-top">
        <img class="cropper-logo" src="@/assets/icons/cropper-logo.svg" />
        <div class="lunch-btn-group">
          <div class="btn-container doc-btn">
            <Button class="btn-outline weightS">Documentation</Button>
          </div>
          <NuxtLink to="/swap/">
            <Button class="btn-fill weightS">Launch App</Button>
          </NuxtLink>
        </div>
      </div>

      <div class="landing-content">
        <Row :gutter="20">
          <Col :span="22" :offset="1">
            <div class="balance-infos">
              <h2 class="weightS tlv-value">TLV {{ TVL }}€</h2>
              <div class="token-infos">
                <img src="@/assets/icons/cropper.svg" />
                <label class="bodyM weightS"><u>CRP Token</u></label>
                <label class="bodyM weightS">Price: {{ CRPPrice }}€</label>
                <label class="bodyM weightS">Market Cap: {{ marketCap }}€</label>
              </div>
            </div>
            <div class="cropper-content">
              <label class="displayL weightB"
                >The Ultimate <br />
                DeFi Protocol</label>
              <p class="powered-by bodyL weightB">Powered by Solana</p>
            </div>
            <div class="read-more">
              <div class="btn-container">
                <Button class="btn-outline">Read More</Button>
              </div>
            </div>
            <div class="social-links">
              <a :href="socialLinks.medium" target="_blank"><img src="@/assets/social/medium-blue.svg" /></a>
              <a :href="socialLinks.discord" target="_blank"><img src="@/assets/social/discord-blue.svg" /></a>
              <a :href="socialLinks.twitter" target="_blank"><img src="@/assets/social/twitter-blue.svg" /></a>
              <a :href="socialLinks.telegram" target="_blank"><img src="@/assets/social/telegram-blue.svg" /></a>
            </div>
            <img class="move-next-section" src="@/assets/icons/transparent-arrow.svg" />
          </Col>
        </Row>
      </div>
    </section>

    <section class="why-cropper">
      <Row>
        <Col :span="22" :offset="1">
          <h2 class="weightB text-center">Why Cropper?</h2>
          <div class="intro-box-group">
            <img class="stars-second-bg" src="@/assets/landing_v2/stars-second-bg.svg" />

            <div class="intro-box text-center">
              <img class="card-img" src="@/assets/landing_v2/card-apr.svg" />
              <h4 class="weightB">Best Farms APR%</h4>
            </div>
            <div class="intro-box text-center">
              <img class="card-img" src="@/assets/landing_v2/card-community.svg" />
              <h4 class="weightB">Community driven</h4>
            </div>
            <div class="intro-box text-center">
              <img class="card-img" src="@/assets/landing_v2/card-swap.svg" />
              <h4 class="weightB">Best Price Swaps</h4>
            </div>
          </div>
        </Col>
      </Row>
    </section>

    <section class="why-cropper-audit">
      <img class="landing-second-img" src="@/assets/landing_v2/landing-second-bg.svg" />

      <div class="audit-group">
        <Row>
          <Col :span="22" :offset="1">
            <div class="audit-box-group">
              <div class="audit-box">
                <h2 class="weightS">
                  Farm Program <br />
                  Security Audit
                </h2>
                <a
                  class="read-pdf bodyL"
                  href="https://github.com/HalbornSecurity/PublicReports/blob/master/Solana%20Program%20Audit/Cropper_Finance_Farm_Solana_Program_Security_Audit_Report_Halborn_Final.pdf"
                  target="_blank"
                >
                  <img class="pdf-icon" src="@/assets/landing_v2/pdf-icon.svg" />
                  Read the Audit
                </a>
              </div>
              <div class="audit-box">
                <h2 class="weightS">
                  AMM Program <br />
                  Security Audit
                </h2>
                <a
                  class="read-pdf bodyL"
                  href="https://github.com/HalbornSecurity/PublicReports/blob/master/Solana%20Program%20Audit/Cropper_Finance_AMM_Program_Security_Audit_Report_Halborn_Final.pdf"
                  target="_blank"
                >
                  <img class="pdf-icon" src="@/assets/landing_v2/pdf-icon.svg" />
                  Read the Audit
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>

    <section class="features-headline">
      <Row>
        <Col :span="22" :offset="1">
          <h2 class="weightB text-center">Features headline</h2>
          <p class="bodyL text-center" style="margin-top: 20px">
            Reprehenderit esse labore id veniam ut veniam non ex adipisicing
          </p>
          <Row :gutter="25" class="feature-box-group">
            <img class="stars-third-bg" src="@/assets/landing_v2/stars-third-bg.svg" />
            <Col :xs="12" :sm="12" :md="6">
              <div class="feature-box">
                <img class="feature-img" src="@/assets/landing_v2/feature-swap.svg" />
                <h4 class="title weightB">Swap</h4>
                <p class="bodyM content">Designed to give you the best price on Solana</p>
                <NuxtLink to="/swap" class="bodyM now-btn weightS">
                  Swap Now
                </NuxtLink>
              </div>
            </Col>
            <Col :xs="12" :sm="12" :md="6">
              <div class="feature-box">
                <img class="feature-img" src="@/assets/landing_v2/feature-farming.svg" />
                <h4 class="title weightB">Farming</h4>
                <p class="bodyM content">Enjoy a wide variety of Permissionless and Labelized farms</p>
                <NuxtLink to="/farms" class="bodyM now-btn weightS">
                  Farm Now
                </NuxtLink>
              </div>
            </Col>
            <Col :xs="12" :sm="12" :md="6">
              <div class="feature-box">
                <img class="feature-img" src="@/assets/landing_v2/feature-staking.svg" />
                <h4 class="title weightB">Staking</h4>
                <p class="bodyM content">Stake CRP through 4 tiers and get advantages on the plateform</p>
                <NuxtLink to="/staking" class="bodyM now-btn weightS">
                  Stake Now
                </NuxtLink>
              </div>
            </Col>
            <Col :xs="12" :sm="12" :md="6">
              <div class="feature-box">
                <img class="feature-img" src="@/assets/landing_v2/feature-fertilizer.svg" />
                <h4 class="title weightB">Fertilizer</h4>
                <p class="bodyM content">The Fertilizer launcher is curently being imrpoved.</p>
                <NuxtLink to="/" class="bodyM now-btn weightS soon">
                  Coming Soon!
                </NuxtLink>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </section>

    <section class="how-works">
      <h2 class="weightB text-center">How it works</h2>
      <div class="tutorial-container">
        <img class="landing-third-bg" src="@/assets/landing_v2/landing-third-bg.svg" />
        <div class="tutorial-group">
          <Tabs defaultActiveKey="1" onChange="{callback}">
            <TabPane tab="For Farmers" key="1">
              <Row :gutter="20">
                <Col :xs="24" :sm="24" :md="8">
                  <p class="bodyL weightB">Prepare to harvest</p>
                  <div class="play-list">
                    <Button
                      class="play-list-btn bodyM weightS"
                      @click="selectVideo(1)"
                      :class="currentPlay === 1 ? 'active' : ''"
                      >1. Buy the token you want to</Button
                    >
                    <Button
                      class="play-list-btn bodyM weightS"
                      @click="selectVideo(2)"
                      :class="currentPlay === 2 ? 'active' : ''"
                      >2. Stack liquidity</Button
                    >
                    <Button
                      class="play-list-btn bodyM weightS"
                      @click="selectVideo(3)"
                      :class="currentPlay === 3 ? 'active' : ''"
                      >3. Harvest rewards</Button
                    >
                    <Button
                      class="play-list-btn bodyM weightS"
                      @click="selectVideo(4)"
                      :class="currentPlay === 4 ? 'active' : ''"
                      >4. Unstack liquidity</Button
                    >
                  </div>
                </Col>
                <Col :xs="24" :sm="24" :md="16">
                  <div class="video-player"></div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="For SPL Builders" key="2">
              <Row :gutter="20">
                <Col :xs="24" :sm="24" :md="8">
                  <p class="bodyL weightB">Prepare to harvest</p>
                  <div class="play-list">
                    <Button
                      class="play-list-btn bodyM weightS"
                      @click="selectVideo(1)"
                      :class="currentPlay === 1 ? 'active' : ''"
                      >1. Buy the token you want to</Button
                    >
                    <Button
                      class="play-list-btn bodyM weightS"
                      @click="selectVideo(2)"
                      :class="currentPlay === 2 ? 'active' : ''"
                      >2. Stack liquidity</Button
                    >
                    <Button
                      class="play-list-btn bodyM weightS"
                      @click="selectVideo(3)"
                      :class="currentPlay === 3 ? 'active' : ''"
                      >3. Harvest rewards</Button
                    >
                    <Button
                      class="play-list-btn bodyM weightS"
                      @click="selectVideo(4)"
                      :class="currentPlay === 4 ? 'active' : ''"
                      >4. Unstack liquidity</Button
                    >
                  </div>
                </Col>
                <Col :xs="24" :sm="24" :md="16">
                  <div class="video-player"></div>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </section>

    <section class="cropper-feed">
      <h2 class="weightB text-center">@cropper.finance</h2>
      <div class="feed-container">
        <Row>
          <Col :span="22" :offset="1">
            <Row :gutter="20">
              <Col :xs="24" :sm="24" :md="8">
                <Row :gutter="[20, 20]">
                  <Col :span="24" v-for="twitter in firstTwitter" :key="twitter.id">
                    <div class="feed-twitter">
                      <div class="feed-logo">
                        <img src="@/assets/social/twitter-white.svg" />
                      </div>
                      <div class="feed-content bodyM">
                        {{twitter.content}}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col :xs="24" :sm="24" :md="8">
                <Row :gutter="[20, 20]">
                  <Col :span="24" v-for="twitter in secondTwitter" :key="twitter.id">
                    <div class="feed-twitter">
                      <div class="feed-logo">
                        <img src="@/assets/social/twitter-white.svg" />
                      </div>
                      <div class="feed-content bodyM">
                        {{twitter.content}}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col :xs="24" :sm="24" :md="8">
                <Row :gutter="[20, 20]">
                  <Col :span="24" v-for="twitter in thirdTwitter" :key="twitter.id">
                    <div class="feed-twitter">
                      <div class="feed-logo">
                        <img src="@/assets/social/twitter-white.svg" />
                      </div>
                      <div class="feed-content bodyM">
                        {{twitter.content}}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </section>

    <section class="surrounded-by">
      <h2 class="weightB text-center">
        Surrounded by the Best <br />
        in the Industry
      </h2>
      <div class="category-group text-center">
        <Button
          class="category-btn bodyL weightS"
          :class="currentCategory === 'advisors' ? 'active' : ''"
          @click="selectCategory('advisors')"
        >
          Advisors
        </Button>
        <Button
          class="category-btn bodyL weightS"
          :class="currentCategory === 'backedBy' ? 'active' : ''"
          @click="selectCategory('backedBy')"
        >
          Backed by
        </Button>
        <Button
          class="category-btn bodyL weightS"
          :class="currentCategory === 'partners' ? 'active' : ''"
          @click="selectCategory('partners')"
        >
          Partners
        </Button>
        <Button
          class="category-btn bodyL weightS"
          :class="currentCategory === 'poweredBy' ? 'active' : ''"
          @click="selectCategory('poweredBy')"
        >
          Powered by
        </Button>
      </div>
      <div class="industry-container">
        <div class="industry-group">
          <Row :gutter="[20, 20]">
            <Col
              v-for="card in currentIndustry"
              :key="card.title"
              :xs="24"
              :sm="24"
              :md="currentIndustry.length >= 4 ? 6 : 8"
            >
              <div class="industry-card">
                <div class="industry-card-body">
                  <img :src="card.img" />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Icon, Popover, Button, Row, Col, Tabs } from 'ant-design-vue'
const { TabPane } = Tabs

@Component({
  components: {
    Icon,
    Popover,
    Button,
    Row,
    Col,
    Tabs,
    TabPane
  },
  layout: 'home',
  async asyncData({ $accessor, $api }) {}
})
export default class Landing extends Vue {
  isPopupOpen = false
  TVL = 0 as any
  totalvolume = 0
  timer: number | undefined = undefined
  isFarmer: boolean = true
  isBacked: boolean = false
  isAdvisors: boolean = true
  isPartners: boolean = false
  isPowered: boolean = false
  isDirect: boolean = false
  twitterFeeds: any[] = []
  firstTwitter: any[] = []
  secondTwitter: any[] = []
  thirdTwitter: any[] = []
  CRPPrice: any = 0
  marketCap: any = 0
  currentCategory: string = 'advisors'
  currentPlay: number = 1
  surroundedList = {
    advisors: [
      {
        title: 'Dexlab',
        img: '/_nuxt/src/assets/industry/dexlab.svg'
      },
      {
        title: 'Solanium',
        img: '/_nuxt/src/assets/industry/solanium.svg'
      },
      {
        title: 'Halborn',
        img: '/_nuxt/src/assets/industry/halborn.svg'
      }
    ],
    backedBy: [
      {
        title: 'SKYVision Capital',
        img: '/_nuxt/src/assets/industry/svc.svg'
      },
      {
        title: 'MEXC Global',
        img: '/_nuxt/src/assets/industry/mexc.svg'
      },
      {
        title: 'Gate.io',
        img: '/_nuxt/src/assets/industry/gateio.svg'
      },
      {
        title: 'Negocia Capital',
        img: '/_nuxt/src/assets/industry/negocia.svg'
      },
      {
        title: 'Solanium Ventures',
        img: '/_nuxt/src/assets/industry/solaniumV.svg'
      },
      {
        title: 'Newave Capital',
        img: '/_nuxt/src/assets/industry/newave.svg'
      },
      {
        title: 'DeltaHub Capital',
        img: '/_nuxt/src/assets/industry/deltahub.svg'
      },
      {
        title: 'AngelONE',
        img: '/_nuxt/src/assets/industry/angelone.svg'
      },
      {
        title: 'Cropperbros',
        img: '/_nuxt/src/assets/industry/cropperbros.svg'
      },
      {
        title: 'Basics Capital',
        img: '/_nuxt/src/assets/industry/basics.svg'
      },
      {
        title: 'AVA Capital',
        img: '/_nuxt/src/assets/industry/ava.svg'
      },
      {
        title: 'M6',
        img: '/_nuxt/src/assets/industry/m6.svg'
      },
      {
        title: 'OIG',
        img: '/_nuxt/src/assets/industry/oig.svg'
      },
      {
        title: 'EX Capital',
        img: '/_nuxt/src/assets/industry/ex.svg'
      },
      {
        title: 'CryptoJ',
        img: '/_nuxt/src/assets/industry/cryptoj.svg'
      }
    ],
    partners: [
      {
        title: 'FTX',
        img: '/_nuxt/src/assets/industry/ftx.svg'
      },
      {
        title: 'MEXC Global',
        img: '/_nuxt/src/assets/industry/mexc.svg'
      },
      {
        title: 'Gate.io',
        img: '/_nuxt/src/assets/industry/gateio.svg'
      },
      {
        title: 'Dexlab',
        img: '/_nuxt/src/assets/industry/dexlab.svg'
      }
    ],
    poweredBy: [
      {
        title: 'Solana',
        img: '/_nuxt/src/assets/industry/solana.svg'
      },
      {
        title: 'Serum',
        img: '/_nuxt/src/assets/industry/serum.svg'
      },
      {
        title: 'Bonafide',
        img: '/_nuxt/src/assets/industry/bonafide.svg'
      }
    ]
  }
  currentIndustry: any = this.surroundedList.advisors
  socialLinks = {
    twitter: 'https://twitter.com/CropperFinance',
    discord: 'https://discord.com/invite/9hdP7cM3ec',
    medium: 'https://cropperfinance.medium.com/',
    telegram: 'https://linktr.ee/cropperfinance',
  }

  mounted() {
    this.getTvl()
    this.getCRPPrice()
    this.getTwitterFeeds()
  }

  beforeDestroy() {
    window.clearInterval(this.timer)
  }

  changeToFarmer() {
    this.isFarmer = !this.isFarmer
  }
  
  changeToIndustry(num: number) {
    switch (num) {
      case 1:
        this.isBacked = true
        this.isAdvisors = false
        this.isPartners = false
        this.isPowered = false
        break
      case 2:
        this.isBacked = false
        this.isAdvisors = true
        this.isPartners = false
        this.isPowered = false
        break
      case 3:
        this.isBacked = false
        this.isAdvisors = false
        this.isPartners = true
        this.isPowered = false
        break
      case 4:
        this.isBacked = false
        this.isAdvisors = false
        this.isPartners = false
        this.isPowered = true
        break
    }
  }

  changeToDirect() {
    this.isDirect = !this.isDirect
  }

  selectCategory(category: string) {
    this.currentCategory = category
    if (category === 'advisors') this.currentIndustry = this.surroundedList.advisors
    else if (category === 'backedBy') this.currentIndustry = this.surroundedList.backedBy
    else if (category === 'partners') this.currentIndustry = this.surroundedList.partners
    else if (category === 'poweredBy') this.currentIndustry = this.surroundedList.poweredBy
  }

  selectVideo(id: number) {
    this.currentPlay = id
  }

  async getMarketCap(price: any) {
    let responseData: any = []
    try {
      responseData = await fetch('https://api.cropper.finance/supply/').then((res) => res.json())
    } catch (err) {
      console.log(err)
    } finally {
      this.marketCap = Math.round(responseData * price)
      this.marketCap = this.marketCap.toLocaleString('en-US')
    }
  }

  async getCRPPrice() {
    let responseData: any = []
    try {
      responseData = await fetch('https://api.cropper.finance/prices/').then((res) => res.json())
    } catch (err) {
      console.log(err)
    } finally {
      let result = responseData.find((element: any) => element.symbol === 'CRP')
      this.CRPPrice = result.price
      this.getMarketCap(this.CRPPrice)
      this.CRPPrice = this.CRPPrice.toLocaleString('en-US')
    }
  }

  async getTvl() {
    let cur_date = new Date().getTime()
    if (window.localStorage.TVL_last_updated && false) {
      const last_updated = parseInt(window.localStorage.TVL_last_updated)
      if (cur_date - last_updated <= 600000) {
        this.TVL = window.localStorage.TVL
        this.TVL = this.TVL.toLocaleString('en-US')
        return
      }
    }

    let responseData: any = []
    let tvl = 0
    try {
      responseData = await fetch('https://api.cropper.finance/cmc/').then((res) => res.json())

      Object.keys(responseData).forEach(function (key) {
        if ((responseData as any)[key as any].tvl * 1 < 2000000) {
          tvl = tvl * 1 + (responseData as any)[key as any].tvl * 1
        }
      })
    } catch {
      // dummy data
    } finally {
    }

    try {
      responseData = await fetch('https://api.cropper.finance/staking/').then((res) => res.json())
      tvl = tvl * 1 + (responseData as any).value * 1
    } catch {
      // dummy data
    } finally {
    }

    this.TVL = Math.round(tvl)

    window.localStorage.TVL_last_updated = new Date().getTime()
    window.localStorage.TVL = this.TVL

    this.TVL = this.TVL.toLocaleString('en-US')
  }

  async getTwitterFeeds() {
    let responseData: any = []
    try {
      responseData = await fetch('https://api.cropper.finance/tweets/').then((res) => res.json())
    } catch (err) {
      console.log(err)
    } finally {
      this.twitterFeeds = responseData
      this.firstTwitter = this.twitterFeeds.filter((val, idx) => idx as any % 3 === 0)
      this.secondTwitter = this.twitterFeeds.filter((val, idx) => idx as any % 3 === 1)
      this.thirdTwitter = this.twitterFeeds.filter((val, idx) => idx as any % 3 === 2)
    }
  }
}
</script>

<style lang="less" scoped>
// global stylesheet
.btn-container {
  background: @gradient-color-outline;
  padding: 2px;
  border-radius: 48px;
  height: 54px;
  width: fit-content;

  @media @max-b-mobile {
    height: 44px;
  }
}

.btn-fill {
  background: linear-gradient(300.64deg, #22b5b6 -11.12%, #280c86 96.46%);
  padding: 18px 30px;
  display: flex;
  align-items: center;
  border-radius: 48px;
  border: none;
  height: 54px;

  @media @max-b-mobile {
    padding: 13px 22.5px;
    height: 44px;
  }
}

.btn-outline {
  padding: 18px 30px;
  height: 100%;
  display: flex;
  align-items: center;
  border-radius: 48px;
  background: @color-bg;
  border: none;
}

// class stylesheet
.landing {
  .landing-header {
    padding: 38px 64px 89px 64px;
    background-image: url('@/assets/landing_v2/landing-first-bg.svg');
    background-repeat: no-repeat;
    background-size: cover;

    @media @max-b-mobile {
      padding: 20px 20px 0 20px;
      background-image: unset;
    }

    .landing-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .cropper-logo {
        @media @max-b-mobile {
          width: 92.86px;
          height: 30.86px;
        }
      }

      .lunch-btn-group {
        display: flex;
        justify-content: space-between;

        .doc-btn {
          @media @max-b-mobile {
            display: none;
          }
        }

        .btn-outline,
        .btn-fill {
          font-size: 18px;
          line-height: 14px;

          @media @max-b-mobile {
            font-size: 16px;
            line-height: 18px;
          }
        }

        .btn-fill {
          margin-left: 18px;
        }
      }
    }

    .landing-content {
      margin-top: 160px;

      @media @max-b-mobile {
        margin-top: 50px;
        text-align: center;
      }

      .balance-infos {
        .tlv-value {
          background: -webkit-linear-gradient(90deg, #22B5B6 6.07%, #280C86 134.97%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .token-infos {
          margin-top: 8px;
          display: flex;
          align-items: center;
          color: #d4d5f2;

          @media @max-b-mobile {
            justify-content: center;
          }

          img {
            margin-right: 10px;
          }

          label {
            margin-right: 25px;

            &:last-child {
              margin-right: 0;
            }
          }
        }
      }

      .cropper-content {
        margin-top: 68px;

        @media @max-b-mobile {
          margin-top: 28px;
        }

        .powered-by {
          margin-top: 18px;
          color: #d4d5f2;
        }
      }

      .read-more {
        display: none;

        @media @max-b-mobile {
          display: block;
        }

        .btn-container {
          border-radius: 8px;
          width: 100%;
          margin-top: 28px;

          .btn-outline {
            border-radius: 8px;
            width: 100%;
            justify-content: center;
          }
        }
      }

      .social-links {
        margin-top: 58px;
        margin-bottom: 12px;

        @media @max-b-mobile {
          display: none;
        }

        a {
          margin-right: 38px;

          &:last-child {
            margin-right: 0;
          }
        }
      }

      .move-next-section {
        display: flex;
        margin: auto;

        @media @max-b-mobile {
          display: none;
        }
      }
    }
  }

  .why-cropper {
    padding: 98px 64px 0 64px;

    @media @max-b-mobile {
      padding: 30px 20px 0 20px;
    }

    .intro-box-group {
      position: relative;
      margin-top: 48px;
      margin-bottom: 61px;
      display: flex;
      width: 100%;

      @media @max-b-mobile {
        margin-top: 30px;
        margin-bottom: 48px;
        display: inline-block;
      }

      .stars-second-bg {
        position: absolute;
        top: calc(50% - 170px);
        left: calc(50% - 170px);

        @media @max-b-mobile {
          display: none;
        }
      }

      .intro-box {
        height: 220px;
        background: linear-gradient(136.82deg, rgba(34, 181, 182, 0.5) 10.14%, rgba(40, 12, 134, 0.15) 85.36%);
        border-radius: 42px;
        display: inline-grid;
        width: calc((100% - 40px) / 3);
        margin-right: 20px;

        @media @max-b-mobile {
          padding: 18px 24px;
          height: auto;
          border-radius: 22px;
          display: flex;
          align-items: center;
          width: 100%;
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 0;
          }
        }

        &:last-child {
          margin-right: 0;
        }

        .card-img {
          margin: auto;

          @media @max-b-mobile {
            margin: unset;
            margin-right: 18px;
            width: 32px;
          }
        }
      }
    }
  }

  .why-cropper-audit {
    position: relative;

    .landing-second-img {
      width: 100%;

      @media @max-b-mobile {
        display: none;
      }
    }

    .audit-group {
      position: absolute;
      top: 37px;
      padding: 0 64px;
      width: 100%;

      @media @max-b-mobile {
        position: relative;
        top: 0;
        left: 0;
        padding: 0 20px;
      }

      .audit-box-group {
        display: flex;

        @media @max-b-mobile {
          display: inline-block;
          width: 100%;
        }

        .audit-box {
          padding: 52px 20px 78.45px 65px;
          background: linear-gradient(138.16deg, #22b5b6 -10.71%, rgba(40, 12, 134, 0.25) 111.29%);
          mix-blend-mode: lighten;
          border-radius: 42px;
          width: calc((100% - 20px) / 2);
          margin-right: 20px;

          @media @max-b-mobile {
            padding: 18px;
            width: 100%;
            background: linear-gradient(136.82deg, rgba(34, 181, 182, 0.5) 10.14%, rgba(40, 12, 134, 0.15) 85.36%);
            border-radius: 22px;
            margin-bottom: 25px;

            &:last-child {
              margin-bottom: 0;
            }
          }

          &:last-child {
            margin-right: 0;
          }

          .read-pdf {
            margin-top: 38px;
            display: flex;
            align-items: center;
            color: #fff;

            .pdf-icon {
              margin-right: 18px;
            }
          }
        }
      }
    }
  }

  .features-headline {
    padding: 0 64px 98px 64px;

    @media @max-b-mobile {
      padding: 70px 20px 80px 20px;
    }

    .feature-box-group {
      // display: flex;
      margin-top: 68px;
      position: relative;

      .stars-third-bg {
        position: absolute;
        left: calc(50% - 350px);
        top: calc(50% - 350px);

        @media @max-b-mobile {
          display: none;
        }
      }

      .feature-box {
        position: relative;
        background: linear-gradient(136.82deg, rgba(34, 181, 182, 0.5) 10.14%, rgba(40, 12, 134, 0.15) 85.36%);
        border-radius: 42px;
        padding-left: 36px;
        padding-right: 36px;
        height: 472px;
        padding-top: 50px;

        @media @max-b-mobile {
          padding: 18px 8px;
          border-radius: 22px;
          height: 285px;
          margin-bottom: 34px !important;

          &:nth-child(3),
          &:nth-child(4) {
            margin-bottom: 0 !important ;
          }
        }

        &:last-child {
          margin-right: 0;
        }

        .feature-img {
          @media @max-b-mobile {
            width: 100px;
            height: 90px;
          }
        }

        .title {
          margin-top: 18px;
        }

        .content {
          margin-top: 5px;
          margin-bottom: 60px !important;

          @media @max-b-mobile {
            margin-bottom: 18px !important;
          }
        }

        .now-btn {
          color: #fff;
          position: absolute;
          bottom: 55px;
          background: #23ADB4;
          border-radius: 48px;
          padding: 8px 0;
          width: calc(100% - 72px);
          text-align: center;
          display: none;

          &.soon {
            background: rgba(35, 173, 180, 0.5);
          }

          @media @max-b-mobile {
            bottom: 18px;
          }
        }

        &:hover {
          padding-top: 0;
          border: 4px solid #23ADB4;

          .now-btn {
            display: block;
          }
        }
      }
    }
  }

  .how-works {
    .tutorial-container {
      position: relative;

      .landing-third-bg {
        width: 100%;

        @media @max-b-mobile {
          display: none;
        }
      }

      .tutorial-group {
        position: absolute;
        top: 58px;
        width: 100%;

        @media @max-b-mobile {
          top: 40px;
          position: relative;
        }
      }
    }
  }

  .cropper-feed {
    padding: 98px 64px;

    @media @max-b-mobile {
      padding: 100px 32px 48px 32px;
    }

    .feed-container {
      margin-top: 50px;

      .feed-twitter {
        background: linear-gradient(115.9deg, #22b5b6 -40.58%, #280c86 95.48%);
        border-radius: 22px;
        padding: 22px;
        overflow: hidden;

        .feed-content {
          word-break: break-all;
          white-space: pre-line;
        }
      }

      .feed-video {
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
          linear-gradient(278.99deg, rgba(34, 181, 182, 0.6) 0%, rgba(40, 12, 134, 0.6) 100%);
        border: 3px solid #7a88b6;
        border-radius: 22px;
        height: 380px;

        @media @max-b-mobile {
          height: 208px;
        }
      }

      .feed-medium {
        background: linear-gradient(115.9deg, #22b5b6 -40.58%, #280c86 95.48%);
        border-radius: 22px;
        padding: 22px;

        @media @max-b-mobile {
          height: 124px;
        }
      }
    }
  }

  .surrounded-by {
    .category-group {
      margin-top: 48px;
      padding: 32px 0;
      border-top: 2px solid rgba(255, 255, 255, 0.2);
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);

      @media @max-b-mobile {
        margin-top: 18px;
        padding: 12px 0;
      }

      .category-btn {
        padding: 17px 30px;
        background: transparent;
        border: 2px solid transparent;
        height: auto;
        color: #fff;
        margin-right: 38px;

        @media @max-b-mobile {
          padding: 8px 12px;
          font-size: 13px !important;
          line-height: 19.5px !important;
          margin-right: 0;
        }

        &.active {
          background: @gradient-color-icon;
          background-origin: border-box;
          border: 2px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 4px 5px rgba(0, 0, 0, 0.5);
          border-radius: 8px;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .industry-container {
      max-width: 952px;
      margin: auto;

      @media @max-b-mobile {
        padding: 0 20px;
      }

      .industry-group {
        padding: 90px 0;

        @media @max-b-mobile {
          padding: 24px 0;
        }

        .industry-card {
          background: @gradient-color-outline;
          height: 130px;
          padding: 2px;
          border-radius: 8px;

          @media @max-b-mobile {
            height: 80px;
          }

          .industry-card-body {
            width: 100%;
            height: 100%;
            background: #000539;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
// ant customization
.ant-row {
  @media @max-b-mobile {
    .ant-col-22 {
      width: 100%;
    }
    .ant-col-offset-1 {
      margin-left: 0;
    }
  }
}
.ant-tabs {
  .ant-tabs-bar {
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    padding: 0 calc(64px + 4.166666666666667%);
    margin: 0 0 48px 0;

    @media @max-b-mobile {
      padding: 0 20px;
      margin-bottom: 20px;
    }

    .ant-tabs-nav {
      .ant-tabs-tab {
        font-weight: 600;
        font-size: 25px;
        line-height: 37px;
        letter-spacing: 0.25px;
        padding-bottom: 20px;
        margin-right: 65px;

        @media @max-b-mobile {
          font-size: 20px;
          line-height: 30px;
        }

        &:last-child {
          margin-right: 0;
        }

        &:active,
        &:hover {
          color: #23adb4;
        }
      }

      .ant-tabs-tab-active {
        color: #23adb4;
      }

      .ant-tabs-ink-bar {
        background: #23adb4;
      }
    }
  }

  .ant-tabs-top-content > .ant-tabs-tabpane {
    padding: 0 calc(64px + 4.166666666666667%);

    @media @max-b-mobile {
      padding: 0 20px;
    }

    .play-list {
      padding-top: 28px;

      .play-list-btn {
        margin-bottom: 18px;
        padding: 15px 0 15px 19px;
        background: @color-bg;
        border-radius: 8px;
        border: 3px solid @color-bg;
        color: #fff;
        height: auto;
        width: 100%;
        max-width: 292px;
        text-align: unset;

        &.active {
          background: linear-gradient(278.99deg, #22b5b6 0%, #280c86 100%);
          border: 3px solid #82d4dc;
          box-shadow: 0 4px 5px rgba(0, 0, 0, 0.5);
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .video-player {
      border: 3px solid #7a88b6;
      box-sizing: border-box;
      filter: drop-shadow(0 44px 64px rgba(0, 0, 0, 0.35));
      height: 524px;
      border-radius: 42px;
      background: @color-bg;

      @media @max-b-mobile {
        margin-top: 20px;
        height: 200px;
      }
    }
  }
}
</style>