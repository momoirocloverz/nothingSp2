<template>
    <div class="worksheetListModeCon">
        <div class="task-menu">
            <div class="wrap-drop">
                <van-dropdown-menu>
                    <van-dropdown-item v-model="value1" :title-class="class1" :options="option1"  @change="changeValue(1)"/>
                    <van-dropdown-item v-model="value3" :title-class="class3" :title="title3" :options="option3" @change="changeValue(3)"/>
                    <van-dropdown-item  ref="dropDownitem" @click="toggleOperation" :title="title2" :title-class="class2" >
                        <van-picker :columns="columns" @change="onChange" show-toolbar @cancel="finalCancel" @confirm="finalConfirm"/>
                    </van-dropdown-item>
                    <van-dropdown-item v-model="value4" :title-class="class4" :title="title4" :options="option4" @change="changeValue(4)"/>
                    </van-dropdown-menu>
            </div>
        </div>
        <div class="container" >
                <div class="share-box" v-if="shareType == 1">
                    <div @click="go('/task')" class="share-l">
                        <img class="share-icon" src="../../assets/img/jxb-icon.png" alt="">
                        <div class="share-title">
                            <h3>万才佳薪宝</h3>
                            <span>一个能赚钱的APP，让你薪上加薪！</span>
                        </div>
                    </div>
                    <div @click="go('/shareApp')" class="share-btn">
                        下载
                    </div>
                </div>
                <div class="splitline"></div>
                <div :style="{'-webkit-overflow-scrolling': scrollMode}">
                    <Loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"
                                @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange">
                        <div class="card-container card-paddingtop" style="background-color: white;"
                             v-for="(item,index) in tableDatas" :key="index">
                            <div class="card-header" @click="routeToDetail(item)">
                                <span class="name">{{item.taskName}}</span>                                
                                <span class="status-label" v-if="!activeOne && item.receiveStatus==1">待对方确认</span>
                                <span class="status-label"
                                      v-if="!activeOne &&(item.receiveStatus==3|| item.receiveStatus==5)">领取成功</span>
                                <span class="status-label" v-if="!activeOne && item.receiveStatus==2">领取失败</span>
                                <span class="status-label" v-if="!activeOne && item.receiveStatus==4">已放弃</span>
                                <span v-show="shareType != 1 && isPos" class="distance-label">{{item.distance | formatDistance}}</span>
                            </div>                            
                            <div class="card-body" @click="routeToDetail(item)">
                                <div><span class=" firstPartSp2" v-if="item.positionName">{{item.positionName}}</span>
                                <span class=" firstPartSp3">{{item.settlementType | settlementTypeText}}</span></div>
                                <div class="card-body-item ">
                                    <span class="body-label">发 布 人：</span>
                                    <span class="body-value">{{item.managerName}}</span>
                                    <span class="body-label " v-if="activeOne" style="margin-left:3.5rem">所需人数：</span>
                                    <span class="body-value" v-if="activeOne">{{item.maxWorker}}</span>
                                </div>
                                <div class="card-body-item">
                                    <span class="body-label">起止时间：</span>
                                    <span class="body-value">{{item.startTime | formatminDate}} 至 {{item.endTime | formatminDate}}</span>
                                </div>
                                <div class="card-body-item text-overflow">
                                    工作地点：{{item.workingPlace}}
                                </div>
                                <div class="card-body-item text-overflow">
                                    <span class="body-label">工单单价：</span>
                                    <span class="body-value">{{forPrice(item)}}</span>
                                </div>
                            </div>
                            <div class="splitline"></div>
                            <div class="card-footer ">
                                <div class="btn-group">
                                    <span class="receive-count"
                                          v-if="activeOne">{{item.grabCount? item.grabCount:0}}人已抢</span>
                                    <mt-button type="default" v-if="activeOne && !item.grabDisabled" class="footerBtn"
                                               @click="grab(item)" :disabled="grabLoading">我要抢
                                    </mt-button>
                                    <mt-button type="default" v-if="activeOne && item.grabDisabled" :disabled="grabDisabled"
                                               class="footerBtn disableBtn">已抢，等待对方确认
                                    </mt-button>
                                </div>
                            </div>
                        </div>
                        <div slot="top" class="mint-loadmore-top">
                            <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                            <span v-show="topStatus === 'loading'">
                                <mt-spinner type="snake"></mt-spinner>
                            </span>
                        </div>
                        <div slot="bottom" class="mint-loadmore-bottom">
                            <span v-show="bottomStatus !== 'loading'"
                                  :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                            <span v-show="bottomStatus === 'loading'">
                              <mt-spinner type="snake"></mt-spinner>
                            </span>
                        </div>
                        <p class="nomore pt15 pb15" v-if="allLoaded"> 没有更多记录了</p>
                        <p class="nomore pt15 pb15" v-else-if="tableDatas.length < 1"> 暂无相关工单信息</p>
                        <p class="nomore pt15 pb15" v-else> 下拉加载更多</p>
                    </Loadmore>
                </div>
                <div class="switchCircle" @click="changeTrigger">地图<br/>模式</div>
            </div>

    </div>
