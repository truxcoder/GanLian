/*
 * @Author: truxcoder
 * @Date: 2022-05-19 09:53:50
 * @LastEditTime: 2022-06-23 15:25:06
 * @LastEditors: truxcoder
 * @Description: 简历格式化
 */
import dayjs from 'dayjs'

function dateFormat(date, template = 'YYYY年MM月') {
  if (date === '') {
    return '       '
  }
  if (dayjs(date).year() === 1) {
    return ''
  }
  return dayjs(date).format(template)
}

export function formatResume(k, v, resumeList, template = 'YYYY.MM') {
  if ('cum' in v) {
    return ''
  }
  let work = ''
  if ('main' in v) {
    for (let index = k; index < resumeList.length; index++) {
      const element = resumeList[index]
      if (index === k) {
        work = element.organ + element?.dept + element?.post
        continue
      }
      if (!('cum' in element)) {
        break
      }
      if (element.organ === resumeList[index - 1].organ) {
        work = work + '、' + element?.dept + element?.post
      } else {
        work = work + '兼' + element.organ + element?.dept + element?.post
      }
    }
  } else {
    work = v.organ + v?.dept + v?.post
  }
  return dateFormat(v.start, template) + '--' + dateFormat(v.end, template) + '  ' + work
}
