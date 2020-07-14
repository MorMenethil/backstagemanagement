import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../views/home/Home.vue'
import Welcome from '../views/home/Welcome.vue'
import Users from '../views/users/Users.vue'
import Roles from '../views/power/Roles.vue'
import Rights from '../views/power/rights.vue'


Vue.use(VueRouter)

// element-ui 重复点击路由会报错解决方案
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


const routes = [{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/home',
		component: Home,
		redirect: '/welcome',
		children: [{
				path: '/welcome',
				component: Welcome,
			},
			{
				path: '/users',
				component: Users
			},
			{
				path: '/roles',
				component: Roles
			},
			{
				path: '/rights',
				component: Rights
			}
		]
	},
]

const router = new VueRouter({
	routes
})

export default router
