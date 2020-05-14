<template>
	<div class="search">
		<div class="input">
			<i>
				<img :src="require('@/static/images/search.png')" />
			</i>
			<input v-model="searchInput" placeholder="请输入股票代码/名称" />
		</div>
		<div v-show="addInput.length != 0" class="search_div">
			<ul>
				<li v-for="(item,index) in addInput" :key="index">
					<div @click="postSearch(item.code)">
						<span class="left">{{item.code | filtersName}}</span>
						<span style="margin-left:.2rem;" class="left">{{item.name}}</span>
					</div>
					<span @click="addMyself(item.code)" class="right">点击添加</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				searchInput: "",
				addInput: [],
			}
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
		methods: {
			postSearch(code) {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url: '/api/selfstock',
					method: "POST",
					data: {
						code: code
					},
					header: {
						'Authorization': "Bearer " + userToken,
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						console.log(res, 'res')
					},
					fail: (err) => {
						console.log(err, 'err')
					}
				})
			},
			addMyself(code) {
				let userToken = uni.getStorageSync('Authorization');
				uni.request({
					url: '/api/selfstock',
					method: "POST",
					data: {
						code: code
					},
					header: {
						'Authorization': "Bearer " + userToken,
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						if (res.data.status) {
							uni.showToast({
								icon: 'none',
								title: '已添加到自选股票'
							});
						}
					},
					fail: (err) => {
						console.log(err, 'err')
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.search {
		position: absolute;
		top: 30px;
		z-index: 2;
		left: 12%;
		width: 72%;

		.input {
			height: 61px;
			border-radius: 30px;
			padding-left: 22px;
			background: rgba(0, 0, 0, 0.54);
			display: flex;
			align-items: center;

			i {
				display: inline-block;
				width: 32px;
				height: 32px;

				img {
					width: 100%;
				}
			}

			/deep/uni-input {
				outline: none;
				-webkit-appearance: button;
				-webkit-appearance: none;
				border-radius: 0;
				border: none;
				background: none;
				color: #fff;
				font-size: 28px;
			}

			input::-webkit-input-placeholder {
				color: #fff;
			}
		}
	}

	.search_div {
		padding: 20px 0;
		background: #fff;
		width: 100%;
		margin: auto;

		ul {
			li {
				padding: 0 20px;
				line-height: 50px;
				border: 1px solid #cccbcb;
				border-top: none;
				overflow: hidden;

				.left {
					float: left;
				}

				.right {
					float: right;
					color: #ef584d;
				}
			}
		}
	}
</style>
