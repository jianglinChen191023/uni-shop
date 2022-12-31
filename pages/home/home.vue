<template>
	<view>
		<!-- 搜索组件 -->
		<view class="search-box">
			<mySearch @click="gotoSearch"></mySearch>
		</view>

		<!-- 轮播图区域 -->
		<uniSwiper :swiperList="swiperList"></uniSwiper>

		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, index) in navList" :key="index" @click="navClickHandler(item)">
				<image class="nav-image" :src="item.image_src"></image>
			</view>
		</view>

		<!-- 楼层区域 -->
		<view class="floor-list">
			<!-- 楼层 item 项 -->
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层的图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧的大图片盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧 4 个小图片的盒子 -->
					<view class="right-img-box">
						<navigator :url="item2.url" class="right-img-item" v-for="(item2, i2) in item.product_list"
							:key="i2">
							<image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix"
								v-if="i2 !== 0">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSwiper from "@/components/uni-swiper/uni-swiper.vue"
	import mySearch from "@/components/my-search/my-search.vue"
	export default {
		data() {
			return {
				swiperList: [],
				navList: [],
				// 楼层的数据列表
				floorList: []
			};
		},
		components: {
			uniSwiper,
			mySearch
		},
		onLoad() {
			// 轮播图数据
			this.getSwiperList()
			// 分类导航数据
			this.getNavList()
			// 获取楼层数据
			this.getFloorList()
		},
		methods: {
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			},
			async getSwiperList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.swiperList = res.message
			},
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.navList = res.message
				console.log(this.navList);
			},
			// nav-item 被点击时的事件处理函数
			navClickHandler(item) {
				// 判断被点击的是哪个
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			// 定义获取楼层数据的方法
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) return uni.$showMsg()

				// 通过双层 forEach 循环，处理 RUL 地址
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})

				this.floorList = res.message
			}
		}

	}
</script>

<style lang="scss">
	.search-box {
		// 设置定位效果为“吸顶”
		position: sticky;
		// 吸顶的“位置”
		top: 0;
		// 提高层级，防止被轮播图覆盖
		z-index: 999;
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15rpx 0;

		.nav-image {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-title {
		height: 60rpx;
		width: 100%;
		display: flex;
	}

	.floor-img-box {
		display: flex;
		margin-left: 10rpx;

		.right-img-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
		}
	}
</style>
