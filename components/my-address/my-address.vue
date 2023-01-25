<template>
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
			<button type="primary" size="mini" class="btn-choose-address" @click="chooseAddress">请选择收货地址+</button>
		</view>

		<!-- 渲染收货信息的盒子 -->
		<view class="address-info-box" v-else>
			<view class="row1">
				<view class="row1-left">
					<view class="username">收货人：<text>{{address.userName}}</text></view>
				</view>
				<view class="row1-right">
					<view class="phone">电话：<text>{{address.telNumber}}</text></view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="row2-left">收货地址：</view>
				<view class="row2-right"><text>{{addstr}}</text></view>
			</view>
		</view>

		<!-- 底部的边框线 -->
		<image src="/static//cart_border@2x.png" class="address-border"></image>
	</view>
</template>


<script>
	import {
		mapState,
		mapActions
	} from 'pinia'
	import {
		useUserStore
	} from '@/stores/user.js'

	export default {
		name: "my-address",
		data() {
			return {
			};
		},
		computed: {
			...mapState(useUserStore, ['address', 'addstr']),
			// 收货详细地址的计算属性
			addstr() {
				if (!this.address.provinceName) return ''

				// 拼接 省，市，区，详细地址 的字符串并返回给用户
				return this.address.provinceName + this.address.cityName + this.address.countyName + this.address
					.detailInfo
			}
		},
		methods: {
			...mapActions(useUserStore, ['updateAddress']),
			// 选择收货地址
			chooseAddress() {
				const this1 = this;
				uni.authorize({
					scope: 'scope.address',
					success() {
						uni.chooseAddress({
							success(res) {
								this1.updateAddress(res)
							},
							fail(e) {
								console.log(e)
							}
						})
					}
				})
			}
		}
	}
</script>


<style lang="scss">
	.address-choose-box {
		height: 90px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.address-border {
		display: block;
		width: 100%;
		height: 5px;
	}

	.address-info-box {
		font-size: 12px;
		height: 90px;
		display: flex;
		// 上下对齐
		flex-direction: column;
		// 纵向居中
		justify-content: center;
		padding: 0 5px;

		.row1 {
			display: flex;
			// 左右贴边对齐
			justify-content: space-between;

			.row1-right {
				display: flex;
				// 左右贴边对齐
				justify-content: space-between;
			}
		}

		.row2 {
			display: flex;
			// 左右贴边对齐
			justify-content: space-between;
			// 居中对应
			align-items: center;
			margin-top: 10px;

			.row2-left {
				// 文本不换行
				white-space: nowrap;
			}
		}
	}
</style>
