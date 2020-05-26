<template>
  <div class="to-verify">
    <mt-header title="工作量确认" class="page-header"></mt-header>

    <img :src="imgSrc" alt="工作量确认表">

    <div class="page-bottom">
      <div class="bottom-btn" @click="handleVerify">签字</div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
  name: 'ToVerify',
  components: {},
  data() {
    return {
      schedulingId: 0,
      imgSrc: '',
    };
  },

  computed: {},

  mounted() {
    this.getParam()
    this.getWechat()
    this.getSchedulingConfirm()
  },
  methods: {
    getParam() {
      this.schedulingId = this.$route.query.id
      if (!this.schedulingId) {
        this.$messagebox.alert('没有获取到有效的参数', '错误提示')
        return
      }
    },
    getWechat() {
      let url3 = location.href.split('#')[0];
      let urlDate = {
        url: url3
      };
      this.$api.shareSDK(urlDate).then(res => {
        if (res.data.respCode == 0) {
          let data = res.data.data;
          let _this = this
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo']
          });
          wx.error(function (res) {
            console.log('微信初始化失败')
          });
          wx.ready(function () {
            let cfg = {
              "imgUrl": "http://www.yourwebsite.com/share.png",//分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
              "desc": "你对页面的描述",//摘要,如果分享到朋友圈的话，不显示摘要。
              "title": '分享卡片的标题',//分享卡片标题
              "link": window.location.href,//分享出去后的链接，这里可以将链接设置为另一个页面。
              "success": function () {
                _this.$toast('分享成功！')
              },
              'cancel': function () {
                console.log('用户取消了分享')
              }
            }

            wx.onMenuShareAppMessage(cfg);
            wx.onMenuShareTimeline(cfg);
            wx.onMenuShareQQ(cfg);
          });

        } else {
          console.log('分享失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getSchedulingConfirm() {
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });

      let param = {
        schedulingId: this.schedulingId
      }
      this.$api.getSchedulingConfirm(param)
        .then(res => {
          if (res.data.respCode == 0) {
            this.imgSrc = res.data.data.confirmPngForm
            // status: 1:已撤销 2:待签名 3:已确认
            if (res.data.data.status == 1) {
              this.$router.push({ name: 'havecancel' })
            } else if (res.data.data.status == 3) {
              this.$router.push({ name: 'pagereceipt', query: { id: res.data.data.schedulingId } })
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
    handleVerify() {
      if (!this.schedulingId) {
        this.$messagebox.alert('没有获取到有效的参数', '错误提示')
        return
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });

      let param = {
        schedulingId: this.schedulingId
      }

      this.$api.getSchedulingConfirmSign(param)
        .then(res => {
          if (res.data.respCode == 0) {
            window.location.href = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.$indicator.close()
        })
    }
  },
}
</script>
<style lang='scss' scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.to-verify {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: convertToVw(50);
  img {
    width: 100%;
    height: auto;
    margin-top: convertToVw(10);
  }
}
.page-header {
  border-bottom: 1px solid #d9d9d9;
  font-size: convertToVw(17);
  height: convertToVw(44);
  line-height: convertToVw(44);
}
.page-bottom {
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  height: convertToVw(68);
  bottom: 0;
  left: 0;
  padding: convertToVw(10) convertToVw(18);
  background-color: #fff;
}
.bottom-btn {
  height: convertToVw(48);
  font-size: convertToVw(17);
  line-height: convertToVw(48);
  border-radius: convertToVw(5);
  color: #fff;
  background-color: #ea441a;
  text-align: center;
}
</style>