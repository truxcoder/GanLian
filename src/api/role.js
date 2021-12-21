import request from '@/utils/request'

export function roleList(data) {
  return request({
    url: '/role/list',
    method: 'post',
    data
  })
}

export function roleAdd(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function roleUpdate(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}
export function roleDelete(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}

export function roleDictList(data) {
  return request({
    url: '/role_dict/list',
    method: 'post',
    data
  })
}

export function roleDictAdd(data) {
  return request({
    url: '/role_dict/add',
    method: 'post',
    data
  })
}

export function roleDictUpdate(data) {
  return request({
    url: '/role_dict/update',
    method: 'post',
    data
  })
}
export function roleDictDelete(data) {
  return request({
    url: '/role_dict/delete',
    method: 'post',
    data
  })
}
