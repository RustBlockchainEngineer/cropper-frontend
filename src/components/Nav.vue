<template>
  <Menu
    v-model="currentRoute"
    :mode="'horizontal'"
    :theme="'light'"
    @click="changeRoute"
  >
    <MenuItem v-for="(extra, name) in navs" :key="name.toLowerCase()" :class="name === banURL ? 'disable' : ''">
      <a v-if="extra" :href="url[name]" target="_blank">
        {{ name.replace('-', ' ') }}
      </a>
      <div v-else>
        <div class="menu-icon-group">
          <div class="menu-icon" :class="name.replace('-', ' ')"></div>
          <span> {{ name.replace('-', ' ') }} </span>
        </div>
      </div>
      <div v-if="name === banURL" class="soon">
        Soon
      </div>
    </MenuItem>
  </Menu>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Menu } from 'ant-design-vue'

const MenuItem = Menu.Item

@Component({
  components: {
    Menu,
    MenuItem
  }
})
export default class Nav extends Vue {
  navs = {
    //whitelist: true,
    //trading: true,
    swap: false,
    //liquidity: false,
    pools: false,
    farms: false,
    staking: false,
    fertilizer: false,
    // fusion: false,
    //stakingTest: false,
    // migrate: false
    // info: false
  }

  banURL = 'fertilizer'

  get isMobile() {
    return this.$accessor.isMobile
  }

  get url() {
    return this.$accessor.url
  }

  get currentRoute() {
    return [this.$accessor.route.name]
  }

  set currentRoute(route) {}

  changeRoute({ key }: { key: string }): void {
    const { from, to, ammId } = this.$route.query
    if(key != this.banURL) {
      if (['swap', 'liquidity'].includes(key) && (ammId || (from && to))) {
        // if (ammId) {
        //   this.$router.push({
        //     path: `/${key}/`,
        //     query: {
        //       ammId
        //     }
        //   })
        // } else 
        if (from && to) {
          this.$router.push({
            path: `/${key}/`,
            query: {
              from,
              to
            }
          })
        } else {
          this.$router.push({ path: `/${key}/` })
        }
      } else if (!(this as any).navs[key]) {
        this.$router.push({ path: `/${key}/` })
      }
      // to close menu on mobile mode
      this.$emit('onSelect')
    }
    else {
      console.log(this.banURL + 'will be soon!');
    }
  }
}
</script>

<style lang="less">

.menu-icon-group {
  display: inline-flex;
  align-items: center;

  span {
    display: flex;
    align-items: center;
  }
}

.menu-icon {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  margin-right: 10px;
}

.ant-menu-item {
  .soon {
    display: none;
    width: fit-content;
    margin: auto;
    padding: 5px 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    border-radius: 6px;
    font-size: 14px;
    line-height: 17px;
    background: rgba(255, 255, 255, 0.3);
  }

  &.disable {
    &:hover, &:active {
      color: unset !important;
    }

    &:hover .menu-icon-group{
      opacity: 0.5;
    }

    &:hover .soon {
      display: block;
    }

    @media @max-lg-tablet {
      display: none;
    }
  }

  .pools {
    border: 2px solid @color-pools;
  }

  &.ant-menu-item-selected .pools {
    background: @color-pools;
  }

  .farms {
    border: 2px solid @color-farms;
  }

  &.ant-menu-item-selected .farms {
    background: @color-farms;
  }

  .swap {
    border: 2px solid @color-swap;
  }

  &.ant-menu-item-selected .swap {
    background: @color-swap;
  }

  .fertilizer {
    border: 2px solid @color-fertilizer;
  }

  &.ant-menu-item-selected .fertilizer {
    background: @color-fertilizer;
  }

  .staking {
    border: 2px solid @color-staking;
  }

  &.ant-menu-item-selected .staking {
    background: @color-staking;
  }
  .stakingTest {
    border: 2px solid #480469;
  }
  &.ant-menu-item-selected .stakingTest {
    background: #480469;
  }
}

.ant-menu {
  text-transform: capitalize;
}

.ant-menu-horizontal {
  line-height: 62px;
  border-bottom: none;

  @media @max-sm-mobile {
    display: flex;
    border-top: 1px solid rgba(255,255,255,0.3);
    border-bottom: 1px solid rgba(255,255,255,0.3);
    margin-top: 10px;
    justify-content: space-between;
  }

  .ant-menu-item {
    border-bottom: none;
    font-size: 16px;
    font-weight: 400;
    height: 60px;

    @media @max-s-mobile {
      font-size: 12px;
    }
  }

  .ant-menu-item-selected {
    font-weight: 600;
  }
}

.ant-menu-horizontal > .ant-menu-item:hover,
.ant-menu-horizontal > .ant-menu-submenu:hover,
.ant-menu-horizontal > .ant-menu-item-active,
.ant-menu-horizontal > .ant-menu-submenu-active,
.ant-menu-horizontal > .ant-menu-item-open,
.ant-menu-horizontal > .ant-menu-submenu-open,
.ant-menu-horizontal > .ant-menu-item-selected,
.ant-menu-horizontal > .ant-menu-submenu-selected {
  border-bottom: none;
}

@media @max-lg-tablet {
  .ant-menu-item {
    padding: 0 12px;
  }
}
</style>
