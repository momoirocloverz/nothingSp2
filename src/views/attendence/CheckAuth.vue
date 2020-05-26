<template>
  <div class="check-auth">
    跳转中...
  </div>
</template>

<script>
export default {
  name: 'checkauth',
  components: {},
  data() {
    return {
      lastUrl: '',
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
      this.lastUrl = localStorage.getItem('lastUrl')
    },

    routeToCheck() {
      if (localStorage.getItem('fromScan')) {
        this.$router.push({ name: 'scanback', query: { type: 1 } })
      } else {
        localStorage.removeItem('fromScan')
        localStorage.getItem('lastUrl') && (window.location.href = localStorage.getItem('lastUrl'))
      }
    },
    // 人脸验证成功之后获取到的用户信息
    getBaseInfo() {
      let biztoken = localStorage.getItem('biztoken')
      let param = {
        bizToken: biztoken,
        ruleId: '9'
      }

      this.$indicator.open({
        spinnerType: 'fading-circle'
      });

      this.$api.detectRedirect(param)
        .then(res => {
          if (res.data.respCode == 0) {
            this.routeToCheck()
            return


            let data = res.data.data
            let info = JSON.parse(data.detectInfo)

            if (info.Text.ErrCode != 0) {
              if (localStorage.getItem('fromScan')) {
                this.$router.push({ name: 'scanback', query: { type: 2 } })
              } else {
                localStorage.removeItem('fromScan')
                window.location.href = localStorage.getItem('lastUrl')
              }
            } else {
              // this.userInfo.idCardPositive = info.IdCardData.OcrFront
              // this.userInfo.idCardNegative = info.IdCardData.OcrBack
              this.userInfo.BestFrame = info.BestFrame.BestFrame

              this.faceInfoSupplement()
            }
          }
        })
        .catch(err => {
          console.log(err)
          if (localStorage.getItem('fromScan')) {
            this.$router.push({ name: 'scanback', query: { type: 2 } })
          } else {
            localStorage.removeItem('fromScan')
            window.location.href = localStorage.getItem('lastUrl')
          }
        })
        .finally(() => {
          this.$indicator.close()
        })
    },

    faceInfoSupplement() {
      let userInfo = sessionStorage.getItem('userInfo')

      if (userInfo) {
        userInfo = JSON.parse(userInfo)
      }

      let param = {
        id: userInfo.talentId,
        // idCardPositive: this.userInfo.idCardPositive,
        // idCardNegative: this.userInfo.idCardNegative,
        bestFrame: this.userInfo.BestFrame
      }

      this.$api.faceInfoSupplement(param)
        .then(res => {
          if (res.data.respCode == 0) {
            this.routeToCheck()
          } else {
            if (localStorage.getItem('fromScan')) {
              this.$router.push({ name: 'scanback', query: { type: 2 } })
            } else {
              localStorage.removeItem('fromScan')
              window.location.href = localStorage.getItem('lastUrl')
            }
          }
        })
        .catch(err => {
          console.log(err)
          if (localStorage.getItem('fromScan')) {
            this.$router.push({ name: 'scanback', query: { type: 2 } })
          } else {
            localStorage.removeItem('fromScan')
            window.location.href = localStorage.getItem('lastUrl')
          }
        })
        .finally(() => { })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>