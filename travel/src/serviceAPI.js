const LOCALURL = 'http://172.18.96.237:3000/'
const url = {
	register:LOCALURL + 'user/register', //用户注册接口
	login:LOCALURL + 'user/login', //登录接口,
	getLoginInfo:LOCALURL + 'user/getLoginInfo', //获取登陆用户信息
	getSlider:LOCALURL + 'index/getSlider',//获取轮播图接口
	getContent:LOCALURL + 'index/getContent',//获取用户动态数据
	focus:LOCALURL + 'index/focus',//点击关注
	like:LOCALURL + 'index/like',//点赞或取消赞
	getFocusUser:LOCALURL + 'user/getFocusUser',//获取关注用户
	getFansUser:LOCALURL + 'user/getFansUser',//获取粉丝用户
	getMessages:LOCALURL + 'message/getMessages',//获取消息列表
	postComment:LOCALURL + 'index/postComment',//发表评论
	getCommentContent:LOCALURL + 'index/getCommentContent',//获取动态详情
	publishContent:LOCALURL + 'user/publishContent',//发表动态
	getCommentMessage:LOCALURL + 'message/getCommentMessage',//获取我的评论消息
	delSingleComment:LOCALURL + 'index/delSingleComment',//删除单条评论数据
	uploadHead:LOCALURL +'user/uploadHead',//用户上传头像
	updataUserInfo:LOCALURL + 'user/updataUserInfo',//修改用户信息
	getTravelContents:LOCALURL + 'index/getTravelContents',//获取某个用户的全部动态
	getComments:LOCALURL +'index/getComments',//获取评论列表
	delContent:LOCALURL + 'user/delContent',//删除个人动态
	searchContent:LOCALURL + 'index/searchContent',//搜索动态
	cleanMsgNum:LOCALURL + 'user/cleanMsgNum',//清空已经看过的消息数量
}



module.exports = url