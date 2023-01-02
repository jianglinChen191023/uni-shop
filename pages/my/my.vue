<template>
	<view>
		{{message | tofixed}}
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'

	export default {
		mixins: [badgeMix],
		data() {
			return {
				message: 22
			};
		},
		filters: {
			tofixed(v) {
				console.log(1);
				return v.toFixed(2)
			}
		}
	}
</script>

<style lang="scss">

</style>
