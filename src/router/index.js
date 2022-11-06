import Vue from 'vue'
import Router from 'vue-router'
import { GetQueryValue, setTicket } from '@/utils/auth'
const defaultSettings = require('@/settings.js')
const ticket = GetQueryValue('ticket')
if (ticket) {
  setTicket(ticket)
  window.location.href = 'http://' + defaultSettings.URL
}

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import TalentLayout from '@/layout/talent'
const Module = () => import('@/views/website/Module')
const Personnel = () => import('@/views/personnel/Personnel')
const Headcount = () => import('@/views/organ/Headcount')
const DepartmentPosition = () => import('@/views/organ/DepartmentPosition')
const Level = () => import('@/views/personnel/Level')
const Position = () => import('@/views/personnel/Position')
const Post = () => import('@/views/personnel/Post')
const Appraisal = () => import('@/views/personnel/Appraisal')
const Award = () => import('@/views/award_and_punish/Award')
const Punish = () => import('@/views/award_and_punish/Punish')
const Discipline = () => import('@/views/incorruption/Discipline')
const Report = () => import('@/views/incorruption/Report')
const Department = () => import('@/views/organ/Department')
const Role = () => import('@/views/system/Role')
const RoleDict = () => import('@/views/system/RoleDict')
const Permission = () => import('@/views/system/Permission')
const Data = () => import('@/views/system/Data')
const DepartmentSync = () => import('@/views/system/DepartmentSync')
const AccountSync = () => import('@/views/system/AccountSync')
const EduDict = () => import('@/views/personnel/EduDict')
const Training = () => import('@/views/train/Training')
const EntryExit = () => import('@/views/incorruption/EntryExit')
const Affair = () => import('@/views/incorruption/Affair')
const Account = () => import('@/views/system/Account')

const PersonnelDisabled = () => import('@/views/system/PersonnelDisabled')
const Review = () => import('@/views/review/Review')
const Feedback = () => import('@/views/review/Feedback')
const IncorruptionReview = () => import('@/views/review/IncorruptionReview')

const PoliceTeam = () => import('@/views/analysis/PoliceTeam')

const Appointment = () => import('@/views/personnel/Appointment')

export const componentList = {
  Personnel,
  Module,
  Headcount,
  DepartmentPosition,
  Level,
  Position,
  Post,
  Appraisal,
  Award,
  Punish,
  Department,
  Role,
  RoleDict,
  Permission,
  Discipline,
  Report,
  Data,
  DepartmentSync,
  AccountSync,
  EduDict,
  Training,
  EntryExit,
  Affair,
  Account,
  PersonnelDisabled,
  Review,
  Feedback,
  IncorruptionReview,
  Appointment,
  PoliceTeam
}
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth',
    component: () => import('@/views/website/Auth'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/403',
    component: () => import('@/views/403'),
    hidden: true
  },

  {
    path: '/401',
    component: () => import('@/views/401'),
    hidden: true
  },

  {
    path: '/nologin',
    component: () => import('@/views/website/NoLogin'),
    hidden: true
  },
  {
    path: '/upload',
    component: () => import('@/views/other/Upload'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '控制台', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/perdetail',
    component: () => import('@/views/personnel/PerDetail'),
    hidden: true
  },
  {
    path: '/pertable',
    component: () => import('@/views/personnel/PersonnelTable'),
    hidden: true
  },
  {
    path: '/talent',
    component: TalentLayout,
    hidden: true,
    redirect: '/talent/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'TalentDashboard',
        component: () => import('@/views/talent/Dashboard'),
        meta: { title: '人才库', icon: 'dashboard' }
      },
      {
        path: 'politics',
        name: 'TalentPolitics',
        component: () => import('@/views/talent/Talent'),
        meta: { title: '政工人才库', icon: 'dashboard' }
      },
      {
        path: 'finance',
        name: 'TalentFinance',
        component: () => import('@/views/talent/Talent'),
        meta: { title: '财务人才库', icon: 'dashboard' }
      },
      {
        path: 'information',
        name: 'TalentInformation',
        component: () => import('@/views/talent/Talent'),
        meta: { title: '信息化人才库', icon: 'dashboard' }
      },
      {
        path: 'pick',
        name: 'TalentPick',
        component: () => import('@/views/talent/TalentPick'),
        meta: { title: '人才抽取', icon: 'dashboard' }
      }
    ]
  },
  // {
  //   path: '/talent',
  //   component: TalentLayout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'politics',
  //       name: 'TalentPolitics',
  //       component: () => import('@/views/talent/Talent'),
  //       meta: { title: '政工人才库', icon: 'dashboard' }
  //     }
  //   ]
  // },
  // {
  //   path: '/talent',
  //   component: TalentLayout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'finance',
  //       name: 'TalentFinance',
  //       component: () => import('@/views/talent/Talent'),
  //       meta: { title: '财务人才库', icon: 'dashboard' }
  //     }
  //   ]
  // },
  // {
  //   path: '/talent',
  //   component: TalentLayout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'information',
  //       name: 'TalentInformation',
  //       component: () => import('@/views/talent/Talent'),
  //       meta: { title: '信息化人才库', icon: 'dashboard' }
  //     }
  //   ]
  // },
  // {
  //   path: '/talent',
  //   component: TalentLayout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'pick',
  //       name: 'TalentPick',
  //       component: () => import('@/views/talent/TalentPick'),
  //       meta: { title: '人才抽取', icon: 'dashboard' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  // },
  // {
  //   path: '/asset',
  //   component: Layout,
  //   redirect: '/asset/fixedasset',
  //   name: 'Asset',
  //   meta: { title: '资产管理', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'fixedasset',
  //       name: 'FixedAsset',
  //       component: FixedAsset,
  //       meta: { title: '固定资产', icon: 'table' }
  //     },
  //     {
  //       path: 'material',
  //       name: 'Material',
  //       component: Material,
  //       meta: { title: '耗材', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/user',
  //   name: 'System',
  //   meta: { title: '系统管理', icon: 'el-icon-setting', roles: ['admin','editor'] },
  //   children: [
  //     {
  //       path: 'user',
  //       name: 'User',
  //       component: User,
  //       meta: { title: '用户管理', icon: 'el-icon-user-solid', roles: ['admin'] }
  //     },
  //     {
  //       path: 'role',
  //       name: 'Role',
  //       component: Role,
  //       meta: { title: '角色管理', icon: 'el-icon-s-custom' }
  //     },
  //     {
  //       path: 'department',
  //       name: 'Department',
  //       component: Department,
  //       meta: { title: '部门管理', icon: 'el-icon-s-custom' }
  //     },
  //   ]
  // },

  // {
  //   path: '/website',
  //   component: Layout,
  //   redirect: '/website/permission',
  //   name: 'Website',
  //   meta: { title: '网站管理', icon: 'el-icon-eleme', roles: ['admin'] },
  //   children: [
  //     {
  //       path: 'permission',
  //       name: 'Permission',
  //       component: Permission,
  //       meta: { title: '权限管理', icon: 'el-icon-user-solid', roles: ['admin'] }
  //     },
  //     {
  //       path: 'module',
  //       name: 'Module',
  //       component: Module,
  //       meta: { title: '模块管理', icon: 'el-icon-s-custom' }
  //     },
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
