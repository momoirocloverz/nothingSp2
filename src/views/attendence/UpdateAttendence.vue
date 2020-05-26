<template>
  <div class="update-attendence-page">
    <mt-header title="修改考勤" style="font-size: 0.9rem">
      <mt-button icon="back" slot="left" @click="$router.back(-1)"></mt-button>
    </mt-header>

    <mt-field label="零工" type="text" :value="talentName" readonly></mt-field>
    <mt-field label="工种" type="text" :value="industry" readonly></mt-field>
    <mt-field label="上班时间" type="text" :value="startTimetext" readonly @click.native="handleShowPicker"></mt-field>
    <mt-field label="下班时间" type="text" :value="endTimetext" readonly @click.native="handleShowEndPicker"></mt-field>

    <div v-if="pieceSize.jian || pieceSize.dai || pieceSize.che || pieceSize.dun" class="piece-panel">
      <mt-cell label="计件量"></mt-cell>
      <div class="piece"><input type="text" :value="form.jian" @change="handleChangeJian">件</div>
      <div class="piece"><input type="text" :value="form.dai" @change="handleChangeDai">袋</div>
      <div class="piece"><input type="text" :value="form.che" @change="handleChangeChe">车</div>
      <div class="piece"><input type="text" :value="form.dun" @change="handleChangeDun">吨</div>
    </div>

    <div class="submit-panel">
      <div class="submit-btn" @click="handleSubmit">提交</div>
    </div>

    <mt-popup v-model="endTimeVisible" position="bottom" class="mint-popup">
      <mt-picker :slots="endTimeList" :visible-item-count="5" :show-toolbar="true" ref="endTimePicker" value-key="className">
        <div @click="handleConfirmEnd" class="sure">确认</div>
      </mt-picker>
    </mt-popup>

    <mt-popup v-model="timeVisible" position="bottom" class="mint-popup">
      <mt-picker :slots="timeList" :visible-item-count="5" :show-toolbar="true" ref="timePicker" value-key="className">
        <div @click="handleConfirm" class="sure">确认</div>
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'UpdateAttendence',
  components: {},
  data() {
    return {
      form: {
        startTime: '',
        endTime: '',
        endType: 1,
        jian: '',
        dai: '',
        che: '',
        dun: ''
      },
      timeVisible: false,
      endTimeVisible: false,
      startTimetext: '',
      endTimetext: '',
      endTimeList: [
        {
          flex: 1,
          values: [],
          className: "slot4",
          textAlign: "center"
        },
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: '：',
          className: 'slot2'
        },
        {
          flex: 1,
          values: [
            '00',
            '30'
          ],
          className: "slot3",
          textAlign: "center"
        }
      ],
      timeList: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: '：',
          className: 'slot2'
        },
        {
          flex: 1,
          values: [
            '00',
            '30'
          ],
          className: "slot3",
          textAlign: "center"
        }
      ]
    }
  },

  computed: {
    ...mapState(['talentName', 'industry', 'schedulingEmpId', 'punchId', 'schedulingId', 'startTime', 'endTime', 'endType', 'pieceSize'])
  },

  mounted() {
    this.init()
    this.initPiece()
    this.initText()
  },
  methods: {
    init() {
      this.endTimeList[0].values = ['当日', '次日']
      for (let i = 0; i <= 23; i++) {
        let data = i < 10 ? `0${i}` : `${i}`
        this.timeList[0].values.push(data)
        this.endTimeList[1].values.push(data)
      }

      this.form.startTime = this.startTime
      this.form.endTime = this.endTime
      this.form.endType = this.endType
    },
    initPiece() {
      this.form.jian = this.pieceSize.jian
      this.form.dai = this.pieceSize.dai
      this.form.che = this.pieceSize.che
      this.form.dun = this.pieceSize.dun
    },
    initText() {
      this.startTimetext = this.startTime ? this.startTime.substring(0, 5) : ''
      this.endTimetext = (this.endType == 1 ? '' : '次日 ') + (this.endTime ? this.endTime.substring(0, 5) : '')
    },
    handleShowPicker() {
      this.timeVisible = true
    },
    handleShowEndPicker() {
      this.endTimeVisible = true
    },
    handleConfirm() {
      this.timeVisible = false
      let endHour = this.$refs.timePicker.getValues()[0]
      let endMinute = this.$refs.timePicker.getValues()[1]
      this.form.startTime = `${endHour}:${endMinute}`
      this.startTimetext = `${endHour}:${endMinute}`
    },
    handleConfirmEnd() {
      this.endTimeVisible = false
      let endType = this.$refs.endTimePicker.getValues()[0]
      let endHour = this.$refs.endTimePicker.getValues()[1]
      let endMinute = this.$refs.endTimePicker.getValues()[2]
      if (endType == '当日') {
        this.form.endType = 1
      } else {
        this.form.endType = 2
      }
      this.endTimetext = `${endType} ${endHour}:${endMinute}`
      this.form.endTime = `${endHour}:${endMinute}`
    },
    checkNum(val) {
      if (!val) {
        this.$toast("计件量不能为空");
        return false;
      } else {
        let reg = new RegExp(/^[0-9]+$/)
        if (!reg.test(val)) {
          this.$toast('请输入正确的计件量')
          return false;
        }
      }
    },
    checkDun(val) {
      if (!val) {
        this.$toast("计件量不能为空");
        return false;
      } else {
        this.form.dun = val
        this.form.dun = this.form.dun.toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
        this.form.dun = this.form.dun.toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
        this.form.dun = this.form.dun.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        this.form.dun = String(this.form.dun).replace(/^(.*\..{4}).*$/, "$1");
      }
    },
    handleChangeJian($evt) {
      this.form.jian = $evt.target.value
      this.checkNum(this.form.jian)
    },
    handleChangeDai($evt) {
      this.form.dai = $evt.target.value
      this.checkNum(this.form.dai)
    },
    handleChangeChe($evt) {
      this.form.che = $evt.target.value
      this.checkNum(this.form.che)
    },
    handleChangeDun($evt) {
      this.form.dun = $evt.target.value
      this.checkNum(this.form.dun)
    },
    handleSubmit() {
      let param = {
        schedulingEmpId: this.schedulingEmpId,
        punchId: this.punchId,
        schedulingId: this.schedulingId,
        startTime: this.form.startTime.length < 6 ? `${this.form.startTime}:00` : this.form.startTime,
        endTime: this.form.endTime.length < 6 ? `${this.form.endTime}:00` : this.form.endTime,
        startType: 1,
        endType: this.form.endType,
        pieceSize: JSON.stringify({
          jian: this.form.jian,
          dai: this.form.dai,
          che: this.form.che,
          dun: this.form.dun
        })
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api.updateAttendence(param)
        .then(res => {
          if (res.data.respCode == 0) {
            this.$toast('修改成功！')
            this.$router.go(-1)
          } else {
            this.$toast('修改失败！')
          }
        })
        .catch(err => {
          console.log('attendence update fail', err)
        })
        .finally(() => {
          this.$indicator.close()
        })
    }
  },
}
</script>
<style lang='scss'>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.update-attendence-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  .mint-cell-label {
    font-size: convertToVw(13);
    padding-left: convertToVw(15);
  }
  .mint-popup {
    width: 100%;
  }
  .piece-panel {
    padding-bottom: convertToVw(20);
    background-color: #fff;
  }
  .piece {
    padding-left: convertToVw(40);
    background-color: #fff;
    margin-top: convertToVw(10);
    input {
      width: 80%;
      border: none;
      outline: none;
      border: 1px solid #d9d9d9;
      padding: convertToVw(5) convertToVw(10);
      font-size: convertToVw(12);
    }
  }
  .submit-panel {
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: convertToVw(10) convertToVw(18);
    height: convertToVw(68);
    background-color: #fff;
  }
  .submit-btn {
    height: convertToVw(48);
    font-size: convertToVw(17);
    line-height: convertToVw(48);
    border-radius: convertToVw(5);
    color: #fff;
    background-color: #ea441a;
    text-align: center;
    cursor: pointer;
  }
  .sure {
    float: right;
    padding: 5px;
    color: #666;
    margin: 5px 5px 0 0;
  }
}
</style>
