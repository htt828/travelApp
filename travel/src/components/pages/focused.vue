<template>
	<div class="focused">
		<van-nav-bar
			title="关注"
			left-text="返回"
			left-arrow
			@click-left="goBack()"
		/>
		<div class="focus-area" v-show="!isempty">
			<form action="/">
				<van-search
					v-model="value"
					placeholder="请输入搜索关键词"
					@focus='onFocus'
					shape='round'
					v-show="!showCancel"
				/>
			</form>
			<form action="/">
				<van-search
					v-model="value"
					show-action
					placeholder="请输入搜索关键词"
					@focus='onFocus'
					@search="onSearch"
					@cancel="onCancel"
					shape='round'
					v-show="showCancel"
					@input='getFocusUser'
					v-focus
				/>
			</form>
			<div class="focus-body" v-for="(item,i) in focusUser" :key='i'>
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
			<p>您暂未关注任何好友哦，赶紧去关注吧</p>
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
				userId:'',
				focusUser:[],
				isempty:false
			}
		},
		created() {
			this.userId = JSON.parse(localStorage.loginInfo).id
			this.getFocusUser()
		},
		mounted() {
			let clientHeight = document.documentElement.clientHeight
			document.getElementsByClassName('focus-area')[0].style.height = clientHeight - 100 + 'px'
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
			onFocus(){
				this.showCancel = true
			},
			//获取关注用户
			getFocusUser(){
				this.$axios.post(url.getFocusUser,{userId:this.userId,focusName:this.value}).then(result=>{
					if(result.data.code === 200){
						if(result.data.data.length>0){
							this.focusUser = result.data.data
							this.isempty = false
						}else{
							this.isempty = true
						}
					}else if(result.data.code === 201){
						this.focusUser = []
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
	.focus-area{
		overflow: scroll;
	}
	.focus-body{
		padding: 1rem 1.2rem;
		background: white;
		border-bottom: 1px solid #EEEEEE;
		display: flex;
	}
	.userInfo{
		flex: 8;
		/* display: flex;
		flex-direction: column;
		justify-content: space-between; */
		margin-bottom: .3rem;
	}
	.desc{
		font-size: .8rem;
		color: #999999;
	}
	.headImg{
		
		flex: 1.4;
		border-radius: 50%;
		margin-right: 1rem;
	}
	.headImg img{
		vertical-align: middle;
		object-fit: cover;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
	}
	.userName{
		font-size: .95rem;
	}
</style>
