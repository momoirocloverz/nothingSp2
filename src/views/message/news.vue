<template>
    <div class="news-3011">
        <div class="text tc pt15" v-if="show">暂无系统消息</div>
        <div :style="{'-webkit-overflow-scrolling': scrollMode}" v-if="!show" class="listCon">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                        :auto-fill="false" ref="newsLoadmore" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange">
                <ul>
                    <li class="item-li" v-for="(item,index) in date" :key="index"
                    >
                        <div class="item-li-t">
                            <div class="item-title f16">
                                <img src="../../assets/img/shouru@2x.png" alt="">
                                收入发放通知
                            </div>
                            <div>
                                <span class="co-999">{{item.createdAt | dateFor}}</span>
                            </div>
                        </div>
                        <div class="item-li-b co-666 pt10 f14">
                            {{item.title}}
                        </div>
                    </li>
                </ul>
                <div slot="top" class="mint-loadmore-top">
                    <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
                    <span v-show="topStatus === 'loading'"><mt-spinner  type="snake"></mt-spinner></span>
                  </div>
                   <div slot="bottom" class="mint-loadmore-bottom">
                        <span v-show="bottomStatus !== 'loading'"
                              :class="{ 'rotate': bottomStatus === 'drop' }">↑</span>
                        <span v-show="bottomStatus === 'loading'"><mt-spinner type="snake"></mt-spinner></span>
                    </div>
                <div class="bottomInfo pt5 pb15" v-if="allLoaded"> 没有更多了</div>
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
            dateFor: function(val){
                if (val) {
                    let t = val.substring(0,10)
                    return `${t.replace(/-/g,'/')}`
                } else{
                    return '-'
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
                ids:[],
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
                this.$refs.newsLoadmore.onTopLoaded();
            },
            loadBottom(){
                this.currentPage++
                this.getListMore()
                this.$refs.newsLoadmore.onBottomLoaded();
            },
            goDetail(row) {
                this.$router.push({
                    name: 'messageDetails',
                    query: Object.assign({title:'系统消息',type:'1'},row)
                })
            },
            changeStatus(){
                let ids = this.ids.join(',');
                this.$api.changeStatus({
                    ids:ids
                }).then(res=>{
                    console.log(res)
                })
            },
            getList() {
                let talentId = JSON.parse(localStorage.getItem('userInfo')).talentId
                const params = {
                    type: 0,
                    talentId:talentId,
                    pageNum: this.currentPage,
                    pageSize: 20,
                };
                this.$api.logPushRecord(params).then(res => {
                        console.log(res)
                        if (res.data.respCode == 0) {
                            if (res.data.data.list) {
                                this.date = res.data.data.list;
                                this.totalAmount = res.data.data.total;
                                this.isHaveMore(res.data.data.isLastPage);
                                this.ids = [...res.data.data.list.map( i=> i.id)];
                                this.changeStatus()
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
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .news-3011{
        padding-top: convertToVw(40);
        background:#F5F5F5;
        .bottomInfo {
            text-align: center;
        }
        ul{
            background:#F5F5F5;
            .item-li{
                margin:convertToVw(12);
                padding: convertToVw(12);
                background-color: #fff;
                border-radius:convertToVw(4);
                .item-li-t{
                    display: flex;
                    justify-content:space-between;
                    align-items: center;
                    color: #333333;
                    .item-title{
                        display: flex;
                        justify-content:flex-start;
                        align-items: center;
                    }
                    img{
                        display: flex;
                        width: convertToVw(20);
                        height: convertToVw(20);
                        margin-right: convertToVw(12);
                    }
                }

            }
        }
    }
</style>