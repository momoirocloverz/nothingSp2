<template>
  <div class="confirm-sign">
    <mt-header title="重新签名" class="page-header">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="sign-img" :style="`background-image:url(${imgSrc})`"></div>

    <div class="btn-box">
      <div class="btn btn-resign" @click="handleBack">重新签名</div>
      <div class="btn btn-confirm" @click="handleConfirm">完成签名</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmSign',
  components: {},
  data() {
    return {
      imgSrc: '',
      punchId: 0
    };
  },

  computed: {},

  mounted() {
    this.getParam()
  },
  methods: {
    getParam() {
      this.imgSrc = `${this.$route.query.imgsrc}?imageMogr/rotate/270`
      this.punchId = this.$route.query.id
    },
    handleBack() {
      this.$router.go(-1)
    },
    handleConfirm() {
      let param = {
        signUrl: this.$route.query.imgsrc,
        punchId: this.punchId
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api.updateSign(param)
        .then(res => {
          if (res.data.respCode == 0) {
            this.$toast('重新签名成功！')
            this.$router.push({ name: 'calendar' })
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.$indicator.close()
        })
    }
  },
}
</script>
<style lang='scss' scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.confirm-sign {
  height: 100vh;
  background-color: #f5f5f5;

  .page-header {
    font-size: convertToVw(17);
    height: convertToVw(44);
    border-bottom: 1px solid #d9d9d9;
  }

  .sign-img {
    width: convertToVw(268);
    height: convertToVw(146);
    margin: convertToVw(20) auto 0 auto;
    background-color: #fff;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .btn-box {
    margin: convertToVw(20) auto 0 auto;
    width: convertToVw(250);
    display: flex;
    justify-content: space-between;
    .btn {
      box-sizing: border-box;
      width: convertToVw(100);
      height: convertToVw(34);
      font-size: convertToVw(14);
      line-height: convertToVw(34);
      text-align: center;
      padding: 0;
    }
    .btn-resign {
      background-color: #fff;
      color: #e84518;
    }
    .btn-confirm {
      background-color: #e84518;
      color: #fff;
    }
  }
}
</style>