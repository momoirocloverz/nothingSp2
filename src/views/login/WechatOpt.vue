<template>
    <div>
        授权登录中......
    </div>
</template>

<script>
    export default {
        name: "wechatOpt",
        data() {
            return {
                id: '',
                bankCardBindingStatus:false,
            }
        },
        methods: {
            toBind(code, state) {
                const params = {
                    code: code,
                    state: state,
                };
                console.log(params);
                this.$api
                    .WechatToBind(params)
                    .then(response => {
                        let data = JSON.parse(sessionStorage.getItem("userInfo"))
                        let wechatdata = JSON.parse(sessionStorage.getItem("wechatLogin"));
                        let bindtype = wechatdata.type
                        if (response.data.respCode == 0) {
                            data.avatar = response.data.data
                            data.isBindingWeChat = true;
                            sessionStorage.setItem('userInfo', JSON.stringify(data))  
                            sessionStorage.setItem("shareType", '2');//不分享默认2
                            localStorage.setItem("userInfo", JSON.stringify(data)) 
                            // 从工作台绑定的回到工作台，从个人中心绑定的返回个人中心
                            if (bindtype == 2) {
                                this.$router.replace({name: 'Mine'})
                            } else if (bindtype == 5) {
                                this.$router.replace({name: 'setting'})
                            } else if (bindtype == 16) {
                                console.log('16' + '-------成功的跳转')
                                this.$router.replace({name: 'bind'})
                            }else if (bindtype == 17) {
                                console.log('17' + '-------二维码打卡')
                                this.$router.replace({name: 'backShow'})
                            }
                        } else {
                            if (bindtype != 16) {
                                this.$toast(response.data.errorMsg)
                            }
                            sessionStorage.setItem('wechaterror', true)  // 微信绑定过程中出错
                            if (bindtype == 2) {
                                this.$router.replace({name: 'Mine'})
                            } else if (bindtype == 5) {
                                this.$router.replace({name: 'setting'})
                            } else if (bindtype == 16) {
                                console.log('16' + '-------微信绑定失败的跳转')
                                this.$router.replace({name: 'unBind'})
                            }
                        }
                        this.$indicator.close();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            checkIsHaveInCome(){
              this.$api.isHaveInCome().then(res=>{
                  let { data:layer1 } = res;
                  let { data,respCode } = layer1;
                  if( respCode === 0 ){
                      localStorage.setItem( 'haveInCome',data );
                  }
              }).catch(err=>{
                  console.log('err',err)
              })
          },
            getAccountDetail() {
                this.$api.AccountDetail().then(res => {
                    let { data, respCode } = res.data;
                    if (respCode === 0) {
                        this.bankCardBindingStatus = data.bankCardBindingStatus === 1 ? false : true;
                        localStorage.setItem( 'haveInComeBankCardBindingStatus',JSON.stringify(this.bankCardBindingStatus) );
                    } else {
                        this.$toast({
                            message: '网络异常。',
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            login(code) {
                let data = JSON.parse(sessionStorage.getItem("wechatLogin"));
                let params = {
                    code: code,
                    loginType: 5
                }
                this.$api.WechatLogin(params).then(response => {
                        console.log(response)
                        if (response.data.respCode == 0) {
                            sessionStorage.setItem("logintype", response.data.data.loginType);
                            sessionStorage.setItem("isAuthenticated", response.data.data.isAuthenticated);
                            sessionStorage.setItem("userInfo", JSON.stringify(response.data.data));
                            sessionStorage.setItem("shareType", '2');//不分享默认2
                            localStorage.setItem("userInfo", JSON.stringify(response.data.data))
                            // this.getAccountDetail();
                            // this.checkIsHaveInCome();紧急处理性能问题
                            // localStorage.setItem( 'comeFrom','2' );
                            if(data.type == 16){
                                console.log('绑定成功跳转 16')
                                this.$router.replace({name: 'bind'})
                            }else if(data.type == 17){
                                this.$router.replace({name: 'backShow'})
                            }else{
                                this.$router.replace({ name: 'Mine' })
                            }
                        } else {
                            // 如果返回了openid，不提示
                            if(data.type == 16){
                                console.log('失败跳转 16');
                                this.$router.replace({name: 'unBind'})
                            }else{
                                if (response.data.errorCode == 80103) {

                                } else {
                                    this.$toast(response.data.errorMsg)
                                }
                            }
                        }
                        this.$indicator.close();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },

        },
        mounted() {
            this.$indicator.open({
                spinnerType: 'fading-circle'
            });
            let data = JSON.parse(sessionStorage.getItem("wechatLogin"));
            // this.$messagebox({
            //     title: `提示`,
            //     message: data.code,
            // })
            console.log(data, data.type);
            // console.log('userInfo', userInfo);
            console.log(window.location);
            if (data.type == 1 || data.type == 16 || data.type == 17) {
                this.login(data.code)
            } else if (data.type == 2) {
                this.toBind(data.code, data.state)
            } else if (data.type == 5) {  // 用户手动绑定
                this.toBind(data.code, data.state)
            }
            this.$indicator.close();
        },
        destroyed() {
            this.$indicator.close();
        }
    }
</script>

<style scoped>
</style>