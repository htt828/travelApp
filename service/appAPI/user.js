const mongoose = require('mongoose')
const Router = require('koa-router')
const router = new Router()
const fs = require('fs')
const path = require('path')
/* formidable用于解析表单数据,特别是文件上传 */
const formidable = require('formidable')
const moment = require('moment')

//注册
router.post('/register', async (ctx) => {
	try {
		let User = mongoose.model('User')
		let user = new User(ctx.request.body)
		let dbResult = await User.findOne({
			userName: user.userName
		}).exec()
		if (dbResult) {
			return ctx.body = {
				code: 201,
				message: '该用户名已存在'
			}
		}
		let result = await user.save()
		ctx.body = {
			code: 200,
			message: '注册成功'
		}
	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: e
		}
	}
})

//登录
router.post('/login', async (ctx) => {
	try {
		let User = mongoose.model('User')
		let loginUser = ctx.request.body
		let result = await User.findOne({
			userName: loginUser.userName
		}).exec()
		if (!result) {
			return ctx.body = {
				code: 201,
				message: '该用户不存在'
			}
		}
		let newUser = new User()
		await newUser.comparePassword(loginUser.password, result.password).then(isMatch => {
			if (isMatch) {
				ctx.body = {
					code: 200,
					message: '登录成功'
				}
			} else {
				ctx.body = {
					code: 202,
					message: '密码错误'
				}
			}
		}).catch((err) => {
			console.log(err)
			ctx.body = {
				code: 500,
				message: err
			}
		})
	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: e
		}
	}
})

//获取登录用户信息
router.post('/getLoginInfo', async (ctx) => {
	try {
		let User = mongoose.model('User')
		let userName = ctx.request.body.userName
		if(ctx.request.body.userId){
			let result = await User.findOne({_id:ctx.request.body.userId}).exec()
			ctx.body = {
				code: 200,
				data: result
			}
			return
		}
		let result = await User.findOne({
			userName: userName
		}).exec()
		ctx.body = {
			code: 200,
			data: result
		}
	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器出错'
		}
	}
})

//获取我关注的用户
router.post('/getFocusUser', async (ctx) => {
	try {
		let loginUserId = ctx.request.body.userId //登录名
		let searchName = ctx.request.body.focusName //搜索框输入的用户名
		let User = mongoose.model('User')
		//内嵌查询，查询所有我关注的用户
		let focusUser = await User.find({
			'focusFrom': loginUserId
		}).exec()
		//用正则表达式来进行模糊查询我关注的用户
		if (searchName) {
			let res = []
			var searchReg = new RegExp(searchName)
			focusUser.forEach((item => {
				if (searchReg.test(item.userName)) {
					res.push(item)
					return true
				}
			}))
			focusUser = res
			//如果没有匹配结果
			if (focusUser.length === 0) {
				ctx.body = {
					code: 201,
					message: '暂无搜索数据'
				}
			} else {
				ctx.body = {
					code: 200,
					data: focusUser
				}
			}
		} else {
			ctx.body = {
				code: 200,
				data: focusUser
			}
		}

	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器错误'
		}
	}
})

//获取我的粉丝用户
router.post('/getFansUser', async (ctx) => {
	try {
		let loginUserId = ctx.request.body.userId //登录用户id
		let searchName = ctx.request.body.fansName //搜索框输入的用户名
		let User = mongoose.model('User')
		//内嵌查询，查询所有我关注的用户
		let fansUser = await User.find({
			'focusTo': loginUserId
		}).exec()
		//用正则表达式来进行模糊查询我的粉丝用户
		if (searchName) {
			let res = []
			var searchReg = new RegExp(searchName)
			fansUser.forEach((item => {
				if (searchReg.test(item.userName)) {
					res.push(item)
				}
			}))
			fansUser = res

			//如果没有匹配结果
			if (fansUser.length === 0) {
				(ctx.body = {
					code: 201,
					message: '暂无搜索数据'
				})
			} else {
				ctx.body = {
					code: 200,
					data: fansUser
				}
			}
		} else {
			ctx.body = {
				code: 200,
				data: fansUser
			}
		}




	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器错误'
		}
	}
})


//上传图片到服务器，并且发表动态
router.post('/publishContent', async (ctx) => {
	ctx.res.setHeader('Access-Control-Allow-Headers',
		'Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With')
	/* 创建上传表单 */
	let form = new formidable.IncomingForm()
	/* 设置编码 */
	form.encoding = 'utf-8'
	//设置上传目录，这个目录必须先创建好
	form.uploadDir = path.join(__dirname, '../serverImg')
	//保留文件后缀名
	form.keepExtensions = true
	//设置文件大小
	form.maxFieldSize = 10 * 1024 * 1024
	let imgs = []
	try {
		//格式化form数据
		form.parse(ctx.req, async function(err, fields, files) {
			//files保存着前端表单发送过来的表单数据
			//files.xxx保存着上传时的name名字
			//let file = files.fileArr0

			//如果出错，则拦截
			if (err) {
				console.log(err)
				return ctx.body = {
					code: 500,
					message: '服务器出错'
				}
			}

			//存储后缀名
			let extName = ''


			for (var k in files) {
				console.log(files[k])
				if (files[k].size > form.maxFieldSize) {
					files[k].unlink(files[k].path)
					return ctx.body = {
						code: -1,
						message: '图片不能超过10M'
					}
				}

				switch (files[k].type) {
					case 'image/png':
						extName = 'png'
						break;
					case 'image/x-png':
						extName = 'png'
						break;
					case 'image/jpg':
						extName = 'jpg'
						break;
					case 'image/jpeg':
						extName = 'jpg'
						break;
				}
				if (extName.length === 0) {
					return ctx.body = {
						code: -1,
						message: '只支持jpg和png格式的图片'
					}
				}

				//拼接新的文件名
				let time = moment(new Date()).format('YYYYMMDDHHmmss')
				let num = Math.floor(Math.random() * 8999 + 10000)
				let imageName = `${time}_${num}.${extName}`
				let newPath = form.uploadDir + '/' + imageName
				fs.renameSync(files[k].path, newPath);
				imgs.push('http://172.18.96.237:3000/' + imageName)
			}

			//存入数据库
			let Content = mongoose.model('Content')
			let content = new Content({
				imgs: imgs,
				sort: fields.sort,
				address: fields.address,
				userId:fields._id,
				text: fields.text
			})
			await content.save().then(res => {
				ctx.body = {
					code: 200,
					message: '上传成功',
					data: imgs
				}
			}).catch((err) => {
				console.log(err)
				ctx.body = {
					code: 500,
					message: '服务器出错'
				}
			})
			let User = mongoose.model('User')
			//$inc:在字段的原有值基础上增值或减值，正数表示加，负数减
			await User.update({_id:fields._id},{$inc:{contentCount:1}})
		})
		ctx.body = {
			code: 200,
			message: '发表成功'
		}
	} catch (e) {
		ctx.body = {
			code: 500,
			message: '服务器错误'
		}
	}
})


