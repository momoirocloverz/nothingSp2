<template>
    <div class="box">
        <mt-header title="我的保单" fixed class="mint-header-title">
            <div slot="left">
                <mt-button icon="back" @click="$router.go(-1)"></mt-button>
            </div>
        </mt-header>
        <mt-navbar class="page-part" :selected.sync="selected" v-model="tabs">
            <mt-tab-item id="1">保障中</mt-tab-item>
            <mt-tab-item id="2">待生效</mt-tab-item>
            <mt-tab-item id="3">已失效</mt-tab-item>
        </mt-navbar>
        <mt-tab-container :active.sync="selected" v-model="tabs">
            <mt-tab-container-item id="1">
                <!-- <p style="padding:7px 0 7px 12px;font-size:13px;">理赔流程介绍。<span style="color:#E95A34;" @click="goToCheckImg">了解一下</span></p> -->
                <div style="background: #ffffff;margin-bottom:15px;margin-top:10px;height: 9.6rem;display: flex;flex-direction: column;" v-for="item in dataList1">
                    <div class="BZ" @click="goToCheckImg">
                    <p class="p-pos">人身意外险 <span class="span-posa">查看细则</span></p>
                    <p><span>被保人：</span><span>{{item.talentName}}</span></p>
                    <p><span>保障时间：</span><span>{{item.policyTime}}</span></p>
                    <p style="border-bottom: 1px solid #D9D9D9;padding-bottom: 16px;"><span>保单号：</span><span>{{item.policyNo}}</span></p>
                    </div>
                    <div class="btn">
                        <span></span>
                        <button @click="callPhone()">拨打理赔电话</button>
                    </div>
                </div>
                <div style="margin-top:80px;margin-left:150px;font-size:13px;color:#6E7075;" v-if="dataList1.length==0?true:false">暂无相关信息</div>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <dai-effect></dai-effect>
            </mt-tab-container-item>
            <mt-tab-container-item id="3">
                <yi-effect></yi-effect>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import daiEffect from './daiEffect.vue'
import yiEffect from './yiEffect.vue'
export default {
    components: {
        daiEffect,yiEffect
    },
    data(){
        return {
            selected: true,
            tabs: '1',
            talentId: '',
            dataList1: [],
            moblie:'0571-86850115',//人保联系电话
        }
    },
    mounted(){
        this.getMobile()
        this.isVisible()
        this.getData1()
    },
    methods: {
        callPhone () {
            window.location.href = 'tel:' + this.moblie
        },
        // 获取客服微信
        getMobile() {
            let _this = this;
            this.$api.getMobile()
                .then(res => {
                    _this.moblie = res.data.data || '0571-86850115';
                })
                .catch(err => {
                    console.log(err)
                })
        },
        isVisible(){
            let showtip = localStorage.getItem('stopInsuranceTip');
            let isShowRule = sessionStorage.getItem('isShowRule')
            if(showtip == undefined && isShowRule){
                MessageBox({
                title: '保险规则说明',
                message: '<p class="t-insu">被保险人应在事故发生后48小时内联系保险客服报案，如果超出48小时报案导致保险方无法核实事故真实情况，则保险方有权拒赔！</p>' + '\n'
                    + '<p class="t-insu">如果在保险有效期内发生交通事故，必须提供交警事故认定书原件，否则保险方有权拒赔！</p>',
                showCancelButton: true,
                cancelButtonText: '以后不再提示',
                confirmButtonText: '知道了',
                }).then(action => {
                    if(action == 'confirm'){

                    }
                    if(action == 'cancel'){
                        localStorage.setItem('' +
                            'stopInsuranceTip', 'true')
                    }
                });
            }
        },
        getData1(){
          const params = {
              policyStatus: 1,
              talentId: this.talentId
          }
          this.$api.insuList(params).then(res => {
            //   console.log(res)
            if(res.data.respCode == 0){
                if(res.data.data){
                    this.dataList1 = res.data.data.list || []
                }
            }
          }).catch()
      },
      goToCheckImg(){
          this.$router.push({ name: 'checkImg' })
      }
    },
    created(){
        this.talentId = JSON.parse(sessionStorage.getItem('userInfo')).talentId
        // this.isVisible()
        // console.log(JSON.parse(sessionStorage.getItem('userInfo')).talentId)
    },
    beforeRouteEnter(to, from, next) {
        if(from.name== 'WorkSpace'){
            sessionStorage.setItem('isShowRule','true')
        }else{
            sessionStorage.removeItem('isShowRule')
        }
        next()
    }
}
</script>
<style>
    .p-pos{
        position: relative;
    }
    .t-insu{
        text-align: justify;
        line-height: 1.5;
        font-size:.7rem;
        color:#D53D17;
    }
    .span-posa{
        position: absolute;
        right: 0.75rem;
        font-size:.7rem;
        color: #D53D17;
        padding:0.12rem .35rem;
        border-radius:.1rem;
        border:1px solid #D53D17;
    }
.mint-msgbox-message{
    text-align: left !important;
    line-height: 26px !important;
}
</style>

<style scoped>
.mint-header.is-fixed{
    position: fixed;
    z-index: 99;
}
.mint-tab-item-label{
    font-size: 0.75rem;
}
.mint-navbar{
    border-top: 0.05rem solid #D9D9D9;
    position: relative;
    z-index: 1;
}
.box{
    min-height: 49rem;
    height:auto;
    background: #F5F5F5;
    padding-top: 2rem;
}
.BZ{
    /* height: 6.7rem; */
    padding: 1rem 0 0 0.75rem;
    box-sizing: border-box;
    background: #ffffff;
}
.BZ p{
    color: #1E1F21;
}
.btn{
    padding: 1.1rem 0.75rem;
    height: 2.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.btn button {
    padding: 0.3rem 0.6rem;
    border:0.05rem solid rgba(213,61,23,1);
    border-radius:0.15rem; 
    color:#D53D17;
    background: #ffffff;
    /* margin-top: 0.6rem; */
}
.BZ p:first-child{
    font-size: 0.85rem;
}
.BZ p:nth-child(2),.BZ p:nth-child(3){
    margin: 0.4rem 0;
}
.BZ p:nth-child(2) span:first-child,.BZ p:nth-child(3) span:first-child,.BZ p:nth-child(4) span:first-child{
    color: #6E7075;
    font-size: 0.65rem;
}
.BZ p:nth-child(2) span:last-child,.BZ p:nth-child(3) span:last-child,.BZ p:nth-child(4) span:last-child{
    font-size: 0.65rem;
}
/* .BZ p:last-child{
    border-bottom: 0.05rem solid #D9D9D9;
    padding-bottom: 16px;
} */
.id3_p{
padding:0.5rem 0 0.5rem 0.75rem;
background:#ffffff;
border-top:0.05rem solid #D9D9D9;
border-bottom:0.05rem solid #D9D9D9;
color:#6E7075;
margin-bottom: 0.5rem;
position: relative;
}
.id3_p i{
display: inline-block;
width: 0.35rem;
height: 0.25rem;
background-image: url(../../assets/img/down1.png);
background-size: cover;
position: absolute;
top: 0.9rem;
left: 2.5rem;
}
</style>
