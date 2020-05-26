<template>
    <div class="message-box" style="width:100%;height:100%">
        <mt-header title="消息" fixed class="mint-header-title">
            <div slot="left">
                <mt-button icon="back" @click="goBack()"></mt-button>
            </div>
        </mt-header>
        <div class="box">
            <mt-navbar v-model="selected" fixed>
                <mt-tab-item id="1">系统消息</mt-tab-item>
                <mt-tab-item id="2">业务推送</mt-tab-item>
            </mt-navbar>
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1">
                    <News v-if="selected == '1'"/>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <Pushs v-if="selected == '2'"/>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
    </div>
</template>
<script>
    import News from './news'
    import Pushs from './pushs'

    export default {
        name: "messageIndex",
        components: {
            News, Pushs
        },
        data() {
            return {
                selected: '1',
            }
        },
        created() {
            this.selected = localStorage.selected || '1';
        },
        methods: {
            goBack() {
                localStorage.selected = '';
                this.$router.go(-1)
            },
        },
    }
</script>
<style scoped lang="scss">
    .box {
        padding-top: convertToVw(46);
        background: #f5f5f5;
        width: 100%;
        height: 100%;
    }
</style>
<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .message-box {
        .mint-navbar {
            height: convertToVw(46);
            border-bottom: 1px solid #D9D9D9;
        }

        .mint-navbar.is-fixed {
            top:convertToVw(40);
        }

        .mint-navbar .mint-tab-item.is-selected {
            margin-bottom: 0;
        }

        .mint-tab-item-label {
            font-size: convertToVw(15);
            line-height: 1.5;
        }
    }
</style>