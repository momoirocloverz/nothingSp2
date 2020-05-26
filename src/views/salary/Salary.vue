<template>
  <div class="salaryContainer">
    <mt-header title="收入合计" fixed class="mint-header-title">
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)"></mt-button>
      </div>
    </mt-header>
    <div class="contentCon">
      <div>
        <div class="itemCon " v-for="(item,index) in billInfo" :key="index">
          <div class="top flex setMargin">
            <div class="late flex">
              <!-- <span class="black">2018-12-05</span> -->
              <span class="recordDate">{{item.recordDate}}</span>
              <div class="tag">{{item | forType}}</div>
            </div>
          </div>
          <div class="text flex setMargin">
            <div class="textBox flex divide ">
              <div class="leftTxt">上班时间：</div>
              <div class="rightText">{{item.workStartDate | forDate}} {{item.workStartTime | forTime}}</div>
              <!--<div class="rightText">{{item.workStartDate == item.schedulingDate ? '当日' : '次日'}}{{item.workStartTime | forTime}}</div>-->
            </div>
            <div class="textBox flex divide">
              <span class="leftTxt">下班时间：</span>
              <span class="rightText">{{item.workEndDate | forDate}} {{item.workEndTime | forTime}}</span>
              <!--<span class="rightText">{{item.workEndDate == item.schedulingDate ? '当日' : '次日'}}{{item.workEndTime | forTime}}</span>-->
            </div>
          </div>
          <div class="text flex setMargin">
            
            <div class="textBox flex divide">
              <div class="leftTxt">工时：</div>
              <div class="rightText">{{item.workHours}}小时</div>
            </div>
              <div class="textBox flex divide">
              <div class="leftTxt">收入：</div>
              <div class="rightText">{{item.amount | priceFormat}}</div>
            </div>
          </div>
          <div class="text flex setMargin">

            <div class="textBox flex ">
              <span class="leftTxt">计件量：</span>
              <span class="rightText">{{item.pieceSize | formatPieceSize1}}</span>
            </div>
          </div>
          <div class="text flex ">
            <div class="textBox flex wrap">
              <div class="leftTxt limitWidth">单价：</div>
