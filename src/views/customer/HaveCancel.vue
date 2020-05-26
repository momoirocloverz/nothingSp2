<template>
  <div class="have-cancel">
    <mt-header title="工作量确认" class="page-header"></mt-header>

    <p class="cancel-tip">该确认单已被撤回，请联系班组长或项目经理</p>
  </div>
</template>

<script>
export default {
  name: 'HaveCancel',
  components: {},
  data() {
    return {

    };
  },

  computed: {},

  mounted() {

  },
  methods: {
  },
}
</script>
<style lang='scss' scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.have-cancel {
  min-height: 100vh;
  background-color: #f5f5f5;
}
.page-header {
  height: convertToVw(44);
  font-size: convertToVw(17);
}
.cancel-tip {
  font-size: convertToVw(13);
  text-align: center;
  color: #969799;
  padding-top: convertToVw(22);
}
</style>