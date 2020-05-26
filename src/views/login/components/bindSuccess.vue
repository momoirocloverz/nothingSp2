<template>
  <div class="un-bind pt40">
    <mt-header title="扫码绑定" fixed class="mint-header-title bg-fff co-111">
    </mt-header>
    <img class="img" src="../../../assets/img/activeS.png" alt="">
    <div class="tc pb15 pt15">绑定成功</div>
    <div @click="to()" class="bind-btn">进入工作台</div>
  </div>
</template>

<script>
export default {
  name:"bindSuccess",
  data() {
    return {
    }
  },
  methods: {
    to:function () {
      this.$router.push({path:'./home/workspace'})
    }
  }
}
</script>

<style scoped lang="scss">
  $design_width: 375;
  @function convertToVw($size: 0) {
    @return (($size * 100 / $design_width) + vw);
  }
  .un-bind{
    font-size: convertToVw(17);
    padding: 0 convertToVw(18);
    .img{
      display: block;
      margin:convertToVw(40) auto convertToVw(22);
      width: convertToVw(98);
      height: convertToVw(98);
    }
    .bind-btn{
      display: flex;
      width: 100%;
      text-align: center;
      justify-content: center;
      align-items: center;
      height: convertToVw(48);
      background-color: #EA441A;
      color: #fff;
    }
  }
</style>