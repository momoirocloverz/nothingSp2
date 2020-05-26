<template>
  <div class="code-show">
    <mt-header title="添加日结零工" class="page-title">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="code-content">
      <p class="code-title">申请验证码：{{code}}</p>
      <p class="code-tip">（验证码30分钟内有效）</p>
      <p class="code-procedure">
        添加步骤：
        <br>1. 将此验证码告知需添加的日结零工.
        <br>2. 日结零工登录零工端，进入排班日历，点击右上角“+”.
        <br>3. 日结零工输入此验证码并提交进行申请.
        <br>4. 查看申请名单，安排工种选择零工并提交.
      </p>
    </div>
    <mt-cell title="查看申请名单" class="list-link" :value="`${total}人`" is-link @click.native="routeToWorkerlist"></mt-cell>
  </div>
</template>

<script>
export default {
  name: 'CodeShow',
  components: {},
  data() {
    return {
      code: '',
      workerList: [],
    };
  },

  computed: {
    total() {
      return this.workerList.length
    }
  },

  mounted() {
    this.getCode()
    this.getWorkerList()
    this.connectWebSocket()
  },
  beforeDestroy() {
    this.closeWebSocket()
  },
  methods: {
    handleBack() {
      this.$router.go(-1)
    },
    getCode() {
      let id = this.$route.query.id
      let param = {
        schedulingId: id
      }
      this.$api.reGenerateCode(param)
        .then(res => {
          console.log(res)
          this.code = res.data.data.code
        })
        .catch(err => {
          console.log(err)
        })
    },
    connectWebSocket() {
      console.log("开始建立连接...");
      let _this = this
      let id = this.$route.query.id
      this.websocket = new WebSocket(`ws://${this.$baseURLWS}biz/scheduling/websocket?schedulingId=${id}`);

      this.websocket.onopen = function () {
        console.log('socket连接已建立')
        _this.$indicator.close();
      }

      this.websocket.onclose = function () {
        console.log('socket连接已关闭')
      }

      this.websocket.onmessage = function (msg) {
        var data = JSON.parse(msg.data)
        let message = JSON.parse(data.message)
        if (data.type == 5) {
          let applyItem = {
            schedulingDailyApplyId: message.schedulingDailyApplyId,
            talentName: message.talentName || '',
            talentSkillList: message.talentSkillList || '',
            sex: message.sex
          }
          _this.workerList.push(applyItem)
        }
      }
    },
    closeWebSocket() {
      if (this.websocket != null) {
        this.websocket.close()
      }
    },
    getWorkerList() {
      let id = this.$route.query.id
      let param = {
        schedulingId: id
      }
      this.$api.applyListManager(param)
        .then(res => {
          this.workerList = res.data.data || []
        })
        .catch(err => {
          console.log(err)
        })
    },
    routeToWorkerlist() {
      this.$router.push({ name: 'workerlist', query: { id: this.$route.query.id } })
    }
  },
}
</script>
<style lang='scss'>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.code-show {
  min-height: 100vh;
  background-color: #f5f5f5;
  .page-title {
    height: convertToVw(44);
    font-size: convertToVw(17);
    line-height: convertToVw(44);
    border-bottom: 1px solid #d9d9d9;
  }
  .code-content {
    padding-top: convertToVw(34);
    padding-bottom: convertToVw(20);
    margin-top: convertToVw(18);
    background-color: #fff;
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
  }
  .code-title {
    font-size: convertToVw(20);
    font-weight: bold;
    text-align: center;
    color: #000;
  }
  .code-tip {
    padding: convertToVw(16) 0 convertToVw(20) 0;
    font-size: convertToVw(13);
    color: #000;
    text-align: center;
  }
  .code-procedure {
    padding: 0 convertToVw(18);
    font-size: convertToVw(13);
    line-height: convertToVw(24);
    color: #6e7075;
  }
  .list-link {
    margin-top: convertToVw(20);
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
  }
  .mint-cell-allow-right::after {
    right: convertToVw(15);
  }
}
</style>