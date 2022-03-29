/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-03-21 19:36:18
 * @LastEditors: truxcoder
 * @Description:
 */
module.exports = {
  title: '干部管理和廉洁从政',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,
  // 后端服务器地址
  // serverURL: 'http://30.29.2.218:9090',
  serverURL: process.env.NODE_ENV === 'development' ? 'http://30.29.2.218:8080' : 'http://30.29.2.65:8080',
  // serverURL: 'http://localhost:9090',
  // 大数据中心地址
  centerURL: 'http://30.29.2.6:8686/cas/login',
  // 本系统部署地址
  URL: process.env.NODE_ENV === 'development' ? '30.29.2.218:9528' : '30.29.2.65',
  // URL: '30.29.2.218:9528',
  // URL: 'localhost:9528',
  // 静态资源地址
  staticURL: 'http://30.29.2.67/static/',
  uploadURL: 'http://30.29.2.67:5000'
}
