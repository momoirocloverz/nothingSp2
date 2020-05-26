<template>
  <div class="confirm-attendence">
    <mt-header title="零工结算确认" class="page-header">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="main-content">
      <div class="total-time">总工时：{{totalTime}}小时</div>
      <div class="industry-zone" v-for="(item,index) in currentList" :id="'anchor'+item.industry" v-if="item.isStart == 1">
        <div class="industry-info">
          <div class="industry-name">{{item.industryName}}</div>
          <div>
            <div class="person-info" v-for="(sample,i) in item.schedulingEmployees" v-if="sample.schedulingPunchList && sample.shouldShow">
              <div class="person-baseinfo">
                <div class="person-name">{{sample.talentName}}</div>
                <span :class="sample.sexName == '男' ? 'tag-male' : 'tag-female'" v-if="sample.sexName == '男'">{{sample.sexName}}</span>
                <span class="tag-age">{{sample.age}}岁</span>
                <span class="tag-age">{{sample.settlementTypeName}}</span>
              </div>
              <!--有可能存在多段考勤-->
              <div v-if="sample.schedulingPunchList">
                <div class="punch-item" v-for="(card,cardIndex) in sample.schedulingPunchList" v-if="card.isAttendanceCompleted">
                  <div class="cardBox flexable">
                    <div class="work-time">
                      <span class="goCheck">上班时间：</span>
                      <span class="time" v-if="card.workStartTime">{{card.workStartDate == card.schedulingDate ? '当日' : '次日'}}{{card.workStartTime.substring(0,5)}}</span>
                    </div>
                    <div class="work-time">
                      <span class="goCheck">下班时间：</span>
                      <span class="time" v-if="card.workEndTime">{{card.workEndDate == card.schedulingDate ? '当日' : '次日'}}{{card.workEndTime.substring(0,5)}}</span>
                    </div>
                  </div>
                  <div class="work-number">
                    <div class="source">计件量：</div>
                    <div class="schedule countNum">{{card.pieceSize | formatPieceSize1}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="nomore"> 没有更多记录了</p>

    <DwbVueDrawer :visible.sync="visible" :position="position" :lockScroll="lockScroll" :maskClosable="maskClosable" :zIndex="zIndex" :maskStyle="maskStyle" :containerStyle="containerStyle" @open="open" @close="close">
      <img src="../../assets/img/list@3x.png" alt="菜单" class="menuInner" @click="visible = false" style="width: 2.03rem;height: 2.95rem;position: absolute;top:50%;z-index:999;">
      <ul class="ulBox" v-show="schedulingSettingVos && schedulingSettingVos.length>1">
        <li class="title-d">菜单</li>
        <li @click="goAnchor('#anchor'+item.industry,item.industry)" :class="{selected : isSelected== item.industry}" v-for="(item,index) in schedulingSettingVos" v-if="item.schedulingEmployees">{{item.industryName}}</li>
      </ul>
    </DwbVueDrawer>

    <img src="../../assets/img/list@3x.png" v-if="show" alt="菜单" class="menuOuter" @click="openDrawer" v-show="isMenu">
    <div class="page-bottom">
      <div class="bottom-btn" @click="handleSubmit">提交</div>
    </div>
  </div>
</template>

<script>
// 当前页只展示考勤信息，修改考勤在排班详情页进行
import Util from '../../common/util.js'
import { DwbVueDrawer } from 'dwb-vue-drawer'
export default {
  name: 'ConfirmAttendence',
  components: { DwbVueDrawer },
  data() {
    return {
      schedulingSettingVos: [],
      currentList: [],
      isMenu: false,
      visible: false,
      show: false,
      schedulingId: 0,
      position: 'right',
      lockScroll: true,
      maskClosable: true,
      zIndex: 200,
      totalTime: 0,
      maskStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      },
      containerStyle: {
        background: '#fff',
      },
    };
  },

  computed: {},
  filters: {
    formatPieceSize1(val) {
      console.log(val)
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
  mounted() {
    this.getParam()
    window.scrollTo(0, 0);
    this.getList()
  },
  watch: {
    'schedulingSettingVos': {
      handler: function (val, oldVal) {
        if (val) {
          for (let i in val) {
            for (let j in val[i].schedulingEmployees) {
              (val[i].schedulingEmployees)[j].isShow = false

              val[i].schedulingEmployees[j].schedulingPunchList && val[i].schedulingEmployees[j].schedulingPunchList.forEach(item => {
                if (item.isAttendanceCompleted) {
                  val[i].schedulingEmployees[j].shouldShow = true
                }
              })
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
  methods: {
    handleBack() {
      this.$router.go(-1)
    },
    getParam() {
      this.schedulingId = this.$route.query.id
    },
    getList() {
      const params = {
        id: this.schedulingId,
      };
      this.$api
        .MScheduleDetail(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
            this.data = response.data.data
            // data.status 排班状态 (1未结束  2已取消  3已结束)
            this.schedulingSettingVos = response.data.data.schedulingSettingVos
            this.totalTime = response.data.data.totalTalentWorkHours
            if (this.schedulingSettingVos) {
              this.isSelected = this.schedulingSettingVos[0].industry
            }
            const sechdulePosition = {
              longitude: this.data.longitude,
              latitude: this.data.latitude,
            }
            this.currentList = this.schedulingSettingVos

            sessionStorage.setItem('sechdulePosition', JSON.stringify(sechdulePosition))
            console.log(this.data)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSubmit() {
      let param = {
        schedulingId: this.schedulingId
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api.confirmTalentAttendance(param)
        .then(res => {
          this.$toast("确认成功")
          this.$router.go(-1)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.$indicator.close()
        })
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
    toShow(sample) {
      sample.isShow = !sample.isShow
      this.$forceUpdate()
    },
  },
}
</script>
<style lang='scss' scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.confirm-attendence {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: convertToVw(50);
}
.page-header {
  border-bottom: 1px solid #d9d9d9;
  font-size: convertToVw(17);
  height: convertToVw(44);
  line-height: convertToVw(44);
}
.main-content {
  background-color: #fff;
}
.industry-zone {
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
}
.industry-name {
  position: relative;
  font-size: convertToVw(17);
  padding-left: convertToVw(20);
  padding-top: convertToVw(5);
  padding-bottom: convertToVw(5);
  border-bottom: 1px solid #d9d9d9;
  &::after {
    content: "";
    display: block;
    position: absolute;
    width: convertToVw(2);
    height: convertToVw(17);
    left: convertToVw(5);
    top: convertToVw(7);
    background-color: #ea441a;
  }
}
.person-info {
  padding: convertToVw(5) convertToVw(10);
}
.person-name {
  font-size: convertToVw(16);
  display: inline-block;
}
.tag-male,
.tag-female,
.tag-age {
  margin-left: convertToVw(5);
  border: 1px solid;
}
.tag-male {
  color: #3cca54;
}
.tag-female {
  color: #ea441a;
}
.work-time:nth-of-type(1) {
  margin-right: convertToVw(30);
}
.work-number {
  padding-top: convertToVw(5);
  .source {
    display: inline-block;
  }
}
.countNum {
  display: inline-block;
  margin-left: convertToVw(10);
}
.nomore {
  padding-top: convertToVw(10);
  text-align: center;
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
.total-time {
  font-size: convertToVw(12);
  color: #6e7075;
  line-height: convertToVw(32);
  padding: convertToVw(0) convertToVw(20);
  background-color: #f5f5f5;
}
</style>