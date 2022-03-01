/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-02-28 19:55:41
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  title: { type: 'STRING', label: '名称', order: 1 },
  name: { type: 'STRING', label: '标签', order: 2 },
  rank: { type: 'NUMBER', label: '网站级别', order: 3 },
  path: { type: 'STRING', label: '路径', order: 4 },
  param: { type: 'STRING', label: '路由参数', order: 5 },
  component: { type: 'STRING', label: '组件', order: 6 },
  redirect: { type: 'BOOLEAN', label: '重定向', order: 7 },
  icon: { type: 'STRING', label: '图标', order: 8 },
  parent: { type: 'STRING', label: '父模块', order: 9 },
  order: { type: 'NUMBER', label: '排序', order: 10 }
}
