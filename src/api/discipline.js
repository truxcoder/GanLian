/*
 * @Author: truxcoder
 * @Date: 2021-12-22 15:13:25
 * @LastEditTime: 2022-01-05 15:42:47
 * @LastEditors: truxcoder
 * @Description:
 */
import request from '@/utils/request'

export function disciplineList(data, params) {
  return request({
    url: '/discipline/list',
    method: 'post',
    data,
    params
  })
}

export function disciplineDetail(data) {
  return request({
    url: '/discipline/detail',
    method: 'post',
    data
  })
}

export function disciplineAdd(data) {
  return request({
    url: '/discipline/add',
    method: 'post',
    data
  })
}

export function disciplineUpdate(data) {
  return request({
    url: '/discipline/update',
    method: 'post',
    data
  })
}
export function disciplineDelete(data) {
  return request({
    url: '/discipline/delete',
    method: 'post',
    data
  })
}

export function disDictList(data) {
  return request({
    url: '/dis_dict/list',
    method: 'post',
    data
  })
}

export function disDictAdd(data) {
  return request({
    url: '/dis_dict/add',
    method: 'post',
    data
  })
}

export function disDictUpdate(data) {
  return request({
    url: '/dis_dict/update',
    method: 'post',
    data
  })
}
export function disDictDelete(data) {
  return request({
    url: '/dis_dict/delete',
    method: 'post',
    data
  })
}
