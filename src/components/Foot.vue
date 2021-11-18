<template>
  <Footer>
    <div :class="isMobile ? 'mobile' : 'pc'">
      <div class="logo">
        <a href="/"><img src="@/assets/icons/logo-desktop.svg"  width="224.76" height="45.38" /></a>
      </div>
      <div class="icon_list" v-if="!isMobile">
        <label>Our Social</label>
        <a :href="linkUrl.medium" target="_blank">
          Medium
        </a>
        <a :href="linkUrl.discord" target="_blank">
          Discord
        </a>
        <a :href="linkUrl.twitter" target="_blank">
          Twitter
        </a>
        <a
          class="telegramButton"
          :class="displayfilters ? 'telegramButton-active' : ''"
          @click="
            () => {
              if (displayfilters == true) {
                displayfilters = false
              } else {
                displayfilters = true
              }
            }
          "
        >
            Telegram
            <img src="@/assets/icons/arrow-down.svg" />
        </a>
      </div>
      <div class="icon_list" v-if="isMobile">
        <label>Our Social</label>
        <a :href="linkUrl.medium" target="_blank">
          Medium
        </a>
        <a :href="linkUrl.discord" target="_blank">
          Discord
        </a>
        <a :href="linkUrl.twitter" target="_blank">
          Twitter
        </a>
        <a
          class="telegramButton"
          :class="displayfilters ? 'telegramButton-active' : ''"
          @click="
            () => {
              if (displayfilters == true) {
                displayfilters = false
              } else {
                displayfilters = true
              }
            }
          "
        >
            Telegram
            <img src="@/assets/icons/arrow-down.svg" />
        </a>
      </div>
    </div>
    <div class="telegram">
      <div class="telegram-group" v-if="displayfilters">
        <a :href="linkUrl.telegram_en" target="_blank">
          Telegram(EN)
        </a>
        <a :href="linkUrl.telegram_cn" target="_blank">
          Telegram(CN)
        </a>
        <a :href="linkUrl.telegram_kr" target="_blank">
          Telegram(KR)
        </a>
        <a :href="linkUrl.telegram_jp" target="_blank">
          Telegram(JP)
        </a>
        <a :href="linkUrl.telegram_es" target="_blank">
          Telegram(ES)
        </a>
        <a :href="linkUrl.telegram_tr" target="_blank">
          Telegram(TR)
        </a>
        <a :href="linkUrl.telegram_vn" target="_blank">
          Telegram(VN)
        </a>
        <a :href="linkUrl.telegram_ru" target="_blank">
          Telegram(RU)
        </a>
        <a :href="linkUrl.telegram_fr" target="_blank">
          Telegram(FR)
        </a>
        <a :href="linkUrl.telegram_br" target="_blank">
          Telegram(BR)
        </a>
        <a :href="linkUrl.telegram_in" target="_blank">
          Telegram(IN)
        </a>
        <a :href="linkUrl.telegram_it" target="_blank">
          Telegram(IT)
        </a>
      </div>
    </div>
    <div class="foot-line"></div>
    <div class="foot-refer">
      <label>Decentralized 2021</label>
    </div>
  </Footer>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import { Layout } from 'ant-design-vue'

const { Footer } = Layout

@Component({
  components: {
    Footer
  }
})
export default class Foot extends Vue {
  navOpened = false
  linkUrl = {
    home: '/',
    app: '/swap/',
    twitter: 'https://twitter.com/CropperFinance',
    discord: 'https://discord.com/invite/9hdP7cM3ec',
    medium: 'https://cropperfinance.medium.com/',
    telegram_en: 'https://t.me/CropperFinance',
    telegram_cn: 'https://t.me/cropperChineseofficial',
    telegram_kr: 'https://t.me/CropperFinance_Korea',
    telegram_jp: 'https://t.me/cropperfinancejapan',
    telegram_es: 'https://t.me/cropperspanish',
    telegram_tr: 'https://t.me/CropperTurkish',
    telegram_vn: 'https://t.me/CropperFinanceVietNam',
    telegram_ru: 'https://t.me/cropperrussia',
    telegram_fr: 'https://t.me/cropperfinancefrance',
    telegram_br: 'https://t.me/cropperfinancebrazil',
    telegram_id: 'https://t.me/cropperfinanceindo',
    telegram_it: 'https://t.me/cropperitalia',
  }
  displayfilters = false

  get isMobile() {
    return this.$accessor.isMobile
  }

  beforeMount() {
    this.$accessor.queryIsMobile()
  }
}
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.ant-layout-footer {
  padding: 24px 128px !important;
  position: relative;
}

.telegram {
  height: 30px;

  @media @max-b-mobile {
    height: 230px;
  }

  .telegram-group {
    display: flex;
    justify-content: space-between;

    @media @max-b-mobile {
      display: block;
    }

    a {
      font-size: 16px;
      font-weight: normal;
      line-height: 42px;
      letter-spacing: -0.05em;
      color: #fff;

      @media @max-b-mobile {
        display: block;
        width: 50%;
        float: left;
      }
    }
  }
}

.mobile {
  .icon_list {
    text-align: center;
    margin: 48px 0;
    a {
      color: #505F8C !important;
    }
  }
}

.pc {
  display: flex;
  justify-content: space-between;

  .icon_list {
    font-style: normal;
    font-weight: 400;
    line-height: 42px;
    letter-spacing: -0.05em;
    text-align: left;
    a {
      color: #505F8C !important;
      font-size: 18px;
      padding-right: 5px;
      margin-left: 55.81px;
    }
    label {
      color: #fff !important;
      font-size: 22px;
    }
  }
}

.foot-line {
  height: 1.16px;
  background: #fff;
  opacity: 0.2;
  margin: 30px 0;
}

.foot-refer {
  color: #505F8C !important;
  // font-family: Gilroy;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: -0.05em;
  text-align: left;
  position:relative;
  z-index:2;

  .refer-list {
    label{
      margin-left: 55.81px;
      padding-right: 10px;
      font-weight: 400;
      line-height: 42px;
    }
  }
}

.telegramButton > img {
  margin-left: 12px;
  transform: 0;
}

.telegramButton-active > img {
  transform: rotate(180deg);
  transition: transform 0.3s;
}
// ******* Mobile *******
@media @max-b-mobile {
  .ant-layout-footer {
    width: 375px;
    margin: auto;
    padding: 22px !important;
  }
  .planet-bottom {
    display: none;
  }
  .foot-refer {
    font-size: 18px;
    line-height: 24px;
    letter-spacing: -0.05em;
    font-weight: normal;
    .refer-list {
      display: inline-block;
      width: 100%;
      label {
        line-height: 40px;
        margin-left: 0;
        display: block;
      }
    }
  }
  .mobile {
    .icon_list {
      display: inline-block;
      justify-items: center;
      margin: 10px 0;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: -0.05em;
      width: 100%;
      label {
        display: none;
      }
      a {
        display: block;
        margin-top: 10px;
        text-align: left;
      }
    }
  }
}
</style>
