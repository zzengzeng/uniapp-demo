import types from './mutation-types'

const mutations = {
  [types.SET_ISLOGIN](state,bool){
    state.isLogin = bool;
  },
  [types.SET_AUTHORIZATION](state,token){
    state.Authorization = token;
  }
}

export default mutations