const mongoose = require('mongoose')
const Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

let userSchema = new Schema({
	userId:ObjectId,
	userName:{
		type:String,
		require,
		unique:true
	},
	password:{
		type:String,
		require
	},
	contentCount:{
		type:Number,
		default:0
	},
	lastLoginAt:{
		type:Date,
		default:new Date()
	},
	gender:{
		type:Number,
		enum:[0,1],//0表示女生，1表示男生
		default:1
	},
	head:{
		type:String,
		default:'http://192.168.199.162:3000/default.jpg'
	},
	age:{
		type:Number,
		default:0
	},
	focusTo:[ObjectId],//我关注的用户名
	focusToCount:{//我关注的用户人数，也就是我的关注人数
		type:Number,
		default:0
	},
	focusFrom:[ObjectId],//关注我的用户名
	focusFromCount:{//关注我的用户人数，也就是粉丝数量
		type:Number,
		default:0
	},
	newLikeMsgNum:{//新增点赞消息数量
		type:Number,
		default:0
	},
	newFocusMsgNum:{//新增关注消息数量
		type:Number,
		default:0
	},
	newCommentMsgNum:{//新增评论消息数量
		type:Number,
		default:0
	}
},{timestamps:{createdAt:'created'}})

//对密码进行加盐加密
userSchema.pre('save',function(next){
	var user = this
	bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
		if(err){
			return next(err)
			throw (err)
		}
		bcrypt.hash(user.password,salt,(err,hash)=>{
			if(err){
				return next(err)
				throw (err)
			}
			user.password = hash
			next()
		})
	})
})

userSchema.methods = {
	//对加密密码进行比对
	//第一个参数为客户端提交的密码，第二次个参数为数据库中的密码
	comparePassword(_password,password){
		return new Promise((resolve,reject)=>{
			//isMatch是一个boolean，密码匹配时为true，否则为false
			bcrypt.compare(_password,password,(err,isMath)=>{
				if(!err){
					resolve(isMath)
				}else{
					reject(err)
				}
			})
		})
	}
}

//发布模型
mongoose.model('User',userSchema)