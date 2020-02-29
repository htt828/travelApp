<template>
	<div class="main">
		<router-view/>
		<div class="bottomTab">
			<van-tabbar v-model="activeTabbar">
				<van-tabbar-item icon="home-o" @click='goIndex' >
					首页
				</van-tabbar-item>
				<van-tabbar-item icon="envelop-o" @click='goMsg' v-show="!($store.getters.getIsHaveNewMsg)">消息</van-tabbar-item>
				<van-tabbar-item icon="envelop-o" @click='goMsg' v-show="$store.getters.getIsHaveNewMsg" dot>消息</van-tabbar-item>
				<van-tabbar-item icon="manager-o" @click='goMe'>我的</van-tabbar-item>
			</van-tabbar>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				activeTabbar: 0,
			}
		},
		created() {
			this.watchPath(this.$route.path)
		},
		watch:{
			"route.path"(newVal){
				this.watchPath(newVal)
			}
		},
		methods:{
			goIndex(){
				this.$router.push({name:'index'})
			},
			goMsg(){
				this.$router.push({name:'message'})
			},
			goMe(){
				this.$router.push({name:'me'})
			},
			watchPath(routerPath){
				if(routerPath === '/main/index'){
					this.activeTabbar = 0
				}else if(routerPath === '/main/message'){
					this.activeTabbar = 1
				}else if(routerPath === '/main/me'){
					this.activeTabbar = 2
				}else if(routerPath === '/main/focused'){
					this.activeTabbar = 2
				}else if(routerPath === '/main/fans'){
					this.activeTabbar = 2
				}else if(routerPath === '/main/likeMessage'){
					this.activeTabbar = 1
				}else if(routerPath === '/main/focusMessage'){
					this.activeTabbar = 1
				}else if(routerPath === '/main/commentMessage'){
					this.activeTabbar = 1
				}else if(routerPath === '/main/userInfo'){
					this.activeTabbar = 2
				}
			}
		}
		
	}
</script>

<style scoped="scoped">
	.van-tabbar{
		height: 3.12rem;
	}
	.itemSpan{
		width: 50%;
		height: 100%;
	}
	
</style>
