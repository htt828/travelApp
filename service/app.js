const KOA = require('koa')
const app = new KOA()
const mongoose = require('mongoose')
const Router = require('koa-router')
const serve = require('koa-static')
const {connect,initSchema} = require('./database/init')
const path = require('path')

//处理表单请求,解析前台post请求数据
const bodyparser = require('koa-bodyparser')

//处理跨域
const cors = require('koa2-cors')

//配置图片静态资源
const imgAsset = serve(path.join(__dirname,'./serverImg'))
app.use(imgAsset)

app.use(bodyparser())
app.use(cors())

//引入路由模块
let user = require('./appAPI/user')
let index = require('./appAPI/index')
let message = require('./appAPI/message')

let router = new Router()
router.use('/user',user.routes())
router.use('/index',index.routes())
router.use('/message',message.routes())

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
//加载路由中间件
app.use(router.routes())//启动路由
app.use(router.allowedMethods())

;(async(ctx)=>{
	await connect()
	initSchema()
})()

//路由中间件，匹配任何路由，任何路由路径都会执行这条语句
//如果不写next，当匹配到了该路由，那么就不会继续向下匹配
app.use(async(ctx,next)=>{
	ctx.body = 'hello'
	//当进入了任何一个路由输入了hello，继续向下匹配路由
	next()
})

app.listen(3000,()=>{
	console.log('3000 running...')
})