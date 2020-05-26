<template>
    <div class="lanuchedCon">
        <div class="flex head">
            <div class="selectBox flex firstSelect" @click="nationVisible = true">
                <span class="month">{{checkMonth ? checkMonth : '月份'}}</span>
                <img src="../../assets/img/arrow_bottom.png" alt="箭头" class="arrow">
            </div>
            <div class="selectBox flex secondSelect" @click="typeVisible = true">
                <span class="month">{{settleType ? settleType : '结算方式'}}</span>
                <img src="../../assets/img/arrow_bottom.png" alt="箭头" class="arrow">
            </div>
        </div>
        <div class="text" v-if="show">暂无已发放收入</div>
        <div class="" v-else>
            <div class="info flex">
                <span>{{month ? month : '全部月份'}}</span>
                <span>￥{{totalAmount | priceFormat}}</span>
            </div>
        </div>
        <div :style="{'-webkit-overflow-scrolling': scrollMode}" v-if="!show" class="listCon">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                        :auto-fill="false" ref="lanuchedLoadmore" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange">
            <div class="sublistCon"   v-for="(item,index) in date" :key="index">
                <div class="topPart">
                    <div class="top flex">
                        <div class="flex providerLeft">
                            <div class="">发放人：</div>
                            <span class="">{{item.payAboutFinance}}</span>
                        </div>
                        <div>{{item.totalAmount | priceFormat}}</div>
                    </div>
                    <div class="flex commonFlex">
                        <div class="dateText">批次：</div>
                        <div class="batchNumber">{{item.batchNumber}}</div>
                        <!--<div class="flex divide">

                            <div class="dateText">付款日期：</div>
                            <div class="batchNumber">{{item.payDate}}</div>

                        </div>-->
                    </div>
                    <div class="flex commonFlex">
                        <div class="divide flex">
                                <div >结算方式：</div>
                                <div class="batchNumber">{{item.settlementType | formaterType}}</div> 
                            </div>
                            <div class="divide flex">
                                <div>类型：</div>
                                <div class="batchNumber">{{item.payType | formaterPaytype}}</div>                            
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
                        <div class="checkRecord">
                            <div class="detail" @click="goToCollectionRecord(item)">付款记录</div>
                        </div>
                        <div class="detailBox">
                            <div class="detail" @click="routeToDetail(item)">收入详情</div>
                        </div>
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
        <mt-popup v-model="nationVisible" position="bottom" class="mint-popup">
            <mt-picker :slots="nationList" :visible-item-count="5" :show-toolbar="true" ref="natitonPicker"
                       value-key="className">
                <div @click="handleConfirm" class="sure">确认</div>
            </mt-picker>
        </mt-popup>
        <mt-popup v-model="typeVisible" position="bottom" class="mint-popup">
            <mt-picker :slots="typeList" :visible-item-count="5" :show-toolbar="true" ref="typePicker"
                       value-key="label">
                <div @click="typeConfirm" class="sure">确认</div>
            </mt-picker>
        </mt-popup>
    </div>
</template>

