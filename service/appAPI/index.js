const mongoose = require('mongoose')
const Router = require('koa-router')
const router = new Router()
const fs = require('fs')
const {
	resolve
} = require('path')

//向数据库插入轮播图数据
router.get('/insertSliders', async (ctx) => {
	fs.readFile(resolve(__dirname, '../database/database_json/sliders.json'), 'utf-8', (err, data) => {
		let sliderDate = JSON.parse(data)
		var Slider = mongoose.model('Slider')
		if (!err) {
			sliderDate.map((item, i) => {
				let slider = new Slider(item)
				slider.save().then(() => {
					console.log('数据插入成功')
				}).catch((e) => {
					console.log("数据插入失败" + e)
				})
			})
		} else {
			console.log(err)
		}
	})
	ctx.body = '开始插入轮播图数据'
})

//将用户动态插入到数据库中
router.get('/insertContent', async (ctx) => {
	fs.readFile(resolve(__dirname, '../database/database_json/content.json'), 'utf-8', (err, data) => {
		if (!err) {
			let Content = mongoose.model('Content')
			let contentData = JSON.parse(data)
			contentData.forEach((item) => {
				let content = new Content(item)
				content.save().then(() => {
					console.log('数据插入成功')
				}).catch((e) => {
					console.log('数据插入失败')
				})
			})
		} else {
			console.log(err)
		}
	})
	ctx.body = '开始插入数据'
})

//获取轮播图数据
router.get('/getSlider', async (ctx) => {
	try {
		let Slider = mongoose.model('Slider')
		let result = await Slider.find().exec()
		if (result) {
			ctx.body = {
				code: 200,
				data: result
			}
		} else {
			ctx.body = {
				code: 201,
				message: '暂无数据'
			}
		}
	} catch (e) {
		ctx.body = {
				code: 500,
				message: '服务器出错'
			},
			console.log(e)
	}
})

//获取用户动态数据
router.get('/getContent', async (ctx) => {
	/* try {
		let Content = mongoose.model('Content')
		let result = await Content.find().exec()
		let record = []
		let homestay = []
		let food = []
		let strategy = []
		if (result) {
			result.forEach(item => {
				if (item.sort === 1) {
					record.push(item)
				} else if (item.sort === 2) {
					homestay.push(item)
				} else if (item.sort === 3) {
					food.push(item)
				} else if (item.sort === 4) {
					strategy.push(item)
				}
			})
			let randomRecord = getRandomArrayElements(record, 2)
			let randomHomestay = getRandomArrayElements(homestay, 2)
			let randomFood = getRandomArrayElements(food, 2)
			let randomStrategy = getRandomArrayElements(strategy, 2)
			ctx.body = {
				code: 200,
				data: {
					allData: result,
					record: randomRecord,
					homestay: randomHomestay,
					food: randomFood,
					strategy: randomStrategy
				}
			}
		} else {
			ctx.body = {
				code: 201,
				message: '暂无数据'
			}
		}
	} catch (e) {
		ctx.body = {
				code: 500,
				message: '服务器出错'
			},
			console.log(e)
	} */
	try {
		let Content = mongoose.model('Content')
		//let User = 
		let res = await Content.aggregate([{
			$lookup: {
				from: 'users',
				localField: 'userId',
				foreignField: '_id',
				as: 'content_user'
			}
		}]).sort({
			created: -1
		}).exec()
		ctx.body = {
			code: 200,
			data: res
		}
	} catch (e) {
		//TODO handle the exception
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器出错'
		}
	}
})

//获取数组中随机的一个或多个元素
function getRandomArrayElements(arr, count) {
	if (arr.length <= 2) {
		return arr;
	} else {
		var shuffled = arr.slice(0),
			i = arr.length,
			min = i - count,
			temp, index;
		while (i-- > min) {
			index = Math.floor((i + 1) * Math.random());
			temp = shuffled[index];
			shuffled[index] = shuffled[i];
			shuffled[i] = temp;
		}
		return shuffled.slice(min);
	}
}

