<template>
    <div class="calendar">
        <div v-show="!mapShow">
            <mt-header title="排班日历" fixed class="mint-header-title">
                <router-link to="/home/workspace" slot="left">
                    <mt-button icon="back"></mt-button>
                </router-link>
                <img src="../../assets/img/add_scheduling@3x.png" alt="加入排班" slot="right" class="view"
                     @click="handleCodeAdd">
            </mt-header>

            <div class="calendar-wrapper">
                <Calendar ref="Calendar" :markDateMore="arr" v-on:choseDay="clickDay"
                          v-on:changeMonth="changeDate"></Calendar>
            </div>
            <div class="arrow-panel">
                <img src="../../assets/img/arrow_bottom.png" alt="箭头" class="arrow">
            </div>

            <div class="total-salary" v-show="">当天总劳务收入：<strong>{{totalSalary}}</strong></div>

            <div class="content" v-show="show && !mapShow">
                <div :key="index" v-for="(item,index) in workerInfo" class="scheduling-item">
                    <div class="flexable titleTop">
                        <div class="flexable titleTop1">
                            <div class="title">{{item.taskName}}</div>
                            <div class="tagBox">
                                <span class="tag">{{item.industryName}}</span>
                            </div>
                        </div>
                        <div class="scheduling-dalary" :class="{unconfirm: item.schedulingTalentConfirmStatus == 1}">
                            <!--<template v-if="item.settleStatus==1 && item.schedulingTalentConfirmStatus == 1">待确认</template>-->
                            <template v-if="item.settleStatus==2 && item.schedulingTalentConfirmStatus == 1">待结算</template>
                            <template v-if="item.schedulingTalentConfirmStatus == 2">+{{item.talentSalary}}</template>
                        </div>
                        <div class="repulseText1" @click="selfCard(item)"
                             v-if="(item.punchWay == 1 || item.punchWay == '2') && item.settleStatus == 1 && item.schedulingTalentConfirmStatus == 1">
                            打卡
                        </div>
                    </div>
                    <div class="contentBox flexable">
                        <!--<div class="timeTitle">上下班时间：</div>-->
                        <div class="timeTitle">预计工作时间：</div>
                        <div class="timeText">{{item.settingWorkStartTime | formatTime}}至{{item.settingEndWorkType == 2
                            ? '次日' : '当日'}}{{item.settingWorkEndTime | formatTime}}
                        </div>
                    </div>
                    <div class="contentBox flexable">
                        <div class="timeTitle">打卡要求：</div>
                        <div class="timeText">
                            {{item.startTimeSet? item.startTimeSet : ''}}
                            <span class="co-orange" v-if="!item.startTimeSet">未设置</span>
                            至
                            {{item.endTimeSet? item.endTimeSet : ''}}
                            <span v-if="!item.endTimeSet" class="co-orange">未设置</span>
                        </div>
                    </div>
                    <div class="contentBox flexable">
                        <div class="timeTitle">工作地点：</div>
                        <span class="timeText">{{item.workingPlace}}</span>
                        <img src="../../assets/img/location@3x.png" alt="定位" class="location"
                             @click="getPositon(item.latitude,item.longitude)">
                    </div>

                    <template v-if="item.schedulingPunchList">
                        <div v-for="(subitem, subindex) of item.schedulingPunchList" :key="subindex">
                            <div class="checkBox flexable contentBox">
                                <div class="check1 flexable">
                                    <div class="timeTitle">上班打卡：</div>
                                    <div class="uncheck" v-if="!subitem.workStartTime">未打卡</div>
                                    <span class="check" v-if="subitem.workStartTime">{{subitem.workStartDate | forDate}} {{subitem.workStartTime | formatTime}}</span>
                                </div>
                                <div class="flexable">
                                    <div class="timeTitle">下班打卡：</div>
                                    <span class="uncheck1" v-if="!subitem.workEndTime">未打卡</span>
                                    <span class="check1" v-if="subitem.workEndTime">{{subitem.workEndDate | forDate}} {{subitem.workEndTime | formatTime}}</span>
                                </div>
                            </div>
                            <div class="flexable contentBox">
                                <div class="flexable check1">
                                    <div class="timeTitle">工作时长：</div>
                                    <span class="check">{{subitem.workHours ? subitem.workHours : subitem.workHours == undefined ? '无' : 0}}</span>
                                </div>
                            </div>
                            <div class="contentBox">
                                <span class="timeTitle priceTitle">单价：</span>
                                <span class="price" v-if="item.isDailyPay == 1">{{item.dailyPayAmount}}/天</span>
                                <span class="price" v-if="item.isDailyPay != 1">{{item.talentSalaryPlan}}</span>
                            </div>
                            <div v-if="!(item.valuationType== 1 || item.valuationType== 8)" class="contentBox">
                                <span class="countTitle">计件量：</span>
                                <span class="timeText"
                                      v-if="subitem.pieceSize">{{subitem.pieceSize | formatPieceSize1}}</span>
                                <span class="timeText" v-if="!subitem.pieceSize">无</span>
                            </div>

                            <div class="resign-btn">
                                <span class="repulseText tag-btn"
                                      v-if="item.settleStatus == 1 && subitem.workStartTime"
                                      @click="handleResign(subitem.id)">重新签名</span>
                            </div>
                        </div>
                    </template>

                    <div class="btnbOX flexable">
                        <a :href="'tel:'+item.managerMobile" class="agreeText">联系项目经理</a>
                        <div class="repulseText"
                             @click="$router.push({name:'headman',query:{id:item.schedulingId,punchWay:item.punchWay ? item.punchWay : 1}})"
                             v-if="item.isForeman == 1">排班管理
                        </div>
                    </div>
                </div>
            </div>

            <div v-show="!show" class="none">暂无排班信息</div>

            <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
        </div>

        <div v-show="mapShow">
            <mt-header title="地图详情" fixed class="mint-header-title">
                <div slot="left">
                    <mt-button icon="back" @click="mapShow=false"></mt-button>
                </div>
            </mt-header>
            <div class="container" style="height: 100%;">
                <baidu-map class="mapdiv" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler">
                </baidu-map>
            </div>
        </div>
    </div>
