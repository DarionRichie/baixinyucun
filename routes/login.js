var express = require('express');
var router = express.Router();
var formidable = require('formidable');//获取上传的图片
var api = require('../utils/api.js');
var message = require('../utils/message.js');
var testdb = require('../utils/test.js');
var bcrypt = require('../utils/bcrypt.js');
var users = require('../utils/users.js');
//主要用于查询订单 -- 
//使用API获取云数据库的所有的房间的信息：包括：房间的图片，房间的订房数量，房间的类型等   ///这里只需要进行post，通过图片路径的进行传递
/* GET users listing. */
router.get('/info', function(req, res, next) {
  //从响应头里面拿字段
  let user = req.header("user");
  res.json(users[user]);
  
});

router.post('/set',  function(req,res){//新建一个对应的房间
	console.log('yes');//进行云数据库的构建，其中使用云存储进行图片的存入，并且通过云数据库进行云存储的回调（获取云存储的图片样子） //图片的上传如何进行保证
	const form = formidable({multiples:true});
	form.uploadDir = '././tmp';
	form.parse(req,(err,fields,files)=>{
		if(err){
			return ;
		}
		testdb.api_db_query1(JSON.stringify({"username":fields.username}),"admin").then(async (a)=>{
				console.log(a);
				console.log(fields);
				if(a.length==0) {
					//let pass = a[0].password;
					if (1) {
						bcrypt.hashPassword(fields.password).then((ress)=>{
							testdb.api_db(JSON.stringify({"username": fields.username, "password":ress}), "admin");
						})

					}else
						res.send("修改成功");
					res.send("插入成功");
				}
				else{
					res.send("用户存在");//插入数据  注册的数据进行插入;
					//使用对应的hash进行加密，并且在登陆中间给一个对应的token接口
				}
			}
		);
		//链接数据库，判断是否正确;

		//res.json({fields,files});//进行解析十分的方便：fields是表单域，而对应的file是文件域,图片上传方便；//接入云数据库需要 本地的path直接进入云存储
	});
})
router.post('/signup',  function(req,res){//新建一个对应的房间
	console.log('修改密码');//进行云数据库的构建，其中使用云存储进行图片的存入，并且通过云数据库进行云存储的回调（获取云存储的图片样子） //图片的上传如何进行保证
	const form = formidable({multiples:true});
	form.uploadDir = '././tmp';
	form.parse(req,(err,fields,files)=>{
		if(err){
			return ;
		}
		testdb.api_db_query1(JSON.stringify({"username":fields.username}),"admin").then(async (a)=>{
			console.log(a);
			console.log("查找的记录");
			if(a.length!=0) {
				let pass = JSON.parse(a[0]).password;
				console.log(pass);
				console.log("查询的password");
				console.log(fields);
				console.log(fields.password);
				console.log("表单域");
				bcrypt.comparePassword(fields.password, pass).then((ress)=>{
					if (ress) {
						bcrypt.hashPassword(fields.password2).then((ress)=>{

								testdb.api_db_update(JSON.stringify({"username": fields.username}), JSON.stringify({"password": ress}), "admin").then((ress) => {
									console.log(ress.errcode==0);
									if(ress.errcode==0) {
										bcrypt.gentoken({"username": fields.username}, '123').then((ress) => {
											token = ress;
											console.log(token);
											console.log("上面是token");
											res.set("X-Access-Token", token);
											res.json({"username": fields.username, "token": token});
										});
									}else
										res.send("发生了错误");
								});

						})

					}
					else
						res.send("密码不正确");
				})

			}
			else{

			 res.send("用户不存在");//插入数据  注册的数据进行插入;
			 //使用对应的hash进行加密，并且在登陆中间给一个对应的token接口
			 }
		}
	);
		//链接数据库，判断是否正确;
		
		//res.json({fields,files});//进行解析十分的方便：fields是表单域，而对应的file是文件域,图片上传方便；//接入云数据库需要 本地的path直接进入云存储
	});
})
router.post('/login',  function(req,res){//新建一个对应的房间
	console.log('yes');//进行云数据库的构建，其中使用云存储进行图片的存入，并且通过云数据库进行云存储的回调（获取云存储的图片样子） //图片的上传如何进行保证
	const form = formidable({multiples:true});
	form.uploadDir = '././tmp';
	form.parse(req,(err,fields,files)=>{
		if(err){
			return ;
		}
		console.log(fields);
		testdb.api_db_query1(JSON.stringify({"username":fields.username}),"admin").then(async (a)=>{
			//console.log(a);
			console.log(111);
			var data = a;
			if(a.length!=0){
				console.log(data[0]);
				let pass = JSON.parse(a[0]).password;
				console.log(pass);
				bcrypt.comparePassword(fields.password,pass).then((ress)=>{
					if(ress){
						let token;
						bcrypt.gentoken({"username":"wangxin"},'123').then((ress)=>{
							token = ress;
							console.log(token);
							console.log("上面是token");
							res.set("X-Access-Token",token);
							res.json({"username":fields.username,"token":token});
						});

					}else {
						res.send("密码错误");
					}
				})

			}
			else{
			console.log(a);
			 res.send("未注册");//插入数据  注册的数据进行插入;
			 //使用对应的hash进行加密，并且在登陆中间给一个对应的token接口
			 }
		}
	);
		//链接数据库，判断是否正确;
		
		//res.json({fields,files});//进行解析十分的方便：fields是表单域，而对应的file是文件域,图片上传方便；//接入云数据库需要 本地的path直接进入云存储
	});
})
router.post('/fix',function(req,res,next){
	console.log(req);//房间的修改 --- 使用一个房间的ID，改哪一些信息等如何 考虑  ---- 字段来进行判断
})


module.exports = router;
