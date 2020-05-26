<template>
    <div class="page-register">
        <mt-header title="欢迎注册佳薪宝!" fixed class="mint-header-title">
            <!--<mt-button icon="back" slot="left" @click="handleBack"></mt-button>-->
        </mt-header>
        <div class="form-zone" v-show="openShow">
            <div class="pt15 pb15 tc">请上传您的本人身份证照片</div>
            <div class="img-card" @click="open(1)">
                <input type="file" ref="upload" accept="image/*" @change="upload($event)">
                <img :src="src" alt="">
            </div>
            <div class="img-card" @click="open(2)">
                <img :src="src2" alt="">
                <input type="file" ref="upload" accept="image/*" @change="upload($event)">
            </div>
        </div>
        <div v-if="isCard && openShow" class="form-zone pt15 pb88">
            <mt-field label="姓名" placeholder="请输入姓名" type="text" v-model="form.name"></mt-field>
            <mt-field label="身份证号码" placeholder="请输入身份证号码" type="text" v-model="form.idcard"
                      @keyup.native.capture="lenTel"></mt-field>
        </div>

        <div class="btn-zone" v-show="openShow">
            <div class="btn" @click="regIdcardTwo()">下一步</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                form: {
                    idcard: '',
                    name: '',
                },
                data:{},
                isCard:false,//认证成功
                upload_form: {
                    key: '',
                    token: ''
                },
                src: require('@/assets/img/card2.png'),
                src2: require('@/assets/img/card1.png'),
                picValue: '',
                picValue2: '',
                headerImage: "",
                headerImage2: "",
                uploadimg2:'',
                uploadimg:'',
                type:0,
                openShow:false
            };
        },
        watch: {},
        computed: {},
        created() {
            this.$router.push({name:'userregister'});
            this.getToken()
        },
        mounted() {

        },
        methods: {
            handleBack() {
                this.$router.push({name: 'login'})
            },
            lenTel() {
                this.form.idcard = this.form.idcard.replace(/[\W]/g, '');
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
            open(type){
                this.type = type
                console.log(this.type)
            },
            upload(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;
                if(this.type == 1){
                    this.picValue = files[0];
                    this.imgPreview(this.picValue);
                }else if(this.type == 2){
                    this.picValue2 = files[0];
                    this.imgPreview(this.picValue2);
                }
            },
            postImg() {
                let url  = '';
                if(this.type == 1){
                    url = this.headerImage
                }else if(this.type == 2){
                    url = this.headerImage2
                }
                this.$api
                    .postImg(
                        this.fileSize(url),
                        this.upload_form.token
                    )
                    .then(response => {
                        console.log(response)
                        if (response.data.key) {
                            const key = response.data.key;
                            if(this.type == 1){
                                this.uploadimg = `${this.bucketHost}/${key}`;
                                this.src = this.uploadimg
                                this.regIdcard()
                            }else if(this.type == 2){
                                this.uploadimg2 = `${this.bucketHost}/${key}`;
                                this.src2 = this.uploadimg2
                            }

                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
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
                            if(self.type == 1){
                                self.headerImage = this.result;
                            }else if(self.type == 2){
                                self.headerImage2 = this.result;
                            }
                            self.postImg()
                        } else {
                            img.onload = function () {
                                let data = self.compress(img);
                                if(self.type == 1){
                                    self.headerImage = data;
                                }else if(self.type == 2){
                                    self.headerImage2 = data
                                }
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
                            this.form.idcard = data.id
                            this.form.name = data.name
                            this.isCard = true;
                            this.data = data
                        } else {
                            this.isCard = true;
                            this.$indicator.close()
                        }
                    })
                    .catch(error => {
                        this.$indicator.close()
                        console.log(error)
                    })
            },
            regIdcardTwo() {
                let _this = this;
                let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
                let card = this.form.idcard.replace(/\s+/g, "")
                if (!this.uploadimg) {
                    return this.$toast("身份证照片正面不能为空!");
                }
                if (!this.uploadimg2) {
                    return this.$toast("身份证照片背面不能为空!");
                }
                if (!this.form.name) {
                    return this.$toast("姓名不能为空");
                }
                if (!this.form.idcard) {
                    return this.$toast("身份证号不能为空");
                }
                if (!reg.test(card)) {
                    return this.$toast("请输入正确的身份证号")
                }
                this.data['id'] = this.form.idcard;
                this.data['name'] = this.form.name;
                this.data['imgCard1'] = this.uploadimg;
                this.data['imgCard2'] = this.uploadimg2;
                console.log(this.data);
                this.$api.fastIdCard({idCard:_this.form.idcard}).then(res=>{
                    if(res.data.respCode === 0){
                        if(res.data.data){
                            this.$toast('此身份证号已经被注册!')
                        }else{
                            _this.$router.push({path:'/registerFastTwo',query:_this.data});
                        }
                    }
                }).catch(err=>{
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
        background-color: #fff;
        padding-top: convertToVw(44);
        .pb88{
            padding-bottom: convertToVw(88);
        }
        .inputCon {
            position: relative;

            input {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                opacity: 0;
            }
        }

        .mint-header-title {
            height: convertToVw(44);
            line-height: convertToVw(44);
            font-size: convertToVw(17);
        }

        .form-zone {
            background-color: #fff;
            padding: 0 convertToVw(15);
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

        .img-card {
            position: relative;
            display: block;
            margin: 20px auto;
            width: convertToVw(217);
            height: convertToVw(144);

            input {
                position: absolute;
                z-index: 2;
                left: 0;
                right: 0;
                top: 0;
                bottom: 20px;
                opacity: 0;
            }

            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }

        .bottom-mask {
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 100;
            background-color: rgba(0, 0, 0, 0.5);
            top: 0;
            left: 0;
        }

        .bottom-text {
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
            background-color: #fff;
            text-align: center;
            color: #1e1f21;
            font-size: convertToVw(17);
            line-height: convertToVw(52);
        }

        .bottom-text .text {
            border-bottom: convertToVw(4) solid #f5f5f5;
        }
    }
</style>