<template>
	<div class="fans">
		<van-nav-bar
			title="我的粉丝"
			left-text="返回"
			left-arrow
			@click-left="goBack()"
		/>
		<div class="fans-area" v-show="!isempty">
			<form action="/">
				<van-search
					v-model="value"
					placeholder="请输入搜索关键词"
					@focus='onfocus'
					shape='round'
					v-show="!showCancel"
				/>
			</form>
			<form action="/">
				<van-search
					v-model="value"
					show-action
					placeholder="请输入搜索关键词"
					@focus='onfocus'
					@search="onSearch"
					@cancel="onCancel"
					shape='round'
					v-show="showCancel"
					@input='getfansUser'
					v-focus
				/>
			</form>
			<div class="fans-body" v-for="(item,i) in fansUser" :key='i'>
				<div class="headImg">
					<img @click="goOtherUserInfo(item._id)" :src="item.head" width="100%" />
				</div>
				<div class="userInfo">
					<div class="userName">{{item.userName}}</div>
					<div class="desc">个性签名</div>
				</div>
			</div>
		</div>
		<div class="empty" v-show="isempty">
			<img src="../../assets/img/noData.png" />
			<p>暂无好友关注您</p>
		</div>
	</div>
</template>

<script>
	import url from '@/serviceAPI.js'
	import {Toast} from 'vant'
	export default{
		data(){
			return{
				value:'',
				showCancel:false,
				userName:'',
				fansUser:[],
				isempty:false
			}
		},
		created() {
			this.userName = JSON.parse(localStorage.loginInfo).userName
			this.getfansUser()
		},
		mounted() {
			let clientHeight = document.documentElement.clientHeight
			document.getElementsByClassName('fans-area')[0].style.height = clientHeight - 100 + 'px'
			document.getElementsByClassName('empty')[0].style.height = clientHeight - 100 + 'px'
		},
		methods:{
			goOtherUserInfo(id){
				this.$router.push({name:'otherUserInfo',params:{userId:id}})
			},
			onSearch(){
				
			},
			onCancel(){
				this.showCancel = false
			},
			//与输入框获得焦点的时候
			onfocus(){
				this.showCancel = true
			},
			//获取关注用户
			getfansUser(){
				
				this.$axios.post(url.getFansUser,{userId:JSON.parse(localStorage.loginInfo).id,fansName:this.value}).then(result=>{
					if(result.data.code === 200){
						if(result.data.data.length>0){
							this.fansUser = result.data.data
							this.isempty = false
						}else{
							this.isempty = true
						}
					}else if(result.data.code === 201){
						this.fansUser = []
						Toast.fail({message:'暂无搜索结果',duration:800})
					}
				})
			},
			
		}
	}
</script>

<style scoped="scoped">
	.empty{
		background: white;
		text-align: center;
	}
	.empty img{
		margin-top: 33%;
	}
	.empty p{
		font-size: .9rem;
		color: #999999;
	}
	.fans-area{
		overflow: scroll;
	}
	.fans-body{
		padding: 1rem 1.2rem;
		background: white;
		border-bottom: 1px solid #EEEEEE;
		display: flex;
	}
	.userInfo{
		flex: 8;
		margin-bottom: .3rem;
	}
	.desc{
		font-size: .8rem;
		color: #999999;
	}
	.headImg{
		flex: 1.4;
		margin-right: 1rem;
	}
	.headImg img{
		border-radius: 50%;
		vertical-align: middle;
		object-fit: cover;
		width: 3rem;
		height: 3rem;
	}
	.userName{
		font-size: .95rem;
	}
</style>
