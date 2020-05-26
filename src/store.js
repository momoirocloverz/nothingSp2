import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    talentName: '', // 零工姓名
    industry: '', // 工种
    schedulingEmpId: 0,
    punchId: 0,
    schedulingId: 0,
    startTime: '',
    endTime: '',
    endType: 1, // 1当日 2次日
    pieceSize: {
      jian: '',
      dai: '',
      che: '',
      dun: ''
    },
    currentIndustry: '',
      haveInComeFlag: localStorage.getItem('haveInComeFlag') ? JSON.parse(localStorage.getItem('haveInComeFlag') ) : false,
  },
  getters:{
      getHaveInComeFlag :(state) => {
          return state.haveInComeFlag;
      },
  },
  mutations: {
      changeHaveInComeFlag(state,payload){
          state.haveInComeFlag = payload;
      },
    SET_SCHEDULE(state, payload) {
      state.talentName = payload.talentName
      state.industry = payload.industry
      state.schedulingEmpId = payload.schedulingEmpId
      state.punchId = payload.punchId
      state.schedulingId = payload.schedulingId
      state.startTime = payload.startTime
      state.endTime = payload.endTime
      state.endType = payload.endType
      state.pieceSize.jian = payload.pieceSize && payload.pieceSize.jian
      state.pieceSize.dai = payload.pieceSize && payload.pieceSize.dai
      state.pieceSize.che = payload.pieceSize && payload.pieceSize.che
      state.pieceSize.dun = payload.pieceSize && payload.pieceSize.dun
    },
    RESET_SCHEDULE(state) {
      state.talentName = ''
      state.industry = ''
      state.schedulingEmpId = 0
      state.punchId = 0
      state.schedulingId = 0
      state.startTime = ''
      state.endTime = ''
      state.endType = 1
      state.pieceSize.jian = ''
      state.pieceSize.dai = ''
      state.pieceSize.che = ''
      state.pieceSize.dun = ''
    },
    SET_CURRENTINDUSTRY(state, payload) {
      state.currentIndustry = payload.currentIndustry
    }
  },
  actions: {
    set_schedule({
      commit
    }, payload) {
      commit('SET_SCHEDULE', payload)
    },
    reset_schedule({
      commit
    }) {
      commit('RESET_SCHEDULE')
    },
    set_currentindustry({
      commit
    }, payload) {
      commit('SET_CURRENTINDUSTRY', payload)
    }
  }
})