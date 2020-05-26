<template>
    <div class="SimpleMapCon">
        <mt-header title="位置" class="page-title">
          <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>
        <div id="secmap"></div>
    </div>
</template>
<script>
    export default {
        name: 'SimpleMap',       
        data () {
            return {
            }
        },
        mounted(){
            this.initMap(this.$route.query);
        },
        methods:{      
            initMap(data){
                let map =new BMap.Map('secmap');
                this.mapInstance = map; 
                    var point = new BMap.Point(data.longitude,data.latitude);  
                    map.centerAndZoom(point,17);
                    var scaleCtrl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT,offset: new BMap.Size(10,40)});
                    map.addControl(scaleCtrl);                
                    map.enableScrollWheelZoom(true); 
                var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); 
                map.addControl(top_right_navigation);
                var myIcon = new BMap.Icon(require('@/assets/img/currentPoint.png'), new BMap.Size(20,20));
                var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                map.addOverlay(marker);  
            },
            handleBack(){
                this.$router.go(-1);                
            },
        }
    }
</script>
<style lang="scss" scoped>
    .SimpleMapCon {
        height: 100vh;
        background-color: #F5F5F5;
        #secmap {
            height: calc(100vh - 2.2rem);
        }
    }
</style>
<style lang="scss" >    
    .mint-header.is-fixed {
        top: 0;
        right: 0;
        left: 0;
        position: fixed;
        z-index: 99;
    }
    .mint-header{
        height: 2.2rem;
    }
    .mint-header-title{
        font-size: 0.9rem;
    }
</style>