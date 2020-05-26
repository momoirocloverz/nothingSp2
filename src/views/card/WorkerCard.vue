<template>
    <div class="worker-card">
        <mt-header :title="title" fixed class="mint-header-title">
            <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>

        <!--预检正常-->
        <div class="normal-status" v-if="count == 1 && display">
            <div class="page-icon">
                <div class="icon-img"></div>
                <p class="icon-tip">请确认打卡信息</p>
            </div>

            <div class="punch-info">
                <mt-cell title="打卡时间">
                    <span>{{newMa? data.t.substring(0, 10) : form.date}} {{newMa? data.t.substring(10, 20) : form.time}}</span>
                </mt-cell>
                <mt-cell title="打卡岗位">
                    <span>{{$route.query.industryName || form.industry}}</span>
                </mt-cell>
                <mt-cell title="打卡班组">
                    <span>{{team}}</span>
                </mt-cell>

                <p class="info-label" v-if="(!this.combo && $route.query.type == 2 && needPiece == 2) || this.combo">
                    计件量</p>

                <mt-cell title="计件量" v-if="!this.combo && $route.query.type == 2 && needPiece == 2 && pieceUnit == 1">
                    <input type="number" v-model="form.jian" @blur="checkNum1"
                           oninput="if(value.length>5)value=value.slice(0,5)">
                    <span>件</span>
                </mt-cell>
                <mt-cell title="计件量" v-if="!this.combo &&$route.query.type == 2 && needPiece == 2 && pieceUnit == 2">
                    <input type="number" v-model="form.dai" @blur="checkNum2"
                           oninput="if(value.length>4)value=value.slice(0,4)">
                    <span>袋</span>
                </mt-cell>
                <mt-cell title="计件量" v-if="!this.combo &&$route.query.type == 2 && needPiece == 2 && pieceUnit == 3">
                    <input type="number" v-model="form.che" @blur="checkNum3"
                           oninput="if(value.length>3)value=value.slice(0,3)">
                    <span>车</span>
                </mt-cell>
                <mt-cell title="计件量" v-if="!this.combo &&$route.query.type == 2 && needPiece == 2 && pieceUnit == 4">
                    <input type="number" v-model="form.dun" @blur="checkNum4"
                           oninput="if(value.length>7)value=value.slice(0,7)">
                    <span>吨</span>
                </mt-cell>

                <mt-cell title="计件量" v-if="this.combo && comboJian">
                    <input type="number" v-model="form.jian" @blur="checkNum1"
                           oninput="if(value.length>5)value=value.slice(0,5)">
                    <span>件</span>
                </mt-cell>
                <mt-cell title="计件量" v-if="this.combo && comboDai">
                    <input type="number" v-model="form.dai" @blur="checkNum2"
                           oninput="if(value.length>4)value=value.slice(0,4)">
                    <span>袋</span>
                </mt-cell>
                <mt-cell title="计件量" v-if="this.combo && comboChe">
                    <input type="number" v-model="form.che" @blur="checkNum3"
                           oninput="if(value.length>3)value=value.slice(0,3)">
                    <span>车</span>
                </mt-cell>
                <mt-cell title="计件量" v-if="this.combo && comboDun">
                    <input type="number" v-model="form.dun" @blur="checkNum4"
                           oninput="if(value.length>7)value=value.slice(0,7)">
                    <span>吨</span>
                </mt-cell>
                <div v-show="isShowSign && checkAuth" class="btn-zone">
                    <div class="btn" @click="handleNextStep">下一步</div>
                </div>
            </div>
        </div>

        <!--预检未通过-->
        <div class="status-error" v-if="count == 2">
            <span class="alert-icon"></span>
            <span class="txt">{{txt}}</span>
        </div>

        <!--不在打卡范围-->
        <div v-show="count == 5">
            <div class="container" style="height: 100%;width:100%">
                <baidu-map class="mapdiv" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler"></baidu-map>
            </div>
        </div>
    </div>
