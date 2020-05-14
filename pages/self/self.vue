<template>
	<view class="content self">
		<m-search></m-search>
		<view class="wrap">
			<div class="title">
				<p class="name">名称代码</p>
				<p class="money">现价</p>
				<p class="num">涨跌幅</p>
			</div>
			<view class="uni-list container">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in myShares"  :key="index">
					<view class="uni-media-list">
						<div  class="move">
							<p class="name">{{item[1]}}<span>{{item[0] | filtersName}}</span></p>
							<p class="money">{{item[4]}}</p>
							<p :class="{bg_green:(item[4]-item[3])/item[3]<0}" class="num">{{(item[4]-item[3])/item[3] | toPercentage}}</p>
							<!-- 将code传递过去 -->
							<div @click.stop="deleteMyself(item[0])" ref="q" class="remove">删除自选</div>
						</div>
					</view>
				</view>
			</view>
			<uni-load-more :status="status"  :icon-size="16" :content-text="contentText" />
		</view>
	</view>
</template>

<script>
	import mSearch from '@/components/m-search.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			mSearch,
			uniLoadMore
		},
		filters: {
		    //转成百分数
		    toPercentage(value) {
		      let str = Number(value * 100).toFixed(2);
		      str += "%";
		      return str;
		    }
		  },
		data() {
			return {
				reload: false,
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				//我的股票
				myShares: [],
				//页面2的page码
				page: 1,
				noMore: false
			}
		},
		created(){
			this.getList();
		},
		methods: {
			onPullDownRefresh() {
				this.reload = true;
				this.getList();
			},
			onReachBottom() {
				if(!this.noMore){
					this.status = 'more';
					this.page=this.page+1;
					this.getList();
				}else{
					this.status = '';
				}
			},
			getList() {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url: '/api/selfstock',
					data: {
						page: this.page
					},
					header:{
						Authorization: "Bearer " + userToken
					},
					success: (res) => {
						if (res.data.status) {
							let list = res.data.data;
							this.myShares = this.reload ? list : this.myShares.concat(list);
							this.noMore = res.data.data.length < 10;
							this.reload = false;
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data));
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	@import  'less/self.less';
</style>
