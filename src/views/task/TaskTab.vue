<template>
    <div style="background-color: #F5F5F5;height: 100%">
<!--        <PanicList></PanicList>-->
        <PanicCopyList></PanicCopyList>
    </div>
</template>
<script>
    import PanicList from './PanicList.vue';
    import PanicCopyList from './PanicCopyList.vue';
    export default {
        name: 'app',
        components:{
            PanicList,
            PanicCopyList,
        },
        data () {
            return {
            }
        },
        mounted(){
        },
        methods:{
        }
    }
</script>
<style lang="scss">
    .mint-header.is-fixed {
        top: 0;
        right: 0;
        left: 0;
        position: fixed;
        z-index: 99;
    }
    .mint-header{
        height: 2.2rem;
    }
    .mint-header-title{
        font-size: 0.9rem;
    }
    body{
        background-color:white;
    }
    .mint-tab-item-icon {
        width: 0.85rem;
        height: 0.85rem;
        margin: 0 auto 0.38rem;
    }
    .routerview{
        margin-top: 45px;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .2s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }
    .mint-tab-item-icon{
        width: 0.85rem;
        height: 0.85rem;
    }
    .mint-tab-item-label{
        font-size: 0.65rem;
    }
</style>