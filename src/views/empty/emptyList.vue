<template>
  <div>
    <div v-if="step==1">

      <header class="myheader">
        <button data-v-5a2146fc="" class="mint-button mint-button--default mint-button--normal" @click="$router.go(-1)"><span class="mint-button-icon"><i class="mintui mintui-back"></i></span> </button>
        <!--<img src="../../assets/img/iconsleftarrow@2x.png"/>-->
        <div class="radioDiv flexable">
          <div class="tab1" :class="{active:activeOne}" @click="waitForRob">常用</div>
          <div class="tab2" :class="{active:!activeOne}" @click="Robed">更多</div>
        </div>
      </header>

      <div class="container" :style="{ 'padding-bottom': paddingBottom+'rem'}">

        <div style="background: white; height:100%;">
          <div class="select-body">
            <div class="select-item" v-for="(item,index) in items1" :key="index" v-if="activeOne">
              <span class="select-check">
                <label class="mint-checklist-label">
                  <span class="mint-checkbox is-left"><input type="checkbox" class="mint-checkbox-input" v-model="item.check" @change="checkChange(item)"><span class="mint-checkbox-core"></span></span>
                </label>
              </span>
              <span class="select-label">
                {{item.nameAlias}}
              </span>
              <span class="select-tag" v-if="item.sex==1">
                男
              </span>
              <span class="select-tag" v-else style="color: #d6522d;">
                女
              </span>
            </div>
            <div class="select-item" v-for="(item,index) in items2" :key="index"  v-if="!activeOne">
              <span class="select-check">
                <label class="mint-checklist-label">
                  <span class="mint-checkbox is-left"><input type="checkbox" class="mint-checkbox-input" v-model="item.check" @change="checkChange(item)"><span class="mint-checkbox-core"></span></span>
                </label>
              </span>
              <span class="select-label">
                {{item.nameAlias}}
              </span>
              <span class="select-tag" v-if="item.sex==1">
                男
              </span>
              <span class="select-tag" v-else style="color: #d6522d;">
                女
              </span>
            </div>
          </div>

        </div>
      </div>
      <footer class="clearfix">
        <!--<div style="position: relative;">-->
        <!--<div>-->
        <div class="footer-tag-group flexable" v-show="tagGroupShow">
          <span class="selected-tag" v-for="(tag,index) in selectItem" :key="index">{{tag.nameAlias}}
            <img src="../../assets/img/delete@2x.png" class="selected-tag-delete" @click="deleteItem(tag)" />
          </span>

        </div>
        <!--</div>-->
        <div class="footer-bottom">
          <span style="display: inline-block;float:left;">
            <label class="mint-checklist-label">
              <span class="mint-checkbox is-left"><input type="checkbox" class="mint-checkbox-input" v-model="value2" @change="allSelectChange"><span class="mint-checkbox-core"></span></span>
              <span class="allselect-label">全选</span>
            </label>
          </span>
          <span style="display: inline-block;float: right;">
            <span style="display: inline-block;">
              <p class="footer-total">共计{{ this.selectItem.length}}人 </p>
              <p class="footer-most">最多能挂{{mostNumber}}人 </p>
            </span>
            <span style="display: inline-block;margin: 0 0.73rem;height: 2.1rem;vertical-align: middle">
              <mt-button type="primary" class="two-btn" @click="RouteToNext">确定</mt-button>
            </span>
          </span>
        </div>
        <!--</div>-->
      </footer>
    </div>
    <div v-if="step==2" style="">
      <mt-header title="添加特殊考勤人员" fixed>
        <div slot="left">
          <mt-button icon="back" @click="step=1"></mt-button>
        </div>

      </mt-header>
      <div class="container" style="background-color: #ffffff;padding-bottom: 2.2rem">
        <div class="card-list1" v-for="(item , index) in selectItem" :key="index">
          <div class="">
            <span class="card-name"> {{item.nameAlias}}</span>
            <span class="select-tag" v-if="item.sex==1">
              男
            </span>
            <span class="select-tag" v-else style="color: #d6522d;">
              女
            </span>
            <span class="card-delete" @click="deleteItem(item)">删除</span>
          </div>
          <div class="card-body1 flexable">
            <div class="body-item1 flexable">
              <div>
                <span class="select-label1">上班时间:</span>
                <span class="select-span1" @click="handlePicker(index)">
                  <input v-model="item.workStartTime" class="select-div" disabled placeholder="请选择" />
                  <img src="../../assets/img/down.png" class="select-icon" />
                </span>

              </div>
              <div>
                <span class="select-label1">下班时间:</span>
                <span class="select-span1" @click="handlePicker2(index)">
                  <input v-model="item.workEndTimeShow" class="select-div" disabled placeholder="请选择" />
                  <img src="../../assets/img/down.png" class="select-icon" />
                </span>
              </div>
            </div>
            <div class="body-item1 flexable">
              <div>
                <span class="select-label1">工种:</span>
                <span class="select-span1" @click="handlePicker3(index)">
                  <input v-model="item.industryName" class="select-div" disabled placeholder="请选择" />
                  <img src="../../assets/img/down.png" class="select-icon" />
                </span>

              </div>
              <!--<div>-->
              <!--<span class="select-label1">计件量:</span>-->
              <!--<span class="select-span1">-->
              <!--<input v-model="item.pieceSize" class="select-div" />-->

              <!--</span>-->
              <!--</div>-->
            </div>
          </div>
        </div>

        <mt-popup v-model="nationVisible" position="bottom" class="mint-popup">
          <mt-picker :slots="nationList" :visible-item-count="5" :show-toolbar="true" ref="workStartPicker" value-key="className">
            <div @click="workStartConfirm" class="sure">确认</div>
          </mt-picker>
        </mt-popup>
        <mt-popup v-model="nationVisible2" position="bottom" class="mint-popup">
          <!--@change="onNationChange2"-->
          <mt-picker :slots="workEndList" :visible-item-count="5" ref="workEndPicker" :show-toolbar="true" value-key="className">
            <div @click="workEndConfirm" class="sure">确认</div>
          </mt-picker>
        </mt-popup>
        <mt-popup v-model="nationVisible3" position="bottom" class="mint-popup">
          <mt-picker :slots="industryList" :visible-item-count="5" :show-toolbar="true" ref="workTypePicker" value-key="industryName">
            <div @click="workTypeConfirm" class="sure">确认</div>
          </mt-picker>
        </mt-popup>
      </div>

      <footer class="flexable empty-footer myfooter">
        <div class="left-btn flexable" @click="handleSubmit">提交</div>
        <!--<span class="ver-line"></span>-->
        <!--<div class="left-btn flexable" @click="step=1">编辑空挂名单</div>-->
      </footer>
    </div>
  </div>
