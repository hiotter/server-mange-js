import Vue from 'vue'
import Router from 'vue-router'
import { staticRoutes, asyncRoutes, notFoundRoute } from './routes.js'
import store from '@/store'
import timeLocalStorage from 'time-localstorage'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })
import { message } from 'ant-design-vue'
Vue.use(Router)

const createRouter = () => {
    return new Router({
        routes: staticRoutes,
        scrollBehavior() {
            return { x: 0, y: 0 }
        }
    })
}

const router = createRouter()

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    if (to.path === '/login') {
        store.commit('permission/CLEAR_PERMISSION')
        next()
        NProgress.done()
    } else {
        let token = timeLocalStorage.get('token')
        if (store.state.permission.token || token) {
            if (!store.state.permission.token) store.commit('permission/STORE_TOKEN', token)
            if (store.state.permission.addRoutesDone) {
                if (to.path === '/') {
                    next({ path: '/console/dashboard' })
                } else {
                    next()
                }
                NProgress.done()
            } else {
                try {
                    let { role, routesAuths } = await store.dispatch('permission/__getUserInfo')
                    let validRoutes = getValidRoutes(asyncRoutes, role, routesAuths)
                    // resetRouter()
                    router.addRoutes([...validRoutes, notFoundRoute])
                    store.commit('permission/SET_ADD_ROUTES_DONE')
                    store.commit('permission/STORE_MENU', renderMenu(validRoutes))
                    next({ ...to, replace: true })
                    NProgress.done()
                } catch (err) {
                    store.commit('permission/CLEAR_PERMISSION')
                    next({ path: '/login' })
                    NProgress.done()
                    message.error(err.message)
                }
            }
        } else {
            store.commit('permission/CLEAR_PERMISSION')
            next({ path: '/login' })
            NProgress.done()
        }
    }
})
// 重置路由
function resetRouter() {
    const reset = createRouter()
    router.matcher = reset.matcher
}

// 获取有效路由
function getValidRoutes(routes, role, auths) {
    let arr = []
    for (let item of routes) {
        let itemNew = { ...item }
        if (role === '管理员' || auths.includes(itemNew.name)) {
            if (itemNew.children) {
                itemNew.children = getValidRoutes(itemNew.children, role, auths)
            }
            arr.push(itemNew)
        }
    }
    return arr
}

// 渲染导航栏
function renderMenu(routes) {
    return routes.filter(route => !route.hidden).map(route => {
        let justOneChild = route.children.length === 1
        if (justOneChild) return {
            icon: route.children[0].meta.icon,
            title: route.children[0].meta.title,
            name: route.children[0].name
        }
        return {
            icon: route.meta.icon,
            title: route.meta.title,
            name: route.name,
            children: route.children.filter(child => !child.hidden).map(child => {
                return {
                    icon: child.meta.icon,
                    title: child.meta.title,
                    name: child.name
                }
            })
        }
    })
}

export default router
