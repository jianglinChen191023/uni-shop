import {
	defineStore
} from 'pinia'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useCartStore = defineStore('cart', {
	state: () => ({
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	getters: {
		total() {
			return this.cart.reduce((previousValue, cart) => previousValue + cart.goods_count, 0)
		}
	},
	actions: {
		// 将购物车中的数据持久化存储到本地
		saveToStorage() {
		   uni.setStorageSync('cart', JSON.stringify(this.cart))
		},
		addToCart(goods) {
			// 根据提交的商品的Id，查询购物车中是否存在这件商品
			// 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
			const findResult = this.cart.find((x) => x.goods_id === goods.goods_id)

			if (!findResult) {
				// 如果购物车中没有这件商品，则直接 push
				this.cart.push(goods)
			} else {
				// 如果购物车中有这件商品，则只更新数量即可
				findResult.goods_count++
			}
			
			this.saveToStorage()
		},
	},
})
