<template>
  <div class="cash-out" style="background:#f5f5f5;height:100%;width:100%">
    <mt-header title="提现" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.back(-1)"></mt-button>
      </div>
    </mt-header>
    <div class="container">
      <div class="top1 flexable">
        <div class="top flexable">
          <img :src="img" class="img" alt="logo">
          <div class="cash-col col-margin">
            <span class="cash-label">{{bankName}}</span>
            <p class="cash-holder">尾号{{card}}借记卡</p>
          </div>
        </div>
      </div>

      <div class="cash-row">
        <!--<p class="cash-text">提现金额 <span class="f13" style="color: #6E7075">{{`${query.text}可用提现 ${query.balance}元`}}</span></p>-->
        <div class="cash-input-content flexable">
          <span class="cash-mark">￥</span>
          <input placeholder="请输入提现金额" class="cash-input" @blur="checkTel" type="number" v-model="cash" />
          <span class="cash-fix pt10" @click="all">全部</span>
        </div>
        <div class="splitline"></div>
      </div>

      <!--<div class="cash-fee">每笔提现收取<span style="margin-left:.33rem">{{charge}}</span>元手续费</div>-->
      <div class="cash-fee">可用提现<span style="margin-left:.33rem">{{balance}}</span>元</div>
      <div class="orange">每笔提现收取{{charge}}元手续费</div>
      <div class="btndiv">
        <mt-button type="primary" class=" submit-btn" @click="submit1" :disabled="disable">提现</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        cash: null,
        charge: '',
        bankName: '',
        balance: 0,
        img: null,
        show: false,
        card: '',
        query:{},
        disable: false
      }
    },
    created() {
      this.getList()
    },
    mounted() {
      this.query = this.$route.query;
      console.log(this.$route.query.type)
      this.getFee()
    },
    methods: {
      submit1() {
        let _this = this;
        if(!_this.cash){
          return _this.$toast(`提现金额不能为空`);
        }
        // if(!(Number(_this.cash) % 1 === 0)){
        //   return _this.$toast(`提现金额必须是整数`);
        // }
        if(Number(_this.cash) <= Number(_this.charge)){
          return _this.$toast(`提现金额必须大于${_this.charge}元`);
        }
        _this.disable = true;
        const params = {
          amount: _this.cash,
          payType:_this.$route.query.type || 2,
        };
        this.$api
                .CashOut(params)
                .then(response => {
                  if (response.data.respCode == 0) {
                    _this.$router.push({ name: 'result' })
                  } else {
                    _this.$toast(response.data.errorMsg)
                  }
                })
                .catch(error => {
                  console.log(error);
                })
                .finally(() => {_this.disable = false});

      },
      checkTel() {
        if (!this.cash) {
          this.$toast("提现金额不能为空");
          return false;
        } else {
          let reg = new RegExp(/^(([1-9]\d*)(\.\d{1,2})?|0\.[1-9]{1,2})$/);
          if (!reg.test(this.cash)) {
            this.$toast("请输入正确的提现金额");
            return false;
          }
        }
      },
      all() {
        this.cash = this.$route.query.balance
      },
      getFee() {
        const params = {
          paramName: 'service_charge',
        };
        this.$api.ParamsInfo(params)
                .then(response => {
                  console.log(response)
                  if (response.data.respCode == 0) {
                    this.charge = response.data.data
                  }
                })
                .catch(error => {
                  console.log(error);
                });
      },
      getList() {
        this.$api
                .AccountDetail()
                .then(response => {
                  if (response.data.respCode == 0) {
                    this.bankName = response.data.data.bankList[0].bankName
                    this.balance = response.data.data.balance
                    this.card = (response.data.data.bankList[0].cardNumber).substr(-4)
                    if (response.data.data.bankList) {
                      this.getDetail(response.data.data.bankList[0].cardNumber)
                    }
                  }
                })
                .catch(error => {
                  console.log(error);
                });
      },
      getDetail(cardNo) {
        const params = {
          cardNo: cardNo,
        };
        this.$api.CardBinInfo(params)
                .then(response => {
                  console.log(response)
                  if (response.data.respCode == 0) {
                    if (response.data.data) {
                      this.img = `http://img.10000rc.com/${response.data.data.dicVal}.png`
                    }
                  }
                })
                .catch(error => {
                  console.log(error);
                });
      },
    },


  }
</script>

<style lang="scss" scoped>
  $design_width: 375;
  @function convertToVw($size: 0) {
    @return (($size * 100 / $design_width) + vw);
  }
  input {
    border: 0;
    outline: none;
  }
  .splitline {
    /* width: 100%; */
    height: 0.04rem;
    background-color: #e5e5e5;
  }
  .cash-label {
    font-size: 0.85rem;
    color: #0f0e0e;
  }
  .cash-holder {
    font-size: 0.65rem;
    font-weight: normal;
    font-stretch: normal;
    color: #5c5c5c;
    margin-top: 0.48rem;
  }
  .cash-row {
    /* height: 3.25rem; */
    padding: 0 0.78rem 0;
    background: #fff;
    margin-top: 1.02rem;
    position: relative;
  }
  .top1 {
    /* height: 3.25rem; */
    padding: 1rem 0.78rem;
    background: #fff;
    justify-content: space-between;
    align-items: center;
    /* margin-bottom: 2rem; */
  }
  .top {
    justify-content: flex-start;
    align-items: center;
  }
  .cash-text {
    display: flex;
    justify-content:space-between;
    color: #5c5c5c;
    padding: 0.9rem 0 1.02rem;
  }
  .rightaRROW {
    width: 0.4rem;
    height: 0.68rem;
  }
  .cash-col {
    float: left;
  }
  .col-margin {
    margin-left: 0.43rem;
  }
  .img {
    width: 2rem;
    height: 2rem;
    margin-right: 0.78rem;
    /* margin-left: 0.8rem; */
    /* vertical-align: middle; */
  }
  .cash-mark {
    font-size: 2.25rem;
    color: #000;
    vertical-align: middle;
  }
  .cash-input-content {
    /* padding:1.48rem 0; */
    /* position: relative; */
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 0.95rem;
  }
  .cash-input {
    border: none;
    padding: 0.2rem;
    font-size: 2.25rem;
    width: 10rem;
  }
  .cash-input::-webkit-input-placeholder {
    font-size: 0.6rem;
    line-height: 3.5rem;
  }
  .cash-fix {
    /* position: absolute;
          font-family: PingFang-SC-Medium; */
    font-size: 0.75rem;
    /* font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0.04rem; */
    color: #e84518;
    /* right: 0;
          top: 1.45rem; */
    position: absolute;
    right: 0.78rem;
    top: 4.3rem;
  }
  .cash-fee {
    background: #fff;
    color: #B9BABD;
    font-size:convertToVw(12);
    padding: 0.65rem 0.78rem;
  }
  .submit-btn {
    font-size: 0.75rem;
    color: #ffffff;
    /* padding: 0.6rem 5.5rem; */
    /* width:100% */
    width: 17.25rem;
  }
  .btndiv {
    width: 100%;
    margin-top: 0.9rem;
    text-align: center;
    /* padding: .9rem .78rem 0 .78rem */
  }
  .fee {
    color: #636363;
    font-size: 0.7rem;
  }
  .orange {
    font-size: 0.7rem;
    color: #e84518;
    padding: 0.5rem 0.78rem 0;
  }
</style>
<style>
  .cash-out .mint-cell {
    min-height: 2rem;
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
  }
</style>
