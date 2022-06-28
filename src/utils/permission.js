/*
 * @Author: truxcoder
 * @Date: 2021-12-20 16:59:39
 * @LastEditTime: 2022-06-21 14:38:48
 * @LastEditors: truxcoder
 * @Description: 权限相关计算函数
 */

/**
 * @description: 对多维数组排列组合。如二维[[a,b,c],[1,2,3]]
 * @param {array} transArr 最外层数组
 * @return {array} [[a,1],[a,2],[a,3],[b,1],[b,2],[b,3],[c,1],[c,2],[c,3]]
 */
export function arrayPermute(transArr) {
  const resultArr = []
  function _get(array, index, val) {
    if (!array[index]) {
      resultArr.push(val)
      return
    }

    array[index].forEach((v, i) => {
      _get(array, index + 1, index === 0 ? [v] : [...val, v])
    })
  }
  _get(transArr, 0)
  return resultArr
}

/**
 * 数组相减
 * @param {array} a
 * @param {array} b
 * @return {array}
 */
export function arrSubtraction(a, b) {
  const a_ = a.map(item => item.toString())
  const b_ = b.map(item => item.toString())
  if (Array.isArray(a_) && Array.isArray(b_)) {
    return a_.filter(i => !b_.includes(i)).map(item => item.split(','))
  }
  throw new new TypeError('arguments must be array')()
}

export function isNormalRole(roles) {
  if (!Array.isArray(roles)) {
    throw TypeError('参数必须为数组')
  }
  return roles.length === 1 && roles[0] === 'normal'
}

