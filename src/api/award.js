import request from '@/utils/request'

export function awardList(data, params) {
  return request({
    url: '/award/list',
    method: 'post',
    data,
    params
  })
}

export function awardDetail(data) {
  return request({
    url: '/award/detail',
    method: 'post',
    data
  })
}

export function awardAdd(data) {
  return request({
    url: '/award/add',
    method: 'post',
    data
  })
}

export function awardUpdate(data) {
  return request({
    url: '/award/update',
    method: 'post',
    data
  })
}
export function awardDelete(data) {
  return request({
    url: '/award/delete',
    method: 'post',
    data
  })
}
