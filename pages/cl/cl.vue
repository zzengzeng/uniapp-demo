<template>
	<view class="content cl">
		<div class="loading-wrap" v-if="loading">
			<m-loading color='black' />
		</div>
		<div class="wrap" v-else>
			<div v-show="ojbkShow" class="zz"></div>
			<div v-show="ojbkShow" class="outer_box1">
				<div class="box">
					<span class="stop">止盈</span>
					<m-input type="number" v-model="stopIn" placeholder="请输入止盈价格"></m-input>
				</div>
				<div class="box">
					<span class="down_green stop">止损</span>
					<m-input type="number" v-model="stopOut" placeholder="请输入止损价格"></m-input>
				</div>
				<div class="box">
					<button @click="hide()" type="info">取消</button>
					<button @click="ojbk()" type="danger">确定</button>
				</div>
			</div>
			<div class="tab">
				<ul>
					<li @click="tabClick(index)" v-for="(item,index) in tab" :key="index" :class="{active:index == tabIndex}">{{item.title}}</li>
				</ul>
			</div>
			<div v-show="tabIndex == 0" class="tab-content">
				<div class="money">
					<div class="total">
						<p>总资产</p>
						<p>{{accountCount.asset}}</p>
					</div>
					<div class="info">
						<section>
							<p >可用资金</p>
							<p >{{accountCount.can_use}}</p>
						</section>
						<section>
							<p>持仓市值</p>
							<p >{{accountCount.market_value}}</p>
						</section>
						<section>
							<p >浮动盈亏</p>
							<p>{{accountCount.float_earn}}</p>
						</section>
					</div>
				</div>
				<div class="snav">
					<p class="snav_title">
						<span>名称/信用金</span>
						<span>盈亏/股数</span>
						<span>买入/现价</span>
						<span>止盈/止损</span>
					</p>
				</div>
				<div class="snav1">
					<ul>
						<li v-for="(item,index) in nowCc" :key="'chi'+index" class="newLi">
							<section @click="isShow(index)">
								<p style="font-weight: bolder;color: #333333">{{item.name}}</p>
								<p>{{item.xingyongjin}}</p>
							</section>
							<section @click="isShow(index)">
								<span :class="{down_green:item.float_earn<0}">{{item.float_earn}}</span>
								/{{item.num}}
							</section>
							<section @click="isShow(index)">
								{{item.price}}/
								<span :class="{down_green:item.current_price-item.price<0}">{{item.current_price}}</span>
							</section>
							<section @click="isShow(index)">{{item.max_price}}/{{item.min_price}}</section>
							<div class="handle" v-show="item.is_show===1">
								<span @click="sell(item.tactic_id)">卖出</span>
								<span @click="stop(item.tactic_id,item.max_price,item.min_price,item.min_min_price)">止盈止损</span>
								<span v-if="item.is_add == 1" @click="addXyj(item.tactic_id)">追加信用金</span>
							</div>
						</li>
					</ul>
					<p v-if="nowStatus == 0" class="nothing">暂无数据~</p>
				</div>
				<!-- <van-dialog show-cancbutton v-model="show" :before-close="sureSubmit">
					<p style="text-align: center;padding: 10px 5px" class="rnmtitle">追加信用金</p>
					<m-input v-model="xingyongjin" placeholder="请输入金额" class="pay_num" type="text" /></m-input>
				</van-dialog> -->
				<div class="uni-pop" v-if="show">
					<div class="uni-mask"></div>
					<div class="uni-modal">
						<div class="uni-modal__hd">
							<strong class="uni-modal__title">追加信用金</strong>
						</div>
						<div class="uni-modal__bd">
							<m-input v-model="xingyongjin" placeholder="请输入金额" class="pay_num" type="text" /></m-input>
						</div>
						<div class="uni-modal__ft">
							<div class="uni-modal__btn uni-modal__btn_default" @click="cancelSubmit"> 取消 </div>
							<div class="uni-modal__btn uni-modal__btn_primary" @click="sureSubmit"> 确定 </div>
							</div>
						</div>
					</div>	
				</div>
			</div>
			<div v-show="tabIndex==1" class="tab-content">
				<div class="snav">
					<p class="snav_title">
						<span>名称/信用金</span>
						<span>盈亏/股数</span>
						<span>买入/卖出</span>
						<span>建仓费/递延费</span>
					</p>
				</div>
				<div class="snav1">
					<ul>
						<li v-for="(item,index) in historyInfo" :key="'chi'+index" class="newLi" @click="toDetail(item.tactic_id)">
							<section>
								<p style="font-weight: bolder;color: #333333">{{item.name}}</p>
								<p>{{item.xingyongjin}}</p>
							</section>
							<section>
								<span>{{item.profit}}</span>
								/{{item.num}}
							</section>
							<section>{{item.price}}/{{item.deal_money}}</section>
							<section>{{item.cangfei}}/{{item.count_diyanfei}}</section>
						</li>
					</ul>
				</div>
			</div>
		</div>
		
	</view>
