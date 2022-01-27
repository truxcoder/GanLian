/*
 * @Author: truxcoder
 * @Date: 2022-01-12 20:57:50
 * @LastEditTime: 2022-01-13 11:38:38
 * @LastEditors: truxcoder
 * @Description:
 */

import axios from 'axios'
import qs from 'qs'

export function getAuth(data) {
  return axios({
    method: 'POST',
    url: 'http://30.29.2.6:8686/cas/serviceValidate',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    }
  })
}

export function getTest(data) {
  return axios({
    method: 'POST',
    url: 'http://30.29.2.6:8686/unionapi/user/list/json',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    }
  })
}

export function getPhoto(data) {
  return axios({
    method: 'POST',
    url: 'http://30.29.2.6:8686/unionapi/user/headshot',
    data,
    auth: '438019355f6940fba3b98316d97fd5f0',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
