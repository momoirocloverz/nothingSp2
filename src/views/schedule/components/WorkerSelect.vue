<template>
  <div class="workerSelectCon">
    <mt-header title="添加零工" class="page-header">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>
    <div class="tab-container">
      <div class="tab">
        <div class="tab-item" :class="{active: !isother}" @click="handleSearch(false)">{{propObj.currentIndustry}}</div>
        <div class="tab-item" :class="{active: isother}" @click="handleSearch(true)">其他</div>
      </div>
    </div>
    <div class="select-wrapper">
      <div class="select-all" :class="{active: allActive}" @click="handleSelectAll">全选<span>上限{{propObj.authorizedNumber}}人，{{propObj.sexLimit | sexLimitFilter}}</span></div>
      <div class="select-list">
        <div class="select-item " v-for="(item, index) in talentList" :class="{active: empMap.has(item.id),disabledSelect:item.grey == 0}" @click="handleToggle(item)">
          <span class="name">{{item.realNameAlias}}</span>
          <span class="tag" :class="item.sex==1 ? 'male' : 'female'">{{item.sexName}}</span>
          <span class="tag">{{item.yearsOld}}岁</span>
          <span class="tag" v-show="item.grey == 1">{{item.empSettlementType}}</span>
        </div>
        <p class="empty-tip" v-if="talentList.length == 0">暂无相关零工信息</p>
      </div>
    </div>
    <div class="emp-list">
      <div class="current-emplist">
        <span class="current-empitem" v-for="(item, index) in currentSelect" @click="handleDelete(item)">{{item.name}}</span>
      </div>
    </div>
    <div v-show="selectVisible" class="select-mask">
      <div class="select-panel">
        <div class="content-box">
          <div class="content-header">
            <span @click="handleRemove" class="delete" :class="{active: empIdSet.size != 0}"></span>
          </div>
          <div class="content-body">
            <div class="delete-item" @click="handleDeleteItem(item)" v-for="(item, index) of Array.from(this.empMap.values())">
              <span class="user-item" :class="{active: empIdSet.has(item.id)}">{{item.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-panel">
      <div class="panel-icon" @click="showSelect">
        <mt-badge class="panel-badge" size="small" color="#4b4d52">{{empMap.size}}</mt-badge>
      </div>
      <div class="panel-btn" @click="handleSubmit">确认</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WorkerSelect',
  props: {
    propObj: {
      type: Object,
      default() {
        return {
          authorizedNumber: 0,
          sexLimit: '0',
          managerId: '',
          currentIndustry: '',
          list: [],
          customerId:'',
        }
      }
    }
  },
  data() {
    return {
      isother: false,
      currentIndustry: '',
      currentSelect: [],
      talentList: [],
      empIdSet: new Set(),  // 选中的
      empMap: new Map(),
      mapIdList: [],  // id列表
      allActive: false,  // 全选按钮是否处于active状态
      selectVisible: false,
        immutateArr:[],
    };
  },
  filters: {
    sexLimitFilter(val) {
      let result = '男女不限'
      switch (val) {
        case '1':
          result = '仅限男工'
          break;
        case '2':
          result = '仅限女工'
          break;
        default:
          break;
      }
      return result
    }
  },
  mounted() {
    this.getEmpList(this.other);
    this.initList();
    this.$nextTick(() => {
        this.resetStyle();
    })
  },
  watch: {      
      selectVisible:function(nval,val){
          if(nval){
              document.querySelector('.fixed-panel').style.zIndex = '3010'
          }else{
              document.querySelector('.fixed-panel').style.zIndex = '200'
          }
      },  
//    mapIdList: {
//        handler(val, oldval) {
//            this.allActive = this.talentList.every(item => {
//                return val.includes(item.id)
//            })
//            if (this.talentList.length == 0) {
//                this.allActive = false
//            }
//        }
//    },
//    talentList: {
//        handler(val, oldval) {
//            this.allActive = val.every(item => {
//                return this.mapIdList.includes(item.id)
//            })
//            if (val.length == 0) {
//                this.allActive = false
//            }
//        }
//    },     
  },

  methods: {
      resetStyle(){
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
      },
    initList() {
      this.propObj.list && this.propObj.list.forEach(item => {
        let obj = {}
        if (item.workHours) {
          obj = {
            id: item.talentId,
            name: item.talentName,
            sex: item.sex,
            settlementType: item.settlementType,
            candelete: false
          }
        } else {
          obj = {
            id: item.talentId,
            name: item.talentName,
            sex: item.sex,
            settlementType: item.settlementType,
            candelete: true
          }
        }
        this.empMap.set(item.talentId, obj);
        this.mapIdList = [...this.empMap.keys()];
      })
      this.$forceUpdate()
    },
    handleBack() {
      this.$emit('back')
    },
    handleSearch(val) {
        this.allActive = false;
      this.isother = val  // 控制按钮的选中状态
      this.getEmpList(val)
    },
    handleToggle(item) {
        if( item.grey == 1 ){
            if (this.empMap.has(item.id)) {
            let user = this.empMap.get(item.id)
            if (!user.candelete) {
              this.$toast('该零工已产生了考勤记录，不允许删除')
            } else {
              this.empMap.delete(item.id)
            }
          } else {
            if (this.empMap.size >= Number(this.propObj.authorizedNumber)) {
              this.$toast('人数已达上限')
              return
            }
            this.empMap.set(item.id, {
              id: item.id,
              name: item.realNameAlias,
              sex: item.sex,
              settlementType: item.settlementType,
              candelete: true
            })
          }
          this.mapIdList = [...this.empMap.keys()]
          this.$forceUpdate()
        }else{
            this.$toast('该排班所属经理人的非可用零工，请先推荐给该经理人。');
        }
    },
    handleSelectAll() {
        if( this.talentList.length ){
            this.allActive = !this.allActive;
            if (this.allActive) { 
                this.talentList.forEach(item => {
                    if ( (!this.empMap.has(item.id))&&( item.grey != 0) ) {
                        this.empMap.set(item.id, {
                            id: item.id,
                            name: item.realNameAlias,
                            sex: item.sex,
                            settlementType: item.settlementType,
                            candelete: true
                        })
                    }
                })
            }else{
                this.empMap.forEach(item => {
                    if ( (item.candelete)  ) {
                        this.empMap.delete(item.id)
                    }
                })
            }
            this.mapIdList = [...this.empMap.keys()];
            this.$forceUpdate();
        }
    },
    handleRemove() {
      this.empMap.forEach(item => {
        if (this.empIdSet.has(item.id)) {
          if ( (!item.candelete) ) {
            this.$toast(`${item.name}已产生了考勤记录，不允许删除`)
          } else {
            this.empIdSet.delete(item.id)
            this.empMap.delete(item.id)
          }
        }
      })
      this.mapIdList = [...this.empMap.keys()]
      this.$forceUpdate()
    },
    handleDeleteItem(item) {
      if (this.empIdSet.has(item.id)) {
        this.empIdSet.delete(item.id)
      } else {
        this.empIdSet.add(item.id)
      }
      this.$forceUpdate()
    },
    showSelect() {
      this.selectVisible = !this.selectVisible
    },
    // 获取零工列表
    getEmpList(other) {
      let param = {}
      if (other) { // 不包含某工种标签
        param = {
          managerId: this.propObj.managerId,
//          customerId: this.propObj.customerId,
          empManagerStatus: 1,
          skillNotEquals: this.propObj.currentIndustry,
//          pageNum: 1,
          pageSize: 0,
            greyCustomerId:this.$route.query.greyCustomerId,
        }
      } else { // 包含某工种标签
        param = {
          managerId: this.propObj.managerId,
//          customerId: this.propObj.customerId,
          empManagerStatus: 1,
          skillEquals: this.propObj.currentIndustry,
//          pageNum: 1,
          pageSize: 0,
            greyCustomerId:this.$route.query.greyCustomerId,
        }
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api.getEmpList(param).then(res => {
          let data = res.data.data
          this.talentList = data.list || [];
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.$indicator.close();
        })
    },
    handleSubmit() {
      let list = [];
      let empArray = Array.from(this.empMap.values());
        if( empArray.length > this.propObj.authorizedNumber ){
            this.$toast('所选人数超过人数上限');
        }else{
              empArray.forEach(item => {
                let listitem = {
                  settlementType: item.settlementType,
                  sex: item.sex,
                  talentId: item.id,
                  talentName: item.name,
                  talentType: 1
                }
                list.push(listitem)
              })
              this.$emit('empModify', list)
              this.$emit('back')
        }
    }
  },
}
</script>
<style lang="scss" scoped>
    .workerSelectCon {
        min-height: 100vh;
          background-color: #f5f5f5;
          padding-bottom: convertToVw(80);
        .disabledSelect {
            background-color: rgba(100,100,100,0.1);
            span {
                opacity: 0.6;
            }
        }
         .page-header {
             font-size: convertToVw(17);
             height: convertToVw(44);
        }
        .tab-container {
            box-sizing: border-box;
            height: convertToVw(40);
            padding: 0 convertToVw(15);
            border-bottom: 1px solid #d9d9d9;
            background-color: #fff;
            .tab {
                padding-top: convertToVw(8);
            }
      .tab-item {
          display: inline-block;
          font-size: convertToVw(13);
          vertical-align: middle;
          margin-right: convertToVw(10);
          padding: convertToVw(3) convertToVw(10);
          border-radius: 3px;
          color: #969799;
          border: 1px solid;
          &.active {
          color: #ea441a;
        }
      }
        }
  .empty-tip {
    padding-top: convertToVw(50);
    text-align: center;
    color: #969799;
  }
  .select-panel {
    background-color: #fff;
    padding-bottom: convertToVw(50);
  }
  .select-wrapper {
    padding-bottom: convertToVw(55);
    background-color: #fff;
    margin-top: convertToVw(20);
    .select-all {
      position: relative;
      height: convertToVw(46);
      line-height: convertToVw(46);
      padding-left: convertToVw(50);
      padding-right: convertToVw(15);
      border-top: 1px solid #d9d9d9;
      border-bottom: 1px solid #d9d9d9;
      &::before {
        position: absolute;
        content: '';
        display: block;
        width: convertToVw(22);
        height: convertToVw(22);
        background-image: url(../../../assets/img/check_hollow.png);
        background-repeat: no-repeat;
        background-position: center center;
        top: convertToVw(12);
        left: convertToVw(18);
      }
      &.active::before {
        background-image: url(../../../assets/img/check_filled.png);
      }
      span {
        font-size: convertToVw(13);
        color: #969799;
        float: right;
      }
    }
  }
  .select-wrapper .select-list {
    .select-item {
      position: relative;
      height: convertToVw(46);
      line-height: convertToVw(46);
      border-bottom: 1px solid #d9d9d9;
      padding-left: convertToVw(50);
      &::before {
        position: absolute;
        content: '';
        display: block;
        width: convertToVw(22);
        height: convertToVw(22);
        background-image: url(../../../assets/img/check_hollow.png);
        background-repeat: no-repeat;
        background-position: center center;
        top: convertToVw(12);
        left: convertToVw(18);
      }
      &.active::before {
        background-image: url(../../../assets/img/check_filled.png);
      }
      .name {
        font-size: convertToVw(16);
        color: #1e1f21;
      }

      .tag {
        padding: convertToVw(3) convertToVw(5);
        border-radius: 3px;
        margin-left: convertToVw(10);
        border: 1px solid;
        color: #969799;
      }

      .male {
        color: #3296fa;
      }

      .female {
        color: #fa3276;
      }
    }
  }

  .select-mask {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 200;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;

    .select-panel {
      position: absolute;
      height: convertToVw(350);
      width: 100%;
      bottom: 0;
      padding-bottom: convertToVw(55);

      .content-header {
        box-sizing: border-box;
        height: convertToVw(46);
        line-height: convertToVw(46);
        padding-left: convertToVw(15);
        padding-right: convertToVw(15);
        border: 1px solid #d9d9d9;

        .type {
          font-size: convertToVw(16);
          color: #1e1f21;
          margin-right: convertToVw(10);
        }

        .people-limit {
          font-size: convertToVw(13);
          color: #6e7075;
        }

        .delete {
          display: inline-block;
          position: absolute;
          width: convertToVw(42);
          height: convertToVw(30);
          border-radius: 3px;
          background-image: url(../../../assets/img/icon_delete.png);
          background-repeat: no-repeat;
          background-position: center center;
          border: 1px solid #d9d9d9;
          top: convertToVw(8);
          right: convertToVw(15);
          cursor: pointer;

          &.active {
            background-image: url(../../../assets/img/icon_delete_active.png);
            border: 1px solid #ea441a;
          }
        }
      }

      .content-body {
        height: convertToVw(295);
        overflow: scroll;
      }
    }
  }

  .delete-item {
    display: inline-block;
    font-size: convertToVw(13);
    margin-left: convertToVw(5);
    margin-top: convertToVw(5);

    .user-item {
      display: inline-block;
      padding: convertToVw(3) convertToVw(5);
      border-radius: 3px;
      color: #6e7075;
      border: 1px solid;

      &.active {
        color: #ea441a;
      }
    }
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
      background-image: url(../../../assets/img/worker.png);
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
    }
</style>