<template>
    <div class="mineContainer">
        <div class="mine-top flexable flexbox">
            <div class="mine-info">
                <div class="mine-name">{{realName}}</div>
                <img :src="avatar" class="mine-img"/>
            </div>
        </div>
        <div class="list-body">
            <!--<mt-cell title="我的账户" is-link value="" @click.native="routeToAccount">-->
                <!--<img slot="icon" src="../../assets/img/wallet.png" width="20" height="20">-->
                <!--<span class="fs" style="font-size: 12px">-->
                  <!--{{amount== '' ? '0元' : `${amount}元`}}-->
                <!--</span>-->
            <!--</mt-cell>-->
            <!--<mt-cell v-if="isInformation && hasAuth" title="身份信息" is-link value="" @click.native="routeInfoSuccess">-->
            <!--<span class="fs" style="font-size: 12px">已认证</span>-->
            <!--<img slot="icon" src="../../assets/img/identity_authentication@3x.png" width="20" height="20">-->
            <!--</mt-cell>-->
            <!--<mt-cell v-if="!isInformation && hasAuth" title="身份信息" is-link value="" @click.native="routeToIden">-->
            <!--<span class="fs" style="font-size: 12px">待认证</span>-->
            <!--<img slot="icon" src="../../assets/img/identity_authentication@3x.png" width="20" height="20">-->
            <!--</mt-cell>-->
            <mt-cell title="实名认证" is-link value="" @click.native="handleAuth">
                <span class="fs" style="font-size: 12px">{{hasAuth ? '已完成' : '未完成'}}</span>
                <img slot="icon" src="../../assets/img/account@3x.png" width="20" height="20">
            </mt-cell>
            <mt-cell title="绑定银行卡" is-link value="" @click.native="handleBind">
                <span class="fs" style="font-size: 12px">{{(bankCardBindingStatus == 2 || bankCardBindingStatus == 4) ? '已绑定' : '未绑定'}}</span>
                <img slot="icon" src="../../assets/img/account@3x.png" width="20" height="20">
            </mt-cell>
            <!--<mt-cell title="绑定支付宝" is-link value=""-->
                     <!--@click.native="handleBindAlpay">-->
                <!--<span class="fs" style="font-size: 12px">{{(bankCardBindingStatus == 3 || bankCardBindingStatus == 4) ? (ifFirst == 1 ? '(优先打卡)已绑定': '已绑定') : '未绑定'}}</span>-->
                <!--<img slot="icon" src="../../assets/img/account@3x.png" width="20" height="20">-->
            <!--</mt-cell>-->
            <mt-cell title="账号设置" to="/setting" is-link value="">
                <img slot="icon" src="../../assets/img/setting@3x.png" width="20" height="20">
            </mt-cell>
            <mt-cell title="联系客服" is-link @click.native="handleShowbottom">
                <img slot="icon" src="../../assets/img/account@3x.png" width="20" height="20">
            </mt-cell>
            <mt-cell title="分享APP给好友" is-link @click.native="handleShowShare">
                <img slot="icon" src="../../assets/img/account@3x.png" width="20" height="20">
            </mt-cell>
            <input type="text" id="copyinput" :value="wechat" style="opacity: 0;"/>
            <div id="iphonecopy"
                 style="position: absolute;left:-200px; color: rgba(0,0,0,0);background-color: transparent">{{wechat}}
            </div>
        </div>
        <div class="u-mask" v-show="visible">
            <div class="u-confirm flexable">
                <span class="confirm-title">您的身份尚未认证</span>
                <span class="confirm-title">是否认证</span>
                <div class="flexable confirm-btngroup">
                    <mt-button type="primary" class="confirm-btn" @click="routeToIden">立即认证</mt-button>
                    <mt-button type="primary" class="cancel-btn" @click="visible=false">随便逛逛</mt-button>
                </div>
            </div>
        </div>
        <div class="bottom-mask" v-show="showBottom">
            <div class="bottom-text">
                <p class="text" @click="handleCopy">复制 客服微信号</p>
                <p class="cancel" @click="handleHidebottom">取消</p>
            </div>
        </div>
        <bindCardDialog v-if="isShow" @controlShow="showBridge"></bindCardDialog>
    </div>
