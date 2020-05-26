<template>
    <div class="worksheetMapModeCon">
        <div class="topPart">
<!--            <div :style="setMapHeight"></div>-->
            <div tabindex="1" id="cusmap" :style="setMapHeight"></div>
            <div class="trigger" @click="goToSelect"><span>地点附近{{radius}}km内共有{{dataLists.length}}个工单</span><img :src="serrateImg"> </div>
            <div class="inputSearch">
                <div class="searchCon">
                    <div class="inputCon">
                        <i class="mintui mintui-search"></i>
                        <input placeholder="请输入想要的工作地点" v-model.trim="value"  @focus="focusNow" @blur="normalBlur">
                    </div>
                    <span @click="searchNowBtn">搜索</span>
                </div> 
                <div class="listCon" v-show="listShow">
                    <template v-for="(value,index) in result">
                        <div class="item" :key="index" @click="clickItem(value)">{{value.title}}</div>
                    </template>
                </div>
            </div>   
            <div class="switchCircle" @click="changeTrigger">列表<br/>模式</div>
        </div>
        <div class="bottomPart">
            <div class="singleItemInfoCon" v-if="lightRed">
                <div class="leftArrow" @click="leftRoll" v-show="showLeft"><img :src="leftArrowImg"></div>
                <div class="rightArrow" @click="rightRoll" v-show="showRight"><img :src="rightArrowImg"></div>
                <div class="itemFirstLine flex">
                    <div>{{currentSingleInfo.taskName}}</div>
                    <img :src="imgShut" @click="shutNow">
                </div>
                <div class="flex" @click="routeToDetail">
                    <div class="firstPartSp2" v-if="currentSingleInfo.positionName">{{currentSingleInfo.positionName}}</div>
                    <div class="firstPartSp3">{{currentSingleInfo.settlementType | settlementTypeText}}</div>
                </div>
                <div  class="flex marSet" @click="routeToDetail">
                    <div class="flex sameDivide">
                        <div class="fourthPartTitle">发布人：</div>
                        <div class="fourthPartContent">{{currentSingleInfo.managerName}}</div>
                    </div>
                    <div class="flex sameDivide">
                        <div class="fourthPartTitle">所需人数：</div>
                        <div class="fourthPartContent">{{currentSingleInfo.maxWorker}}</div>
                    </div>
                </div>
                <div class="flex setContent marginAddon" @click="routeToDetail">
                        <div class="firstPartTitle">起止时间：</div>
                        <div class="firstPartContent">{{currentSingleInfo.startTime | formatminDate}} 至 {{currentSingleInfo.endTime | formatminDate}}</div>
                    </div>
                <div class="flex thirdPartSecondCon" @click="routeToDetail">
                        <div class="thirdPartTitle">工单单价：</div>
                        <div class="thirdPartContent text-overflow">{{text}}</div>
                    </div>
            </div> 
        </div>         
    </div>
