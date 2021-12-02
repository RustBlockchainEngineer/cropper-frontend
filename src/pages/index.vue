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
              <h2 class="weightS tlv-value">TLV 30.000.000€</h2>
              <div class="token-infos">
                <img src="@/assets/icons/cropper.svg" />
                <label class="bodyM weightS"><u>CRP Token</u></label>
                <label class="bodyM weightS">Price: 0,50€</label>
                <label class="bodyM weightS">Market Cap: 0,50€</label>
              </div>
            </div>
            <div class="cropper-content">
              <label class="displayL weightB"
                >The Ultimate <br />
                Permissionless <br />
                Yield Farming</label
              >
              <p class="powered-by bodyL weightB">Powered by Solana</p>
            </div>
            <div class="social-links">
              <a href="#"><img src="@/assets/social/medium-blue.svg" /></a>
              <a href="#"><img src="@/assets/social/discord-blue.svg" /></a>
              <a href="#"><img src="@/assets/social/twitter-blue.svg" /></a>
              <a href="#"><img src="@/assets/social/telegram-blue.svg" /></a>
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
              <h4 class="weightB">
                Best Farms APR%
              </h4>
            </div>
            <div class="intro-box text-center">
              <img class="card-img" src="@/assets/landing_v2/card-community.svg" />
              <h4 class="weightB">
                Community driven
              </h4>
            </div>
            <div class="intro-box text-center">
              <img class="card-img" src="@/assets/landing_v2/card-swap.svg" />
              <h4 class="weightB">
                Best Price Swaps
              </h4>
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
                <a class="bodyM now-btn weightS">Swap Now</a>
              </div>
            </Col>
            <Col :xs="12" :sm="12" :md="6">
              <div class="feature-box">
                <img class="feature-img" src="@/assets/landing_v2/feature-farming.svg" />
                <h4 class="title weightB">Farming</h4>
                <p class="bodyM content">Enjoy a wide variety of Permissionless and Labelized farms</p>
                <a class="bodyM now-btn weightS">Farm Now</a>
              </div>
            </Col>
            <Col :xs="12" :sm="12" :md="6">
              <div class="feature-box">
                <img class="feature-img" src="@/assets/landing_v2/feature-staking.svg" />
                <h4 class="title weightB">Staking</h4>
                <p class="bodyM content">Stake CRP through 4 tiers and get advantages on the plateform</p>
                <a class="bodyM now-btn weightS">Stake Now</a>
              </div>
            </Col>
            <Col :xs="12" :sm="12" :md="6">
              <div class="feature-box">
                <img class="feature-img" src="@/assets/landing_v2/feature-fertilizer.svg" />
                <h4 class="title weightB">Fertilizer</h4>
                <p class="bodyM content">The Fertilizer launcher is curently being imrpoved.</p>
                <a class="bodyM now-btn weightS">Soon!</a>
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
                <Col :span="8">
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
                <Col :span="16">
                  <div class="video-player"></div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="For SPL Builders" key="2">
              <Row :gutter="20">
               <Col :span="8">
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
                <Col :span="16">
                  <div class="video-player"></div>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </section>

    <section class="cropper-blog">
      <h2 class="weightB text-center">@cropper.finance</h2>
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
            <Col v-for="card in currentIndustry" :key="card.title" :span="currentIndustry.length >= 4 ? '6' : '8'">
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
  tvl = 0
  totalvolume = 0
  timer: number | undefined = undefined
  isFarmer: boolean = true
  isBacked: boolean = false
  isAdvisors: boolean = true
  isPartners: boolean = false
  isPowered: boolean = false
  isDirect: boolean = false
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

  mounted() {}

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
          background: -webkit-linear-gradient(333.93deg, #22b5b6 6.07%, #280c86 134.97%);
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

        .powered-by {
          margin-top: 18px;
          color: #d4d5f2;
        }
      }

      .social-links {
        margin-top: 58px;
        margin-bottom: 12px;

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
      left: 64px;
      padding-right: 64px;
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
        background: linear-gradient(136.82deg, rgba(85, 136, 136, 0.5) 10.14%, rgba(40, 12, 134, 0.15) 85.36%);
        border-radius: 42px;
        padding-left: 36px;
        padding-right: 36px;
        height: 472px;

        @media @max-b-mobile {
          padding: 18px 8px;
          border-radius: 22px;
          height: 285px;
          margin-bottom: 34px !important;

          &:nth-child(3), &:nth-child(4) {
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
          color: #22b5b6;
          position: absolute;
          bottom: 55px;

          @media @max-b-mobile {
            bottom: 18px;
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
          position: relative;
        }
      }
    }
  }

  .cropper-blog {
    padding: 98px 0;
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
    .ant-tabs-nav {
      .ant-tabs-tab {
        font-weight: bold;
        font-size: 25px;
        line-height: 37px;
        letter-spacing: 0.25px;
        padding-bottom: 20px;
        margin-right: 65px;

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
    }
  }
}
</style>