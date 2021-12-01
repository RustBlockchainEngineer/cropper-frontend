<template>
  <main class="landing">
    <section class="landing-header">
      <div class="landing-top">
        <img src="@/assets/icons/cropper-logo.svg" />
        <div class="lunch-btn-group">
          <div class="btn-container">
            <Button class="btn-outline">Documentation</Button>
          </div>
          <NuxtLink to="/swap/">
            <Button class="btn-fill">Launch App</Button>
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
              <a href="#"><img src="@/assets/social/landing-medium.svg" /></a>
              <a href="#"><img src="@/assets/social/landing-discord.svg" /></a>
              <a href="#"><img src="@/assets/social/landing-twitter.svg" /></a>
              <a href="#"><img src="@/assets/social/landing-telegram.svg" /></a>
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
                Best Farms <br />
                APR%
              </h4>
            </div>
            <div class="intro-box text-center">
              <img class="card-img" src="@/assets/landing_v2/card-community.svg" />
              <h4 class="weightB">
                Community <br />
                driven
              </h4>
            </div>
            <div class="intro-box text-center">
              <img class="card-img" src="@/assets/landing_v2/card-swap.svg" />
              <h4 class="weightB">
                Best Price <br />
                Swaps
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
                <h2 class="weightB">
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
                <h2 class="weightB">
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
          <p class="bodyL text-center" style="margin-top: 20px;">Reprehenderit esse labore id veniam ut veniam non ex adipisicing</p>
          <div class="feature-box-group">
            <img class="stars-third-bg" src="@/assets/landing_v2/stars-third-bg.svg" />
            <div class="feature-box">
              <img src="@/assets/landing_v2/feature-swap.svg" />
              <h4 class="title">Swap</h4>
              <p class="bodyM content">Designed to give you the best price on Solana</p>
              <a class="bodyM now-btn weightS">Swap Now</a>
            </div>
            <div class="feature-box">
              <img src="@/assets/landing_v2/feature-farming.svg" />
              <h4 class="title">Farming</h4>
              <p class="bodyM content">Enjoy a wide variety of Permissionless and Labelized farms </p>
              <a class="bodyM now-btn weightS">Farm Now</a>
            </div>
            <div class="feature-box">
              <img src="@/assets/landing_v2/feature-staking.svg" />
              <h4 class="title">Staking</h4>
              <p class="bodyM content">Stake CRP through 4 tiers and get advantages on the plateform</p>
              <a class="bodyM now-btn weightS">Stake Now</a>
            </div>
            <div class="feature-box">
              <img src="@/assets/landing_v2/feature-fertilizer.svg" />
              <h4 class="title">Fertilizer</h4>
              <p class="bodyM content">The Fertilizer launcher is curently being imrpoved.</p>
              <a class="bodyM now-btn weightS">Soon!</a>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Icon, Popover, Button, Row, Col } from 'ant-design-vue'

@Component({
  components: {
    Icon,
    Popover,
    Button,
    Row,
    Col
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
}

.btn-fill {
  background: linear-gradient(300.64deg, #22b5b6 -11.12%, #280c86 96.46%);
  padding: 18px 30px;
  display: flex;
  align-items: center;
  border-radius: 48px;
  border: none;
  height: 54px;
}

.btn-outline {
  padding: 18px 30px;
  height: 100%;
  display: flex;
  align-items: center;
  border-radius: 48px;
  background: #01033c;
  border: none;
}

// class stylesheet
.landing {
  .landing-header {
    padding: 30px 62px 89px 62px;
    background-image: url('@/assets/landing_v2/landing-first-bg.svg');
    background-repeat: no-repeat;
    background-size: cover;

    .landing-top {
      display: flex;
      justify-content: space-between;

      .lunch-btn-group {
        display: flex;
        justify-content: space-between;

        .btn-outline,
        .btn-fill {
          font-weight: 600;
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
    padding: 98px 62px 0 62px;

    .intro-box-group {
      position: relative;
      margin-top: 48px;
      margin-bottom: 61px;
      display: flex;
      
      .stars-second-bg {
        position: absolute;
        top: calc(50% - 170px);
        left: calc(50% - 170px);
      }

      .intro-box {
        height: 220px;
        background: linear-gradient(136.82deg, rgba(34, 181, 182, 0.5) 10.14%, rgba(40, 12, 134, 0.15) 85.36%);
        border-radius: 42px;
        display: inline-grid;
        width: calc((100% - 40px) / 3);
        margin-right: 20px;

        &:last-child {
          margin-right: 0;
        }

        .card-img {
          margin: auto;
        }
      }
    }
  }

  .why-cropper-audit {
    position: relative;
    height: 900px;

    .landing-second-img {
      position: absolute;
      top: 0;
    }

    .audit-group {
      padding: 37px 62px 0 62px;

      .audit-box-group {
        display: flex;

        .audit-box {
          padding-top: 52px;
          padding-left: 65px;
          padding-bottom: 78.45px;
          background: linear-gradient(138.16deg, #22b5b6 -10.71%, rgba(40, 12, 134, 0.25) 111.29%);
          mix-blend-mode: lighten;
          border-radius: 42px;
          width: calc((100% - 20px) / 2);
          margin-right: 20px;

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
    padding-bottom: 98px;
    
    .feature-box-group {
      display: flex;
      margin-top: 68px;
      position: relative;

      .stars-third-bg {
        position: absolute;
        left: calc(50% - 350px);
        top: calc(50% - 350px);
      }

      .feature-box {
        position: relative;
        background: linear-gradient(136.82deg, rgba(34, 181, 182, 0.5) 10.14%, rgba(40, 12, 134, 0.15) 85.36%);
        border-radius: 42px;
        padding-left: 36px;
        padding-right: 36px;
        width: calc((100% - 75px) / 4);
        height: 472px;
        margin-right: 25px;

        &:last-child {
          margin-right: 0;
        }

        .title {
          margin-top: 20px;
        }

        .content {
          margin-top: 5px;
          margin-bottom: 60px !important;
        }

        .now-btn {
          color: #22B5B6;
          position: absolute;
          bottom: 55px;
        }
      }
    }
  }
}
</style>