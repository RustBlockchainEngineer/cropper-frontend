<template>
  <Header class="header fs-container">
    <NuxtLink to="/">
      <img class="logo" src="@/assets/icons/cropper-logo.svg" />
    </NuxtLink>

    <!-- <div v-if="isMobile ? (navOpened ? true : false) : true" :class="isMobile ? 'mobile-nav' : ''"> -->
      <Nav @onSelect="() => (navOpened = false)" />
    <!-- </div> -->

    <div class="fs-container wallet-container">
      <Wallet />
    </div>
  </Header>
</template>

<script lang="ts">
import Vue from 'vue'

import { Layout } from 'ant-design-vue'

const { Header } = Layout

export default Vue.extend({
  components: {
    Header
  },

  data() {
    return {
      navOpened: false
    }
  },

  computed: {
    isMobile() {
      return this.$accessor.isMobile
    }
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables';

.header {
  margin-top: 40px;
  
  .logo {
    height: 55px;

    @media @max-lg-tablet {
      height: 30px;
    }
  }

  .mobile-nav {
    position: absolute;
    width: 100vw;
    max-width: 100%;
    top: 64px;
    left: 0;
    text-align: center;
    z-index: 99;
  }

  .nav-button {
    display: inline-block;
    vertical-align: middle;
    margin-left: 16px;
    width: 24px;
    height: 20px;
    position: relative;
    transform: rotate(0deg);
    transition: 0.5s ease-in-out;
    cursor: pointer;

    span {
      background-color: #fff;
      display: block;
      position: absolute;
      height: 3px;
      width: 100%;
      border-radius: 3px;
      opacity: 1;
      left: 0;
      transform: rotate(0deg);
      transition: 0.25s ease-in-out;
    }

    span:first-child {
      top: 0;
      transform-origin: left top;
    }

    span:nth-child(2),
    span:nth-child(3) {
      top: 50%;
      transform: translateY(-50%);
      transform-origin: center center;
    }

    span:nth-child(4) {
      bottom: 0;
      transform-origin: left bottom;
    }
  }

  .nav-button.opened {
    span:first-child {
      width: 0%;
      left: 50%;
    }

    span:nth-child(2) {
      transform: rotate(45deg);
    }

    span:nth-child(3) {
      transform: rotate(-45deg);
    }

    span:nth-child(4) {
      width: 0%;
      left: 50%;
    }
  }
}

@media @max-lg-tablet {
  .header {
    margin: 10px 20px 80px 20px;
    padding: 0 !important;
    display: block;

    .logo {
      height: 32px;
    }

    .nav-button {
      display: none;
    }
  }

  .wallet-container {
    float: right;
    margin-top: -140px;
  }
}
</style>
