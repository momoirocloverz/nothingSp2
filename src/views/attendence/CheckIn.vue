<template>
  <div style="width:100%;overflow:hidden;height:100%;padding-bottom:6rem;background:#f5f5f5">
    <img src="../../assets/img/left_a.png" alt="返回" class="leftArrow" @click="goBack">
    <mt-header :title="title" fixed class="mint-header-title"></mt-header>
    <div style="background: #f5f5f5;width:100%;height:100%;">
      <div class="content">
        <div v-if="count == 1">
          <mt-cell title="打卡工种" class="black f5">
            <span class="fs" @click="test">{{$route.query.industryName}}</span>
          </mt-cell>
          <mt-cell title="考勤时间" class="black f5">
            {{cTime}}
          </mt-cell>
          <mt-popup v-model="nationVisible" position="bottom" class="mint-popup">
            <mt-picker :slots="nationList" :visible-item-count="5" :show-toolbar="true" ref="natitonPicker" value-key="className">
              <div @click="handleConfirm" class="sure">确认</div>
            </mt-picker>
          </mt-popup>
          <div class="codeBox">
            <div id="qrcode" ref="qrcode" @click="test"></div>
            <div class="cover">
              <div>{{(cTime|| '').split(' ')[0]}}</div>
              <div>{{(cTime|| '').split(' ')[1]}}</div>
            </div>
          </div>
          <div class="please">请让零工使用微信扫码</div>
          <div class="avatarBox flexable">
            <div class="subDiv flexable" v-for="(item,index) in cardData">
              <div class="avatarDiv">
                <img :src="item.avatar" alt="头像" class="avatar">
              </div>
              <span class="name">{{item.realNameAlias}}</span>
            </div>
          </div>

          <div v-if="$route.query.type == 2"></div>
          <div class="doneBox" @click="managerGo" v-show="false">
            班组长打卡
          </div>
        </div>

        <div v-show="count == 2" class="warnBox">
          <div>
            <img src="../../assets/img/prompt@3x.png" alt="警告" class="warning">
            <span class="warnText">{{text}}</span>
          </div>
        </div>
        <div v-show="count == 3">
          <div class="container" style="height: 100%;width:100%">
            <baidu-map class="mapdiv" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler">
            </baidu-map>
          </div>
        </div>
      </div>

      <div class="bg" v-show="isShow1" @click="closeModal"></div>
      <div class="modal flexable" v-show="isShow1">
        <div class="white11 ">
          <mt-cell title="打卡人" class="black">
            <span class="fs">{{edit.name}}</span>
          </mt-cell>
          <mt-cell title="打卡岗位" class="black">
            <span class="fs">{{$route.query.industryName}}</span>
          </mt-cell>
          <mt-cell title="计件量" class="black" v-if="jian">
            <input type="number" class="inputRadius countInput" v-model="edit.jian" @blur="checkNum1" oninput="if(value.length>5)value=value.slice(0,5)">
            <span class="fs">件</span>
          </mt-cell>
          <mt-cell title="计件量" class="black" v-if="dai">
            <input type="number" class="inputRadius countInput" v-model="edit.dai" @blur="checkNum2" oninput="if(value.length>4)value=value.slice(0,4)">
            <span class="fs">袋</span>
          </mt-cell>
          <mt-cell title="计件量" class="black" v-if="che">
            <input type="number" class="inputRadius countInput" v-model="edit.che" @blur="checkNum3" oninput="if(value.length>3)value=value.slice(0,3)">
            <span class="fs">车</span>
          </mt-cell>
          <mt-cell title="计件量" class="black" v-if="dun">
            <input type="number" class="inputRadius countInput" v-model="edit.dun" @blur="checkNum4" oninput="if(value.length>7)value=value.slice(0,7)">
            <span class="fs">吨</span>
          </mt-cell>
          <div class="flexable btnDiv">
            <mt-button type="primary" class="comfirmBtn" @click="editItem">确定</mt-button>
            <mt-button class="comfirmBtn1" @click="isShow1 = false">取消</mt-button>
          </div>
        </div>
      </div>
      <div class="countBox flexable" v-if="$route.query.type == 2" @click="pop = true" style="display:none;">
        <img src="../../assets/img/count.png" alt="计件量" class="countImg">
        <div class="red">
          <span class="countNumber">{{pieceCount}}</span>
        </div>
    </div>
      <div class="popUp" v-if="pop">
        <div style="width:1rem;height:1rem;text-align:center;position:absolute;right:.8rem;top:.35rem">
          <img src="../../assets/img/close.png" alt="关闭" class="close" @click="pop = false">
        </div>
        <div style="width:90%;margin:1.5rem auto 0">
          <div class="textR" v-if="pieceCount == 0">暂无待审核记录</div>
          <div v-for="(item,index) in cardData" v-if="item.pieceSize">
            <div class="workerBox flexable">
              <div class="worker">{{item.realNameAlias}}</div>
              <div class="count">{{item.pieceSize | formatPieceSize1}}</div>
            </div>
            <div class="btnbOX flexable">
              <div class="agreeText" @click="checkWorkerCount(2,item.punchId)">同意</div>
              <div class="repulseText" @click="editShow(item)">修改</div>
            </div>
            <div class=" bottom" v-if="pieceCount != 0"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Util from '../../common/util.js'
  import timeSpanEight from '../../common/timeSpanEight.js'
  import BaiduMap from '../../common/baidu-map.js'
  import QRCode from 'qrcodejs2'
  import jsonp from 'jsonp'
  import wx from 'weixin-js-sdk'
  export default {
    name: 'CheckIn',
    components: { QRCode },
    data() {
      return {
        BMap: '',
        distanceRange: '',
        content: '',
        nationVisible: false,
        nationList: [
          {
            flex: 1,
            values: [
            ],
            className: "slot4",
            textAlign: "center"
          },
          {
            flex: 1,
            values: [
            ],
            className: "slot1",
            textAlign: "center"
          },
          {
            divider: true,
            content: '：',
            className: 'slot2'
          },
          {
            flex: 1,
            values: [
              '00',
              '30'
            ],
            className: "slot3",
            textAlign: "center"
          }
        ],
        count: 1,
        text: '网络异常',
        disable: true,
        card: '下班打卡',
        out: true,
        data: {},
        websocket: null,
        connected: false,
        qrcode: null,
        timer: null,
        time: '',
        cardData: [],
        errorMsg: '',
        timestamp: '',
        title: this.$route.query.type == 1 ? '上班打卡' : '下班打卡',
        BMap: '',
        cTime: '',
        isShow1: false,
        edit: {
          name: '',
          industry: '',
          jian: '',
          dai: '',
          che: '',
          dun: '',
        },
        jian: false,
        dai: false,
        che: false,
        dun: false,
        editId: '',
        pop: false,
        isDun: true,
        ische: true,
        isdai: true,
        isJian: true,
        pieceCount: 0,
        select: {},
        map: null,
        zoom: 0,
        wechatLocation: {},
        sechdulePosition: {},
        distance: '',
        seconds: 10000
      }
    },

    mounted() {
      this.getSeconds()
      this.time = (this.$route.query.time).substring(0, 5)
      for (let i = 0; i <= 23; i++) {
        let data = i < 10 ? `0${i}` : i.toString()
        this.nationList[1].values.push(data)
      }
      if (this.$route.query.type == 1) {
        this.nationList[0].values = ['当日']
      } else {
        this.nationList[0].values = ['当日', '次日']
      }

      console.log('当前页面打开类型', this.$route.query.type)
      console.log('当前页面范围', this.$route.query.range)
      this.distanceRange = this.$route.query.range;
      let date = this.$route.query.schedulingDate
      let time = this.$route.query.time
      time = time.padEnd(8, ':00')
      this.cTime = `${date} ${time}`
      console.log('当前页面打卡日期', this.cTime)
    },
    beforeDestroy() {
      clearInterval(this.timer)
      this.closeWebSocket()
      this.$indicator.close();
    },
    watch: {
      time: function (val, old) {
        if (val) {
          document.getElementById('qrcode').innerHTML = ''
        }
      },
      cardData: {
        handler(val, oldVal) {
          for (let i in val) {
            if (val[i].pieceSize) {
              this.pieceCount++
            }
          }
        },
        deep: true
      },
    },
    filters: {
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
    },
    methods: {
      qrcodeMake() {
        let qrcode = new QRCode('qrcode', {
          width: 180,
          height: 180, // 高度
          text: this.content, // 二维码内容
        })
      },
      test() {
        this.content = 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1325171098,1822663964&fm=26&gp=0.jpg'
        this.$nextTick(function () {
          this.qrcode();
        })
      },
      onNationChange(val, time) {
        console.log(time);
      },
      getDistanceRange() {
        BaiduMap.init()
                .then((BMap) => {
                  this.BMap = BMap
                  console.log('当前微信定位', this.wechatLocation)
                  this.getDistance()
                  this.select = { lat: this.wechatLocation.latitude, lng: this.wechatLocation.longitude }
                  this.getPositon()
                })
      },
      preCheck() {
        const params = {
          schedulingId: this.$route.query.id
        };
        this.$api
                .schedulePreCheck(params)
                .then(response => {
                  if (response.data.respCode == 0) {
                    this.count = 1
                    this.connectWebSocket()
                  } else {
                    this.$indicator.close();
                    this.count = 2
                    this.text = response.data.errorMsg
                  }
                })
                .catch(error => {
                  console.log(error);
                });
      },
      connectWebSocket() {
        console.log("开始...");
        let _this = this
        //建立webSocket连接
        this.websocket = new WebSocket(`ws://${this.$baseURLWS}/biz/attendance/websocket?schedulingId=${this.$route.query.id}`);
        // this.websocket = new WebSocket(`ws://120.55.56.188/2.0/biz/attendance/websocket?schedulingId=${this.$route.query.id}`);
        // this.websocket = new WebSocket(`ws://192.168.8.14/2.0/biz/attendance/websocket?schedulingId=${this.$route.query.id}`);

        //打开webSokcet连接时，回调该函数
        this.websocket.onopen = function () {
          console.log('socket连接已建立', _this)
          _this.$indicator.close();
          _this.send()
          _this.setTimerCount()
          console.log("onpen");
        }
        //关闭webSocket连接时，回调该函数
        this.websocket.onclose = function () {
          //关闭连接
          clearInterval(this.timer)
          console.log("onclose");
        }

        //接收信息
        this.websocket.onmessage = function (msg) {
          var data = JSON.parse(msg.data)
          if (data.type == 2) {
            // console.log(data.message)
            if (_this.time) {
              document.getElementById('qrcode').innerHTML = ''
              _this.content = data.message
              _this.timestamp = data.state
              _this.qrcodeMake()

            }
          }
          if (data.type == 1) {
            _this.getWorkerList()
            _this.$toast({ message: data.message + "已打卡", position: 'bottom', duration: 1000 })
          }
          if (data.type == 3) {
            _this.count = 2
            _this.errorMsg = '当前排班已结束，无法打卡'
          }
          console.log(msg.data);
        }
      },
      //发送消息
      send() {
        if (this.$route.query.type == 1) {
          let postValue = {
            schedulingId: this.$route.query.id,
            industry: this.$route.query.industry,
            industryName: this.$route.query.industryName,
            state: this.timestamp,
            type: this.$route.query.type,
            //time: `${Util.checkTime1(this.$route.query.type)}:00`,
            time: (this.cTime).split(' ')[1].padEnd(8, ':00'),
            date: (this.cTime).substring(0, 10),
          }
          this.websocket.send(JSON.stringify(postValue));
          console.log(postValue)
        } else {
          let postValue = {
            schedulingId: this.$route.query.id,
            industry: this.$route.query.industry,
            industryName: this.$route.query.industryName,
            state: this.timestamp,
            type: this.$route.query.type,
            // time: `${Util.checkTime1(this.$route.query.type)}:00`,
            time: (this.cTime).split(' ')[1].padEnd(8, ':00'),
            endWorkType: this.$refs.natitonPicker.getValues()[0] == '次日' ? 2 : 1,
            date: (this.cTime).substring(0, 10),
          }
          this.websocket.send(JSON.stringify(postValue));
          console.log(postValue)
        }

        // this.content = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcf82954c54848f1d&redirect_uri=${encodeURI('http://test.api.10000rc.com/wechat/index.html#/checkInCard')}&response_type=code&scope=snsapi_base&state=${time}#wechat_redirect`
        // document.getElementById('qrcode').innerHTML = ''
        // this.$nextTick (function () {
        //     this.qrcodeMake()
        //     this.$indicator.close();
        // })
      },
      //关闭连接
      closeWebSocket() {
        if (this.websocket != null) {
          this.websocket.close();
          clearInterval(this.timer)
        }
      },
      setTimerCount: function () {
        this.timer = setInterval(() => {
          this.send()
        }, this.seconds)
      },
      getWorkerList() {
        let params = {
          schedulingId: this.$route.query.id,
          industry: this.$route.query.industry,
          punchType: this.$route.query.type,
        }
        this.$api
                .scheduleWorkerList(params)
                .then(response => {
                  if (response.data.respCode == 0) {
                    this.cardData = response.data.data
                    console.log(this.cardData)
                  }
                })
                .catch(error => {
                  console.log(error);
                });
      },
      handleConfirm() {
        this.time = `${this.$refs.natitonPicker.getValues()[0]}${this.$refs.natitonPicker.getValues()[1]}:${this.$refs.natitonPicker.getValues()[2]}`
        console.log(this.$refs.natitonPicker.getValues()[0])
        console.log(this.$refs.natitonPicker.getValues()[1])
        this.nationVisible = false
        this.connected = true
      },
      checkWorkerCount(pieceState, attendanceId) {
        this.$messagebox({
          title: `提示`,
          message: '确认该操作？',
          showCancelButton: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        }).then(action => {
          if (action == 'confirm') {     //确认的回调
            const params = {
              pieceState: pieceState,
              punchId: attendanceId,
            };
            this.$api
                    .CheckCount(params)
                    .then(response => {
                      if (response.data.respCode == 0) {
                        this.getWorkerList()
                        this.$toast('操作成功!')
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
          }
        }).catch(err => {
          if (err == 'cancel') {     //取消的回调
            console.log(2);
          }

        })
      },
      // 班组长自主打卡
      managerGo() {
        if (this.timestamp) {
          let type = this.$route.query.type
          let time = this.$route.query.time
          let date = this.$route.query.schedulingDate
          if (type == 1 && timeSpanEight(date, time)) {
            return this.$messagebox({
              title: `提示`,
              message: `已超出上班时间12小时，不可打卡`,
            })
          }

          this.$router.push({ name: 'checkInCard', query: { state: this.timestamp, type: this.$route.query.type } })
        } else {
          this.$toast('请先选择考勤时间获取二维码')
        }
      },
      addressDetail() { //获取地理位置
        var self = this;
        console.log(this.BMap)
        if (!this.BMap) {
          this.count = 2
          this.text = '初始化地图失败'
        }
        //全局的this在方法中不能使用，需要重新定义一下
        var geolocation = new (this.BMap).Geolocation();
        //调用百度地图api 中的获取当前位置接口
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            //获取当前位置经纬度
            var myGeo = new (self.BMap).Geocoder();
            myGeo.getLocation(new (self.BMap).Point(r.point.lng, r.point.lat), function (result) {
              if (result) {
                //根据当前位置经纬度解析成地址
                console.log(result)
                let position = { latitude: result.point.lat, longitude: result.point.lng }
                sessionStorage.setItem('position', JSON.stringify(position))
                self.getDistance()
                self.select = { lat: result.point.lat, lng: result.point.lng }
                self.getPositon()
              }
            });
          }
        });
      },
      getDistance() {
        const position = this.wechatLocation
        const sechdulePosition = JSON.parse(sessionStorage.getItem('sechdulePosition'))
        const targetPoint = {
          log: sechdulePosition.longitude,
          lat: sechdulePosition.latitude,
        }
        const myPoint = {
          log: position.longitude,
          lat: position.latitude,
        }
        let pointA = new this.BMap.Point(parseFloat(targetPoint.log), parseFloat(targetPoint.lat))
        var pointB = new this.BMap.Point(parseFloat(myPoint.log), parseFloat(myPoint.lat))  // 店铺的经纬度

        var distance = this.map.getDistance(pointA, pointB)
        let currentDistance = distance
        console.info('当前实际距离是：', currentDistance)
        console.info('设置的打卡距离是：', this.distanceRange)
        if (currentDistance <= Number(this.distanceRange)) {
          this.$indicator.open({
            spinnerType: 'fading-circle'
          });
          this.preCheck()
          this.getWorkerList()
        }
        else {
          this.count = 3
        }
      },
      closeModal() {
        this.isShow = false;
      },
      checkNum1() {
        if (!this.edit.jian) {
          this.isJian = false
          this.$toast("计件量不能为空");
          return false;
        } else {
          let reg = new RegExp(/^[0-9]+$/)
          if (!reg.test(this.edit.jian)) {
            this.$toast('请输入正确的计件量')
            return false;
          }
          this.isJian = true
        }
      },
      checkNum2() {
        if (!this.edit.dai) {
          this.$toast("计件量不能为空");
          this.isdai = false
          return false;
        } else {
          let reg = new RegExp(/^[0-9]+$/)
          if (!reg.test(this.edit.dai)) {
            this.$toast('请输入正确的计件量')
            return false;
          }
          this.isdai = true
        }
      },
      checkNum3() {
        if (!this.edit.che) {
          this.$toast("计件量不能为空");
          this.ische = false
          return false;
        } else {
          let reg = new RegExp(/^[0-9]+$/)
          if (!reg.test(this.edit.che)) {
            this.$toast('请输入正确的计件量')
            return false;
          }
          this.ische = true
        }
      },
      checkNum4() {
        if (!this.edit.dun) {
          this.$toast("计件量不能为空");
          this.isDun = false
          return false;
        } else {
          // this.edit.dun =  this.edit.dun.toString().replace(/^(([1-9]\d{1,2})(\.\d{1,2})?|0\.[1-9]{1,2})$/);
          this.edit.dun = this.edit.dun.toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
          this.edit.dun = this.edit.dun.toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
          this.edit.dun = this.edit.dun.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
          // this.edit.dun = this.edit.dun.toString().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
          this.edit.dun = String(this.edit.dun).replace(/^(.*\..{4}).*$/, "$1");
          this.isDun = true
        }
      },
      editShow(card) {
        this.edit.name = card.realNameAlias
        this.editId = card.punchId
        this.formatPrice(card.salary, card.sex, card.settlementType)
        this.isShow1 = true
        console.log(this.jian)
        console.log(this.dai)
        console.log(this.che)
        console.log(this.dun)
      },
      formatPrice(salary, sex, settlementType) {
        let price = JSON.parse(salary)
        console.log(price)
        let type = settlementType == 4 ? 1 : settlementType
        this.jian = false
        this.dai = false
        this.che = false
        this.dun = false
        for (let i in price) {
          if (price[i].settlementType == type) {
            console.log(price[i].valuationType)
            if (price[i].valuationType == 2 || price[i].valuationType == 3 || price[i].valuationType == 5 || price[i].valuationType == 6) {
              let unit = price[i].unit
              if (unit == 1) {
                this.jian = true
              } else if (unit == 2) {
                this.dai = true
              } else if (unit == 3) {
                this.che = true
              } else if (unit == 4) {
                this.dun = true

              }
            } else if (price[i].valuationType == 4 || price[i].valuationType == 7) {

              for (let j in price[i].price) {
                let innerPrice = (price[i].price)[j]
                console.log(innerPrice)
                if (innerPrice.sex == sex) {
                  if (innerPrice.countSettle) {
                    this.jian = true
                  }
                  if (innerPrice.countDai) {
                    this.dai = true
                  }
                  if (innerPrice.countChe) {
                    this.che = true
                  }
                  if (innerPrice.countDun) {
                    this.dun = true
                  }
                }
              }
            }
          }
        }
      },
      editItem() {
        if (this.jian) {
          this.checkNum1()
          if (!this.edit.jian) {
            this.$toast('计件量不能为空')
            return false
          }
        }
        if (this.dai) {
          this.checkNum2()
          if (!this.edit.dai) {
            this.$toast('计件量不能为空')
            return false
          }
        }
        if (this.che) {
          this.checkNum3()
          if (!this.edit.che) {
            this.$toast('计件量不能为空')
            return false
          }
        }
        if (this.dun) {
          this.checkNum4()
          if (!this.edit.dun) {
            this.$toast('计件量不能为空')
            return false
          }
        }
        const params = {
          id: this.editId,
          pieceSize: JSON.stringify({ jian: this.edit.jian, dai: this.edit.dai, che: this.edit.che, dun: this.edit.dun })
        };
        console.log(params)
        this.$api
                .EditPrice(params)
                .then(response => {
                  if (response.data.respCode == 0) {
                    this.isShow1 = false
                    this.getWorkerList()
                  }
                })
                .catch(error => {
                  console.log(error);
                });
      },
      goBack() {
        let data = JSON.parse(sessionStorage.getItem('headMan'))
        console.log(data)
        this.$router.push({ name: 'headman', query: { id: data.id, punchWay: data.punchWay } })
      },
      getPositon() {
        console.log(this.map)
        if (this.BMap) {
          this.map.width = 185
          this.map.height = 300
          const sechdulePosition = JSON.parse(sessionStorage.getItem('sechdulePosition'))
          var point = new (this.BMap).Point(this.select.lng, this.select.lat);
          // 创建点坐标
          // this.map.centerAndZoom(point, 18);
          this.map.clearOverlays();

          var new_point = new (this.BMap).Point(this.select.lng, this.select.lat);
          console.log(this.select)
          var marker = new (this.BMap).Marker(new_point);  // 创建标注
          this.map.addOverlay(marker);              // 将标注添加到地图中
          this.map.panTo(new_point);


          var s_point = new (this.BMap).Point(sechdulePosition.longitude, sechdulePosition.latitude);
          var s_marker = new (this.BMap).Marker(s_point);
          this.map.addOverlay(s_marker);              // 将标注添加到地图中
          this.map.panTo(s_point);
          let circleRange = Number(this.distanceRange) || 5000
          var circle = new (this.BMap).Circle(s_point, circleRange, { fillColor: "#007aff", strokeWeight: 1, fillOpacity: 0.15, strokeOpacity: 0.15 });
          this.map.addOverlay(circle); //增加圆
          // var allPoints = [{"lat":sechdulePosition.latitude,"lng":sechdulePosition.longitude},{"lat":this.select.lat,"lng":this.select.lng}];
          var pointArr = [new_point, s_point];//多个点的集合
          var view = this.map.getViewport(pointArr);
          this.map.setViewport(view)
          var mapZoom = view.zoom;
          var centerPoint = view.center;
          console.log(centerPoint)
          // this.map.centerAndZoom(centerPoint, mapZoom);
          this.map.enableScrollWheelZoom(true);
          var label = new (this.BMap).Label("当前位置不在打卡范围内", { offset: new BMap.Size(-100, -60) });
          label.setStyle({
            color: "#e94418",
            fontSize: "18px",
            backgroundColor: "#fff",
            border: "0",
            padding: '10px',
            fontWeight: 700
          });
          marker.setLabel(label);
          var target = new (this.BMap).Label("打卡位置", { offset: new BMap.Size(-30, -50) });
          target.setStyle({
            color: "#000",
            fontSize: "18px",
            // backgroundColor :"#fff",
            border: "0",
            padding: '6px',
            fontWeight: 700
          });
          s_marker.setLabel(target);
        }
      },
      handler({ BMap, map }) {
        this.BMap = BMap
        console.log(map)
        this.map = map
        var point = new BMap.Point(this.select.lng, this.select.lat);
        // 创建点坐标
        map.centerAndZoom(point, 11);
        map.clearOverlays();
        var new_point = new BMap.Point(this.select.lng, this.select.lat);
        var marker = new BMap.Marker(new_point);  // 创建标注

        map.addOverlay(marker);              // 将标注添加到地图中
        map.panTo(new_point);
        console.log(map)
      },
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
              _this.count = 2
              _this.text = '获取定位失败'
            });
            wx.ready(function () {
              wx.getLocation({
                success: function (res) {
                  _this.wechatLocation = res;
                  let ak = 'HIpuFBetnp1KKYrfcleBipO6x31IeI63';
                  let coords = `${res.longitude},${res.latitude}`;
                  jsonp(`http://api.map.baidu.com/geoconv/v1/?coords=${coords}&from=1&to=5&ak=${ak}`, null, (err, data) => {
                    if (err) {
                      // console.log('坐标转换失败', err)
                    } else {
                      // console.log('坐标转换成功', data.result[0])
                      _this.wechatLocation = {
                        longitude: data.result[0].x,
                        latitude: data.result[0].y
                      }
                      _this.getDistanceRange()
                      console.log(_this.wechatLocation);
                      console.log('x轴 --' + data.result[0].x + ', y轴----' + data.result[0].y);
                    }
                  })
                },
                cancel: function (res) {
                  _this.count = 2
                  _this.text = '您拒绝了授权获取地理位置'
                },
              });
            });

          } else {
            _this.count = 2
            _this.text = '获取定位信息失败'
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getWechatRange() {
        this.countDistance(this.wechatLocation.latitude, this.wechatLocation.longitude, this.latitude, this.longitude)
      },
      countDistance(lat1, lng1, lat2, lng2) {
        var radLat1 = this.rad(lat1);
        var radLat2 = this.rad(lat2);
        var a = radLat1 - radLat2;
        var b = this.rad(lng1) - this.rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000 * 1000; //输出为公里
        //s=s.toFixed(4);
        console.log(this.distanceRange + 'range')
        console.log(s + 's')
        if (Number(s) > Number(this.distanceRange)) {
          this.count = 2
          this.text = '当前位置不在打卡范围内'
        }
      },
      getSeconds() {
        const params = {
          paramName: 'qr_refresh_rate',
        };
        this.$api
                .ParamsInfo(params)
                .then(response => {
                  if (response.data.respCode == 0) {
                    this.seconds = response.data.data
                    console.log('二维码刷新频率', this.seconds)
                    this.getWechat()
                  } else {
                    this.count = 2
                    this.text = '获取二维码刷新时间失败'
                  }
                })
                .catch(error => {
                  console.log(error);
                });
      },
    },
  }
