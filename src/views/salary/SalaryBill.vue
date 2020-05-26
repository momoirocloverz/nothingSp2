<template>
  <div class="salaryBillCon">
    <mt-header title="收入明细" fixed class="mint-header-title">
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)"></mt-button>
      </div>
    </mt-header>
    <div class="innerStyle">
      <div style="padding: 0 1rem" v-if="type==1">
        <mt-cell title="收入合计" is-link value="" class="sum setHeight" @click.native="goDetail">
          <span class="fs">{{billInfo.salary | priceFormat}}</span>
        </mt-cell>
        <div class="acco-body">
          <div class="acco-items">
            <div class="acco-item flexable" @click="show1=!show1">
              <span>奖惩合计</span>
              <span>{{ (billInfo.reward + (billInfo.punish ? billInfo.punish :0)) | priceFormat }}</span>
              <img src="../../assets/img/up@2x (2).png" alt="" class="acco-arrow" v-if="billInfo.rewardAndPunish">
            </div>
            <div class="splitline1"></div>
            <transition name="downwork">
              <div class="acco-item-children" v-show="show1==true">
                <div v-for="(item,index) in billInfo.rewardAndPunish" :key="index">
                  <div class="acco-item-child flexable">
                    <span>{{item.note}}</span>
                    <span>{{item.amount | priceFormat}}</span>
                  </div>
                  <div class="splitline1"></div>
                </div>
              </div>
            </transition>
          </div>

          <div class="acco-items">
            <div class="acco-item flexable">
              <span>应发收入</span>
              <span>{{billInfo.shouldSalary | priceFormat }}</span>
            </div>
            <div class="splitline1"></div>
          </div>
          <div class="acco-items">
            <div class="acco-item flexable" @click="show3=!show3">
              <span>扣款合计</span>
              <span>{{billInfo.otherAmount | priceFormat }}</span>
              <img src="../../assets/img/up@2x (2).png" alt="" class="acco-arrow" v-if="billInfo.adjustments">
            </div>
            <div class="splitline1"></div>
            <transition name="downwork">
              <div class="acco-item-children" v-show="show3==true">
                <div v-for="(item,index) in billInfo.adjustments" :key="index">
                  <div class="acco-item-child flexable" @click="goToInsurance(item)" v-if="item.amount">
                    <span>{{item.typeName}}</span>
                      <div>
                          <span>{{item.amount | priceFormat }}</span>
                            <img src="../../assets/img/right@3x.png" class="rightArrow" v-if="item.typeName == '系统使用费' || item.typeName == '保险费' ">
                    </div>
                  </div>
                  <div class="splitline1"></div>
                </div>
              </div>
            </transition>
          </div>

          <div class="acco-items">
            <div class="acco-item flexable">
              <span >实发收入</span>
              <span >{{ (billInfo.trueSalary || billInfo.totalAmount)| priceFormat }}</span>
            </div>
            <div class="splitline1"></div>
          </div>  
        </div>        
      </div>
        
        
        
      <div style="padding: 0 1rem" v-if="type==2">
        <mt-cell title="收入合计" is-link value="" class="sum setHeight" @click.native="goDetail">
          <span class="fs">{{billInfo.salary | priceFormat}}</span>
        </mt-cell>
        <div class="acco-body">
          <div class="acco-items">
            <div class="acco-item flexable" @click="show4=!show4">
              <span>奖惩合计</span>
              <span>{{(billInfo.reward + (billInfo.punish ? billInfo.punish :0)) | priceFormat }}</span>
              <img src="../../assets/img/up@2x (2).png" alt="" class="acco-arrow" v-if="billInfo.rewardAndPunish">
            </div>
            <div class="splitline1"></div>
            <transition name="downwork">
              <div class="acco-item-children" v-show="show4==true">
                <div v-for="(item,index) in billInfo.rewardAndPunish" :key="index">
                  <div class="acco-item-child flexable">
                    <span>{{item.note}}</span>
                    <span>{{item.salary | priceFormat }}</span>
                  </div>
                  <div class="splitline1"></div>
                </div>
              </div>
            </transition>
          </div>

          <div class="acco-items">
            <div class="acco-item flexable">
              <span>应发收入</span>
              <span>{{billInfo.shouldSalary | priceFormat }}</span>
            </div>
            <div class="splitline1"></div>
          </div>
          <div class="acco-items">
            <div class="acco-item flexable" @click="show6=!show6">
              <span>扣款合计</span>
              <span>{{billInfo.otherAmount | priceFormat }}</span>
              <img src="../../assets/img/up@2x (2).png" alt="" class="acco-arrow" v-if="billInfo.adjustments">
            </div>
            <div class="splitline1"></div>
            <transition name="downwork">
              <div class="acco-item-children" v-show="show6==true">
                <div v-for="(item,index) in billInfo.adjustments" :key="index">
                  <div class="acco-item-child flexable" @click="goToInsurance(item)" v-if="item.amount">
                    <span>{{item.typeName}}</span>
                    <div>
                          <span>{{item.amount | priceFormat }}</span>
                            <img src="../../assets/img/right@3x.png" class="rightArrow" v-if="item.typeName == '系统使用费' || item.typeName == '保险费' ">
                    </div>
                  </div>
                  <div class="splitline1"></div>
                </div>
              </div>
            </transition>
          </div>

          <div class="acco-items">
            <div class="acco-item flexable">
              <span >实发收入</span>
              <span>{{billInfo.trueSalary | priceFormat }}</span>
            </div>
            <div class="splitline1"></div>
          </div>
          
        </div>
      </div>
        
        
        
        
      <div style="padding: 0 1rem" v-if="type==3">
      <mt-cell title="收入合计" is-link value="" class="sum setHeight" @click.native="goDetail">
        <span class="fs">{{billInfo.salary | priceFormat }}</span>
      </mt-cell>
      <div class="acco-body">
        <div class="acco-items">
          <div class="acco-item flexable" @click="show7=!show7">
            <span>奖惩合计</span>
            <span>{{(billInfo.reward + (billInfo.punish ? billInfo.punish :0) ) | priceFormat}}</span>
            <img src="../../assets/img/up@2x (2).png" alt="" class="acco-arrow" v-if="billInfo.rewardAndPunish">
          </div>
          <div class="splitline1"></div>
          <transition name="downwork">
            <div class="acco-item-children" v-show="show7==true">
              <div v-for="(item,index) in billInfo.rewardAndPunish" :key="index">
                <div class="acco-item-child flexable">
                  <span>{{item.note}}</span>
                  <span>{{item.salary | priceFormat }}</span>
                </div>
                <div class="splitline1"></div>
              </div>
            </div>
          </transition>
        </div>

        <div class="acco-items">
          <div class="acco-item flexable">
            <span>应发收入</span>
            <span>{{billInfo.shouldSalary | priceFormat }}</span>
          </div>
          <div class="splitline1"></div>
        </div>
        <div class="acco-items">
          <div class="acco-item flexable" @click="show8=!show8">
            <span>扣款合计</span>
            <span>{{billInfo.otherAmount | priceFormat }}</span>
            <img src="../../assets/img/up@2x (2).png" alt="" class="acco-arrow" v-if="billInfo.adjustments">
          </div>
          <div class="splitline1"></div>
          <transition name="downwork">
            <div class="acco-item-children" v-show="show8==true">
              <div v-for="(item,index) in billInfo.adjustments" :key="index">
                <div class="acco-item-child flexable" @click="goToInsurance(item)" v-if="item.amount">
                  <span>{{item.typeName}}</span>
                  <div>
                          <span>{{item.amount | priceFormat }}</span>
                            <img src="../../assets/img/right@3x.png" class="rightArrow" v-if="item.typeName == '系统使用费' || item.typeName == '保险费' ">
                    </div>
                </div>
                <div class="splitline1"></div>
              </div>
            </div>
          </transition>
        </div>

        <div class="acco-items">
          <div class="acco-item flexable">
            <span>实发收入</span>
            <span>{{billInfo.trueSalary | priceFormat }}</span>
          </div>
          <div class="splitline1"></div>
        </div>
        <div class="acco-items" v-if="billInfo.debt">
          <div class="acco-item flexable">
            <span>剩余欠款</span>
            <span >{{billInfo.debt | priceFormat }}</span>
          </div>
          <div class="splitline1"></div>
        </div>
      </div>
    </div>
        
        
        
      <div>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Unbound",
  data() {
    return {
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
      show7: false,
      show8: false,
      name: '',
      type: 1, //默认1  其它对应下显示的是以前的，可以删除
      isSocialSecurity: '',
      talentType: '',
      billInfo: {},
      currentPage: 1,
      pageSize: 20,
      pageCount: '',
      settlementTypeList: '',
      belongtoList: '',
      input5: '',
      select: '',
      tableData: [],
      mineItem: {},
      reveiveId: '',
      publishId: '',
    }
  },
    filters:{
        priceFormat:function(val){
                if( (toString.call(val) === '[object Null]')||(toString.call(val) === '[object Undefined]')  ){
                   return 0;
                }else{
                    let fix = (Math.round(+val + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },
    },
  mounted() {
      this.getList();
  },    
  methods: {
    goToInsurance(item){
      if(item.category == 2){
          let query1 = this.$route.query;
          query1.category = 2;
        this.$router.push({
            path: "/insuranceFee",
            query:query1
        });
      }else if(item.category == 3){
          let query2 = this.$route.query;
          query2.category = 3;
        this.$router.push({ 
            name: 'insuranceSystem' , 
            query:query2
        })
      }
        
    },
    getList() {
      const params = this.$route.query;
      this.$api.salarySheet(params).then((res) => {
        if (res.data.respCode == 0) {
          this.billInfo = res.data.data;
          console.log(this.billInfo)
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    goDetail() {
      this.$router.push({ 
          name: 'salary', 
          query: this.$route.query
      })
    }
  }
}
</script>

<style scoped lang="scss">
    .salaryBillCon {
        width:100%;
        height:100vh;  
        box-sizing: border-box;
        padding-top: convertToVw(40);
        background-color:#f5f5f5;
        background-color: #fff;
    }
    .rightArrow {
        width: convertToVw(6);
        height: convertToVw(12);
        margin-left: convertToVw(12);
    }
    .setHeight {
        min-height: convertToVw(40);
        box-sizing: border-box;
        border-top: 1px solid #D9D9D9;
        margin-top: convertToVw(14);
    }
.fs {
  color: #262626;
}
.acco-arrow {
  width: 0.6rem;
  height: 0.3rem;
  position: absolute;
  right: 0rem;
  top: 0.9rem;
}
.acco-body {
  line-height: 2.1rem;
}
.acco-item {
  position: relative;
  justify-content: space-between;
  padding-right: 1rem;
}
.acco-item-children {
  padding: 0 1rem;
}
.acco-item-child {
  justify-content: space-between;
}
.splitline1 {
  /*height: 0.05rem;*/
  height: 1px;
  background-color: #e5e5e5;
  margin: 0.03rem 0rem;
}
.acco-items {
  color: #262626;
}
.downwork-enter-active {
  /*transition: all .3s ease;*/
  transition-duration: 5s;
  -webkit-transition-duration: 5s;
}
.downwork-leave-active {
  /*transition: all .3s ease;*/
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>