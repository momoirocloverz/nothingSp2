<template>
    <div>
        <mt-header :title="headTitle" fixed>
            <div slot="left" v-if="shareType != 1">
                <mt-button icon="back" v-if="activeOne" @click="$router.back(-1)"></mt-button>
                <mt-button icon="back" v-if="!activeOne" @click="activeOne=true"></mt-button>
            </div>
            <div v-if="shareType != 1" class="mint-header-button is-right" slot="right">
                <mt-button @click="Robed">领取记录</mt-button>
            </div>
        </mt-header>
        <Menu class="task-menu" @screenMenu='screen'/>
        <div class="container" style="background-color: #F5F5F5;top:4.6rem;z-index: 1;padding-bottom:2.55rem;">
            <div class="share-box" v-if="shareType == 1">
                <div @click="go('/task')" class="share-l">
                    <img class="share-icon" src="../../assets/img/jxb-icon.png" alt="">
                    <div class="share-title">
                        <h3>万才佳薪宝</h3>
                        <span>一个能赚钱的APP，让你薪上加薪！</span>
                    </div>
                </div>
                <div @click="go('/shareApp')" class="share-btn">
                    下载
                </div>
            </div>
            <div class="splitline"></div>
            <div :style="{'-webkit-overflow-scrolling': scrollMode}">
                <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"
                            @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange">
                    <div class="card-container card-paddingtop" style="background-color: white;"
                         v-for="(item,index) in tableDatas" :key="index">
                        <div class="card-header" @click="routeToDetail(item)">
                            <span class="name">{{item.taskName}}</span>
                            <span class="tag" v-if="item.industryName">{{item.industryName}}</span>
                            <!--<span class="tag">{{item.schedulingName}}</span>-->
                            <span class="tag">{{item.settlementType | settlementTypeText}}</span>
                            <span class="status-label" v-if="!activeOne && item.receiveStatus==1">待对方确认</span>
                            <span class="status-label"
                                  v-if="!activeOne &&(item.receiveStatus==3|| item.receiveStatus==5)">领取成功</span>
                            <span class="status-label" v-if="!activeOne && item.receiveStatus==2">领取失败</span>
                            <span class="status-label" v-if="!activeOne && item.receiveStatus==4">已放弃</span>
                            <span v-show="shareType != 1 && isPos" class="distance-label">{{item.distance | formatDistance}}</span>
                            <!--<span v-if="shareType != 1" class="distance-label">{{item.range}}</span>-->
                        </div>
                        <div class="card-body" @click="routeToDetail(item)">
                            <div class="card-body-item ">
                                <span class="body-label">发 布 人：</span>
                                <span class="body-value">{{item.managerName}}</span>
                                <span class="body-label " v-if="activeOne" style="margin-left:3.5rem">所需人数：</span>
                                <span class="body-value" v-if="activeOne">{{item.maxWorker}}</span>
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
                                <span class="receive-count"
                                      v-if="activeOne">{{item.grabCount? item.grabCount:0}}人已抢</span>
                                <mt-button type="default" v-if="activeOne && !item.grabDisabled" class="footerBtn"
                                           @click="grab(item)" :disabled="grabLoading">我要抢
                                </mt-button>
                                <mt-button type="default" v-if="activeOne && item.grabDisabled" :disabled="grabDisabled"
                                           class="footerBtn disableBtn">已抢，等待对方确认
                                </mt-button>
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
                        <span v-show="bottomStatus !== 'loading'"
                              :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                        <span v-show="bottomStatus === 'loading'">
              <mt-spinner type="snake"></mt-spinner>
            </span>
                    </div>
                    <p class="nomore pt15 pb15" v-if="allLoaded"> 没有更多记录了</p>
                    <p class="nomore pt15 pb15" v-else-if="tableDatas.length < 1"> 暂无相关工单信息</p>
                    <p class="nomore pt15 pb15" v-else> 下拉加载更多</p>
                </v-loadmore>
            </div>
        </div>
    </div>
