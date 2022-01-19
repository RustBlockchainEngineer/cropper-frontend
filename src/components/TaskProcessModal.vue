<template>
  <Modal
    :title="(type === 0 ? 'Telegram' : 'Twitter') + ' Tasks'"
    :visible="show"
    :footer="null"
    :mask-closable="true"
    :closable="false"
    :width="480"
    @cancel="$emit('onCancel')"
    centered
  >
    <img class="modal-close" src="@/assets/icons/close-circle.svg" @click="$emit('onCancel')" />
    <div class="task-telegram-container">
      <div class="task-progress-container fcs-container">
        <div class="task-item text-center" :class="step === 1 ? 'active' : ''">
          <span class="task-no m-auto font-medium weight-bold">1</span>
          <span class="task-title font-small weight-bold">Join {{ project }}</span>
        </div>
        <div class="task-item text-center" :class="step === 2 ? 'active' : ''">
          <span class="task-no m-auto font-medium weight-bold">2</span>
          <span class="task-title font-small weight-bold">Join Cropper</span>
        </div>
        <div class="task-item text-center" :class="step === 3 ? 'active' : ''">
          <span class="task-no m-auto font-medium weight-bold">3</span>
          <span class="task-title font-small weight-bold">Confirm</span>
        </div>
      </div>
      <div class="btn-container m-auto">
        <Button class="btn-transparent font-medium weight-semi letter-small icon-cursor fcc-container">
          <img v-if="step != 3" class="social-icon" src="@/assets/icons/telegram-white.svg" />
          {{ step === 1 ? 'Join' + project : step === 2 ? 'Join Cropper' : step === 3 ? 'Confirm' : '' }}
        </Button>
      </div>
      <div class="task-move-container fcc-container">
        <Button class="move-btn prev icon-cursor fcc-container" :disabled="step === 1" @click="$emit('onPrev')">
          <img class="arrow-icon" src="@/assets/icons/arrow-left.svg" />
        </Button>
        <Button class="move-btn next icon-cursor fcc-container" :disabled="step === 3" @click="$emit('onNext')">
          <img class="arrow-icon" src="@/assets/icons/arrow-right.svg" />
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Modal } from 'ant-design-vue'
Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    project: {
      type: String,
      default: ''
    }
  },

  data() {
    return {}
  },

  methods: {},
  mounted() {}
})
</script>
<style lang="less" scoped>
.btn-container {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 48px;
  height: auto;
  max-width: 200px;
}

.btn-transparent {
  background: transparent;
  width: 100%;
  padding: 10px;
  border-radius: 48px;
  border: none;
  outline: none;
}

.social-icon {
  width: 16px;
  opacity: 0.5;
  margin-right: 16px;
}
</style>
<style lang="less">
.task-telegram-container {
  .task-progress-container {
    background: @color-blue600;
    border-radius: 8px;
    padding: 24px;
    margin: 18px 0 24px 0;

    .task-item {
      width: calc((100% - 16px) / 3);
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }

      .task-no {
        display: block;
        background: rgba(255, 255, 255, 0.4);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-bottom: 8px !important;
        color: @color-blue700;
      }

      .task-title {
        color: rgba(255, 255, 255, 0.4);
      }

      &.active {
        .task-no {
          background: @color-petrol400;
        }

        .task-title {
          color: @color-petrol400;
        }
      }
    }
  }

  .task-move-container {
    margin-top: 24px;

    .move-btn {
      background: @gradient-color-outline;
      background-origin: border-box;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 58px;
      width: 36px;
      height: 36px;
      padding: 8px;
      margin-right: 28px;

      &:last-child {
        margin-right: 0;
      }

      &:disabled {
        opacity: 0.5;
      }
    }
  }
}
</style>