<template>
  <div class="worker-list">
    <mt-header fixed title="添加日结零工" class="page-title">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="industry-info">
      <mt-cell title="安排工种" :value="selectIndustry.industryName" is-link @click.native="showPicker"></mt-cell>
      <!--<mt-cell v-if="isModel" title="人员模式" :value="model" is-link @click.native="showPicker2"></mt-cell>-->
    </div>

    <div class="salary-info">
      <p class="salary">工种报酬<span class="salary-tag">{{salaryType}}</span></p>
      <p class="salary-male"><span class="salary-label">男工单价：</span>{{salaryMale}}</p>
      <p class="salary-female"><span class="salary-label">女工单价：</span>{{salaryFemale}}</p>
    </div>

    <div class="work-panel">
      <div class="panel-head"><span class="check-all" @click="handleSelectAll" :class="{active: selectAllTag}"></span>全选<span class="worker-total">总人数{{workerTotalCount}}人</span></div>
      <div class="panel-body">
        <div class="worker-item" v-for="(item,index) of workerList" :key="item.schedulingDailyApplyId">
          <span class="check-all" :class="{active: applyIdList.includes(item.schedulingDailyApplyId)}" @click="handleAdd(item, index)"></span>
          <span class="worker-name">{{item.talentName}}</span>
          <span class="worker-sex worker-tag" :class="item.sex == 1 ? 'worker-male' : 'worker-female'">{{item.sex == 1 ? '男' : '女'}}</span>
          <div class="tag-list" v-if="item.talentSkillList">
            <div class="list-container">
              <span class="worker-skill worker-tag" v-for="(subitem, subindex) of item.talentSkillList.split(',')" :key="subindex" v-if="subindex < 3">{{subitem}}</span>
            </div>
          </div>
          <span class="icon-delete" @click="handleDelete(item, index)"></span>
        </div>
      </div>
    </div>

    <div class="fixed-panel">
      <div class="panel-icon" @click="showSelect">
        <mt-badge class="panel-badge" size="small" color="#4b4d52">{{workerCount}}</mt-badge>
      </div>
      <div class="panel-btn" @click="handleSubmit">确认</div>
    </div>

    <mt-popup v-model="pickerVisible" position="bottom" class="mint-popup">
      <mt-picker :slots="industryList" :visible-item-count="5" :show-toolbar="true" ref="industryPicker" value-key="industryName">
        <div @click="handleConfirm" class="sure">确认</div>
      </mt-picker>
    </mt-popup>
    <mt-popup v-model="pickerVisible2" position="bottom" class="mint-popup">
      <mt-picker :slots="modelList" :visible-item-count="5" :show-toolbar="true" ref="modelPicker" value-key="model">
        <div @click="handleConfirm2" class="sure">确认</div>
      </mt-picker>
    </mt-popup>

    <mt-popup v-model="selectVisible" position="bottom" class="padding-bottom">
      <div class="select-panel">
        <div class="select-title">{{selectIndustry.industryName}} <span class="cancel-add" :class="{active: cancelIdList.length}" @click="handleRemoveSelect"></span></div>
        <div class="select-list">
          <template v-for="(item, index) of workerList">
            <div class="select-item" v-if="applyIdList.includes(item.schedulingDailyApplyId)" :class="{active: cancelIdList.includes(item.schedulingDailyApplyId)}" :key="item.schedulingDailyApplyId" @click="toggleCancel(item)">{{item.talentName}}</div>
          </template>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import priceFormat from '../../common/priceFormat.js'
