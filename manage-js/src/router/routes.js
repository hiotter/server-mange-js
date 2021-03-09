export const staticRoutes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue')
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('@/layout')
    }
]

export const asyncRoutes = [
    {
        path: '/console',
        name: '控制台',
        component: () => import('@/layout'),
        meta: { icon: 'desktop', title: '控制台' },
        children: [
            {
                path: 'dashboard',
                name: '仪表板',
                component: () => import('@/views/console/dashboard.vue'),
                meta: { icon: 'dashboard', title: '仪表板' }
            }
        ]
    },
    {
        path: '/user',
        name: '用户管理',
        component: () => import('@/layout'),
        meta: { icon: 'snippets', title: "用户管理" },
        children: [
            {
                path: 'staff',
                name: '员工管理',
                component: () => import('@/views/user/staff.vue'),
                meta: { icon: 'file-search', title: '员工管理' }
            }
        ]
    },
    {
        path: '/journal',
        name: '日志监控',
        component: () => import('@/layout'),
        meta: { icon: 'snippets', title: "日志监控" },
        children: [
            {
                path: 'login-log',
                name: '登录日志',
                component: () => import('@/views/journal/login-log.vue'),
                meta: { icon: 'file-search', title: '登录日志' }
            },
            {
                path: 'operation-log',
                name: '操作日志',
                component: () => import('@/views/journal/operation-log.vue'),
                meta: { icon: 'file-search', title: '操作日志' }
            }
        ]
    },
    {
        path: '/auth',
        name: '权限管理',
        component: () => import('@/layout'),
        meta: { icon: 'file-search', title: '权限管理' },
        children: [
            {
                path: 'role',
                name: '角色管理',
                component: () => import('@/views/auth/role.vue'),
                meta: { icon: 'file-search', title: '权限管理' }
            }
        ]
    },
]

export const notFoundRoute = {
    path: '*',
    hidden: true,
    redirect: {
        name: '404'
    }
}