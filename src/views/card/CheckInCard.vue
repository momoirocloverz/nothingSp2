<template>
    <div>
        <mt-header :title="title" fixed class="mint-header-title"></mt-header>
        <div class="content_margin" v-if="count == 1">
            <!-- <div style="color: #e20000;margin-top:.2rem">签名无法识别或非本人姓名，视为打卡无效，收入为0</div> -->
            <mt-cell title="打卡时间" class="black">
                <span class="fs">{{form.date}} {{form.time}}</span>
            </mt-cell>
            <mt-cell title="打卡岗位" class="black">
                <span class="fs">{{form.industry}}</span>
            </mt-cell>
            <mt-cell title="计件量" class="black" v-if="!this.combo &&workType == 2 && needPiece == 2 && pieceUnit == 1">
                <input type="number" class="inputRadius countInput" v-model="form.jian" @blur="checkNum1"
                       oninput="if(value.length>5)value=value.slice(0,5)">
                <span class="fs">件</span>
            </mt-cell>
            <mt-cell title="计件量" class="black" v-if="!this.combo &&workType == 2 && needPiece == 2 && pieceUnit == 2">
                <input type="number" class="inputRadius countInput" v-model="form.dai" @blur="checkNum2"
                       oninput="if(value.length>4)value=value.slice(0,4)">
                <span class="fs">袋</span>
            </mt-cell>
            <mt-cell title="计件量" class="black" v-if="!this.combo &&workType == 2 && needPiece == 2 && pieceUnit == 3">
                <input type="number" class="inputRadius countInput" v-model="form.che" @blur="checkNum3"
                       oninput="if(value.length>3)value=value.slice(0,3)">
                <span class="fs">车</span>
            </mt-cell>
            <mt-cell title="计件量" class="black" v-if="!this.combo &&workType == 2 && needPiece == 2 && pieceUnit == 4">
                <input type="number" class="inputRadius countInput" v-model="form.dun" @blur="checkNum4"
                       oninput="if(value.length>7)value=value.slice(0,7)">
                <span class="fs">吨</span>
            </mt-cell>

            <mt-cell title="计件量" class="black" v-if="this.combo && comboJian">
                <input type="number" class="inputRadius countInput" v-model="form.jian" @blur="checkNum1"
                       oninput="if(value.length>5)value=value.slice(0,5)">
                <span class="fs">件</span>
            </mt-cell>
            <mt-cell title="计件量" class="black" v-if="this.combo && comboDai">
                <input type="number" class="inputRadius countInput" v-model="form.dai" @blur="checkNum2"
                       oninput="if(value.length>4)value=value.slice(0,4)">
                <span class="fs">袋</span>
            </mt-cell>
            <mt-cell title="计件量" class="black" v-if="this.combo && comboChe">
                <input type="number" class="inputRadius countInput" v-model="form.che" @blur="checkNum3"
                       oninput="if(value.length>3)value=value.slice(0,3)">
                <span class="fs">车</span>
            </mt-cell>
            <mt-cell title="计件量" class="black" v-if="this.combo && comboDun">
                <input type="number" class="inputRadius countInput" v-model="form.dun" @blur="checkNum4"
                       oninput="if(value.length>7)value=value.slice(0,7)">
                <span class="fs">吨</span>
            </mt-cell>

            <mt-cell title="签字" is-link value="" class="black" @click.native="reWrite"></mt-cell>

            <mt-cell v-if="needAuth" title="人脸验证" is-link class="black" @click.native="handleToAuth">
                <!--先暂时都显示为去验证-->
                <span class="sginText">{{hasAuth ? '去验证' : '去验证'}}</span>
            </mt-cell>

            <div class="box" v-if="count == 1 && uploadimg" style="margin-top:1rem">
                <img :src="uploadimg" alt="" class="photo">
            </div>
            <div class="btnBox flexable">
                <mt-button class="doneBtn" @click="check" :disabled="isDisable">打卡</mt-button>
            </div>
            <div class="doneBox" @click="checkBack" v-if="headMan">
                回考勤
            </div>
        </div>
        <div v-if="count == 2" class="warnBox flexable">
            <img src="../../assets/img/prompt@3x.png" alt="提示" class="warn">
            <span class="txt">{{txt}}</span>
        </div>
        <div v-if="count == 3" class="tipBox flexable">
            <div class="successBox flexable">
                <img src="../../assets/img/successful@3x.png" alt="success" class="success">
            </div>
            <div class="successText">打卡成功</div>
            <div class="inlineBOx flexable">
                <div class="b-text">打卡时间</div>
                <span class="fs">{{form.date }} {{form.time}}</span>
            </div>
            <div class="inlineBOx flexable">
                <div class="b-text">打卡岗位</div>
                <span class="fs">{{form.industry}}</span>
            </div>
            <div class="inlineBOx flexable">
                <div class="b-text">打卡班组</div>
                <span class="fs">{{checkInfo.schedulingName}}</span>
            </div>
            <div class="inlineBOx flexable" v-if="form.jian && !this.combo">
                <div class="b-text">计 件 量</div>
                <div class="fs">{{form.jian ? `${form.jian}件` : ''}}</div>
                <div class="red">（待班组长审核）</div>
            </div>
            <div class="inlineBOx flexable" v-if="form.dai && !this.combo">
                <div class="b-text">计 件 量</div>
                <div class="fs">{{form.dai ? `${form.dai}袋` : ''}}</div>
                <div class="red">（待班组长审核）</div>
            </div>
            <div class="inlineBOx flexable" v-if="form.che && !this.combo">
                <div class="b-text">计 件 量</div>
                <div class="fs">{{form.che ? `${form.che}车` : ''}}</div>
                <div class="red">（待班组长审核）</div>
            </div>
            <div class="inlineBOx flexable" v-if="form.dun && !this.combo">
                <div class="b-text">计 件 量</div>
                <div class="fs">{{form.dun ? `${form.dun}吨` : ''}}</div>
                <div class="red">（待班组长审核）</div>
            </div>
            <div class="inlineBOx flexable" v-if="this.combo">
                <div class="b-text">计 件 量</div>
                <div class="fs">{{form.jian ? `${form.jian}件 ` : ''}}{{form.dai ? `${form.dai}袋 ` : ''}}{{form.che ?
                    `${form.che}车 ` : ''}}{{form.dun ? `${form.dun}吨` : ''}}
                </div>
                <div class="red">（待班组长审核）</div>
            </div>
            <div class="successText" v-if="checkInfo.hasPhoto == 2">打卡照片</div>
            <div class="box" v-if="checkInfo.hasPhoto == 2">
                <img :src="uploadimg" alt="" class="photo">
            </div>
            <div class="successText">签名</div>
            <div class="signbox" style="margin-bottom: 2.23rem;">
                <img :src="signImgView" alt="" class="sign">
            </div>
            <div class="doneBox" @click="checkBack" v-if="headMan">
                回考勤
            </div>
            <div class="doneBox" @click="checkBack" v-if="!headMan">
                回首页
            </div>
        </div>
        <div v-show="count == 4">
            <div class="container" style="height: 100%;width:100%">
                <baidu-map class="mapdiv" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler"></baidu-map>
            </div>
        </div>
        <div class="punch-box pt40 tc lh26" v-if="count == 9">
            <img class="wait-img" src="../../assets/img/wait.png" alt="">
            <div class="pt40">你前面还有{{waitNum}}人待打卡，请不要关闭页面 <br/> 等待{{waitTime}}秒后自动提交</div>
        </div>
    </div>
