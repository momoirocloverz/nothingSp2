import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import( './views/Home.vue')
const WorkSpace = () => import( './views/WorkSpace.vue')

const Login = () => import( './views/login/Login.vue')
const Register = () => import( './views/login/Register.vue')
const RegisterPage = () => import( './views/login/RegisterPage.vue')
const RegisterFast = () => import( './views/login/RegisterFast.vue')
const RegisterFastTwo = () => import( './views/login/RegisterFastTwo.vue')
const AuthBack = () => import( './views/login/AuthBack.vue')
const FullFill = () => import( './views/login/FullFill.vue')
const Protocol = () => import(  './views/login/Protocol.vue')
const ForgetPsw = () => import( './views/login/ForgetPsw.vue')
const Mine = () => import( './views/mine/Mine.vue')
const UserInfo = () => import('./views/mine/UserInfo.vue')
const Identification = () => import( './views/mine/Identification.vue')
const IdentifyId = () => import(  './views/mine/IdentifyId.vue')
const IdentifySuccess = () => import( './views/mine/IdentifySuccess.vue')
const BaseInfo = () => import( './views/mine/BaseInfo.vue')
const BindBankcard = () => import(  './views/mine/BindBankcard.vue')
const BindBankCardSave = () => import(  './views/mine/BindBankcardSave.vue')
const Alipay = () => import(  './views/mine/alipay.vue')
const MyAlipay = () => import(  './views/mine/myAlipay.vue')
const BankMobile = () => import( './views/mine/BankMobile.vue')
const MyBankcard = () => import( './views/mine/MyBankcard.vue')
const Setting = () => import(  './views/mine/Setting.vue')
const ChangePsw = () => import( './views/mine/ChangePsw.vue')
const ChangePhone = () => import( './views/mine/ChangePhone.vue')
const MapView = () => import( './views/mine/Map.vue')
const FacePassword = () => import( './views/mine/FacePassword.vue')
const FaceAuth = () => import( './views/mine/FaceAuth.vue')
const AuthError = () => import( './views/attendence/AuthError.vue')
const CheckAuth = () => import( /* webpackChunkName: 'Mine' */ './views/attendence/CheckAuth.vue')
const AuthResult = () => import( /* webpackChunkName: 'Mine' */ './views/attendence/AuthResult.vue')
const ScanBack = () => import( /* webpackChunkName: 'Mine' */ './views/attendence/ScanBack.vue')

const Schedule = () => import( /* webpackChunkName: 'Home' */ './views/schedule/index.vue')
const others = () => import( /* webpackChunkName: 'Home' */ './views/schedule/others.vue')
const CashOut = () => import( /* webpackChunkName: 'Home' */ './views/mine/CashOut.vue')
const Result = () => import( /* webpackChunkName: 'Home' */ './views/mine/Result.vue')

//账号
const NotOpen = () => import( /* webpackChunkName: 'Acount' */ './views/account/NotOpen.vue')
const Open = () => import( /* webpackChunkName: 'Acount' */ './views/account/Open.vue')
const Wthdrawals = () => import( /* webpackChunkName: 'Acount' */ './views/account/wthdrawals.vue')
const ChargeDetail = () => import( /* webpackChunkName: 'Acount' */ './views/account/ChargeDetail.vue')

//任务
// const PanicList = () => import(/* webpackChunkName: 'Home' */ './views/task/PanicList.vue')
// const Received = () => import(/* webpackChunkName: 'Home' */ './views/task/Received.vue')
const TaskDetail = () => import( /* webpackChunkName: 'Home' */ './views/task/detail.vue')
const receiveList = () => import( /* webpackChunkName: 'Home' */ './views/task/receiveList.vue')
const TaskTab = () => import( /* webpackChunkName: 'Home' */ './views/task/TaskTab.vue')
const SelectRadius = () => import( /* webpackChunkName: 'Home' */ './views/task/selectRadius.vue')
const SimpleMap = () => import( /* webpackChunkName: 'Home' */ './views/task/simpleMap.vue')

