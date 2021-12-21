import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
export function getAssetList(params) {
  return request({
    url: '/vue-admin-template/asset/list',
    method: 'get',
    params
  })
}
