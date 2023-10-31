import { setLocal } from '@/utils/local';
import axios from 'axios' // 引入
// import { getToken } from '@/utils/token'
import { ElMessage } from 'element-plus';
let baseURL = 'http://8.140.206.30:8011';
import crypto from '@/utils/crypto'
import { createRouter, useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex'
const router = useRouter()
// console.log('process.env.NODE_ENV', process.env.NODE_ENV)

// 这一步的目的是判断出当前是开发环境还是生成环境，方法不止一种，达到目的就行
// if(process.env.NODE_ENV=='development'){
//   baseURL=''
// }else{
//   baseURL=''
// }
const userinfo = window.location.search.replace('?code=', '')
const USER_INFO = crypto.decrypt(userinfo.replace('#', ''))


const config = {
    baseURL: baseURL,
    // 因为跨域了，所以这里如果写的话会自动拼接，会有两份，所以隐藏了
    timeout: 30000 // 设置最大请求时间
}
const _axios = axios.create(config)

// /* 请求拦截器（请求之前的操作） */
_axios.interceptors.request.use(
    config => {
        // 如果有需要在这里开启请求时的loading动画效果
        // config.headers.Authorization = getToken  //添加token,需要结合自己的实际情况添加，
        // config.params.userID = USER_INFO ? JSON.parse(USER_INFO).userId : ''
        let Data = ''
        if (config.params) {
            // config.params.userID = JSON.parse(USER_INFO).userId
        } else {
            // console.log('config.data', config.data)
            // config.data ? Data = (config.data).userID : ''
            // config.data = JSON.stringify(Data)
        }
        return config
    },
    err => Promise.reject(err)
)
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
                resolve(res.data)
                return res
            }).catch(error => {
                reject(error)
            })
        })
    }
}

// 暴露所写的内容
export default http

