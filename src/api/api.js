import Axios from './http'
import {
    get,
    deletes,
    getForm
} from './http'

let baseURL = 'http://test.api.10000rc.com';
// let baseURL = 'http://192.168.8.26/2.0' //泽阳本地
// let baseURL = 'http://192.168.8.20:8186' //庆文本地
//let baseURL = 'http://192.168.8.14/2.0' //健权本地
if (process.env.NODE_ENV == 'production') {
    if (process.env.VUE_APP_TITLE == 'pre') {
        baseURL = 'http://pre.api.10000rc.com/pre';
    } else if (process.env.VUE_APP_TITLE == 'test') {
        baseURL = 'http://test.api.10000rc.com';
    } else {
        baseURL = 'http://www.10000rc.com/2.0';
    }
}

const publicURL = baseURL + '/public';
const bizURL = baseURL + '/biz';
const financeURL = baseURL + '/finance';
const userURL = baseURL + '/user';


// const ip = 20
// const publicURL = `http://192.168.8.${ip}/public`;
// const bizURL = `http://192.168.8.${ip}:8180/biz`;
// const financeURL = `http://192.168.8.${ip}:8182/finance`;
// const userURL = `http://192.168.8.${ip}:8186/user`;


export default {
    //登录
    login: (param) => { //登录
        return Axios.post(`${userURL}/user/login`, param)
    },
    sign: (param) => { //注册
        return Axios.post(`${userURL}/user/signSec`, param)
    },
    getSmsCode: (params) => { //获取短信验证码
        return get(`${publicURL}/sms/code`, params)
    },
    regIdcard: (params) => { //识别身份证
        return get(`${publicURL}/recognise/idCard`, params)
    },
    fastIdCard: (params) => { //快速注册识别
        return get(`${userURL}/user/check/idCard`, params)
    },
    regBankcard: (params) => { //识别银行卡
        return get(`${publicURL}/recognise/bankCard`, params)
    },
    postImg: (params1, params2) => { //上传图片
        return Axios.post(`http://upload.qiniu.com/putb64/-1/`, params1, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Authorization": "UpToken " + params2,
            },
            withCredentials: false
        })
    },
    changeImg: (params) => { //修改头像
        return Axios.post(`${userURL}/user/avatar`, params)
    },

    UpdateUserPassword: (param) => { //更新密码
        return Axios.post(`${userURL}/user/updatePassword`, param)
    },
    loginnameCheck: (param) => { //更新密码
        return Axios.post(`${userURL}/user/check/loginname`, param)
    },
    Authentication: (param) => { //身份信息认证
        return Axios.post(`${bizURL}/talent/authentication`, param)
    },
    AuthenticationStepOne: (param) => { //身份信息认证第一步
        return Axios.post(`${bizURL}/talent/authentication/first`, param)
    },
    AuthenticationStepTwo: (param) => { //身份信息认证第二步
        return Axios.post(`${bizURL}/talent/authentication/second`, param)
    },
    BindBankCard: (param) => { // 绑定银行卡
        return Axios.post(`${financeURL}/accountBank/bindingBankCard`, param)
    },
    bindingALiPay: (param) => { // 绑定银行卡
        return Axios.post(`${financeURL}/accountBank/bindingALiPay`, param)
    },
    bindingFirst: (param) => { // 绑定银行卡
        return Axios.post(`${financeURL}/accountBank/first?id=${param.id}&ifFirst=${param.ifFirst}`)
    },
    changeBankMobile: (param) => { // 更换银行手机号
        return Axios.put(`${financeURL}/accountBank/changeBankMobile?mobile=${param.mobile}`)
    },
    // 公共模块
    groupDetail: (param) => {
        return Axios.post(`${baseURL}/admin/login/submit`, param)
    },
    //获取字典列表
    getDicList: (code, value) => {
        return Axios.get(`${publicURL}/dictionary/getSonNodeByCodeAndValue?code=${code}&value=${value}`)
    },
    //获取qiuniuToken
    getToken: () => {
        return get(`${publicURL}/qiniu/token`)
    },
    //获取零工信息
    getUserInfo: () => {
        return get(`${bizURL}/talent/authentication/detail`)
    },
    //保险
    insuList: (param) => {
        return Axios.post(`${bizURL}/insu/insuList`, param)
    },
    // 修改零工信息
    UpdateUserInfo: (param) => {
        return Axios.post(`${bizURL}/talent/update`, param)
    },
    UpdatePhone: (param) => { //更新手机号
        return Axios.post(`${userURL}/user/update/app/mobile`, param)
    },
    mainTaskList: (param) => { //6001主任务列表
        return Axios.post(`${bizURL}/task/taskList`, param)
    },
    receiveTaskList: (param) => { //6002任务接收列表
        return Axios.post(`${bizURL}/task/receiveList`, param)
    },
    grabTask: (param) => { //6009零工抢单
        return Axios.put(`${bizURL}/task/grab/talent?taskId=${param.taskId}`)
    },
    deteleTask: (param) => { //6007删除任务
        return deletes(`${bizURL}/task/delete/app`, param)
    },
    giveupTask: (param) => { //6006放弃抢单
        return deletes(`${bizURL}/task/giveUp`, param)
    },
    checkMobileMsg: (param) => { //check mobile
        return get(`${userURL}/user/check/mobile`, param)
    },


    // 客户模块
    getCustomerList: (params) => {
        return Axios.post(`${bizURL}/customer/list`, params)
    },
    addCustomer: (params) => {
        return Axios.post(`${bizURL}/customer/add`, params)
    },
    editCustomer: (params) => {
        return Axios.post(`${bizURL}/customer/update`, params)
    },
    detailCustomer: (params) => {
        return get(`${bizURL}/customer/detail`, params)
    },
    detailCusAccount: (params) => {
        return get(`${bizURL}/customer/adminAccountDetail`, params)
    },
    freezeCustomer: (id) => {
        return Axios.post(`${bizURL}/customer/freeze?id=${id}`)
    },
    unfreezeCustomer: (id) => {
        return Axios.post(`${bizURL}/customer/unfreeze?id=${id}`)
    },
    updateCusPwd: (params) => {
        return Axios.post(`${bizURL}/customer/adminAccountUpdatePwd`, params)
    },
    updateCusPhone: (params) => {
        return Axios.post(`${bizURL}/customer/adminAccountUpdateMobile`, params)
    },
    // 获取服务器时间
    getHostTime: () => {
        return get(`${publicURL}/system/currentTime`)
    },
    //获取服务器时间新
    getCurrentTime: () => {
        //写死8-16   8-13号版本需要改回来
        return get(`${publicURL}/system/currentTime/format`)
    },
    // 经理人模块
    getPmList: (params) => {
        return Axios.post(`${bizURL}/manager/platformManagerList`, params)
    },
    getPmListCus: (params) => {
        return Axios.post(`${bizURL}/manager/customerManagerList`, params)
    },
    pmCheckFail: (params) => {
        return Axios.post(`${bizURL}/manager/checkFail`, params)
    },
    pmCheckPass: (params) => {
        return Axios.post(`${bizURL}/manager/checkPass`, params)
    },
    detailPm: (params) => {
        return get(`${bizURL}/manager/detail`, params)
    },
    freezePm: (id) => {
        return Axios.post(`${bizURL}/manager/freeze?managerId=${id}`)
    },
    unfreezePm: (id) => {
        return Axios.post(`${bizURL}/manager/unfreeze?managerId=${id}`)
    },
    updatePm: (params) => {
        return Axios.post(`${bizURL}/manager/updateAuthInfo`, params)
    },

    //工商户
    addPrivately: (param) => { //添加自有个体工商户
        return Axios.post(`${financeURL}/individualBusiness/persion/add`, param)
    },
    addPrivatelyPlat: (param) => { //添加平台个体工商户
        return Axios.post(`${financeURL}/individualBusiness/platform/add`, param)
    },
    updatePrivately: (param) => { //编辑个体工商户
        return Axios.post(`${financeURL}/individualBusiness/update`, param)
    },
    PrivatelyViewRecord: (param) => { //自有个体工商户交费记录
        return Axios.post(`${financeURL}/individualBusiness/recharge/search`, param)
    },
    PrivatelyPayCharge: (param) => { //自有个体工商户续费
        return Axios.post(`${financeURL}/individualBusiness/recharge`, param)
    },
    PrivatelyList: (param) => { //自有个体工商户列表
        return Axios.post(`${financeURL}/individualBusiness/persion/lists`, param)
    },
    PlatPrivatelyList: (param) => { //平台个体工商户列表
        return Axios.post(`${financeURL}/individualBusiness/platform/lists`, param)
    },
    Recycle: (param) => { //平台回收
        return Axios.post(`${financeURL}/individualBusiness/recycle`, param)
    },
    Allocation: (param) => { //分配
        return Axios.post(`${financeURL}/individualBusiness/allocation`, param)
    },
    PrivatelyOwnDetail: (param) => { //个体户详情
        return Axios.post(`${financeURL}/individualBusiness/detial`, param)
    },
    payRecordDetail: (param) => { 
        return Axios.post(`${financeURL}/salary/salarySheet/payRecordDetail`, param)
    },

    //系统
    AddPermission: (param) => { //添加权限
        return Axios.post(`${userURL}/permission/add`, param)
    },
    EditPermission: (param) => { //编辑权限
        return Axios.post(`${userURL}/permission/update`, param)
    },
    ViewPermission: (param) => { //查看权限
        return Axios.post(`${userURL}/permission/info`, param)
    },
    TreePermission: (param) => { //权限树
        return Axios.post(`${userURL}/permission/treelist`, param)
    },
    DeletePermission: (param) => { //删除权限
        return deletes(`${userURL}/permission/delete`, param)
    },

    UserList: (params) => { //用户列表
        return Axios.post(`${userURL}/user/list`, params)
    },
    AddUser: (param) => { //用户添加
        return Axios.post(`${userURL}/user/add`, param)
    },
    EditUser: (param) => { //编辑用户
        return Axios.post(`${userURL}/user/update`, param)
    },
    RoleDetail: (param) => { //用户详情
        return get(`${userURL}/user/detail`, param)
    },
    ViewUser: (params) => { //查看用户
        return get(`${userURL}/user/info`, params)
    },

    RoleList: (params) => { //角色列表
        return Axios.post(`${userURL}/role/list`, params)
    },
    AddRole: (param) => { //角色添加
        return Axios.post(`${userURL}/role/add`, param)
    },
    EditRole: (param) => { //编辑角色
        return Axios.post(`${userURL}/role/update`, param)
    },
    ViewRole: (params) => { //查看角色
        return get(`${userURL}/role/detail`, params)
    },

    ParamsList: (params) => { //参数列表
        return get(`${publicURL}/sysparam/list`, params)
    },
    AddParams: (param) => { //参数添加
        return Axios.post(`${publicURL}/sysparam/add`, param)
    },
    EditParams: (param) => { //编辑参数
        return Axios.post(`${publicURL}/sysparam/update`, param)
    },
    DeleteParams: (params) => { //删除参数
        return deletes(`${publicURL}/sysparam/delete`, params)
    },
    getServiceWechat: () => { // 获取客服微信
        return get(`${publicURL}/sysparam/info/string?paramName=customer_service_we_chat`)
    },
    getMobile: () => { // 获取人保电话
        return get(`${publicURL}/sysparam/info/string?paramName=insu_mobile`)
    },
    DictionaryListByPid: (params) => { //字典列表
        return get(`${publicURL}/dictionary/getSonNodeByParentId`, params)
    },
    AddDictionary: (param) => { //字典添加
        return Axios.post(`${publicURL}/dictionary/add`, param)
    },
    EditDictionary: (param) => { //编辑字典
        return Axios.post(`${publicURL}/dictionary/update`, param)
    },
    // DeleteDictionary: (params) => {//删除字典
    //   return deletes.get(`${publicURL}/dictionary/delete`,params)
    // },

    // login: (param) => {//登录
    //   return Axios.post(`${userURL}/user/login`, param)
    // },
    TaskDetail: (param) => { //任务详情
        return get(`${bizURL}/task/detail`, param)
    },
    TaskUpper: (param) => { //任务价格上限
        return get(`${bizURL}/industry/salary/check/price`, param)
    },
    LoginOut: () => { //登录
        return get(`${userURL}/user/logout`)
    },
    AccountDetail: (param) => { //账户详情
        return Axios.post(`${financeURL}/account/detail`, param)
    },

    AccountCharge: (param) => { //账户流水
        return Axios.post(`${financeURL}/account/record/runningAccount`, param)
    },

    WechatLogin: (param) => { //wechat login
        return get(`${userURL}/wechat/login`, param)
    },
    scheduleCan: (param) => { //排班日历
        //return Axios.post(`${bizURL}/scheduling/calendar`, param)
        return get(`${bizURL}/scheduling/newCalendar`, param)
    },
    schedulePreCheck: (param) => { //打卡前确认
        return get(`${bizURL}/attendance/preOpenPageCheck`, param)
    },
    scheduleDetail: (param) => { //日历详情
        // return Axios.post(`${bizURL}/scheduling/calendar/detail`, param)
        return get(`${bizURL}/scheduling/newCalendar/detail`, param)
    },
    scheduleWorkerList: (param) => { //打卡人员
        return get(`${bizURL}/attendance/punchPageEmpList`, param)
    },
    //空挂
    getAllEmpty: (param) => { //排班日历
        return Axios.post(`${bizURL}/scheduling/manager/getEmptyTalent`, param)
    },
    getScheEmpty: (param) => { //排班空挂
        return get(`${bizURL}/scheduling/getSchedulingEmptyTalent`, param)
    },
    getScheEmptyUpd: (param) => { //排班空挂
        return get(`${bizURL}/scheduling/getSchedulingEmptyTalentsForUpd`, param)
    },
    getScheIndustry: (param) => { //排班空挂
        return get(`${bizURL}/scheduling/platform/setting`, param)
    },
    GetAllTags: (param) => { //所有行业
        return get(`${publicURL}/dictionary/getByCodeAndLevel`, param)
    },
    AddEmpty: (param) => { //排班日历
        return Axios.post(`${bizURL}/scheduling/manager/addSchedulingEmptyTalent`, param)
    },
    editEmpty: (param) => { //排班日历
        return Axios.post(`${bizURL}/scheduling/manager/updSchedulingEmptyTalent`, param)
    },
    CheckIn: (param) => { //工微信打卡
        return Axios.post(`${bizURL}/attendance/punch`, param)
    },
    schedulePreScanCheck: (param) => { //项目经理微信打卡预扫描
        return get(`${bizURL}/attendance/preOpenPageCheck`, param)
    },
    WschedulePreScanCheck: (param) => { //零工微信打卡预扫描
        return get(`${bizURL}/attendance/preScanCheck`, param)
    },
    WorkerCardCheck: (param) => { //零工打卡预扫描
        return Axios.post(`${bizURL}/attendance/prePunchCheck`, param)
    },
    updateSign: (param) => { // 重新签名
        return Axios.post(`${bizURL}/attendance/updateSign`, param)
    },
    BindWechat: (param) => { //绑定微信跳转
        return get(`${publicURL}/wechat/talent/binding/redirect`, param)
    },
    BindWechatInfo: (param) => { //绑定微信
        return get(`${publicURL}/wechat/talentBindingUrl`, param)
    },
    MScheduleDetail: (param) => { //班组长排班详情
        return get(`${bizURL}/scheduling/detail`, param)
    },
    CheckCount: (param) => { //审核计件量
        return get(`${bizURL}/attendance/pieceSizeButton`, param)
    },
    getByIdCard: (param) => { //排班日历
        return get(`${bizURL}/talent/getByIdCard`, param)
    },
    ReferenceCheck: (param) => { //背调
        return get(`${bizURL}/talent/platform/referenceCheck`, param)
    },
    industryList: (param) => { //排班日历
        return get(`${bizURL}/scheduling/platform/employee/industry`, param)
    },
    addDailyEmp: (param) => { //添加零工到排班
        return Axios.post(`${bizURL}/attendance/addDailyEmp`, param)
    },
    getEmpList: (param) => { // 获取某项目经理下的零工
        return Axios.post(`${bizURL}/talent/manager/empList`, param)
    },
    getPunchrange: (param) => { //获取打卡范围
        return get(`${publicURL}/sysparam/info`, param)
    },
    cusConfirmList: (param) => { //获取排班客户确认页的零工列表
        return get(`${bizURL}/attendance/customer/confirm/talentList`, param)
    },
    saveCusConfirm: (param) => { //
        return Axios.post(`${bizURL}/scheduling/saveCustomerSchedulingConfirm`, param)
    },
    confirmEmpty: (param) => { // 空白客户确认表带删除功能
        return Axios.post(`${bizURL}/scheduling/confirm/getEmptySchedulingConfirm`, param)
    },
    getServeCustomer: (param) => { //获取排班客户
        return get(`${bizURL}/manager/serverCustomerId`, param)
    },
    updateSchedule: (param) => { // 修改排班
        return Axios.post(`${bizURL}/scheduling/add`, param)
    },
    getEmptySchedulingConfirm: (param) => { // 空白签到表
        return get(`${bizURL}/scheduling/confirm/getEmptySchedulingConfirm`, param)
    },
    getRNP: (param) => { //奖惩列表
        return get(`${financeURL}/reward/punish/get`, param)
    },
    handleRNP: (param) => { //同意驳回奖惩
        return Axios.put(`${financeURL}/reward/punish/update?rewardpunishmentsId=${param.rewardpunishmentsId}&status=${param.status}`)
    },
    addRNP: (param) => { //添加奖惩
        return Axios.post(`${financeURL}/reward/punish/add`, param)
    },
    getBatchRNP: (param) => { //奖惩批次
        return get(`${financeURL}/reward/punish/batchNumber`, param)
    },
    getPersonRNP: (param) => { //奖惩人员
        return get(`${financeURL}/reward/punish/talent/list`, param)
    },
    searchSalary: (param) => { //查询收入
        return Axios.post(`${financeURL}/salary/talent/searchSalary`, param)
    },
    getMonthRNP: (param) => { //查询收入月份
        return get(`${financeURL}/salary/talent/searchSalaryMonth`, param)
    },
    salarySheet: (param) => { //收入条
        return Axios.post(`${financeURL}/salary/customer/salarySheet`, param)
    },
    salaryDetailList: (param) => { //零工收入明细
        return Axios.post(`${financeURL}/salary/talent/salary/detail`, param)
    },
    getAvatar: (param) => { //微信头像
        return get(`${publicURL}/wechat/talent/headImg/redirect`, param)
    },
    CashOut: (param) => { //提现
        return get(`${financeURL}/yeePay/remit`, param)
    },
    ParamsInfo: (params) => { //参数详情
        return get(`${publicURL}/sysparam/info`, params)
    },
    BindChat: (params) => { //登入绑定微信
        return get`${publicURL}/wechat/talent/binding/redirect?userId=${params}`
    },
    SocketConnect: (params) => { //websocket
        return `ws://test.api.10000rc.com/biz/attendance/websocket?schedulingId=${params}`
    },
    CardBinInfo: (param) => { //binding银行卡信息
        return get(`${financeURL}/yeePay/cardBinInfo`, param)
    },
    wechatHandle: (param) => { //微信处理
        return get(`${publicURL}/wechat/operateRedirect`, param)
    },
    WechatToBind: (param) => { //微信绑定
        return get(`${publicURL}/wechat/talent/binding/auth`, param)
    },
    preAddDailyEmpCheck: (param) => { //微信绑定
        return get(`${bizURL}/attendance/preAddDailyEmpCheck`, param)
    },
    preAddDailyEmpByQrCheck: (param) => { //微信绑定
        return get(`${bizURL}/attendance/preAddDailyEmpByQrCheck`, param)
    },
    getNOrepeatIndustry: (param) => { //微信绑定
        return get(`${bizURL}/scheduling/enable/industry`, param)
    },
    shareSDK: (param) => { //微信绑定
        return get(`${publicURL}/wechat/jsConfigObj`, param)
    },
    unbindWechat: (param) => { // 微信解绑  参数talentUserId
        return get(`${publicURL}/wechat/unBinding`, param)
    },
    remainingNumber: (param) => { //排班剩余人数
        // return get(`${bizURL}/task/remaining/number`, param)
        return get(`${bizURL}/scheduling/support/remaining/number`, param)
    },
    checkSchedulingNumberStatus: (param) => { //排班剩余人数
        return get(`${bizURL}/scheduling/checkSchedulingNumberStatus`, param)
    },
    EditPrice: (param) => { //查询收入
        return Axios.post(`${bizURL}/attendance/updatePunchPieceSize`, param)
    },
    getSchedulingConfirm: (param) => { // 获取客户确认表
        return get(`${bizURL}/scheduling/confirm/getSchedulingConfirm`, param)
    },
    getSchedulingConfirmSign: (param) => { // 客户确认签字
        return get(`${bizURL}/scheduling/confirm/sign`, param)
    },
    schedulingShutDown: (param) => { // 关闭排班
        return Axios.put(`${bizURL}/scheduling/shutDown?schedulingId=${param.schedulingId}`)
    },
    updateAttendence: (param) => { // 修改员工考勤
        return Axios.post(`${bizURL}/attendance/updateForM`, param)
    },
    confirmTalentAttendance: (param) => { // 确认零工考勤
        return Axios.put(`${bizURL}/scheduling/confirmTalentAttendance?schedulingId=${param.schedulingId}`)
    },
    getSchedulingConfirmPersonList: (param) => { // 获取确认人列表
        return get(`${bizURL}/scheduling/confirm/getSchedulingConfirmPersonList`, param)
    },
    getCustomerConfirmUrl: (param) => { // 发送给客户确认
        return get(`${bizURL}/scheduling/confirm/getCustomerConfirmUrl`, param)
    },
    cancelCustomerConfirm: (param) => { // 撤回确认请求
        return get(`${bizURL}/scheduling/confirm/cancelCustomerConfirm`, param)
    },
    reGetCustomerConfirmUrl: (param) => { // 重新发送
        return get(`${bizURL}/scheduling/confirm/reGetCustomerConfirmUrl`, param)
    },
    multiPunchSwitch: (param) => { // 设置是否允许多段打卡
        // param:empId  multiPunch 1不允许 2允许
        return get(`${bizURL}/attendance/multiPunchSwitch`, param)
    },
    // 参数schedulingId
    getAddDailyEmpCode: (param) => { // 获取验证码
        return get(`${bizURL}/attendance/getAddDailyEmpCode`, param)
    },
    reGenerateCode: (param) => { // 重新生成验证码
        return get(`${bizURL}/attendance/reGenerateCode`, param)
    },
    // 参数code
    applyByCode: (param) => { // 日结零工通过验证码加入排班
        return get(`${bizURL}/attendance/applyByCode`, param)
    },
    applyListTalent: () => { // 零工查看自己的申请记录
        return get(`${bizURL}/attendance/applyListTalent`)
    },
    // 参数schedulingId
    applyListManager: (param) => { // 项目经理查看某个排班的申请记录
        return get(`${bizURL}/attendance/applyListManager`, param)
    },
    // 参数applyId
    delApply: (param) => { // 项目经理删除某个申请记录
        return Axios.delete(`${bizURL}/attendance/delApply?applyId=${param.applyId}`)
    },
    // 参数applyIdList[]  industry  schedulingId
    addDailyEmpByCode: (param) => { // 项目经理选择零工添加进排班
        return Axios.post(`${bizURL}/attendance/addDailyEmpByCode`, param)
    },

    // 注册用户 实名核身鉴权
    detectAuth: (params) => {
        return Axios.post(`${userURL}/user/detectAuth`, params)
    },

    // 根据bizToken获取识别后的用户信息
    detectRedirect: (param) => {
        return get(`${userURL}/user/detectRedirect`, param)
    },

    // 补充认证
    faceInfoSupplement: (param) => {
        return Axios.post(`${userURL}/user/faceInfoSupplement`, param)
    },


    // 获取可奖惩的零工列表
    punishTalentList: (param) => {
        return Axios.post(`${financeURL}/reward/punish/new/talent/list`, param)
    },
    // 查看特殊扣款项的详细记录
    adjustment: (param) => {
        return Axios.post(`${financeURL}/adjustment/specialAdjustmentsDetailList`, param)
    },

    
    getSpecialAdjustmentsDetailListSummary: (param) => {
        return Axios.post(`${financeURL}/adjustment/getSpecialAdjustmentsDetailListSummary`, param)
    },
    
    // 获取具体某个零工可奖惩的批次
    batchNumber: (param) => {
        return Axios.post(`${financeURL}/reward/punish/new/talent/batchNumber`, param)
    },


    // 判断是否需要人脸比对
    faceCompareGet: (param) => {
        return get(`${bizURL}/attendance/faceCompareGet`, param)
    },

    // 获取打卡时需要收取哪些费用
    getCustomerFeeBySchId: (param) => {
        return get(`${bizURL}/customer/getCustomerFeeBySchId`, param)
    },
    //解绑银行卡
    setUnBindBankCard: (param) => {
        return Axios.delete(`${baseURL}/finance/accountBank/del?id=${param.id}&bankId=${param.bankId}`)
    },
    //判断是否在黑名单中
    isBlackList: (param) => {
        return get(`${bizURL}/blacklist/isInBlacklistEmp`, param)
    },
    //零工扫码绑定
    bindCustomer: (param) => {
        return Axios.post(`${bizURL}/newtalent/bindCustomer`, param)
    },
    // 经理人所创建的所有班务经理
    classManagerList: (params) => {
        return get(`${bizURL}/newtalent/classManagerList`, params)
    },
    //员工更新技能标签
    insertTalentSkill: (param) => {
        return Axios.post(`${bizURL}/newtalent/insertTalentSkill`, param)
    },
    //获取经理人日结零工模式
    getDailyPayType: (param) => {
        return get(`${bizURL}/customer/getDailyPayType`, param)
    },
    //零工是否扫码绑定状态判断
    bindCustomerStatus: (param) => {
        return get(`${bizURL}/newtalent/bindCustomerStatus`, param)
    },
    //零工基本信息
    getWorkerDetailThree: (param) => {
        return get(`${bizURL}/newtalent/detail`, param)
    },
    //零工端-->工单市场
    taskMarket: (param) => {
        return Axios.post(`${bizURL}/schedulingTask/taskMarket`, param)
    },
    //零工端-->零工抢单记录列表
    grabRecordList: (param) => {
        return get(`${bizURL}/schedulingReceiveTask/grabRecordList`, param)
    },
    //零工端-->任务详情
    grabRecordDetail: (param) => {
        return get(`${bizURL}/schedulingTask/detail`, param)
    },
    //零工端-->添加零工任务
    addTask: (param) => {
        return Axios.post(`${bizURL}/schedulingTask/add`, param)
    },
    //零工端-->零工抢单
    grab: (param) => {
        return Axios.put(`${bizURL}/schedulingReceiveTask/grab?schedulingTaskId=${param.schedulingTaskId}`)
    },
    //零工端-->零工放弃
    giveUp: (param) => {
        return Axios.put(`${bizURL}/schedulingReceiveTask/giveUp?schedulingTaskReceiveId=${param.schedulingTaskReceiveId}`)
    },
    feeCheck: (param) => {
        return get(`${bizURL}/customer/feeCheck`,param)
    },
    appStore: () => {
        return Axios.get(`${publicURL}/version/latest`, {
            params: {},
            headers: {
                os: 'Android',
                appType: '3'
            }
        })
    },
    //3.0.3.2
    //注册第一步
    signUserFirst: (param) => {
        return Axios.post(`${userURL}/user/signUserFirst`,param)
    },
    signUserSec: (param) => {//  第二步
        return Axios.post(`${userURL}/user/signUserSec`,param)
    },
    detectAuthFirst: (param) => { //  人脸识别
        return Axios.post(`${userURL}/user/detectAuthFirst`,param)
    },
    getIndustryInfo: (param) => { //  人脸识别
        return Axios.post(`${bizURL}/schedulingTask/getIndustryInfo`,param)
    },
    //3.0.4
    geoAdd: (param) => { //  记录零工地理位置
        return Axios.post(`${publicURL}/geo/add/detail`,param)
    },
    userAgreement: (param) => { //  获取用户协议
        return get(`${bizURL}/agreement/userAgreement`, param)
    },
    isHaveInCome:(param) => {
        return Axios.post(`${bizURL}/talent/isHaveInCome`,param)
    },
    wechatHandleNew: (param) => { //微信处理
        return get(`${bizURL}/newtalent/operateQr`, param)
    },
    quickSign: (params) => { //快捷注册
        return Axios.post(`${userURL}/user/quickSign`, params)
    },
    logPushRecord: (params) => { //获取所有消息记录
        return Axios.post(`${bizURL}/logPush/record`, params)
    },
    logPushUnRecord: (params) => { //获取未读消息记录条数 0为无未读
        return get(`${bizURL}/logPush/unReadRecord`, params)
    },
    changeStatus: (params) => { //获取未读消息记录条数 0为无未读
        return get(`${bizURL}/logPush/changeStatus`, params)
    },
}