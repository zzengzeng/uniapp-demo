<template>
	<view class="content strategy-wrap">
		<view class="uni-list container">
			<view class="uni-list-cell strategy-box" hover-class="uni-list-cell-hover" v-for="(item,index) in Dt" :key="index">
				<view class="uni-media-list">
					<div class="img">
						<img v-if="index<3" :src="'@/static/images/medal_0'+(index+1)+'.jpg'" alt="">
					</div>
					<div class="right">
						<div class="top">
							<p class="name">{{item.shares.data.name}}&nbsp;&nbsp;{{item.shares.data.code}}</p>
							<div class="user">
								<i class="icon">
									<img style="border-radius:.18rem;width:.36rem;height:.36rem" v-if="item.user.data.image!=null" :src="item.user.data.image"
									 alt="">
								</i>
								<span>{{item.user.data.name?item.user.data.name:'时金用户'}}</span>
							</div>
						</div>
						<div class="center">
							<ul>
								<li><span :class="{down_green:parseInt(item.rate)<0}" class="first">{{item.rate}}%</span></li>
								<li>
									<span class="title">买价:</span>
									<span class="num">{{item.price}}</span>
								</li>
								<li>
									<span class="title">卖价:</span>
									<span class="num">{{item.deal_price}}</span>
								</li>
								<li>
									<span class="title">收益率</span>
								</li>
								<li>
									<span class="title">盈亏:</span>
									<span class="num red" :class="{down_green:item.profit_money<0}">{{item.profit_money}}</span>
								</li>
								<li>
									<span class="title">数量: </span>
									<span class="num">{{item.num}}</span>
								</li>
							</ul>
						</div>
					</div>
				</view>
			</view>
		</view>
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				page: 1,
				Dt: [],
				reload: false,
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了~'
				},
				noMore: false
			}
		},
		filters: {
			//过滤日期
			filterDate(value) {
				let arr = value.split("-");
				let tmp = arr[1] + "-" + arr[2];
				arr = tmp.split(":");
				tmp = arr[0] + ":" + arr[1];
				return tmp;
			}
		},
		created() {
			this.getList();
		},
		methods: {
			onPullDownRefresh() {
				this.reload = true;
				this.getList();
			},
			onReachBottom() {
				if (!this.noMore) {
					this.status = 'more';
					this.page = this.page + 1;
					this.getList();
				} else {
					this.status = '';
				}
			},
			getList() {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url: '/api/tactics/list/best?include=user,shares',
					data: {
						page: this.page
					},
					header: {
						Authorization: "Bearer " + userToken
					},
					success: (res) => {
						let list = res.data.data;
						this.Dt = this.reload ? list : this.Dt.concat(list);
						this.noMore = res.data.data.length < 10;
						this.reload = false;
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
	.strategy-wrap {
		padding: 0 28px;
		background: #fff;

		.strategy-box {
			.uni-media-list{
				display: flex;
				justify-content: center;
			}
			.img {
				width: 64px;
				height: 64px;
				margin-top: 50px;
				img {
					width: 100%;
				}
			}

			.right {
				border-bottom: 2px solid #ddd;
				padding-left: 15px;
				flex: 1 1 auto;

				.center {
					ul{
						li {
							width: 33.33%;
							float: left;
							position: relative;
							height: 50px;
						
							.first {
								font-size: 34px;
								color: #ef584d;
								position: absolute;
								top: -10px;
							}
						
							.title {
								font-size: 26px;
								color: #909090;
							}
						
							.num {
								font-size: 26px;
								color: #303030;
							}
						
							.red {
								color: #ef584d;
							}
						}
					}
				}

				.top {
					line-height: 100px;
					overflow: hidden;

					.name {
						float: left;
						font-size: 26px;
						color: #303030;
					}

					.user {
						float: right;
						display: flex;
						align-items: center;

						.icon {
							width: 52px;
							height: 52px;
							display: inline-block;

							img {
								width: 100%;
							}
						}

						span {
							font-size: 26px;
							margin-left: 18px;
						}
					}
				}
			}
		}
	}
</style>
