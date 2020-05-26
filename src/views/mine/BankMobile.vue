<template>
  <div class="bank-mobile">
    <mt-header title="更换预留手机号">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="page-content">
      <mt-cell title="姓名" class="border-cell"><span>{{form.name}}</span></mt-cell>
      <mt-cell title="身份证号"><span>{{form.idCard}}</span></mt-cell>
      <mt-cell title="银行卡号"><span>{{form.bankCard}}</span></mt-cell>
      <mt-field label="预留手机号" class="margin-space" placeholder="请输入办卡时预留手机号" v-model="form.mobile" @blur.native.capture="checkTelPhone" type="tel"></mt-field>
      <div class="btn-wrapper">
        <mt-button type="primary" @click="handleSubmit" :disabled="isLoading">提交</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
// 更换银行手机号
import { MessageBox } from 'mint-ui';
export default {
  name: 'BankMobile',
  data() {
    return {
      isLoading: false,
      id: '',  // 用户id
      bankVisible: false,
      bankName: '',
      form: {
        name: '',
        idCard: '',  // 身份证号
        bankCard: '',  // 银行卡号
        mobile: ''
      },
    }
  },
  mounted() {
    this.getParams()
    this.fetchUserInfo()
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    getParams() {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {}
      if (userInfo.userId) {
        this.id = userInfo.userId
      } else {
        this.$messagebox.alert('没有获取到用户信息', '错误提示')
        return
      }
    },

    fetchUserInfo() {
      this.$api.AccountDetail()
        .then(res => {
          let form = res.data.data.bankList[0]
          this.form.name = form.realName
          this.form.idCard = form.idCard
          this.form.mobile = form.mobile
          this.form.bankCard = form.cardNumber
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          console.log('查询账户信息')
        })
    },

    checkTelPhone() {
      if (!this.form.mobile) {
        this.$toast("办卡时预留手机号不能为空")
        return false
      } else {
        let reg = new RegExp(/^[1-9]\d{10}$/)
        if (!reg.test(this.form.mobile)) {
          this.$toast("请输入正确的办卡时预留手机号")
          return false
        } else {
          return true
        }
      }
    },


    handleSubmit() {
      let phonecheck = this.checkTelPhone()
      if (!phonecheck) {
        return false
      }

      this.isLoading = true;
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      const params = {
        mobile: this.form.mobile
      }
      this.$api
        .changeBankMobile(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.$toast('手机号更换成功！')
            this.$router.go(-1)
          } else if (response.data.errorCode == 150007) {
            if (Number.parseInt(response.data.errorMsg) > 0) {
              MessageBox({
                title: '错误提示',
                message: `信息错误, 今天还剩<span style="color: #e84518">${response.data.errorMsg}</span>次提交机会，请仔细核对信息`,
                closeOnClickModal: true
              })
            } else if (Number.parseInt(response.data.errorMsg) == 0) {
              MessageBox({
                title: '错误提示',
                message: `信息错误, 今天认证次数已用完，请明天再试！`,
                closeOnClickModal: true,
              })
            } else {
              this.$toast('每天只能提交3次')
            }
          }
        })
        .catch(error => {
          this.$toast(error)
        })
        .finally(() => {
          this.isLoading = false
          this.$indicator.close()
        })
    },
    handleBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss">
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.bank-mobile {
  min-height: 100vh;
  background-color: #f5f5f5;
  .page-content {
    background-color: #f5f5f5;
    border-top: convertToVw(24) solid #f2f2f5;
  }
  .mint-header {
    font-size: convertToVw(16);
    line-height: convertToVw(44);
  }
  .mint-cell {
    font-size: convertToVw(16);
    line-height: convertToVw(46);
    color: #333;
  }
  .border-cell {
    border-bottom: 1px solid #f2f2f5;
  }
  .bank-tip {
    font-size: convertToVw(14);
    padding-right: convertToVw(24);
    padding-top: convertToVw(8);
    text-align: right;
    color: #939393;
  }
  .margin-space {
    margin-top: convertToVw(18);
  }
  .mint-cell-title {
    flex: none;
    width: 105px;
  }
  .btn-wrapper {
    box-sizing: border-box;
    padding: convertToVw(10) convertToVw(18);
    margin-top: convertToVw(30);
    font-size: convertToVw(18);
    line-height: convertToVw(48);
    background-color: #fff;
    .mint-button {
      display: block !important;
      width: 100% !important;
    }
  }
}
</style>
