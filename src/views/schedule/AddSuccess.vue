<template>
  <div class="add-success">
    <mt-header title="加入排班-日结" class="page-title"></mt-header>

    <div class="page-content">
      <div class="success-icon"></div>

      <p class="success-tip">已加入，等待审核</p>
      <p class="success-desc">请等待班组长或项目经理审核</p>
    </div>
    <div class="route-btn" @click="handleRoute">返回排班日历</div>
  </div>
</template>

<script>
export default {
  name: 'AddSuccess',
  components: {},
  data() {
    return {

    };
  },

  computed: {},

  mounted() {

  },
  methods: {
    handleRoute() {
      this.$router.push({ name: 'calendar' })
    }
  },
}
</script>
<style lang='scss' scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.add-success {
  min-height: 1000vh;
  background-color: #f5f5f5;
  .page-title {
    height: convertToVw(44);
    font-size: convertToVw(17);
    line-height: convertToVw(44);
    border-bottom: 1px solid #d9d9d9;
  }
  .page-content {
    padding-top: convertToVw(40);
    padding-bottom: convertToVw(32);
    background-color: #fff;
  }
  .success-icon {
    width: convertToVw(98);
    height: convertToVw(98);
    margin: auto;
    background-image: url(../../assets/img/success.png);
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .success-tip {
    margin-top: convertToVw(22);
    text-align: center;
    font-size: convertToVw(17);
    color: #1e1f21;
  }
  .success-desc {
    margin-top: convertToVw(16);
    font-size: convertToVw(13);
    color: #969799;
    text-align: center;
  }
  .route-btn {
    width: convertToVw(338);
    height: convertToVw(48);
    margin: convertToVw(20) auto;
    line-height: convertToVw(48);
    font-size: convertToVw(17);
    color: #fff;
    background-color: #ea441a;
    text-align: center;
    border: 1px solid #d53d17;
  }
}
</style>