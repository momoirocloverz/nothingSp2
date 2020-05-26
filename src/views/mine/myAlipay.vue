<template>
  <div class="my-alipay">
    <mt-header title="绑定银行卡">
      <mt-button icon="back" slot="left" @click="handleGoBack"></mt-button>
    </mt-header>

    <div class="card-panel">
      <div class="card-info">
        <div class="card-logo"></div>
        <img class="card-img" src="../../assets/bankLogo/weibiaoti-.png" alt="">
        <div class="card-name">支付宝账号:{{cardNo}}</div>
      </div>
      <div class="change-panel" v-if="id">
        <div @click="handleUnBind" class="un-bind">解绑</div>
        <!--<router-link to="/bankmobile" class="link">更换预留手机号</router-link>-->
      </div>
    </div>
    <div class="pt15 card-alipay">
        <div class="flex fb">优先打款：
          <mt-switch @change="openFirst" v-model="value"></mt-switch>
          <!--<span class="card-open-btn" @click="openFirst()">{{ifFirst == 3 ? '开启' : '关闭'}}</span>-->
        </div>
        <div class="pt10 co-999">
          设置后如发放时如可选择发放至银行卡或支付宝，优先打款至该银行卡
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyBankcard',
  data() {
    return {
      cardName: '',
      cardType: '',
      cardNo: '',
      bankCardBindingStatus:1,
      areaVisible: false,
      id:'',
      value:false,
      ifFirst:'',
      avatar:JSON.parse(sessionStorage.getItem('userInfo')).avatar,
    }
  },
  computed: {
  },
  watch:{
  },
  mounted() {
    console.log(this.avatar);
    this.getAccountDetail()
  },
  methods: {
    handleUnBind(){
      this.$messagebox({
          title: `您确定要解绑该支付宝吗？`,
          message: `解绑后，该支付宝账号在万才网所关联的信息将全部删除。`,
          showCancelButton: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        }).then(action => {
          if(action ==='confirm'){
            this.$api.setUnBindBankCard({id:this.id,bankId:this.bankId}).then(res=>{
                this.$router.push({name:'Mine'});
            })
          }else {
          }
          
        }).catch(err => {
          
        })
    },
    openFirst(val){
      console.log(val)
      console.log(this.ifFirst)
      this.$api.bindingFirst({id:this.id,ifFirst:this.ifFirst == 3 ? 1 : 3}).then(res=>{
        if(res.data.respCode === 0){
          if(this.ifFirst == 3){
            this.$toast('开启成功');
          }else{
            this.$toast('已关闭');
          }
          this.getAccountDetail();
        }
        console.log(res)
      })
    },
    getAccountDetail() {
      this.$api
        .AccountDetail()
        .then(response => {
          if (response.data.respCode == 0) {
            let data = response.data.data
            this.bankCardBindingStatus = data.bankCardBindingStatus;
            let result = data.bankList && data.bankList.filter((i)=> i.type == 1)
            this.cardName = result[0].bankName
            this.cardNo = result[0].cardNumber;
            this.cardType = result[0].cardCategory
            this.id =  result[0].id
            this.bankId =  result[0].wsBankId
            this.ifFirst =  result[0].ifFirst
            this.value = result[0].ifFirst == 1 ? true : false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleGoBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.my-alipay {
  .card-panel {
    box-sizing: border-box;
    width: convertToVw(340);
    height: convertToVw(166);
    margin: convertToVw(30) auto 0 auto;
    padding-top: convertToVw(15);
    background-image: linear-gradient(90deg, #2A6CFF, #2A6CFF);
    border-radius: convertToVw(6);
    position: relative;
    .card-info {
      position: relative;
      padding-left: convertToVw(68);
      line-height: 1;
      color: #fff;
      .card-name {
        font-size: convertToVw(14);
        padding-top: convertToVw(10);
      }
      .card-img{
        position: absolute;
        top:convertToVw(37);
        right: convertToVw(12);
        width: convertToVw(102);
        height: convertToVw(98);
      }
      .card-type {
        font-size: convertToVw(12);
        padding-top: convertToVw(8);
      }
      .card-logo {
        position: absolute;
        width: convertToVw(36);
        height: convertToVw(36);
        top: 0;
        left: convertToVw(24);
        border-radius: 50%;
        background-color: #fff;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url(../../assets/bankLogo/zhifubao-2@2x.png)
      }
    }
    .card-no {
      font-size: convertToVw(14);
      margin-top: convertToVw(20);
      padding-right: convertToVw(50);
      text-align: right;
      color:#fff;
    }
    .change-panel {
      position: absolute;
      width: 100%;
      height: convertToVw(42);
      background-color: rgba(47, 98, 244, 1);
      bottom: 0;
    }
    .link {
      position: absolute;
      font-size: convertToVw(14);
      padding: convertToVw(3) convertToVw(12);
      border: 1px solid;
      top: convertToVw(10);
      right: convertToVw(15);
      text-decoration: none;
      color: #fff;
    }
    .un-bind {
      position: absolute;
      font-size: convertToVw(14);
      padding: convertToVw(3) convertToVw(16);
      border: 1px solid;
      border-radius: 3px;
      top: convertToVw(10);
      right: convertToVw(15);
      text-decoration: none;
      color: #fff;
    }
  }
  .card-alipay{
    padding: convertToVw(50) convertToVw(15);
    .card-open-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #E95A34;
      width: convertToVw(60);
      height: convertToVw(32);
      color: #E95A34;
      /*background-color: #E95A34;*/
      font-size: convertToVw(14);
      border-radius: convertToVw(3);
    }
  }
}
</style>