<!--              <div class="rightText limitRight" v-if="item.isDailyPay == 1">{{item.dailyPayAmount}}/天</div>-->
              <div class="rightText limitRight" >{{item | formatPrice}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Util from '../../common/util.js'
export default {
  name: "Salary",
  data() {
    return {
      billInfo: {},
      hasNextPage: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
      getList() {
          const params = this.$route.query;          
          this.$api.salaryDetailList(params).then((res) => {
              let { data:layer1 } = res;
              let { data,respCode } = layer1;
              if( respCode === 0 ){
                  if( data.list ){
                      this.billInfo = data.list;
                  }else{
                      this.billInfo = [];
                  }
              }
          }).catch((error) => {
              console.log(error);
          });
      },
  },
  filters: {
    forTime(val) {
      if (val) {
        return val.substring(0, 5)
      }
    },
    forDate(val) {
      if (val) {
        return val.substring(5)
      }
    },
    formatPieceSize1(val) {
      if (val) {
        if (Util.formatPieceSize(val) == '') {
          return '无'
        } else {
          return Util.formatPieceSize(val)
        }
      } else {
        return '无'
      }
    },
      priceFormat:function(val){
                if( (toString.call(val) === '[object Null]')||(toString.call(val) === '[object Undefined]')  ){
                   return 0;
                }else{
                    let fix = (Math.round(+val + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },
    formatPrice(val) {
      let salary = JSON.parse(val.salary)
      let type = val.settlementType == 4 ? 1 : val.settlementType
      for (let i in salary) {
        if (salary[i].settlementType == type) {
          for (let j in salary[i].price) {
            if (((salary[i].price)[j]).sex == val.sex || ((salary[i].price)[j]).sex == '3') {
              let item = (salary[i].price)[j]
              let content = ''
              if (salary[i].valuationType == 1) {
                content = `${item.countTime}元/小时`
              } else if (salary[i].valuationType == 2) {
                if (salary[i].unit == 1) {
                  content = `${item.countSettle}元/件`
                } else if (salary[i].unit == 2) {
                  content = `${item.countDai}元/袋`
                } else if (salary[i].unit == 3) {
                  content = `${item.countChe}元/车`
                } else {
                  content = `${item.countDun}元/吨`
                }
              } else if (salary[i].valuationType == 3) {
                let varUnit
                if (salary[i].unit == 1) {
                  varUnit = '件'
                } else if (salary[i].unit == 2) {
                  varUnit = '袋'
                } else if (salary[i].unit == 3) {
                  varUnit = '车'
                } else {
                  varUnit = '吨'
                }
                content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                for (let z in item.ladderObj) {
                  if (z > 0 && z != (item.ladderObj.length - 1)) {
                    content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`

                  }
                }
                content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
              } else if (salary[i].valuationType == 4) {
                if (item.countSettle) {
                  content += `${item.countSettle}元/件,`
                } if (item.countDai) {
                  content += `${item.countDai}元/袋,`
                } if (item.countChe) {
                  content += `${item.countChe}元/车,`
                } if (item.countDun) {
                  content += `${item.countDun}元/吨`
                }
              } else if (salary[i].valuationType == 5) {

                if (salary[i].unit == 1) {
                  content += `${item.countSettle}元/件，`
                } else if (salary[i].unit == 2) {
                  content += `${item.countDai}元/袋，`
                } else if (salary[i].unit == 3) {
                  content += `${item.countChe}元/车，`
                } else {
                  content += `${item.countDun}元/吨，`
                }
                content += `${item.countTime}元/小时`
              } else if (salary[i].valuationType == 6) {
                content += `${item.countTime}元/小时,`
                let varUnit
                if (salary[i].unit == 1) {
                  varUnit = '件'
                } else if (salary[i].unit == 2) {
                  varUnit = '袋'
                } else if (salary[i].unit == 3) {
                  varUnit = '车'
                } else {
                  varUnit = '吨'
                }
                content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                for (let z in item.ladderObj) {
                  if (z > 0 && z != (item.ladderObj.length - 1)) {
                    content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`

                  }
                }
                content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
              } else if (salary[i].valuationType == 8) {
                content += `${item.countFixed}元/天`
              } else {

                if (item.countSettle) {
                  content += `${item.countSettle}元/件,`
                } if (item.countDai) {
                  content += `${item.countDai}元/袋,`
                } if (item.countChe) {
                  content += `${item.countChe}元/车,`
                } if (item.countDun) {
                  content += `${item.countDun}元/吨,`
                }
                content += `${item.countTime}元/小时`
              }
              return content
            }
          }

        }

      }        
    },
    forType(val) {
      if (val.isDailyPay == 1) {
        return '日固定'
      } else {
        let salary = JSON.parse(val.salary)
        let type = val.settlementType == 4 ? 1 : val.settlementType
        for (let i in salary) {
          if (salary[i].settlementType == type) {
            for (let j in salary[i].price) {
              if (((salary[i].price)[j]).sex == val.sex || ((salary[i].price)[j]).sex == '3') {
                console.log((salary[i].price)[j])
                let item = (salary[i].price)[j]
                let content = ''
                if (salary[i].valuationType == 1) {
                  content = `计时`
                } else if (salary[i].valuationType == 2 || salary[i].valuationType == 3 || salary[i].valuationType == 4) {
                  content = `计量`
                } else if (salary[i].valuationType == 8) {
                  content = '日固定'
                } else {
                  content = `计时 + 计量`
                }
                return content
              }
            }
          }
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
    .salaryContainer {
        width:100%;
        height:100vh;  
        box-sizing: border-box;
        padding-top: convertToVw(54);
        background-color:#f5f5f5;
    }    
    .itemCon {
        background-color: #fff;
        box-sizing: border-box;
        border-bottom: 1px solid #D9D9D9;
        border-top: 1px solid #D9D9D9;
        padding-left: convertToVw(15);
        padding-right: convertToVw(15);
        padding-top:convertToVw(8); 
        padding-bottom:convertToVw(8);  
        margin-bottom: convertToVw20;  
    }
.top {
  justify-content: space-between;
}
.bottom {
  justify-content: flex-end;
  padding: 0.38rem 0;
  /* height: 2.38rem; */
}
.black {
  font-size: 0.9rem;
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
    height: convertToVw(18);
    border: 1px solid #15BC83;
    color: #15BC83;
    padding-left: convertToVw(8);
    padding-right: convertToVw(8);
    box-sizing: border-box;
    font-size: convertToVw(13);
    line-height: convertToVw(18);
    text-align: center; 
}
.right {
  width: 0.25rem;
  height: 0.43rem;
}
.detailBox {
  justify-content: flex-start;
  align-items: center;
}
    .limitWidth {
        width:  2.3rem;
    }
    .limitRight {
        width: calc( 100% - 2.3rem );
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
.back {
  color: #e84518;
}
.left {
  font-size: 0.6rem;
  color: #0d0d0d;
}

.text {
  justify-content: flex-start;
}
.textBox {
  justify-content: flex-start;
  align-items: center;
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
.view {
  width: 18px;
  height: 18px;
}
.leftTxt {
  font-size: convertToVw(13);
  color: #6E7075;
}
    .rightText {
  font-size: convertToVw(13);
  color: #1E1F21;
}

    .divide {
        width: 50%;
    }
    .recordDate {
        font-size: convertToVw(17);
        color: #1E1F21;
        margin-right: convertToVw(8);
    }
    .setMargin {
        margin-bottom: convertToVw(3);
    }
    .wrap {
        flex-wrap: wrap;
    }
    
.text1 {
  text-align: center;
  color: #636363;
  font-size: 0.6rem;
}
</style>