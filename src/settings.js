/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-10-26 17:56:21
 * @LastEditors: truxcoder
 * @Description:
 */
module.exports = {
  title: '机构编制与干部管理',
  fixedHeader: true,
  sidebarLogo: true,
  // 后端服务器地址
  serverURL: process.env.NODE_ENV === 'development' ? 'http://39.194.233.2:8080' : 'http://30.29.2.65:8080',
  // 大数据中心地址
  centerURL: 'http://30.29.2.6:8686/cas/login',
  // 本系统部署地址
  URL: process.env.NODE_ENV === 'development' ? '39.194.233.2:9528' : '30.29.2.65',
  // 静态资源地址
  staticURL: 'http://30.29.2.67/static/',
  uploadURL: 'http://30.29.2.67:5000'
}
