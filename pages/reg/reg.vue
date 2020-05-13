<template>
	<view class="content reg">
		<view class="order">
			<text class="qes">邀请码</text>
			<m-input class="m-input" v-model="code" type="text" placeholder="请填写邀请码"></m-input>
		</view>
		<view class="order">
			<text class="qes">手机号码</text>
			<m-input type="text" v-model="tel" placeholder="请输入手机号码" class="m-input"></m-input>
			<text @click="sendMsg()" class="send">{{getMsg}}</text>
		</view>

		<view class="order">
			<text class="qes">手机验证码</text>
			<m-input type="text" v-model="msg" placeholder="请输入手机验证码" class="m-input"></m-input>
		</view>

		<view class="order">
			<text class="qes">登录密码</text>
			<m-input type="password" v-model="password" placeholder="请输入6~12位密码" class="m-input"></m-input>
		</view>
		<view class="order">
			<text class="qes">确认密码</text>
			<m-input type="password" v-model="passwordRepeat" placeholder="请再次输入密码" class="m-input"></m-input>
		</view>

		<view @click="sendRegist()" class="submit">
			立即注册
		</view>
	</view>
</template>

<script>
	import service from '@/service.js';
	import mInput from '@/components/m-input.vue';

	export default {
		components: {
			mInput
		},
		data() {
			return {
				//倒计时
				num: 60,
				send: true,
				//动态修改倒计时
				getMsg: "获取验证码",
				//邀请码
				code: "",
				//电话
				tel: "",
				// 验证码返回值
				verificationKey: "",
				// 用户输入验证码
				msg: "",
				// 密码
				password: "",
				// 确认密码
				passwordRepeat: ""
			};
		},
		methods: {
			//发送验证码
			sendMsg() {
				if (!this.send) {
					uni.showToast({
						icon: 'none',
						title: `请在${this.num}秒后再次发送验证码`
					});
					return false;
				}
				uni.request({
					url: '/api/verificationCode/forgetPassword',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						phone: this.tel
					},
					success: (res) => {
						if (res.data.msg == "手机号已被注册！") {
							uni.showToast({
								icon: 'none',
								title: "手机号已被注册！"
							});
						} else if (res.data.status) {
							uni.showToast({
								icon: 'none',
								title: "短信发送成功"
							});
							this.verificationKey = res.data.data.verificationKey
							this.send = false;
							//修改定时器this指向，也可使用箭头函数
							const _this = this;
							let time = setInterval(function() {
								_this.num--;
								_this.getMsg = _this.num;
								// console.log(_this.num)
								if (_this.num == 0) {
									_this.num = 60;
									clearInterval(time);
									_this.send = true;
									_this.getMsg = "获取验证码"
								}
							}, 1000)
						} else if (res.data.msg == "请输入手机号！") {
							uni.showToast({
								icon: 'none',
								title: "请输入手机号！"
							});
						} else if (res.data.msg == "请输入正确的手机号！") {
							uni.showToast({
								icon: 'none',
								title: "请输入正确的手机号！"
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: "此手机号未注册"
							});
						}
					},
					fail: (err) => {
						console.log(err, 'err')
					}
				})
			},
			//请求注册
			sendRegist() {
				//非空验证
				if (this.code == "" || this.code == undefined) {
					uni.showToast({
						icon: 'none',
						title: "邀请码不能为空"
					});
					return false;
				} else if (this.tel == "") {
					uni.showToast({
						icon: 'none',
						title: "手机号码不能为空"
					});
					return false;
				} else if (this.msg == "") {
					uni.showToast({
						icon: 'none',
						title: "验证码不能为空"
					});
					return false;
				} else if (this.password == "") {
					uni.showToast({
						icon: 'none',
						title: "密码不能为空"
					});
					return false;
				} else if (this.passwordRepeat == "") {
					uni.showToast({
						icon: 'none',
						title: "确认密码不能为空"
					});
					return false;
				}
				uni.request(
					{
						url: '/api/users',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							code: this.code,
							phone: this.tel,
							verificationKey: this.verificationKey,
							verificationCode: this.msg,
							password: this.password,
							passwordRepeat: this.passwordRepeat
						},
						success: (res)=>{
							if (!res.data.status) {
								uni.showToast({
									icon: 'none',
									title: res.data.msg
								});
							} else {
								uni.showToast({
									icon: 'none',
									title: "注册成功,请重新登陆"
								});
								uni.reLaunch({
									url: '../reg/reg',
								});
							}
						},
						fail: (err)=>{
							console.log(err,'err')
						}
					}
				)
			},
			register() {
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
				if (this.email.length < 3 || !~this.email.indexOf('@')) {
					uni.showToast({
						icon: 'none',
						title: '邮箱地址不合法'
					});
					return;
				}

				const data = {
					account: this.account,
					password: this.password,
					email: this.email
				}
				service.addUser(data);
				uni.showToast({
					title: '注册成功'
				});
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	@import 'less/reg.less';
</style>
