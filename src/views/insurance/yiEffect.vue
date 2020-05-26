<template>
    <div>
        <!-- <button @click="openPicker">123</button> -->
        <p class="id3_p" @click="openPicker">日期<i></i></p>
        <mt-datetime-picker
                ref="picker"
                type="date"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                cancel-text="不限"
                :startDate="startDate"
                :endDate="endDate"
                @cancel="handleCancel"
                @confirm="handleConfirm">
        </mt-datetime-picker>
        <div style="background: #ffffff;margin-bottom:15px;height: 6.7rem;display: flex;flex-direction: column;"
             v-for="item in dataList2" @click="goToCheckImg">
            <div class="BZ">
                <p class="p-pos">人身意外险 <span class="span-posa">查看细则</span></p>
                <p><span>被保人：</span><span>{{item.talentName}}</span></p>
                <p><span>保障时间：</span><span>{{item.policyTime}}</span></p>
                <p><span>保单号：</span><span>{{item.policyNo}}</span></p>
            </div>
            <!-- <div class="btn">
                <span></span>
                <button>拨打理赔电话</button>
            </div> -->
        </div>
        <div style="margin-top:80px;margin-left:150px;font-size:13px;color:#6E7075;"
             v-if="dataList2.length==0?true:false">暂无相关信息
        </div>
    </div>
</template>
<script>
    // new Date().getFullYear()+'-'+((new Date().getMonth+1).toString().length==1?'0'+(new Date().getMonth+1):(new Date().getMonth+1))+'-01'
    export default {
        data() {
            return {
                talentId: '',
                dataList2: [],
                pickerVisible: true,
                lastTime: '',
                startDate: new Date('2019-06-01'),
                endDate: new Date()
            }
        },
        mounted() {
            this.getData2()
        },
        methods: {
            getData2() {
                const params = {
                    policyStatus: 2,
                    talentId: this.talentId,
                    startDate: this.lastTime,
                    endDate: this.lastTime
                }
                this.$api.insuList(params).then(res => {
                    //   console.log(res)
                    if (res.data.respCode == 0) {
                        if (res.data.data) {
                            this.dataList2 = res.data.data.list || []
                        }
                    }
                }).catch()
            },
            goToCheckImg() {
                this.$router.push({name: 'checkImg'})
            },
            openPicker() {
                this.$refs.picker.open();
            },
            handleConfirm(value) {
                console.log(value)
                const d = new Date(value)
                this.lastTime = d.getFullYear() + '-' + ((d.getMonth() + 1).toString().length == 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + (d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate())
                console.log(this.lastTime)
                this.getData2()
            },
            handleCancel() {
                this.talentId = ''
                this.lastTime = ''
                this.getData2()
            }
        },
        created() {
            this.talentId = JSON.parse(sessionStorage.getItem('userInfo')).talentId
        }
    }
</script>
<style>
    .BZ {
        /* height: 6.7rem; */
        padding: 1rem 0 0 0.75rem;
        box-sizing: border-box;
        background: #ffffff;
    }

    .BZ p {
        color: #1E1F21;
    }

    .btn {
        padding: 1.1rem 0.75rem;
        height: 2.75rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .btn button {
        padding: 0.3rem 0.6rem;
        border: 0.05rem solid rgba(213, 61, 23, 1);
        border-radius: 0.15rem;
        color: #D53D17;
        background: #ffffff;
        /* margin-top: 0.6rem; */
    }

    .BZ p:first-child {
        font-size: 0.85rem;
    }

    .BZ p:nth-child(2), .BZ p:nth-child(3) {
        margin: 0.4rem 0;
    }

    .BZ p:nth-child(2) span:first-child, .BZ p:nth-child(3) span:first-child, .BZ p:nth-child(4) span:first-child {
        color: #6E7075;
        font-size: 0.65rem;
    }

    .BZ p:nth-child(2) span:last-child, .BZ p:nth-child(3) span:last-child, .BZ p:nth-child(4) span:last-child {
        font-size: 0.65rem;
    }

    /* .BZ p:last-child{
        border-bottom: 0.05rem solid #D9D9D9;
        padding-bottom: 16px;
    } */
    .id3_p {
        padding: 0.5rem 0 0.5rem 0.75rem;
        background: #ffffff;
        border-top: 0.05rem solid #D9D9D9;
        border-bottom: 0.05rem solid #D9D9D9;
        color: #6E7075;
        margin-bottom: 0.5rem;
        position: relative;
    }

    .id3_p i {
        display: inline-block;
        width: 0.35rem;
        height: 0.25rem;
        background-image: url(../../assets/img/down1.png);
        background-size: cover;
        position: absolute;
        top: 0.9rem;
        left: 2.5rem;
    }
</style>
