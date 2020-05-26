<template>
  <div class="punch-success">
    <div class="punch-icon">
      <div class="icon-img"></div>
      <p class="icon-tip">打卡成功</p>
    </div>

    <div class="punch-info">
      <div class="info-item">
        <span class="info-label">打卡时间：</span>
        <span class="info-data">{{time}}</span>
      </div>

      <div class="info-item">
        <span class="info-label">打卡岗位：</span>
        <span class="info-data">{{industryName}}</span>
      </div>

      <div class="info-item">
        <span class="info-label">打卡班组：</span>
        <span class="info-data">{{team}}</span>
      </div>

      <div class="info-item" v-if="type == 2">
        <span class="info-label">计件量：</span>
        <span class="info-data">{{piece}}</span>
      </div>

      <div class="info-item sign-item">
        <span class="info-label">打卡签名：</span>
        <span class="info-data img-data" :style="`background-image:url(${signImg})`"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'punchsuccess',
  components: {},
  data() {
    return {
      time: '',
      industryName: '',
      team: '', // 班组
      signImg: '',
      type: 1, // 1上班卡  2下班卡
      piece: ''
    };
  },

  computed: {},

  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      try {
        let punchData = sessionStorage.getItem('punchData') || localStorage.getItem('punchData')
        if (punchData) {
          punchData = JSON.parse(punchData)
        } else {
          punchData = {}
        }

        this.time = punchData.time
        this.industryName = punchData.industryName
        this.team = punchData.team
        this.signImg = sessionStorage.getItem('selfSign') + '?imageMogr/rotate/270'

        let pieceSize = JSON.parse(punchData.pieceSize)

        pieceSize.jian && (this.piece += `${pieceSize.jian}件，`)
        pieceSize.dai && (this.piece += `${pieceSize.dai}袋，`)
        pieceSize.che && (this.piece += `${pieceSize.che}车，`)
        pieceSize.dun && (this.piece += `${pieceSize.dun}吨，`)
      } catch (error) {
        alert(error)
      }
    }
  },
}
</script>
<style lang='scss' scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.punch-success {
  .punch-icon {
    background-color: #f5f5f5;
    padding: convertToVw(40) 0 convertToVw(22) 0;
  }

  .icon-img {
    width: convertToVw(98);
    height: convertToVw(98);
    margin: auto;
    background-image: url(../../../assets/img/success.png);
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

  .punch-info {
    padding: convertToVw(10) convertToVw(28) convertToVw(20) convertToVw(28);
    border-top: 1px solid #d6d6d6;
    border-bottom: 1px solid #d6d6d6;
    background-color: #fff;
    font-size: convertToVw(13);

    .info-item {
      margin-top: convertToVw(10);
    }
    .sign-item {
      .info-label {
        vertical-align: top;
      }
    }
    .info-label {
      color: #969799;
    }
    .info-data {
      color: #1e1f21;
    }

    .img-data {
      display: inline-block;
      width: convertToVw(220);
      height: convertToVw(88);
      border: 1px solid #d6d6d6;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }
}
</style>