</template>
<script>
    import Calendar from 'vue-calendar-component';
    import Util from '../../common/util.js'
    import timeSpanEight from '../../common/timeSpanEight.js'
    import BaiduMap from '../../common/baidu-map.js'
    let moment = require("moment");

    export default {
        data() {
            return {
                zoom: 0,
                mapShow: false,
                arr: [],
                data: [],
                totalSalary: '0',
                selectDay: '',
                workerInfo: [],
                show: false,
                actions: [{
                    name: '上班打卡',
                    method: this.startCard	// 调用methods中的函数
                }, {
                    name: '下班打卡',
                    method: this.endCard	// 调用methods中的函数
                }],
                talentSalaryMap: null, // 劳务收入
                // action sheet 默认不显示，为false。操作sheetVisible可以控制显示与隐藏
                sheetVisible: false,
                item: {},
                stamp: '',
                nowstamp: '',
            };
        },
        components: {
            Calendar
        },
        methods: {
            clickDay(data) {
                let time = Util.onlyDate(data);
                this.getDetail(time);
                this.selectDay = time
            },
            changeDate(data) {
                let time = Util.onlyDate(data);
                this.getList(time)
            },

            getList(date) {
                const params = {
                    yearMonth: date.substring(0, 7)
                };
                this.$api
                    .scheduleCan(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            this.arr = [];
                            this.data = response.data.data;

                            sessionStorage.setItem('lastDate', date)
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            getDetail(date) {
                const params = {
                    date: date
                };
                this.$api
                    .scheduleDetail(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            if (response.data.data) {
                                this.show = true
                            } else {
                                this.show = false
                            }
                            this.workerInfo = response.data.data
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            viewMap(latitude, longitude) {
                let that = this;
                BaiduMap.init().then((BMap, bmap) => {
                    console.log(bmap);
                    var map = new BMap.Map("allmap");    // 创建Map实例
                    var point = new BMap.Point(longitude, latitude);
                    map.centerAndZoom(point, 15);
                    var marker = new BMap.Marker(point);  // 创建标注
                    map.addOverlay(marker);               // 将标注添加到地图中
                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    that.mapShow = true

                })
            },
            handler({BMap, map}) {
                this.BMap = BMap;
                this.map = map;
                if (this.select) {
                    var point = new BMap.Point(this.select.lng, this.select.lat);
                    // 创建点坐标
                    map.centerAndZoom(point, 11);
                    map.clearOverlays();
                    var new_point = new BMap.Point(this.select.lng, this.select.lat);
                    var marker = new BMap.Marker(new_point);  // 创建标注
                    map.addOverlay(marker);              // 将标注添加到地图中
                    map.panTo(new_point);
                }
            },
            handleCodeAdd() {
                this.$router.push({name: 'codeadd'})
            },
            getPositon(latitude, longitude) {
                this.select = {
                    lng: longitude,
                    lat: latitude,
                };

                this.mapShow = true;
                if (this.BMap) {
                    this.map.width = 185;
                    this.map.height = 300;
                    if (this.select) {
                        var point = new (this.BMap).Point(this.select.lng, this.select.lat);
                        // 创建点坐标
                        this.map.centerAndZoom(point, 18);
                        this.map.clearOverlays();
                        var new_point = new (this.BMap).Point(this.select.lng, this.select.lat);
                        var marker = new (this.BMap).Marker(new_point);  // 创建标注
                        this.map.addOverlay(marker);              // 将标注添加到地图中
                        this.map.panTo(new_point);
                    }
                }
            },
            messageForDownload(){
                return this.$messagebox({
                    title: '下载提示',            
                    message: '<div style="line-height: 30px; text-align: center;">微信打卡功能已关闭，请安装<br><span style="color: #ea441a;">【佳薪宝app】</span>进行打卡。<div>', 
                    showCancelButton: true,
                    confirmButtonText: "马上下载",
                }).then(action => {
                    if (action == 'confirm') {
                        location.href = 'http://wap.10000rc.com/index.html#/shareApp2';
                    }
                })
            },
            selfCard(val) {
                console.log('这里'); 
                    this.messageForDownload();
//                if(val.punchWay == 1){
//                    return this.$messagebox({
//                        title: `提示`,
//                        message: `本排班打卡方式为扫码打卡，请使用微信扫打卡二维码进行打卡`,
//                    })
//                }else if(val.punchWay == 2){
//                    this.sheetVisible = true;
//                    this.item = val;
//                }
            },
            async startCard() {
                let { data }= await this.$api.getCurrentTime();
                let timeStamp = data.data;
                if(!this.item.startTimeSet){
                    return this.$toast('该排班此工种未设置开始打卡时间,故不能打卡,请联系项目经理')
                }
                if (!this.timeDifference(this.item.startTimeSet,timeStamp,this.item.prePunchHours)) {
                    return this.$toast(`上班时间开始前${this.item.prePunchHours}小时后才允许打卡`)
                }
                let date = this.item.startTimeSet.substring(0,10),time = this.item.startTimeSet.substring(11,20)
                if (timeSpanEight(date, time)) {
                    return this.$messagebox({
                        title: `提示`,
                        message: `已超出上班时间24小时，不可打卡`,
                    })
                }
                this.$router.push({path: '/workerCard',
                    query: {
                        schedulingId: this.item.schedulingId,
                        industry: this.item.industry,
                        type: 1,
                        setType:1,//表示开始设置时间
                        startTimeSet:this.item.startTimeSet,
                        industryName: this.item.industryName,
                    }
                })
            },

            async endCard() {
                let { data }= await this.$api.getHostTime();
                let timeStamp = data.data;
                console.log(timeStamp)
                console.log(this.item)
                if(!this.item.endTimeSet){
                    console.log('2')
                    let preDate,preStamp;
                    if(this.item.settingEndWorkType == 1){//当日
                        preDate = this.item.schedulingDate;
                    }else if(this.item.settingEndWorkType == 2){//次日
                        preDate = moment(this.item.schedulingDate).add(1,'days').format("YYYY-MM-DD")
                    }
                    preStamp = moment(`${preDate} ${this.item.settingWorkEndTime}`).valueOf();
                    if(timeStamp > preStamp){
                        //晚于预期时间
                        return this.$toast('该排班此工种未设置结束时间故不能打卡,请联系项目经理!')
                    }
                    this.$router.push({
                        path: '/workerCard',
                        query: {
                            schedulingId: this.item.schedulingId,
                            industry: this.item.industry,
                            type: 2,
                            setType: 2,//表示结束设置时间
                            endTimeSet: this.item.endTimeSet || '',
                            industryName: this.item.industryName,
                        }
                    })
                    console.log(preDate)
                    console.log(preStamp,'时间戳')
                }else{
                    let setStamp = moment(`${this.item.endTimeSet}`).valueOf()
                    if(timeStamp > setStamp){
                        return this.$messagebox({
                            title: '',
                            message: `该排班下班打卡不允许超时，您结束打卡时间为<br><span style="color: #ea441a;">${this.item.endTimeSet}</span>`,
                            showCancelButton: true,
                            confirmButtonText: "确认",
                            cancelButtonText: "取消"
                        }).then(action => {
                            if (action == 'confirm') {
                                this.$router.push({
                                    path: '/workerCard',
                                    query: {
                                        schedulingId: this.item.schedulingId,
                                        industry: this.item.industry,
                                        type: 2,
                                        setType: 2,//表示结束设置时间
                                        endTimeSet: this.item.endTimeSet || '',
                                        industryName: this.item.industryName,
                                    }
                                })
                            }
                        })
                    }else{
                        this.$router.push({
                            path: '/workerCard',
                            query: {
                                schedulingId: this.item.schedulingId,
                                industry: this.item.industry,
                                type: 2,
                                setType: 2,//表示结束设置时间
                                endTimeSet: this.item.endTimeSet || '',
                                industryName: this.item.industryName,
                            }
                        })
                    }
                }
            },
            timeDifference(time1,timeNow,hour) {
                let m1 = moment(timeNow);
                let m2 = moment(time1);
                let minuteTotal;
                let du = moment.duration(m2 - m1, 'ms'),
                    hours = du.get('hours'),
                    minutes = du.get('minutes');
                    console.log(m1);
                    console.log(m2);
                    console.log(minutes);
                    console.log(minutes);
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
            handleResign(id) {
                this.$router.push({path: '/resign', query: {id: id}})
            },
            update() {
                let element = document.querySelectorAll('.wh_item_date');
                let elementLength = element.length;
                let dataLength = this.data.length;
                let startPos = 0;

                for (let k = 0; k < elementLength; k++) {
                    element[k].removeAttribute('data-data')
                }

                for (let i = 0; i < elementLength; i++) {
                    if (element[i].innerHTML == '1') {
                        startPos = i;
                        break
                    }
                }

                for (let j = 0; j < dataLength; j++) {
                    if (this.data[j].total != 0) {
                        if (this.data[j].total == this.data[j].unSettleCount) {
                            element[j + startPos].setAttribute('data-data', '•••')
                        } else {
                            let num = Number.parseFloat(this.data[j].totalSalary);
                            if (!Number.isInteger(num)) {
                                num *= 100;
                                num = Number.parseInt(num);
                                num = num / 100
                            }
                            element[j + startPos].setAttribute('data-data', num)
                        }
                    } else {
                        element[j + startPos].removeAttribute('data-data')
                    }
                }
            },

            restoreLastPage() {
                let lastDate = sessionStorage.getItem('lastDate');
                if (lastDate) {
                    this.getList(lastDate)
                } else {
                    this.getList(Util.getTime())
                }


                let lastDay = sessionStorage.getItem('lastDay');
                if (lastDay) {
                    this.$nextTick(() => {
                        let day = lastDay.split('-')[2];
                        let itemList = document.querySelectorAll('.wh_item_date') || [];
                        itemList = Array.from(itemList);
                        itemList.forEach(item => {
                            if (!item.className.includes('wh_other_dayhide') && item.innerHTML == day) {
                                item.click()
                            }
                        })
                    })
                }
            }
        },
        mounted() {
            this.getList(Util.getTime())
            console.log(this.arr)
        },
        filters: {
            formatPieces(val) {
                if (val == 1) {
                    return '(待审核)'
                }
            },
            formatPieceSize1(val) {
                if (val) {
                    if (Util.formatPieceSize(val) == '') {
                        return '无'
                    } else {
                        return Util.formatPieceSize(val)
                    }
                } else {
                    return '无'
                }
            },
            formatTime(val) {
                if (val) {
                    return val.substring(0, 5)
                }
            },forDate(val) {
                if (val) {
                    return val.substring(5)
                }
            },
        },
        watch: {
            data: {
                handler(newValue, oldValue) {
                    console.log(newValue)
                    if (newValue) {
                        this.talentSalaryMap = new Map();
                        // newValue.forEach((item,index) => {
                        //     this.talentSalaryMap.set(newValue[i].calendarDate, newValue[i]);
                        // })
                        for (let i of newValue) {
                            this.talentSalaryMap.set(i.calendarDate, i);
                            if (i.total > 0) {
                                let obj = {};
                                if (i.unSettleCount == 0) { // 全部已结算
                                    obj = {
                                        date: i.calendarDate,
                                        className: 'mark2'
                                    }
                                } else { // 部分未结算或全部未结算
                                    obj = {
                                        date: i.calendarDate,
                                        className: 'mark1'
                                    }
                                }
                                this.arr.push(obj)
                            }
                        }
                    }

                    this.update()
                },
                deep: true
            },
            selectDay: {
                handler(val, oldval) {
                    if (val) {
                        if (this.talentSalaryMap) {
                            this.totalSalary = this.talentSalaryMap.get(val) && this.talentSalaryMap.get(val).totalSalary
                        }
                    }
                },
                deep: true
            }
        },
        beforeRouteLeave(to, from, next) {
            this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            sessionStorage.setItem('scrollTop', this.scrollTop);
            sessionStorage.setItem('lastDay', this.selectDay);
            console.log(this.scrollTop);
            next()
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                console.log(from.name);
                if (from.name == 'headman') {
                    let scrollTop = sessionStorage.getItem('scrollTop');
                    console.log(scrollTop);
                    window.scrollTo(0, scrollTop);
                } else {
                    console.log(vm.$refs.Calendar);
                    window.scrollTo(0, 0);
                    vm.$refs.Calendar.ChoseMonth(new Date, true)
                }
                vm.restoreLastPage()
            })
        },
    };
</script>
<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    .calendar {
        padding-bottom: convertToVw(38);
        background-color: #f5f5f5;

        .mint-header-title {
            height: convertToVw(44);
            font-size: convertToVw(17);
            line-height: convertToVw(44);
        }

        .calendar-wrapper {
            margin-top: convertToVw(44);
            padding-bottom: convertToVw(15);
            background-color: #fff;
        }

        h3 {
            text-align: center;
            width: 90%;
            margin: auto;
        }

        .div {
            margin: auto;
            width: 220px;
            height: 44px;
            line-height: 44px;
            background: #0fc37c;
            color: #fff;
            font-size: 17px;
            text-align: center;
            margin-top: 20px;
        }

        // .mark1部分或全部未结算  .mark2全部结算
        .wh_container .mark1::after {
            content: "";
            display: block;
            position: absolute;
            width: 5px;
            height: 5px;
            top: convertToVw(8);
            right: convertToVw(8);
            border-radius: 50%;
            background-color: #e95a34;
        }

        .wh_content_item > .wh_isMark {
            background: orange;
        }

        .wh_container .wh_content_all {
            background-color: #fff;
        }

        .wh_container .wh_content_item {
            position: relative;
            color: #636363;
            height: 52px;
        }

        .wh_container .wh_top_changge li {
            color: #636363;
        }

        .wh_container .wh_jiantou1 {
            border-top: 2px solid #666;
            border-left: 2px solid #666;
        }

        .wh_container .wh_jiantou2 {
            border-top: 2px solid #666;
            border-right: 2px solid #666;
        }

        .wh_container .wh_top_tag {
            color: #636363;
        }

        .wh_container .wh_other_dayhide {
            color: #d2d2d2;
        }

        .arrow-panel {
            background-color: #fff;
            padding-bottom: convertToVw(5);
        }

        .scheduling-item {
            margin-top: convertToVw(10);
            padding-left: convertToVw(15);
            padding-top: convertToVw(20);
            padding-bottom: convertToVw(8);
            background-color: #fff;

            .titleTop,
            .contentBox,
            .btnbOX {
                padding-right: convertToVw(15);
            }

            .btnbOX {
                padding-top: convertToVw(10);
                border-top: 1px solid #d9d9d9;
            }
        }

        .tag {
            padding: convertToVw(3) convertToVw(5);
            //background-color: #f5f5f5;
            font-size:.7rem;
            border-radius: 0.2rem;
            border: 1px solid;
            color: #636363;
            margin-left: 0.1rem;
        }

        .title {
            font-size: 0.9rem;
            color: #0d0d0d;
            margin-bottom: 0.85rem;
            margin-right: 0.2rem;
            max-width:9rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .titleTop {
            justify-content: space-between;
            align-items: center;
        }

        .titleTop1 {
            justify-content: flex-start;
        }

        .content {
            background-color: #f5f5f5;
        }

        .timeTitle {
            font-size: 0.6rem;
            color: #0d0d0d;
            width: 4.2rem;
        }

        .countTitle {
            font-size: 0.6rem;
            color: #0d0d0d;
            width: 5.2rem;
        }

        .ml {
            margin-left: 1.6rem;
        }

        .timeText {
            font-size: 0.6rem;
            color: #636363;
        }

        .contentBox {
            margin-bottom: 0.65rem;
            justify-content: flex-start;
            position: relative;
        }

        .location {
            width: 0.55rem;
            height: 0.75rem;
            vertical-align: middle;
        }

        .uncheck {
            font-size: 0.6rem;
            color: #e20000;
            width: 5rem;
        }

        .uncheck1 {
            font-size: 0.6rem;
            color: #e20000;
            width: 3rem;
        }

        .check {
            font-size: 0.6rem;
            width: 5rem;
            color: #636363;
        }

        .priceTitle {
            width: 4.2rem;
        }

        .price {
            font-size: 0.6rem;
            color: #636363;
        }

        .check1 {
            font-size: 0.6rem;
            width: 3rem;
            color: #636363;
        }

        .checkBox {
            justify-content: flex-start;
        }

        .check1 {
            width: 50%;
            justify-content: flex-start;
        }

        .codeBtn {
            width: 4.25rem;
            height: 1.68rem;
            border-radius: 0.82rem;
            border: solid 0.03rem #e84518;
            font-size: 0.6rem;
            color: #d6522d;
            background: #fff;
            position: absolute;
            top: 0;
            right: 0;
        }

        .arrow {
            display: block;
            width: 0.57rem;
            height: 0.33rem;
            margin: 0 auto;
        }

        .mapdiv {
            width: 100%;
            height: 100%;
        }

        .none {
            color: #636363;
            text-align: center;
            margin: 2.5rem;
        }

        .agreeText {
            font-size: 0.7rem;
            color: #e94418;
            width: 4.65rem;
            height: 1.3rem;
            border: solid 0.05rem #e94418;
            text-align: center;
            line-height: 1.4rem;
            border-radius: 0.15rem;
            text-decoration: none;
        }

        .repulseText {
            font-size: 0.7rem;
            color: #e94418;
            width: 3.75rem;
            height: 1.3rem;
            border: solid 0.05rem #e94418;
            text-align: center;
            line-height: 1.4rem;
            border-radius: 0.15rem;
            margin-left: 0.5rem;
            background-color: #fff;
        }

        .repulseText1 {
            position: relative;
            top:-0.5rem;
            font-size: 0.7rem;
            color: #fff;
            width: 3.75rem;
            height: 1.6rem;
            text-align: center;
            line-height: 1.6rem;
            border-radius: 0.15rem;
            background: #e94418;
        }

        .btnbOX {
            justify-content: flex-end;
            align-items: center;
        }

        .resign-btn {
            padding-right: 0.5rem;
            text-align: right;
            margin-bottom: 0.3rem;

            .tag-btn {
                display: inline-block;
            }
        }

        .tag-btn {
            background-color: #fff;
            margin-right: 5px;
        }

        .view {
            vertical-align: middle;
            width: 20px;
            height: 20px;
        }

        .total-salary {
            height: convertToVw(36);
            padding: convertToVw(0) convertToVw(15);
            margin: convertToVw(15) 0;
            font-size: convertToVw(13);
            line-height: convertToVw(36);
            color: #1e1f21;
            background-color: #fff;

            strong {
                font-weight: normal;
                color: #15bc83;
            }
        }
    }

    .wh_content_item .wh_chose_day {
        color: #fff;
        background-color: #6e7075 !important;
    }

    .wh_content_item .mark2.wh_chose_day::after {
        background-color: #fff;
    }

    .wh_content_item .mark2.wh_chose_day::before {
        display: none;
    }

    .wh_content_item .wh_isToday {
        color: #fff;
        background-color: #3296fa !important;
    }

    .wh_content_item .wh_isToday::before {
        display: none;
    }

    .wh_item_date {
        position: relative;
        font-size: convertToVw(17);
        width: 44px !important;
        height: 44px !important;
        line-height: 44px !important;
        color: #1e1f21;
    }

    .wh_item_date::before {
        content: attr(data-data);
        display: block;
        position: absolute;
        bottom: convertToVw(-15);
        left: 0;
        width: 100%;
        font-size: convertToVw(10);
        text-align: center;
    }

    .scheduling-dalary {
        font-size: convertToVw(15);
        color: #15bc83;

        &.unconfirm {
            color: #1e1f21;
        }
    }
</style>
