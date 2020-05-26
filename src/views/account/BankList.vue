<template>
    <div>
        <mt-header title="银行列表" fixed class="mint-header-title
">
            <div slot="left">
                <mt-button icon="back" @click="$router.go(-1)"></mt-button>
            </div>
        </mt-header>
        <div class="content_margin">
            <mt-cell v-for="(item,index) in list" :key="index" class="bank">
                <img slot="icon" :src="item" width="280" height="40">
            </mt-cell>
        </div>
    </div>
</template>

<script>
    export default {
        name: "bankList",
        data() {
            return {
                list: [
                    require('../../assets/bank/中国邮政.png'),
                    require('../../assets/bank/中国农业银行.png'),
                    require('../../assets/bank/中国建设银行.png'),
                    require('../../assets/bank/中国工商银行.png'),
                    require('../../assets/bank/中国银行.png'),
                    require('../../assets/bank/中信银行.png'),
                    require('../../assets/bank/北京银行.png'),
                    require('../../assets/bank/广发银行.png'),
                    require('../../assets/bank/上海银行.png'),
                    require('../../assets/bank/华夏银行.png'),
                    require('../../assets/bank/交通银行.png'),
                    require('../../assets/bank/平安银行.png'),
                    require('../../assets/bank/浦发银行.png'),
                    require('../../assets/bank/光大银行.png'),
                    require('../../assets/bank/兴业银行.png'),
                    require('../../assets/bank/招商银行.png'),
                    require('../../assets/bank/中国民生银行.png'),
                ],
            }
        },
        methods: {}
    }
</script>

<style scoped>

</style>