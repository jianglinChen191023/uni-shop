<template>
	<view class="my-container">
		<!-- 用户未登录时，显示登录组件 -->
		<my-login v-if="!token"></my-login>
		<!-- 用户登录后，显示用户信息组件 -->
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {
		mapState
	} from 'pinia'
	import {
		useUserStore
	} from '@/stores/user.js'
	export default {
		mixins: [badgeMix],
		data() {
			return {};
		},
		computed: {
			// 2. 从 useUserStore 模块中导入需要的 token 字符串
			...mapState(useUserStore, ['token']),
		},
	}
</script>

<style lang="scss">
	page,
	.my-container {
		height: 100%;
	}
</style>
