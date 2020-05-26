<template>
  <div class='auth-worker'>

  </div>
</template>

<script>
// 打卡验证回调页面
export default {
  name: 'authworker',
  components: {},
  data() {
    return {
      lastUrl: ''
    };
  },

  computed: {},

  mounted() {
    this.$indicator.open({
      spinnerType: 'fading-circle'
    });
    this.getParams()
    this.routeToCheck()
  },
  destroyed() {
    this.$indicator.close()
  },
  methods: {
    getParams() {
      this.lastUrl = localStorage.getItem('lastUrl')
    },

    routeToCheck() {
      localStorage.setItem('workerAuth', true)
      this.lastUrl && (window.location.href = this.lastUrl)
    }
  },
}
</script>
<style lang='scss'>
</style>