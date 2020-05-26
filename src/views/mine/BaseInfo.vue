<template>
  <div class="base-info">
    <mt-header title="第三步 完善信息"></mt-header>

    <mt-field label="民族" class="margin-space" placeholder="请选择民族" v-model="form.nation" readonly @click.native="handleShowNation"></mt-field>
    <mt-field label="户籍地址" placeholder="请输入身份证上的地址" v-model="form.address" @blur.native.capture="checkOriginAddress"></mt-field>

    <mt-field label="现住城市" class="margin-space" placeholder="请选择省市区" v-model="form.position" readonly @click.native="handlerShowArea"></mt-field>
    <mt-field label="现住详细地址" placeholder="请输入详细地址" v-model="form.address"></mt-field>

    <mt-field label="紧急联系人姓名" class="margin-space" placeholder="发生特殊情况时可以替您处理的人" v-model="form.contracts" :attr="{ maxlength: 128 }" @blur.native.capture="checkContract"></mt-field>
    <mt-field label="联系人手机" placeholder="输入可以联系到的电话" type="tel" v-model="form.phone" :attr="{ maxlength: 11 }" @blur.native.capture="checkPhone"></mt-field>
    <mt-field label="联系人关系" placeholder="比如：夫妻、父子、同事等等" v-model="form.relationship" @blur.native.capture="checkRelationship"></mt-field>
    <div class="btn-wrapper">
      <mt-button type="primary" @click="handleSubmit" :disabled="isLoading">提交</mt-button>
    </div>

    <mt-popup v-model="areaVisible" class="area-class" position="bottom">
      <mt-picker @change="onAreaChange" value-key="dicName" :show-toolbar="true" ref="natitonPicker" :visible-item-count="5">
        <div @click="handleAreaConfirm" class="sure">确认</div>
      </mt-picker>
    </mt-popup>

    <mt-popup v-model="nationVisible" position="bottom" class="mint-popup">
      <mt-picker @change="onNationChange" :visible-item-count="5" ref="natitonPicker1" value-key="dicName" :show-toolbar="true">
        <div @click="handleNationConfirm" class="sure">确认</div>
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
// 完善信息
export default {
  name: 'BaseInfo',
  data() {
    return {
      isLoading: false,
      show: true,
      handler: function (e) {
        e.preventDefault()
      },
      areaVisible: false,
      position: '',
      province: '',
      city: '',
      area: '',
      provinceCode: '',
      cityCode: '',
      areaCode: '',
      slots: [
        {
          flex: 1,
          values: [], //省份数组
          className: 'slot1',
          textAlign: 'center',
        },
        //分隔符
        {
          divider: true,
          content: '',
          className: 'slot2'
        },
        //市
        {
          flex: 1,
          values: [],//北京市
          className: 'slot3',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '',
          className: 'slot4'
        },
        //县
        {
          flex: 1,
          values: [],//北京市
          className: 'slot5',
          textAlign: 'center'
        }
      ],
      nationVisible: false,
      sexList: [
        {
          flex: 1,
          values: [
            {
              label: '男',
              value: '1',
            },
            {
              label: '女',
              value: '2',
            },
          ],
          className: "slot1",
          textAlign: "center"
        }
      ],
      nationList: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      pickerVisible: false,
      isShow: false,
      step: 3,
      step3: {
        name: "",
        idcard: "",
        address: "",
        contracts: "",
        phone: "",
        relationship: ""
      }
    };
  },
  mounted() {
    this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId;
    this.form.mobile = JSON.parse(sessionStorage.getItem("userInfo")).username;
    this.getInfo();
    this.getParam()
    this.getProList('0')
    this.getCityList('110000')
    this.getAreaList('110100')
    this.getNationList()
  },
  methods: {
    closeTouch() {
      document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, { passive: false })//阻止默认事件
    },
    openTouch() {
      document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, { passive: false })//打开默认事件
    },
    getInfo() {
      const params = {
        id: this.id
      };
      this.$api
        .getUserInfo(params)
        .then(response => {
          if (response.data.respCode == 0) {
            if (response.data.data.status == 2) {
              this.form.sexName = response.data.data.sexName || (response.data.data.sex == 1 ? '男' : '女');
              this.form.nation = response.data.data.nation;
              this.form.address = response.data.data.address;
              this.form.birthday = response.data.data.birthday;
              this.form.originAddress = response.data.data.originAddress;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    RouteToHome() {
      this.$router.push({ name: "WorkSpace" });
    },
    onNationChange(values) {
      this.step3.nation = values[0] && values[0].dicName
    },
    checkPhone() {
      if (!this.form.phone) {
        this.$toast("紧急联系人电话不能为空");
        return false;
      } else {
        let reg = new RegExp(/^[1-9][0-9]*$/);
        if (!reg.test(this.form.phone)) {
          this.$toast("请输入正确的紧急联系人手机号");
          return false;
        } else {
          return true;
        }
      }
    },
    handleSubmit() {
      if (!this.position) {
        this.$toast('现住城市不能为空！')
        return false
      }
      if (!this.step3.address1) {
        this.$toast('现住详细地址不能为空！')
        return false
      }
      if (!this.step3.nation) {
        this.$toast('民族不能为空！')
        return false
      }
      if (!this.step3.address) {
        this.$toast('户籍地址不能为空！')
        return false
      }
      if (!this.step3.contracts) {
        this.$toast('紧急联系人姓名不能为空！')
        return false
      }
      if (!this.step3.phone) {
        this.$toast('紧急联系人手机不能为空！')
        return false
      }
      if (!this.step3.relationship) {
        this.$toast('紧急联系人关系不能为空！')
        return false
      }
      this.isLoading = true;
      const params = {
        userId: this.id,
        province: this.province,
        city: this.city,
        region: this.area,
        address: this.step3.address1,
        originAddress: this.step3.address,
        sex: this.step3.sex == '男' ? 1 : 2,
        birthday: this.step3.birthDay,
        nation: this.step3.nation,
        talentContact: {
          contactName: this.step3.contracts,
          phone: this.step3.phone,
          relationship: this.step3.relationship,
        }
      }
      console.info(params)
      this.$api
        .AuthenticationStepTwo(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
            this.isShow = true
          }
          this.isLoading = false
        })
        .catch(error => {
          console.log(error);
          this.$toast(error)
          this.isLoading = false
        });
    },

    checkName() {
      if (!this.step3.name) {
        this.$toast("姓名不能为空");
        return false;
      } else {
        return true;
      }
    },

    checkTelPhone() {
      if (!this.form.mobile) {
        this.$toast("预留手机号不能为空");
        return false;
      } else {
        return true;
      }
    },
    checkAddress() {
      if (!this.step3.address) {
        this.$toast("户籍地址不能为空");
        return false;
      } else {
        return true;
      }
    },
    checkContract() {
      if (!this.step3.contracts) {
        this.$toast("紧急联系人不能为空");
        return false;
      } else {
        return true;
      }
    },
    checkRelationship() {
      if (!this.step3.relationship) {
        this.$toast("紧急联系人关系不能为空");
        return false;
      } else {
        return true;
      }
    },
    checkPhone() {
      if (!this.step3.phone) {
        this.$toast("紧急联系人电话不能为空");
        return false;
      } else {
        let reg = new RegExp(/^[1-9][0-9]*$/);
        if (!reg.test(this.step3.phone)) {
          this.$toast("手机号必须全为数字");
          return false;
        } else {
          if (this.step3.phone.length == 11) {
            return true;
          } else {
            this.$toast("请输入正确的紧急联系人手机号");
          }
        }
      }
    },
    handleAreaConfirm() {
      this.position = this.province + this.city + this.area
      this.areaVisible = false
    },
    handleNationConfirm() {
      this.step3.nation = this.$refs.natitonPicker1.getValues()[0].dicName
      this.nationVisible = false
    },
    handlerArea() {
      this.areaVisible = true
    },
    onValuesChange(picker, values) {
      this.picker = picker;
      console.log(picker)
      console.log(values)
      if (values[0]) {
        this.province = values[0].dicName
        this.provinceCode = values[0].dicVal
      }
      if (values[1]) {
        this.city = values[1].dicName
        this.cityCode = values[1].dicVal
      }
      if (values[2]) {
        this.area = values[2].dicName
        this.areaCode = values[2].dicVal
      }
    },
    getProList(value) {
      this.$api
        .getDicList("city", value)
        .then(response => {
          if (response.data.respCode == 0) {
            this.picker.setSlotValues(0, response.data.data);
            this.picker.setSlotValue(0, response.data.data[10]);
          } else { }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCityList(value) {
      this.$api
        .getDicList("city", value)
        .then(response => {
          if (response.data.respCode == 0) {
            this.picker.setSlotValues(1, response.data.data);
          } else { }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAreaList(value) {
      this.$api
        .getDicList("city", value)
        .then(response => {
          if (response.data.respCode == 0) {
            this.picker.setSlotValues(2, response.data.data);
            return response.data.data
          } else { }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getNationList() {
      this.$api
        .getDicList("nation", '0')
        .then(response => {
          if (response.data.respCode == 0) {
            this.nationList[0].values = response.data.data
          } else { }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  watch: {
    areaVisible: function (val, oldval) {
      if (val) {
        this.closeTouch()
      } else {
        this.openTouch()
      }
    },
    provinceCode: function (val, oldval) {
      console.log('监听省' + val)
      if (val) {
        this.getCityList(val)
      }
    },
    cityCode: function (val, oldval) {
      console.log('监听市' + val)
      if (val) {
        this.getAreaList(val)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.base-info {
  min-height: 100vh;
  background-color: #f5f5f5;
  .margin-space {
    margin-top: convertToVw(24);
  }
  /deep/.mint-header {
    font-size: convertToVw(16);
    line-height: convertToVw(44);
    background-color: #fff;
    color: #333;
  }
  /deep/.mint-cell {
    font-size: convertToVw(16);
    line-height: convertToVw(46);
    border-bottom: 1px solid #f2f2f5;
    color: #333;
  }
  /deep/.mint-cell-title {
    width: 90px;
  }
  /deep/.mint-cell-text {
    display: inline-block;
    height: auto;
    width: auto;
    max-width: 100%;
    line-height: 1;
    text-align: center;
  }
  /deep/.mint-cell-value {
    padding-left: convertToVw(20);
  }
  .btn-wrapper {
    box-sizing: border-box;
    position: fixed;
    width: 100%;
    bottom: 0;
    padding: convertToVw(10) convertToVw(18);
    font-size: convertToVw(18);
    line-height: convertToVw(48);
    background-color: #fff;
    /deep/.mint-button {
      width: 100%;
    }
  }
}
</style>