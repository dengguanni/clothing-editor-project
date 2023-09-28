// menu.ts
 
 
import {RootState} from '@/store'
import { ActionContext } from 'vuex';
 
 
// 定义menu模块下的，state的类型
export type MenuState = {
    count:number;
}
 
 
// 定义menu模块下的state
export const state: MenuState = {
    count:0
}
// 定义menu模块下的mutations
export const mutations = {
    setCount(state:MenuState, count:number):void{
        state.count = count
    }
}
// 定义menu模块下的actions
export const actions = {
    setAsyncCount({commit}:ActionContext<MenuState,RootState>){
        setTimeout(() => {
            state.count++
        }, 1000);
    }
}
// 定义menu模块下的getters
export const getters = {
    getCount(state:MenuState){
        return state.count
    }
}
 
 
export default {
    namespaced:true, // 声明命名空间
    state,
    mutations,
    actions,
    getters
}