const SET_COLLAPSE = 'SET_COLLAPSE'

const app = {
    state: {
        isCollapsed: false
    },
    mutations:{
        [SET_COLLAPSE](state){
            state.isCollapsed = !state.isCollapsed;
        }
    },
    actions: {
        toogleCollapse({commit}){
            commit('SET_COLLAPSE');
        }
    }
}

export default app