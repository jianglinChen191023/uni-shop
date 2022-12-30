∑<template>
	<view class="card">
		<swiper indicator-color="rgba(245, 245, 245, 1)" indicator-active-color="#42E2CD" class="swiper-box"
			:indicator-dots="true" :circular="true" :autoplay="true" :interval="3000" :duration="1000"
			previous-margin="70rpx" next-margin="70rpx" @change="swiperChange">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<navigator :url="'/subpk/goods_detail/goods_detail?goods_id=' + item.goods_id" :class="['card-item', currentCardIndex === index ? 'card-item-current' : 'card-item-default']">
					<image class="image" :src="item.image_src" />
				</navigator>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: "uni-swiper",
		props: {
			swiperList: {
				type: [Array],
				default: []
			}
		},
		data() {
			return {
				currentCardIndex: 0
			};
		},
		methods: {
			swiperChange(e) {
				this.currentCardIndex = e.detail.current
			}
		}
	}
</script>

<style lang="scss">
	.card {
		.swiper-box {
			margin: 6rpx 0;
			width: 750rpx;
			height: 320rpx;
		}

		.card-item {
			display: flex;
			justify-content: center;
			align-items: center;

			.image {
				height: 320rpx;
				// 圆角
				border-radius: 14rpx;
			}
		}

		.card-item-current {
			transform: scale(1);
			transition: all 0.3s ease-in 0s;
		}

		.card-item-default {
			transform: scale(0.9);
			transition: all 0.3s ease-in 0s;
		}
	}
</style>
