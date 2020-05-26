<template>
    <div class="pt40">
        <mt-header :title="title"
                   fixed
                   class="mint-header-title">
            <div slot="left">
                <mt-button
                        icon="back"
                        @click="$router.go(-1)"
                ></mt-button>
            </div>
        </mt-header>
        <div class="pro-body">
            <div v-html="msg"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "",
        components: {},
        data() {
            return {
                msg:"",
                type:'',
                title:'',
            }
        },
        mounted(){
            this.type = this.$route.query.type;
            this.title = this.$route.query.title;
            localStorage.setItem('selected',this.$route.query.type)
            this.getUserAgreement()
        },
        methods: {
            getUserAgreement(){
                let _this = this;
                this.$api.userAgreement({}).then(res=>{
                    if(res.data.respCode == 0){
                        let result = Array.from(res.data.data);
                        for(let item of result){
                            if(item.title.includes('平台自由职业者') && _this.type == '1'){
                                _this.msg = item.content;
                                _this.title = item.title;
                            }
                            if(item.title.includes('隐私权规定') && _this.type == '2'){
                                _this.msg = item.content;
                                _this.title = item.title;
                            }
                            if(item.title.includes('万才平台注册服务') && _this.type == '3'){
                                _this.msg = item.content;
                                _this.title = item.title;
                            }
                            if(item.title.includes('班务经理服务') && _this.type == '4'){
                                _this.msg = item.content;
                                _this.title = item.title;
                            }
                            if(item.title.includes('安防协议') && _this.type == '5'){
                                _this.msg = item.content;
                                _this.title = item.title;
                            }
                        }
                    }
                    console.log(res);
                })
            }
        }
    }
</script>

<style lang="scss">
    .pt40{
        padding-top: 40px;
    }
    .pro-body{
        padding:0.75rem;
        word-break: break-all;
        white-space: pre-line;
        text-align: justify;
        line-height:1.8;
        pre{
            word-break: break-all;
            white-space: pre-line;
            text-align: justify;
            line-height:1.8;
        }
    }
</style>