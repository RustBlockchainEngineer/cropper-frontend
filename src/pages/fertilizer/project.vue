<template>
  <div class="fertilizer-project container">
    <div class="card">
      <div class="card-body">
        <SubscribeModal
          :show="subscribeShow"
          @onCancel="() => (subscribeShow = false)"
          @onOk="
            () => {
              currentStatus.subscribe = true
              subscribeShow = false
            }
          "
        />
        <TaskProcessModal
          :show="taskModalShow"
          :step="taskModalType === 0 ? currentStatus.telegramTicket : currentStatus.twitterTicket"
          :project="fertilizer.title"
          :type="taskModalType"
          @onNext="
            () => {
              if (this.taskModalType === 0) this.currentStatus.telegramTicket++
              else this.currentStatus.twitterTicket++
            }
          "
          @onPrev="
            () => {
              if (this.taskModalType === 0) this.currentStatus.telegramTicket--
              else this.currentStatus.twitterTicket--
            }
          "
          @onCancel="() => (taskModalShow = false)"
        />
        <IDVerifyModal
          :show="KYCModalShow"
          @onCancel="() => (KYCModalShow = false)"
          @onOk="
            () => {
              KYCStatus.step = 2
              KYCStatus.verification = 1
              KYCModalShow = false
            }
          "
        />

        <div class="project-content">
          <div class="project-preview-container">
            <div class="project-back">
              <div class="back-to-list icon-cursor fcs-container">
                <img class="back-icon" src="@/assets/icons/back.svg" />
                <span class="back-label font-medium weight-bold">Go back</span>
              </div>
            </div>
            <div class="project-preview-ido-container">
              {{ currentTimestamp }}
              <div class="project-preview">
                <div class="project-overview fcsb-container">
                  <div class="project-title fcs-container">
                    <img class="project-logo" :src="fertilizer.logo" />
                    <span class="font-large weight-bold">{{ fertilizer.title }}</span>
                  </div>
                  <div
                    class="project-status"
                    :class="
                      currentStep === 0
                        ? 'preparation'
                        : currentStep === 1
                        ? 'whitelist'
                        : currentStep === 2 && currentTimestamp < fertilizer.sales_start_date
                        ? 'sales'
                        : currentStep === 2 &&
                          currentTimestamp > fertilizer.sales_start_date &&
                          fertilizer.sales_end_date > currentTimestamp
                        ? 'open'
                        : (currentStep === 2 && currentTimestamp > fertilizer.sales_end_date) ||
                          (currentStep === 3 && !currentStatus.funded)
                        ? 'distribution'
                        : ''
                    "
                  >
                    <span class="font-xsmall weight-bold">
                      {{
                        currentStep === 0
                          ? projectStatus.preparation
                          : currentStep === 1
                          ? projectStatus.whitelist
                          : currentStep === 2 && fertilizer.sales_start_date > currentTimestamp
                          ? projectStatus.sales
                          : currentStep === 2 &&
                            currentTimestamp > fertilizer.sales_start_date &&
                            fertilizer.sales_end_date > currentTimestamp
                          ? projectStatus.open
                          : (currentStep === 2 && currentTimestamp > fertilizer.sales_end_date) ||
                            (currentStep === 3 && !currentStatus.funded)
                          ? projectStatus.distribution
                          : ''
                      }}
                    </span>
                  </div>
                </div>
                <div
                  v-if="
                    (currentStep === 0 && currentTimestamp < fertilizer.whitelist_start_date) ||
                    (currentStep >= 1 && currentStep < 3)
                  "
                  class="project-countdown"
                >
                  <Countdown
                    :title="
                      currentStep === 0 && currentTimestamp < fertilizer.whitelist_start_date
                        ? 'The whitelist starts in'
                        : currentStep === 1
                        ? 'End of the whitelist in'
                        : currentStep === 2 && currentTimestamp < fertilizer.sales_start_date
                        ? 'Sales start in'
                        : currentStep === 2 &&
                          currentTimestamp > fertilizer.sales_start_date &&
                          currentTimestamp < fertilizer.sales_end_date
                        ? 'Sales end in'
                        : currentStep === 2 && currentTimestamp > fertilizer.sales_end_date
                        ? 'Distribution starts in'
                        : ''
                    "
                    :value="
                      currentStep === 0 && currentTimestamp < fertilizer.whitelist_start_date
                        ? fertilizer.whitelist_start_date
                        : currentStep === 1
                        ? fertilizer.whitelist_end_date
                        : currentStep === 2 && currentTimestamp < fertilizer.sales_start_date
                        ? fertilizer.sales_start_date
                        : currentStep === 2 &&
                          currentTimestamp > fertilizer.sales_start_date &&
                          currentTimestamp < fertilizer.sales_end_date
                        ? fertilizer.sales_end_date
                        : currentStep === 2 && currentTimestamp > fertilizer.sales_end_date
                        ? fertilizer.distribution_start_date
                        : ''
                    "
                    format="DD:HH:mm:ss"
                  />
                </div>
                <div v-if="currentStep > 0" class="project-progress">
                  <div v-if="currentStep === 1">
                    <div v-if="!currentStatus.subscribe" class="btn-container">
                      <Button
                        class="btn-transparent font-medium weight-semi icon-cursor"
                        @click="
                          () => {
                            this.subscribeShow = true
                          }
                        "
                        >Subscribe Whitelist</Button
                      >
                    </div>
                    <div v-else class="fcc-container">
                      <img class="status-icon" src="@/assets/icons/check-circle-white.svg" />
                      <span class="font-small weight-semi spacing-large">Earn ticket in progress</span>
                    </div>
                  </div>
                  <div v-else-if="currentStep === 2">
                    <div v-if="currentTimestamp < fertilizer.sales_end_date">
                      <div
                        v-if="(currentTier === 0 && currentStatus.win) || currentStatus.subscribe"
                        class="fcc-container"
                      >
                        <img class="status-icon" src="@/assets/icons/check-circle-white.svg" />
                        <span class="font-small weight-semi spacing-large">You are registered</span>
                      </div>
                      <div
                        v-else-if="
                          (currentTier === 0 && (!currentStatus.win || !currentStatus.subscribe)) ||
                          !currentStatus.subscribe
                        "
                        class="fcc-container"
                      >
                        <img class="alert-icon" src="@/assets/icons/alert-white.svg" />
                        <span class="font-small weight-semi spacing-large">You are not in the whitelist</span>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="currentStep === 3">
                    <div v-if="!currentStatus.funded" class="fcc-container">
                      <img class="status-icon" src="@/assets/icons/check-circle-white.svg" />
                      <span class="font-small weight-semi spacing-large">Distribution in progress</span>
                    </div>
                    <div v-else class="btn-container">
                      <Button class="btn-transparent font-medium weight-semi icon-cursor">Start Farming</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="project-ido">
                <div class="project-ido-process">
                  <span class="label font-medium weight-bold">IDO process:</span>
                  <Steps :current="currentStep" size="small" direction="vertical" :status="currentStatus.steps">
                    <Step>
                      <template slot="title">
                        <span class="font-small weight-bold">Preparation</span>
                      </template>
                    </Step>
                    <Step>
                      <template slot="title">
                        <div class="fcsb-container">
                          <span class="font-small weight-bold">Whitelist</span>
                          <span v-if="currentStep > 1" class="status-label success font-small weight-bold"
                            >Registered</span
                          >
                        </div>
                        <span v-if="currentStep === 1" class="status-label description font-small"
                          >You can now whitelist yourself for the lottery.</span
                        >
                      </template>
                    </Step>
                    <Step>
                      <template slot="title">
                        <div class="fcsb-container">
                          <span class="font-small weight-bold">Sales</span>
                          <span v-if="currentStep > 2" class="status-label closed font-small weight-bold">Closed</span>
                        </div>
                        <span v-if="currentStep === 2" class="status-label description font-small"
                          >Winners can participate in the token sale.</span
                        >
                      </template>
                    </Step>
                    <Step>
                      <template slot="title">
                        <div class="fcsb-container">
                          <span class="font-small weight-bold">Distribution</span>
                          <span v-if="currentStep >= 3" class="status-label success font-small weight-bold"
                            >Distributed</span
                          >
                        </div>
                        <span v-if="currentStep === 3" class="status-label description font-small"
                          >The tokens get distributed to Sale participants.</span
                        >
                      </template>
                    </Step>
                  </Steps>
                </div>
              </div>
            </div>
          </div>
          <div class="project-detail-container">
            <div class="project-detail-static">
              <div class="project-detail-card">
                <div class="project-detail-desc">
                  <div class="project-title fcs-container">
                    <img class="project-logo" :src="fertilizer.logo" />
                    <h4 class="weight-bold spacing-medium">{{ fertilizer.title }}</h4>
                  </div>
                  <div class="project-short-desc">
                    <span class="font-medium weight-semi">{{ fertilizer.short_desc }}</span>
                  </div>
                  <span class="font-medium">{{ fertilizer.long_desc }}</span>
                </div>
                <div class="project-detail-info-group">
                  <Row :gutter="16">
                    <Col :md="8" :sm="12" :xs="12" class="project-detail-info-item">
                      <span class="title font-small weight-semi spacing-large">Token Price</span>
                      <div class="value fcs-container">
                        <CoinIcon class="coin-icon" :mint-address="fertilizer.mint" />
                        <span class="font-medium"
                          ><b>{{ fertilizer.ido_info.sale_rate }}</b> USDC</span
                        >
                      </div>
                    </Col>
                    <Col :md="8" :sm="12" :xs="12" class="project-detail-info-item">
                      <span class="title font-small weight-semi spacing-large">Hard Cap</span>
                      <div class="value fcs-container">
                        <CoinIcon class="coin-icon" :mint-address="fertilizer.mint" />
                        <span class="font-medium"
                          ><b>{{ fertilizer.ido_info.hard_cap }}</b> USDC</span
                        >
                      </div>
                    </Col>
                    <Col :md="8" :sm="12" :xs="12" class="project-detail-info-item">
                      <span class="title font-small weight-semi spacing-large">Pool Size</span>
                      <div class="value fcs-container">
                        <img class="coin-icon" :src="fertilizer.logo" />
                        <span class="font-medium"
                          ><b>{{ fertilizer.pool_size }}</b> {{ fertilizer.token_info.symbol }}</span
                        >
                      </div>
                    </Col>
                    <Col :md="8" :sm="12" :xs="12" class="project-detail-info-item">
                      <span class="title font-small weight-semi spacing-large">Type</span>
                      <div class="value fcs-container">
                        <img class="lock-icon" src="@/assets/icons/lock.svg" />
                        <span class="font-medium weight-semi">{{ fertilizer.ido_info.sale_type }}</span>
                      </div>
                    </Col>
                    <Col :md="8" :sm="12" :xs="12" class="project-detail-info-item">
                      <span class="title font-small weight-semi spacing-large">Participants</span>
                      <div class="value">
                        <span class="font-medium weight-semi">{{ fertilizer.participants }}</span>
                      </div>
                    </Col>
                    <Col :md="8" :sm="12" :xs="12" class="project-detail-info-item">
                      <span class="title font-small weight-semi spacing-large">Website</span>
                      <div class="value">
                        <a class="website font-medium weight-semi" :href="fertilizer.website_url" target="_blank">{{
                          fertilizer.website
                        }}</a>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>

            <div class="project-detail-condition">
              <div v-if="currentStep === 0"></div>
              <div v-else-if="currentStep === 1 && currentStatus.subscribe" class="project-detail-item">
                <h4 class="weight-semi">Earn Social Pool tickets!</h4>
                <span class="font-medium">
                  A small percentage of the to-be-sold tokens will be allocated to the Social Pool. You can earn extra
                  allocation by performing various social tasks.
                </span>
                <div class="ticket-tasks-group fssb-container">
                  <div class="ticket-tasks">
                    <span class="font-medium weight-bold">Earn tickets by completing these tasks:</span>
                    <div class="ticket-task-status-group fcsb-container">
                      <div
                        class="ticket-task-status-card fcsb-container icon-cursor"
                        :class="currentStatus.telegramTicket === 3 ? 'active' : ''"
                        @click="
                          () => {
                            this.taskModalShow = true
                            this.taskModalType = 0
                          }
                        "
                      >
                        <div class="ticket-task-status fs-container">
                          <img class="ticket-social-icon" src="@/assets/icons/telegram-white.svg" />
                          <div>
                            <span class="font-medium weight-bold">Telegram task</span>
                            <br />
                            <span class="font-xsmall weight-semi"
                              >{{ currentStatus.telegramTicket }} /3 Task completed</span
                            >
                          </div>
                        </div>
                        <img
                          v-if="currentStatus.telegramTicket === 3"
                          class="status-icon"
                          src="@/assets/icons/check-white.svg"
                        />
                      </div>
                      <div
                        class="ticket-task-status-card fcsb-container icon-cursor"
                        :class="currentStatus.twitterTicket === 3 ? 'active' : ''"
                        @click="
                          () => {
                            this.taskModalShow = true
                            this.taskModalType = 1
                          }
                        "
                      >
                        <div class="ticket-task-status fs-container">
                          <img class="ticket-social-icon" src="@/assets/icons/twitter-white.svg" />
                          <div>
                            <span class="font-medium weight-bold">Twitter task</span>
                            <br />
                            <span class="font-xsmall weight-semi"
                              >{{ currentStatus.twitterTicket }}/3 Task completed</span
                            >
                          </div>
                        </div>
                        <img
                          v-if="currentStatus.twitterTicket === 3"
                          class="status-icon"
                          src="@/assets/icons/check-white.svg"
                        />
                      </div>
                    </div>
                    <span class="font-medium weight-bold">Share your affilliated link to earn tickets:</span>
                    <div class="ticket-share-group fcsb-container">
                      <input type="text" class="ticket-share-link font-medium" :value="affiliatedLink" disabled />
                      <img class="copy-icon icon-cursor" src="@/assets/icons/copy.svg" @click="copyToClipboard()" />
                    </div>
                    <div class="ticket-btn-group fcsb-container">
                      <div class="share-btn btn-container">
                        <Button class="btn-primary font-small weight-semi spacing-large icon-cursor"
                          >Share on Telegram</Button
                        >
                      </div>
                      <div class="share-btn btn-container">
                        <Button class="btn-primary font-small weight-semi spacing-large icon-cursor"
                          >Share on Twitter</Button
                        >
                      </div>
                    </div>
                  </div>
                  <div class="ticket-preview">
                    <div class="ticket-earned">
                      <span class="font-medium weight-bold"
                        >You are now registered for the {{ fertilizer.title }} whitelist as:</span
                      >
                      <div class="ticket-earned-status fcs-container">
                        <img class="referral-icon" src="@/assets/icons/referral.svg" />
                        <div>
                          <span class="font-medium weight-semi spacing-small">
                            <label class="font-large">0</label>
                            Earned Tickets
                          </span>
                          <br />
                          <span class="font-xsmall">0 Social / 0 Referrals</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="currentStep === 2" class="project-detail-item">
                <div v-if="currentTimestamp < fertilizer.sales_start_date" class="project-detail-sales">
                  <div v-if="(currentTier === 0 && currentStatus.win) || currentStatus.subscribe">
                    <div class="fcc-container">
                      <img class="status-icon" src="@/assets/icons/check-circle-white.svg" />
                      <span class="font-medium weight-semi spacing-small"
                        >Congratulations you will be able to buy when this sales start.</span
                      >
                    </div>
                    <Countdown
                      class="sales-start-countdown"
                      title="Sales start in:"
                      :value="fertilizer.sales_start_date"
                      format="DD:HH:mm:ss"
                    />
                  </div>
                  <div
                    v-else-if="
                      (currentTier === 0 && (!currentStatus.win || !currentStatus.subscribe)) ||
                      !currentStatus.subscribe
                    "
                    class="text-center"
                  >
                    <div class="fcc-container mb-8">
                      <img class="alert-icon" src="@/assets/icons/alert-white.svg" />
                      <h4 class="weight-bold spacing-medium">Sorry whitelist is ended, find another project</h4>
                    </div>
                    <span class="font-medium">You do not have a winning staking ticket or winning social ticket.</span>
                  </div>
                </div>
                <div
                  v-else-if="
                    currentTimestamp > fertilizer.sales_start_date && currentTimestamp < fertilizer.sales_end_date
                  "
                >
                  <div class="project-detail-open">
                    <div v-if="(currentTier === 0 && currentStatus.win) || currentStatus.subscribe">
                      <div class="kyc-form">
                        <div class="kyc-progress-container fcs-container">
                          <div class="kyc-step text-center" :class="KYCStatus.step >= 1 ? 'active' : ''">
                            <span class="kyc-no m-auto font-medium weight-bold">1</span>
                            <span class="kyc-title font-small weight-bold">ID Verification</span>
                          </div>
                          <div class="kyc-step text-center" :class="KYCStatus.step >= 2 ? 'active' : ''">
                            <span class="kyc-no m-auto font-medium weight-bold">2</span>
                            <span class="kyc-title font-small weight-bold">Verification</span>
                          </div>
                          <div class="kyc-step text-center" :class="KYCStatus.step >= 3 ? 'active' : ''">
                            <span class="kyc-no m-auto font-medium weight-bold">3</span>
                            <span class="kyc-title font-small weight-bold">Start to buy</span>
                          </div>
                        </div>
                        <div v-if="KYCStatus.step < 3">
                          <div class="kyc-status-container fcsb-container">
                            <div class="kyc-current-step fcs-container">
                              <span class="font-large weight-bold">ID Verification</span>
                              <img class="info-icon left" src="@/assets/icons/info.svg" />
                            </div>
                            <span
                              class="kyc-status font-xsmall weight-bold"
                              :class="
                                KYCStatus.step === 1
                                  ? 'failed'
                                  : KYCStatus.step === 2 && KYCStatus.verification === 1
                                  ? 'progress'
                                  : KYCStatus.step === 2 && KYCStatus.verification === 2
                                  ? 'success'
                                  : KYCStatus.step === 2 && KYCStatus.verification === 0
                                  ? 'failed'
                                  : ''
                              "
                              >{{
                                KYCStatus.step === 1
                                  ? 'Not verified'
                                  : KYCStatus.step === 2 && KYCStatus.verification === 1
                                  ? 'In progress'
                                  : KYCStatus.step === 2 && KYCStatus.verification === 2
                                  ? 'Verified'
                                  : KYCStatus.step === 2 && KYCStatus.verification === 0
                                  ? 'Verification failed'
                                  : ''
                              }}</span
                            >
                          </div>
                          <div class="kyc-description">
                            <span class="font-small weight-semi spacing-large">
                              Before buy the token we need to verify your ID. Usually it takes between 24 and 48 hours
                              to be verified.
                            </span>
                            <img
                              v-if="KYCStatus.step === 1"
                              class="kyc-status-icon flex m-auto"
                              src="@/assets/icons/kyc-verification.svg"
                            />
                            <img
                              v-else-if="KYCStatus.step === 2 && KYCStatus.verification === 1"
                              class="kyc-status-icon flex m-auto"
                              src="@/assets/icons/kyc-progress.svg"
                            />
                            <img
                              v-else-if="KYCStatus.step === 2 && KYCStatus.verification === 2"
                              class="kyc-status-icon flex m-auto"
                              src="@/assets/icons/kyc-success.svg"
                            />
                            <img
                              v-else-if="KYCStatus.step === 2 && KYCStatus.verification === 0"
                              class="kyc-status-icon flex m-auto"
                              src="@/assets/icons/kyc-failed.svg"
                            />
                          </div>
                          <div class="btn-container">
                            <Button
                              class="btn-transparent font-medium weight-semi icon-cursor"
                              :disabled="KYCStatus.step === 2 && KYCStatus.verification === 1"
                              @click="KYCConfirm"
                              >{{
                                KYCStatus.step === 1
                                  ? 'Verify your ID now'
                                  : KYCStatus.step === 2 && KYCStatus.verification === 1
                                  ? 'Next'
                                  : KYCStatus.step === 2 && KYCStatus.verification === 2
                                  ? 'Next'
                                  : KYCStatus.step === 2 && KYCStatus.verification === 0
                                  ? 'Verify your ID again'
                                  : ''
                              }}</Button
                            >
                          </div>
                        </div>
                      </div>
                      <div v-if="KYCStatus.userVerified && KYCStatus.step === 3" class="buy-form">
                        <span class="font-medium weight-semi spacing-small"
                          >You can buy token from this project and see what you will receive.</span
                        >
                        <div class="token-amount fcsb-container">
                          <div class="token-amount-input fcs-container">
                            <CoinIcon class="coin-icon" :mint-address="fertilizer.mint" />
                            <input class="font-medium weight-bold" type="number" placeholder="673" />
                          </div>
                          <span class="font-xsmall weight-semi token-max-amount">max 1500 USDC</span>
                        </div>
                        <div class="receive-amount">
                          <label class="font-xmall">You will receive:</label>
                          <div class="receive-amount-output fcs-container">
                            <img class="coin-icon" :src="fertilizer.logo" />
                            <span class="receive-amount-value font-medium weight-semi spacing-small"
                              >0.028 {{ fertilizer.title }}</span
                            >
                          </div>
                        </div>
                        <div class="btn-container">
                          <Button class="btn-transparent font-medium weight-semi icon-cursor">Buy Now</Button>
                        </div>
                      </div>
                    </div>
                    <div
                      v-else-if="
                        (currentTier === 0 && (!currentStatus.win || !currentStatus.subscribe)) ||
                        !currentStatus.subscribe
                      "
                      class="text-center"
                    >
                      <div class="fcc-container mb-8">
                        <img class="alert-icon" src="@/assets/icons/alert-white.svg" />
                        <h4 class="weight-bold spacing-medium">Sorry whitelist is ended, find another project</h4>
                      </div>
                      <span class="font-medium"
                        >You do not have a winning staking ticket or winning social ticket.</span
                      >
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="project-detail-open">
                    <Countdown
                      class="distribution-start-countdown"
                      title="Distribution starts in:"
                      :value="fertilizer.distribution_start_date"
                      format="DD:HH:mm:ss"
                    />
                    <span class="font-medium weight-semi spacing-small"
                      >You have to wait Distribution date to receive Tokens. Be patient!</span
                    >
                    <div class="buy-form">
                      <div class="token-amount fcsb-container">
                        <div class="token-amount-input fcs-container">
                          <CoinIcon class="coin-icon" :mint-address="fertilizer.mint" />
                          <input class="font-medium weight-bold" type="number" placeholder="673" disabled />
                        </div>
                        <span class="font-xsmall weight-semi token-max-amount">max 1500 USDC</span>
                      </div>
                      <div class="receive-amount">
                        <label class="font-xmall">You will receive:</label>
                        <div class="receive-amount-output fcs-container">
                          <img class="coin-icon" :src="fertilizer.logo" />
                          <span class="receive-amount-value font-medium weight-semi spacing-small"
                            >0.028 {{ fertilizer.title }}</span
                          >
                        </div>
                      </div>
                      <div class="receive-notification fb-container">
                        <img class="info-icon right" src="@/assets/icons/info.svg" />
                        <span class="font-xsmall weight-bold"
                          >You will receive your tokens on
                          <label class="font-small">Wallet ID: QlkjfjdsiuJDlkjf</label>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="currentStep === 3" class="project-detail-item">
                <div
                  v-if="currentTimestamp > fertilizer.distribution_start_date && !currentStatus.funded"
                  class="project-detail-open"
                >
                  <span class="font-medium weight-semi spacing-small">Distribution in progress, keep in touch!</span>
                  <div class="buy-form">
                    <div class="token-amount fcsb-container">
                      <div class="token-amount-input fcs-container">
                        <CoinIcon class="coin-icon" :mint-address="fertilizer.mint" />
                        <input class="font-medium weight-bold" type="number" placeholder="673" disabled />
                      </div>
                      <span class="font-xsmall weight-semi token-max-amount">max 1500 USDC</span>
                    </div>
                    <div class="receive-amount">
                      <label class="font-xmall">You will receive:</label>
                      <div class="receive-amount-output fcs-container">
                        <img class="coin-icon" :src="fertilizer.logo" />
                        <span class="receive-amount-value font-medium weight-semi spacing-small"
                          >0.028 {{ fertilizer.title }}</span
                        >
                      </div>
                    </div>
                    <div class="receive-notification fb-container">
                      <img class="info-icon right" src="@/assets/icons/info.svg" />
                      <span class="font-xsmall weight-bold"
                        >You will receive your tokens on
                        <label class="font-small">Wallet ID: QlkjfjdsiuJDlkjf</label>
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center">
                  <h4 class="weight-bold spacing-medium">Sonar Watch public sale has finished!</h4>
                  <div class="distribution-details">
                    <span class="font-medium">
                      Sonar Watch raised:
                      <br />
                      <b>500,000 / 500,000 USDC</b>
                    </span>
                    <div class="sale-details-group fcc-container">
                      <div class="sale-detail-card text-left">
                        <span class="font-xsmall">ROI (ATH)</span>
                        <br />
                        <span class="font-large weight-bold">8.20x</span>
                      </div>
                      <div class="sale-detail-card text-left">
                        <span class="font-xsmall">ROI (current)</span>
                        <br />
                        <span class="font-large weight-bold">1.07x</span>
                      </div>
                      <div class="sale-detail-card text-left">
                        <span class="font-xsmall">Last Price</span>
                        <br />
                        <span class="font-large weight-bold">0.21 USDC</span>
                      </div>
                    </div>
                    <div class="btn-container m-auto">
                      <Button class="btn-transparent font-medium weight-semi icon-cursor">Start Farming</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="project-detail-static banner fcsb-container">
              <div class="project-detail-stake">
                <h4 class="weight-semi">Develop your Tier to have more allocation</h4>
                <div class="btn-container">
                  <Button class="btn-transparent font-medium weight-semi icon-cursor">Stake CRP</Button>
                </div>
              </div>
              <img class="farmer-img isDesktop" src="@/assets/background/farmer-desktop.png" />
              <img class="farmer-img isTablet" src="@/assets/background/farmer-table.png" />
            </div>

            <div class="project-detail-static transparent">
              <h3 class="project-category-title weight-semi">Project Details</h3>
              <Row :gutter="[40, 20]">
                <Col :md="12" :sm="24" :xs="24">
                  <span class="font-large weight-bold">IDO Information</span>
                  <div class="information">
                    <div class="information-item fcsb-container">
                      <span class="label font-small weight-semi spacing-large">Hardcap</span>
                      <span class="font-medium weight-semi spacing-small">{{ fertilizer.ido_info.hard_cap }}</span>
                    </div>
                    <div class="information-item fcsb-container">
                      <span class="label font-small weight-semi spacing-large">Sale rate</span>
                      <span class="font-medium weight-semi spacing-small">{{ fertilizer.ido_info.sale_rate }}</span>
                    </div>
                    <div class="information-item fcsb-container">
                      <span class="label font-small weight-semi spacing-large">Sale type</span>
                      <span class="font-medium weight-semi spacing-small">{{ fertilizer.ido_info.sale_type }}</span>
                    </div>
                    <div class="information-item fcsb-container">
                      <span class="label font-small weight-semi spacing-large">Open Time</span>
                      <span class="font-medium weight-semi spacing-small">{{ fertilizer.ido_info.open_time }}</span>
                    </div>
                    <div class="information-item fcsb-container">
                      <span class="label font-small weight-semi spacing-large">Close Time</span>
                      <span class="font-medium weight-semi spacing-small">{{ fertilizer.ido_info.close_time }}</span>
                    </div>
                  </div>
                </Col>
                <Col :md="12" :sm="24" :xs="24">
                  <span class="font-large weight-bold">Token Information</span>
                  <div class="information">
                    <div class="information-item fcsb-container">
                      <span class="label font-small weight-semi spacing-large">Symbol</span>
                      <span class="font-medium weight-semi spacing-small">{{ fertilizer.token_info.symbol }}</span>
                    </div>
                    <div class="information-item fcsb-container">
                      <span class="label font-small weight-semi spacing-large">Category</span>
                      <span class="font-medium weight-semi spacing-small">{{ fertilizer.token_info.category }}</span>
                    </div>
                    <div class="information-item fcsb-container">
                      <span class="label font-small weight-semi spacing-large">Token Distribution</span>
                      <span class="font-medium weight-semi spacing-small">{{
                        fertilizer.token_info.token_distribution
                      }}</span>
                    </div>
                    <div class="information-item fcsb-container">
                      <span class="label font-small weight-semi spacing-large">Blockchain</span>
                      <span class="font-medium weight-semi spacing-small">{{ fertilizer.token_info.blockchain }}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div class="project-detail-static transparent">
              <h3 class="project-category-title weight-semi">About</h3>
              <Row class="project-category-content-about" :gutter="[40, 40]">
                <Col :md="12" :sm="24" :xs="24">
                  <span class="font-medium">
                    Discover, Collect, and Trade NFTs as a team.<br /><br />
                    The first NFT asset management platform providing tools for collectors and investors to power the
                    NFT space. Running cross-chain, powered by Solana.<br /><br />
                    We bring more togetherness to the NFT space<br /><br />
                    Create a club, act as a curator, raise funds to expand your collection, and build a community around
                    it.
                  </span>
                </Col>
                <Col :md="12" :sm="24" :xs="24">
                  <img class="banner-img" :src="fertilizer.img.about" />
                </Col>
              </Row>
            </div>

            <div class="project-detail-static transparent">
              <h3 class="project-category-title weight-semi">Features</h3>
              <img class="project-category-banner-img" :src="fertilizer.img.features" />
              <div>
                <div>
                  <span class="font-medium weight-semi">Onwership DAOs</span>
                  <br /><br />
                  <span class="font-medium">
                    You can't just copy trade NFTs since they are unique and have a big social component. That's why UNQ
                    allows you to create Clubs - essentially, ownership DAOs that are led by an experience and dedicated
                    collector, and community can bring additional liquidity, participation, and governance.
                  </span>
                </div>
                <br />
                <div>
                  <span class="font-medium weight-semi">Flexible structure</span>
                  <br /><br />
                  <span class="font-medium">
                    Want to have a better asset management for you play to earn guild? We got it. Want to get buy those
                    expensive NFTs together with a team to de-risk your invetments? Do it. Want to turn collecting into
                    a business, or expand existing gallery business into the digital world and be able to raise funds
                    and get access to the world of NFTs? Explore our Public clubs and social tokens.
                  </span>
                </div>
                <br />
                <div>
                  <span class="font-medium weight-semi">Cross-chain transactions</span>
                  <br /><br />
                  <span class="font-medium">
                    NFT market is growing, and more blockchains are introducing NFT support, which makes collector's
                    life hard. We know that, and we want you to be able to focus on what you do best - buy and sell
                    NFTs. That's why we are developing a solution that will allow you to transact with NFTs across
                    chains from a single trustless Solana-based interface.
                  </span>
                </div>
                <br />
                <div>
                  <span class="font-medium weight-semi">Token utility :</span>
                  <br /><br />
                  <span class="font-medium">
                    -UNQ is a single token utilized across the products.
                    <br /><br />
                    -Transacting Universe NFTs with UNQ gives additional benefits
                    <br /><br />
                    -UNQ is a platform governance token in Clubs
                    <br /><br />
                    -Clubs can upgrade using UNQ
                    <br /><br />
                    -Club tokens can be only traded against UNQ
                    <br /><br />
                    -Rewards for content creators in Worlds are in UNQ
                  </span>
                </div>
              </div>
            </div>

            <div class="project-detail-static transparent">
              <h3 class="project-category-title weight-semi">Roadmap</h3>
              <img class="project-category-banner-img" :src="fertilizer.img.roadmap" />
              <div>
                <span class="font-medium">
                  <b>Phase 1 - </b>Inception <br /><br />
                  <b>Phase 2 - </b>MVP development , Solana Hackathon participation (winner 3rd place) <br /><br />
                  <b>Phase 3 - </b>Further development, Market research, Private fundraise <br /><br />
                  <b>Phase 4 - </b>Private beta of UNQ Club and UNQ World, NFT collection - UNQ Universe, Public beta of
                  UNQ Club <br /><br />
                  <b>Phase 5 - </b>Release of UNQ Club, Public beta of UNQ World <br /><br />
                  <b>Phase 6 - </b>Release of UNQ World
                </span>
              </div>
            </div>

            <div class="project-detail-static transparent">
              <h3 class="project-category-title weight-semi">Team & Backers</h3>
              <img class="project-category-banner-img" :src="fertilizer.img.team" />
              <div>
                <span class="font-medium">
                  Co-founder and CEO - Alex Migitko : Entrepreneur, 17 years in IT, of which 10 years in game
                  development, 5 years blockchain.
                  <br /><br />
                  Co-founder and CTO - Uros Sosevic : Software engineer, 17 years of experience as a developer,
                  architect and CTO;5 years of experience working with
                  <br /><br />
                  Co-founder and BD - Martin Kardzhilov - Crypto-native, investor, marketing expert, working for 5 years
                  exclusively in the crypto industry.
                  <br /><br />
                  Backers :
                  <br /><br />
                  Solana Foundation, Jump Capital, GSR, Gate.io , MEXC, NGC, WWG, Chainboost, Solanium Ventures, Solar
                  Eco Fund, ZBS, Kernel Ventuires, Basics Capital, Titans Ventures, AU21, DWeb3 Capital, WaterDrip, FBG,
                  Everse Capital, Chain Capital, CryptoJ, Moonedge
                </span>
              </div>
            </div>

            <div class="project-detail-static transparent">
              <h3 class="project-category-title weight-semi">Tokenomics</h3>
              <img class="project-category-banner-img" :src="fertilizer.img.tokenomics" />
              <div>
                <span class="font-medium">
                  Tokenomics description *
                  <br /><br />
                  Team and Advisors - 20%
                  <br /><br />
                  Seed round - 15%
                  <br /><br />
                  Strategic round - 7.5%
                  <br /><br />
                  Public - 1.5%
                  <br /><br />
                  Marketing - 5%
                  <br /><br />
                  Liquidity - 10%
                  <br /><br />
                  Staking rewards - 25%
                  <br /><br />
                  Treasury - 16%
                </span>
              </div>
            </div>

            <div class="project-detail-static transparent">
              <h3 class="project-category-title weight-semi">Token Distribution</h3>
              <img class="project-category-banner-img" :src="fertilizer.img.distribution" />
              <div>
                <span class="font-medium">
                  Seed round - $0.02 (10M FDV), 5% TGE, 12 months cliff, 5%/ Daily over 12 months
                  <br /><br />
                  Strategic round - 0.04 (20m FDV), 10% TGE, 9 months cliff, 5%/ Daily over 9 months
                  <br /><br />
                  Public round - 0.0533 (26.7 FDV), 50% TGE, 3 months cliff / 25% / 3 months cliff/ 25%
                  <br /><br />
                  Team and Advisors - 2 years cliff , 3 years daily distribution
                  <br /><br />
                  Total supply - 500 000 000 UNQ tokens
                  <br /><br />
                  Initial Market cap - $700 000
                  <br /><br />
                  Hard cap - $3 400 000
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Row, Col, Statistic, Steps } from 'ant-design-vue'
import moment from 'moment'
const Countdown = Statistic.Countdown
const Step = Steps.Step
const TEST_TIME = 1643296360140

