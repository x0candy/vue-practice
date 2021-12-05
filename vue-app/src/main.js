// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI, {
  Tree
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './assets/css/global.css'
import './assets/font_2264142_9e6k4cg88x6/iconfont.css'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
import TreeTable from 'vue-table-with-tree-grid'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.component('tree-table', TreeTable)
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
