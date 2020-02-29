<template>
	<div class="travelContents">
		<van-nav-bar left-arrow @click-left='goBack()' title="旅游日记"></van-nav-bar>
		<div class="content-area">
			<travel-content v-for="(item,i) in contents" :key='i' @delContent='delContent(i)' :showDel='$route.params.showDel' :contentItem='item' :showFocus = 'false'></travel-content>
		</div>
	</div>
</template>

<script>
	import travelContent from '../component/content.vue'
	import url from '@/serviceAPI.js'
	export default{
		data(){
			return{
				userId:'',
				userName:'',
				contents:[]
			}
		},
		created() {
			this.userId = this.$route.params.userId
			this.userName = JSON.parse(localStorage.loginInfo).userName
			this.getContents()
		},
		mounted() {
			let clientHeight = document.documentElement.clientHeight||document.body.clientHeight
			document.getElementsByClassName('content-area')[0].style.height = clientHeight - 100 + 'px'
		},
		methods:{
			getContents(){
				this.$axios.post(url.getTravelContents,{userId:this.userId}).then(res=>{
					if(res.data.code === 200){
						this.contents = res.data.data
						this.contents.forEach(item=>{
							item.isLike = false
							if(item.likeUserId.indexOf(JSON.parse(localStorage.loginInfo).id)!=-1){
								item.isLike = true
							}
						})
					}
				})
			},
			delContent(i){
				this.contents.splice(i,1)
			}
		},
		components:{
			travelContent
		}
	}
</script>

<style scoped="scoped">
	.content-area{
		overflow: scroll;
	}
</style>
