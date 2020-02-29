<template>
	<div class="login">
		<van-nav-bar
			title="登录"
			left-arrow
			@click-left="onClickLeft"
			:border="false"
		/>
		<div class="head">
			<img src="../../assets/default.jpg" />
		</div>
		<div class="regContainer">
			<van-field
				clearable
				@clear='userName=""'
				@input = 'inputName'
				left-icon="contact"
				v-model="userName"
				placeholder="请输入用户名"
				:error-message='userNameMsg'
			/>
			<van-field
				@input = 'inputPwd'
				left-icon="lock"
				type="password"
				placeholder="请输入密码"
				:error-message="pwdMsg"
				v-model="password"
			/>
			<div class="regbtn">
				<van-button :loading="openLoading" @click='loginAction' round  size="large" type="warning" color="#4fc9b4">登录</van-button>
			</div>
			<div class="more">
				<p @click="goRegister">我要注册</p>
				<p>忘记密码？</p>
			</div>
		</div>
	</div>
</template>

<script>
	import {Toast} from 'vant'
	import url from '@/serviceAPI.js'
	export default{
		data(){
			return{
				userName:'',
				password:'',
				userNameMsg:'',
				pwdMsg:'',
				openLoading:false,//是否开启按钮的加载模式
			}
		},
		mounted() {
			var clientHeight = document.documentElement.clientHeight
			
			document.getElementsByClassName('login')[0].style.height = clientHeight + 'px'
			
		},
		methods:{
			//注册
			goRegister(){
				this.$router.go(-1)
			},
			//验证用户名
			inputName(){
				if(this.userName.length<3){
					return this.userNameMsg = '请输入长度大于三的字符串'
					this.isOk = false
				}
				this.userNameMsg = ''
				this.isOk = true
			},
			//验证密码
			inputPwd(){
				if(this.password.length<6){
					this.isOk = false
					return this.pwdMsg = '请输入长度大于6的字符串'
				}
				this.pwdMsg = ''
				this.isOk = true
			},
			loginAction(){
				if(!this.userName||!this.password){
					return Toast.fail({message:"请输入完整信息",duration:800})
				}
				this.isOk&&this.login()
			},
			login(){
				this.openLoading = true
				this.$axios.post(url.login,{userName:this.userName,password:this.password}).then((result)=>{
					if(result.data.code === 200){
						return new Promise((resolve,reject)=>{
							this.$axios.post(url.getLoginInfo,{userName:this.userName}).then(res=>{
								if(res.data.code === 200){
									let id = res.data.data._id
									let loginInfo = {
										userName:this.userName,
										password:this.password,
										id:id,
										newLikeMsgNum:res.data.data.newLikeMsgNum,
										newFocusMsgNum:res.data.data.newFocusMsgNum,
										newCommentMsgNum:res.data.data.newCommentMsgNum,
									}
									this.$store.commit('getLoginInfo',loginInfo)
								}
							})
							
							setTimeout(()=>{
								resolve()
							},500)
						}).then(()=>{
							this.$router.push({name:'index'})
						}).catch(()=>{
							Toast.fail({message:'登录状态保存失败',duration:800})
						})
						
						this.openLoading = false
						
					}else if(result.data.code === 201){
						Toast.fail({message:result.data.message,duration:800})
						this.openLoading = false
					}else if(result.data.code === 202){
						this.openLoading = false
						Toast.fail({message:result.data.message,duration:800})
					}else{
						this.openLoading = false
						Toast.fail({message:'登录失败，服务器异常',duration:800})
					}
				})
			},
			onClickLeft(){
				this.$router.go(-1)
			}
		}
	}
</script>

<style scoped="scoped">
	.more{
		color: #4fc9b4;
		font-size: .8rem;
		display: flex;
		text-align: center;
	}
	.more p{
		flex: 1;
		border-right: 2px solid #eee;
	}
	.regContainer{
		padding: 35px;
	}
	.head{
		height: 5rem;
		line-height: 11rem;
		text-align: center;
	}
	.head img{
		width: 5rem;
		border-radius: 50%;
		border: 1px solid #bfbc51;
	}
	.van-nav-bar .van-icon{
		color: #FFFFFF;
		font-size: 1rem;
	}
	.van-nav-bar__title{
		color: #fff;
		font-size: 1rem;
	}
	.van-nav-bar{
		background: none;
	}
	
	.login{
		background: url(../../assets/loginbg5.jpg) no-repeat;
		background-size: cover;
	}
	.van-cell{
		background: none;
		font-size: .87rem;
		padding: 1rem;
		color: #FFFFFF;
		border-bottom: 1px solid #FFFFFF;
		padding-left: 3px;
	}
	.regbtn{
		padding: 20px;
		
	}
	.van-button--large{
		font-size: .9rem;
		line-height: 40px;
		height: 2.2rem;
	}
	
</style>