</template>

<script>
    import jsonp from 'jsonp'
    import Util from '../../common/util.js'
    import BaiduMap from '../../common/baidu-map.js'
    import wx from 'weixin-js-sdk'

    export default {
        name: 'workerCard',
        data() {
            return {
                needAuth: false,  // 是否需要人脸验证
                checkAuth: false, // 检查是否需要人脸验证
                title: '',
                count: 0,
                txt: '',
                picValue: '',
                isShowSign: false,
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
                team: '', // 班组名称
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
                width: '',
                height: '',
                map: null,
                zoom: 0,
                distance: '',
                display: false,
                isDisable: false,
                data: {},
                newMa:false,
            }
        },
        created() {
            if(this.$route.query.new){
                this.newMa = true;
            }
            if(sessionStorage.getItem("wechatLogin")){
                let data = JSON.parse(sessionStorage.getItem("wechatLogin")) || {};
                this.data = data.state;
                console.log(this.data)
            }
            if (this.data.id && this.$route.query.type != 1) {
                this.title = '上班打卡'
            }else{
                this.$route.query.type == 1? this.title = '上班打卡' : this.title = '下班打卡'
            }
            this.$indicator.open({
                spinnerType: 'fading-circle'
            })
            this.$api.getCurrentTime()
                .then(res => {
                    console.log(res)
                    if (res.data.respCode == 0) {
                        let resDate = res.data.data  // 时间戳
                        let setTime = false,time;
                        if(this.$route.query.setType == 1){//开始时间设置
                            let str = this.$route.query.startTimeSet.replace(/-/g,'/'); // 将-替换成/，因为下面这个构造函数只支持/分隔的日期字符串
                            let strTwo = resDate.replace(/-/g,'/');
                            let startData = new Date(str).getTime();
                            let resDateTime = new Date(strTwo).getTime();
                            if(resDateTime < startData){
                                setTime = true;
                                resDate = this.$route.query.startTimeSet;
                            }
                            console.log(startData,'设置的时间')
                            console.log(resDate,'显示的时间')
                            console.log(resDateTime,'现在的时间')
                        }else if(this.$route.query.setType == 2){//结束时间设置
                            if(this.$route.query.endTimeSet){
                                let str = this.$route.query.endTimeSet.replace(/-/g,'/'); // 将-替换成/，因为下面这个构造函数只支持/分隔的日期字符串
                                let strTwo = resDate.replace(/-/g,'/');
                                let startData = new Date(str).getTime();
                                let resDateTime = new Date(strTwo).getTime();
                                if(resDateTime > startData){
                                    setTime = true;
                                    resDate = this.$route.query.endTimeSet;
                                }
                            }
                        }
                        console.log(resDate)
                        let hostDate = resDate.split(' ')[0]
                        let hostTime = resDate.split(' ')[1]
                        if(!setTime){
                            time = Util.checkTime(this.$route.query.type, hostDate, hostTime)
                        }else{
                            time = resDate
                        }
                        console.log(time,'转化后的时间')
                        this.form.date = time.substring(0, 10)
                        this.form.time = time.substring(10, 16)
                        if(this.$route.query.setType == 3){//扫码打卡采用带过来的时间
                            this.form.date = this.$route.query.date;
                            this.form.time = this.$route.query.time;
                        }
                        if(this.$route.query.new){ //二维码添加普工打卡
                            this.form.date = this.data.t.substring(0, 10)
                            this.form.time = this.data.t.substring(11, 20)
                        }
                        console.log(this.form.date + '打卡时间date')
                        console.log(this.form.time + '打卡时间time')
                        this.preCheck()
                    } else {
                        this.$toast('获取服务器时间失败')
                    }
                }).catch(err => {
                    this.$toast('获取服务器时间失败')
                })
        },

        mounted() {
            console.log(this.distanceRange)
            console.log(this.$route)
            this.checkAuthHandler();
        },
        methods: {
            endTimeSetMessageBox(resDate){
                return this.$messagebox({
                    title: '打卡二维码生成提示',
                    message: `无论零工何时扫码，其打卡时间均为<br><span style="color: #ea441a;">${resDate}</span>`,
                    showCancelButton: true,
                    confirmButtonText: "继续打卡",
                    cancelButtonText: "暂不打卡"
                }).then(action => {
                    let hostDate = resDate.split(' ')[0]
                    let hostTime = resDate.split(' ')[1]
                    let time = Util.checkTime(this.$route.query.type, hostDate, hostTime)
                    this.form.date = time.substring(0, 10)
                    this.form.time = time.substring(10, 16)
                    console.log(this.form.date + '打卡时间date')
                    console.log(this.form.time + '打卡时间time')
                    this.preCheck()
                })
            },
            precisionHere(value){
                return (Math.round(+value + 'e' + 1) / Math.pow(10, 1)).toFixed(1);
            },
            insuranceTip() {
                let param = {
                    schedulingId: this.$route.query.schedulingId || this.data.id
                };
                this.$api.getCustomerFeeBySchId(param).then(res => {
                        if (res.data.respCode == 0) {
                            let showtip = localStorage.getItem('stopInsuranceTip')
                            let data = res.data.data
                            let feeInsuance = {}
                            let feeUse = {};
                            data.forEach(item => {
                                if (item.feeType == 1) {
                                    feeInsuance = item
                                }
                                if (item.feeType == 2) {
                                    feeUse = item
                                }
                            });
                            
                            let message = '';
                            let addontr = '<span style="text-align:left;">系统将会收取<span style="color:#ea441a;">系统使用费</span>，自动从收入里扣，未打卡不会收取；</span><br/>';
                            let insuranceMsg = `<span style="text-align:left;"></span>`
                            let useMsg = `<span style="text-align:left;">系统将会收取<span style="color:#ea441a;">${this.precisionHere(feeUse.feeAmount)}元/天的使用费</span>，自动从收入里扣，未上班不会收取；</span>`;
                            if( feeInsuance.feeStatus == 1 ){
                                if( feeInsuance.feeObj == 2 ){
                                    if( feeUse.feeStatus == 2 ){
                                        insuranceMsg = `<span style="text-align:left;">系统使用费${this.precisionHere(feeInsuance.feeAmount)}~${2* (this.precisionHere(feeInsuance.feeAmount))}元/次，系统将赠送您<span style="color:#ea441a;">30万额度的人身意外险</span>（白班赠送1份今天的，晚班赠送2份今天及明天的，<strong>16岁以下和65岁以上不会赠送</strong>）</span>`;
                                        message = `${addontr}${insuranceMsg}`
                                    }
                                    if( feeUse.feeStatus == 1 ){
                                        if( feeUse.feeObj == 2 ){
                                            insuranceMsg = `<span style="text-align:left;">系统使用费${this.precisionHere(feeInsuance.feeAmount + feeUse.feeAmount)}~${this.precisionHere(2*(feeInsuance.feeAmount)+ feeUse.feeAmount)}元/次，系统将赠送您<span style="color:#ea441a;">30万额度的人身意外险</span>（白班赠送1份今天的，晚班赠送2份今天及明天的，<strong>16岁以下和65岁以上不会赠送</strong>）</span>`;
                                            message = `${addontr}${insuranceMsg}`
                                        }
                                        if( feeUse.feeObj == 1 ){
                                            insuranceMsg = `<span style="text-align:left;">系统使用费${this.precisionHere(feeInsuance.feeAmount + feeUse.feeAmount)}~${this.precisionHere(2*(feeInsuance.feeAmount) + feeUse.feeAmount)}元/次，系统将赠送您<span style="color:#ea441a;">30万额度的人身意外险</span>（白班赠送1份今天的，晚班赠送2份今天及明天的，<strong>16岁以下和65岁以上不会赠送</strong>）</span>`;
                                            message = `${addontr}${insuranceMsg}<br/>${useMsg}`
                                        }
                                    }
                                }
                            }
                            
                            if( feeInsuance.feeStatus == 1 ){
                                if( feeInsuance.feeObj == 1 ){
                                    if( (feeUse.feeStatus == 1)&&(feeUse.feeObj == 2) ){
                                        message = `${addontr}${useMsg}`
                                    }
                                }
                            }
                            
                            if( feeInsuance.feeStatus == 2 ){
                                    if( (feeUse.feeStatus == 1)&&(feeUse.feeObj == 2) ){
                                        message = `${addontr}${useMsg}`
                                    }
                            }
                            
                            if (showtip == undefined && (this.$route.query.type == 1 || this.$route.query.new) && message.length > 0) {
                                this.$messagebox({
                                    title: `上班打卡后，系统将进行以下扣费`,
                                    message: message,
                                    showCancelButton: true,
                                    confirmButtonText: "知道了",
                                    cancelButtonText: "以后不再提示"
                                }).then(action => {//确认的回调
                                    if (action == 'confirm') {

                                    }
                                    if (action == 'cancel') {
                                        localStorage.setItem('stopInsuranceTip', 'true')
                                    }
                                }).catch(err => {//取消的回调
                                }).finally(() => {
                                        if (this.needAuth) {
                                            this.handleToAuth()
                                        } else {
                                            this.toWrite()
                                        }
                                    })
                            } else {
                                if (this.needAuth) {
                                    this.handleToAuth()
                                } else {
                                    this.toWrite()
                                }
                            }
                        }
                    })
                    .catch(err => {

                    })
            },

            checkAuthHandler() {
                let param = {
                    schedulingId: this.$route.query.schedulingId || this.data.id
                }

                this.$api.faceCompareGet(param)
                    .then(res => {
                        if (res.data.respCode == 0) {
                            // data  0：需要  1：不需要
                            if (res.data.data == 0) {
                                this.needAuth = true
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => {
                        this.checkAuth = true
                    })
            },
            handleBack() {
                this.$router.push({name: 'calendar'})
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
                            sessionStorage.setItem("userInfo", JSON.stringify(response.data.data));
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },

            preCheck() {
                let time = this.newMa ? this.data.t.substring(11, 20) : this.form.time + ':00';
                let type = this.$route.query.type || 1;
                let date = this.newMa ? this.data.t.substring(0, 10) : this.form.date;
                const params = {
                    schedulingId: this.$route.query.schedulingId || this.data.id,
                    type: type,
                    industry: this.$route.query.industry || this.data.ind,
                    date: date,
                    time: time.trim(),
                };
                //零工打卡预扫描
                this.$api
                    .WorkerCardCheck(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            this.distanceRange = response.data.data.punchRange;
                            this.latitude = response.data.data.latitude
                            this.longitude = response.data.data.longitude
                            this.getWechat()
                            this.form.time = (response.data.data.time).substring(0, 5)
                            this.form.industry = response.data.data.industryName
                            this.team = response.data.data.schedulingName
                            this.form.date = response.data.data.date
                            let startPunch = response.data.data.startPunchDateTime
                            if (startPunch) {
                                let startPunchString = startPunch.replace(new RegExp(/-/gm), "/")
                                let startStamp = new Date(startPunchString).getTime()
                                let nowString = `${this.form.date} ${this.form.time}`.replace(new RegExp(/-/gm), "/")
                                let nowStamp = new Date(nowString).getTime()

                                // 下班打卡时间比上班时间多24.5小时以上，下班时间强制设置为上班时间+24
                                if (nowStamp - startStamp >= 245 * 3600 * 100) {
                                    let nowStamp = startStamp + 24 * 3600 * 1000
                                    let nowDate = new Date(nowStamp + 8 * 3600 * 1000)
                                    let dateString = nowDate.toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                                    this.form.date = dateString.split(' ')[0]
                                    this.form.time = dateString.split(' ')[1].substring(0, 5)
                                }
                            }

                            this.checkInfo = response.data.data
                            this.count = 1;
                            if (response.data.data.needPiece == 1) {  //是否需要计件量
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
                            this.txt = response.data.errorMsg
                            if (response.data.errorCode == 90055) {
                                let message = JSON.parse(response.data.errorMsg)
                                this.txt = `${message.talentName}本次考勤存在时间段冲突,冲突排班：${message.schedulingName},考勤工种：${message.industryName},上班打卡：${message.punchStartTime},下班打卡：${message.punchendTime}`
                            }

                            // 未进行人脸核身
                            if (response.data.errorCode == 20023) {
                                if (this.needAuth) {
                                    localStorage.setItem('lastUrl', window.location.href)
                                    this.$router.push({name: 'autherror'})
                                }
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.isShowSign = true
                        this.$indicator.close()
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

            // 签字
            toWrite() {
                sessionStorage.setItem('selfImg', this.uploadimg)
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
                sessionStorage.setItem('selfCount', JSON.stringify(countNum))//计件量
                this.$router.push({name: 'workerCanvas'})
            },

            // 下一步
            handleNextStep() {
                // 根据规则，下一步是去签字还是人脸认证
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
                if (!this.combo && this.$route.query.type == 2 && this.needPiece == 2 && this.pieceUnit == 1) {
                    this.checkNum1()
                    if (!this.isJian) {
                        this.$toast('计件量不能为空')
                        return false
                    }
                }
                if (!this.combo && this.$route.query.type == 2 && this.needPiece == 2 && this.pieceUnit == 2) {
                    this.checkNum2()
                    if (!this.isdai) {
                        this.$toast('计件量不能为空')
                        return false
                    }
                }
                if (!this.combo && this.$route.query.type == 2 && this.needPiece == 2 && this.pieceUnit == 3) {
                    this.checkNum3()
                    if (!this.ische) {
                        this.$toast('计件量不能为空')
                        return false
                    }
                }
                if (!this.combo && this.$route.query.type == 2 && this.needPiece == 2 && this.pieceUnit == 4) {
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

                let obj = {
                    type: this.$route.query.type || 1,
                    schedulingId: this.$route.query.schedulingId || this.data.id,
                    industry: this.$route.query.industry || this.data.ind,
                    industryName: this.$route.query.industryName || this.form.industry,
                    team: this.team,
                    date: this.form.date || this.data.t.substring(0,10),
                    time: this.form.time || this.data.t.substring(10,16),
                    pieceSize: JSON.stringify(pieceSize)
                }

                sessionStorage.setItem('punchData', JSON.stringify(obj))
                localStorage.setItem('punchData', JSON.stringify(obj))

                sessionStorage.setItem('signback', window.location.href)
                localStorage.setItem('lastUrl', window.location.href)
                this.insuranceTip()
            },
            //获取微信定点位置
            getWechat() {
                let url3 = encodeURIComponent(location.href.split('#')[0]);
                console.log(url3)
                let urlDate = {
                    url: url3
                };
                this.$api.shareSDK(urlDate).then(res => {
                    let _this = this;
                    if (res.data.respCode == 0) {
                        let data = res.data.data;
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: data.appId, // 必填，公众号的唯一标识
                            timestamp: data.timestamp, // 必填，生成签名的时间戳
                            nonceStr: data.nonceStr, // 必填，生成签名的随机串
                            signature: data.signature, // 必填，签名，见附录1
                            jsApiList: ["getLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                        wx.error(function (res) {
                            console.log(JSON.stringify(res));
                            _this.count = 2
                            _this.txt = '获取定位失败'
                        });
                        wx.ready(function () {
                            wx.getLocation({
                                /*type: 'gcj02',*/
                                success: function (res) {
                                    _this.wechatLocation = res;
                                    let ak = 'HIpuFBetnp1KKYrfcleBipO6x31IeI63'
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
                                            console.log(_this.wechatLocation);
                                            console.log('x轴 --' + data.result[0].x + ', y轴----' + data.result[0].y);
                                            _this.getDistanceRange();
                                        }
                                    })
                                },
                                cancel: function (res) {
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
            getDistanceRange() {
                this.getDistance(this.wechatLocation.latitude, this.wechatLocation.longitude, this.latitude, this.longitude)
            },
            //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
            getDistance(lat1, lng1, lat2, lng2) {

                let startPoint = new (this.BMap).Point(lng1, lat1)
                let endPoint = new (this.BMap).Point(lng2, lat2)
                let currentDistance = this.map.getDistance(startPoint, endPoint)
                console.info('当前实际距离是：', currentDistance)
                console.info('设置的打卡距离是：', this.distanceRange)
                if (Number(currentDistance) > Number(this.distanceRange)) {
                    this.getPositon()
                    window.scrollTo(0, 0);
                    this.count = 5
                } else {
                    this.display = true;
                }
            },

            handler({BMap, map}) {
                this.BMap = BMap
                this.map = map
                // 创建点坐标
                map.clearOverlays();
                var new_point = new BMap.Point(this.wechatLocation.longitude, this.wechatLocation.latitude);
                var marker = new BMap.Marker(new_point);  // 创建标注

                map.addOverlay(marker);              // 将标注添加到地图中
                map.panTo(new_point);

            },
            getPositon() {
                if (this.BMap) {
                    this.map.width = 185
                    this.map.height = 300
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
        },
    }
</script>

<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    .worker-card {
        min-height: 100vh;
        background-color: #f5f5f5;
        box-sizing: border-box;
        padding-top: convertToVw(44);

        .mint-header-title {
            font-size: convertToVw(17);
            height: convertToVw(44);
            line-height: convertToVw(44);
        }

        .mint-cell-wrapper {
            border-bottom: 1px solid #d6d6d6;
        }

        .mint-cell-text,
        .mint-cell-value {
            font-size: convertToVw(16);
        }

        .mint-cell-value {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 60vw;
            padding-right: convertToVw(15);
            line-height: 1.5;
        }

        .info-label {
            padding: 0 convertToVw(15);
            font-size: convertToVw(13);
            line-height: convertToVw(32);
            color: #969799;
        }

        .page-icon {
            padding-top: convertToVw(80);
            padding-bottom: convertToVw(22);
            background-color: #f5f5f5;

            .icon-img {
                width: convertToVw(98);
                height: convertToVw(98);
                margin: auto;
                background-image: url(../../assets/img/status_pending.png);
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center center;
            }

            .icon-tip {
                margin-top: convertToVw(22);
                font-size: convertToVw(17);
                text-align: center;
                color: #000;
            }
        }

        .btn-zone {
            margin-top: convertToVw(10);
            padding: convertToVw(20) convertToVw(18);
            background-color: #fff;

            .btn {
                padding: 0;
                border-radius: 5px;
                font-size: convertToVw(17);
                height: convertToVw(48);
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #ea441a;
                color: #fff;
                padding: 0;
            }
        }

        .status-error {
            padding-top: convertToVw(40);
            padding-left: convertToVw(28);
            padding-right: convertToVw(28);

            .alert-icon {
                display: inline-block;
                vertical-align: middle;
                width: convertToVw(20);
                height: convertToVw(20);
                margin-right: 5px;
                background-image: url(../../assets/img/prompt@3x.png);
                background-size: cover;
                background-position: center center;
                background-repeat: no-repeat;
            }
        }

        .container {
            position: absolute;
            top: 2rem;
            left: 0;
        }

        .mapdiv {
            width: 100%;
            height: 100%;
        }
    }
</style>