export default Vue.extend({
  components: {
    Row,
    Col,
    Countdown,
    Steps,
    Step
  },

  data() {
    return {
      TEST_TIME: 1643296360140,
      // 1643500800000
      fertilizer: {
        picture: '/fertilizer/banner/unq.png',
        logo: '/fertilizer/logo/unq.png',
        title: 'UNQ.club',
        short_desc: 'Social platform for NFT asset management',
        long_desc:
          'Whether a professional collector or aspiring enthusiast - UNQ is a place where you can take your game to the next level.',
        hard_cap: '3000K',
        pool_size: 5000,
        participants: 100418,
        website: 'UNQ.club',
        website_url: 'https://UNQ.club',
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        ido_info: {
          hard_cap: 140000,
          sale_rate: 0.028,
          sale_type: 'Vested',
          open_time: 1643500800000,
          close_time: 1643500800000
        },
        token_info: {
          symbol: 'UNQ',
          category: 'NFT',
          token_distribution: 1643500800000,
          blockchain: 'Solana'
        },
        img: {
          about: '/fertilizer/project/unq/about.png',
          features: '/fertilizer/project/unq/features.png',
          roadmap: '/fertilizer/project/unq/roadmap.png',
          team: '/fertilizer/project/unq/team.png',
          tokenomics: '/fertilizer/project/unq/tokenomics.png',
          distribution: '/fertilizer/project/unq/distribution.png'
        },
        whitelist_start_date: TEST_TIME + 60000 * 5,
        whitelist_end_date: TEST_TIME + 60000 * 10,
        // sales_start_date: TEST_TIME + 60000 * 15,
        // sales_end_date: TEST_TIME + 60000 * 20,
        sales_start_date: TEST_TIME,
        sales_end_date: TEST_TIME + 60000 * 60,
        distribution_start_date: TEST_TIME + 60000 * 25
      },
      projectStatus: {
        preparation: 'Preparation',
        whitelist: 'Whitelist Open',
        sales: 'Sales',
        open: 'Open Sales',
        distribution: 'Distribution'
      },
      currentStatus: {
        steps: 'process' as string,
        funded: false as boolean,
        win: true as boolean,
        subscribe: false as boolean,
        telegramTicket: 1 as number,
        twitterTicket: 1 as number
      },
      currentTimestamp: 0 as any,
      currentStep: 2 as number,
      currentTier: 0 as number,
      affiliatedLink: 'http://cropper.finance/unq?r=250' as string,
      subscribeShow: false as boolean,
      taskModalShow: false as boolean,
      taskModalType: 0 as number,
      twitterShow: false as boolean,
      KYCStatus: {
        step: 1 as number,
        verification: 1 as number,
        userVerified: false as boolean
      },
      KYCModalShow: false as boolean,
      timer: null as any
    }
  },

  head: {
    title: 'Fertilizer Project Details'
  },

  computed: {
    // ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  watch: {},

  mounted() {
    // this.$router.push({ path: `/swap/` })
    this.currentTimestamp = moment().valueOf()
    this.setTimer()

    const query = new URLSearchParams(window.location.search)
    if (query.get('tt')) this.TEST_TIME = (query.get('tt') as any) * 1

    this.fertilizer = {
      picture: '/fertilizer/banner/unq.png',
      logo: '/fertilizer/logo/unq.png',
      title: 'UNQ.club',
      short_desc: 'Social platform for NFT asset management',
      long_desc:
        'Whether a professional collector or aspiring enthusiast - UNQ is a place where you can take your game to the next level.',
      hard_cap: '3000K',
      pool_size: 5000,
      participants: 100418,
      website: 'UNQ.club',
      website_url: 'https://UNQ.club',
      mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      ido_info: {
        hard_cap: 140000,
        sale_rate: 0.028,
        sale_type: 'Vested',
        open_time: 1643500800000,
        close_time: 1643500800000
      },
      token_info: {
        symbol: 'UNQ',
        category: 'NFT',
        token_distribution: 1643500800000,
        blockchain: 'Solana'
      },
      img: {
        about: '/fertilizer/project/unq/about.png',
        features: '/fertilizer/project/unq/features.png',
        roadmap: '/fertilizer/project/unq/roadmap.png',
        team: '/fertilizer/project/unq/team.png',
        tokenomics: '/fertilizer/project/unq/tokenomics.png',
        distribution: '/fertilizer/project/unq/distribution.png'
      },
      whitelist_start_date: this.TEST_TIME + 60000 * 5,
      whitelist_end_date: this.TEST_TIME + 60000 * 10,
      // sales_start_date: this.TEST_TIME + 60000 * 15,
      // sales_end_date: this.TEST_TIME + 60000 * 20,
      sales_start_date: TEST_TIME,
      sales_end_date: TEST_TIME + 60000 * 60,
      distribution_start_date: this.TEST_TIME + 60000 * 25
    }
  },

  methods: {
    moment() {
      return moment()
    },
    checkCurrentStep() {
      // if (this.currentStep === 0 && this.currentTimestamp > this.fertilizer.whitelist_start_date) this.currentStep = 1
      // if (this.currentStep === 1 && this.currentTimestamp > this.fertilizer.whitelist_end_date) this.currentStep = 2
      // if (this.currentStep === 2 && this.currentTimestamp > this.fertilizer.distribution_start_date) this.currentStep = 3
    },
    setTimer() {
      this.timer = setInterval(async () => {
        this.currentTimestamp = moment().valueOf()
        this.checkCurrentStep()
      }, 1000)
    },
    copyToClipboard() {
      var textField = document.createElement('textarea')
      textField.innerText = this.affiliatedLink
      document.body.appendChild(textField)
      textField.select()
      document.execCommand('copy')
      textField.remove()
    },
    KYCConfirm() {
      if (this.KYCStatus.step === 1 || (this.KYCStatus.step === 2 && this.KYCStatus.verification === 0))
        this.KYCModalShow = true
      else if (this.KYCStatus.step === 2 && this.KYCStatus.verification === 2) {
        this.KYCStatus.step = 3
        this.KYCStatus.userVerified = true
      }
    }
  }
})
</script>

<style lang="less" scoped>
// global stylesheet
.btn-container {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 48px;
  padding: 3px;
  height: auto;
}

.btn-transparent {
  background: transparent;
  border-radius: 48px;
  border: none;
  height: auto;
  width: 100%;
  padding: 7.5px 0;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: @color-blue700;
  border-radius: 48px;
  border: none;
  height: auto;
  width: auto;
  padding: 4.5px 23.5px;
}

.project-status {
  padding: 4px 8px;
  border-radius: 6px;

  &.whitelist {
    background: @color-red600;
  }

  &.sales {
    background: @color-purple600;
  }

  &.open {
    background: @color-purple500;
  }

  &.distribution {
    background: @color-yellow600;
    color: @color-neutral900;
  }

  &.preparation {
    background: @color-pink600;
  }
}

.status-label {
  &.description {
    color: #fff;
  }

  &.success {
    color: @color-green500;
  }

  &.closed {
    color: @color-red500;
  }
}

.status-icon {
  height: 16px;
  width: 16px;
  margin-right: 8px;
}

.alert-icon {
  height: 24px;
  width: 24px;
  margin-right: 8px;
}

.coin-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 6px;
}

