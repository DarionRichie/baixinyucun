var express = require('express');
var router = express.Router();
var formidable = require('formidable');//获取上传的图片
var request = require('../utils/api.js');
var testdb = require('../utils/test.js');
//使用API获取云数据库的所有的房间的信息：包括：房间的图片，房间的订房数量，房间的类型等   ///这里只需要进行post，通过图片路径的进行传递
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/new',function(req,res){//新建一个对应的房间
	console.log('yes');//进行云数据库的构建，其中使用云存储进行图片的存入，并且通过云数据库进行云存储的回调（获取云存储的图片样子） //图片的上传如何进行保证
	const form = formidable({multiples:true,keepExtensions :true});
	form.uploadDir = '././tmp';
	form.parse(req,(err,fields,files)=>{
		if(err){
			return ;
		}
		console.log(files.img.path);
		//对应的表单非常的多，主要的结构为：
		/**
		 * 设施 ->四个字段
		 * 必读两个->两个字段
		 * 房间简介->两个字段
		 * 状态
		 * 房间类型->六个字段
		 * id，唯一
		 * 
		 */
		//传入表单进行条件的构建;
		dboptions1 = {"id":"3","picture":{"P_1":"111"}};//构建一个插入对象 - 
		dboptions = {"id":"1"};
		dboptions2 = {"picture":{"P_1":"12"}};
		request.api_yun({"env":"test-yb8a7","path":files.img.path},res);
		console.log(JSON.stringify(dboptions))
		// testdb.api_db(JSON.stringify(dboptions1),"room");
		// testdb.api_db_update(JSON.stringify(dboptions),JSON.stringify(dboptions2),"room");
		testdb.api_db_query(JSON.stringify({}),"room");
		res.json({fields,files});//进行解析十分的方便：fields是表单域，而对应的file是文件域,图片上传方便；//接入云数据库需要 本地的path直接进入云存储
	});
})
router.post('/delete',function(req,res,next){
	console.log(req);//删除某一个房间，进行房间的删除；使用formidable进行传入最好解析
})
router.post('/fix',function(req,res,next){
	console.log(req);//房间的修改 --- 使用一个房间的ID，改哪一些信息等如何 考虑  ---- 字段来进行判断
})


module.exports = router;