</script>

<style scoped>
  .content {
    width: 90%;
    margin: 0 auto;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  .fs {
    color: #636363;
  }
  .mint-popup {
    width: 100%;
  }
  .drop {
    width: 0.43rem;
    height: 0.25rem;
    display: block;
    margin-left: 0.48rem;
  }
  .info {
    font-size: 0.6rem;
    color: #c4c4c4;
    margin-top: 0.5rem;
  }
  .codeBox {
    position: relative;
    width: 200px;
    height: 200px;
    border: solid 1px #dcdcdc;
    margin: auto;
    padding: 20px 0 0 20px;
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
  .avatarBox {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .name {
    font-size: 0.6rem;
    color: #0d0d0d;
    width: 2rem;
    text-align: center;
  }
  .card {
    font-size: 0.6rem;
    color: #026bf9;
  }
  .avatar {
    width: 2.05rem;
    height: 2.05rem;
  }
  .avatarDiv {
    width: 2.05rem;
    height: 2.05rem;
    border: solid 1px #e6e6e6;
    border-radius: 50%;
    overflow: hidden;
  }
  .subDiv {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 2rem;
    padding: 0 0.4rem 0.2rem;
  }
  .warning {
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.73rem;
    vertical-align: middle;
    /* line-height: 1.2rem; */
  }
  .warnText {
    color: #636363;
    /* line-height: 1.2rem; */
    vertical-align: middle;
  }
  .warnBox {
    width: 100%;
    text-align: center;
    margin: 45% auto 0;
  }
  .balckText {
    color: #0d0d0d;
    font-size: 0.75rem;
  }
  .line {
    width: 100%;
    height: 1px;
    background: #e5e5e5;
    margin-top: 1rem;
  }
  .center {
    text-align: center;
    margin: 1rem 0 0;
  }
  .codeBtn {
    width: 3.45rem;
    height: 1.65rem;
    border-radius: 0.82rem;
    border: solid 1px #e84518;
    font-size: 0.6rem;
    color: #d6522d;
    background: #fff;
  }
  .count {
    color: #636363;
    line-height: 1.65rem;
  }
  .worker {
    color: #0d0d0d;
    width: 5rem;
    line-height: 1.65rem;
  }
  .workerBox {
    justify-content: space-between;
    margin-bottom: 0.53rem;
  }
  .back {
    margin-left: 0.75rem;
  }
  .bottom {
    margin-bottom: 0.53rem;
    width: 100%;
    height: 1px;
    background: #e5e5e5;
  }
  .sure {
    float: right;
    padding: 5px;
    color: #666;
    margin: 5px 5px 0 0;
  }
  .agreeText {
    font-size: 0.7rem;
    color: #e94418;
    width: 2.65rem;
    height: 1.3rem;
    border: solid 0.05rem #e94418;
    text-align: center;
    line-height: 1.4rem;
    border-radius: 0.15rem;
  }
  .repulseText {
    font-size: 0.7rem;
    color: #fff;
    width: 2.75rem;
    height: 1.4rem;
    background: #e94418;
    text-align: center;
    line-height: 1.4rem;
    border-radius: 0.15rem;
    margin-left: 0.5rem;
  }
  .btnbOX {
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 0.5rem;
  }
  .modal {
    position: fixed;
    /* left:0;
      top:0;
      right:0;
      bottom: 0;
      margin:auto; */
    z-index: 10;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    justify-content: center;
    flex-direction: column;
    align-items: center;
    z-index: 4;
  }
  .white11 {
    width: 90%;
    /* height: 6.65rem;  */
    background-color: #ffffff;
    border-radius: 0.5rem;
    /* justify-content: flex-start;
      flex-direction: column;
      align-items: center; */
    margin-bottom: 1.18rem;
    padding: 0.5rem 2rem;
  }
  .comfirmBtn {
    width: 3.2rem;
    height: 1.75rem;
    border-radius: 0.88rem;
    font-size: 0.7rem;
    margin: 0.8rem;
  }
  .comfirmBtn1 {
    width: 3.2rem;
    height: 1.75rem;
    border-radius: 0.88rem;
    font-size: 0.7rem;
    color: #e84518;
    border: 1px solid #e84518;
  }
  .btnDiv {
    justify-content: center;
    align-items: center;
  }
  .bg {
    background: #000;
    opacity: 0.5;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 3;
  }
  .countInput {
    width: 4.7rem;
    height: 1.45rem;
    border: solid 1px #dcdcdc;
    padding: 0 0.5rem;
    margin-right: 0.48rem;
  }
  .doneBox {
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    color: #fff;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    padding: 0.6rem 0;
    background: #e84518;
    z-index: 1;
  }
  .countImg {
    width: 1.25rem;
    height: 1.5rem;
  }
  .countBox {
    position: fixed;
    bottom: 3rem;
    right: 0.75rem;
    width: 2.75rem;
    height: 2.75rem;
    background-color: #ffffff;
    box-shadow: 0rem 0.1rem 0.24rem 0.01rem rgba(92, 92, 92, 0.06);
    border-radius: 50%;
    justify-content: center;
    align-items: center;
  }
  .popUp {
    width: 100%;
    height: 90%;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    overflow-x: scroll;
    z-index: 2;
  }
  .padding {
    width: 90%;
    padding-top: 2.5rem;
    margin: 0 auto;
  }
  .close {
    width: 1rem;
    height: 1rem;
  }
  .red {
    width: 1rem;
    height: 0.55rem;
    background-color: #ff1b1b;
    border-radius: 0.28rem;
    position: absolute;
    top: 0.4rem;
    right: 0.5rem;
    text-align: center;
    line-height: 0.45rem;
  }
  .countNumber {
    font-size: 0.4rem;
    color: #ffffff;
  }
  .textR {
    text-align: center;
    color: #636363;
    /* position: absolute;
      top:50%;
      left:50% */
    margin-top: 5rem;
  }
  .leftArrow {
    position: fixed;
    top: 0.6rem;
    left: 0.4rem;
    z-index: 999;
    width: 0.5rem;
  }
  .mapdiv {
    width: 100%;
    height: 100%;
    /*overflow: hidden;*/
    /*margin: 0;*/
    /*font-family: "微软雅黑";*/
  }
  .container {
    position: absolute;
    top: 2rem;
    left: 0;
  }
</style>