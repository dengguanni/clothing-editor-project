const state = {
    sidebar: '123'
}

const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.sidebar = '2222'

    }
}
const actions = {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    }
}
export default {
    namespaced: true,// 为每个模块添加一个前缀名，保证模块命明不冲突
    state,
    mutations,
    actions
}