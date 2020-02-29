<template>
	<div class="search">
		<form action="/">
			<van-search
				:placeholder="placehodler"
				@focus='onFocus'
				shape='round'
				v-show="!showCancel"
			/>
		</form>
		<form action="/">
			<van-search
				v-model="value"
				show-action
				v-focus
				@focus='onFocus'
				@cancel="onCancel"
				shape='round'
				v-show="showCancel"
				@change='searchInput'
			/>
		</form>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				showCancel:false,
				value:''
			}
		},
		props:['placehodler'],
		methods:{
			searchInput(){
				this.$emit('searchInput',this.value)
			},
			onCancel(){
				this.showCancel = false
			},
			//与输入框获得焦点的时候
			onFocus(){
				this.showCancel = true
			},
		}
	}
</script>

<style scoped="scoped">
	.van-search{
		padding: 20px 12px;
	}
</style>