</template>
<script>
    import util from '@/common/util'
    export default {
        name: "worksheetMapMode",
        props:{
            changeTriggerOne:Function,
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
            formatminDate(val) {
                if (val && val.length > 5) {
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
        data() {
            return {                
                imgShut:require('@/assets/img/shutItem.png'),
                text:'',                
                listShow:false,
                value:'',
                mapInstance:null,
                center:{
                    lng:120.222586, 
					lat:30.265299,
				},
                result:[],
                setMapHeight:{
                    height: 'calc(100vh - 4.8rem)'
                },
                radius:10,
                dataLists:[],
                locationData:{},
                talentId:'',
                isParseLocation:false,
                lightRed:false,
                redObj:{},
                leftArrowImg:require('@/assets/img/leftArrow.png'),
                rightArrowImg:require('@/assets/img/rightArrow.png'),
                serrateImg:require('@/assets/img/functi.png'),
                showLeft:false,
                showRight:false,
                currentSingleInfo:{},
                currentActiveIndex:0,
                isShutOperation:false,
            };
        },
        mounted() {
            this.initParseStorage();
            this.initRadius();
            this.initLocationInfo();              
//            this.setMapHeight = {
//                height: 'calc(100vh - 13.3rem)'
//            };
        },
        methods: { 
            normalBlur(){
//                this.$toast('正常blur');
            },
            leftRoll(){
                if(this.dataLists.length){   
                    if(this.currentActiveIndex>0){
                        this.showRight = true;
                        let temp1 = this.currentActiveIndex;
                        this.currentActiveIndex = temp1 - 1;
                        this.currentSingleInfo = this.dataLists[ this.currentActiveIndex ];
                        if(this.currentActiveIndex == 0){
                            this.showLeft = false;
                        }else{
                            this.showLeft = true;
                        }
                        this.redObj = {
                            longitude:this.dataLists[this.currentActiveIndex].longitude,
                            latitude:this.dataLists[this.currentActiveIndex].latitude,
                        };
                        this.zoomToCurrent(this.currentActiveIndex);  
                    }
                }
            },
            rightRoll(){
                if(this.dataLists.length){
                    if( this.currentActiveIndex < this.dataLists.length - 1 ){
                        this.showLeft = true;
                        let temp1 = this.currentActiveIndex;
                        this.currentActiveIndex = temp1 + 1;
                        this.currentSingleInfo = this.dataLists[ this.currentActiveIndex ];
                        if( this.currentActiveIndex == this.dataLists.length-1 ){
                            this.showRight = false;                             
                        }else{
                            this.showRight = true;
                        }
                        this.redObj = {
                            longitude:this.dataLists[this.currentActiveIndex].longitude,
                            latitude:this.dataLists[this.currentActiveIndex].latitude,
                        };
                        this.zoomToCurrent(this.currentActiveIndex);                        
                    }
                }
            },
            zoomToCurrent(index){
                var secPoint = new BMap.Point(this.dataLists[index].longitude,this.dataLists[index].latitude);
                this.mapInstance.centerAndZoom(secPoint,17); 
                this.mapInstance.clearOverlays();
                let data = {};
                if( this.isParseLocation ){
                    let hello = {
                        lat:this.locationData.latitude,
                        lng:this.locationData.longitude
                    };
                    data = hello;
                }else{
                    data = this.center;
                }  
                var point = new BMap.Point(data.lng,data.lat);                      
                var myIcon = new BMap.Icon(require('@/assets/img/currentPoint.png'), new BMap.Size(20,20));
                var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                this.mapInstance.addOverlay(marker);                  
                
                var innerPoint = new BMap.Point(this.dataLists[index].longitude,this.dataLists[index].latitude); 
                var innerIcon = new BMap.Icon(require('@/assets/img/currentLocation.png'), new BMap.Size(38,38));
                var markerRed = new BMap.Marker(innerPoint,{icon:innerIcon}); 
                this.mapInstance.addOverlay(markerRed); 
                
                let newArr = this.dataLists.map(ele=>{
                    return {
                        latitude:ele.latitude,
                        longitude:ele.longitude
                    } 
                });  
                 let afterDelete = newArr.filter(ele=>{
                     return ele.latitude !=  this.redObj.latitude;
                 });
                    afterDelete.forEach(ele=>{
                        var unActivePoint = new BMap.Point(ele.longitude,ele.latitude); 
                        var Icon = new BMap.Icon(require('@/assets/img/greenLocation.png'), new BMap.Size(38,38));
                        var markerGreen = new BMap.Marker(unActivePoint,{icon:Icon}); 
                        this.mapInstance.addOverlay(markerGreen); 
                        markerGreen.addEventListener("click",()=>{
                            console.log('这里再次添加了');                            
                            this.redObj = {
                                longitude:ele.longitude,
                                latitude:ele.latitude,
                            };
                            this.$nextTick(()=>{
                                this.onlyRedPoint();
                            });
                        }); 
                    });    
            },
            routeToDetail() {
                this.$router.push({
                    name: 'robDetail',
                    query: {
                        schedulingTaskId:this.currentSingleInfo.schedulingTaskId,
                    }
                });
            },
            initParseStorage(){
                if (JSON.parse(sessionStorage.getItem("userInfo"))) {
                    this.talentId = JSON.parse(sessionStorage.getItem("userInfo")).talentId;
                }
            },
            needInitMapDraw(pointData){
                if(this.isShutOperation){
                    
                }else{
                    let map =new BMap.Map('cusmap');
                    this.mapInstance = map;                 
                    var point = new BMap.Point(pointData.lng,pointData.lat);  
                    map.centerAndZoom(point,17);
                    var scaleCtrl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT,offset: new BMap.Size(10,40)});
                    map.addControl(scaleCtrl);                
                    map.enableScrollWheelZoom(true);                
                    var geoc = new BMap.Geocoder(); 
                    var myIcon = new BMap.Icon(require('@/assets/img/currentPoint.png'), new BMap.Size(20,20));
                    var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                    map.addOverlay(marker); 
                    console.log('this.dataLists.length',this.dataLists.length)
                    if(this.dataLists.length){
                        this.lightRed = true;
                        this.setMapHeight = {
                            height: 'calc(100vh - 13.3rem)'
                        };   
                        this.currentActiveIndex = 0;
                        this.currentSingleInfo = this.dataLists[0];                    
                        this.text = this.forPrice(this.dataLists[0].price);  
                        if( this.dataLists.length>1 ){
                            this.showRight = true;
                        }
                        let newArr = this.dataLists.map(ele=>{
                           return {
                               latitude:ele.latitude,
                               longitude:ele.longitude
                           } 
                        });
                        this.redObj = {
                            longitude:newArr[0].longitude,
                            latitude:newArr[0].latitude,
                        };

                        var secPoint = new BMap.Point(newArr[0].longitude,newArr[0].latitude);
                        this.mapInstance.centerAndZoom(secPoint,17);  
                        var innerPoint = new BMap.Point(newArr[0].longitude,newArr[0].latitude); 
                        var innerIcon = new BMap.Icon(require('@/assets/img/currentLocation.png'), new BMap.Size(38,38));
                        var markerRed = new BMap.Marker(innerPoint,{icon:innerIcon}); 
                        this.mapInstance.addOverlay(markerRed); 
                        newArr.slice(1).forEach(ele=>{
                            var unActivePoint = new BMap.Point(ele.longitude,ele.latitude); 
                            var Icon = new BMap.Icon(require('@/assets/img/greenLocation.png'), new BMap.Size(38,38));
                            var markerGreen = new BMap.Marker(unActivePoint,{icon:Icon}); 
                            this.mapInstance.addOverlay(markerGreen); 
                            markerGreen.addEventListener("click",()=>{
                                this.redObj = {
                                    longitude:ele.longitude,
                                    latitude:ele.latitude,
                                };
                                this.$nextTick(()=>{
                                    this.onlyRedPoint();
                                });
                            });                        
                        });   
                    }else{
                        this.setMapHeight = {
                            height: 'calc(100vh - 4.8rem)'
                        };
                        this.lightRed = false;
                    }
                }
                
                
                
                
            },
            forInputRequestList(pointData){
                this.center = pointData;
                const params = {
                    type:'2', 
                    loginTalentId: this.talentId,                    
                    circleRequest: {
                        range: Number(this.radius)*1000,
                        longitude:pointData.lng,  
                        latitude: pointData.lat,
                        limit: ''
                    },                                 
                };  
                this.$api.taskMarket(params).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode === 0 ){
                        if(data && data.list){
                            this.dataLists = data.list; 
                            this.needInitMapDraw(pointData);
                        }else{
                            this.dataLists = [];
                            this.needInitMapDraw(pointData);
                        }
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            forInitInputGetLocation(){
                var myGeo = new BMap.Geocoder();
                let inputValue = sessionStorage.getItem('mapSearchValue');
                let bridge = JSON.parse(inputValue).address;
                myGeo.getPoint(bridge, (point)=>{
                    if (point) {  
                        this.forInputRequestList(point);
                    }else{
                        this.$toast("您选择地址没有解析到结果!");
                    }
                }, "杭州市");
            },
            forInitInput(){
                this.forInitInputGetLocation();
            },
            initLocationInfo(){
                let location = sessionStorage.getItem('position');
                if( location ){
                    this.isParseLocation = true;
                    this.locationData = JSON.parse(sessionStorage.getItem('position'));
                    let data = {
                        lat:this.locationData.latitude,
                        lng:this.locationData.longitude
                    };
                    if( this.value ){
                        this.forInitInput();
                    }else{
                        this.initLocationMap(data);
                    }
                }else{
                    this.isParseLocation = false;
                    if( this.value ){
                        this.forInitInput();
                    }else{
                        this.initStaticMap();
                    }
                }
            },
            initRadius(){
                let res = sessionStorage.getItem('mapRadius'); 
                if(res){
                    this.radius = res;
                }
                let inputValue = sessionStorage.getItem('mapSearchValue');
                if( inputValue ){
                    this.value = JSON.parse(inputValue).title;
                }                
            },
            goToSelect(){
                this.$router.push({
                    name: "SelectRadius",
                    query:{
                        radius:this.radius
                    }
                });                
            },
            searchDraw(){
                if(this.dataLists.length){
                    let newArr = this.dataLists.map(ele=>{
                       return {
                           latitude:ele.latitude,
                           longitude:ele.longitude
                       } 
                    });
                    this.redObj = {
                        longitude:newArr[0].longitude,
                        latitude:newArr[0].latitude,
                    };
                    this.lightRed = true;
                    this.currentActiveIndex = 0;
                    this.currentSingleInfo = this.dataLists[0];                    
                    this.text = this.forPrice(this.dataLists[0].price);  
                    if( this.dataLists.length>1 ){
                        this.showRight = true;
                    }
                    var secPoint = new BMap.Point(newArr[0].longitude,newArr[0].latitude);
                    this.mapInstance.centerAndZoom(secPoint,17);  
                    var innerPoint = new BMap.Point(newArr[0].longitude,newArr[0].latitude); 
                    var innerIcon = new BMap.Icon(require('@/assets/img/currentLocation.png'), new BMap.Size(38,38));
                    var markerRed = new BMap.Marker(innerPoint,{icon:innerIcon}); 
                    this.mapInstance.addOverlay(markerRed); 
                    
                    this.setMapHeight = {
                        height: 'calc(100vh - 13.3rem)'
                    };   
                    newArr.slice(1).forEach(ele=>{
                        var unActivePoint = new BMap.Point(ele.longitude,ele.latitude); 
                        var Icon = new BMap.Icon(require('@/assets/img/greenLocation.png'), new BMap.Size(38,38));
                        var markerGreen = new BMap.Marker(unActivePoint,{icon:Icon}); 
                        this.mapInstance.addOverlay(markerGreen); 
                        markerGreen.addEventListener("click",()=>{
                            this.redObj = {
                                longitude:ele.longitude,
                                latitude:ele.latitude,
                            };
                            this.$nextTick(()=>{
                                this.onlyRedPoint();
                            });
                        });                        
                    });                    
                }else{
                    this.setMapHeight = {
                        height: 'calc(100vh - 4.8rem)'
                    };
                    this.lightRed = false;
                }
            },
            inputResSearch(location){
                this.center = location;
                const params = {
                    type:'2', 
                    loginTalentId: this.talentId,                    
                    circleRequest: {
                        range: Number(this.radius)*1000,
                        longitude:location.lng,  
                        latitude: location.lat,
                        limit: ''
                    },                                 
                };                
                this.$api.taskMarket(params).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode === 0 ){
                        if(data && data.list){
                            this.dataLists = data.list; 
                            this.searchDraw();
                        }else{
                            this.dataLists = [];
                            this.searchDraw();
                        }
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            searchNowBtn(){                
                if( this.value ){
                    this.getResultLists();
                }else{
                    this.listShow = false;
                    sessionStorage.removeItem('mapSearchValue');
                    this.center = {
                        lng:120.222586, 
                        lat:30.265299,
                    };
                    this.initLocationInfo();
                }                
            },
            focusNow(){
                if( this.value ){
                    this.listShow = true;
                }else{
                    this.listShow = false;
                }                
            },
            changeTrigger(){
                sessionStorage.setItem('mapTrigger',JSON.stringify(false));
                this.$emit( 'changeTriggerOne',false );
            },  
            getResultLists(){
                this.listShow = true;
                let that = this;
				var final =  [] ;
				var options = {
					onSearchComplete: function(results){
							// 判断状态是否正确  
						if (local.getStatus() == BMAP_STATUS_SUCCESS){
							var arr = [];
							for (var i = 0; i < results.getCurrentNumPois(); i ++){
								let obj ={
									"title":results.getPoi(i).title,
									"address":results.getPoi(i).address
								};
								arr.push( obj );
							}
							final = arr;
                            that.result = final;
                            console.log( 'final',final );
						}
					}
				};
				var local = new BMap.LocalSearch(this.mapInstance, options);
				local.search(this.value);    
            },
            clickItem(item){         
//                this.value = item.address; 
                console.log(item);
                this.value = item.title; 
                this.listShow = false;
                if( this.value ){
                    sessionStorage.setItem('mapSearchValue',JSON.stringify(item)); 
                    var myGeo = new BMap.Geocoder();
                    myGeo.getPoint(item.address, (point)=>{
                        console.log('point',point);
                        if (point) {
                            if( this.mapInstance ){
                                this.mapInstance.clearOverlays();
                                this.mapInstance.centerAndZoom(point, 17);
                                var myIcon = new BMap.Icon(require('@/assets/img/currentPoint.png'), new BMap.Size(20,20));
                                this.mapInstance.addOverlay(new BMap.Marker(point,{icon:myIcon}));
                                let location = {
                                    lng:point.lng,
                                    lat:point.lat
                                };                        
                                this.inputResSearch(location);
                            }  
                        }else{
                            this.$toast("您选择地址没有解析到结果!");
                        }
                    }, "杭州市");
                }
            },
            converter(map,point){
                let translateCallback = function (data){
                  if(data.status === 0) {
                    var marker = new BMap.Marker(data.points[0]);
//                      map.centerAndZoom(point, 17);
                    map.addOverlay(marker);                    
                    map.setCenter(data.points[0]);
                  }
                }     
                setTimeout(function(){
                    var convertor = new BMap.Convertor();
                    var pointArr = [];
                    pointArr.push(point);
                    convertor.translate(pointArr, 1, 5, translateCallback)
                }, 500);
            },            
            shutNow(){
                this.isShutOperation = true;
                this.lightRed = false;
                this.setMapHeight = {
                    height: 'calc(100vh - 4.8rem)'
                };
                this.initLocationInfo();                 
            },            
            listRequest(location){                  
                const params = {
                    type:'2', 
                    loginTalentId: this.talentId,                    
                    circleRequest: {
                        range: Number(this.radius)*1000,
                        longitude:location.lng,  
                        latitude: location.lat,
                        limit: ''
                    },                                 
                }     
                this.$api.taskMarket(params).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode === 0 ){
                        if(data && data.list){
                            this.dataLists = data.list;  
                            if( this.lightRed ){
                                if(this.isParseLocation){
                                    this.initMapCommon(location);
                                }else{
                                    this.initMapCommon(this.center);
                                }
                            }else{
                                if(this.isParseLocation){
//                                    this.noActiveReset(location);
                                }else{
                                    this.noActiveReset(this.center);
                                }
                            }
                        }else{
                            this.dataLists = [];
                            if( this.lightRed ){
                                if(this.isParseLocation){
//                                    this.initMapCommon(location);
                                }else{
                                    this.initMapCommon(this.center);
                                }
                            }else{
                                if(this.isParseLocation){
                                    this.noActiveReset(location);
                                }else{
                                    this.noActiveReset(this.center);
                                }
                            }
                        }
                    }
                 }).catch(err=>{
                    console.log('err',err);
                })             
            },
            forPrice(val) {
                return this.GlobalPriceFilter.priceFilter(val);
            },
            onlyRedPoint(){
                this.lightRed = true;
                this.mapInstance.clearOverlays();
                let data = {};
                if( this.isParseLocation ){
                    let hello = {
                        lat:this.locationData.latitude,
                        lng:this.locationData.longitude
                    };
                    data = hello;
                }else{
                    data = this.center;
                }     
                
                let map =new BMap.Map('cusmap');
                this.mapInstance = map;                 
                var point = new BMap.Point(data.lng,data.lat);  
                var scaleCtrl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT,offset: new BMap.Size(10,40)});
                map.addControl(scaleCtrl);                
                map.enableScrollWheelZoom(true);  
                var myIcon = new BMap.Icon(require('@/assets/img/currentPoint.png'), new BMap.Size(20,20));
                var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                map.addOverlay(marker);  
                if( this.dataLists.length ){
                    let newArr = this.dataLists.map(ele=>{
                       return {
                           latitude:ele.latitude,
                           longitude:ele.longitude
                       } 
                    });                    
                    let afterDelete = newArr.filter(ele=>{
                       return ele.latitude !=  this.redObj.latitude;
                    });
                    afterDelete.forEach(ele=>{
                        var unActivePoint = new BMap.Point(ele.longitude,ele.latitude); 
                        var Icon = new BMap.Icon(require('@/assets/img/greenLocation.png'), new BMap.Size(38,38));
                        var markerGreen = new BMap.Marker(unActivePoint,{icon:Icon}); 
                        this.mapInstance.addOverlay(markerGreen); 
                        markerGreen.addEventListener("click",()=>{
                            console.log('这里再次添加了');                            
                            this.redObj = {
                                longitude:ele.longitude,
                                latitude:ele.latitude,
                            };
                            this.$nextTick(()=>{
                                this.onlyRedPoint();
                            });
                        }); 
                    });
                    let currentIndex = newArr.findIndex(ele=>{
                        return ele.longitude == this.redObj.longitude;
                    });
                    console.log( 'currentIndex',currentIndex );
                    this.currentSingleInfo = this.dataLists[currentIndex];                    
                    this.text = this.forPrice(this.dataLists[currentIndex].price);
                }
                var innerPoint = new BMap.Point(this.redObj.longitude,this.redObj.latitude); 
                var innerIcon = new BMap.Icon(require('@/assets/img/currentLocation.png'), new BMap.Size(38,38));
                var markerRed = new BMap.Marker(innerPoint,{icon:innerIcon}); 
                this.mapInstance.addOverlay(markerRed); 
                map.centerAndZoom(innerPoint,17);
                this.setMapHeight = {
                    height: 'calc(100vh - 13.3rem)'
                };  
            },
            noActiveReset(data){
                if( this.dataLists.length ){
                    let newArr = this.dataLists.map(ele=>{
                       return {
                           latitude:ele.latitude,
                           longitude:ele.longitude
                       } 
                    });
                    this.mapInstance.clearOverlays();  
                    let data = {};
                    if( this.isParseLocation ){
                        let hello = {
                            lat:this.locationData.latitude,
                            lng:this.locationData.longitude
                        };
                        data = hello;
                    }else{
                        data = this.center;
                    }
                    var point = new BMap.Point(data.lng,data.lat);                      
                    var myIcon = new BMap.Icon(require('@/assets/img/currentPoint.png'), new BMap.Size(20,20));
                    var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                    this.mapInstance.addOverlay(marker);  
                    newArr.forEach(ele=>{
                        var unActivePoint = new BMap.Point(ele.longitude,ele.latitude); 
                        var Icon = new BMap.Icon(require('@/assets/img/greenLocation.png'), new BMap.Size(38,38));
                        var markerGreen = new BMap.Marker(unActivePoint,{icon:Icon}); 
                        this.mapInstance.addOverlay(markerGreen); 
                        markerGreen.addEventListener("click",()=>{
                            console.log('这里再次添加了');                            
                            this.redObj = {
                                longitude:ele.longitude,
                                latitude:ele.latitude,
                            };
                            this.$nextTick(()=>{
                                this.onlyRedPoint();
                            });
                        }); 
                    });
                }else{        
                    console.log( 'this.mapInstance',this.mapInstance );
                    if(this.mapInstance){
                        let hiData = {};
                        if( this.isParseLocation ){
                            let hello = {
                                lat:this.locationData.latitude,
                                lng:this.locationData.longitude
                            };
                            hiData = hello;
                        }else{
                            hiData = this.center;
                        }  
                        let point = new BMap.Point(hiData.lng,hiData.lat);                      
                        let myIcon = new BMap.Icon(require('@/assets/img/currentPoint.png'), new BMap.Size(20,20));
                        let marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                        this.mapInstance.addOverlay(marker);  
                        this.mapInstance.centerAndZoom(point,17);
                        var scaleCtrl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT,offset: new BMap.Size(10,40)});
                        this.mapInstance.addControl(scaleCtrl);                
                        this.mapInstance.enableScrollWheelZoom(true);  
                    }else{
                        let hiData = {};
                        if( this.isParseLocation ){
                            let hello = {
                                lat:this.locationData.latitude,
                                lng:this.locationData.longitude
                            };
                            hiData = hello;
                        }else{
                            hiData = this.center;
                        }   
                        let map =new BMap.Map('cusmap');
                        this.mapInstance = map;     
                        let point = new BMap.Point(hiData.lng,hiData.lat);                      
                        let myIcon = new BMap.Icon(require('@/assets/img/currentPoint.png'), new BMap.Size(20,20));
                        let marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                        this.mapInstance.addOverlay(marker);  
                        map.centerAndZoom(point,17);
                        var scaleCtrl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT,offset: new BMap.Size(10,40)});
                        map.addControl(scaleCtrl);                
                        map.enableScrollWheelZoom(true);  
                    }
                }
            },
            initMapCommon(data){
                let map =new BMap.Map('cusmap');
                this.mapInstance = map;                 
                var point = new BMap.Point(data.lng,data.lat);  
                map.centerAndZoom(point,17);
                var scaleCtrl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT,offset: new BMap.Size(10,40)});
                map.addControl(scaleCtrl);                
                map.enableScrollWheelZoom(true);                
                var geoc = new BMap.Geocoder(); 
                var myIcon = new BMap.Icon(require('@/assets/img/currentPoint.png'), new BMap.Size(20,20));
                var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                map.addOverlay(marker); 
                if( this.dataLists.length ){
                    let newArr = this.dataLists.map(ele=>{
                       return {
                           latitude:ele.latitude,
                           longitude:ele.longitude
                       } 
                    });
                    this.redObj = {
                        longitude:newArr[0].longitude,
                        latitude:newArr[0].latitude,
                    };
                    this.lightRed = true;
                    this.currentActiveIndex = 0;
                    this.currentSingleInfo = this.dataLists[0];                    
                    this.text = this.forPrice(this.dataLists[0].price);  
                    
                    if( this.dataLists.length>1 ){
                        this.showRight = true;
                    }
                    
                    
                    var secPoint = new BMap.Point(newArr[0].longitude,newArr[0].latitude);
                    map.centerAndZoom(secPoint,17);  
                    var innerPoint = new BMap.Point(newArr[0].longitude,newArr[0].latitude); 
                    var innerIcon = new BMap.Icon(require('@/assets/img/currentLocation.png'), new BMap.Size(38,38));
                    var markerRed = new BMap.Marker(innerPoint,{icon:innerIcon}); 
                    map.addOverlay(markerRed); 
                    
                    this.setMapHeight = {
                        height: 'calc(100vh - 13.3rem)'
                    };   
                    newArr.slice(1).forEach(ele=>{
                        var unActivePoint = new BMap.Point(ele.longitude,ele.latitude); 
                        var Icon = new BMap.Icon(require('@/assets/img/greenLocation.png'), new BMap.Size(38,38));
                        var markerGreen = new BMap.Marker(unActivePoint,{icon:Icon}); 
                        map.addOverlay(markerGreen); 
                        markerGreen.addEventListener("click",()=>{
                            this.redObj = {
                                longitude:ele.longitude,
                                latitude:ele.latitude,
                            };
                            this.$nextTick(()=>{
                                this.onlyRedPoint();
                            });
                        });                        
                    });
                }
