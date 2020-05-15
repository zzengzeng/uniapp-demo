<template>
	<view class="content recharge">
		<div class="recharge-list">
			<div class="list-item" @click="toJump(item.link)" v-for="(item,index) in list" :key="index">
				<em>
					<img :src="item.imgUrl" alt="">
				</em>
				<span>{{item.title}}</span>
			</div>
		</div>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				ifOutline:true,//控制是否显示线下支付
				rechargeInfo:{},//线下支付信息
				list:[
					{
						title:'企业支付宝',
						link:'/pages/me/zfb',
						imgUrl:require('@/static/images/yl-logo.png')
					},
					{
						title:'企业对公账号',
						link:'/pages/me/dg',
						imgUrl:require('@/static/images/zfb-logo.png')
					}
				]
			}
		},
		methods:{
			// 跳转页面
			toJump(link){
				uni.navigateTo({
				    url: link
				});
			},
			//获取充值信息
			getInformation(){
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url:'/api/offlinecharge',
					header:{
						Authorization: "Bearer " + userToken,
					},
					success:(res)=>{
						this.ifOutline=res.data.status;
						this.rechargeInfo=res.data.data;
					},
					fail:(err)=>{
						uni.showToast({
							icon: 'none',
							title: '请检查网络，稍后再试！'
						});
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.recharge{
		background: #f2f6f9;
		padding: 0;
		.recharge-list{
			.list-item{
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 40px;
				background: #fff;
				margin-bottom: 40px;
				font-size: 30px;
				em{
					width: 60px;
					height: 60px;
					img{
						max-width: 100%;
					}
				}
				&:last-child{
					margin-bottom: 0;
				}
			}
		}
	}
</style>
