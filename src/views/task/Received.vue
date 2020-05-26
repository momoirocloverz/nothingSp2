<template>
    <div>
        <mt-header title="领工单" fixed>
            <div slot="left">
                <mt-button icon="back" @click="$router.back(-1)"></mt-button>
            </div>
        </mt-header>
        <div class="container"  style="background-color: #F5F5F5;padding-bottom: 2.2rem" >
            <!--<mt-search class="searchClass"-->
            <!--autofocus-->
            <!--v-model="value"-->
             <!--placeholder="请输入项目经理姓名搜索"-->
            <!--:result="filterResult">-->
            <!--</mt-search>-->
            <div :style="{'-webkit-overflow-scrolling': scrollMode}">
                <v-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
            <div class="card-container card-paddingtop" style="background-color: white;" v-for="item in tableDatas" @click="routeToDetail(item)">
                <div class="card-header">
                    <span class="name">{{item.taskName}}</span>
                    <span class="tag">{{item.industryName}}</span>
                    <span class="tag">{{item.settlementTypeName}}</span>
                    <span class="status-label" v-if="item.receiveStatus==3 && item.status!=3">进行中</span>
                    <span class="status-label" v-if="item.receiveStatus==5 && item.status!=3">已取消</span>
                    <span class="status-label" v-if="item.status==3">已结束</span>
                </div>
                <div class="card-body">
                    <div class="card-body-item">
                        <span class="body-label">发 布 人：</span>
                        <span class="body-value">{{item.publishName}}</span>
                    </div>
                    <div class="card-body-item">
                        <span class="body-label">起止时间：</span>
                        <span class="body-value">{{item.startTime | formatminDate}} 至 {{item.endTime | formatminDate}}</span>
                    </div>
                    <!--<div class="card-body-item">-->
                        <!--<span class="body-label">上下班时间：</span>-->
                        <!--<span class="body-value">{{item.workStartTime | formatTime}} 至 {{item.workEndTime | formatTime}}</span>-->
                    <!--</div>-->
                    <div class="card-body-item text-overflow">
                        <span class="body-label">工作地点: </span>
                        <span class="body-value">{{item.workingPlace}}</span>
                    </div>
                </div>
                <div class="card-footer ">
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

    </div>
