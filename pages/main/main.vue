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
					<li>
						<router-link tag="a" to="/self">
							<img :src="require('@/static/images/nav/kaihu.png')" />
							<p>发布策略</p>
						</router-link>
					</li>
					<li>
						<router-link tag="a" to="/recharge">
							<img :src="require('@/static/images/nav/tixian.png')" />
							<p>充值中心</p>
						</router-link>
					</li>
					<li>
						<router-link tag="a" to="/simBuy">
							<img :src="require('@/static/images/nav/xixun.png')" />
							<p>模拟点买</p>
						</router-link>
					</li>
					<li>
						<router-link tag="a" to="mrouter">
							<img :src="require('@/static/images/nav/huodong.png')" />
							<p>新手指引</p>
						</router-link>
					</li>
					<li>
						<router-link tag="a" to="/dynamic">
							<img :src="require('@/static/images/nav/paihangbang.png')" />
							<p>最新动态</p>
						</router-link>
					</li>
					<li>
						<router-link tag="a" to="/morecl">
							<img :src="require('@/static/images/nav/jiaoyi.png')" />
							<p>最新策略</p>
						</router-link>
					</li>
					<li>
						<router-link tag="a" to="/cl">
							<img :src="require('@/static/images/nav/zixunguan.png')" />
							<p>自选股</p>
						</router-link>
					</li>
					<li>
						<router-link tag="a" to="/zx">
							<img :src="require('@/static/images/nav/hangqing.png')" />
							<p>市场行情</p>
						</router-link>
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
		}
	}
</script>

<style lang="less" scoped>
	@import 'less/main.less';
</style>
