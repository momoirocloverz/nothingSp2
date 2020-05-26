<template>
    <div>
        <img src="../../assets/img/navigation.png" alt="" class="navi-icon" v-show="!visible && isShow" @click="visible=true">

        <div class="u-mask" v-show="visible">
            <div class="navigation flexable">
                <div class="navi-row flexable">
                    <div class="navi-item flexable" @click="$router.push('/task/received')">
                        <img src="../../assets/img/task2.png" alt="" class="natab-icon">
                        <span class="natab-label">工单</span>
                    </div>
                    <div class="navi-item flexable"  @click="$router.push({name:'calendar'})">
                        <img src="../../assets/img/scheduling2.png" alt="" class="natab-icon">
                        <span class="natab-label">排班日历</span>
                    </div>
                </div>
                <div class="navi-row flexable">
                    <div class="navi-item flexable" @click="$router.push({name:'salaryTab'})">
                        <img src="../../assets/img/calendar2.png" alt="" class="natab-icon" >
                        <span class="natab-label">收入</span>
                    </div>
                    <div class="navi-item flexable" @click="$router.push('/home/mine')">
                        <img src="../../assets/img/mine2.png" alt="" class="natab-icon">
                        <span class="natab-label">个人中心</span>
                    </div>
                </div>
                <div class="navi-row flexable">
                    <div class="navi-item flexable" @click="visible=false">
                        <img src="../../assets/img/close2.png" alt="" class="natab-icon">
                        <span class="natab-label">返回</span>
                    </div>
                    <div class="navi-item flexable">
                        <img src="" alt="" class="natab-icon">
                        <span class="natab-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </div>
                </div>
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
        isShow:true,
        visible:false,
        msg: "Hello Vue.js"
      }
    },
    watch: {
      $route:function(val,oldval) {
        console.log('llllllllll')
        this.visible=false
        if(this.$route.meta.isRequireAuth == false || this.$route.name=='identification'){
          console.log(this.$route.meta.isRequireAuth)
          this.isShow=false
        }else{
          this.isShow=true
        }
      }
    },
    mounted(){
      console.log(this.$route)
      if(this.$route.meta.isRequireAuth == false){
        this.isShow=false
      }
    },
    methods: {}
  }
</script>

<style scoped>
    .navigation{
        width:100%;
        height:95%;
        flex-direction: column;
        justify-content: flex-end;
    }

    .navi-icon {
        width: 3rem;
        height: 3rem;
        bottom: 0.93rem;
        left: 0.85rem;
        position: fixed;
        z-index: 100;
    }

    .natab-icon {
        width: 2.63rem;
        height: 2.63rem;
        z-index: 100;
    }

    .navi-row {
        justify-content: space-around;
        width: 100%;
        height: 3.6rem;
    }

    .navi-item {
        align-items: center;
    }

    .natab-label {
        font-size: 0.86rem;
        letter-spacing: 0.04rem;
        color: #ffffff;
        margin-left: 0.88rem;
    }
</style>