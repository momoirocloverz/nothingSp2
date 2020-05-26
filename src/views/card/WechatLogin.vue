<template>
    <div>
    </div>
</template>

<script>
    export default {
        name:'bindWechat',
        data () {
            return {
                id:''
            }
        },
        methods: {
            bind(code) {
                let params = {
                    code:code,
                    loginType:5
                }
                this.$api
                .WechatLogin(params)
                .then(response => {
                    console.log(response)
                    if(response.data.respCode==0){
                        // this.$indicator.close();
                        this.$router.replace({name:'Mine'})
                        sessionStorage.setItem("shareType", '2');//不分享默认2
                        sessionStorage.setItem("logintype", response.data.data.loginType);
          sessionStorage.setItem("isAuthenticated", response.data.data.isAuthenticated);
          sessionStorage.setItem(
            "userInfo",
            JSON.stringify(response.data.data)
          );
                    }
                })
                .catch(error => {
                console.log(error);
                });
            },
            handle(type){
                let params = {
                    type:type,
                    snsapi_userinfo:type == 3? 'snsapi_userinfo' : 'snsapi_base',
                    state:type != 1 ? this.id : ''
                }
                this.$api
                .wechatHandle(params)
                .then(response => {
                    console.log(response)
                    if(response.data.respCode==0){

                    }
                })
                .catch(error => {
                console.log(error);
                })
            }
        },
        mounted () {
            // this.$indicator.open({
            //       spinnerType: 'fading-circle'
            //     });
             this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId;
            // let code = sessionStorage.getItem('wechatLogin')
            // this.handle(this.$route.query.type)
        }
    }
</script>

<style scoped>

</style>