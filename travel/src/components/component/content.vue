<template>
	<div class="body">
		<div class="user">
			<div class="userImg">
				<img @click="goOtherUserInfo" :src="contentItem.content_user[0].head" width="100%" />
			</div>
			<div class="topRight">
				<p class="name">{{contentItem.content_user[0].userName}}</p>
				<p class="time">{{contentItem.created|timeAgoFilter}}</p>
			</div>
			<div class="showFocus" v-if="subShowFocus">
				<van-button v-show="!contentItem.status" plain type="warning" @click='focus'>关注</van-button>
				<span class="focused" v-show="contentItem.status">已关注</span>
			</div>
			<div class="del" v-if="showDel" @click="delContent">
				<span style="color: red;margin-right: .5rem; font-size: .73rem;">删除</span>
			</div>
		</div>
		<div class="info">
			<p class="descText">
				{{contentItem.text}}
			</p>
			<div class="locationInfo">
				<img src="../../assets/location.png" />
				<span class="location">{{contentItem.address}}</span>
			</div>
			<div class="descImg">
				<van-grid :column-num="getGridColumn()" icon-size='200px'>
					<van-grid-item v-for="(item,i) in contentItem.imgs" :key='i'>
						<van-image :height='getGridItemHeight()+"rem"' fit="cover" :src="item" @click='getPreViewImg(i,$event)'></van-image>
					</van-grid-item>
				</van-grid>
			</div>
		</div>
		<div class="area-bottom" v-show="subShowContentBottom">
			<div class="commit">
				<img src="../../assets/commit.png" @click="goComment" />
				<span @click="goComment">{{contentItem.commentCount}}</span>
			</div>
			<div class="like">
				<img src="../../assets/like.png" width="13%" @click="like(contentItem._id)"
				 v-if="!contentItem.isLike" />
				<img src="../../assets/isLike.png" width="13%" @click="like(contentItem._id)"
				 v-if="contentItem.isLike" />
				<span>{{contentItem.likeUserId.length}}</span>
			</div>
			
		</div>
		<!-- <div class="commentInfo">
			<p v-for="(item,i) in contentItem.comment.slice(0,2)" :key='i' @click="childComment(item)">
				<span class="commentName">{{item.fromUserName}}：</span>
				<span class="commentContent">{{item.comment}}</span>
			</p>
		</div> -->
		<!-- <van-field ref='itemCommentInput' placeholder="评论" @focus='comment(contentItem.ID,contentItem.userName,contentItem.showCommentCount)' /> -->
	</div>
</template>

