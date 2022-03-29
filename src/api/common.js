/*
 * @Author: truxcoder
 * @Date: 2022-03-21 19:47:58
 * @LastEditTime: 2022-03-21 19:53:54
 * @LastEditors: truxcoder
 * @Description: 更通常的请求
 */

import service from '@/utils/common_request'

export function truxGet(baseURL, obj, act, data, params) {
  const url = act ? '/' + obj + '/' + act : '/' + obj

  return service({
    baseURL,
    url,
    method: 'post',
    data,
    params
  })
}
