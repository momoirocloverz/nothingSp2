<template>
    <div class="wrap-drop">
        <van-dropdown-menu>
            <van-dropdown-item v-model="value1" :title-class="class1" :options="option1"  @change="changeValue(1)"/>
            <van-dropdown-item v-model="value3" :title-class="class3" :title="title3" :options="option3" @change="changeValue(3)"/>
            <van-dropdown-item v-model="value2" :title-class="class2" :title="title2" :options="option2" @change="changeValue(2)"/>
            <van-dropdown-item v-model="value4" :title-class="class4" :title="title4" :options="option4" @change="changeValue(4)"/>
        </van-dropdown-menu>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { DropdownMenu, DropdownItem } from 'vant';
    import 'vant/lib/index.css';
    Vue.use(DropdownMenu).use(DropdownItem);

    export default {
        name: "dropdownMenu",
        data() {
            return {
                value1: '0',
                value2: '',
                value3: '',
                value4: '',
                class1:'',
                class2:'',
                class3:'',
                class4:'',
                title2: '工种',
                title3: '性别',
                title4: '计价方式',
                option1: [
                    { text: '离我最近', value: '0' },
                    { text: '最新发布', value: '1' },
                    { text: '最快开工', value: '2' },
                ],
                option2: [
                    { text: '不限', value: '' },
                ],option3: [
                    { text: '不限', value: ''},
                    { text: '男女皆可', value: '3'},
                    { text: '男', value: '1' },
                    { text: '女', value: '2' }
                ],
                option4: [
                    { text: '不限', value: '' },
                    { text: '计时', value: '1' },
                    { text: '计量', value: '2' },
                    { text: '计时+计量', value: '3' },
                    { text: '日固定', value: '4' },
                ]
            }
        },
        mounted(){
            this.industry()
        },
        methods:{
            changeValue(val){
                switch (Number(val)) {
                    case 1:
                        this.class1 = 'cg-is-active1';
                        break;
                    case 2:
                        this.class2 = 'cg-is-active2';
                        if(this.value2 === ''){
                            this.title2 = '工种'
                        }else{
                            this.title2 = ''
                        }
                        break;
                    case 3:
                        this.class3 = 'cg-is-active3';
                        if(this.value3 === ''){
                            this.title3 = '性别'
                        }else{
                            this.title3 = ''
                        }
                        break;
                    case 4:
                        this.class4 = 'cg-is-active4';
                        if(this.value4 === ''){
                            this.title4 = '计价方式'
                        }else{
                            this.title4 = ''
                        }
                        break;
                }
                this.$emit('screenMenu',{
                    valuationType:this.value4,//智能排序
                    industry:this.value2, //工种
                    loginTalentSex:this.value3,//性别
                    orderType:this.value1,//计价方式
                })
            },
            industry(){
                this.$api.getIndustryInfo().then(res=>{
                    this.option2 = [
                        { text: '不限', value: '' },
                    ];
                    if(res.data.respCode == 0){
                        let result = Array.from(res.data.data);
                        for(let item of result){
                            this.option2.push({text:item.industryName,value:item.industry})
                        }
                    }
                    console.log(res)
                }).catch(err=>{
                    console.log('err',err)
                })
            }
        }
    }
</script>

<style lang="scss">
    .wrap-drop{
        .cg-is-active1,.cg-is-active2,.cg-is-active3,.cg-is-active4{
            color: #E95A34;
        }
        .van-dropdown-menu__item{
            flex: none;
            min-width: 22%;
        }
        .van-dropdown-menu__title--active{
            color: #E95A34;
        }
        .van-dropdown-item__icon{
            /*color:#1989fa;*/
        }
    }
</style>