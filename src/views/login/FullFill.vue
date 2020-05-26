<template>
    <div class="full-fill">
        <mt-header title="完善信息" fixed class="mint-header-title">
            <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>

        <div class="form-div">
            <mt-field label="民族" :value="nation" readonly></mt-field>
            <mt-field v-if="address" label="户籍地址" :value="address" readonly class="address"></mt-field>
            <mt-field v-if="!address" label="户籍地址" placeholder="请输入户籍地址" v-model="address"></mt-field>
        </div>

        <div class="form-div">
            <mt-field label="现住城市" placeholder="请选择" v-model="position" readonly @click.native="handlerArea"></mt-field>
            <mt-field label="现住详细地址" placeholder="请输入现住地址" v-model="realAddress"></mt-field>
        </div>

        <div class="form-div">
            <mt-field label="紧急联系人姓名" placeholder="发生特殊情况能替您处理的人" v-model="contractName"></mt-field>
            <mt-field label="联系人手机" placeholder="请输入可以联系的电话" v-model="contractPhone"></mt-field>
            <mt-field label="联系人关系" placeholder="例如：夫妻、父子、同事等" v-model="contractRelationship"></mt-field>
        </div>

        <div class="btn-zone">
            <div class="btn" @click="signAccount">提交</div>
        </div>

        <mt-popup v-model="areaVisible" class="area-class" position="bottom">
            <mt-picker :slots="slots" @change="onValuesChange" value-key="dicName" :show-toolbar="true" ref="areaPicker"
                       :visible-item-count="5">
                <div @click="handleConfirm" class="sure">确认</div>
            </mt-picker>
        </mt-popup>
    </div>
</template>

