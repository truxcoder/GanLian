/*
 * @Author: truxcoder
 * @Date: 2022-03-21 19:47:58
 * @LastEditTime: 2022-07-19 16:38:38
 * @LastEditors: truxcoder
 * @Description: 请求图片流
 */

import service from '@/utils/request_stream'

export function fetchStream(url) {
  return service({
    url
  })
}
