<template>
    <div class="home">
        <div>
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>        
        <mt-tabbar v-if="shareType != 1" v-model="selected" fixed value>
            <mt-tab-item id="TaskTab">
                <img slot="icon" src="../../src/assets/img/gd-next.png" class="tab-icon"
                     v-if="selected=='TaskTab'">
                <img slot="icon" src="../../src/assets/img/gd-pre.png" class="tab-icon" v-else>
                工单市场
            </mt-tab-item>
            <mt-tab-item id="WorkSpace">
                <img slot="icon" src="../../src/assets/img/workbench_pre.png" class="tab-icon"
                     v-if="selected=='WorkSpace'">
                <img slot="icon" src="../../src/assets/img/workbench_nor.png" class="tab-icon" v-else>
                工作台
            </mt-tab-item>
            <mt-tab-item id="Mine">
                <img slot="icon" src="../../src/assets/img/mine_pre@3x.png" class="tab-icon" v-if="selected=='Mine'">
                <img slot="icon" src="../../src/assets/img/mine_nor@3x.png" class="tab-icon" v-else>
                个人中心
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>
<script>
    import BaiduMap from '../common/baidu-map'
    import jsonp from 'jsonp'
    import wx from 'weixin-js-sdk';
    let md5 = require("nodejs-md5");
    export default {
        name: 'app',
        data() {
            return {
                BMap: '',
                selected: '1',
                u:'',
                skillGroup:'',
                wechatLocation:{},
                shareType: sessionStorage.getItem('shareType'),
            }
        },
        watch: {
            selected: function (val, oldVal) {
//                console.log(val)
                if (val == 'TaskTab') {
                    this.$router.push('/task')
                }
                if (val == 'WorkSpace') {
                    this.$router.push('/home/workspace')
                }
                if (val == 'Schedule') {
                    this.$router.push('/home/schedule')
                }
                if (val == 'Mine') {
                    this.$router.push('/home/mine')
                }
            }
        },
        created() {
            let _this = this;
            let u = navigator.userAgent;
            md5.string.quiet(u, function (err, md5) {
                if (err) {
                    console.log(err);
                }
                else {
                    _this.u = md5;
//                    console.log(md5); //"bc6e6f16b8a077ef5fbc8d59d0b931b9"
                }
            });
            this.selected = this.$route.name;
            BaiduMap.init().then((BMap) => {
                _this.BMap = BMap
                _this.getWechat()
                // _this.addressDetail()
            })
        },
        methods: {
            getWechat() {
                let _this = this
                let url3 = location.href.split('#')[0];
                let urlDate = {
                    url: url3
                };
                this.$api.shareSDK(urlDate).then(res => {
                    if (res.data.respCode == 0) {
                        let data = res.data.data;
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: data.appId, // 必填，公众号的唯一标识
                            timestamp: data.timestamp, // 必填，生成签名的时间戳
                            nonceStr: data.nonceStr, // 必填，生成签名的随机串
                            signature: data.signature, // 必填，签名，见附录1
                            // jsApiList: ["updateAppMessageShareData", "updateTimelineShareData", "getLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                            jsApiList: ["getLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                        wx.error(function (res) {
//                            console.log(res)
//                            console.log('获取定位失败')
                        });
                        wx.ready(function () {
                            wx.getLocation({
                                success: function (res) {
                                    _this.wechatLocation = res;
                                    let ak = 'HIpuFBetnp1KKYrfcleBipO6x31IeI63'
                                    let coords = `${res.longitude},${res.latitude}`;
                                    jsonp(`http://api.map.baidu.com/geoconv/v1/?coords=${coords}&from=1&to=5&ak=${ak}`, null, (err, data) => {
                                        if (err) {
//                                            console.log('坐标转换失败', err)
                                        } else {
//                                            console.log('坐标转换成功', data.result[0])
                                            _this.wechatLocation = {
                                                longitude: data.result[0].x,
                                                latitude: data.result[0].y
                                            }  
                                            sessionStorage.setItem('position', JSON.stringify(_this.wechatLocation))
                                            let token = sessionStorage.getItem('token');
                                            if(token){
                                                _this.pushDos(_this.wechatLocation);
                                            }

                                           console.log(_this.wechatLocation);
                                           console.log('x轴 --' + data.result[0].x + ', y轴----' + data.result[0].y);
                                        }
                                    })
                                },
                                cancel: function (res) {
//                                    console.log('您拒绝了授权获取地理位置')
                                }
                            });
                        });

                    } else {
//                        console.log('获取定位信息失败')
                    }
                }).catch(err => {
//                    console.log(err)
                }).finally(()=>{
                    if(_this.$route.query.isFirst){
                        _this.selected = 'TaskTab'
                        _this.$router.replace({ path: "/task"});
                    }
                })
            },
            addressDetail() { //获取地理位置
                var self = this;
                //全局的this在方法中不能使用，需要重新定义一下
                var geolocation = new (this.BMap).Geolocation();
                //调用百度地图api 中的获取当前位置接口
                geolocation.getCurrentPosition(function (r) {
                    console.log(r)
                    console.log(r.point,'百度原始坐标')
                    if(r.point.lng){
                        //获取当前位置经纬度
                        var myGeo = new (self.BMap).Geocoder();
                        myGeo.getLocation(new (self.BMap).Point(r.point.lng, r.point.lat), function (result) {
                            console.log(result,'编译后的坐标')
                            if (result) {
                                //根据当前位置经纬度解析成地址
                                let position = {latitude: result.point.lat, longitude: result.point.lng}

                            }
                        });
                    }
                });
            },
            async pushDos(pos){ //登录后上传地理位置
                let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
                let {data} = await this.$api.getUserInfo();
                console.log(data)
                console.log(userInfo)
                let skillGroup = '';
                if(data.respCode === 0){
                    if(data.data.talentSkills){
                        let result = Array.from(data.data.talentSkills);
                        result = result.map((i)=> i.skillName);
                        skillGroup = result.join(',')
                    }
                }
                console.log(data)
                console.log(skillGroup)
                let pramas = {
                    talentId:userInfo.talentId,//零工id",
                    talentName:data.data.realNameAlias || '',//零工姓名",
                    avatar:userInfo.avatar || '',//零工头像",
                    mobile:data.data.mobile || '',//零工手机号码",
                    idCard:data.data.idCard || '',//零工身份证",
                    longitude:pos.longitude, //经度,
                    latitude:pos.latitude, //纬度
                    skillGroup:skillGroup,
                };
                this.$api.geoAdd(pramas).then(res=>{
//                    console.log(res)
                }).catch(err=>{
                    console.log(err)
                })
            },
            getDistance() {
                const position = JSON.parse(sessionStorage.getItem('position'))
                var map = new (this.BMap).Map('')
                const targetPoint = {
                    log: 120.216357,
                    lat: 30.252617,
                }
                const myPoint = {
                    log: position.longitude,
                    lat: position.latitude,
                }
//                console.log('sssssss')
                let pointA = new this.BMap.Point(parseFloat(targetPoint.log), parseFloat(targetPoint.lat))
                var pointB = new this.BMap.Point(parseFloat(myPoint.log), parseFloat(myPoint.lat))  // 店铺的经纬度
                var distance = (map.getDistance(pointA, pointB) / 1000).toFixed(2) // 保留小数点后两位
//                console.log(distance + 'km')
            },
        }
    }
</script>
<style lang="scss">
    .home {
/*
        .mint-tabbar {
            position: inherit;
            z-index: 99;
        }
*/
    }
    .mint-header.is-fixed {
        top: 0;
        right: 0;
        left: 0;
        position: fixed;
        z-index: 99;
    }
    .mint-header {
        height: 2.2rem;
    }
    .tab-icon {
        width: 1.1rem;
        height: 1.1rem;
    }
    .mint-header-title {
        font-size: 0.9rem;
    }
    body {
        background-color: white;
    }
    .mint-tab-item-icon {
        width: 0.85rem;
        height: 0.85rem;
        margin: 0 auto 0.38rem;
    }
    .routerview {
        margin-top: 45px;
    }
    .router-fade-enter-active,
    .router-fade-leave-active {
        transition: opacity 0.3s;
    }
    .router-fade-enter,
    .router-fade-leave-active {
        opacity: 0;
    }
    .mint-tab-item-icon {
        width: 0.85rem;
        height: 0.85rem;
    }
    .mint-tab-item-label {
        font-size: 0.65rem;
    }
</style>