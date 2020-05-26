<template>
  <div id="login">
    <div class="logText" @click="$router.push('/home')">登录</div>
    <div class="redLine"></div>
    <div class="formDiv">
      <mt-field placeholder="输入登录手机号或身份证号" v-model="form.phone" @blur.native.capture="checkTel" :attr="{ maxlength: 128 }" class="logInput"></mt-field>
      <mt-field placeholder="输入登录密码" type="password" v-model="form.password" @blur.native.capture="checkPwd" :attr="{ maxlength: 128 }" class="logInput"></mt-field>
      <img src="../../assets/img/lock@3x.png" alt="密码" class="pswIcon">
      <img src="../../assets/img/account@3x.png" alt="账号" class="accontIcon">
    </div>
    <div class="flexable forgetDiv">
      <span @click="$router.push('/forgetPsw')">忘记密码</span>
    </div>
    <div class="logDiv flexable">
      <mt-button type="primary" class="logBtn" @click="login">立即登录</mt-button>
    </div>

    <div class="flexable logDiv regDiv">
      <div class="noAccount">没有账号</div>
      <div class="register" @click="routeToReg">立即注册</div>
    </div>
    <!-- <span @click="$router.push('/userInfo')">完善信息</span>
        <span @click="$router.push('/home')">home</span> -->
    <!-- <span @click="$router.push({name:'customerReport'})">分享</span> -->
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        phone: "",
        password: "",
        fullPath:""
      },
        bankCardBindingStatus:false,
  };
  },
  methods: {
    checkTel() {
      if (!this.form.phone) {
        this.$toast("登录账号不能为空");
      }
    },
    checkPwd() {
      if (!this.form.password) {
        this.$toast("登录密码不能为空");
      }
    },
    routeToReg() {
      // this.$router.push("/register");
      this.$router.push("/userregister");
    },
    routeTo() {
      // this.$router.push("/register");
      this.$router.push("/registerFast");
    },

    login() {
      if (!this.form.phone) {
        this.$toast("登录账号不能为空");
        return false;
      }
      if (!this.form.password) {
        this.$toast("登录密码不能为空");
        return false;
      }
      const params = {
        username: `${this.form.phone},5`,
        password: this.form.password
      };
      this.$api.login(params).then(response => {
          if(response.data.respCode === 0){
            console.log('77',response)
            sessionStorage.setItem("logintype", response.data.data.loginType);
            sessionStorage.setItem("token", response.headers.authorization);
            sessionStorage.setItem("shareType", '2');//不分享默认2
            sessionStorage.setItem("isAuthenticated", response.data.data.isAuthenticated);
            sessionStorage.setItem("userInfo", JSON.stringify(response.data.data));
            localStorage.setItem("userInfo", JSON.stringify(response.data.data))
            // if (response.data.data.isAuthenticated == 2) {  暂时隐藏
            //   console.log(response.data.data.baseInfoStatus)
            //   if (response.data.data.baseInfoStatus == 2) {  // baseInfoStatus 基本信息是否已填写 1：已填 2: 未填
            //     this.$router.push({ path: '/identification', query: { step: 4 } })
            //   } else {
            //     this.$router.push({ name: "WorkSpace" });
            //   }
            // } else {
            //   this.$router.push({ path: '/identifyid' })
            // }
            // if(this.$route.query.backUrl){ //后续业务可能需要
            //   let url = this.$route.query.backUrl.substring(1)
            //   this.$router.replace({ path: url});
            // }else{
            // }
            // this.$router.replace({ path: "/task" ,query:{isFirst:true}});

            this.$router.replace({ path: "/home" ,query:{isFirst:true}});
          }else{
            this.$toast(response.data.errorMsg);
          }
        })
        .catch(error => {

        });
    },
  },
  created(){
    this.$indicator.close();
  },
  mounted() {
  }
};
</script>
<style scoped>
#login {
  width: 90%;
  margin: 0 auto;
}
.logText {
  font-size: 0.9rem;
  color: #d6522d;
  text-align: center;
  padding-top: 2.45rem;
}
.redLine {
  width: 5.63rem;
  height: 0.05rem;
  background-color: #d6522d;
  margin: 0.78rem auto 3.83rem;
}
.forgetDiv {
  justify-content: flex-end;
  width: 100%;
  margin: 0.7rem 0 3.7rem;
  color: #808080;
}
.mint-button--primary {
  width: 12.48rem;
  height: 2.03rem;
  border-radius: 1.01rem;
  font-size: 0.75rem;
}
.logDiv {
  justify-content: center;
  width: 100%;
}
.noAccount {
  margin-right: 0.6rem;
  color: #808080;
}
.register {
  color: #d6522d;
}
.regDiv {
  margin-top: 0.9rem;
}
.pswIcon {
  width: 0.93rem;
  height: 0.93rem;
  position: absolute;
  top: 80px;
  left: 0;
}
.formDiv {
  position: relative;
}
.accontIcon {
  width: 0.93rem;
  height: 0.93rem;
  position: absolute;
  top: 20px;
  left: 0;
}
</style>
