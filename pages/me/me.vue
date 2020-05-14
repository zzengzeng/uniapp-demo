<template>
	<div class="me-group content">
		<div class="user">
			<section>
				<img :src="userimg" alt="">
			</section>
			<section>
				{{username}}
			</section>
		</div>
		<div class="surplus_money">
			<ul>
				<router-link to="/recharge" tag="li" class="pay pay_in">
					<!--        <img src="@/static/images/in_money.png" alt="">-->
					<p>充值</p>
				</router-link>
				<li ></li>
				<router-link to="/charge" tag="li" class="pay pay_out">
					<!--        <img src="@/static/images/out_money.png" alt="">-->
					<p>提现</p>
				</router-link>
			</ul>
			<!-- <p class="money">
	        账户余额：{{money}}元
	      </p>-->
		</div>
		<div class="basicInfo">
			<p>我的账户：<span style="font-weight: bolder">{{phone}}</span>
				<span @click="exit()">退出<i class="iconfont icon-arrow-right"></i></span>
			</p>
			<p>我的资产：<span style="font-weight: bolder">{{money}}</span></p>
		</div>
		<div class="navList">
			<router-link to="/outNotice" tag="section" class="borderRight">
				<img src="@/static/images/noticelist.png" alt="">
				<span>公告列表</span>
			</router-link>
			<router-link to="/myMoney" tag="section">
				<img src="@/static/images/money.png" alt="">
				<span>资金明细</span>
			</router-link>
		</div>
		<div class="navList">
			<router-link to="/cl" tag="section" class="borderRight borderBottom">
				<img src="@/static/images/myList.png" alt="">
				<span>我的策略</span>
			</router-link>
			<router-link to="/followBull" tag="section" class="borderBottom">
				<img src="@/static/images/niuren.png" alt="">
				<span>关注牛人</span>
			</router-link>
			<router-link to="/kf" tag="section" class="borderRight">
				<img src="@/static/images/kefu.png" alt="">
				<span>客服中心</span>
			</router-link>
			<router-link to="/rz" tag="section">
				<img src="@/static/images/shiming.png" alt="">
				<span>实名认证</span>
			</router-link>
		</div>
		<div class="navList">
			<router-link to="/agreeMent" tag="section" class="borderRight borderBottom">
				<img src="@/static/images/hezuo.png" alt="">
				<span>合作协议</span>
			</router-link>
			<router-link to="/extension" tag="section" class="borderBottom">
				<img src="@/static/images/tuiguang.png" alt="">
				<span>推广</span>
			</router-link>
			<router-link to="/setting" tag="section" class="borderRight">
				<img src="@/static/images/setting.png" alt="">
				<span>设置</span>
			</router-link>
		</div>
	</div>
</template>

<script>
	import bg2 from "@/static/images/surplus_money.jpg";
	export default {
		beforeCreate: function() {
			document.getElementsByTagName("body")[0].className = "bg";
		},
		beforeDestroy: function() {
			document.body.removeAttribute("class", "bg");
		},
		mounted() {
			this.getUserInfo();
			//this.login();
		},
		methods: {
			//退出登录
			exit() {
				localStorage.clear();
				this.$router.push("/");
			},
			login() {
				if (!this.isLogin) {
					this.$router.push("/loginRegistrat");
				}
			},
			getUserInfo() {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url:'/api/user/',
					header:{
						Authorization: "Bearer " + userToken
					},
					success:(res)=>{
						if(res){
							this.isLogin = true;
							this.money = res.data.data.money;
							this.username = res.data.data.name;
							this.phone = res.data.data.phone;
							if (res.data.data.image) {
								// this.userimg = res.data.data.image;
								this.userimg = "/static/images/user_icon_big.png";
							} else {
								this.userimg = '/static/images/user_icon_big.png';
								console.log(2);
							}
						}else{
							this.$message.error("登录失败，请重新登录");
						}
					},
					fail:(err)=>{
						this.$router.push({
							path: '/loginRegistrat'
						})
					}
				});
				return;
				Axios.axiosGet(
					"/api/user/", {}, {
						Authorization: "Bearer " + userToken
					}
				).then(
					res => {
						if (res) {
							this.isLogin = true;
							this.money = res.data.data.money;
							this.username = res.data.data.name;
							this.phone = res.data.data.phone;
							console.log(res);
							if (res.data.data.image) {
								// this.userimg = res.data.data.image;
								this.userimg = "/static/images/user_icon_big.png";
							} else {
								this.userimg = '/static/images/user_icon_big.png';
								console.log(2);
							}
						} else {
							this.$message.error("登录失败，请重新登录");
						}
					},
					err => {
						this.$router.push({
							path: '/loginRegistrat'
						})
						//  this.$message("请登录查看更多页面");
					}
				);
			}
		},
		data() {
			return {
				//判断是否已经登录
				isLogin: false,
				//用户余额
				money: "--",
				phone: '',
				// 用户姓名
				username: "请登录",
				userimg: "@/assets/images/user_icon_big.png",
				bg: bg2,
				page1: [
					// {
					//   title : "我的推广",
					//   icon : "@/assets/images/me/mav_01.png",
					//   link : "/adv"
					// },
					// {
					//   title : "牛人收益",
					//   icon : "@/assets/images/me/mav_02.png",
					//   link : ""
					// },
					// {
					//   title : "我的关注",
					//   icon : "@/assets/images/me/mav_03.png",
					//   link : ""
					// }
				],
				page2: [{
						title: "公告列表",
						icon: "@/assets/images/me/mav_02.png",
						link: "/outNotice"
					},
					{
						title: "资金明细",
						icon: "@/assets/images/me/mav_04.png",
						link: "/myMoney"
					},
					{
						title: "我的策略",
						icon: "@/assets/images/me/mav_05.png",
						link: "/cl"
					}
				],
				page3: [{
						title: "关注牛人",
						icon: "@/assets/images/me/mav_03.png",
						link: "/followBull"
					},
					{
						title: "客服中心",
						icon: "@/assets/images/me/mav_01.png",
						link: "/kf"
					},
					{
						title: "实名认证",
						icon: "@/assets/images/me/mav_06.png",
						link: "/rz"
					},
					{
						title: "合作协议",
						icon: "@/assets/images/me/mav_07.png",
						link: "/agreeMent"
					},
					{
						title: "推广",
						icon: "@/assets/images/me/nav_08.png",
						link: "/extension"
					},
				],
				page4: [{
					title: '设置',
					icon: "@/assets/images/me/mav_09.png",
					link: "/setting"
				}]
			};
		}
	};
</script>

<style lang="less" scoped>
	@import 'less/me.less';
</style>
