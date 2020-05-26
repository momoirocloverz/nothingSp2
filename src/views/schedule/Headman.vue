<template>
    <div class="headman">
        <mt-header :title="data.schedulingName" fixed class="mint-header-title" style="z-index:999">
            <router-link to="/calendar" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <img src="../../assets/img/add_scheduling@3x.png" alt="查看" slot="right" class="view" @click="viewDia">
        </mt-header>
        <!--菜单-->
        <mt-popup v-model="popupVisible" position="top" class="top-popup">
            <!--2019-8-5号之前排班状态(status==1未结束，status==2已结束)
            <div class="child" @click="RouteToDayWorker" v-if="data.status == 1">身份证号添加日结零工</div>
            <div class="child" @click="RouteToCodeShow" v-if="data.status == 1">验证码添加日结零工</div>
            <div class="child" @click="RouteToConfirmAdd">客户结算确认</div>
            <div class="child" @click="RouteToEmpty" v-if="data.settleStatus != 2 && data.emptyNumber==0 && data.emptyTalentSwitch==1">添加特殊考勤人员</div>
            <div class="child" @click="RouteToEmptyList" v-if="data.emptyNumber!=0">查看特殊考勤人员</div>
            <div class="child" @click="RouteToRNP">奖惩</div>
            <div class="child" @click="RouteToEmptyConfirmList">导出空白签到表</div>
            <div class="child" v-if="data.status == 1" @click="RouteToUpdateAttendence">修改排班</div>
            <div class="child" v-if="data.talentConfirmStatus == 1" @click="handleConfirmAttendence">零工结算确认</div>-->

            <!--2019-8-5号之前排班状态(settleStatus==1,talentConfirmStatus==1待确认settleStatus==2,talentConfirmStatus==1待结算settleStatus==2,talentConfirmStatus==2已结束)-->
            <div class="child" @click="RouteToDayWorker" v-if="data.settleStatus==1 && data.talentConfirmStatus==1">
                身份证号添加日结零工
            </div>
            <div class="child" @click="RouteToCodeShow" v-if="data.settleStatus==1 && data.talentConfirmStatus==1">
                验证码添加日结零工
            </div>
            <div class="child" @click="RouteTomaShow" v-if="data.settleStatus==1 && data.talentConfirmStatus==1">
                二维码添加日结零工
            </div>
            <div class="child" @click="RouteToConfirmAdd">客户结算确认</div>
            <div class="child" @click="RouteToEmpty"
                 v-if="data.settleStatus==1 && data.talentConfirmStatus==1 && data.emptyNumber==0 && data.emptyTalentSwitch==1">
                添加特殊考勤人员
            </div>
            <div class="child" @click="RouteToEmptyList" v-if="data.emptyNumber!=0">查看特殊考勤人员</div>
            <div class="child" @click="RouteToRNP">奖惩</div>
            <div class="child" @click="RouteToEmptyConfirmList">导出空白签到表</div>
            <div class="child" v-if="data.settleStatus==1 && data.talentConfirmStatus==1"
                 @click="RouteToUpdateAttendence">修改排班
            </div>
            <div class="child" v-if="data.settleStatus==2 && data.talentConfirmStatus==1"
                 @click="handleConfirmAttendence">零工结算确认
            </div>


        </mt-popup>

        <!--考勤情况和结算方式筛选-->
        <mt-popup v-model="statusVisible" position="bottom" class="mint-popup">
            <mt-picker :slots="statusList" :visible-item-count="5" :show-toolbar="true" ref="statusPicker"
                       value-key="label">
                <div @click="handleConfirm" class="sure">确认</div>
            </mt-picker>
        </mt-popup>
        <mt-popup v-model="typeVisible" position="bottom" class="mint-popup">
            <mt-picker :slots="typeList" :visible-item-count="5" :show-toolbar="true" ref="typePicker"
                       value-key="label">
                <div @click="typeConfirm" class="sure">确认</div>
            </mt-picker>
        </mt-popup>

        <div class="content_fff1">
            <div class="info" v-if="data.emptyTalentSwitch==1">
                核定{{data.authorizedNumber}}人，零工工时：{{data.totalTalentWorkHours}}，班组长：{{data.foremanName}}<br/>
                正常{{data.normalNumber}}人，特殊考勤人员{{data.emptyNumber}}人，工单需求{{data.demandNumber}}人。
            </div>
            <div class="info" v-else>
                核定{{data.authorizedNumber}}人，零工工时：{{data.totalTalentWorkHours}}，班组长：{{data.foremanName}}<br/>
                正常{{data.normalNumber}}人，工单需求{{data.demandNumber}}人。
            </div>
        </div>
        <!--筛选-->
        <div class="white flexable head" style="padding: 1vw 0;justify-content: space-around;">
            <div class="selectBox flexable" @click="statusVisible = true">
                <span class="month">{{statusFilter | formatStatusFilter}}</span>
                <img src="../../assets/img/arrow_bottom.png" alt="箭头" class="arrow">
            </div>
            <div class="split"></div>
            <div class="selectBox flexable" @click="typeVisible = true">
                <span class="month">{{typeFilter | formatTypeFilter}}</span>
                <img src="../../assets/img/arrow_bottom.png" alt="箭头" class="arrow">
            </div>
        </div>

        <div class="white" v-for="(item,index) in currentList" :id="'anchor'+item.industry" v-if="item.isStart == 1">
            <div class="content_fff personInfo">
                <div class="head flexable">
                    <div class="r-content flexable">
                        <div class="rLine"></div>
                        <div class="h-content flexable">
                            <div class="industry">{{item.industryName}}</div>
                            <div>
                                <span class="num people">{{item.schedulingEmployees ? item.schedulingEmployees.length : 0}}人</span>
                                <span class="num">{{item.workStartTime | forTime}}-{{item.endWorkType == 1 ? '当日' : '次日'}}{{item.workEndTime | forTime}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="h-btn flexable" v-if="item.schedulingEmployees">
                        <mt-button type="default" class="codeBtn" @click="checkIn(item)"
                                   v-if="data.settleStatus==1 && data.talentConfirmStatus==1 && $route.query.punchWay == 1">
                            上班打卡
                        </mt-button>
                        <mt-button type="default" class="codeBtn back" @click="checkOut(item)"
                                   v-if="data.settleStatus==1 && data.talentConfirmStatus==1 && $route.query.punchWay == 1">
                            下班打卡
                        </mt-button>
                    </div>
                </div>
                <div class="pt10 pl10 pr10 f13 new-301-time flex-row" style="">
                    <div class="w20">
                        打卡管理：
                    </div>
                    <div class="w80" :class="{'flex-col':item.startTimeSet || item.endTimeSet}">
                        <span>
                            开始打卡: {{item.startTimeSet ? item.startTimeSet : ''}} <span v-if="!item.startTimeSet" class="co-orange pr10">未设置</span>
                        </span>
                        <span>
                            结束打卡: {{item.endTimeSet ? item.endTimeSet : ''}}  <span v-if="!item.endTimeSet" class="co-orange">未设置</span>
                        </span>
                    </div>
                </div>
                <div>
                    <div class="content_fff" v-for="(sample,i) in item.schedulingEmployees">
                        <div class="topBox flexable">
                            <div class="infoBox">
                                <div class="name">{{sample.talentName}}</div>
                                <div class="sexInfo">
                                    <span class="tag-male" v-if="sample.sexName == '男'">{{sample.sexName}}</span>
                                    <span class="tag-female" v-if="sample.sexName == '女'">{{sample.sexName}}</span>
                                    <span class="tag-age">{{sample.age}}岁</span>
                                    <span class="tag-age">{{sample.settlementTypeName}}</span>
                                </div>
                            </div>
                            <div @click="toShow(sample)">
                                <span class="uncard" v-if="sample.color == 1">{{sample | forText}}</span>
                                <span class="normal" v-if="sample.color == 2">正常</span>
                                <img src="../../assets/img/arrow_bottom.png" alt="箭头" class="arrow">
                            </div>
                        </div>
                        <div class="sourceBox1 flexable" v-if="sample.isShow">
                            <span class="source">来源：</span>
                            <!--@click="goTask(data)"-->
                            <div class="taskBox flexable" v-if="sample.type == 2">
                                <div class="schedule">工单</div>
                                <div class="task">({{data.taskName}})</div>
                            </div>
                            <div class="taskBox flexable" v-if="sample.type == 1">
                                <div class="schedule">排班</div>
                            </div>
                        </div>
                        <!--有可能存在多段考勤-->
                        <div v-if="sample.isShow && sample.schedulingPunchList"
                             v-for="(card,cardIndex) in sample.schedulingPunchList">
                            <div class="cardBox flexable">
                                <div class="workTime">
                                    <span class="goCheck">上班打卡：</span>
                                    <span class="time" v-if="card.workStartTime">{{card.workStartDate | forDate}} {{card.workStartTime && card.workStartTime.substring(0,5)}}</span>
                                    <span class="uncheck" v-if="!card.workStartTime">未打卡</span>
                                    <span class="uncheck" v-if="card.isStartPatch == 2">(补卡)</span>
                                </div>
                                <div>
                                    <span class="goCheck">下班打卡：</span>
                                    <span class="time" v-if="card.workEndTime">{{card.workEndDate | forDate}} {{card.workEndTime && card.workEndTime.substring(0,5)}}</span>
                                    <span class="uncheck" v-if="!card.workEndTime">未打卡</span>
                                    <span class="uncheck" v-if="card.isEndPatch == 2">(补卡)</span>
                                </div>
                            </div>
                            <div class="sourceBox1 flexable update-panel">
                                <div class="source">计件量：</div>
                                <div class="schedule countNum">{{card.pieceSize | formatPieceSize1}}</div>
                                <!-- <div class="update-attendence" @click="handleUpdateAttendence(sample,card)">修改考勤</div> -->
                            </div>

                            <!-- <div class="btn-div" style="display:none;">
                              <div class="update-attende" v-if="data.status == 1 && (sample.multiPunch== 2 && !card.workStartTime || sample.multiPunch== 1 && !card.workStartTime)" @click="handleHelpIn(sample, card)">替打上班卡</div>
                              <div class="update-attende" @click="handleHelpOut(sample, card)">替打下班卡</div>
                            </div> -->
                        </div>
                        <div v-if="data.settleStatus==1 && data.talentConfirmStatus==1" class="multi-punch"
                             @click="handleMulti(sample)"><i class="multi-icon"
                                                             :class="{can: sample.multiPunch== 2}"></i>允许再次考勤
                        </div>
                        <div class="line"></div>
                    </div>
                </div>
            </div>
        </div>
        <p class="nomore"> 没有更多记录了</p>

        <!--页面右侧悬浮导航-->
        <DwbVueDrawer :visible.sync="visible" :position="position" :lockScroll="lockScroll" :maskClosable="maskClosable"
                      :zIndex="zIndex" :maskStyle="maskStyle" :containerStyle="containerStyle" @open="open"
                      @close="close">
            <img src="../../assets/img/list@3x.png" alt="菜单" class="menuInner" @click="visible = false"
                 style="width: 2.03rem;height: 2.95rem;position: absolute;top:50%;z-index:999;">
            <ul class="ulBox" v-show="schedulingSettingVos && schedulingSettingVos.length>1">
                <li class="title-d">菜单</li>
                <li @click="goAnchor('#anchor'+item.industry,item.industry)"
                    :class="{selected : isSelected== item.industry}" v-for="(item,index) in schedulingSettingVos"
                    v-if="item.schedulingEmployees">{{item.industryName}}
                </li>
            </ul>
        </DwbVueDrawer>
        <img src="../../assets/img/list@3x.png" v-if="show" alt="菜单" class="menuOuter" @click="openDrawer"
             v-show="isMenu">
    </div>
</template>

<script>
    class PunchListItem {
        constructor({talentName, talentId, schedulingId}) {
            this.talentName = talentName
            this.talentId = talentId
            this.schedulingId = schedulingId
            this.customerEndDate = ''
            this.customerEndTime = ''
            this.customerEndWorkType = '1'
            this.customerStartDate = ''
            this.customerStartTime = ''
        }
    }

    import '@/views/schedule/css/headman.scss'
    import {mapActions} from 'vuex'
    import Util from '../../common/util.js'
    import punchTimeFormat from '../../common/punchTimeFormat.js'
    import timeSpanEight from '../../common/timeSpanEight.js'
    import {DwbVueDrawer} from 'dwb-vue-drawer'
    let moment = require("moment");

    export default {
        name: 'headman',
        components: {
            DwbVueDrawer
        },
        data() {
            return {
                isSelected: '',
                popupVisible: false,
                data: [],
                schedulingSettingVos: [],
                currentList: [],
                visible: false,
                statusVisible: false,
                typeVisible: false,
                statusFilter: 0,
                schedulingStatus: 1,  // 排班状态
                schedulingConfirm: 0, // 客户是否已确认
                typeFilter: 0,
                statusList: [
                    {
                        flex: 1,
                        values: [
                            {
                                label: '不限',
                                value: 0
                            },
                            {
                                label: '上班未打卡',
                                value: 1
                            },
                            {
                                label: '下班未打卡',
                                value: 2
                            },
                            {
                                label: '等待审批',
                                value: 3
                            },
                        ],
                        className: "slotStatus",
                        textAlign: "center"
                    }

                ],
                typeList: [
                    {
                        flex: 1,
                        values: [
                            {
                                label: '不限',
                                value: 0
                            },
                            {
                                label: '日结',
                                value: 1
                            },
                            {
                                label: '周结',
                                value: 2
                            },
                            {
                                label: '月结',
                                value: 3
                            },
                        ],
                        className: "slotType",
                        textAlign: "center"
                    }
                ],
                position: 'right',
                lockScroll: true,
                maskClosable: true,
                zIndex: 200,
                maskStyle: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                },
                containerStyle: {
                    background: '#fff',
                },
                show: true,
                isMenu: false,
                isShow1: false,
            }
        },

        methods: {
            viewDia() {
                let params = {
                    customerId: this.data.customerId,
                };
                this.$api.feeCheck(params).then(res => {
                    console.log('res', res);
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        this.popupVisible = true;
                    } else {
                        this.popupVisible = false;
                    }
                }).catch(err => {
                    console.log('err', err);
                });
            },
            RouteToEmpty() {
                this.$router.push({
                    name: 'emptyList',
                    query: {
                        id: this.data.id,
                        managerId: this.data.managerId,
                        customerId: this.data.customerId,
                        schedulingDate: this.data.schedulingDate,
                        num: this.data.authorizedNumber - this.data.normalNumber - this.data.emptyNumber,
                        status: this.data.status
                    }
                })
            },
            RouteToEmptyList() {
                this.$router.push({
                    name: 'emptyShow',
                    query: {id: this.data.id, status: this.data.talentConfirmStatus}
                })
            },
            RouteToDayWorker() {
                let params = {
                    schedulingId: this.$route.query.id
                }
                this.$api.remainingNumber(params)
                    .then(res => {
                        let remainNumber = res.data.data
                        if (remainNumber == 0) {
                            this.$messagebox({
                                title: `提示`,
                                message: `该排班人员已满，无法添加`,
                            })
                        } else {
                            this.$router.push({name: 'dayWorker', query: {id: this.$route.query.id}})
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            RouteToCodeShow() {
                let params = {
                    schedulingId: this.$route.query.id
                }
                this.$api.remainingNumber(params)
                    .then(res => {
                        let remainNumber = res.data.data
                        if (remainNumber == 0) {
                            this.$messagebox({
                                title: `提示`,
                                message: `该排班人员已满，无法添加`,
                            })
                        } else {
                            this.$router.push({name: 'codeshow', query: {id: this.$route.query.id}})
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            RouteTomaShow() {
                let params = {
                    schedulingId: this.$route.query.id
                }
                this.$api.remainingNumber(params)
                    .then(res => {
                        let remainNumber = res.data.data
                        if (remainNumber == 0) {
                            this.$messagebox({
                                title: `提示`,
                                message: `该排班人员已满，无法添加`,
                            })
                        } else {
                            this.$router.push({
                                path: '/maShow',
                                query: {
                                    id: this.$route.query.id,
                                    schedulingSettingVos:JSON.stringify(this.schedulingSettingVos),
                                    schedulingDate:this.data.schedulingDate,
                                    prePunchHours:this.data.prePunchHours
                                }})
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            RouteToConfirmAdd() {
                if (!this.data.schedulingConfirm) {
                    this.$router.push({
                        name: 'cusConfirm',
                        query: {id: this.$route.query.id, emptyTalentSwitch: this.data.emptyTalentSwitch}
                    })
                } else {
                    this.$router.push({
                        name: 'sendcustomer',
                        query: {id: this.$route.query.id, status: this.data.status}
                    })
                }
            },
            RouteToConfirmList() {
                this.$router.push({
                    name: 'customerReport',
                    query: {id: this.$route.query.id, status: this.data.status}
                })
            },
            RouteToEmptyConfirmList() {
                this.$router.push({
                    name: 'emptyConfirm',
                    query: {id: this.$route.query.id, emptyTalentSwitch: this.data.emptyTalentSwitch}
                })
            },
            RouteToRNP() {
                sessionStorage.setItem('managerId', this.data.managerId)
                this.$router.push({name: 'rNPList', query: {id: this.$route.query.id,classTaskId:this.data.classTaskId}})
            },
            RouteToUpdateAttendence() {
                this.$router.push({path: '/updateschedule', 
                    query: {
                        id: this.$route.query.id,
                        greyCustomerId:this.data.customerId
                    }
                })
            },
            goTask(data) {
                this.$router.push({name: 'taskDetail', query: {id: data.taskId}})
            },
            handleConfirm() {
                this.statusFilter = this.$refs.statusPicker.getValues()[0] && this.$refs.statusPicker.getValues()[0].value
                this.statusVisible = false
                this.filterData()
            },
            typeConfirm() {
                this.typeFilter = this.$refs.typePicker.getValues()[0] && this.$refs.typePicker.getValues()[0].value
                this.typeVisible = false
                this.filterData()
            },
            // 修改零工考勤
            handleUpdateAttendence(sample, card) {
                let stateObj = {
                    talentName: sample.talentName, // 零工姓名
                    industry: sample.industryName, // 工种
                    schedulingEmpId: sample.talentId,
                    punchId: card.id,
                    schedulingId: sample.schedulingId,
                    startTime: card.workStartTime || '',
                    endTime: card.workEndTime || '',
                    endType: card.endWorkType, // 1当日 2次日
                    pieceSize: card.pieceSize && JSON.parse(card.pieceSize)
                }

                this.set_schedule(stateObj)

                this.$router.push({name: 'updateattendence'})
            },
            handleConfirmAttendence() {
                //还未提交给客户确认或者已经提交给客户确认但客户还未进行确认操作
                this.popupVisible = false
                if (!this.data.schedulingConfirm || (this.data.schedulingConfirm && this.data.schedulingConfirm.status != 3)) {
                    this.$messagebox({
                        title: `提示`,
                        message: '需要先进行客户结算确认才能进行零工结算确认!',
                    })
                    return
                }

                if (this.data.schedulingConfirm.status == 3) {
                    if (this.data.status != 3) {
                        /*this.$messagebox({
                          title: `提示`,
                          message: '零工结算确认将会关闭排班，无法在进行打卡和添加人员，确认继续吗？',
                          showCancelButton: true,
                          confirmButtonText: "继续",
                          cancelButtonText: "取消"
                        }).then(action => {*/
                        /*if (action == 'confirm') {     //确认的回调*/
                        const params = {
                            schedulingId: this.$route.query.id,
                        };
                        this.$api
                            .schedulingShutDown(params)
                            .then(response => {
                                if (response.data.respCode == 0) {
                                    console.log('关闭排班')
                                    this.checkStatus()
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                        /*  }*/
                        /* }).catch(err => {
                           if (err == 'cancel') {
                             console.log('取消')
                           }
                         })*/
                    } else {
                        this.checkStatus()
                    }
                } else {
                    this.checkStatus()
                }
            },
            handleConfirmAction() {
                let flag = true
                let jian = 0
                let dai = 0
                let che = 0
                let dun = 0
                let total = JSON.parse(this.data.total)
                let totalJian = Number(total.jian)
                let totalDai = Number(total.dai)
                let totalChe = Number(total.che)
                let totalDun = Number(total.dun)
                this.currentList.forEach(item => {
                    if (item.empCounts) {
                        jian = 0
                        dai = 0
                        che = 0
                        dun = 0
                        item.schedulingEmployees.forEach(subitem => {
                            if (subitem.schedulingPunchList) {
                                subitem.schedulingPunchList.forEach(punchItem => {
                                    // 1未确认  2已确认
                                    if (punchItem.workStartTime && punchItem.workEndTime && punchItem.customerConfirmStatus == 1) {
                                        let pieceSizeFlag = !(punchItem.pieceSize == `{"che":"0","dai":"0","dun":"0","jian":"0"}`)

                                        if (punchItem.workHours || !punchItem.pieceSize || pieceSizeFlag) {
                                            flag = false
                                            return this.$messagebox({
                                                title: `提示`,
                                                message: `${subitem.talentName}的${punchItem.workStartTime.substring(0, 5)}到${punchItem.workEndTime.substring(0, 5)}的考勤不存在于客户确认的工作单里，请将其工时和计件量清零后再提交!`,
                                            })
                                        }
                                    }

                                    if (punchItem.workStartTime && punchItem.workEndTime && punchItem.workHours > punchItem.customerWorkHours) {
                                        flag = false
                                        return this.$messagebox({
                                            title: `提示`,
                                            message: `${subitem.talentName}的${punchItem.workStartTime.substring(0, 5)}到${punchItem.workEndTime.substring(0, 5)}的考勤的工时大于客户确认的${punchItem.customerWorkHours}个工时，请修改后再提交!`,
                                        })
                                    }
                                    jian += Number(punchItem.totalPieceSize ? punchItem.totalPieceSize.jian ? punchItem.totalPieceSize.jian : 0 : 0)
                                    dai += Number(punchItem.totalPieceSize ? punchItem.totalPieceSize.dai ? punchItem.totalPieceSize.dai : 0 : 0)
                                    che += Number(punchItem.totalPieceSize ? punchItem.totalPieceSize.che ? punchItem.totalPieceSize.che : 0 : 0)
                                    dun += Number(punchItem.totalPieceSize ? punchItem.totalPieceSize.dun ? punchItem.totalPieceSize.dun : 0 : 0)
                                })
                            }
                        })
                        if (jian > totalJian || dai > totalDai || che > totalChe || dun > totalDun) {
                            flag = false
                            return this.$messagebox({
                                title: `提示`,
                                message: `${item.industryName}工种的计件量大于客户确认的${totalJian}件${totalDai}袋${totalChe}车${totalDun}吨，请修改后再提交!`,
                            })
                        }
                    }
                })

                if (flag) {
                    this.$router.push({path: '/confirmattendence', query: {id: this.$route.query.id}})
                }
            },
            filterData() {
                let tempList = JSON.parse(JSON.stringify(this.schedulingSettingVos))

                switch (this.statusFilter) {
                    case 1:
                        tempList.forEach((item, index) => {
                            if (item.schedulingEmployees) {
                                tempList[index].schedulingEmployees = item.schedulingEmployees.filter(subitem => {
                                    return (!subitem.schedulingPunchList || subitem.schedulingPunchList.some(subsubitem => {
                                        return !subsubitem.workStartTime
                                    }))
                                })
                            }
                        })
                        break;

                    case 2:
                        tempList.forEach((item, index) => {
                            if (item.schedulingEmployees) {
                                tempList[index].schedulingEmployees = item.schedulingEmployees.filter(subitem => {
                                    return subitem.schedulingPunchList && subitem.schedulingPunchList.some(subsubitem => {
                                        return !subsubitem.workEndTime
                                    })
                                })
                            }
                        })
                        break;

                    case 3:
                        tempList.forEach((item, index) => {
                            if (item.schedulingEmployees) {
                                tempList[index].schedulingEmployees = item.schedulingEmployees.filter(subitem => {
                                    return subitem.schedulingPunchList && subitem.schedulingPunchList.some(subsubitem => {
                                        return subsubitem.pieceState == 1
                                    })
                                })
                            }
                        })
                        break;
                }

                switch (this.typeFilter) {
                    case 1:
                        tempList.forEach((item, index) => {
                            if (item.schedulingEmployees) {
                                tempList[index].schedulingEmployees = item.schedulingEmployees.filter(subitem => {
                                    return subitem.settlementTypeName == '日结'
                                })
                            }
                        })
                        break;
                    case 2:
                        tempList.forEach((item, index) => {
                            if (item.schedulingEmployees) {
                                tempList[index].schedulingEmployees = item.schedulingEmployees.filter(subitem => {
                                    return subitem.settlementTypeName == '周结'
                                })
                            }
                        })
                        break;
                    case 3:
                        tempList.forEach((item, index) => {
                            if (item.schedulingEmployees) {
                                tempList[index].schedulingEmployees = item.schedulingEmployees.filter(subitem => {
                                    return subitem.settlementTypeName == '月结'
                                })
                            }
                        })
                        break;
                }

                this.currentList = tempList
            },
            getList() {
                const params = {
                    id: this.$route.query.id,
                };
                this.$api
                    .MScheduleDetail(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            this.data = response.data.data
                            console.log(this.data)
                            // data.status 排班状态 (1未结束  2已取消  3已结束)
                            this.schedulingSettingVos = response.data.data.schedulingSettingVos
                            if (this.schedulingSettingVos) {
                                this.isSelected = this.schedulingSettingVos[0].industry
                            }
                            const sechdulePosition = {
                                longitude: this.data.longitude,
                                latitude: this.data.latitude,
                            }
                            this.schedulingStatus = response.data.data.status
                            this.schedulingConfirm = response.data.data.schedulingConfirm && response.data.data.schedulingConfirm.status
                            this.currentList = this.schedulingSettingVos

                            this.currentList.forEach(item => {
                                item.schedulingEmployees && item.schedulingEmployees.forEach(empitem => {
                                    if (!empitem.schedulingPunchList) {
                                        empitem.schedulingPunchList = []
                                        let punchListItem = new PunchListItem(empitem)
                                        empitem.schedulingPunchList.push(punchListItem)
                                    }
                                })
                            })
                            sessionStorage.setItem('sechdulePosition', JSON.stringify(sechdulePosition))
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },

            checkStatus() {
                const params = {
                    id: this.$route.query.id,
                };
                this.$api
                    .MScheduleDetail(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            let data = response.data.data

                            if (data.talentConfirmStatus != 1) {
                                this.$toast('班组长或项目经理确认过了，无法重复确认')
                            } else {
                                this.handleConfirmAction()
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            
            messageForDownload(){
                return this.$messagebox({
                    title: '下载提示',            
                    message: '<div style="line-height: 30px; text-align: center;">微信打卡功能已关闭，请安装<span style="color: #ea441a;">【佳薪宝app】</span>进行打卡。<div>',   
                    showCancelButton: true,
                    confirmButtonText: "马上下载",
                }).then(action => {
                    if (action == 'confirm') {
                        location.href = 'http://wap.10000rc.com/index.html#/shareApp2';
                    }
                })
            },
            
            checkIn(item) {
                this.messageForDownload();
            
        /*        let { data }= await this.$api.getCurrentTime();
                let timeStamp = data.data;
                let _this = this
                if(!item.startTimeSet){
                    return this.$toast('该排班此工种未设置开始打卡时间,故不能打卡,请联系项目经理')
                }
                if (!this.timeDifference(item.startTimeSet,timeStamp,this.data.prePunchHours)) {
                    return this.$toast(`上班时间开始前${this.data.prePunchHours}小时后才允许打卡`)
                }
                let date = item.startTimeSet.substring(0,10),time = item.startTimeSet.substring(11,20)
                console.log(date,time)
                if (timeSpanEight(date, time)) {
                    return this.$messagebox({
                        title: `提示`,
                        message: `已超出上班时间24小时，不可打卡`,
                    })
                }

                this.$api.getHostTime()
                    .then(res => {
                        if (res.data.respCode == 0) {
                            let str = item.startTimeSet.replace(/-/g,'/'); // 将-替换成/，因为下面这个构造函数只支持/分隔的日期字符串
                            let startData = new Date(str).getTime();
                            let timeString;
                            console.log(startData,'设置的时间')
                            console.log(res.data.data,'现在的时间')
                            let resDateTime = res.data.data  // 时间戳
                            if(resDateTime < startData){
                                //打卡时间早于开始打卡时间点，零工才有班务经理设置的时间点
                                timeString = item.startTimeSet
                            }else{ //打卡时间晚于，采用实际打卡时间
                                let resDate = Util.fullDate(resDateTime.toString())
                                let hostDate = resDate.split(' ')[0]
                                let hostTime = resDate.split(' ')[1]
                                let time = Util.checkTime(this.$route.query.type, hostDate, hostTime)
                                let punchDate = time.substring(0, 10)
                                let punchTime = time.substring(10, 16)
                                timeString = punchTimeFormat(1, hostDate, hostTime)
                            }
                            this.$messagebox({
                                title: '打卡二维码生成提示',
                                message: `无论零工何时扫码，其打卡时间均为<br><span style="color: #ea441a;">${timeString}</span>`,
                                showCancelButton: true,
                                confirmButtonText: "继续打卡",
                                cancelButtonText: "暂不打卡"
                            }).then(action => {
                                if (action == 'confirm') {
                                    timeString = timeString.replace(/\s+/g, ' ')
                                    let timeArr = timeString.split(' ')
                                    let date = timeArr[0]
                                    let time = timeArr[1]
                                    let data = {
                                        type: 1,
                                        id: item.schedulingId,
                                        industry: item.industry,
                                        industryName: item.industryName,
                                        time:time,
                                        schedulingDate:date,
                                        punchWay: this.$route.query.punchWay
                                    }
                                    sessionStorage.setItem('headMan', JSON.stringify(data))
                                    // this.$router.push({ name: 'checkIn', query: { type: 1, id: item.schedulingId, industry: item.industry, industryName: item.industryName, time: item.workStartTime, schedulingDate: this.data.schedulingDate } })
                                    this.$router.push({
                                        path: '/checkIn',
                                        query: {
                                            type: 1,
                                            id: item.schedulingId,
                                            industry: item.industry,
                                            industryName: item.industryName,
                                            time: time,
                                            schedulingDate: date,
                                            range: _this.data.punchRange
                                        }
                                    })
                                }
                            })

                        } else {
                            this.$toast('获取服务器时间失败')
                        }
                    })
                    .catch(err => {
                        this.$toast('获取服务器时间失败')
                    })
                
                
                */
                
                
                
                
            },
            endTimeSetMessageBox(item,timeString){
                return this.$messagebox({
                    title: '打卡二维码生成提示',
                    message: `现在生成的二维码，无论普工何时扫码，其打卡时间均为<br><span style="color: #ea441a;">${timeString}</span><br><span class="f16">是否确认无误，并继续打卡
</span>`,
                    showCancelButton: true,
                    confirmButtonText: "继续打卡",
                    cancelButtonText: "暂不打卡"
                }).then(action => {
                    if (action == 'confirm') {
                        timeString = timeString.replace(/\s+/g, ' ')
                        let timeArr = timeString.split(' ')
                        let date = timeArr[0]
                        let time = timeArr[1]
                        let data = {
                            type: 2,
                            id: item.schedulingId,
                            industry: item.industry,
                            industryName: item.industryName,
                            time: time,
                            schedulingDate:date,
                            punchWay: this.$route.query.punchWay
                        }
                        sessionStorage.setItem('headMan', JSON.stringify(data))

                        this.$router.push({
                            path: '/checkIn',
                            query: {
                                type: 2,
                                id: item.schedulingId,
                                industry: item.industry,
                                industryName: item.industryName,
                                time: time,
                                schedulingDate: date,
                                range: this.data.punchRange
                            }
                        })
                    }
                })
            },
            checkOut(item) {
                this.messageForDownload();
                
                
                /*
                if(!item.startTimeSet){
                    return this.$toast('该排班此工种未设置开始打卡时间,故不能打卡,请联系项目经理')
                }
                this.$api.getHostTime()
                    .then(res => {
                        if (res.data.respCode == 0) {
                            let _this = this,str,endData,timeString;
                            let resDateTime = res.data.data
                            if(item.endTimeSet){ //结束打卡时间已设置
                                str = item.endTimeSet.replace(/-/g,'/');
                                endData = new Date(str).getTime();
                                console.log(endData,'设置的时间')
                                console.log(resDateTime,'现在的时间')
                                // 时间戳
                                if(resDateTime > endData){//早于结束按实际
                                    timeString = item.endTimeSet
                                    this.endTimeSetMessageBox(item,timeString)
                                }else{//晚于则按现在
                                    let resDate = Util.fullDate(resDateTime.toString())
                                    let hostDate = resDate.split(' ')[0]
                                    let hostTime = resDate.split(' ')[1]
                                    let time = Util.checkTime(this.$route.query.type, hostDate, hostTime)
                                    let punchDate = time.substring(0, 10)
                                    let punchTime = time.substring(10, 16)
                                    timeString = punchTimeFormat(2, hostDate, hostTime)
                                    this.endTimeSetMessageBox(item,timeString)
                                }
                            }else{
                                //未设置打卡
                                let preDate,preStamp;
                                if(item.endWorkType == 1){//当日
                                    preDate = this.data.schedulingDate;
                                }else if(item.endWorkType == 2){//次日
                                    preDate = moment(this.data.schedulingDate).add(1,'days').format("YYYY-MM-DD")
                                }
                                preStamp = moment(`${preDate} ${item.workEndTime}`).valueOf();
                                if(resDateTime > preStamp){
                                    //晚于预期时间
                                    return this.$toast('该排班此工种未设置结束时间故不能打卡,请联系项目经理!')
                                }else{
                                    let resDate = Util.fullDate(resDateTime.toString())
                                    let hostDate = resDate.split(' ')[0]
                                    let hostTime = resDate.split(' ')[1]
                                    let time = Util.checkTime(this.$route.query.type, hostDate, hostTime)
                                    let punchDate = time.substring(0, 10)
                                    let punchTime = time.substring(10, 16)
                                    timeString = punchTimeFormat(2, hostDate, hostTime)
                                    this.endTimeSetMessageBox(item,timeString)
                                }
                                console.log(preDate)
                                console.log(preStamp,'时间戳')
                            }
                        } else {
                            this.$toast('获取服务器时间失败')
                        }
                    })
                    .catch(err => {
                        this.$toast('获取服务器时间失败')
                    })
                */
                
                
            },
            goAnchor(selector, index) {
                this.isSelected = index
                var anchor = this.$el.querySelector(selector)
                document.body.scrollTop = anchor.offsetTop - 40; // chrome
                document.documentElement.scrollTop = anchor.offsetTop - 40; // firefox
            },
            open() {
                console.log('open callback')
            },
            close() {
                console.log('close callback')
                this.show = true
            },
            openDrawer() {
                let left = document.getElementsByClassName('ulBox')[0].offsetWidth
                let img = document.getElementsByClassName("menuInner")[0]
                img.style.right = `${left - 1}px`
                this.visible = true
                this.show = false
            },
            toShow(sample) {
                sample.isShow = !sample.isShow
                this.$forceUpdate()
            },
            timeDifference(time1,timeNow,hour) {
                let m1 = moment(timeNow);
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
            handleMulti(sample) {
                let param = {
                    empId: sample.id,
                    multiPunch: sample.multiPunch == 1 ? 2 : 1
                }

                this.$api.multiPunchSwitch(param)
                    .then(res => {
                        if (res.data.respCode == 0) {
                            sample.multiPunch = sample.multiPunch == 1 ? 2 : 1

                            this.$nextTick(() => { // 保持展开状态
                                this.toShow(sample)
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            ...mapActions(['set_schedule'])
        },
        filters: {
            forTime(val) {
                if (val) {
                    return val.substring(0, 5)
                }
            },
            forDate(val) {
                if (val) {
                    return val.substring(5)
                }
            },
            formatStatusFilter(val) {
                switch (val) {
                    case 0:
                        return '考勤情况'
                        break;
                    case 1:
                        return '上班未打卡'
                        break;
                    case 2:
                        return '下班未打卡'
                        break;
                    case 3:
                        return '等待审批'
                        break;
                }
            },
            formatTypeFilter(val) {
                switch (val) {
                    case 0:
                        return '结算方式'
                        break;
                    case 1:
                        return '日结'
                        break;
                    case 2:
                        return '周结'
                        break;
                    case 3:
                        return '月结'
                        break;
                }
            },
            formatPieceSize1(val) {
                if (val) {
                    if (Util.formatPieceSize(val) == '' || val == "{}") {
                        return '无'
                    } else {
                        return Util.formatPieceSize(val)
                    }
                } else {
                    return '无'
                }
            },
            forText(val) {
                if (val.schedulingPunchList) {
                    for (let i in val.schedulingPunchList) {
                        if (!(val.schedulingPunchList)[i].workStartTime) {
                            return '上班未打卡'
                        } else {
                            if (!(val.schedulingPunchList)[i].workEndTime) {
                                return '下班未打卡'
                            } else {
                                if ((val.schedulingPunchList)[i].pieceState == 1) {
                                    return '等待审批'
                                }
                            }
                        }
                    }
                } else {
                    return '上班未打卡'
                }
            },

            // 替打上班卡
            handleHelpIn() {
            },
            // 替打下班卡
            handleHelpOut() {
            }
        },
        mounted() {
            window.scrollTo(0, 0);
            this.getList()
            sessionStorage.setItem('checkinType', this.$route.query.punchWay)  // 打卡方式
        },
        watch: {
            'schedulingSettingVos': {
                handler: function (val, oldVal) {
                    if (val) {
                        for (let i in val) {
                            for (let j in val[i].schedulingEmployees) {
                                (val[i].schedulingEmployees)[j].isShow = false
                            }
                        }
                        let count = 0
                        for (let i in val) {
                            if (val[i].schedulingEmployees) {
                                count++
                            }
                        }
                        if (count > 1) {
                            this.isMenu = true
                        } else {
                            this.isMenu = false
                        }
                    }
                },
                deep: true
            },
        }
    }
</script>
<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .new-301-time{
        display: flex;
        font-size: .6rem;
    }
    .flex-row{
        display: flex;
        flex-direction: row;
    }
    .flex-col{
        display: flex;
        flex-direction: column;
    }
</style>
