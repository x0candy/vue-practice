import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home/Home.vue'
import Welcome from '../components/Home/Welcome.vue'
import User from '../components/Home/User/Users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/params.vue'
Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: User
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/categories',
      component: Cate
    }, {
      path: '/params',
      component: Params
    }]
  }]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})


export default router
