const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const contentSchema = new Schema({
	sort: Number,
	//userName: String,
	address: String,
	//userHead: String,
	commentCount:{
		type:Number,
		default:0
	},
	userId:ObjectId, //这个必须和用户表_id类型一直，不然lookup多表查询不会有结果
	imgs:[String],
	text: String,
	likeCount: {
		type:Number,
		default:0
	},
	likeUserId: [ObjectId], //点赞的用户id
	
},{timestamps:{createdAt:'created'}})

mongoose.model('Content', contentSchema)
