<template>
    <div class="ma-show">
        <mt-header title="预打卡中" fixed class="mint-header-title">
            <router-link to="/home/workspace" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="pt40 tc ma-error" v-show="isError">
            <span class="">打卡失败</span>
            <p class="pt15">{{isErrorText}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'maShow',
        components: {},
        data() {
            return {
                data:{},
                info:{},
                isError:false,
                isErrorText:'',
            };
        },

        computed: {},
        watch: {
        },
        created(){
            let data = JSON.parse(sessionStorage.getItem("wechatLogin")) || {};
            this.data = data.state;
            this.info = JSON.parse(sessionStorage.getItem("userInfo")) || {};
            console.log(this.data)
            console.log(this.info)
            this.getTimeStr()
        },
        mounted() {
        },
        methods: {
            getTimeStr(){
                this.$api.getHostTime()
                    .then(res => {
                        if (res.data.respCode == 0) {
                            if(res.data.data - this.data.c > 1000*60*30){
                                this.isError = true;
                                this.isErrorText = '二维码已失效'
                            }else{
                                this.AddDailyEmpCheck()
                            }
                        }
                    }).catch(err=>{
                    console.log(err)
                })
            },
            AddDailyEmpCheck() {
                console.log(1)
                const params = {
                    schedulingId:this.data.id,
                    talentId: this.info.talentId,
                    industry: this.data.ind,
                }
                this.$api.preAddDailyEmpByQrCheck(params).then((res) => {
                    console.log(res)
                    if (res.data.respCode == 0) {
                        if(res.data.data == 1){
                            this.$router.replace({name:'workerCard',query:{new:'true'}})
                        }else{
                            this.addDailyEmp()
                        }
                    }else{
                        this.isError = true;
                        this.isErrorText = res.data.errorMsg;
                    }
                });
            },
            addDailyEmp() {
                const params = {
                    schedulingId:this.data.id,
                    talentId:this.info.talentId,
                    industry: this.data.ind,
                    payType:this.data.pt,
                }
                this.$api.addDailyEmp(params).then((response) => {
                    console.log(response.data)
                    if (response.data.respCode == 0) {
                        this.$router.replace({name:'workerCard',query:{new:'true'}})
                    }else{
                        this.isError = true;
                        this.isErrorText = res.data.errorMsg;
                    }
                }).catch(err => {
                    console.log(err)
                });
            },
        },
    }
</script>
<style lang='scss'>
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .ma-error{
        position: fixed;
        top: convertToVw(44);
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>