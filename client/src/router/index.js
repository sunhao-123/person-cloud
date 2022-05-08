
import { ifLogin } from "../api";

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Login",
    meta: {
      title: "登录",
      cnName: "登录"
    },
    component: () => import('../views/Login'),
    beforeEnter: (to, from, next) => {
      ifLogin().then(res => {
        if (!res.data.userInfo) {
          next();
        } else {
          next("/admin");
        }
      }).catch(() => {
        next();
      })
    },
  },
  {
    path: "/admin",
    meta: {
      title: "首页",
      cnName: "首页"
    },
    component: () => import('../views/Admin'),
    beforeEnter: (to, from, next) => {
      ifLogin()
        .then(res => {
          if (!res.data.userInfo) {
            next("/");
          } else {
            next();
          }
        })
        .catch((e) => {
          next("/");
        })
    },
    children: [
      {
        path: "",
        name: "AdminIndex",
        component: () => import('../views/Admin/AdminIndex/index.vue'),
        meta: {
          title: "首页",
          cnName: "首页"
        }
      },
      {
        path: "UserAdmin",
        name: "UserAdmin",
        component: () => import('../views/Admin/User/UserAdmin.vue'),
        meta: {
          title: "用户管理",
          cnName: "用户管理"
        }
      },
      {
        path: "location",
        name: "location",
        component: () => import('../views/Admin/location/index.vue'),
        meta: {
          title: "库位编辑",
          cnName: "库位编辑"
        }
      },
      {
        path: "viewlog",
        name: "viewlog",
        component: () => import('../views/Admin/LogView/index.vue'),
        meta: {
          title: "系统日志",
          cnName: "系统日志"
        }
      },
      {
        path: "viewnetlog",
        name: "viewnetlog",
        component: () => import('../views/Admin/NetLogView/index.vue'),
        meta: {
          title: "网络日志",
          cnName: "网络日志"
        }
      },
      {
        path: "viewtask",
        name: "viewtask",
        component: () => import('../views/Admin/TaskView/index.vue'),
        meta: {
          title: "拣选任务",
          cnName: "拣选任务"
        }
      },
      {
        path: "viewreprint",
        name: "viewreprint",
        component: () => import('../views/Admin/reprintView/index.vue'),
        meta: {
          title: "补打任务",
          cnName: "补打任务"
        }
      },
      {
        path: "update",
        name: "update",
        component: () => import('../views/Admin/Update/index.vue'),
        meta: {
          title: "程序更新",
          cnName: "程序更新"
        }
      },
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/404/index.vue'),
    meta: {
      title: '404_NotFound',
      cnName: "404_NotFound"
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
