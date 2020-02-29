<template>
	<div class="message">
		<van-nav-bar title="消息"></van-nav-bar>
		<div class="message-item" @click="goLikeMessage">
			<div class="leftImg">
				<img src="../../assets/likeMessage.png" />
			</div>
			<div class="message-right">
				<span class="message-text">点赞</span>
				<img class="rightArrow" src="../../assets/rightArrow.png" />
				<span class="messageCount" v-show="userInfo.newLikeMsgNum>0">{{userInfo.newLikeMsgNum}}</span>
			</div>
		</div>
		<div class="message-item" @click="goFocusMessage">
			<div class="leftImg">
				<img src="../../assets/focus.png" />
			</div>
			<div class="message-right">
				<span class="message-text">关注</span>
				<img class="rightArrow" src="../../assets/rightArrow.png" />
				<span class="messageCount" v-show="userInfo.newFocusMsgNum>0">{{userInfo.newFocusMsgNum}}</span>
			</div>
		</div>
		
		<div class="message-item" @click="goCommentMessage">
			<div class="leftImg">
				<img src="../../assets/comment.png" />
			</div>
			<div class="message-right">
				<span class="message-text">评论</span>
				<img class="rightArrow" src="../../assets/rightArrow.png" />
				<span class="messageCount" v-show="userInfo.newCommentMsgNum>0">{{userInfo.newCommentMsgNum}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	import url from '@/serviceAPI.js'
	export default{
		data(){
			return{
				userInfo:{}
			}
		},
		created() {
			this.getUserInfo()
		},
		methods:{
			goLikeMessage(){
				this.$router.push({name:'likeMessage'})
			},
			goFocusMessage(){
				this.$router.push({name:'focusMessage'})
			},
			goCommentMessage(){
				this.$router.push({name:'commentMessage'})
			},
			getUserInfo(){
				this.$axios.post(url.getLoginInfo,{userId:JSON.parse(localStorage.loginInfo).id}).then(res=>{
					if(res.data.code === 200){
						this.userInfo = res.data.data
					}
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.rightArrow{
		float: right;
		vertical-align: middle;
	}
	.message-right{
		flex: 9;
		padding-bottom: .5rem;
		border-bottom: 1px solid #EEEEEE;
	}
	.leftImg{
		margin-right: .6rem;
		flex: 1;
	}
	img{
		vertical-align: middle;
	}
	.messageCount{
		display: inline-block;
		text-align: center;
		width: 1.1rem;
		height: 1.1rem;
		line-height: 1rem;
		border-radius: 50%;
		background: #ee0a24;
		float: right;
		font-size: .8rem;
		margin-top: .3rem;
		color: white;
	}
	.message-item{
		display: flex;
		padding: .8rem;
		background: white;
		padding-top: 1rem;
	}
	.van-nav-bar{
		margin-bottom: 1rem;
	}
	.message-text{
		margin-top: .5rem;
	}
</style>
