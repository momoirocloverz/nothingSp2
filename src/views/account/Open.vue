<template>
    <div class="openContainer">
        <mt-header title="我的账户" fixed class="mint-header-title">
            <router-link to="/home/mine" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="mainBody">
            <div class="colorBlockCon">
                <div class="colorBlockConTitle">账号余额(元)</div>
                <div class="colorBlockConAmount">{{responseData.balance + responseData.outsourceAmount || 0 +
                    responseData.freezingAmountTotal || 0 | moneyFormat}}
                </div>
            </div>
            <div class="innerBottom flex">
                <div class="ableContainer samePart">
                    <div class="innerBottomTitle">可用余额(元)</div>
                    <div class="innerBottomAmount">{{responseData.balance + responseData.outsourceAmount || 0 |
                        moneyFormat}}
                    </div>
                </div>
                <div class="freezeContainer samePart">
                    <div class="innerBottomTitle"><span>冻结余额(元)</span><img :src="questionMark"
                                                                           class="holderQuestionMark" @click="popInfo">
                    </div>
                    <div class="innerBottomAmount">{{responseData.freezingAmountTotal | moneyFormat}}</div>
                </div>
            </div>
            <div class="linkContainer">
                <div class="listItem" @click="goDetail">
                    <div class="borderItem">
                        <span>提现</span><i class="mint-cell-allow-right"></i>
                    </div>
                </div>
                <div class="listItem">
                    <div class="fixStyle" @click="goToChargeDetail">
                        <span>交易明细</span><i class="mint-cell-allow-right"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="dialog" v-show="isShowDialog" @click.self="handleCancel">
            <div class="dialog-panel">
                <h3 class="dialog-content">您需要绑定银行卡才能提现</h3>
                <div class="btn-panel">
                    <div class="btn btn-ok" @click="handleOK">去绑定</div>
                    <div class="btn btn-cancel" @click="handleCancel">以后再说</div>
                </div>
            </div>
        </div>
        <div class="tip-mask1" v-if="showTip">
            <div class="tip-content1">
                <div class="tip-text1">
                    <p class="tip-title1">什么情况下金额会被冻结?</p>
                    <p class="tip-desc1">发起提现后，会将提现金额冻结。后续处理成功后，会从您账户内扣除这部分金额。处理失败后，会返还这部分金额至您的账户。</p>
                </div>
                <div class="tip-btn1" @click="handleHidetip">确认</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "Open",
        data() {
            return {
                bankCardBindingStatus: false,
                isShowDialog: false,
                balance: 0,
                responseData: {},
                img: require("../../assets/img/default_avatar@3x.png"),
                newavatar: '',
                hasAuth:'',//是否认证
                isInformation:'',//是否完善信息
                idCard:'', //是否上传身份证
                showTip:false,
                charge:0,
                questionMark:require("../../assets/img/question327@2x.png"),
            };
        },
        filters: {
            moneyFormat(number) {
                if (typeof number === 'undefined') {
                    number = 0;
                }
                return (Math.round(+number + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
            },
        },
        methods: {
            getList() {
                this.$api.AccountDetail().then(res => {
                    let {data, respCode} = res.data;
                    if (respCode === 0) {
                        this.responseData = data;
                        this.bankCardBindingStatus = data.bankCardBindingStatus === 1 ? false : true;
                    } else {
                        this.$toast({
                            message: '网络异常。',
                        });
                    }
                })
                    .catch(err => {
                        console.log(err);
                    });
            },
            getInfo() {
                let _this = this;
                this.$api.getUserInfo().then(response => {
                    console.log(response);
                    if (response.data.respCode == 0) {
                        if (response.data.data) {
                            _this.hasAuth = response.data.data.isRecognised === 1 ? true : false
                            _this.idCard = response.data.data.idCard || '';
                            _this.isInformation = response.data.data.baseInfoStatus === 1 ? true : false
                        }
                        console.log(response.data.data)
                    }
                })
                    .catch(error => {
                        console.log(error);
                    });
            },
            goDetail() {
                let _this = this;
                let outsourceAmount = this.responseData.outsourceAmount || 0; //外包费用
                let balance =this.responseData.balance || 0; //代发收入
                let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                let talentId = userInfo.talentId
                if(this.hasAuth){ //是否人脸识别
                    if (this.bankCardBindingStatus) {  //是否绑定银行卡
                        if (Number(balance) <= Number(this.charge)) {
                            return this.$messagebox({
                                title: `提示`,
                                message: `您的账户可用余额低于提现手续费，无法提现`,
                            })
                        } else if (Number(balance) > Number(this.charge) && Number(outsourceAmount) > Number(this.charge)) {//包含2种费用 代发和外包
                            this.$router.push({name: 'wthdrawals'})
                        } else {//只要有一种不足、
                            if (Number(balance) > Number(this.charge)) {
                                this.$router.push({
                                    path: '/mine/cashout',
                                    query: {
                                        type: '2',
                                        text: '代发收入',
                                        balance: balance,
                                    }
                                })
                            }
                            if (Number(outsourceAmount) > Number(this.charge)) {
                                this.$router.push({
                                    path: '/mine/cashout',
                                    query: {
                                        type: '1',
                                        text: '外包费用',
                                        balance: outsourceAmount,
                                    }
                                })
                            }
                        }
                    } else {
                        this.isShowDialog = true
                    }
                    // if(this.isInformation){  //是否完善身份信息
                    // } else {  //未完善信息
                    //     this.$messagebox({
                    //         title: `身份认证`,
                    //         message: `您的身份尚未认证,是否认证`,
                    //         showCancelButton: true,
                    //         confirmButtonText: "立即认证",
                    //         cancelButtonText: "关闭"
                    //     }).then(action => {
                    //         if (action == 'confirm') {
                    //             _this.$router.push({name: 'fullfill'})
                    //         } else {
                    //             //关闭
                    //         }
                    //     })
                    // }
                } else{  //未人脸识别提示
                    this.$messagebox({
                        title: `提示`,
                        message: `您还未进行实名认证，需实名认证后才能继续操作`,
                        showCancelButton: true,
                        confirmButtonText: "实名认证",
                        cancelButtonText: "关闭"
                    }).then(action => {
                        if (action == 'confirm') {
                            if(_this.idCard){
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
                            }else{
                                localStorage.setItem('authBackUrl',JSON.stringify(location.hash));
                                _this.$router.push({path: '/bindingManager',query:{type:true}})
                            }
                        }else{
                            //关闭
                        }
                    })
                }
            }
            ,
            goToChargeDetail() {
                this.$router.push({
                    path: "/chargeDetail"
                })
            }
            ,
            handleHidetip() {
                this.showTip = false;
            }
            ,
            popInfo() {
                this.showTip = true;
            }
            ,
            handleOK() {
                sessionStorage.setItem('cashout', true)
                this.$router.push({path: 'bindbankcard'})
            }
            ,
            handleCancel() {
                this.isShowDialog = false
            }
            ,
            getFee() {
                const params = {
                    paramName: 'service_charge',
                };
                this.$api.ParamsInfo(params)
                    .then(response => {
                        console.log(response)
                        if (response.data.respCode == 0) {
                            this.charge = response.data.data
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            ,
        }
        ,
        mounted() {
            this.getInfo();
            this.getFee();
            this.getList();
            this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            if (this.userInfo) {
                this.newavatar = sessionStorage.getItem('newavatar')
                this.img = this.newavatar ? this.newavatar : this.userInfo.avatar
            }
        }
    };
</script>
<style lang="scss" scoped>
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    $borderColor: #D9D9D9;
    .openContainer {
        width: 100%;
        height: 100%;

        .tip-mask1 {
            position: fixed;
            z-index: 100;
            background-color: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        .tip-content1 {
            position: absolute;
            width: convertToVw(314);
            height: convertToVw(188);
            box-sizing: border-box;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: convertToVw(20) convertToVw(12) convertToVw(50) convertToVw(12);
            border-radius: convertToVw(5);
            background-color: #fff;

            .tip-title1 {
                font-size: convertToVw(17);
                color: #1e1f21;
            }

            .tip-desc1 {
                font-size: convertToVw(14);
                line-height: 1.5;
                margin-top: convertToVw(8);
                color: #1e1f21;
            }

            .change-mobile1 {
                text-decoration: none;
                color: #ea441a;
            }

            .tip-btn1 {
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

    .mainBody {
        background-color: #F5F5F5;
        height: 100%;
        width: 100%;
        padding-top: 2rem;
    }

    .colorBlockCon {
        background-color: $mainColor;
        color: #fff;
        height: convertToVw(140);
        padding-top: convertToVw(36);
        padding-left: convertToVw(18);
        box-sizing: border-box;

        .colorBlockConTitle {
            font-size: convertToVw(14);
        }

        .colorBlockConAmount {
            font-size: convertToVw(40);
            height: convertToVw(56);
            line-height: convertToVw(56);
            margin-top: convertToVw(10);
        }
    }

    .innerBottom {
        flex-wrap: nowrap;
        justify-content: space-around;
        box-sizing: border-box;
        border-bottom: 1px solid $borderColor;
        width: 100%;

        .ableContainer {
            border-right: 1px solid $borderColor;
        }

        .innerBottomTitle {
            color: #969799;
            font-size: convertToVw(15);
        }

        .innerBottomAmount {
            margin-top: convertToVw(10);
            height: convertToVw(25);
            line-height: convertToVw(25);
            color: #000;
            font-size: convertToVw(18);
        }

        .samePart {
            width: 50%;
            height: convertToVw(80);
            text-align: center;
            box-sizing: border-box;
            padding-top: convertToVw(14);
        }

        .freezeContainer {
        }
    }

    .linkContainer {
        padding-top: convertToVw(20);
    }

    .listItem {
        background-color: #fff;
        height: convertToVw(46);
        line-height: convertToVw(46);
        padding-left: convertToVw(14);
        cursor: pointer;
    }
    .fixStyle {
        color: #1E1F21;
        box-sizing: border-box;
        position: relative;
        padding-right: convertToVw(14);
        .mint-cell-allow-right {
            color: #ABACAE;
            &::after {
                right: convertToVw(14) !important;
            }
        }
    }
    .borderItem {
        height: 100%;
        color: #1E1F21;
        border-bottom: 1px solid $borderColor;
        box-sizing: border-box;
        position: relative;
        padding-right: convertToVw(14);
        .mint-cell-allow-right {
            color: #ABACAE;
            &::after {
                right: convertToVw(14) !important;
            }
        }
    }

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
        height: convertToVw(188);
        box-sizing: border-box;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: convertToVw(26) convertToVw(20) convertToVw(0) convertToVw(20);
        border-radius: convertToVw(5);
        background-color: #fff;

        .tip-title {
            font-size: convertToVw(17);
            color: #1e1f21;
        }

        .tip-desc {
            font-size: convertToVw(14);
            line-height: convertToVw(24);
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

    .holderQuestionMark {
        width: convertToVw(14);
        height: convertToVw(14);
        display: inline-block;
        vertical-align: convertToVw(-2);
        margin-left: convertToVw(2);
    }

    .dialog {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;

        .dialog-panel {
            position: absolute;
            width: 80vw;
            top: 40%;
            left: 50%;
            padding-top: convertToVw(30);
            padding-bottom: convertToVw(30);
            transform: translate(-50%, -50%);
            border-radius: convertToVw(10);
            background-color: #fff;

            .dialog-content {
                font-size: convertToVw(16);
                font-weight: normal;
                text-align: center;
                line-height: 2;
            }

            .btn-panel {
                width: 80%;
                margin: auto;
                display: flex;
                justify-content: space-between;
                margin-top: convertToVw(30);

                .btn {
                    box-sizing: border-box;
                    width: convertToVw(110);
                    text-align: center;
                    font-size: convertToVw(16);
                    line-height: convertToVw(36);
                    border-radius: convertToVw(36);
                }

                .btn-ok {
                    background-color: #e84518;
                    color: #fff;
                }

                .btn-cancel {
                    background-color: #fff;
                    color: #e84518;
                    border: 1px solid #e84518;
                }
            }
        }
    }
</style>