<template>
    <div>
        <mt-header
      title="选择位置"
      fixed
      class="mint-header-title
"
    >
      <router-link
        to=""
        slot="left"
      >
        <mt-button icon="back" @click="$router.go(-1)"></mt-button>
      </router-link>
    </mt-header>
    <div>
        <baidu-map class="mapDemo"
               :scroll-wheel-zoom="true"
               :center="center"
               :zoom="zoom"
               @ready="handler">
    </baidu-map>
    </div>
    </div>
</template>
<script>
export default {
  name: 'Map',
  data() {
    return {
        // center: {lng: 120.21937542, lat:30.25924446},
        center: {lng: $route.query.latitude, lat:$route.query.longitudes},
                zoom: 15
    }
  },
  mounted () {
    // this.center = {
    //   lng:this.$route.query.latitude,
    //   lat:this.$route.query.longitudes,
    // }
  }
}
</script>
<style scoped>
.mapDemo {
        width: 100%;
        height: 500px;
    }
</style>
