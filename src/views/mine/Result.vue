<template>
    <div>
        <mt-header title="结果详情" fixed class="mint-header-title
">
            <div slot="left">
                <mt-button icon="back" @click="$router.back(-1)"></mt-button>
            </div>
        </mt-header>
        <div class="pt flexable">
            <img src="../../assets/img/smile@3x.png" alt="围笑" class="smile">
            <div class="text">提现申请已提交，等待银行处理</div>
            <div>
                <mt-button type="primary" class="logBtn" @click="login">完成</mt-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'Result',
    data () {
        return {
            
        }
    },
    methods: {
        login(){
            this.$router.push({name:'open'})
        }
    }
}
</script>
<style scoped>
.smile{
    width: 4.53rem;
    height: 4.53rem;
    display: block;
    margin:1.25rem 0 2.28rem
}
.pt{
    padding-top: 2rem;
    width:100%;
    justify-content: center;
    align-items: center;
    flex-direction: column
}
.logBtn {
    width: 7.35rem;
	height: 1.75rem;
    border-radius: 1.01rem;
    font-size: 0.75rem;
    margin: 4.47rem 0 0;
}
.text{
    width:90%;
    text-align: center;
    color: #636363;
    font-size: 0.75rem;
}
</style>
