<template>
	<div class="share_num">
		<ul>
			<li v-for="(item,index) in Zs" :key="index" class="li">
				<p class="top">{{item['name']}}</p>
				<p :class="{down_green:item.up_value.indexOf('-')!=-1}" style="color:red" class="center">{{item['current_price']}}</p>
				<div class="bottom">
					<span :class="{down_green:item.up_value.indexOf('-')!=-1}" style="color:red" class="left">{{item.up_value}}</span>
					<span :class="{down_green:item.up_value.indexOf('-')!=-1}" style="color:red" class="right">{{item.up_ratio}}</span>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				Zs: []
			}	
		},	
		created() {
			this.getZs();
		},
		methods: {
			getZs() {
				uni.request({
					url: '/api/stock/getRealTimeInfos/sh000001,sz399006,sz399001',
					success: (res) => {
						this.Zs = res.data;
					}
				})
			},
		}	
	}
	
</script>

<style lang="less" scoped>
	.share_num {
		width: 100%;
		margin-top: 50px;
		overflow-x: scroll;
		overflow-y: hidden;
	
		ul {
			display: -webkit-box;
			-webkit-overflow-scrolling: touch;
			display: -ms-flexbox;
			display: flex;
			-ms-flex-align: center;
			align-items: center;
			-ms-flex-pack: distribute;
			justify-content: space-around;
	
			.li {
				width: 30%;
				text-align: center;
				float: left;
				position: relative;
				color: #303030;
	
				&:first-child {
					&::after {
						display: none;
					}
				}
	
				.top {
					font-size: 38px;
					color: rgba(48, 48, 48, 0.741);
					margin-bottom: 4px;
					font-weight: bolder;
				}
	
				.center {
					font-size: 34px;
				}
	
				.bottom {
					font-size: 22px;
					margin: 7px auto 0;
	
					&:after {
						content: '';
						display: table;
						clear: both;
					}
	
					.left {
						float: left;
					}
	
					.right {
						float: right;
					}
				}
	
				&:after {
					display: block;
					content: '';
					background: #d5d5d4;
					position: absolute;
					width: 2px;
					height: 50px;
					top: 39%;
					transform: translateY(-50%);
				}
			}
	
			.active {
				color: #2ac83f;
			}
		}
	}
</style>
