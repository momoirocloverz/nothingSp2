<template>
    <div class="selectRadiusCon">
        <mt-header title="选择查看范围" class="page-title">
          <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>
        <div>
            <mt-cell title="选择范围" is-link  @click.native="popNow"   :value="transText"></mt-cell>
        </div>
        <mt-popup v-model="popupVisible"  position="bottom" popup-transition="popup-fade">
            <mt-radio
              align="right"
              v-model="value"
              :options="options">
            </mt-radio>
        </mt-popup>
        <div class="page-bottom">
            <div class="bottom-btn" @click="handleSubmit">提交</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'SelectRadius',       
        data () {
            return {
                popupVisible:false,
                value:'10',
                transText:'10km',
                options:[
                    {
                        label: '10km',
                        value: '10'
                    },
                    {
                        label: '5km',
                        value: '5'
                    },
                    {
                        label: '3km',
                        value: '3'
                    },
                ],
            }
        },
        watch:{
            value:function(nval,val){
                this.popupVisible = false;
                this.transText = `${nval}km`;
            },
        },
        mounted(){
            this.transText = `${this.$route.query.radius}km`;
            this.value = `${this.$route.query.radius}`;
        },
        methods:{
            popNow(){
                this.popupVisible = true;
            },
            handleSubmit(){
                this.popupVisible = false;
                this.$router.go(-1);
                sessionStorage.setItem('mapRadius',this.value);
            },
            handleBack(){
                this.$router.go(-1);                
            },
        }
    }
</script>
<style lang="scss" scoped>
    .selectRadiusCon {
        height: 100vh;
        background-color: #F5F5F5;
        .page-bottom {
          position: fixed;
          width: 100%;
          box-sizing: border-box;
          height: convertToVw(68);
          bottom: 0;
          left: 0;
          padding: convertToVw(10) convertToVw(18);
          background-color: #fff;
        }
        .bottom-btn {
          height: convertToVw(48);
          font-size: convertToVw(17);
          line-height: convertToVw(48);
          border-radius: convertToVw(5);
          color: #fff;
          background-color: #ea441a;
          text-align: center;
        }
    }
</style>
<style lang="scss" >    
    .mint-header.is-fixed {
        top: 0;
        right: 0;
        left: 0;
        position: fixed;
        z-index: 99;
    }
    .mint-header{
        height: 2.2rem;
    }
    .mint-header-title{
        font-size: 0.9rem;
    }
</style>