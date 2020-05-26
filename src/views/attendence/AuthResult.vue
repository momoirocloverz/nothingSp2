<template>
  <div class='auth-result'>
    跳转中...
  </div>
</template>

<script>
// 打卡验证回调页面
export default {
  name: 'authresult',
  components: {},
  data() {
    return {
      userInfo: {}
    };
  },

  computed: {},

  mounted() {
    this.$indicator.open({
      spinnerType: 'fading-circle'
    });
    this.getParams()
    this.getBaseInfo()
  },
  destroyed() {
    this.$indicator.close()
  },
  methods: {
    getParams() {
      let userInfo = sessionStorage.getItem('userInfo')
      if (userInfo) {
        userInfo = JSON.parse(userInfo)
        this.userInfo.talentId = userInfo.talentId
      }
    },

    // 人脸验证成功之后获取到的用户信息
    getBaseInfo() {
      let biztoken = localStorage.getItem('biztoken')
      let param = {
        bizToken: biztoken,
        ruleId: '7'
      }

      this.$indicator.open({
        spinnerType: 'fading-circle'
      });

      this.$api.detectRedirect(param)
        .then(res => {
          if (res.data.respCode == 0) {
            let data = res.data.data

            let info = JSON.parse(data.detectInfo)

            if (info.Text.ErrCode != 0) {
              // this.$router.push({ name: 'userregister' })
              localStorage.getItem('lastUrl') && (window.location.href = localStorage.getItem('lastUrl'))
            } else {
              this.routeToCheck()
            }
          } else {
            localStorage.getItem('lastUrl') && (window.location.href = localStorage.getItem('lastUrl'))
          }
        })
        .catch(err => {
          console.log(err)
          localStorage.getItem('lastUrl') && (window.location.href = localStorage.getItem('lastUrl'))
        })
        .finally(() => {
          this.$indicator.close()
        })
    },

    routeToCheck() {
      this.$router.push({ name: 'workerCanvas' })
    }
  },
}
</script>
<style lang='scss'>
</style>