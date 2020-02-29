<template>
	<div class="addContent">
		<van-nav-bar title="发表动态" left-arrow left-text="返回" @click-left='goBack'>
			<van-button round type="info" slot='right' color="#4FC9B4" @click='publish'>发表</van-button>
		</van-nav-bar>
		<div class="add-body">
			<div class="user">
				<img :src="loginInfo.head" width="100%" />
				<span>{{userName}}</span>
			</div>
			<textarea v-model="contentText" class="input-area" placeholder="分享旅游日记..."></textarea>
			<van-uploader :max-count="6" v-model="fileList" multiple :after-read='afterRead' >
				<div class="uploadArea" slot='default'>
					<img src="../../assets/camera.png" />
					<p>照片</p>
				</div>
			</van-uploader>
		</div>
		
		<van-popup v-model="show">
			<p class="tagP">-- 请选择标签 --</p>
			<van-radio-group v-model="radio" @change='selectSort'>
				<van-radio :name="1">旅行的意义</van-radio>
				<van-radio :name="2">民宿</van-radio>
				<van-radio :name="3">美食</van-radio>
				<van-radio :name="4">旅游攻略</van-radio>
			</van-radio-group>
		</van-popup>
		<van-field placeholder="请输入旅游地点" v-model="address">
			<img slot='left-icon' src="../../assets/address.png" />
		</van-field>
	</div>
</template>

<script>
	import {
		Toast
	} from 'vant'
	import url from '@/serviceAPI.js'
	export default {
		data() {
			return {
				address:'',
				loginInfo:{},
				radio:0,
				head: '',
				userName: '',
				fileList: [],
				file: null,
				contentText: '',
				show: false, //是否显示标签选择弹框
			}
		},
		created() {
			this.getLoginInfo()
			this.userName = JSON.parse(localStorage.loginInfo).userName
		},
		methods: {
			getLoginInfo(){
				this.$axios.post(url.getLoginInfo,{userName:JSON.parse(localStorage.loginInfo).userName}).then(res=>{
					if(res.data.code === 200){
						this.loginInfo = res.data.data
					}
				})
			},
			selectSort(){
				setTimeout(()=>{
					this.show = false
				},700)
				let params = new FormData()
				if (this.fileList.length > 1) {
					this.fileList.forEach((item, i) => {
						params.append(`fileArr${i}`, item.file)
					})
				} else {
					params.append('fileArr', this.file.file)
				}
				console.log(this.file.file)
				params.append('address',this.address)
				params.append('_id', this.loginInfo._id)
				params.append('text', this.contentText)
				params.append('sort',this.radio)
				let config = {
					headers: { //添加请求头
						"Content-Type": "multipart/form-data"
					}
				}
				this.$axios.post(url.publishContent, params, config).then(res => {
					this.fileList = []
					this.contentText = ''
					this.address = ''
					Toast.success({message:'发表成功',duration:800})
				}).catch(err => {
					console.log(err)
				})
			},
			afterRead(file) {
				this.file = file
			},
			goBack() {
				this.$router.go(-1)
			},
			publish() {
				if (this.fileList.length === 0) {
					return Toast.fail({
						message: '请至少选择一张图片',
						duration: 800
					})
				}
				if(!this.address){
					return Toast.fail({
						message:'请输入旅游地点',
						duration:800
					})
				}
				this.show = true
				
				
			}
		}
	}
</script>

<style scoped="scoped">
	.van-cell{
		margin-top: .6rem;
	}
	.van-cell__value{
		border-bottom: 1px solid #4FC9B4;
	}
	.uploadArea{
		display: inline-block;
		padding: 20px 35px;
		background: ghostwhite;
		border-radius: 7px;
	}
	.uploadArea p{
		text-align: center;
		margin-top: .3rem;
		font-size: .8rem;
		margin-bottom: 0;
		color: #999999;
	}
	.van-popup--center{
		border-radius: 10px;
		width: 60%;
	}
	.tagP{
		text-align: center;
	}
	.van-radio{
		margin: 1.5rem;
	}
	.add-body {
		margin-top: .7rem;
		background: white;
		padding: .7rem;
	}

	.van-button {
		height: 1.6rem;
		line-height: 1.6rem;
	}

	.user img {
		object-fit: cover;
		height: 3rem;
		width: 3rem;
		margin-right: .8rem;
		border-radius: 50%;
		vertical-align: middle;
	}

	.user span {
		color: #333;
		font-size: .9rem;
	}

	.input-area {
		font-size: .87rem;
		margin-top: .8rem;
		width: 100%;
		min-height: 8rem;
		border: none;
	}
</style>
