<template>
	<div class="updataUserName">
		<van-nav-bar left-arrow left-text="更改名字" @click-left='goBack()'>
			<van-button @click='saveUpdata' slot="right" size="small" type="primary">保存</van-button>
		</van-nav-bar>
		<div class="input-area">
			<input type="text" v-focus v-model='loginInfo.userName' />
			<p>好名字可以让你的朋友更容易记住你</p>
		</div>
		<van-loading v-show="showLoading" type="spinner" />
	</div>
</template>

<script>
	import url from '@/serviceAPI.js'
	export default {
		data() {
			return {
				showLoading:false,
				loginInfo: {},
				userName: ''
			}
		},
		created() {
			this.userName = JSON.parse(localStorage.loginInfo).userName
			this.getLoginInfo()
		},
		methods: {
			getLoginInfo() {
				
				this.$axios.post(url.getLoginInfo, {
					userName: this.userName
				}).then((res) => {
					
					if (res.data.code === 200) {
						
						this.loginInfo = res.data.data
					}
				})
			},
			saveUpdata() {
				this.showLoading = true
				this.$axios.post(url.updataUserInfo,{
					_id: this.loginInfo._id,
					userName: this.loginInfo.userName,
					age: this.loginInfo.age,
					gender: this.loginInfo.gender
				}).then(res=>{
					this.showLoading = false
					if(res.data.code === 200){
						let loginInfo = JSON.parse(localStorage.loginInfo)
						loginInfo.userName = this.loginInfo.userName
						localStorage.loginInfo = JSON.stringify(loginInfo)
						this.$router.push({name:'userInfo'})
					}
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.van-loading{
		position: absolute;
		top:40%;
		left: 50%;
	}
	.input-area {
		padding: .6rem;
	}

	.input-area p {
		color: #999999;
		font-size: .73rem;
	}

	.van-nav-bar,
	input {
		background: ghostwhite;
	}

	.van-nav-bar__text {
		color: #333333;
	}

	.van-nav-bar .van-icon {
		color: #333333;
	}

	input {
		padding-left: .3rem;
		margin-top: 1rem;
		width: 100%;
		padding-bottom: .3rem;
		border: none;
		border-bottom: 0.6px solid #4fc9b4;
	}
</style>
