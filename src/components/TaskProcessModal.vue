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
    <div class="social-task-container">
      <div class="task-progress-container fcs-container">
        <div class="task-item text-center" :class="step === 1 ? 'active' : ''">
          <span class="task-no m-auto font-medium weight-bold">1</span>
          <span class="task-title font-small weight-bold">{{ type === 0 ? 'Telegram ID' : 'Retweet Link' }}</span>
        </div>
        <div class="task-item text-center" :class="step === 2 ? 'active' : ''">
          <span class="task-no m-auto font-medium weight-bold">2</span>
          <span class="task-title font-small weight-bold">Join {{ project }}</span>
        </div>
        <div class="task-item text-center" :class="step === 3 ? 'active' : ''">
          <span class="task-no m-auto font-medium weight-bold">3</span>
          <span class="task-title font-small weight-bold">Join Cropper</span>
        </div>
        <div class="task-item text-center" :class="step === 4 ? 'active' : ''">
          <span class="task-no m-auto font-medium weight-bold">4</span>
          <span class="task-title font-small weight-bold">Confirm</span>
        </div>
      </div>
      <div v-if="step === 1" class="social-input-container fcsb-container" :class="saved ? 'completed' : ''">
        <input
          type="text"
          class="social-input font-medium"
          :value="type === 0 ? telegramID : twitterLink"
          :placeholder="type === 0 ? '@XXXXX' : 'Retweet link'"
        />
        <img v-if="saved" class="status-icon" src="@/assets/icons/status-success.svg" />
      </div>
      <div class="btn-container m-auto">
        <Button
          class="btn-transparent font-medium weight-semi letter-small icon-cursor fcc-container"
          @click="nextProcess"
        >
          <img v-if="step === 2 || step === 3" class="social-icon" src="@/assets/icons/telegram-white.svg" />
          {{
            step === 1
              ? 'Save'
              : step === 2
              ? 'Join ' + project
              : step === 3
              ? 'Join Cropper'
              : step === 4
              ? 'Confirm'
              : ''
          }}
        </Button>
      </div>
      <div class="task-move-container fcc-container">
        <Button class="move-btn prev icon-cursor fcc-container" :disabled="step === 1" @click="$emit('onPrev')">
          <img class="arrow-icon" src="@/assets/icons/arrow-left.svg" />
        </Button>
        <Button class="move-btn next icon-cursor fcc-container" :disabled="step === 4" @click="$emit('onNext')">
          <img class="arrow-icon" src="@/assets/icons/arrow-right.svg" />
        </Button>
      </div>
      <div v-if="step === 1" class="social-notification fb-container">
        <img class="info-icon" src="@/assets/icons/info.svg" />
        <label class="font-small weight-bold"
          >Be sure to communicate the correct {{ type === 0 ? 'id' : 'link' }} otherwise your registration will not be
          retained</label
        >
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
    return {
      telegramID: '' as string,
      twitterLink: '' as string,
      saveStatus: {
        telegram: false as boolean,
        twitter: false as boolean
      }
    }
  },

  methods: {
    nextProcess() {
      if (this.step === 1) {
        if (this.type === 0) this.saveStatus.telegram = true
        else this.saveStatus.twitter = true
      }
    }
  },
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

.info-icon {
  width: 12px;
  height: 12px;
  margin-right: 8px;
}

.status-icon {
  width: 16px;
  height: 16px;
}
</style>
<style lang="less">
.social-task-container {
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

  .social-input-container {
    margin: 8px 0 24px 0;
    padding: 0 8px;
    background: rgba(226, 227, 236, 0.1);
    border: 2px solid transparent;
    border-radius: 12px;

    .social-input {
      background: transparent;
      outline: none;
      border: none;
      width: 100%;
      padding: 8px 10px;
    }

    &.completed {
      background: rgba(49, 183, 159, 0.2);
      border: 2px solid @color-green500;

      .social-input {
        color: @color-green500;
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

  .social-notification {
    margin: 24px 0;
  }
}
</style>