</template>
<script>
    import bindCardDialog from '@/components/bindCardDialog.vue';

    export default {
        components: {bindCardDialog},
        data() {
            return {
                visible: false,
                showBottom: false,
                id: "",
                idCard: '',
                status: "",
                realName: '',
                hasAuth: false,
                isInformation: false,//是否身份信息完善
                talentId: 0,
                wechat: '',
                avatar: require('../../assets/img/default_avatar@3x.png'),
                amount: '',
                bankCardBindingStatus: '1',
                isShow: false,
                ifFirst:'',
            };
        },
        mounted() {
            this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId
            this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            if (this.userInfo) {
                this.realName = this.userInfo.realName || this.userInfo.mobile
                this.newavatar = sessionStorage.getItem('newavatar')
                this.avatar = this.newavatar || this.userInfo.avatar || this.avatar
            }
            this.getInfo();
            this.getList();
            this.getAmount();
            this.getServiceWechat()
        },
        methods: {
            handleShowShare() {
                this.$router.push({path: "/shareApp", query: {showMask: true}});
            },
            showBridge(val) {
                this.isShow = val.show;
            },
            checkIsHaveInCome() {
                let _this = this;
                this.$api.isHaveInCome().then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        if (data == 1) {
                            let userId = localStorage.getItem('haveInComeTimeMatch');
                            let currentUser = JSON.parse(sessionStorage.getItem("userInfo")).userId;
                            let haveInComeTimeStamp = localStorage.getItem('haveInComeTimeStamp');
                            //产生收入
                            if (currentUser == userId) {
                                if (haveInComeTimeStamp) {
                                    let numFormat = Number(haveInComeTimeStamp);
                                    let now = Date.now();
                                    console.log(numFormat)
                                    console.log(now)
                                    if ((now - numFormat) >= 24 * 3600 * 1000) {//24 * 3600 * 1000
                                        _this.isShow = true;
                                    } else {
                                        _this.isShow = false;
                                    }
                                }
                            } else {
                                _this.isShow = true;
                            }
                        }
                        // localStorage.setItem( 'haveInCome',data );
                    }
                }).catch(err => {
                    console.log('err', err)
                })
            },
            routeToIden() {
                this.$router.push({name: 'fullfill'})
            },
            routeInfoSuccess(type) {
                this.$router.push({name: 'identifysuccess'})
            },
            routeToAccount() {
                this.$router.push({path: "/open"})
                // if(this.hasAuth){
                //   if (this.isInformation) {
                //     this.$router.push('/open')
                //   } else {
                //     this.visible = true
                //   }
                // }else{
                //   this.$messagebox({
                //     title: '提示',
                //     message: '请您先完成人脸认证'
                //   })
                // }
            },
            getInfo() {
                let _this = this;
                this.$api.getUserInfo().then(response => {
                    console.log(response);
                    if (response.data.respCode == 0) {
                        if (response.data.data) {
                            _this.status = response.data.data.status;
                            _this.realName = response.data.data.realName;
                            _this.idCard = response.data.data.idCard || '';
                            _this.realName = this.realName || this.userInfo.mobile
                            _this.hasAuth = response.data.data.isRecognised === 1 ? true : false
                            _this.talentId = response.data.data.id
                            _this.isInformation = response.data.data.baseInfoStatus === 1 ? true : false
                        }
                        console.log(response.data.data)
                    }
                })
                    .catch(error => {
                        console.log(error);
                    });
            },
            getList() {
                this.$api.AccountDetail().then(res => {
                    let {data, respCode} = res.data;
                        if (respCode === 0) {
                            console.log(data)
                        this.bankCardBindingStatus = data.bankCardBindingStatus;
                        let result = data.bankList && data.bankList.filter((i)=> i.type == 1)
                        this.ifFirst =  result[0].ifFirst;

                        if (data.bankCardBindingStatus == 1) { //未绑定了
                            this.checkIsHaveInCome();
                        }
                    } else {
                        this.$toast({
                            message: '网络异常。',
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            handleBindAlpay(){
                if (this.hasAuth) { //是否人脸识别
                   if(this.bankCardBindingStatus == 3 || this.bankCardBindingStatus == 4) {
                        this.$router.push({name: 'myAlipay'})
                    } else {
                        this.$router.push({name: 'alipay'})
                    }
                } else {  //未人脸识别提示
                    this.$messagebox({
                        title: `提示`,
                        message: `您还未进行实名认证，需实名认证后才能继续操作`,
                        showCancelButton: true,
                        confirmButtonText: "实名认证",
                        cancelButtonText: "关闭"
                    }).then(action => {
                        if (action == 'confirm') {
                            localStorage.setItem('authBackUrl', JSON.stringify(location.hash));
                            this.$router.push({path: '/bindingManager', query: {type: true}})
                        } else {
                            //关闭
                        }
                    })
                }
            },
            handleBind() {
                if (this.hasAuth) { //是否人脸识别
                    if (this.bankCardBindingStatus == 2 || this.bankCardBindingStatus == 4) {
                        this.$router.push({name: 'mybankcard'})
                    } else {
                        this.$router.push({name: 'bindbankcard'})
                    }
                } else {  //未人脸识别提示
                    this.$messagebox({
                        title: `提示`,
                        message: `您还未进行实名认证，需实名认证后才能继续操作`,
                        showCancelButton: true,
                        confirmButtonText: "实名认证",
                        cancelButtonText: "关闭"
                    }).then(action => {
                        if (action == 'confirm') {
                            localStorage.setItem('authBackUrl', JSON.stringify(location.hash));
                            this.$router.push({path: '/bindingManager', query: {type: true}})
                        } else {
                            //关闭
                        }
                    })
                }
            },
            handleAuth() {
                let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                let talentId = userInfo.talentId
                if (!this.hasAuth) {
                    if (this.idCard) {
                        let param = {
                            talentId: talentId,
                            Extra: `supplement,${talentId}`,
                            RuleId: '9'
                        }
                        this.$indicator.open({
                            spinnerType: 'fading-circle'
                        });

                        localStorage.setItem('lastUrl', window.location.href)
                        this.$api.detectAuth(param)
                            .then(res => {
                                if (res.data.respCode == 0) {
                                    let data = JSON.parse(res.data.data)
                                    let url = data.Url
                                    let bizToken = data.BizToken
                                    localStorage.setItem('biztoken', bizToken)

                                    window.location.href = url
                                }
                            })
                            .catch(err => {
                                console.log(err)
                            })
                            .finally(() => {
                                this.$indicator.close()
                            })
                    } else {
                        localStorage.setItem('authBackUrl', JSON.stringify(location.hash));
                        this.$router.push({path: '/bindingManager', query: {type: true}})
                    }
                } else {
                    this.$messagebox({
                        title: '提示',
                        message: '您已完成人脸认证'
                    })
                }
            },
            getAmount() {
                let _this = this;
                const params = {
                    id: _this.id
                };
                this.$api
                    .AccountDetail(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            _this.amount = response.data.data.totalAmount
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            // 获取客服微信
            getServiceWechat() {
                let _this = this;
                this.$api.getServiceWechat()
                    .then(res => {
                        _this.wechat = res.data.data
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            // 复制客服微信号
            handleCopy() {
                try {
                    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                        window.getSelection().removeAllRanges();
                        var Url2 = document.getElementById("iphonecopy");
                        var range = document.createRange();
                        range.selectNode(Url2);
                        window.getSelection().addRange(range);
                        var successful = document.execCommand('copy');
                        window.getSelection().removeAllRanges();
                    } else {
                        var input = document.getElementById("copyinput")
                        input.select()
                        document.execCommand("copy")
                        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
                    }

                    this.$toast('复制成功')
                    this.showBottom = false
                } catch (error) {
                    console.log(error)
                }
            },
            handleShowbottom() {
                this.showBottom = true
            },
            handleHidebottom() {
                this.showBottom = false
            }
        },
    };
</script>

<!-- Add "scoped " attribute to limit CSS to this component only -->
<style lang='scss' scoped>
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    .mineContainer {
        background-color: #fff;
        height: 100%;
        padding-bottom: convertToVw(50);
        box-sizing: border-box;
    }

    h3 {
        text-align: center;
        width: 90%;
        margin: auto;
    }

    .div {
        margin: auto;
        width: 220px;
        height: 44px;
        line-height: 44px;
        background: #0fc37c;
        color: #fff;
        font-size: 17px;
        text-align: center;
        margin-top: 20px;
    }

    .wh_container > > > .mark1 {
        /*background-color: orange;*/
        background-image: url("../../assets/img/mine_nor@3x.png");
        background-position-x: 50%;
        background-position-y: 118%;
        background-size: 30%;
        background-repeat: no-repeat;
    }

    .wh_container > > > .mark2 {
        background-color: blue;
    }

    .wh_content_item > .wh_isMark {
        background: orange;
    }

    .wh_container > > > .wh_content_all {
        background-color: #e84518;
    }

    .bottom-mask {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
    }

    .bottom-text {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        background-color: #fff;
        text-align: center;
        color: #1e1f21;
        font-size: convertToVw(17);
        line-height: convertToVw(52);
    }

    .bottom-text .text {
        border-bottom: convertToVw(4) solid #f5f5f5;
    }
</style>
<style scoped>
    .flexbox {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .mine-top {
        height: 9.68rem;
        background-image: url("../../assets/img/bg@3x.png");
        background-repeat: no-repeat;
        background-size: 100%;
        position: relative;
    }

    .mine-info {
        width: 100%;
        text-align: center;
    }

    .mine-name {
        text-align: center;
        font-family: PingFang-SC-Regular;
        font-size: 0.8rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0rem;
        letter-spacing: 0rem;
        color: #ffffff;
    }

    .mine-img {
        margin-top: 1.25rem;
        width: 3.8rem;
        height: 3.8rem;
        border-radius: 50%;
    }

    .cell-btn {
        font-size: 0.6rem;
        padding: 0.2rem 0.5rem;
        border: 1px solid;
        color: #e84518;
        margin-left: 0.5rem;
        cursor: pointer;
    }
</style>