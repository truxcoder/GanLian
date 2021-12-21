/*
 * @Author: truxcoder
 * @Date: 2021-12-14 11:26:22
 * @LastEditTime: 2021-12-20 11:15:00
 * @LastEditors: truxcoder
 * @Description:
 */
import request from '@/utils/request'

export function permissionList(data) {
  return request({
    url: '/permission/list',
    method: 'post',
    data
  })
}

export function permissionManage(data, params) {
  return request({
    url: '/permission/manage',
    method: 'post',
    data,
    params
  })
}

export function permissionAdd(data) {
  return request({
    url: '/permission/add',
    method: 'post',
    data
  })
}

export function permissionUpdate(data) {
  return request({
    url: '/permission/update',
    method: 'post',
    data
  })
}
export function permissionDelete(data) {
  return request({
    url: '/permission/delete',
    method: 'post',
    data
  })
}

export function permissionCheck(data) {
  return request({
    url: '/permission/check',
    method: 'post',
    data
  })
}
