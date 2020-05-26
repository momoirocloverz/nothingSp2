<template>
  <div id="psw">
    <mt-header title="我的账户" fixed class="mint-header-title">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="flexable parDiv">
      <div>
        <img src="../../assets/img/sad@3x.png" alt="未开通" class="not">
      </div>
      <div class="text">您尚未开通个人账户</div>
      <div class="logDiv flexable">
        <mt-button type="primary" class="logBtn">开通我的个人账户</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NotOpen",
  data() {
    return {};
  }
};
</script>
<style scoped>
.logDiv {
  justify-content: center;
  width: 100%;
}
#psw {
  width: 90%;
  margin: 0 auto;
}
.logBtn {
  width: 7.35rem;
  height: 1.75rem;
  background-color: #e84518;
  border-radius: 0.88rem;
  font-size: 0.75rem;
  margin-top: 4.35rem;
}
.not {
  width: 4.55rem;
  height: 4.53rem;
  display: block;
  margin: 1.25rem 0 1.85rem;
}
.text {
  font-size: 1.05rem;
  color: #636363;
}
.parDiv {
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  padding-top: 2.2rem;
}
</style>
