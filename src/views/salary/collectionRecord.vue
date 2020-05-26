<template>
    <div class="collectionRecordCon">
        <mt-header title="付款记录" fixed class="mint-header-title">
            <div slot="left">
                <mt-button icon="back" @click="$router.go(-1)"></mt-button>
            </div>
        </mt-header>
        <div class="itemCon">
            <div class="item" :key="index" v-for="(item,index) in arr">
                <div class="flex firstLine">
                    <div class="firstLineText">
                        {{ item.payTime | dateFormat }}
                    </div>
                    <div class="firstLineAmount">{{ item.amount | priceFormat}}</div>
                </div>
                <div class="flex secondLine">
                    <div class="secondLineText">付款方式：</div>
                    <div class="secondLineTime">{{ item.payWay | payWayFormat}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                arr:[],
                currentPage:1,
            }
        },
        filters: {
            dateFormat:function(val){
                if(val){
                    return dayjs(val).format('YYYY-MM-DD HH:mm');
                }else{
                    return '无';
                }
            },
            priceFormat:function(val){
                if( (toString.call(val) === '[object Null]')||(toString.call(val) === '[object Undefined]')  ){
                   return 0;
                }else{
                    let fix = (Math.round(+val + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },
            payWayFormat:function(val){
                if (val) {
                    if( val ==1 ){
                        return '线下'
                    }else{
                        return '线上'
                    }
                } else {
                    return '无'
                }
            },
        },
        mounted(){
            this.initArr();
        },
        methods:{
            initArr(){
                const params = {
                    talentId: this.$route.query.talentId,
                    payType:this.$route.query.payType,
                    outsourcingCusId:this.$route.query.outsourcingCusId,
                    batchNumber: this.$route.query.batchNumber,
                    customerId: this.$route.query.customerId,
                    pageNum: this.currentPage,
                };
                this.$api.payRecordDetail(params).then(res => {
                    let { data:layer1 } = res;
                    let { data,respCode } = layer1;
                    if( respCode === 0 ){
                        if(data.list){
                            if( data.list.length ){
                                this.arr = data.list;
                            }
                        }else{
                            this.arr = [];
                        }
                    }
                }).catch(err=>{
                    console.log('err',err);
                });                
            },
        },
    }
</script>
<style scoped lang="scss">
    .collectionRecordCon {
        padding-top: 2rem;
        background-color: #f5f5f5;
        box-sizing: border-box;
        height: 100vh;
        overflow-y: scroll;
        .itemCon {
            padding-top: convertToVw(20);
        }
        .item {
            background-color: #fff;
            padding-right: convertToVw(15);
            padding-left: convertToVw(15);
            padding-top: convertToVw(15);
            padding-bottom: convertToVw(15);
            box-sizing: border-box;
            border-bottom: 1px solid #D9D9D9;
            border-top: 1px solid #D9D9D9;
            margin-bottom: convertToVw(20);
            .firstLine {
                color: #1E1F21;
                justify-content: space-between;
            }
            .firstLineText {
                font-size: convertToVw(17);
            }
            .firstLineAmount {
                font-size: convertToVw(15);
            }
            .secondLine {
                font-size: convertToVw(13);
                margin-top: convertToVw(4);
                margin-bottom: convertToVw(4);
            }
            .secondLineText {
                color: #6E7075;
            }
            .secondLineTime {
                color: #1E1F21;
            }
        }
    }
</style>