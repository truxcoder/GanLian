/*
 * @Author: truxcoder
 * @Date: 2022-03-22 16:56:26
 * @LastEditTime: 2022-07-19 16:31:02
 * @LastEditors: truxcoder
 * @Description: 网络相关
 */
const os = require('os')

export function getLocalIP() {
  let ip = ''
  for (const interfaces of Object.values(os.networkInterfaces())) {
    const temp = interfaces.filter(i => i.family === 'IPv4' && i.address !== '127.0.0.1')
    if (temp.length > 0) {
      ip = temp[0]?.address
    }
  }
  return ip
}
