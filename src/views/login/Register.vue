<template>
  <div>
    <mt-header title="银行列表" fixed class="mint-header-title" v-show="!show">
      <div slot="left">
        <mt-button icon="back" @click="show=true"></mt-button>
      </div>
    </mt-header>
    <BankList v-show="!show"></BankList>

    <div id="Register" v-show="show">
      <mt-header title="注册" fixed class="mint-header-title">
        <div slot="left">
          <mt-button icon="back" @click="Back"></mt-button>
        </div>
      </mt-header>
      <div class="logText"></div>

      <div v-if="step == 1">
        <!--<div class="first">第一步，设置账号密码</div>-->
        <div class="formDiv">
          <mt-field placeholder="请输入您要注册的手机号码" type="tel" v-model="form.mobile" class="logInput" :attr="{ maxlength: 11 }" @blur.native.capture="checkTel"></mt-field>
          <mt-field placeholder="请输入短信验证码" type="tel" v-model="form.validator" class="logInput" :attr="{ maxlength: 6 }" @blur.native.capture="checkCode"></mt-field>
          <mt-field placeholder="请输入6-18位密码，必须为数字或字母" type="password" v-model="form.password" class="logInput" :attr="{ maxlength: 18 }" @blur.native.capture="checkPwd"></mt-field>
          <img src="../../assets/img/lock@3x.png" alt="密码" class="pswIcon">
          <img src="../../assets/img/account@3x.png" alt="账号" class="accontIcon">
          <img src="../../assets/img/code@3x.png" alt="账号" class="codeIcon">
          <!--<img src="../../assets/img/eye@3x.png" alt="账号" class="eyeIcon">-->
          <mt-button type="default" class="codeBtn" :disabled="getcoding" @click="getCode">{{buttonText}}</mt-button>
        </div>
        <div class="logDiv flexable">
          <mt-button type="primary" class="logBtn" @click="sign" :disabled="preventNext">下一步</mt-button>
        </div>
        <div class="flexable agreeeDiv">
          <div class="noAccount">注册代表您已阅读并同意</div>
          <div class="register" @click="$router.push({path:'/Protocol',query:{type:'1'}})">《平台自由职业者协议》</div>
          <div class="register" @click="$router.push({path:'/Protocol',query:{type:'2'}})">《生产现场安防协议》</div>
        </div>
      </div>
      <!--<div v-if="step == 2">-->
      <!--<div class="first">第二步，选择认证方式</div>-->
      <!--<div class="idBox flexable">-->
      <!--<span class="command">银行卡认证（推荐）</span>-->
      <!--<span class="cash">后续收入可直接提现到银行卡</span>-->
      <!--<img src="../../assets/img/card@3x.png" alt="身份证" class="idcard">-->
      <!--</div>-->
      <!--<div class="idBox flexable bBox" @click="step=3">-->
      <!--<span class="commandB">身份证认证</span>-->
      <!--<img src="../../assets/img/id@3x.png" alt="身份证" class="idcard">-->
      <!--</div>-->
      <!--</div>-->
      <div v-if="step == 3">
        <mt-header title="第二步，身份认证" fixed class="mint-header-title">
          <div slot="left">
            <mt-button icon="back" @click="Back"></mt-button>
          </div>
        </mt-header>
        <div class="first">&nbsp;</div>
        <input type="file" ref="upload" accept="image/*" @change="upload($event)" style="display: none">
        <div class="soliddBox flexable" @click="open">
          <span class="commandID">点击扫描身份证</span>
          <img src="../../assets/img/identity@3x.png" alt="身份证" class="identity">
          <!--<img :src="headerImage" alt="身份证" class="identity">-->

        </div>
        <div class="solidLabel flexable" @click="step=4">
          手动输入身份证号码
          <img src="../../assets/img/right@3x.png" alt="" class="right-icon">
        </div>
      </div>
      <div v-if="step == 4">
        <mt-header title="第二步，身份认证" fixed class="mint-header-title">
          <div slot="left">
            <mt-button icon="back" @click="Back"></mt-button>
          </div>
        </mt-header>
        <!--<div class="first">第二步，身份证认证</div>-->
        <div>
          <mt-field label="姓名" placeholder="请输入姓名" v-model="step3.name" @blur.native.capture="checkName" :attr="{ maxlength: 128}" class="step"></mt-field>
          <mt-field label="身份证号" placeholder="请输入身份证号" v-model="step3.id" @blur.native.capture="checkIdcard" class="step"></mt-field>
          <mt-field label="银行卡号" placeholder="请输入银行卡号" v-model="accountBank.cardNumber" @blur.native.capture="checkcardNumber" @input="getBlank" class="step" type="tel"></mt-field>
          <span class="task1" @click="show=false">仅支持工商、建设…等银行</span>
          <span class="task2" @click="show=false">查看全部</span>
          <mt-field label="办卡时预留手机号" placeholder="请输入办卡时预留手机号" v-model="form.mobile" @blur.native.capture="checkTelPhone" class="step" type="tel"></mt-field>
          <mt-field label="现住城市" placeholder="请选择省市区" v-model="position" readonly="" @click.native="handlerArea" class="step"></mt-field>
          <mt-field label="现住详细地址" placeholder="请输入详细地址" v-model="step3.address1" class="step"></mt-field>
          <mt-field label="紧急联系人姓名" placeholder="发生特殊情况时可以替您处理的人" v-model="step3.contracts" class="step" :attr="{ maxlength: 128 }" @blur.native.capture="checkContract"></mt-field>
          <mt-field label="紧急联系人手机" placeholder="输入可以联系到的电话" type="tel" v-model="step3.phone" class="step" :attr="{ maxlength: 11 }" @blur.native.capture="checkPhone"></mt-field>
          <mt-field label="紧急联系人关系" placeholder="比如：夫妻、父子、同事等等" v-model="step3.relationship" class="step" @blur.native.capture="checkRelationship"></mt-field>
          <!--<mt-field label="性别" placeholder=""  readonly="readonly"  v-model="step3.sex" @click.native="sexVisible=true" class="step" unselectable="on"  onfocus="this.blur()"></mt-field>-->
          <!--<mt-field label="出生日期" placeholder=""  v-model="step3.birthDay" readonly @click.native="openPicker" class="step"></mt-field>-->
          <mt-field label="民族" placeholder="" readonly v-model="step3.nation" @click.native="nationVisible=true" class="step"></mt-field>
          <mt-field label="户籍地址" placeholder="" v-model="step3.address" @blur.native.capture="A" class="step"></mt-field>

        </div>
        <div class=" logDiv flexable">
          <mt-button type="primary" class="logBtn2 " @click="handleSubmit" :disabled="loadingHandle">提交</mt-button>
        </div>
      </div>
      <div class="bg" v-show="isShow" @click="closeModal">
      </div>
      <div class="modal flexable" v-show="isShow">
        <div class="white flexable">
          <span class="identified">您的身份已认证</span>
          <mt-button type="primary" class="comfirmBtn" @click="routeTohome">确定</mt-button>
        </div>
        <!--<img src="../../assets/img/x@3x.png" alt="关闭" class="close" @click="closeModal">-->
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
import cityPicker from '../../components/cityPicker.vue'
import util from '../../common/util'
import BankList from '../../components/BankList.vue'
export default {
  name: "Register",
  components: {
    cityPicker: cityPicker,
    BankList: BankList
  },
  data() {
    return {
      loadingHandle: false,
      show: true,
      handler: function (e) {
        e.preventDefault()
      },
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
      upload_form: {},
      headerImage: "",
      wating: 60,
      getcoding: false,
      preventNext: false,
      buttonText: "获取验证码",
      form: {
        phone: "",
        password: "",
        validator: ''
      },
      step: 1,
      step3: {
        name: "",
        idcard: "",
        address1: "",
        origin: "",
        contracts: "",
        phone: "",
        relationship: "",
        sex: 1,
      },
      isShow: false,
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
          textAlign: 'center'
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
      ]
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
    step: function (val, oldval) {
      if (val == 4) {
        this.accountBank.cardNumber = ''
      }
    },
  },
  methods: {
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
      if (this.step == 4) {
        this.step = 3
      } else if (this.step == 3) {
        this.step = 1
      } else {
        this.$router.go(-1)
      }
    },
    onsexChange(values) {
      this.step3.sex = values[0].label
    },
    onNationChange(values) {
      this.step3.nation = values[0].dicName
      //   console.log(110);
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

    handleSubmit() {

      if (!this.position) {
        this.$toast('现住城市不能为空！')
        return false
      } else if (!this.step3.address1) {
        this.$toast('现住详细地址不能为空！')
        return false
      } else {

      }
      this.loadingHandle = true;
      console.log(this.id)
      const params = {
        userId: this.userId,
        realName: this.step3.name,
        idCard: this.step3.id.replace(/\s+/g, ""),
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
        },
        accountBank: {
          cardNumber: this.accountBank.cardNumber.replace(/\s+/g, ""),
          idCard: this.step3.id.replace(/\s+/g, ""),
          realName: this.step3.name,
          mobile: this.form.mobile,
        },
      }
      this.$api
        .Authentication(params)
        .then(response => {
          console.log(response.data.respCode)
          if (response.data.respCode == 0) {
            this.isShow = true
          }
          this.loadingHandle = false;
          //             this.isShow=true
        })
        .catch(error => {
          console.log(error);
        });
    },
    routeTohome() {
      this.$router.push({ name: "Mine" });
    },
    checkTel() {
      console.log(1)
      if (!this.form.mobile) {
        console.log(2)
        this.$toast('登录账号不能为空')
        return false;
      } else {
        console.log(3)

        let reg = new RegExp(/^[1-9][0-9]*$/)
        if (!reg.test(this.form.mobile)) {
          this.$toast('手机号必须全为数字')
          return false;
        } else if (this.form.mobile.length != 11) {
          this.$toast('手机号必须为11位数字')
          return false;
          // this.loginnameCheck()
        }
      }
    },
    checkCode() {
      console.log(1)
      if (!this.form.validator){
        console.log(2)
        this.$toast("验证码不能为空");
        return false;
      } else {
        return true
      }
    },
    checkPwd() {
      if (!this.form.password) {
        this.$toast('登录密码不能为空')
        return false;
      } else {
        console.log(3)

        let reg = new RegExp(/^[a-zA-Z0-9]{6,18}$/)
        if (!reg.test(this.form.password)) {
          this.$toast('密码必须是6-18位字母或数字')
        }
      }
    },
    loginnameCheck() {
      const params = {
        loginName: this.form.mobile,
        userType: 5
      }
      this.$api
        .loginnameCheck(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode != 0) {
            this.getCoding = true
            return false
          }

        })
        .catch(error => {
          console.log(error);
        });
    },
    closeModal() {
      this.isShow = false;
    },
    open() {
      this.getToken();
      this.$refs.upload.click();
    },
    upload(e) {
      console.log(e);
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview(this.picValue);
      console.log(this.picValue);
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
          console.log('ssss')
          console.log(response)
          if (response.data.key) {
            const key = response.data.key;
            this.uploadimg = `${this.bucketHost}/${key}`;
            console.log(this.uploadimg);
            this.getToken();
            this.regIdcard();
          }

        })
        .catch(error => {
          console.log(error);
        });
    },
    regIdcard() {
      const params = {
        url: this.uploadimg
        //          url: URLEncoder.encode(this.uploadimg,"utf-8")
      };
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$api
        .regIdcard(params)
        .then(response => {
          // console.log(response.headers)
          if (response.data.respCode == 0) {
            this.$indicator.close();
            this.step3 = response.data.data;
            if (this.step3.birthDay) {
              let bitrhString = this.step3.birthDay
              this.step3.birthDay = bitrhString.substring(0, 4) + '-' + bitrhString.substring(4, 6) + '-' + bitrhString.substring(6, 8);
            }
            this.step = 4;
          }
        })
        .catch(error => {
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
        console.log(response)
        const {
          data: {
            fileName, upToken,
          },
        } = response.data;
        console.log(response.data.respCode)
        if (response.data.respCode == 0) {
          this.upload_form = {
            key: fileName,
            token: upToken,
          };
          console.log(this.upload_form)
        }

      });
    },
    getCode1() {
      const params = {
        mobile: this.form.mobile,
      };
      this.$api
        .getSmsCode(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.getcoding = true;
            this.wating = 60
            this.$toast({ message: '验证码已发送' });
            //                this.$toast({message:'验证码已发送',position:'bottom'});
            let that = this
            let timing = setInterval(function () {
              if (that.wating < 0) {
                that.getcoding = false;
                that.buttonText = '获取验证码';
                window.clearInterval(timing)
              } else {
                that.buttonText = that.wating + '秒后重试'
                that.wating--;
              }
            }, 1000)
          }
        })
        .catch(error => {
          console.log(error);
        });

    },
    getCode() {
      if (!this.form.mobile) {
        this.$toast('手机号不能为空')
        return false
      }
      let reg = new RegExp(/^[1-9][0-9]*$/)
      if (!reg.test(this.form.mobile)) {
        this.$toast('手机号必须全为数字')
        return false;
      } else if (this.form.mobile.length != 11) {
        this.$toast('手机号必须为11位数字')
        return false;
        //            this.loginnameCheck()
      }
      const params = {
        mobile: this.form.mobile,
        userType: 5,
      };
      this.$api
        .checkMobileMsg(params)
        .then(response => {
          console.log(response.data.data)
          if (response.data.respCode == 0) {
            if (response.data.data == false) {
              this.getCode1()
            } else {
              this.$toast('该手机号已被使用，无法注册')
            }
          }
        })
        .catch(error => {
          console.log(error);
        });

    },
    sign() {
      //        console.log(this.checkTel())
      //        if(!this.checkTel()) {
      //          return false
      //        }
      //        if(!this.checkCode()) {
      //          return false
      //        }
      //        if(!this.checkPwd()) {
      //          return false
      //        }

      const params = {
        mobile: this.form.mobile,
        validator: this.form.validator,
        password: this.form.password,
        userType: 5,
      };
      this.preventNext = true
      this.$api
        .sign(params)
        .then(response => {
          this.preventNext = false
          if (response.data.respCode == 0) {
            this.login();
            this.userId = response.data.data
          }
        })
        .catch(error => {
          this.preventNext = false
          console.log(error);
        });
    },
    login() {
      const params = {
        username: `${this.form.mobile},5`,
        password: this.form.password
      };
      this.$api
        .login(params)
        .then(response => {
          if (response.data.respCode == 0) {
            sessionStorage.setItem("token", response.headers.authorization);
            sessionStorage.setItem("logintype", response.data.data.loginType);
            sessionStorage.setItem("shareType", '2');//不分享默认2
            sessionStorage.setItem("userInfo", JSON.stringify(response.data.data));
            localStorage.setItem("userInfo", JSON.stringify(response.data.data))
            // this.$router.push('/identification')
            this.$router.push('/identifyid')
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
      console.log('sssss')
      let bankno = this.accountBank.cardNumber
      if (!bankno) {
        console.log('32323')
        this.$toast("银行卡号不能为空");
        return false;
      } else if (!/^([1-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18})$/.test((bankno).replace(/\s+/g, ""))) {
        this.$toast("请输入正确的银行卡号");
        return false;
      } else {
        this.getDetail(bankno.replace(/\s+/g, ""))
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
            //                return response.data.data
          } else {
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
          if (response.data.respCode == 0) {
            this.picker.setSlotValues(1, response.data.data);
          } else {
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
          if (response.data.respCode == 0) {
            this.picker.setSlotValues(2, response.data.data);
            return response.data.data
          } else {
          }

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
            //                this.natitonPicker.setSlotValues(1, response.data.data);
            this.nationList[0].values = response.data.data
          } else {
          }

        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  mounted() {
    sessionStorage.removeItem("token");
    //        let height = document.body.offsetHeight;
    //        let bg = document.getElementsByClassName("bg")[0];
    //        bg.style.height = `${height}px`;
    this.getProList('0')
    this.getCityList('110000')
    this.getAreaList('110100')
    this.getNationList()
  }
};
</script>
<style scoped>
#Register {
  width: 90%;
  margin: 0 auto;
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
  /*background-color: #d6522d;*/
  background-color: #ffffff;
  margin: 0.78rem auto 0;
}
.first {
  color: #0d0d0d;
  text-align: center;
  margin: 2.2rem auto 1.8rem;
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
  margin: 4.35rem 0 1.2rem;
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
  width: 14.85rem;
  height: 10.05rem;
  background-color: #ffffff;
  /*border: solid 0.03rem #dcdcdc;*/
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  border: 1px solid rgba(239, 239, 239, 1);
  box-shadow: 0px 0px 8px 0px rgba(164, 183, 202, 0.15);
  border-radius: 6px;
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
.soliddBox {
  width: 14.85rem;
  height: 10.05rem;
  background-color: #ffffff;
  border: solid 0.03rem #dcdcdc;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}
.identity {
  display: block;
  width: 9.82rem;
  height: 6.2rem;
}
.commandID {
  margin: 0.83rem 0 0.95rem;
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
  /* left:0;
    top:0;
    right:0;
    bottom: 0;
    margin:auto; */
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
.sure {
  float: right;
  padding: 5px;
  color: #666;
  margin: 5px 5px 0 0;
}
</style>
