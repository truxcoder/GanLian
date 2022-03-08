/*
 * @Author: truxcoder
 * @Date: 2022-03-07 17:30:09
 * @LastEditTime: 2022-03-07 19:04:03
 * @LastEditors: truxcoder
 * @Description: 日期相关函数
 */

import dayjs from 'dayjs'

/**
 * @description: 把表单中所有的零值时间字段设为null，便于element时间框显示
 * @param {object} form
 * @param {array} fields
 * @return {*}
 */
export function setDateFieldNull(form, fields) {
  if (!fields || !Array.isArray(fields)) {
    console.log('setDataField error: 传入的field参数不是数组')
    return
  }
  fields.forEach(item => {
    form[item] = dayjs(form[item]).year() !== 1 ? form[item] : null
  })
}

/**
 * @description: 把表单中所有的null时间字段设为零值 + 1秒，便于Gorm接收更新
 * @param {object} form
 * @param {array} fields
 * @return {*}
 */
export function setDateFieldZero(form, fields) {
  if (!fields || !Array.isArray(fields)) {
    console.log('setDataField error: 传入的field参数不是数组')
    return
  }
  const firstDay = new Date('0001-01-01T00:00:01Z')
  fields.forEach(item => {
    form[item] = form[item] ? form[item] : firstDay
  })
}
