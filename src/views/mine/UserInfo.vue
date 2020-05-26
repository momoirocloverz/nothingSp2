<template>
  <div>
    <div v-if="!isMap">
      <mt-header
        title="修改个人信息"
        fixed
        class="mint-header-title
"
      >
        <router-link
          to="/setting"
          slot="left"
        >
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <div class=" formDiv step right">
        <!--<mt-cell-->
          <!--title="性别"-->
          <!--class="flexable sexRadio"-->
        <!--&gt;-->
          <!--<span class="fs">{{form.sex}}</span>-->
          <!--&lt;!&ndash; <div class="flexable sexRadio">-->
          <!--<img-->
            <!--src="../../assets/img/selected@3x.png"-->
            <!--class="sexImg"-->
            <!--alt="男"-->
            <!--@click="chooseFemale"-->
            <!--v-if="form.sex== 1"-->
          <!--&gt;-->
          <!--<img-->
            <!--src="../../assets/img/unselected@3x.png"-->
            <!--class="sexImg"-->
            <!--alt="男"-->
            <!--@click="chooseMale"-->
            <!--v-if="form.sex== 2"-->
          <!--&gt;-->
          <!--<span class="fs">男</span>-->
        <!--</div>-->
        <!--<div class="flexable sexRadio ml">-->
          <!--<img-->
            <!--src="../../assets/img/selected@3x.png"-->
            <!--class="sexImg"-->
            <!--alt="女"-->
            <!--@click="chooseMale"-->
            <!--v-if="form.sex== 2"-->
          <!--&gt;-->
          <!--<img-->
            <!--src="../../assets/img/unselected@3x.png"-->
            <!--class="sexImg"-->
            <!--alt="女"-->
            <!--@click="chooseFemale"-->
            <!--v-if="form.sex== 1"-->
          <!--&gt;-->
          <!--<span class="fs">女</span>-->
        <!--</div> &ndash;&gt;-->
        <!--</mt-cell>-->
        <!--<mt-cell title="出生日期">-->
          <!--<span class="fs">{{form.birth}}</span>-->
          <!--&lt;!&ndash; <span-->
          <!--class="fs"-->
          <!--@click="openPicker"-->
        <!--&gt;选择您的出生日期</span>-->
        <!--<img-->
          <!--src="../../assets/img/up@3x (2).png"-->
          <!--@click="openPicker"-->
          <!--alt="下拉"-->
          <!--class="drop"-->
        <!--&gt; &ndash;&gt;-->
        <!--</mt-cell>-->
        <!--<mt-datetime-picker-->
          <!--ref="picker"-->
          <!--v-model="pickerVisible"-->
          <!--type="date"-->
          <!--year-format="{value} 年"-->
          <!--month-format="{value} 月"-->
          <!--date-format="{value} 日"-->
          <!--@confirm="handleConfirm"-->
        <!--&gt;-->
        <!--</mt-datetime-picker>-->
        <!--&lt;!&ndash; <div @click="nationVisible = true"> &ndash;&gt;-->
        <!--<div>-->
          <!--<mt-cell title="民族">-->
            <!--<span class="fs">{{form.nation}}</span>-->
            <!--&lt;!&ndash; <img-->
            <!--src="../../assets/img/up@3x (2).png"-->
            <!--alt="下拉"-->
            <!--class="drop"-->
          <!--&gt; &ndash;&gt;-->
          <!--</mt-cell>-->
        <!--</div>-->
        <!--<mt-popup-->
          <!--v-model="nationVisible"-->
          <!--position="bottom"-->
          <!--class="mint-popup"-->
        <!--&gt;-->
          <!--<mt-picker-->
            <!--:slots="nationList"-->
            <!--@change="onNationChange"-->
            <!--:visible-item-count="5"-->
            <!--:show-toolbar="false"-->
            <!--ref="natitonPicker"-->
            <!--value-key="className"-->
          <!--&gt;</mt-picker>-->
        <!--</mt-popup>-->
        <!--<mt-field-->
          <!--label="户籍地址"-->
          <!--readonly-->
        <!--&gt;-->
          <!--<span style="word-wrap:break-word;color:#888">{{form.address}}</span>-->
        <!--</mt-field>-->
        <mt-field label="现住城市" placeholder="请选择省市区" v-model="position" readonly="" @click.native="handlerArea" class="step"></mt-field>
        <mt-field label="现住详细地址" placeholder="请输入详细地址" v-model="form.idAddress"  class="step"></mt-field>
        <mt-field
          label="紧急联系人姓名"
          placeholder="发生特殊情况时可以替您处理的人"
          v-model="form.contactName"
          class="emergercy"
          :attr="{ maxlength: 128 }"
          @blur.native.capture="checkContract"
        ></mt-field>
        <mt-field
          label="紧急联系人电话"
          placeholder="输入可以联系到的电话"
          type="tel"
          v-model="form.phone"
          @blur.native.capture="checkPhone"
          class="emergercy"
          :attr="{ maxlength: 11 }"
        ></mt-field>
        <mt-field
          label="紧急联系人关系"
          placeholder="比如：夫妻、父子、父女等等"
          v-model="form.relationship"
          @blur.native.capture="checkRelationship"
          class="emergercy"
          :attr="{ maxlength: 128 }"
        ></mt-field>
      </div>
      <div class="flexable margin0">
        <mt-button
          type="primary"
          class="logBtn"
          @click="updateInfo"
        >提交</mt-button>
      </div>
    </div>
    <div v-if="isMap">
      <mt-header
        title="选择位置"
        fixed
        class="mint-header-title
