<template>
    <div id="">
        <mt-header title="提现" fixed class="mint-header-title">
            <div slot="left">
                <mt-button icon="back" @click="$router.back(-1)"></mt-button>
            </div>
        </mt-header>
        <div class="wthdrawals">
            <ul>
                <li>
                    <div class="w-t">
                        <span class="f16">代发收入</span>
                        <span class="w-btn" @click="go('2','代发收入',payTotal)">提现</span>
                    </div>
                    <div class="w-b">
                        <span class="">可用余额</span>
                        <div class="co-orange f30 pt15">{{payTotal}}</div>
                    </div>
                </li>
                <li>
                    <div class="w-t">
                        <span class="f16">外包费用</span>
                        <span class="w-btn" @click="go('1','外包费用',outTotal)">提现</span>
                    </div>
                    <div class="w-b">
                        <span class="">可用余额</span>
                        <div class="co-blue f30 pt15">{{outTotal}}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        name: "wthdrawals",
        data() {
            return {
                payTotal: 0,
                outTotal: 0,
                responseData: {},
            };
        },
        mounted() {
            this.getList()
        },
        methods: {
            go(type, name, num) {
                this.$router.push({
                    path: '/mine/cashout',
                    query: {
                        type: type,
                        text: name,
                        balance: num,
                    }
                })
            },
            getList() {
                this.$api.AccountDetail().then(res => {
                    let {data, respCode} = res.data;
                    if (respCode === 0) {
                        this.responseData = data;
                        this.payTotal = data.balance;
                        this.outTotal = data.outsourceAmount;
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
        }
    };
</script>
<style lang="scss" scoped>
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    .wthdrawals {
        position: fixed;
        left: 0;
        right: 0;
        top: 40px;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 1;

        ul {
            padding-top: convertToVw(18);
            font-size: convertToVw(14);

            li {
                background-color: #fff;
                border-bottom: 1px solid #D9D9D9;
                border-top: 1px solid #D9D9D9;
                margin-bottom: convertToVw(10);

                .w-t {
                    display: flex;
                    height: convertToVw(46);
                    padding: 0 convertToVw(15);
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #D9D9D9;
                    color: #6E7075;

                    .w-btn {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 60px;
                        height: 32px;
                        background-color: #E95A34;
                        color: #fff;
                        border-radius: 2px;
                    }
                }

                .w-b {
                    padding: convertToVw(15);
                    color: #6E7075;
                }
            }
        }
    }
</style>
