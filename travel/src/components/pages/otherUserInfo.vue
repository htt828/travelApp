<template>
	<div class="otherUserInfo">
		<van-nav-bar left-arrow title='个人信息' @click-left='goBack()'></van-nav-bar>
		<div class="top">
			<div class="headImg">
				<img :src="userInfo.head" width="100%" @click="headPreview" />
			</div>
			<div class="top-right">
				<div class="userName">{{userInfo.userName}}</div>
				<div class="top-right-bottom">性别:{{userInfo.gender===1?'男':'女'}}</div>
				<div class="top-right-bottom">年龄:{{userInfo.age}}岁</div>
			</div>
		</div>
		<van-cell title="旅游日记" is-link @click='goTravelContent' />
		<div v-show="showFocus">
			<van-cell @click='focus' v-show="!isFocus" value="关注TA" title="" value-class='focusCell' :center='true' />
			<van-cell @click='focus' v-show="isFocus" value="取消关注" title="" value-class='focusCell' :center='true' />
		</div>
	</div>
</template>

<script>
	import {Toast} from 'vant'
	import {ImagePreview } from 'vant'
	import url from '@/serviceAPI.js'
	export default{
		data(){
			return{
				userId:'',
				userInfo:{},
				isFocus:false,
				showFocus:true,
				showDel:false
			}
		},
		created() {
			this.userId = this.$route.params.userId
			this.getUserInfo()
			if(this.userId == JSON.parse(localStorage.loginInfo).id){
				this.showDel = true
				this.showFocus = false
			}else{
				this.showDel = false
				this.showFocus = true
			}
		},
		methods:{
			//关注
			focus(){
				this.$axios.post(url.focus, {
					toUserId: this.userId,
					fromUserId: JSON.parse(localStorage.loginInfo).id,
					status: !this.isFocus
				}).then(res=>{
					if(res.data.code === 200){
						
						if(!this.isFocus){
							this.isFocus = true
							Toast.success({message:'关注成功',duration:800})
						}else{
							this.isFocus =  false
							Toast.success({message:'取关成功',duration:800})
						}
						
					}
				})
			},
			headPreview() {
				ImagePreview({
					images: [
						this.userInfo.head
					],
					showIndex: false
				});
			},
			goTravelContent(){
				this.$router.push({name:'travelContents',params:{userId:this.userId,showDel:this.showDel}})
			},
			getUserInfo(){
				this.$axios.post(url.getLoginInfo,{userId:this.userId}).then(res=>{
					if(res.data.code === 200){
						this.userInfo = res.data.data
					}
				})
				this.$axios.post(url.getLoginInfo,{userId:JSON.parse(localStorage.loginInfo).id}).then(res=>{
					if(res.data.code === 200){
						if(res.data.data.focusTo.length>0){
							
							if(res.data.data.focusTo.indexOf(this.userId)!=-1){
								this.isFocus = true
							}
						}
						
					}
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.focusCell{
		color: #4FC9B4;
		margin-left: -10%;
	}
	.top{
		margin-bottom: .5rem;
		padding-bottom: 3rem;
		border-bottom: 1px solid #EEEEEE;
		padding:1.1rem;
		background: white;
		display: flex;
	}
	.top .headImg{
		margin-right: 1rem;
		flex: 2;
	}
	.headImg img{
		object-fit: cover;
		width: 3.4rem;
		height: 3.2rem;
		border-radius: 8px;
	}
	.top .top-right{
		flex: 8;
	}
	.userName{
		font-size: 1rem;
	}
	.top-right-bottom{
		margin-top: .3rem;
		font-size: .8rem;
		color: #999999;
	}
</style>
