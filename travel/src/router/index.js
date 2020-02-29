import Vue from 'vue'
import Router from 'vue-router'
import register from '@/components/pages/register'
import login from '@/components/pages/login'
import index from '@/components/pages/index'
import main from '@/components/pages/main'
import me from '@/components/pages/me'
import message from '@/components/pages/message'
import focused from '@/components/pages/focused'
import fans from '@/components/pages/fans'
import addContent from '@/components/pages/addContent'
import comment from '@/components/pages/comment'
import likeMessage from '@/components/pages/likeMessage'
import focusMessage from '@/components/pages/focusMessage'
import commentMessage from '@/components/pages/commentMessage'
import searchContent from '@/components/pages/searchContent'
import userInfo from '@/components/pages/userInfo'
import updataUserName from '@/components/pages/updataUserName'
import travelContents from '@/components/pages/travelContents'
import otherUserInfo from '@/components/pages/otherUserInfo'

Vue.use(Router)

export default new Router({
  routes: [
		{path:'/main',name:'main',component:main,children:[
			{path:'index',name:'index',component:index},
			{path:'message',name:'message',component:message},
			{path:'me',name:'me',component:me},
			{path:'focused',name:'focused',component:focused},
			{path:'fans',name:'fans',component:fans},
			{path:'likeMessage',name:'likeMessage',component:likeMessage},
			{path:'focusMessage',name:'focusMessage',component:focusMessage},
			{path:'commentMessage',name:'commentMessage',component:commentMessage},
			{path:'userInfo',name:'userInfo',component:userInfo},
			{path:'updataUserName',name:'updataUserName',component:updataUserName},
			{path:'travelContents/:userId/:showDel',name:'travelContents',component:travelContents},
			{path:'otherUserInfo/:userId',name:'otherUserInfo',component:otherUserInfo},
		]},
		{path:'/addContent',name:'addContent',component:addContent},
		{path:'/register',name:'register',component:register},
		{path:'/',name:'login',component:login},
		{path:'/comment/:contentId',name:'comment',component:comment},
		{path:'/searchContent',name:'searchContent',component:searchContent}
  ]
})


