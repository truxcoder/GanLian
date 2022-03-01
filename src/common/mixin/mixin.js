/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-02-28 16:04:48
 * @LastEditors: truxcoder
 * @Description:
 */
import dayjs from 'dayjs'
export const common_mixin = {
  filters: {
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
      const endDate = new Date(date)
      const now = new Date()
      if (endDate > now) {
        return '今'
      }
      return dayjs(date).format('YYYY年MM月DD日')
    },
    boolFilter(bool) {
      return bool === 2 ? '是' : '否'
    }
  }
}
