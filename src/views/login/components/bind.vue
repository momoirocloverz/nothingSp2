<template>
    <div class="bind-manger-wrap">
        <mt-header title="扫码绑定" fixed class="mint-header-title bg-fff co-111">
        </mt-header>
        <div class="bind-manger">
            <div class="man-list linebdb linebdt">
                <div class="man-cell linebdb" v-show="Number(state.toc) === 1 || Number(state.toc) === 2">
                    <span class="s-1">绑定的经理人</span>
                    <span class="s-2">{{bindManger}}</span>
                </div>
                <div class="man-cell" v-show="Number(state.toc) === 0 || Number(state.toc) === 1">
                    <span class="s-1">要绑定的班务经理</span>                    
                    <span class="s-2"><span>{{myManger}}</span></span>
                </div>
            </div>
            <div class="man-list linebdb linebdt">
                <div class="man-cell ">
                    <span class="s-1">标签(最多3个)</span>
                    <span class="s-2 co-999">{{label}}</span>
                </div>
                <div class="pb15 pt5 select-label-cell" v-show="labelList.length > 0">
                    <span class="select-label"
                          v-for="(item,index) in labelList"
                          :key="index"
                          @click="deleteLabel(index)"
                    >{{item.dicName}}<img class="i-delete" src="../../../assets/img/new-delete.png" alt=""></span>
                </div>
            </div>
            <div class="p10">
                <div class="man-list mt0 linebdb">
                    <div class="man-cell">
                        <span class="s-1">选择标签类型</span>
                        <span @click="selectTag" class="s-2">{{labelType}}
                            <span v-show="!labelType" class="co-999">请选择行业</span>
                        </span>
                        <img class="i-img" src="../../../assets/img/right@3x.png" alt="">
                    </div>
                </div>
                <div class="label-list bg-fff">
                    <!--<div class="label-box" v-show="isThree"></div>-->
                    <div class="label-item" v-for="(item,index) in  configList" :key="index" v-show="item.currentShow">
                        <label v-for="(itemChilid,itemIndex) in item.list"
                               :key="itemIndex"
                               :class="{'checked':ids.includes(itemChilid.dicVal),'check-three':isThree}"
                               @click="checkLabel(itemChilid,itemIndex,index)"
                        >{{itemChilid.dicName}}</label>
                    </div>
                </div>
            </div>
        </div>
        <footer class="bind-foot">
            <div @click="confirmBindManger()" class="bind-btn">确认绑定</div>
        </footer>


        <!--班务经理多选-->
        <div class="u-mask" @click="cancelManger()" v-show="showManger || showSub"></div>
        <section class="manger-popup" v-show="showManger">
            <div class="manger-top linebdb">
                <span class="co-999" @click="cancelManger()">取消</span>
                <span class="co-orange" @click="saveManger()">确定</span>
            </div>
            <div class="manger-content">
                <van-checkbox-group v-model="value">
                    <van-cell-group>
                        <van-cell
                                v-for="(item, index) in classManagerList"
                                clickable
                                :key="index"
                                :title="`${item.name}`"
                        >
                            <van-checkbox
                                    :name="JSON.stringify(item)"
                                    slot="right-icon"></van-checkbox>
                        </van-cell>
                    </van-cell-group>
                </van-checkbox-group>
            </div>
        </section>
        <!--所有行业单选-->
        <van-picker show-toolbar v-show="showSub" :columns="subList" @cancel="onCancel"
                    @confirm="onConfirm"></van-picker>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {Checkbox, CheckboxGroup, Picker, Cell, CellGroup} from 'vant';
    import 'vant/lib/index.css';

    Vue.use(Checkbox).use(CheckboxGroup).use(Picker).use(Cell).use(CellGroup);
    export default {
        name:'bind',
        data() {
            return {
                manageIdShow:false,
                myManger: '',  //选择的班务经理name
                bindManger: '', //经理人姓名
                showManger: false, //显示班务经理
                labelType: '',   //选择的行业名字
                tagList: [],    //所属行业下的标签列表
                classManagerList: [],  //班务经理列表
                labelList: [],  //选择的标签列表
                label: '通过标签类型添加', //提示语
                showSub: false, //显示行业
                subList: [], //行业名称集合
                industryList: [],//行业集合
                value: [],  //选择的班务经理数据集合再分发
                mangerIds: '', //选择的班务经理ids
                configList: [],// 有多少行业，再创建行业下的标签大集合，用来记住选则标签后又换行业选择标签
                configIndex: -1,
                isThree: false,
                updateRequest: false,
                weiChatInfo: JSON.parse(sessionStorage.getItem("wechatLogin")) ||{},//微信登录成功读取uri中的信息.state
                state: '',
                userInfo: JSON.parse(sessionStorage.getItem("userInfo")) || {},
                isDebug: false,
                data:{},
                ids:[],
            }
        },
        watch: {
            value: function (val) {
                console.log(val)
            },
            labelList: function (val) {
                if (val.length >= 3) {
                    this.isThree = true;
                } else {
                    this.isThree = false;
                }
            }
        },
        mounted() {
            if (this.isDebug) {
                this.state = {
                    id: 2,
                    name: "吴跃进的测试客户",
                    settlementType: "2",
                    payType: "2",
                    industry: "1"
                };
            } else {
                let state = this.weiChatInfo.state;
                this.state = state;
                if( state && state.managerId ){
                    this.getMangerDetail()
                    this.manageIdShow = true;
                }else{
                    this.manageIdShow = false;
                }
                if(state.id){
                    this.getDetail()
                }
            }
            this.getList();
            console.log(this.weiChatInfo);
            console.log(this.userInfo);

        },
        methods: {
            isShowManger: function (item) {
                if(this.classManagerList.length == 0){
                    return this.$toast('该经理人下暂无班务经理!')
                }
                this.showManger = true;
            },
            //取消班务经理
            cancelManger: function () {
                this.value = [];
                this.showSub = false;
                this.showManger = false;
            },
            //保存选择的班务经理
            saveManger: function () {
                let _this = this;
                let names = [];
                let ids = [];
                let values = [];
                if (_this.value.length === 0) {
                    return _this.$toast('班务经理不能为空!')
                }
                for (let item of _this.value) {
                    values.push(JSON.parse(item));
                }
                names = values.map(action => {
                    return action.name
                })
                ids = values.map(action => {
                    return action.id
                })
                _this.myManger = names.join(',');
                _this.mangerIds = ids.join(',');
                console.log(_this.myManger)
                console.log(_this.mangerIds)
                _this.showManger = false;
            },
            //选择行业
            onConfirm(value, index) {
                let _this = this;
                if (!value) {
                    return _this.$toast('请选择行业!')
                }
                let l = _this.configList.length;
                let current = _this.configList[index].hasMsg;
                for (let i = 0; i < l; i++) {
                    //每次选择的时候清空当前是否显示的标志
                    _this.configList[i].currentShow = false;
                    console.log(_this.configList[i].currentShow);
                }
                if (current) {    //说明当前位置已经加载过数据
                    _this.labelType = _this.configList[index].name;
                    _this.configList[index].currentShow = true; //显示当前项的数据
                    _this.configIndex = index;
                    _this.showSub = false;
                    _this.showManger = false;
                    return;
                }
                let id = _this.configList[index].id;
                _this.getAllTag(id, value, index);
            },
            //选择标签
            checkLabel(item, index, parentIndex) {
                let _this = this;
                let val = item.dicVal;
                let vals = _this.labelList.map(i => {
                    return i.dicVal
                });
                let idIndex = vals.indexOf(val);
                if (idIndex > -1) {
                    _this.labelList.splice(idIndex, 1)
                    _this.ids.splice(idIndex,1)
                } else {
                    if(_this.isThree){
                        return _this.$toast('最多只能添加三个标签!')
                    }
                    _this.labelList.push(item);
                    _this.ids.push(val)
                }
                console.log(this.labelList);
            },
            //删除标签
            deleteLabel(index) {
                this.labelList.splice(index,1)
                this.ids.splice(index,1)
                console.log(this.labelList);
                console.log(this.ids);
            },
            selectTag() {
                this.showSub = true
            },
            onCancel() {
                this.showSub = false
            },
            //获取所有班务经理
            getMangerList() {
                let _this = this;
                let params = {
                    customerId: _this.state.id
                }
                this.$api
                    .classManagerList(params)
                    .then(res => {
                        if (res.data.respCode === 0) {
                            if(res.data.data && res.data.data.length > 0){
                                _this.classManagerList = Array.from(res.data.data);
                                if(this.state.managerId){
                                    _this.mangerIds = this.state.managerId;
                                    let ids = _this.classManagerList.map(i=> i.id);
                                    let index = ids.indexOf(Number(_this.mangerIds) );
                                    _this.myManger = _this.classManagerList[index].name;
                                }                                
                            }else{
                                _this.classManagerList = []
                            }
                        }
                        console.log(res.data);
                        console.log(_this.classManagerList);
                    })
                    .catch(error => {
                        _this.$toast(error);
                    });
            },

            getMangerDetail(){
                let _this = this;
                this.$api.detailPm({
                    id:_this.state.managerId
                }).then(res=>{
                    console.log(res)
                    if(res.data.respCode === 0){
                        _this.mangerIds = _this.state.managerId;
                        _this.myManger = res.data.data.nameAlias
                    }
                }).catch(err=>{

                }).finally(()=>{

                })
            },
            //获取所有行业
            getIndustry() {
                let _this = this;
                const params = {
                    code: 'industry',
                }
                this.$api.GetAllTags(params).then((res) => {
                    if (res.data.respCode === 0) {
                        let result = Array.from(res.data.data);
                        for (let item of result) {
                            _this.configList.push({
                                name: item.dicName,
                                id: item.id,
                                hasMsg: false, //list是否加载过数据
                                currentShow: false, //选择的那个就显示那个
                                list: [],
                                dicVal:item.dicVal
                            })
                        }
                        _this.industryList = result;
                        _this.subList = result.map(action => {
                            return action.dicName
                        })
                        let val = _this.configList.map(i => {
                            return i.dicVal;
                        })
                        let industry = _this.state.industry;
                        if(industry){
                            let valIndex = val.indexOf(industry);
                            let id = _this.configList[valIndex].id;
                            let name = _this.configList[valIndex].name;
                            _this.getAllTag(id,name,valIndex);
                        }else{
                            let id = _this.configList[0].id;
                            let name = _this.configList[0].name;
                            _this.getAllTag(id,name,0);
                        }
                        //首次加载获取对应行业的标签
                        console.log(_this.configList);
                    }
                    console.log(_this.subList)
                }).catch((error) => {
                    _this.$toast(error);
                });
            },
            getDetail(id,index){
                let _this = this;
                let params = {
                    id:_this.state.id
                }
                this.$api.detailCustomer(params).then(res=>{
                    if(res.data.respCode === 0){
                        _this.state.industry = res.data.data.industry;
                        _this.state.industryName = res.data.data.industry;
                        _this.bindManger = res.data.data.shortName;
                        console.log(res.data.data);
                        console.log('进来了')
                    }
                    console.log(res);
                }).catch(err=>{
                    console.log(err);
                })
            },
            //获取基本信息
            getList() {
                let _this = this;
                const params = {
                    talentId: _this.userInfo.talentId,
                };
                this.$api
                    .getWorkerDetailThree(params)
                    .then(response => {
                        if(response.data.respCode === 0){
                            // if(_this.state.id){
                            //     _this.getMangerList();
                            // }
                            _this.getIndustry();
                            if(response.data.data){
                                _this.data = response.data.data;
                                for(let item of response.data.data.talentSkills){
                                    let newItem = Object.assign(item,{dicName:item.skillName,dicVal:item.skillValue});
                                    _this.labelList.push(newItem);
                                    _this.ids.push(item.skillValue);
                                }
                            }
                        }
                        console.log(_this.data)
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            //获取行业下的标签
            getAllTag(id, str, configIndex) {
                let _this = this;
                let value = str;
                let index = configIndex;
                const params = {
                    pId: id,
                }
                this.$api.DictionaryListByPid(params).then((res) => {
                    if (res.data.respCode === 0) {
                        console.log('成功进入获取标签' + "---2222222222222")
                        console.log(value)
                        let result = Array.from(res.data.data);
                        let list = [];
                        for (let item of result) {
                            // let check = false;
                            // if(_this.ids.indexOf(item.dicVal) > -1){
                            //     check = true;
                            // }
                            // let label = Object.assign(item, {isChecked: check});
                            list.push(item);
                        }
                        _this.labelType = value;
                        _this.configList[index].list = list;
                        _this.configList[index].hasMsg = true;
                        _this.configList[index].currentShow = true;
                        _this.configIndex = index;
                        _this.showSub = false;
                        _this.showManger = false;
                        _this.tagList = list;
                        console.log(_this.configList);
                    }
                }).catch((error) => {
                    _this.$toast(error);
                });
            },
            //扫码绑定
            confirmBindManger() {
                let _this = this;                
                if ((!_this.mangerIds)&&( this.state.managerId ) ) {
                    return _this.$toast('班务经理不能为空!')
                }                
                if (_this.labelList.length === 0) {
                    return _this.$toast('标签不能为空!')
                }
                if (_this.labelList.length > 3) {
                    return _this.$toast('最多只能添加三个标签!')
                }
                if (_this.updateRequest) {
                    return
                }
                _this.updateRequest = true;
                let list = [];
                for (let item of _this.labelList) {
                    list.push({
                        talentId: _this.userInfo.talentId, //零工id",
                        skillName: item.dicName, //技能名称",
                        skillValue: item.dicVal, //技能值",
                    })
                }
                let params = {};
                if (_this.isDebug) {
                    params = {
                        talentId: _this.userInfo.talentId, //零工id
                        customerId: '1',//客户id"
                        settlementType: '2', //结算方式 2：月 4：周",
                        payType: '1', //支付方式1外包 2代发收入
                        status: _this.userInfo.status, //状态（1：在用2：停用）
                        empManagerIds: _this.mangerIds,
                        talentSkills: Array.from(list),
                        toCustomer:'2',
                    };
                } else {
                    params = {
                        talentId: _this.userInfo.talentId, //零工id
                        customerId: _this.state.id,//客户id"
                        settlementType: _this.state.settlementType, //结算方式
                        payType: _this.state.payType, //支付方式1外包 2代发收入
                        status: _this.userInfo.status, //状态（1：在用2：停用）
                        empManagerIds: _this.mangerIds,
                        talentSkills: Array.from(list),
                        toCustomer:_this.state.toc,   //添加零工 0 只绑定班务经理 1 绑定班务经理和经理人 2 只扫码绑定"
                    };
                }
                this.$api.bindCustomer(params).then((res) => {
                    if (res.data.respCode === 0) {
                        _this.$router.push({name:'bindSuccess'})
                        return;
                    } else if(res.data.errorCode === 50006){
                        _this.$toast('您是该经理人的黑名单用户，无法绑定!')
                    } else if(res.data.errorCode === 50009){
                        _this.$toast('您的背调未通过，无法绑定!')
                    }else{
                        _this.$toast(res.data.errorMsg)
                    }
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    setTimeout(() => {
                        _this.updateRequest = false;
                    }, 500)
                });
            },
        }
    }
</script>

<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    .bind-manger-wrap {
        position: relative;
        height: 100vh;
        .bind-manger {
            background-color: #F5F5F5;
            font-size: convertToVw(16);
            position: fixed;
            left: 0;
            right: 0;
            top: 40px;
            bottom: convertToVw(68);
            overflow-y: scroll;

            .man-list {
                margin-top: convertToVw(18);
                padding-left: convertToVw(15);
                background-color: #fff;

                .man-cell {
                    display: flex;
                    height: convertToVw(46);
                    flex-direction: row;
                    padding-right: convertToVw(15);
                    justify-content: space-between;
                    align-items: center;

                    .s-1 {
                        display: flex;
                        width: 44%;
                    }

                    .s-2 {
                        display: flex;
                        justify-content: flex-end;
                        width: 55%;

                        span {
                            display: block;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }

                    .i-img {
                        display: flex;
                        width: convertToVw(8);
                        height: convertToVw(14);
                    }
                }

                .select-label-cell {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;

                    .select-label {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-right: convertToVw(12);

                        .i-delete {
                            display: flex;
                            width: convertToVw(15);
                            height: convertToVw(15);
                            margin-left: convertToVw(6);
                        }
                    }
                }
            }

            .label-list {
                padding: convertToVw(13) 0 convertToVw(3) convertToVw(13);
                position: relative;

                .label-box {
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 2;
                    background-color: rgba(0, 0, 0, .3);
                }

                .label-item {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    align-items: flex-start;

                    label {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 0 convertToVw(12);
                        height: convertToVw(28);
                        border-radius: convertToVw(3);
                        border: 1px solid #707070;
                        color: #707070;
                        margin-bottom: convertToVw(10);
                        margin-right: convertToVw(10);
                    }

                    label.checked {
                        border: 1px solid #D53D17 !important;
                        color: #D53D17 !important;
                        background: url("../../../assets/img/r-bottom.png") no-repeat right bottom;
                        background-size: convertToVw(20);
                    }
                    label.check-three{
                        color:#e6e6e7;
                        border: 1px solid #e6e6e7;
                    }
                }
            }
        }

        .bind-foot {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999;
            background-color: #fff;
            padding: convertToVw(10) convertToVw(18);

            .bind-btn {
                display: flex;
                width: 100%;
                text-align: center;
                justify-content: center;
                align-items: center;
                height: convertToVw(48);
                background-color: #EA441A;
                color: #fff;
            }
        }
    }

    .van-picker {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1002;
    }

    .van-cell {
        padding: convertToVw(12) convertToVw(12) convertToVw(12) 0;
    }

    .van-cell:not(:last-child)::after {
        left: 0;
    }

    .van-checkbox__icon--checked .van-icon {
        background-color: #e95a34;
        border-color: #e95a34;
    }

    .van-checkbox__icon .van-icon {
        width: convertToVw(22);
        height: convertToVw(22);
    }

    .van-picker__cancel {
        color: #969799;
    }

    .van-picker__confirm {
        color: #e95a34;
    }
</style>