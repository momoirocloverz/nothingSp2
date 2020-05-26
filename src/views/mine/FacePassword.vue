<template>
  <div class="face-password">
    <mt-header title="人脸验证重置密码" fixed class="mint-header-title">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="form-zone">
      <mt-field label="手机号" :value="mobile" readonly></mt-field>
    </div>

    <div class="form-zone">
      <mt-field label="登录密码" type="password" placeholder="请输入6到18位字母或数字" v-model="psw"></mt-field>
      <mt-field label="重复登录密码" type="password" placeholder="请输入6到18位字母或数字" v-model="pswRepeat"></mt-field>
    </div>

    <div class="btn-zone">
      <div class="btn" @click="handleChange">确认重置</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'facepassword',
  components: {},
  data() {
    return {
      mobile: '',
      psw: '',
      pswRepeat: ''
    };
  },

  computed: {},

  mounted() {
    this.getParams()
  },
  methods: {
    getParams() {
      this.mobile = localStorage.getItem('facemobile')
    },

    handleBack() {
      this.$router.push({ name: 'changePsw' })
    },


    handleChange() {
      if (!this.psw || !this.pswRepeat) {
        this.$toast("密码不能为空")
        return
      }

      if (this.psw != this.pswRepeat) {
        this.$toast("两次密码不一致")
        return
      }


      let reg = new RegExp(/^[a-zA-Z0-9]{6,18}$/);
      if (!reg.test(this.psw) || !reg.test(this.pswRepeat)) {
        //this.$toast("密码必须是6-18位字母或数字")

        this.$messagebox.alert('密码必须是6-18位字母或数字', '')
        return
      }

      const params = {
        password: this.psw,
        mobile: this.mobile,
        userType: 5
      };
      this.$api
        .UpdateUserPassword(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.$toast("密码重置成功！");
            this.$router.push({ name: 'login' });
          }
        })
        .catch(error => {
          console.log(error);
        });

    }
  },
}
</script>
<style lang='scss'>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.face-password {
  box-sizing: border-box;
  min-height: 100vh;
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
    .mint-cell-wrapper {
      border-bottom: 1px solid #d9d9d9;
    }

    & .mint-cell:nth-last-of-type(1) .mint-cell-wrapper {
      border-bottom: none;
    }
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
      padding: 0;
      font-size: convertToVw(17);
      line-height: convertToVw(48);
      text-align: center;
      color: #fff;
      background-color: #ea441a;
    }
  }
}
</style>