<template>
	<div class="comment">
		<van-nav-bar left-arrow @click-left='goBack()' title="详情" />
		<travel-content v-if="content.content_user!=undefined" :showContentBottom='false' :contentItem = 'content'></travel-content>
		<div class="comment-area">
			<p class="count">全部评论{{comments.length}}</p>
			<div class="comment-info" v-for="(item,i) in comments" :key='i'>
				<div class="userInfo">
					<div class="userHeadImg">
						<img width="100%" :src="item.commentFromUser[0].head" />
					</div>
					<div class="user-right">
						<p class="commentName">{{item.commentFromUser[0].userName}}</p>
						<p class="creatTime">{{item.created | formateTime}}</p>
						<van-cell is-link="" class="commenText" @click="childComment(i,item.fromUserId,item.commentFromUser[0].userName,item._id,false)">
						
						{{item.comment}}
						<img src='' slot='right-icon' />
						</van-cell>
						<div v-if="item.childrenComments!=undefined&&item.childrenComments.length > 0">
							<p class="childCommentCount" @click="showChildCommentCount=false" v-if="showChildCommentCount">
								{{item.childrenComments.length}}条回复
								<img src="../../assets/down.png" />
							</p>
							<van-cell is-link="" class="commenText" v-for="(item2,i) in item.childrenComments" :key='i' v-show="!showChildCommentCount" @click="childComment(i,item2.childrenFromUserId,item2.childrenFromUserName,item._id,true,item2._id)">
								<span class="toUserName">{{item2.childrenFromUserName}}</span>
								<span class="toUserName">@{{item2.childrenToUserName}}：</span>
								<span class="childCommentText">{{item2.childrenComment}}</span>
								<img src="" slot='right-icon' />
							</van-cell>

						</div>
					</div>
				</div>

			</div>
		</div>
		<div class="commentInput">
			<van-field ref='comment' v-focus v-model="Input_comment" center clearable :placeholder="placeholder">
				<van-button @click='postComment' slot="button" color="#4fc9b4" size="small" type="primary">发送</van-button>
			</van-field>
		</div>
		<van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
	
	</div>
</template>

