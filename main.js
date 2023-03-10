// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
/// 配置网络请求
import {
	$http
} from '@escook/request-miniprogram'
import {
	createPinia
} from 'pinia'

const app = createSSRApp(App)
const pinia = createPinia()
app.use(pinia)
const userStore = useUserStore()

uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'

// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...',
	})

	// 判断请求的是否为有权限的 API 接口
	if (options.url.indexOf('/my/') !== -1) {
		// 为请求头添加身份认证字段
		options.header = {
			// 字段的值可以直接从 pinia 中进行获取
			Authorization: userStore.token,
		}
	}
}

// 请求完成之后做一些事情
$http.afterRequest = function() {
	uni.hideLoading()
}
/// 配置网络请求

/// 自定义消息提示
// 封装的展示消息提示的方法
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none',
	})
}
/// 自定义消息提示

export function createApp() {
	return {
		app
	}
}
// #endif
