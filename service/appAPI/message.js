const mongoose = require('mongoose')
const Router = require('koa-router')
let router = new Router()

///获取消息列表(按时间降序查找,升序为1,降序为-1)
router.post('/getMessages', async (ctx) => {
	try {
		let Content = mongoose.model('Content')
		let Message = mongoose.model('Message')
		let userId = ctx.request.body.userId //当前登录用户id
		/* let message = await Message.find({
			userId: userId
		}).sort({
			created: -1
		}).exec() */
		let message = []
		if(ctx.request.body.isComment){
			message = await Message.aggregate([
				{
					$lookup:{
						from:'users',
						localField:'fromUserId',
						foreignField:'_id',
						as:'fromUser'
					}
				},
				{
					$lookup:{
						from:'comments',
						localField:'commentId',
						foreignField:'_id',
						as:'messageComment'
					}
				},
				{
					$lookup:{
						from:'users',
						localField:'contentUserId',
						foreignField:'_id',
						as:'contentUser'
					}
				}
			]).sort({created:-1}).exec()
		}else{
			message = await Message.aggregate([
				{
					$lookup:{
						from:'users',
						localField:'fromUserId',
						foreignField:'_id',
						as:'fromUser'
					}
				}
			]).sort({created:-1}).exec()
		}
		
		let messages = []
		message.forEach(item=>{
			if(item.userId == userId){
				messages.push(item)
			}
		})
		ctx.body = {
			code: 200,
			data: {
				message: messages
			}
		}
	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器出错'
		}
	}
})

/* //根据id获取评论信息
router.post('/getCommentMessage', async (ctx) => {
	try {
		let res = ctx.request.body
		let Comment = mongoose.model('Comment')
		let commentMessage = await Comment.find({_id:res.toUserId,childrenComments.childrenToUserId:res.childrenToUserId}).exec()
		let commentMessage = await Comment.aggregate([
			{
				$lookup:{
					from:'Content'
				}
			}
		])
	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 500,
			message: '服务器异常'
		}
	}
})
 */
module.exports = router