</template>
<style scoped>
.sure {
  float: right;
  padding: 5px;
  color: #666;
  margin: 5px 5px 0 0;
}
.selected-tag {
  display: inline-block;
  padding: 0.1rem 0.4rem;
  height: 1.4rem;
  background-color: #d2d2d2;
  border-radius: 0.2rem;
  font-family: PingFang-SC-Medium;
  font-size: 0.6rem;

  letter-spacing: 0.03rem;
  color: #0d0d0d;
  text-align: center;
  line-height: 1.4rem;
  position: relative;
  margin: 0.3rem 0.6rem;
}
.selected-tag-delete {
  width: 0.73rem;
  height: 0.73rem;
  position: absolute;
  top: -0.26rem;
  right: -0.36rem;
}
.footer-tag-group {
  flex-wrap: wrap;
  padding-top: 0.3rem;
  height: 4.8rem;
  overflow-y: scroll;
}
.footer-total {
  font-size: 0.6rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0.7rem;
  letter-spacing: 0.03rem;
  color: #636363;
  margin-top: 0.53rem;
}
.footer-most {
  font-family: PingFang-SC-Regular;
  font-size: 0.6rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 1rem;
  letter-spacing: 0.03rem;
  color: #636363;
  margin-bottom: 0.53rem;
}
.two-btn {
  height: 1.3rem;
  border-radius: 1.01rem;
  color: #ffffff;
  font-family: PingFang-SC-Medium;
  font-size: 0.7rem;
  color: #ffffff;
}
.allselect-label {
  font-family: PingFang-SC-Medium;
  font-size: 0.75rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0.6rem;
  letter-spacing: 0.04rem;
  color: #d2d2d2;
  margin-left: 0.75rem;
}
.select-item {
  height: 2.8rem;
  border-bottom: solid 0.03rem #e5e5e5;
}
.select-body {
  padding: 0 1rem;
}
.mint-checklist-label {
  line-height: 2.45rem;
}
.select-check {
  display: inline-block;
}
.select-label {
  line-height: 2.8rem;
  font-family: PingFang-SC-Medium;
  font-size: 0.75rem;
  letter-spacing: 0.04rem;
  color: #0d0d0d;
}
.select-tag {
  line-height: 2.8rem;
  background-color: #f5f5f5;
  border-radius: 0.2rem;
  font-family: PingFang-SC-Regular;
  font-size: 0.6rem;
  letter-spacing: 0.01rem;
  color: #3cca54;
  padding: 0.38rem 0.78rem;
  margin-left: 0.7rem;
}
.myheader {
  width: 100%;
  height: 2.2rem;
  background-color: #e84518;
  position: fixed;
  z-index: 99;
  top: 0px;
  left: 0px;
  bottom: 0px;
  font-family: PingFang-SC-Medium;
  font-size: 0.75rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0rem;
  letter-spacing: 0.04rem;
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
}
.footer-bottom {
  height: 2.45rem;
  /*position: absolute;*/
  /*bottom: 0rem;*/
  /*left: 0rem;*/
}

