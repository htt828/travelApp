<template>
	<div class="userInfo">
		<van-nav-bar title="个人信息" left-arrow @click-left='goBack()'></van-nav-bar>
		<van-uploader :after-read="onRead">
			<template slot="default" preview-image="true">
				<van-cell is-link title="头像">
					<!-- 使用 title 插槽来自定义标题 -->
					<template slot="default">
						<img class="headImg" :src="loginInfo.head" width="40%" />
					</template>
				</van-cell>
			</template>
		</van-uploader>

		<van-cell title="昵称" @click='goUpdataName' is-link>{{loginInfo.userName}}</van-cell>
		<van-cell @click='show = true' title="性别" is-link>{{radio===1?'男':'女'}}</van-cell>
		<van-cell title="年龄" is-link>{{loginInfo.age}}</van-cell>
		<van-popup v-model="show">
			<p class="genderTop">性别</p>
			<van-radio-group v-model="radio" @change='uploadGender'>
				<van-cell-group>
					<van-cell title="男" clickable @click="radio = 1">
					<van-radio :name="1" slot="right-icon">
						<img slot="icon" slot-scope='props' :src="props.checked?require('../../assets/radio-active.png'):require('../../assets/radio-noactive.png')" />
					</van-radio>
					</van-cell>
					<van-cell title="女" clickable @click="radio = 0">
					<van-radio :name="0" slot="right-icon">
						<img slot="icon" slot-scope='props' :src="props.checked?require('../../assets/radio-active.png'):require('../../assets/radio-noactive.png')" />
					</van-radio>
					</van-cell>
				</van-cell-group>
				
			</van-radio-group>
		</van-popup>
	</div>
</template>

<script>
	import url from '@/serviceAPI.js'
	import {
		ImagePreview
	} from 'vant'
	export default {
		data() {
			return {
				radio: null,
				show: false,
				userName: '',
				loginInfo: {},
				file: '',
				fileList: []
			}
		},
		created() {
			this.userName = JSON.parse(localStorage.loginInfo).userName
			this.getLoginInfo()
		},
		methods: {
			getLoginInfo() {
				this.$axios.post(url.getLoginInfo, {
					userName: this.userName
				}).then((result) => {
					if (result.data.code === 200) {
						this.loginInfo = result.data.data
						this.radio = this.loginInfo.gender
						this.loginInfo.gender === 1 && (this.isfemale = false)
					}
				})

			},
			
			onRead(file) {
				console.log(file)
				let config = {
					headers: { //添加请求头
						"Content-Type": "multipart/form-data"
					}
				}
				let params = new FormData()
				params.append('headImg', file.file)
				params.append('userId', this.loginInfo._id)
				this.$axios.post(url.uploadHead, params, config).then((res) => {
					if (res.data.code === 200) {
						this.getLoginInfo()
						this.$forceUpdate()
					} else {

					}
				})
			},
			uploadGender(){
				this.show = false
				this.$axios.post(url.updataUserInfo,{_id:this.loginInfo._id,userName:this.loginInfo.userName,age:this.loginInfo.age,gender:this.radio}).then((res)=>{
					console.log(res.data)
				})
			},
			goUpdataName(){
				this.$router.push({name:'updataUserName'})
			}
		}
	}
</script>

<style scoped="scoped">
	.van-popup--center {
		top: 40%;
		border-radius: 8px;
		width: 76%;
		padding-bottom: 30px;
	}

	.genderTop {
		font-size: .87rem;
		text-align: center;
	}

	.van-cell {
		align-items: center;
		font-size: .9rem;
	}

	.headImg {
		object-fit: cover;
		width: 3.4rem;
		height: 3.2rem;
		border-radius: 10px;
		vertical-align: middle;
	}

	.van-uploader {
		width: 100%;
	}
</style>
