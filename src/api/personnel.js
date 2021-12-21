import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}
export function personnelList(data, params) {
  return request({
    url: '/personnel/list',
    method: 'post',
    data,
    params
  })
}
export function personnelDetail(params) {
  return request({
    url: '/personnel/detail',
    method: 'get',
    params
  })
}
export function personnelAdd(data) {
  return request({
    url: '/personnel/add',
    method: 'post',
    data
  })
}
export function personnelUpdate(data) {
  return request({
    url: '/personnel/update',
    method: 'post',
    data
  })
}
export function personnelDelete(data) {
  return request({
    url: '/personnel/delete',
    method: 'post',
    data
  })
}

export function personnelSearch(data, params) {
  return request({
    url: '/personnel/search',
    method: 'post',
    data,
    params
  })
}
export function personnelSearchName(data) {
  return request({
    url: '/personnel/searchName',
    method: 'post',
    data
  })
}

export function getPersonnelName() {
  return request({
    url: '/personnel/nameList',
    method: 'get'
  })
}
