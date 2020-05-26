<template>
  <div class="page-receipt">
    <mt-header title="工作量回单" class="page-header"></mt-header>

    <img :src="imgSrc" alt="工作量回单">
  </div>
</template>

<script>
/**工作量回单页 */
export default {
  name: 'page-receipt',
  components: {},
  data() {
    return {
      schedulingId: 0,
      imgSrc: '',
    };
  },

  computed: {},

  mounted() {
    this.getParam()
    this.getSchedulingConfirm()
  },
  methods: {
    getParam() {
      this.schedulingId = this.$route.query.id
      if (!this.schedulingId) {
        this.$messagebox.alert('没有获取到有效的参数', '错误提示')
        return
      }
    },
    // 获取回单
    getSchedulingConfirm() {
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });

      let param = {
        schedulingId: this.schedulingId
      }
      this.$api.getSchedulingConfirm(param)
        .then(res => {
          if (res.data.respCode == 0) {
            this.imgSrc = res.data.data.confirmPngForm
            // status: 1:已撤销 2:待签名 3:已确认
            if (res.data.data.status == 1) {
              this.$router.push({ name: 'havecancel' })
            } else if (res.data.data.status == 2) {
              this.$router.push({ name: 'toverify', query: { id: res.data.data.schedulingId } })
            }
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
.page-receipt {
  .page-header {
    font-size: convertToVw(17);
    height: convertToVw(44);
  }
  img {
    width: 100%;
    height: auto;
  }
}
</style>