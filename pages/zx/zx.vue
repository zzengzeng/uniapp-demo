<template>
	<view class="content zx">
		<div class="loading-wrap" v-if="loading">
			<m-loading color='black' />
		</div>
		<div class="wrap" v-else>
			<m-search></m-search>
			<m-share-num class="share"></m-share-num>
			<div class="zhangfubang">
				<p class="title">
					<span>
						<span class="redshu"></span>涨幅榜
					</span>
					<router-link style="font-size: 12px;color: #999999" tag="span" :to="{path:'/zxMores',query:{id:1}}">更多</router-link>
				</p>
				<div class="zhangfubangItem" v-for="(item,index) in zhangList" :key="index" @click="toKing(item[0])">
					<div class="first">
						<p>{{item[1]}}</p>
						<p>{{item[0]}}</p>
					</div>
					<div class="second">{{item[4]}}</div>
					<div :class="{down_green:Number(item.rate)<0}" style="color:red;width: 30%;text-align: right">{{Number(item.rate)}}%</div>
				</div>
				<p v-if="zhangList.length===0" style="text-align: center">暂无数据</p>
			</div>
			<div class="zhangfubang">
				<p class="title">
					<span>
						<span class="redshu"></span>跌幅榜
					</span>
					<router-link style="font-size: 12px;color: #999999" :to="{path:'/zxMores',query:{id:2}}">更多</router-link>
				</p>
				<div class="zhangfubangItem" v-for="(item,index) in dieList" :key="index" @click="toKing(item[0])">
					<div class="first">
						<p>{{item[1]}}</p>
						<p>{{item[0]}}</p>
					</div>
					<div class="second">{{item[4]}}</div>
					<div :class="{down_green:Number(item.rate)<0}" style="color:red;width: 30%;text-align: right">{{Number(item.rate)}}%</div>
				</div>
				<p v-if="dieList.length===0" style="text-align: center">暂无数据</p>
			</div>
			<div class="zhangfubang" style="margin-bottom: 60px">
				<p class="title">
					<span>
						<span class="redshu"></span>成交量排行榜
					</span>
					<router-link style="font-size: 12px;color: #999999" :to="{path:'/zxMores',query:{id:3}}">更多</router-link>
				</p>
				<div class="zhangfubangItem" v-for="(item,index) in paihangList" :key="index" @click="toKing(item[0])">
					<div class="first">
						<p>{{item[1]}}</p>
						<p>{{item[0]}}</p>
					</div>
					<div class="second">{{item[4]}}</div>
					<div :class="{down_green:Number(item.rate)<0}" style="color:red;width: 30%;text-align: right">{{Number(item.rate)}}%</div>
				</div>
				<p v-if="paihangList.length===0" style="text-align: center">暂无数据</p>
			</div>
		</div>

	</view>
</template>

<script>
	import mSearch from '@/components/m-search.vue';
	import mShareNum from '@/components/m-share-num.vue';
	import mLoading from '@/components/m-loading.vue';
	export default {
		components: {
			mSearch,
			mLoading,
			mShareNum
		},
		data() {
			return {
				loading: true,
				noDate: true, //判断是否加载的开关
				arr: [],
				page: 1,
				page_limit: 20,
				//要闻
				mustNew: [],
				tabIndex: 0,
				zhangList: [],
				dieList: [],
				paihangList: [],
			}
		},
		created() {
			this.getZhang();
			this.getDie();
			this.getJiaoyi();
		},
		methods: {
			//获取涨幅排行榜
			getZhang() {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url: '/api/rank/uprank/1',
					header: {
						Authorization: "Bearer " + userToken
					},
					success: (res) => {
						this.loading = false;
						if (res.data.data && res.data.data.length > 0) {
							this.zhangList = res.data.data;
						}
					},
					fail: (err) => {
						this.loading = false;
						console.log(err);
					}
				});
			},
			//获取跌幅排行榜
			getDie() {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url: '/api/rank/downrank/1',
					header: {
						Authorization: "Bearer " + userToken
					},
					success: (res) => {
						if (res.data.data && res.data.data.length > 0) {
							this.dieList = res.data.data;
						}
					}
				})
			},
			//获取交易排行榜
			getJiaoyi() {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url: '/api/rank/volumerank/1',
					header: {
						Authorization: "Bearer " + userToken
					},
					success: (res) => {
						if (res.data.data && res.data.data.length > 0) {
							this.paihangList = res.data.data;
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	@import 'less/zx.less';
</style>
