<template xmlns="http://www.w3.org/1999/html">
  <div>
    <mt-header title="查看特殊考勤人员" fixed style="font-size:0.9rem;">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="container" style="background-color: #ffffff;height: 100%">
      <div class="total-label">共{{emptyNumber}}人</div>
      <div v-for="(item , index) in emptyList">
        <div class="card-title flexable" v-if="item.empCounts">
          <span class="markLine"></span>
          <span class="industry">{{item.industryName}}</span>
          <span class="industry-num" v-if="item.empCounts"> {{item.empCounts}}人</span>
        </div>
        <div class="card-list" v-for="empty in item.schedulingEmployees">
          <div class="card-header">
            <span class="card-name">{{empty.talentName}}</span>
            <span class="card-tag" v-if="empty.sexName=='男'">{{empty.sexName}}</span>
            <span class="card-tag" v-else style="color: #d6522d;">{{empty.sexName}}</span>
          </div>
          <div class="card-body flexable">
            <div class="body-item flexable">
              <div>
                <span class="select-label">上班时间:</span>
                <span class="select-div">{{empty.schedulingPunchList[0].workStartTime | formatTimeString}}
                </span>

              </div>
              <div>
                <span class="select-label">下班时间:</span>
                <span class="select-div">{{empty.schedulingPunchList[0].workEndDate == empty.schedulingPunchList[0].schedulingDate ? '当日' : '次日'}}{{empty.schedulingPunchList[0].workEndTime | formatTimeString}}</span>
              </div>
            </div>
            <!--<div class="body-item flexable">-->
            <!--<div>-->
            <!--<span class="select-label">计件量:</span>-->
            <!--<span class="select-div" >{{empty.customerPiece}}-->
            <!--</span>-->

            <!--</div>-->
            <!--</div>-->
          </div>
        </div>
      </div>

      <mt-popup v-model="nationVisible" position="bottom" class="mint-popup">
        <mt-picker :slots="nationList" @change="onNationChange" :visible-item-count="5" :show-toolbar="false" ref="natitonPicker" value-key="className"></mt-picker>
      </mt-popup>
      <!--<div class=" logDiv flexable">-->
      <!--<mt-button type="primary" class="logBtn2 " @click="RouteToEdit" v-if="$route.query.status==1">修改</mt-button>-->
      <!--</div>-->

    </div>
    <footer class="flexable empty-footer myfooter">
      <!--<div class="left-btn flexable" @click="RouteToEdit" v-if="changeShow && status != 2 ">修改</div>-->
      <div class="left-btn flexable" @click="RouteToEdit" v-if="changeShow && settleStatus==1">修改</div>
      <span class="ver-line" v-if="changeShow && status != 2"></span>
      <div class="left-btn flexable" @click="RouteToSche">返回排班</div>
    </footer>

  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      changeShow: '',
      emptyNumber: '',
      emptyList: [],
      selectIndex: '',
      items: [],
      status: 0,
      settleStatus: 1,
      nationVisible: false,
      nationList: [
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
      msg: "Hello Vue.js"
    }
  },
  watch: {

  },
  filters: {
    formatTimeString(val) {
      if (val) {
        return val.substring(0, 5)
      }
    }
  },
  methods: {
    RouteToSche() {
      let punchway = sessionStorage.getItem('checkinType')
      this.$router.push({ name: 'headman', query: { id: this.data.id, punchWay: punchway } })
    },
    RouteToEdit() {
      this.$router.push({ name: 'addEmpty', query: { id: this.data.id, managerId: this.data.managerId, customerId: this.data.customerId, schedulingDate: this.data.schedulingDate, num: this.data.authorizedNumber - this.data.normalNumber - this.data.emptyNumber } })
    },
    getList() {
      let params = {
        schedulingId: this.$route.query.id
      }
      this.$api
        .getScheEmpty(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
            this.data = response.data.data
            this.emptyNumber = response.data.data.emptyNumber
            this.emptyList = response.data.data.schedulingSettingVos
            this.settleStatus =  response.data.data.settleStatus
          }

        })
        .catch(error => {
          console.log(error);
        });
    },
    handleBack() {
      this.$router.go(-1)
    },
    handlePicker(index) {
      this.selectIndex = index;
      this.nationVisible = true
    },
    onNationChange(val, a) {
      this.items[this.selectIndex] && (this.items[this.selectIndex].startTime = (a[0] + ':' + a[1]));
    },
    handleDelete(index) {
      this.items.splice(index, 1)
    }
  },
  mounted() {
    this.status = this.$route.query.status
    console.log(this.$route.query)
    this.getList()
  },
  beforeRouteEnter(to, form, next) {
    next(vm => {
      let fromconfirm = (to.query.fromconfirm && to.query.fromconfirm.toString())
      if (form.name == 'cusConfirm' || fromconfirm == 'true') {
        vm.changeShow = false
      } else {
        vm.changeShow = true
      }
    })
  }
}
</script>

