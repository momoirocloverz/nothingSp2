<template>
    <div>
        <mt-header  title="收入详情" fixed class="mint-header-title
">
            <div slot="left">
                <mt-button icon="back" @click="$router.go(-1)"></mt-button>
            </div>
        </mt-header>

        <div class="container">
            <div style="padding: 0 1rem">
                <mt-cell title="劳务所得合计" to="" is-link value="" class="sum">
                    <span class="fs">10000.00元</span>
                </mt-cell>
                <div class="acco-body">
                    <div class="acco-items">
                    <div class="acco-item flexable" @click="show=!show">
                    <span >奖惩合计</span>
                    <span>-200.00元</span>
                    <img src="../../assets/img/up@2x (2).png" alt="" class="acco-arrow">
                    </div>
                    <div class="splitline1"></div>
                        <transition name="downwork">
                    <div class="acco-item-children" v-show="show==true">
                        <div class="acco-item-child flexable">
                        <span>违反工作纪律-迟到(12-05)</span>
                        <span>-100.00元</span>
                        </div>
                        <div class="splitline1"></div>
                        <div class="acco-item-child flexable">
                        <span>违反工作纪律-迟到(12-05)</span>
                        <span>-100.00元</span>
                        </div>
                        <div class="splitline1"></div>

                    </div>
                        </transition>
                    </div>

                    <!--不参与循环-->
                    <div class="acco-items">
                        <div class="acco-item flexable">
                            <span >实发计社保收入</span>
                            <span>-200.00元</span>

                        </div>
                        <div class="splitline1"></div>
                    </div>
                    <div class="acco-items">
                        <div class="acco-item flexable">
                            <span >实发提供发票劳务收入</span>
                            <span>-200.00元</span>

                        </div>
                        <div class="splitline1"></div>
                    </div>
                    <div class="acco-items">
                        <div class="acco-item flexable">
                            <span >实发合计</span>
                            <span>-200.00元</span>

                        </div>
                        <div class="splitline1"></div>
                    </div>

                </div>
            </div>
           <div>
               <span></span>
           </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        show:false,
        msg: "Hello Vue.js",
        items1:[{},{}]
      }
    },
    watch() {

    },
    methods: {}
  }
</script>

<style scoped>
.acco-arrow{
    width: 0.7rem;
    height: 0.4rem;
    position: absolute;
    right: 0rem;
    top: 0.8rem;
}
    .acco-body{
        line-height: 2.1rem;
    }
    .acco-item{
        position: relative;
        justify-content: space-between;
        padding-right: 1rem;
    }
    .acco-item-children{
        padding:0 1rem;
    }
    .acco-item-child{
        justify-content: space-between;
    }
    .splitline1{
        /*height: 0.05rem;*/
        height: 1px;
        background-color: #e5e5e5;
        margin: 0.03rem 0rem;
    }
    .acco-items{
        color: #262626;
    }
.downwork-enter-active {
    /*transition: all .3s ease;*/
    transition-duration:5s;
    -webkit-transition-duration:5s;
}
.downwork-leave-active{
    /*transition: all .3s ease;*/
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>