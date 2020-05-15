<template>
	<view class="content home">
		<div class="banner">
			<m-search></m-search>
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
		<div class="container">
			<div class="nav">
				<ul>
					<li v-for="(item,index) in navList" :key="index">
						<a @click="toJump(item.link,item.tab)">
							<img :src="item.imgUrl" />
							<p>{{item.title}}</p>
						</a>
					</li>
				</ul>
			</div>
			<m-share-num></m-share-num>
			<div class="redian">
				<p>热点资讯</p>
				<div class="scroll-wrap" v-if="arr.length>0">
					<section class="news" v-for="(item,index) in arr" :key="index">
						<span>{{item.create_time}}</span>
						<span>{{item.rich_text}}</span>
					</section>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import mSearch from '@/components/m-search.vue';
	import mShareNum from '@/components/m-share-num.vue';
	export default {
		components: {
			mSearch,
			mShareNum
		},
		data() {
			return {
				tabIndex: 0,
				noDate: true, //判断是否加载的开关
				arr: [],
				page: 1,
				page_limit: 20,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				navList:[
					{
						title:'发布策略',
						link:'/pages/self/self',
						imgUrl:require('@/static/images/nav/kaihu.png'),
						tab: true
					},
					{
						title:'充值中心',
						link:'/pages/me/recharge',
						imgUrl:require('@/static/images/nav/tixian.png')
					},
					{
						title:'模拟点买',
						link:'/pages/cl/simBuy',
						imgUrl:require('@/static/images/nav/xixun.png')
					},
					{
						title:'新手指引',
						link:'/pages/login/guide',
						imgUrl:require('@/static/images/nav/huodong.png')
					},
					{
						title:'最新动态',
						link:'/pages/cl/dynamic',
						imgUrl:require('@/static/images/nav/paihangbang.png')
					},
					{
						title:'最新策略',
						link:'/pages/cl/strategy',
						imgUrl:require('@/static/images/nav/jiaoyi.png')
					},
					{
						title:'自选股',
						link:'/pages/cl/cl',
						tab: true,
						imgUrl:require('@/static/images/nav/zixunguan.png')
					},
					{
						title:'市场行情',
						link:'/pages/zx/zx',
						tab: true,
						imgUrl:require('@/static/images/nav/hangqing.png')
					},
				]
			};
		},
		onLoad() {
			this.getData();
		},
		methods: {
			getData() {
				uni.request({
					url:'/api/lx',
					data:{
						page: this.page,
						page_limit: this.page_limit
					},
					success:(res)=>{
						this.noDate = false;
						if (this.page == 1) {
							this.arr = res.data.list;
						} else {
							this.arr = this.arr.concat(res.data.list);
						}
						//this.noDate=true
					},
					fail: (err)=>{
						console.log(err,'err')
					}
				})
			},
			toJump(link,tab){
				if(tab){
					uni.switchTab({
					    url: link
					});
				}else{
					uni.navigateTo({
					    url: link
					});
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import 'less/main.less';
</style>