</template>
<style scoped>
    /*header{*/
    /*width: 100%;*/
    /*height: 2.2rem;*/
    /*background-color: #e84518;*/
    /*position:fixed;*/
    /*z-index: 999999999;*/
    /*top: 0px; left:0px; bottom:0px;*/
    /*font-family: PingFang-SC-Medium;*/
    /*font-size: 0.75rem;*/
    /*font-weight: normal;*/
    /*font-stretch: normal;*/
    /*line-height: 0rem;*/
    /*letter-spacing: 0.04rem;*/
    /*}*/
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

    .task-menu {
        position: absolute;
        left: 0;
        right: 0;
        top: 2.2rem;
        height: 2.4rem;
        z-index: 10;
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
        margin-top: 0.59rem;
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
    import BaiduMap from '../../common/baidu-map'
    import {MessageBox} from 'mint-ui';
    import util from '../../common/util'
    import {Loadmore} from 'mint-ui';
    import Menu from './component/dropdownMenu';
    import wx from 'weixin-js-sdk';

    export default {
        name: "PanicList",
        components: {
            MtButton,
            Menu,
            'v-loadmore': Loadmore,
        },
        data() {
            return {
                grabLoading: false,
                topStatus: '',
                bottomStatus: '',
                headTitle: '工单市场',
                taskItem: {},
                visible: false,
                position: {},
                isPos:false,
                allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
                scrollMode: "auto",//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
                id: '',
                BMap: '',
                talentId: '',
                talentName: '',
                tableData: [],
                activeOne: true,
                currentPage: 1,
                pageSize: 20,
                pageCount: 0,
                distance: '',//经纬度算出来的距离
                msg: "Hello Vue.js",
                content: '',
                shareType: sessionStorage.getItem('shareType'),
                price: {},
                grabDisabled: false,
                iosUrl: 'https://itunes.apple.com/cn/app/id1477306402?mt=8',
                androidUrl: '',
                valuationType: '',//智能排序
                industry: '', //工种
                loginTalentSex: '',//性别
                orderType: '',//计价方式
            }
        },
        watch: {},
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
            }, settlementTypeText(val) {
                if (val == 1) {
                    return '日结'
                } else if (val == 2) {
                    return '月结'
                } else if (val == 4) {
                    return '周结'
                }
            },
            formatDistance(val) {
//                console.log(val)
                if (val) {
                    let value = Number(val)
                    if (value < 1000) {
                        return value + '米'
                    } else {
                        value = (value / 1000).toFixed(2)
                        return value + '公里'
                    }
                } else {
                    return ''
                }

            },
            formatminDate(val) {
                if (val.length > 5) {
//                    console.log(val)
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
                    }
                    if (price.countDai) {
                        content += `${price.countDai}元/袋,`
                    }
                    if (price.countChe) {
                        content += `${price.countChe}元/车,`
                    }
                    if (price.countDun) {
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
                    }
                    if (price.countDai) {
                        content += `${price.countDai}元/袋,`
                    }
                    if (price.countChe) {
                        content += `${price.countChe}元/车,`
                    }
                    if (price.countDun) {
                        content += `${price.countDun}元/吨`
                    }
                    return content
                }
                // this.content = content
            }
        },
        created() {
            if(sessionStorage.position){
                this.isPos = true
                this.position = JSON.parse(sessionStorage.getItem('position'))
            }else{
                this.isPos = false
                // this.$router.push({ path: "/home" ,query:{isFirst:true}});
            }
        },
        mounted() {
            let _this = this;
            if (JSON.parse(sessionStorage.getItem("userInfo"))) {
                this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId;
                this.talentId = JSON.parse(sessionStorage.getItem("userInfo")).talentId;
            }
            this.getWechat();
            setTimeout(()=>{
                _this.getList();
            })
        },
        methods: {
            handleTopChange(status) {
                this.topStatus = status;
            },
            getWechat() {
                let _this = this
                if (JSON.parse(sessionStorage.getItem("userInfo"))) {
                    this.talentName = JSON.parse(sessionStorage.getItem("userInfo")).talentName || JSON.parse(sessionStorage.getItem("userInfo")).realName;
                } else {
                    this.talentName = JSON.parse(sessionStorage.getItem('talentName')) || '';
                }
                let url3 = location.href.split('#')[0];
                let shareUrl = `${this.$baseURL}wechat/index.html#/task?shareType=1&talentName=${encodeURIComponent(this.talentName)}`;
                console.log(this.talentName)
                console.log(shareUrl)
                let urlDate = {
                    url: url3
                };
                this.$api.shareSDK(urlDate).then(res => {
                    if (res.data.respCode == 0) {
                        let data = res.data.data;
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: data.appId, // 必填，公众号的唯一标识
                            timestamp: data.timestamp, // 必填，生成签名的时间戳
                            nonceStr: data.nonceStr, // 必填，生成签名的随机串
                            signature: data.signature, // 必填，签名，见附录1
                            jsApiList: ['onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareWeibo']
                        });
                        wx.error(function (res) {
                            console.log('微信初始化失败')
                        });
                        wx.ready(function () {
                            let cfg = {
                                "imgUrl": "http://test.api.10000rc.com/jxb-icon.png",//分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
                                "desc": '赶紧来工单市场抢单吧',//摘要,如果分享到朋友圈的话，不显示摘要。
                                "title": `${_this.talentName}向你分享了工单市场,一起加入吧`,//分享卡片标题
                                "link": shareUrl,//分享出去后的链接，这里可以将链接设置为另一个页面。
                                "success": function () {
                                },
                                'cancel': function () {
                                    console.log('用户取消了分享')
                                }
                            }
                            wx.onMenuShareAppMessage(cfg);
                            wx.onMenuShareTimeline(cfg);
                            wx.onMenuShareQQ(cfg);
                        });

                    } else {
                        console.log('分享失败')
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            go(url) {
                this.$router.push({path: url})
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadBottom() {//上拉触发的分页查询
                // 上拉加载
                this.currentPage++
                console.log(this.currentPage)
                this.getListMore()
                this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位

            },
            loadTop() {//组件提供的下拉触发方法
                //下拉加载
                this.currentPage = 1
                this.allLoaded = false
                this.getList()
                this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位

            },
            isHaveMore(isLastPage) {
                if (isLastPage) {
                    this.allLoaded = true;
                }
            },
            Robed() {
                console.log('ssssss')
                this.$router.push({name: 'receiveList'})
            },
            grab(item) {
                if (this.shareType == 1) {
                    this.$router.push({path: '/shareApp'});
                } else {
                    this.grabLoading = true
                    const params = {
                        schedulingTaskId: item.schedulingTaskId
                    }
                    this.$api.grab(params).then((response) => {
                        if (response.data.respCode == 0) {
                            item.grabDisabled = true
                        }
                        // else {
                        //     this.$toast(response.data.errorMsg)
                        // }
                        this.grabLoading = false
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            },
            getList() {
                let _this = this;
                _this.$indicator.open({
                    spinnerType: 'fading-circle'
                });
                _this.tableData = []
                const params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    loginTalentId: this.talentId,
                    longitude: this.position.longitude,
                    latitude: this.position.latitude,
                    industry: this.industry, //工种
                    loginTalentSex: this.loginTalentSex,//性别
                    valuationType: this.valuationType,//智能排序
                    orderType: this.orderType,//计价方式
                }
//                console.log(params)
                this.$api.taskMarket(params).then((response) => {
//                    console.log(response)
                    const {
                        data: {
                            list,
                            pages,
                            total,
                            pageNum,
                            isLastPage
                        },
                    } = response.data;
                    if (list) {
                        let _arr = [];
                        for (let item of list) {
                            let dist = '', lat1 = _this.position.latitude, lng1 = _this.position.longitude,
                                lat2 = item.latitude, lng2 = item.longitude;
//                                console.log(lat1,lng1,lat2,lng2)
                            dist = util.GetDistance(lat1, lng1, lat2, lng2)
//                            console.log(dist,'dist我是dist')
                            // let value = Number(dist) < 1000 ? `${Number(dist)} 米` : `${(Number(dist) / 1000).toFixed(2)} 公里`;
                            let newItem = Object.assign({}, item, {distance: dist, range: '', grabDisabled: false})
                            _arr.push(newItem)
                        }
                        _this.tableData = _arr;
                        _this.isHaveMore(isLastPage)
//                        console.log(_this.tableData)
                    }
                    _this.pageCount = pages
                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                    _this.$indicator.close()
                });
            },
            getListMore() {
                let _this = this;
                const params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    loginTalentId: this.talentId,
                    longitude: this.position.longitude,
                    latitude: this.position.latitude,
                    industry: this.industry, //工种
                    loginTalentSex: this.loginTalentSex,//性别
                    valuationType: this.valuationType,//智能排序
                    orderType: this.orderType,//计价方式
                }
                console.log(params)

                this.$api.taskMarket(params).then((response) => {
                    const {
                        data: {
                            list,
                            pages,
                            total,
                            pageNum,
                            isLastPage
                        },
                    } = response.data;
                    if (list) {
                        let _arr = [];
                        for (let item of list) {
                            let dist = '', lat1 = _this.position.latitude, lng1 = _this.position.longitude,
                                lat2 = item.latitude, lng2 = item.longitude;
                            dist = util.GetDistance(lat1, lng1, lat2, lng2)
                            // let value = Number(dist) < 1000 ? `${Number(dist)} 米` : `${(Number(dist) / 1000).toFixed(2)} 公里`;
                            let newItem = Object.assign({}, item, {distance: dist, range: '', grabDisabled: false})
                            _arr.push(newItem)
                        }
                        this.tableData = this.tableData.concat(_arr)
                        this.isHaveMore(isLastPage)
                        this.pageCount = pages
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
            click() {
                MessageBox({
                    title: '您需要先完善个人信息才能签协议',
                    message: '您需要先完善个人信息才能签协议?',
                    showCancelButton: true
                });
            },
            routeToDetail(item) {
                this.$router.push({
                    name: 'robDetail',
                    query: item
                });
            },
            screen(val) {
                console.log(val);
                this.currentPage = 1;
                this.valuationType = val.valuationType;
                this.industry = val.industry;
                this.loginTalentSex = val.loginTalentSex;
                this.orderType = val.orderType;
                this.getList();
            },
        },
        //在页面离开时记录滚动位置

    }
</script>

