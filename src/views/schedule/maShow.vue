<template>
    <div class="ma-show">
        <mt-header title="二维码添加日结零工" class="page-title">
            <mt-button v-show="isCout == 1" icon="back" slot="left" @click="handleBack"></mt-button>
            <mt-button v-show="isCout == 2" icon="back" slot="left" @click="reTurn()"></mt-button>
        </mt-header>

        <div class="ma-content">
            <p>选择工种即可生成二维码，日结零工扫二维码即可直接加入该工种并考勤打卡。</p>

            <mt-cell v-if="isCout == 1" title="安排工种" class="black" @click.native="handlePicker3">
                <span class="fs">{{selectIndustry.industryName}}</span>
                <img src="../../assets/img/up@3x (2).png" alt="下拉" class="drop">
            </mt-cell>
            <div v-show="isCout == 2">
                <p class="pt15">打卡工种 : {{selectIndustry.industryName}}</p>
                <p class="pt5">上班打卡 : {{`${form.date} ${form.time}:00`}}</p>
                <div class="codeBox">
                    <div id="qrcode" ref="qrcode"></div>
                    <div class="str-time tc">
                        <span>{{`${form.date.substring(5,7)}月${form.date.substring(8,10)}日`}}</span>
                        <span>{{form.time}}</span>
                    </div>
                </div>
                <div class="please">请让零工使用微信扫码</div>
            </div>
        </div>
        <div class="btn-foot" v-if="isCout == 1">
            <mt-button type="primary" class="logBtn" @click="go">下一步</mt-button>
        </div>
        <mt-popup v-model="nationVisible3" position="bottom" class="mint-popup">
            <mt-picker :slots="industryList" :visible-item-count="5" :show-toolbar="true" ref="natitonPicker3" value-key="industryName">
                <div @click="handleConfirm3" class="sure">确认</div>
            </mt-picker>
        </mt-popup>
    </div>
</template>

<script>
    import Util from '../../common/util.js'
    import timeSpanEight from '../../common/timeSpanEight.js'
    import QRCode from 'qrcodejs2'
    let moment = require("moment");
    let Base64 = require('js-base64').Base64;
    export default {
        name: 'maShow',
        components: {},
        data() {
            return {
                nationVisible3:false,
                model:'代发收入', // 默认外包
                payType:'2',// 1 外包 2代发收入
                workerList: [],
                info:{},
                form:{
                    date:'',
                    time:'',
                },
                schedulingSettingVos:[],
                schedulingDate:'',
                isCout:1,
                industryList: [{
                    flex: 1,
                    values: [],
                    className: 'slot4',
                    textAlign: 'center',
                    defaultIndex: 0
                }],
                prePunchHours:0,
                selectIndustry: {
                    industryName: '请选择',
                },
                httpUrl:'',
                timeStr:'',
            };
        },

        computed: {},
        watch: {
        },
        mounted() {
            this.schedulingSettingVos = JSON.parse(this.$route.query.schedulingSettingVos)
            this.schedulingDate = this.$route.query.schedulingDate
            this.prePunchHours = this.$route.query.prePunchHours
            console.log(this.schedulingSettingVos)
            console.log(this.prePunchHours)
            this.getindustryList();
        },
        methods: {
            handleBack() {
                this.$router.go(-1)
            },
            reTurn(){
                this.isCout = 1;
            },
            qrcode() {
                document.getElementById('qrcode').innerHTML = '';
                let qrcode = new QRCode('qrcode', {
                    width:190,
                    height:190,
                    text:this.httpUrl, // 二维码地址
                    colorDark : "#000",
                    colorLight : "#fff",
                    correctLevel : QRCode.CorrectLevel.H

                })
            },
            getTime(time){
                this.$indicator.open({
                    spinnerType: 'fading-circle'
                })
                this.$api.getCurrentTime()
                    .then(res => {
                        if (res.data.respCode == 0) {
                            let resDate = res.data.data  // 时间戳
                            if (!this.timeDifference(time,resDate,this.prePunchHours)) {
                                this.$indicator.close();
                                return this.$toast(`上班时间开始前${this.prePunchHours}小时后才允许打卡`)
                            }
                            let nowStr = dayjs(resDate).format('YYYY-MM-DD HH:mm:ss');
                            let newStr = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
                            if(nowStr < newStr){
                                this.form.date = time.substring(0, 10)
                                this.form.time = time.substring(10, 16)
                            }else{
                                let hostDate = resDate.split(' ')[0]
                                let hostTime = resDate.split(' ')[1]
                                let time = Util.checkTime(1, hostDate, hostTime)
                                this.form.date = time.substring(0, 10)
                                this.form.time = time.substring(10, 16)
                            }
                            this.getTimeStr()
                            console.log(this.form.date + '打卡时间date')
                            console.log(this.form.time + '打卡时间time')
                        } else {
                            this.$toast('获取服务器时间失败')
                        }
                    })
                    .catch(err => {
                        this.$toast('获取服务器时间失败')
                    })
            },
            getWechatUrl: function () {
                let params = {
                    type: '17',
                    state: {
                        id:this.$route.query.id,
                        ind:this.selectIndustry.industry,
                        // industryName:encodeURIComponent(this.selectIndustry.industryName),
                        t:`${this.form.date}${this.form.time}:00`,
                        c:this.timeStr,
                        pt:this.payType//付款方式 1外包 2代发收入",
                    }
                };
                params.state = JSON.stringify(params.state);
                this.$api.wechatHandleNew(params).then(res => {
                    if(res.data.respCode === 0){
                        this.httpUrl = res.data.data;
                    this.isCout = 2;
                    this.qrcode();
                }
                console.log(res)
                }).catch(err => {
                    console.log(err)
                }).finally(()=>{
                    this.$indicator.close();
                })
            },
            getindustryList() {
                const params = {
                    schedulingId: this.$route.query.id
                }
                this.$api.getNOrepeatIndustry(params).then((response) => {
                    if (response.data.respCode == 0) {
                        this.industryList[0].values = response.data.data
                    }
                });
            },
            handlePicker3() {
                this.nationVisible3 = true
            },
            handleConfirm3() {
                this.selectIndustry = this.$refs.natitonPicker3.getValues()[0]
                console.log(this.selectIndustry)
                this.nationVisible3 = false
            },
            timeDifference(time1,timeNow,hour) {
                let m1 = moment(timeNow);
                console.log(m1)
                console.log(timeNow)
                let m2 = moment(time1);
                let minuteTotal;
                let du = moment.duration(m2 - m1, 'ms'),
                    hours = du.get('hours'),
                    minutes = du.get('minutes');
                minuteTotal = hours*60 + minutes;
                hour = hour*60;
                console.log(hour);
                console.log(minuteTotal);
                if (minuteTotal > hour) {
                    return false
                } else {
                    return true
                }
            },
            async go(){
                let workStartTime = '';
                if(!this.selectIndustry.industry){
                    return this.$toast('工种不能为空!')
                }
                for(let item of this.schedulingSettingVos){
                    if(item.industry == this.selectIndustry.industry){
                        if(!item.startTimeSet){
                            return this.$toast('该工种开始打卡时间未设置，无法生成二维码!')
                        }
                        workStartTime = item.startTimeSet;
                    }
                }
                // if (timeSpanEight(this.schedulingDate, workStartTime.substring(11,20),this.prePunchHours)) {
                //     return this.$messagebox({
                //         title: `提示`,
                //         message: `已超出上班时间${this.prePunchHours}小时，不可打卡`,
                //     })
                // }
                this.getTime(workStartTime);
            },
            getTimeStr(){
                this.$api.getHostTime()
                    .then(res => {
                        if (res.data.respCode == 0) {
                            console.log(res.data.data)
                            this.timeStr = res.data.data  // 时间戳
                            this.getWechatUrl();
                        }
                    }).catch(err=>{
                        console.log(err)
                })
            }
        },
    }
