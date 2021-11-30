<template>
  <main class="landing">
    <div class="landing-header">
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
      <Row :gutter="16">
        <Col :span="22" :offset="1">
          <div class="balance-infos">
            <label class="tlv-value">TLV 30.000.000€</label>
            <div class="token-infos">
              <img src="@/assets/icons/cropper.svg" />
              <label><u>CRP Token</u></label>
              <label>Price: 0,50€</label>
              <label>Market Cap: 0,50€</label>
            </div>
          </div>
          <div class="cropper-content">
            <h1>The Ultimate <br /> Permissionless <br /> Yield Farming</h1>
            <p class="powered-by">Powered by Solana</p>
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
  background: linear-gradient(300.64deg, #22B5B6 -11.12%, #280C86 96.46%);
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
  background: #01033C;
  border: none;
}

// class stylesheet
.landing {
  padding: 30px 62px;
  background-image: url('@/assets/landing/landing_header.svg');
  background-repeat: no-repeat;
  background-size: cover;

  .landing-header {
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
        background: -webkit-linear-gradient(333.93deg, #22B5B6 6.07%, #280C86 134.97%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
        font-size: 34px;
        line-height: 40px;
      }

      .token-infos {
        margin-top: 10px;
        display: flex;
        align-items: center;
        color: #D4D5F2;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;

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
      margin-top: 70px;
      h1 {
        font-weight: bold;
        font-size: 74px;
        line-height: 87px;
      }

      .powered-by {
        font-weight: bold;
        font-size: 18px;
        line-height: 21px;
        letter-spacing: -0.005em;
        color: #D4D5F2;
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
      margin: 0 auto 78px auto;
    }
  }
}
</style>