<template>
  <div class="total-confirm">
    <mt-header title="统计工作量-总量" style="font-size: 0.9rem">
      <mt-button icon="back" slot="left" @click="$router.back(-1)"></mt-button>
    </mt-header>

    <div class="form-panel">
      <mt-field label="计件" type="number" placeholder="请输入" v-model="jian"></mt-field>
      <mt-field label="计袋" type="number" placeholder="请输入" v-model="dai"></mt-field>
      <mt-field label="计车" type="number" placeholder="请输入" v-model="che"></mt-field>
      <mt-field label="计吨" type="number" placeholder="请输入" class="last-field" v-model="dun"></mt-field>
    </div>

    <p class="tip">根据实际情况如实填写，无计件量时可不填</p>

    <div class="page-bottom">
      <div class="bottom-btn" @click="handleNext">提交</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TotalConfirm',
  components: {},
  data() {
    return {
      id: 0,
      jian: '',
      dai: '',
      che: '',
      dun: ''
    };
  },

  computed: {},

  mounted() {
    this.getParam()
  },
  methods: {
    getParam() {
      this.id = this.$route.query.id
    },

    getData() {
      const params = {
        id: this.id,
      };
      this.$api
        .cusConfirmList(params)
        .then(res => { })
        .catch(err => {

        })
    },

    handleNext() {
      let param = {

      }
    },

  },
}
</script>