//关注
router.post('/focus', async (ctx) => {
	try {
		let res = ctx.request.body
		let User = mongoose.model('User')

		let focustoUser = await User.findOne({
			_id: res.toUserId
		}).exec() //我关注的人的信息
		console.log(focustoUser)
		let loginUser = await User.findOne({
			_id: res.fromUserId
		}).exec() //当前登录的用户信息

		//如果status为true则表示关注，如果status为false则表示取消关注
		if (res.status) {
			//我关注的用户的粉丝数量加1
			//我关注的人名字加上被关注用户的名字
			loginUser.focusTo.push(res.toUserId)
			focustoUser.focusFromCount += 1
			//我的关注人数加1
			//我关注的人的粉丝用户上加上我的名字
			loginUser.focusToCount += 1
			focustoUser.focusFrom.push(res.fromUserId)

			await User.update({
				_id: res.toUserId
			}, focustoUser)
			await User.update({
				_id: res.fromUserId
			}, loginUser)
			ctx.body = {
				code: 200,
				message: '关注成功'
			}

			let Message = mongoose.model('Message')
			let message = new Message({
				sort: 1,
				fromUserId: res.fromUserId,
				userId: res.toUserId,
				message: '关注了你'
			})
			let messageRes = await message.save()
			
			//关注成功用户表新增关注消息数量加1
			await User.update({_id:res.toUserId},{$inc:{newFocusMsgNum:1}}).exec()
		} else {
			//我关注的用户的粉丝数量减1
			loginUser.focusTo.remove(res.toUserId)
			focustoUser.focusFromCount -= 1

			//我的关注人数加1
			//我关注的人的粉丝用户上加上我的名字
			loginUser.focusToCount -= 1
			focustoUser.focusFrom.remove(res.fromUserId)

			await User.update({
				_id: res.toUserId
			}, focustoUser)
			await User.update({
				_id: res.fromUserId
			}, loginUser)
			ctx.body = {
				code: 200,
				message: '取消关注成功'
			}
		}

	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器异常'
		}
	}
})

//点赞/取消赞
router.post('/like', async (ctx) => {
	try {
		let res = ctx.request.body //点赞的动态id，当前登录的用户名，被点赞的用户，是否点赞的状态
		//let head = res.head //（from User）点赞用户的头像
		let Content = mongoose.model('Content')
		let result = await Content.findOne({
			_id: res.ID
		}).exec()
		let Message = mongoose.model('Message')
		//如果点赞
		if (!res.status) {
			result.likeUserId.push(res.fromUserId)
			result.likeCount += 1
			await Content.update({
				_id: res.ID
			}, result)
			ctx.body = {
				code: 200,
				message: '点赞成功'
			}
			if (ctx.request.body.loginUserId == result.userId) return
			//如果点赞成功，就向message表中加入一条数据
			let newMessage = new Message({
				sort: 2,
				fromUserId: res.fromUserId,
				userId: res.toUserId,
				//head: head,
				message: '赞了你的动态',
				contentId: res.ID,
				img1: result.imgs[0],
				content: result.text
			})
			let messageRes = await newMessage.save()
			let User = mongoose.model('User')
			//点赞成功用户表新增点赞消息数量加1
			await User.update({_id:res.toUserId},{$inc:{newLikeMsgNum:1}}).exec()
		}
		//如果取消赞
		else {
			result.likeUserId.remove(res.fromUserId)
			result.likeCount -= 1
			await Content.update({
				_id: res.ID
			}, result)
			ctx.body = {
				code: 200,
				message: '取消点赞成功'
			}
		}

	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器异常'
		}
	}
})

//发表评论
router.post('/postComment', async (ctx) => {
	try {
		let res = ctx.request.body
		let contentId = res.contentId
		let comment = res.comment
		let fromUserId = res.fromUserId
		let toUserId = res.toUserId
		//let isChild = res.isChild
		//let isParent = res.isParent
		let newMessage = {}
		const Message = mongoose.model('Message')
		let Content = mongoose.model('Content')
		let content = await Content.findOne({
			_id: contentId
		})
		let Comment = mongoose.model('Comment')
		if (!res.commentId) { //发布根评论
			let newComment = new Comment({
				contentId: contentId,
				comment: comment,
				fromUserId: fromUserId,
				fromUserName: res.fromUserName,
				toUserId: toUserId
			})
			let newRes = await newComment.save()
			//动态中的评论数量加1
			await Content.update({
				_id: contentId
			}, {
				$inc: {
					commentCount: 1
				}
			})
			if (ctx.request.body.loginUserId == ctx.request.body.contentUserId) {
				console.log('是我啊')
				ctx.body = {
					code: 200,
					message: '评论成功'
				}
				return
			}

			//添加评论消息
			newMessage = new Message({
				commentId: newRes._id,
				sort: 3,
				fromUserId: fromUserId,
				userId: toUserId,
				//head: fromUserHead,
				message: comment,
				contentId: contentId,
				//RootCommentId: res.RootCommentId,
				contentUserId: content.userId,
				img1: content.imgs[0],
				content: content.text
			})
			let User = mongoose.model('User')
			//如果评论成功就把用户表的新增评论消息数量自增1
			await User.update({_id:toUserId},{$inc:{newCommentMsgNum:1}}).exec()
		} else {//发布子评论
			await Comment.update({
				_id: res.commentId
			}, {
				$push: {
					'childrenComments': res.childrenComment
				}
			})
			//添加评论消息
			newMessage = new Message({
				commentId: res.commentId,
				sort: 3,
				fromUserId: res.childrenComment.childrenFromUserId,
				userId: res.childrenComment.childrenToUserId,
				//head: fromUserHead,
				message: res.childrenComment.childrenComment,
				contentId: res.contentId,
				//RootCommentId: res.RootCommentId,
				contentUserId: content.userId,
				img1: content.imgs[0],
				content: content.text
			})
			let User = mongoose.model('User')
			//如果评论成功就把用户表的新增评论消息数量自增1
			await User.update({_id:res.childrenComment.childrenToUserId},{$inc:{newCommentMsgNum:1}}).exec()
		}



		ctx.body = {
			code: 200,
			message: '发表成功'
		}



		console.log(newMessage)
		await newMessage.save()
	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器错误'
		}
	}
})

