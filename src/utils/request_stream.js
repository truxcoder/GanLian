/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-07-19 16:36:25
 * @LastEditors: truxcoder
 * @Description:
 */
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  timeout: 50000,
  method: 'get',
  responseType: 'stream'
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 这里带了自带的请求头，导致请求方法会变成OPTIONS。
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
