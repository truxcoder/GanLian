import request from '@/utils/request'

export function getPositionList(params) {
  return request({
    url: '/position/list',
    method: 'get',
    params
  })
}

export function positionAdd(data) {
  return request({
    url: '/position/add',
    method: 'post',
    data
  })
}

export function positionUpdate(data) {
  return request({
    url: '/position/update',
    method: 'post',
    data
  })
}
export function positionDelete(data) {
  return request({
    url: '/position/delete',
    method: 'post',
    data
  })
}