<script>
    export default {
        name: 'fullfill',
        components: {},
        data() {
            return {
                userId: '',
                mobile: '',
                bizToken: '',
                areaVisible: false,
                nation: '',
                position: '',
                address: '',
                realAddress: '',
                contractName: '',
                contractPhone: '',
                userInfo: {},

                province: '',
                city: '',
                area: '',
                provinceCode: '',
                cityCode: '',
                areaCode: '',
                bankCardBindingStatus:false,
                contractRelationship: '',
                slots: [
                    {
                        flex: 1,
                        values: [], //省份数组
                        className: 'slot1',
                        textAlign: 'center',
                    },
                    //分隔符
                    {
                        divider: true,
                        content: '',
                        className: 'slot2'
                    },
                    //市
                    {
                        flex: 1,
                        values: [],//北京市
                        className: 'slot3',
                        textAlign: 'center'
                    },
                    {
                        divider: true,
                        content: '',
                        className: 'slot4'
                    },
                    //县
                    {
                        flex: 1,
                        values: [],//北京市
                        className: 'slot5',
                        textAlign: 'center'
                    }
                ],
            };
        },

        computed: {},

        mounted() {
            this.getStatus()
            this.getStorage()
            this.getProList('0')
            this.getCityList('110000')
            this.getAreaList('110100')
            console.log(this.province)
        },

        watch: {
            areaVisible: function (val, oldval) {
                if (val) {
                    this.closeTouch()
                } else {
                    this.openTouch()
                }
            },
            provinceCode: function (val, oldval) {
                if (val) {
                    this.getCityList(val)
                }
            },
            cityCode: function (val, oldval) {
                if (val) {
                    this.getAreaList(val)
                }
            },
        },
        methods: {
            handleBack() {
                // this.$router.push({ name: 'userregister' })
                this.$router.go(-1);
            },
            getStatus() {
                this.$api.AccountDetail().then(res => {
                    let { data,respCode } = res.data;
                    if( respCode === 0 ){
                        this.bankCardBindingStatus = data.bankCardBindingStatus === 1 ? false : true;
                    }else{
                        this.$toast({
                            message: '网络异常。',
                        });
                    }
                })
                    .catch(err => {
                        console.log(err);
                    });
            },
            getStorage() {
                let _this = this;
                this.userId = JSON.parse(sessionStorage.getItem("userInfo")).userId;
                this.$api.getUserInfo().then(response => {
                    console.log(response);
                    if (response.data.respCode == 0) {
                        if (response.data.data) {
                            _this.nation = response.data.data.nation;
                            _this.address = response.data.data.originAddress || '';
                        }
                        console.log(response.data.data)
                    }
                })
                    .catch(error => {
                        console.log(error);
                    });
            },
            // 人脸验证成功之后获取到的用户信息
            getBaseInfo() {
                let _this = this;
                let param = {
                    bizToken: _this.bizToken,
                    ruleId: '10'
                }
                this.$indicator.open({
                    spinnerType: 'fading-circle'
                });

                this.$api.detectRedirect(param)
                    .then(res => {
                        if (res.data.respCode == 0) {
                            let data = res.data.data

                            let info = JSON.parse(data.detectInfo)
                            console.log(info);
                            if (info.Text.ErrCode != 0) {
                                // _this.$router.push({ name: 'userregister' })
                                _this.$router.push({name: 'Mine'})
                            } else {
                                _this.nation = info.Text.OcrNation
                                _this.address = info.Text.OcrAddress
                                _this.userInfo.name = info.Text.Name
                                _this.userInfo.sex = info.Text.OcrGender == '男' ? '1' : '2'
                                _this.userInfo.idCard = info.Text.IdCard
                                _this.userInfo.birthday = info.Text.OcrBirth


                                _this.userInfo.idCardPositive = info.IdCardData.OcrFront
                                _this.userInfo.idCardNegative = info.IdCardData.OcrBack
                                _this.userInfo.BestFrame = info.BestFrame.BestFrame
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => {
                        this.$indicator.close()
                    })
            },


            handlerArea() {
                this.areaVisible = true
            },
            handleConfirm() {
                this.position = this.province + this.city + this.area
                this.areaVisible = false
            },
            closeTouch() {
                document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, {passive: false})//阻止默认事件
            },
            openTouch() {
                document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, {passive: false})//打开默认事件
            },
            onValuesChange(picker, values) {
                if (values[0]) {
                    this.province = values[0].dicName
                    this.provinceCode = values[0].dicVal
                }
                if (values[1]) {
                    this.city = values[1].dicName
                    this.cityCode = values[1].dicVal
                }
                if (values[2]) {
                    this.area = values[2].dicName
                    this.areaCode = values[2].dicVal
                }
            },

            getProList(value) {
                this.$api
                    .getDicList("city", value)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            this.$refs.areaPicker.setSlotValues(0, response.data.data);
                            this.$refs.areaPicker.setSlotValue(0, response.data.data[10]);
                        } else {

                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },

            getCityList(value) {
                this.$api
                    .getDicList("city", value)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            this.$refs.areaPicker.setSlotValues(1, response.data.data);
                        } else {
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },

            getAreaList(value) {
                this.$api
                    .getDicList("city", value)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            this.$refs.areaPicker.setSlotValues(2, response.data.data);
                        } else {
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },

            signAccount() {
                // let birthday = this.userInfo.birthday
                // let year = birthday.split('/')[0]
                // let month = birthday.split('/')[1].padStart(2, '0')
                // let day = birthday.split('/')[2].padStart(2, '0')
                let mobile = localStorage.getItem('regMobile') || JSON.parse(localStorage.getItem('userInfo')).mobile;
                let info = JSON.parse(localStorage.getItem('userInfo'));
                let talentId = localStorage.getItem('regTalentId') || JSON.parse(localStorage.getItem('userInfo')).talentId;
                if (!this.nation) {
                    this.$toast('民族不能为空！')
                    return
                }
                if (!this.address) {
                    this.$toast('户籍地址不能为空！')
                    return
                }
                if (!this.position) {
                    this.$toast('现住城市不能为空！')
                    return
                }
                if (!this.realAddress) {
                    this.$toast('现住详细地址不能为空！')
                    return
                }
                if (!this.contractName) {
                    this.$toast('紧急联系人姓名不能为空！')
                    return
                }

                if (!this.contractPhone) {
                    this.$toast('紧急联系人手机号不能为空')
                    return
                } else {
                    let reg = new RegExp(/^[1-9][0-9]*$/)
                    if (!reg.test(this.contractPhone)) {
                        this.$toast('手机号必须全为数字')
                        return
                    } else if (this.contractPhone.length != 11) {
                        this.$toast('手机号必须为11位数字')
                        return
                    }
                }

                if (!this.contractRelationship) {
                    this.$toast('紧急联系人关系不能为空！')
                    return
                }

                let param = {
                    userId: info.userId,
                    mobile: mobile,
                    realName: info.realName,
                    userType: 5,

                    province: this.province,
                    city: this.city,
                    region: this.area,
                    address: this.realAddress,
                    originAddress: this.address,
                    sex: info.sex,
                    nation: this.nation,
                    // birthday: `${year}-${month}-${day}`,

                    talentContact: {
                        contactName: this.contractName,
                        phone: this.contractPhone,
                        relationship: this.contractRelationship,
                    },
                }
                this.$indicator.open({
                    spinnerType: 'fading-circle'
                });
                let _this = this;
                this.$api.AuthenticationStepTwo(param)
                    .then(res => {
                        if (res.data.respCode == 0) {
                            if(_this.bankCardBindingStatus){
                                _this.$messagebox({
                                    title: `提示`,
                                    message: `您已完成身份信息认证`,
                                }).then(action => {
                                    _this.$router.go(-1)
                                })
                            }else{
                                _this.$messagebox({
                                    title: `提示`,
                                    message: `已完成完善身份信息,请绑定银行卡，便于收入及时发放。`,
                                    showCancelButton: true,
                                    confirmButtonText: "以后再说",
                                    cancelButtonText: "去绑定"
                                }).then(action => {
                                    if (action == 'confirm') {
                                        _this.$router.go(-1)
                                    }else{
                                        sessionStorage.setItem('cashout', true)
                                        _this.$router.push({ path: 'bindbankcard' })
                                    }
                                })
                            }
                        }
                        console.log(res)
                    })
                    .catch(err => {
                        this.$toast('完善失败')
                        console.log(err)
                    })
                    .finally(() => {
                        this.$indicator.close()
                    })
            },

            login() {
                let mobile = localStorage.getItem('regMobile')
                let password = localStorage.getItem('regPsw')
                const params = {
                    username: `${mobile},5`,
                    password: password
                };
                this.$api
                    .login(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            sessionStorage.setItem("token", response.headers.authorization);
                            sessionStorage.setItem("logintype", response.data.data.loginType);
                            sessionStorage.setItem("shareType", '2');//不分享默认2
                            sessionStorage.setItem("userInfo", JSON.stringify(response.data.data));
                            localStorage.setItem("userInfo", JSON.stringify(response.data.data))
                            this.$router.push({name: 'calendar'})
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
        },
    }
</script>
<style lang='scss'>
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    .full-fill {
        box-sizing: border-box;
        min-height: 100vh;
        padding-top: convertToVw(44);
        background-color: #f5f5f5;

        .mint-header-title {
            height: convertToVw(44);
            line-height: convertToVw(44);
            font-size: convertToVw(17);
        }

        .form-div {
            margin-top: convertToVw(15);
            border-top: 1px solid #d9d9d9;
            border-bottom: 1px solid #d9d9d9;
            background-color: #fff;

            .mint-cell {
                padding-left: convertToVw(15);
            }

            .mint-cell-wrapper {
                border-bottom: 1px solid #d9d9d9;
            }

            & .mint-cell:nth-last-of-type(1) .mint-cell-wrapper {
                border-bottom: none;
            }

            .mint-cell-text {
                margin-left: 0;
                font-size: convertToVw(16);
                color: #1e1f21;
            }

            .mint-cell-value {
                padding-right: convertToVw(15);
            }

            input {
                font-size: convertToVw(16);
            }

            ::-webkit-input-placeholder {
                font-size: convertToVw(16);
                color: #b9babd;
            }

            ::-moz-placeholder {
                font-size: convertToVw(16);
                color: #b9babd;
            }

            :-ms-input-placeholder {
                font-size: convertToVw(16);
                color: #b9babd;
            }

            .address .mint-cell-value {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        .btn-zone {
            padding: convertToVw(20) convertToVw(18);
            margin-top: convertToVw(30);
            background-color: #fff;

            .btn {
                border-radius: 3px;
                padding: 0;
                font-size: convertToVw(17);
                line-height: convertToVw(48);
                text-align: center;
                color: #fff;
                background-color: #ea441a;
            }
        }
    }
</style>