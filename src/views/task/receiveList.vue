<template>
  <div>
    <mt-header title="抢单记录" fixed>
        <div slot="left">
        <mt-button icon="back" @click="$router.back(-1)"></mt-button>
        </div>
    </mt-header>
    <div class="container" style="background-color: #F5F5F5;">
      <div class="splitline"></div>
      <div :style="{'-webkit-overflow-scrolling': scrollMode}">
        <v-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange">
          <div class="card-container card-paddingtop" style="background-color: white;" v-for="item in tableDatas">
            <div class="card-header" @click="routeToDetail(item)">
              <span class="name">{{item.taskName}}</span>              
              <span class="status-label" v-if="!activeOne && item.status==1">待确认</span>
              <span class="status-label" v-if="!activeOne && item.status==2">领取失败</span>
              <span class="status-label" v-if="!activeOne && item.status==3">领取成功</span>
              <span class="status-label" v-if="!activeOne && item.status==4">已放弃</span>
              <span class="status-label" v-if="!activeOne && item.status==5">被取消</span>
            </div>
            <div class="card-body" @click="routeToDetail(item)">
                <div>
                    <span class=" firstPartSp2" v-if="item.positionName">{{item.positionName}}</span>
                    <span class=" firstPartSp3">{{item.settlementType | settlementTypeText}}</span> 
                </div>
              <div class="card-body-item ">

                <span class="body-label">发 布 人：</span>
                <span class="body-value">{{item.managerName}}</span>
              </div>
              <div class="card-body-item">
                <span class="body-label">起止时间：</span>
                <span class="body-value">{{item.startTime | formatminDate}} 至 {{item.endTime | formatminDate}}</span>
              </div>
              <div class="card-body-item text-overflow">
                工作地点：{{item.workingPlace}}
              </div>
              <div class="card-body-item text-overflow">
                <span class="body-label">工单单价：</span>
                <span class="body-value">{{item.price | forPrice}}</span>
              </div>
            </div>
            <div class="splitline"></div>

            <div class="card-footer ">

              <div class="btn-group">
                <mt-button type="default" v-if="!activeOne && item.status==1" class="footerBtn" @click="giveup(item)">放弃
                </mt-button>
                <!--<mt-button type="default" v-if="!activeOne && (item.status==2 || item.status==4)" class="footerBtn" @click="handledelete(item)">删除-->
                <!--</mt-button>-->
              </div>

            </div>
          </div>
          <div slot="top" class="mint-loadmore-top">
            <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
            <span v-show="topStatus === 'loading'">
              <mt-spinner type="snake"></mt-spinner>
            </span>
          </div>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
              <mt-spinner type="snake"></mt-spinner>
            </span>
          </div>
          <p class="nomore pt15 pb15" v-if="allLoaded"> 没有更多记录了</p>
          <p class="nomore pt15 pb15" v-else-if="tableDatas.length<1"> 暂无相关工单信息</p>
          <p class="nomore pt15 pb15" v-else> 下拉加载更多</p>
        </v-loadmore>
      </div>
    </div>
    <div class="u-mask" v-show="visible">
      <div class="u-confirm flexable">
        <span class="confirm-title">确认放弃</span>
        <span class="confirm-title">{{taskItem.taskName}}工单吗</span>
        <div class="flexable confirm-btngroup">
          <mt-button type="primary" class="confirm-btn" style="padding: 0.53rem 1.53rem" @click="handlegiveup">确认</mt-button>
          <mt-button type="primary" class="cancel-btn" @click="visible=false" style="padding: 0.53rem 1.53rem">取消</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang='scss'>

     .firstPartSp2 {
                color: #3296FA;
                margin-right: convertToVw(10);
                border: 1px solid #3296FA;
                border-radius: 2px;                
                font-size: 0.6rem;
                text-align: center;
                padding: 0.15rem 0.45rem;
                margin-right: 0.5rem;
            }
        .firstPartSp3 {
                color: #15BC83;
                border: 1px solid #15BC83;
                border-radius: 2px;                
                font-size: 0.6rem;
                text-align: center;
                padding: 0.15rem 0.45rem;
            }
    
.receive-count {
  margin-right: 0.53rem;
  font-family: PingFang-SC-Regular;
  font-size: 0.6rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0.22rem;
  letter-spacing: 0.01rem;
  color: #d2d2d2;
}
.nomore {
  color: #b4b1b1;
  font-size: 0.6rem;
  text-align: center;
}