"
      >
        <div slot="left">
          <mt-button icon="back" @click="isMap = false"></mt-button>
        </div>
      </mt-header>
      <div class="search-container">
        <div class="inner">
          <span><img
            src="../../assets/img/search@3x.png"
            class="search-icon"
          /></span>
        <input
          type="search"
          class="searchInput"
          placeholder="请输入项目经理姓名搜索"
          v-model="mapConfig.keyword"
        >
        </div>
      </div>
      <div class="mapContain">
        <baidu-map
          class="map-container"
          :scroll-wheel-zoom="true"
          :center="mapConfig.center"
          :zoom="mapConfig.zoom"
        >
          <bm-view class="bm-view">
          </bm-view>
          <bm-local-search
            :keyword="mapConfig.keyword"
            :auto-viewport="true"
            :location="mapConfig.location"
            @infohtmlset="infohtmlset"
          >
          </bm-local-search>
        </baidu-map>
      </div>
      
    </div>
    <mt-popup v-model="areaVisible" class="area-class" position="bottom">
        <mt-picker :slots="slots" @change="onValuesChange"  value-key="dicName"  :show-toolbar="true"
                  ref="natitonPicker"  :visible-item-count="5">
          <div @click="handleConfirm" class="sure">确认</div>
        </mt-picker>
      </mt-popup>
  </div>
