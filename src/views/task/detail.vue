<template>
    <div id="identification" @scroll="bindScrolling" ref="identifiScroll">
        <mt-header title="工单详情" fixed class="mint-header-title" ref="headerSelf">
            <div slot="left" v-if="shareType != 1">
                <mt-button icon="back" @click="$router.back(-1)"></mt-button>
            </div>
        </mt-header>
        <div class="secondCopyPart flex" v-show="navigationShow">
            <div class="secondCopy1" :class="{fontActive:active1}" @click="goToAnchor('1')">结算说明</div>
            <div class="secondCopy1 borderAddon" :class="{fontActive:active2}" @click="goToAnchor('2')">工作要求</div>
            <div class="secondCopy1" :class="{fontActive:active3}" @click="goToAnchor('3')">工作说明</div>
        </div>
        <div class="wrap">
            <div class="share-box" v-if="shareType == 1">
                <div class="share-l" @click="go('/task')">
                    <img class="share-icon" src="../../assets/img/jxb-icon.png" alt="">
                    <div class="share-title">
                        <h3>万才佳薪宝</h3>
                        <span>一个能赚钱的APP，让你薪上加薪！</span>
                    </div>
                </div>
                <div class="share-btn" @click="go('/task')">
                    市场
                </div>
                <div class="share-btn" @click="go('/shareApp')">
                    下载
                </div>
            </div>         
            <div class="formDiv">
                <div class="firstPart" ref="firstTrack">
                    <div class="flex setContent">
                        <div class="firstPartSp1">{{form.taskName}}</div>
                        <div class="firstPartSp2" v-if="form.positionName">{{form.positionName}}</div>
                        <div class="firstPartSp3">{{form.settlementType | settlementTypeText}}</div>
                    </div>
                    <div class="flex setContent marginAddon">
                        <div class="firstPartTitle">起止时间：</div>
                        <div class="firstPartContent">{{form.startTime | formatminDate}} 至 {{form.endTime | formatminDate}}</div>
                    </div>
                    <div class="flex setContent setContentSp">
                        <div class="firstPartTitle">工作地点：</div>
                        <div class="firstPartContent">{{form.workingPlace}}<img :src="locationIcon" @click="goToMap"></div>
                    </div>
                </div>
                <div class="secondPart flex" ref="secTrack">
                    <div class="second1" @click="goToAnchor('1')">结算说明</div>
                    <div class="second1 borderAddon" @click="goToAnchor('2')">工作要求</div>
                    <div class="second1" @click="goToAnchor('3')">工作说明</div>
                </div>
                <div class="thirdPart" ref="thirdTrack">
                    <div class="samePartFirstLine">结算说明</div>
                    <div class="flex thirdPartSecondCon">
                        <div class="thirdPartTitle">工单单价：</div>
                        <div class="thirdPartContent">{{text}}</div>
                    </div>
                </div>
                <div class="fourthPart" ref="fourthTrack">
                    <div class="samePartFirstLine">工作要求</div>
                    <div class="fourthPartSecondCon">
                        <div class="flex ">
                            <div class="flex sameDivide">
                                <div class="fourthPartTitle">所需人数：</div>
                                <div class="fourthPartContent">{{form.maxWorker}}</div>
                            </div>
                            <div class="flex sameDivide">
                                <div class="fourthPartTitle">年龄要求：</div>
                                <div class="fourthPartContent">{{this.form.ageLowerLimit}}到{{this.form.ageUpperLimit}}岁</div>
                            </div>
                        </div>
                        <div class="flex ">
                            <div class="flex sameDivide">
                                <div class="fourthPartTitle">性别要求：</div>
                                <div class="fourthPartContent">{{form.sex | formatSex}}</div>
                            </div>
                            <div class="flex sameDivide">
                                <div class="fourthPartTitle">工种要求：</div>
                                <div class="fourthPartContent">{{form.industryName}}</div>
                            </div>
                        </div>
                        <div class="flex sameDivide">
                            <div class="fourthPartTitle">发布人：</div>
                            <div class="fourthPartContent">{{form.managerName}}</div>
                        </div>
                    </div>
                </div>
                <div class="fifthPart" ref="fifthTrack">
                    <div class="samePartFirstLine">工作说明</div>
                    <div class="mediaCon">                        
                        <div v-if="form.mediaVOList && form.mediaVOList.length">
                            <template v-for="(item,index) of form.mediaVOList">
                                <div :key="index" class="mediaItem">
                                    <div>
                                        <img v-if="item.mediaType == 1" :src="item.mediaUrl">
                                        <video controls :poster="item.thumbnail" width="100%" v-else>
                                            <source :src="item.mediaUrl">
                                        </video>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div v-else>暂无工作说明</div>
                    </div>
                </div>  
                <div class="flexable margin0" v-if="isWaitingRob">
                    <mt-button type="primary" v-if="!grabDisabled" class="logBtn" @click="grab">抢单</mt-button>
                    <mt-button type="default" v-if="grabDisabled" :disabled="grabDisabled" class="logBtn disableBtn">
                        已抢，等待对方确认
                    </mt-button>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import util from '../../common/util'
    import wx from 'weixin-js-sdk';
    export default {
        name: "Identification",
        data() {
            return {
                grabDisabled: false,
                position: {},
                isWaitingRob: false,
                step: 1,
                step3: {
                    name: "",
                    idcard: "",
                    address: "",
                    contracts: "",
                    phone: "",
                    relationship: ""
                },
                form: {
                    mediaVOList:[],
                },
                price: {},
                locationIcon:require('@/assets/img/listLocation.png'),
                content: '',
                shareType: '',
                id:'',
                talentName:'',
                iosUrl: 'https://itunes.apple.com/cn/app/id1477306402?mt=8',
                androidUrl: '',
                setType:'',
                text:'',
                navigationShow:false,                
                initFirstTr:{},
                initSecTr:{},
                initThirdTr:{},
                initFourthTr:{},
                initfifthTr:{},
                gutterDistance:0,
                active1:false,
                active2:false,
                active3:false,
            };
        },
        filters: {
            formatSex(val) {
                if (val) {
                    if (val == 1) {
                        return '男'
                    } else if (val == 2) {
                        return '女'
                    } else {
                        return '不限'
                    }
                } else {
                    return '不限'
                }
            },
            settlementTypeText(val) {
                if (val == 1) {
                    return '日结'
                } else if (val == 2) {
                    return '月结'
                } else if (val == 4) {
                    return '周结'
                }
            },
            formatminDate(val) {
                if (val && val.length > 5) {
                    if (val) {
                        return util.minDate(val)
                    } else {
                        return '无'
                    }
                } else {
                    return val
                }
            },
        },
        created(){
            this.shareType = sessionStorage.getItem('shareType');
            this.id = this.$route.query.schedulingTaskId || JSON.parse(sessionStorage.getItem('taskId'));
            if (this.$route.name == 'robDetail') {
                this.isWaitingRob = true
            }
        },
        mounted() {
            this.getDetail();            
        },
        methods: {
            goToMap(){
                this.$router.push({
                    name: "SimpleMap",
                    query:{
                        latitude:this.form.latitude,
                        longitude:this.form.longitude
                    },
                })
            },
            goToAnchor(mark){
                let target = this.$refs.identifiScroll;
                let res1 = Number.parseInt(this.gutterDistance*2 + this.initFirstTr.height) + 1;
                let res2 = Number.parseInt(res1 + this.initSecTr.height + this.initThirdTr.height - this.gutterDistance*3);
                let res3 = Number.parseInt(res2 + this.initFourthTr.height + this.gutterDistance);
                switch(mark){
                    case '1':
                        target.scrollTop = res1;
                        this.active1 = true; 
                        this.active2 = false; 
                        this.active3 = false; 
                        break;
                    case '2':
                        target.scrollTop = res2;
                        this.active1 = false; 
                        this.active3 = false; 
                        this.active2 = true; 
                        break;
                    case '3':
                        target.scrollTop = res3;
                        this.active1 = false; 
                        this.active2 = false; 
                        this.active3 = true; 
                        break;
                }
            },
            initGetParam(){
                let target = this.$refs.identifiScroll;
                let target1 = this.$refs.firstTrack;
                let target2 = this.$refs.secTrack;                  
                let target3 = this.$refs.thirdTrack;
                let target4 = this.$refs.fourthTrack;
                let target5 = this.$refs.fifthTrack;                
                this.initFirstTr = target1.getBoundingClientRect();
                this.initSecTr = target2.getBoundingClientRect();
                this.initThirdTr = target3.getBoundingClientRect();
                this.initFourthTr = target4.getBoundingClientRect();
                this.initfifthTr = target5.getBoundingClientRect();    
//                console.log( 'this.initFirstTr',this.initFirstTr );
                this.gutterDistance = this.initFirstTr.top - 44;
//                console.log( this.gutterDistance );
//                console.log( this.initSecTr );
//                console.log( this.initThirdTr );
//                console.log( this.initFourthTr );
            },
            bindScrolling(){
                let target = this.$refs.identifiScroll;
                let target1 = this.$refs.firstTrack;
                let target2 = this.$refs.secTrack; 
                let res1 = Number.parseInt(this.gutterDistance*2 + this.initFirstTr.height) + 1;
                let res2 = Number.parseInt(res1 + this.initSecTr.height + this.initThirdTr.height - this.gutterDistance*3);
                let res3 = Number.parseInt(res2 + this.initFourthTr.height + this.gutterDistance);
                let scrollTop = target.scrollTop;
//                console.log( target1.getBoundingClientRect() );
//                console.log( target2.getBoundingClientRect().top  );
                if( target2.getBoundingClientRect().top <= 44 ){
//                    console.log( 'scrollTop',scrollTop );
                    this.navigationShow = true;  
                    if( scrollTop < res2 ){
//                        console.log('runing1');
                        this.active1 = true; 
                        this.active2 = false; 
                        this.active3 = false; 
                    }else{
                        if( scrollTop > res3 ){
//                            console.log('runing3');
                            this.active1 = false; 
                            this.active2 = false; 
                            this.active3 = true; 
                        }
                        if( scrollTop < res3 ){
//                            console.log('runing2');
                            this.active1 = false; 
                            this.active2 = true; 
                            this.active3 = false; 
                        }
                    }
                }else{
                    this.navigationShow = false;
                }                
            },
            go(url) {
                this.$router.push({path: url})
            },
            getWechat() {
                let _this = this
                if (JSON.parse(sessionStorage.getItem("userInfo"))){
                    this.talentName = JSON.parse(sessionStorage.getItem("userInfo")).talentName || JSON.parse(sessionStorage.getItem("userInfo")).realName || '';
                }else{
                    this.talentName = JSON.parse(sessionStorage.getItem('talentName')) || '';
                }
                let url3 = location.href.split('#')[0];
                let url = location.href.split('?')[0];
                let shareUrl = `${this.$baseURL}wechat/index.html#/robtask/detail?shareType=1&talentName=${encodeURIComponent(this.talentName)}&id=${this.id}`;
//                console.log(shareUrl)
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
                                "desc": `${_this.setType} ${_this.text}`,//摘要,如果分享到朋友圈的话，不显示摘要。
                                "title": `${_this.talentName}向你分享一个工作机会：${_this.form.taskName}，一起加入吧！`,//分享卡片标题
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
            grab() {
                if (this.shareType == 1) {
                    this.$router.push({path: '/shareApp'});
                } else {
                    const params = {
                        schedulingTaskId: this.$route.query.schedulingTaskId,
                    }
                    this.$api.grab(params).then((response) => {
                        if (response.data.respCode == 0) {
                            this.grabDisabled = true
                        } else {
                            // this.$toast(response.data.errorMsg)
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            },
            getDetail() {
                const params = {
                    id:Number(this.id),
                }
                this.$api.grabRecordDetail(params).then((response) => {
                    if (response.data.respCode == 0) {
                        this.form = response.data.data;
                        this.form.distance = this.$route.query.distance || JSON.parse(sessionStorage.getItem('distance'));
                        this.text = this.forPrice(this.form.price)
                        this.setType = this.settlementTypeText(this.form.settlementType)
                        let start = this.form.startTime
                        let end = this.form.endTime
                        if (start.substring(0, 10) == end.substring(0, 10)) {
                            this.form.endTime = end.substr(11, 5)
                        }
                        this.getWechat();
                        this.$nextTick(()=>{
                            this.initGetParam();
                        });
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            forPrice(val) {
                return this.GlobalPriceFilter.priceFilter(val);
            },
            settlementTypeText(val) {
                if (val == 1) {
                    return '日结'
                } else if (val == 2) {
                    return '月结'
                } else if (val == 4) {
                    return '周结'
                }
            },
        },
    };
</script>
<style scoped lang="scss">
    #identification {
        background-color: rgb(245,245,245);
        height: 100vh;
        overflow-y: scroll;    
        transition-duration: 0.5s;
        transition-property:all;
        .formDiv {
            overflow: hidden;
            margin-top: convertToVw(10);
            position: relative;            
        }
        .fontActive {
            color: #EA441A !important;
        }
        .borderAddon {
            border-left: 1px solid #D9D9D9;
            border-right: 1px solid #D9D9D9;
            box-sizing: border-box;
        }
        .wrap {
            padding-top: 2.2rem;
        }
        .sameDivide {
            width: 50%;
        }
        .samePartFirstLine {
            height: convertToVw(50);
            line-height: convertToVw(50);
            color: #1E1F21;
            font-size: convertToVw(16);
            box-sizing: border-box;
            padding-left: convertToVw(15);
            border-bottom: 1px solid #D9D9D9;
        }
        .fifthPart {
            margin-top: convertToVw(10);
            margin-bottom: convertToVw(10);
            background-color: #fff;        
            box-sizing: border-box;           
            padding-bottom: convertToVw(70);
            .mediaCon {
                padding: convertToVw(15);
                box-sizing: border-box; 
                font-size: convertToVw(13);
                color: #6E7075;                
            }
            .mediaItem {
                margin-bottom: convertToVw(10);
                img {
                    width: 100%;
                }
            }
        }
        .fourthPart {
            margin-top: convertToVw(10);
            margin-bottom: convertToVw(10);
            background-color: #fff;        
            box-sizing: border-box;
            .fourthPartSecondCon {
                box-sizing: border-box;
                padding: convertToVw(15);
                align-content: flex-start;
                align-items: flex-start;
            }
            .fourthPartTitle {
                color: #6E7075;
                font-size: convertToVw(13);
            }
            .fourthPartContent {
                color: #1E1F21;
                font-size: convertToVw(13);   
            }
        }
        .thirdPart {
            margin-top: convertToVw(10);
            margin-bottom: convertToVw(10);
            background-color: #fff;        
            box-sizing: border-box;
            .thirdPartSecondCon {
                box-sizing: border-box;
                padding: convertToVw(15);
                align-content: flex-start;
                align-items: flex-start;
            }
            .thirdPartTitle {
                min-width: convertToVw(70);
                color: #6E7075;
                font-size: convertToVw(13);
            }
            .thirdPartContent {
                color: #1E1F21;
                font-size: convertToVw(13);                
            }
        }
        .secondCopyPart {
            background-color: #fff;
            position: fixed;
            top: 2.2rem;
            width: 100%;
            z-index: 10;
            border-bottom: 1px solid #D9D9D9;
            padding-top: convertToVw(10);
            padding-bottom: convertToVw(10);
            box-sizing: border-box;
            .secondCopy1 {
                width: 33.333%;
                text-align: center;
                color: #6E7075;
                font-size: convertToVw(14);
            }
        }
        .secondPart {
            margin-top: convertToVw(10);
            margin-bottom: convertToVw(10);
            background-color: #fff;
            padding-top: convertToVw(10);
            padding-bottom: convertToVw(10);
            box-sizing: border-box;
            .second1 {
                width: 33.333%;
                text-align: center;
                color: #6E7075;
                font-size: convertToVw(14);                
            }
        }
        .firstPart {
            border-top: 1px solid #D9D9D9;
            background-color: #fff;
            padding-left: convertToVw(15);
            padding-right: convertToVw(15);
            padding-top: convertToVw(20);
            padding-bottom: convertToVw(15);
/*            box-sizing: border-box;*/
            .firstPartSp1 {
                font-size: convertToVw(17);
                color: #1E1F21;
                font-weight: 500;
                margin-right: convertToVw(10);
            }
            .firstPartSp2 {
                color: #3296FA;
                margin-right: convertToVw(10);
                border: 1px solid #3296FA;
                border-radius: 2px;
                font-size: convertToVw(13);
                padding-left: convertToVw(6);
                padding-right: convertToVw(6);
            }
            .firstPartSp3 {
                color: #15BC83;
                border: 1px solid #15BC83;
                border-radius: 2px;
                font-size: convertToVw(13);
                padding-left: convertToVw(6);
                padding-right: convertToVw(6);
            }
            .setContent {
                justify-content: flex-start;
            }
            .setContentSp {
                align-items: flex-start;
            }
            .firstPartTitle {                
                color: #6E7075;
                min-width: convertToVw(70);
                box-sizing: border-box;
                font-size: convertToVw(13);
            }
            .firstPartContent {
                color: #1E1F21;
                font-size: convertToVw(13);
                img {
                    width: convertToVw(13);
                    height: convertToVw(13);
                    margin-left: convertToVw(13);
                    vertical-align: convertToVw(-2);
                }
            }
            .marginAddon {
                margin-top: convertToVw(8);
                margin-bottom: convertToVw(8);
            }
        }
    }
    .disableBtn {
        border: solid 0.03rem #c4c4c4 !important;
        color: #c4c4c4 !important;
        width: auto !important;
    }
    .first {
        color: #0d0d0d;
        text-align: center;
        margin: 4.2rem auto 1.8rem;
    }
    .logBtn {    
        width: calc( 100% - 1.8rem );
        height: convertToVw(50);       
        border-radius: 3px;
        font-size: 0.75rem;
    } 
    .margin0 {
        box-sizing: border-box;
        padding-top: convertToVw(10);
        justify-content: center;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: convertToVw(70);
        background-color: #fff;
    }
</style>
<style lang="scss">
    .mint-header-title {
        z-index: 20;
    }
</style>