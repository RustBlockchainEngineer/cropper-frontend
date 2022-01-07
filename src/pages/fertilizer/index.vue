<template>
  <div class="fertilizer container">
    <div class="card">
      <div class="card-body">
        <div class="fertilizer-head fcb-container">
          <h3 class="title weightB">Fertilizer</h3>
          <div class="information">
            <div class="tvl-info">
              <p class="textL weightS">TVL : ${{ TVL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</p>
            </div>

            <div class="action-btn-group">
              <div class="reload-btn icon-cursor" :class="activeSpinning ? 'active' : ''" @click="reloadTimer">
                <img src="@/assets/icons/reload.svg" />
              </div>
            </div>
          </div>
        </div>

        <div class="fertilizer-option-bar fcb-container">
          <div class="option-tab-group">
            <div class="option-tab">
              <Button
                class="textL weightS icon-cursor"
                :class="filterProject === filterOptions.upcoming ? 'active-tab' : ''"
                @click="
                  () => {
                    this.filterProject = filterOptions.upcoming
                  }
                "
                >Upcoming</Button
              >
              <div v-if="filterProject === filterOptions.upcoming" class="active-underline"></div>
            </div>
            <div class="option-tab">
              <Button
                class="textL weightS icon-cursor"
                :class="filterProject === filterOptions.preparation ? 'active-tab' : ''"
                @click="
                  () => {
                    this.filterProject = filterOptions.preparation
                  }
                "
              >
                Preparation
              </Button>
              <div v-if="filterProject === filterOptions.preparation" class="active-underline"></div>
            </div>
            <div class="option-tab">
              <Button
                class="textL weightS icon-cursor"
                :class="filterProject === filterOptions.funded ? 'active-tab' : ''"
                @click="
                  () => {
                    this.filterProject = filterOptions.funded
                  }
                "
              >
                Funded
              </Button>
              <div v-if="filterProject === filterOptions.funded" class="active-underline"></div>
            </div>
          </div>

          <div
            class="option-tab-group option-tab-collapse icon-cursor"
            @click="
              () => {
                this.showTabMenu = !this.showTabMenu
              }
            "
          >
            <label class="textL weightS icon-cursor">
              {{
                filterProject === filterOptions.upcoming
                  ? filterOptions.upcoming
                  : filterProject === filterOptions.preparation
                  ? filterOptions.preparation
                  : filterProject === filterOptions.funded
                  ? filterOptions.funded
                  : ''
              }}
            </label>
            <img
              class="arrow-icon"
              :class="showTabMenu ? 'arrow-up' : 'arrow-down'"
              src="@/assets/icons/arrow-down-white.svg"
            />

            <div v-if="showTabMenu" class="option-sort-collapse collapse-left" v-click-outside="() => { this.showTabMenu = false }">
              <div
                class="collapse-item text-center textM weightS icon-cursor"
                :class="filterProject === filterOptions.upcoming ? 'active-item' : ''"
                @click="
                  () => {
                    this.filterProject = filterOptions.upcoming
                  }
                "
              >
                Upcoming
              </div>
              <div
                class="collapse-item text-center textM weightS icon-cursor"
                :class="filterProject === filterOptions.preparation ? 'active-item' : ''"
                @click="
                  () => {
                    this.filterProject = filterOptions.preparation
                  }
                "
              >
                Preparation
              </div>
              <div
                class="collapse-item text-center textM weightS icon-cursor"
                :class="filterProject === filterOptions.funded ? 'active-item' : ''"
                @click="
                  () => {
                    this.filterProject = filterOptions.funded
                  }
                "
              >
                Funded
              </div>
            </div>
          </div>

          <div class="option-filter-group">
            <div class="option-filter option-filter-fixed fcc-container icon-cursor">
              <img
                src="@/assets/icons/search.svg"
                @click="
                  () => {
                    this.showSearchMenu = !this.showSearchMenu
                  }
                "
              />
            </div>

            <div v-if="showSearchMenu" class="option-search-collapse" v-click-outside="() => { this.showSearchMenu = false }">
              <div class="collapse-item-header fcb-container">
                <label class="textL weightB">Search</label>
                <img
                  class="icon-cursor"
                  src="@/assets/icons/close-circle-icon.svg"
                  @click="
                    () => {
                      this.showSearchMenu = false
                    }
                  "
                />
              </div>
              <div class="collapse-item-body">
                <input ref="userInput" v-model="searchName" class="textM" placeholder="Search" />
              </div>
            </div>

            <div
              class="option-filter option-sort fcc-container icon-cursor"
              @click="
                () => {
                  this.showFilterMenu = !this.showFilterMenu
                }
              "
            >
              <span class="option-sort-item fcc-container bodyM weightS">
                <label>Sort by:</label>
                <span class="sort-detail">
                  {{
                    filterSort === filterOptions.all
                      ? filterOptions.all
                      : filterSort === filterOptions.whitelist
                      ? filterOptions.whitelist
                      : filterSort === filterOptions.sales
                      ? filterOptions.sales
                      : filterSort === filterOptions.distribution
                      ? filterOptions.distribution
                      : ''
                  }}
                  <img
                    class="arrow-icon"
                    :class="showFilterMenu ? 'arrow-up' : 'arrow-down'"
                    src="@/assets/icons/arrow-down-white.svg"
                  />
                </span>
              </span>
            </div>

            <div class="option-filter option-filter-collapse option-filter-fixed fcc-container icon-cursor">
              <img
                src="@/assets/icons/filter.svg"
                @click="
                  () => {
                    this.showFilterMenu = !this.showFilterMenu
                  }
                "
              />
            </div>

            <div v-if="showFilterMenu">
              <div v-if="filterProject != filterOptions.funded " class="option-sort-collapse collapse-right" v-click-outside="() => { this.showFilterMenu = false }">
                <div
                  class="collapse-item text-center texts weightB icon-cursor"
                  :class="filterSort === 'all' ? 'active-item' : ''"
                  @click="setFilterSort('all')"
                >
                  All
                </div>
                <div
                  class="collapse-item text-center texts weightB icon-cursor"
                  :class="filterSort === filterOptions.whitelist ? 'active-item' : ''"
                  @click="setFilterSort(filterOptions.whitelist)"
                >
                  Whitelist Open
                </div>
                <div
                  class="collapse-item text-center texts weightB icon-cursor"
                  :class="filterSort === filterOptions.sales ? 'active-item' : ''"
                  @click="setFilterSort(filterOptions.sales)"
                >
                  Sales
                </div>
                <div
                  class="collapse-item text-center texts weightB icon-cursor"
                  :class="filterSort === filterOptions.distribution ? 'active-item' : ''"
                  @click="setFilterSort(filterOptions.distribution)"
                >
                  Distribution
                </div>
              </div>
              <div v-else class="option-sort-collapse collapse-right" v-click-outside="() => { this.showFilterMenu = false }">
                <div
                  class="collapse-item text-center texts weightB icon-cursor"
                  :class="sortMethod === sortOptions.subscribers && !sortAsc? 'active-item' : ''"
                  @click="sortByColumnMenu(sortOptions.subscribers, false)"
                >
                  {{ sortOptions.subscribers }} (High > Low)
                </div>
                <div
                  class="collapse-item text-center texts weightB icon-cursor"
                  :class="sortMethod === sortOptions.subscribers && sortAsc? 'active-item' : ''"
                  @click="sortByColumnMenu(sortOptions.subscribers, true)"
                >
                  {{ sortOptions.subscribers }} (Low > High)
                </div>
                <div
                  class="collapse-item text-center texts weightB icon-cursor"
                  :class="sortMethod === sortOptions.total_raised && !sortAsc? 'active-item' : ''"
                  @click="sortByColumnMenu(sortOptions.total_raised, false)"
                >
                  {{ sortOptions.total_raised }} (High > Low)
                </div>
                <div
                  class="collapse-item text-center texts weightB icon-cursor"
                  :class="sortMethod === sortOptions.total_raised && sortAsc? 'active-item' : ''"
                  @click="sortByColumnMenu(sortOptions.total_raised, true)"
                >
                  {{ sortOptions.total_raised }} (Low > High)
                </div>
                <div
                  class="collapse-item text-center texts weightB icon-cursor"
                  :class="sortMethod === sortOptions.ath && !sortAsc? 'active-item' : ''"
                  @click="sortByColumnMenu(sortOptions.ath, false)"
                >
                  {{ sortOptions.ath }} (High > Low)
                </div>
                <div
                  class="collapse-item text-center texts weightB icon-cursor"
                  :class="sortMethod === sortOptions.ath && sortAsc? 'active-item' : ''"
                  @click="sortByColumnMenu(sortOptions.ath, true)"
                >
                  {{ sortOptions.ath }} (Low > High)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="fertilizer-content">
          <Row v-if="filterProject != filterOptions.funded" :gutter="[18, 28]">
            <Col
              v-for="(fertilizer, idx) in fertilizerItems"
              :key="fertilizer.id"
              :lg="idx === 0 ? 12 : 6"
              :md="idx === 0 ? 16 : 8"
              :sm="24"
            >
              <div class="fertilizer-project-table">
                <div class="project-banner">
                  <img class="banner" :src="fertilizer.picture" />
                  <div
                    class="project-status"
                    :class="
                      fertilizer.status === filterOptions.whitelist
                        ? 'whitelist'
                        : fertilizer.status === filterOptions.sales
                        ? 'sales'
                        : fertilizer.status === filterOptions.distribution
                        ? 'distribution'
                        : fertilizer.status === filterOptions.preparation
                        ? 'preparation'
                        : ''
                    "
                  >
                    <span class="bodyXS weightB">
                      {{
                        fertilizer.status === filterOptions.sales && currentTimestamp > fertilizer.sales_start_date
                          ? 'Open Sales'
                          : fertilizer.status
                      }}
                    </span>
                  </div>
                </div>

                <div class="project-details">
                  <div class="project-desc" :class="idx === 0 ? 'project-desc-whitelist ftb-container' : ''">
                    <div class="project-title">
                      <h4 class="weightB letterM">{{ fertilizer.title }}</h4>
                      <span class="short-desc textM weightS letterS">{{ fertilizer.short_desc }}</span>
                    </div>

                    <div class="project-info fcb-container">
                      <div class="project-balance">
                        <div v-if="fertilizer.hard_cap">
                          <span class="label textS weightS letterL">Total raised</span>
                          <span class="value textM weightS letterS fcl-container">
                            <CoinIcon class="coin-icon" :mint-address="fertilizer.mint" />
                            {{ fertilizer.hard_cap }} USDC
                          </span>
                        </div>
                      </div>
                      <div class="project-balance">
                        <div v-if="fertilizer.participants">
                          <span class="label textS weightS letterL">Participants</span>
                          <span class="value textM weightS letterS fcl-container">{{ fertilizer.participants }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="idx === 0" class="project-info whitelist-countdown fcc-container text-center">
                    <Countdown
                      :title="
                        fertilizer.status === filterOptions.whitelist ? 'End of the whitelist in' : 'Whitelist starts in'
                      "
                      :value="
                        fertilizer.status === filterOptions.whitelist
                          ? fertilizer.whitelist_end_date
                          : fertilizer.whitelist_start_date
                      "
                      format="DD:HH:mm:ss"
                    />
                  </div>

                  <div v-else class="project-info fcl-container">
                    <div
                      v-if="
                        fertilizer.sales_start_date ||
                        fertilizer.distribution_start_date ||
                        fertilizer.whitelist_start_date ||
                        fertilizer.whitelist_end_date
                      "
                    >
                      <div
                        v-if="
                          fertilizer.status === filterOptions.sales && currentTimestamp > fertilizer.sales_start_date
                        "
                        class="project-status open"
                      >
                        <span class="bodyXS weightB">Open Now</span>
                      </div>
                      <div v-else class="project-balance">
                        <span class="label textS weightS letterL">
                          {{
                            fertilizer.status === filterOptions.sales
                              ? filterOptions.sales
                              : fertilizer.status === filterOptions.distribution
                              ? filterOptions.distribution
                              : ''
                          }}
                          starts in:
                        </span>
                        <span class="value fcl-container">
                          <Countdown
                            :value="
                              fertilizer.status === filterOptions.sales
                                ? fertilizer.sales_start_date
                                : fertilizer.status === filterOptions.distribution
                                ? fertilizer.distribution_start_date
                                : 0
                            "
                            format="DD:HH:mm:ss"
                          />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="btn-container">
                    <Button
                      v-if="fertilizer.status === filterOptions.whitelist"
                      class="btn-transparent textM weightS fcc-container letterS"
                      >Subscription</Button
                    >
                    <Button v-else class="btn-transparent textM weightS fcc-container letterS">More details</Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <div v-else>
            <!-- desktop version -->
            <div class="fertilizer-funded-table isDesktop">
              <Row class="fertilizer-funded-table-header">
                <Col class="header-column textS weightB text-left" span="6"> Project name </Col>
                <Col class="header-column textS weightB" span="3">
                  <div class="header-column-title" @click="sortByColumn(sortOptions.subscribers)">
                    Subscribers
                    <img
                      v-if="sortMethod === sortOptions.subscribers"
                      src="@/assets/icons/arrow-down-green.svg"
                      class="arrow-icon"
                      :class="sortMethod === sortOptions.subscribers && sortAsc ? 'arrow-down' : 'arrow-up'"
                    />
                    <img
                      v-else
                      src="@/assets/icons/arrow-down-white.svg"
                      class="arrow-icon"
                      :class="sortMethod === sortOptions.subscribers && sortAsc ? 'arrow-down' : 'arrow-up'"
                    />
                  </div>
                </Col>
                <Col class="header-column textS weightB" span="4">
                  <div class="header-column-title" @click="sortByColumn(sortOptions.total_raised)">
                    Total raised
                    <img
                      v-if="sortMethod === sortOptions.total_raised"
                      src="@/assets/icons/arrow-down-green.svg"
                      class="arrow-icon"
                      :class="sortMethod === sortOptions.total_raised && sortAsc ? 'arrow-down' : 'arrow-up'"
                    />
                    <img
                      v-else
                      src="@/assets/icons/arrow-down-white.svg"
                      class="arrow-icon"
                      :class="sortMethod === sortOptions.total_raised && sortAsc ? 'arrow-down' : 'arrow-up'"
                    />
                  </div>
                </Col>
                <Col class="header-column textS weightB" span="3">
                  <div class="header-column-title" @click="sortByColumn(sortOptions.token_price)">
                    Token price
                    <img
                      v-if="sortMethod === sortOptions.token_price"
                      src="@/assets/icons/arrow-down-green.svg"
                      class="arrow-icon"
                      :class="sortMethod === sortOptions.token_price && sortAsc ? 'arrow-down' : 'arrow-up'"
                    />
                    <img
                      v-else
                      src="@/assets/icons/arrow-down-white.svg"
                      class="arrow-icon"
                      :class="sortMethod === sortOptions.token_price && sortAsc ? 'arrow-down' : 'arrow-up'"
                    />
                  </div>
                </Col>
                <Col class="header-column textS weightB" span="3">
                  <div class="header-column-title" @click="sortByColumn(sortOptions.ath)">
                    ATH Since IPO
                    <img
                      v-if="sortMethod === sortOptions.ath"
                      src="@/assets/icons/arrow-down-green.svg"
                      class="arrow-icon"
                      :class="sortMethod === sortOptions.ath && sortAsc ? 'arrow-down' : 'arrow-up'"
                    />
                    <img
                      v-else
                      src="@/assets/icons/arrow-down-white.svg"
                      class="arrow-icon"
                      :class="sortMethod === sortOptions.ath && sortAsc ? 'arrow-down' : 'arrow-up'"
                    />
                  </div>
                </Col>
                <Col class="header-column textS weightB" span="4">
                  <div class="header-column-title" @click="sortByColumn(sortOptions.end_date)">
                    Ended in UTC
                    <img
                      v-if="sortMethod === sortOptions.end_date"
                      src="@/assets/icons/arrow-down-green.svg"
                      class="arrow-icon"
                      :class="sortMethod === sortOptions.end_date && sortAsc ? 'arrow-down' : 'arrow-up'"
                    />
                    <img
                      v-else
                      src="@/assets/icons/arrow-down-white.svg"
                      class="arrow-icon"
                      :class="sortMethod === sortOptions.end_date && sortAsc ? 'arrow-down' : 'arrow-up'"
                    />
                  </div>
                </Col>
              </Row>

              <div class="fertilizer-funded-table-body">
                <Row
                  class="fertilizer-funded-table-item"
                  v-for="(fertilizer, idx) in fertilizerItems"
                  :key="fertilizer.id"
                >
                  <Col class="state" span="6">
                    <div class="project-name fcl-container">
                      <img class="logo" :src="fertilizer.picture" />
                      <div class="title">
                        <span class="textM weightS">{{ fertilizer.title }}</span>
                        <span class="short-desc bodXS weightS">{{ fertilizer.short_desc }}</span>
                      </div>
                    </div>
                  </Col>

                  <Col class="state textM weightS" span="3">
                    {{ fertilizer.subscribers }}
                  </Col>

                  <Col class="state textM weightS" span="4">
                    ${{ new TokenAmount(fertilizer.hard_cap, 2, false).format() }}
                  </Col>
                  <Col class="state textM weightS" span="3">
                    ${{ new TokenAmount(fertilizer.token_price, 3, false).format() }}
                  </Col>
                  <Col class="state textM weightS" span="3">
                    <div class="project-ath fcc-container">
                      <Tooltip placement="bottomLeft">
                        <template slot="title">
                          <span class="textS weightS">If you invested 100$ you would have 1000$</span>
                        </template>
                        <div class="info-icon">
                          <img src="@/assets/icons/info.svg" />
                        </div>
                      </Tooltip>
                      <span class="value textM weightS letterS">+{{ fertilizer.ath }}%</span>
                    </div>
                  </Col>
                  <Col class="state textM weightS" span="4">
                    {{ moment(fertilizer.distribution_end_date).format('MMMM Do YYYY') }}
                  </Col>
                  <Col class="state" span="1">
                    <div class="show-more">
                      <img class="icon-cursor" src="@/assets/icons/dot3.svg" @click="showMore(idx)" />
                      <div
                        v-if="showMoreMenu[idx]"
                        class="option-sort-collapse collapse-right"
                        v-click-outside="hideMore"
                      >
                        <div class="collapse-item text-center textM weightS icon-cursor">
                          <a> Stake </a>
                        </div>
                        <div class="collapse-item text-center textM weightS icon-cursor">
                          <a> Swap </a>
                        </div>
                        <div class="collapse-item text-center textM weightS icon-cursor">
                          <a class="social-link fcc-container" href="#" target="_blank">
                            Share
                            <img class="social-icon" src="@/assets/icons/share.svg" />
                          </a>
                        </div>
                        <div class="collapse-item text-center textM weightS icon-cursor">
                          <a class="social-link fcc-container" href="#" target="_blank">
                            Twitter
                            <img class="social-icon" src="@/assets/icons/twitter.svg" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <!-- tablet version -->
            <div class="fertilizer-funded-table isTablet">
              <Collapse v-model="showCollapse" accordion>
                <CollapsePanel
                  v-for="fertilizer in fertilizerItems"
                  :key="fertilizer.id"
                  v-show="true"
                  :show-arrow="true"
                >
                  <Row slot="header" class="collapse-header">
                    <Col class="state" span="8">
                      <div class="project-name fcl-container">
                        <img class="logo" :src="fertilizer.picture" />
                        <div class="title">
                          <span class="textM weightS">{{ fertilizer.title }}</span>
                          <span class="short-desc bodXS weightS">{{ fertilizer.short_desc }}</span>
                        </div>
                      </div>
                    </Col>

                    <Col class="state text-center" span="5">
                      <span class="label textS weightB">Subscribers</span>
                      <span class="textM weightS">{{ fertilizer.subscribers }}</span>
                    </Col>

                    <Col class="state textM weightS text-center" span="5">
                      <span class="label textS weightB">Total raised</span>
                      ${{ new TokenAmount(fertilizer.hard_cap, 2, false).format() }}
                    </Col>

                    <Col class="state textM weightS text-center" span="5">
                      <span class="label textS weightB">Token price</span>
                      ${{ new TokenAmount(fertilizer.token_price, 3, false).format() }}
                    </Col>

                    <Button class="detail-btn textS weightS">
                      <img
                        class="arrow-icon"
                        :class="fertilizer.id != showCollapse ? 'arrow-up' : 'arrow-down'"
                        src="@/assets/icons/arrow-down-white.svg"
                      />
                    </Button>
                  </Row>

                  <Row class="collapse-row" :gutter="[18, 18]">
                    <Col :span="12">
                      <div class="ftb-container">
                        <div class="state">
                          <span class="label textS weightB">ATH Since IPO</span>
                          <div class="project-ath fcc-container">
                            <Tooltip placement="bottomLeft">
                              <template slot="title">
                                <span class="textS weightS">If you invested 100$ you would have 1000$</span>
                              </template>
                              <div class="info-icon">
                                <img src="@/assets/icons/info.svg" />
                              </div>
                            </Tooltip>
                            <span class="value textM weightS letterS">+{{ fertilizer.ath }}%</span>
                          </div>
                        </div>

                        <div class="state text-center" span="5">
                          <span class="label textS weightB">Ended in UTC</span>
                          <span class="textM weightS">{{ moment(fertilizer.distribution_end_date).format('MMMM Do YYYY') }}</span>
                        </div>
                      </div> 
                    </Col>
                    
                    <Col class="btn-group" :span="12">
                      <div class="fcr-container">
                        <div class="btn-container">
                          <Button class="btn-primary textS weightB">
                            Stake
                          </Button>
                        </div>

                        <div class="btn-container">
                          <Button class="btn-primary textS weightB">
                            Swap
                          </Button>
                        </div>
                      </div>
                    </Col>

                    <Col class="btn-group" :span="24">
                      <div class="fcc-container">
                        <a
                          class="social-link fcc-container bodyXS weightS icon-cursor"
                          href="#"
                          target="_blank"
                        >
                          Share
                          <img class="social-icon" src="@/assets/icons/share.svg" />
                        </a>
                        <a
                          class="social-link fcc-container bodyXS weightS icon-cursor"
                          href="#"
                          target="_blank"
                        >
                          Twitter
                          <img class="social-icon" src="@/assets/icons/twitter.svg" />
                        </a>
                      </div>
                    </Col>
                  </Row>
                </CollapsePanel>
              </Collapse>
            </div>

            <!-- mobile version -->
            <div class="fertilizer-funded-table isMobile">
              <Collapse v-model="showCollapse" accordion>
                <CollapsePanel
                  v-for="fertilizer in fertilizerItems"
                  :key="fertilizer.id"
                  v-show="true"
                  :show-arrow="true"
                >
                  <Row slot="header" class="collapse-header">
                    <Col class="state" span="23">
                      <div class="project-name fcl-container">
                        <img class="logo" :src="fertilizer.picture" />
                        <div class="title">
                          <span class="textM weightS">{{ fertilizer.title }}</span>
                          <span class="short-desc bodXS weightS">{{ fertilizer.short_desc }}</span>
                        </div>
                      </div>
                    </Col>

                    <Button class="detail-btn textS weightS">
                      <img
                        class="arrow-icon"
                        :class="fertilizer.id != showCollapse ? 'arrow-up' : 'arrow-down'"
                        src="@/assets/icons/arrow-down-white.svg"
                      />
                    </Button>
                  </Row>

                  <Row class="collapse-row" :gutter="[18, 18]">
                    <Col :span="24">
                      <div class="fcb-container">
                        <div class="state">
                          <span class="label textS weightB">Total raised</span>
                          <span class="textM weightS">${{ new TokenAmount(fertilizer.hard_cap, 2, false).format() }}</span>
                        </div>

                        <div class="state">
                          <span class="label textS weightB">Subscribers</span>
                          <span class="textM weightS">{{ fertilizer.subscribers }}</span>
                        </div>
                      </div> 
                    </Col>

                    <Col :span="24">
                      <div class="fcb-container">
                        <div class="state">
                          <span class="label textS weightB">Token price</span>
                          <span class="textM weightS letterS">${{ new TokenAmount(fertilizer.token_price, 3, false).format() }}</span>
                        </div>

                        <div class="state">
                          <span class="label textS weightB">ATH Since IPO</span>
                          <div class="project-ath fcc-container">
                            <Tooltip placement="bottomLeft">
                              <template slot="title">
                                <span class="textS weightS">If you invested 100$ you would have 1000$</span>
                              </template>
                              <div class="info-icon">
                                <img src="@/assets/icons/info.svg" />
                              </div>
                            </Tooltip>
                            <span class="value textM weightS letterS">+{{ fertilizer.ath }}%</span>
                          </div>
                        </div>
                      </div> 
                    </Col>

                    <Col :span="24">
                      <div class="fcb-container">
                        <div class="state" span="5">
                          <span class="label textS weightB">Ended in UTC</span>
                          <span class="textM weightS">{{ moment(fertilizer.distribution_end_date).format('MMMM Do YYYY') }}</span>
                        </div>
                      </div> 
                    </Col>

                    <Col class="btn-group" :span="24">
                      <div class="btn-group-item fcc-container">
                        <div class="btn-container">
                          <Button class="btn-primary textS weightB">
                            Stake
                          </Button>
                        </div>

                        <div class="btn-container">
                          <Button class="btn-primary textS weightB">
                            Swap
                          </Button>
                        </div>
                      </div>

                      <div class="btn-group-item fcc-container">
                        <a
                          class="social-link fcc-container bodyXS weightS icon-cursor"
                          href="#"
                          target="_blank"
                        >
                          Share
                          <img class="social-icon" src="@/assets/icons/share.svg" />
                        </a>
                        <a
                          class="social-link fcc-container bodyXS weightS icon-cursor"
                          href="#"
                          target="_blank"
                        >
                          Twitter
                          <img class="social-icon" src="@/assets/icons/twitter.svg" />
                        </a>
                      </div>
                    </Col>    
                  </Row>
                </CollapsePanel>
              </Collapse>
            </div>
          </div>
        </div>

        <!-- <div v-if="initialized"></div>

        <div v-else class="fcc-container">
          <Spin :spinning="true">
            <Icon slot="indicator" type="loading" style="font-size: 24px" spin />
          </Spin>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import importIcon from '@/utils/import-icon'
import { Collapse, Row, Col, Pagination, Button, Statistic, Tooltip } from 'ant-design-vue'
import { get, cloneDeep } from 'lodash-es'
import { TokenAmount } from '@/utils/safe-math'
import { getUnixTs } from '@/utils'
import moment from 'moment'
import { TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import { TOKENS, NATIVE_SOL } from '@/utils/tokens'
const Vco = require('v-click-outside')
Vue.use(Vco)
const CollapsePanel = Collapse.Panel
const Countdown = Statistic.Countdown

export default Vue.extend({
  components: {
    // Spin,
    // Icon,
    Row,
    Col,
    Button,
    Countdown,
    Tooltip,
    Collapse,
    CollapsePanel
  },
  data() {
    return {
      searchName: '',
      coinPicUrl: '',
      initialized: false as boolean,
      labelizedAmms: {} as any,
      currentPage: 1,
      coinName: '',
      mintAddress: '',
      poolLoaded: false,
      autoRefreshTime: 60 as number,
      countdown: 0,
      showCollapse: 0 as any,
      timer: null as any,
      loading: false as boolean,
      nbFarmsLoaded: 0 as number,
      poolType: true as boolean,
      TVL: 0,
      activeSpinning: false as boolean,
      showTabMenu: false as boolean,
      showSearchMenu: false as boolean,
      showFilterMenu: false as boolean,
      showMoreMenu: [] as boolean[],
      currentShowMore: -1 as number,
      sortOptions: {
        subscribers: 'Subscribers',
        total_raised: 'Total raised',
        token_price: 'Token price',
        ath: 'ATH Since IPO',
        end_date: 'Ended in UTC'
      },
      sortMethod: 'Subscribers' as string,
      sortAsc: false as boolean,
      filterOptions: {
        all: 'All',
        whitelist: 'Whitelist Open',
        sales: 'Sales',
        distribution: 'Distribution',
        upcoming: 'Upcoming',
        preparation: 'Preparation',
        funded: 'Funded'
      },
      filterProject: 'Upcoming' as string,
      filterSort: 'all' as string,
      fertilizerItems: [] as any[],
      fertilizerData: [
        {
          id: 0,
          status: 'Whitelist Open',
          picture: '/fertilizer/unq.png',
          title: 'UNQ.club',
          short_desc: 'Social platform for NFT asset management',
          hard_cap: '3000K',
          participants: 100418,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          whitelist_end_date: 1643500800000
        },
        {
          id: 1,
          status: 'Sales',
          picture: '/fertilizer/metaprints.png',
          title: 'Metaprints',
          short_desc: 'Blueprints for metaverses',
          hard_cap: '3000K',
          participants: 100418,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          sales_start_date: 1641280215000
        },
        {
          id: 2,
          status: 'Sales',
          picture: '/fertilizer/galaxy.png',
          title: 'Galaxy War',
          short_desc: 'Our galatic adventure awaits',
          hard_cap: '3000K',
          participants: 100418,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          sales_start_date: 1643500800000
        },
        {
          id: 3,
          status: 'Distribution',
          picture: '/fertilizer/meanfi.png',
          title: 'MeanFI',
          short_desc: 'Grow your money stash with the best prices across DeFi',
          hard_cap: '3000K',
          participants: 100418,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          distribution_start_date: 1643500800000
        },
        {
          id: 4,
          status: 'Preparation',
          picture: '/fertilizer/agoric.png',
          title: 'Agoric',
          short_desc: 'Social platform for NFT asset management',
          hard_cap: '3000K',
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          whitelist_start_date: 1643500800000
        },
        {
          id: 5,
          status: 'Preparation',
          picture: '/fertilizer/metaprints.png',
          title: 'Metaprints',
          short_desc: 'Blueprints for metaverses',
          hard_cap: '3000K',
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        },
        {
          id: 6,
          status: 'Funded',
          picture: '/fertilizer/funded/defiland.png',
          title: 'DeFi Land',
          short_desc: 'Gamified Decentralized Finance',
          subscribers: 1000,
          hard_cap: 250000,
          token_price: 0.068,
          ath: 526.7,
          distribution_end_date: 1643500800000
        },
        {
          id: 7,
          status: 'Funded',
          picture: '/fertilizer/funded/sonar.png',
          title: 'Sonar Watch',
          short_desc: 'Empowering user journey on Solana DeFi',
          subscribers: 1001,
          hard_cap: 249999,
          token_price: 0.069,
          ath: 526.6,
          distribution_end_date: 1643500800000
        },
        {
          id: 8,
          status: 'Funded',
          picture: '/fertilizer/funded/goosefx.png',
          title: 'GooseFX',
          short_desc: 'A Complete DeFi Experience',
          subscribers: 1002,
          hard_cap: 249998,
          token_price: 0.07,
          ath: 526.5,
          distribution_end_date: 1643500800000
        },
        {
          id: 9,
          status: 'Funded',
          picture: '/fertilizer/funded/waggle.png',
          title: 'Waggle Network',
          short_desc: 'Primary markets for everyone',
          subscribers: 1003,
          hard_cap: 249997,
          token_price: 0.071,
          ath: 526.4,
          distribution_end_date: 1643500800000
        },
        {
          id: 10,
          status: 'Funded',
          picture: '/fertilizer/funded/cryowar.png',
          title: 'Cryowar',
          short_desc: 'Next-gen blockchain multiplayer game',
          subscribers: 1004,
          hard_cap: 249996,
          token_price: 0.071,
          ath: 526.3,
          distribution_end_date: 1643500800000
        },
        {
          id: 11,
          status: 'Funded',
          picture: '/fertilizer/funded/cyclos.png',
          title: 'Cyclos',
          short_desc: 'Decentralized trading unleashed',
          subscribers: 1005,
          hard_cap: 249995,
          token_price: 0.073,
          ath: 526.2,
          distribution_end_date: 1643500800000
        }
      ],
      currentTimestamp: 0
    }
  },
  head: {
    title: 'CropperFinance'
  },
  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },
  async mounted() {
    this.getTvl()
    this.$accessor.token.loadTokens()
    await this.updateLabelizedAmms()

    let timer = setInterval(async () => {
      if (this.nbFarmsLoaded == Object.keys(this.labelizedAmms).length) {
        this.initialized = true
      }
    }, 1000)

    this.timer = setInterval(async () => {
      clearInterval(this.timer)
      this.setTimer()
    }, 1000)

    this.currentTimestamp = moment().valueOf()
    this.updateFertilizer()
  },
  watch: {
    showCollapse: {
      handler() {
        if (!this.poolType && this.showCollapse.length > 0) {
          this.showCollapse.splice(0, this.showCollapse.length)
        }
      },
      deep: true
    },
    filterProject: {
      handler(newFilterProject: string) {
        this.filterFertilizer(newFilterProject)
      },
      deep: true
    }
  },
  methods: {
    importIcon,
    TokenAmount,
    async getTvl() {
      let cur_date = new Date().getTime()
      if (window.localStorage.TVL_last_updated) {
        const last_updated = parseInt(window.localStorage.TVL_last_updated)
        if (cur_date - last_updated <= 600000) {
          this.TVL = window.localStorage.TVL
          return
        }
      }

      let responseData: any = []
      let tvl = 0
      try {
        responseData = await fetch('https://api.cropper.finance/cmc/').then((res) => res.json())

        Object.keys(responseData).forEach(function (key) {
          if ((responseData as any)[key as any].tvl * 1 < 2000000) {
            tvl = tvl * 1 + (responseData as any)[key as any].tvl * 1
          }
        })
      } catch {
        // dummy data
      } finally {
      }

      try {
        responseData = await fetch('https://api.cropper.finance/staking/').then((res) => res.json())
        tvl = tvl * 1 + (responseData as any).value * 1
      } catch {
        // dummy data
      } finally {
      }

      this.TVL = Math.round(tvl)

      window.localStorage.TVL_last_updated = new Date().getTime()
      window.localStorage.TVL = this.TVL
    },
    async flush() {
      await this.updateLabelizedAmms()
      clearInterval(this.timer)
      this.poolLoaded = true
      this.countdown = 0
      this.setTimer()
    },
    async updateLabelizedAmms() {
      this.labelizedAmms = {}
      let responseData2 = {}
      let responseData
      try {
        responseData = await fetch('https://api.cropper.finance/farms/').then((res) => res.json())
      } catch {
        // dummy data
        responseData = [
          { ammID: 'ADjGcPYAu5VZWdKwhqU3cLCgX733tEaGTYaXS2TsB2hF', labelized: true },
          { ammID: '8j7uY3UiVkJprJnczC7x5c1S6kPYQnpxVUiPD7NBnKAo', labelized: true }
        ]
      } finally {
        responseData.forEach(async (element: any) => {
          if (element.pfo == true) {
            element.calculateNextStep = 'Bla bla bla'

            this.labelizedAmms[element.slug] = element
            try {
              responseData2 = await fetch(
                'https://api.cropper.finance/pfo/?farmId=' +
                  this.labelizedAmms[element.slug].pfarmID +
                  '&t=' +
                  Math.round(moment().unix() / 60000)
              ).then((res) => res.json())
            } catch {
            } finally {
              this.labelizedAmms[element.slug]['followers'] = Object.keys(responseData2).length
              this.nbFarmsLoaded++
            }
          }
        })
      }
    },
    async delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    setTimer() {
      this.timer = setInterval(async () => {
        if (!this.loading) {
          if (this.countdown < this.autoRefreshTime) {
            this.countdown += 1
            if (this.countdown === this.autoRefreshTime) {
              await this.flush()
            }
          }
        }
      }, 1000)
    },
    reloadTimer() {
      this.flush()
      this.$accessor.wallet.getTokenAccounts()
      this.activeSpinning = true
      setTimeout(() => {
        this.activeSpinning = false
      }, 1000)
    },
    updateFertilizer() {
      this.filterFertilizer(this.filterProject)
    },
    filterFertilizer(filterProject: string) {
      // filter with tabs
      if (filterProject === this.filterOptions.upcoming) {
        this.fertilizerItems = this.fertilizerData.filter(
          (fertilizer: any) =>
            fertilizer.status != this.filterOptions.preparation && fertilizer.status != this.filterOptions.funded
        )
      } else if (filterProject === this.filterOptions.preparation) {
        this.fertilizerItems = this.fertilizerData.filter(
          (fertilizer: any) => fertilizer.status === this.filterOptions.preparation
        )
      } else {
        this.fertilizerItems = this.fertilizerData.filter(
          (fertilizer: any) => fertilizer.status === this.filterOptions.funded
        )
      }

      // sort by column
      if (this.sortAsc) {
        if (this.sortMethod == this.sortOptions.subscribers) {
          this.fertilizerItems = this.fertilizerItems.sort((a: any, b: any) => b.subscribers - a.subscribers)
        } else if (this.sortMethod == this.sortOptions.total_raised) {
          this.fertilizerItems = this.fertilizerItems.sort((a: any, b: any) => b.hard_cap - a.hard_cap)
        } else if (this.sortMethod == this.sortOptions.token_price) {
          this.fertilizerItems = this.fertilizerItems.sort((a: any, b: any) => b.token_price - a.token_price)
        } else if (this.sortMethod == this.sortOptions.ath) {
          this.fertilizerItems = this.fertilizerItems.sort((a: any, b: any) => b.ath - a.ath)
        } else if (this.sortMethod == this.sortOptions.end_date) {
          this.fertilizerItems = this.fertilizerItems.sort((a: any, b: any) => b.distribution_end_date - a.distribution_end_date)
        }
      } else {
        if (this.sortMethod == this.sortOptions.subscribers) {
          this.fertilizerItems = this.fertilizerItems.sort((a: any, b: any) => a.subscribers - b.subscribers)
        } else if (this.sortMethod == this.sortOptions.total_raised) {
          this.fertilizerItems = this.fertilizerItems.sort((a: any, b: any) => a.hard_cap - b.hard_cap)
        } else if (this.sortMethod == this.sortOptions.token_price) {
          this.fertilizerItems = this.fertilizerItems.sort((a: any, b: any) => a.token_price - b.token_price)
        } else if (this.sortMethod == this.sortOptions.ath) {
          this.fertilizerItems = this.fertilizerItems.sort((a: any, b: any) => a.ath - b.ath)
        } else if (this.sortMethod == this.sortOptions.end_date) {
          this.fertilizerItems = this.fertilizerItems.sort((a: any, b: any) => a.distribution_end_date - b.distribution_end_date)
        }
      }

      this.showMoreMenu = []
      this.fertilizerItems.forEach((element) => {
        this.showMoreMenu.push(false)
      })
    },
    moment() {
      return moment()
    },
    getCoinPicUrl() {
      let token
      if (this.mintAddress == NATIVE_SOL.mintAddress) {
        token = NATIVE_SOL
      } else {
        token = Object.values(TOKENS).find((item) => item.mintAddress === this.mintAddress)
      }
      if (token) {
        this.coinName = token.symbol.toLowerCase()
        if (token.picUrl) {
          this.coinPicUrl = token.picUrl
        } else {
          this.coinPicUrl = ''
        }
      }
    },
    goToProject(farm: any) {
      this.$router.push({
        path: '/fertilizer/project/?f=' + farm.slug
      })
    },
    setFilterSort(option: string) {
      this.filterSort = option
      this.showFilterMenu = false
    },
    sortByColumn(option: string) {
      if (this.sortMethod === option) this.sortAsc = !this.sortAsc
      this.sortMethod = option
      this.filterFertilizer(this.filterProject)
    },
    sortByColumnMenu(option: string, asc: boolean) {
      this.sortMethod = option
      this.sortAsc = asc
      this.filterFertilizer(this.filterProject)
    },
    showMore(idx: number) {
      if (idx != this.currentShowMore) {
        this.showMoreMenu = this.showMoreMenu.map((item) => {
          return false
        })
      }
      this.showMoreMenu = this.showMoreMenu.map((item, i) => {
        if (i === idx) {
          this.currentShowMore = idx
          return !item
        }
        return item
      })
      console.log(this.showMoreMenu)
    },
    hideMore() {
      if (this.currentShowMore != -1) {
        this.showMoreMenu = this.showMoreMenu.map((item) => {
          return false
        })
        this.currentShowMore = -1
      }
    }
  }
})
</script>

<style lang="less" scoped>
// global stylesheet
.btn-container {
  background: @gradient-btn-primary;
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
}

.btn-primary {
  background: @color-blue700;
  border-radius: 48px;
  border: none;
  height: auto;
  width: auto;
  padding: 4.5px 23.5px;
}

.option-sort-collapse {
  position: absolute;
  top: 50px;
  background: @gradient-color-primary;
  background-origin: border-box;
  border: 2px solid rgba(255, 255, 255, 0.14);
  box-shadow: 18px 11px 14px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  min-width: 188px;
  z-index: 999;

  &.collapse-left {
    left: 0;
  }

  &.collapse-right {
    right: 0;
  }

  .collapse-item {
    padding: 18px 0;
    border-bottom: 1px solid #c4c4c420;

    &:last-child {
      border-bottom: 0;
    }

    &.active-item {
      color: @color-petrol500;
    }

    a {
      color: #fff;
    }
  }
}

.project-status {
  padding: 4px 8px;
  border-radius: 6px;

  &.whitelist {
    background: @color-red600;
  }

  &.sales {
    background: @color-purple500;
  }

  &.distribution {
    background: @color-yellow600;
    color: @color-neutral900;
  }

  &.preparation {
    background: @color-pink600;
  }

  &.open {
    background: @color-green500;
  }
}

.project-name {
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 18px;
  }

  .title {
    text-align: left;

    .short-desc {
      display: block;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.project-ath {
  .value {
    background: @color-petrol400;
    color: @color-blue800;
    padding: 4px 8px;
    border-radius: 4px;
  }
}

.info-icon {
  img {
    width: 12px;
    height: 12px;
    margin-right: 8px;
  }
}

.arrow-icon {
  transition: all 0.3s;

  &.arrow-up {
    transform: rotate(180deg);
  }
}

.social-link {
  color: #fff;

  .social-icon {
    width: 18px;
    height: 18px;
    margin-left: 8px;
  }
}

.detail-btn {
  position: absolute;
  right: 0;
  background: none;
  border: none;
  display: flex;
  align-items: center;
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
.fertilizer.container {
  margin: 38px 0;

  @media @max-sl-mobile {
    margin: 28px 0;
  }

  .card {
    .card-body {
      padding: 0;

      .fertilizer-head {
        @media @max-sl-mobile {
          display: block !important;
        }

        .title {
          text-align: center;
          position: relative;
          float: left;

          @media @max-sl-mobile {
            margin-bottom: 18px !important;
          }
        }

        .information {
          display: flex;
          align-items: center;
          justify-content: space-between;

          @media @max-sl-mobile {
            width: 100%;
          }

          .tvl-info {
            margin-right: 18px;
          }

          .action-btn-group {
            display: flex;
            align-items: center;

            .reload-btn {
              background: @color-blue600;
              border-radius: 8px;
              padding: 6px;
              display: flex;
              align-items: center;
              justify-content: center;

              @media @max-lg-tablet {
                margin-left: 5px;
              }

              img {
                width: 18px;
                height: 18px;
              }

              &.active img {
                transform: rotate(360deg);
                transition: all 1s ease-in-out;
              }
            }
          }
        }
      }

      .fertilizer-option-bar {
        margin: 38px 0;

        @media @max-sl-mobile {
          margin: 28px 0;
        }

        .option-tab-group {
          display: flex;

          @media @max-sl-mobile {
            display: none;
          }

          &.option-tab-collapse {
            display: none;

            @media @max-sl-mobile {
              position: relative;
              display: flex;
              align-items: center;
              padding: 6px 10px;
              border: 2px solid @color-blue500;
              border-radius: 8px;

              label {
                color: @color-petrol500;
              }

              .arrow-icon {
                margin-left: 4px;
              }
            }
          }

          .option-tab {
            margin-right: 38px;

            &:last-child {
              margin-right: 0;
            }

            button {
              background: transparent;
              border: none;
              outline: none;
              padding: 0;
              margin-bottom: 8px;

              &.active-tab {
                color: @color-petrol500;
              }

              .deposit-icon {
                margin-right: 8px;
              }
            }

            .active-underline {
              height: 4px;
              border-radius: 10px;
              background: @color-petrol400;
            }
          }
        }

        .option-filter-group {
          position: relative;
          display: flex;
          align-items: center;

          .option-filter {
            border: 2px solid @color-blue500;
            border-radius: 8px;
            padding: 0 8px;
            height: 40px;
            margin-left: 18px;

            @media @max-sl-mobile {
              height: 32px;
              padding: 0 4px;
            }

            &:first-child {
              margin-left: 0;
            }

            &.option-filter-fixed {
              width: 40px;

              @media @max-sl-mobile {
                width: 32px;
              }
            }

            &.option-filter-collapse {
              display: none !important;

              @media @max-md-tablet {
                display: flex !important;
              }
            }

            &.option-sort {
              @media @max-md-tablet {
                display: none !important;
              }
            }

            .option-sort-item {
              letter-spacing: 0.15px;

              label {
                color: #eae8f1;
                opacity: 0.5;
                margin-right: 8px;
              }

              .sort-detail {
                display: flex;
                align-items: center;

                .arrow-icon {
                  margin-left: 8px;
                }
              }
            }
          }

          .option-search-collapse {
            position: absolute;
            top: 0;
            left: -209px;
            transition: visibility 0s, opacity 0.5s linear;
            background: @color-blue700;
            border: 2px solid @color-blue500;
            border-radius: 8px;
            padding: 18px;
            z-index: 999;
            width: 250px;

            .collapse-item-header {
              margin-bottom: 10px;
            }

            .collapse-item-body {
              input {
                border: 2px solid @color-blue400;
                border-radius: 8px;
                padding: 8px 18px;
                background-color: transparent;
                color: #ccd1f1;
                width: 100%;

                &:active,
                &:focus,
                &:hover {
                  outline: 0;
                }

                &::placeholder {
                  color: #ccd1f1;
                }
              }
            }
          }
        }
      }

      .fertilizer-content {
        .fertilizer-project-table {
          background: @color-blue700;
          border: 3px solid @color-blue500;
          border-radius: 18px;

          .project-banner {
            position: relative;
            border-bottom: 3px solid @color-blue500;
            height: 190px;

            .banner {
              width: 100%;
              height: 100%;
              border-radius: 18px 18px 0 0;
            }

            .project-status {
              position: absolute;
              top: 9px;
              left: 13px;
            }
          }

          .project-details {
            padding: 14px;

            .project-title {
              .short-desc {
                display: block;
                margin-top: 4px;
                height: 48px;

                @media @max-lg-tablet {
                  height: 66px;
                }

                @media @max-sl-mobile {
                  height: 48px;
                }
              }
            }

            .project-info {
              margin-top: 18px;
              height: 48px;

              .project-balance {
                @media @max-lg-tablet {
                  height: 48px;
                }

                .label {
                  color: rgba(255, 255, 255, 0.6);
                }

                .value {
                  .coin-icon {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    margin-right: 8px;
                  }
                }
              }

              &.whitelist-countdown {
                height: 114px;
                background: @color-blue800;
                padding: 8px;
                border-radius: 18px;

                @media @max-lg-tablet {
                  margin-top: 72px;
                }

                @media @max-sl-mobile {
                  margin-top: 18px;
                }
              }

              &.fcb-container {
                @media @max-lg-tablet {
                  display: inline-block !important;

                  .project-balance {
                    margin-bottom: 18px;

                    &:last-child {
                      margin-bottom: 0;
                    }
                  }
                }
              }
            }

            .project-desc {
              .project-info {
                @media @max-lg-tablet {
                  height: 111px;
                }
              }

              &.project-desc-whitelist {
                @media @max-sl-mobile {
                  display: inline-block !important;
                }

                .project-title {
                  width: 50%;

                  @media @max-lg-tablet {
                    width: 60%;
                  }

                  @media @max-sl-mobile {
                    width: 100%;
                  }
                }

                .project-info {
                  margin-top: 0;
                  height: auto;
                  width: 50%;

                  @media @max-lg-tablet {
                    width: 40%;
                  }

                  @media @max-sl-mobile {
                    width: 100%;
                    margin-top: 18px;
                  }
                }
              }
            }
          }

          .btn-container {
            margin-top: 18px;
          }
        }

        .fertilizer-funded-table {
          width: 100%;

          .fertilizer-funded-table-header {
            &.scrollFixed {
              position: sticky;
              background: @color-blue800;
              top: 70px;
              z-index: 999;
              width: 100%;
              transition: 0.3s all ease-in-out;
            }

            .header-column {
              text-align: center;
              padding: 18px 0;
              color: @color-neutral400;

              .header-column-title {
                cursor: pointer;
                display: flex;
                justify-content: center;

                .arrow-icon {
                  margin-left: 4px;
                }

                .sort-icon-active {
                  color: #13ecab;
                }
              }
            }
          }

          .fertilizer-funded-table-body {
            .fertilizer-funded-table-item {
              display: flex;
              align-items: center;
              background: rgba(23, 32, 88, 0.9);
              border-radius: 8px;
              padding: 18px;
              margin-bottom: 8px;
              border: 3px solid transparent;

              &:hover {
                border-color: @color-blue500;
              }

              &:last-child {
                margin-bottom: 0;
              }

              .state {
                text-align: center;

                .show-more {
                  position: relative;
                  width: fit-content;
                  margin: auto;
                  
                  .option-sort-collapse {
                    top: 0;
                    right: 10px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media @max-lg-tablet {
  .fertilizer.container {
    .state {
      .label {
        display: block;
        color: @color-neutral400;
      }

      .project-ath .value {
        margin-top: 4px;
      }
    }

    .collapse-row {
      background: @color-blue800;
      border-radius: 8px;
      padding: 18px;

      .btn-group {
        .btn-group-item {
          &:last-child {
            margin-top: 18px;
          }
        }

        .btn-container, .social-link {
          margin-right: 18px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
.fertilizer {
  .ant-statistic-content {
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
  }

  .whitelist-countdown {
    .ant-statistic-title {
      font-weight: 600;
      font-size: 11px;
      line-height: 18px;
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 8px;
    }

    .ant-statistic-content {
      font-weight: bold;
      font-size: 25px;
      line-height: 35px;
      text-align: center;
      letter-spacing: 3px;
    }
  }

  .ant-collapse {
    background: transparent;
    border: none;

    .ant-collapse-item {
      position: relative;
      background: rgba(23, 32, 88, 0.9);
      border-radius: 8px !important;
      margin-bottom: 8px;
      border-bottom: 0;
      border: 3px solid transparent;

      &:hover {
        border-color: @color-blue500;
      }

      .ant-collapse-header {
        padding: 18px;

        .ant-collapse-arrow {
          display: none;
        }
      }

      .ant-collapse-content {
        border: none;
        background: transparent;

        .ant-collapse-content-box {
          padding: 18px;
        }
      }
    }
  }
}

.ant-tooltip .ant-tooltip-inner {
  width: 180px !important;
}
</style>
