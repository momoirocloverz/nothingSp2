<template>
  <div class="binding-manager">
  </div>
</template>

<script>
export default {
  name: "bindingManager",
  data() {
    return {
      userInfo:{},
    }
  },
  created(){
    if(sessionStorage.getItem("userInfo")){
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    }
    let type = this.$route.query.type;
    if(type){ //存在则是需要去认证
      this.goAuthentication()
    }else{ //不存在回退到之前页面
      this.$route.go(-1);
    }

  },
  mounted(){

  },
  methods: {
    goAuthentication(){
      let mobile = localStorage.getItem('regMobile') || this.userInfo.mobile
      this.$api.detectAuthFirst({
        openid:mobile,
        userType: '5',
        Extra: 'register',
      }).then(res=>{
        if(res.data.respCode == 0){
          let data = JSON.parse(res.data.data)
          let url = data.Url
          let bizToken = data.BizToken
          localStorage.setItem('biztoken', bizToken)
          window.location.href = url
          return;
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>