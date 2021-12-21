const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  id: state => state.user.id,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  staticURL: state => state.settings.staticURL,
  departments: state => state.department.departments,
  roleDict: state => state.role.roleDict,
  organs: state => state.department.departments.filter(item => item.deptType === 1 && item.parentId !== '')
}
export default getters
