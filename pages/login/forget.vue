<template>
	<div class="content reg">
		<div class="order">
			<span class="qes">手机号码</span>
			<input type="text" v-model="tel" placeholder="请输入注册手机号码" class="a">
		</div>

		<div class="order">
			<span class="qes">验证码</span>
			<input v-model="msg" type="text" placeholder="请在输入验证码" class="a">
			<span @click="sendMsg()" class="send">{{getMsg}}</span>
		</div>

		<div class="order">
			<span class="qes">登录密码</span>
			<input v-model="password" type="text" placeholder="请输入6~12位密码" class="a">
		</div>
		<div class="order">
			<span class="qes">确认密码</span>
			<input v-model="passwordRepeat" type="text" placeholder="请在输入密码" class="a">
		</div>

		<div @click="sendRegist()" class="submit">
			确认
		</div>
	</div>
</template>

<script>
	export default {
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
		components: {
			ReturnTop
		},
		methods: {
			//发送验证码
			sendMsg() {
				if (!this.send) {
					this.$message(`请在${this.num}秒后再次发送验证码`)
					return false;
				}
				Axios.postAxios('/api/verificationCode/forgetPassword', {
					phone: this.tel,
				}).then((res) => {
					if (res.data.msg == "手机号已被注册！") {
						this.$message("手机号已被注册！");
					} else if (res.data.status) {
						this.$message("短信发送成功");
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
						this.$message("请输入手机号！");
					} else if (res.data.msg == "请输入正确的手机号！") {
						this.$message("请输入正确的手机号！");
					} else {
						this.$message("此手机号未注册");
					}
				}, (err) => {
					console.log(err.response);
				})
			},
			//请求重置密码
			sendRegist() {
				//非空验证
				if (false) {} else if (this.tel == "") {
					this.$message("手机号码不能为空");
					return false;
				} else if (this.msg == "") {
					this.$message("验证码不能为空");
					return false;
				} else if (this.password == "") {
					this.$message("密码不能为空");
					return false;
				} else if (this.passwordRepeat == "") {
					this.$message("确认密码不能为空");
					return false;
				}
				Axios.postAxios('/api/forgetPassword', {
					phone: this.tel,
					verificationKey: this.verificationKey,
					verificationCode: this.msg,
					password: this.password,
					passwordRepeat: this.passwordRepeat
				}).then((res) => {
					console.log(res);
					if (res.statusText != "OK") {
						this.$message("系统异常,请检查验证码是否正确以及密码与确认密码是否相同");
					} else {
						this.$message("注册成功,请重新登陆");
						this.$router.push("/loginRegistrat");
					}
				}, (err) => {
					console.log(err.response);
				})
			},

			select() {
				this.modelShow = true;
			},
			selectBesure() {
				this.modelShow = false;
			}
		}
	};
</script>

<style>
	
</style>
