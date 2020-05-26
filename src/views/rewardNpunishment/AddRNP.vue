<template>
  <div>
    <mt-header title="添加奖惩" fixed class="mint-header-title">
      <div slot="left">
        <mt-button icon="back" v-if="!show" @click="$router.go(-1)"></mt-button>
        <mt-button icon="back" v-if="show" @click="show = false"></mt-button>
      </div>
    </mt-header>
    <div style="padding-top:2rem" v-if="show">
      <div class="inputBOx">
        <mt-field v-model="value" class="searchinp">

        </mt-field>
        <img src="../../assets/img/search@3x.png" alt="搜索" class="searchImg">
      </div>
      <ul class="ulBoX">
        <!-- <li v-for="(item,index) in person" @click="choosed(item)">{{item.talentName}}</li> -->
        <li v-for="(item,index) in person" @click="choosed(item)">{{item.realNameAlias}}</li>
      </ul>
    </div>
    <div class="content_margin" v-if="!show">

      <mt-field label="奖惩对象" v-model="form.talentName" class="rText" placeholder="点击输入奖惩对象" @focus.native.capture="show = true">
      </mt-field>
      <mt-cell title="奖惩类型" @click.native.capture="nationVisible = true">
        <span class="ds">{{form.rewardPunishTypeName }}</span>
        <img src="../../assets/img/up@3x (2).png" alt="下拉" class="drop">
      </mt-cell>
      <mt-field label="奖惩事项" v-model="form.note" :attr="{ maxlength: 6 }" class="rText" placeholder="请输入奖惩事项">
      </mt-field>
      <mt-field class="num_salary" label="奖惩收入发放批次" readonly @click.native.capture="batchVisible = true">
        <div style="word-wrap:break-word;color:#888">{{date}}</div>
        <img src="../../assets/img/up@3x (2).png" alt="下拉" class="drop" v-if="date == ''">
      </mt-field>
      <mt-field label="金额" v-model="form.amount" class="rText" type="number" placeholder="请输入奖惩金额" @blur.native.capture="checkPwd" @input="replaceClear()">
        <span style="color:#888" v-if="reduce" class="reduce">（扣减）</span>
        <span style="color:#888" v-if="plus" class="reduce">（增加）</span>
        <span style="color:#888">元</span>
      </mt-field>
    </div>
    <div class="doneBox flexable" v-if="!show">
      <mt-button class="doneBtn1" @click="addItem" :disabled="isDisable">提交</mt-button>
    </div>
    <mt-popup v-model="nationVisible" position="bottom" class="mint-popup">
      <mt-picker :slots="nationList" :visible-item-count="5" :show-toolbar="true" ref="natitonPicker" value-key="dicName">
        <div @click="handleConfirm" class="sure">确认</div>
      </mt-picker>
    </mt-popup>
    <mt-popup v-model="batchVisible" position="bottom" class="mint-popup">
      <mt-picker :slots="batchList" :visible-item-count="5" :show-toolbar="true" ref="batchPicker">
        <div @click="batchConfirm" class="sure">确认</div>
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
export default {
  name: "AddRNP",
  data() {
    return {
      nationVisible: false,
      batchVisible: false,
      nationList: [
        {
          flex: 1,
          values: [
          ],
          className: "slot1",
          textAlign: "center",
        },

      ],
      batchList: [
        {
          flex: 1,
          values: [
          ],
          className: "slot1",
          textAlign: "center",
        },

      ],
      date: '',
      form: {},
      value: '',
      // 默认数据
      result: [
        {
          title: 'gfa',
          value: 1,
        },
        {
          title: 'gfaaa',
          value: 2,
        },
      ],
      show: false,
      person: [],
      talentId: '',
      plus: false,
      reduce: false,
      obj: {},
      isDisable: false,
      isCheck: true
    }
  },
  methods: {
    handleConfirm() {
      this.form.rewardPunishTypeName = this.$refs.natitonPicker.getValues()[0].dicName
      console.log(this.$refs.natitonPicker.getValues()[0].dicVal)
      if (parseInt(this.$refs.natitonPicker.getValues()[0].dicVal) < 0) {
        this.plus = false
        this.reduce = true
      } else {
        this.plus = true
        this.reduce = false
      }
      this.nationVisible = false
    },
    batchConfirm() {
      this.date = this.$refs.batchPicker.getValues()[0]
      this.batchVisible = false
    },
    getDate() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return year + "-" + month
    },
    addItem() {
      this.isDisable = true
      this.checkPwd()


      if (this.isCheck) {
        let managerId = sessionStorage.getItem('managerId')
        const params = {
          schedulingId: this.$route.query.id,
          commitType: 1,
          type: this.$refs.natitonPicker.getValues()[0].dicVal,
          note: this.form.note,
          amount: this.reduce ? `-${this.form.amount}` : this.form.amount,
          talentId: this.obj.talentId || this.talentId,
          talentName: this.obj.talentName || this.form.talentName,
          batchNumber: this.date,
          customerId: this.obj.customerId,
          managerId: this.obj.managerId || managerId,
          classTaskId:this.$route.query.classTaskId
        };
        this.$api
          .addRNP(params)
          .then(response => {
            console.log(response);
            if (response.data.respCode == 0) {
              this.$toast('添加成功')
              this.$router.go(-1)
            } else {
              this.$toast(response.data.errorMsg);
            }
          })
          .catch(error => {
            console.log(error);
            this.isDisable = false
          });
      }
    },
    getBatch() {
      let managerId = sessionStorage.getItem('managerId')
      const params = {
        schedulingId: this.$route.query.id,
        // talentId:this.form.amount,
        managerId: managerId,
        talentId: this.talentId,
      };
      // this.$api
      //   .getBatchRNP(params)
      //   .then(response => {
      //     console.log(response);
      //     if (response.data.respCode == 0) {
      //       this.batchList[0].values = response.data.data
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      this.$api
        .batchNumber(params)
        .then(response => {
          console.log(response);
          if (response.data.respCode == 0) {
            // let result = [];
            // for(let item of response.data.data){
            //   let _text = item.replace(/\*/g,' ')
            //   result.push(_text);
            // }
            this.batchList[0].values = response.data.data
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPerson() {
      let managerId = sessionStorage.getItem('managerId')
      const params = {
        pageNum: 1,
        pageSize: 0,
        schedulingId: this.$route.query.id,
        managerId: managerId,
        batchNumber: this.date,
        talentName: this.value
      };
      // this.$api
      //   .getPersonRNP(params)
      //   .then(response => {
      //     console.log(response);
      //     if (response.data.respCode == 0) {
      //       this.person = response.data.data.list
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      // 更换接口
      this.$api
        .punishTalentList(params)
        .then(response => {
          console.log(response);
          if (response.data.respCode == 0) {
            this.person = response.data.data.list
          }
        })
        .catch(error => {
          console.log(error);
        });

    },
    getDic() {
      this.$api
        .getDicList('rnpType', 0)
        .then(response => {
          console.log(response);
          if (response.data.respCode == 0) {
            this.nationList[0].values = response.data.data
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    choosed(item) {
      this.show = false
      this.form.talentName = item.talentName || item.realNameAlias
      this.talentId = item.talentId || item.id
      this.obj = item
      this.getBatch()
    },
    replaceClear(){
      if(this.form.amount.includes('-')){
        this.form.amount = this.form.amount.replace(/\-/g,"");
      }
    },
    checkPwd() {
      if (!this.form.amount) {
        this.$toast("金额不能为空");
        this.isCheck = false
        this.isDisable = false
        return false;
      } else {
        let reg = new RegExp(/^(([1-9]\d*)(\.\d{1,2})?|0\.[1-9]{1,2})$/);
        if (!reg.test(this.form.amount)) {
          this.$toast("请输入正确的金额");
          this.isCheck = false
        }else {
          this.isCheck = true
        }
      }
      this.isDisable = false
      console.log(this.isDisable)
    },
  },
  mounted() {
    // this.date = ts.getDate()
    this.getDic()
    this.getPerson()

  },
  watch: {
    value: function (val, old) {
      this.getPerson()
    }
  }
}
</script>

<style scoped>
.drop {
  width: 0.43rem;
  height: 0.25rem;
  display: block;
  margin-left: 0.48rem;
}
.sure {
  float: right;
  padding: 5px;
  color: #666;
  margin: 5px 5px 0 0;
}
.doneBox {
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 2.23rem 0 1.27rem;
}
.doneBtn1 {
  width: 3.45rem;
  height: 1.68rem;
  border-radius: 0.82rem;
  border: solid 1px #e84518;
  font-size: 0.65rem;
  color: #e84518;
  background: #fff;
}
.ulBoX {
  padding: 20px;
}
.ulBoX li {
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  padding: 10px 0;
}
li:first-child {
  border-top: none;
}
.inputBOx {
  position: relative;
}
.searchImg {
  width: 1.05rem;
  height: 1.05rem;
  position: absolute;
  top: 20px;
  left: 10px;
}
.reduce {
  position: absolute;
  top: 3px;
  left: -13.5rem;
  color: rgb(136, 136, 136);
  font-size: 0.7rem;
}
.rText {
  position: relative;
}
.ds {
  color: rgb(136, 136, 136);
  font-size: 0.7rem;
}
</style>