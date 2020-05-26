<template>
  <div>
    <mt-header v-if="count == 1" title="添加日结零工" fixed class="mint-header-title">
      <mt-button slot="left" icon="back" @click="$router.go(-1)"></mt-button>
    </mt-header>
    <mt-header v-if="count == 2 || count == 3" title="添加日结零工" fixed class="mint-header-title">
      <mt-button slot="left" icon="back" @click="handleChangeCount"></mt-button>
    </mt-header>
    <div class="content_margin" v-if="count == 1">
      <input type="file" ref="upload" accept="image/*" @change="upload($event)" style="display: none">
      <div class="box flexable" @click="open">
        <img :src="imgShow" alt="id" class="idCard">
      </div>
      <div class="text">扫描不出来，手动填写身份证号</div>
      <div class="idBox flexable">
        <span class="cardNum">身份证号</span>
        <input type="text" v-model="idCard" class="inputRadius idInput" placeholder="请输入要添加的零工的身份证号">
      </div>
      <div class="btnBox flexable">
        <mt-button type="primary" class="logBtn" @click="CountToNext">下一步</mt-button>
      </div>
    </div>
    <div class="content_margin" v-if="count == 2">
      <mt-cell title="零工姓名" class="black">
        <span class="fs">{{info.realName}}</span>
      </mt-cell>
      <mt-cell title="零工身份证号" class="black">
        <span class="fs">{{info.idCard}}</span>
      </mt-cell>
      <mt-cell title="性别" class="black">
        <span class="fs">{{info.sex | formatSex}}</span>
      </mt-cell>
      <mt-cell title="安排工种" class="black" @click.native="handlePicker3">
        <span class="fs">{{selectIndustry.industryName}}</span>
        <img src="../../assets/img/up@3x (2).png" alt="下拉" class="drop">
      </mt-cell>
      <!--<mt-cell v-if="isModel" title="人员模式" class="black" @click.native="handlePicker4">-->
        <!--<span class="fs">{{model}}</span>-->
        <!--<img src="../../assets/img/up@3x (2).png" alt="下拉" class="drop">-->
      <!--</mt-cell>-->
      <mt-cell title="报酬" class="black other-request flexable">
        <!-- 计时 -->
        <div class="fs">
          <span v-if="valuationType == 1">{{price.countTime}}元/小时；</span>

          <span v-if="valuationType == 2 && unit == 1">{{price.countSettle}}元/件；</span>
          <span v-if="valuationType == 2 && unit == 2">{{price.countDai}}元/袋；</span>
          <span v-if="valuationType == 2 && unit == 3">{{price.countChe}}元/车；</span>
          <span v-if="valuationType == 2 && unit == 4">{{price.countDun}}元/吨；</span>

          <!-- 计件 阶梯 -->
          <span v-if="valuationType == 3 ">{{(price.ladderObj)[0].count}}件以下（含），{{(price.ladderObj)[0].unit}}元/件；</span>

          <span v-if="valuationType == 3 && index != 0  && index != (price.ladderObj.length - 1)" v-for="(item, index) in price.ladderObj">{{Number((price.ladderObj)[index-1].count) + 1}}至{{item.count}}件（含），{{item.unit}}元/件；</span>

          <span v-if="valuationType == 3 ">{{(price.ladderObj)[price.ladderObj.length-2].count}}件以上，{{(price.ladderObj)[price.ladderObj.length-1].overUnit}}元/件；</span>

          <span v-if="valuationType == 4">{{price.countSettle}}元/件；</span>
          <span v-if="valuationType == 4 ">{{price.countDai}}元/袋；</span>
          <span v-if="valuationType == 4 ">{{price.countChe}}元/车；</span>
          <span v-if="valuationType == 4 ">{{price.countDun}}元/吨；</span>

          <span v-if="valuationType == 5 && unit == 1">{{price.countSettle}}元/件；</span>
          <span v-if="valuationType == 5 && unit == 2">{{price.countDai}}元/袋；</span>
          <span v-if="valuationType == 5 && unit == 3">{{price.countChe}}元/车；</span>
          <span v-if="valuationType == 5 && unit == 4">{{price.countDun}}元/吨；</span>
          <span v-if="valuationType == 5">{{price.countTime}}元/小时；</span>

          <span v-if="valuationType == 6">{{price.countTime}}元/小时；</span>
          <!-- 计件 阶梯 -->
          <span v-if="valuationType == 6 ">{{(price.ladderObj)[0].count}}件以下（含），{{(price.ladderObj)[0].unit}}元/件；</span>

          <span v-if="valuationType == 6 && index != 0  && index != (price.ladderObj.length - 1)" v-for="(item, index) in price.ladderObj">{{Number((price.ladderObj)[index-1].count) + 1}}至{{item.count}}件（含），{{item.unit}}元/件；</span>

          <span v-if="valuationType == 6 ">{{(price.ladderObj)[price.ladderObj.length-2].count}}件以上，{{(price.ladderObj)[price.ladderObj.length-1].overUnit}}元/件；</span>

          <span v-if="valuationType == 7 ">{{price.countSettle}}元/件；</span>
          <span v-if="valuationType == 7 ">{{price.countDai}}元/袋；</span>
          <span v-if="valuationType == 7 ">{{price.countChe}}元/车；</span>
          <span v-if="valuationType == 7">{{price.countDun}}元/吨；</span>
          <span v-if="valuationType == 7">{{price.countTime}}元/小时；</span>

          <!-- 日固定 -->
          <span v-if="valuationType == 8">{{price.countFixed}}元/天；</span>
        </div>
      </mt-cell>
      <div class="btnBox flexable">
        <mt-button type="primary" class="logBtn" @click="handleSubmit">提交</mt-button>
      </div>
      <mt-popup v-model="nationVisible3" position="bottom" class="mint-popup">
        <mt-picker :slots="industryList" :visible-item-count="5" :show-toolbar="true" ref="natitonPicker3" value-key="industryName">
          <div @click="handleConfirm3" class="sure">确认</div>
        </mt-picker>
      </mt-popup>
      <mt-popup v-model="nationVisible4" position="bottom" class="mint-popup">
        <mt-picker :slots="modelList" :visible-item-count="5" :show-toolbar="true" ref="natitonPicker4" value-key="model">
          <div @click="handleConfirm4" class="sure">确认</div>
        </mt-picker>
      </mt-popup>
    </div>
    <div class="content_margin" v-if="count == 3">
      <div class="textB">请零工用微信扫描下方二维码进行注册和实名认证</div>
      <div class="qrBox flexable">
        <img src="../../assets/img/code.jpg" alt="code" class="code">
      </div>
      <div class="send">长按二维码分享给好友</div>
      <div class="doneBox flexable">
        <mt-button type="primary" class="logBtn" @click="handleRecheck">已完成注册和实名认证，继续下一步</mt-button>
        <mt-button class="doneBtn" @click="$router.go(-1)">返回排班</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dayWorker',
  data() {
    return {
      selectIndustry: {
        industryName: '',
      },
      isModel:false,
      model:'代发收入', // 默认外包
      payType:'2',// 1 外包 2代发收入
      industryList: [{
        flex: 1,
        values: [],
        className: 'slot4',
        textAlign: 'center',
        defaultIndex: 0
      }],
      modelList:[{
        flex: 1,
        values: ['外包','代发收入'],
        className: 'slot4',
        textAlign: 'center',
        defaultIndex: 0
      }],
      nationVisible3: false,
      nationVisible4: false,
      info: {},
      idCard: '',
      imgShow: require('../../assets/img/identity@3x.png'),
      picValue: '',
      upload_form: {},
      count: 1,
      nationVisible: false,
      salary: [],
      price: {},
      valuationType: '',
      unit: '',
    }
  },
  filters: {
    formatSex(val) {
      if (val == 1) {
        return '男'
      } else {
        return '女'
      }
    }
  },
  mounted() {
    this.getindustryList();
    this.getType();
  },
  watch: {
    idCard: function (val, oldval) {
      if (val) {
        val = val.replace(/\s/g, '').replace(/(^(\d{6})|(\d{4}))(?=[^\s])/g, "$1 ");
        this.idCard = val
      }
    },
    selectIndustry: function (val, oldval) {
      if (val) {
        this.AddDailyEmpCheck()
      }
    }
  },
  methods: {
    handleConfirm3() {
      // console.log(this.$refs.natitonPicker3.getValues()[0])
      this.selectIndustry = this.$refs.natitonPicker3.getValues()[0]
      this.salary = JSON.parse(this.selectIndustry.salary)
      for (let i in this.salary) {
        this.valuationType = this.salary[i].valuationType
        this.unit = this.salary[i].unit
        console.log(this.salary[i])
        if (this.salary[i].settlementType == 1) {
          for (let j in this.salary[i].price) {
            if ((this.salary[i].price)[j].sex == this.info.sex) {
              console.log((this.salary[i].price)[j])
              this.price = (this.salary[i].price)[j]
            }
            // for(let z in this.salary[i][j]){
            //   if(this.salary[i][j][z].sex == this.info.sex){
            //     this.price = this.salary[i][j][z]
            //     console.log(this.price)
            //   }
            // }
          }
        }
      }
      this.nationVisible3 = false
    },
    handleConfirm4(){
      this.model = this.$refs.natitonPicker4.getValues()[0];
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
      this.nationVisible4 = false
    },
    handlePicker3() {
      this.nationVisible3 = true
    },
    handlePicker4() {
      this.nationVisible4 = true
    },
    CountToNext() {
      let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      if (!this.idCard) {
        this.$toast('身份证号不能为空')
        return
      }
      if (!reg.test(this.idCard.replace(/\s+/g, "").replace(/x/g, "X"))) {
        this.$toast("请输入正确的身份证号");
        return;
      }
      let card = this.idCard.replace(/\s*/g,"");
      this.$api.isBlackList({
        idCard:card,
        schedulingId:this.$route.query.id,
      }).then(res=> {
        if(res.data.data && res.data.respCode === 0){
          this.$toast('该零工为黑名单用户，无法添加！');
        }else{
          this.handleCheck()
        }
      }).catch(err => {
        this.$toast(err);
      })
    },
    handleSubmit() {
      const params = {
        schedulingId: this.$route.query.id,
        talentId: this.info.id,
        industry: this.selectIndustry.industry,
        payType:this.payType,
      }
      this.$api.addDailyEmp(params).then((response) => {
        console.log(response.data)
        if (response.data.respCode == 0) {
          this.$toast('添加成功')
          this.$router.go(-1)
        }
      }).catch(err => {
        console.log(err)
      });
    },
    handleChangeCount() {
      this.count = 1
    },
    handleCheck() {
      const params = {
        idCard: this.idCard.replace(/\s+/g, "")
      }
      this.$api.ReferenceCheck(params).then((response) => {
        console.log(response.data)
        if (response.data.respCode == 0) {
          if (response.data.data) {
            //                this.getindustryList()
            this.$toast('背调不通过')
          } else {
            this.getInfo()
          }
        }
      });
    },
    getInfo() {
      const params = {
        idCard: this.idCard.replace(/\s+/g, "")
      }
      this.$api.getByIdCard(params).then((response) => {
        console.log(response.data)
        if (response.data.respCode == 0) {
          if (response.data.data) {
            //                this.getindustryList()
            this.info = response.data.data
            console.log(this.info)
            this.count = 2
            this.AddDailyEmpCheck()
          } else {
            this.count = 3
          }
        }
        //            if(response.data.errorCode == 90025){
        //              this.count=3
        //            }
      });
    },
    getType(){
      let _this = this;
      let params = {schedulingId:this.$route.query.id}
      this.$api.getDailyPayType(params).then(res=>{
        if(res.data.respCode === 0){
          if(res.data.data == 3){
            _this.isModel = true;
          }
          console.log(res);
        }
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    },
    handleRecheck() {
      const params = {
        idCard: this.idCard.replace(/\s+/g, "")
      }
      this.$api.getByIdCard(params).then((response) => {
        console.log(response.data)
        if (response.data.respCode == 0) {
          if (response.data.data) {
            this.info = response.data.data
            console.log(this.info)
            this.count = 2
            this.AddDailyEmpCheck()
          } else {
            this.count = 3
            this.$toast('该零工尚未完善信息')
          }
        }
      })
    },
    AddDailyEmpCheck() {
      const params = {
        schedulingId: this.$route.query.id,
        talentId: this.info.id,
        industry: this.selectIndustry.id ? this.selectIndustry.id : 0,
      }
      this.$api.preAddDailyEmpCheck(params).then((response) => {
        console.log(response.data)
        if (response.data.respCode == 0) {
          if (response.data.data) {
            //
          } else {

          }
        }
      });
    },
    getindustryList() {
      const params = {
        schedulingId: this.$route.query.id
      }
      this.$api.getNOrepeatIndustry(params).then((response) => {
        if (response.data.respCode == 0) {
          this.industryList[0].values = response.data.data
        }
      });
    },
    open() {
      this.getToken();
      this.$refs.upload.click();
    },
    regIdcard() {
      this.$indicator.open({
        spinnerType: 'fading-circle'
      });
      const params = {
        url: this.uploadimg
        //          url: URLEncoder.encode(this.uploadimg,"utf-8")
      };
      this.$api
        .regIdcard(params)
        .then(response => {
          // console.log(response.headers)
          if (response.data.respCode == 0) {
            this.idCard = response.data.data.id;
            console.log(this.idCard)
          }
          this.$indicator.close()
        })
        .catch(error => {
          console.log(error);
        });
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
          // console.log(response.headers)
          const key = response.data.key;
          this.uploadimg = `${this.bucketHost}/${key}`;
          this.imgShow = this.uploadimg
          console.log(this.uploadimg);
          this.getToken();
          this.regIdcard();
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
  }
}
</script>

<style scoped>
.sure {
  float: right;
  padding: 5px;
  color: #666;
  margin: 5px 5px 0 0;
}
.box {
  width: 14.85rem;
  height: 10.05rem;
  border: solid 1px #dcdcdc;
  margin: 20% auto 0;
  justify-content: center;
  align-items: center;
}
.idCard {
  width: 10.35re;
  height: 6.75rem;
  display: block;
}
.text {
  color: #636363;
  margin: 0.9rem 0 1.53rem;
  text-align: center;
}
.idInput {
  width: 10rem;
  height: 1.78rem;
  padding: 0 0.6rem;
}
.cardNum {
  color: #0d0d0d;
}
.idBox {
  justify-content: space-around;
  align-items: center;
}
.logBtn {
  width: 13.48rem;
  height: 2.03rem;
  border-radius: 1.01rem;
  font-size: 0.75rem;
}
.doneBtn {
  width: 13.48rem;
  height: 2.03rem;
  border-radius: 1.01rem;
  font-size: 0.75rem;
  background: #fff;
  color: #e84518;
  border: solid 1px #e84518;
  margin-top: 0.48rem;
}
.btnBox2 {
  justify-content: center;
  align-items: center;
  margin-top: 13.35rem;
}
.btnBox {
  justify-content: center;
  align-items: center;
  margin-top: 4rem;
  /*position: absolute;*/
  /*bottom:.9rem;*/
  /*left:0;*/
  /*right:0*/
}
.fs {
  color: #636363;
}
.drop {
  width: 0.43rem;
  height: 0.25rem;
  display: block;
  margin-left: 0.48rem;
}
.back {
  margin-left: 0.75rem;
}
.textB {
  color: #0d0d0d;
  text-align: center;
  margin: 2.08rem 0 2.05rem;
}
.code {
  width: 8.75rem;
  height: 8.75rem;
  display: block;
}
.qrBox {
  width: 10.05rem;
  height: 10.05rem;
  border: solid 1px #dcdcdc;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.send {
  color: #e84518;
  text-align: center;
  margin: 1.4rem;
}
.doneBox {
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0.9rem;
  left: 0;
  right: 0;
}
</style>