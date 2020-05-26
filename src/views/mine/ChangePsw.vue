<template>
  <div id="psw">
    <mt-header title="更换密码" fixed class="mint-header-title">
      <!-- <router-link to="/setting" slot="left"> -->
      <span @click="goBack" slot="left">
        <mt-button icon="back"></mt-button>
      </span>
      <!-- </router-link> -->
    </mt-header>

    <div class="formDiv">
      <mt-field placeholder="请输入您的手机号码" type="tel" v-model="form.mobile" class="logInput" @blur.native.capture="checkTel"></mt-field>
      <mt-field placeholder="输入短信验证码" type="tel" v-model="form.validator" class="logInput" @blur.native.capture="checkCode"></mt-field>
      <mt-field placeholder="请输入6-18位密码，必须为数字或字母" type="password" v-model="form.newPassword" class="logInput" @blur.native.capture="checkPwd"></mt-field>
      <img src="../../assets/img/lock@3x.png" alt="密码" class="pswIcon">
      <img src="../../assets/img/account@3x.png" alt="账号" class="accontIcon">
      <img src="../../assets/img/code@3x.png" alt="账号" class="codeIcon">
      <img src="../../assets/img/eye@3x.png" alt="账号" class="eyeIcon">
      <mt-button type="default" class="codeBtn" :disabled="getcoding" @click="getCode">{{buttonText}}</mt-button>
    </div>

    <div class="logDiv flexable">
      <mt-button type="primary" class="logBtn" @click="handleSubmit">确认重置</mt-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "ChangePsw",
  data() {
    return {
      wating: 60,
      getcoding: false,
      buttonText: "获取验证码",
      form: {
        mobile: '',
        phone: "",
        password: ""
      }
    };
  },
  mounted() {
    console.log(JSON.parse(sessionStorage.getItem('userInfo')).username)
    this.form.mobile = JSON.parse(sessionStorage.getItem('userInfo')).mobile
  },
  methods: {
    goBack(){
      this.$router.go(-1);
    },
    checkTel() {
      console.log(1);
      if (!this.form.mobile) {
        console.log(2);
        this.$toast("登录账号不能为空");
        return false;
      } else {
        console.log(3);

        let reg = new RegExp(/^[1-9][0-9]*$/);
        if (!reg.test(this.form.mobile)) {
          this.$toast("手机号必须全为数字");
          return false;
        } else {
          if (this.form.mobile.length == 11) {
            return true;
          } else {
            this.$toast("请输入正确的手机号");
          }
        }
      }
    },
    checkCode() {
      console.log(1);
      if (!this.form.validator) {
        console.log(2);
        this.$toast("验证码不能为空");
        return false;
      } else {
        return true;
      }
    },
    checkPwd() {
      if (!this.form.newPassword) {
        this.$toast("登录密码不能为空");
        return false;
      } else {

        let reg = new RegExp(/^[a-zA-Z0-9]{6,18}$/);
        if (!reg.test(this.form.newPassword)) {
          this.$toast("密码必须是6-18位字母或数字");
        }
      }
    },
    handleSubmit() {
      const params = {
        validator: this.form.validator,
        password: this.form.newPassword,
        mobile: this.form.mobile,
        userType: 5
      };
      this.$api
        .UpdateUserPassword(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.$toast("密码重置成功！");
            /*this.$router.go(-1);*/
            this.$router.push({ name: 'login' })
          }

        })
        .catch(error => {
          console.log(error);
        });
    },
    getCode() {
      const params = {
        mobile: this.form.mobile
      };
      this.$api
        .getSmsCode(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.getcoding = true;
            this.wating = 60;
            this.$toast("验证码已发送");
            let that = this;
            let timing = setInterval(function () {
              if (that.wating < 0) {
                that.getcoding = false;
                that.buttonText = "获取验证码";
                window.clearInterval(timing);
              } else {
                that.buttonText = that.wating + "秒后重试";
                that.wating--;
              }
            }, 1000);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    loginnameCheck() {
      const params = {
        loginName: this.form.mobile,
        userType: 5
      };
      this.$api
        .loginnameCheck(params)
        .then(response => {
          console.log(response);
          if (response.data.respCode != 0) {
            this.getCoding = true;
            return false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  }
};
</script>
<style scoped>
.formDiv {
  padding-top: 2rem;
  position: relative;
  width: 90%;
  margin: 0 auto;
}
.pswIcon {
  width: 0.93rem;
  height: 1rem;
  position: absolute;
  top: 181px;
  left: 0;
}
.eyeIcon {
  width: 0.75rem;
  height: 0.3rem;
  position: absolute;
  top: 141px;
  right: 0;
}
.accontIcon {
  width: 0.93rem;
  height: 0.93rem;
  position: absolute;
  top: 60px;
  left: 0;
}
.logBtn {
  width: 12.48rem;
  height: 2.03rem;
  border-radius: 1.01rem;
  font-size: 0.75rem;
  margin: 6.35rem 0 1.2rem;
}
.logDiv {
  justify-content: center;
  width: 100%;
}
.codeIcon {
  width: 1.13rem;
  height: 1.1rem;
  position: absolute;
  top: 120px;
  left: 0;
}
.codeBtn {
  height: 1.43rem;
  border-radius: 0.71rem;
  border: solid 0.03rem #d6522d;
  padding: 0.4rem 0.68rem;
  font-size: 0.6rem;
  color: #d6522d;
  background: #fff;
  position: absolute;
  top: 114px;
  right: 0;
}
</style>
