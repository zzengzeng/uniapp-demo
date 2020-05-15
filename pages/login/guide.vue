<template>
	<view class="content guide">
		<view class="page-section swiper">
			<view class="page-section-spacing">
				<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
					<swiper-item>
						<view class="swiper-item">
							<img src="@/static/images/new_router/xinshou_01.jpg" />
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<img src="@/static/images/new_router/xinshou_02.jpg" />
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<img src="@/static/images/new_router/xinshou_03.jpg" />
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<img src="@/static/images/new_router/xinshou_04.jpg" />
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indicatorDots: false,
				autoplay: true,
				interval: 2000,
				duration: 500,
			}
		}
	}
</script>

<style lang="less" scoped>
	.guide{
		padding:0;
		background: #fff;
		.page-section{
			width: 100%;
			height: 100%;
			.page-section-spacing,uni-swiper{
				height: 100%;
				img{
					max-width: 100%;
				}
			}
		}
	}
</style>
