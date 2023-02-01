import {
	defineStore
} from 'pinia'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore('user', {
	state: () => ({
		// 收货地址
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// 登录成功之后的 token 字符串
		token: uni.getStorageSync('token') || '',
		// 用户的基本信息
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		// 重定向的 object 对象 { openType, from }
		redirectInfo: null
	}),
	getters: {
		// 收货详细地址的计算属性
		addstr() {
			if (!this.address.provinceName) return ''

			// 拼接 省，市，区，详细地址 的字符串并返回给用户
			return this.address.provinceName + this.address.cityName + this.address.countyName + this.address
				.detailInfo
		}
	},
	actions: {
		// 更新重定向的信息对象
		updateRedirectInfo(info) {
			this.redirectInfo = info
		},

		// 更新 token 字符串
		updateToken(token) {
			this.token = token
			this.saveTokenToStorage()
		},

		// 将 token 字符串持久化存储到本地
		saveTokenToStorage() {
			uni.setStorageSync('token', this.token)
		},

		// 更新用户的基本信息
		updateUserInfo(userinfo) {
			this.userinfo = userinfo
			this.saveUserInfoToStorage()
		},

		// 将 userinfo 持久化存储到本地
		saveUserInfoToStorage() {
			uni.setStorageSync('userinfo', JSON.stringify(this.userinfo))
		},

		// 更新收货地址
		updateAddress(address) {
			this.address = address
			this.saveAddress()
		},
		// 将 address 持久化存储到本地
		saveAddress() {
			uni.setStorageSync('address', JSON.stringify(this.address))
		}
	},
})
