<template>
    <div class="salaryTabCon" style="width:100%;height:100%">
        <mt-header title="收入" fixed class="mint-header-title">
            <div slot="left">
                <mt-button icon="back" @click="$router.go(-1)"></mt-button>
            </div>
        </mt-header>
        <div class="box">
            <mt-navbar v-model="selected" fixed>
                <mt-tab-item id="1">待发放</mt-tab-item>
                <mt-tab-item id="2">已发放</mt-tab-item>
            </mt-navbar>
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1">
                    <Unlanuch v-if="selected == 1"/>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <Lanuched v-if="selected == 2"/>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
        <bindCardDialog v-if="isShow" @controlShow="showBridge"></bindCardDialog>
    </div>
</template>
<script>
    import Unlanuch from './Unlanuch'
    import Lanuched from './Lanuched'
    import bindCardDialog from '@/components/bindCardDialog.vue';

    export default {
        name: "salaryTab",
        components: {
            Unlanuch,
            Lanuched,
            bindCardDialog,
        },
        data() {
            return {
                selected: '1',
                bankCardBindingStatus: false,
                isShow: false,
            }
        },
        created() {
            this.getAccountDetail()
        },
        methods: {
            checkIsHaveInCome() {
                let _this= this;
                this.$api.isHaveInCome().then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        if(data == 1){
                            let userId = localStorage.getItem('haveInComeTimeMatch');
                            let currentUser = JSON.parse(sessionStorage.getItem("userInfo")).userId;
                            let haveInComeTimeStamp = localStorage.getItem( 'haveInComeTimeStamp' );
                            //产生收入
                            if (currentUser == userId) {
                                if (haveInComeTimeStamp) {
                                    let numFormat = Number(haveInComeTimeStamp);
                                    let now = Date.now();
                                    console.log(numFormat)
                                    console.log(now)
                                    if ((now - numFormat) >= 24 * 3600 * 1000) {//24 * 3600 * 1000
                                        _this.isShow = true;
                                    } else {
                                        _this.isShow = false;
                                    }
                                }
                            }else{
                                _this.isShow = true;
                            }
                        }

                        // localStorage.setItem( 'haveInCome',data );
                    }
                }).catch(err => {
                    console.log('err', err)
                })
            },
            showBridge(val) {
                this.isShow = val.show;
            },
            getAccountDetail() {
                this.$api.AccountDetail().then(res => {
                    let {data, respCode} = res.data;
                    if (respCode === 0) {
                        if (data.bankCardBindingStatus == 1) { //未绑定了
                            this.checkIsHaveInCome();
                        }
                        // this.bankCardBindingStatus = data.bankCardBindingStatus === 1 ? false : true;
                        // localStorage.setItem( 'haveInComeBankCardBindingStatus',JSON.stringify(this.bankCardBindingStatus) );
                    } else {
                        this.$toast({
                            message: '网络异常。',
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
        },
        beforeRouteEnter(to, from, next) {
            if ((from.name == 'SalaryBilled') || (from.name == 'collectionRecord')) {
                next(vm => {
                    vm.selected = '2';
                })
            } else {
                next(vm => {
                    vm.selected = '1';
                })
            }
        },
    }
</script>
<style scoped lang="scss">
    .box {
        padding-top: convertToVw(46);
        background: #f5f5f5;
        width: 100%;
        height: 100%;
    }
</style>
<style lang="scss">
    .salaryTabCon {
        .mint-navbar {
            height: convertToVw(46);
            border-bottom: 1px solid #D9D9D9;
        }

        .mint-navbar.is-fixed {
            top: 2rem;
        }

        .mint-navbar .mint-tab-item.is-selected {
            margin-bottom: 0;
        }

        .mint-tab-item-label {
            font-size: convertToVw(15);
            line-height: convertToVw(20);
        }
    }
</style>