const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

let commentSchema = new Schema({
	contentId: ObjectId,
	comment: String,
	childrenComments:[{
		childrenFromUserName:String,
		childrenToUserName:String,
		childrenFromUserId:ObjectId,
		childrenToUserId:ObjectId,
		childrenComment:String,
		created:{
			type:Date,
			default:new Date()
		}
	}],
	fromUserId: ObjectId, //评论人名字
	fromUserName:String,//评论人姓名
	toUserId: ObjectId, //被评论人名字
	/* isParent:{ //是否是父评论
		type:Boolean,
		default:true
	},
	isChild: {//是否是子评论
		type: Boolean,
		default: false
	} */
},{timestamps:{createdAt:'created'}})

mongoose.model('Comment',commentSchema)