//考勤
const CustomerReport = () => import( /* webpackChunkName: 'attendence' */ './views/attendence/CustomerReport.vue')
const EmptyReport = () => import( /* webpackChunkName: 'attendence' */ './views/attendence/EmptyReport.vue')
const CheckIn = () => import( /* webpackChunkName: 'attendence' */ './views/attendence/CheckIn.vue')
const cusConfirm = () => import( /* webpackChunkName: 'attendence' */ './views/attendence/cusConfirm.vue')
const EmptyConfirm = () => import( /* webpackChunkName: 'attendence' */ './views/attendence/EmptyConfirm.vue')
const UpdateAttendence = () => import( /* webpackChunkName: 'attendence' */ './views/attendence/UpdateAttendence.vue')
const ConfirmAttendence = () => import( /* webpackChunkName: 'attendence' */ './views/attendence/ConfirmAttendence.vue')


//排班
const Calendar = () => import( /* webpackChunkName: 'schedule' */ './views/schedule/Calendar.vue')
const Headman = () => import( /* webpackChunkName: 'schedule' */ './views/schedule/Headman.vue')
const DayWorker = () => import( /* webpackChunkName: 'schedule' */ './views/schedule/DayWorker.vue')
const CodeAdd = () => import( /* webpackChunkName: 'schedule' */ './views/schedule/CodeAdd.vue')
const CodeShow = () => import( /* webpackChunkName: 'schedule' */ './views/schedule/CodeShow.vue')
const MaShow = () => import( /* webpackChunkName: 'schedule' */ './views/schedule/maShow.vue')
const BackShow = () => import( /* webpackChunkName: 'schedule' */ './views/schedule/backShow.vue')
const AddSuccess = () => import( /* webpackChunkName: 'schedule' */ './views/schedule/AddSuccess.vue')
const WorkerList = () => import( /* webpackChunkName: 'schedule' */ './views/schedule/WorkerList.vue')
const ViewMap = () => import( /* webpackChunkName: 'schedule' */ './views/schedule/ViewMap.vue')
const UpdateSchedule = () => import( /* webpackChunkName: 'schedule' */ './views/schedule/UpdateSchedule.vue')

//空挂
const emptyList = () => import( /* webpackChunkName: 'schedule' */ './views/empty/emptyList.vue')
const addEmpty = () => import( /* webpackChunkName: 'schedule' */ './views/empty/addEmpty.vue')
const emptyShow = () => import( /* webpackChunkName: 'schedule' */ './views/empty/emptyShow.vue')

//打卡
const CheckInCard = () => import( /* webpackChunkName: 'schedule' */ './views/card/CheckInCard.vue')
const WechatLogin = () => import( /* webpackChunkName: 'attendence' */ './views/card/WechatLogin.vue')
const WechatOpt = () => import( /* webpackChunkName: 'attendence' */ './views/login/WechatOpt.vue')
const Canvas = () => import( /* webpackChunkName: 'attendence' */ './views/card/Canvas.vue')
const WorkerCard = () => import( /* webpackChunkName: 'attendence' */ './views/card/WorkerCard.vue')
const WorkerCanvas = () => import( /* webpackChunkName: 'attendence' */ './views/card/WorkerCanvas.vue')
const PunchResult = () => import( /* webpackChunkName: 'attendence' */ './views/attendence/PunchResult.vue')
const ReSign = () => import( /* webpackChunkName: 'attendence' */ './views/schedule/ReSign.vue')
const ConfirmSign = () => import( /* webpackChunkName: 'attendence' */ './views/schedule/ConfirmSign.vue')

//收入
const SalaryTab = () => import( /* webpackChunkName: 'salary' */ './views/salary/SalaryTab.vue')
const Salary = () => import( /* webpackChunkName: 'salary' */ './views/salary/Salary.vue')
const SalaryBill = () => import( /* webpackChunkName: 'salary' */ './views/salary/SalaryBill.vue')
const InsuranceFee = () => import( /* webpackChunkName: 'salary' */ './views/salary/insuranceFee.vue')
const InsuranceSystem = () => import( /* webpackChunkName: 'salary' */ './views/salary/insuranceSystem.vue')
const collectionRecord = () => import( /* webpackChunkName: 'salary' */ './views/salary/collectionRecord.vue')

//保险
const InsuranceList = () => import( /* webpackChunkName: 'salary' */ './views/insurance/list.vue')
const CheckImg = () => import( /* webpackChunkName: 'salary' */ './views/insurance/checkImg.vue')

//奖惩
const RNPList = () => import( /* webpackChunkName: 'rewardNpunishment' */ './views/rewardNpunishment/RNPList.vue')
const AddRNP = () => import( /* webpackChunkName: 'rewardNpunishment' */ './views/rewardNpunishment/AddRNP.vue')

