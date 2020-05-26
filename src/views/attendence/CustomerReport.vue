<template>
  <div>
    <mt-header title="客户确认表" fixed style="font-size: 0.9rem">
      <div slot="left">
        <mt-button icon="back" @click="$router.back(-1)"></mt-button>
      </div>
    </mt-header>
    <div class="container" style="background-color: #ffffff;height: 100%;padding-bottom: 2.2rem;">
      <p style="text-align: center;padding-top: 0.5rem;color: #e84518">长按下方图片发送给好友</p>
      <img :src="imgSrc" alt="" @click="handleChoose" style="width: 100%;">
    </div>
    <footer class="flexable empty-footer">
      <div class="left-btn flexable" v-if="status" @click="checkScheduling">调整</div>
      <span class="ver-line" v-if="status"></span>
      <div class="left-btn flexable empty-btn" @click="handleBackToHeadman">返回排班</div>
    </footer>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
  name: 'customerReport',
  data() {
    return {
      isChoose: true,
      status: '',
      imgSrc: ''
    }
  },
  mounted() {
    console.log(window.location.href.split('#')[0])
    console.log(this.$route.query.status)
    this.status = this.$route.query.status
    this.getConfirm()
    this.getWechat()
  },
  methods: {
    getWechat() {
      let url3 = location.href.split('#')[0];
      //        let url3 = 'http://test.api.10000rc.com/wechat/index.html'
      let urlDate = {
        url: url3
      };
      this.$api.shareSDK(urlDate).then(res => {
        // console.log(res)
        if (res.data.respCode == 0) {
          let data = res.data.data;
          let _this = this
          // console.log(data)
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            // jsApiList: ["updateAppMessageShareData", "updateTimelineShareData", "getLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            jsApiList: ["previewImage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleChoose() {
      let that = this
      let urls = []
      urls.push(that.imgSrc)
      wx.previewImage({
        current: that.imgSrc,
        urls: urls //这里就将[]去掉
      });
    },
    // 返回排班
    handleBackToHeadman() {
      let checkinType = sessionStorage.getItem('checkinType')  // 打卡方式
      let schedulingId = this.$route.query.id  // 排班id
      this.$router.push({ name: 'headman', query: { id: schedulingId, punchWay: checkinType } })
    },
    checkScheduling() {
      let params = {
        schedulingId: this.$route.query.id
      }
      // this.$api
      //   .checkSchedulingNumberStatus(params)
      //   .then(response => {
      //     console.log(response)
      //     if (response.data.respCode == 0) {
      //       if (response.data.data == true) {
      //         this.$router.push({ name: 'cusConfirm', query: { id: this.$route.query.id } })
      //       }
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      // 再次确认客户确认表是否已经结算，是否处于可调整的状态
      this.$api
        .getSchedulingConfirm(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
            if (response.data.data.settleStatus == 1) {
              this.$router.push({ name: 'cusConfirm', query: { id: this.$route.query.id } })
            } else {
              this.$toast('已经结算完毕，不能再进行调整')
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getConfirm() {
      let params = {
        schedulingId: this.$route.query.id
      }
      this.$api
        .getSchedulingConfirm(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
            this.imgSrc = response.data.data.pngUrl
            this.status = response.data.data.settleStatus == 1
            // commonShare(this,'客户确认表',this.imgSrc,this.imgSrc,'描述')
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    share() {
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
          ]
        });
        /*分享给朋友*/
        wx.onMenuShareAppMessage({
          title: '计划书', // 分享标题
          desc: '保险让生活更美好！', // 分享描述
          link: '${fenxurl}', // 分享链接
          imgUrl: '${params.urlg}/PF_IDENTIFY/Cacheable/image/business/plan-cover/product_img.png', // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
            alert("您已分享");
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
            alert('您已取消分享');
          }
        });
      });
    }
  }
}

</script>
<style scoped>
footer {
  width: 100%;
  /*height: 2.45rem;*/
  position: fixed;
  z-index: 99;
  bottom: 0px;
  left: 0px;
  border-top: solid 0.03rem #e5e5e5;
  background: #ffffff;
  height: 2.53rem;
}

.empty-footer {
  justify-content: space-around;
  align-items: center;
}

.ver-line {
  background-color: #e5e5e5;
  width: 0.03rem;
  height: 100%;
}

.left-btn {
  height: 100%;
  justify-content: center;
  align-items: center;
  width: 48%;
  font-family: PingFang-SC-Medium;
  font-size: 0.75rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0rem;
  letter-spacing: 0.04rem;
  color: #e84518;
}
</style>
<!--<template>-->
<!--<div class="pdf" >-->
<!--&lt;!&ndash;// 自己引入就可以使用,这里我的需求是做了分页功能,如果不需要分页功能,只要src就可以了&ndash;&gt;-->
<!--<pdf-->
<!--:src="src"-->
<!--&gt;-->
<!--</pdf>-->
<!--</div>-->
<!--</template>-->
<!--<script>-->
<!--import pdf from 'vue-pdf'-->

<!--export default {-->
<!--components: {pdf},-->
<!--data() {-->
<!--return {-->
<!--//        currentPage: 0, // pdf文件页码-->
<!--//        pageCount: 0, // pdf文件总页数-->
<!--//        fileType: 'pdf', // 文件类型-->
<!--src: 'http://img.10000rc.com/4e1bbc6a-40e0-49b4-b303-5c92ac903270?v=1545827837688', // pdf文件地址-->
<!--//        src:'http://www.gov.cn/zhengce/pdfFile/2018_PDF.pdf'-->

<!--}-->
<!--},-->
<!--created() {-->
<!--// 有时PDF文件地址会出现跨域的情况,这里最好处理一下-->
<!--this.src = pdf.createLoadingTask(this.src)-->
<!--},-->
<!--method: {-->
<!--loadPdfHandler(e)-->
<!--{-->
<!--this.currentPage = 1 // 加载的时候先加载第一页-->
<!--},-->
<!--// 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页-->
<!--changePdfPage(val)-->
<!--{-->
<!--// console.log(val)-->
<!--if (val === 0 && this.currentPage > 1) {-->
<!--this.currentPage&#45;&#45;-->
<!--// console.log(this.currentPage)-->
<!--}-->
<!--if (val === 1 && this.currentPage < this.pageCount) {-->
<!--this.currentPage++-->
<!--// console.log(this.currentPage)-->
<!--}-->
<!--},-->

<!--// pdf加载时-->


<!--}-->
<!--}-->

<!--</script>-->