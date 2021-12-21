import request from '@/utils/request'

export function getLevelList(params) {
  return request({
    url: '/level/list',
    method: 'get',
    params
  })
}

export function levelAdd(data) {
  return request({
    url: '/level/add',
    method: 'post',
    data
  })
}

export function levelUpdate(data) {
  return request({
    url: '/level/update',
    method: 'post',
    data
  })
}
export function levelDelete(data) {
  return request({
    url: '/level/delete',
    method: 'post',
    data
  })
}
