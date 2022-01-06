<template>
  <Modal
    title="About Tiers"
    :visible="show"
    :footer="null"
    :mask-closable="true"
    :closable="false"
    class="tier-modal"
    @cancel="$emit('onCancel')"
    centered
  >
    <img class="modal-close" src="@/assets/icons/close-circle-icon.svg" @click="$emit('onCancel')" />

    <Tabs defaultActiveKey="1">
      <TabPane tab="Tier 1" key="1">
        <Row :gutter="56" class="tier-container fcb-container">
          <Col :sm="12" :xs="24" class="tier-tab">
            <span class="textM weightS">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
              <br /><br />
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </span>
          </Col>
          <Col :sm="12" :xs="24" class="tier-preview">
            <div class="tier-item-box"></div>
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Tier 2" key="2">
        <Row :gutter="56" class="tier-container fcb-container">
          <Col :sm="12" :xs="24" class="tier-tab">
            <span class="textM weightS">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
              <br /><br />
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </span>
          </Col>
          <Col :sm="12" :xs="24" class="tier-preview">
            <div class="tier-item-box"></div>
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Tier 3" key="3">
        <Row :gutter="56" class="tier-container fcb-container">
          <Col :span="12" class="tier-tab">
            <span class="textM weightS">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
              <br /><br />
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </span>
          </Col>
          <Col :span="12" class="tier-preview">
            <div class="tier-item-box"></div>
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Tier 4" key="4">
        <Row :gutter="56" class="tier-container fcb-container">
          <Col :span="12" class="tier-tab">
            <span class="textM weightS">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
              <br /><br />
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </span>
          </Col>
          <Col :span="12" class="tier-preview">
            <div class="tier-item-box"></div>
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Tier 5" key="5">
        <Row :gutter="56" class="tier-container fcb-container">
          <Col :span="12" class="tier-tab">
            <span class="textM weightS">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
              <br /><br />
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </span>
          </Col>
          <Col :span="12" class="tier-preview">
            <div class="tier-item-box"></div>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Modal, Row, Col, Tabs } from 'ant-design-vue'
const { TabPane } = Tabs
Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Tabs,
    TabPane,
    Row,
    Col
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  }
})
</script>
<style lang="less" scoped>
.tier-container {
  margin: 0 !important;

  @media @max-sl-mobile {
    display: inline-block !important;
  }

  .tier-tab {
    padding-left: 0 !important;

    @media @max-sl-mobile {
      padding-right: 0 !important;
      width: 100%;
    }
  }

  .tier-preview {
    padding-right: 0 !important;

    @media @max-sl-mobile {
      margin-top: 28px;
      width: 100%;
      padding-left: 0 !important;
    }

    .tier-item-box {
      background: #0b2e6a;
      border-radius: 18px;
      width: 100%;
      height: 300px;
    }
  }
}
</style>

<style lang="less">
.tier-modal {
  .ant-modal {
    max-width: @tablet-md-width;
    width: 100% !important;

    @media @max-md-tablet {
      max-width: calc(100vw - 16px);
    }
  }

  .ant-tabs-bar {
    border-bottom: 0;
    margin: 0 0 28px 0;

    .ant-tabs-nav {
      .ant-tabs-tab {
        margin: 0 18px 0 0;
        font-weight: 600;
        font-size: 20px;
        line-height: 30px;
        color: #eae8f1;
      }

      .ant-tabs-tab-active {
        color: @color-petrol500;
      }

      .ant-tabs-ink-bar {
        position: relative;
        margin-top: 8px;
        width: 50px !important;
        height: 4px;
        background: @color-petrol400;
        border-radius: 10px;
      }
    }
  }
}
</style>