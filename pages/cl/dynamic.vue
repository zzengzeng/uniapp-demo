<template>
	<view class="content dynamic-wrap">
		<view class="uni-list container">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in Dt" :key="index">
				<view class="uni-media-list">
					<div class="dynamic">
						<div class="user">
							<span class="icon">
								<img  :src="item.user.data.image" />
							</span>
							<span class="username">{{item.user.data.name}}</span>
						</div>
						<div class="transaction">
							<div class="user_num">{{item.shares.data.name}}&nbsp;&nbsp;&nbsp;{{item.shares.data.code}}</div>
							<div v-if="item.price != null" class="buy">
								{{item.price}}&nbsp;&nbsp;&nbsp;
								<span>买入</span>
							</div>
							<div v-if="item.user.data.updated_at!= null" class="time">
								{{item.user.data.updated_at | filterDate}}
								<!-- 09-27 10:50 -->
							</div>
						</div>
					</div>
				</view>
			</view>
		</view>
		<uni-load-more :status="status"  :icon-size="16" :content-text="contentText" />
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
					url: '/api/tactics/list/new?include=user,shares',
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
	.dynamic-wrap {
		padding: 0;
		background: #fff;
		.uni-list {
			position: relative;
			padding: 0 28px;

			.dynamic {
				&::after {
					content: '';
					display: table;
					clear: both;
				}

				.user {
					margin: 32px auto 26px;

					&::after {
						content: '';
						display: table;
						clear: both;
					}

					.icon {
						float: left;
						width: 36px;
						height: 36px;

						img {
							width: 100%;
						}
					}

					.username {
						flex: left;
						margin-left: 18px;
						font-size: 24px;
						line-height: 38px;
					}
				}

				.transaction {
					border-bottom: 2px solid #eaeae9;
					padding-bottom: 20px;

					&::after {
						content: '';
						display: table;
						clear: both;
					}

					.user_num {
						float: left;
						font-size: 26px;
					}

					.buy {
						float: left;
						font-size: 26px;
						margin-left: 120px;

						span {
							color: #909090;
						}
					}

					.time {
						float: right;
						color: #919090;
						font-size: 26px;
					}
				}
			}
		}
		
	}
</style>
