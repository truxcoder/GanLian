import request from '@/utils/request'

export function getAppraisalList(params) {
  return request({
    url: '/appraisal/list',
    method: 'get',
    params
  })
}

export function appraisalDetail(data) {
  return request({
    url: '/appraisal/detail',
    method: 'post',
    data
  })
}

export function appraisalAdd(data) {
  return request({
    url: '/appraisal/add',
    method: 'post',
    data
  })
}

export function appraisalUpdate(data) {
  return request({
    url: '/appraisal/update',
    method: 'post',
    data
  })
}
export function appraisalDelete(data) {
  return request({
    url: '/appraisal/delete',
    method: 'post',
    data
  })
}
