<template>

  <div style="overflow:hidden;position:relative">
    <mt-header title="签字确认" fixed class="mint-header-title"></mt-header>
    <Scroll style="margin:4rem auto 0;text-align: center;overflow:hidden;backgrond:#f5f5f5;">
      <div class="self">请将手机横置进行签字</div>
      <canvas id="mycanvas" style="border:1px solid #e5e5e5;backgrond:#fff" disable-scroll="true" bindtouchstart="touchStart" bindtouchmove="touchMove" bindtouchend="touchEnd" :width="width" :height="height">Canvas画板</canvas>
      <div class="btnBox flexable">
        <mt-button class="doneBtn" @click="uploadQiniuyun">保存</mt-button>
        <mt-button class="reBtn" @click="clear">清除</mt-button>
      </div>
    </Scroll>
  </div>

</template>

<script>
import SignaturePad from 'signature_pad'
import Scroll from '../../common/Scroll';

export default {
  name: 'canvas',
  data() {
    return {
      imgval: '',
      upload_form: {},
      signImg: '',
      go: true,
      width: '',
      height: '',
      pad: null
    }
  },
  components: {
    Scroll
  },
  methods: {
    initPad() {
      let canvas = document.getElementById('mycanvas')
      canvas.width = Number(document.body.clientWidth) * 0.62
      canvas.height = (Number(document.body.clientHeight) - 40) * 0.86
      this.pad = new SignaturePad(canvas, {
        minWidth: 2,
        maxWidth: 5
      })
    },
    clear: function () {
      this.pad && this.pad.clear()
    },
    save: function () {
      var data = this.pad && this.pad.toDataURL();
      this.url = data;
      console.log(data)
    },
    getToken() {
      this.$api.getToken().then((response) => {
        const {
          data: {
            fileName, upToken,
          },
        } = response.data;
        if (response.data.respCode == 0) {
          this.upload_form = {
            key: fileName,
            token: upToken,
          };
        }
      });
    },
    uploadQiniuyun() {
      if (this.pad.isEmpty()) {
        this.$toast('请签字后再保存！')
        return
      }
      this.imgval = this.pad && this.pad.toDataURL().substring(22)
      this.$api
        .postImg(
          this.imgval,
          this.upload_form.token
        )
        .then(response => {
          if (response.data.key) {
            this.$toast('签字成功')
            let key = response.data.key;

            this.signImg = `${this.bucketHost}/${key}`
            console.log(this.signImg)
            sessionStorage.setItem('signImg', this.signImg)
            this.$router.replace({ name: 'sginCheckInCard' })
          }
          this.getToken();

        })
        .catch(error => {
          console.log(error);
        });
    },
    goBack() {
      console.log(this.go)
      if (!this.go) {
        this.$router.go(-1)
      } else {
        this.$router.push({ name: 'sginCheckInCard' })
      }

    }
  },
  mounted() {
    window.scrollTo(0, 0);

    // 延迟初始化，消除软键盘对页面大小计算的影响
    this.$indicator.open({
      spinnerType: 'fading-circle'
    });
    setTimeout(() => {
      this.initPad()
      this.$indicator.close()
    }, 300)

    this.getToken()
  },

  watch: {
    go: function (val, old) {
      if (val == false) {
        this.$router.go(-1)
      }
    }
  },
}
</script>

<style scoped>
.box {
  width: 300px;
  height: 300px;
  border: 1px solid #333;
}
.panel {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.doneBtn {
  width: 5rem;
  height: 2rem;
  border-radius: 0.1rem;
  border: solid 1px #e84518;
  font-size: 0.8rem;
  color: #fff;
  background: #e84518;
  margin-right: 2.38rem;
}
.reBtn {
  width: 5rem;
  height: 2rem;
  border-radius: 0.1rem;
  font-size: 0.8rem;
  background: #fff;
  color: #e84518;
  /* border: solid 1px #e84518; */
  /* margin: .48rem 0; */
}
.btnBox {
  justify-content: center;
  /* margin-top: 2.63rem; */
  /* padding-bottom: 2.7rem; */
  position: absolute;
  top: 50%;
  left: -4.5rem;
  transform: rotate(90deg);
}
.confirm {
  color: #0d0d0d;
  text-align: center;
  margin: 1.5rem 0 1rem 0;
}
.self {
  font-size: 0.9rem;
  color: #000;
  /* text-align: center; */
  /* width:.6rem; */
  transform: rotate(90deg);
  /* margin:-2rem auto 0; */
  position: absolute;
  top: 50%;
  right: -17%;
}
</style>