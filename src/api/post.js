import request from '@/utils/request'

export function getPostList(params) {
  return request({
    url: '/post/list',
    method: 'get',
    params
  })
}
export function postDetail(data) {
  return request({
    url: '/post/detail',
    method: 'post',
    data
  })
}

export function postAdd(data) {
  return request({
    url: '/post/add',
    method: 'post',
    data
  })
}

export function postUpdate(data) {
  return request({
    url: '/post/update',
    method: 'post',
    data
  })
}
export function postDelete(data) {
  return request({
    url: '/post/delete',
    method: 'post',
    data
  })
}
