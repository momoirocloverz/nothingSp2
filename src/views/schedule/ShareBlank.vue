<template>
  <div class="share-blank">
    <div class="share-tip">
      <div class="share-img"></div>
      <div class="share-text">
        <p>请点击右上角</p>
        <p>选择”发送给朋友“，将排班工作量发</p>
        <p>送给客户进行确认</p>
      </div>

      <div class="page-bottom">
        <div class="bottom-btn" @click="handleBack">返回</div>
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
  name: 'ShareBlank',
  components: {},
  data() {
    return {
      schedulingName: '',
      shareUrl: ''
    };
  },

  computed: {},

  mounted() {
    this.getParams()
    this.getWechat()
  },
  destroyed() {
    this.removeParams()
  },
  methods: {
    getParams() {
      let data = sessionStorage.getItem('shareData')
      data = JSON.parse(data)
      this.schedulingName = data.schedulingName
      this.shareUrl = data.shareUrl
    },
    removeParams() {
      sessionStorage.removeItem('shareData')
    },
    handleBack() {
      this.$router.go(-1)
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
              "imgUrl": "http://www.10000rc.com/images/share_logo.png",//分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
              "desc": _this.schedulingName,//摘要,如果分享到朋友圈的话，不显示摘要。
              "title": '【万才网】工作量确认',//分享卡片标题
              "link": _this.shareUrl,//分享出去后的链接，这里可以将链接设置为另一个页面。
              "success": function () {
                sessionStorage.removeItem('shareData')
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
  },
}
</script>
<style lang='scss' scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.share-tip {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.75);
}
.share-img {
  position: absolute;
  width: convertToVw(100);
  height: convertToVw(100);
  top: convertToVw(15);
  right: convertToVw(18);
  background-image: url(../../assets/img/share.png);
  background-size: cover;
}
.share-text {
  position: relative;
  padding-top: convertToVw(100);
  font-size: convertToVw(18);
  line-height: convertToVw(30);
  color: #b9babd;
  text-align: center;
}
.page-bottom {
  position: absolute;
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