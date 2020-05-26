<template>
    <div class="page-register">
        <mt-header title="注册" fixed class="mint-header-title">
            <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>

        <div class="form-zone">
            <mt-field label="手机号码" placeholder="请输入注册手机号" type="text" v-model="form.mobile" :attr="{ maxlength: 11 }"
                      @keyup.native.capture="lenTel"></mt-field>
            <div class="validator">
                <mt-field label="短信验证码" placeholder="请输入验证码" type="text" v-model="form.validator"
                          :attr="{ maxlength: 6 }"  @keyup.native.capture="lenValidator"></mt-field>
                <span class="text-btn" @click="handleCheckMobile">{{btnText}}</span>
            </div>
            <mt-field label="登录密码" placeholder="请输入6到18位字母或数字" type="password" class="password" v-model="form.password" @keyup.native.capture="pwdValid"
                      :attr="{ maxlength: 18 }"></mt-field>

            <!-- <div class="id-card">
              <mt-field label="身份证号" placeholder="请输入身份证号" type="text" v-model="form.idcard" :attr="{ maxlength: 20 }" @blur.native.capture="checkIdcard"></mt-field>
              <input type="file" ref="upload" accept="image/*" @change="upload($event)" style="display: none">
              <span class="icon-btn" @click="open"></span>
            </div> -->
        </div>

        <!-- <p class="field-tip"><span class="field-icon"></span>点击右侧摄像头可拍照识别身份证</p> -->

        <!-- <div class="form-zone form-zone-second">
          <mt-field label="身份证姓名" placeholder="请输入姓名" type="text" v-model="form.name" @blur.native.capture="checkName"></mt-field>
        </div> -->

        <div class="btn-zone">
            <!--<div class="btn" @click="handleScanface">去人脸识别</div>-->
            <div class="btn" @click="subRegist()">提 交</div>
        </div>

        <div class="licence-zone">
            <span class="licence van-check">
                <van-checkbox v-model="value" checked-color="#ea441a" @change="check"/>
            </span>
            注册代表您已阅读并同意
            <span @click="go('1')"  class="licence">《自由职业者服务合作协议》</span>
            <span @click="go('2')" class="licence">《隐私权规定》</span>
            <span @click="go('3')" class="licence">《万才平台注册服务协议》</span>
            <span @click="go('5')" class="licence">《安防协议》</span>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {Checkbox, CheckboxGroup} from 'vant';
    import 'vant/lib/index.css';

    Vue.use(Checkbox).use(CheckboxGroup);
    export default {
        name: '',
        components: {},
        data() {
            return {
                waiting: 60,
                getcoding: true,
                btnText: '发送验证码',
                form: {
                    mobile: '',
                    validator: '',
                    password: '',
                    idcard: '',
                    name: ''
                },
                upload_form: {
                    key: '',
                    token: ''
                },
                headerImage: "",
                value:'',
                isSelected:false,
            };
        },
        watch: {},
        computed: {},
        mounted() {
            //如果是看完用户协议回来，看之前有没有输入过内容
            if (sessionStorage.registerQuery) {
                let registerQuery = JSON.parse(sessionStorage.registerQuery)
                if (registerQuery.mobile) {
                    this.form.mobile = registerQuery.mobile;
                }
                if (registerQuery.pwd) {
                    this.form.password = registerQuery.pwd;
                }
            }

        },
        methods: {
            check(val){
                this.isSelected = val
            },
            subRegist() {
                let _this = this;
                let validMobile = this.checkTel()
                if (!validMobile) {
                    return
                }
                let validCode = this.checkCode()
                if (!validCode) {
                    return
                }
                let validPwd = this.checkPwd()
                if (!validPwd) {
                    return
                }
                if (!(validMobile && validCode && validPwd)) { // 某项验证未通过
                    return
                }
                if(!this.isSelected){
                    return this.$toast('需要勾选协议,才可注册！')
                }
                let params = {
                    mobile: this.form.mobile,
                    userType: '5',
                    validator: this.form.validator,
                    password: this.form.password,
                    talent: {},
                }
                this.$api.signUserFirst(params).then(res => {
                    console.log(res,'signUserFirst1')
                    if (res.data.respCode === 0) {
                        _this.login();
                        let id = res.data.data
                        localStorage.setItem('regMobile', _this.form.mobile)
                        localStorage.setItem('regPsw', _this.form.password)
                        localStorage.setItem('regTalentId', id)
                        if (sessionStorage.registerQuery) {//清除查看协议回来时能记住之前的信息记录
                            sessionStorage.removeItem('registerQuery');
                        }
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {

                })
            },
            login() {
                let _this = this;
                const params = {
                    username: `${_this.form.mobile},5`,
                    password: _this.form.password
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
                            _this.$messagebox({
                                title: `账号注册成功`,
                                message: '如需领工单、参与排班等，请先实名认证。',
                                showCancelButton: true,
                                confirmButtonText: "实名认证",
                                cancelButtonText: "先逛逛"
                            }).then(action => {
                                if (action == 'confirm') {     //实名认证接口
                                    _this.$api.detectAuthFirst({
                                        openid: params.mobile,
                                        userType: '5',
                                        Extra: 'register',
                                    }).then(res => {
                                        if (res.data.respCode == 0) {
                                            let data = JSON.parse(res.data.data)
                                            let url = data.Url
                                            let bizToken = data.BizToken
                                            localStorage.setItem('biztoken', bizToken)
                                            window.location.href = url
                                        }
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                } else {
                                    _this.$router.replace({ path: "/home" ,query:{isFirst:true}});
                                    // _this.$router.replace({ name:'Mine'});
                                    // _this.$router.push('/task') //跳转任务市场
                                }
                            })
                            
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            go: function (type) {
                let registerQuery = {
                    mobile: this.form.mobile,
                    pwd: this.form.password,
                }
                sessionStorage.registerQuery = JSON.stringify(registerQuery);
                this.$router.push({path: "/Protocol",query:{type:type}});
            },
            handleBack() {
                this.$router.push({name: 'login'})
            },
            lenTel(){
                this.form.mobile=this.form.mobile.replace(/[^\d]/g,'')
            },
            lenValidator(){
                this.form.validator = this.form.validator.replace(/[^\d]/g,'')
            },
            checkTel() {
                if (!this.form.mobile) {
                    this.$toast('手机号不能为空')
                    return false;
                } else {
                    let reg = new RegExp(/^[1-9][0-9]*$/)
                    if (!reg.test(this.form.mobile)) {
                        this.$toast('手机号必须全为数字')
                        return false;
                    } else if (this.form.mobile.length != 11) {
                        this.$toast('手机号必须为11位数字')
                        return false;
                    }
                }

                return true
            },

            checkCode() {
                if (!this.form.validator) {
                    this.$toast("验证码不能为空");
                    return false;
                }
                return true
            },
            pwdValid(){
                this.form.password = this.form.password.replace(/[^\a-\z\A-\Z0-9]/g,'');
            },
            checkPwd() {
                if (!this.form.password) {
                    this.$toast('登录密码不能为空')
                    return false
                } else {
                    let reg = new RegExp(/^[a-zA-Z0-9]{6,18}$/)
                    if (!reg.test(this.form.password)) {
                        this.$toast('密码必须是6-18位字母或数字')
                        return false
                    }
                }
                return true
            },

            checkIdcard() {
                if (this.idcard) {
                    this.$toast('身份证号不能为空')
                    return false
                } else {
                    let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
                    let card = this.form.idcard.replace(/\s+/g, "")
                    if (!reg.test(card)) {
                        this.$toast("请输入正确的身份证号")
                        return false
                    }
                }

                return true
            },
            checkName() {
                let name = this.form.name.replace(/\s+/g, "")
                if (!name) {
                    this.$toast("姓名不能为空")
                    return false
                }

                return true
            },

            handleCheckMobile() {
                let mobileAvaiable = this.checkTel()
                if (!mobileAvaiable) {
                    return
                }
                const params = {
                    mobile: this.form.mobile,
                    userType: 5,
                };
                this.$api
                    .checkMobileMsg(params)
                    .then(response => {
                        console.log(response.data.data)
                        if (response.data.respCode == 0) {
                            if (response.data.data == false) {
                                this.getCode()
                            } else {
                                this.$toast('该手机号已被使用，无法注册')
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },

            getCode() {
                if (!this.getcoding) {
                    return
                }
                let mobileAvaiable = this.checkTel()
                if (!mobileAvaiable) {
                    return
                }

                const params = {
                    mobile: this.form.mobile,
                }

                this.$api
                    .getSmsCode(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            this.getcoding = false;
                            this.wating = 60
                            this.$toast('验证码已发送');
                            let that = this
                            let timing = setInterval(function () {
                                if (that.wating < 0) {
                                    that.getcoding = true;
                                    that.btnText = '获取验证码';
                                    window.clearInterval(timing)
                                } else {
                                    that.btnText = that.wating + '秒后重试'
                                    that.wating--;
                                }
                            }, 1000)
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            getToken() {
                this.$api.getToken().then((response) => {
                    const {
                        data: {
                            fileName, upToken,
                        },
                    } = response.data;

                    if (response.data.respCode == 0) {
                        this.upload_form = {
                            key: fileName,
                            token: upToken,
                        };
                    }
                });
            },
            postImg() {
                this.$api
                    .postImg(
                        this.fileSize(this.headerImage),
                        this.upload_form.token
                    )
                    .then(response => {
                        if (response.data.key) {
                            const key = response.data.key;
                            this.uploadimg = `${this.bucketHost}/${key}`;
                            this.getToken();
                            this.regIdcard();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            open() {
                this.getToken();
                this.$refs.upload.click();
            },
            upload(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;
                this.picValue = files[0];
                this.imgPreview(this.picValue);
            },
            imgPreview(file) {
                let self = this;
                // 看支持不支持FileReader
                if (!file || !window.FileReader) return;

                if (/^image/.test(file.type)) {
                    // 创建一个reader
                    let reader = new FileReader();
                    // 将图片2将转成 base64 格式
                    reader.readAsDataURL(file);
                    // 读取成功后的回调
                    reader.onloadend = function () {
                        let result = this.result;
                        let img = new Image();
                        img.src = result;
                        //判断图片是否大于100K,是就直接上传，反之压缩图片
                        if (this.result.length <= 100 * 1024) {
                            self.headerImage = this.result;
                            self.postImg();
                        } else {
                            img.onload = function () {
                                let data = self.compress(img);
                                self.headerImage = data;
                                self.postImg();
                            };
                        }
                    };
                }
            },
            fileSize(str) {
                var fileSize;
                // 找到等号，把等号也去掉
                if (str.indexOf(",") > 0) {
                    var indexOf = str.indexOf(",");
                    str = str.substring(indexOf + 1); // 把末尾的’=‘号去掉
                }
                return str;
            },
            compress(img) {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                let initSize = img.src.length;
                let width = img.width;
                let height = img.height;
                //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
                let ratio;
                if ((ratio = (width * height) / 4000000) > 1) {
                    console.log("大于400万像素");
                    ratio = Math.sqrt(ratio);
                    width /= ratio;
                    height /= ratio;
                } else {
                    ratio = 1;
                }
                canvas.width = width;
                canvas.height = height;
                // 铺底色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // 如果图片像素大于100万则使用瓦片绘制
                ctx.drawImage(img, 0, 0, width, height);
                // 进行最小压缩
                let ndata = canvas.toDataURL('image/jpeg', 0.1).substring(23);
                console.log(ndata);
                console.log('压缩前：' + initSize);
                console.log('压缩后：' + ndata.length);
                console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
                canvas.width = canvas.height = 0;
                return ndata;
            },
            regIdcard() {
                const params = {
                    url: this.uploadimg
                };
                this.$indicator.open({
                    spinnerType: 'fading-circle'
                });
                this.$api
                    .regIdcard(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            this.$indicator.close()
                            let data = response.data.data

                            this.idcard = data.idcard
                            this.name = data.name
                        } else {
                            this.$indicator.close()
                        }
                    })
                    .catch(error => {
                        this.$indicator.close()
                        console.log(error)
                    })
            },

            handleScanface() {
                let validMobile = this.checkTel()
                if (!validMobile) {
                    return
                }
                let validCode = this.checkCode()
                if (!validCode) {
                    return
                }
                let validPwd = this.checkPwd()
                if (!validPwd) {
                    return
                }

                if (!(validMobile && validCode && validPwd)) { // 某项验证未通过
                    return
                }

                // 人脸识别
                let openid = sessionStorage.getItem('openid') || localStorage.getItem('openid')
                let params = {
                    mobile: this.form.mobile,
                    userType: '5',
                    verifyCode: this.form.validator,
                    openid: openid,
                    Extra: 'register',
                    RuleId: '10',
                }

                localStorage.setItem('regMobile', this.form.mobile)
                localStorage.setItem('regPsw', this.form.password)

                //A79EB475-92F7-4CB1-9A71-E1015ABE8A05  biztoken
                this.$api.detectAuth(params)
                    .then(res => {
                        if (res.data.respCode == 0) {
                            let data = JSON.parse(res.data.data)
                            let url = data.Url
                            let bizToken = data.BizToken
                            localStorage.setItem('biztoken', bizToken)
                            //注册成功之后 删除填写存储的信息
                            if (sessionStorage.registerQuery) {
                                sessionStorage.removeItem('registerQuery');
                            }
                            window.location.href = url
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
        },
    }
</script>
<style lang='scss'>
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    .page-register {
        box-sizing: border-box;
        min-height: 100vh;
        padding-top: convertToVw(62);
        background-color: #f5f5f5;
        .van-check{
            position: relative;
            top:.2rem;
        }
        .mint-header-title {
            height: convertToVw(44);
            line-height: convertToVw(44);
            font-size: convertToVw(17);
        }

        .form-zone {
            background-color: #fff;
            border-top: 1px solid #d9d9d9;
            border-bottom: 1px solid #d9d9d9;

            .mint-cell {
                padding-left: convertToVw(15);
            }

            .mint-cell-wrapper {
                border-bottom: 1px solid #d9d9d9;
            }

            .password .mint-cell-wrapper {
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

            .mint-field-core {
                font-size: convertToVw(16);
            }

            .validator {
                position: relative;
                padding-right: convertToVw(112);

                &::after {
                    content: "";
                    position: absolute;
                    display: block;
                    width: convertToVw(360);
                    height: 1px;
                    background-color: #d9d9d9;
                    right: 0;
                    bottom: 0;
                }
            }

            .text-btn {
                position: absolute;
                display: block;
                width: convertToVw(112);
                top: convertToVw(14);
                right: 0;
                color: #e95a34;
                font-size: convertToVw(16);
                line-height: convertToVw(34);
                text-align: center;
                border-left: 1px solid #d9d9d9;
                cursor: pointer;
            }

            .id-card {
                position: relative;
                padding-right: convertToVw(60);

                .mint-cell-wrapper {
                    border-bottom: none;
                }

                .icon-btn {
                    position: absolute;
                    height: convertToVw(34);
                    width: convertToVw(60);
                    right: 0;
                    top: convertToVw(14);
                    border-left: 1px solid #d9d9d9;
                    background-image: url(../../assets/img/camera.png);
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center center;
                }
            }
        }

        .form-zone-second .mint-cell-wrapper {
            border-bottom: none;
        }

        .field-tip {
            padding-left: convertToVw(15);
            font-size: convertToVw(13);
            line-height: convertToVw(36);
            color: #969799;
            background-color: #f5f5f5;

            .field-icon {
                margin-right: convertToVw(6);
                display: inline-block;
                vertical-align: middle;
                width: convertToVw(17);
                height: convertToVw(17);
                background-image: url(../../assets/img/alert.png);
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center center;
            }
        }

        .btn-zone {
            padding: convertToVw(20) convertToVw(18);

            .btn {
                border-radius: 3px;
                font-size: convertToVw(17);
                line-height: convertToVw(48);
                padding: 0;
                text-align: center;
                color: #fff;
                background-color: #ea441a;
                cursor: pointer;
            }
        }

        .licence-zone {
            text-align: center;
            font-size: convertToVw(13);
            line-height: 1.7;
            color: #969799;
            .licence {
                display: inline-block;
                color: #e95a34;
            }
        }
    }
</style>