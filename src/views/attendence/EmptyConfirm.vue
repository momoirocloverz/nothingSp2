<template>
  <div class="empty-confirm">
    <div v-if="!submitSuccess" class="confirm">
      <mt-header title="提交空白客户签到表" fixed>
        <mt-button slot="left" icon="back" @click="$router.back(-1)"></mt-button>
      </mt-header>

      <div class="container">
        <div class="card-list" v-for="(item , index) in schedulingSettingVos" :id="'anchor'+item.industry" v-if="item.isStart!=2">
          <div class="card-title flexable">
            <span class="industry">{{item.industryName}}</span>
            <span class="industry-num">&nbsp;{{item.settingNormalCounts}}人&nbsp;
              {{item.workStartTime | formatTimeString}} - {{item.endWorkType | formatendWorkType}} {{item.workEndTime | formatTimeString}}
            </span>
          </div>
          <div class="card-item" v-for="(person , subindex) in item.schedulingEmployees" v-if="person.talentType!=2">
            <div class="card-header" :class="{'delete': person.deleteStatus}">
              <p class="card-name">{{person.talentName}}</p>
              <span class="card-tag">{{person.sexName}}</span>
              <span class="card-tag normal-tag">{{person.age}}岁</span>
              <span class="card-tag normal-tag">{{person.settlementTypeName}}</span>
              <span class="handle-btn" @click="toggleDeleteStatus(index, subindex)">{{person.deleteStatus ? '恢复' : '删除'}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="btn-box">
        <div class="btn empty" v-if="emptyNumber !=0 && emptyTalentSwitch==1" @click="emptyClickCheck">已添加特殊考勤人员{{emptyNumber}}人</div>
        <div class="btn confirm" @click="handleSubmit">提交</div>
      </div>
    </div>

    <div v-if="submitSuccess" class="confirm-success">
      <mt-header title="提交空白客户签到表" fixed>
        <mt-button slot="left" icon="back" @click="$router.back(-1)"></mt-button>
      </mt-header>
      <img :src="imgsrc" style="margin-top: 30px; width: 100%;">
    </div>

    <DwbVueDrawer :visible.sync="visible" :position="position" :lockScroll="lockScroll" :maskClosable="maskClosable" :zIndex="zIndex" :maskStyle="maskStyle" :containerStyle="containerStyle" @open="open" @close="close">
      <img src="../../assets/img/list@3x.png" alt="菜单" class="menuInner" @click="visible = false" style="width: 2.03rem;height: 2.95rem;position: absolute;top:50%;z-index:999;">
      <ul class="ulBox" v-show="schedulingSettingVos && schedulingSettingVos.length>1">
        <li class="title-d">菜单</li>
        <li @click="goAnchor('#anchor'+item.industry,item.industry)" :class="{selected : isSelected== item.industry}" v-for="(item,index) in schedulingSettingVos" v-if="item.schedulingEmployees">{{item.industryName}}</li>
      </ul>
    </DwbVueDrawer>
    <img src="../../assets/img/list@3x.png" v-if="show" alt="菜单" class="menuOuter" @click="openDrawer" v-show="isMenu">
  </div>
</template>

<script>
import { DwbVueDrawer } from 'dwb-vue-drawer'
export default {
  name: 'EmptyConfirm',
  components: { DwbVueDrawer },
  data() {
    return {
      schedulingSettingVos: [],
      schedulingId: 0,
      submitSuccess: false,
      imgsrc: '',
      emptyTalentSwitch: '',
      status: '',
      visible: false,
      show: true,
      isMenu: false,
      position: 'right',
      lockScroll: true,
      emptyNumber: 0,
      maskClosable: true,
      zIndex: 200,
      maskStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      },
      containerStyle: {
        background: '#fff',
      },
      isSelected: '',
    }
  },
  mounted() {
    this.getParam()
    this.getList()
  },
  filters: {
    formatTimeString(val) {
      if (val) {
        return val.substring(0, 5)
      }
    },
    formatendWorkType(val) {
      return val == 2 ? '次日' : '当日'
    }
  },
  methods: {
    getParam() {
      this.schedulingId = Number.parseInt(this.$route.query.id)
      this.emptyTalentSwitch = this.$route.query.emptyTalentSwitch
    },
    // 获取人员列表
    getList() {
      const params = {
        id: this.$route.query.id,
      };
      this.$api
        .cusConfirmList(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.emptyNumber = response.data.data.emptyNumber
            this.status = response.data.data.status
            this.schedulingSettingVos = response.data.data.schedulingSettingVos
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
    emptyClickCheck() {
      this.$router.push({ name: 'emptyShow', query: { id: this.$route.query.id, status: this.status }, query: { fromconfirm: true } })
    },
    // 提交空白客户确认
    handleSubmit() {
      let submitList = []
      this.schedulingSettingVos.forEach(item => {
        item.schedulingEmployees && item.schedulingEmployees.forEach(subitem => {
          if (!subitem.deleteStatus) {
            submitList.push(subitem.id)
          }
        })
      })

      let params = {
        schedulingId: this.schedulingId,
        empIdList: submitList
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api.confirmEmpty(params)
        .then(res => {
          if (res.data.respCode === 0) {
            this.$toast('提交成功')
            this.imgsrc = res.data.data.emptyPNG
            this.submitSuccess = true
          }
        })
        .catch(err => {
          this.$toast('提交失败')
        })
        .finally(() => {
          this.$indicator.close()
        })
    },

    toggleDeleteStatus(index, subindex) {
      let targetStatus = !this.schedulingSettingVos[index].schedulingEmployees[subindex].deleteStatus
      this.$set(this.schedulingSettingVos[index].schedulingEmployees[subindex], 'deleteStatus', targetStatus)
    },

    goAnchor(selector, index) {
      console.log(index)
      this.isSelected = index
      var anchor = this.$el.querySelector(selector)
      document.body.scrollTop = anchor.offsetTop - 40; // chrome
      document.documentElement.scrollTop = anchor.offsetTop - 40; // firefox
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
  },
  watch: {
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
  }
}
</script>

<style lang="scss">
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.empty-confirm {
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  .container {
    padding-left: convertToVw(15);
    padding-right: convertToVw(15);
    padding-bottom: convertToVw(60);
  }
  .card-title {
    margin-top: convertToVw(30);
    padding-bottom: convertToVw(10);
    color: #636363;
    font-size: convertToVw(12);
    line-height: convertToVw(18);
    border-bottom: 1px solid #e5e5e5;
    .industry {
      border-left: 2px solid #e84518;
      padding-left: convertToVw(15);
      font-size: convertToVw(18);
      color: #333;
    }
  }
  .card-item {
    position: relative;
    margin: convertToVw(10) 0 convertToVw(20) 0;
    .card-name {
      font-size: convertToVw(18);
    }
    .card-tag {
      font-size: convertToVw(12);
      color: #3cca54;
    }
    .normal-tag {
      color: #666;
      margin: convertToVw(5);
    }
    .handle-btn {
      position: absolute;
      top: 0;
      right: convertToVw(15);
      font-size: convertToVw(12);
      padding: 0 convertToVw(10);
      border: 1px solid;
      border-radius: convertToVw(5);
      color: #e84518;
    }
    .delete {
      .handle-btn {
        color: #999;
      }
    }
  }
  .btn-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    font-size: convertToVw(16);
    line-height: convertToVw(60);
    background-color: #fff;
    border-top: 1px solid #e5e5e5;
    color: #e84518;
    display: flex;
    text-align: center;
    .btn {
      flex: 1;
    }
    .confirm {
      border-right: 1px solid #e5e5e5;
    }
  }

  .drawer {
    height: 100%;
    margin-top: -34rem;
  }
  .ulBox {
    padding: 2.2rem 1rem 0;
    position: relative;
    width: 6rem;
  }
  .ulBox li {
    line-height: 1.4rem;
    color: #333;
  }
  .menu {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100px;
  }
  .menuOuter {
    position: fixed;
    width: 2.03rem;
    height: 2.95rem;
    top: 50%;
    right: 0;
  }
  .menuInner {
    width: 2.03rem;
    height: 2.95rem;
    position: absolute;
    top: 50%;
  }
  .selected {
    color: #e84518 !important;
  }
  .title-d {
    font-size: 0.6rem;
  }
  .empty {
    box-sizing: border-box;
    border-right: 1px solid #e5e5e5;
  }
}
</style>
