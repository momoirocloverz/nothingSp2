<template>
  <div>
    <mt-header title="银行列表" fixed class="mint-header-title" v-show="!show">
      <div slot="left">
        <mt-button icon="back" @click="show=true"></mt-button>
      </div>
    </mt-header>
    <BankList v-if="!show"></BankList>

    <div id="identification" v-show="show">
      <mt-header title="身份认证" fixed class="mint-header-title">
        <div slot="left">
          <mt-button icon="back" @click="Back"></mt-button>
        </div>
      </mt-header>

      <!-- 已完成认证 -->
      <div v-if="step==1" class="formDiv step">
        <mt-cell title="姓名">
          <span>{{form.name}}</span>
        </mt-cell>
        <mt-cell title="身份证号">
          <span>{{form.idcard}}</span>
        </mt-cell>
        <mt-cell title="状态">
          <span class="fs">{{form.status == 1 ? '待认证' : '已认证'}}</span>
        </mt-cell>
        <mt-cell title="性别">
          <span>{{form.sexName}}</span>
        </mt-cell>
        <mt-cell title="民族">
          <span>{{form.nation}}</span>
        </mt-cell>
        <mt-cell title="户籍地址">
          <span>{{form.originAddress}}</span>
        </mt-cell>
        <mt-cell title="出生日期">
          <span>{{form.birthday}}</span>
        </mt-cell>
      </div>

      <!-- 必要四要素 -->
      <!-- <div v-if="step == 3" class="formDiv">
        <div class="placeholder"></div>
        <input type="file" ref="upload" accept="image/*" @change="upload($event)" style="display: none">
        <div class="soliddBox" @click="open">
          <img src="../../assets/img/scan.png" alt="身份证" class="identity">
          <span class="commandID">拍摄照片，直接读取身份证</span>
        </div>
        <mt-field label="身份证号" placeholder="请输入身份证号" v-model="step3.id" @blur.native.capture="checkIdcard" class="step" @input="getIdCardBlank"></mt-field>

        <mt-field label="姓名" placeholder="请输入姓名" v-model="step3.name" @blur.native.capture="checkName" :attr="{ maxlength: 128}" class="step"></mt-field>

        <input type="file" ref="upload1" accept="image/*" @change="upload1($event)" style="display: none">
        <div class="soliddBox" @click="open1">
          <img src="../../assets/img/scan.png" alt="银行卡" class="identity">
          <span class="commandID">拍摄照片，直接读取银行卡</span>
        </div>
        <mt-field label="银行卡号" placeholder="请输入本人银行卡号提现收入使用" v-model="accountBank.cardNumber" @blur.native.capture="checkcardNumber" @input="getBlank" type="tel" class="step"></mt-field>

        <span class="task1 tip" @click="show=false">仅支持工商、建设…等银行</span>
        <span class="task2 tip" @click="show=false">查看全部</span>

        <mt-field label="办卡时预留手机号" placeholder="请输入办卡时预留手机号" v-model="form.mobile" @blur.native.capture="checkTelPhone" type="tel" class="step step-mobile"></mt-field>
        <div class=" logDiv flexable">
          <mt-button type="primary" class="logBtn2 " @click="handleSubmit1" :disabled="loadingHandle1">下一步</mt-button>
        </div>
      </div> -->

      <!-- 其他信息项 -->
      <div v-if="step == 4" class="formDiv">
        <div>
          <mt-field label="现住城市" placeholder="请选择省市区" v-model="position" readonly="" @click.native="handlerArea" class="step"></mt-field>
          <mt-field label="现住详细地址" placeholder="请输入详细地址" v-model="step3.address1" class="step"></mt-field>
          <mt-field label="民族" placeholder="请选择民族" :value="step3.nation" readonly @click.native="nationVisible=true" class="step"></mt-field>
          <mt-field label="户籍地址" placeholder="请输入身份证上的地址" v-model="step3.address" class="step"></mt-field>
          <mt-field label="紧急联系人姓名" placeholder="发生特殊情况时可以替您处理的人" v-model="step3.contracts" class="step" :attr="{ maxlength: 128 }" @blur.native.capture="checkContract"></mt-field>
          <mt-field label="紧急联系人手机" placeholder="输入可以联系到的电话" type="tel" v-model="step3.phone" class="step" :attr="{ maxlength: 11 }" @blur.native.capture="checkPhone"></mt-field>
          <mt-field label="紧急联系人关系" placeholder="比如：夫妻、父子、同事等等" v-model="step3.relationship" class="step" @blur.native.capture="checkRelationship"></mt-field>
        </div>
        <div class="logDiv flexable">
          <mt-button type="primary" class="logBtn2 " @click="handleSubmit" :disabled="loadingHandle">提交</mt-button>
        </div>
      </div>

      <div class="bg" v-show="isShow" @click="closeModal">
      </div>
      <div class="modal flexable" v-show="isShow">
        <div class="white flexable">
          <span class="identified">您的身份已认证</span>
          <mt-button type="primary" class="comfirmBtn" @click="RouteToHome">确定</mt-button>
        </div>
      </div>
      <mt-popup v-model="areaVisible" class="area-class" position="bottom">
        <mt-picker :slots="slots" @change="onValuesChange" value-key="dicName" :show-toolbar="true" ref="natitonPicker" :visible-item-count="5">
          <div @click="handleConfirm" class="sure">确认</div>
        </mt-picker>
      </mt-popup>

      <mt-datetime-picker ref="picker" type="date" v-model="value4" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleChange" :startDate="new Date('1970-01-01')" :endDate="new Date()">
      </mt-datetime-picker>

      <mt-popup v-model="nationVisible" position="bottom" class="mint-popup">
        <mt-picker :slots="nationList" @change="onNationChange" :visible-item-count="5" ref="natitonPicker1" value-key="dicName" :show-toolbar="true">
          <div @click="handleConfirm1" class="sure">确认</div>
        </mt-picker>
      </mt-popup>
      <mt-popup v-model="sexVisible" position="bottom" class="mint-popup">
        <mt-picker :slots="sexList" @change="onsexChange" :visible-item-count="3" ref="sexPicker" value-key="label" :show-toolbar="true">
          <div @click="handleConfirm2" class="sure">确认</div>
        </mt-picker>
      </mt-popup>
    </div>
  </div>
