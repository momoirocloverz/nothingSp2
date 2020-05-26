<template>
  <div class="identify-success">
    <mt-header class="page-header" title="身份认证成功">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>
    <div class="page-content">
      <mt-cell title="姓名">
        <span>{{form.realName}}</span>
      </mt-cell>
      <mt-cell title="身份证号">
        <span>{{form.idCard}}</span>
      </mt-cell>
      <!--<mt-cell title="状态">-->
        <!--<span class="fs">{{form.status == 1 ? '待认证' : '已认证'}}</span>-->
      <!--</mt-cell>-->
      <mt-cell title="性别">
        <span>{{form.sexName}}</span>
      </mt-cell>
      <mt-cell title="出生日期">
        <span>{{form.birthday}}</span>
      </mt-cell>
      <mt-cell title="民族">
        <span>{{form.nation}}</span>
      </mt-cell>
      <mt-cell title="户籍地址">
        <span>{{form.originAddress}}</span>
      </mt-cell>
      <div class="pt10" style="background-color: #f5f5f5"></div>
      <mt-cell title="现住城市">
        <span>{{form.province + ' ' +form.city}}</span>
      </mt-cell>
      <mt-cell title="现住详细地址">
        <span>{{form.region+ ' ' +form.address}}</span>
      </mt-cell>
      <mt-cell title="紧急联系人">
        <span>{{form.talentContacts[0].contactName}}</span>
      </mt-cell>
      <mt-cell title="紧急联系人电话">
        <span>{{form.talentContacts[0].phone}}</span>
      </mt-cell>
      <mt-cell title="紧急联系人关系">
        <span>{{form.talentContacts[0].relationship}}</span>
      </mt-cell>
    </div>
  </div>
</template>

<script>
// 身份信息填写完成，展示信息
export default {
  name: 'IdentifySuccess',
  data() {
    return {
      id: 0,
      form: {}
    }
  },
  mounted() {
    this.getParams()
    this.fetchUserInfo()
  },
  methods: {
    handleBack() {
      // this.$router.push({ name: 'userregister' })
      this.$router.go(-1);
    },
    getParams() {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {}
      if (userInfo.userId) {
        this.id = userInfo.userId
      } else {
        this.$messagebox.alert('没有获取到用户信息', '错误提示')
        return
      }
    },
    fetchUserInfo() {
      const params = {
        id: this.id
      };
      this.$api
        .getUserInfo(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.form = response.data.data
            this.form.sexName = response.data.data.sexName || (response.data.data.sex == 1 ? '男' : '女')
          }
        })
        .catch(error => {
          this.$messagebox.alert(error, '错误提示')
          console.log(error)
        });
    }
  }
}
</script>

<style lang="scss" >
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.identify-success {
  .mint-cell-wrapper{
    background-image: none;
    .mint-cell-title{
      min-width:7rem;
    }
  }
  /deep/.mint-header {
    font-size: convertToVw(16);
    line-height: convertToVw(44);
  }
  .page-content {
    /*padding: 0 convertToVw(10);*/
  }
  /deep/.mint-cell {
    padding-right: convertToVw(16);
    font-size: convertToVw(16);
    border-bottom: 1px solid #f2f2f5;
  }
  /deep/.mint-cell-text {
    font-size: convertToVw(16);
    color: #333;
  }
}
</style>