</template>
<script>
    import {MessageBox,Loadmore} from 'mint-ui';
    import util from '../../common/util';
    import Vue from 'vue';
    import { DropdownMenu, DropdownItem,Picker } from 'vant';
    import 'vant/lib/dropdown-menu/style';
    import 'vant/lib/dropdown-item/style';
    Vue.use(DropdownMenu).use(DropdownItem).use(Picker);
    
    export default {
        name: "worksheetListMode",
        props:{
            changeTriggerTwo:Function,
        },
        components: {            
            Loadmore
        },
        computed: {
            tableDatas: function () {
                let newData = []
                for (let x in this.tableData) {
                    let start = this.tableData[x].startTime
                    let end = this.tableData[x].endTime
                    if (start.substring(0, 10) == end.substring(0, 10)) {
                        this.tableData[x].endTime = end.substr(11, 5)
                    }
                    newData.push(this.tableData[x])
                }
                return newData
            },
        }, 
        data() {
            return {
                trigger:true,
                value1: '0',
                value2: '',
                value3: '',
                value4: '',
                class1:'',
                class2:'',
                class3:'',
                class4:'',
                title2: '职位',
                title3: '性别',
                title4: '计价方式',
                isPos:false,
                option1: [
                    { text: '离我最近', value: '0' },
                    { text: '最新发布', value: '1' },
                    { text: '最快开工', value: '2' },
                ],
                option2: [
                    { text: '不限', value: '' },
                ],option3: [
                    { text: '不限', value: ''},
                    { text: '男女皆可', value: '3'},
                    { text: '男', value: '1' },
                    { text: '女', value: '2' }
                ],
                option4: [
                    { text: '不限', value: '' },
                    { text: '计时', value: '1' },
                    { text: '计量', value: '2' },
                    { text: '计时+计量', value: '3' },
                    { text: '日固定', value: '4' },
                ],
                columns: [],
                grabLoading: false,
                topStatus: '',
                bottomStatus: '',
                headTitle: '工单市场',
                taskItem: {},
                visible: false,
                position: {
                    longitude:120.222586,
                    latitude:30.265299,
                },
                allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
                scrollMode: "auto",
                id: '',
                talentId: '',
                talentName: '',
                tableData: [],
                activeOne: true,
                currentPage: 1,
                pageSize: 20,
                pageCount: 0,
                distance: '',//经纬度算出来的距离
                content: '',
                shareType: sessionStorage.getItem('shareType'),
                price: {},
                grabDisabled: false,
                iosUrl: 'https://itunes.apple.com/cn/app/id1477306402?mt=8',
                androidUrl: '',
                valuationType: '',//智能排序
                industry: '', //工种
                loginTalentSex: '',//性别
                orderType: '',//计价方式   
                ladderObj:{},
                ladderLeftData:[],
                ladderSubData:[],
                finalConExport:[],
            };
        },
        created(){
            this.jumpJudge();
        },
        mounted() {
            this.initRequest();            
            this.getInfo();  
        },
        methods: { 
            changeTrigger(){
                sessionStorage.setItem('mapTrigger',JSON.stringify(true));
                this.$emit( 'changeTriggerTwo',true );
            },
            jumpJudge(){
                if(sessionStorage.position){
                    this.isPos = true
                    this.position = JSON.parse(sessionStorage.getItem('position'))
                }else{
                    this.isPos = false
//                    this.$router.push({ path: "/home" ,query:{isFirst:true}});
                }
            },
            getInfo(){
                let params = {
                    code:'position',
                };
                this.$api.GetAllTags(params).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode === 0 ) {
                        if (data && data.length){      
                            let outTempObj = data.map(ele=>{
                               return ele.dicName 
                            });      
                            this.ladderLeftData = data;
                            console.log( 'this.ladderLeftData',this.ladderLeftData );
                            outTempObj.forEach(ele=>{
                                this.ladderObj[ele] = [];
                            });
                            this.$api.getDicList('position',data[0].dicVal).then(res=>{
                                let { data:layer1 } = res;
                                let { respCode,data } = layer1;                                
                                if( respCode === 0 ) {
                                    if (data && data.length){
                                        let tempObj = data.map(ele=>{
                                           return ele.dicName; 
                                        });
                                        let firstClone = Object.assign([],tempObj);
                                        firstClone.unshift('不限');
                                        this.ladderObj[outTempObj[0]] = firstClone;
                                        this.ladderObj['不限'] = [];
                                        this.setColumn(this.ladderObj);
                                    }
                                }
                            }).catch(err=>{
                                console.log('err',err);
                            })
                        }
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            getLadderData(incoming){                 
                let trackIndex = this.ladderLeftData.findIndex(ele=>{
                   return ele.dicName == incoming[0];
                });            
                let param1 = this.ladderLeftData[trackIndex].dicVal;
                this.$api.getDicList('position',param1).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;                                
                    if( respCode === 0 ) {
                        let tempObj = data.map(ele=>{
                            return ele.dicName; 
                        });
                        this.ladderSubData = data;                      
                        let firstClone = Object.assign([],tempObj);
                        firstClone.unshift('不限');
                        this.ladderObj[incoming[0]] = firstClone;
                        this.setChangeColumn(this.ladderObj,incoming);
                    }
                }).catch(err=>{
                    console.log('err',err);
                })                
            },
            finalConfirm(value, index) {
                console.log(`当前值：${value}, 当前索引：${index}`);
                this.finalConExport = value;
                this.toggleOperation();
                this.currentPage = 1;
                this.getList();                
                this.class2 = 'cg-is-active2';
                console.log( 'this.finalConExport',this.finalConExport );
                if( this.finalConExport[0] == '不限'  ){
                    this.title2 = '职位'
                } else {
                    this.title2 = this.finalConExport[1] ? this.finalConExport[1] : this.finalConExport[0];
                }                
            },
            finalCancel() {
                console.log('取消');
                this.toggleOperation();
            },
            onChange(picker, values) {            
                if(values[0] == '不限'){
                    picker.setColumnValues(1, this.ladderObj[values[0]]);
                }else{
                    this.getLadderData(values);
                    this.$nextTick(()=>{
                        picker.setColumnValues(1, this.ladderObj[values[0]]);
                    });
                }
            },
            setChangeColumn(citys,incoming){
                let tempTrans = Object.assign([],Object.keys(citys));
                let generateArr = tempTrans.filter(ele=>{
                    return ele != '不限';
                })     
                let bridge1 = Object.assign([],generateArr);
                let bridge2 = Object.assign([],bridge1);                
                bridge2.unshift('不限');       
                this.columns = [
                    {
                      values: bridge2,
                      className: 'column1',                       
                    },
                    {
                        values: citys[incoming[0]],
                        className: 'column2',    
                        defaultIndex: 2
                    },
                  ];
            },
            setColumn(citys){
                let tempTrans = Object.assign([],Object.keys(citys));
                let generateArr = tempTrans.filter(ele=>{
                    return ele != '不限';
                })     
                let bridge1 = Object.assign([],generateArr);
                let bridge2 = Object.assign([],bridge1);                
                bridge2.unshift('不限');       
                this.columns = [
                    {
                      values: bridge2,
                      className: 'column1',                       
                    },
                    {
                        values: citys['不限'],
                        className: 'column2',    
                        defaultIndex: 2
                    },
                  ];
            },
            toggleOperation(){
                this.$refs.dropDownitem.toggle();
            },
            forPrice(val) { 
                return this.GlobalPriceFilter.priceFilter(val.price);
            },
            initRequest(){
                if (JSON.parse(sessionStorage.getItem("userInfo"))) {
                    this.id = JSON.parse(sessionStorage.getItem("userInfo")).userId;
                    this.talentId = JSON.parse(sessionStorage.getItem("userInfo")).talentId;
                }
                setTimeout(()=>{
                    this.getList();
                })
            },
            changeValue(val){
                switch (Number(val)) {
                    case 1:
                        this.class1 = 'cg-is-active1';
                        break;
                    case 2:
                        this.class2 = 'cg-is-active2';
                        if(this.value2 === ''){
                            this.title2 = '职位'
                        }else{
                            this.title2 = ''
                        }
                        break;
                    case 3:
                        this.class3 = 'cg-is-active3';
                        if(this.value3 === ''){
                            this.title3 = '性别'
                        }else{
                            this.title3 = ''
                        }
                        break;
                    case 4:
                        this.class4 = 'cg-is-active4';
                        if(this.value4 === ''){
                            this.title4 = '计价方式'
                        }else{
                            this.title4 = ''
                        }
                        break;
                }
                
                this.currentPage = 1;
                this.getList();
            },
            handleTopChange(status) {
                this.topStatus = status;
            },            
            go(url) {
                this.$router.push({path: url})
            }, 
            grab(item) {
                if (this.shareType == 1) {
                    this.$router.push({path: '/shareApp'});
                } else {
                    this.grabLoading = true
                    const params = {
                        schedulingTaskId: item.schedulingTaskId
                    }
                    this.$api.grab(params).then((response) => {
                        if (response.data.respCode == 0) {
                            item.grabDisabled = true
                        }
                        this.grabLoading = false
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            },
            generateTwoParams(){
                let analyseBusiness = '';
                let analysePosition = '';
                let firstValue = '';
                let secondValue = '';
                let bridge1 = '';
                let bridge2 = '';            
                if( this.finalConExport.length ){
                    firstValue = this.finalConExport[0];
                    secondValue = this.finalConExport[1];
                    let find1 = this.ladderLeftData.findIndex(ele=>{
                        return ele.dicName == firstValue;
                    });
                    let find2 = this.ladderSubData.findIndex(ele=>{
                        return ele.dicName == secondValue;
                    });
                    if( find1 > -1 ){
                        bridge1 = this.ladderLeftData[find1].dicVal; 
                    }
                    if( find2 > -1 ){
                        bridge2 = this.ladderSubData[find2].dicVal;
                    }                    
                    if( firstValue == '不限' ){
                        analyseBusiness = '';
                        analysePosition = '';
                    }else {
                        if( secondValue == '不限' ){
                            analyseBusiness = bridge1;
                            analysePosition = '';
                        }else{
                            analyseBusiness = bridge1;
                            analysePosition = bridge2;
                        }
                    }                    
                }
                return {
                    analyseBusiness,
                    analysePosition
                };
            },
            getList() {
                this.$indicator.open({
                    spinnerType: 'fading-circle'
                });
                this.tableData = [];
                let twoParams = this.generateTwoParams();
                const params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    loginTalentId: this.talentId,
                    longitude: this.position.longitude,
                    latitude: this.position.latitude,
                    loginTalentSex: this.value3,
                    valuationType: this.value4,
                    orderType: this.value1,
                    type:'1',
                    business:twoParams.analyseBusiness,
                    position:twoParams.analysePosition,                    
                }                      
//                this.$messagebox({
//                    title: `提示`,
//                    message: params,
//                })
                this.$api.taskMarket(params).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode === 0 ){
                        if(data && data.list){
                            let _arr = [];
                            for (let item of data.list) {
                                let dist = '';
                                let lat1 = this.position.latitude;
                                let lng1 = this.position.longitude;
                                let lat2 = item.latitude;
                                let lng2 = item.longitude;
                                dist = util.GetDistance(lat1, lng1, lat2, lng2);
                                let newItem = Object.assign({}, item, {distance: dist, range: '', grabDisabled: false})
                                _arr.push(newItem)
                            }
                            this.tableData = _arr;
                            this.isHaveMore(data.isLastPage);                            
                        }
                        this.pageCount = data.pages;
                    }
                 }).catch(err=>{
                    console.log('err',err);
                }).finally(()=>{
                    this.$indicator.close();
                });
                
            },
              click() {
                MessageBox({
                    title: '您需要先完善个人信息才能签协议',
                    message: '您需要先完善个人信息才能签协议?',
                    showCancelButton: true
                });
            },
            routeToDetail(item) {
                this.$router.push({
                    name: 'robDetail',
                    query: item
                });
            },
            getListMore() {
                let twoParams = this.generateTwoParams();
                const params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    loginTalentId: this.talentId,
                    longitude: this.position.longitude,
                    latitude: this.position.latitude,
                    loginTalentSex: this.value3,
                    valuationType: this.value1,
                    orderType: this.value4,
                    type:'1',
                    business:twoParams.analyseBusiness,
                    position:twoParams.analysePosition,                    
                }                
                console.log(params);                
                this.$api.taskMarket(params).then((response) => {
                    const {
                        data: {
                            list,
                            pages,
                            total,
                            pageNum,
                            isLastPage
                        },
                    } = response.data;
                    if (list) {
                        let _arr = [];
                        for (let item of list) {
                            let dist = '', lat1 = this.position.latitude, lng1 = this.position.longitude,
                                lat2 = item.latitude, lng2 = item.longitude;
                            dist = util.GetDistance(lat1, lng1, lat2, lng2)
                            let newItem = Object.assign({}, item, {distance: dist, range: '', grabDisabled: false})
                            _arr.push(newItem)
                        }
                        this.tableData = this.tableData.concat(_arr)
                        this.isHaveMore(isLastPage)
                        this.pageCount = pages
                        this.$nextTick(function () {                            
                            this.scrollMode = "touch";
                        });
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadBottom() {//上拉触发的分页查询
                // 上拉加载
                this.currentPage++
                console.log(this.currentPage)
                this.getListMore()
                this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
            },
            loadTop() {//组件提供的下拉触发方法
                //下拉加载
                this.currentPage = 1
                this.allLoaded = false
                this.getList()
                this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
            },
            isHaveMore(isLastPage) {
                if (isLastPage) {
                    this.allLoaded = true;
                }
            },
            
            
            
            
        },
        filters: {
            settlementTypeText(val) {
                if (val == 1) {
                    return '日结'
                } else if (val == 2) {
                    return '月结'
                } else if (val == 4) {
                    return '周结'
                }
            },
            formatDistance(val) {
                if (val) {
                    let value = Number(val)
                    if (value < 1000) {
                        return value + '米'
                    } else {
                        value = (value / 1000).toFixed(2)
                        return value + '公里'
                    }
                } else {
                    return ''
                }
            },
            formatminDate(val) {
                if (val.length > 5) {
                    if (val) {
                        return util.minDate(val)
                    } else {
                        return '无'
                    }
                } else {
                    return val
                }
            },        
        },
    };
</script>
<style lang="scss" scoped>
    .worksheetListModeCon {
        .firstPartSp2 {
                color: #3296FA;
                margin-right: convertToVw(10);
                border: 1px solid #3296FA;
                border-radius: 2px;                
                font-size: 0.6rem;
                text-align: center;
                padding: 0.15rem 0.45rem;
                margin-right: 0.5rem;
            }
        .firstPartSp3 {
                color: #15BC83;
                border: 1px solid #15BC83;
                border-radius: 2px;                
                font-size: 0.6rem;
                text-align: center;
                padding: 0.15rem 0.45rem;                
            }
         .task-menu {
             position: absolute;
             left: 0;
             right: 0;
             top: 2.2rem;
             height: 2.4rem;
             z-index: 10;
        }
        input {
                border: 0;
                outline: none;
            }
         .card-container {
                background-color: white;
                margin-bottom: 0.25rem;
            }
            .card-paddingtop {
                padding-top: 0.45rem;
            }
        .card-header {
                padding: 0 0.75rem;
                padding-top: 0.43rem;
            }
         .nomore {
             color: #b4b1b1;
             font-size: 0.6rem;
             text-align: center;
        }
        .disableBtn {
            border: solid 0.03rem #c4c4c4 !important;
            color: #c4c4c4 !important;
            width: auto !important;
        }
        .switchCircle {
            position: fixed;
            right: 0.5rem;
            box-sizing: border-box;
            padding-top: convertToVw(10);
            bottom: convertToVw(72);
            width: convertToVw(46);
            height: convertToVw(46);
            text-align: center;
            line-height: convertToVw(16);
            background-color:#fff;
            box-shadow:0px 6px 32px rgba(167,167,167,0.16);
            border-radius:50%;
            z-index: 10;
            color: #4B4C50;
            font-size: convertToVw(12);
        }
        .active {
                background-color: #e84518 !important;
                color: #fff !important;
            }
        .footerBtn {
                width: 4.45rem;
                height: 1.65rem;
                border-radius: 0.83rem;
                border: solid 0.03rem #e84518;
                font-size: 0.6rem;
                color: #d6522d;
                background: #fff;
            }
            .receive-count {
                margin-right: 0.53rem;
                font-family: PingFang-SC-Regular;
                font-size: 0.6rem;
                font-weight: normal;
                font-stretch: normal;
                line-height: 0.22rem;
                letter-spacing: 0.01rem;
                color: #d2d2d2;
            }
        .container {
            background-color: #F5F5F5;
            top:4.6rem;
            z-index: 1;
            padding-bottom:2.55rem;
        }
        .name {
            font-family: PingFang-SC-Medium;
            font-size: 1rem;
        }
        .card-container span {
                display: inline-block;
            }
        .body-label {
                font-family: PingFang-SC-Medium;
                font-size: 0.65rem;
                font-weight: normal;
                font-stretch: normal;
                line-height: 0.22rem;
                letter-spacing: 0.01rem;
                color: #0d0d0d;
            }
            .body-value {
                font-family: PingFang-SC-Regular;
                font-size: 0.65rem;
                font-weight: normal;
                letter-spacing: 0.01rem;
                color: #636363;
            }
        .btn-group {
                float: right;
                padding-bottom: 0.43rem;
            }
        .card-footer {
                margin: 0.4rem 0;
                overflow: hidden;
                padding: 0 0.75rem;
            }
        .status-label {
                display: inline-block;
                margin-top: 0.79rem;
                float: right;
                font-family: PingFang-SC-Regular;
                font-size: 0.75rem;
                font-weight: normal;
                font-stretch: normal;
                line-height: 0.22rem;
                letter-spacing: 0.02rem;
                color: #636363;
            }
         .card-body {
                margin: 0.85rem 0;
                margin-top: 0.5rem;
                padding: 0 0.75rem;
            }
            .card-body-item {
                margin-top: 0.73rem;
            }
        .distance-label {
                display: inline-block;
                margin-top: 0.59rem;
                float: right;
                font-family: PingFang-SC-Regular;
                font-size: 0.6rem;
                font-weight: normal;
                font-stretch: normal;
                line-height: 0.22rem;
                letter-spacing: 0.01rem;
                color: #636363;
            }
        .tag {
                display: inline-block;
                padding: 0.15rem 0.45rem;
                background-color: #f5f5f5;
                border-radius: 0.2rem;
                font-family: PingFang-SC-Regular;
                font-size: 0.6rem;
                color: #636363;
                text-align: center;
                margin-left: 0.98rem;
            }
            .tag + span {
                margin-left: 0.5rem;
            }
        .wrap-drop{
            .cg-is-active1,.cg-is-active2,.cg-is-active3,.cg-is-active4{
                color: #E95A34;
            }
            .van-dropdown-menu__item{
                flex: none;
                min-width: 22%;
            }
            .van-dropdown-menu__title--active{
                color: #E95A34;
            }
        }
    }
</style>
<style lang="scss">
    .worksheetListModeCon {
        .wrap-drop {
            .van-dropdown-menu__item:nth-child(3) {
                max-width: 3.5rem;
            }
        }
    }
</style>