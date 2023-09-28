// tabs.ts
 
 
import { ActionContext } from "vuex"
import { RootState } from "@/store"
 
 
// 定义单个tab的类型
interface ITab{
    title:string,
    path:string
}
// 定义tabs模块下的，state的类型
export type TabsState = {
    tabLists: Array<ITab>
}
// 定义tabs模块下的state
export const state: TabsState = {
    tabLists:[],
}
// 定义tabs模块下的mutations
export const mutations = {
    addTab(state:TabsState, tab: ITab):void{
        if(state.tabLists.some(item => item.path === tab.path)){return}
        state.tabLists.push(tab);
    }
}
// 定义tabs模块下的actions
export const actions = {
    addAsyncTabs({commit}:ActionContext<TabsState,RootState>,tab:ITab){
        if(state.tabLists.some(item => item.path === tab.path)){return}
        state.tabLists.push(tab);
    }
}
// 定义tabs模块下的getters
export const getters = {
    getTabs(state:TabsState){
        return state.tabLists
    }
}
 
 
export default {
    namespaced:true, // 声明命名空间
    state,
    mutations,
    actions,
    getters
}