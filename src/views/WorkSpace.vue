<template>
    <div>
        <mt-header title="工作台" fixed class="mint-header-title"></mt-header>

        <div class="container">
            <div class="ws-cell">
                <!--<div class="ws-cell-item" @click="routeToTask">-->
                <!--<img src="../../src/assets/img/theme_icon1.png" class="task-icon">-->
                <!--<p class="task-label">领工单</p>-->
                <!--</div>-->
                <div class="ws-cell-item" @click="routeToSchedule">
                    <img src="../../src/assets/img/theme_icon2.png" class="task-icon">
                    <p class="task-label">排班日历</p>
                </div>
                <div class="ws-cell-item" @click="routeToSalary">
                    <img src="../../src/assets/img/theme_icon3.png" class="task-icon">
                    <p class="task-label">收入</p>
                </div>
                <div class="ws-cell-item" @click="routeToInsurance">
                    <img src="../../src/assets/img/theme_icon4.png" class="task-icon">
                    <p class="task-label">保险</p>
                </div>
                <div class="ws-cell-item" @click="routeToMessage">
                    <img src="../../src/assets/img/message-icon.png" class="task-icon">
                    <span v-if="unReadData > 0" class="span-point">{{unReadData}}</span>
                    <p class="task-label">消息</p>
                </div>
            </div>
            <!--<a :href="this.href" id="bind"></a>-->
        </div>
    </div>
</template>

<script>
    import {MessageBox} from 'mint-ui';

    export default {
        name: "WorkSpace",
        data() {
            return {
                id: '',
                idCard:'',
                href: '',
                unReadData:0,
                timer: null,
                hasAuth: '',//是否认证
                isInformation: '',//是否完善信息
            }
        },
        mounted() {
            this.getInfo()
            this.getUnRead()
            // this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId;
            // this.href = `${this.$baseURL}public/wechat/operateRedirect?type=2&scope=snsapi_userinfo&state=${this.id}`
            // let userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
            // let wechaterror = sessionStorage.getItem('wechaterror')  // 微信绑定没有出错才跳转到微信绑定，否则会进入死循环
            //
            // if (userInfo.isBindingWeChat == false) {
            //   sessionStorage.setItem('lastBindStatus', false)
            // }
            //
            // let lastBindStatus = sessionStorage.getItem('lastBindStatus')
            // if (lastBindStatus == "false" && userInfo.isBindingWeChat) {
            //   this.$messagebox({
            //     title: '已将您的微信与当前登录账号进行绑定，绑定后无需登录即可访问.',
            //     message: '后续您可在个人中心-账号设置页面，进行微信的解绑和绑定操作',
            //     confirmButtonText: '确认'
            //   }).then(action => {
            //     sessionStorage.setItem('lastBindStatus', true)
            //   })
            // }
            //
            // if (userInfo.isBindingWeChat == false && !wechaterror) {
            //   this.setTimerCount()
            // }
        },
        methods: {
            // redirect() {
            //   clearTimeout(this.timer)
            //   document.getElementById('bind').click();
            // },
            getInfo() {
                let _this = this;
                this.$api.getUserInfo().then(response => {
                    console.log(response);
                    if (response.data.respCode == 0) {
                        if (response.data.data) {
                            _this.hasAuth = response.data.data.isRecognised === 1 ? true : false
                            _this.isInformation = response.data.data.baseInfoStatus === 1 ? true : false
                            _this.idCard = response.data.data.idCard || '';
                        }
                        console.log(_this.idCard)
                    }
                })
                    .catch(error => {
                        console.log(error);
                    });
            },
            getUnRead(){
                let talentId = JSON.parse(localStorage.getItem('userInfo')).talentId
                this.$api.logPushUnRecord({talentId:talentId}).then(res=>{
                    if(res.data.respCode === 0){
                        this.unReadData = res.data.data;
                    }
                    console.log(res)
                })
            },
            routeToTask() {
                this.$router.push('/task')
            },
            routeToSalary() {
                this.$router.push({
                    name: "salaryTab"
                });
            },
            routeToSchedule() {
                let _this = this;
                let token = sessionStorage.getItem('token');
                if(!token){
                    return this.$messagebox({
                        title: `提示`,
                        message: `你还未进行登录,需登录后才能继续操作`,
                        showCancelButton: true,
                        confirmButtonText: "登录",
                        cancelButtonText: "关闭"
                    }).then(action => {
                        if (action == 'confirm') {
                            _this.$router.replace({path: '/'})
                        }else{

                        }
                    })
                }
                let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                let talentId = userInfo.talentId
                if(this.hasAuth){ //是否人脸识别
                    this.$router.push({name: 'calendar'})
                }else{  //未人脸识别提示
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
            },
            routeToInsurance() {
                this.$router.push({name: 'insuranceList'})
            },
            routeToMessage() {
                this.$router.push({name: 'messageIndex'})
            },
            // setTimerCount: function () {
            //   this.timer = setTimeout(() => {
            //     this.redirect()
            //   }, 1)
            // },
        },
        beforeDestroy() {
            // clearTimeout(this.timer)
        },
    }
</script>
<style lang="scss">

</style>
<style scoped lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .ws-cell-item {
        position: relative;
        .span-point{
            position: absolute;
            right:convertToVw(-8);
            top:convertToVw(-8);
            width: convertToVw(20);
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #E95A34;
            font-size:convertToVw(12);
            color: #fff;
            border-radius: convertToVw(9);
            height: convertToVw(20);
        }
        /* margin: 1.22rem !important; */
    }
    .confirm-btngroup {
        margin-top: 0.83rem;
    }
    .confirm-btn {
        background-color: #e84518;
        border-radius: 1rem;
        font-family: PingFang-SC-Medium;
        font-size: 0.75rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0rem;
        letter-spacing: 0.04rem;
        color: #ffffff;
        padding: 0.53rem 1rem;
    }
    .cancel-btn {
        background-color: #ffffff;
        border: solid 0.03rem #e84518;
        border-radius: 1rem;
        font-family: PingFang-SC-Medium;
        font-size: 0.75rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0rem;
        letter-spacing: 0.04rem;
        color: #e84518;
        padding: 0.53rem 1rem;
        margin-left: 0.7rem;
    }

    .confirm-title {
        font-family: PingFang-SC-Regular;
        font-size: 0.75rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 1.2rem;
        letter-spacing: 0rem;
        color: #0d0d0d;
    }

    .u-mask {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        left: 0px;
        top: 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 20;
        margin: 0 !important;
    }

    .u-confirm {
        width: 12rem;
        height: 6.65rem;
        background-color: #ffffff;
        border-radius: 0.5rem;
        padding: 0.93rem;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .ws-cell {
        padding: convertToVw(32);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .task-icon {
        width: 2.08rem;
        height: 2.08rem;
        border-radius: 0.2rem;
    }

    .task-label {
        font-family: PingFang-SC-Medium;
        font-size: 0.65rem;
        letter-spacing: 0.03rem;
        color: #0d0d0d;
        margin-top: 0.73rem;
    }

    .ws-cell-item {
        width: convertToVw(44);
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
            height: convertToVw(44);
        }

        p {
            text-align: center;
            white-space: nowrap;
        }
    }

    .comfirm {
        background-color: #e84518;
        border-radius: 1rem;
        font-size: 0.75rem;
        padding: 0.5rem 1rem 0;
    }

    a {
        text-decoration: none;
        color: #ffffff;
    }
</style>

