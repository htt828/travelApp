<template>
	<div class="message">
		<van-nav-bar title="评论" @click-left='goBack()' left-arrow />
		<div class="message-area" v-show="!isEmpty">
			<div class="message-item" v-for="(item,i) in messages" :key='i'>
				<div class="message-top">
					<div class="item-left">
						<img :src="item.fromUser[0].head" width="70%" />
					</div>
					<div class="item-right">
						<p class="userName">{{item.fromUser[0].userName}}</p>
						<p class="message-info">
							<span class="time">{{item.created | formateTime}}</span>
						</p>
					</div>
					<span class="response" @click="shiftPostInput(item.contentId,item.fromUser[0]._id,item.commentId,item.fromUser[0].userName)">回复</span>
				</div>
				<p class="message-text">{{item.message}}</p>
				<div class="content" @click="goComment(item.contentId)">
					<div class="contentImg">
						<van-image fit="cover" :src="item.img1" width="100%" />
					</div>
					<p class="content-info">
						<span class="contentName">{{item.contentUser[0].userName}}</span>
						<span class="content-text">{{item.content}}</span>
					</p>
				</div>
				<div class="commentAndResponse" v-if="item.messageComment[0]!=undefined&&item.messageComment[0].childrenComments.length>0">
					<p class="commentP">
						<span class="name">{{item.messageComment[0].fromUserName}}:</span>
						<span class="comment">{{item.messageComment[0].comment}}</span>
					</p>
					<p class="commentP" v-for="(item2,i) in item.messageComment[0].childrenComments" :key='i'>
						<span class="name">{{item2.childrenFromUserName}}</span>
						<span>回复</span>
						<span class="name">{{item2.childrenToUserName}}:</span>
						<span class="comment">{{item2.childrenComment}}</span>
					</p>
				</div>
				<input class="responseInput" ref='showInput' @focus="shiftPostInput(item.contentId,item.fromUser[0]._id,item.commentId,item.fromUser[0].userName)" v-if="item.sort === 3" type="text" :placeholder='`回复"${item.fromUser[0].userName}"`' />
				
			</div>
		</div>
		<van-field ref='postInput' v-show="isInput" v-model="responseInput" center clearable>
			<van-button slot="button" size="small" type="primary" color='#4fc9b4' @click='postResponse'>发送</van-button>
		</van-field>
		<div class="noMsg" v-show="isEmpty">
			<img src="../../assets/nomsg.png" />
			<p>暂无任何消息</p>
		</div>
	</div>
</template>

