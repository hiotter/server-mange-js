import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import * as filters from './filters/filters'

// 插入过滤器名和对应方法
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.use(Antd)

// 挂载vue原型
import _ from 'lodash'
Vue.prototype.$_ = _

// import '@/directive/echartResizeHelper.js'
import '@/directive/permission.js'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
