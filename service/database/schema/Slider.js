const mongoose = require('mongoose')
const Schema = mongoose.Schema

let sliderSchema = new Schema({
	sort:Number,
	img:String,
	text:String
})

mongoose.model("Slider",sliderSchema)