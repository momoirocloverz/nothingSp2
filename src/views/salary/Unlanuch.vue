<template>
    <div class="unlanuchCon">
        <div class="text" v-if="show">暂无待发放收入</div>
        <div v-else>
            <div class="info flexable">
                <span>总计</span>
                <span>￥{{totalAmount | priceFormat}}元</span>
            </div>
        </div>
        <div :style="{'-webkit-overflow-scrolling': scrollMode}" v-if="!show" class="listCon">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                        :auto-fill="false" ref="unlanuchLoadmore" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange">
                <div class="itemCon" v-for="(item,index) in date" :key="index">
                    <div class="topPart">
                        <div class="top flex">
                            <div class="firstLineTextCon">
                                <span>发放人：</span>
                                <span>{{item.payAboutFinance}}</span>
                            </div>
                            <div>
                                <span>{{item.totalAmount | priceFormat }}</span>
                            </div>
                        </div>
                        <div class="date flex">
                            <div class="dateText">批次：</div>
                            <div class="batchNumber">{{item.batchNumber}}</div>
                        </div>
                        <div class="date flex">
                            <div class="subDivide flex">
                                <div>结算方式：</div>
                                <div class="batchNumber">{{item.settlementType | formaterType}}</div> 
                            </div>
                            <div class="subDivide flex">
                                <div>类型：</div>
                                <div class="batchNumber">{{item.outsourcingCusName | formaterPaytype}}</div>
                            </div>
                        </div>
                        <div class="date flex" v-show="item.outsourcingCusName">
                            <div class="subDivide flex">
                                <div>外包商：</div>
                                <div class="batchNumber">{{item.outsourcingCusName}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="bottom flex">
                        <div class="detail"  @click="routeToDetail(item)">收入详情</div>
                    </div>
                </div>
                <div slot="top" class="mint-loadmore-top">
                    <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
                    <span v-show="topStatus === 'loading'"><mt-spinner  type="snake"></mt-spinner></span>
                  </div>
                   <div slot="bottom" class="mint-loadmore-bottom">
                        <span v-show="bottomStatus !== 'loading'"
                              :class="{ 'rotate': bottomStatus === 'drop' }">↑</span>
                        <span v-show="bottomStatus === 'loading'"><mt-spinner type="snake"></mt-spinner></span>
                    </div>
                <div class="bottomInfo" v-if="allLoaded"> 没有更多了</div>
<!--                    <div class="bottomInfo" v-else> 下拉加载更多</div>-->
            </mt-loadmore>
        </div>
    </div>
</template>

<script>
    export default {
        name: "unlanuch",
        filters: {
            formaterType: function (val) {
                if (val == '4') {
                    return '周结'
                } else if (val == '1') {
                    return '日结'
                } else if (val == '2') {
                    return '月结'
                }
            }, formaterPaytype: function (val) {
                if (val) {
                    return '外包费用'
                } else{
                    return '代发收入'
                }
            },
            priceFormat:function(val){
                if( (toString.call(val) === '[object Null]')||(toString.call(val) === '[object Undefined]')  ){
                   return 0;
                }else{
                    let fix = (Math.round(+val + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },
        },
        data() {
            return {
                topStatus:'',
                bottomStatus:'',
                date: [],
                totalAmount: 0,
                currentPage: 1,
                allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
                scrollMode: "auto",//touch为弹性滚动，auto是非弹性滚动
                show: false
            }
        },
        mounted() {            
            this.getList();
        },
        methods: {        
            handleTopChange(status){
                this.topStatus = status;
            },
            handleBottomChange(status){
                this.bottomStatus = status;
            },
            loadTop(){
                this.currentPage = 1
                this.allLoaded = false
                this.getList();
                this.$refs.unlanuchLoadmore.onTopLoaded();
            },
            loadBottom(){
                this.currentPage++
                this.getListMore()
                this.$refs.unlanuchLoadmore.onBottomLoaded();
            },
            routeToDetail(row) {
                this.$router.push({
                    name: 'SalaryBill',
                    query: {
                        batchNumber:row.batchNumber,
                        customerId: row.customerId,
                        payStatus:row.payStatus,
                        payType:row.payType,  
                        talentId:row.talentId,
                        outsourcingCusId:row.outsourcingCusId,
                    }
                })
            },
            getList() {
                const params = {
                    payStatus: 1,
                    pageNum: this.currentPage,
                    pageSize: 20,
                };
                this.$api.searchSalary(params).then(res => {
                        if (res.data.respCode == 0) {
                            if (res.data.data.lists.list) {
                                this.date = res.data.data.lists.list;
                                this.totalAmount = res.data.data.totalAmount;
                                this.isHaveMore(res.data.data.lists.isLastPage);
                                this.show = false;
                            } else {
                                this.show = true
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    });
            },
            isHaveMore(isLastPage) {
                if (isLastPage) {
                    this.allLoaded = true;
                }
            },
            getListMore() {
                const params = {
                    payStatus: 1,
                    pageNum: this.currentPage,
                    pageSize: 20,
                };
                this.$api.searchSalary(params).then(res => {
                        if (res.data.respCode == 0) {
                            let tempStore = Object.assign([],this.date);
                            Array.prototype.push.apply(tempStore,res.data.data.lists.list);
                            this.date = tempStore;
                            this.totalAmount = res.data.data.totalAmount;
                            this.isHaveMore(res.data.data.lists.isLastPage);
                            this.$nextTick(function () {
                                this.scrollMode = "touch";
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    });
            },
        },   
    }
</script>
<style scoped lang="scss">
    .info {
        font-size: convertToVw(13);
        color: #636363;
        justify-content: space-between;
        padding: 0.48rem 0;
        box-sizing: border-box;
        padding-left: convertToVw(15);
        padding-right: convertToVw(15);
    }
    .unlanuchCon {
        width: 100%;
        background-color: #f5f5f5;
        padding-top: convertToVw(40);
        padding-bottom: convertToVw(20);
    }
    .top {
         justify-content: space-between; 
        .firstLineTextCon {
            color: #1E1F21;
            font-size: convertToVw(17);
        }        
    }
    .bottom {
        justify-content:flex-end;
        padding-right: convertToVw(15);
        box-sizing: border-box;
        padding-top: convertToVw(8);
        padding-bottom: convertToVw(8);
        border-bottom: 1px solid #D9D9D9;
        background-color: #fff;
        margin-bottom: convertToVw(20);
        border-bottom: 1px solid #D9D9D9;
    }
    .subDivide {
        width: 50%;
    }
    .date {
        justify-content: flex-start;
        font-size: convertToVw(13);
        height: convertToVw(13);
        line-height: convertToVw(13);
        color: #636363;
        margin: convertToVw(8) auto convertToVw(8);
        .dateText {
            margin-right: convertToVw(5);
        }
        .batchNumber {
            color: #1E1F21;
        }
    }
    .topPart {
        padding-top: convertToVw(15);
        padding-bottom: convertToVw(8);
        border-bottom: 1px solid #D9D9D9;
        box-sizing: border-box;
        padding-left: convertToVw(15);
        padding-right: convertToVw(15);
        background-color: #fff;
        border-top: 1px solid #D9D9D9;
    }
    .detail {
        color: #EA441A;
        width: convertToVw(76);
        height: convertToVw(30);
        font-size: convertToVw(13);
        line-height: convertToVw(30);
        text-align: center;
        border-radius: 2px;
        border: 1px solid #EA441A;
        box-sizing: border-box;
    }
    .text {
        text-align: center;
        color: #636363;        
        margin-top: 5rem;
    }
    .bottomInfo {
        text-align: center;        
    }
</style>