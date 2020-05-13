<template>
	<view class="content reg">
		<view class="order">
			<text class="qes">手机号码</text>
			<m-input class="m-input" type="text" v-model="tel" placeholder="请输入注册手机号码" ></m-input>
		</view>

		<view class="order">
			<text class="qes">验证码</text>
			<m-input v-model="msg" type="text" placeholder="请在输入验证码" class="m-input"></m-input>
			<text @click="sendMsg()" class="send">{{getMsg}}</text>
		</view>

		<view class="order">
			<text class="qes">登录密码</text>
			<m-input v-model="password" type="text" placeholder="请输入6~12位密码" class="m-input"></m-input>
		</view>
		<view class="order">
			<text class="qes">确认密码</text>
			<m-input v-model="passwordRepeat" type="text" placeholder="请在输入密码" class="m-input"></m-input>
		</view>

		<view @click="sendRegist()" class="submit">
			确认
		</view>
	</view>
</template>

<script>
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
				value3: true,
				modelShow: false,
				tel: "",
				passwordRepeat: "",
				msg: "",
				password: "",
				verificationKey: ""
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
			//请求重置密码
			sendRegist() {
				//非空验证
				if (false) {} else if (this.tel == "") {
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
				uni.request({
					url: '/api/forgetPassword',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						phone: this.tel,
						verificationKey: this.verificationKey,
						verificationCode: this.msg,
						password: this.password,
						passwordRepeat: this.passwordRepeat
					},
					success: (res)=>{
						if (res.statusText != "OK") {
							uni.showToast({
								icon: 'none',
								title: "系统异常,请检查验证码是否正确以及密码与确认密码是否相同"
							});
							
						} else {
							uni.showToast({
								icon: 'none',
								title: "修改成功,请重新登陆"
							});
							uni.reLaunch({
								url: '../reg/reg',
							});
						}
					},
					fail: (err)=>{
						console.log(err,err)
					}
				})
			}
		}
	};
</script>

<style lang="less" scoped>
	@import 'less/reg.less';
</style>