.disableBtn {
  border: solid 0.03rem #c4c4c4 !important;
  color: #c4c4c4 !important;
  width: auto !important;
}

.status-label {
  display: inline-block;
  margin-top: 0.79rem;
  float: right;
  font-family: PingFang-SC-Regular;
  font-size: 0.75rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0.22rem;
  letter-spacing: 0.02rem;
  color: #636363;
}

.distance-label {
  display: inline-block;
  margin-top: 0.79rem;
  float: right;
  font-family: PingFang-SC-Regular;
  font-size: 0.6rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0.22rem;
  letter-spacing: 0.01rem;
  color: #636363;
}

.radioDiv {
  margin: 0 auto;
  width: 5.8rem;
  height: 1.68rem;
}

.active {
  background-color: #e84518 !important;
  color: #fff !important;
}

.tab1 {
  text-align: center;
  line-height: 1.68rem;
  width: 4.4rem;
  display: inline-block;
  color: #e84518;
  border-bottom-left-radius: 0.84rem;
  border-top-left-radius: 0.84rem;
  border: solid 0.03rem #e84518;
}

.tab2 {
  text-align: center;
  line-height: 1.68rem;
  width: 4.4rem;
  display: inline-block;
  color: #e84518;
  background-color: #ffffff;
  border-bottom-right-radius: 0.84rem;
  border-top-right-radius: 0.84rem;
  border: solid 0.03rem #e84518;
}

input {
  border: 0;
  outline: none;
}

.search-container {
  margin: 0.45rem 0.75rem;
  position: relative;
  background-color: #ffffff;
  border-radius: 0.83rem;
}

.search-icon {
  width: 1.05rem;
  height: 1.05rem;
  vertical-align: middle;
  margin: 0.4rem;
}

.searchInput {
  width: 80%;
  background-color: #ffffff;
  border-radius: 0.83rem;
  border: #ffffff;
  height: 34px;
  font-size: 12px;
}

.card-container {
  background-color: white;
  margin-bottom: 0.25rem;
}

.card-paddingtop {
  padding-top: 0.45rem;
}

.card-header {
  padding: 0 0.75rem;
  padding-top: 0.43rem;
}

.card-container span {
  display: inline-block;
}

.name {
  font-family: PingFang-SC-Medium;
  font-size: 1rem;
}

.card-body {
  margin: 0.85rem 0;
    margin-top: 0.5rem;
  padding: 0 0.75rem;
}

.card-body-item {
  margin-top: 0.73rem;
}

.tag {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  background-color: #f5f5f5;
  border-radius: 0.2rem;
  font-family: PingFang-SC-Regular;
  font-size: 0.6rem;
  color: #636363;
  text-align: center;
  margin-left: 0.98rem;
}

.tag + span {
  margin-left: 0.5rem;
}

.btn-group {
  float: right;
  padding-bottom: 0.43rem;
}

.body-label {
  font-family: PingFang-SC-Medium;
  font-size: 0.65rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0.22rem;
  letter-spacing: 0.01rem;
  color: #0d0d0d;
}

.body-value {
  font-family: PingFang-SC-Regular;
  font-size: 0.65rem;
  font-weight: normal;
  letter-spacing: 0.01rem;
  color: #636363;
}

.tel {
  font-family: PingFang-SC-Regular;
  font-size: 0.65rem;
  font-weight: normal;
  letter-spacing: 0.01rem;
  color: #1e8dff;
}

.footerBtn {
  width: 4.45rem;
  height: 1.65rem;
  border-radius: 0.83rem;
  border: solid 0.03rem #e84518;
  font-size: 0.6rem;
  color: #d6522d;
  background: #fff;
}

.card-footer {
  margin: 0.4rem 0;
  overflow: hidden;
  padding: 0 0.75rem;
}

.plus {
  font-size: 30px;
}

.searchClass {
  /*position: absolute;*/
  /*top:2.2rem;*/
  width: 100%;
  /*background-color: #ffffff;*/
}

.mint-searchbar {
  padding: 0 !important;
  margin: 0.45rem 0.75rem !important;
}

.cardList {
}
</style>
<script>
import MtButton from "../../../node_modules/mint-ui/packages/button/src/button.vue";
import { MessageBox } from 'mint-ui';
import util from '../../common/util'
import { Loadmore } from 'mint-ui';

