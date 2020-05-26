<template>
    <div>
        <mt-header
      title="选择位置"
      fixed
      class="mint-header-title
"
    >
      <router-link
        to="/userInfo"
        slot="left"
      >
        <mt-button icon="back"></mt-button>
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
        center: {lng: 120.21937542, lat:30.25924446},
                zoom: 15
    }
  }
}
</script>
<style scoped>
.mapDemo {
        width: 100%;
        height: 300px;
    }
</style>