</template>

<script>
	import mInput from '@/components/m-input.vue';
	import mLoading from '@/components/m-loading.vue';
	export default {
		components: {
			mInput,
			mLoading
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
				loading: true,
				show: false,
				tactic_id: "",
				xingyongjin: "",
				wt: [],
				time: "",
				//定时器
				input: "",
				//热门股票
				hotShares: [],
				//历史交易信息
				historyInfo: [],
				//用户信息
				accountCount: {},
				tmpId: "",
				ojbkShow: false,
				stopIn: 0,
				stopOut: 0,
				//临时存储最小止损
				tmpOut: 0,
				// 历史记录页码数
				historyPage: 1,
				//历史记录
				history: [],
				//问题
				searchInput: [],
				//搜索显示框
				addInput: [],
				//当前持仓
				nowCc: [],
				//当前持仓是否为空
				nowStatus: 0,
				sindex: 0,
				tabIndex: 0,
				tab: [
					/*{
					  title: "策略"
					},*/
					{
						title: "资金"
					},
					{
						title: "历史"
					}
				],
				snav: [{
						title: "当前持仓"
					},
					{
						title: "当前委托"
					},
					{
						title: "历史交易"
					}
				]
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
					},
					fail: (err) => {
						console.log(err, 'err')
					}
				})
			}
		},
		mounted() {
			this.getNow();
			this.showHistory();
			this.getAccountCount();
			this.getHot();
			this.repeat();
			/*this.time = setInterval(()=>{
			  this.getNow();
			  this.getAccountCount();
			},3000)*/
		},
		//切换页面销毁定时器
		beforeDestroy() {
			clearInterval(this.time);
		},
		methods: {
			//去查看历史记录的交易详情
			toDetail(id) {
				this.$router.push({
					path: "/transactionDetails",
					query: {
						id: id
					}
				});
			},
			//取消追加信用金
			cancelSubmit(){
				this.show = false;
			},
			//确认追加信用金
			sureSubmit() {
				this.show = false;
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url:'/api/tactics/addshoudong',
					method:'POST',
					data:{
						tactic_id: this.tactic_id,
						xingyongjin: this.xingyongjin
					},
					header:{
						Authorization: "Bearer " + userToken,
						'content-type':'application/x-www-form-urlencoded'
					},
					success:(res) =>{
						if (res.data.status) {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
						}
					},
					fail:(err)=>{
						uni.showToast({
							icon: 'none',
							title: '添加失败'
						});
					}
				});
			},
			//获取委托
			getWt() {
				let userToken = localStorage.getItem("Authorization");
				uni.request({
					url:'/api/strategyEntrust',
					data:{
						'Authorization':"Bearer " + userToken
					},
					success:(res)=>{
						this.wt = res.data.data;
					},
					fail:(err)=>{
						console.log(err);
					}
				})
			},
			repeat() {
				this.time = setInterval(() => {
					// this.getNow1();
					this.getAccountCount();
				}, 2000);
			},

			//添加到搜索的历史记录，并跳转到K线页面
			postSearch(code) {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url:'/api/search',
					method: 'POST',
					data:{
						code:code
					},
					header:{
						Authorization:"Bearer " + userToken,
						'content-type':'application/x-www-form-urlencoded'
					},
					success:(res)=>{
						if (res.status) {
							console.log("历史记录添加成功");
						}
						//跳转到对应的K线页面
						this.$router.push({
							path: "/ks",
							query: {
								code: code
							}
						});
					},
					fail:(err)=>{
						console.log(err)
					}
				});
			},

			addXyj(id) {
				this.show = true;
				this.tactic_id = id;
				/*  let userToken = localStorage.getItem("Authorization");
				Axios.postAxios(
				  '/api/tactics/addshoudong',
				  {
				    tactic_id : id,
				    // xingyongjin : this.input
				    xingyongjin : xyj
				  },
				  {
				    Authorization: "Bearer " + userToken
				  }
				).then(res=>{
				    console.log(res.data)
				    if(res.data.status){
				      this.$message.success(res.data.msg);
				    }else{
				      this.$message.error(res.data.msg);
				    }
				},err=>{
				  console.log(err);
				  this.$message.error('添加失败');
				})*/
			},
			//获取热门推荐股票
			getHot() {
				uni.request({
					url:'/api/goods/hot',
					success:(res)=>{
						this.hotShares = res.data.data;
					}
				})
			},
			//获取历史交易信息
			getHistoryInfo() {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url:'/api/strategyHistory/normal',
					header:{
						Authorization: "Bearer " + userToken
					},
					success:(res)=>{
						this.historyInfo = res.data.data;
					},
					fail:(err)=>{
						
					}
				});
			},
			//获取用户账户信息
			getAccountCount() {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url:'/api/accountCount/normal',
					header:{
						Authorization: "Bearer " + userToken
					},
					success:(res)=>{
						this.accountCount = res.data.data;
					},
					fail:(err)=>{
						console.log(err,'err')
					}
				});
			},
			// 卖出
			async sell(id) {
				let userToken = uni.getStorageSync('Authorization');
				let ok = true;
				uni.showModal({
					title: '确认卖出',
					content: '您确认卖出此策略吗',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: true,
					success: (res) => {
						if(!res.confirm){
							ok = false;
						}
					}
				});

				if (!ok) {
					return false;
				}
				uni.request({
					url:'/api/tactics/sale',
					method:'POST',
					data:{
						tactic_id: id
					},
					header:{
						Authorization: "Bearer " + userToken,
						'content-type':'application/x-www-form-urlencoded'
					},
					success:(res)=>{
						if (res.data.status == false) {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							this.getNow();
						}
					},
					fail:(err)=>{
						console.log(err);
					}
				});
			},
			stop(id, max, min, min_min_price) {
				this.tmpId = id;
				this.ojbkShow = true;
				this.stopIn = max;
				this.stopOut = min;
				this.tmpOut = min_min_price;
			},
			hide() {
				this.tmpId = "";
				this.ojbkShow = false;
			},
			// 确认修改止盈止损
			// 确认修改止盈止损
			ojbk() {
				let userToken = uni.getStorageSync('Authorization');
				if (this.stopOut < this.tmpOut) {
					uni.showToast({
						icon: 'none',
						title: "最小止损不能小于" + this.tmpOut
					});
					return false;
				}
				uni.request({
					url:'/api/tactics/editprice',
					method:"POST",
					data:{
						tactic_id: this.tmpId,
						max_price: this.stopIn,
						min_price: this.stopOut
					},
					header:{
						Authorization: "Bearer " + userToken,
						'content-type':'application/x-www-form-urlencoded'
					},
					success:(res)=>{
						if (!res.data.status) {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							return false;
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							this.getNow();
							this.ojbkShow = false;
						}
					},
					fail:(err)=>{
						console.log(err);
					}
				});
			},
			//点击递延
			delay(id, v) {
				let userToken = localStorage.getItem("Authorization");
				uni.request({
					url:'/api/tactics/issell',
					method:'POST',
					data: {
						tactic_id: id,
						is_sell: v
					},
					header:{
						Authorization: "Bearer " + userToken,
						'content-type':'application/x-www-form-urlencoded'
					},
					success:(res)=>{
						if (!res.data.status) {
							uni.showToast({
								icon: 'none',
								title: '修改失败'
							});
							return false;
						} else {
							uni.showToast({
								icon: 'none',
								title: '修改成功'
							});
							this.getNow();
						}
					},
					fail:(err)=>{
						console.log(err)
					}
				});
				
			},
			//移除单条数据
			remove(code) {
				var that = this;
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url:'/api/search',
					method:'DELETE',
					data:{
						code: code
					},
					header:{
						Authorization: "Bearer " + userToken
					},
					success:(res)=>{
						that.showHistory();
					},
					fail:(err)=>{
						that.showHistory();
					}
				})
			},
			//上下翻页
			upDown(page) {
				if (page == 0) {
					if (this.historyPage == 1) {
						return false;
					}
					this.historyPage--;
				} else if (page == 1) {
					this.historyPage++;
				}
				console.log(this.historyPage);
				this.showHistory();
			},
			// 显示搜索历史
			showHistory() {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url: '/api/search',
					data:{
						page: this.historyPage
					},
					header: {
						'Authorization': "Bearer " + userToken
					},
					success: (res) => {
						if (!res.data.status) {
							//防止翻页溢出
							this.history.splice(0, this.history.length);
							this.upDown(0);
							return false;
						}
						//清空当前页面
						this.history.splice(0, this.history.length);
						this.history = this.history.concat(this.history, res.data.data);
					},
					fail: (err) => {
						console.log(err);
					}
				});
			},
			//失去焦点
			changeCount() {},
			//是否显示更多
			isShow(index) {
				console.log(this.nowCc[index].is_show);
				if (this.nowCc[index].is_show == 0) {
					this.nowCc[index].is_show = 1;
				} else {
					this.nowCc[index].is_show = 0;
				}
			},
			isShow2(index) {
				this.historyInfo[index].is_show = 1;
			},
			isShow3(index) {
				this.wt[index].is_show = 1;
			},
			//获取当前持仓
			getNow() {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url: '/api/strategyChiCang/normal',
					header: {
						'Authorization': "Bearer " + userToken
					},
					success: (res) => {
						this.loading = false;
						// console.log(res)
						this.nowCc = res.data.data;
						this.nowStatus = res.data.status;
					},
					fail: (err) => {
						console.log(err);
						this.loading = false;
						this.$router.push("/me");
					}
				})
			},
			getNow1() {
				let currentPrice = [];
				let floatEarn = [];
				let marketValue = [];
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url: '/api/strategyChiCang/normal',
					header: {
						'Authorization': "Bearer " + userToken
					},
					success: (res) => {
						res.data.data.forEach(item => {
							currentPrice.push(item.current_price);
							floatEarn.push(item.float_earn);
							marketValue.push(item.market_value);
						});
						this.nowCc.forEach((item, index) => {
							item.current_price = currentPrice[index];
							item.float_earn = floatEarn[index];
							item.market_value = marketValue[index];
						});
					},
					fail: (err) => {
						this.$router.push("/me");
					}
				});
			},
			//持仓委托交易
			snavClick(index) {
				this.sindex = index;
				if (index == 2) {
					this.getHistoryInfo();
				}
				if (index == 0) {
					this.getNow();
				}
				if (index == 1) {
					this.getWt();
				}
			},
			// 策略持仓
			tabClick(index) {
				this.tabIndex = index;
				if (index == 0) {
					this.getNow();
				} else if (index == 1) {
					clearInterval(this.time);
					this.getHistoryInfo();
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "less/cl.less";
</style>
