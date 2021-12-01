<template>
  <Footer>
    <div class="footer-body">
      <div class="logo">
        <a href="/"><img src="@/assets/icons/cropper-logo.svg" /></a>
      </div>
      <div class="icon_list noMobile">
        <a :href="linkUrl.medium" target="_blank">
          <img src="@/assets/social/medium-transparent.svg" />
        </a>
        <a :href="linkUrl.discord" target="_blank">
          <img src="@/assets/social/discord-transparent.svg" />
        </a>
        <a :href="linkUrl.twitter" target="_blank">
          <img src="@/assets/social/twitter-transparent.svg" />
        </a>
        <a :href="linkUrl.telegram" target="_blank">
          <img src="@/assets/social/telegram-transparent.svg" />
        </a>
      </div>
      <div class="icon_list noDesktop">
        <a :href="linkUrl.medium" target="_blank" class="bodyM weightS"> Medium </a>
        <a :href="linkUrl.discord" target="_blank" class="bodyM weightS"> Discord </a>
        <a :href="linkUrl.twitter" target="_blank" class="bodyM weightS"> Twitter </a>
        <a
          class="telegramButton bodyM weightS"
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
    <div class="telegram noDesktop" v-if="displayfilters" :class="displayfilters ? 'visible' : ''">
      <div class="telegram-group">
        <a :href="linkUrl.telegram_en" target="_blank" class="bodyM weightS"> Telegram(EN) </a>
        <a :href="linkUrl.telegram_cn" target="_blank" class="bodyM weightS"> Telegram(CN) </a>
        <a :href="linkUrl.telegram_kr" target="_blank" class="bodyM weightS"> Telegram(KR) </a>
        <a :href="linkUrl.telegram_jp" target="_blank" class="bodyM weightS"> Telegram(JP) </a>
        <a :href="linkUrl.telegram_es" target="_blank" class="bodyM weightS"> Telegram(ES) </a>
        <a :href="linkUrl.telegram_tr" target="_blank" class="bodyM weightS"> Telegram(TR) </a>
        <a :href="linkUrl.telegram_vn" target="_blank" class="bodyM weightS"> Telegram(VN) </a>
        <a :href="linkUrl.telegram_ru" target="_blank" class="bodyM weightS"> Telegram(RU) </a>
        <a :href="linkUrl.telegram_fr" target="_blank" class="bodyM weightS"> Telegram(FR) </a>
        <a :href="linkUrl.telegram_br" target="_blank" class="bodyM weightS"> Telegram(BR) </a>
        <a :href="linkUrl.telegram_in" target="_blank" class="bodyM weightS"> Telegram(IN) </a>
        <a :href="linkUrl.telegram_it" target="_blank" class="bodyM weightS"> Telegram(IT) </a>
      </div>
    </div>
    <div class="footer-line"></div>
    <div class="footer-refer">
      <label class="bodyS weightS decentralized">Decentralized 2021</label>
      <div class="refer-list">
        <label class="bodyS weightS">Terms & Conditions</label>
        <label class="bodyS weightS">Privacy Policy</label>
      </div>
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
    telegram: 'https://linktr.ee/cropperfinance',
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
    telegram_it: 'https://t.me/cropperitalia'
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
.footer-body {
  display: flex;
  justify-content: space-between;

  @media @max-b-mobile {
    display: unset;
  }

  .logo {
    @media @max-b-mobile {
      margin-bottom: 35px;
    }
  }

  .icon_list {
    &.noMobile {
      display: flex;
      align-items: center;

      @media @max-b-mobile {
        display: none;
      }
    }

    &.noDesktop {
      display: none;
      @media @max-b-mobile {
        display: inline-block;
      }
    }

    a {
      margin-right: 38px;
      color: #ccd1f1;

      @media @max-b-mobile {
        display: block;
        margin-bottom: 18px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      &:last-child {
        margin-right: 0;
      }
    }

    label {
      color: #fff !important;
      font-size: 22px;
    }

    .telegramButton > img {
      margin-left: 12px;
      transform: 0;
    }

    .telegramButton-active > img {
      transform: rotate(180deg);
      transition: transform 0.3s;
    }
  }
}

.telegram {
  &.noDesktop {
    display: none;

    &.visible {
      height: 250px;
      display: block;
      padding-top: 18px;
    }

    .telegram-group {
      display: flex;
      justify-content: space-between;

      @media @max-b-mobile {
        display: block;
      }

      a {
        color: #fff;
        
        @media @max-b-mobile {
          display: block;
          width: 50%;
          float: left;
          margin-bottom: 18px;
        }
      }
    }
  }
}

.footer-line {
  height: 1px;
  background: #fff;
  opacity: 0.2;
  margin: 20px 0;
}

.footer-refer {
  color: #ccd1f1;
  text-align: left;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;

  @media @max-b-mobile {
    color: #98a2e4;
  }

  .decentralized {
    @media @max-b-mobile {
      display: none;
    }
  }

  .refer-list {
    label {
      margin-right: 38px;

      @media @max-b-mobile {
        margin-right: 0;
        margin-bottom: 20px;
        display: block;
      }

      &:last-child {
        margin-right: 0;

        @media @max-b-mobile {
          margin-bottom: 0;
        }
      }
    }
  }
}

// ant customization
.ant-layout-footer {
  @media @max-b-mobile {
    width: 375px;
    margin: auto;
    padding: 22px !important;
  }
}

.planet-bottom {
  display: none;
}
</style>