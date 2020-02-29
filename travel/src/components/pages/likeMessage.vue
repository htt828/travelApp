<template>
	<div class="message">
		<van-nav-bar title="点赞" left-arrow @click-left='goBack()' />
		<div class="message-area" v-show="!isEmpty">
			<div class="message-item" v-for="(item,i) in messages" :key='i'>
				<div class="message-top">
					<div class="item-left">
						<img :src="item.fromUser[0].head" width="100%" />
					</div>
					<div class="item-right">
						<p class="userName">{{item.fromUser[0].userName}}</p>
						<p class="message-info">
							<span class="time">{{item.created | formateTime}}</span>
						</p>

					</div>
				</div>
				<p class="message-text">{{item.message}}</p>
				<div class="content" @click="goComment(item.contentId)">
					<div class="contentImg">
						<van-image fit="cover" :src="item.img1" width="100%" />
					</div>
					<p class="content-info">
						<span class="contentName">{{userName}}:</span>
						<span class="content-text">{{item.content}}</span>
					</p>
				</div>
			</div>

		</div>
		<div class="noMsg" v-show="isEmpty">
			<img src="../../assets/nomsg.png" />
			<p>暂无任何消息</p>
		</div>

	</div>
</template>

<script>
	let moment = require('moment')
	import url from '@/serviceAPI.js'
	export default {
		data() {
			return {
				userId:'',
				isInput:false,
				messages: [],
				userName: '',
				isEmpty: false,
				responseInput: '',
				loginHead:''
			}
		},
		created() {
			this.userName = JSON.parse(localStorage.loginInfo).userName
			this.getMessages()
			//this.getLoginInfo()
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
				this.$axios.post(url.cleanMsgNum,{userId:JSON.parse(localStorage.loginInfo).id,sort:2})
				//更新vuex中的newFocusMsgNum，已经查看，所以置为0
				let loginInfo = this.$store.state.loginInfo
				loginInfo.newLikeMsgNum = 0
				this.$store.commit('getLoginInfo',loginInfo)
			},
			getMessages() {
				this.$axios.post(url.getLoginInfo,{userName:JSON.parse(localStorage.loginInfo).userName}).then(res=>{
					if(res.data.code === 200){
						this.loginHead = res.data.data.head
						this.userId = res.data.data._id
						this.$axios.post(url.getMessages, {
							userId: this.userId
						}).then((result) => {
							if (result.data.code === 200) {
								if (result.data.data.message.length === 0) {
									this.isEmpty = true
								} else {
									let res = []
									result.data.data.message.forEach(item=>{
										console.log(item.sort)
										if(item.sort === 2){
											res.push(item)
										}
									})
									this.messages = res
								}
							}
						})
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
		},
		filters: {
			formateTime(time) {
				return moment(time).format('YYYY-MM-DD HH:mm:ss')
			}
		}
	}
</script>

<style scoped="scoped">

	.van-image {
		height: 4.8rem;
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
		background: white;
		overflow: scroll;
		margin-top: .4rem;
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
		object-fit: cover;
		height: 3rem;
		width: 3rem;
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
