<template>
  <div class="page-container">
    <!--确认第一步-->
    <div class="page-cusconfirm" v-show="step==1">
      <mt-header title="统计工作量-明细" fixed style="font-size: 0.9rem">
        <mt-button icon="back" slot="left" @click="$router.back(-1)"></mt-button>
      </mt-header>
      <div class="container" style="background-color: #ffffff;height: 100%">
        <div class="card-list" v-for="(item , index1) in schedulingSettingVos" :id="'anchor'+item.industry" v-if="item.isStart!=2">
          <div class="card-title1 flexable">
            <span class="markLine"></span>
            <span class="industry">{{item.industryName}}</span>
            <span class="industry-num"> {{item.settingNormalCounts}}人
              {{item.workStartTime | formatTimeString}}- {{item.endWorkType | formatendWorkType}} {{item.workEndTime | formatTimeString}}
            </span>
          </div>
          <div v-for="(person, index2) in item.schedulingEmployees" v-if="person.talentType!=2">
            <div class="card-header" :class="{'delete': person.deleteStatus}">
              <span class="card-name">{{person.talentName}}</span>
              <br>
              <span class="card-tag">{{person.sexName}}</span>
              <span class="card-tag normal-tag">{{person.age}}岁</span>
              <span class="card-tag normal-tag">{{person.settlementTypeName}}</span>
              <!--删除，恢复按钮-->

              <!--每个人都显示删除按钮-->
              <span class="handle-btn" @click="toggleDeleteStatus(index1, index2)">{{person.deleteStatus ? '恢复' : '删除'}}</span>
            </div>
            <div class="card-body flexable" v-show="!person.deleteStatus">
              <div v-if="person.schedulingPunchList">
                <div v-for="(value,index3) in person.schedulingPunchList">
                  <div class="body-item flexable">
                    <div>
                      <span class="select-label">上班时间:</span>
                      <span class="select-span" @click="handlePicker(index1,index2,index3)">
                        <input :value="value.customerWorkStartDateTime && value.customerWorkStartDateTime.substring(0,16)" disabled class="select-div" placeholder="请选择" />
                        <img src="../../assets/img/down.png" class="select-icon" />
                      </span>
                    </div>
                    <div>
                      <span class="select-label">下班时间:</span>
                      <span class="select-span" @click="handlePicker2(index1,index2,index3)">
                        <input :value="value.customerWorkEndDateTime && value.customerWorkEndDateTime.substring(0,16)" disabled class="select-div" placeholder="请选择" />
                        <img src="../../assets/img/down.png" class="select-icon" />
                      </span>
                    </div>
                  </div>
                  <div class="piece">计件量：{{value.pieceSize | formatPieceSize}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <mt-popup v-model="nationVisible" position="bottom" class="mint-popup">
          <mt-picker :slots="nationList" :visible-item-count="5" :show-toolbar="true" ref="natitonPicker" value-key="className">
            <div @click="handleConfirm" class="sure">确认</div>
          </mt-picker>
        </mt-popup>

        <mt-popup v-model="nationVisible2" position="bottom" class="mint-popup">
          <mt-picker :slots="nationList2" :visible-item-count="5" :show-toolbar="true" ref="natitonPicker2" value-key="className">
            <div @click="handleConfirm2" class="sure">确认</div>
          </mt-picker>
        </mt-popup>

        <mt-popup v-model="nationVisible3" position="bottom" class="mint-popup">
          <mt-picker :slots="nationList3" :visible-item-count="5" :show-toolbar="true" ref="natitonPicker3" value-key="name">
            <div @click="handleConfirm3" class="sure">确认</div>
          </mt-picker>
        </mt-popup>
      </div>

      <footer class="flexable empty-footer">
        <div class="left-btn flexable" @click="handleNext">下一步</div>
        <div class="left-btn flexable" @click="emptyClickCheck" v-if="emptyShow && emptyTalentSwitch==1">已添加特殊考勤人员{{emptyNumber}}人</div>
      </footer>

      <DwbVueDrawer :visible.sync="visible" :position="position" :lockScroll="lockScroll" :maskClosable="maskClosable" :zIndex="zIndex" :maskStyle="maskStyle" :containerStyle="containerStyle" @open="open" @close="close">
        <img src="../../assets/img/list@3x.png" alt="菜单" class="menuInner" @click="visible = false" style="width: 2.03rem;height: 2.95rem;position: absolute;top:50%;z-index:999;">
        <ul class="ulBox" v-show="schedulingSettingVos && schedulingSettingVos.length>1">
          <li class="title-d">菜单</li>
          <li @click="goAnchor('#anchor'+item.industry,item.industry)" :class="{selected : isSelected== item.industry}" v-for="(item,index) in schedulingSettingVos" v-if="item.schedulingEmployees">{{item.industryName}}</li>
        </ul>
      </DwbVueDrawer>
      <img src="../../assets/img/list@3x.png" v-if="show" alt="菜单" class="menuOuter" @click="openDrawer" v-show="isMenu">
    </div>
    <!--确认第二步-->
    <div class="total-confirm" v-show="step==2">
      <mt-header title="统计工作量-总量" style="font-size: 0.9rem">
        <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
      </mt-header>

      <div class="total-time">总工时：{{Number.parseFloat(totalTime / 1000 / 3600)}}小时</div>

      <div class="form-panel">
        <mt-field label="计件" type="number" placeholder="请输入" v-model="pieces.jian" @blur.native="checkNum"></mt-field>
        <mt-field label="计袋" type="number" placeholder="请输入" v-model="pieces.dai" @blur.native="checkNum"></mt-field>
        <mt-field label="计车" type="number" placeholder="请输入" v-model="pieces.che" @blur.native="checkNum"></mt-field>
        <mt-field label="计吨" type="number" placeholder="请输入" class="last-field" v-model="pieces.dun"></mt-field>
      </div>

      <p class="tip">根据实际情况如实填写，无计件量时可不填</p>

      <div class="page-bottom">
        <div class="bottom-btn" @click="handleSubmit">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
class PunchListItem {
  constructor({ talentName, talentId, schedulingId }) {
    this.talentName = talentName
    this.talentId = talentId
    this.schedulingId = schedulingId
    this.customerEndDate = ''
    this.customerEndTime = ''
    this.customerEndWorkType = '1'
    this.customerStartDate = ''
    this.customerStartTime = ''
  }
}
import '@/views/attendence/css/cusconfirm.scss'
import { DwbVueDrawer } from 'dwb-vue-drawer'
import Util from '../../common/util.js'
export default {
  name: "",
  components: { DwbVueDrawer },
  data() {
    return {
      step: 1,
      emptyTalentSwitch: '',
      allCount: 0,
      pieces: {
        jian: '',
        dai: '',
        che: '',
        dun: '',
      },
      status: '',
      emptyShow: false,
      emptyNumber: '',
      conNorNumber: '',
      datapush: '',
      total: '',
      totalTime: 0,
      unitValue: '1',
      unit: '件',
      visible: false,
      show: true,
      isMenu: false,
      position: 'right',
      lockScroll: true,
      maskClosable: true,
      zIndex: 200,
      maskStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      },
      containerStyle: {
        background: '#fff',
      },
      isSelected: '',
      schedulingSettingVos: [],
      selectIndex: '',
      nationVisible: false,
      nationVisible2: false,
      nationVisible3: false,
      nationList: [
        {
          flex: 1,
          values: [
          ],
          className: "slot4",
          textAlign: "center"
        },
        {
          divider: true,
          content: '-',
          className: 'slot5'
        },
        {
          flex: 1,
          values: [
          ],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: '-',
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
      nationList3: [
        {
          flex: 1,
          values: [
            {
              name: '件',
              value: '1'
            },
            {
              name: '吨',
              value: '2'
            }
          ],
          className: "slot1",
          textAlign: "center"
        },

      ],
      nationList2: [
        {
          flex: 1,
          values: [

          ],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: '',
          className: 'slot2'
        },
        {
          flex: 1,
          values: [
          ],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: '-',
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
      value: '',
      handler: function (e) {
        e.preventDefault()
      },
      selectIndex1: '',
      selectIndex3: '',
      selectIndex2: '',
    }
  },
  watch: {
    nationVisible3: function (val, oldval) {
      if (val) {
        this.closeTouch()
      } else {
        this.openTouch()
      }
    },
    nationVisible2: function (val, oldval) {
      if (val) {
        this.closeTouch()
      } else {
        this.openTouch()
      }
    },
    nationVisible: function (val, oldval) {
      if (val) {
        this.closeTouch()
      } else {
        this.openTouch()
      }
    },
    'schedulingSettingVos': {
      handler: function (val, oldVal) {
        if (val) {
          for (let i in val) {
            for (let j in val[i].schedulingEmployees) {
              (val[i].schedulingEmployees)[j].isShow = false
            }
          }
          let count = 0
          for (let i in val) {
            if (val[i].schedulingEmployees) {
              count++
            }
          }
          if (count > 1) {
            this.isMenu = true
          } else {
            this.isMenu = false
          }
        }
      },
      deep: true
    },
  },
  filters: {
    formatTimeString(val) {
      if (val) {
        return val.substring(0, 5)
      }
    },
    formatendWorkType(val) {
      return val == 2 ? '次日' : '当日'
    },
    formatPieceSize(val) {
      if (val) {
        if (Util.formatPieceSize(val) == '') {
          return '无'
        } else {
          return Util.formatPieceSize(val)
        }
      } else {
        return '无'
      }

    },
  },
  methods: {
    getParam() {
          this.emptyTalentSwitch = this.$route.query.emptyTalentSwitch
     },
    checkNum() {
      // if (!this.pieces.jian || !this.pieces.dai || !this.pieces.che) {
      //   this.$toast("计件量不能为空");
      //   return false;
      // } else {
      //   let reg = new RegExp(/^[0-9]+$/)
      //   if (!reg.test(this.pieces.jian) || !reg.test(this.pieces.dai) || !reg.test(this.pieces.che)) {
      //     this.$toast('请输入正确的计件量')
      //     return false;
      //   }
      // }
      let reg = new RegExp(/^[0-9]+$/)
      if (!reg.test(this.pieces.jian) || !reg.test(this.pieces.dai) || !reg.test(this.pieces.che)) {
        this.$toast('请输入正确的计件量')
        return false;
      }
    },
    checkDun() {
      if (this.pieces.dun) {
        let reg = new RegExp(/^\d{1,3}(?:\.\d{1,4})?$/)
        if (!reg.test(this.pieces.dun)) {
          return false
        } else {
          return true
        }
      } else {
        return true;
      }
    },
    closeTouch() {
      document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, { passive: false })//阻止默认事件
    },
    openTouch() {
      document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, { passive: false })//打开默认事件
    },
    open() {
      console.log('open callback')
    },
    close() {
      console.log('close callback')
      this.show = true
    },
    openDrawer() {
      let left = document.getElementsByClassName('ulBox')[0].offsetWidth
      let img = document.getElementsByClassName("menuInner")[0]
      img.style.right = `${left - 1}px`
      this.visible = true
      this.show = false
    },
    goAnchor(selector, index) {
      this.isSelected = index
      var anchor = this.$el.querySelector(selector)
      document.body.scrollTop = anchor.offsetTop - 40; // chrome
      document.documentElement.scrollTop = anchor.offsetTop - 40; // firefox
    },
    // 切换 “删除”和“恢复”状态
    toggleDeleteStatus(index1, index2) {
      let targetStatus = !this.schedulingSettingVos[index1].schedulingEmployees[index2].deleteStatus
      this.$set(this.schedulingSettingVos[index1].schedulingEmployees[index2], 'deleteStatus', targetStatus)
    },
    emptyClickCheck() {
      this.$router.push({ name: 'emptyShow', query: { id: this.$route.query.id, status: this.datapush.status }, query: { fromconfirm: true } })
    },
    handleBack() {
      this.step = 1
    },
    handleNext() {
      let valid1 = true
      let valid2 = true
      let valid3 = true

      if (Number(this.conNorNumber) + Number(this.emptyNumber) < 1) {
        this.$toast('不能提交空的确认表')
        return false
      }
      // 统计计件量总数
      let noInitTotal = !(this.pieces.jian || this.pieces.dai || this.pieces.che || this.pieces.dun)
      let tip = ''
      let totalTime = 0

      this.schedulingSettingVos.forEach((item, index) => {
        item.schedulingEmployees && item.schedulingEmployees.forEach(subitem => {
          subitem.schedulingPunchList && subitem.schedulingPunchList.forEach(punchitem => {
            if (punchitem.totalPieceSize) {
              if (noInitTotal) {
                this.pieces.jian = Number(this.pieces.jian) + Number(punchitem.totalPieceSize.jian)
                this.pieces.dai = Number(this.pieces.dai) + Number(punchitem.totalPieceSize.dai)
                this.pieces.che = Number(this.pieces.che) + Number(punchitem.totalPieceSize.che)
                this.pieces.dun = Number(this.pieces.dun) + Number(punchitem.totalPieceSize.dun)
              }
            }

            if (punchitem.customerWorkEndDateTime && punchitem.customerWorkStartDateTime) {
              let startString = punchitem.customerWorkStartDateTime.replace(new RegExp(/-/gm), "/")
              let endString = punchitem.customerWorkEndDateTime.replace(new RegExp(/-/gm), "/")
              let startTime = new Date(startString).getTime()
              let endTime = new Date(endString).getTime()

              totalTime = totalTime + (endTime - startTime)
              let spanHours = (endTime - startTime) / (3600 * 1000)
              if (spanHours < punchitem.customerWorkHours) {
                tip += `${subitem.talentName}(${item.industryName}),`
              }
            }
          })
        })
      })

      let lists = []
      for (let x in this.schedulingSettingVos) {
        // for (let j in this.schedulingSettingVos[x].schedulingEmployees) {
        //   if ((this.schedulingSettingVos[x].schedulingEmployees)[j].talentType == 2) {  // talentType = 2 表示为空挂
        //     let spliceItem = (this.schedulingSettingVos[x].schedulingEmployees).splice(j, 1)
        //   }
        // }

        lists[x] = {}
        if (this.schedulingSettingVos[x].schedulingEmployees) {
          for (let y in this.schedulingSettingVos[x].schedulingEmployees) {
            if (y == 0) {
              lists[x].schedulingEmployees = []
              lists[x].schedulingEmployees.push({})
            } else {
              lists[x].schedulingEmployees.push({})
            }
            if (this.schedulingSettingVos[x].schedulingEmployees[y] && !this.schedulingSettingVos[x].schedulingEmployees[y].deleteStatus) {
              let value = this.schedulingSettingVos[x].schedulingEmployees[y]
              let schedulingPunchList = []
              for (let z in value.schedulingPunchList) {
                if (!value.schedulingPunchList[z].customerWorkStartDateTime) {
                  valid1 = false
                  this.$toast(`${value.talentName}上班时间不能为空`)
                  return
                } else if (!value.schedulingPunchList[z].customerWorkEndDateTime) {
                  valid2 = false
                  this.$toast(`${value.talentName}下班时间不能为空`)
                  return
                } else {
                  if (value.schedulingPunchList[z].customerWorkStartDateTime > value.schedulingPunchList[z].customerWorkEndDateTime) {
                    this.$toast(`${value.talentName}下班时间不能早于上班时间`)
                    return
                  }
                  schedulingPunchList.push({
                    talentId: this.schedulingSettingVos[x].schedulingEmployees[y].talentId,
                    schedulingId: this.schedulingSettingVos[x].schedulingEmployees[y].schedulingId,
                    industry: this.schedulingSettingVos[x].industry,
                    id: value.schedulingPunchList[z].id,
                    customerStartDate: value.schedulingPunchList[z].customerStartDate,
                    customerEndDate: value.schedulingPunchList[z].customerEndDate,
                    customerStartTime: value.schedulingPunchList[z].customerStartTime,
                    customerEndTime: value.schedulingPunchList[z].customerEndTime
                  })
                  lists[x].schedulingEmployees[y] = {
                    id: this.schedulingSettingVos[x].schedulingEmployees[y].id,
                    deleteStatus: this.schedulingSettingVos[x].schedulingEmployees[y].deleteStatus,  // 零工是否从列表中删除
                    talentName: this.schedulingSettingVos[x].schedulingEmployees[y].talentName,
                    talentId: this.schedulingSettingVos[x].schedulingEmployees[y].talentId,
                    talentType: this.schedulingSettingVos[x].schedulingEmployees[y].talentType,
                    schedulingId: this.schedulingSettingVos[x].schedulingEmployees[y].schedulingId,
                    industry: this.schedulingSettingVos[x].industry,
                    schedulingPunchList: schedulingPunchList,
                    total: JSON.stringify(value.schedulingPunchList[z].pieceSize),
                  }
                }
              }
            }
          }
        }
      }
      if (valid2 && valid1) {
        // 过滤删除的
        lists.forEach((item, index) => {
          lists[index].schedulingEmployees = lists[index].schedulingEmployees && lists[index].schedulingEmployees.filter(subitem => {
            return (JSON.stringify(subitem) != '{}' && !subitem.deleteStatus)
          })
        })
      }
      this.lists = lists
      this.totalTime = totalTime
      if (tip.length > 0) {
        this.$messagebox({
          title: `提示`,
          message: `${tip}的工时小于其打卡工时，是否继续提交？`,
          showCancelButton: true,
          confirmButtonText: "继续提交",
          cancelButtonText: "暂不提交"
        }).then(action => {
          if (action == 'confirm') {     //确认的回调
            this.step = 2
          }
        }).catch(err => {
          if (err == 'cancel') {
          }
        })
      } else {
        this.step = 2
      }
    },
    handleSubmit() {
      this.checkNum()
      let validFunction = this.checkDun()
      if (!validFunction) {
        this.$toast('吨数必须小于1000，且精确到小数点后4位')
        return false
      }
      const params = {
        id: this.$route.query.id,
        total: JSON.stringify(this.pieces),
        schedulingSettings: this.lists
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api
        .saveCusConfirm(params)
        .then(response => {
          if (response.data.respCode == 0) {
            // this.$router.push({ name: 'customerReport', query: { id: this.$route.query.id, status: this.status } })
            this.$router.push({ name: 'sendcustomer', query: { id: this.$route.query.id } })
          }
          this.$indicator.close();
        })
        .catch(error => {
          console.log(error);
          this.$indicator.close();
        });
    },
    handleConfirm() {
      this.nationVisible = false
      let result = this.$refs.natitonPicker.getValues()[0] + " " + this.$refs.natitonPicker.getValues()[1] + ':' + this.$refs.natitonPicker.getValues()[2]
      let compare = this.schedulingSettingVos[this.selectIndex1].schedulingEmployees[this.selectIndex2].schedulingPunchList[this.selectIndex3].customerWorkEndDateTime
      if (result && compare && result > compare) {
        this.$toast('上班时间不可晚于下班时间')
        return
      }
      this.schedulingSettingVos[this.selectIndex1].schedulingEmployees[this.selectIndex2].schedulingPunchList[this.selectIndex3].customerWorkStartDateTime = this.$refs.natitonPicker.getValues()[0] + " " + this.$refs.natitonPicker.getValues()[1] + ':' + this.$refs.natitonPicker.getValues()[2]
      this.schedulingSettingVos[this.selectIndex1].schedulingEmployees[this.selectIndex2].schedulingPunchList[this.selectIndex3].customerStartDate = this.$refs.natitonPicker.getValues()[0]
      this.schedulingSettingVos[this.selectIndex1].schedulingEmployees[this.selectIndex2].schedulingPunchList[this.selectIndex3].customerStartTime = this.$refs.natitonPicker.getValues()[1] + ':' + this.$refs.natitonPicker.getValues()[2] + ':' + '00'
    },
    handleConfirm2() {
      this.nationVisible2 = false
      let result = this.$refs.natitonPicker2.getValues()[0] + ' ' + this.$refs.natitonPicker2.getValues()[1] + ':' + this.$refs.natitonPicker2.getValues()[2]
      let compare = this.schedulingSettingVos[this.selectIndex1].schedulingEmployees[this.selectIndex2].schedulingPunchList[this.selectIndex3].customerWorkStartDateTime
      if (result && compare && result < compare) {
        this.$toast('下班时间不可早于上班时间')
        return
      }
      this.schedulingSettingVos[this.selectIndex1].schedulingEmployees[this.selectIndex2].schedulingPunchList[this.selectIndex3].customerWorkEndDateTime = this.$refs.natitonPicker2.getValues()[0] + ' ' + this.$refs.natitonPicker2.getValues()[1] + ':' + this.$refs.natitonPicker2.getValues()[2]
      this.schedulingSettingVos[this.selectIndex1].schedulingEmployees[this.selectIndex2].schedulingPunchList[this.selectIndex3].customerEndTime = this.$refs.natitonPicker2.getValues()[1] + ':' + this.$refs.natitonPicker2.getValues()[2] + ':' + '00'
      this.schedulingSettingVos[this.selectIndex1].schedulingEmployees[this.selectIndex2].schedulingPunchList[this.selectIndex3].customerEndDate = this.$refs.natitonPicker2.getValues()[0]
    },
    handleConfirm3() {
      this.unit = this.$refs.natitonPicker3.getValues()[0].name
      this.unitValue = this.$refs.natitonPicker3.getValues()[0].value
      this.nationVisible3 = false
    },
    addDate(date, days) {
      var d = new Date(date);
      d.setDate(d.getDate() + days);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var val = d.getFullYear() + "-" + month + "-" + day;
      return val;
    },
    getList() {
      const params = {
        id: this.$route.query.id,
      };
      this.$api
        .cusConfirmList(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.managerId = response.data.data.managerId
            this.pieces = response.data.data.total ? JSON.parse(response.data.data.total) : { jian: 0, dai: 0, che: 0, dun: 0 }
            this.emptyNumber = response.data.data.emptyNumber
            this.conNorNumber = response.data.data.canSubmitCustomerConfirmNormalCount
            this.datapush = response.data.data
            this.schedulingSettingVos = response.data.data.schedulingSettingVos
            this.status = response.data.data.status
            let schedulingDate = response.data.data.schedulingDate
            this.nationList[0].values.push(schedulingDate, this.addDate(schedulingDate, 1))  // 初始化时间选择的日期项
            this.nationList2[0].values.push(schedulingDate, this.addDate(schedulingDate, 1))

            if (this.schedulingSettingVos) {
              this.isSelected = this.schedulingSettingVos[0].industry
            }

            for (let x in this.schedulingSettingVos) {
              if (this.schedulingSettingVos[x].schedulingEmployees) {
                for (let y in this.schedulingSettingVos[x].schedulingEmployees) {
                  let card = this.schedulingSettingVos[x].schedulingEmployees[y].schedulingPunchList && this.schedulingSettingVos[x].schedulingEmployees[y].schedulingPunchList[0]
                  if (card) {
                    this.schedulingSettingVos[x].schedulingEmployees[y].workStartTime = card.workStartTime && card.workStartTime.substring(0, 5)
                    let typeShow = card.customerEndWorkType == 1 ? '' : '次日'
                    this.schedulingSettingVos[x].schedulingEmployees[y].workEndTimeShow = typeShow + (card.workEndTime && card.workEndTime.substring(0, 5))
                    this.schedulingSettingVos[x].schedulingEmployees[y].workEndTime = card.workEndTime && card.workEndTime.substring(0, 5)
                    this.schedulingSettingVos[x].schedulingEmployees[y].customerEndWorkType = card.customerEndWorkType
                  }
                  else {
                    this.schedulingSettingVos[x].schedulingEmployees[y].schedulingPunchList = []
                    let punchListItem = new PunchListItem(this.schedulingSettingVos[x].schedulingEmployees[y])
                    this.schedulingSettingVos[x].schedulingEmployees[y].schedulingPunchList.push(punchListItem)
                  }
                }
              }
            }

            // 判断删除按钮是否显示
            this.schedulingSettingVos.forEach((item, index) => {
              item.schedulingEmployees && item.schedulingEmployees.forEach((subitem, subindex) => {
                this.schedulingSettingVos[index].schedulingEmployees[subindex].showBtn = subitem.schedulingPunchList.some(subsubitem => {
                  return !subsubitem.customerEndTime || !subsubitem.customerStartTime
                })
              })
            })

            this.getServeCustomer()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 空挂相关
    getServeCustomer() {
      const params = {
        managerId: this.managerId
      }
      this.$api
        .getServeCustomer(params)
        .then(response => {
          if (response.data.respCode == 0) {
            if (!response.data.data) {
              this.emptyShow = false
            } else {
              this.emptyShow = true
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handlePicker(index1, index2, index3) {
      this.selectIndex1 = index1;
      this.selectIndex2 = index2;
      this.selectIndex3 = index3;
      this.nationVisible = true
    },
    handlePicker2(index1, index2, index3) {
      this.selectIndex1 = index1;
      this.selectIndex2 = index2;
      this.selectIndex3 = index3;
      this.nationVisible2 = true
    },
    handlePicker3(index1, index2) {
      this.nationVisible3 = true
    }
  },
  mounted() {
    for (let i = 0; i <= 23; i++) {
      let data = i < 10 ? `0${i}` : i.toString()
      this.nationList[2].values.push(data)
      this.nationList2[2].values.push(data)
    }
    this.getParam()
    this.getList()

    if (this.$route.query.step) {
      this.step = this.$route.query.step
    }
  }
}
</script>
