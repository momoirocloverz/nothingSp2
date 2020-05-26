<template>
    <div class="bindCardDialogCon cusFix">
        <div class="content cusFix">
            <div class="firstLine">您已产生收入，请及时绑定银行卡或支付宝。</div>
            <div class="secondLine">否则将导致收入无法正常发放。</div>
            <div class="thirdLine">
                <div class="first"><span @click="shut">关闭</span></div>
                <div class="second"><span @click="goSomeWhere">去绑卡</span></div>
                <!--<div class="second"><span @click="goSomeAlipay">去绑定支付宝</span></div>-->
            </div>
            <div class="fourthLine">
                <van-checkbox v-model="status" checked-color="#E95A34">今天内不提醒</van-checkbox>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {Checkbox} from 'vant';
    import 'vant/lib/checkbox/style';

    Vue.use(Checkbox);
    export default {
        name: 'bindCardDialogCon',
        data() {
            return {
                status: false,
                hasAuth: '',
                idCard: '',
                isInformation: '',
                bankCardBindingStatus: false,
            }
        },
        mounted() {
        },
        methods: {
            shut() {
                let user = sessionStorage.getItem("userInfo");
                let name = '';
                if (user) {
                    name = JSON.parse(user).userId;
                }
                if (this.status) {
                    let now = Date.now();
                    // let part = dayjs(now).format('YYYY-MM-DD');
                    // let end = Date.parse(dayjs(`${part} 23:59:59`) );
                    localStorage.setItem('haveInComeTimeStamp', now);
                    localStorage.setItem('haveInComeTimeMatch', name);
                }
                // sessionStorage.setItem( 'tempShutDialog','1' );
                this.$emit('controlShow', {
                    show: false,
                });
            },
            getStatus(type) {
                this.$api.getUserInfo().then(res => {

                    let {data: layer1} = res;
                    let {respCode, data} = layer1;
                    if (respCode === 0) {
                        if (data) {
                            this.hasAuth = data.isRecognised === 1 ? true : false;
                            this.idCard = data.idCard || '';
                            this.isInformation = data.baseInfoStatus === 1 ? true : false;
                            this.checkStatus(type);
                        } else {
                            this.checkStatus(type);
                        }
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            checkStatus(type) {
                let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                let talentId = userInfo.talentId;
                if (this.hasAuth) { //是否人脸识别
                    // sessionStorage.setItem('cashout', true)
                    if(type == 1){ //银行卡绑定跳转
                        this.$router.push({name: 'bindbankcard'})
                    }else if(type == 2){//支付宝绑定跳转
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
                                this.$api.detectAuth(param).then(res => {
                                    if (res.data.respCode == 0) {
                                        let data = JSON.parse(res.data.data)
                                        let url = data.Url
                                        let bizToken = data.BizToken
                                        localStorage.setItem('biztoken', bizToken)
                                        window.location.href = url
                                    }
                                }).catch(err => {
                                    console.log(err)
                                }).finally(() => {
                                    this.$indicator.close()
                                })
                            } else {
                                localStorage.setItem('authBackUrl', JSON.stringify(location.hash));
                                this.$router.push({path: '/bindingManager', query: {type: true}})
                            }
                        }
                    })
                }
            },
            goSomeWhere() {
                this.$emit('controlShow', {
                    show: false,
                });
                // sessionStorage.setItem( 'tempShutDialog','1' );
                this.getStatus(1);
            },
            goSomeAlipay() {
                this.$emit('controlShow', {
                    show: false,
                });
                // sessionStorage.setItem( 'tempShutDialog','1' );
                this.getStatus(2);
            },
        }
    }
</script>
<style lang="scss" scoped>
    .cusFix {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }

    .bindCardDialogCon {
        width: 100%;
        height: 100vh;
        font-size: convertToVw(14);
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10;

        .content {
            box-sizing: border-box;
            padding-top: convertToVw(20);
            padding-left: convertToVw(15);
            padding-right: convertToVw(15);
            width: convertToVw(320);
            height: convertToVw(200);
            background-color: #fff;
            border-radius: convertToVw(5);
        }

        .firstLine {
            text-align: center;
            margin-bottom: convertToVw(15);
        }

        .secondLine {
            margin-top: convertToVw(20);
            margin-bottom: convertToVw(30);
            text-align: center;
            font-size: convertToVw(16);
        }

        .thirdLine {
            color: #E95A34;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            margin-bottom: convertToVw(15);

            .first {
                width: convertToVw(100);
                text-align: center;
            }

            .second {
                width: convertToVw(100);
                text-align: center;
            }
        }

        .fourthLine {
            .van-checkbox {
                width: 50%;
                margin: 0 auto;
            }
        }
    }
</style>