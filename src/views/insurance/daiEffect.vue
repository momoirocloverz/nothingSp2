<template>
    <div>
        <p style="padding:5px 0;"></p>
        <div style="background: #ffffff;margin-bottom:15px;height: 6.7rem;display: flex;flex-direction: column;"
             v-for="item in dataList0" @click="goToCheckImg">
            <div class="BZ">
                <p class="p-pos">人身意外险 <span class="span-posa">查看细则</span></p>
                <p><span>被保人：</span><span>{{item.talentName}}</span></p>
                <p><span>保障时间：</span><span>{{item.policyTime}}</span></p>
                <p><span>保单号：</span><span>{{item.policyNo}}</span></p>
            </div>
            <!-- <div class="btn">
                <span></span>
                <button>拨打理赔电话</button>
            </div> -->
        </div>
        <div style="margin-top:80px;margin-left:150px;font-size:13px;color:#6E7075;"
             v-if="dataList0.length==0?true:false">暂无相关信息
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                talentId: '',
                dataList0: [],
            }
        },
        mounted() {
            this.getData0()
        },
        methods: {
            getData0() {
                const params = {
                    policyStatus: 0,
                    talentId: this.talentId
                }
                this.$api.insuList(params).then(res => {
                    //   console.log(res)
                    if (res.data.respCode == 0) {
                        if (res.data.data) {
                            this.dataList0 = res.data.data.list || []
                        }
                    }
                }).catch()
            },
            goToCheckImg() {
                this.$router.push({name: 'checkImg'})
            },
        },
        created() {
            this.talentId = JSON.parse(sessionStorage.getItem('userInfo')).talentId
            // console.log(JSON.parse(sessionStorage.getItem('userInfo')).talentId)
        }
    }
</script>
<style>
    .BZ {
        /* height: 6.7rem; */
        padding: 1rem 0 0 0.75rem;
        box-sizing: border-box;
        background: #ffffff;
    }

    .BZ p {
        color: #1E1F21;
    }

    .btn {
        padding: 1.1rem 0.75rem;
        height: 2.75rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .btn button {
        padding: 0.3rem 0.6rem;
        border: 0.05rem solid rgba(213, 61, 23, 1);
        border-radius: 0.15rem;
        color: #D53D17;
        background: #ffffff;
        /* margin-top: 0.6rem; */
    }

    .BZ p:first-child {
        font-size: 0.85rem;
    }

    .BZ p:nth-child(2), .BZ p:nth-child(3) {
        margin: 0.4rem 0;
    }

    .BZ p:nth-child(2) span:first-child, .BZ p:nth-child(3) span:first-child, .BZ p:nth-child(4) span:first-child {
        color: #6E7075;
        font-size: 0.65rem;
    }

    .BZ p:nth-child(2) span:last-child, .BZ p:nth-child(3) span:last-child, .BZ p:nth-child(4) span:last-child {
        font-size: 0.65rem;
    }
</style>