<script>
	import travelContent from '../component/content.vue'
	import {Toast} from 'vant'
	import {
		ImagePreview
	} from 'vant'
	import url from '@/serviceAPI.js'
	import formateTime from '@/filter/forMateTime.js'
	export default {
		data() {
			return {
				childrenCommentId:'',
				delChildComment:false,
				childrenFromUserName:'',
				childrenToUserName:'',
				showChildCommentCount:true,
				comments:[],
				loginUserId:'',
				commentId:'',
				selectCommentItem:0,
				Input_comment: '',
				contentId: '',
				loginUserName: '',
				//userHead: '',
				content: {},
				isChildComment: false,
				//子评论上一级评论人的头像和名字
				fromUserId: '',
				RootCommentId: '', //根级评论
				placeholder: '评论',
				show: false, //显示上拉框
				actions: [{
						name: '删除',
						color:'red'
					},
					{
						name: '取消'
					}
				]
			}
		},
		mounted() {
			setTimeout(() => {
				let clientHeight = document.documentElement.clientHeight
				document.getElementsByClassName('comment')[0].style.height = clientHeight - 30 + 'px'
			}, 200)
			//document.getElementsByClassName('comment-area')[0].style.minHeight = clientHeight -225 + 'px'
		},
		components:{
			travelContent
		},
		created() {
			this.loginUserId = JSON.parse(localStorage.loginInfo).id
			this.loginUserName = JSON.parse(localStorage.loginInfo).userName
			this.contentId = this.$route.params.contentId
			//this.userHead = this.$route.params.userHead
			this.getComments()
			this.getCommentContent()
		},

		methods: {
			//根据图片的数量来获取每个宫格的高度
			getGridItemHeight(){
				if(this.content.imgs.length <= 4&&this.content.imgs.length!=3){
					return 8.5;
				}else{
					return 5.62;
				}
			},
			//根据图片的数量来获取一行放几列宫格
			getGridColumn(){
				if(this.content.imgs.length <= 4&&this.content.imgs.length!=3){
					return 2
				}else{
					return 3
				}
			},
			getComments(){
				this.$axios.post(url.getComments,{contentId:this.$route.params.contentId}).then(res=>{
					if(res.data.code === 200&&res.data.data.length>0){
						this.comments = res.data.data
						console.log(this.comments)
					}
				})
			},
			//删除评论
			onSelect(item){
				console.log(this.comments)
				this.show = false
				if(item.name === '删除'){
					//this.comments.splice(this.selectCommentItem,1)
					console.log(this.comments)
					this.$axios.post(url.delSingleComment,{commentId:this.commentId,delChildComment:this.delChildComment,childrenCommentId:this.childrenCommentId,contentId:this.content._id}).then(res=>{
						if(res.data.code === 200){
							console.log('删除成功')
							this.getComments()
							this.$forceUpdate()
							this.comments.length -= 1
							this.commentId = ''
						}else if(res.data.code === 500){
							Toast({message:res.data.message,duration:800})
						}
					})
					
				}
			},
			//提交评论
			postComment() {
				if (this.commentId === '') {
					this.placeholder = '评论'
					this.$axios.post(url.postComment, {
						contentId: this.contentId,
						comment: this.Input_comment,
						fromUserId:this.loginUserId,
						fromUserName:this.loginUserName,
						toUserId: this.content.content_user[0]._id,
						//fromUserHead: this.userHead,
						//isParent: true,
						//isChild: false,
						loginUserId:this.loginUserId,
						contentUserId:this.content.userId
					}).then(res => {
						if (res.data.code === 200) {
							this.Input_comment = ''
							//console.log(res.data.message)
							this.getComments()
						}
						this.commentId = ''
					})
				} else {
					this.$forceUpdate()
					this.$axios.post(url.postComment, {
						contentId:this.contentId,
						commentId: this.commentId,
						/* comment: this.Input_comment,
						fromUserId: this.loginUserId,
						toUserId: this.fromUserId,
						//fromUserHead: this.userHead, */
						//RootCommentId: this.RootCommentId,
						childrenComment:{
							childrenFromUserName:this.childrenFromUserName,
							childrenToUserName:this.childrenToUserName,
							childrenFromUserId:this.loginUserId,
							childrenToUserId:this.fromUserId,
							childrenComment:this.Input_comment
						},
						//contentUserId:this.content.userId,
						//isParent: false,
						//isChild: true,
						//loginUserId:this.loginUserId,
						//contentUserId:this.content.userId
					}).then(res => {
						if (res.data.code === 200) {
							this.Input_comment = ''
							//console.log(res.data.message)
							this.getComments()
							//this.isChildComment = false
						}
						this.commentId = ''
					})
				}
				this.placeholder = '评论'
				this.$forceUpdate()
			},

			//子评论
			childComment(i,fromUserId,fromUserName, commentId,delChildComment,childrenCommentId) {
				this.delChildComment = delChildComment
				this.commentId = commentId
				this.placeholder = '评论'
				if(childrenCommentId){
					this.childrenCommentId = childrenCommentId
					console.log(this.childrenCommentId)
				}
				if (fromUserId === this.loginUserId) {
					this.selectCommentItem = i
					this.show = true
					return
				}else{
					this.selectCommentItem = ''
				}
				
				/* if (RootCommentId) {
					console.log('有根评论')
					this.RootCommentId = RootCommentId
				} else {
					console.log('没有根评论')
					this.RootCommentId = commentId
				} */
				this.placeholder = "回复'" + fromUserName + "'"
				this.$refs.comment.focus()
				//this.isChildComment = true
				this.fromUserId = fromUserId
				this.childrenFromUserName = this.loginUserName
				this.childrenToUserName = fromUserName
			},
			//获取预览图片
			getPreViewImg(i, event) {
				let clientHeight = document.documentElement.clientHeight
				let e = event.currentTarget.children[0]
				//naturalHeight获取图片的原始高度
				let imgHeight = e.naturalHeight
				let imgWidth = e.naturalWidth
				//如果图片的原高度超过屏幕的高度并且图片的高宽比超过了屏幕的高宽比，那么预览图片的objectFit就设为cover，高度为自适应
				if (imgHeight > clientHeight && imgHeight / imgWidth > this.diff) {
					setTimeout(function() {
						let previewImg = document.getElementsByClassName('van-image-preview__image')[i].firstChild
						let previewImgOut = document.getElementsByClassName('van-image-preview__image')[i]
						previewImgOut.style.overflow = 'scroll'
						previewImg.style.objectFit = 'cover'
						previewImg.style.height = 'auto'
					}, 5)
				}
				
				ImagePreview({
					images: this.content.imgs,
					showIndex: true,
					loop: false,
					startPosition: i
				})
			},
			//获取动态信息
			getCommentContent() {
				this.$axios.post(url.getCommentContent, {
					ID: this.contentId
				}).then(res => {
					if (res.data.code === 200) {
						if(res.data.data.length === 0){
							Toast.fail({message:'该动态已删除',duration:900})
						}else{
							this.content = res.data.data[0]
						}
						
						
					}
				})
			}
		},
		filters: {
			formateTime(time) {
				return formateTime(time)
			}
		}
	}