</template>
<script>
export default {
  name: "UserInfo",
  data() {
    return {
      pickerVisible: "",

      nation: "汉族",
      nationVisible: false,
      nationList: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      form: {
        contactName: "",
        phone: "",
        relationship: "",
        idAddress: "",
        address: "",
        birth: "",
        nation: "",
        sex: ""
      },
      id: "",
      talentId: "",
      talentContacts: [],
      isMap: false,
      mapConfig: {
        location: '',
        keyword: '',
        center: { lng: 120.21937542, lat: 30.25924446 },
        zoom: 12,
      },
      areaVisible:false,
      slots:[
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
          values:  [],//北京市
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
      position:'',
      handler: function(e){
        e.preventDefault()
      },
      province:'',
      city:'',
      area:'',
      provinceCode:'',
      cityCode:'',
      areaCode:'',
    };
  },
  methods: {
    openPicker() {
      //   this.$refs.picker.open();
    },
    onNationChange() {
      //   console.log(110);
    },
    chooseFemale() {
      //   this.form.sex = 2;
    },
    chooseMale() {
      //   this.form.sex = 1;
    },
    getInfo() {
      const params = {
        id: this.id
      };
      this.$api
        .getUserInfo(params)
        .then(response => {
          console.log(response.data);
          this.talentId = response.data.data.id;
          this.form.sex = response.data.data.sexName;
          this.form.birth = response.data.data.birthday;
          this.form.nation = response.data.data.nation;
          this.form.address =response.data.data.originAddress;
          this.form.idAddress = response.data.data.address;
          this.position = response.data.data.province+response.data.data.city+response.data.data.region
          this.form.contactName = response.data.data.talentContacts[0].contactName
          this.form.phone = response.data.data.talentContacts[0].phone
          this.form.relationship = response.data.data.talentContacts[0].relationship
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateInfo() {
      if(!this.position){
        this.$toast('现住城市不能为空！')
        return false
      }else if(!this.form.idAddress){
        this.$toast('现住详细地址不能为空！')
        return false
      }else {

      }
      const params = {
        id: this.talentId,
        talentContact: {
          contactName: this.form.contactName,
          phone: this.form.phone,
          relationship: this.form.relationship
        },
        address:this.form.idAddress,
        province:this.province,
        city:this.city,
        region:this.area,
      };
      this.$api
        .UpdateUserInfo(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.$toast("修改个人信息成功！");
            this.$router.go(-1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    checkContract() {
      if (!this.form.contracts) {
        this.$toast("紧急联系人不能为空");
        return false;
      } else {
        return true;
      }
    },
    checkRelationship() {
      if (!this.form.relationship) {
        this.$toast("紧急联系人关系不能为空");
        return false;
      } else {
        return true;
      }
    },
    checkPhone() {
      if (!this.form.phone) {
        this.$toast("紧急联系人电话不能为空");
        return false;
      } else {
        let reg = new RegExp(/^[1-9][0-9]*$/);
        if (!reg.test(this.form.phone)) {
          this.$toast("联系人电话必须全为数字");
          return false;
        } else {
          return true;
        }
      }
    },
    showMap() {
      this.isMap = true
    },
    infohtmlset(poi) {
      // console.log(poi)
      this.form.idAddress = `${poi.city}${poi.address}${poi.title}`;
      // this.form.latitude = poi.point.lat;
      // this.form.longitude = poi.point.lng;
      this.isMap = false
      this.mapConfig.keyword= ''
    },
    handlerArea() {
      this.areaVisible = true
    },
    onValuesChange(picker, values){
      this.picker=picker;
      console.log(picker)
      console.log(values)
      if(values[0]){
        this.province = values[0].dicName
        this.provinceCode = values[0].dicVal
      }
      if(values[1]){
        this.city = values[1].dicName
        this.cityCode = values[1].dicVal
      }
      if(values[2]){
        this.area = values[2].dicName
        this.areaCode = values[2].dicVal
      }
    },
    getProList(value) {
      this.$api
          .getDicList("city", value)
          .then(response => {
            if(response.data.respCode==0){
              this.slots[0].values = response.data.data
//                return response.data.data
            }else{
            }

          })
          .catch(error => {
            console.log(error);
          });
    },
    getCityList(value) {
      this.$api
          .getDicList("city", value)
          .then(response => {
            if(response.data.respCode==0){
              this.picker.setSlotValues(1, response.data.data);
            }else{
            }

          })
          .catch(error => {
            console.log(error);
          });
    },
    getAreaList(value) {
      this.$api
          .getDicList("city", value)
          .then(response => {
            if(response.data.respCode==0){
              this.picker.setSlotValues(2, response.data.data);
              return response.data.data
            }else{
            }

          })
          .catch(error => {
            console.log(error);
          });
    },
    handleConfirm(){
      this.position = this.province+this.city+this.area
      this.areaVisible = false
    },
    closeTouch () {
      document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, {passive:false})//阻止默认事件
    },
    openTouch () {
      document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, {passive:false})//打开默认事件
    },
  },
  mounted() {
    this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId;
    this.getInfo();
    this.getProList('0')
    this.getCityList('110000')
    this.getAreaList('110100')
  },
  watch:{
    areaVisible:function (val,oldval) {
      if(val){
        this.closeTouch()
      }else{
        this.openTouch()
      }
    },
    'step3.id':function (val,oldval) {
      if(val){
        val = val.replace(/\s/g,'').replace(/(^(\d{6})|(\d{4}))(?=[^\s])/g, "$1 ");
        this.step3.id=val
      }
    },
    provinceCode:function (val,oldval) {
      console.log('监听省'+val)
      if(val){
        this.getCityList(val)
      }
    },
    cityCode:function (val,oldval) {
      console.log('监听市'+val)
      if(val){
        this.getAreaList(val)
      }
    },
  },
};
</script>
<style scoped>
.formDiv {
  padding-top: 2rem;
  width: 90%;
  margin: 0 auto;
}
.sexDiv {
  line-height: 1;
  min-height: 60px;
  overflow: hidden;
  padding: 0 10px;
  width: 100%;
  border-top: solid 0.03rem #e5e5e5;
  justify-content: space-between;
  align-items: center;
}
.sexText {
  color: #0d0d0d;
  width: 105px;
  margin-left: 0.73rem;
}
.sexImg {
  width: 1.05rem;
  height: 1.05rem;
  display: block;
  margin-right: 0.53rem;
}
.sexRadio {
  justify-content: center;
  align-items: center;
}
.ml {
  margin-left: 1.08rem;
}
.drop {
  width: 0.43rem;
  height: 0.25rem;
  display: block;
  margin-left: 0.48rem;
}
.mint-popup {
  width: 100%;
}
.margin0 {
  justify-content: center;
}
.logBtn {
  width: 12.48rem;
  height: 2.03rem;
  border-radius: 1.01rem;
  font-size: 0.75rem;
  margin: 3.93rem 0 1.2rem;
}
.mapContain {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.bm-view {
  width: 100%;
  height: 300px;
}
input{outline:none;}
    .search-container{
      margin:0 .75rem;
        position: relative;
        background-color: #ffffff;
        border-radius: 0.83rem;
        padding-top: 2rem;
    }
    .inner{
      border:1px solid #d2d2d2;
      border-radius: 0.83rem;
      margin:.45rem 0
    }
    .search-icon{
        width: 1.05rem;
        height: 1.05rem;
        vertical-align: middle;
        margin:0.4rem;
    }
    .searchInput{
        width:80%;
        background-color: #ffffff;
        border-radius: 0.83rem;
        border:#fff;
        height: 34px;
        font-size: 12px;
    }
    .sure{
  float: right;
  padding:5px;
  color:#666;
  margin: 5px 5px 0 0;
}
</style>
