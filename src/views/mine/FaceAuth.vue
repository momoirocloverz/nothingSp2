<template>
  <div class="face-auth">
    <mt-header title="人脸验证重置密码" fixed class="mint-header-title">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="form-zone">
      <mt-field label="身份证号" type="text" placeholder="请输入身份证号" v-model="idcard"></mt-field>
    </div>

    <div class="btn-zone">
      <div class="btn" @click="handleFacePsw">去人脸验证</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'faceauth',
  components: {},
  data() {
    return {
      idcard: ''
    };
  },

  computed: {},

  mounted() {

  },
  methods: {
    handleBack() {
      this.$router.go(-1)
    },

    handleFacePsw() {
      let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      if (!this.idcard) {
        this.$toast('身份证号不能为空')
        return
      }
      if (!reg.test(this.idCard.replace(/\s+/g, "").replace(/x/g, "X"))) {
        this.$toast("请输入正确的身份证号");
        return;
      }
      let openid = localStorage.getItem('openid')
      let params = {
        openid: openid,
        IdCard: this.idcard,
        Extra: 'reset',
        RuleId: '7',
        userType: '5'
      }

      this.$api.detectAuth(params)
        .then(res => {
          if (res.data.respCode == 0) {
            let data = JSON.parse(res.data.data)
            let url = data.Url
            let bizToken = data.BizToken
            localStorage.setItem('biztoken', bizToken)
            localStorage.setItem('facemobile', data.mobile)
            window.location.href = url
          }
        })
        .catch(err => {
          console.log(err)
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
.face-auth {
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: convertToVw(44);
  background-color: #f5f5f5;

  .mint-header-title {
    height: convertToVw(44);
    line-height: convertToVw(44);
    font-size: convertToVw(17);
  }

  .form-zone {
    margin-top: convertToVw(20);
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    background-color: #fff;

    .mint-cell {
      padding-left: convertToVw(15);
    }
    // .mint-cell-wrapper {
    //   border-bottom: 1px solid #d9d9d9;
    // }

    .mint-cell-text {
      margin-left: 0;
      font-size: convertToVw(16);
      color: #1e1f21;
    }
    .mint-cell-value {
      padding-right: convertToVw(15);
    }
    input {
      font-size: convertToVw(16);
    }
    ::-webkit-input-placeholder {
      font-size: convertToVw(16);
      color: #b9babd;
    }
    ::-moz-placeholder {
      font-size: convertToVw(16);
      color: #b9babd;
    }
    :-ms-input-placeholder {
      font-size: convertToVw(16);
      color: #b9babd;
    }
  }

  .btn-zone {
    padding: convertToVw(20) convertToVw(18);
    margin-top: convertToVw(50);
    background-color: #fff;

    .btn {
      border-radius: 3px;
      font-size: convertToVw(17);
      line-height: convertToVw(48);
      padding: 0;
      text-align: center;
      color: #fff;
      background-color: #ea441a;
    }
  }
}
</style>