//                this.converter(map,point);
            },
            initLocationMap(data){
                this.listRequest(data);        
            },
            initStaticMap(){                
                this.listRequest(this.center);          
            },
        },
    };
</script>
<style lang="scss" scoped>
    .worksheetMapModeCon {
        background-color: #F5F5F5;
        position: relative;
        left: 0;
        right: 0;
        top: 2.2rem;
        height: calc(100vh - 4.8rem);
        display: flex;
        justify-content: flex-start;
        flex-direction: column;    
        .topPart {
            position: relative;
        }
        .bottomPart {
            height: calc(100vh - 4.8rem);
            background-color: #fff;
        }
        .sameDivide {
            width: 50%;
        }
        .marSet {
            margin-top: convertToVw(10);
        }
        .setContent {
                justify-content: flex-start;
            }
        .firstPartTitle {                
                color: #6E7075;
                min-width: convertToVw(70);
                box-sizing: border-box;
                font-size: convertToVw(13);
            }
        .firstPartContent {
            color: #1E1F21;
            font-weight: 400;
            font-size: convertToVw(13);
        }
           .thirdPartSecondCon {
                box-sizing: border-box;
                align-content: flex-start;
                align-items: flex-start;
            }
            .thirdPartTitle {
                min-width: convertToVw(70);
                color: #6E7075;
                font-size: convertToVw(13);
            }
            .thirdPartContent {
                color: #1E1F21;
                font-weight: 400;
                font-size: convertToVw(13);                
            }
         .marginAddon {
                margin-top: convertToVw(8);
                margin-bottom: convertToVw(8);
            }
        .fourthPartTitle {
                color: #6E7075;
                font-size: convertToVw(13);
            }
            .fourthPartContent {
                color: #1E1F21;
                font-weight: 400;
                font-size: convertToVw(13);   
            }
        .firstPartSp2 {
                color: #3296FA;
                margin-right: convertToVw(10);
                border: 1px solid #3296FA;
                border-radius: 2px;
                font-size: convertToVw(13);
                padding-left: convertToVw(6);
                padding-right: convertToVw(6);
            }
            .firstPartSp3 {
                color: #15BC83;
                border: 1px solid #15BC83;
                border-radius: 2px;
                font-size: convertToVw(13);
                padding-left: convertToVw(6);
                padding-right: convertToVw(6);
            }
        .itemFirstLine {
            font-size: convertToVw(17);
            margin-bottom: convertToVw(6);
            font-weight: 800;
            color: #1E1F21;
            justify-content: space-between;
            img {
                z-index: 10;
            }
        }
        .switchCircle {
            position: absolute;
            right: 0.5rem;
            box-sizing: border-box;
            padding-top: convertToVw(10);
            bottom: convertToVw(30);
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
        .leftArrow {
            img {
                width: convertToVw(36);
                height: convertToVw(36);
            }
            position: absolute;
            left: 0.5rem;
            top: calc(100% - 4.5rem);
        }
            .rightArrow {
                img {
                    width: convertToVw(36);
                    height: convertToVw(36);
                }
                position: absolute;
                right: 0.5rem;
                top: calc(100% - 4.5rem);
            }
        .singleItemInfoCon {
            width: 100%;
            box-sizing: border-box;
            padding: 0.5rem;
            padding-bottom: 0;
            background-color: #fff;
            position: relative;
        }
        #cusmap {
            width: 100%;
/*            height: calc(100vh - 6rem);*/
        }
        .trigger {
            box-sizing: border-box;
            padding-left: 0.7rem;
            padding-right: 0.7rem;
            position: fixed;
            top: 4.5rem;
            left: 5%;
            color: #3296FA;
            font-size: 12px;
            background-color: #fff;
            width: 90%;
            margin: 0 auto;
            margin-top: 1rem;
            height: 2rem;
            line-height: 2rem;
            display: flex;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            img {
                width: convertToVw(13);
            }
        }
        .listCon {
            width: 90%;
            margin: 0 auto;
            background-color: #fff;
            border-top: 1px solid #eee;
            border-bottom-left-radius: 0.2rem;
            border-bottom-right-radius: 0.2rem;
            overflow-y: scroll;
            max-height: 15rem;            
            .item {
                height: 2rem;
                overflow-x: hidden;
                z-index: 20;
                padding-top: 0.6rem;
                padding-left: 0.4rem;
                font-size: convertToVw(14);
                box-sizing: border-box;
                border-bottom: 1px solid #f4f4f4;
            }
        }
        .searchCon {
            width: 90%;
            margin: 0 auto;
            height: 2rem;
            display:flex;
            border-radius: 0.2rem;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            background-color: #fff;
            margin-top: 0.5rem;
            box-sizing: border-box;
            padding: 0.5rem;
            span {
                color: #6E7075;
                font-size: 0.8rem;
            }
            .inputCon {
                width: calc( 100% - 2.4rem );
                height: 1.2rem;
                padding-left: 0.3rem;
                border-radius: 0.2rem;
                background-color: rgb(244,244,244);
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-content: center;
                align-items: center;
                input {
                    width: 100%;
                    border: none;
                    padding-left: 0.3rem;
                    font-size: 13px;
                    box-sizing: border-box;
                    background-color: rgb(244,244,244);
                }
            }            
        }        
        .inputSearch {
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
        }
        .resContainer {
            position: absolute;
            left: 0;
            right: 0;
            top: 2.2rem;
            padding-left: 1rem;
            padding-right: 1rem;
            box-sizing: border-box;
            overflow: scroll;
            height: 15rem;
        }
        .cellItemCus {
            height: 3rem;
            background-color: #fff;
        }
    }
</style>
<style lang="scss">
    .worksheetMapModeCon {
        .mint-search-list {
            height: 15rem;
            overflow: scroll;
        }
    }
</style>