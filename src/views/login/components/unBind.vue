<template>
  <div class="un-bind pt40">
    <mt-header title="扫码绑定" fixed class="mint-header-title bg-fff co-111">
    </mt-header>
    <img class="img" src="../../../assets/img/activeF.png" alt="">
    <div class="tc">未绑定零工账号</div>
    <p class="co-999 f13 p20">您的微信尚未绑定零工账号，请前往万才网公众号， 点击底部的【零工入口】，进行注册-登录-绑定微信</p>
    <!--<div @click="to()" class="bind-btn">前往万才网公众号</div>-->
    <img class="wei-img" src="../../../assets/img/w-IMG.png" alt="">
    <p class="tc co-999 f13">万才网公众号</p>
    <p class="tc co-999 f13 pt5">长按识别二维码</p>
  </div>
</template>

<script>
export default {
  name:'unBind',
  data() {
    return {
    }
  },
  methods: {
    to:function () {

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
    .wei-img{
      display: block;
      margin:convertToVw(30) auto convertToVw(20);
      width:convertToVw(187);
      height:convertToVw(187);
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