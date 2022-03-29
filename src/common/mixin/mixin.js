/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-03-16 21:35:07
 * @LastEditors: truxcoder
 * @Description:
 */
import dayjs from 'dayjs'
import { getAge } from '@/utils/index'
export const common_mixin = {
  filters: {
    ageFilter(age) {
      return getAge(dayjs(age).format('YYYY-MM-DD'))
    },
    dateFilter(date) {
      if (dayjs(date).year() === 2100) {
        return '今'
      }
      return dayjs(date).format('YYYY年MM月DD日')
    },
    deadlineFilter(date) {
      const now = dayjs()
      const diff = dayjs(date).diff(now, 'day')
      if (diff < 0) {
        return '已过'
      }
      return diff + '天'
    },
    dateEndFilter(date) {
      if (date === '') {
        return date
      }
      if (dayjs(date).year() === 1) {
        return '今'
      }
      const endDate = new Date(date)
      const now = new Date()
      if (endDate > now) {
        return '今'
      }
      return dayjs(date).format('YYYY年MM月DD日')
    },
    boolFilter(bool) {
      return bool === 2 ? '是' : '否'
    },
    ynFilter(bool) {
      return bool ? '是' : '否'
    }
  }
}
