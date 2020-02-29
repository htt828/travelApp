<template>
	<div class="register">
		
		<van-nav-bar
			title="注册"
			left-arrow
			@click-left="onClickLeft"
			:border="false"
		/>
		<div class="head">
			<img src="../../assets/default.jpg" />
		</div>
		<div class="regContainer">
			<van-field
				@input = 'inputName'
				v-model="userName"
				placeholder="请输入用户名"
				clearable
				@clear='userName=""'
				:error-message="userNameMsg"
				left-icon="contact"
			/>
			<van-field
				@input='inputPwd'
				left-icon="lock"
				v-model="password"
				type="password"
				placeholder="请输入密码"
				
				:error-message='pwdMsg'
			/>
			<div class="regbtn">
				<van-button :loading="openLoading" @click='registerAction' round  size="large" type="warning" color="#4fc9b4">立即注册</van-button>
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
				openLoading:false,
				userName:'',
				password:'',
				userNameMsg:'',
				pwdMsg:'',
				isOk:false
			}
		},
		mounted() {
			var clientHeight = document.documentElement.clientHeight
			
			document.getElementsByClassName('register')[0].style.height = clientHeight + 'px'
			
		},
		methods:{
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
					return this.pwdMsg = '请输入长度大于6字符串'
				}
				this.pwdMsg = ''
				this.isOk = true
			},
			registerAction(){
				if(!this.userName||!this.password){
					return Toast.fail({message:'请输入完整信息',duration:800})
				}
				this.isOk&&this.register()
			},
			register(){
				this.openLoading = true//开启加载状态
				this.$axios.post(url.register,{userName:this.userName,password:this.password}).then((result)=>{
					if(result.data.code === 200){
						this.openLoading = false
						Toast.success({message:'注册成功',duration:800})
						this.$router.push({name:'login'})
					}else if(result.data.code === 201){
						this.openLoading = false
						Toast.fail(result.data.message)
					}else{
						this.openLoading = false
						Toast.fail({message:'注册失败，服务器异常',duration:800})
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
	}
	.van-nav-bar__title{
		color: #fff;
		font-size: 1rem;
	}
	.van-nav-bar{
		background: none;
	}
	
	.register{
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
