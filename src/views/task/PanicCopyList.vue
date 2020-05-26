<template>
    <div class="panicCopyListCon">
        <mt-header :title="headTitle" fixed>
            <div v-if="shareType != 1" class="mint-header-button is-right" slot="right">
                <mt-button @click="Robed">领取记录</mt-button>
            </div>
        </mt-header>
        <div v-if="trigger">
            <worksheetMapMode @changeTriggerOne="changeOne"></worksheetMapMode>
        </div>
        <div v-else class="minHeight">            
            <worksheetListMode @changeTriggerTwo="changeTwo"></worksheetListMode>
        </div>        
    </div>
</template>
<script>
    import worksheetMapMode from './worksheetMapMode.vue';
    import worksheetListMode from './worksheetListMode.vue'; 
    import wx from 'weixin-js-sdk';    
    export default {
        name: "PanicCopyList",
        components: { 
            worksheetMapMode,
            worksheetListMode
        },               
        data(){
            return {
                trigger:false,
                isPos:false,  
                headTitle: '工单市场',               
                position: {},
                id: '',
                talentName: '',
                activeOne: true,          
                distance: '',//经纬度算出来的距离
                content: '',                
                shareType: sessionStorage.getItem('shareType'),          
            }
        },
        mounted() {        
            this.getWechat();
            this.analyseStorage();
        },        
        methods: { 
            analyseStorage(){
                if( sessionStorage.getItem('mapTrigger') ){
                    this.trigger = JSON.parse(sessionStorage.getItem('mapTrigger'));
                }else{
                    this.trigger = false;
                }
            },
            changeOne(payload){
                this.trigger = false;
            },
            changeTwo(payload){
                this.trigger = true;
            },
            Robed() {
                this.$router.push({name: 'receiveList'})
            },
            getWechat() {
                if (JSON.parse(sessionStorage.getItem("userInfo"))) {
                    this.talentName = JSON.parse(sessionStorage.getItem("userInfo")).talentName || JSON.parse(sessionStorage.getItem("userInfo")).realName;
                } else {
                    this.talentName = JSON.parse(sessionStorage.getItem('talentName')) || '';
                }
                let url3 = location.href.split('#')[0];
                let shareUrl = `${this.$baseURL}wechat/index.html#/task?shareType=1&talentName=${encodeURIComponent(this.talentName)}`;
                let urlDate = {
                    url: url3
                };
                this.$api.shareSDK(urlDate).then(res => {
                    if (res.data.respCode == 0) {
                        let data = res.data.data;
                        wx.config({
                            debug: false, 
                            appId: data.appId, 
                            timestamp: data.timestamp, 
                            nonceStr: data.nonceStr, 
                            signature: data.signature,
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
                                "title": `${this.talentName}向你分享了工单市场,一起加入吧`,//分享卡片标题
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
        },
    }
</script>
<style scoped lang="scss">
    .panicCopyListCon {
        .minHeight {
            height: calc(100vh - 2.5rem);
            background-color: #f5f5f5;
        }
    }
</style>
<style lang="scss">
    .panicCopyListCon {        
    }
</style>