import axios from 'axios';
import router from '../router';
import Store from '@/store.js'
import {
    Toast,
    MessageBox
} from 'mint-ui';
let Base64 = require('js-base64').Base64;
require('es6-promise').polyfill();
let notify;
let message;
let CancelToken = axios.CancelToken;
let timer = null;
let isBug = false; //是否本地开发模式
let baseURL = 'http://test.api.10000rc.com'; //放在这里是方便微信绑定调后台的接口
if (process.env.NODE_ENV == 'production') {
    if (process.env.VUE_APP_TITLE == 'pre') {
        baseURL = 'http://pre.api.10000rc.com/pre';
    } else if (process.env.VUE_APP_TITLE == 'test') {
        baseURL = 'http://test.api.10000rc.com';
    } else {
        baseURL = 'http://www.10000rc.com/2.0';
    }
}
const axiosInstance = axios.create({
    // baseURL: 'http://10000rc.com:9093/bos',
    // baseURL: 'http://test.api.10000rc.com',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 30000,
});

axios.interceptors.request.use(config => {
    // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的 相同字段的请求
    // 如果没有 requestName 就默认添加一个 不同的时间戳
    let requestName
    if (config.method === 'post') {
        if (config.data && config.data.requestName) {
            requestName = config.data.requestName
        } else {
            requestName = new Date().getTime()
        }

    } else {
        if (config.params && config.params.requestName) {
            requestName = config.params.requestName
        } else {
            requestName = new Date().getTime()
        }
    }
    // 判断，如果这里拿到的参数中的 requestName 在上一次请求中已经存在，就取消上一次的请求
    if (requestName) {
        if (axios[requestName] && axios[requestName].cancel) {
            axios[requestName].cancel()
        }
        config.cancelToken = new CancelToken(c => {
            axios[requestName] = {}
            axios[requestName].cancel = c
        })
    }
    return config
}, error => {
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use(
    response => {
        switch (response.data.respCode) {
            case -1:
                if (response.data.errorCode == 80100) {

                } else if (response.data.errorCode == 80101) {

                } else if (response.data.errorCode == 80102) {

                } else if (response.data.errorCode == 80103) {
                    message = Toast(`微信登录失败，当前微信未绑定万才网账号！`)
                    sessionStorage.setItem('openid', response.data)
                    localStorage.setItem('openid', response.data)
                    sessionStorage.removeItem('token')
                    localStorage.removeItem('token')
                    router.replace({
                        path: '/register',
                    })
                } else if (response.data.errorCode == 80104) {

                } else if (response.data.errorCode == 80105) {

                } else if (response.data.errorCode == 90007) {

                } else if (response.data.errorCode == 90004) {

                } else if (response.data.errorCode == 90005) {

                } else if (response.data.errorCode == 90006) {

                } else if (response.data.errorCode == 90008) {

                } else if (response.data.errorCode == 90009) {

                } else if (response.data.errorCode == 90010) {

                } else if (response.data.errorCode == 900072) {

                } else if (response.data.errorCode == 900073) {

                } else if (response.data.errorCode == 150007) {

                }else if(response.data.errorCode == 80064){

                } else if (response.data.errorCode == 90055) {
                    let message = JSON.parse(response.data.errorMsg)

                    MessageBox({
                        title: `${message.talentName}本次考勤存在时间段冲突`,
                        message: `<div style="text-align:left;">冲突排班：${message.schedulingName}<br/>
            考勤工种：${message.industryName}<br/>
            上班打卡：${message.punchStartTime}<br/>
            下班打卡：${message.punchendTime}</div>`,
                        confirmButtonText: "确认",
                    })
                } else if (response.data.errorCode == 20034) {
                    let url = location.href.split('=')
                    let type = url[1].split('&')[0];
                    if( type == 16 ){
                        MessageBox({
                            title: `提示`,
                            message: `您还未进行实名认证，需实名认证后才能继续操作`,
                            confirmButtonText: "实名认证",
                        }).then(action => {
                            localStorage.setItem('authBackUrl','');
                            router.push({path: '/bindingManager', query: {type: true}})
                        })
                    }else{
                        MessageBox({
                            title: `提示`,
                            message: `您还未进行实名认证，需实名认证后才能继续操作`,
                            showCancelButton: true,
                            confirmButtonText: "实名认证",
                            cancelButtonText: "关闭"
                        }).then(action => {
                            if (action == 'confirm') {
                                localStorage.setItem('authBackUrl', JSON.stringify(location.hash));
                                router.push({path: '/bindingManager', query: {type: true}})
                            } else {

                            }
                        })
                    }
                } else {
                    message = Toast(response.data.errorMsg)
                    console.log(response.data.errorMsg)
                }

                break;
            case -2:
                if (response.data.errorCode == 20004) {
                    MessageBox({
                        title: `提示`,
                        message: `你还未进行登录,需登录后才能继续操作`,
                        showCancelButton: true,
                        confirmButtonText: "登录",
                        cancelButtonText: "关闭"
                    }).then(action => {
                        if (action == 'confirm') {
                            router.replace({path: '/'})
                        } else {

                        }
                    })
                } else if (response.data.errorCode == 80103) {
                    message = Toast(`微信登录失败，当前微信未绑定万才网账号！`)
                    sessionStorage.setItem('openid', response.data.errorMsg)
                    localStorage.setItem('openid', response.data.errorMsg)
                    router.replace({
                        path: '/',
                    })
                } else {
                    message = Toast(response.data.errorMsg)
                    console.log(response.data.errorMsg)
                    router.replace({
                        path: '/',
                    })
                }
                sessionStorage.removeItem('token')
                localStorage.removeItem('token')
                break;
        }
//        console.log(response)
        if (response.headers.status == 1) {
            sessionStorage.setItem("token", response.headers.authorization);
            localStorage.setItem('token', response.headers.authorization)
        }
        return response;
    },
    error => {
//        console.log(error)
//        console.log(error.response, 'ajax')
        if (error.response.status == 401) {
            message = Toast(error.response.data.errorMsg)
            console.log(error.response.data.errorMsg)
        }
        // console.log(error.response.data.errorMsg, 'ajax')
        // message = Message.error(error.response.data.errorMsg)
        // message = Message.error(error.response.data.message)
        // alert("服务器错误！请联系管理员")

        // message = Message.error("服务器错误！请联系管理员")
        // if (error.toString() === 'Error: Network Error') {
        //   console.log(111)
        // }
        // if (error.toString() === 'Error: Network Error') {
        //   // message = Message.error("服务器错误！请联系管理员")
        // }
        return Promise.reject(error);
    }
);


export default axiosInstance;


export function get(url, params) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token')
    return new Promise((resolve, reject) => {
        axiosInstance.get(url, {
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err)
        })
    });
}

