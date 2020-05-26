<template>
  <div class="bind-bankcard">
    <mt-header title="绑定银行卡">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>
    <div class="page-content">
      <mt-cell title="姓名" class="border-cell"><span>{{form.name}}</span></mt-cell>
      <mt-cell title="身份证号"><span>{{form.idCard}}</span></mt-cell>

      <mt-field label="开户银行" class="margin-space" placeholder="请选择开户银行" v-model="bankName" readonly @click.native="bankVisible=true"></mt-field>
      <div class="bank-tip">仅支持工商、建设...等17家</div>

      <input type="file" ref="upload" accept="image/*" @change="upload($event)" style="display: none">
      <div class="icon-field">
        <mt-field label="银行卡号" placeholder="请输入银行卡号" v-model="form.bankCard" @blur.native.capture="checkBankcard" @input="getBankCardBlank"></mt-field>
        <div class="field-icon" @click="open"></div>
      </div>
      <mt-field label="预留手机号" class="margin-space" placeholder="如忘记了可打银行客服电话查询" v-model="form.mobile" @blur.native.capture="checkTelPhone" type="tel"></mt-field>
      <div class="btn-wrapper">
        <mt-button type="primary" @click="handleSubmit" :disabled="isLoading">提交</mt-button>
      </div>
    </div>

    <mt-popup v-model="bankVisible" position="bottom" class="mint-popup">
      <mt-picker :slots="bankList" @change="onBankChange" :visible-item-count="5" ref="bankPicker" value-key="dicName" :show-toolbar="true">
        <div @click="handleConfirm" class="sure">确认</div>
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
// 身份证实名认证
export default {
  name: 'BindBankcard',
  data() {
    return {
      isLoading: false,
      id: '',  // 用户id
      bankVisible: false,
      bankName: '',
        bankCardBindingStatus:false,
      form: {
        name: '',
        idCard: '',  // 身份证号
        bankCard: '',  // 银行卡号
        mobile: '',
      },
      bankList: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
    }
  },
  mounted() {
    this.getParams()
    this.fetchUserInfo()
    this.fetchBankList()
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
      const params = {
        id: this.id
      };
      this.$api
        .getUserInfo(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.form = response.data.data
            this.form.sexName = response.data.data.sexName || (response.data.data.sex == 1 ? '男' : '女')
            this.form.name = this.form.realName
            this.form.mobile = ''
          }
        })
        .catch(error => {
          this.$messagebox.alert(error, '错误提示')
          console.log(error)
        });
    },

    fetchBankList() {
      this.$api
        .getDicList("bank_code", '0')
        .then(response => {
          if (response.data.respCode == 0) {
            this.bankList[0].values = response.data.data
          } else {
            this.$toast('获取银行列表失败')
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    onBankChange(values) {
      this.bankName = values[0] && values[0].dicName
    },
    handleConfirm() {
      this.bankName = this.$refs.bankPicker.getValues()[0] && this.$refs.bankPicker.getValues()[0].dicName
      this.bankVisible = false
    },
    checkBankcard() {
      let bankno = this.form.bankCard
      if (!bankno) {
        this.$toast("银行卡号不能为空");
        return false;
      } else if (!/^([1-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18})$/.test((bankno).replace(/\s+/g, ""))) {
        this.$toast("请输入正确的银行卡号");
        return false;
      } else {
        this.getDetail(bankno.replace(/\s+/g, ""))
        return true
      }
    },

    getBankCardBlank(value = '') {
      value = value.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
      this.form.bankCard = value
    },

    checkTelPhone() {
      if (!this.form.mobile) {
        this.$toast("办卡时预留手机号不能为空")
        return false
      } else {
        let reg = new RegExp(/^[1-9][0-9]*$/)
        if (!reg.test(this.form.mobile)) {
          this.$toast("请输入正确的办卡时预留手机号")
          return false
        } else {
          return true
        }
      }
    },

    checkIdcard() {
      if (!this.form.idCard) {
        this.$toast("身份证号不能为空");
        return false;
      } else {
        if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test((this.form.idCard).replace(/\s+/g, ""))) {
          this.$toast("请输入正确的身份证号");
          return false;
        }
      }
      return true
    },

    checkName() {
      if (!this.form.name) {
        this.$toast("姓名不能为空");
        return false;
      } else {
        return true;
      }
    },
    handleSubmit() {
      let idcardcheck = this.checkIdcard()
      if (!idcardcheck) {
        return false
      }
      let namecheck = this.checkName()
      if (!namecheck) {
        return false
      }
      let cardnumber = this.checkBankcard()
      if (!cardnumber) {
        return false
      }
      let phonecheck = this.checkTelPhone()
      if (!phonecheck) {
        return false
      }

      if (!(this.bankName && this.bankName.length != 0)) {
        this.$toast("开户银行不能为空")
        return false
      }

      this.isLoading = true;
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      const params = {
        userId: this.id,
        idCard: this.form.idCard.replace(/\s+/g, ""),
        realName: this.form.name,
        cardNumber: this.form.bankCard.replace(/\s+/g, ""),
        mobile: this.form.mobile,
        bankName:this.bankName,
      }
      this.$api
        .BindBankCard(params)
        .then(response => {
          console.log('绑定银行卡', response)
          this.$indicator.close()
          if (response.data.respCode == 0) {
            // 需要根据条件判断跳转地址
            if (sessionStorage.getItem('cashout')) {
              this.$router.push({ name: 'cashOut' })
            } else {
              this.$router.push({ path: '/mybankcard' })
            }
              localStorage.setItem( 'haveInComeBankCardBindingStatus',JSON.stringify(true) );
          } else if (response.data.errorCode == 150007) {
            this.$messagebox.alert(`信息错误, ${response.data.errorMsg}</span>，请仔细核对信息`, '错误提示')
            if (Number.parseInt(response.data.errorMsg) > 0) {
              // this.$messagebox.alert(`信息错误, 今天还剩<span style="color: #e84518">${response.data.errorMsg}</span>次提交机会，请仔细核对信息`, '错误提示')

              MessageBox({
                title: '错误提示',
                message: `信息错误, 今天还剩<span style="color: #e84518">${response.data.errorMsg}</span>次提交机会，请仔细核对信息`,
                closeOnClickModal: true
              })
            } else if (Number.parseInt(response.data.errorMsg) == 0) {
              // this.$messagebox.alert(`信息错误, 今天认证次数已用完，请明天再试！`, '错误提示'),
              MessageBox({
                title: '错误提示',
                message: `信息错误, 今天认证次数已用完，请明天再试！`,
                closeOnClickModal: true,
              })
            } else {
              this.$toast('每天只能提交3次')
            }
          }
          this.isLoading = false
        })
        .catch(error => {
          console.log(error);
          this.$toast(error)
          this.isLoading = false
        });
    },

    getDetail(cardNo) {
      const params = {
        cardNo: cardNo,
      };
      this.$api.CardBinInfo(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    open() {
      this.getToken();
      this.$refs.upload.click();
    },

    upload(e) {
      console.log(e);
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.picValue = files[0]
      this.imgPreview(this.picValue)
      console.log(this.picValue)
    },

    imgPreview(file) {
      let self = this
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader()
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file)
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= 100 * 1024) {
            self.headerImage = this.result
            self.postImg()
          } else {
            img.onload = function () {
              let data = self.compress(img)
              self.headerImage = data
              self.postImg()
            };
          }
        };
      }
    },

    compress(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = (width * height) / 4000000) > 1) {
        console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      ctx.drawImage(img, 0, 0, width, height);
      //进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1).substring(23);
      console.log(ndata);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      canvas.width = canvas.height = 0;
      return ndata;
    },

    fileSize(str) {
      var fileSize;
      if (str.indexOf(",") > 0) {
        var indexOf = str.indexOf(",")
        str = str.substring(indexOf + 1)  // 把末尾的’=‘号去掉
      }
      return str
    },

    getToken() {
      this.$api.getToken().then((response) => {
        const {
          data: {
            fileName, upToken,
          },
        } = response.data;
        this.upload_form = {
          key: fileName,
          token: upToken,
        };
      });
    },

    postImg() {
      this.$api
        .postImg(
          this.fileSize(this.headerImage),
          this.upload_form.token
        )
        .then(response => {
          const key = response.data.key;
          this.uploadimg = `${this.bucketHost}/${key}`;
          console.log(this.uploadimg);
          this.getToken();
          this.regBankcard();
        })
        .catch(error => {
          console.log(error);
        });
    },

    regBankcard() {
      const params = {
        url: this.uploadimg
      };
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api
        .regBankcard(params)
        .then(response => {
          console.log(response)
          this.$indicator.close();
          if (response.data.respCode == 0) {
            this.form.bankCard = response.data.data.cardNo
          }
        })
        .catch(error => {
          this.$indicator.close();
          console.log(error);
        });
    },

    handleBack() {
      this.$router.go(-1)
    },
    closeTouch() {
      document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, { passive: false })//阻止默认事件
    },
    openTouch() {
      document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, { passive: false })//打开默认事件
    },
  },
  watch: {
    bankVisible: function (val, oldval) {
      if (val) {
        this.closeTouch()
      } else {
        this.openTouch()
      }
    },
  }
}
</script>

