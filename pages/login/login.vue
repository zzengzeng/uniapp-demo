<template>
	<view class="content login-wrap">
		<view class="logo">
			<img :src="require('@/static/images/logo_web.jpg')" alt="">
		</view>
		<view class="message">
			<view class="input-item">
				<m-input class="m-input" v-model="phone" type="number" clearable focus min="0" placeholder="请输入手机号码"></m-input>
			</view>
			<view class="input-item">
				<m-input class="m-input" type="password" v-model="pwd" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view @click="submit()" class="login">登录</view>
		<view class="forget">
			<text @click="forget()" class="left">忘记密码？</text>
			|
			<text tag="span" @click="toReg()" class="right">现在注册 ></text>
		</view>
		<!-- <view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input class="m-input" type="text" clearable focus v-model="account" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="bindLogin">登录</button>
		</view>
		<view class="action-row">
			<navigator url="../reg/reg">注册账号</navigator>
			<text>|</text>
			<navigator url="../pwd/pwd">忘记密码</navigator>
		</view>
		<view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
			<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
				<image :src="provider.image" @tap="oauth(provider.value)"></image>
				#ifdef MP-WEIXIN
				<button v-if="!isDevtools" open-type="getUserInfo" @getuserinfo="getUserInfo"></button>
				#endif
			</view>
		</view> -->
	</view>
</template>

<script>
	import service from '../../service.js';
	import {mapMutations,mapGetters} from 'vuex';
	import mInput from '../../components/m-input.vue'
	export default {
		components: {
			mInput
		},
		data() {
			return {
				modelShow: false,
				phone: "",
				pwd: "",
			}
		},
		created() {
			// uni.request({
			//     url: '/api/tactics/home/new?include=user,shares', //仅为示例，并非真实接口地址。
			//     success: (res) => {
			// 			console.log(res,'res')
			//     }
			// });
		},
		computed : {
		...mapGetters([
				'Authorization'
			]),
		},
		methods: {
			initProvider() {
				const filters = ['weixin', 'qq', 'sinaweibo'];
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						console.log(res, 'res')
						if (res.provider && res.provider.length) {
							for (let i = 0; i < res.provider.length; i++) {
								if (~filters.indexOf(res.provider[i])) {
									this.providerList.push({
										value: res.provider[i],
										image: '../../static/img/' + res.provider[i] + '.png'
									});
								}
							}
							this.hasProvider = true;
						}
					},
					fail: (err) => {
						console.error('获取服务供应商失败：' + JSON.stringify(err));
					}
				});
			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			bindLogin() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				if (this.account.length < 5) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 5 个字符'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				/**
				 * 下面简单模拟下服务端的处理
				 * 检测用户账号密码是否在已注册的用户列表中
				 * 实际开发中，使用 uni.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
				 */
				const data = {
					account: this.account,
					password: this.password
				};
				const validUser = service.getUsers().some(function(user) {
					return data.account === user.account && data.password === user.password;
				});
				if (validUser) {
					this.toMain(this.account);
				} else {
					uni.showToast({
						icon: 'none',
						title: '用户账号或密码不正确',
					});
				}
			},
			oauth(value) {
				uni.login({
					provider: value,
					success: (res) => {
						uni.getUserInfo({
							provider: value,
							success: (infoRes) => {
								/**
								 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
								 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
								 */
								this.toMain(infoRes.userInfo.nickName);
							},
							fail() {
								uni.showToast({
									icon: 'none',
									title: '登陆失败'
								});
							}
						});
					},
					fail: (err) => {
						console.error('授权登录失败：' + JSON.stringify(err));
					}
				});
			},
			getUserInfo({
				detail
			}) {
				if (detail.userInfo) {
					this.toMain(detail.userInfo.nickName);
				} else {
					uni.showToast({
						icon: 'none',
						title: '登陆失败'
					});
				}
			},
			toMain(userName) {
				this.login(userName);
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../main/main',
					});
				} else {
					uni.navigateBack();
				}

			},
			// 控制vuex
			...mapMutations({
				setAuthorization: "SET_AUTHORIZATION"
			}),
			submit() {
				uni.request({
					url: '/api/authorizations',
					method: 'POST',
					header:{
						'content-type':'application/x-www-form-urlencoded'
					},
					data: {
						phone: this.phone,
						password: this.pwd
					},
					success: (res) => {
						if(res.statusCode == 201){
							this.setAuthorization(res.data.access_token);
							//将token存储到本地
							localStorage.setItem("Authorization",this.Authorization);
							uni.reLaunch({
								url: '../main/main',
							});
						}else{
							uni.showToast({
								icon: 'none',
								title: '请检查您的用户名或密码是否正确'
							});
						}
					}
				});
			},
			forget() {
				uni.reLaunch({
					url: '../reg/reg',
				});
				// this.$router.push('/loginRegistrat/forget')
			},
			toReg(){
				uni.reLaunch({
					url: '../reg/reg',
				});
			},
			back() {
				this.$router.push({
					path: '/'
				})
			}
		},
		onReady() {
			// this.initPosition();
			// this.initProvider();
			// // #ifdef MP-WEIXIN
			// this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
			// // #endif
		}
	}
</script>

<style lang="less" scoped>
	@import 'less/login.less';
</style>