//银行列表
const BankList = () => import( /* webpackChunkName: 'rewardNpunishment' */ './views/account/BankList.vue')


// 客户确认相关
const ToVerify = () => import('./views/customer/ToVerify.vue')
const HaveCancel = () => import('./views/customer/HaveCancel.vue')
const PageReceipt = () => import('./views/customer/PageReceipt.vue')
const SendCustomer = () => import('./views/schedule/SendCustomer.vue')
const ShareBlank = () => import('./views/schedule/ShareBlank.vue')
//3.01 扫码绑定
const BindingManager = () => import('./views/login/bindingManager.vue')
const RepeatBind = () => import('./views/login/components/repeatBind.vue')
const UnBind = () => import('./views/login/components/unBind.vue')
const Bind = () => import('./views/login/components/bind.vue')
const BindSuccess = () => import('./views/login/components/bindSuccess.vue')
const shareApp = () => import('./views/share/shareApp.vue')

//3.0.1消息
const MessageDetails = () => import('./views/message/messageDetails.vue')
const MessageIndex = () => import('./views/message/index.vue')

Vue.use(Router)

export default new Router({
  routes: [{
      path: "/home",
      name: "home",
      component: Home,
      alias: '首页',
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/",
      name: "login",
      component: Login,
      alias: '登录',
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/receiveList",
      name: "receiveList",
      component: receiveList,
      meta: {
        keepAlive: true
      }
    },
           {
      path: "/shareApp",
      name: "shareApp",
      component: shareApp,
      meta: {
        keepAlive: true,
          isRequireAuth: false,
      }
    },      
           
    
    {
      path: '/home',
      component: Home,
      children: [{
          path: '',
          redirect: '/task',
        },
        {
          path: 'workspace',
          component: WorkSpace,
          name: 'WorkSpace',
          meta: {
            isRequireAuth: false,
          }
        },
        {
          path: "/task",
          name: "TaskTab",
          component: TaskTab,
          alias: '工单市场',
          meta: {
            keepAlive: false,
            isRequireAuth: false,
          }
        },    
        {
          path: 'mine',
          component: Mine,
          name: 'Mine',
          meta: {
            isRequireAuth: true,
          }
        },
      ],
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: {
        isRequireAuth: false,
        keepAlive: true
      }
    },
    {
      path: "/userregister",
      name: "userregister",
      component: RegisterPage,
      meta: {
        isRequireAuth: false,
      }
    },
            {
          path: "/SelectRadius",
          name: "SelectRadius",
          component: SelectRadius,
          alias: '选择查看范围',
          meta: {
            keepAlive: false,
            isRequireAuth: false,
          }
        },   
           
            {
          path: "/SimpleMap",
          name: "SimpleMap",
          component: SimpleMap,
          alias: '位置',
          meta: {
            keepAlive: false,
            isRequireAuth: false,
          }
        },   
           
           
    {
      path: "/registerFast",
      name: "registerFast",
      component: RegisterFast,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/registerFastTwo",
      name: "registerFastTwo",
      component: RegisterFastTwo,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/authback",
      name: "authback",
      component: AuthBack,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/fullfill",
      name: "fullfill",
      component: FullFill,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/Protocol",
      name: "Protocol",
      component: Protocol,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/forgetPsw",
      name: "forgetPsw",
      component: ForgetPsw,
      meta: {
        isRequireAuth: false,
      }
    },

    //排班
    {
      path: "/schedule/others",
      name: "others",
      component: others,
    },
    {
      path: '/updateschedule',
      name: 'updateschedule',
      component: UpdateSchedule,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/mine/cashout",
      name: "cashOut",
      component: CashOut,
    },
    //账号
    {
      path: "/open",
      name: "open",
      component: Open,
    },
    {
      path: "/wthdrawals",
      name: "wthdrawals",
      component: Wthdrawals,
    },
    {
      path: "/notOpen",
      name: "notOpen",
      component: NotOpen,
    },
    {
      path: "/chargeDetail",
      name: "chargeDetail",
      component: ChargeDetail,
    },
    //完善个人信息
    {
      path: "/userInfo",
      name: "userInfo",
      component: UserInfo,
    },
    //身份认证
    {
      path: "/identification",
      name: "identification",
      component: Identification,
      meta: {
        isRequireAuth: false,
      }
    },
    //身份认证成功之后的信息展示
    {
      path: "/identifysuccess",
      name: "identifysuccess",
      component: IdentifySuccess,
      meta: {
        title: '认证成功',
        isRequireAuth: false,
      }
    },
    //身份认证-身份证认证
    {
      path: "/identifyId",
      name: "identifyId",
      component: IdentifyId,
      meta: {
        title: '注册',
        isRequireAuth: false,
      }
    },
    //身份认证-基本信息填写
    {
      path: "/baseinfo",
      name: "baseinfo",
      component: BaseInfo,
      meta: {
        title: '注册',
        isRequireAuth: false,
      }
    },
    // 绑定银行卡
    {
      path: "/bindbankcard",
      name: "bindbankcard",
      component: BindBankcard,
      meta: {
        title: '绑定银行卡',
        isRequireAuth: false,
      }
    },// 我的银行卡

    // 绑定银行卡
    {
      path: "/bindbankcardSave",
      name: "bindbankcardSave",
      component: BindBankCardSave,
      meta: {
        title: '绑定银行卡确认',
        isRequireAuth: false,
      }
    },// 我的银行卡
    {
      path: "/mybankcard",
      name: "mybankcard",
      component: MyBankcard,
      meta: {
        title: '我的银行卡',
        isRequireAuth: false,
      }
    },{
      path: "/alipay",
      name: "alipay",
      component: Alipay,
      meta: {
        title: '绑定支付宝',
        isRequireAuth: false,
      }
    },// 我的支付宝
    {
      path: "/myAlipay",
      name: "myAlipay",
      component: MyAlipay,
      meta: {
        title: '我的支付宝',
        isRequireAuth: false,
      }
    },
    // 更换预留手机号
    {
      path: "/bankmobile",
      name: "bankmobile",
      component: BankMobile,
      meta: {
        title: '更换预留手机号',
        isRequireAuth: false,
      }
    },
    //身份认证
    {
      path: "/setting",
      name: "setting",
      component: Setting,
    },
    //结果详情
    {
      path: "/mine/result",
      name: "result",
      component: Result,
    },
    //更换手机号码
    {
      path: "/mine/changePhone",
      name: "changePhone",
      component: ChangePhone,
    },
    //更换密码
    {
      path: "/mine/changePsw",
      name: "changePsw",
      component: ChangePsw,
    },
    // 人脸验证重置密码
    {
      path: "/mine/facePsw",
      name: "facepsw",
      component: FacePassword,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/faceauth",
      name: "faceauth",
      component: FaceAuth,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/autherror",
      name: "autherror",
      component: AuthError,
      meta: {
        isRequireAuth: false,
      }
    },
    //  打卡时人脸核身的回调地址
    {
      path: "/checkauth",
      name: "checkauth",
      component: CheckAuth,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/authresult",
      name: "authresult",
      component: AuthResult,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/scanback",
      name: "scanback",
      component: ScanBack,
      meta: {
        isRequireAuth: false,
      }
    },

    //任务详情
    {
      path: "/task/detail/",
      name: "taskDetail",
      component: TaskDetail,
      meta: {
        isRequireAuth: false,
      }
    },
    //任务详情
    {
      path: "/robtask/detail/",
      name: "robDetail",
      component: TaskDetail,
      meta: {
        isRequireAuth: false,
      }
    },
    //身份认证
    {
      path: "/map",
      name: "map",
      component: MapView,
    },
    //客户确认表
    {
      path: "/customerReport",
      name: "customerReport",
      component: CustomerReport,
    },
    //空白签到表
    {
      path: "/emptyReport",
      name: "emptyReport",
      component: EmptyReport,
    },
    //排班日历
    {
      path: "/calendar",
      name: "calendar",
      component: Calendar,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/checkIn",
      name: "checkIn",
      component: CheckIn,
    },
    {
      path: '/punchresult',
      name: 'punchresult',
      component: PunchResult
    },
    //空挂
    {
      path: "/emptyList",
      name: "emptyList",
      component: emptyList,
    },
    {
      path: "/emptyShow",
      name: "emptyShow",
      component: emptyShow,
    },
    {
      path: "/addEmpty",
      name: "addEmpty",
      component: addEmpty,
    },
    {
      path: "/cusConfirm",
      name: "cusConfirm",
      component: cusConfirm,
    },
    {
      path: "/updateattendence",
      name: "updateattendence",
      component: UpdateAttendence,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/emptyConfirm",
      name: "emptyConfirm",
      component: EmptyConfirm,
    },
    {
      path: "/headman",
      name: "headman",
      component: Headman,
    },
    //添加日结零工
    {
      path: "/dayWorker",
      name: "dayWorker",
      component: DayWorker,
    },
    //上班打卡
    {
      path: "/checkInCard",
      name: "checkInCard",
      component: CheckInCard,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/sginCheckInCard",
      name: "sginCheckInCard",
      component: CheckInCard,
      meta: {
        isRequireAuth: false,
      }
    },
    //绑定微信
    {
      path: "/wechatLogin",
      name: "wechatLogin",
      component: WechatLogin,
      meta: {
        isRequireAuth: false,
      }
    },
    //绑定微信
    {
      path: "/wechatOpt",
      name: "wechatOpt",
      component: WechatOpt,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/viewMap",
      name: "viewMap",
      component: ViewMap,
    },
    {
      path: "/canvas",
      name: "canvas",
      component: Canvas,
    },
    {
      path: "/workerCanvas",
      name: "workerCanvas",
      component: WorkerCanvas,
    },
    {
      path: "/resign",
      name: "resign",
      component: ReSign,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/confirmsign",
      name: "confirmsign",
      component: ConfirmSign,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/workerCard",
      name: "workerCard",
      component: WorkerCard,
    },
    {
      path: "/salaryTab",
      name: "salaryTab",
      component: SalaryTab,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/insuranceList",
      name: "insuranceList",
      component: InsuranceList,
      meta: {
        keepAlive: false
      }
    },
    {
      path: "/checkImg",
      name: "checkImg",
      component: CheckImg,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/SalaryBill",
      name: "SalaryBill",
      component: SalaryBill,
    },
    {
      path: "/SalaryBilled",
      name: "SalaryBilled",
      component: SalaryBill,
    },
    {   
        path: "/collectionRecord",
        name: "collectionRecord",
        component: collectionRecord,
    },
    {
        path: "/insuranceFee",
      name: "insuranceFee",
      component: InsuranceFee,
    },
    {
        path: "/insuranceSystem",
      name: "insuranceSystem",
      component: InsuranceSystem,
    },
    {
      path: "/rNPList",
      name: "rNPList",
      component: RNPList,
    },
    {
      path: "/addRNP",
      name: "addRNP",
      component: AddRNP,
    },
    {
//      path: "/salary/:settlementType/:batchNumber/:talentId/:id",
        path:'/salary',
      name: "salary",
      component: Salary,
    },
    {
      path: "/bankList",
      name: "bankList",
      component: BankList,
      meta: {
        isRequireAuth: false,
      }
    },
    /**客户确认 */
    {
      path: "/toverify",
      name: "toverify",
      component: ToVerify,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/havecancel",
      name: "havecancel",
      component: HaveCancel,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/pagereceipt",
      name: "pagereceipt",
      component: PageReceipt,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/sendcustomer",
      name: "sendcustomer",
      component: SendCustomer,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/shareblank",
      name: "shareblank",
      component: ShareBlank,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/confirmattendence",
      name: "confirmattendence",
      component: ConfirmAttendence,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/codeadd",
      name: "codeadd",
      component: CodeAdd,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/addsuccess",
      name: "addsuccess",
      component: AddSuccess,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/codeshow",
      name: "codeshow",
      component: CodeShow,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/mashow",
      name: "mashow",
      component: MaShow,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/backShow",
      name: "backShow",
      component: BackShow,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/workerlist",
      name: "workerlist",
      component: WorkerList,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/bindingManager",
      name: "bindingManager",
      component: BindingManager,
      meta: {
        isRequireAuth: false,
      }
    },{
      path: "/repeatBind",
      name: "repeatBind",
      component: RepeatBind,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/unBind",
      name: "unBind",
      component: UnBind,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/bind",
      name: "bind",
      component: Bind,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/bindSuccess",
      name: "bindSuccess",
      component: BindSuccess,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/messageIndex",
      name: "messageIndex",
      component: MessageIndex,
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: "/messageDetails",
      name: "messageDetails",
      component: MessageDetails,
      meta: {
        isRequireAuth: false,
      }
    }
  ],
})