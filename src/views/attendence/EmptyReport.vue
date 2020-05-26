<template>
  <div>
    <mt-header title="空白签到表" fixed style="font-size: 0.9rem">
      <div slot="left">
        <mt-button icon="back" @click="$router.back(-1)"></mt-button>
      </div>
    </mt-header>
    <div class="container" style="background-color: #ffffff;height: 100%;padding-bottom: 2.2rem;">
      <p style="text-align: center;padding-top: 0.5rem;color: #e84518">长按下方图片发送给好友</p>
      <img :src="imgSrc" alt="" style="width: 100%;">
    </div>
  </div>
</template>

<script>
export default {
  name: 'emptyReport',  // 空白签到表
  data() {
    return {
      imgSrc: ''
    }
  },
  created() {
    this.getConfirm()
  },
  methods: {
    getConfirm() {
      let params = {
        schedulingId: this.$route.query.id
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$api
        .getEmptySchedulingConfirm(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
            this.imgSrc = response.data.data.emptyPNG
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$indicator.close()
        })
    },
  }
}

</script>
<style lang="scss" scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
</style>
