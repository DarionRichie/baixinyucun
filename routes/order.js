var express = require('express');
var router = express.Router();
var formidable = require('formidable');//获取上传的图片
var api = require('../utils/api.js');
var message = require('../utils/message.js');

//主要用于查询订单 -- 
//使用API获取云数据库的所有的房间的信息：包括：房间的图片，房间的订房数量，房间的类型等   ///这里只需要进行post，通过图片路径的进行传递
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/new',function(req,res){//新建一个对应的房间
	console.log('yes');//进行云数据库的构建，其中使用云存储进行图片的存入，并且通过云数据库进行云存储的回调（获取云存储的图片样子） //图片的上传如何进行保证
	const form = formidable({multiples:true});
	form.uploadDir = '././tmp';
	form.parse(req,(err,fields,files)=>{
		if(err){
			return ;
		}
		console.log();
		const options = {phonenumber:'18973281132',code:{"code":"111111"}};
		//message.requestPhone(options);
		//api.requesturlyun();
		res.json({"yes":"yes"});
		//res.json({fields,files});//进行解析十分的方便：fields是表单域，而对应的file是文件域,图片上传方便；//接入云数据库需要 本地的path直接进入云存储
	});
})
router.post('/delete',function(req,res,next){
	console.log(req);//删除某一个房间，进行房间的删除；使用formidable进行传入最好解析
})
router.post('/fix',function(req,res,next){
	console.log(req);//房间的修改 --- 使用一个房间的ID，改哪一些信息等如何 考虑  ---- 字段来进行判断
})


module.exports = router;
