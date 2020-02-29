<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  
  	watch:{
  		$route: {
  			deep: true,
  			immediate: true,
  			handler: function(value) {
  				//跳到下一页时，页面回到顶部
  				document.body.scrollTop = 0
  				document.documentElement.scrollTop = 0
  				//弹出退出提示
  				let vm = this
  				if (value.path === '/'||value.path === '/register' || value.path === '/main/index'||value.path === '/main/message'||value.path === '/main/me') {
  					var first = null;
  					mui.back = function() {
  						if (!first) {
  							first = new Date().getTime();
  							mui.toast('再按一次返回键退出应用');
  							setTimeout(function() {
  								first = null;
  							}, 1000);
  						} else {
  							if (new Date().getTime() - first < 1000) {
  								plus.runtime.quit();
  							}
  						}
  					}
  				} else {
  					mui.back = function() {
  						vm.$router.go(-1)
  					}
  				}
  			}
  		}
  	}
}
</script>

<style>
	.searchContent .van-grid-item__content {
		padding: 8px 0;
	}
	.searchContent .van-grid-item__content--center{
		background: whitesmoke;
	}
	.searchContent .van-grid-item__text {
		color: #333333;
		font-size: .73rem;
	}
	.addContent .van-cell__value{
		border-bottom: 1px solid #eee;
	}
.searchContent [class*=van-hairline]::after,.body [class*=van-hairline]::after,.comment [class*=van-hairline]::after{
		border: none;
	}
.body .van-grid-item__content,.comment .van-grid-item__content{
		padding: 2px;
	}	
#app {
 font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
 
  color: #2c3e50;
}
body{
	background-color: ghostwhite;
}
.van-field__left-icon{
		margin-right: .8rem;
	}
	.login .van-field__control,.register .van-field__control{
		color: #FFFFFF;
	}
	.index .van-field__left-icon .van-icon, .van-field__right-icon .van-icon{
		color: #fff;
		font-size: .9rem;
		height: 1.5rem;
		line-height: 1.2rem;
	}
	.index .van-tab--active{
		font-weight: 700;
		font-size: 1.3rem;
	}
	.index .van-tab{
		font-size: 1rem;
	}
	.focused .van-icon{
		font-size: 1rem;
	}
	.index .van-tabs--line .van-tabs__wrap{
		height: 2.4rem;
	}
	.van-icon{
		/* font-size: 1.4rem; */
	}
	.main .van-tabbar-item{
		font-size: .9rem;
	}
	.index .van-swipe__indicators{
		bottom: 29px;
	}
	.van-uploader__input-wrapper{
		width: 100%;
	}
</style>
