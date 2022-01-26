<template>
  <Modal
    title="Verify your ID"
    :visible="show"
    :footer="null"
    :mask-closable="true"
    :closable="false"
    :width="360"
    @cancel="$emit('onCancel')"
    centered
  >
    <img class="modal-close" src="@/assets/icons/close-circle.svg" @click="$emit('onCancel')" />
    <div class="verify-container">
      <div v-if="currentStatus === 0">
        <div class="country-select">
          <span class="select-title font-small weight-semi spacing-large">Select your country</span>
          <Dropdown :trigger="['click']">
            <a class="fcsb-container">
              <span class="font-medium">France</span>
              <img class="arrow-icon" src="@/assets/icons/arrow-down-white.svg" />
            </a>
            <!-- <div slot="overlay">
              <li key="0">
                <a>France</a>
              </li>
            </div> -->
          </Dropdown>
        </div>
        <div class="id-type-select">
          <span class="select-title font-small weight-semi spacing-large">Select your ID type</span>
          <label class="font-small">We will take two photos of your ID. What type of ID do you want to use?</label>
          <Dropdown :trigger="['click']" class="id-dropdown">
            <a
              class="fcsb-container"
              @click="
                () => {
                  this.currentStatus = 1
                  this.IDType = 'driver'
                }
              "
            >
              <span class="font-medium">Driver's license</span>
              <img class="arrow-icon right" src="@/assets/icons/arrow-down-white.svg" />
            </a>
          </Dropdown>
          <Dropdown :trigger="['click']" class="id-dropdown">
            <a
              class="fcsb-container"
              @click="
                () => {
                  this.currentStatus = 1
                  this.IDType = 'id'
                }
              "
            >
              <span class="font-medium">ID card</span>
              <img class="arrow-icon right" src="@/assets/icons/arrow-down-white.svg" />
            </a>
          </Dropdown>
          <Dropdown :trigger="['click']" class="id-dropdown">
            <a
              class="fcsb-container"
              @click="
                () => {
                  this.currentStatus = 1
                  this.IDType = 'passport'
                }
              "
            >
              <span class="font-medium">Passport</span>
              <img class="arrow-icon right" src="@/assets/icons/arrow-down-white.svg" />
            </a>
          </Dropdown>
        </div>
        <Checkbox class="check-container">
          <label class="check-label font-small weight-semi spacing-large"
            >Accept
            <span class="highlight">terms & conditions</span>
          </label>
        </Checkbox>
      </div>
      <div v-else-if="currentStatus === 1">
        <div class="back-to-list icon-cursor fcs-container">
          <img class="back-icon" src="@/assets/icons/back.svg" />
          <span class="back-label font-medium weight-bold">Go back</span>
        </div>
        <span class="id-title font-large weight-bold">
          {{
            IDType === 'driver'
              ? "Driver's license"
              : IDType === 'id'
              ? 'ID card'
              : IDType === 'passport'
              ? 'Passport'
              : ''
          }}
        </span>
        <div class="dropbox">
          <!-- <Upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </Upload> -->
        </div>
      </div>
      <div class="btn-container">
        <Button class="btn-transparent font-medium weight-semi letter-small icon-cursor" @click="onSubmit"
          >Submit</Button
        >
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Modal, Checkbox, Dropdown } from 'ant-design-vue'
Vue.use(Modal)

function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default Vue.extend({
  components: {
    Modal,
    Checkbox,
    Dropdown,
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      currentStatus: 0 as number,
      IDType: 'driver' as string,
      loading: false as boolean,
      imageUrl: '' as any,
    }
  },

  methods: {
    handleChange(info: any) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl: any) => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file: any) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
  },
  mounted() {}
})
</script>
<style lang="less" scoped>
// global stylesheet
.btn-container {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 48px;
  height: auto;
  width: 100%;
}

.btn-transparent {
  background: transparent;
  width: 100%;
  padding: 10px;
  border-radius: 48px;
  border: none;
  outline: none;
}

.arrow-icon {
  &.up {
    transform: rotate(180deg);
  }

  &.right {
    transform: rotate(270deg);
  }
}

a {
  color: #fff !important;
}

// class stylesheet
.verify-container {
  .country-select {
    margin: 24px 0;
  }

  .id-type-select {
    margin-bottom: 24px;

    .id-dropdown {
      margin-top: 16px;
    }
  }

  .country-select,
  .id-type-select {
    .select-title {
      display: block;
      margin-bottom: 16px;
    }
  }

  .check-container {
    .check-label {
      opacity: 0.7;

      .highlight {
        color: @color-petrol500;
      }
    }
  }

  .back-to-list {
    opacity: 0.5;
    width: fit-content;
    margin: 24px 0;

    .back-icon {
      margin-right: 8px;
    }

    .back-label {
      color: #fff;
    }
  }

  .id-title {
    display: block;
    margin-bottom: 24px;
  }

  .btn-container {
    margin-top: 24px;
  }
}
</style>
<style lang="less">
// ant checkbox
.ant-checkbox {
  .ant-checkbox-inner {
    background: transparent;
    width: 21px;
    height: 21px;
    border-radius: 7px;
    border: 2px solid @color-blue300;

    &::after {
      position: absolute !important;
      top: 2px;
      left: 2px;
      width: 13px;
      height: 13px;
      border-radius: 4px;
      border: none !important;
      transform: scale(1) !important;
      transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86) !important;
      background-color: @color-farms;
    }
  }

  &.ant-checkbox-checked {
    .ant-checkbox-inner {
      border-color: @color-farms !important;
      background: transparent;
    }

    &::after {
      border: none;
    }
  }
}

.ant-checkbox-wrapper:hover .ant-checkbox-inner,
.ant-checkbox:hover .ant-checkbox-inner,
.ant-checkbox-input:focus + .ant-checkbox-inner {
  border-color: @color-farms !important;
}

// ant dropdown
.ant-dropdown-trigger {
  background: rgba(226, 227, 236, 0.1);
  border-radius: 12px;
  padding: 10px 18px;
}
</style>