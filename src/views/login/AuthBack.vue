<template>
  <div class="auth-back">
    <mt-header title="实名认证" class="mint-header-title">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="result-tip result-success" v-if="success == 1">
      <div class="icon"></div>
      <p class="icon-tip">实名认证成功</p>
      <p class="sub-tip">点击下一步，继续</p>

      <div class="btn-zone">
        <div class="btn" @click="handleNext">下一步</div>
      </div>
    </div>

    <div class="result-tip result-failed" v-if="success == 0">
      <div class="icon"></div>
      <p class="icon-tip">实名认证失败</p>
      <p class="sub-tip">{{errMsg}}，请返回</p>

      <div class="btn-zone">
        <div class="btn" @click="handleBack">返回</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'authback',
  components: {},
  data() {
    return {
      success: -1,
      errMsg: '',
      userInfo: {},
      userId:'',
    };
  },

  computed: {},

  mounted() {
    this.getBaseInfo()
  },

  methods: {
    handleBack() {
      this.$router.push({ name: 'userregister' })
    },

    // 人脸验证成功之后获取到的用户信息
    getBaseInfo() {
      let biztoken = localStorage.getItem('biztoken')
      let param = {
        bizToken: biztoken,
        ruleId: '10'
      }

      this.$indicator.open({
        spinnerType: 'fading-circle'
      });

      this.$api.detectRedirect(param)
        .then(res => {
          if (res.data.respCode == 0) {
            let data = res.data.data

            let info = JSON.parse(data.detectInfo)

            if (info.Text.ErrCode != 0) {
              this.$router.push({ name: 'userregister' })
            } else {
              this.userInfo.name = info.Text.Name
              this.userInfo.sex = info.Text.OcrGender == '男' ? '1' : '2'
              this.userInfo.idCard = info.Text.IdCard
              this.userInfo.birthday = info.Text.OcrBirth
              this.userInfo.nation = info.Text.OcrNation
              this.userInfo.address = info.Text.OcrAddress
              this.userInfo.bizToken = biztoken

              // this.userInfo.idCardPositive = info.IdCardData.OcrFront
              // this.userInfo.idCardNegative = info.IdCardData.OcrBack
              // this.userInfo.BestFrame = info.BestFrame.BestFrame

              this.signAccount()
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.$indicator.close()
        })
    },

    signAccount() {
      let birthday = this.userInfo.birthday
      let year = birthday.split('/')[0]
      let month = birthday.split('/')[1].padStart(2, '0')
      let day = birthday.split('/')[2].padStart(2, '0')
      let mobile = localStorage.getItem('regMobile') || JSON.parse(localStorage.getItem('userInfo')).mobile;
      let userId = JSON.parse(localStorage.getItem('userInfo')).userId;
      let password = localStorage.getItem('regPsw')
      let talentId = localStorage.getItem('regTalentId') || JSON.parse(localStorage.getItem('userInfo')).talentId;

      let param = {
        idCard: this.userInfo.idCard,
        mobile: mobile,
        id: userId,
        // password: password, 3.0.3.2不需要
        realName: this.userInfo.name,
        userType: 5,
        bizToken: this.userInfo.bizToken,
        talent: {
          mobile: mobile,
          idCard: this.userInfo.idCard,
          id:talentId,
          // idCardPositive: this.userInfo.idCardPositive,
          // idCardNegative: this.userInfo.idCardNegative,
          // bestFrame: this.userInfo.BestFrame,
          realName: this.userInfo.name,
          sex: this.userInfo.sex,
          nation: this.userInfo.nation,
          birthday: `${year}-${month}-${day}`,
          originAddress: this.userInfo.address,
        },
      }

      this.$indicator.open({
        spinnerType: 'fading-circle'
      });

      this.$api.sign(param)
        .then(res => {
          if (res.data.respCode == 0) {
            this.success = 1
          } else {
            this.success = 0
            this.errMsg = res.data.errorMsg
          }
          console.log(res)
        })
        .catch(err => {


          console.log(err)
        })
        .finally(() => {
          this.$indicator.close()
        })
    },

    login() {
      let mobile = localStorage.getItem('regMobile')
      let password = localStorage.getItem('regPsw')
      const params = {
        username: `${mobile},5`,
        password: password
      };
      this.$api
        .login(params)
        .then(response => {
          if (response.data.respCode == 0) {
            sessionStorage.setItem("token", response.headers.authorization);
            sessionStorage.setItem("shareType", '2');//不分享默认2
            sessionStorage.setItem("logintype", response.data.data.loginType);
            sessionStorage.setItem("userInfo", JSON.stringify(response.data.data));
            localStorage.setItem("userInfo", JSON.stringify(response.data.data))
            this.$router.push({ name: 'fullfill' })
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    handleNext() {
      if(localStorage.getItem('authBackUrl')){
        let url = JSON.parse(localStorage.getItem('authBackUrl')).substring(1); //获取之前存取的地址
        this.$router.replace({ path: url})
      }else{
        this.$router.replace({ name: 'Mine' })
      }
		  // let token = sessionStorage.getItem('token');
		  // if(token){
		  //   this.$router.push({ name: 'fullfill' })
		  // }else{
		  //   this.login()
		  // }
    }
  },
}
</script>
<style lang='scss'>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.auth-back {
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

  .result-success .icon {
    background-image: url(../../assets/img/status_success.png);
  }

  .result-failed .icon {
    background-image: url(../../assets/img/status_error.png);
  }

  .btn-zone {
    padding: convertToVw(20) convertToVw(18);
    margin-top: convertToVw(50);
    background-color: #fff;

    .btn {
      border-radius: 3px;
      font-size: convertToVw(17);
      line-height: convertToVw(48);
      text-align: center;
      color: #fff;
      padding: 0;
      background-color: #ea441a;
    }
  }
}
</style>