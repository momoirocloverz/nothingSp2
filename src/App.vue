<template>
  <div id="app">
      <meta name="format-detection" content="telephone=yes" />
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
      <!--<bindCardDialog v-if="showBindCard" @controlShow="showBridge"></bindCardDialog>-->
  </div>
</template>
<script>
        import bindCardDialog from '@/components/bindCardDialog.vue';
    import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
      }
    },
      // computed: {
      //     ...mapGetters({
      //         showBindCard:"getHaveInComeFlag",
      //     })
      // },
      components:{ bindCardDialog },
      methods:{
          showBridge(payload){
              console.log( 'payload',payload );
              this.$store.commit('changeHaveInComeFlag',payload.show);
              localStorage.setItem('haveInComeFlag',JSON.stringify(payload.show) );
          },
      },  
  }
</script>
<style lang="scss">
    *{
        margin: 0;
        padding: 0;
    }
    body,html{
        width:100%;
        height:100%;
        -webkit-text-size-adjust: 100% !important;
    }
    html{
        font-size: 20px
    }
    body{
        font-size: 0.75rem;
    }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height:100%;
  width:100%;
}
ul{
  list-style:none
}
</style>