</template>

<script>
    import BaiduMap from '../../common/baidu-map.js'
    import wx from 'weixin-js-sdk'
    import jsonp from 'jsonp'

    export default {
        name: 'CheckInCard',
        data() {
            return {
                title: '',
                count: 0,
                needAuth: false,
                hasAuth: false,
                txt: '',
                imgval: '',
                upload_form: {},
                upload_photo_form: {},
                key: '',
                uploadimg: '',
                picValue: '',
                form: {
                    countNum: '',
                    time: '',
                    industry: '',
                    date: '',
                    jian: '',
                    dai: '',
                    che: '',
                    dun: '',
                },
                checkInfo: {},
                info: {},
                session: '',
                workType: 1,
                selected: true,
                isSign: true,
                signImg: '',
                getsignImg: '',
                cardDetail: {},
                backUploadimg: '',
                backCountNum: {},
                needPiece: '1',
                pieceUnit: '1',
                combo: false,
                BMap: '',
                headerImage: '',
                wechatLocation: {},
                distanceRange: '',
                isDun: false,
                ische: false,
                isdai: false,
                isJian: false,
                headMan: {},
                latitude: '',
                longitude: '',
                comboJian: false,
                comboDai: false,
                comboChe: false,
                comboDun: false,
                signImgView: '',
                zoom: 0,
                isDisable: false,
                waitNum: 0,
                waitTime: 0,
                timeout: null,
            }
        },
        methods: {
            timeOut(){
                setTimeout(()=>{
                    if (this.waitTime <= 0) {
                        if(this.timeout){
                            clearTimeout(this.timeout)
                        }
                        this.timeout = null
                        this.check()
                    } else {
                        this.waitTime--;
                        this.timeOut()
                    }
                },1000)
            },
            getInfo() {
                const params = {
                    loginType: 5,
                    code: this.info.code
                };
                this.$api
                    .WechatLogin(params)
                    .then(response => {
                        console.log(response)
                        if (response.data.respCode == 0) {
                            this.scanCheck()
                            sessionStorage.setItem("token", response.headers.authorization);
                            sessionStorage.setItem("shareType", '2');//不分享默认2
                            sessionStorage.setItem(
                                "userInfo",
                                JSON.stringify(response.data.data)
                            );
                            sessionStorage.setItem('wechatFirst', 1)
                            this.getToken()
                        } else {
                            this.$indicator.close()
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            // 去进行人脸验证
            handleToAuth() {
                let userInfo = sessionStorage.getItem('userInfo') || localStorage.getItem('userInfo')
                if (userInfo) {
                    userInfo = JSON.parse(userInfo)
                    this.talentId = userInfo.talentId
                }

                let param = {
                    talentId: this.talentId,
                    Extra: 'attendance',
                    RuleId: '7'
                }
                this.$indicator.open({
                    spinnerType: 'fading-circle'
                })
                this.$api.detectAuth(param)
                    .then(res => {
                        if (res.data.respCode == 0) {
                            let data = JSON.parse(res.data.data)
                            let url = data.Url
                            let bizToken = data.BizToken
                            localStorage.setItem('biztoken', bizToken)

                            localStorage.setItem('lastUrl', window.location.href)

                            window.location.href = url
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => {
                        this.$indicator.close()
                    })
            },
            clear: function () {
                draw.clear();
            },
            save: function () {
                var data = draw.save();
                this.url = data;
                console.log(data)
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
            getTokenPhoto() {
                this.$api.getToken().then((response) => {
                    const {
                        data: {
                            fileName, upToken,
                        },
                    } = response.data;
                    if (response.data.respCode == 0) {
                        this.upload_photo_form = {
                            key: fileName,
                            token: upToken,
                        };
                    }
                    console.log(this.upload_photo_form)
                });
            },
            uploadQiniuyun() {
                if (this.signImg) {
                    this.imgval = draw.save().substring(22)
                    this.$api
                        .postImg(
                            this.imgval,
                            this.upload_form.token
                        )
                        .then(response => {
                            if (response.data.key) {
                                this.key = response.data.key;
                                this.signImg = `${this.bucketHost}/${this.key}`
                                this.check();
                            }
                            this.getToken();

                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    this.$toast('请本人签字')
                }
            },

            check() {
                this.$indicator.open({
                    spinnerType: 'fading-circle'
                })
                if (this.combo && this.comboJian) {
                    this.checkNum1()
                    if (!this.form.jian) {
                        this.$toast('计件量不能为空')
                        return false
                    }
                }
                if (this.combo && this.comboDai) {
                    this.checkNum2()
                    if (!this.form.dai) {
                        this.$toast('计件量不能为空')
                        return false
                    }
                }
                if (this.combo && this.comboChe) {
                    this.checkNum3()
                    if (!this.form.che) {
                        this.$toast('计件量不能为空')
                        return false
                    }
                }
                if (this.combo && this.comboDun) {
                    this.checkNum4()
                    if (!this.form.dun) {
                        this.$toast('计件量不能为空')
                        return false
                    }
                }
                if (!this.combo && this.workType == 2 && this.needPiece == 2 && this.pieceUnit == 1) {
                    this.checkNum1()
                    if (!this.isJian) {
                        this.$toast('计件量不能为空')
                        return false
                    }
                }
                if (!this.combo && this.workType == 2 && this.needPiece == 2 && this.pieceUnit == 2) {
                    this.checkNum2()
                    if (!this.isdai) {
                        this.$toast('计件量不能为空')
                        return false
                    }
                }
                if (!this.combo && this.workType == 2 && this.needPiece == 2 && this.pieceUnit == 3) {
                    this.checkNum3()
                    if (!this.ische) {
                        this.$toast('计件量不能为空')
                        return false
                    }
                }
                if (!this.combo && this.workType == 2 && this.needPiece == 2 && this.pieceUnit == 4) {
                    this.checkNum4()
                    if (!this.isDun) {
                        this.$toast('计件量不能为空')
                        return false
                    }
                }

                let pieceSize = {
                    jian: this.form.jian,
                    dai: this.form.dai,
                    che: this.form.che,
                    dun: this.form.dun,
                }
                this.isDisable = true
                if (this.signImg) {
                    if (this.checkInfo.hasPhoto == 2) {
                        if (this.uploadimg) {
                            const params = {
                                schedulingId: this.checkInfo.schedulingId,
                                type: this.checkInfo.type,
                                industry: this.checkInfo.industry,
                                date: this.form.date || this.checkInfo.date,
                                time: (this.form.time && this.form.time.padEnd(8, ':00')) || this.checkInfo.time,
                                endWorkType: this.checkInfo.endWorkType,
                                startPhoto: this.checkInfo.type == 1 ? this.uploadimg : '',
                                startSign: this.signImg,
                                endPhoto: this.checkInfo.type == 2 ? this.uploadimg : '',
                                endSign: this.signImg,
                                pieceSize: JSON.stringify(pieceSize),
                                signatureStatus: 1,
                                signature: this.signImg,
                            };
                            this.$api
                                .CheckIn(params)
                                .then(response => {
                                    console.log(response)
                                    if (response.data.respCode == 0) {
                                        if (response.data.data && response.data.data > 0) {
                                            this.waitNum = Number(response.data.data);
                                            this.count = 9
                                            this.waitTime = this.waitNum * 3;
                                            this.timeout = this.timeOut()
                                        } else {
                                            this.count = 3
                                            sessionStorage.removeItem('limit24date')
                                            sessionStorage.removeItem('limit24time')
                                        }
                                    } else {
                                        this.$toast(response.data.errorMsg)
                                    }
                                    this.isDisable = false
                                })
                                .catch(error => {
                                    console.log(error);
                                    this.isDisable = false
                                }).finally(() => {
                                this.$indicator.close()
                            });

                        } else {
                            this.isDisable = false
                            this.$toast('上/下班拍照不能为空')
                        }
                    } else {
                        this.uploadimg = ''
                        const params = {
                            schedulingId: this.checkInfo.schedulingId,
                            type: this.checkInfo.type,
                            industry: this.checkInfo.industry,
                            date: this.form.date || this.checkInfo.date,
                            time: (this.form.time && this.form.time.padEnd(8, ':00')) || this.checkInfo.time,
                            endWorkType: this.checkInfo.endWorkType,
                            startPhoto: this.checkInfo.type == 1 ? this.uploadimg : '',
                            startSign: this.signImg,
                            endPhoto: this.checkInfo.type == 2 ? this.uploadimg : '',
                            endSign: this.signImg,
                            pieceSize: JSON.stringify(pieceSize),
                            signatureStatus: 1,
                            signature: this.signImg,
                        };
                        this.$api
                            .CheckIn(params)
                            .then(response => {
                                console.log(response)
                                this.isDisable = false
                                if (response.data.respCode == 0) {
                                    if (response.data.data && response.data.data > 0) {
                                        this.waitNum = Number(response.data.data);
                                        this.count = 9
                                        this.waitTime = this.waitNum * 3;
                                        this.timeout = this.timeOut()
                                    } else {
                                        this.count = 3
                                        sessionStorage.removeItem('limit24date')
                                        sessionStorage.removeItem('limit24time')
                                    }
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                this.isDisable = false
                            }).finally(() => {
                            this.$indicator.close()
                        });
                    }

                } else {
                    this.isDisable = false
                    this.$toast('签字不能为空')
                }
            },
            scanCheck() {
                const params = {
                    state: this.session ? this.info.state : this.$route.query.state,
                };

                this.$api
                    .WschedulePreScanCheck(params)
                    .then(response => {
                        console.log(response)
                        if (response.data.respCode == 0) {
                            let schedulingId = response.data.data.schedulingId
                            let industry = response.data.data.industry
                            let industryName = response.data.data.industryName
                            let type = response.data.data.type
                            let date = response.data.data.date
                            let time = (response.data.data.time).substring(0, 5)
                            this.distanceRange = response.data.data.punchRange;
                            this.$router.push({
                                name: 'workerCard',
                                query: {
                                    schedulingId: schedulingId,
                                    industry: industry,
                                    type: type,
                                    setType:3,//表示开始设置时间
                                    date:date,
                                    time:time,
                                    industryName: industryName
                                }
                            })
                            return

                            this.count = 1
                            this.latitude = response.data.data.latitude
                            this.longitude = response.data.data.longitude
                            this.getWechat()
                            this.form.time = (response.data.data.time).substring(0, 5)
                            this.form.industry = response.data.data.industryName
                            this.form.date = response.data.data.date

                            // 24小时
                            let startPunch = response.data.data.startPunchDateTime
                            if (startPunch) {
                                let startPunchString = startPunch.replace(new RegExp(/-/gm), "/")
                                let startStamp = new Date(startPunchString).getTime()
                                let nowString = `${this.form.date} ${this.form.time}`.replace(new RegExp(/-/gm), "/")
                                let nowStamp = new Date(nowString).getTime()
                                if (nowStamp - startStamp >= 245 * 3600 * 100) {
                                    let nowStamp = startStamp + 24 * 3600 * 1000
                                    let nowDate = new Date(nowStamp + 8 * 3600 * 1000)
                                    let dateString = nowDate.toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                                    this.form.date = dateString.split(' ')[0]
                                    this.form.time = dateString.split(' ')[1].substring(0, 5)

                                }
                            }
                            //
                            this.checkInfo = response.data.data
                            sessionStorage.setItem('cardDetail', JSON.stringify(this.checkInfo))
                            if (this.session) {
                                if (response.data.data.type == 1) {
                                    this.workType = 1
                                    this.title = '上班打卡'
                                } else {
                                    this.workType = 2
                                    this.title = '下班打卡'
                                }

                            }

                            if (response.data.data.needPiece == 1) {//是否需要计件量
                                this.needPiece = 1

                            } else {
                                this.needPiece = 2
                                if (response.data.data.pieceUnit) {
                                    if (response.data.data.pieceUnit == 1) {
                                        this.pieceUnit = 1
                                    } else if (response.data.data.pieceUnit == 2) {
                                        this.pieceUnit = 2
                                    } else if (response.data.data.pieceUnit == 3) {
                                        this.pieceUnit = 3
                                    } else {
                                        this.pieceUnit = 4
                                    }
                                    this.combo = false
                                } else {
                                    this.combo = true
                                    let pieceUnitList = response.data.data.pieceUnitList
                                    for (let i in pieceUnitList) {
                                        if (pieceUnitList[i] == 1) {
                                            this.comboJian = true
                                        } else if (pieceUnitList[i] == 2) {
                                            this.comboDai = true
                                        } else if (pieceUnitList[i] == 3) {
                                            this.comboChe = true
                                        } else if (pieceUnitList[i] == 4) {
                                            this.comboDun = true
                                        }
                                    }
                                }
                            }
                        } else {
                            this.count = 2
                            if (response.data.errorCode == 90055) {
                                let message = JSON.parse(response.data.errorMsg)
                                this.txt = `${message.talentName}本次考勤存在时间段冲突,冲突排班：${message.schedulingName},考勤工种：${message.industryName},上班打卡：${message.punchStartTime},下班打卡：${message.punchendTime}`
                            } else {
                                this.txt = response.data.errorMsg

                                // 未进行人脸核身
                                if (response.data.errorCode == 20023) {
                                    localStorage.setItem('fromScan', true)
                                    this.$router.push({name: 'autherror'})
                                }
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.$indicator.close()
                    });
            },
            open() {
                this.getTokenPhoto();
                this.$refs.upload.click();
            },
            upload(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;
                this.picValue = files[0];
                this.imgPreview(this.picValue);
                console.log(this.picValue);
            },
            imgPreview(file) {
                let self = this;
                let Orientation;
                //去获取拍照时的信息，解决拍出来的照片旋转问题
                EXIF.getData(file, function () {
                    Orientation = EXIF.getTag(file, 'Orientation');
                });
                console.log(Orientation)
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
                                let data = self.compress(img, Orientation);
                                self.headerImage = data;
                                self.postImg();
                            };
                        }
                    };
                }
            },
            compress(img, Orientation) {
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
                //        铺底色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                //如果图片像素大于100万则使用瓦片绘制
                ctx.drawImage(img, 0, 0, width, height);
                //进行最小压缩
                console.log(Orientation)
                if (Orientation != "" && Orientation != 1) {
                    switch (Orientation) {
                        case 6://需要顺时针（向左）90度旋转
                            this.rotateImg(img, 'left', canvas);
                            break;
                        case 8://需要逆时针（向右）90度旋转
                            this.rotateImg(img, 'right', canvas);
                            break;
                        case 3://需要180度旋转
                            this.rotateImg(img, 'right', canvas);//转两次
                            this.rotateImg(img, 'right', canvas);
                            break;
                    }
                }

                let ndata = canvas.toDataURL('image/jpeg', 0.1).substring(23);
                console.log(ndata);
                console.log('压缩前：' + initSize);
                console.log('压缩后：' + ndata.length);
                console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
                canvas.width = canvas.height = 0;
                return ndata;
            },
            rotateImg(img, direction, canvas) {
                //最小与最大旋转方向，图片旋转4次后回到原方向
                const min_step = 0;
                const max_step = 3;
                if (img == null) return;
                //img的高度和宽度不能在img元素隐藏后获取，否则会出错
                let height = img.height;
                let width = img.width;
                let step = 2;
                if (step == null) {
                    step = min_step;
                }
                if (direction == 'right') {
                    step++;
                    //旋转到原位置，即超过最大值
                    step > max_step && (step = min_step);
                } else {
                    step--;
                    step < min_step && (step = max_step);
                }
                //旋转角度以弧度值为参数
                let degree = step * 90 * Math.PI / 180;
                let ctx = canvas.getContext('2d');
                switch (step) {
                    case 0:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0);
                        break;
                    case 1:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, 0, -height);
                        break;
                    case 2:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, -height);
                        break;
                    case 3:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, 0);
                        break;
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
            postImg() {
                this.$api
                    .postImg(
                        this.fileSize(this.headerImage),
                        this.upload_photo_form.token
                    )
                    .then(response => {
                        console.log(response)
                        if (response.data.key) {
                            this.$toast('上传照片成功')
                            const key = response.data.key;
                            this.uploadimg = `${this.bucketHost}/${key}`;
                            console.log(this.uploadimg);
                            this.getTokenPhoto();
                        } else {
                            this.$toast('上传照片失败')
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            checkNum1() {
                if (!this.form.jian) {
                    this.$toast("计件量不能为空");
                    this.isJian = false
                    return false;
                } else {
                    let reg = new RegExp(/^[0-9]+$/)
                    if (!reg.test(this.form.jian)) {
                        this.$toast('请输入正确的计件量')
                        return false;
                    }
                    this.isJian = true
                }
            },
            checkNum2() {
                if (!this.form.dai) {
                    this.$toast("计件量不能为空");
                    this.isdai = false
                    return false;
                } else {
                    let reg = new RegExp(/^[0-9]+$/)
                    if (!reg.test(this.form.dai)) {
                        this.$toast('请输入正确的计件量')
                        return false;
                    }
                    this.isdai = true
                }
            },
            checkNum3() {
                if (!this.form.che) {
                    this.$toast("计件量不能为空");
                    this.ische = false
                    return false;
                } else {
                    let reg = new RegExp(/^[0-9]+$/)
                    if (!reg.test(this.form.che)) {
                        this.$toast('请输入正确的计件量')
                        return false;
                    }
                    this.ische = true
                }
            },
            checkNum4() {
                if (!this.form.dun) {
                    this.$toast("计件量不能为空");
                    this.isDun = false
                    return false;
                } else {
                    this.form.dun = this.form.dun.toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
                    this.form.dun = this.form.dun.toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
                    this.form.dun = this.form.dun.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                    this.form.dun = String(this.form.dun).replace(/^(.*\..{4}).*$/, "$1");
                    this.isDun = true
                }
            },
            reWrite() {
                sessionStorage.setItem('uploadimg', this.uploadimg)
                let countNum = {
                    jian: this.form.jian,
                    dai: this.form.dai,
                    che: this.form.che,
                    dun: this.form.dun,
                    combo: this.combo,
                    comboDun: this.comboDun,
                    comboChe: this.comboChe,
                    comboDai: this.comboDai,
                    comboJian: this.comboJian,
                }
                sessionStorage.setItem('limit24date', this.form.date)
                sessionStorage.setItem('limit24time', this.form.time)
                sessionStorage.setItem('countNum', JSON.stringify(countNum))//计件量
                this.$router.push({name: 'canvas'})
            },
            getDistanceRange() {
                this.getDistance(this.wechatLocation.latitude, this.wechatLocation.longitude, this.latitude, this.longitude)
            },
            getWechat() {
                let url3 = location.href.split('#')[0];
                let urlDate = {
                    url: url3
                };
                this.$api.shareSDK(urlDate).then(res => {
                    if (res.data.respCode == 0) {
                        let data = res.data.data;
                        let _this = this
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: data.appId, // 必填，公众号的唯一标识
                            timestamp: data.timestamp, // 必填，生成签名的时间戳
                            nonceStr: data.nonceStr, // 必填，生成签名的随机串
                            signature: data.signature, // 必填，签名，见附录1
                            jsApiList: ["getLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                        wx.error(function (res) {
                            _this.count = 2
                            _this.txt = '获取定位失败'
                        });
                        wx.ready(function () {
                            wx.getLocation({
                                success: function (res) {
                                    _this.wechatLocation = res;
                                    let ak = 'HIpuFBetnp1KKYrfcleBipO6x31IeI63';
                                    let coords = `${res.longitude},${res.latitude}`;
                                    jsonp(`http://api.map.baidu.com/geoconv/v1/?coords=${coords}&from=1&to=5&ak=${ak}`, null, (err, data) => {
                                        if (err) {
                                            console.log('坐标转换失败', err)
                                        } else {
                                            console.log('坐标转换成功', data.result[0])
                                            _this.wechatLocation = {
                                                longitude: data.result[0].x,
                                                latitude: data.result[0].y
                                            }
                                            _this.getDistanceRange()
                                            console.log(_this.wechatLocation);
                                            console.log('x轴 --' + data.result[0].x + ', y轴----' + data.result[0].y);
                                        }
                                    })
                                },
                                cancel: function (res) {
                                    sessionStorage.removeItem('wechatLocation')
                                    _this.count = 2
                                    _this.txt = '您拒绝了授权获取地理位置'
                                }
                            });
                        });
                    } else {
                        _this.count = 2
                        _this.txt = '获取定位信息失败'
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
            getDistance(lat1, lng1, lat2, lng2) {
                var radLat1 = this.rad(lat1);
                var radLat2 = this.rad(lat2);
                var a = radLat1 - radLat2;
                var b = this.rad(lng1) - this.rad(lng2);
                var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                s = s * 6378.137;// EARTH_RADIUS;
                s = Math.round(s * 10000) / 10000 * 1000; //输出为公里
                console.log(this.distanceRange + 'range')
                console.log(s + 's')
                if (Number(s) > Number(this.distanceRange)) {
                    this.count = 4
                    this.getPositon()
                }
            },
            rad(d) {
                return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
            },
            checkBack() {
                let data = JSON.parse(sessionStorage.getItem('headMan'))
                if (data) {
                    this.$router.replace({
                        name: 'checkIn',
                        query: {
                            type: data.type,
                            id: data.id,
                            industry: data.industry,
                            industryName: data.industryName,
                            time: data.time,
                            schedulingDate: data.schedulingDate
                        }
                    })
                } else {
                    this.$router.replace('/home/workspace')
                }
            },
            getPositon() {
                console.log(this.map)
                if (this.BMap) {
                    this.map.width = 185
                    this.map.height = 300
                    var point = new (this.BMap).Point(this.wechatLocation.longitude, this.wechatLocation.latitude);
                    this.map.clearOverlays();

                    var new_point = new (this.BMap).Point(this.wechatLocation.longitude, this.wechatLocation.latitude);
                    var marker = new (this.BMap).Marker(new_point);  // 创建标注
                    this.map.addOverlay(marker);              // 将标注添加到地图中
                    this.map.panTo(new_point);


                    var s_point = new (this.BMap).Point(this.longitude, this.latitude);
                    var s_marker = new (this.BMap).Marker(s_point);
                    this.map.addOverlay(s_marker);              // 将标注添加到地图中
                    this.map.panTo(s_point);
                    let circleRange = Number(this.distanceRange) || 5000
                    var circle = new (this.BMap).Circle(s_point, circleRange, {
                        fillColor: "#007aff",
                        strokeWeight: 1,
                        fillOpacity: 0.15,
                        strokeOpacity: 0.15
                    });
                    this.map.addOverlay(circle); //增加圆
                    var pointArr = [new_point, s_point];//多个点的集合
                    var view = this.map.getViewport(pointArr);
                    this.map.setViewport(view)
                    var mapZoom = view.zoom;
                    var centerPoint = view.center;
                    console.log(centerPoint)
                    this.map.enableScrollWheelZoom(true);
                    var label = new (this.BMap).Label("当前位置不在打卡范围内", {offset: new BMap.Size(-100, -60)});
                    label.setStyle({
                        color: "#e94418",
                        fontSize: "18px",
                        backgroundColor: "#fff",
                        border: "0",
                        padding: '10px',
                        fontWeight: 700
                    });
                    marker.setLabel(label);
                    var target = new (this.BMap).Label("打卡位置", {offset: new BMap.Size(-30, -50)});
                    target.setStyle({
                        color: "#000",
                        fontSize: "18px",
                        border: "0",
                        padding: '6px',
                        fontWeight: 700
                    });
                    s_marker.setLabel(target);
                }

            },
            handler({BMap, map}) {
                this.BMap = BMap
                console.log(map)
                this.map = map
                var point = new BMap.Point(this.wechatLocation.longitude, this.wechatLocation.latitude);
                // 创建点坐标
                map.centerAndZoom(point, 11);
                map.clearOverlays();
                var new_point = new BMap.Point(this.wechatLocation.longitude, this.wechatLocation.latitude);
                var marker = new BMap.Marker(new_point);  // 创建标注

                map.addOverlay(marker);              // 将标注添加到地图中
                map.panTo(new_point);
                console.log(map)

            },
        },
        mounted() {
            this.session = sessionStorage.getItem('code')
            this.signImg = sessionStorage.getItem('signImg')
            if (this.signImg) {
                this.signImgView = `${(sessionStorage.getItem('signImg'))}?imageMogr/rotate/270`
            }
            this.backUploadimg = sessionStorage.getItem('uploadimg')
            this.backCountNum = JSON.parse(sessionStorage.getItem('countNum'))
            this.cardDetail = JSON.parse(sessionStorage.getItem('cardDetail'))
            this.headMan = JSON.parse(sessionStorage.getItem('headMan'))

            if (this.$route.name == 'sginCheckInCard') {
                this.$indicator.close()
                if (this.backUploadimg) {
                    this.uploadimg = this.backUploadimg
                }

                this.form.jian = this.backCountNum.jian
                this.form.dai = this.backCountNum.dai
                this.form.che = this.backCountNum.che
                this.form.dun = this.backCountNum.dun
                this.combo = this.backCountNum.combo
                this.comboJian = this.backCountNum.comboJian
                this.comboDai = this.backCountNum.comboDai
                this.comboChe = this.backCountNum.comboChe
                this.comboDun = this.backCountNum.comboDun
                this.form.time = (this.cardDetail.time).substring(0, 5)
                this.form.date = this.cardDetail.date

                let limit24date = sessionStorage.getItem('limit24date')
                let limit24time = sessionStorage.getItem('limit24time')

                if (limit24date) {
                    this.form.date = limit24date
                    this.form.time = limit24time
                }


                this.form.industry = this.cardDetail.industryName
                this.checkInfo = this.cardDetail
                if (this.cardDetail.type == 1) {
                    this.workType = 1
                    this.title = '上班打卡'
                } else {
                    this.workType = 2
                    this.title = '下班打卡'
                }
                if (this.cardDetail.needPiece == 1) {//是否需要计件量
                    this.needPiece = 1

                } else {
                    this.needPiece = 2
                    if (this.cardDetail.pieceUnit) {
                        if (this.cardDetail.pieceUnit == 1) {
                            this.pieceUnit = 1
                        } else if (this.cardDetail.pieceUnit == 2) {
                            this.pieceUnit = 2
                        } else if (this.cardDetail.pieceUnit == 3) {
                            this.pieceUnit = 3
                        } else {
                            this.pieceUnit = 4
                        }
                        this.combo = false
                    } else {
                        this.combo = true
                    }
                }
                this.getTokenPhoto()
                this.count = 1
            } else {
                if (this.session) {  // 扫码
                    console.log('getInfo')
                    this.info = JSON.parse(this.session)
                    this.getInfo()
                } else {
                    console.log('sacn')
                    this.checkInfo.type = this.$route.query.type
                    this.scanCheck()
                    this.title = this.$route.query.type == 1 ? '上班打卡' : '下班打卡'
                    this.workType = this.$route.query.type
                }
            }
        },
        beforeDestroy() {
            sessionStorage.removeItem('signImg')
        },
    }
</script>

<style scoped>
    .fs {
        color: #636363;
    }

    .blue {
        color: #026bf9;
    }

    .info {
        color: #c4c4c4;
        margin-top: 0.6rem;
    }

    .confirm {
        color: #0d0d0d;
        text-align: center;
        margin: 1.5rem 0 1rem 0;
    }

    .box {
        width: 10.05rem;
        height: 10.05rem;
        border: solid 1px #dcdcdc;
        margin: 0 auto;
        overflow: hidden;
    }

    .signbox {
        /* width: 150px;
          height: 300px; */
        border: solid 1px #dcdcdc;
        margin: 0 auto;
        overflow: hidden;
    }

    .photo {
        width: 10.05rem;
        height: 10.05rem;
    }

    .sign {
        width: 300px;
        height: 150px;
    }

    .checkBox {
        justify-content: center;
        align-items: center;
        margin: 0.6rem 0 0.38rem;
    }

    .select {
        width: 0.93rem;
        height: 0.93rem;
    }

    .sign {
        width: 300px;
        height: 150px;
    }

    .self {
        font-size: 0.6rem;
        color: #c4c4c4;
        text-align: center;
    }

    .doneBtn {
        width: 10.45rem;
        height: 1.68rem;
        border-radius: 0.82rem;
        border: solid 1px #e84518;
        font-size: 0.65rem;
        color: #e84518;
        background: #fff;
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

    .btnBox {
        justify-content: center;
        margin-top: 1.5rem;
        padding-bottom: 2.7rem;
    }

    .countInput {
        width: 4.7rem;
        height: 1.45rem;
        border: solid 1px #dcdcdc;
        padding: 0 0.5rem;
        margin-right: 0.48rem;
    }

    .warn {
        width: 1.2rem;
        height: 1.2rem;
    }

    .warnBox {
        justify-content: center;
        align-items: center;
        margin-top: 30%;
    }

    .txt {
        color: #636363;
        margin-left: 0.73rem;
    }

    .success {
        width: 2.7rem;
        height: 2.7rem;
        display: block;
    }

    .successBox {
        justify-content: center;
        align-items: center;
    }

    .tipBox {
        justify-content: center;
        margin: 2.5rem auto 0;
        flex-direction: column;
        width: 90%;
    }

    .successText {
        color: #0d0d0d;
        text-align: center;
        margin: 0.7rem 0 1rem;
    }

    .doneBox {
        position: fixed;
        bottom: 0;
        left: 0;
        text-align: center;
        color: #e84518;
        width: 100%;
        border-top: 1px solid #e5e5e5;
        padding: 0.5rem 0;
        background: #fff;
        z-index: 1000;
    }

    .reBtn {
        width: 3.45rem;
        height: 1.68rem;
        border-radius: 1.01rem;
        font-size: 0.75rem;
        background: #e84518;
        color: #fff;
        margin-top: 1rem;
    }

    .red {
        color: #e20000;
        display: none;
    }

    .b-text {
        color: #0d0d0d;
        width: 85px;
    }

    .inlineBOx {
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 0.9rem;
    }

    .signBix {
        justify-content: flex-end;
    }

    .mapdiv {
        width: 100%;
        height: 100%;
    }

    .container {
        position: absolute;
        top: 2rem;
        left: 0;
    }
</style>