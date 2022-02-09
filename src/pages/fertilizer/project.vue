<template>
  <div class="fertilizer container">
    <div class="card">
      <div class="card-body">
        <div class="fertilizer-head fcsb-container">
          <h3 class="title weight-bold">Fertilizer / Admin panel <span v-if="is_new">New</span> <span v-else-if="mint">Update</span></h3>
        </div>



        <div v-if="is_new">

            <h4>Project initiation</h4>
          <label>
            Project Mint Address : 
            <input style="font-size:20px;font-weight:bold" type="text" class="std" id="address" name="address" v-model="mint" />
          </label>


          <div class="create">
              <Button @click="create" ghost>Create project</Button>
          </div>
        </div>
        <div v-else-if="mint">


            <h4>Project infos</h4>

            <div class="bloc">
            <label>
              Project title : 
              <input style="font-size:20px;font-weight:bold" type="text" class="std" id="title" name="title" v-model="apiValues.title" />
            </label>

            <label>
              Project slug : (URL will be <b>https://cropper.finance/fertilizer/{{apiValues.slug}}</b>) 
              <input style="font-size:20px;font-weight:bold" type="text" class="std" id="slug" name="slug" v-model="apiValues.slug" />
            </label>


            <label class="half">
              Picture URL: <small>(877x190)</small>
              <input type="text" class="std" id="picture" name="picture" v-model="apiValues.picture" />
            </label>

            <label class="half">
              Picture URL (mobile):  <small>(426.5x190)</small>
              <input type="text" class="std" id="picture_mobile" name="picture_mobile" v-model="apiValues.picture_mobile" />
            </label>


            <label class="half">
              ROI Display: 
              <input type="text" class="std" id="roi_display" name="roi_display" v-model="apiValues.roi_display" />
            </label>

            <label class="half">
              Hard Cap : 
              <input type="text" class="std" id="hard_cap" name="hard_cap" v-model="apiValues.hard_cap" />
            </label>

            <label>
              Short desc : 
              <textarea class="std" id="short_desc" name="short_desc" v-model="apiValues.short_desc"></textarea>
            </label>

            <label>
              Short desc 2 : 
              <textarea class="std" id="short_desc" name="short_desc" v-model="apiValues.short_desc_2"></textarea>
            </label>

            <label>
              Long desc (file path): 
              <input type="text" class="std" id="long_desc" name="long_desc" v-model="apiValues.long_desc" />
            </label>

            </div>

            <h4>SEO</h4>


            <div class="bloc">

            <label>
              Project title tag :
              <input type="text" class="std" id="seo_title_meta" name="seo_title_meta" v-model="apiValues.seo_title_meta" />
            </label>

            <label>
              Project meta description :
              <input type="text" class="std" id="seo_desc_meta" name="seo_desc_meta" v-model="apiValues.seo_desc_meta" />
            </label>

            </div>

            <h4>Token infos</h4>

            <div class="bloc">
            <label>
              Mint : 
              <input disabled type="text" class="std" id="mint" name="mint" v-model="mint" />
            </label>

            <label>
              Logo Token : 
              <input type="text" class="std" id="token_logo" name="token_logo" v-model="apiValues.token_logo" />
            </label>


            <label class="half">
              Token Price token : <span v-if="scValues.price_token_mint == '' || scValues.price_token_mint == undefined" class="error">Required</span>
              <select class="std" id="price_token_mint" name="price_token_mint" v-model="scValues.price_token_mint">
                <option value="6MBRfPbzejwVpADXq3LCotZetje3N16m5Yn7LCs2ffU4">USDC</option>
                <option value="11111111111111111111111111111111">SOL</option>
              </select>
            </label>

            <label class="half">
              Token Price ({{ this.scValues.price_token_mint ? getTokenByMintAddress(this.scValues.price_token_mint)['symbol'] : 'SELECT A TOKEN' }}) : <span v-if="scValues.token_price * 1 == 0" class="error">Price unknown</span>
              <input type="text" class="std" id="token_price" name="token_price" v-model="scValues.token_price" />
            </label>

            <label class="half">
              Pool size ({{ this.scValues.price_token_mint ? getTokenByMintAddress(this.scValues.price_token_mint)['symbol'] : 'SELECT A TOKEN' }}) :  <span v-if="scValues.pool_size * 1 == 0" class="error">Pool size unknown</span>
              <input type="text" class="std" id="pool_size" name="pool_size" v-model="scValues.pool_size" />
            </label>

            <label class="half">
              Type : <span v-if="apiValues.type == ''" class="error">Required</span>
              <select class="std" id="type" v-model="apiValues.type" name="type">
                <option value="100% TGE">100% TGE</option>
                <option value="Vested">Vested</option>
              </select>
            </label>

            <label class="half" v-if="apiValues.type == 'Vested'">
              First liberation : 
              <select class="std" id="type" v-model="scValues.first_liberation" name="type">
                <option value="100">100% TGE</option>
                <option value="50">50% TGE</option>
                <option value="40">40% TGE</option>
                <option value="30">30% TGE</option>
                <option value="25">25% TGE</option>
                <option value="20">20% TGE</option>
                <option value="10">10% TGE</option>
              </select>
            </label>



            <label>
              Disclaimer : 
              <textarea class="std" id="disclaimer" name="disclaimer" v-model="apiValues.disclaimer"></textarea>
            </label>

            </div>


            <h4>Dates infos</h4>

            <div class="bloc">

            <label class="half">
              Active : 
              <select class="std" id="active" v-model="apiValues.active" name="active">
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </label>


            <label class="half">
              Set launch as closed :
              <select class="std" id="closed" v-model="apiValues.closed" name="closed">
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </label>

            <label class="date half">
              Preparation Date (D1) :  <span v-if="!scValues.date_preparation || scValues.date_preparation.length != 19" class="error">Please enter a date like YYYY-MM-JJ HH:II:SS</span>
              <input placeholder="YYYY-MM-JJ HH:II:SS" type="text" class="std" id="date_preparation" name="date_preparation" v-model="scValues.date_preparation" />
            </label>

            <label class="date  half">
              Whitelist start Date (D2) :  <span v-if="scValues.date_whitelist_start <= scValues.date_preparation" class="error">Date doesn't look good</span> <span v-if="!scValues.date_whitelist_start || scValues.date_whitelist_start.length != 19" class="error">Please enter a date like YYYY-MM-JJ HH:II:SS</span>
              <input placeholder="YYYY-MM-JJ HH:II:SS" type="text" class="std" id="date_whitelist_start" name="date_whitelist_start" v-model="scValues.date_whitelist_start" />
            </label>

            <label class="date  half">
              Whitelist end Date (D2.2) :   <span v-if="scValues.date_whitelist_end <= scValues.date_whitelist_start" class="error">Date doesn't look good</span> <span v-if="!scValues.date_whitelist_end || scValues.date_whitelist_end.length != 19" class="error">Please enter a date like YYYY-MM-JJ HH:II:SS</span>
              <input placeholder="YYYY-MM-JJ HH:II:SS" type="text" class="std" id="date_whitelist_end" name="date_whitelist_end" v-model="scValues.date_whitelist_end" />
            </label>

            <label class="date  half">
              Sales start Date (D4) : <span v-if="scValues.date_sale_start <= scValues.date_whitelist_end" class="error">Date doesn't look good</span> <span v-if="!scValues.date_sale_start || scValues.date_sale_start.length != 19" class="error">Please enter a date like YYYY-MM-JJ HH:II:SS</span>
              <input placeholder="YYYY-MM-JJ HH:II:SS" type="text" class="std" id="date_sale_start" name="date_sale_start" v-model="scValues.date_sale_start" />
            </label>

            <label class="date  half">
              Sales end Date (D4) : <span v-if="scValues.date_sale_end <= scValues.date_sale_start" class="error">Date doesn't look good</span> <span v-if="!scValues.date_sale_end || scValues.date_sale_end.length != 19" class="error">Please enter a date like YYYY-MM-JJ HH:II:SS</span>
              <input placeholder="YYYY-MM-JJ HH:II:SS" type="text" class="std" id="date_sale_end" name="date_sale_end" v-model="scValues.date_sale_end" />
            </label>

            <label class="date  half">
              Distribution Date (D5) : <span v-if="scValues.date_distribution <= scValues.date_sale_end" class="error">Date doesn't look good</span> <span v-if="!scValues.date_distribution || scValues.date_distribution.length != 19" class="error">Please enter a date like YYYY-MM-JJ HH:II:SS</span>
              <input placeholder="YYYY-MM-JJ HH:II:SS" type="text" class="std" id="date_distribution" name="date_distribution" v-model="scValues.date_distribution" />
            </label>

            <label>
              Sort order: 
              <input type="text" class="std" id="sort_order" name="sort_order" v-model="apiValues.sort_order" />
            </label>

            </div>


            <h4>Social infos</h4>

            <div class="bloc">

            <label class="half">
              Website URL: 
              <input type="text" class="std" id="website_display" name="website_display" v-model="apiValues.website_display" />
            </label>

            <label class="half">
              Website Display: 
              <input type="text" class="std" id="website_url" name="website_url" v-model="apiValues.website_url" />
            </label>

            <label class="half">
              Twitter link: 
              <input type="text" class="std" id="twitter_link" name="twitter_link" v-model="apiValues.twitter_link" />
            </label>

            </div>

            <h4>Ticket earning</h4>

            <div class="bloc">

            <label>
              Post to retweet: 
              <textarea class="std" id="post_a" name="post_a" v-model="apiValues.post_a"></textarea>
            </label>

            <label class="half">
              Twitter A: 
              <input type="text" class="std" id="twitter_a" name="twitter_a" v-model="apiValues.twitter_a" />
            </label>

            <label class="half">
              Twitter B: 
              <input type="text" class="std" id="twitter_b" name="twitter_b" v-model="apiValues.twitter_b" />
            </label>

            <label class="half">
              Telegram A: 
              <input type="text" class="std" id="tg_a" name="tg_a" v-model="apiValues.tg_a" />
            </label>

            <label class="half">
              Telegram B: 
              <input type="text" class="std" id="tg_b" name="tg_b" v-model="apiValues.tg_b" />
            </label>


            </div>


            
            <h4>Whitelist</h4>

            <div class="bloc">

              <label>
                <div>1 SPL per line</div>
                <textarea class="std" id="apiValues.whitelist" name="apiValues.whitelist" v-model="apiValues.whitelist"></textarea>
              </label>


            </div>

            <button @click="save" @disabled="!$wallet || $wallet.publicKey">Save</button>
            
            <h4>Allocation infos - (<b>{{ (
              (
                (apiValues.ticketsCount * scValues.tier0) +
                (scValues.tier1Count * scValues.tier1) + 
                (scValues.tier2Count * scValues.tier2) + 
                (scValues.tier3Count * scValues.tier3) + 
                (scValues.tier4Count * scValues.tier4) + 
                (scValues.tier5Count * scValues.tier5) 
              )  / scValues.pool_size) * 100 }} % </b> filled) </h4>

            <div class="bloc">

            <label>
              <div>Lottery ticket : {{ scValues.tier0Count + scValues.tier1Count + scValues.tier2Count }} subscribers</div>
              <div class="conta" v-if="apiValues.lottery_done == 0">Set winner count <br />
              <input style="color:#000;font-weight:bold"  @input="refr" type="text" class="tier" id="ticketsCount" name="ticketsCount" v-model="apiValues.ticketsCount" />
              </div>
              <div class="conta" v-else>Winner count <br />
              <b>{{ apiValues.lottery_done }}</b>
              </div>
              <div class="conta">Tickets value ({{ scValues.price_token_mint ? getTokenByMintAddress(scValues.price_token_mint)['symbol'] : 'SELECT A TOKEN' }})<br />
              <input style="color:#000;font-weight:bold"  @input="refr" type="text" class="tier" id="tier0" name="tier0" v-model="scValues.tier0" />
              </div>
              <div class="conta">% Allocation<br />
              {{ (apiValues.ticketsCount * scValues.tier0 / scValues.pool_size) * 100 }} %
              </div>

              <div class="conta">
                  <button @click="processLottery" v-if="apiValues.lottery_done == 0">Process Lottery</button>
                  <button v-if="apiValues.lottery_done > 0">Get airdrop list</button>
              </div>

              <div  v-if="scValues.date_whitelist_end <= moment().toISOString() && scValues.date_sale_start >= moment().toISOString()" ></div>
            </label>

            <!-- 
            <hr />
            <label>
              <div>Tier1 : </div>
              <div class="conta">Tickets count<br /> <b>{{ scValues.tier1Count  }}</b>
              </div>
              <div class="conta">Tickets value ({{ scValues.price_token_mint ? getTokenByMintAddress(scValues.price_token_mint)['symbol'] : 'SELECT A TOKEN' }})<br />
              <input style="color:#000;font-weight:bold"  @input="refr" type="text" class="tier" id="tier1" name="tier1" v-model="scValues.tier1" />
              </div>
              <div class="conta">% Allocation<br />
              {{ (scValues.tier1Count * scValues.tier1 / scValues.pool_size) * 100 }} %
              </div>
            </label>

            <hr />

            <label>
              <div>Tier2 :</div>
              <div class="conta">Tickets count<br />  <b>{{ scValues.tier2Count  }}</b>
              </div>
              <div class="conta">Tickets value ({{ scValues.price_token_mint ? getTokenByMintAddress(scValues.price_token_mint)['symbol'] : 'SELECT A TOKEN' }})<br />
              <input style="color:#000;font-weight:bold"  @input="refr" type="text" class="tier" id="tier2" name="tier2" v-model="scValues.tier2" />
              </div>
              <div class="conta">% Allocation<br />
              {{ (scValues.tier2Count * scValues.tier2 / scValues.pool_size) * 100 }} %
              </div>
            </label>

            -->
            <hr />

            <label>
              <div>Tier3 : </div>
              <div class="conta">Tickets count<br /> <b>{{ scValues.tier3Count  }}</b>
              </div>
              <div class="conta">Tickets value ({{ scValues.price_token_mint ? getTokenByMintAddress(scValues.price_token_mint)['symbol'] : 'SELECT A TOKEN' }})<br />
              <input style="color:#000;font-weight:bold"  @input="refr" type="text" class="tier" id="tier3" name="tier3" v-model="scValues.tier3" />
              </div>
              <div class="conta">% Allocation<br />
              {{ (scValues.tier3Count * scValues.tier3 / scValues.pool_size) * 100 }} %
              </div>
            </label>
            <hr />

            <label>
              <div>Tier4 : </div>
              <div class="conta">Tickets count<br /> <b>{{ scValues.tier4Count  }}</b>
              </div>
              <div class="conta">Tickets value ({{ scValues.price_token_mint ? getTokenByMintAddress(scValues.price_token_mint)['symbol'] : 'SELECT A TOKEN' }})<br />
              <input style="color:#000;font-weight:bold"  @input="refr" type="text" class="tier" id="tier4" name="tier4" v-model="scValues.tier4" />
              </div>
              <div class="conta">% Allocation<br />
              {{ (scValues.tier4Count * scValues.tier4 / scValues.pool_size) * 100 }} %
              </div>
            </label>
            <hr />

            <label>
              <div>Tier5 : </div>
              <div class="conta">Tickets count<br /> <b>{{ scValues.tier5Count  }}</b>
              </div>
              <div class="conta">Tickets value ({{ scValues.price_token_mint ? getTokenByMintAddress(scValues.price_token_mint)['symbol'] : 'SELECT A TOKEN' }})<br />
              <input style="color:#000;font-weight:bold"  @input="refr" type="text" class="tier" id="tier5" name="tier5" v-model="scValues.tier5" />
              </div>
              <div class="conta">% Allocation<br />
              {{ (scValues.tier5Count * scValues.tier5 / scValues.pool_size) * 100 }} %
              </div>
            </label>
            
            </div>









        <button @click="setAllocation" @disabled="!$wallet || $wallet.publicKey">Set Allocation</button>




        </div>











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
import axios from '@nuxtjs/axios'
import { TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import { TOKENS, NATIVE_SOL, getTokenByMintAddress } from '@/utils/tokens'
import {setAnchorProvider, saveProject, createLaunchpad, getProjectFormatted, setMaxAllocation} from '@/utils/crp-launchpad'
import {Keypair} from '@solana/web3.js'
const Vco = require('v-click-outside')
Vue.use(Vco)
const CollapsePanel = Collapse.Panel
const Countdown = Statistic.Countdown

export default Vue.extend({
  components: {
    // Spin,
    // Icon,
    // Collapse,
    // CollapsePanel,
    // Row,
    // Col,
    // Button
    // Countdown,
    // Tooltip
  },
  data() {
    return {
      searchName: '',
      coinPicUrl: '',
      mint: '',
      is_new: 0,
      initialized: false as boolean,
      labelizedAmms: {} as any,
      currentPage: 1,
      coinName: '',
      mintAddress: '',
      scValues: {
      } as any,
      apiValues: {
        title : '',
        ath: '',
        hard_cap: '',
        tg_b: 'https://linktr.ee/cropperfinance',
        twitter_b: 'https://twitter.com/CropperFinance'
      } as any,
      poolLoaded: false,
      autoRefreshTime: 60 as number,
      countdown: 0,
      whitelist: '' as string,
      showCollapse: [] as any[],
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
      sortUpcoming: 'All' as string,
      sortFunded: 'Subscribers' as string,
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
      sortOptions: {
        subscribers: 'Subscribers',
        total_raised: 'Total raise',
        token_price: 'Token price',
        ath: 'ATH Since IDO',
        end_date: 'Ended in UTC'
      },
      filterProject: 'Upcoming' as string,
      fertilizerItems: [] as any[],
      fertilizerData: [
        {
          status: 'Upcoming',
          key: 'k13',
          picture: '/fertilizer/banner/winerz.png',
          title: 'Winerz',
          short_desc: 'Experience a new way of playing by betting on your victory.',
        },
        {
          status: 'Upcoming',
          key: 'k14',
          picture: '/fertilizer/banner/secretum.png',
          title: 'Secretum Protocol',
          short_desc: 'Blockchain-based messaging app where every conversation is private by design.',
        },
        {
          status: 'Upcoming',
          key: 'k15',
          picture: '/fertilizer/banner/zebec.png',
          title: 'Zebec Protocol',
          short_desc: 'Continuous Settlement Protocol.',
        }
      ],
      currentTimestamp: 0
    }
  },
  head: {
    title: 'Fertilizer'
  },
  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },
  async mounted() {
    // this.$router.push({ path: `/swap/` })

    setAnchorProvider(this.$web3, this.$wallet)

    this.$accessor.token.loadTokens()

    const query = new URLSearchParams(window.location.search)
    if (query.get('mint')) {
      this.mint = query.get('mint') as string


      if(this.mint == 'new'){
        this.is_new = 1;
        this.mint = new Keypair().publicKey.toString();
      }

      this.scValues = await getProjectFormatted(this.mint)

      if(this.scValues.pool_size * 1 == 0){
        this.scValues.pool_size = 1;
      }

      let responseData = {} as any

      try {
        responseData =  await fetch('https://api.croppppp.com/launchpad/?mint=' + this.mint +'&full=1').then((res) => res.json())
      } catch {
        // dummy data
      } finally {
        this.apiValues = responseData.message
        console.log(this.apiValues);
        if(this.apiValues){
          this.apiValues.ticketsCount = this.apiValues.lottery_done
        }
      }

      try {
        responseData =  await fetch('https://flow.cropper.finance/registers/adminroeireroijgorigoerigjerogierjg').then((res) => res.json())
      } catch {
        // dummy data
      } finally {
        for (let dat in responseData) {
          let value=  responseData[dat]

          if(value.mint == this.mint){
            this.scValues['tier' + value.tier_reference + 'Count'] = value.ct;
          }
        };

      }

    }

    if(this.apiValues && !this.apiValues.ticketsCount){
      this.apiValues.ticketsCount = 0;
    }


    for( let dat in [0,1,2,3,4,5]){
      if(!this.scValues['tier' + dat + 'Count']){
        this.scValues['tier' + dat + 'Count'] = 0;
      }
      if(!this.scValues['tier' + dat]){
        this.scValues['tier' + dat] = 0;
      }
    }

    if(this.scValues.pool_size * 1 != 0){
      this.scValues.pool_size = this.scValues.pool_size * 1;
    }


    console.log("SC Values", this.scValues)

    this.currentTimestamp = moment().valueOf()
    this.updateFertilizer()
  },
  watch: {
  },
  methods: {
    getTokenByMintAddress,
    importIcon,
    TokenAmount,
    async flush() {},
    async updateLabelizedAmms() {},
    async delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    setTimer() {},
    reloadTimer() {},
    updateFertilizer() {
    },
    filterFertilizer(searchName: string, filterProject: string) {},
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
    refr(){
      this.apiValues.whitelist = this.apiValues.whitelist + '';
    },
    goToProject(fertilizer: any) {
      this.$router.push({
        path: '/fertilizer/project/?f=' + fertilizer.uniqueKey
      })
    },
    sortByStatus(option: string) {
      this.sortUpcoming = option
      this.showFilterMenu = false
      this.filterFertilizer(this.searchName, this.filterProject)
    },
    sortByColumn(option: string) {
      if (this.sortFunded === option) this.sortAsc = !this.sortAsc
      this.sortFunded = option
      this.filterFertilizer(this.searchName, this.filterProject)
    },
    sortByColumnMenu(option: string, asc: boolean) {
      this.sortFunded = option
      this.sortAsc = asc
      this.showFilterMenu = false
      this.filterFertilizer(this.searchName, this.filterProject)
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
    },


    async create() {

      await this.delay(1000);

      var request = require('request');
      var options = {
        'method': 'POST',
        'url': 'https://api.croppppp.com/launchpad/post/',
        'headers': {
          'Referrer-Policy': 'no-referer',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: { 'mint' : this.mint}
      };
      request(options, function (error : any, response : any) {
        if (error) throw new Error(error);
      });
      
      alert(this.mint);

      this.$router.push({
        path: '/fertilizer/project/?mint=' + this.mint
      })

      this.is_new = 0;

    }, 
    processLottery() {
      var request = require('request');
      var options = {
        'method': 'POST',
        'url': 'https://flow.cropper.finance/registers/admoofrekcijgorigoerigjerogierjg/'+this.mint,
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          'whitelist': this.apiValues.whitelist,
          'count' : this.apiValues.ticketsCount
        }
      };
      request(options, function (error:any, response:any) {
        if (error) throw new Error(error);
        console.log(response.body);

      });


        var options2 = {
          'method': 'POST',
          'url': 'https://api.croppppp.com/launchpad/post/',
          'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          form: {
            'mint': this.mint,
            'lottery_done' : this.apiValues.ticketsCount
          }
        };
        request(options2, function (error:any, response:any) {
          if (error) throw new Error(error);
          console.log(response.body);
        });


    },

    save() {


      if(this.apiValues.type != 'Vested'){
        this.scValues.first_liberation = 100;
      }

      let apiDatas = this.apiValues;
      apiDatas.mint = this.mint;
      apiDatas.date_whitelist_start = this.scValues.date_whitelist_start;
      apiDatas.date_whitelist_end = this.scValues.date_whitelist_end;

      var request = require('request');
      var options = {
        'method': 'POST',
        'url': 'https://api.croppppp.com/launchpad/post/',
        'headers': {
          'mint': 'aijfiej',
          'title': 'gekpogkpokpoke',
          'Referrer-Policy': 'no-referer',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: apiDatas
      };
      request(options, function (error : any, response : any) {
        if (error) throw new Error(error);
        console.log(response.body);
      });

      saveProject(
        this.$web3,
        this.$wallet,
        
        this.mint,
        this.scValues.price_token_mint, //price token mint
        
        this.scValues.date_preparation,
        this.scValues.date_whitelist_start,
        this.scValues.date_whitelist_end,
        this.scValues.date_sale_start,
        this.scValues.date_sale_end,
        this.scValues.date_distribution,

        // [0,1,2,3,4,5],

        this.scValues.token_price,
        this.scValues.pool_size,
        this.scValues.first_liberation,

      );
    },
    setAllocation() {


      
      setMaxAllocation(
        this.$web3,
        this.$wallet,
        
        this.mint,
        this.scValues.tier0,
        this.scValues.tier1,
        this.scValues.tier2,
        this.scValues.tier3,
        this.scValues.tier4,
        this.scValues.tier5,
      );
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

  &.upcoming {
    background: #a262ac;
  }

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

.error{
  color:#f00 !important;
  font-weight:bold;
}

.info-icon {
  img {
    width: 12px;
    height: 12px;
    margin-right: 8px;
  }
}


input.std,
select.std,
textarea.std{
    width: 100%;
    color: #fff !important;
    padding: 5px 10px;
    background: none;
    border: none;
    border-bottom: 1px solid;
    border-radius: 0;
    vertical-align: top;
    min-height:32px
}


input.std:focus,
select.std:focus,
textarea.std:focus{
outline: none;
    border-bottom: 1px solid #62f9a6;
}


input.std.tier,
select.std.tier,
textarea.std.tier{
  padding:5px 10px;
}

label{
  margin-bottom:20px;
  display:block;
  font-weight:bold
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

button{
  color:#000 !important;
  padding:20px 40px;
}

.half{
  display:inline-block;
  width:49%;
}

.half:nth-child(even){
  margin-right:1.5%
}

.conta{
  padding:10px;
  width:24%;
  display:inline-block;
  margin:5px
}

// class stylesheet
.fertilizer.container {
  margin: 38px 0;

  @media @max-sl-mobile {
    margin: 28px 0;
  }

  .bloc{    
    background: rgba(255, 255, 255, 0.2);
    padding: 10px 20px;
    margin-bottom: 20px;
    border-radius: 10px;
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

          &.first {
            border: 3px solid @color-petrol500;

            .project-banner {
              border-bottom: 3px solid @color-petrol500;
            }
          }

          .project-details {
            padding: 14px;

            .project-title {
              height: 170px;

              @media @max-sl-mobile {
                height: 111px;
              }

              .short-desc {
                display: block;
                margin-top: 4px;
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
                height: 48px;
                // height: 114px;
                // background: @color-blue800;
                // padding: 8px;
                // border-radius: 18px;
              }

              &.fcsb-container {
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
                  width: 20px;
                  margin: auto;

                  .option-sort-collapse {
                    top: 0;
                    right: 25px;
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

        .btn-container,
        .social-link {
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

  .project-info .project-balance .value .ant-statistic-content-value {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0.15px;
  }
}

.ant-tooltip .ant-tooltip-inner {
  width: 180px !important;
}
</style>
