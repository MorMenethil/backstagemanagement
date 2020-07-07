import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截
axios.interceptors.request.use(config => {
	// 在发送请求之前做些什么
	const token = sessionStorage.getItem('token')
	if (token) {
		config.headers.Authorization = token
	}
	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});
// axios挂载到全局
Vue.prototype.$http = axios

// 路由导航守卫
router.beforeEach((to, from, next) => {
	if (to.path === '/login') return next()
	const token = sessionStorage.getItem('token')
	if (!token) return next('/login')
	next()
})

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
