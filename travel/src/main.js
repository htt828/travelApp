// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

import Mui from 'vue-awesome-mui'
Vue.use(Mui)

//引入地图插件
import AMap from 'vue-amap';
Vue.use(AMap);

//引入vuex
import vuex from 'vuex'
Vue.use(vuex)

let loginInfo = JSON.parse(localStorage.getItem('loginInfo')||'{}')

let store = new vuex.Store({
	state:{
		loginInfo:loginInfo
	},
	mutations:{
		getLoginInfo(state,loginInfo){
			state.loginInfo = loginInfo
			localStorage.setItem('loginInfo',JSON.stringify(state.loginInfo))
		}
	},
	getters:{
		getIsHaveNewMsg(state){
			let haveNewMsg = false
			if(state.loginInfo.newCommentMsgNum+state.loginInfo.newFocusMsgNum+state.loginInfo.newLikeMsgNum>0){
				haveNewMsg = true
			}else{
				haveNewMsg = false
			}
			return haveNewMsg
		}
	}
})

  // 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德key
  key: 'd4332e5adb8b584442266763d20b978c',
  // 插件集合 （插件按需引入）
  plugin: ['AMap.Geolocation']
});

Vue.prototype.$axios = axios
//全局自定义获取focus指令
Vue.directive('focus', {
	inserted: function(el) {
		el.focus()
	}
})
Vue.prototype.goBack = function(){
	this.$router.go(-1)
}
Vue.config.productionTip = false

import {
	Sticky,
	Loading,
	Cell,
	CellGroup,
	Checkbox,
	CheckboxGroup,
	RadioGroup,
	Radio,
	Popup,
	Tag,
	Search,
	Divider,
	Uploader,
	Grid,
	GridItem,
	Image,
	List,
	Row,
	Col,
	Button,
	Field,
	NavBar,
	Tab,
	Tabs,
	Tabbar,
	TabbarItem,
	Swipe,
	SwipeItem,
	ActionSheet 
} from 'vant';
Vue.use(Sticky).use(Loading).use(CellGroup).use(Cell).use(CheckboxGroup).use(Checkbox).use(RadioGroup).use(Radio).use(Popup).use(Tag).use(ActionSheet).use(Search).use(Divider).use(Uploader).use(Grid).use(GridItem).use(Image).use(Col).use(Row).use(List).use(Swipe).use(
	SwipeItem).use(Button).use(Field).use(NavBar).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>',
	store:store
})

