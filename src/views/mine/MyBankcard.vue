<template>
  <div class="my-bankcard">
    <mt-header title="绑定银行卡">
      <mt-button icon="back" slot="left" @click="handleGoBack"></mt-button>
    </mt-header>

    <div class="card-panel">
      <div class="card-info">
        <div class="card-logo" :style="`background-image:url(${cardLogo})`"></div>
        <div class="card-name">{{cardName}}</div>
        <div class="card-type">{{ cardType || '储蓄卡'}}</div>
      </div>
      <div class="card-no">{{anonymousNumber}}</div>

      <div class="change-panel" v-if="id">
        <div @click="handleUnBind" class="un-bind">解绑</div>
        <router-link to="/bankmobile" class="link">更换预留手机号</router-link>
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
      bankCardBindingStatus: false,
      areaVisible: false,
      id:null,
      bankId:'',
    }
  },
  computed: {
    cardLogo() {
      return `http://img.10000rc.com/${this.cardName}.png`
    },
    // 匿名卡号
    anonymousNumber() {
      return this.cardNo.replace(/\s/g, '').replace(/(\d{4})\d+(\d{4})$/, "**** **** **** $2")
    }
  },
  mounted() {
    this.getAccountDetail()
  },
  methods: {
    handleUnBind(){
      if(!this.bankId){
        this.bankId = '';
      }
      this.$messagebox({
          title: `您确定要解绑该银行卡吗？`,
          message: `解绑后，该银行卡在万才网所关联的信息将全部删除。`,
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
    getAccountDetail() {
      this.$api
        .AccountDetail()
        .then(response => {
          if (response.data.respCode == 0) {
            let data = response.data.data
            this.bankCardBindingStatus = data.bankCardBindingStatus;
            let result = data.bankList && data.bankList.filter((i)=> i.type == 2)
            console.log(result)
            this.cardName = result[0].bankName
            this.cardNo = result[0].cardNumber;
            this.cardType = result[0].cardCategory
            this.id =  result[0].id
            this.bankId =  result[0].wsBankId
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
.my-bankcard {
  .card-panel {
    box-sizing: border-box;
    width: convertToVw(340);
    height: convertToVw(166);
    margin: convertToVw(30) auto 0 auto;
    padding-top: convertToVw(26);
    background-image: linear-gradient(90deg, #01b5a5, #028bb0);
    border-radius: convertToVw(6);
    position: relative;
    .card-info {
      position: relative;
      padding-left: convertToVw(68);
      line-height: 1;
      color: #fff;
      .card-name {
        font-size: convertToVw(18);
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
      }
    }
    .card-no {
      font-size: convertToVw(18);
      margin-top: convertToVw(20);
      padding-right: convertToVw(50);
      text-align: right;
      color: #fff;
    }
    .change-panel {
      position: absolute;
      width: 100%;
      height: convertToVw(44);
      background-color: rgba(255, 255, 255, 0.3);
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
      padding: convertToVw(3) convertToVw(12);
      border: 1px solid;
      top: convertToVw(10);
      right: convertToVw(155);
      text-decoration: none;
      color: #fff;
    }
  }
}
</style>
