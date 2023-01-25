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
		// 已勾选的商品的总价
		checkedGoodsAmount(state) {
		  // 先使用 filter 方法，从购物车中过滤器已勾选的商品
		  // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
		  // reduce() 的返回值就是已勾选的商品的总价
		  // 最后调用 toFixed(2) 方法，保留两位小数
		  return state.cart.filter(x => x.goods_state)
		                   .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
		                   .toFixed(2)
		},
		// 勾选的商品的总数量
		checkedCount(state) {
			// 先使用 filter 方法，从购物车中过滤器已勾选的商品
			// 再使用 reduce 方法，将已勾选的商品总数量进行累加
			// reduce() 的返回值就是已勾选的商品的总数量
			return this.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		total() {
			return this.cart.reduce((previousValue, cart) => previousValue + cart.goods_count, 0)
		}
	},
	actions: {
		// 更新所有商品的勾选状态
		updateAllGoodsState(newState) {
		  // 循环更新购物车中每件商品的勾选状态
		  this.cart.forEach(x => x.goods_state = newState)
		  // 持久化存储到本地
		  this.saveToStorage()
		},
		// 根据 Id 从购物车中删除对应的商品信息
		removeGoodsById(goods_id) {
		  // 调用数组的 filter 方法进行过滤
		  this.cart = this.cart.filter(x => x.goods_id !== goods_id)
		  // 持久化存储到本地
		  this.saveToStorage()
		},
		// 更新购物车中商品的数量
		updateGoodsCount(goods) {
			// 根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = this.cart.find(x => x.goods_id === goods.goods_id)

			if (findResult) {
				// 更新对应商品的数量
				findResult.goods_count = goods.goods_count
				// 持久化存储到本地
				this.saveToStorage()
			}
		},
		// 更新购物车中商品的勾选状态
		updateGoodsState(goods) {
			// 根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = this.cart.find(x => x.goods_id === goods.goods_id)

			// 有对应的商品信息对象
			if (findResult) {
				// 更新对应商品的勾选状态
				findResult.goods_state = goods.goods_state
				// 持久化存储到本地
				this.saveToStorage()
			}
		},
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
