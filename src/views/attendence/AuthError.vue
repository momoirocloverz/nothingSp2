<template>
  <div class="auth-error">
    <mt-header title="打卡" class="mint-header-title">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="result-tip result-failed">
      <div class="icon"></div>
      <p class="icon-tip">打卡失败</p>
      <p class="sub-tip">您未进行人脸识别验证，请前往验证</p>
    </div>

    <div class="btn-zone">
      <div class="btn" @click="handleAuth">前往人脸识别验证</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'autherror',
  components: {},
  data() {
    return {
      talentId: '',
    };
  },

  computed: {},

  mounted() {
    this.getParam()
  },
  methods: {
    handleBack() {
      this.$router.push({ name: 'calendar' })
    },
    getParam() {
      let userInfo = sessionStorage.getItem('userInfo')
      if (userInfo) {
        userInfo = JSON.parse(userInfo)
        this.talentId = userInfo.talentId
      }
    },

    handleAuth() {
      let param = {
        talentId: this.talentId,
        Extra: `supplement,${this.talentId}`,
        RuleId: '9'
      }

      this.$api.detectAuth(param)
        .then(res => {
          if (res.data.respCode == 0) {
            let data = JSON.parse(res.data.data)
            let url = data.Url
            let bizToken = data.BizToken
            localStorage.setItem('biztoken', bizToken)

            window.location.href = url
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {

        })
    }
  },
}
</script>
<style lang='scss'>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.auth-error {
  box-sizing: border-box;
  min-height: 100vh;
  background-color: #f5f5f5;

  .mint-header-title {
    height: convertToVw(44);
    line-height: convertToVw(44);
    font-size: convertToVw(17);
  }

  .result-tip {
    padding-top: convertToVw(40);
    padding-bottom: convertToVw(30);
    background-color: #fff;
    text-align: center;

    .icon {
      width: convertToVw(98);
      height: convertToVw(98);
      margin: auto;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }

    .icon-tip {
      font-size: convertToVw(17);
      padding-top: convertToVw(22);
      color: #1e1f21;
    }

    .sub-tip {
      font-size: convertToVw(13);
      padding-top: convertToVw(16);
      color: #969799;
    }
  }

  .result-failed .icon {
    background-image: url(../../assets/img/status_error.png);
  }

  .btn-zone {
    padding: convertToVw(20) convertToVw(18);

    .btn {
      border-radius: 3px;
      padding: 0;
      font-size: convertToVw(17);
      line-height: convertToVw(48);
      text-align: center;
      color: #fff;
      background-color: #ea441a;
      cursor: pointer;
    }
  }
}
</style>