</script>

<style scoped="scoped">
	.childCommentText{
		display: block;
	}
	.childCommentCount{
		margin-top: .8rem;
		font-size: .78rem;
		color: #8a8a8a;
		padding: .3rem .5rem;
		background: whitesmoke;
		display: inline-block;
		border-radius: 15px;
	}
	.childCommentCount img{
		vertical-align: middle;
	}
	/* .van-image {
		height: 100%;
	}

	.addressImg {
		vertical-align: middle;
		margin-right: .4rem;
	}

	.address {
		color: #777777;
		font-size: .75rem;
	}

	.contentTime {
		font-size: .76rem;
		color: #999999;
	}

	.content-top {
		display: flex;
	}

	.content-right {
		flex: 7;
		line-height: 1.2rem;
	} */

	.toUserName {
		color: #4FC9B4;
	}

	.comment {
		overflow: scroll;
	}

	.commentName {
		color: #999999;
		font-size: .9rem;
	}

	.creatTime {
		font-size: .75rem;
		margin-top: .2rem;
		color: #999999;
		margin-bottom: .6rem;
	}

	.comment-info {
		margin-top: 1.7rem;
	}

	.commenText {
		font-size: .9rem;
		color: #333;
		margin-top: .8rem;
		padding: 0;
	}

	.userInfo {
		display: flex;

	}

	.userHeadImg {
		flex: 1;
		margin-right: .8rem;
	}

	.userHeadImg img {
		border-radius: 50%;
		object-fit: cover;
		width: 2.7rem;
		height: 2.7rem;
	}

	.user-right {
		flex: 7;
	}

	.commentInput .van-cell {
		width: 100%;
		position: absolute;
		bottom: 0;
		margin: 0;
		background: white;
		padding: .2rem;
		padding-left: .6rem;
	}

	/* 发表评论输入框 */
	.van-cell--center {
		position: absolute;
		bottom: 0;
		z-index: 99;
	}

	.comment-area {
		margin-top: 1rem;
		background: white;
		padding: .6rem;
	}

	p {
		margin: 0;
	}

	/* .content {
		padding: .6rem;
		background: white;
	}

	.content .contentImg {
		border-radius: 50%;
		vertical-align: middle;
		margin-right: 1rem;
	}

	.contentUserName {
		font-size: .9rem;
		display: inline-block;
		color: #333333;
	}

	.contentInfo {
		margin-top: .6rem;
		line-height: 1.3rem;
		font-size: .8rem;
		color: #666;
	}
 */
	.count {
		color: #333;
		font-size: .9rem;
	}
</style>
