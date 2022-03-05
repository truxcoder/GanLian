/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-03-04 14:19:59
 * @LastEditors: truxcoder
 * @Description:
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  id: state => state.user.id,
  name: state => state.user.name,
  organ: state => state.user.organ,
  roles: state => state.user.roles,
  perDptMap: state => state.personnel.perDptMap,
  permission_routes: state => state.permission.routes,
  staticURL: state => state.settings.staticURL,
  departments: state => state.department.departments,
  departmentNames: state => state.department.departmentNames,
  roleDict: state => state.role.roleDict,
  organs: state => state.department.departments.filter(item => item.deptType === 1 && item.parentId !== '')
}
export default getters