.receive-count {
  margin-right: 0.53rem;
  font-family: PingFang-SC-Regular;
  font-size: 0.6rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0.22rem;
  letter-spacing: 0.01rem;
  color: #d2d2d2;
}

.disableBtn {
  border: solid 0.03rem #c4c4c4 !important;
  color: #c4c4c4 !important;
  width: auto !important;
}

.status-label {
  display: inline-block;
  margin-top: 0.79rem;
  float: right;
  font-family: PingFang-SC-Regular;
  font-size: 0.75rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0.22rem;
  letter-spacing: 0.02rem;
  color: #636363;
}

.distance-label {
  display: inline-block;
  margin-top: 0.79rem;
  float: right;
  font-family: PingFang-SC-Regular;
  font-size: 0.6rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0.22rem;
  letter-spacing: 0.01rem;
  color: #636363;
}

.radioDiv {
  margin: 0 auto;
  width: 5.8rem;
  height: 1.68rem;
}

.active {
  background-color: #fff !important;
  color: #e84518 !important;
}

.tab1 {
  text-align: center;
  line-height: 1.68rem;
  width: 4.4rem;
  display: inline-block;
  color: #fff;
  border-bottom-left-radius: 0.84rem;
  border-top-left-radius: 0.84rem;
  border: solid 0.03rem #fff;
}

.tab2 {
  text-align: center;
  line-height: 1.68rem;
  width: 4.4rem;
  display: inline-block;
  color: #fff;
  background-color: #e84518;
  border-bottom-right-radius: 0.84rem;
  border-top-right-radius: 0.84rem;
  border: solid 0.03rem #fff;
}

input {
  border: 0;
  outline: none;
}

.search-container {
  margin: 0.45rem 0.75rem;
  position: relative;
  background-color: #ffffff;
  border-radius: 0.83rem;
}

.search-icon {
  width: 1.05rem;
  height: 1.05rem;
  vertical-align: middle;
  margin: 0.4rem;
}

.searchInput {
  width: 80%;
  background-color: #ffffff;
  border-radius: 0.83rem;
  border: #ffffff;
  height: 34px;
  font-size: 12px;
}

.card-container {
  background-color: white;
  margin-bottom: 0.25rem;
}

.card-paddingtop {
  padding-top: 0.45rem;
}

.card-header {
  padding: 0 0.75rem;
  padding-top: 0.43rem;
}

.card-container span {
  display: inline-block;
}

.name {
  font-family: PingFang-SC-Medium;
  font-size: 1rem;
}

.card-body {
  margin: 0.85rem 0;
  padding: 0 0.75rem;
}

.card-body-item {
  margin-top: 0.73rem;
}

.tag {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  background-color: #f5f5f5;
  border-radius: 0.2rem;
  font-family: PingFang-SC-Regular;
  font-size: 0.6rem;
  color: #636363;
  text-align: center;
  margin-left: 0.98rem;
}

.tag + span {
  margin-left: 0.5rem;
}

.btn-group {
  float: right;
  padding-bottom: 0.43rem;
}