<script>
    export default {
        name: "lanuched",
        filters: {
            formaterType: function (val) {
                if (val == '4') {
                    return '周结'
                } else if (val == '1') {
                    return '日结'
                } else if (val == '2') {
                    return '月结'
                }
            },
            formaterPaytype: function (val) {
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
                allLoaded: false,
                show: false,
                scrollMode: "auto",
                nationVisible: false,
                nationList: [
                    {
                        flex: 1,
                        values: [],
                        className: "slot1",
                        textAlign: "center",
                    },

                ],
                typeVisible: false,
                typeList: [
                    {
                        flex: 1,
                        values: [
                            {
                                label: '全部类型',
                                value: ''
                            },
                            {
                                label: '月结',
                                value: 2
                            },
                            {
                                label: '周结',
                                value: 4
                            },
                            {
                                label: '日结',
                                value: 1
                            },
                        ],
                        className: "slot3",
                        textAlign: "center"
                    }

                ],
                date: [],
                settleType: '',
                totalAmount: 0,
                month: '',
                settleTypevalue: '',
                currentPage: 1,
                checkMonth: ''
            }
        },
        mounted() {
            this.getList()
            this.getMonth()
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
                this.$refs.lanuchedLoadmore.onTopLoaded();
            },
            loadBottom(){
                console.log('loadBottom')
                this.currentPage++
                this.getListMore()
                this.$refs.lanuchedLoadmore.onBottomLoaded();
            },
            
            handleConfirm() {
                let getValue = this.$refs.natitonPicker.getValues()[0];
                this.nationVisible = false;
                if( getValue == '全部月份' ){
                    this.month = '';
                    this.checkMonth = '';
                    this.getList();
                }else{
                    this.month = getValue;
                    this.checkMonth = getValue;
                    this.getList();
                }
            },
            typeConfirm() {
                this.settleType = this.$refs.typePicker.getValues()[0].label
                this.settleTypevalue = this.$refs.typePicker.getValues()[0].value
                this.getList()
                this.typeVisible = false
            },
            getList() {
                const params = {
                    payStatus: 2,
                    settlementType: this.settleTypevalue,
                    month: this.month,
                    pageNum: this.currentPage,
                    pageSize: 20,
                };
                this.$api.searchSalary(params).then(res => {
                        if (res.data.respCode == 0) {
                            if (res.data.data.lists.list) {
                                this.date = res.data.data.lists.list
                                this.totalAmount = res.data.data.totalAmount
                                this.isHaveMore(res.data.data.lists.isLastPage)
                                this.show = false
                            } else {
                                this.show = true
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    });
            },
            getMonth() {
                this.$api.getMonthRNP().then(res => {
                        if (res.data.respCode == 0) {
                            let data = res.data.data
                            this.nationList[0].values.push('全部月份')
                            for (let i in data) {
                                this.nationList[0].values.push(data[i])
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
                    payStatus: 2,
                    settlementType: this.settleTypevalue,
                    month: this.month,
                    pageNum: this.currentPage,
                    pageSize: 20,
                };
                this.$api.searchSalary(params).then(res => {
                        if (res.data.respCode == 0) {
                            let tempStore = Object.assign([],this.date);
                            Array.prototype.push.apply(tempStore,res.data.data.lists.list);
                            this.date = tempStore;
                            this.totalAmount = res.data.data.totalAmount
                            this.isHaveMore(res.data.data.lists.isLastPage)
                            this.$nextTick(function () {
                                this.scrollMode = "touch";
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    });
            },
            routeToDetail(row) {
                this.$router.push({
                    name: 'SalaryBilled',
                    query: {
                        talentId:row.talentId,
                        batchNumber:row.batchNumber,
                        customerId: row.customerId,
                        payStatus:row.payStatus,
                        payType:row.payType,
                        outsourcingCusId:row.outsourcingCusId,
                    }
                })
            },
            goToCollectionRecord(row){
                this.$router.push({
                    path:'/collectionRecord',
                    query: {
                        talentId:row.talentId,
                        batchNumber:row.batchNumber,
                        customerId: row.customerId,
                        payType:row.payType,
                        payStatus:row.payStatus,
                        outsourcingCusId:row.outsourcingCusId,
                    }
                });
            },
        },  
        beforeRouteEnter(to, from, next) {
            if(from.name != 'SalaryBilled'){
                next(vm => {
                    vm.getList();
                    vm.getMonth();
                })
            }
        },
    }
</script>
<style scoped lang="scss">
    .info {
        font-size: 0.6rem;
        color: #636363;
        justify-content: space-between;
        padding-left: convertToVw(15);
        padding-right: convertToVw(15);
        padding-top:convertToVw(8); 
        padding-bottom:convertToVw(8);         
        border-top: 1px solid #D9D9D9;
    }
    .sublistCon {        
        background-color: #fff;
        border-bottom: 1px solid #D9D9D9;
        border-top: 1px solid #D9D9D9;
        box-sizing: border-box; 
        margin-bottom: convertToVw(20);
    }
    .divide {
        width: 50%;
    }
      .topPart {
          background-color: #fff;
          padding-top: convertToVw(15);
        padding-bottom: convertToVw(8);
        box-sizing: border-box;
        padding-left: convertToVw(15);
        padding-right: convertToVw(15);
    }
    .checkRecord {
        margin-right: convertToVw(10);
    }
    .lanuchedCon {
        background-color: #f5f5f5;
        padding-top: convertToVw(40);
        padding-bottom: convertToVw(20);
    }
    .top {
        justify-content: space-between; 
        color: #1E1F21;
        font-size: convertToVw(17);
    }
    .bottom {
        background-color: #fff;
        justify-content:flex-end;
        padding-right: convertToVw(15);
        box-sizing: border-box;
        padding-top: convertToVw(8);
        padding-bottom: convertToVw(8);
        border-top: 1px solid #D9D9D9;
    }
    .date {
        font-size: 0.6rem;
        color: #636363;
        line-height: 1.3rem;
    }
    .bottomInfo {
        text-align: center;        
    }
    .detailBox {
        justify-content: flex-start;
        align-items: center;
    }
    .commonFlex {
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
    .detail {
        color: #EA441A;
        width: convertToVw(76);
        height: convertToVw(30);
        font-size: convertToVw(13);
        line-height: convertToVw(30);
        text-align: center;
        box-sizing: border-box;
        border-radius: 2px;
        border: 1px solid #EA441A;
    }
    .arrow {
        width: 0.43rem;
        height: 0.25rem;
    }
    .month {
        font-size: 0.7rem;
        color: #636363;
        margin-right: 0.25rem;
    }
    .selectBox {
        justify-content: center;
        align-items: center;
        padding-right: convertToVw(15);
    }
    .secondSelect {
        padding-left: convertToVw(10);
    }
    .head {
        justify-content:flex-start;
        align-items: center;
        padding-left: convertToVw(15);
        padding-right: convertToVw(15);
        padding-top: convertToVw(10);
        padding-bottom: convertToVw(10);
        background-color: #fff;
    }
    .sure {
        float: right;
        padding: 5px;
        color: #666;
        margin: 5px 5px 0 0;
    }
    .text {
        text-align: center;
        color: #636363;
        margin-top: 5rem;
    }
</style>