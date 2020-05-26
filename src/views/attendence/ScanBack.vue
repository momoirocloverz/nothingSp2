<template>
  <div class="scan-back">
    <div class="info-zone">
      <div v-if="type==1" class="icon icon-success"></div>
      <div v-if="type==2" class="icon icon-failed"></div>
      <div v-if="type==1">
        <div class="tip-title">人脸验证成功</div>
        <div class="tip-desc">人脸验证成功，请重新扫码打卡</div>
      </div>
      <div v-if="type==2">
        <div class="tip-title">人脸验证失败</div>
        <div class="tip-desc">人脸验证失败，请重新扫码打卡</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScanBack',
  components: {},
  data() {
    return {
      type: '1'  // 1成功  2失败
    };
  },

  computed: {},

  mounted() {
    this.clearStorage()
    this.getParma()
  },
  methods: {
    clearStorage() {
      localStorage.removeItem('fromScan')
    },
    getParma() {
      this.type = this.$route.query.type || '1'
    }
  },
}
</script>
<style lang='scss' scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.scan-back {
  min-height: 100vh;
  background-color: #f5f5f5;
  .info-zone {
    padding-top: convertToVw(40);
    padding-bottom: convertToVw(32);
    text-align: center;
    background-color: #fff;

    .icon {
      width: convertToVw(98);
      height: convertToVw(98);
      margin: auto;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }
    .tip-title {
      margin-top: convertToVw(22);
      font-size: convertToVw(17);
      color: #1e1f21;
    }
    .tip-desc {
      margin-top: convertToVw(16);
      font-size: convertToVw(13);
      color: #969799;
    }
    .icon-success {
      background-image: url(../../assets/img/success.png);
    }
    .icon-failed {
      background-image: url(../../assets/img/status_error.png);
    }
  }
}
</style>