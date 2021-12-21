import dayjs from 'dayjs'
export const common_mixin = {
  filters: {
    dateFilter(date) {
      if (dayjs(date).year() === 2100) {
        return '今'
      }
      return dayjs(date).format('YYYY年MM月DD日')
    }
  }
}