</template>
<style scoped lang="scss">
    .nomore{
        color: #b4b1b1;
        font-size: 0.6rem;
        text-align: center;
        padding-top: 1rem;
        padding-bottom: 2rem;
    }
    .status-label{
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
    .radioDiv{
        margin: auto;
        width:5.8rem;
        height:1.68rem;
    }
    .active{
        background-color: #fff;
        color: #e84518 !important;
    }
    .tab1{
        text-align: center;
        line-height: 1.68rem;
        width:2.83rem;
        display: inline-block;
        color: #ffffff;
        border-bottom-left-radius: 0.84rem;
        border-top-left-radius: 0.84rem;
        border: solid 0.03rem #ffffff;
    }
    .tab2{
        text-align: center;
        line-height: 1.68rem;
        width:2.83rem;
        display: inline-block;
        color: #ffffff;
        border-bottom-right-radius: 0.84rem;
        border-top-right-radius: 0.84rem;
        border: solid 0.03rem #ffffff;
    }
    input{border:0;outline:none;}
    .search-container{
        margin:0.45rem 0.75rem;
        position: relative;
        background-color: #ffffff;
        border-radius: 0.83rem;
    }
    .search-icon{
        width: 1.05rem;
        height: 1.05rem;
        vertical-align: middle;
        margin:0.4rem;
    }
    .searchInput{
        width:80%;
        background-color: #ffffff;
        border-radius: 0.83rem;
        border:#ffffff;
        height: 34px;
        font-size: 12px;
    }
    .card-container{
        background-color: white;
        margin-bottom:0.25rem ;
    }
    .card-paddingtop{
        padding-top: 0.45rem;
    }

    .card-header{
        padding:  0 0.75rem;
       padding-top: 0.43rem;
    }
    .card-container span{
        display: inline-block;
    }
    .name{
        font-family: PingFang-SC-Medium;
        font-size: 1rem;
    }
    .card-body{
        margin: 0.85rem 0;
        padding: 0 0.75rem ;
    }
    .card-body-item{
        margin-top: 0.73rem;
    }
    .tag{
        display: inline-block;
        padding:0.15rem 0.45rem;
        background-color: #f5f5f5;
        border-radius: 0.2rem;
        font-family: PingFang-SC-Regular;
        font-size: 0.6rem;
        color: #636363;
        text-align: center;
        margin-left: 0.98rem;
    }
    .tag+span{
        margin-left: 0.5rem;
    }
    .btn-group{
        float: right;
        padding-bottom: 0.43rem;
    }
    .body-label{
        font-family: PingFang-SC-Medium;
        font-size: 0.65rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0.22rem;
        letter-spacing: 0.01rem;
        color: #0d0d0d;
    }
    .body-value{
        /*font-family: PingFang-SC-Regular;*/
        font-size: 0.65rem;
        font-weight: normal;
        letter-spacing: 0.01rem;
        color: #636363;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .tel{
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
    .card-footer{
        margin:0.4rem 0;
        overflow:hidden;
        padding: 0 0.75rem ;
    }



    .plus{
        font-size: 30px;
    }
    .searchClass{
        /*position: absolute;*/
        /*top:2.2rem;*/
        width: 100%;
        /*background-color: #ffffff;*/
    }
    .mint-searchbar{
        padding: 0 !important;
        margin: 0.45rem 0.75rem !important;
    }
    .cardList{

    }
</style>
<script>
  import MtButton from "../../../node_modules/mint-ui/packages/button/src/button.vue";
  import { MessageBox } from 'mint-ui';
  import util from '../../common/util'
  import {Loadmore} from 'mint-ui';
  export default {
    name: "Received",
    components: {MtButton,
      'v-loadmore':Loadmore,},
    data() {
      return {
        topStatus: '',
        bottomStatus: '',
        allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode:"auto",//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        id:'',
        tableData:[],
        activeOne:true,
        currentPage:1,
        pageSize:20,
        msg: "Hello Vue.js",
        content:'',
        price:{},
      }
    },
    filters:{
      formatTime(val){
        if(val){
          return val.substring(0,5)
        }
      },
      formatminDate(val) {
        if(val.length>5){
          console.log(val)
          if (val) {
            return util.minDate(val)
          } else {
            return '无'
          }
        }else{
          return val
        }

      },
      formatStatus(val){
        if(val==1){
          return '待领取'
        }else if(val==2){
          return '进行中'
        }else if(val==3){
          return '已关闭'
        }else{
          return ''
        }
        return util.minDate(val)
      },
    },
    mounted(){
      this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId;
      this.getList()
    },
    computed:{
      tableDatas:function () {
        let newData=[]
        for(let x in this.tableData){
          let start = this.tableData[x].startTime
          let end = this.tableData[x].endTime
          if(start.substring(0,10)==end.substring(0,10)){
            this.tableData[x].endTime=end.substr(11,5)
          }
          newData.push(this.tableData[x])
        }
        return newData
      },

    },
    methods: {
      handleTopChange(status) {
        this.topStatus = status;
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom(){//上拉触发的分页查询
        // 上拉加载
        this.currentPage++
          this.getListMore()
        this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位

      },
      loadTop(){//组件提供的下拉触发方法
        //下拉加载
//        this.tableData=[]
        this.currentPage=1
        this.allLoaded=false
        this.getList();
        this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位

      },
      isHaveMore(isLastPage){
        if(isLastPage){
          this.allLoaded = true;
        }
      },
      isHaveMore(isLastPage){
        if(isLastPage){
          this.allLoaded = true;
        }
      },
      getList(){
        this.$indicator.open({
          spinnerType: 'fading-circle'
        });
        const params ={
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          receiptType:2,
          receiveStatusList:[3,5],
          receiveUserId:this.id ,
        }
        console.log(params)

        this.$api.receiveTaskList(params).then((response) => {
          const {
            data: {
              list,
              pages,
              total,
              pageNum,
              isLastPage
            },
          } = response.data;
          this.$indicator.close();
          this.tableData=list
          this.isHaveMore(isLastPage)
          this.pageCount=pages
          this.price = JSON.parse(this.tableData.price)

        }).catch((error) => {
          console.log(error);
        });
      },
      getListMore(){
        const params ={
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          receiptType:2,
          receiveStatusList:[3,5],
          receiveUserId:this.id ,
        }
        console.log(params)

        this.$api.receiveTaskList(params).then((response) => {
          const {
            data: {
              list,
              pages,
              total,
              pageNum,
            },
          } = response.data;
          this.tableData=this.tableData.concat(list)
          this.isHaveMore(isLastPage)
          this.pageCount=pages
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
      click(){
        MessageBox({
          title: '您需要先完善个人信息才能签协议',
          message: '您需要先完善个人信息才能签协议?',
          showCancelButton: true
        });
      },
      routeToDetail(item){
        this.$router.push({
            name: 'taskDetail',
            query: {
                id: item.id
            }
        });
      }
    },
  }
</script>

