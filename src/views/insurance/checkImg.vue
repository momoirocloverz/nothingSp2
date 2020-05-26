<template>
    <div class="box">
        <mt-header title="保险介绍页面" fixed class="mint-header-title">
            <div slot="left">
                <mt-button icon="back" @click="$router.go(-1)"></mt-button>
            </div>
        </mt-header>
        <div>
            <img src="../../assets/img/effect.png" alt="" style="margin:20px auto 0;display: block;width:100%;">
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
}
</script>
<style>
.box{
    height: 900px;
    background: #ffffff;
    padding-top: 40px;
}
</style>
