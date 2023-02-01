<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息 -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
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
		name: "my-login",
		data() {
			return {

			};
		},
		computed: {
			// 调用 mapState 辅助方法，把 useUserStore 模块中的数据映射到当前用组件中使用
			...mapState(useUserStore, ['redirectInfo']),
		},
		methods: {
			...mapActions(useUserStore, ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			// 获取微信用户的基本信息
			getUserInfo(e) {
				console.log(11);
				// 判断是否获取用户信息成功
				if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')

				// 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
				// console.log(e.detail.userInfo)

				// 3. 将用户的基本信息存储到 pinia 中
				this.updateUserInfo(e.detail.userInfo)

				// 登录
				this.getToken(e.detail)
			},
			// 调用登录接口
			getToken(info) {
				console.log(1);
				// 调用微信登录接口
				uni.login({
					provider: 'weixin',
					success: function(res) {
						console.log(res);

						const query = {
							code: res.code,
							encryptedData: info.encryptedData,
							iv: info.iv,
							rawData: info.rawData,
							signature: info.signature
						}

						uni.$http.post('/api/public/v1/users/wxlogin', query).then(res1 => {
							console.log(res1);
							if (res1.data.meta.status !== 200) return uni.$showMsg('登录失败！')

							this.updateToken(res1.data.message.token)
							// 判断 pinia 中的 redirectInfo 是否为 null
							// 如果不为 null，则登录成功之后，需要重新导航到对应的页面
							this.navigateBack()
						})
					},
					fail: function(error) {
						console.log(error);
						uni.$showMsg('登录失败！')
					}
				})
			},
			// 返回登录之前的页面
			navigateBack() {
				// redirectInfo 不为 null，并且导航方式为 switchTab
				if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					// 调用小程序提供的 uni.switchTab() API 进行页面的导航
					uni.switchTab({
						// 要导航到的页面地址
						url: this.redirectInfo.from,
						// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			},
		},
	}
</script>

<style lang="scss">
	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
