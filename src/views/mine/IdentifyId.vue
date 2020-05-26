<template>
  <div class="identify-id">
    <mt-header title="注册">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>
    <h2 class="page-title">第二步 身份认证</h2>
    <div class="page-content">
      <input type="file" ref="upload" accept="image/*" @change="upload($event)" style="display: none">
      <div class="icon-field">
        <mt-field label="身份证号" placeholder="请输入身份证号码" v-model="idCard" @blur.native.capture="checkIdcard" @input="getIdCardBlank"></mt-field>
        <div class="field-icon" @click="open"></div>
      </div>

      <div class="field-tip">点击右侧摄像头可拍照识别身份证</div>

      <mt-field label="姓名" placeholder="请输入姓名" v-model="name" @blur.native.capture="checkName" :attr="{ maxlength: 128}"></mt-field>
      <div class="field-tip">请务必填写本人身份信息，因为后续收入提现的银行卡所属人必须与本信息一致</div>

      <div class="btn-wrapper">
        <mt-button type="primary" @click="handleSubmit" :disabled="isLoading">下一步<span v-show="isShowTime">({{timeLeft}}S)</span></mt-button>
      </div>
    </div>
  </div>
</template>

<script>
// 身份证实名认证
export default {
  name: 'IdentifyId',
  data() {
    return {
      isLoading: false,
      headerImage: null,
      uploadimg: '',
      id: '',
      timer: null,
      timeLeft: 0,
      isShowTime: false,
      idCard: '',
      name: '',
      nation: '',
      address: ''
    }
  },
  methods: {
    getParams() {
      this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId
    },

    checkIdcard() {
      if (!this.idCard) {
        this.$toast("身份证号不能为空");
        return false;
      } else {
        if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test((this.idCard).replace(/\s+/g, ""))) {
          this.$toast("请输入正确的身份证号");
          return false;
        }
      }
      return true
    },

    checkName() {
      if (!this.name) {
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
      if (!(idcardcheck && namecheck)) {
        return false
      }

      if (this.timeLeft > 0) {
        return false
      }

      this.timeLeft = 30
      this.isShowTime = true
      clearInterval(this.timer)
      let __self = this
      this.timer = setInterval(function () {
        __self.timeLeft--
        if (__self.timeLeft <= 0) {
          clearInterval(__self.timer)
          __self.isShowTime = false
        }
      }, 1000)

      this.isLoading = true;
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });

      const params = {
        userId: this.id,
        idCard: this.idCard.replace(/\s+/g, ""),
        realName: this.name,
        nation: this.nation,
        originAddress: this.address,
        idCardPositive: this.uploadimg
      }
      this.$api
        .AuthenticationStepOne(params)
        .then(response => {
          console.log('身份验证第一步', response)
          this.$indicator.close()
          if (response.data.respCode == 0) {
            // this.$router.push({ path: '/baseinfo' }) // 后续再优化

            this.$router.push({ path: 'identification' })
          } else {
            this.$messagebox.alert(`信息错误, ${response.data.errorMsg}</span>，请仔细核对信息`, '错误提示')
          }
          this.isLoading = false
        })
        .catch(error => {
          console.log(error);
          this.$toast(error)
          this.isLoading = false
        });
    },

    getIdCardBlank(value) {
      value = value.replace(/\s/g, '').replace(/(^(\d{6})|(\d{4}))(?=[^\s])/g, "$1 ");
      this.idCard = value
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
          this.regIdcard();
        })
        .catch(error => {
          console.log(error);
        });
    },

    regIdcard() {
      const params = {
        url: this.uploadimg
      };
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api
        .regIdcard(params)
        .then(response => {
          console.log(response)
          this.$indicator.close();
          if (response.data.respCode == 0) {
            sessionStorage.setItem('nation', response.data.data.nation)
            sessionStorage.setItem('sex', response.data.data.sex)
            sessionStorage.setItem('address', response.data.data.address)
            sessionStorage.setItem('birthDay', response.data.data.birthDay)
            this.nation = response.data.data.nation
            this.address = response.data.data.address
            this.idCard = response.data.data.id
            this.name = response.data.data.name
          }
        })
        .catch(error => {
          this.$indicator.close();
          console.log(error);
        });
    },
    handleBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.identify-id {
  min-height: 100vh;
  background-color: #f5f5f5;
  .page-title {
    font-size: convertToVw(16);
    line-height: convertToVw(44);
    background-color: #fff;
    color: #333;
    text-align: center;
  }
  .mint-header {
    font-size: convertToVw(16);
    line-height: convertToVw(46);
  }
  .mint-cell {
    font-size: convertToVw(16);
    line-height: convertToVw(46);
    color: #333;
  }
  .mint-cell-title {
    width: 90px;
  }
  .mint-cell-value {
    padding-right: convertToVw(16);
  }
  .icon-field {
    position: relative;
    margin-top: convertToVw(24);
    padding-right: convertToVw(62);
    background-color: #fff;
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
  .btn-wrapper {
    box-sizing: border-box;
    // position: fixed;
    // width: 100%;
    // bottom: 0;
    padding: convertToVw(10) convertToVw(18);
    font-size: convertToVw(18);
    line-height: convertToVw(48);
    // background-color: #fff;
    margin-top: convertToVw(30);
    .mint-button {
      display: block !important;
      width: 100% !important;
    }
  }
}
</style>
