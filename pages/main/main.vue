<template>
	<view class="content home">
		<div class="banner">
			<div class="search">
				<div class="input">
					<i>
						<img :src="require('@/static/images/search.png')" />
					</i>
					<input v-model="searchInput" @blur.prevent="changeCount()" placeholder="请输入股票代码/名称" />
				</div>
				<div v-show="addInput.length != 0" class="search_div">
					<ul>
						<li v-for="(item,index) in addInput" :key="index">
							<div @click="postSearch(item.code)">
								<span class="left">{{item.code | filtersName}}</span>
								<span style="margin-left:.2rem;" class="left">{{item.name}}</span>
							</div>
							<span @click="addMyself(item.code)" class="right">点击添加</span>
						</li>
					</ul>
				</div>
			</div>
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item>
							<view class="swiper-item uni-bg-red">
								<img :src="require('@/static/images/banner1.jpg')" />
							</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item uni-bg-green">
								<img :src="require('@/static/images/banner2.jpg')" />
							</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item uni-bg-blue">
								<img :src="require('@/static/images/banner3.jpg')" />
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchInput: "",
				addInput: [],
				tab: [{
						title: "最新动态",
						more: "动态",
						moreLink: "/dynamic"
					},
					{
						title: "最优策略",
						more: "策略",
						moreLink: "/morecl"
					},
					{
						title: "最牛达人"
						//more: "达人",
						//moreLink: "/bullUser"
					}
				],
				tabIndex: 0,
				noDate: true, //判断是否加载的开关
				arr: [],
				page: 1,
				page_limit: 20,
				//要闻
				mustNew: [],
				//4个指数的数据
				Zs: [],
				//动态的数据
				Dt: [],
				//策略的数据
				Cl: [],
				//最佳牛人
				Bull: [],
				more: "动态",
				moreLink: "/dynamic",
				background: ['color1', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500
			};
		},
		watch: {
			searchInput(data) {
				uni.request({
					url: '/api/stock/search',
					data: {
						code: data
					},
					success: (res) => {
						//这里因为需要重新渲染页面，所以需要使用push，不能直接赋值
						this.addInput = res.data && res.data.data;
						console.log(this.addInput)
					},
					fail: (err) => {
						console.log(err, 'err')
					}
				})
			}
		},
		onLoad() {

		},
		methods: {
			changeCount() {
				// this.addInput = [];
			},
			postSearch(code) {
				let userToken = localStorage.getItem("Authorization");
				uni.request({
					url: '/api/selfstock',
					method: "POST",
					data: {
						code: code
					},
					header: {
						'Authorization': "Bearer " + userToken,
						'content-type':'application/x-www-form-urlencoded'
					},
					success: (res) => {
						console.log(res, 'res')
					},
					fail: (err) => {
						console.log(err, 'err')
					}
				})
			},
			addMyself(code) {
				let userToken = localStorage.getItem("Authorization");
				uni.request({
					url: '/api/selfstock',
					method: "POST",
					data: {
						code: code
					},
					header: {
						'Authorization': "Bearer " + userToken,
						'content-type':'application/x-www-form-urlencoded'
					},
					success: (res) => {
						console.log(res,'res')
						// if (res.status) {
						// 	this.$message("已添加到自选股票");
						// }
					},
					fail: (err) => {
						console.log(err, 'err')
					}
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	@import 'less/main.less';
</style>
