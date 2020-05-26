<template>
  <div class="punch-error">
    <div class="punch-icon">
      <div class="icon-img"></div>
      <p class="icon-tip">打卡失败</p>
      <p class="error-info">{{errorInfo}}</p>
      <p class="error-info" v-if="errorType==2" v-html="errorTxt"></p>
    </div>

    <!--<div class="punch-info">
      <div class="info-item">
        <span class="info-label">冲突排班：</span>
        <span class="info-data"></span>
      </div>

      <div class="info-item">
        <span class="info-label">打卡岗位：</span>
        <span class="info-data"></span>
      </div>

      <div class="info-item">
        <span class="info-label">上班时间：</span>
        <span class="info-data"></span>
      </div>-->

      <div class="info-item sign-item" v-if="punchType==2">
        <span class="info-label">下班时间：</span>
        <span class="info-data img-data"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'puncherror',
  components: {},
  props: {
    errorInfo: {
      type: String,
      default: ''
    },
    // 报错类型，部分报错的报错信息，需要做特殊展示处理
    errorType: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      errorTxt: '原因：您本次考勤与别的考勤时段冲突<br>请重新打卡',
      punchType: 1, // 打卡类型 1上班打卡  2下班打卡
    };
  },

  computed: {},

  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      let punchData = sessionStorage.getItem('punchData') || localStorage.getItem('punchData')
      punchData = JSON.parse(punchData)
      this.punchType = punchData.type
    }
  },
}
</script>
<style lang='scss' scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}

.punch-error {
  .punch-icon {
    background-color: #f5f5f5;
    padding: convertToVw(40) 0 convertToVw(22) 0;
  }

  .icon-img {
    width: convertToVw(98);
    height: convertToVw(98);
    margin: auto;
    background-image: url(../../../assets/img/status_error.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .icon-tip {
    margin-top: convertToVw(22);
    font-size: convertToVw(17);
    color: #1e1f21;
    text-align: center;
  }

  .error-info {
    margin-top: convertToVw(16);
    font-size: convertToVw(13);
    color: #969799;
    text-align: center;
  }

  .punch-info {
    padding: convertToVw(10) convertToVw(28) convertToVw(20) convertToVw(28);
    border-top: 1px solid #d6d6d6;
    border-bottom: 1px solid #d6d6d6;
    background-color: #fff;
    font-size: convertToVw(13);

    .info-item {
      margin-top: convertToVw(10);
    }

    .info-label {
      color: #969799;
    }
    .info-data {
      color: #1e1f21;
    }
  }
}
</style>