<style lang="scss">
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.bind-bankcard {
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
  .icon-field {
    position: relative;
    margin-top: convertToVw(24);
    padding-right: convertToVw(62);
    background-color: #fff;
    border-bottom: 1px solid #f2f2f5;
    .field-icon {
      position: absolute;
      width: convertToVw(30);
      height: convertToVw(30);
      right: convertToVw(18);
      top: convertToVw(14);
      background-image: url(../../assets/img/camera.png);
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
      &::after {
        position: absolute;
        content: "";
        display: block;
        width: 1px;
        height: convertToVw(16);
        top: convertToVw(7);
        left: convertToVw(-18);
        background-color: #cacaca;
      }
    }
  }
  .mint-cell-title {
    flex: none;
    width: 105px;
  }
  .field-tip {
    position: relative;
    padding: convertToVw(8) convertToVw(35) convertToVw(18) convertToVw(35);
    font-size: convertToVw(14);
    color: #7d7d7d;
    &::before {
      content: "";
      display: block;
      position: absolute;
      width: convertToVw(17);
      height: convertToVw(17);
      top: convertToVw(8);
      left: convertToVw(13);
      background-image: url(../../assets/img/alert.png);
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
    }
  }
  .sure {
    font-size: convertToVw(16);
    text-align: right;
    padding-right: convertToVw(20);
    padding-top: convertToVw(10);
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
  .picker-items {
    width: 100%;
  }
}
</style>
