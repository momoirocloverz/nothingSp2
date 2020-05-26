<template>
  <div class="re-sign">
    <mt-header title="重新签名" class="page-header">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="signature-content">
      <p class="pad-title">请将手机横置进行签字</p>
      <canvas id="mycanvas"></canvas>
      <div class="btn-box">
        <div class="btn btn-save" @click="handleSave">保存</div>
        <div class="btn btn-clear" @click="handleClear">清除</div>
      </div>
    </div>
  </div>
</template>

<script>
//重新签名
import SignaturePad from 'signature_pad'
export default {
  name: 'ReSign',
  components: {},
  data() {
    return {
      pad: null,
      punchId: 0,
      imgval: '',
      upload_form: {},
      signImg: '',
    };
  },

  computed: {},

  mounted() {
    this.getParam()
    this.initPad()
  },
  methods: {
    getParam() {
      this.punchId = this.$route.query.id
    },
    handleBack() {
      this.$router.go(-1)
    },
    initPad() {
      let canvas = document.getElementById('mycanvas')
      canvas.width = Number(document.body.clientWidth) * 0.62
      canvas.height = (Number(document.body.clientHeight) - 40) * 0.86
      this.pad = new SignaturePad(canvas, {
        minWidth: 2,
        maxWidth: 5
      })
    },
    handleClear() {
      if (this.pad) {
        this.pad.clear()
      }
    },
    handleSave() {
      if (this.pad.isEmpty()) {
        this.$toast('请签字后再保存！')
        return
      }

      this.getToken()
    },

    getToken() {
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });

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
          }

          this.uploadQiniuyun()
        }
      })
        .catch(err => {
          this.$indicator.close()
        })
    },
    uploadQiniuyun() {
      this.imgval = this.pad.toDataURL().substring(22)
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

            this.$router.push({ path: '/confirmsign', query: { imgsrc: this.signImg, id: this.punchId } })
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$indicator.close()
        })
    },
  },
}
</script>
<style lang='scss'>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.re-sign {
  height: 100vh;
  background-color: #f5f5f5;

  .page-header {
    font-size: convertToVw(17);
    height: convertToVw(44);
    border-bottom: 1px solid #d9d9d9;
  }
  .signature-content {
    margin-top: convertToVw(20);
    position: relative;
  }
  #mycanvas {
    box-sizing: border-box;
    background-color: #fff;
    margin-left: convertToVw(80);
    border: 1px solid rgb(229, 229, 229);
  }
  .pad-title {
    position: absolute;
    top: 50%;
    right: convertToVw(20);
    transform: translate(50%, -50%) rotate(90deg);
  }
  .btn-box {
    position: absolute;
    width: convertToVw(250);
    height: convertToVw(40);
    display: flex;
    justify-content: space-between;
    top: 50%;
    left: convertToVw(40);
    transform: translate(-50%, -50%) rotate(90deg);
    .btn {
      box-sizing: border-box;
      height: convertToVw(40);
      width: convertToVw(100);
      text-align: center;
      padding: 0;
      font-size: convertToVw(16);
      line-height: convertToVw(40);
    }
    .btn-save {
      background-color: #e84518;
      color: #fff;
    }
    .btn-clear {
      border: 1px solid #d9d9d9;
      background-color: #fff;
      color: #e84518;
    }
  }
}
</style>