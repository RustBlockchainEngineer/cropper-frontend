<template>
  <Footer>
    <div class="footer-body">
      <div class="logo">
        <a href="/"><img src="@/assets/icons/cropper-logo-footer.svg" /></a>
      </div>
      <div class="icon_list noMobile">
        <a class="social-medium" :href="linkUrl.medium" target="_blank">
          <img class="social-icon" src="@/assets/social/medium-blue.svg" />
          <img class="social-icon" src="@/assets/social/medium-gradient.svg" />
        </a>
        <a class="social-discord" :href="linkUrl.discord" target="_blank">
          <img class="social-icon" src="@/assets/social/discord-blue.svg" />
          <img class="social-icon" src="@/assets/social/discord-gradient.svg" />
        </a>
        <a class="social-twitter" :href="linkUrl.twitter" target="_blank">
          <img class="social-icon" src="@/assets/social/twitter-blue.svg" />
          <img class="social-icon" src="@/assets/social/twitter-gradient.svg" />
        </a>
        <a class="social-telegram" :href="linkUrl.telegram" target="_blank">
          <img class="social-icon" src="@/assets/social/telegram-blue.svg" />
          <img class="social-icon" src="@/assets/social/telegram-gradient.svg" />
        </a>
      </div>
    </div>
    <div class="footer-line"></div>
    <div class="footer-refer">
      <label class="textS decentralized">Decentralized 2022</label>
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

  @media @max-sl-mobile {
    display: unset;
  }

  .logo {
    @media @max-sl-mobile {
      margin-bottom: 30px;
    }
  }

  .icon_list {
    &.noMobile {
      display: flex;
      align-items: center;

      .social-telegram .social-icon {
        margin-right: 0;
      }
      
      .social-medium,
      .social-discord,
      .social-twitter,
      .social-telegram {
        .social-icon {
          height: 18px;
        }

        .social-icon:last-child {
          display: none;
        }

        &:hover .social-icon:last-child {
          display: unset;
        }

        &:hover .social-icon:first-child {
          display: none;
        }
      }
    }

    &.noDesktop {
      display: none;
      @media @max-sl-mobile {
        display: inline-block;
      }
    }

    a {
      margin-right: 38px;
      color: #ccd1f1;

      @media @max-sl-mobile {
        display: block;
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

      @media @max-sl-mobile {
        display: block;
      }

      a {
        color: #fff;
        
        @media @max-sl-mobile {
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
  margin: 28px 0 16px 0;
}

.footer-refer {
  position: relative;
  z-index: 2;
  text-align: center;
  color: @color-blue200;

  @media @max-sl-mobile {
    text-align: left;
  }
}

// ant customization
.ant-layout-footer {
  @media @max-sl-mobile {
    padding: 22px !important;
  }
}

.planet-bottom {
  display: none;
}
</style>