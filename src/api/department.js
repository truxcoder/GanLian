import request from '@/utils/request'

export function getDepartmentList(params) {
  return request({
    url: '/department/list',
    method: 'get',
    params
  })
}

export function getOrganList(params) {
  return request({
    url: '/department/organ',
    method: 'get',
    params
  })
}

export function updateDeptOrder(data) {
  return request({
    url: '/department/order',
    method: 'post',
    data
  })
}
export function updateDepartment(data) {
  return request({
    url: '/department/update',
    method: 'post',
    data
  })
}
