<template>
	<div class="message">
		<van-nav-bar title="评论" @click-left='goBack()' left-arrow />
		<div class="message-area" v-show="!isEmpty">
			<div class="message-item" v-for="(item,i) in messages" :key='i'>
				<div class="message-top">
					<div class="item-left">
						<img :src="getImgUrl(item.head)" width="100%" />
					</div>
					<div class="item-right">
						<p class="userName">{{item.fromUserName}}</p>
						<p class="message-info">
							<span class="time">{{item.created | formateTime}}</span>
						</p>
					</div>
					<span class="response" @click="shiftPostInput(item.contentId,item.fromUserName,item.parentComment,item.message)">回复</span>
				</div>
				<p class="message-text">{{item.message}}</p>
				<div class="content" @click="goComment(item.contentId)">
					<div class="contentImg">
						<van-image fit="cover" :src="getImgUrl(item.img1)" width="100%" />
					</div>
					<p class="content-info">
						<span class="contentName">{{item.contentUserName}}</span>
						<span class="content-text">{{item.content}}</span>
					</p>
				</div>
				<div class="parentComment" v-if="item.parentComment">
					<span class="contentName">{{item.userName}}:</span>
					<span>{{item.parentComment}}</span>
				</div>
				<input class="responseInput" ref='showInput' @focus="shiftPostInput(item.contentId,item.fromUserName,item.parentComment,item.message)" v-if="item.sort === 3" type="text" :placeholder='`回复"${item.fromUserName}"`' />
			</div>

		</div>
		
		<!-- <div class="message-area" v-show="!isEmpty">
			<div class="message-item" v-for="(item,i) in content" :key='i'>
				<div class="message-top">
					<div class="item-left">
						<img :src="getImgUrl(item.userHead)" width="70%" />
					</div>
					<div class="item-right">
						<p class="userName">{{item.comment[0].fromUserName}}</p>
						<p class="message-info">
							<span class="time">{{item.comment[0].created | formateTime}}</span>
						</p>
					</div>
					<span class="response" @click="shiftPostInput">回复</span>
				</div>
				<p class="message-text">{{item.comment[0].comment}}</p>
				<div class="content" @click="goComment(item._id)">
					<div class="contentImg">
						<van-image fit="cover" :src="getImgUrl(item.imgs[0])" width="100%" />
					</div>
					<p class="content-info">
						<span class="contentName">{{item.userName}}</span>
						<span class="content-text">{{item.text}}</span>
					</p>
				</div>
				<div class="parentComment" v-if="item.parentComment">
					<span class="contentName">{{item.userName}}:</span>
					<span>{{item.parentComment}}</span>
				</div>
				<input class="responseInput" ref='showInput' @focus="shiftPostInput" type="text" :placeholder='`回复"${item.comment[0].fromUserName}"`' />
			</div>
		
		</div> -->
		
		
		
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
				parentComment:'',//父评论
				content:[],
				responseToUserName:'',
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
			//this.getCommentMessage()
		},
		mounted() {
			let clientHeight = document.documentElement.clientHeight
			console.log(clientHeight)
			document.getElementsByClassName('message-area')[0].style.height = clientHeight - 88 + 'px'
			document.getElementsByClassName('noMsg')[0].style.height = clientHeight - 88 + 'px'
		},
		methods: {
			getImgUrl(imgName) {
				return require('../../assets/img/' + imgName)
			},
			getCommentMessage(){
				this.$axios.post(url.getCommentMessage,{userName:this.userName}).then(res=>{
					if(res.data.code === 200){
						this.content = res.data.data
						console.log(this.content.comment)
					}
				})
			},
			getMessages() {
				this.$axios.post(url.getMessages, {
					userName: this.userName
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
				this.$axios.post(url.postComment,{
					contentId: this.contentId,
					comment: this.responseInput,
					fromUserName: this.userName,
					toUserName: this.responseToUserName,
					fromUserHead:this.loginHead,
					parentComment:this.parentComment,
					isParent: false,
					isChild: true
				}).then(res=>{
					this.responseInput = ''
					if(res.data.code === 200){
						this.getMessages()
						console.log(res.data.message)
					}
				})
			},
			
			//点击已经显示的输入框或回复时，保存该条消息的数据，并且将提交输入框从隐藏变为显示状态
			shiftPostInput(contentId,responseToUserName,parentComment,message){
				this.responseToUserName = responseToUserName
				this.contentId = contentId
				this.isInput = true
				this.$refs.showInput[0].blur()
				this.$refs.postInput.focus()
				if(parentComment){
					this.parentComment = parentComment
				}else{
					this.parentComment = message
				}
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
	.van-cell {
		width: 100%;
		position: absolute;
		bottom: 0;
		margin: 0;
		background: ghostwhite;
		padding: .2rem;
		padding-left: .6rem;
	}

	/* 发表评论输入框 */
	.van-cell--center {
		padding-top: 0;
		padding-bottom: 0;
		position: relative;
		bottom: 60px;
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
