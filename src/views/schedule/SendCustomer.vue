<template>
  <div class="send-customer">
    <mt-header title="客户工作量确认" style="font-size: 0.9rem">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="status" v-if="status == 1">
      <i class="status-icon status-pending"></i>待发送给客户确认
    </div>
    <div class="status" v-if="status == 2">
      <i class="status-icon status-pending"></i>待客户确认
    </div>
    <div class="status" v-if="status == 3">
      <i class="status-icon status-complete"></i>客户已确认
    </div>
    <img :src="imgSrc" width="100%" style="width: 100%;">
    <div class="page-bottom" v-if="status === 1 || status === 2">
      <div class="btn-box" v-if="status === 1">
        <div class="btn-item btn-default" @click="handleEdit">调整</div>
        <div class="btn-item btn-primary" @click="handleSend">发送客户确认</div>
      </div>
      <div class="btn-box" v-if="status === 2">
        <div class="btn-item btn-default" @click="handleCancel">撤回确认请求</div>
        <div class="btn-item btn-primary" @click="handleResend">重新发送</div>
      </div>
    </div>

    <mt-popup v-model="personVisible" position="bottom" class="mint-popup">
      <mt-picker v-if="personList[0].values.length>0" :slots="personList" :visible-item-count="5" :show-toolbar="true" ref="personPicker" value-key="name">
        <div @click="handleConfirm" class="sure">确认</div>
      </mt-picker>
       <mt-picker v-else :slots="noeList" :visible-item-count="5" :show-toolbar="true" ref="personPicker" value-key="nameAlias">
        <div @click="handleSureCancel" class="sure">确认</div>
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
  name: 'send-customer',
  components: {},
  data() {
    return {
      status: 0,
      imgSrc: '',
      shareUrl: '',
      schedulingName: '',
      personVisible: false,
      customerId: 0,
      checkType: 0,  // 1重新发送检查 2撤回检查
      personList: [{
        flex: 1,
        values: [],
        className: "slot",
        textAlign: "center"
      },],
      noeList:[{
        flex: 1,
        values: [{nameAlias:'暂无确认人列表'}],
        className: "slot",
        textAlign: "center"
      }]
    };
  },

  computed: {},

  mounted() {
    this.getConfirm()
    this.getPersonList()
    this.init()
  },
  methods: {
    init() {
      this.shareUrl = window.location.href
    },
    getConfirm() {
      let params = {
        schedulingId: this.$route.query.id
      }
      this.$api
        .getSchedulingConfirm(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.schedulingName = response.data.data.schedulingName
            this.imgSrc = response.data.data.confirmPngForm
            this.status = response.data.data.status
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPersonList() {
      let param = {
        schedulingId: this.$route.query.id
      }
      this.$api.getSchedulingConfirmPersonList(param)
        .then(res => {
          console.log(res)
          this.personList[0].values = res.data.data||[];
          console.log(this.personList[0].values)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleEdit() {
      this.$router.push({ name: 'cusConfirm', query: { id: this.$route.query.id } })
    },
    handleBack() {
      let checkinType = sessionStorage.getItem('checkinType')
      let id = this.$route.query.id
      this.$router.push({ name: 'headman', query: { id: id, punchWay: checkinType } })
    },
    checkStatus() {
      let params = {
        schedulingId: this.$route.query.id
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api
        .getSchedulingConfirm(params)
        .then(response => {
          if (response.data.respCode == 0) {
            let status = response.data.data.status
            if (status != this.status) {
              return this.$messagebox({
                title: `提示`,
                message: `客户确认状态已变更，请返回重新进入`,
                showCancelButton: false,
                confirmButtonText: "确定",
              }).then(action => {
                if (action == 'confirm') {     //确认的回调
                  let checkinType = sessionStorage.getItem('checkinType')
                  let id = this.$route.query.id
                  this.$router.push({ name: 'headman', query: { id: id, punchWay: checkinType } })
                }
              })
                .finally(() => {
                  this.$indicator.close()
                })
            } else {
              if (this.checkType == 1) {
                this.resendCallback()
              } else if (this.checkType == 2) {
                this.cancelCallback()
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSend() {
      let params = {
        schedulingId: this.$route.query.id
      }
      this.$api
        .getSchedulingConfirm(params)
        .then(response => {
          if (response.data.respCode == 0) {
            let status = response.data.data.status
            let name = response.data.data.customerConfirmerName
            if (status != 1) {
              this.$messagebox({
                title: `提示`,
                message: `${name}正在进行客户确认操作，请返回重新进入`,
                showCancelButton: false,
                confirmButtonText: "确定",
              }).then(action => {
                if (action == 'confirm') {     //确认的回调
                  let checkinType = sessionStorage.getItem('checkinType')
                  let id = this.$route.query.id
                  this.$router.push({ name: 'headman', query: { id: id, punchWay: checkinType } })
                }
              }).catch(err => {
                if (err == 'cancel') {
                }
              })
            } else {
              this.handleToSend()
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleToSend() {
      this.$messagebox({
        title: `提示`,
        message: '确认当前工作量无误吗？客户一旦确认，无法更改。',
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      }).then(action => {
        if (action == 'confirm') {     //确认的回调
          this.personVisible = true
        }
      }).catch(err => {
        if (err == 'cancel') {     //取消的回调
        }
      })
    },
    handleResend() {
      this.checkType = 1
      this.checkStatus()
    },
    resendCallback() {
      let param = {
        schedulingId: this.$route.query.id
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api.reGetCustomerConfirmUrl(param)
        .then(res => {
          this.getConfirm()
          this.shareUrl = res.data.data
          this.handleShare()
        })
        .catch(err => {
          this.$toast('重新发送失败')
        })
        .finally(() => {
          this.$indicator.close();
        })
    },
    handleCancel() {
      this.checkType = 2
      this.checkStatus()
    },
    cancelCallback() {
      let param = {
        schedulingId: this.$route.query.id
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api.cancelCustomerConfirm(param)
        .then(res => {
          this.$toast('撤回成功')
          this.getConfirm()
        })
        .catch(err => {
          this.$toast('撤回失败')
        })
        .finally(() => {
          this.$indicator.close()
        })
    },
    handleSureCancel(){
      this.personVisible = false
    },
    handleConfirm() {
      this.customerId = this.$refs.personPicker.getValues()[0].id
      this.personVisible = false
      let param = {
        schedulingId: this.$route.query.id,
        confirmPId: this.customerId,
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api.getCustomerConfirmUrl(param)
        .then(res => {
          this.getConfirm()
          this.shareUrl = res.data.data
          this.handleShare()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.$indicator.close();
        })
    },

    handleShare() {
      let shareData = {
        schedulingName: this.schedulingName,
        shareUrl: this.shareUrl
      }
      shareData = JSON.stringify(shareData)
      sessionStorage.setItem('shareData', shareData)
      this.$router.push({ name: 'shareblank' })
    },
  },
}
</script>
<style lang='scss' scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.send-customer {
  min-height: 100vh;
  background-color: #f5f5f5;
  .status {
    font-size: convertToVw(16);
    line-height: convertToVw(40);
    text-align: center;
    background-color: #fff;
    color: #6e7075;
    .status-icon {
      display: inline-block;
      width: convertToVw(18);
      height: convertToVw(18);
      margin-right: convertToVw(6);
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      vertical-align: middle;
    }
    .status-pending {
      background-image: url(../../assets/img/icon_pending.png);
    }
    .status-complete {
      background-image: url(../../assets/img/icon_success.png);
    }
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
    .btn-box {
      display: flex;
      justify-content: space-between;
    }
    .btn-item {
      box-sizing: border-box;
      width: convertToVw(168);
      height: convertToVw(48);
      font-size: convertToVw(17);
      line-height: convertToVw(48);
      text-align: center;
    }
    .btn-default {
      background-color: #f6f6f6;
      border: 1px solid #dbdbdc;
      color: #1e1f21;
    }
    .btn-primary {
      background-color: #ea441a;
      color: #fff;
    }
  }
  .sure {
    float: right;
    padding: 5px;
    color: #666;
    margin: 5px 5px 0 0;
  }
}
</style>