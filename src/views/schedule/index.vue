<template>
    <div>
        <mt-header title="排班" fixed>
            <!--<router-link to="/" slot="left">-->
                <!--<mt-button icon="back">返回</mt-button>-->
            <!--</router-link>-->
            <router-link to="/" slot="right">
                <mt-button class="plus"><span>+</span></mt-button>
            </router-link>
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>

        <div class="container"  style="background-color: #F5F5F5;">
            <!--<mt-search class="searchClass"-->
            <!--autofocus-->
            <!--v-model="value"-->
             <!--placeholder="请输入项目经理姓名搜索"-->
            <!--:result="filterResult">-->
            <!--</mt-search>-->
            <div class="search-container">
                <span><img src="../../assets/img/search@3x.png" class="search-icon"/></span>
                <input type="search" class="searchInput" placeholder="请输入项目经理姓名搜索" >
            </div>
            <div class="card-container">
                <div class="card-header">
                    <span class="name">张三9090</span>
                    <span class="tag">月结</span>
                </div>
                <div class="card-body">
                    <div class="card-body-item">
                        <span class="body-label">手机号：</span>
                        <span class="tel">13766778899</span>
                    </div>
                    <div class="card-body-item">
                        <span class="body-label">合作开始时间：</span>
                        <span class="body-value">2018-09-09</span>
                    </div>

                </div>
                <div class="splitline"></div>

                <div class="card-footer ">
                    <div class="btn-group">
                    <mt-button type="default" class="footerBtn">启用</mt-button>
                    <mt-button type="default" class="footerBtn">停用</mt-button>
                    </div>

                </div>
            </div>


        </div>

    </div>
</template>
<style scoped>
    input{border:0;outline:none;}
    .search-container{
        margin:0.45rem 0.75rem;
        position: relative;
        background-color: #ffffff;
        border-radius: 0.83rem;
    }
    .search-icon{
        width: 1.05rem;
        height: 1.05rem;
        vertical-align: middle;
        margin:0.4rem;
    }
    .searchInput{
        width:80%;
        background-color: #ffffff;
        border-radius: 0.83rem;
        border:#ffffff;
        height: 34px;
        font-size: 12px;
    }
    .card-container{
        background-color: white;
        margin-bottom:0.25rem ;
    }

    .card-header{
        padding:  0 0.75rem;
       padding-top: 0.43rem;
    }
    .card-container span{
        display: inline-block;
    }
    .name{
        font-family: PingFang-SC-Medium;
        font-size: 1rem;
    }
    .card-body{
        margin: 0.85rem 0;
        padding: 0 0.75rem ;
    }
    .card-body-item{
        margin-top: 0.73rem;
    }
    .tag{
        display: inline-block;
        padding:0.15rem 0.45rem;
        background-color: #f5f5f5;
        border-radius: 0.2rem;
        font-family: PingFang-SC-Regular;
        font-size: 0.6rem;
        color: #636363;
        text-align: center;
        margin-left: 0.98rem;
    }
    .btn-group{
        float: right;
        padding-bottom: 0.43rem;
    }
    .body-label{
        font-family: PingFang-SC-Medium;
        font-size: 0.65rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0.22rem;
        letter-spacing: 0.01rem;
        color: #0d0d0d;
    }
    .body-value{
        font-family: PingFang-SC-Regular;
        font-size: 0.65rem;
        font-weight: normal;
        letter-spacing: 0.01rem;
        color: #636363;
    }
    .tel{
        font-family: PingFang-SC-Regular;
        font-size: 0.65rem;
        font-weight: normal;
        letter-spacing: 0.01rem;
        color: #1e8dff;
    }
    .footerBtn {
        width: 4.45rem;
        height: 1.65rem;
        border-radius: 0.83rem;
        border: solid 0.03rem #e84518;
        font-size: 0.6rem;
        color: #d6522d;
        background: #fff;
    }
    .card-footer{
        margin:0.4rem 0;
        overflow:hidden;
        padding: 0 0.75rem ;
    }



    .plus{
        font-size: 30px;
    }
    .searchClass{
        /*position: absolute;*/
        /*top:2.2rem;*/
        width: 100%;
        /*background-color: #ffffff;*/
    }
    .mint-searchbar{
        padding: 0 !important;
        margin: 0.45rem 0.75rem !important;
    }
    .cardList{

    }
</style>
<script>
  import MtButton from "../../../node_modules/mint-ui/packages/button/src/button.vue";
  import { MessageBox } from 'mint-ui';

  export default {
    name: "",
    components: {MtButton},
    data() {
      return {
        msg: "Hello Vue.js"
      }
    },
    watch() {

    },
    methods: {
      click(){
        MessageBox({
          title: '您需要先完善个人信息才能签协议',
          message: '您需要先完善个人信息才能签协议?',
          showCancelButton: true
        });
      }
    }
  }
</script>