.body-label {
  font-family: PingFang-SC-Medium;
  font-size: 0.65rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0.22rem;
  letter-spacing: 0.01rem;
  color: #0d0d0d;
}

.body-value {
  font-family: PingFang-SC-Regular;
  font-size: 0.65rem;
  font-weight: normal;
  letter-spacing: 0.01rem;
  color: #636363;
}

.tel {
  font-family: PingFang-SC-Regular;
  font-size: 0.65rem;
  font-weight: normal;
  letter-spacing: 0.01rem;
  color: #1e8dff;
}

.footerBtn {
  width: 4.45rem;
  height: 1.65rem;
  border-radius: 0.83rem;
  border: solid 0.03rem #e84518;
  font-size: 0.6rem;
  color: #d6522d;
  background: #fff;
}

.card-footer {
  margin: 0.4rem 0;
  overflow: hidden;
  padding: 0 0.75rem;
}

.plus {
  font-size: 30px;
}

.searchClass {
  /*position: absolute;*/
  /*top:2.2rem;*/
  width: 100%;
  /*background-color: #ffffff;*/
}

.mint-searchbar {
  padding: 0 !important;
  margin: 0.45rem 0.75rem !important;
}

.cardList {
}
.myheader .mint-button--default {
  color: #fff;
  background-color: #e84518;
  -webkit-box-shadow: none;
  position: absolute;
  /* box-shadow: 0 0 1px #b8bbbf; */
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
  background-color: #f5f5f5;
  border-radius: 0.2rem;
  font-family: PingFang-SC-Regular;
  font-size: 0.6rem;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0.01rem;
  color: #3cca54;
  padding: 0.38rem 0.78rem;
  margin-left: 1.38rem;
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
}
.select-label1 {
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
.select-span1 {
  position: relative;
}
.select-div {
  width: 4.7rem;
  height: 1.45rem;
  background-color: #ffffff;
  border-radius: 0.73rem;
  border: solid 0.03rem #dcdcdc;
  text-align: center;
}
.select-icon {
  width: 0.43rem;
  height: 0.25rem;
  position: absolute;
  top: 0.35rem;
  right: 0.45rem;
}
.card-list1 {
  padding: 0 1rem;
  border-bottom: solid 0.03rem #e5e5e5;
  padding-bottom: 0.3rem;
}
.body-item1 {
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 2.2rem;
}
.card-body1 {
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
/*.mint-popup {*/
/*width: 100%;*/
/*}*/
.myfooter {
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
</style>
<script>
import MtButton from "../../../node_modules/mint-ui/packages/button/src/button.vue";
import { MessageBox } from 'mint-ui';
import util from '../../common/util'
import { Loadmore } from 'mint-ui';
import MtChecklist from "../../../node_modules/mint-ui/packages/checklist/src/checklist.vue";

export default {
  name: "",
  components: {
    MtChecklist,
    MtButton,
    'v-loadmore': Loadmore,
  },
  data() {
    return {
      mostNumber: '',
      data: {},
      skillList: [],
      selectIndex: '',
      items: [],
      industryList: [{
        flex: 1,
        values: [],
        className: 'slot4',
        textAlign: 'center',
        defaultIndex: 0
      }],
      nationVisible: false,
      nationVisible2: false,
      nationVisible3: false,
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
      step: 1,
      count1: 0,
      count2: 0,
      paddingBottom: 2.45,
      tagGroupShow: false,
      selectItem: [],
      items: [],
      items1: [],
      items2: [],
      value2: false,
      value: [],
      //checklist设置
      taskItem: {},
      visible: false,
      position: {},
      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      scrollMode: "auto",//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      id: '',
      activeOne: true,
      currentPage: 1,
      pageSize: 20,
      handler: function (e) {
        e.preventDefault()
      },
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
    activeOne: function (val, oldval) {
      if (val == true) {
        console.log(this.items1)
        this.items = this.items1
      } else {
        console.log(this.items2)
        this.items = this.items2
      }

    },
    items: function (val, oldval) {
      console.log('watch items')
      this.value2 = true
      if (val.length == 0) {
        this.value2 = false
      }
      for (let x in val) {
        console.log('sss')
        if (val[x].check == false) {
          this.value2 = false
          break;
        }
      }
    },
    selectItem: function (val, oldval) {
      if (val.length > 0) {
        this.tagGroupShow = true
        this.paddingBottom = 7.45
      } else {
        this.tagGroupShow = false
        this.paddingBottom = 2.45
      }

      if (this.activeOne) {
        this.value2 = true
        if (this.items1.length == 0) {
          this.value2 = false
        }
        for (let x in this.items1) {
          if (this.items1[x].check == false) {
            this.value2 = false
          }
        }
      } else {
        this.value2 = true
        if (this.items2.length == 0) {
          this.value2 = false
        }
        for (let x in this.items2) {
          if (this.items2[x].check == false) {
            this.value2 = false
          }
        }
      }

    },
    value2: function (val, oldval) {
      console.log('watch value2')
      if (val == true) {
        for (let x in this.items) {
          if (this.items[x].check == false) {
            this.items[x].check = true
            this.selectItem.push(this.items[x])
          }
        }
      }
    }
  },
  filters: {
    formatTime(val) {
      if (val) {
        return val.substring(0, 5)
      }
    },

    formatminDate(val) {
      if (val) {
        return util.minDate(val)
      } else {
        return '无'
      }
    },
  },
  created() {
    //      this.getList()
  },
  mounted() {
    //      this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId;
    //      this.position = JSON.parse(sessionStorage.getItem('position'))
    this.count1 = 1;
    this.count2 = 1;
    this.getList()
    this.getNumber()

    for (let i = 0; i <= 23; i++) {
      let data = i < 10 ? `0${i}` : i.toString()
      this.nationList[0].values.push(data)
      this.workEndList[2].values.push(data)
    }
    this.getSkill()
    this.getStatus()
  },
  methods: {
    closeTouch() {
      document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, { passive: false })//阻止默认事件
    },
    openTouch() {
      document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, { passive: false })//打开默认事件
    },
    getStatus() {
      const params = {
        id: this.$route.query.id,
        // id: 154,
      };
      this.$api
        .MScheduleDetail(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
            this.data = response.data.data
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSubmit() {
      console.log('sssss')
      let that = this
      let valid = true
      for (let x in this.selectItem) {
        const obj = this.selectItem[x]
        if (!obj.workEndTime) {
          that.$toast(`下班时间不能为空`)
          valid = false
          return false;
        } else if (!obj.workStartTime) {
          that.$toast(`上班时间不能为空`)
          valid = false
          return false;
        } else if (!obj.industryName) {
          that.$toast(`工种不能为空`)
          valid = false
          return false;
        }
      }
      //        let list = this.selectItem.map(function (obj, index) {
      //          obj.schedulingPunchList=[]
      //            obj.schedulingId=that.$route.query.id
      ////            obj.workEndTime=obj.workEndTime+':00'
      ////            obj.workStartTime=obj.workStartTime+':00'
      //            obj.talentId=obj.id
      //          obj.schedulingPunchList.push({
      //            endWorkType:obj.endWorkType,
      //            workEndTime:obj.workEndTime+':00',
      //            workStartTime:obj.workStartTime+':00'
      //          })
      //            return obj;
      //        })
      let list = []
      for (let x in this.selectItem) {
        let obj = this.selectItem[x]
        let newobj = {}
        newobj.schedulingPunchList = []
        newobj.talentId = obj.id
        newobj.talentName = obj.nameAlias
        newobj.industry = obj.industry
        newobj.industryName = obj.industryName
        newobj.sex = obj.sex
        newobj.schedulingPunchList.push({
          endWorkType: obj.endWorkType,
          workEndTime: obj.workEndTime + ':00',
          workStartTime: obj.workStartTime + ':00'
        })
        list.push(newobj)
      }
      if (valid) {
        let params = {
          schedulingEmployees: list,
          schedulingId: this.$route.query.id
        }

        this.$api
          .AddEmpty(params)
          .then(response => {
            console.log(response)
            if (response.data.respCode == 0) {
              this.$router.push({ name: 'emptyShow', query: {id:this.$route.query.id, status: this.data.status }})
            }

          })
          .catch(error => {
            console.log(error);
          });
      }

    },
    getSkill() {
      let params = {
        schedulingId: this.$route.query.id
      }

      this.$api
        .getNOrepeatIndustry(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
            console.log(response.data)
            this.skillList = response.data.data;
            this.industryList[0].values = this.skillList
          }

        })
        .catch(error => {
          console.log(error);
        });
    },
    RouteToNext() {
      if (this.selectItem.length < 1) {
        this.$toast('特殊考勤人员名单不能为空')
        return false
      } else if (this.selectItem.length > Number(this.mostNumber)) {
        this.$toast(`特殊考勤人员最多只能${this.mostNumber}个`)
        return false
      } else {
        this.step = 2
      }


    },
    allSelectChange() {
      console.log('Select value2')
      console.log(this.value2)
      if (this.value2 == false) {
        for (let x in this.items) {
          if (this.items[x].check == true) {
            this.items[x].check = false;
            for (let i in this.selectItem) {
              if (this.selectItem[i].id == this.items[x].id) {
                this.selectItem.splice(i, 1)
                break;
              }
            }
          }
        }
      }
      if (this.value2 == true) {
        for (let x in this.items) {
          if (this.items[x].check == false) {
            this.items[x].check = true
            this.selectItem.push(this.items[x])
          }
        }
      }
    },
    checkChange(item) {
      if (item.check == true) {
        this.selectItem.push(item);
      } else {
        for (let x in this.selectItem) {
          if (this.selectItem[x].id == item.id) {
            this.selectItem.splice(x, 1)
            break;
          }
        }
      }
    },
    deleteItem(item) {
      for (let x in this.selectItem) {
        if (this.selectItem[x].id == item.id) {
          this.selectItem.splice(x, 1)
          break;
        }
      }
      for (let x in this.items) {
        if (this.items[x].id == item.id) {
          this.items[x].check = false
          break;
        }
      }
    },
    loadBottom() {//上拉触发的分页查询
      // 上拉加载
      this.currentPage++
      console.log(this.currentPage)
      if (this.activeOne) {
        this.getListMore()
      } else {
        this.getListMore2()
      }
      this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位

    },
    loadTop() {//组件提供的下拉触发方法
      //下拉加载
      //        this.tableData=[]
      this.currentPage = 1
      this.allLoaded = false
      if (this.activeOne) {
        this.getList()
      } else {
        this.getList2()
      }
      this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位

    },
    isHaveMore(isLastPage) {
      if (isLastPage) {
        this.allLoaded = true;
      }
    },
    waitForRob() {
      this.allLoaded = false
      this.activeOne = true
      //        this.tableData=[]
    },
    Robed() {
      this.allLoaded = false
      this.activeOne = false
      //        this.tableData=[]
      if (this.count2 == 1) {
        this.currentPage = 1
        this.getList2()
      }
    },
    grab(item) {
      const params = {
        taskId: item.id
      }
      this.$api.grabTask(params).then((response) => {
        if (response.data.respCode == 0) {
          item.grabDisabled = true
        } else {
          this.$toast(response.data.errorMsg)
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    getNumber() {
      const params = {
        schedulingId: this.$route.query.id
      }
      this.$api.remainingNumber(params).then((response) => {
        if (response.data.respCode == 0) {
          this.mostNumber = response.data.data
        } else {
          this.$toast(response.data.errorMsg)
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    getList2() {
      this.tableData = []
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        isBelongManager: 2,
        schedulingDate: this.$route.query.schedulingDate,
        managerId: this.$route.query.managerId,
        customerId: this.$route.query.customerId,
        schedulingId:this.$route.query.id,
      }
      this.$api.getAllEmpty(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
            isLastPage
          },
        } = response.data;
        if (list) {
          this.items2 = list.map(function (obj, index) {
            obj.check = false
            return obj;
          })
          this.isHaveMore(isLastPage)
          if (this.count2 == 1) {
            this.items = this.items2
          }
          this.count2++
        }
        this.pageCount = pages
      }).catch((error) => {
        console.log(error);
      });
    },
    getList() {
      this.items1 = []
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        isBelongManager: 1,
        schedulingDate: this.$route.query.schedulingDate,
        managerId: this.$route.query.managerId,
        customerId: this.$route.query.customerId,
        schedulingId:this.$route.query.id,
      }
      this.$api.getAllEmpty(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
            isLastPage
          },
        } = response.data;
        if (list) {
          this.items1 = list.map(function (obj, index) {
            obj.check = false
            return obj;
          })
          this.isHaveMore(isLastPage)
        }
        if (this.count1 == 1) {
          this.items = this.items1
        }
        this.count1++
        this.pageCount = pages
      }).catch((error) => {
        console.log(error);
      });
    },
    getListMore2() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        receiptType: 2,
        loginUserId: this.id,
      }
      console.log(params)

      this.$api.receiveTaskList(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
            isLastPage
          },
        } = response.data;
        this.tableData = this.tableData.concat(list)
        this.isHaveMore(isLastPage)
        this.pageCount = pages
        this.$nextTick(function () {
          // 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，
          // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
          // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
          this.scrollMode = "touch";
        });
      }).catch((error) => {
        console.log(error);
      });
    },
    getListMore() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        receiptType: 2,
        isGrabPage: true,
        loginUserId: this.id,
      }
      console.log(params)

      this.$api.mainTaskList(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
            isLastPage
          },
        } = response.data;
        if (list) {
          let newlist = list.map(function (obj, index) {
            obj.grabDisabled = false
            return obj;
          })
          this.items1 = this.tableData.concat(newlist)
          this.isHaveMore(isLastPage)
          this.pageCount = pages
          this.$nextTick(function () {
            // 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，
            // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
            // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
            this.scrollMode = "touch";
          });
        }

      }).catch((error) => {
        console.log(error);
      });
    },

    //step=2
    handlePicker(index) {
      this.selectIndex = index;
      this.nationVisible = true
    },
    handlePicker2(index) {
      this.selectIndex = index;
      this.nationVisible2 = true
    },
    handlePicker3(index) {
      this.selectIndex = index;
      this.nationVisible3 = true
    },
    onNationChange(val, a) {
      this.selectItem[this.selectIndex].workStartTime = (a[0] + ':' + a[1]);
    },
    workStartConfirm() {
      let values = this.$refs.workStartPicker.getValues()
      this.selectItem[this.selectIndex].workStartTime = (values[0] + ':' + values[1]);
      this.nationVisible = false
    },
    workEndConfirm() {
      console.log(this.$refs.workEndPicker.getValues());
      let values = this.$refs.workEndPicker.getValues()
      if (!this.selectItem[this.selectIndex].workStartTime) {
        this.$toast('请选择上班时间')
        this.nationVisible2 = false
        return false
      }
      if (values[0] == '当日') {
        let end = values[1] + values[2]
        let starttime = this.selectItem[this.selectIndex].workStartTime.split(':')
        let start = starttime[0] + starttime[1]
        console.log(end)
        console.log(start)
        if (start > end) {
          this.$toast('下班时间不能早于上班时间')
        } else {
          this.selectItem[this.selectIndex].workEndTimeShow = (values[0] + values[1] + ':' + values[2]);
          this.selectItem[this.selectIndex].workEndTime = (values[1] + ':' + values[2]);
          this.selectItem[this.selectIndex].endWorkType = (values[0] == '当日' ? 1 : 2);
        }
      } else {
        this.selectItem[this.selectIndex].workEndTimeShow = (values[0] + values[1] + ':' + values[2]);
        this.selectItem[this.selectIndex].workEndTime = (values[1] + ':' + values[2]);
        this.selectItem[this.selectIndex].endWorkType = (values[0] == '当日' ? 1 : 2);
      }
      this.nationVisible2 = false
      console.log(this.selectItem[this.selectIndex].workEndTimeShow)
    },
    onNationChange2(val, a) {
      this.selectItem[this.selectIndex].workEndTime = (a[0] + ':' + a[1]);
    },
    workTypeConfirm() {
      let values = this.$refs.workTypePicker.getValues()
      this.selectItem[this.selectIndex].industryName = values[0].industryName
      this.selectItem[this.selectIndex].industry = values[0].industry
      this.nationVisible3 = false
    },
    onNationChange3(val, a) {
      console.log(val)
      console.log(a)
      this.selectItem[this.selectIndex].industryName = a[0].industryName;
      this.selectItem[this.selectIndex].industry = a[0].industry;
    },
    //      handleDelete(index){
    //        this.selectItem.splice(index,1)
    //      }
  },
  beforeRouteEnter(to, form, next) {
    next(vm => {
      console.log(form)
      if (form.name == 'taskDetail') {
        vm.activeOne = false
      } else {
        vm.activeOne = true
      }
    })
  }

}
</script>

