<template>
  <div class="chargeDetail">
    <mt-header title="交易明细" fixed class="mint-header-title">
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)"></mt-button>
      </div>
    </mt-header>

    <div class="parent">
      <p class="tip">如果提现失败，如何解决？<span @click="handleShowtip">了解一下</span></p>
      <div class="text" v-if="show">暂无交易明细</div>
      <div :style="{'-webkit-overflow-scrolling': scrollMode}">
        <v-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
          <div v-for="(item,index) in tableData" :key="index" v-if="item.note != '平台手续费'">
            <div class="flexable box">
              <div class="left">
                <div class="cash">{{item.note}}-{{item.userName}}
                </div>
                <div class="time">{{item.receiveTime}}</div>
              </div>
              <div class="right  flexable">
                <div class="out">{{item.type == 1 ? `+${item.amount}` : `-${item.amount}`}}</div>
                <div class="parDate" v-if="item.status == 1 || item.status == 3">{{item.status | forStatus}}</div>
              </div>
            </div>
          </div>
        </v-loadmore>
      </div>
    </div>

    <div class="tip-mask" v-if="showTip">
      <div class="tip-content">
        <div class="tip-text">
          <p class="tip-title">如果提现失败，如何解决？</p>
          <p class="tip-desc">1.银行卡预留手机号更换，会导致提现失败。此时需要将零工系统内的预留手机号更换为（最新）预留手机号，才能提现成功。</p>
          <router-link to="/bankmobile" class="change-mobile" v-if="id">【点击此处更换预留手机号】</router-link>
          <span v-else class="change-mobile" @click="handleAlertMessage">【点击此处更换预留手机号】</span>
        </div>
        <div class="tip-btn" @click="handleHidetip">确认</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Loadmore,Toast } from 'mint-ui';
export default {
  name: "ChargeDetail",
  components: {
    'v-loadmore': Loadmore
  },
  data() {
    return {
      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      scrollMode: "auto",//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      currentPage: 1,
      tableData: [],
      show: false,
      showTip: false,
      id:null
    };
  },
  methods: {
    handleAlertMessage(){
    Toast({
      message: '您还未绑定银行卡，请先绑定',
      position: 'middle',
      duration: 2000
      });
    },
    handleCheckBankCard(){
      this.$api
        .AccountDetail().then(res=>{
          let data = res.data.data
          this.id =  data.bankList && data.bankList[0] && data.bankList[0].id
          console.log(data)
        })
    },
    getList() {
      const params = {
        pageSize: 20,
        pageNum: this.currentPage,
        objectType: 5
      };
      this.$api
        .AccountCharge(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.isHaveMore(response.data.data.isLastPage)
            if (response.data.data.list) {
              this.tableData = response.data.data.list
              this.show = false
            } else {
              this.show = true
            }

            // console.log( response.data.data.isLastPage)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadBottom() {//上拉触发的分页查询
      // 上拉加载
      this.currentPage++
      this.getListMore()
      this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位

    },
    loadTop() {//组件提供的下拉触发方法
      //下拉加载
      //        this.tableData=[]
      this.currentPage = 1
      this.allLoaded = false
      this.getList();
      this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位

    },
    isHaveMore(isLastPage) {
      if (isLastPage) {
        this.allLoaded = true;
      }
    },
    handleShowtip() {
      this.showTip = true
    },
    handleHidetip() {
      this.showTip = false
    },
    getListMore() {
      const params = {
        pageSize: 20,
        pageNum: this.currentPage,
        objectType: 5
      };
      this.$api
        .AccountCharge(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.tableData = this.tableData.concat(response.data.data.list)
            this.isHaveMore(response.data.data.isLastPage)
            this.$nextTick(function () {
              // 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，
              // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
              // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
              this.scrollMode = "touch";
            });
          }
        }).catch((error) => {
          console.log(error);
        });
    },

  },
  mounted() {
    this.getList()
    this.handleCheckBankCard();
  },
  filters: {
    forStatus(val) {
      if (val == 1) {
        return '处理中'
      } else if (val == 3) {
        return '交易失败'
      } else {
        return ''
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.tip {
  font-size: 0.5rem;
  line-height: 2rem;
  padding-left: 0.5rem;
  background-color: #f5f5f5;
  color: #969799;
}
.tip span {
  color: #e84518;
}
.parent {
  padding-top: 2.2rem;
}
.box {
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 3.85rem;
  border-bottom: solid 0.03rem #e5e5e5;
  margin: 0 auto;
}
.cash {
  color: #636363;
}
.time {
  font-size: 0.6rem;
  color: #d2d2d2;
  margin-top: 0.7rem;
}
.out {
  font-size: 0.9rem;
  color: #0d0d0d;
  text-align: right;
  margin-bottom: 0.4rem;
}
.amount {
  color: #d2d2d2;
  margin-top: 0.45rem;
  text-align: right;
}
.text {
  text-align: center;
  color: #636363;
  /* position: absolute;
    top:50%;
    left:50% */
  margin-top: 5rem;
}
.right {
  justify-content: flex-start;
  flex-direction: column;
}
.parDate {
  color: #e84518;
  font-size: 0.7rem;
}
    
    .chargeDetail {
        .tip-mask {
  position: fixed;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.tip-content {
  position: absolute;
  width: convertToVw(314);
  height: convertToVw(480);
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: convertToVw(20) convertToVw(12) convertToVw(50) convertToVw(12);
  border-radius: convertToVw(5);
  background-color: #fff;
  .tip-title {
    font-size: convertToVw(17);
    color: #1e1f21;
  }
  .tip-desc {
    font-size: convertToVw(14);
    line-height: 1.5;
    margin-top: convertToVw(8);
    color: #1e1f21;
  }
  .change-mobile {
    text-decoration: none;
    color: #ea441a;
  }
  .tip-btn {
    position: absolute;
    width: convertToVw(290);
    height: convertToVw(44);
    bottom: 0;
    left: convertToVw(12);
    font-size: convertToVw(17);
    color: #e84518;
    line-height: convertToVw(44);
    border-top: 1px solid #ededed;
    text-align: center;
  }
}
    }

</style>
