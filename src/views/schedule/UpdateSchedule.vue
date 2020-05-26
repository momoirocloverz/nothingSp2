<template>
  <div class="page-wrapper">
    <div v-show="!showSelect" class="update-schedule">
      <mt-header title="修改排班" class="page-header">
        <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
      </mt-header>
      <div class="update-head">
        <mt-cell title="所属班务" :value="scheduleName"></mt-cell>
        <mt-cell title="所需人数" :value="`${authorizedNumber}人`"></mt-cell>
        <mt-cell title="排班日期" is-link :value="scheduleDate" @click.native="handleChangeDate"></mt-cell>
      </div>
      <div class="industry-list">
        <div class="industry-item" v-for="(industryItem, industryIndex) in scheduleList">
          <div class="industry-name">
            <span class="name">{{industryItem.industryName}}</span>
            <span class="amount">{{industryItem.schedulingEmployees ? industryItem.schedulingEmployees.length : 0}}人</span>
            <span class="able-btn" :class="{active: industryItem.inable}" @click="handleInable(industryItem)">启用</span>
            <span class="able-btn" :class="{active: !industryItem.inable}" @click="handleDisable(industryItem)">不启用</span>
          </div>
          <div class="industry-detail" v-show="industryItem.inable">
            <mt-cell class="detail-time" title="上班时间" is-link @click.native="handleChangeStartTime(industryItem)">
              <span>{{industryItem.workStartTime | timeFilter}}</span>
            </mt-cell>
            <mt-cell class="detail-time" title="下班时间" is-link @click.native="handleChangeEndTime(industryItem)">
              <span>
                <template v-if="industryItem.workEndTime">
                  {{industryItem.endWorkType | endWorkTypeFilter}} {{industryItem.workEndTime | timeFilter}}
                </template>
                <template v-if="!industryItem.workEndTime">
                  {{industryItem.workEndTime | timeFilter}}
                </template>
              </span>
            </mt-cell>

            <div class="staff-list">
              <p class="staff-title">安排零工<span class="delete-icon" :class="{active: industryItem.empSet.size !=0}" @click="handleDelete(industryItem)"></span><span class="edit-icon" @click="handleEditStaff(industryItem)">编辑零工</span></p>
              <template v-if="industryItem.schedulingEmployees">
                <span class="staff-item" v-for="(empItem, empIndex) in industryItem.schedulingEmployees" @click="toggleEmp(industryItem, empItem)" :class="{'active': empItem.active}">
                  {{empIndex + 1}} {{empItem.talentName}}
                </span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="page-bottom">
        <div class="bottom-btn" @click="handleSubmit">提交</div>
      </div>

      <mt-datetime-picker ref="datePicker" :startDate="new Date()" :endDate="taskEndDate" @confirm="handleDateChange" type="date" year-format="{value}年" month-format="{value}月" date-format="{value}日"></mt-datetime-picker>

      <mt-popup v-model="startVisible" position="bottom" class="mint-popup">
        <mt-picker :slots="workStartList" :visible-item-count="5" ref="workStartPicker" :show-toolbar="true" value-key="className">
          <div @click="workStartConfirm" class="sure">确认</div>
        </mt-picker>
      </mt-popup>

      <mt-popup v-model="endVisible" position="bottom" class="mint-popup">
        <mt-picker :slots="workEndList" :visible-item-count="5" ref="workEndPicker" :show-toolbar="true" value-key="className">
          <div @click="workEndConfirm" class="sure">确认</div>
        </mt-picker>
      </mt-popup>
    </div>

    <worker-select v-if="showSelect" :propObj="propObj" @back="handleComponentsBack" @empModify="handleModify"></worker-select>
  </div>
</template>

