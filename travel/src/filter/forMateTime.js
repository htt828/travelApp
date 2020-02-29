const moment = require('moment')

function formateTime(time){
	return moment(time).format('YYYY-MM-DD HH:mm:ss')
}

module.exports = formateTime