export function deletes(url, params) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token')
    return new Promise((resolve, reject) => {
        axiosInstance.delete(url, {
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err)
        })
    });

}

// router.afterEach((to,from,next) => {
//   window.scrollTo(0,0);
// });

router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem('token');

    if (to.name == 'taskDetail' || to.name == 'TaskTab' || to.name == 'robDetail') {
        let query = decodeURIComponent(location.hash.split('?')[1]);
        let arr = query.split('&');
        let _list = [];
        for (let item of arr) {
            _list.push(item.split('='))
        }
//        console.log(_list)
        if (_list[0][0] == 'shareType') {
            sessionStorage.setItem("shareType", _list[0][1]);//不分享默认2
            sessionStorage.setItem("talentName", JSON.stringify(_list[1][1]));//分享零工姓名
            if (_list.length > 2) {
                sessionStorage.setItem("taskId", JSON.stringify(_list[2][1]));//分享零工详情
            }
            next();
        } else {
            next()
        }
    }
    if (to.name == 'checkInCard') {
        sessionStorage.removeItem('uploadimg')
        sessionStorage.removeItem('cardDetail')
        sessionStorage.removeItem('countNum')
        if (!from.name) {
            sessionStorage.removeItem('headMan')
            sessionStorage.removeItem('token')
            let url = location.href.split('=')
            let code = url[1].split('&')[0]
            let state = url[2].split('#')[0]
            // console.log(url)
            // console.log(state)
            let data = {
                code: code,
                state: state
            }
            console.log(data)
            sessionStorage.setItem('code', JSON.stringify(data))
            next();
        } else {
            sessionStorage.removeItem('code')
            next()
        }
    }
    if (to.name == 'wechatOpt') {
        if (!from.name) {
            console.log(location.href)
            let url = location.href.split('=')
            let type = url[1].split('&')[0]
            let code = url[2].split('&')[0]
            let state = (url[3].split('&')[0]).split('#')[0];
            let l = decodeURIComponent(state);
            let data = {
                code: code,
                state: '',
                type: type,
            }
            if (type == '16') {
                state = Base64.decode(l);
                data.state = JSON.parse(state)
            }else if(type == '17'){
                let str = state.replace(/%3D/g,'=')
                state = Base64.decode(str);
                data.state = JSON.parse(state)
            } else {
                data.state = state
            }
            console.log(state)
            sessionStorage.setItem('wechatLogin', JSON.stringify(data))
            // localStorage.setItem('wechatLogin', JSON.stringify(data))
            next();
        } else {
            sessionStorage.removeItem('wechatLogin')
            next()
        }
    }
    if (!to.meta.isRequireAuth) {
        if (token) {
            //以下是微信绑定
        }
        next()
    } else {
        if (token) {
            //以下是微信绑定
            if (!isBug) {
                bindWeixin();
            }
            next();
        } else {
            MessageBox({
                title: `提示`,
                message: `你还未进行登录,需登录后才能继续操作`,
                showCancelButton: true,
                confirmButtonText: "登录",
                cancelButtonText: "关闭"
            }).then(action => {
                if (action == 'confirm') {
                    if (to.path === '/') { //这就是跳出循环的关键
                        next()
                    } else {
                        next('/')
                    }
                } else {

                }
            })

        }
    }
})
router.afterEach((to, from) => {
    // ...
    if (timer) {
        clearTimeout(timer);
    }
})
axiosInstance.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token')
        if (token && config.url != 'http://upload.qiniu.com/putb64/-1/') { // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

function bindCardStatus (to){   
    let haveInCome = localStorage.getItem( 'haveInCome' );
    let haveInComeTimeStamp = localStorage.getItem( 'haveInComeTimeStamp' ); 
    let haveInComeBankCardBindingStatus = localStorage.getItem( 'haveInComeBankCardBindingStatus');
    let userId = localStorage.getItem('haveInComeTimeMatch');
    let currentUser = '';
    if( sessionStorage.getItem("userInfo") ){
        currentUser = JSON.parse(sessionStorage.getItem("userInfo")).userId;
    }
    let flag1 = true;
    let flag2 = false;   
    let flag3 = false;   
    if( currentUser == userId ){
        if( haveInComeTimeStamp ){
            let numFormat = Number(haveInComeTimeStamp);
            let now = Date.now();
            if( (numFormat - now) > 0 ){
                flag1 = false;
            }else{
                flag1 = true;
            }
        }
    }
    if( haveInCome ){
        if( Number(haveInCome) === 1){
            flag2 = true;
        }else{
            flag2 = false;
        }
    }else{
        flag2 = true;
    }
    if( haveInComeBankCardBindingStatus ){
        if( JSON.parse(haveInComeBankCardBindingStatus) ){
            flag3 = false;
        }else{
            flag3 = true;  
        }
    }  
    console.log( flag1,flag2,flag3 );
    // let routerWhiteLists = [
    // ];
    // let comeFlag = localStorage.getItem('comeFrom');
    // if( comeFlag ){
    //     if( comeFlag == 1 ){
    //         routerWhiteLists = [
    //             'TaskTab',
    //         ];
    //     }else{
    //         routerWhiteLists = ['Mine'];
    //     }
    // }else{
    //     routerWhiteLists = ['Mine'];
    // }
    let judge = routerWhiteLists.includes(to.name);
    let tempShutDialog = sessionStorage.getItem( 'tempShutDialog' );

    if( judge ){
            if( (flag2) && (flag1) && (flag3) &&(!tempShutDialog) ){
                localStorage.setItem('haveInComeFlag',JSON.stringify(true) );
                Store.commit('changeHaveInComeFlag',true);
            }else{
                localStorage.setItem('haveInComeFlag',JSON.stringify(false) );
                Store.commit('changeHaveInComeFlag',false);
            }
    }else{
        Store.commit('changeHaveInComeFlag',false);
        localStorage.setItem('haveInComeFlag',JSON.stringify(false));
    }
};

function bindWeixin() {
    let id = JSON.parse(sessionStorage.getItem("userInfo")).userId;
    let href = `${baseURL}/public/wechat/operateRedirect?type=2&scope=snsapi_userinfo&state=${id}`;
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    let wechaterror = sessionStorage.getItem('wechaterror')  // 微信绑定没有出错才跳转到微信绑定，否则会进入死循环
    if (userInfo.isBindingWeChat == false) {
        sessionStorage.setItem('lastBindStatus', false)
    }
    let lastBindStatus = sessionStorage.getItem('lastBindStatus')
    if (lastBindStatus == "false" && userInfo.isBindingWeChat) {
        MessageBox({
            title: '已将您的微信与当前登录账号进行绑定，绑定后无需登录即可访问',
            message: '后续您可在个人中心-账号设置页面，进行微信的解绑和绑定操作',
            confirmButtonText: '确认'
        }).then(action => {
            sessionStorage.setItem('lastBindStatus', true)
        })
    }
    if (userInfo.isBindingWeChat == false && !wechaterror) {
        timer = setTimeout(() => {
            clearTimeout(timer)
            window.location.href = href;
        }, 1)
    }
    //微信绑定结束
}