.info-icon {
  width: 12px;
  height: 12px;

  &.left {
    margin-left: 8px;
  }

  &.right {
    margin-right: 8px;
  }
}

.lock-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

.isDesktop {
  @media @max-lg-tablet {
    display: none;
  }
}

.isTablet {
  display: none;

  @media @max-lg-tablet {
    display: unset;
  }

  @media @max-sl-mobile {
    display: none;
  }
}

.isMobile {
  display: none;

  @media @max-sl-mobile {
    display: unset;
  }
}

// class stylesheet
.fertilizer-project.container {
  margin: 38px 0;

  @media @max-sl-mobile {
    margin: 28px 0;
  }

  .card {
    .card-body {
      padding: 0;

      .project-content {
        display: flex;

        @media @max-md-tablet {
          display: block;
        }

        .project-preview-container {
          position: fixed;
          width: 300px;

          @media @max-md-tablet {
            position: relative;
            width: 100%;
          }

          .project-back {
            margin-bottom: 28px;

            .back-to-list {
              opacity: 0.5;
              width: fit-content;

              .back-icon {
                margin-right: 8px;
              }

              .back-label {
                color: #fff;
              }
            }
          }

          .project-preview-ido-container {
            @media @max-md-tablet {
              display: flex;
              justify-content: space-between;
            }

            @media @max-sl-mobile {
              display: block;
            }

            .project-preview {
              background: @gradient-color04;
              border-radius: 8px;
              padding: 16px;
              margin-bottom: 16px;

              @media @max-md-tablet {
                width: 50%;
                margin-bottom: 0;
                margin-right: 8px;
              }

              @media @max-sl-mobile {
                width: 100%;
                margin-bottom: 16px;
                margin-right: 0;
              }

              .project-overview {
                .project-title {
                  .project-logo {
                    border-radius: 50%;
                    margin-right: 8px;
                  }
                }
              }

              .project-countdown {
                margin-top: 16px;
              }

              .project-progress {
                margin-top: 16px;
              }
            }

            .project-ido {
              background: linear-gradient(215.52deg, #273592 0.03%, #23adb4 99.97%);
              padding: 3px;
              border-radius: 8px;

              @media @max-md-tablet {
                width: 50%;
                margin-left: 8px;
              }

              @media @max-sl-mobile {
                width: 100%;
                margin-left: 0;
              }

              .project-ido-process {
                height: 100%;
                width: 100%;
                background: @color-blue800;
                border-radius: 8px;
                padding: 13px 21px;

                .label {
                  display: block;
                  margin-bottom: 18px;
                }
              }
            }
          }
        }

        .project-detail-container {
          width: calc(100% - 300px - 16px);
          margin-left: calc(300px + 16px);
          padding-top: 52px;

          @media @max-md-tablet {
            width: 100%;
            margin-left: 0;
            margin-top: 16px;
            padding-top: 0;
          }

          .project-detail-static {
            background: @color-blue700;
            border-radius: 8px;
            padding: 32px;

            @media @max-sl-mobile {
              padding: 24px;
            }

            .project-detail-card {
              display: flex;

              @media @max-lg-tablet {
                display: block;
              }

              .project-detail-desc {
                width: 40%;
                padding-right: 12px;

                @media @max-lg-tablet {
                  width: 100%;
                  padding-right: 0;
                }

                .project-title {
                  margin-bottom: 16px;

                  .project-logo {
                    margin-right: 8px;
                    border-radius: 50%;
                  }
                }

                .project-short-desc {
                  margin-bottom: 8px;
                }
              }

              .project-detail-info-group {
                width: 60%;
                padding-left: 12px;

                @media @max-lg-tablet {
                  width: 100%;
                  padding-left: 0;
                  margin-top: 24px;
                }

                .project-detail-info-item {
                  height: 90px;

                  .title {
                    color: rgba(255, 255, 255, 0.6);
                  }

                  .value {
                    .website {
                      color: #fff;
                      text-decoration: underline;
                      text-underline-position: under;
                    }
                  }
                }
              }
            }

            &.banner {
              padding: 0 32px;
              margin-bottom: 100px;

              @media @max-sl-mobile {
                padding: 0 24px;
              }

              .project-detail-stake {
                padding: 24px 0;

                .btn-container {
                  max-width: 150px;
                  width: 100%;
                  margin-top: 18px;
                }
              }

              .farmer-img {
                width: 28%;

                @media @max-lg-tablet {
                  width: 35%;
                }

                @media @max-sl-mobile {
                  display: none;
                }
              }
            }

            &.transparent {
              background: transparent;
              padding: 0;
              margin-bottom: 60px;

              .project-category-title {
                margin-bottom: 32px !important;
              }

              .project-category-content-about {
                display: flex;
                align-content: stretch;

                @media @max-sl-mobile {
                  display: block;
                }

                .banner-img {
                  width: 100%;
                  height: 100%;
                }
              }

              .project-category-banner-img {
                width: 100%;
                border-radius: 8px;
                margin-bottom: 40px;
              }

              .information {
                .information-item {
                  margin-top: 8px;
                  padding: 8px 0;
                  border-bottom: 1px solid @color-blue200;

                  .label {
                    color: rgba(255, 255, 255, 0.7);
                  }
                }
              }
            }
          }

          .project-detail-condition {
            margin: 32px 0;

            .project-detail-item {
              background: @color-blue700;
              border-radius: 8px;
              padding: 32px;

              @media @max-sl-mobile {
                padding: 24px;
              }

              .ticket-tasks-group {
                margin-top: 32px;

                @media @max-lg-tablet {
                  display: block !important;
                }

                .ticket-tasks {
                  width: 60%;
                  padding-right: 48px;

                  @media @max-lg-tablet {
                    width: 100%;
                    padding-right: 0;
                  }

                  .ticket-task-status-group {
                    margin: 24px 0;

                    @media @max-sl-mobile {
                      display: block !important;
                    }

                    .ticket-task-status-card {
                      background: @color-blue400;
                      width: calc((100% - 24px) / 2);
                      padding: 16px;
                      border-radius: 8px;

                      @media @max-sl-mobile {
                        width: 100%;

                        &:first-child {
                          margin-bottom: 24px;
                        }
                      }

                      &.active {
                        background: @color-green500;
                      }

                      .ticket-task-status {
                        .ticket-social-icon {
                          width: 24px;
                          opacity: 0.5;
                          margin-right: 24px;
                        }
                      }
                    }
                  }

                  .ticket-share-group {
                    margin: 8px 0 24px 0;
                    padding: 0 8px;
                    background: rgba(226, 227, 236, 0.1);
                    border-radius: 12px;

                    .ticket-share-link {
                      background: transparent;
                      outline: none;
                      border: none;
                      width: 100%;
                      padding: 10px;
                    }

                    .copy-icon {
                      margin: 0 10px;
                    }
                  }

                  .ticket-btn-group {
                    @media @max-sl-mobile {
                      display: block !important;
                    }

                    .share-btn {
                      width: calc((100% - 24px) / 2);

                      @media @max-sl-mobile {
                        width: 100%;

                        &:first-child {
                          margin-bottom: 24px;
                        }
                      }

                      .btn-primary {
                        width: 100%;
                        padding: 10px 0;
                      }
                    }
                  }
                }

                .ticket-preview {
                  width: 40%;
                  height: 100%;
                  background: @color-blue800;
                  border-radius: 8px;
                  padding: 16px;

                  @media @max-lg-tablet {
                    width: 100%;
                    margin-top: 24px;
                  }
                  .ticket-earned {
                    .ticket-earned-status {
                      background: @gradient-color03;
                      padding: 16px;
                      margin-top: 16px;
                      border-radius: 8px;

                      .referral-icon {
                        margin-right: 24px;
                      }
                    }
                  }
                }
              }

              .distribution-details {
                margin-top: 24px;

                .sale-details-group {
                  margin: 24px 0;

                  .sale-detail-card {
                    background: @color-blue500;
                    min-width: 132px;
                    border-radius: 8px;
                    padding: 16px;
                    margin-right: 24px;

                    &:last-child {
                      margin-right: 0;
                    }
                  }
                }

                .btn-container {
                  width: 212px;
                }
              }

              .project-detail-sales {
                .sales-start-countdown {
                  margin-top: 32px;
                }
              }

              .project-detail-open {
                display: table;
                margin: auto;

                .kyc-form {
                  .kyc-progress-container {
                    margin-bottom: 48px;

                    .kyc-step {
                      width: calc((100% - 16px) / 3);
                      margin-right: 8px;

                      &:last-child {
                        margin-right: 0;
                      }

                      .kyc-no {
                        display: block;
                        background: rgba(255, 255, 255, 0.4);
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        margin-bottom: 8px !important;
                        color: @color-blue700;
                      }

                      .kyc-title {
                        color: rgba(255, 255, 255, 0.4);
                      }

                      &.active {
                        .kyc-no {
                          background: @color-petrol500;
                        }

                        .kyc-title {
                          color: @color-petrol500;
                        }
                      }
                    }
                  }

                  .kyc-status-container {
                    margin-bottom: 16px;

                    .kyc-status {
                      padding: 4px 8px;
                      border-radius: 6px;

                      &.failed {
                        background: @color-red600;
                      }

                      &.progress {
                        background: @color-yellow600;
                      }

                      &.success {
                        background: @color-petrol500;
                      }
                    }
                  }

                  .kyc-description {
                    margin-bottom: 24px;

                    .kyc-status-icon {
                      margin-top: 24px !important;
                    }
                  }
                }

                .buy-form {
                  .token-amount {
                    background: rgba(226, 227, 236, 0.1);
                    border-radius: 12px;
                    padding: 10px;
                    margin: 16px 0 8px 0;

                    .token-amount-input {
                      width: calc(100% - 83px);

                      input {
                        border: none;
                        outline: none;
                        background: transparent;
                        width: 100%;

                        &::-webkit-inner-spin-button {
                          display: none;
                        }
                      }
                    }
                    .token-max-amount {
                      color: @color-blue100;
                    }
                  }

                  .receive-amount {
                    .receive-amount-output {
                      background: @color-blue800;
                      border-radius: 12px;
                      padding: 10px;
                      margin-top: 4px;

                      .receive-amount-value {
                        color: rgba(255, 255, 255, 0.5);
                      }
                    }
                  }

                  .receive-notification {
                    background: @color-blue800;
                    margin-top: 32px;
                    padding: 18px;
                    border-radius: 18px;
                  }

                  .btn-container {
                    margin-top: 24px;
                  }
                }

                .distribution-start-countdown {
                  margin-bottom: 32px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.fertilizer-project {
  // ant steps
  .ant-steps-vertical {
    .ant-steps-item-content {
      min-height: 45px;
    }

    .ant-steps-item-active,
    .ant-steps-item-finish {
      .ant-steps-item-tail::after,
      .ant-steps-item-icon {
        background-color: @color-petrol500 !important;
      }

      .ant-steps-item-title {
        color: @color-petrol500 !important;
      }
    }

    .ant-steps-item-error {
      .ant-steps-item-icon {
        background-color: red !important;
      }
    }

    .ant-steps-item {
      .ant-steps-item-container {
        .ant-steps-item-tail {
          &::after {
            background-color: rgba(255, 255, 255, 0.4);
          }
        }

        .ant-steps-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          background-color: rgba(255, 255, 255, 0.4);

          .ant-steps-icon {
            display: flex;
            top: 0;
            font-size: 13px;
            line-height: 19.5px;
            letter-spacing: 0.5px;
            font-weight: 600;
            color: @color-blue700;
          }
        }

        .ant-steps-item-title {
          width: 100%;
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
}
</style>