</script>
<style lang='scss'>
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .btn-foot{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;

        padding: convertToVw(12);
        z-index: 98;
        .logBtn{
            width: 100%;
        }
    }
    .str-time{
        position: absolute;
        margin: auto;
        background-color: #fff;
        width: convertToVw(70);
        line-height: convertToVw(20);
        height: convertToVw(40);
        color: #e84518;
        left:0;
        right:0;
        top:0;
        bottom:0;
        z-index: 111;
    }
    .ma-show {
        min-height: 100vh;
        background-color: #f5f5f5;
        .codeBox {
            position: relative;
            width: 200px;
            height: 200px;
            border: solid 1px #dcdcdc;
            margin: auto;
            padding: 10px 0 0 10px;
            margin-top: 1rem;
        }
        .cover {
            position: absolute;
            text-align: center;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0.5rem;
            color: #d6522d;
            background-color: #fff;
        }
        .please {
            color: #e84518;
            text-align: center;
            margin: 0.4rem 0 0;
        }
        .page-title {
            height: convertToVw(44);
            font-size: convertToVw(17);
            line-height: convertToVw(44);
            border-bottom: 1px solid #d9d9d9;
        }
        .drop{
            width: 0.43rem;
            height: 0.25rem;
            display: block;
            margin-left: 0.48rem;
        }
        .ma-content {
            padding: convertToVw(20) convertToVw(20);
            background-color: #fff;
            border-top: 1px solid #d9d9d9;
            border-bottom: 1px solid #d9d9d9;
        }

        .code-title {
            font-size: convertToVw(20);
            font-weight: bold;
            text-align: center;
            color: #000;
        }

        .code-tip {
            padding: convertToVw(16) 0 convertToVw(20) 0;
            font-size: convertToVw(13);
            color: #000;
            text-align: center;
        }

        .code-procedure {
            padding: 0 convertToVw(18);
            font-size: convertToVw(13);
            line-height: convertToVw(24);
            color: #6e7075;
        }

        .list-link {
            margin-top: convertToVw(20);
            border-top: 1px solid #d9d9d9;
            border-bottom: 1px solid #d9d9d9;
        }

        .mint-cell-allow-right::after {
            right: convertToVw(15);
        }
    }
</style>