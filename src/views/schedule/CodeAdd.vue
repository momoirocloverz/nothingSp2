<template>
  <div class="code-add">
    <mt-header title="加入排班-日结" class="page-title">
      <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
    </mt-header>

    <div class="page-content">
      <div class="code-content">
        <p class="code-tip">请输入验证码</p>
        <div class="code-panel" @click="handleClick">
          <input class="code-input" type="number" maxlength="6" v-model="code" ref="code-input">
          <div class="code-item" :class="{active: code.length==0}">{{code[0]==undefined?'':code[0]}}</div>
          <div class="code-item" :class="{active: code.length==1}">{{code[1]==undefined?'':code[1]}}</div>
          <div class="code-item" :class="{active: code.length==2}">{{code[2]==undefined?'':code[2]}}</div>
          <div class="code-item" :class="{active: code.length==3}">{{code[3]==undefined?'':code[3]}}</div>
          <div class="code-item" :class="{active: code.length==4}">{{code[4]==undefined?'':code[4]}}</div>
          <div class="code-item" :class="{active: code.length==5 && !code[5]}">{{code[5]==undefined?'':code[5]}}</div>
        </div>
        <p class="desc">请向项目经理或班组长获取6位验证码</p>

        <div class="join-btn" @click="handleJoin">加入</div>
      </div>

      <p class="schedule-info" v-for="item of applyList">
        <span class="schedule-name">{{item.schedulingName}}</span>
        <span class="schedule-time">{{item.createdAt.substring(0, 10)}}</span>
        <span class="schedule-headman">班组长：{{item.foremanName}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeAdd',
  components: {},
  data() {
    return {
      code: '',
      applyList: []
    };
  },

  computed: {
  },

  mounted() {
    this.$refs["code-input"].focus()
    this.$indicator.close()
    this.getList()
    this.handleKeyboard()
  },
  watch: {
    code(val, old) {
      if (String(val).length >= 6) {
        this.$refs["code-input"].blur()
      }
    }
  },
  methods: {
    handleBack() {
      this.$router.go(-1)
    },
    handleKeyboard() {
      this.$nextTick(() => {
        document.querySelector('body').scrollTop = 0
      })
    },
    handleClick() {
      this.$refs["code-input"].focus()
    },
    handleJoin() {
      if (this.code.length == 0) {
        return this.$toast('请填写验证码')
      }
      let param = {
        code: this.code
      }
      this.$indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$api.applyByCode(param)
        .then(res => {
          if (res.data.respCode == 0) {
            this.$router.push({ name: 'addsuccess' })
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.$indicator.close()
        })
    },
    getList() {
      this.$api.applyListTalent()
        .then(res => {
          this.applyList = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
}
</script>
<style lang='scss' scoped>
$design_width: 375;
@function convertToVw($size: 0) {
  @return (($size * 100 / $design_width) + vw);
}
.code-add {
  .page-title {
    height: convertToVw(44);
    font-size: convertToVw(17);
    line-height: convertToVw(44);
    border-bottom: 1px solid #d9d9d9;
  }
  min-height: 100vh;
  background-color: #f5f5f5;
  .code-content {
    padding: convertToVw(32) convertToVw(18) convertToVw(28);
    background-color: #fff;
  }
  .code-panel {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin: auto;
  }
  .code-tip {
    font-size: convertToVw(19);
    color: #1e1f21;
    padding-bottom: convertToVw(18);
  }
  .code-input {
    position: absolute;
    width: 100%;
    height: 100%;
    text-indent: -999em;
    margin-left: -100%;
    background-color: transparent;
    opacity: 0;
    z-index: 20;
  }
  .code-item {
    position: relative;
    box-sizing: border-box;
    width: convertToVw(46);
    height: convertToVw(56);
    font-size: convertToVw(28);
    line-height: convertToVw(56);
    text-align: center;
    color: #4b4d52;
    background-color: #f5f5f5;
    border: 1px solid #d9d9d9;
  }
  .active::after {
    position: absolute;
    content: "";
    display: block;
    width: 1px;
    height: convertToVw(26);
    background-color: #ea441a;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .desc {
    padding: convertToVw(22) 0 convertToVw(16);
    font-size: convertToVw(13);
    color: #6e7075;
  }
  .join-btn {
    height: convertToVw(48);
    font-size: convertToVw(17);
    line-height: convertToVw(48);
    text-align: center;
    color: #fff;
    background-color: #ea441a;
  }
  .schedule-info {
    padding: 0 convertToVw(20);
    margin-top: convertToVw(14);
    font-size: convertToVw(13);
    display: flex;
    justify-content: space-between;
    //align-items: center;
    overflow: hidden;
    background-color: #fff;
    color: #1e1f21;
    span {
      float: left;
    }
    .schedule-name {
      display: inline-block;
      width: convertToVw(120);
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: convertToVw(20);
      vertical-align: middle;
      align-self: center;
    }
    .schedule-time {
      line-height: convertToVw(46);
      vertical-align: middle;
    }
    .schedule-headman {
      float: right;
      vertical-align: middle;
      align-self: center;
    }
  }
}
</style>