<template>
	<div>
		<img class="bg" src="../../assets/userInfobg9.png" width="100%" />
		<img :src="loginInfo.head" @click="goUserInfo" class="head" width="17%" />
		<div class="info-body" id="infoBody">
			<p class="userName">{{loginInfo.userName}}</p>
			<p class="top-right">
				<img :src="isfemale?require('../../assets/female.png'):require('../../assets/male.png')" class="gender" />
				<span class="age">0 岁</span>
			</p>
			<div class="count">
				<p>
					<span @click="goTravelContents">{{loginInfo.contentCount}}</span>
					<span @click="goTravelContents">旅游日记</span>
				</p>
				<p>
					<span @click="goFocused">{{loginInfo.focusToCount}}</span>
					<span @click="goFocused">关注</span>
				</p>
				<p>
					<span @click="goFans">{{loginInfo.focusFromCount}}</span>
					<span @click="goFans">粉丝</span>
				</p>
			</div>

		</div>
	</div>
</template>

<script>
	import {
		ImagePreview
	} from 'vant';
	import url from '@/serviceAPI.js'
	export default {
		data() {
			return {
				userName: '',
				loginInfo: {},
				isfemale: true, //登录用户性别，默认为女
			}
		},
		created() {
			this.userName = JSON.parse(localStorage.loginInfo).userName
			this.getLoginInfo()

		},
		mounted() {
			//页面加载完成时调用
			setTimeout(() => {
				this.$nextTick(() => {
					let clientHeight = document.documentElement.clientHeight
					document.getElementById('infoBody').style.height = clientHeight - 120 + 'px'
				})
			}, 100)
		},
		methods: {
			goTravelContents(){
				this.$router.push({name:'travelContents',params:{userId:JSON.parse(localStorage.loginInfo).id,showDel:true}})
			},
			getLoginInfo() {
				this.$axios.post(url.getLoginInfo, {
					userName: this.userName
				}).then((result) => {
					if (result.data.code === 200) {
						this.loginInfo = result.data.data
						this.loginInfo.gender === 1 && (this.isfemale = false)
					}
				})
			},
			//去我的关注组件
			goFocused() {
				this.$router.push({
					name: 'focused'
				})
			},
			//去粉丝组件
			goFans(){
				this.$router.push({name:'fans'})
			},
			
			//点击头像预览头像图片
			/* headPreview() {
				ImagePreview({
					images: [
						require('../../assets/img/' + this.loginInfo.head)
					],
					showIndex:false
				});
			} */
			goUserInfo(){
				this.$router.push({name:'userInfo'})
			}
		}
	}
</script>

<style scoped="scoped">
	.count {
		display: flex;
		text-align: center;
	}

	.count p {
		font-size: .8rem;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.top-right {
		display: inline-block;
		padding: .2rem;
		padding-top: 0;
		padding-right: .2rem;
		background: #EEEEEE;
		border-radius: 10px;
		margin-bottom: .39rem;
	}

	.gender {
		vertical-align: middle;
	}

	.age {
		font-size: .6rem;
		color: #f685a7;
	}

	.bg {
		overflow: hidden;
		height: 5rem;
	}

	.head {
		position: absolute;
		top: 2.4rem;
		border-radius: 50%;
		left: 1.2rem;
		object-fit: cover;
		height: 3.3rem;
		width: 3.3rem;
	}

	.info-body {
		padding: .9rem;
		background: #FFFFFF;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		padding-top: .38rem;
	}

	.userName {
		margin-top: 0;
		color: #00000;
		font-weight: bold;
		display: inline-block;
		margin-right: 2rem;
		margin-bottom: .39rem;
	}
</style>
