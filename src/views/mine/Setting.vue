<template>
  <div id="identification">
    <mt-header title="账号设置" fixed class="mint-header-title">
      <router-link to="/home/mine" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class=" formDiv step">
      <mt-cell title="更换头像" is-link @click.native="open">
        <span>点击更换头像</span>
        <input type="file" ref="upload" accept="image/*" @change="upload($event)" style="display: none">
      </mt-cell>
      <mt-cell title="更换密码" is-link to="/mine/changePsw">
        <span>点击更换密码</span>

      </mt-cell>
      <mt-cell title="更换手机号码" is-link to="/mine/changePhone">
        <span>点击更换手机号码</span>
      </mt-cell>
      <mt-cell title="修改个人信息" is-link to="/userInfo">
        <span>点击修改个人信息</span>
      </mt-cell>
      <mt-cell title="微信绑定">
        <span v-show="!isBindWechat"><a :href="href" style="text-decoration:none;color:#888;">未绑定，点击进行绑定</a></span>
        <span v-show="isBindWechat" @click="handleUnbindWechat">已绑定，点击解除绑定</span>
      </mt-cell>
    </div>
    <div class="flexable margin0">
      <mt-button type="primary" class="logBtn" @click="logout">退出登录</mt-button>
    </div>
  </div>
</template>
<script>
import EXIF from 'exif-js';
export default {
  name: "setting",
  data() {
    return {
      id: '',
      href: '',  // 微信绑定服务端地址
      form: {
        name: '张三',
        idcard: '342529198602244819',
        status: '已认证',
      },
      picValue: '',
      uploadimg: '',
      isBindWechat: false
    };
  },
  mounted() {
    this.checkUser()

    this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId
    // 链接中type为5表示手动绑定
    this.href = `${this.$baseURL}public/wechat/operateRedirect?type=5&scope=snsapi_userinfo&state=${this.id}`
  },
  methods: {
    checkUser() {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if (userInfo.isBindingWeChat) {
        this.isBindWechat = true
      } else {
        this.isBindWechat = false
      }
    },
    open() {
      this.getToken();
      this.$refs.upload.click();
    },
    upload(e) {
      console.log(e);
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview(this.picValue);
      console.log(this.picValue);
      console.log('pppp')
    },
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180;
      let ctx = canvas.getContext('2d');
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    imgPreview(file) {
      console.log('oooo')
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      EXIF.getData(file, function () {
        Orientation = EXIF.getTag(file, 'Orientation');
      });
      console.log(Orientation)
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result;
          let img = new Image();
          img.src = result;
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= 100 * 1024) {
            self.headerImage = this.result;
            self.postImg();
          } else {
            img.onload = function () {
              let data = self.compress(img, Orientation);
              self.headerImage = data;
              self.postImg();
            };
          }
        };
      }
    },
    fileSize(str) {
      var fileSize;

      // 找到等号，把等号也去掉
      if (str.indexOf(",") > 0) {
        var indexOf = str.indexOf(",");
        str = str.substring(indexOf + 1); // 把末尾的’=‘号去掉
      }
      return str;
    },
    postImg() {
      this.$api
        .postImg(
          this.fileSize(this.headerImage),
          this.upload_form.token
        )
        .then(response => {
          // console.log(response.headers)
          const key = response.data.key;
          this.uploadimg = `${this.bucketHost}/${key}`;
          console.log(this.uploadimg);
          this.getToken();
          this.changeImg();
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeImg() {
      let userId = JSON.parse(sessionStorage.getItem('userInfo')).userId
      const params = {
        userId: userId,
        avatar: this.uploadimg
      }
      this.$api
        .changeImg(params)
        .then(response => {
          sessionStorage.setItem('newavatar', this.uploadimg)
          // console.log(response.headers)
          this.$toast("上传成功")
        })
        .catch(error => {
          console.log(error);
        });
    },
    compress(img, Orientation) {
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
      console.log(Orientation)
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6://需要顺时针（向左）90度旋转
            this.rotateImg(img, 'left', canvas);
            break;
          case 8://需要逆时针（向右）90度旋转
            this.rotateImg(img, 'right', canvas);
            break;
          case 3://需要180度旋转
            this.rotateImg(img, 'right', canvas);//转两次
            this.rotateImg(img, 'right', canvas);
            break;
        }
      }

      let ndata = canvas.toDataURL('image/jpeg', 0.1).substring(23);
      console.log(ndata);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      canvas.width = canvas.height = 0;
      return ndata;
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
    logout() {
      this.$api
        .LoginOut()
        .then(response => {
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
          sessionStorage.removeItem("userInfo");
          localStorage.removeItem('userInfo')
          localStorage.removeItem('authBackUrl')
          localStorage.removeItem('stopInsuranceTip')
          this.$router.replace({ name: "login" });
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleUnbindWechat() {
      this.$messagebox({
        title: `提示`,
        message: '确定要解除微信绑定？',
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      }).then(action => {
        if (action == 'confirm') {  // 确认的回调
          let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
          let params = {
            talentUserId: Number.parseInt(userInfo.userId)
          }
          this.$api.unbindWechat(params)
            .then(res => {
              this.$toast('微信解除绑定成功！')
              userInfo.isBindingWeChat = false
              this.isBindWechat = false
              sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
            })
            .catch(err => {
              console.log('unbindwechat false', err)
            })
        }
      }).catch(err => {
        if (err == 'cancel') {  // 取消的回调
        }
      })
    }
  }
};
</script>
<style scoped>
.formDiv {
  padding: 2rem 1rem 0;
  background: #fff;
}
#identification {
  background: #f5f5f5;
  height: 100%;
}
.logBtn {
  width: 12.48rem;
  height: 2.03rem;
  border-radius: 1.01rem;
  font-size: 0.75rem;
  margin: 3.93rem 0 1.2rem;
}
.margin0 {
  justify-content: center;
}
</style>