<style scoped>
.logDiv {
  justify-content: center;
  width: 100%;
}
.logBtn2 {
  width: 12.48rem;
  height: 2.03rem;
  border-radius: 1.01rem;
  font-size: 0.75rem;
  margin: 3.35rem 0 1.2rem;
}
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
.card-name {
  font-family: PingFang-SC-Medium;
  font-size: 0.9rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0rem;
  letter-spacing: 0.05rem;
  color: #0d0d0d;
  line-height: 2rem;
}
.card-tag {
  display: inline-block;
  font-size: 0.6rem;
  color: #3cca54;
  margin-left: 0.38rem;
  line-height: 2rem;
}
.card-delete {
  font-family: PingFang-SC-Regular;
  font-size: 0.75rem;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0.02rem;
  color: #e20000;
  float: right;
  line-height: 2rem;
}
.body-item {
  margin-right: 2.3rem;
}
.select-label {
  font-family: PingFang-SC-Medium;
  font-size: 0.65rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0.22rem;
  letter-spacing: 0.01rem;
  color: #0d0d0d;
  padding-right: 0.48rem;
  display: inline-block;
  min-width: 2.85rem;
}
.select-span {
  position: relative;
}
.select-div {
  width: 4.7rem;
  height: 1.45rem;
  background-color: #ffffff;
  border-radius: 0.73rem;
  /*border: solid 0.03rem #dcdcdc;*/
  text-align: center;
  font-size: 0.65rem;
  font-weight: normal;
  letter-spacing: 0.01rem;
  color: #636363;
}
.select-icon {
  width: 0.43rem;
  height: 0.25rem;
  position: absolute;
  top: 0.35rem;
  right: 0.45rem;
}
.card-list {
  padding: 0 1rem;
  border-bottom: solid 0.03rem #e5e5e5;
  padding-bottom: 0.3rem;
}
.body-item {
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 1.6rem;
}
.card-body {
  flex-wrap: wrap;
}
input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: #636363;
  /* placeholder字体大小  */
  font-size: 0.6rem;
  /* placeholder位置  */
  text-align: center;
}
.mint-popup {
  width: 100%;
}
.total-label {
  height: 1.57rem;
  font-family: PingFang-SC-Regular;
  font-size: 0.6rem;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0.01rem;
  color: #636363;
  padding: 0 1rem;
  background: #f5f5f5;
  line-height: 1.57rem;
}
.card-title {
  padding: 0 1rem;
  height: 2.38rem;
  line-height: 2.38rem;
  border-bottom: solid 0.03rem #e5e5e5;
  align-items: center;
}
.industry {
  font-family: PingFang-SC-Medium;
  font-size: 0.9rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0rem;
  letter-spacing: 0.05rem;
  color: #0d0d0d;
}
.industry-num {
  font-family: PingFang-SC-Medium;
  font-size: 0.75rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0rem;
  letter-spacing: 0.04rem;
  color: #636363;
}
.markLine {
  display: inline-block;
  height: 1.3rem;
  background-color: #e84518;
  width: 0.15rem;
  margin-left: -0.5rem;
  margin-right: 0.2rem;
}
</style>