export default {
  name: "",
  components: {
    MtButton,
    'v-loadmore': Loadmore,
  },
  data() {
    return {
      grabLoading: false,
      topStatus: '',
      bottomStatus: '',
      headTitle: '抢单记录',
      taskItem: {},
      visible: false,
      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      scrollMode: "auto",//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      id: '',
      tableData: [],
      activeOne: false,
      currentPage: 1,
      pageSize: 20,
      msg: "Hello Vue.js",
      content: '',
      grabCount:false,
      price: {},
    }
  },
  watch: {
  },
  computed: {
    tableDatas: function () {
      let newData = []
      for (let x in this.tableData) {
        let start = this.tableData[x].startTime
        let end = this.tableData[x].endTime
        if (start.substring(0, 10) == end.substring(0, 10)) {
          this.tableData[x].endTime = end.substr(11, 5)
        }
        newData.push(this.tableData[x])
      }
      return newData
    },

  },
  filters: {
    formatTime(val) {
      if (val) {
        return data.substring(0, 5)
      }
    },
    settlementTypeText(val) {
      if (val == 1) {
        return '日结'
      }else if(val == 2){
        return '月结'
      }else if(val == 4){
        return '周结'
      }
    },
    formatminDate(val) {
      if (val.length > 5) {
        console.log(val)
        if (val) {
          return util.minDate(val)
        } else {
          return '无'
        }
      } else {
        return val
      }

    },
    formatStatus(val) {
      if (val == 1) {
        return '待领取'
      } else if (val == 2) {
        return '进行中'
      } else if (val == 3) {
        return '已关闭'
      } else {
        return ''
      }
    },
    formatReceiveStatus(val) {
      if (val == 1) {
        return '待确认'
      } else if (val == 2) {
        return '领取失败'
      } else if (val == 3) {
        return '领取成功'
      } else if (val == 4) {
        return '已放弃'
      } else {
        return ''
      }
    },
    forPrice(val) {
      let data = JSON.parse(val)
      let list = data[0];
      let price = list.price[0]
      let content = ''
      if (list.valuationType == 1) {
        return `${price.countTime}元/小时`
      } else if (list.valuationType == 2) {
        if (list.unit == 1) {
          return `${price.countSettle}元/件`
        } else if (list.unit == 2) {
          return `${price.countDai}元/袋`
        } else if (list.unit == 3) {
          return `${price.countChe}元/车`
        } else {
          return `${price.countDun}元/吨`
        }
      } else if (list.valuationType == 3) {
        let varUnit
        if (list.unit == 1) {
          varUnit = '件'
        } else if (list.unit == 2) {
          varUnit = '袋'
        } else if (list.unit == 3) {
          varUnit = '车'
        } else {
          varUnit = '吨'
        }
        content += `${(price.ladderObj)[0].count}${varUnit}以下（含），${(price.ladderObj)[0].unit}元/${varUnit}`
        for (let i in price.ladderObj) {
          if (i > 0 && i != (price.ladderObj.length - 1)) {
            content += `；${(Number((price.ladderObj)[i - 1].count)) + 1}至${(price.ladderObj)[i].count}${varUnit}（含），${(price.ladderObj)[i].unit}元/${varUnit}`

          }
        }
        content += `；${(price.ladderObj)[price.ladderObj.length - 2].count}${varUnit}以上，${(price.ladderObj)[price.ladderObj.length - 1].overUnit}元/${varUnit}`
        return content
      } else if (list.valuationType == 4) {
        if (price.countSettle) {
          content += `${price.countSettle}元/件,`
        } if (price.countDai) {
          content += `${price.countDai}元/袋,`
        } if (price.countChe) {
          content += `${price.countChe}元/车,`
        } if (price.countDun) {
          content += `${price.countDun}元/吨`
        }
        return content
      } else if (list.valuationType == 5) {
        content += `${price.countTime}元/小时,`
        if (list.unit == 1) {
          content += `${price.countSettle}元/件`
        } else if (list.unit == 2) {
          content += `${price.countDai}元/袋`
        } else if (list.unit == 3) {
          content += `${price.countChe}元/车`
        } else {
          content += `${price.countDun}元/吨`
        }
        return content
      } else if (list.valuationType == 6) {
        content += `${price.countTime}元/小时,`
        let varUnit
        if (list.unit == 1) {
          varUnit = '件'
        } else if (list.unit == 2) {
          varUnit = '袋'
        } else if (list.unit == 3) {
          varUnit = '车'
        } else {
          varUnit = '吨'
        }
        content += `${(price.ladderObj)[0].count}${varUnit}以下（含），${(price.ladderObj)[0].unit}元/${varUnit}`
        for (let i in price.ladderObj) {
          if (i > 0 && i != (price.ladderObj.length - 1)) {
            content += `；${(Number((price.ladderObj)[i - 1].count)) + 1}至${(price.ladderObj)[i].count}${varUnit}（含），${(price.ladderObj)[i].unit}元/${varUnit}`

          }
        }
        content += `；${(price.ladderObj)[price.ladderObj.length - 2].count}${varUnit}以上，${(price.ladderObj)[price.ladderObj.length - 1].overUnit}元/${varUnit}`
        return content
      } else if (list.valuationType == 8) {
        return `${price.countFixed}元/天`
      } else {
        content += `${price.countTime}元/小时,`
        if (price.countSettle) {
          content += `${price.countSettle}元/件,`
        } if (price.countDai) {
          content += `${price.countDai}元/袋,`
        } if (price.countChe) {
          content += `${price.countChe}元/车,`
        } if (price.countDun) {
          content += `${price.countDun}元/吨`
        }
        return content
      }
      // this.content = content
    }
  },
  mounted() {
    this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId;
    this.getList2()
  },
  methods: {
    handleTopChange(status) {
      this.topStatus = status;
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    loadBottom() {//上拉触发的分页查询
      // 上拉加载
      this.currentPage++
      console.log(this.currentPage)
      if (this.activeOne) {
        this.getListMore()
      } else {
        this.getListMore2()
      }
      this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位

    },
    loadTop() {//组件提供的下拉触发方法
      //下拉加载
      //        this.tableData=[]
      this.currentPage = 1
      this.allLoaded = false
      if (this.activeOne) {
        this.getList()
      } else {
        this.getList2()
      }
      this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位

    },
    isHaveMore(isLastPage) {
      if (isLastPage) {
        this.allLoaded = true;
      }
    },
    Robed() {
      this.allLoaded = false
      this.currentPage = 1
      this.activeOne = false
      //        this.tableData=[]
      this.getList2()
    },
    giveup(item) {
      this.taskItem = item
      this.visible = true
    },
    handlegiveup() {
      const params = {
        schedulingTaskReceiveId: this.taskItem.schedulingTaskReceiveId
      }
      this.$api.giveUp(params).then((response) => {
        if (response.data.respCode == 0) {
          this.getList2()
        } else {
          this.$toast(response.data.errorMsg)
        }
        this.getList2()
        this.visible = false
      }).catch((error) => {
        console.log(error);
      });
    },
    //暂时不用这个
    handledelete(item) {
      const params = {
        receiveId: item.receiveId
      }
      this.$api.deteleTask(params).then((response) => {
        console.log(response)
        if (response.data.respCode == 0) {
          this.getList2()
        } else {
          this.$toast(response.data.errorMsg)
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    getList2() {
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.tableData = []
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      }
      this.$api.grabRecordList(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
            isLastPage
          },
        } = response.data;
        this.tableData = list
        this.isHaveMore(isLastPage)
        this.$indicator.close();
      }).catch((error) => {
        console.log(error);
      });
    },
    getListMore2() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      }
      this.$api.grabRecordList(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
            isLastPage
          },
        } = response.data;
        this.tableData = this.tableData.concat(list)
        this.isHaveMore(isLastPage)
        this.$nextTick(function () {
          // 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，
          // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
          // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
          this.scrollMode = "touch";
        });
      }).catch((error) => {
        console.log(error);
      });
    },
    click() {
      MessageBox({
        title: '您需要先完善个人信息才能签协议',
        message: '您需要先完善个人信息才能签协议?',
        showCancelButton: true
      });
    },
    routeToDetail(item) {
      this.$router.push({
        name: 'taskDetail',
        query: item
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    sessionStorage.setItem('scrollTop', this.scrollTop)
    console.log(this.scrollTop)
    next()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log(from.name)
      if (from.name == 'taskDetail') {
        let scrollTop = sessionStorage.getItem('scrollTop')
        console.log(scrollTop)
        window.scrollTo(0, scrollTop);
      } else {
        vm.getList2()
      }
    })
  },


}
</script>

