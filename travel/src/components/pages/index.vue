<template>
	<div class="index">
		<div class="top">
			<div class="top_nav">
				<van-tabs @click='onclickTab' @change='onTabChange' v-model="active" animated swipeable sticky title-active-color='#4fc9b4'
				 :border="false">
					<van-tab title="推荐">
						<div class="swipe-area">
							<van-swipe :autoplay="3000">
								<van-swipe-item v-for="(item,i) in sliders" :key='i'>
									<img :src="getImgUrl(item.img)" width="100%" />
									<p class="text">{{item.text}}</p>
								</van-swipe-item>
							</van-swipe>
						</div>
						<div class="area">
							<!-- 12{{province}} -->
							<travelContent v-for='(item,i) in content' :key='i' :contentItem='item' :head='head' :userId = 'userId' :showFocus = 'true'></travelContent>
							<van-divider>我是有底线的</van-divider>
						</div>

					</van-tab>
					<van-tab title="关注">
						<travelContent v-for='(item,i) in content' :key='i' v-show='item.status' :contentItem='item' :head='head' :userId = 'userId' :showFocus = 'false'></travelContent>
					</van-tab>
					<van-tab>
						<div slot="title">
							<img class="searchImg" src="../../assets/img/search.png" />
						</div>
					</van-tab>
					<van-tab>
						<div slot="title">
							<img class="searchImg" src="../../assets/img/add.png" />
						</div>
					</van-tab>
				</van-tabs>
			</div>

		</div>
		<!-- <van-field @blur='blur' ref='comment' v-focus v-model="Input_comment" center clearable placeholder="评论" v-show="ifFocus">
			<van-button @click='postComment' slot="button" color="#4fc9b4" size="small" type="primary">发送</van-button>
		</van-field> -->
	</div>
</template>

<script>
	import travelContent from '../component/content.vue'
	import {location} from '@/location.js'
	import {
		Toast
	} from 'vant'
	import url from '@/serviceAPI.js'
	export default {
		data() {
			return {
				userId:'',
				content: {},
				clientHeight: 0,
				active: 0,
				sliders: [],
				emptyMsg: '',
				userName: '',
				head: '', //用户头像
				Input_comment: '',
				contentId: '', //评论的动态id
				toCommentUserName: '', //被评论的用户名
				province:'',//定位省
				city:'',//定位城市
				district:'',//定位地区
			}
		},
		created() {
			this.getSlider()
			this.getContent()
			this.userName = JSON.parse(localStorage.loginInfo).userName
			this.getLocation()
		},
		mounted() {
			this.clientHeight = document.documentElement.clientHeight
			document.getElementsByClassName('van-tabs__content--animated')[0].style.height = this.clientHeight - 88 + 'px'
		},
		methods: {
			getLocation() {
					let _that = this;
					let geolocation = location.initMap("map-container"); //定位
					AMap.event.addListener(geolocation, "complete", result => {
						_that.lat = result.position.lat;
						_that.lng = result.position.lng;
						this.province = result.addressComponent.province;
						this.city = result.addressComponent.city;
						this.district = result.addressComponent.district;
						console.log(this.province)
					});
			},
			
			getSlider() {
				this.$axios.get(url.getSlider).then((result) => {
					if (result.data.code === 200) {
						this.sliders = result.data.data
					} else if (result.data.code === 201) {
						this.emptyMsg = result.data.message
					} else {
						Toast.fail({
							message: result.data.message,
							duration: 800
						})
					}
				})
			},
			//获取图片路径
			getImgUrl(img) {
				return require('../../assets/img/' + img);
			},
			//获取用户动态数据
			getContent() {
				this.$axios.post(url.getLoginInfo,{userName:JSON.parse(localStorage.loginInfo).userName}).then(res=>{
					if(res.data.code === 200){
						this.head = res.data.data.head
						this.userId = res.data.data._id
						this.$axios.get(url.getContent).then((result) => {
							if (result.data.code === 200) {
								let res = result.data.data
								//是否关注
								
								res.forEach(item => {
									item.status = false //status表示是否关注，false为未关注
									
									if(item.content_user[0].focusFrom.indexOf(JSON.parse(localStorage.loginInfo).id)!=-1){
										item.status = true
									}
									/* console.log(item.content_user[0].focusFrom.indexOf(JSON.parse(localStorage.loginInfo)._id)!=-1)
									if(item.content_user[0].focusFrom.indexOf(JSON.parse(localStorage.loginInfo)._id)!=-1){
										item.status = true
									} */
									
								})
								//是否点赞
								res.forEach((item) => {
									//console.log(item)
									//由于进行点赞操作修改了数据库数据，就必须再发一次请求获取最新数据，但是这样会刷新页面，性能也较差，
									//所以用一个中间变量先接收likeCount值以及显示likeCount值
									//item.showLikeCount = item.likeCount
									item.isLike = false
									item.likeUserId.forEach(item2 => {
										if (item2 == this.userId) {
											item.isLike = true
										}
									})
								})
								this.content = res
							} else if (result.data.code === 201 || result.data.code === 500) {
								Toast.fail({
									message: result.data.message,
									duration: 800
								})
							}
						})
					}
				})
				
			},
			onTabChange() {
				this.getContent()
				this.$forceUpdate() //强制重新渲染页面
			},
			//发表动态
			onclickTab(i) {
				if (i === 3) {
					this.$router.push({
						name: 'addContent'
					})
				}
				if(i == 2){
					this.$router.push({name:'searchContent'})
				}
			},

			//utilFunction
			//是否关注
			isFocus(arr1, arr2) {
				arr1.forEach(item => {
					item.status = false //status表示是否关注，false为未关注
					arr2.some(item2 => {
						if (item.userName === item2.focusToUserName) {
							item.status = true
							return true
						}
					})
				})
			},
		},
		components: {
			travelContent
		}
	}
</script>

<style scoped="scoped">
	/* 发表评论输入框 */
	.van-cell--center {
		position: absolute;
		bottom: 0;
		z-index: 99;
	}

	.searchImg {
		vertical-align: middle;
	}

	.van-divider {
		border-color: #777;
	}

	.area {
		margin: 5px;
		border-radius: 5px;
		margin-bottom: 10px;
	}

	.van-tab__pane,
	.van-tab__pane-wrapper {
		overflow: scroll;
	}

	.title {
		background: #FFFFFF;
		padding: 3px;
		height: 2rem;
		line-height: 2rem;
		border-bottom: 1px solid #EEEEEE;

	}

	.title img {
		vertical-align: middle;
	}

	.title h5 {
		display: inline-block;
		margin: 0;
	}

	.top_nav {

		background: #FFFFFF;
		height: 2.3rem;
	}

	.swipe-area {
		padding: 5px;
		padding-top: 0;
		line-height: 0px;
		clear: both;
		max-height: 8rem;
		overflow: hidden;
	}

	.text {
		font-size: .8rem;
		position: absolute;
		top: 6.3rem;
		left: .6rem;
		color: white;
	}
</style>
