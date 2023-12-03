import { setLocal } from '@/utils/local';
import axios from 'axios' // 引入
import axiosRetry from 'axios-retry' // 引入
// import { getToken } from '@/utils/token'
import { ElMessage } from 'element-plus';
let baseURL = 'http://8.140.206.30:8099';
import crypto from '@/utils/crypto'

const userinfo = window.location.search.replace('?code=', '')
const USER_INFO = crypto.decrypt(userinfo.replace('#', ''))

const config = {
    baseURL: baseURL,
    // 因为跨域了，所以这里如果写的话会自动拼接，会有两份，所以隐藏了
    timeout:  5*60*1000, // 设置最大请求时间
    retry: 0, //设置全局重试请求次数（最多重试几次请求）
    retryDelay: 1000, //设置全局请求间隔

}

const _axios = axios.create(config)

axiosRetry(_axios, { retries: 0 });
axios.defaults.retry = 0
axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
// /* 请求拦截器（请求之前的操作） */
// _axios.interceptors.request.use(
//     config => {
//         // 如果有需要在这里开启请求时的loading动画效果
//         // config.headers.Authorization = getToken  //添加token,需要结合自己的实际情况添加，
//         return config
//     },
//     err => Promise.reject(err)
// )
// params.userID = USER_INFO ? JSON.parse(USER_INFO).userId : ''
// /* 请求之后的操作 */
_axios.interceptors.response.use((res) => {
    // 在这里关闭请求时的loading动画效果
    // 这里用于处理返回的结果，比如如果是返回401无权限，可能会是跳回到登录页的操作，结合自己的业务逻辑写
    // 一定结合自己的后端的返回代码进行操作
    // if (res.data.code === 401) {
    //   console.log('无权限操作')
    // }
    if (res.data.OK == 'False') {
        ElMessage({
            showClose: true,
            message: res.data.Message,
            type: 'error',
        })
    }

    return res
},
    err => {
        if (err) {
            // 在这里关闭请求时的loading动画效果
            ElMessage({
                showClose: true,
                message: err,
                type: 'error',
            })
        }
        return Promise.reject(err)
    }
)

// 封装post,get方法
// 按理来说应该也可以封装其他的方法

const http = {
    get(url = '', params = {}) {
        return new Promise((resolve, reject) => {
            _axios({
                url,
                params,
                headers: {
                    'SwisinToken': USER_INFO ? JSON.parse(USER_INFO).userId : '',
                },
                method: 'GET'
            }).then(res => {
                resolve(res.data)
                return res
            }).catch(error => {
                reject(error)
            })
        })
    },
    post(url = '', params = {}) {
        return new Promise((resolve, reject) => {
            _axios({
                url,
                data: params,
                headers: {
                    'SwisinToken': USER_INFO ? JSON.parse(USER_INFO).userId : '',
                },
                method: 'POST'
            }).then(res => {
                //console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '成功返回')
                resolve(res.data)
              
                return res
            }).catch(error => {
                //console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '失败返回',error)
                reject(error)
            })
        })
    }
}
// 暴露所写的内容
export default http