//获取评论列表对应的动态信息
router.post('/getCommentContent', async (ctx) => {
	try {
		let Content = mongoose.model('Content')
		let ID = ctx.request.body.ID
		//必须先把ID转换为ObjectId，不然无法与_id进行匹配
		ID = mongoose.Types.ObjectId(ID)
		console.log(ID)
		let content = await Content.aggregate([{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: 'content_user'
				}
			},
			{
				$match: {
					_id: ID
				}
			}
		]).exec()
		ctx.body = {
			code: 200,
			data: content
		}
	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: e
		}
	}
})

//获取评论列表
router.post('/getComments', async (ctx) => {
	try {
		let Comment = mongoose.model('Comment')
		let Comments = await Comment.aggregate([{
				$lookup: {
					from: 'users',
					localField: 'fromUserId',
					foreignField: '_id',
					as: 'commentFromUser'
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'toUserId',
					foreignField: '_id',
					as: 'commentToUser'
				}
			},
			{
				$match: {
					contentId: mongoose.Types.ObjectId(ctx.request.body.contentId)
				}
			}
		]).exec()
		ctx.body = {
			code: 200,
			data: Comments
		}
	} catch (e) {
		console.log(e)
		//TODO handle the exception
		ctx.body = {
			code: 500,
			message: '服务器出错'
		}
	}
})

//删除单条评论数据
router.post('/delSingleComment', async (ctx) => {
	try {
		//let contentId = ctx.request.body.contentId
		let commentId = ctx.request.body.commentId
		let Comment = mongoose.model('Comment')
		let Content = mongoose.model('Content')
		//删除满足条件的所有数据
		//let delres = await Content.update({_id:contentId},{ $pull: {comment:{ _id:commentId} } })
		if (ctx.request.body.delChildComment) { //删除子孙级评论评论
			await Comment.update({
				_id: commentId
			}, {
				$pull: {
					childrenComments: {
						_id: ctx.request.body.childrenCommentId
					}
				}
			})
		} else { //删除根评论
			await Comment.remove({
				_id: commentId
			})
			//动态评论数量减1
			await Content.update({
				_id: ctx.request.body.contentId
			}, {
				$inc: {
					commentCount: -1
				}
			})
		}
		ctx.body = {
			code: 200,
			message: '删除成功'
		}
	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器出错'
		}
	}
})

//获取某个用户发表的动态
router.post('/getTravelContents', async (ctx) => {
	try {
		//let User = mongoose.model('User')
		let Content = mongoose.model('Content')
		let res = ctx.request.body

		let result = await Content.aggregate([{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: 'content_user'
				}
			},
			{
				$match: {
					userId: mongoose.Types.ObjectId(res.userId)
				}
			}
		]).sort({
			created: -1
		}).exec()
		ctx.body = {
			code: 200,
			data: result
		}
	} catch (e) {
		//TODO handle the exception
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器出错'
		}
	}
})

//搜索动态 模糊查询
router.post('/searchContent', async (ctx) => {
	try {
		let Content = mongoose.model('Content')
		let res = ctx.request.body
		let searchReg = new RegExp(res.address)
		let searchRes = []
		if (res.sort.length > 0) {
			searchRes = await Content.aggregate([{
					$lookup: {
						from: 'users',
						localField: 'userId',
						foreignField: '_id',
						as: 'content_user'
					}
				},
				{
					$match: {
						//$in表示筛选出同一个字段多个值，res.sort为一个数组
						sort: {
							$in: res.sort
						},
						address: searchReg
					}
				}
			]).sort({
				created: -1
			}).exec()
		} else {
			searchRes = await Content.aggregate([{
					$lookup: {
						from: 'users',
						localField: 'userId',
						foreignField: '_id',
						as: 'content_user'
					}
				},
				{
					$match: {
						address: searchReg
					}
				}
			]).sort({
				created: -1
			}).exec()
		}

		console.log(searchRes)
		ctx.body = {
			code: 200,
			data: searchRes
		}
	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器出错'
		}
		//TODO handle the exception
	}
})
module.exports = router
