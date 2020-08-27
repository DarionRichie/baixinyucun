var express = require('express');
var router = express.Router();
var formidable = require('formidable');//获取上传的图片
var request = require('../utils/api.js');
var testdb = require('../utils/test.js');
var url = require("url");
//使用API获取云数据库的所有的房间的信息：包括：房间的图片，房间的订房数量，房间的类型等   ///这里只需要进行post，通过图片路径的进行传递
/* GET users listing. */
router.get('/', function(req, res, next) {
	try {
		var options = {};
		if (req.url == '/') {
			options = {};
		} else {
			options = url.parse(req.url,true).query;
		}

		testdb.api_db_query1(JSON.stringify(options), "room").then((ress) => {
			res.json(ress);
		});
	}catch(err){
		console.log(err);
		res.send("error");
	}
});

router.post('/new',function(req,res){//新建一个对应的房间
	try{
		console.log(req.body);//进行云数据库的构建，其中使用云存储进行图片的存入，并且通过云数据库进行云存储的回调（获取云存储的图片样子） //图片的上传如何进行保证
		let obj = Object.keys(req.body)[0];
		//构建插入对象
		let objparse = JSON.parse(obj);
		testdb.api_db(JSON.stringify(objparse),"room").then((response)=>{
			res.send("succ\n"+JSON.stringify(response));
		});
		console.log(objparse);
	}catch(err){
		res.send("error");
	}
	//进行解析十分的方便：fields是表单域，而对应的file是文件域,图片上传方便；//接入云数据库需要 本地的path直接进入云存储

})
router.post('/delete',function(req,res,next){
	try{
		console.log(req.body);//删除某一个房间，进行房间的删除；使用formidable进行传入最好解析
		let obj = Object.keys(req.body)[0];
		let objparse = JSON.parse(obj);
		let option = {"id":objparse["id"]};
		testdb.api_db_delete(JSON.stringify(option),"room").then((response)=>{
			res.send("delete succ\n"+JSON.stringify(response));
		});
	}catch(err){
		console(err);
		res.send("error");

	}
})
router.post('/fix',function(req,res,next){
	try{
		console.log(req.body);//房间的修改 --- 使用一个房间的ID，改哪一些信息等如何 考虑  ---- 字段来进行判断
		let obj = Object.keys(req.body)[0];
		let objparse = JSON.parse(obj);
		let option = {"id":objparse["id"]};
		console.log(objparse);
		testdb.api_db_update(JSON.stringify(option),JSON.stringify(objparse),"room").then((response)=>{

			res.send("fix succ/n"+JSON.stringify(response));
		});
	}catch(err){
		console.log(err);
		console.log("error");
		res.send("error");
	}

})
router.post('/deleteAll',function(req,res,next){
	try{
		// console.log(req.body);//删除某一个房间，进行房间的删除；使用formidable进行传入最好解析
		// let obj = Object.keys(req.body)[0];
		// let objparse = JSON.parse(obj);
		// let option = {"id":objparse["id"]};
		testdb.api_db_delete(JSON.stringify({}),"room",'all').then((response)=>{
			console.log(response);
			res.send("delete succ\n"+JSON.stringify(response));
		});
	}catch(err){
		console.log("error");
		res.send("error");
	}
})
router.post('/pic',function(req,res,next){
	console.log('yes');//进行云数据库的构建，其中使用云存储进行图片的存入，并且通过云数据库进行云存储的回调（获取云存储的图片样子） //图片的上传如何进行保证
	const form = formidable({multiples:true,keepExtensions :true});
	form.uploadDir = '././tmp';
	form.parse(req,(err,fields,files)=>{
		if(err){
			console.log(err);
			return ;
		}
		try {
			let name_path = {
				name:files.file.name,
				path:files.file.path
			}
			res.json(name_path);
			// request.api_yun({"env": "test-yb8a7", "path": files.file.path}, res).then((respose) => {
			// 	res.send(respose);
			// });
		}catch (e) {
			console.log(e);
			res.send("error");
		}

	});
})


module.exports = router;
