const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
let messageSchema = new Schema({
	sort:Number,//关注消息是1，点赞是2，评论是3
	userId:ObjectId,//接收者
	fromUserId:ObjectId,//关于谁的消息，比如哪个用户给我点赞
	//head:String,//消息来源用户头像
	message:String,
	contentUserId:ObjectId,//动态用户Id
	contentId:ObjectId,//动态id
	img1:String,//动态的第一张图片
	content:String,//动态文本
	commentId:ObjectId 
},{timestamps:{createdAt:'created'}})

mongoose.model('Message',messageSchema)
