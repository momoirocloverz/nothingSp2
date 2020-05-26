<template>
  <div id="psw">
    <mt-header title="重置密码" fixed class="mint-header-title">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="formDiv container">
      <mt-field placeholder="请输入您注册的手机号码" label="手机号码：" type="tel" v-model="form.mobile" class="pswput" @blur.native.capture="checkTel"></mt-field>
      <mt-field placeholder="输入短信验证码" label="验证码：" type="tel" v-model="form.validator" class="pswput" @blur.native.capture="checkCode"></mt-field>
      <mt-field placeholder="请输入6-18位密码，必须为数字或字母" label="登录密码：" type="password" v-model="form.password" class="pswput" @blur.native.capture="checkPwd"></mt-field>
      <mt-button type="default" class="codeBtn" :disabled="getcoding" @click="getCode">{{buttonText}}</mt-button>
    </div>
    <div class="tip-zone">
      <p class="tip">手机号码无法使用，可通过身份证号和人脸验证重置密码.</p>
      <!--<p class="face-zone" @click="handleFacePsw">人脸验证重置密码>></p>-->
    </div>
    <div class="logDiv flexable">
      <mt-button type="primary" class="logBtn" @click="handleSubmit">确认重置</mt-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "ForgetPsw",
  data() {
    return {
      wating: 60,
      getcoding: false,
      buttonText: '获取验证码',
      form: {
        mobile: "",
        password: "",
        validator: "",
      },
    };
  },
  methods: {
    checkTel() {
      console.log(1)
      if (!this.form.mobile) {
        console.log(2)
        this.$toast('登录账号不能为空')
        return false;
      } else {
        console.log(3)

        let reg = new RegExp(/^[1-9][0-9]*$/)
        if (!reg.test(this.form.mobile)) {
          this.$toast('手机号必须全为数字')
          return false;
        } else {
          //          this.loginnameCheck()
        }
      }
    },
    checkCode() {
      console.log(1)
      if (!this.form.validator) {
        console.log(2)
        this.$toast("验证码不能为空");
        return false;
      } else {
        return true
      }
    },
    checkPwd() {
      if (!this.form.password) {
        this.$toast('登录密码不能为空')
        return false;
      } else {
        console.log(3)

        let reg = new RegExp(/^[a-zA-Z0-9]{6,18}$/)
        if (!reg.test(this.form.password)) {
          this.$toast('密码必须是6-18位字母或数字')
        }
      }
    },
    handleSubmit() {
      const params = {
        validator: this.form.validator,
        password: this.form.password,
        mobile: this.form.mobile,
        userType: 5,
      };
      this.$api
        .UpdateUserPassword(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.$toast('密码重置成功！')
            this.$router.push('/')
          }
          // console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCode() {
      let reg = new RegExp(/^[1-9][0-9]*$/)
      if (!this.form.mobile) {
        this.$toast('手机号不能为空')
        return false;
      }
      else if (!reg.test(this.form.mobile)) {
        this.$toast('手机号必须全为数字')
        return false;
      } else if (this.form.mobile.length != 11) {
        this.$toast('手机号必须为11位数字')
        return false;
        //            this.loginnameCheck()
      }
      const params = {
        mobile: this.form.mobile,
        userType: 5,
      };
      this.$api
        .checkMobileMsg(params)
        .then(response => {
          console.log(response.data.data)
          if (response.data.respCode == 0) {
            if (response.data.data == true) {
              this.getCode1()
            } else {
              this.$toast('您输入的手机号尚未注册')
            }
          }
        })
        .catch(error => {
          console.log(error);
        });

    },
    getCode1() {
      const params = {
        mobile: this.form.mobile,
      };
      this.$api
        .getSmsCode(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.getcoding = true;
            this.wating = 60
            this.$toast('验证码已发送');
            let that = this
            let timing = setInterval(function () {
              if (that.wating < 0) {
                that.getcoding = false;
                that.buttonText = '获取验证码';
                window.clearInterval(timing)
              } else {
                that.buttonText = that.wating + '秒后重试'
                that.wating--;
              }
            }, 1000)
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
      }
      this.$api
        .loginnameCheck(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode != 0) {
            this.getCoding = true
            return false
          }

        })
        .catch(error => {
          console.log(error);
        });
    },
    handleFacePsw() {
      this.$router.push({ name: 'faceauth' })
    }
  }
};
</script>
<style scoped>
.formDiv {
  position: relative;
}
.pswIcon {
  width: 0.93rem;
  height: 1rem;
  position: absolute;
  top: 141px;
  left: 0;
}
.accontIcon {
  width: 0.93rem;
  height: 0.93rem;
  position: absolute;
  top: 20px;
  left: 0;
}
.codeIcon {
  width: 1.13rem;
  height: 1.1rem;
  position: absolute;
  top: 80px;
  left: 0;
}
.codeBtn {
  height: 1.43rem;
  border-radius: 0.71rem;
  border: solid 0.03rem #d6522d;
  padding: 0.3rem 0.68rem;
  font-size: 0.6rem;
  color: #d6522d;
  background: #fff;
  position: absolute;
  top: 75px;
  right: 0;
}
#psw {
  width: 90%;
  margin: 0 auto;
}
.logDiv {
  justify-content: center;
  width: 100%;
}
.logBtn {
  width: 12.48rem;
  height: 2.03rem;
  border-radius: 1.01rem;
  font-size: 0.75rem;
  margin-top: 6.7rem;
}

.tip-zone {
  padding: 0 0.5rem;
  margin-top: 4.5rem;
  font-size: 0.6rem;
  color: #969799;
  line-height: 2;
}

.face-zone {
  margin-top: 0.5rem;
  font-size: 0.6rem;
  line-height: 2;
  color: #ea441a;
}
</style>
