import request from '@/utils/request'

export function getOrganList(params) {
  return request({
    url: '/organ/list',
    method: 'get',
    params
  })
}

export function organAdd(data) {
  return request({
    url: '/organ/add',
    method: 'post',
    data
  })
}

export function organUpdate(data) {
  return request({
    url: '/organ/update',
    method: 'post',
    data
  })
}
export function organDelete(data) {
  return request({
    url: '/organ/delete',
    method: 'post',
    data
  })
}