export default {
  name: '',
  components: {},
  data() {
    return {
      workerList: [],
      applyIdList: [],
      cancelIdList: [],
      pickerVisible: false,
      pickerVisible2: false,
      selectVisible: false,
      selectVisible2: false,
      timer: null,
      websocket: null,
      salaryType: '',
      salaryMale: '',
      salaryFemale: '',
      model:'代发收入',//1外包 2代发收入
      isModel:false,//是否 排班里添加日结人员时再选择  3
      payType:'2', //1外包 2代发收入
      selectIndustry: {
        industry: '',
        industryName: '',
        salary: `""`
      },
      industryList: [{
        flex: 1,
        values: [],
        className: 'slot4',
        textAlign: 'center',
        defaultIndex: 0
      }],
      modelList: [{
        flex: 1,
        values: ['外包','代发收入'],
        className: 'slot4',
        textAlign: 'center',
        defaultIndex: 0
      }]
    };
  },

  computed: {
    workerCount() {
      return this.applyIdList.length
    },
    workerTotalCount() {
      return this.workerList.length
    },
    selectAllTag() {
      return (this.workerList.length == this.applyIdList.length && this.applyIdList.length != 0)
    }
  },

  mounted() {
    this.getWorkerList()
    this.getindustryList()
    this.connectWebSocket()
    this.getType();
  },
  beforeDestroy() {
    this.closeWebSocket()
  },
  watch: {
    selectIndustry: {
      handler(val, oldval) {
        let salaryObj = priceFormat(val.salary)
        this.salaryType = salaryObj.salaryType
        this.salaryMale = salaryObj.salaryMale
        this.salaryFemale = salaryObj.salaryFemale
      },
      deep: true,
      immediate: true
    },
    selectVisible: {
      handler(val, oldval) {
        if (val) {
          document.querySelector('.fixed-panel').style.zIndex = '3010'
        } else {
          document.querySelector('.fixed-panel').style.zIndex = '200'
        }
      }
    }
  },
  methods: {
    handleBack() {
      this.$router.go(-1)
    },
    connectWebSocket() {
      console.log("开始建立连接...");
      let _this = this
      let id = this.$route.query.id
      this.websocket = new WebSocket(`ws://${this.$baseURLWS}/biz/scheduling/websocket?schedulingId=${id}`);

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
      this.$indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$api.applyListManager(param)
        .then(res => {
          this.workerList = res.data.data || []
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.$indicator.close()
        })
    },
    getindustryList() {
      let id = this.$route.query.id
      const params = {
        schedulingId: id
      }
      this.$api.getNOrepeatIndustry(params)
        .then((response) => {
          if (response.data.respCode == 0) {
            this.industryList[0].values = response.data.data
            this.selectIndustry = this.industryList[0].values[0]
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    showPicker() {
      this.pickerVisible = true
    },
    showPicker2() {
      this.pickerVisible2 = true
    },
    showSelect() {
      this.selectVisible = true
    },
    handleConfirm() {
      this.selectIndustry = this.$refs.industryPicker.getValues()[0]
      this.pickerVisible = false
    },
    handleConfirm2() {
      this.model = this.$refs.modelPicker.getValues()[0]
      switch (this.model) {
        case '外包':
          this.payType = '1';
          break;
        case '代发收入':
          this.payType = '2';
          break;
        default:
          break
      }
      console.log(this.payType)
      this.pickerVisible2 = false
    },
    handleSelectAll() {
      if (this.selectAllTag) {
        this.applyIdList = []
      } else {
        this.workerList.forEach(item => {
          if (!this.applyIdList.includes(item.schedulingDailyApplyId)) {
            this.applyIdList.push(item.schedulingDailyApplyId)
          }
        })
      }
    },
    handleAdd(item, index) {
      let applyIdSet = new Set(this.applyIdList)
      if (applyIdSet.has(item.schedulingDailyApplyId)) {
        applyIdSet.delete(item.schedulingDailyApplyId)
      } else {
        applyIdSet.add(item.schedulingDailyApplyId)
      }

      this.applyIdList = Array.from(applyIdSet)
    },
    handleDelete(item, index) {
      this.$messagebox({
        title: `提示`,
        message: `确认删除日结零工 ${item.talentName}？`,
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      }).then(action => {
        if (action == 'confirm') {
          let param = {
            applyId: item.schedulingDailyApplyId
          }
          this.$indicator.open({
            spinnerType: 'fading-circle'
          })
          this.$api.delApply(param)
            .then(res => {
              if (res.data.respCode == 0) {
                this.$toast('删除成功！')
                this.workerList.splice(index, 1)
                let applyIdSet = new Set(this.applyIdList)
                if (applyIdSet.has(item.schedulingDailyApplyId)) {
                  applyIdSet.delete(item.schedulingDailyApplyId)
                }
                this.applyIdList = Array.from(applyIdSet)
              }
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => {
              this.$indicator.close()
            })
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    handleRemoveSelect() {
      // 差集
      let __this = this
      if (this.cancelIdList.length) {
        let cancelSet = new Set(__this.cancelIdList)
        let newList = __this.applyIdList.filter(item => {
          return !cancelSet.has(item)
        })
        this.cancelIdList = []
        __this.applyIdList = newList
      }
    },
    toggleCancel(item) {
      let cancelSet = new Set(this.cancelIdList)
      if (cancelSet.has(item.schedulingDailyApplyId)) {
        cancelSet.delete(item.schedulingDailyApplyId)
      } else {
        cancelSet.add(item.schedulingDailyApplyId)
      }

      this.cancelIdList = Array.from(cancelSet)
    },
    handleSubmit() {
      let params = {
        schedulingId: this.$route.query.id
      }
      this.$api.remainingNumber(params)
        .then(res => {
          let remainNumber = res.data.data
          if (remainNumber < this.applyIdList.length) {
            this.$messagebox({
              title: `提示`,
              message: `该排班剩余可添加<span style="color:#e84518">${remainNumber}</span>人，<br/>请重新添加`,
            })
          } else {
            this.submitAction()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getType(){
      let _this = this;
      let params = {schedulingId:this.$route.query.id};
      this.$api.getDailyPayType(params).then(res=>{
        if(res.data.respCode === 0){
          if(res.data.data == 3){
            _this.isModel = true;
          }
        }
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    },
    submitAction() {
      let param = {
        applyIdList: this.applyIdList,
        industry: this.selectIndustry.industry,
        schedulingId: this.$route.query.id,
        payType:this.payType,
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$api.addDailyEmpByCode(param)
        .then(res => {
          if (res.data.respCode == 0) {
            this.$toast('添加成功！')
            this.$router.go(-2)
          }
        })
        .catch(err => {
          console.log(err)
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
.worker-list {
  min-height: 100vh;
  padding-top: convertToVw(62);
  padding-bottom: convertToVw(50);
  background-color: #f5f5f5;
  .page-title {
    height: convertToVw(44);
    font-size: convertToVw(17);
    line-height: convertToVw(44);
    border-bottom: 1px solid #d9d9d9;
  }
  .industry-info {
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    padding-left: convertToVw(15);
    background-color: #fff;
    .mint-cell {
      padding-right: convertToVw(15);
    }
    .mint-cell-allow-right::after {
      right: convertToVw(15);
    }
    .mint-cell-text {
      font-size: convertToVw(16);
      color: #1e1f21;
    }
    .mint-cell-value {
      font-size: convertToVw(16);
      color: #6e7075;
    }
  }
  .salary-info {
    box-sizing: border-box;
    width: convertToVw(356);
    margin: convertToVw(14) auto;
    padding: convertToVw(16) convertToVw(15);
    border-radius: convertToVw(5);
    border: 1px solid #d9d9d9;
    background-color: #fff;
    .salary {
      font-size: convertToVw(15);
      color: #1e1f21;
      .salary-tag {
        display: inline-block;
        padding: convertToVw(3) convertToVw(10);
        font-size: convertToVw(13);
        line-height: 1;
        color: #15bc83;
        text-align: center;
        border: 1px solid;
        border-radius: 3px;
        margin-left: convertToVw(5);
      }
    }
    .salary-male,
    .salary-female {
      font-size: convertToVw(13);
      margin-top: convertToVw(10);
    }
    .salary-label {
      color: #6e7075;
    }
  }
  .work-panel {
    background-color: #fff;
    border-bottom: 1px solid #d9d9d9;
  }
  .panel-head {
    margin-top: convertToVw(20);
    height: convertToVw(46);
    line-height: convertToVw(46);
    padding-left: convertToVw(18);
    padding-right: convertToVw(15);
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    font-size: convertToVw(16);
    color: #1e1f21;
    .worker-total {
      font-size: convertToVw(13);
      color: #969799;
      float: right;
    }
  }
  .check-all {
    display: inline-block;
    width: convertToVw(24);
    height: convertToVw(24);
    margin-right: convertToVw(20);
    background-image: url(../../assets/img/check_hollow.png);
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    vertical-align: middle;
    &.active {
      background-image: url(../../assets/img/check_filled.png);
    }
  }
  .icon-delete {
    position: absolute;
    right: convertToVw(15);
    top: 50%;
    width: convertToVw(26);
    height: convertToVw(46);
    transform: translate(0, -50%);
    background-image: url(../../assets/img/icon_delete.png);
    //background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    vertical-align: middle;
  }
  .panel-body {
    padding-left: convertToVw(18);
  }
  .tag-list {
    display: none;
    padding-left: convertToVw(33);
    margin-top: convertToVw(5);
    .list-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
  }
  .worker-skill {
    color: #6e7075;
  }
  .worker-item {
    position: relative;
    padding-right: convertToVw(16);
    padding-top: convertToVw(12);
    padding-bottom: convertToVw(12);
    border-bottom: 1px solid #d9d9d9;
    overflow: hidden;
  }
  .worker-item:nth-last-of-type(1) {
    border-bottom: none;
  }
  .worker-name {
    display: inline-block;
    font-size: convertToVw(16);
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #1e1f21;
  }
  .worker-tag {
    box-sizing: border-box;
    display: inline-block;
    padding: 0 convertToVw(5);
    height: convertToVw(18);
    margin-left: convertToVw(10);
    line-height: convertToVw(16);
    font-size: convertToVw(13);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: convertToVw(2);
    border: 1px solid;
    vertical-align: middle;
  }
  .worker-male {
    //width: convertToVw(23);
    color: #3296fa;
  }
  .worker-female {
    //width: convertToVw(23);
    color: #fa3276;
  }
  .fixed-panel {
    position: fixed;
    width: 100%;
    height: convertToVw(46);
    left: 0;
    bottom: 0;
    background-color: #efefef;
    z-index: 200;
    .panel-icon {
      position: absolute;
      width: convertToVw(46);
      height: convertToVw(42);
      left: convertToVw(24);
      top: convertToVw(-5);
      background-image: url(../../assets/img/worker.png);
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      box-shadow: convertToVw(-3) convertToVw(3) convertToVw(10) #ffb7a4;
    }
    .panel-badge {
      position: absolute;
      top: convertToVw(3);
      min-width: convertToVw(10);
      right: 0;
      transform: translate(50%, 0);
      border: 1px solid #fff;
    }
    .panel-btn {
      position: absolute;
      font-size: convertToVw(16);
      width: convertToVw(114);
      height: convertToVw(46);
      top: 0;
      right: 0;
      line-height: convertToVw(46);
      text-align: center;
      color: #fff;
      background-color: #ea441a;
    }
  }
  .select-title {
    height: convertToVw(46);
    padding: convertToVw(0) convertToVw(16);
    font-size: convertToVw(16);
    line-height: convertToVw(46);
    color: #1e1f21;
    border-bottom: 1px solid #d9d9d9;

    .cancel-add {
      display: block;
      width: convertToVw(42);
      height: convertToVw(30);
      border: 1px solid #969799;
      background-image: url(../../assets/img/icon_delete.png);
      background-position: center center;
      background-repeat: no-repeat;
      float: right;
      margin-top: convertToVw(8);

      &.active {
        border: 1px solid #ea441a;
        background-image: url(../../assets/img/icon_delete_active.png);
      }
    }
  }
  .select-list {
    height: convertToVw(250);
    overflow: scroll;
    .select-item {
      display: inline-block;
      font-size: convertToVw(13);
      line-height: 1;
      color: #969799;
      border-radius: convertToVw(5);
      padding: convertToVw(3) convertToVw(5);
      border: 1px solid;
      margin-left: convertToVw(15);
      margin-top: convertToVw(12);
      cursor: pointer;
      &.active {
        color: #ea441a;
      }
    }
  }
  .sure {
    padding: convertToVw(5) convertToVw(15);
    float: right;
  }
  .padding-bottom {
    box-sizing: border-box;
    padding-bottom: convertToVw(50);
  }
}
</style>