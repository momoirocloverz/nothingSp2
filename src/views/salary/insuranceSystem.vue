<template>
    <div class="insuranceSystemBox">
        <mt-header title="系统使用费明细" fixed class="mint-header-title">
            <div slot="left">
                <mt-button icon="back" @click="$router.go(-1)"></mt-button>
            </div>
        </mt-header>
        
        <div class="feeBox" :key='index' v-for="(item,index) in tableData">
            <p><span>{{item.schedulingName}}</span><span>{{item.amount | priceFormat}}</span></p>
            <p><span>上班打卡时间：</span><span>{{item.workStartDate}}&nbsp;&nbsp;{{item.workStartTime.substr(0,5)}}</span></p>
            <p><span>打卡工种：</span><span>{{item.industryName}}</span></p>
        </div>
        
    </div>
</template>
<script>
    export default {
        data() {
            return {
                tableData: []
            }
        },
        filters: {
            priceFormat:function(val){
                if( (toString.call(val) === '[object Null]')||(toString.call(val) === '[object Undefined]')  ){
                   return 0;
                }else{
                    let fix = (Math.round(+val + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                const params = this.$route.query;
                this.$api.adjustment(params).then(res => {
                    if (res.data.respCode == 0) {
                        if (res.data.data) {
                            this.tableData = res.data.data.list || []
                        }
                    }
                }).catch()
            }
        },
    }
</script>
<style lang="scss" scoped>
    .insuranceSystemBox {
        height: 100vh;
        background-color: #F5F5F5;
        padding-top:convertToVw(54);
        overflow-y: scroll;
        box-sizing: border-box;
    }

    .feeBox {
        padding: convertToVw(20) convertToVw(15);
        box-sizing: border-box;
        background-color: #fff;
        margin-bottom: convertToVw(18);
        border-bottom: 1px solid #D9D9D9;
        border-top: 1px solid #D9D9D9;
    }

    .feeBox p:first-child {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #1E1F21;
    }

    .feeBox p:first-child span:first-child {
        font-size: convertToVw(17);
    }

    .feeBox p:first-child span:last-child {
        font-size: convertToVw(15);
    }

    .feeBox p:nth-child(2) {
        margin: convertToVw(8) 0;
    }

    .feeBox p:nth-child(2) span:first-child {
        font-size: convertToVw(13);
        color: #6E7075;
    }

    .feeBox p:nth-child(3) span:first-child {
        font-size: convertToVw(13);
        color: #6E7075;
    }
</style>
