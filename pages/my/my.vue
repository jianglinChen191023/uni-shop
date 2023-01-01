<template>
	<view>
		{{message | tofixed}}
	</view>
</template>

<script>
	export default {
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
