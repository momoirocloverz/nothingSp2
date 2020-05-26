<template>
    <div class="punch-result">
        <mt-header title="打卡结果" class="mint-header-title"></mt-header>

        <p v-if="type==0" class="tip">打卡中...</p>
        <punch-success v-if="type == 1"></punch-success>
        <punch-error v-if="type == 2" :errorType="errorType" :errorInfo="errorInfo"></punch-error>
        <div class="btn-zone">
            <div class="btn" @click="handleBack">{{type == 1 ? `回首页` : `返回`}}</div>
        </div>
        <div class="punch-box pt40 tc lh26" v-if="type == 9">
            <img class="wait-img" src="../../assets/img/wait.png" alt="">
            <div class="pt40">你前面还有{{waitNum}}人待打卡，请不要关闭页面 <br/> 等待{{waitTime}}秒后自动提交</div>
        </div>
    </div>
</template>

<script>
    import PunchSuccess from '@/views/attendence/components/PunchSuccess'
    import PunchError from '@/views/attendence/components/PunchError'

    export default {
        name: 'punchresult',
        components: {
            PunchSuccess, PunchError
        },
        data() {
            return {
                type: '0',
                params: {},
                errorType: '1',
                errorInfo: '',
                waitNum: 0,
                waitTime: 0,
                timeout: null,
            };
        },

        computed: {},
        watch: {},
        mounted() {
            this.getParams()
            this.punchAction()
        },
        methods: {
            handleBack() {
                this.$router.push({
                    name: 'calendar'
                })
            },
            timeOut(){
                setTimeout(()=>{
                    if (this.waitTime <= 0) {
                        if(this.timeout){
                            clearTimeout(this.timeout)
                        }
                        this.timeout = null
                        this.punchAction()
                    } else {
                        this.waitTime--;
                        this.timeOut()
                    }
                },1000)
            },
            // 获取打卡的参数
            getParams() {
                // 从存储中取得数据, 打卡数据集中存储在punchData对象中
                try {
                    let data = sessionStorage.getItem('punchData') || localStorage.getItem('punchData')
                    data = JSON.parse(data)
                    let signImg = sessionStorage.getItem('selfSign')
                    let pieceSize = data.pieceSize
                    let params = {
                        schedulingId: data.schedulingId,
                        type: data.type,
                        industry: data.industry,
                        date: data.date,
                        time: data.time + ':00',
                        endWorkType: 1,
                        startPhoto: '',
                        startSign: signImg,
                        endPhoto: '',
                        endSign: signImg,
                        pieceSize: pieceSize,
                        signatureStatus: 1,
                        signature: signImg,
                    }

                    this.params = params
                } catch (error) {
                    alert(error)
                }
            },

            punchAction() {
                let params = this.params
                this.$indicator.open({
                    spinnerType: 'fading-circle'
                })
                this.$api
                    .CheckIn(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            if (response.data.data && response.data.data > 0) {
                                this.waitNum = Number(response.data.data);
                                this.type = 9
                                this.waitTime = this.waitNum * 3;
                                this.timeout = this.timeOut()
                            } else {
                                this.type = 1
                            }
                        } else {
                            this.$toast(response.data.errorMsg)
                            this.type = 2
                            this.errorInfo = response.data.errorMsg
                        }
                    })
                    .catch(error => {
                        this.type = 2
                        this.errorInfo = '服务端错误'
                    })
                    .finally(() => {
                        this.$indicator.close()
                    });
            }
        },
    }
</script>
<style lang='scss'>
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    .punch-result {
        .mint-header-title {
            height: convertToVw(44);
            line-height: convertToVw(44);
            font-size: convertToVw(17);
        }
        .tip {
            padding: convertToVw(20);
        }

        .btn-zone {
            padding: convertToVw(20) convertToVw(18);
            background-color: #f5f5f5;

            .btn {
                height: convertToVw(48);
                padding: 0;
                line-height: convertToVw(48);
                border-radius: 5px;
                background-color: #ea441a;
                font-size: convertToVw(17);
                text-align: center;
                color: #fff;
            }
        }
    }
</style>