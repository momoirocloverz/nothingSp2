<template>
  <div style="width:100%;height:100%;background:#f5f5f5">
    <mt-header title="奖惩" fixed class="mint-header-title">
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)"></mt-button>
      </div>
      <img src="../../assets/img/add@3x.png" alt="查看" slot="right" class="view" @click="$router.push({name:'addRNP',query:{id:$route.query.id,classTaskId:$route.query.classTaskId}})">
    </mt-header>
    <div class="gray pt">
      <div class="textNone" v-if="show">暂无相关奖惩信息</div>
      <div class="white " v-for="(item,index) in data">
        <div>
          <div class="top flexable">
            <div class="late flexable">
              <span class="black">{{item.rewardPunishTypeName}}-{{item.note}}</span>
              <div class="tag unCheck" v-if="item.status == 1">待审批</div>
              <div class="tag checked" v-if="item.status == 2">已同意</div>
              <div class="tag back" v-if="item.status == 3">已驳回</div>
              <div class="tag back" v-if="item.status == 4">已撤回</div>
              <div class="tag back" v-if="item.status == 5">已撤销</div>
            </div>
            <!-- <div class="date">2018-11</div> -->
            <div class="date" v-if="item.type < 0">{{item.amount}}</div>
            <div class="date2" v-if="item.type > 0">+{{item.amount}}</div>
          </div>
          <div class="text flexable">

            <div class="textBox flexable obj">
              <span class="left">奖惩对象：</span>
              <span class="rightText">{{item.talentName}}</span>
            </div>
            <div class="textBox flexable">
              <div class="left">提交日期：</div>
              <div class="rightText">{{(item.createdAt).substring(0,10)}}</div>
            </div>
            <div class="textBox flexable">
              <span class="left">奖惩收入批次：</span>
              <span class="rightText">{{item.batchNumber | formatterBatch}} {{item.payTypeName}}</span>
            </div>

          </div>
        </div>
        <div class="line" v-if="item.status == 1"></div>
        <div class="bottom flexable" v-if="item.status == 1">
          <!-- <mt-button type="default" class="codeBtn1" @click="agreeItem(item)">同意</mt-button> -->
          <!-- <mt-button type="default" class="codeBtn" @click="backItem(item)">撤销</mt-button> -->
          <mt-button type="default" class="codeBtn" @click="backItem(item)">撤回</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RNPList",
  data() {
    return {
      data: [],
      page: 1,
      show: false
    }
  },
  filters:{
    formatterBatch(value){
      if(value.includes('至')){
        let str = value.substr(-10,value.length);
        let timeStr = str.substr(-2,str.length);
        let startStr = str.substr(0,8);
        if(timeStr >= 1 && timeStr <= 7){
          return startStr + '第一周'
        }else if(timeStr >= 8 && timeStr <= 14){
          return startStr + '第二周'
        }else if(timeStr >= 15 && timeStr <= 21){
          return startStr + '第三周'
        }else if(timeStr >= 22 && timeStr <= 28){
          return startStr + '第四周'
        }else{
          return startStr + '第五周'
        }
      }else{
        return value
      }
    }
  },
  methods: {
    getInfo() {
      const params = {
        pageNum: this.page,
        pageSize: 20,
      };
      this.$api
        .getRNP(params)
        .then(response => {
          console.log(response);
          if (response.data.data.list) {
            this.data = response.data.data.list
            this.show = false
          } else {
            this.show = true
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    backItem(item) {
      this.$messagebox({
        title: `提示`,
        message: '确认该操作？',
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      }).then(action => {
        if (action == 'confirm') {     //确认的回调
          const params = {
            rewardpunishmentsId: item.id,
            status: 4,
          };
          this.$api
            .handleRNP(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.getInfo()
                this.$toast('操作成功!')
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      }).catch(err => {
        if (err == 'cancel') {     //取消的回调
          console.log(2);
        }

      })
    },
    agreeItem(item) {
      this.$messagebox({
        title: `提示`,
        message: '确认该操作？',
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      }).then(action => {
        if (action == 'confirm') {     //确认的回调
          const params = {
            rewardpunishmentsId: item.id,
            status: 2,
          };
          this.$api
            .handleRNP(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.getInfo()
                this.$toast('操作成功!')
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      }).catch(err => {
        if (err == 'cancel') {     //取消的回调
          console.log(2);
        }

      })
    },
  },
  mounted() {
    this.getInfo()
  }
}
</script>

<style scoped>
.info {
  font-size: 0.6rem;
  color: #636363;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
  padding: 0.48rem 0;
}
.white {
  width: 100%;
  background: #fff;
  margin-bottom: 0.25rem;
}
.gray {
  width: 100%;
  background: #f5f5f5;
}
.top {
  justify-content: space-between;
  width: 90%;
  margin: 0 auto 0;
  height: 2.38rem;
}
.bottom {
  justify-content: flex-end;
  width: 90%;
  margin: 0 auto;
  padding: 0.38rem 0;
  /* height: 2.38rem; */
}
.black {
  font-size: 0.8rem;
  color: #0d0d0d;
  margin-right: 0.5rem;
}
.date {
  color: #e84518;
  line-height: 2.38rem;
}
.date2 {
  color: #3cca54;
  line-height: 2.38rem;
}
.moneyText {
  font-size: 0.65rem;
  color: #0d0d0d;
}
.money {
  font-size: 0.65rem;
  color: #636363;
}
.line {
  height: 1px;
  background: #e5e5e5;
}
.moneyBox {
  justify-content: flex-start;
  align-items: center;
}
.tag {
  font-size: 0.6rem;
  padding: 0.38rem 0.45rem;
  background: #f5f5f5;
  margin-left: 0.25rem;
  border-radius: 0.2rem;
}
.right {
  width: 0.25rem;
  height: 0.43rem;
}
.detailBox {
  justify-content: flex-start;
  align-items: center;
}
.detail {
  color: #026bf9;
  margin-right: 0.57rem;
}
.late {
  justify-content: flex-start;
  align-items: center;
}
.unCheck {
  color: #026bf9;
}
.checked {
  color: #3cca54;
}
.back {
  color: #e84518;
}
.left {
  font-size: 0.6rem;
  color: #0d0d0d;
}
.rightText {
  font-size: 0.6rem;
  color: #636363;
}
.text {
  justify-content: space-between;
  width: 90%;
  margin: 0 auto 0.75rem;
  flex-wrap: wrap;
}
.obj {
  margin-right: 0.5rem;
}
.textBox {
  justify-content: flex-start;
  margin-bottom: 0.5rem;
}
.codeBtn {
  /* width: 4.25rem; */
  height: 1.68rem;
  border-radius: 0.82rem;
  border: solid 0.03rem #e84518;
  font-size: 0.6rem;
  color: #d6522d;
  background: #fff;
}
.codeBtn1 {
  /* width: 4.25rem; */
  height: 1.68rem;
  border-radius: 0.82rem;
  border: solid 0.03rem #e84518;
  font-size: 0.6rem;
  color: #d6522d;
  background: #fff;
  margin-right: 0.5rem;
}
.pt {
  padding-top: 2rem;
}
.view {
  width: 18px;
  height: 18px;
}
.textNone {
  text-align: center;
  color: #636363;
  /* position: absolute;
    top:50%;
    left:50% */
  margin-top: 5rem;
}
</style>