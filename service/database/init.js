const mongoose = require('mongoose') 
const db = 'mongodb://localhost/travel'
const glob = require('glob')
const {resolve} = require('path')

//初始化shcema
exports.initSchema = ()=>{
	//用同步方式引入,把所有再schema下面的js文件都引入
	glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require)
}
//连接数据库
exports.connect = ()=>{
	//连接数据库
	mongoose.connect(db)
	//最大连接次数
	let maxConnectTimes = 0
	
	return new Promise((resolve,reject)=>{
		//添加连接数据库监听
		//数据库断开连接
		mongoose.connection.on('disconnect',(err)=>{
			console.log('数据库断开连接')
			if(maxConnectTimes<=3){
				mongoose.connect(db)
				maxConnectTimes += 1
			}else{
				reject(err)
				throw new Error('数据库出现了问题，无法自动修复，请人为搞定')
			}
		})
		
		//数据库出现错误
		mongoose.connection.on('error',(err)=>{
			console.log('数据库错误')
			if(maxConnectTimes<=3){
				mongoose.connect(db)
				maxConnectTimes += 1
			}else{
				reject(err)
				throw new Error('数据库出现了问题，无法自动修复，请人为搞定')
			}
		})
		
		//数据库连接成功
		mongoose.connection.once('open',()=>{
			console.log('数据库连接成功')
			resolve()
		})
		
	})
}