//上传头像
router.post('/uploadHead', async (ctx) => {
	ctx.res.setHeader('Access-Control-Allow-Headers',
		'Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With')
	/* 创建上传表单 */
	let form = new formidable.IncomingForm()
	/* 设置编码 */
	form.encoding = 'utf-8'
	//设置上传目录，这个目录必须先创建好
	form.uploadDir = path.join(__dirname, '../serverImg')
	//保留文件后缀名
	form.keepExtensions = true
	//设置文件大小
	form.maxFieldSize = 10 * 1024 * 1024
	let imgs = []
	try {
		//格式化form数据
		form.parse(ctx.req, async function(err, fields, files) {
			//files保存着前端表单发送过来的表单数据
			//files.xxx保存着上传时的name名字
			let file = files.headImg

			//如果出错，则拦截
			if (err) {
				console.log(err)
				return ctx.body = {
					code: 500,
					message: '服务器出错'
				}
			}

			//存储后缀名
			let extName = ''




			if (file.size > form.maxFieldSize) {
				file.unlink(file.path)
				return ctx.body = {
					code: -1,
					message: '图片不能超过10M'
				}
			}

			switch (file.type) {
				case 'image/png':
					extName = 'png'
					break;
				case 'image/x-png':
					extName = 'png'
					break;
				case 'image/jpg':
					extName = 'jpg'
					break;
				case 'image/jpeg':
					extName = 'jpg'
					break;
			}
			if (extName.length === 0) {
				return ctx.body = {
					code: -1,
					message: '只支持jpg和png格式的图片'
				}
			}

			//拼接新的文件名
			let time = moment(new Date()).format('YYYYMMDDHHmmss')
			let num = Math.floor(Math.random() * 8999 + 10000)
			let imageName = `${time}_${num}.${extName}`
			//let imageName = `${fields.userId}.${extName}`
			let newPath = form.uploadDir + '/' + imageName
			fs.renameSync(file.path, newPath);
			//imgs.push('http://192.168.199.161:3000/'+imageName)
			

			//根据id
			let User = mongoose.model('User')
			await User.findByIdAndUpdate(fields.userId,{head:'http://172.18.96.237:3000/'+imageName}).exec().then(()=>{
				ctx.body = {code:200,message:'修改成功',headImg:'http://172.18.96.237:3000/'+imageName}
			}).catch((err)=>{
				ctx.body = {code:500,message:'服务器错误'}
			})
			console.log(imageName)
		})
		ctx.body = {
			code: 200,
			message: '修改头像成功'
		}
	} catch (e) {
		ctx.body = {
			code: 500,
			message: '服务器错误'
		}
	}
})

//更改用户信息
router.post('/updataUserInfo',async(ctx)=>{
	try{
		let User = mongoose.model('User')
		let res = ctx.request.body
		await User.findByIdAndUpdate(res._id,{userName:res.userName,age:res.age,gender:res.gender}).exec()
		ctx.body = {code:200,message:'修改成功'}
	}catch(e){
		console.log(e)
		ctx.body = {code:500,message:'服务器出错'}
	}
})

//删除我的动态
router.post('/delContent',async(ctx)=>{
	try{
		let Content = mongoose.model('Content')
		let res = await Content.remove({_id:ctx.request.body.contentId}).exec()
		let User = mongoose.model('User')
		await User.update({_id:ctx.request.body.userId},{$inc:{contentCount:-1}})
		ctx.body = {code:200,message:'删除成功'}
	}catch(e){
		//TODO handle the exception
		ctx.body = {code:500,message:'服务器出错'}
	}
})

//清空新增消息记录
router.post('/cleanMsgNum',async(ctx)=>{
	try{
		let User = mongoose.model('User')
		let sort = ctx.request.body.sort
		if(sort === 1){
			await User.update({_id:ctx.request.body.userId},{newFocusMsgNum:0})
		}else if(sort === 2){
			await User.update({_id:ctx.request.body.userId},{newLikeMsgNum:0})
		}else if(sort === 3){
			await User.update({_id:ctx.request.body.userId},{newCommentMsgNum:0})
		}
		ctx.body = {code:200,message:'清除成功'}
	}catch(e){
		//TODO handle the exception
		console.log(e)
		ctx.body = {code:200,message:'服务器出错'}
	}
	
	
})

module.exports = router