<script>
	import formateTime from '@/filter/forMateTime.js'
	import {
		Toast
	} from 'vant'
	import url from '@/serviceAPI.js'
	import {
		timeAgo
	} from '@/filter/timeAgoFilter.js'
	import {
		ImagePreview
	} from 'vant'
	export default {
		data() {
			return {
				subShowContentBottom:true,
				subShowFocus:true,//由于props不允许被修改，所以用这个参数来接收props传来的值，以便修改
				isFocus: false,
				clientHeight: 0,
				diff: 0, //屏幕的高宽比例
				isLike: false, //是否点赞，默认为未点赞状态
				userName: '', //当前登录的用户名
			}
		},
		created() {
			this.$forceUpdate()
			this.subShowFocus = this.showFocus
			this.userName = JSON.parse(localStorage.loginInfo).userName
			if(this.contentItem.userId === JSON.parse(localStorage.loginInfo).id){
				this.subShowFocus = false
			}
			if(this.showContentBottom!=undefined){
				this.subShowContentBottom = this.showContentBottom
			}
		},
		mounted() {
			this.clientHeight = document.documentElement.clientHeight
			var clientWidth = document.documentElement.clientWidth
			this.diff = this.clientHeight / clientWidth
		},
		methods: {
			//根据图片的数量来获取每个宫格的高度
			getGridItemHeight(){
				if(this.contentItem.imgs.length <= 4&&this.contentItem.imgs.length!=3){
					
					return 8.5;
				}else{
					return 5.62;
				}
			},
			//根据图片的数量来获取一行放几列宫格
			getGridColumn(){
				if(this.contentItem.imgs.length <= 4&&this.contentItem.imgs.length!=3){
					return 2
				}else{
					return 3
				}
			},
			goOtherUserInfo(){
				this.$router.push({name:'otherUserInfo',params:{userId:this.contentItem.userId}})
			},
			//删除动态
			delContent(){
				this.$axios.post(url.delContent,{contentId:this.contentItem._id,userId:JSON.parse(localStorage.loginInfo).id}).then(res=>{
					if(res.data.code === 200){
						console.log('删除成功')
						this.$emit('delContent')
						Toast.success({message:'删除成功',duration:800})
					}
				})
			},
			//关注
			focus() {
				this.contentItem.status = !this.contentItem.status
				this.$axios.post(url.focus, {
					toUserId: this.contentItem.userId,
					fromUserId: this.userId,
					status: this.contentItem.status,
				}).then((result) => {
					if (result.data.code === 200) {

					}
				})
			},
			//点赞
			like(id) {
				this.$axios.post(url.like, {
					fromUserId:this.userId,
					ID: id,
					toUserId: this.contentItem.userId,
					status: this.contentItem.isLike,
					head: this.head,
					loginUserId:JSON.parse(localStorage.loginInfo).id
				}).then(result => {
					if (result.data.code === 200) {
						this.contentItem.isLike = !this.contentItem.isLike

						this.contentItem = this.contentItem
						//没有触发render函数进行自动更新，如果在实例创建之后添加新的属性到实例上this.contentItem.isLike，它不会触发视图更新。
						//所以需要手动进行更新

						if (this.contentItem.isLike) {
							this.contentItem.likeUserId.length += 1
						} else {
							this.contentItem.likeUserId.length -= 1
						}
						this.$forceUpdate();
					} else {
						Toast.fail({
							message: result.data.message,
							duration: 800
						})
					}
				})
			},

			//获取预览图片
			getPreViewImg(i, event) {


				let e = event.currentTarget.children[0]
				//naturalHeight获取图片的原始高度
				let imgHeight = e.naturalHeight
				let imgWidth = e.naturalWidth
				//如果图片的原高度超过屏幕的高度并且图片的高宽比超过了屏幕的高宽比，那么预览图片的objectFit就设为cover，高度为自适应
				if (imgHeight > this.clientHeight && imgHeight / imgWidth > this.diff) {
					setTimeout(function() {
						let previewImg = document.getElementsByClassName('van-image-preview__image')[i].firstChild
						let previewImgOut = document.getElementsByClassName('van-image-preview__image')[i]
						previewImgOut.style.overflow = 'scroll'
						previewImg.style.objectFit = 'cover'
						previewImg.style.height = 'auto'
					}, 5)
				}
				
				ImagePreview({
					images: this.contentItem.imgs,
					showIndex: true,
					loop: false,
					startPosition: i
				})
			},
			
			goComment(){
				this.$router.push({name:"comment",params:{contentId:this.contentItem._id,userName:this.contentItem.userName,userHead:this.head}})
			}
			
		},
		props: ['showContentBottom','contentItem','head','userId','showFocus','showDel'],
		filters: {
			timeAgoFilter(time) {
				return timeAgo(time)
			},
			formateTime(time){
				return formateTime(time)
			}
		}
	}
</script>

<style scoped="scoped">
	.commentInfo{
		font-size: .8rem;
		padding-left: .6rem;
	}
	.commentName{
		color: steelblue;
	}
	.commentContent{
		color: #333;
	}
	.van-cell {
		background: ghostwhite;
		padding: .2rem;
		padding-left: .6rem;
		margin-top: 1rem;
		margin-bottom: .7rem;
	}

	.focused {
		font-size: .75rem;
		color: hotpink;
	}

	.van-button--plain.van-button--warning {
		line-height: 0;
		height: 1.6rem;
		border-radius: 5px;
	}

	.van-button--normal {
		font-size: 0.65rem;
		padding: 0 .4rem;
	}

	.location {
		font-size: .6rem;
		color: #999999;
	}

	.locationInfo img {
		vertical-align: middle;
	}

	.area-bottom {
		margin-top: 8px;
		display: flex;
		padding-top: 8px;
		border-top: 1px solid #EEEEEE;
	}

	.area-bottom div {
		text-align: center;
		flex: 1;
	}

	.area-bottom img {
		vertical-align: middle;
	}

	.area-bottom span {
		color: #707070;
		font-size: .7rem;
	}

	/* .van-grid-item {
		height: 5.62rem;
	} */

	.van-image {
		height: 100%;
	}

	.descText {
		font-size: .8rem;
		margin-top: 8px;
		margin-bottom: .3rem;
	}

	.van-col {
		height: 37px;
		margin: 1px;
	}

	.body {
		background: #FFFFFF;
		padding: 5px;
		margin-bottom: 5px;
	}

	.user {
		display: flex;
		padding-top: 3px;
	}

	.user .userImg {
		flex: 1.2;
		margin-right: .6rem;
	}

	.userImg img {
		height: 2.4rem;
		width: 2.4rem;
		object-fit: cover;
		border-radius: 50%;
	}

	.user .topRight {
		flex: 7;
		line-height: 1.4rem;
	}

	.topRight .name {
		color: rgb(79, 201, 180);
		font-size: .9rem;
	}

	.topRight .time {
		font-size: .6rem;
		color: #999;
	}

	.user p {
		margin: 0;
	}
</style>