<script>
import WorkerSelect from '@/views/schedule/components/WorkerSelect.vue'
export default {
  name: 'UpdateSchedule',
  components: {
    WorkerSelect
  },
  data() {
    return {
      taskId: 0,
      scheduleId: 0,
      scheduleName: '',  // 排班名称
      authorizedNumber: 0,  // 核定人数
      scheduleList: [],
      talentList:[],
      scheduleDate: '请选择',
      currentIndustryobj: {}, // 当前要修改的工种对象
      nowIndustry: {},
      currentIndustry: '', // 当前选择的工种名称
      currentIndex: 0, // 当前选择的要修改的工种
      scheduleManagerId: 0,
      customerId:'',
      foreman: '',
      foremanName: '',
      timeVisible: false,  // 排班日期选择控件
      startVisible: false,  // 上班时间选择控件
      endVisible: false,  // 下班时间选择控件
      showSelect: false,  // 是否展示选人组件
      mapIndustry: null, // 存储工种初始排班人员
      mapSelect: null, // 存储选中的零工
      currentSelect: [],
      taskEndDate: new Date(),
      propObj: {  // 传给子组件的属性
        authorizedNumber: 0,
        sexLimit: '0',
        managerId: '',
        currentIndustry: '',
        customerId:'',
      },
      workEndList: [
        {
          flex: 1,
          values: [
            '当日', '次日'
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
          content: ':',
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
      workStartList: [
        {
          flex: 1,
          values: [
          ],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: ':',
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
    };
  },

  computed: {
    // 排班日期是否可修改
    dateEditable() {
      this.scheduleList.forEach(industryItem => {
        industryItem.schedulingEmployees && industryItem.schedulingEmployees.forEach(empItem => {
          if (empItem.workHours > 0) {
            return false
          }
        })
      })
      return true
    }
  },

  filters: {
    endWorkTypeFilter(val) {
      let result = '当日'
      if (val) {
        if (val == 1) {
          result = '当日'
        } else if (val == 2) {
          result = '次日'
        }
      } else {
        result = '当日'
      }

      return result
    },
    timeFilter(val) {
      let result = ''
      if (val) {
        result = val.substring(0, 5)
      } else {
        result = '请选择'
      }

      return result
    }
  },

  mounted() {
    this.initPicker()
    this.getParam()
    this.getDetail();
  },
  methods: {
    initPicker() {
      for (let i = 0; i <= 23; i++) {
        let data = i < 10 ? `0${i}` : i.toString()
        this.workStartList[0].values.push(data)
        this.workEndList[2].values.push(data)
      }
    },
    getParam() {
      this.scheduleId = this.$route.query.id
    },
    // 排班详情
    getDetail() {
      const params = {
        id: this.scheduleId,
      };
      this.$api.MScheduleDetail(params).then(response => {
          if (response.data.respCode == 0) {
            // data.status 排班状态 (1未结束  2已取消  3已结束)
            let data = response.data.data
            this.taskId = data.taskId
            this.scheduleName = data.schedulingName
            this.scheduleDate = data.schedulingDate
            this.authorizedNumber = data.authorizedNumber
            this.scheduleManagerId = data.managerId
            this.customerId = data.customerId
            this.foreman = data.foreman
            this.foremanName = data.foremanName
            this.scheduleList = data.schedulingSettingVos
            if (!data.taskEndTime) {
              let now = Date.now()
              data.taskEndTime = new Date(now + 3600 * 1000 * 24 * 365 * 10)
            } else {
              data.taskEndTime = data.taskEndTime.replace(new RegExp(/-/gm), "/")
            }
            this.taskEndDate = new Date(`${data.taskEndTime}`)
            this.scheduleList.forEach(item => {
              item.inable = true
              item.editAble = true
              item.initEmployees = item.schedulingEmployees ? JSON.parse(JSON.stringify(item.schedulingEmployees)) : []
              item.addSchedulingEmployees = []
              item.delSchedulingEmployees = []
              item.empSet = new Set()
              if (!item.workStartTime) {
                item.inable = false
              }
              item.schedulingEmployees && item.schedulingEmployees.forEach(subItem => {
                if (subItem.workHours) {
                  item.editAble = false
                }
              })
            })
          }
        }).catch(error => {
          console.log(error);
        });
    },
    handleDelete(industryItem) {
      let tempmap = new Map()
      industryItem.schedulingEmployees && industryItem.schedulingEmployees.forEach((item, index) => {
        tempmap.set(item.talentId, item)
      })
      tempmap.forEach((val, key) => {
        if (industryItem.empSet.has(key) && val.workHours > 0) {
          this.$toast(`${val.talentName}已产生了考勤记录，不允许删除`)
        } else if (industryItem.empSet.has(key)) {
          tempmap.delete(key)
          industryItem.empSet.delete(key)
        }
      })

      industryItem.schedulingEmployees = [...tempmap.values()]
    },

    handleBack() {
      this.$router.go(-1)
    },

    handleComponentsBack() {
      this.showSelect = false
    },

    handleDisable(industryItem) {
      if (industryItem.schedulingEmployees && industryItem.schedulingEmployees.length) {
        this.$toast('请先删除本工种安排的零工')
      } else {
        industryItem.inable = false
        this.$forceUpdate()
      }
    },

    handleInable(industryItem) {
      industryItem.inable = true
      this.$forceUpdate()
    },

    toggleEmp(industryItem, empItem) {
      if (industryItem.empSet.has(empItem.talentId)) {
        industryItem.empSet.delete(empItem.talentId)
        empItem.active = false
      } else {
        industryItem.empSet.add(empItem.talentId)
        empItem.active = true
      }
      this.$forceUpdate()
    },

    handleChangeDate() {
      if (this.dateEditable) {
        this.$refs.datePicker.open()
      }
    },
    handleDateChange(val) {
      let year = val.getFullYear()
      let month = val.getMonth()
      month = month + 1
      month = String(month)
      month = month.padStart(2, '0')
      let date = val.getDate()
      date = String(date)
      date = date.padStart(2, '0')
      this.scheduleDate = `${year}-${month}-${date}`
    },

    handleChangeStartTime(item) {
      this.currentTarget = item
      if (item.editAble) {
        this.startVisible = true
      }
    },

    handleChangeEndTime(item) {
      this.currentTarget = item
      if (item.editAble) {
        this.endVisible = true
      }
    },

    workStartConfirm() {
      this.startVisible = false
      let result = this.$refs.workStartPicker.getValues()
      let hour = result[0]
      let minute = result[1]
      if (this.currentTarget.endWorkType == 1 && (`${hour}:${minute}` > this.currentTarget.workEndTime)) {
        this.$toast('下班时间不能早于上班时间')
        return
      }
      this.currentTarget.workStartTime = `${hour}:${minute}`
    },

    workEndConfirm() {
      this.endVisible = false
      let result = this.$refs.workEndPicker.getValues()
      let type = result[0]
      let hour = result[1]
      let minute = result[2]

      if (type == '当日' && (`${hour}:${minute}` < this.currentTarget.workStartTime)) {
        this.$toast('下班时间不能早于上班时间')
        return
      }
      this.currentTarget.endWorkType = type == '当日' ? 1 : 2
      this.currentTarget.workEndTime = `${hour}:${minute}`
    },

    handleEditStaff(item) {
      this.propObj = {
        authorizedNumber: this.authorizedNumber,
        sexLimit: '0',
        managerId: this.scheduleManagerId,
        currentIndustry: item.industryName,
        list: item.schedulingEmployees,
        customerId:this.customerId,
      }
      this.currentIndustry = item.industryName
      this.nowIndustry = item

      this.showSelect = true
    },

    handleToggle(item) {
      let has = this.mapSelect.get(this.currentIndustry).get(item.id)
      if (item.checked) {
        if (has && has.workHours) {
          this.$toast('该零工已产生了考勤记录，不允许删除')
          return
        }
      }
      if (has) {
        this.mapSelect.get(this.currentIndustry).delete(item.id)
        this.convertTOArray()
      } else {
        let settlementType = 1
        if (item.empSettlementType == '周结') {
          settlementType = 4
        } else if (item.empSettlementType == '月结') {
          settlementType = 2
        } else if (item.empSettlementType == '日结') {
          settlementType = 1
        }
        let tempitem = {
          name: item.realNameAlias,
          id: item.id,
          age: item.yearsOld,
          sex: item.sex,
          sexName: item.sexName,
          settlementType: settlementType,
          workHours: 0,
        }

        this.mapSelect.get(this.currentIndustry).set(item.id, tempitem)
        this.convertTOArray()
      }
    },

    handleModify(payload) {
      let list = []
      payload.forEach(item => {
        let listitem = {
          industry: this.nowIndustry.industry,
          ...item
        }

        list.push(listitem)
      })
      this.nowIndustry.schedulingEmployees = list
    },

    convertTOArray() {
      let industry = this.mapSelect.get(this.currentIndustry)
      let values = industry.values()
      this.currentSelect = []
      for (let value of values) {
        this.currentSelect.push(value)
      }
    },
    handleConfirm() {
      this.empselectVisible = false
    },
    handleSubmit() {
      let valid = true;
      this.scheduleList.forEach(item => {
        if (!item.inable) {
          item.workStartTime = ''
          item.workEndTime = ''
        } else {
          if (!item.workStartTime || !item.workEndTime || item.workStartTime == '请选择' || item.workEndTime == '请选择') {
            valid = false
            return this.$toast(`请填写${item.industryName}的上下班时间！`)
          } else {
            item.workStartTime = item.workStartTime.padEnd(8, ':00')
            item.workEndTime = item.workEndTime.padEnd(8, ':00')
          }
        }

        let initSet = new Set()
        let currentSet = new Set()

        item.schedulingEmployees && item.schedulingEmployees.forEach(subitem => {
          currentSet.add(subitem.talentId)
        })

        item.initEmployees && item.initEmployees.forEach(subitem => {
          initSet.add(subitem.talentId)
        })


        //删除的列表
        item.schedulingEmployees && item.schedulingEmployees.forEach(empitem => {
          if (!initSet.has(empitem.talentId)) {
            let temp = {
              id: empitem.id,
              industry: empitem.industry,
              settlementType: empitem.settlementType,
              sex: empitem.sex,
              talentId: empitem.talentId,
              talentName: empitem.talentName,
              talentType: empitem.talentType,
              managerId:this.scheduleManagerId,
            }
            item.addSchedulingEmployees.push(temp)
          }
        })

        item.initEmployees && item.initEmployees.forEach(empitem => {
          if (!currentSet.has(empitem.talentId)) {
            let temp = {
              id: empitem.id,
              industry: empitem.industry,
              settlementType: empitem.settlementType,
              sex: empitem.sex,
              talentId: empitem.talentId,
              talentName: empitem.talentName,
              talentType: empitem.talentType
            }
            item.delSchedulingEmployees.push(temp)
          }
        })

        //item.schedulingEmployees && delete item.schedulingEmployees
      })

      if (!valid) {
        return
      }

      let schedulingSet = JSON.parse(JSON.stringify(this.scheduleList))

      schedulingSet.forEach(item => {
        item.schedulingEmployees && delete item.schedulingEmployees
        item.initEmployees && delete item.initEmployees
        item.inable && delete item.inable
        item.editAble && delete item.editAble
      })
      let param = {
        managerId: this.scheduleManagerId,
        schedulingSettings: schedulingSet,
        foreman: this.foreman,
        foremanName: this.foremanName,
        id: this.scheduleId,
        schedulingDate: this.scheduleDate,
        taskId: this.taskId
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api.updateSchedule(param)
        .then(res => {
          if (res.data.respCode == 0) {
            this.$toast('提交成功')
            this.$router.go(-1)
          }
        })
        .catch(err => {
          console.log(err)
          this.$toast('提交失败')
        })
        .finally(() => {
          this.$indicator.close()
        })
    },
  },
}
</script>
<style lang="scss" scoped>
    .update-schedule {
      min-height: 100vh;
      background-color: #f5f5f5;
      padding-bottom: convertToVw(80);
      .page-header {
        font-size: convertToVw(17);
        height: convertToVw(44);
      }
      .update-head {
        border-top: 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;
        padding-left: convertToVw(14);
        margin-top: convertToVw(18);
        background-color: #fff;
      }
  .industry-list {
    padding-left: convertToVw(10);
    padding-right: convertToVw(10);
    border-top: 1px solid transparent;
  }
  .industry-item {
    margin-top: convertToVw(10);
    border-radius: convertToVw(5);
    border: 1px solid #d9d9d9;
    background-color: #fff;
  }

  .industry-name {
    padding: convertToVw(12) convertToVw(15);

    .name {
      font-size: convertToVw(16);
      margin-right: convertToVw(14);
    }

    .able-btn {
      float: right;
      margin-left: convertToVw(10);
      font-size: convertToVw(14);
      padding: convertToVw(2) convertToVw(8);
      border-radius: convertToVw(5);
      border: 1px solid #d9d9d9;

      &.active {
        color: #ea441a;
        border: 1px solid #ea441a;
      }
    }
  }

  .industry-detail {
    padding-left: convertToVw(15);
  }

  .staff-list {
    padding: convertToVw(12) convertToVw(15) convertToVw(12) 0;
  }

  .staff-item {
    margin-top: convertToVw(12);
    margin-right: convertToVw(12);
    display: inline-block;
    border: 1px solid #d9d9d9;
    border-radius: convertToVw(3);
    font-size: convertToVw(13);
    padding: convertToVw(2) convertToVw(7);
    color: #969799;

    &.active {
      color: #ea441a;
      border: 1px solid #ea441a;
    }
  }

  .staff-title {
    position: relative;
    font-size: convertToVw(15);

    .delete-icon {
      position: absolute;
      display: block;
      box-sizing: border-box;
      border-radius: 3px;
      border: 1px solid #969799;
      width: convertToVw(42);
      height: convertToVw(24);
        background-image:url(../../assets/img/icon_delete.png);
      background-position: center center;
      background-repeat: no-repeat;
      top: 0;
      right: convertToVw(90);

      &.active {
        border: 1px solid #ea441a;
        background-image: url(../../assets/img/icon_delete_active.png);
      }
    }

    .edit-icon {
      position: absolute;
      display: block;
      box-sizing: border-box;
      width: convertToVw(74);
      top: 0;
      right: 0;
      text-align: center;
      font-size: convertToVw(12);
      height: convertToVw(24);
      line-height: convertToVw(22);
      text-align: center;
      border-radius: convertToVw(3);
      color: #ea441a;
      border-radius: 3px;
      border: 1px solid;
    }
  }

  .emp-select {
    position: fixed;
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    top: 0;
    left: 0;
    z-index: 100;
    margin: 0;
    padding: 0;
    padding-bottom: convertToVw(134);
    background-color: #fff;

    .back-btn {
      position: absolute;
      top: convertToVw(5);
      left: convertToVw(5);
      background-color: transparent;
      border: none;
      box-shadow: none;
      color: #fff;
    }

    .tab-container {
      padding-top: convertToVw(5);
      background-color: #ea441a;
      padding-bottom: convertToVw(5);
    }

    .tab {
      width: convertToVw(112);
      height: convertToVw(34);
      border-radius: convertToVw(34);
      border: 1px solid #fff;
      display: flex;
      margin: auto;
      overflow: hidden;

      .tab-item {
        flex: 1;
        line-height: convertToVw(32);
        font-size: convertToVw(15);
        color: #fff;
        text-align: center;
        &.active {
          color: #ea441a;
          background-color: #fff;
        }
      }
    }
    .select-panel {
      padding-left: convertToVw(15);
      padding-right: convertToVw(15);
      height: 70vh;
      overflow: scroll;

      .select-item {
        position: relative;
        line-height: convertToVw(56);
        border-bottom: 1px solid #e5e5e5;
        padding-left: convertToVw(36);

        &::before {
          content: "";
          display: block;
          position: absolute;
          width: convertToVw(21);
          height: convertToVw(21);
          top: convertToVw(17);
          left: 0;
          background-image: url(../../assets/img/unselected2@3x.png);
          background-size: cover;
        }
        &.checked::before {
          background-image: url(../../assets/img/selected2@3x.png);
        }
        .name {
          font-size: convertToVw(15);
          color: #0d0d0d;
        }
        .tag {
          display: inline-block;
          box-sizing: border-box;
          width: convertToVw(42);
          height: convertToVw(26);
          background-color: #f5f5f5;
          border-radius: convertToVw(5);
          margin-left: convertToVw(10);
          vertical-align: middle;
          font-size: convertToVw(12);
          line-height: convertToVw(26);
          text-align: center;
          color: #636363;
        }
        .female {
          color: #ea441a;
        }
        .male {
          color: #3cca54;
        }
      }
    }
    .emp-list {
      box-sizing: border-box;
      position: absolute;
      width: 100%;
      height: convertToVw(134);
      overflow: scroll;
      bottom: 0;
      left: 0;
      padding-bottom: convertToVw(50);
      padding-left: convertToVw(15);
      padding-right: convertToVw(15);
      border-top: 1px solid #989898;

      .current-empitem {
        display: inline-block;
        margin-right: convertToVw(24);
        margin-top: convertToVw(15);
        padding-left: convertToVw(5);
        padding-right: convertToVw(5);
        height: convertToVw(28);
        font-size: convertToVw(12);
        line-height: convertToVw(28);
        text-align: center;
        position: relative;
        background-color: #d2d2d2;
        color: #0d0d0d;

        &::after {
          content: "";
          display: block;
          width: convertToVw(15);
          height: convertToVw(15);
          position: absolute;
          top: convertToVw(-5);
          right: convertToVw(-5);
          background-image: url(../../assets/img/delete@2x.png);
          background-size: cover;
        }
      }

      .operation {
        box-sizing: border-box;
        position: fixed;
        width: 100%;
        height: convertToVw(50);
        bottom: 0;
        left: 0;
        text-align: right;
        line-height: convertToVw(50);
        color: #636363;
        padding-right: convertToVw(76);
        background-color: #fff;

        .operation-btn {
          position: absolute;
          width: convertToVw(48);
          height: convertToVw(26);
          text-align: center;
          line-height: convertToVw(26);
          background-color: #ea441a;
          border-radius: convertToVw(26);
          color: #fff;
          right: convertToVw(15);
          bottom: convertToVw(13);
        }
      }
    }
  }
  .empty-tip {
    text-align: center;
    padding-top: convertToVw(100);
    color: #969799;
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
  .sure {
    padding: convertToVw(5) convertToVw(15);
    float: right;
  }
}
</style>
<style lang="scss">
    .update-schedule {
      .mint-cell {
          min-height: convertToVw(46);
          padding-right: convertToVw(14);
          border-bottom: 1px solid #d9d9d9;
          &:last-child {
              border-bottom: none !important;
              background-image: none !important;
          }
        }
      .mint-cell-wrapper {
        background-image: none;
      }
      .mint-cell-allow-right::after {
        right: convertToVw(14);
      }
      .mint-cell-text {
        margin-left: 0;
        color: #1e1f21;
      }
    }
</style>