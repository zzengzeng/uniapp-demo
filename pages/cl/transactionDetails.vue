<template>
	<view class="content">
		<div class="detail">
			<div class="d1">
				<p>{{detailData.name}}({{detailData.code}})</p>
				<p>状态：已结算</p>
			</div>
			<div class="d1">
				订单号：{{detailData.order_no}}
			</div>
			<div class="d1">
				<p>交易本金：{{detailData.xingyongjin}}</p>
				<p>交易股数：{{detailData.num}}</p>
			</div>
			<div class="d1">
				<p>买入价：{{detailData.price}}</p>
				<p>卖出价：{{detailData.deal_money}}</p>
			</div>
			<div class="d1">
				<p>买入成交：{{Number(detailData.price)*Number(detailData.num)|filterNum}}</p>
				<p>卖出成交：{{Number(detailData.deal_money)*Number(detailData.num)|filterNum}}</p>
			</div>
			<div class="d1">
				<p v-if="detailData.is_entrust!==99">买入类型：即时成交</p>
				<p v-else>买入类型：委托成交</p>
				<p>卖出类型：{{detailData.pingcang_type}}</p>
			</div>
			<div class="d1">
				<p>策略盈亏：{{Number(detailData.deal_money)*Number(detailData.num)-Number(detailData.price)*Number(detailData.num) |filterNum}}</p>
				<p>交易盈亏：{{detailData.profit |filterNum}}</p>
			</div>
			<div class="d1">
				<p>利益分配：{{Number(detailData.deal_money)*Number(detailData.num)-Number(detailData.price)*Number(detailData.num)|filterNum}}</p>
				<p>总手续费：{{Number(detailData.count_diyanfei)+Number(detailData.cangfei) |filterNum}}</p>
			</div>
			<div class="d1">
				<p>买手续费：{{Number(detailData.cangfei)}}</p>
				<p>冻结信用金：{{detailData.count_xingyongjin}}</p>
			</div>
			<div class="d1">
				<p>返还：--</p>
				<p>合约期限：{{detailData.chicang_max_day}}</p>
			</div>
			<div class="d1">
				买入时间：{{detailData.created_at}}
			</div>
			<div class="d1">
				卖出时间：{{detailData.deal_time}}
			</div>
			<div class="d1">
				<p>递延费：{{detailData.count_diyanfei}}</p>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tactic_id: '',
				detailData: {},
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			this.tactic_id = option.id;
			this.getDetail();
		},
		methods: {
			//获取详情
			getDetail() {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url: '/api/strategyInfos',
					method: 'POST',
					data: {
						tactic_id: this.tactic_id
					},
					header: {
						Authorization: "Bearer " + userToken
					},
					success: (res) => {
						this.detailData = res.data.data
					},
					fail: (err) => {
						console.log(err);
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		background: #fff;
		padding: 0;
		.detail {
			.d1 {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				height: 80px;
				line-height: 80px;
				padding: 0 40px;
				font-size: 28px;
				font-weight: 600;
				color: #333333;
				border-bottom: 2px solid #55555542;

				p {
					width: 50%;
				}
			}
		}
	}
</style>