<script>
	import {Toast} from 'vant'
	let moment = require('moment')
	import url from '@/serviceAPI.js'
	export default {
		data() {
			return {
				toUserName:'',
				commentId:'',
				parentComment:'',//父评论
				content:[],
				responseToUserId:'',
				isInput:false,
				messages: [],
				userName: '',
				isEmpty: false,
				responseInput: '',
				loginHead:'',
				contentId:''
			}
		},
		created() {
			this.userName = JSON.parse(localStorage.loginInfo).userName
			this.getMessages()
			this.getLoginInfo()
			this.cleanMsgNum()
		},
		mounted() {
			let clientHeight = document.documentElement.clientHeight
			console.log(clientHeight)
			document.getElementsByClassName('message-area')[0].style.height = clientHeight - 88 + 'px'
			document.getElementsByClassName('noMsg')[0].style.height = clientHeight - 88 + 'px'
		},
		methods: {
			cleanMsgNum(){
				this.$axios.post(url.cleanMsgNum,{userId:JSON.parse(localStorage.loginInfo).id,sort:3})
				//同时更新vuex中的newCommentMsgNum，已经查看，所以置为0
				let loginInfo = this.$store.state.loginInfo
				loginInfo.newCommentMsgNum = 0
				this.$store.commit('getLoginInfo',loginInfo)
			},
			getImgUrl(imgName) {
				return require('../../assets/img/' + imgName)
			},
			getMessages() {
				this.$axios.post(url.getMessages, {
					userId: JSON.parse(localStorage.loginInfo).id,
					isComment:true
				}).then((result) => {
					if (result.data.code === 200) {
						if (result.data.data.message.length === 0) {
							this.isEmpty = true
						} else {
							let res = []
							result.data.data.message.forEach(item=>{
								if(item.sort === 3){
									res.push(item)
								}
							})
							this.messages = res
							console.log(this.messages)
						}
					}
				})
			},
			goComment(id) {
				this.$router.push({
					name: 'comment',
					params: {
						contentId: id,
						userHead:this.loginHead
					}
				})
			},
			getLoginInfo(){
				this.$axios.post(url.getLoginInfo,{userName:JSON.parse(localStorage.loginInfo).userName}).then(res=>{
					if(res.data.code === 200){
						this.loginHead = res.data.data.head
					}
				})
			},
			
			//提交回复
			postResponse() {
				if(!this.responseInput){
					Toast.fail({message:'请输入回复信息',duration:800})
				}
				console.log(this.commentId)
				this.$axios.post(url.postComment,{
					contentId:this.contentId,
					commentId: this.commentId,
					childrenComment:{
						childrenFromUserName:JSON.parse(localStorage.loginInfo).userName,
						childrenToUserName:this.toUserName,
						childrenFromUserId:JSON.parse(localStorage.loginInfo).id,
						childrenToUserId:this.responseToUserId,
						childrenComment:this.responseInput
					},
				}).then(res=>{
					this.responseInput = ''
					if(res.data.code === 200){
						this.getMessages()
						this.$forceUpdate()
						console.log(res.data.message)
					}
				})
			},
			
			//点击已经显示的输入框或回复时，保存该条消息的数据，并且将提交输入框从隐藏变为显示状态
			shiftPostInput(contentId,responseToUserId,commentId,toUserName){
				this.responseToUserId = responseToUserId
				this.contentId = contentId
				this.isInput = true
				this.$refs.showInput[0].blur()
				this.$refs.postInput.focus()
				this.commentId = commentId
				this.toUserName = toUserName
			}
		},
		filters: {
			formateTime(time) {
				return moment(time).format('YYYY-MM-DD HH:mm:ss')
			}
		}
	}
</script>

<style scoped="scoped">
	.commentAndResponse{
		font-size: .8rem;
		margin: .5rem 0;
	}
	.commentAndResponse .commentP{
		margin-bottom: .39rem;
	}
	.commentAndResponse .name{
		color: #4FC9B4;
	}
	.van-cell {
		/* width: 100%;
		position: absolute;
		bottom: 0; */
		/* margin: 0;
		padding: 0;
		padding-left: .6rem; */
		
	}

	/* 发表评论输入框 */
	.van-cell--center {
		position: absolute;
		bottom: 3rem;
		z-index: 99;
	}

	.parentComment {
		margin-top: .3rem;
		font-size: .8rem;
	}

	.van-image {
		height: 4.8rem;
	}

	.response {
		margin-top: .3rem;
		float: right;
		font-size: .87rem;
		color: #4FC9B4;
	}

	.responseInput {
		font-size: .8rem;
		margin-top: .7rem;
		background: ghostwhite;
		width: 96%;
		border: none;
		padding: .4rem;
	}

	.content {
		align-items: center;
		display: flex;
		font-size: .8rem;
		margin-top: 1rem;
		background-color: ghostwhite;
	}

	.content .contentImg {
		flex: 2.5;
		margin-right: .6rem;
	}

	.content .content-info {
		flex: 8;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.contentName {
		color: #4FC9B4;
	}

	.message-text {
		margin-top: .8rem;
		font-size: .9rem;
	}
	p {
		margin: 0;
	}
	.message-area {
		overflow: scroll;
	}
	.noMsg {
		text-align: center;
		background: white;
	}
	.noMsg p {
		color: #999999;
	}
	.noMsg img {
		margin-top: 30%;
	}
	.message-item {
		padding: .4rem;
		padding-bottom: .8rem;
		margin-bottom: .9rem;
		background: white;
	}

	.message-top {
		display: flex;
	}

	.item-left {
		flex: 2;
	}

	.item-left img {
		object-fit: cover;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		vertical-align: middle;
		padding-top: .5rem;
	}

	.item-right {
		flex: 8;
		padding-left: .3rem;
	}

	.item-right .userName {
		font-size: 1rem;
		color: #222;
		margin-top: .4rem;
	}

	.item-right .time {
		margin-right: .3rem;
	}

	.item-right .message-info {
		margin-top: .2rem;
		font-size: .8rem;
		color: #999999;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
</style>
