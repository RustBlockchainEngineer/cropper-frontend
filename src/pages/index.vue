<template>
  <main class="landing">
    <div class="vecteur-1">
      <img src="../assets/landing/Planet3.png" />
    </div>
    <div class="header">
      <div class="space-btwn">
        <div class="header-left">
          <div class="logo">
            <img src="../assets/Component2.png" />
          </div>
          <h2>CropperFinance</h2>
        </div>
      </div>
      <div class="lunch-app">
        <NuxtLink to="/swap/">
          <button class="lunch-app-button">Launch App</button>
        </NuxtLink>
      </div>
    </div>
    <section id="section-1">
      <div class="container">
        <div class="poweredBy">Powered by Solana</div>
        <p>The Ultimate Permissionless Yield <br />Farming Protocol.</p>
        <div class="main-btns">
          <div class="stdGradientButton">
            <NuxtLink to="/swap/">
              <button id="LaunchApp">Launch App</button>
            </NuxtLink>
          </div>
          <div class="stdEmptyGradientButton">
            <a href="https://cropper-finance.gitbook.io/cropperfinance/" target="_blank">
                <button id="ReadMore">
                   <img src="@/assets/icons/caret-right.svg" />
                    Read More
                </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Icon, Popover } from 'ant-design-vue'

@Component({
  components: {
    Icon,
    Popover
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

<style>
@import '../assets/landing.css';

.home-container-background {
  background-image: url('../assets/landing/Header_Cropper.png') !important;
  background-position: bottom center !important;
  background-size: contain !important;
  background-repeat: no-repeat;
}

.ant-layout-footer {
  background: transparent !important;
  background-image: unset !important;
}

.landing a {
  color: #fff;
}

.poweredBy {
  font-family: Gilroy, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 26px;
  line-height: 32px;
  text-align: center;
  margin-bottom: 20px;
  opacity: 0.7;
}

.landing .container {
  top: 80px;
}

.stdGradientButton {
  margin-right: 10px;
  height: 72px;
}

.home-container-background .pc .icon_list a,
.home-container-background .foot-refer {
  color: #fff !important;
}

main.landing {
  min-height: calc(100vh - 196px);
  background: none !important;
}

@media (max-width: 800px) {
  .home-container-background {
    background-image: unset !important;
  }
  .landing .container {
    position: initial;
    display: initial;
  }
  .main-btns {
    margin-bottom: 57px;
    padding: 0 50px;
    flex-direction: unset;
    max-width: 100%;
    display: block;
  }

  .main-btns > div {
    width: 100%;
    margin: 0 0 20px;
  }

  .poweredBy {
    font-family: Gilroy, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 30px;
    text-align: center;
    margin-bottom: 20px;
    opacity: 0.9;
    margin-top: 89px;
  }

  .header-left h2 {
    font-size: 16px;
  }

  #section-1 .container {
    padding: 30px;
    text-align: center;
  }

  .lunch-app {
    margin-right: 20px;
  }

  #section-1 .container p {
    font-size: 34px;
    line-height: 42px;
  }

  main.landing {
    min-height: unset;
    background: no-repeat url('../assets/landing/Header_Cropper_mobile.png') !important;
    background-position: bottom center !important;
    background-size: contain !important;
    background-repeat: no-repeat;
  }
}
</style>