</template>
<script>
import util from '../../common/util'
import BankList from '../../components/BankList.vue'

export default {
  name: "Identification",
  components: {
    BankList: BankList
  },
  data() {
    return {
      loadingHandle: false,
      loadingHandle1: false,
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
      cardType: 1, // 待识别卡片类型 1：身份证  2: 银行卡
      accountBank: {
        cardNumber: '',
        mobile: '',
      },
      sexVisible: false,
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
      value4: '',
      pickerVisible: false,
      isShow: false,
      step: 4,
      step3: {
        name: "",
        idcard: "",
        address: "",
        contracts: "",
        phone: "",
        relationship: ""
      },
      form: {
        name: "",
        idcard: "",
        status: ""
      }
    };
  },
  watch: {
    areaVisible: function (val, oldval) {
      if (val) {
        this.closeTouch()
      } else {
        this.openTouch()
      }
    },
    'step3.id': function (val, oldval) {
      if (val) {
        val = val.replace(/\s/g, '').replace(/(^(\d{6})|(\d{4}))(?=[^\s])/g, "$1 ");
        this.step3.id = val
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
  },
  methods: {
    getBlank(value) {
      console.log(value)
      value = value.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
      this.accountBank.cardNumber = value
    },
    closeTouch() {
      document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, { passive: false })//阻止默认事件
    },
    openTouch() {
      document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, { passive: false })//打开默认事件
    },
    getIdCardBlank(value) {
      console.log(value)
      value = value.replace(/\s/g, '').replace(/(^(\d{6})|(\d{4}))(?=[^\s])/g, "$1 ");
      this.step3.id = value
    },
    getBlank(value) {
      console.log(value)
      value = value.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
      this.accountBank.cardNumber = value
    },
    Back() {
      // if (this.step == 4) {
      //   this.step = 3
      // } else {
      //   this.$router.go(-1)
      // }
      this.$router.go(-1)
    },
    RouteToHome() {
      this.$router.push({ name: "Mine" });
    },
    onsexChange(values) {
      this.step3.sex = values[0] && values[0].label
    },
    onNationChange(values) {
      this.step3.nation = values[0] && values[0].dicName || this.step3.nation
    },
    handleChange(value) {
      console.log(util.formatDate(value))
      this.step3.birthDay = util.formatDate(value)
      this.$forceUpdate()
    },
    openPicker() {
      this.value4 = new Date(this.step3.birthDay)
      this.$refs.picker.open();
    },
    closeModal() {
      this.isShow = false;
    },
    // 上传身份证
    open() {
      this.getToken();
      this.$refs.upload.click();
    },
    // 上传银行卡
    open1() {
      this.getToken();
      this.$refs.upload1.click();
    },
    upload(e) {
      console.log(e);
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview(this.picValue);
      console.log(this.picValue);
      this.cardType = 1
    },
    upload1(e) {
      console.log(e);
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview(this.picValue);
      console.log(this.picValue);
      this.cardType = 2
    },
    imgPreview(file) {
      let self = this;
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result;
          let img = new Image();
          img.src = result;
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= 100 * 1024) {
            self.headerImage = this.result;
            self.postImg();
          } else {
            img.onload = function () {
              let data = self.compress(img);
              self.headerImage = data;
              self.postImg();
            };
          }
        };
      }
    },
    fileSize(str) {
      var fileSize;
      // 找到等号，把等号也去掉
      if (str.indexOf(",") > 0) {
        var indexOf = str.indexOf(",");
        str = str.substring(indexOf + 1); // 把末尾的’=‘号去掉
      }
      return str;
    },
    postImg() {
      this.$api
        .postImg(
          this.fileSize(this.headerImage),
          this.upload_form.token
        )
        .then(response => {
          // console.log(response.headers)
          const key = response.data.key;
          this.uploadimg = `${this.bucketHost}/${key}`;
          console.log(this.uploadimg);
          this.getToken();
          if (this.cardType === 1) {
            this.regIdcard();
          } else {
            this.regBankcard();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 根据图片识别身份证
    regIdcard() {
      const params = {
        url: this.uploadimg
        // url: URLEncoder.encode(this.uploadimg,"utf-8")
      };
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api
        .regIdcard(params)
        .then(response => {
          console.log(response)
          this.$indicator.close();
          if (response.data.respCode == 0) {
            this.step3 = response.data.data;
            if (this.step3.birthDay) {
              let bitrhString = this.step3.birthDay
              this.step3.birthDay = bitrhString.substring(0, 4) + '-' + bitrhString.substring(4, 6) + '-' + bitrhString.substring(6, 8);
            }
          }
        })
        .catch(error => {
          this.$indicator.close();
          console.log(error);
        });
    },
    // 根据图片识别银行卡
    regBankcard() {
      const params = {
        url: this.uploadimg
        // url: URLEncoder.encode(this.uploadimg,"utf-8")
      };
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api
        .regBankcard(params)
        .then(response => {
          console.log(response)
          this.$indicator.close();
          if (response.data.respCode == 0) {
            this.accountBank.cardNumber = response.data.data.cardNo
          }
        })
        .catch(error => {
          this.$indicator.close();
          console.log(error);
        });
    },
    compress(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = (width * height) / 4000000) > 1) {
        console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      ctx.drawImage(img, 0, 0, width, height);
      //进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1).substring(23);
      console.log(ndata);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      canvas.width = canvas.height = 0;
      return ndata;
    },
    getToken() {
      this.$api.getToken().then((response) => {
        const {
          data: {
            fileName, upToken,
          },
        } = response.data;
        this.upload_form = {
          key: fileName,
          token: upToken,
        };
      });
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
          this.$toast("请输入正确的紧急联系人手机号");
          return false;
        } else {
          return true;
        }
      }
    },
    // 提交四要素信息姓名，身份证，银行卡，电话号
    handleSubmit1() {
      let idcardcheck = this.checkIdcard()
      if (!idcardcheck) {
        return false
      }
      let namecheck = this.checkName()
      if (!namecheck) {
        return false
      }
      let cardnumber = this.checkcardNumber()
      if (!cardnumber) {
        return false
      }
      let phonecheck = this.checkTelPhone()
      if (!phonecheck) {
        return false
      }
      if (!(namecheck && idcardcheck && cardnumber && phonecheck)) {
        return
      }
      this.loadingHandle1 = true;
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      const params = {
        userId: this.id,
        realName: this.step3.name,
        idCard: this.step3.id.replace(/\s+/g, ""),
        accountBank: {
          cardNumber: this.accountBank.cardNumber.replace(/\s+/g, ""),
          idCard: this.step3.id.replace(/\s+/g, ""),
          realName: this.step3.name,
          mobile: this.form.mobile,
        },
      }
      this.$api
        .AuthenticationStepOne(params)
        .then(response => {
          console.log('身份验证第一步', response)
          this.$indicator.close()
          if (response.data.respCode == 0) {
            this.step = 4
          } else if (response.data.errorCode == 150007) {
            if (Number.parseInt(response.data.errorMsg) > 0) {
              this.$messagebox.alert(`信息错误, 今天还剩<span style="color: #e84518">${response.data.errorMsg}</span>次提交机会，请仔细核对信息`, '错误提示')
            } else if (Number.parseInt(response.data.errorMsg) == 0) {
              this.$messagebox.alert(`信息错误, 今天认证次数已用完，请明天再试！`, '错误提示')
            } else {
              this.$toast('每天只能提交3次')
            }
          }
          this.loadingHandle1 = false
        })
        .catch(error => {
          console.log(error);
          this.$toast(error)
          this.loadingHandle1 = false
        });
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
      this.loadingHandle = true;
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
          this.loadingHandle = false
        })
        .catch(error => {
          console.log(error);
          this.$toast(error)
          this.loadingHandle1 = false
        });
    },
    getParam() {
      let step = this.$route.query.step || 4
      this.step = step
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
              this.form.status = response.data.data.status;
              this.form.name = response.data.data.realName;
              this.form.idcard = response.data.data.idCard;
              this.form.sexName = response.data.data.sexName || (response.data.data.sex == 1 ? '男' : '女');
              this.form.nation = response.data.data.nation;
              this.form.address = response.data.data.address;
              this.step3.nation = response.data.data.nation
              if (this.step3.nation && [...this.step3.nation].length === 1) {
                this.step3.nation += '族'
              }
              this.step3.address = response.data.data.originAddress
              this.form.birthday = response.data.data.birthday;
              this.form.originAddress = response.data.data.originAddress;

              if (response.data.data.baseInfoStatus == 2) {  // baseInfoStatus 基本信息是否已填写 1：已填 2: 未填
                this.step = 4
              } else {
                this.step = 1
              }
            } else {
              this.$router.push({ name: 'identifyId' })
            }
          }
        })
        .catch(error => {
          console.log(error);
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
    getDetail(cardNo) {
      const params = {
        cardNo: cardNo,
      };
      this.$api.CardBinInfo(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    checkcardNumber() {
      let bankno = this.accountBank.cardNumber
      if (!bankno) {
        this.$toast("银行卡号不能为空");
        return false;
      } else if (!/^([1-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18})$/.test((bankno).replace(/\s+/g, ""))) {
        this.$toast("请输入正确的银行卡号");
        return false;
      } else {
        this.getDetail(bankno.replace(/\s+/g, ""))
        return true
      }
    },
    checkIdcard() {
      if (!this.step3.id) {
        this.$toast("身份证号不能为空");
        return false;
      } else {
        if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test((this.step3.id).replace(/\s+/g, ""))) {
          this.$toast("请输入正确的身份证号");
          return false;
        }
      }
      return true
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
    handleConfirm() {
      this.position = this.province + this.city + this.area
      this.areaVisible = false
    },
    handleConfirm1() {
      this.step3.nation = this.$refs.natitonPicker1.getValues()[0].dicName
      this.nationVisible = false
    },
    handleConfirm2() {
      this.step3.sex = this.$refs.sexPicker.getValues()[0].label
      this.sexVisible = false
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
  mounted() {
    this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId;
    this.form.mobile = JSON.parse(sessionStorage.getItem("userInfo")).username;
    this.getParam()
    this.getInfo();
    this.getProList('0')
    this.getCityList('110000')
    this.getAreaList('110100')
    this.getNationList()
  }
};
</script>
<style scoped>
.formDiv {
  padding: 2rem 1rem 0;
  background: #fff;
}
.placeholder {
  height: 5vw;
}
#identification {
  /*background: #f5f5f5;*/
  height: 100%;
}
.logText {
  font-size: 0.9rem;
  color: #d6522d;
  text-align: center;
  padding-top: 2.45rem;
}
.redLine {
  width: 5.63rem;
  height: 0.05rem;
  background-color: #d6522d;
  margin: 0.78rem auto 0;
}
.pswIcon {
  width: 0.93rem;
  height: 1rem;
  position: absolute;
  top: 141px;
  left: 0;
}
.eyeIcon {
  width: 0.75rem;
  height: 0.3rem;
  position: absolute;
  top: 141px;
  right: 0;
}
.formDiv {
  position: relative;
}
.accontIcon {
  width: 0.93rem;
  height: 0.93rem;
  position: absolute;
  top: 20px;
  left: 0;
}
.logBtn2 {
  width: 12.48rem;
  height: 2.03rem;
  border-radius: 1.01rem;
  font-size: 0.75rem;
  margin: 3.35rem 0 1.2rem;
}
.logBtn {
  width: 12.48rem;
  height: 2.03rem;
  border-radius: 1.01rem;
  font-size: 0.75rem;
  margin: 6.35rem 0 1.2rem;
}
.logDiv {
  justify-content: center;
  width: 100%;
}
.codeIcon {
  width: 1.13rem;
  height: 1.1rem;
  position: absolute;
  top: 80px;
  left: 0;
}
.codeBtn {
  height: 1.43rem;
  border-radius: 0.71rem;
  border: solid 0.03rem #d6522d;
  padding: 0.4rem 0.68rem;
  font-size: 0.6rem;
  color: #d6522d;
  background: #fff;
  position: absolute;
  top: 75px;
  right: 0;
}
.noAccount {
  font-size: 0.6rem;
  color: #0d0d0d;
}
.register {
  font-size: 0.6rem;
  color: #d6522d;
}
.agreeeDiv {
  justify-content: center;
}
.idBox {
  width: 11.7rem;
  height: 8.32rem;
  background-color: #ffffff;
  box-shadow: 0rem 0.05rem 0.5rem 0rem rgba(187, 187, 187, 0.3);
  border-radius: 0.2rem;
  border: solid 0.03rem #e5e5e5;
  margin: 0 auto;
  text-align: center;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}
.command {
  font-size: 0.8rem;
  color: #d6522d;
  margin: 0.98rem 0 0.55rem;
}
.cash {
  font-size: 0.65rem;
  color: #808080;
  margin-bottom: 0.75rem;
}
.idcard {
  width: 5.25rem;
  height: 3.23rem;
  display: block;
}
.commandB {
  font-size: 0.8rem;
  color: #d6522d;
  margin: 1.45rem 1.48rem;
}
.bBox {
  margin-top: 1.93rem;
}
.right-icon {
  width: 0.4rem;
  height: 0.68rem;
}
.solidLabel {
  color: #131313;
  margin-top: 0.75rem;
  /*width: 100%;*/
  height: 2.33rem;
  border: 1px solid rgba(239, 239, 239, 1);
  box-shadow: 0px 0px 8px 0px rgba(164, 183, 202, 0.15);
  border-radius: 6px;
  font-size: 0.75rem;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.08rem;
}
.soliddBox {
  width: 82.6vw;
  height: 44.2vw;
  background-color: #f5f5f5;
  width: 100%;
  margin: 3vw auto 0 auto;
  border: 1px solid rgba(239, 239, 239, 1);
  box-shadow: 0px 0px 8px 0px rgba(164, 183, 202, 0.15);
  border-radius: 6px;
}
.identity {
  display: block;
  /* width: 25.4vw;
  height: 25.4vw; */
  width: 19.3vw;
  height: 19.3vw;
  margin: 7vw auto 0 auto;
}
.commandID {
  display: block;
  height: 8vw;
  line-height: 8vw;
  text-align: center;
  color: #d6522d;
}
.bg {
  background: #000;
  opacity: 0.5;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 5;
}
.comfirmBtn {
  width: 5.9rem;
  height: 1.75rem;
  border-radius: 0.88rem;
}
.identified {
  color: #0d0d0d;
  margin: 1.55rem 0 1.7rem;
}
.white {
  width: 12rem;
  height: 6.65rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.18rem;
}
.modal {
  position: fixed;
  z-index: 10;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.close {
  width: 1.5rem;
  height: 1.5rem;
}
.sure {
  float: right;
  padding: 5px;
  color: #666;
  margin: 5px 5px 0 0;
}
.task1 {
  font-size: 0.65rem;
  color: #0d0d0d;
  margin-left: 120px;
}
.task2 {
  font-size: 0.65rem;
  color: #026bf9;
  float: right;
}
</style>

<style lang="scss">
#identification {
  .mint-cell {
    min-height: 2rem;
    margin-top: 2vw;
  }
  .mint-cell-wrapper {
    border-bottom: 1px solid #f2f2f5;
  }
  .step-mobile {
    position: relative;
    top: 4px;
  }
  .tip {
    position: relative;
    top: 4px;
  }
}
</style>
