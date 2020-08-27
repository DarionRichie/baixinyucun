var express = require('express');
var router = express.Router();
var formidable = require('formidable');//获取上传的图片
var request = require('../utils/api.js');
var testdb = require('../utils/test.js');
var url = require("url");
var websocket = require('../utils/websocket');
var websocket2 = require('../utils/websocket2');
var mess = require("../utils/message");
//使用API获取云数据库的所有的房间的信息：包括：房间的图片，房间的订房数量，房间的类型等   ///这里只需要进行post，通过图片路径的进行传递
/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log(url.parse(req.url,true).query);
	try {//使用openid进行某一个人的直接访问;
		var options = {};
		if (req.url == '/') {
			options = {};
		} else {
			options = url.parse(req.url,true).query;
		}
		testdb.api_db_query1(JSON.stringify(options), "order").then((ress) => {
			res.json(ress);
		});
	}catch(err){
		console.log(err);
		res.send("error");
	}
});

router.post('/new',function(req,res){//新建一个对应的房间
	try{
		//console.log(req.body);//进行云数据库的构建，其中使用云存储进行图片的存入，并且通过云数据库进行云存储的回调（获取云存储的图片样子） //图片的上传如何进行保证
		let obj = req.body;
		//构建插入对象
		let objparse = obj;

		console.log(objparse);

		// mess.requestPhone({phonenumber:"18973281132",code:{"code":"111111"}});
		//新建对应的优惠券的规则;
		//用id进行查询 分为两步查；先查有没有房源还  有的话先改表;
		testdb.api_db_query1(JSON.stringify({"id":objparse.id}), "room").then((ress) => {
			console.log(ress);
			console.log(JSON.parse(ress[0]).roomNum);//进行优惠券的插入;如果num不等于0了或者大于0进行减一的操作;
			if(parseInt(JSON.parse(ress[0]).roomNum)>0){
				let value = parseInt(JSON.parse(ress[0]).roomNum)-1;
				testdb.api_db_update(JSON.stringify({"id":objparse.id}),JSON.stringify({"roomNum":value.toString()}), "room").then((ress)=>{
					if(ress.errcode==0){
						console.log("yes");
						console.log(ress.errcode)
						//状态也需要写明 是还在等待的状态;
						testdb.api_db(JSON.stringify(objparse),"order").then((response)=>{
							console.log("成功啦  创建订单");
							testdb.api_db_query1(JSON.stringify({"openid":objparse["openid"]}),"rootuser").then((ress)=>{
								if(ress.length==0){
									testdb.api_db(JSON.stringify({"user":objparse["user"],"openid":objparse["openid"]}),"rootuser")
								}
							})//处理重复的段;
							websocket.first(objparse);
							//电话接入
							res.json({"status":"succ","response":response,"order":objparse});
						});
					}else {
						res.send("发生了错误");
					}
				})
			}else {
				res.send("房间满啦");
			}
		});
		// testdb.api_db_query1(JSON.stringify({"id":objparse.id}), "coupon_role").then((ress) => {
		// 	//res.json(ress);
		// 	console.log(ress);//进行优惠券的插入;
		// 	let List_role = []
		// 	ress.forEach(function (query_ru) {
		// 		List_role.push(JSON.parse(query_ru))
		// 	})
		// 	//插入优惠券
		// 	console.log(List_role);
		// 	console.log("需要插入的");
		// 	let coupon_id = []
		// 	let time = new Date();
		// 	List_role.forEach(function (date) {
		// 		try {
		// 			if (new Date(date.validTime[0].replace("/-/g", "/")) <= time && new Date(date.validTime[1].replace("/-/g", "/")) >= time) {
		// 				coupon_id.push(date["_id"]);//把所有要进行插入的都选出来
		// 			}
		// 		}catch(e){
		//
		// 		}
		// 	})
		// 	console.log(coupon_id);
		// 	//通过这两个_id进行插入  拿前面的数据;
		// 	List_role.forEach(function (insert) {
		// 		//是一条记录  通过_id看看是不是需要插入
		// 		coupon_id.forEach(function (ID) {
		// 			if(insert["_id"]==ID){
		// 				//进行优惠券的插入
		// 				console.log(insert);
		// 				console.log("插入优惠券啦");
		// 			}
		// 		})
		//
		// 	})
		// });
		// testdb.api_db_query1(JSON.stringify({"id":"0"}), "coupon_role").then((ress) => {
		// 	//res.json(ress);
		// 	console.log(ress);//进行优惠券的插入; 表示全体的用户
		// 	let List_role = []
		// 	ress.forEach(function (query_ru) {
		// 		List_role.push(JSON.parse(query_ru))
		// 	})
		// 	//插入优惠券
		// 	console.log(List_role);
		// 	console.log("需要插入的");
		// 	let coupon_id = []
		// 	let time = new Date();
		// 	List_role.forEach(function (date) {
		// 		if(new Date(date.validTime[0].replace("/-/g", "/"))<=time&& new Date(date.validTime[1].replace("/-/g", "/"))>=time){
		// 			coupon_id.push(date["_id"]);//把所有要进行插入的都选出来
		// 		}
		// 	})
		// 	console.log(coupon_id);
		// 	//通过这两个_id进行插入  拿前面的数据;
		// 	List_role.forEach(function (insert) {
		// 		//是一条记录  通过_id看看是不是需要插入
		// 		coupon_id.forEach(function (ID) {
		// 			if(insert["_id"]==ID){
		// 				//进行优惠券的插入
		// 				console.log(insert);
		// 				console.log("插入优惠券啦");
		// 			}
		// 		})
		//
		// 	})
		// });
		//res.send("yes");
	}catch(err){
		res.send("error");
	}
	//进行解析十分的方便：fields是表单域，而对应的file是文件域,图片上传方便；//接入云数据库需要 本地的path直接进入云存储

})
router.post('/delete',function(req,res,next){
	try{
		console.log(req.body);//删除某一个房间，进行房间的删除；使用formidable进行传入最好解析
		let obj = req.body;
		let objparse = obj;
		let option = {"id":objparse["id"]};
		testdb.api_db_delete(JSON.stringify(option),"order").then((response)=>{
			res.send("delete succ\n"+JSON.stringify(response));
		});
	}catch(err){
		console("error");
	}
})
router.post('/update',function(req,res){//新建一个对应的房间
	try{
		//console.log(req.body);//进行云数据库的构建，其中使用云存储进行图片的存入，并且通过云数据库进行云存储的回调（获取云存储的图片样子） //图片的上传如何进行保证
		let obj = req.body;
		//构建插入对象
		let objparse = obj;
		let option = {"counters":parseInt(objparse["order_id"])}
		console.log(typeof (parseInt(objparse["order_id"])));
		console.log(option);
		let option2 = {"status":objparse["status"]}
		console.log(objparse);
		//判断对应的状态是什么呢？字段名;
		if(objparse.status == "待入住"){
			//发起信息表示对于的//确定订单成功  //调用小程序端的websocket
			console.log("成功了");
			testdb.api_db_update(JSON.stringify(option),JSON.stringify(option2),"order").then((ress)=>{
				console.log(ress);
			});
			res.send("已经待入住")
		}else if(objparse.status == "已完成"){
			testdb.api_db_update(JSON.stringify(option),JSON.stringify(option2),"order");
			testdb.api_db_query1(JSON.stringify(option),"order").then((ress)=>{
				//获取订单的数据 对房源进行改动;
				let data = JSON.parse(ress[0]);
				let ID = data["id"];
				testdb.api_db_query1(JSON.stringify({"id":ID}),"room").then((response)=>{
					let Last = JSON.parse(response);
					let Num = Last["roomNum"];
					let LastNum = (parseInt(Num)+1).toString();
					testdb.api_db_update(JSON.stringify({"id":ID}),JSON.stringify({"roomNum":LastNum}),"room");
					console.log("退房成功了，数据库进行了更新");
				})

			})
			//只需要进行数据库的更新
			res.send("已经完成")
		}else if(objparse.status == "已取消"){


			if(objparse.own==0){
				testdb.api_db_update(JSON.stringify(option),JSON.stringify(option2),"order");
				testdb.api_db_query1(JSON.stringify(option),"order").then((ress)=>{
					websocket2.first(JSON.parse(ress[0]));//订单的对象传递过去
				})
				testdb.api_db_query1(JSON.stringify(option),"order").then((ress)=>{
					//获取订单的数据 对房源进行改动;
					let data = JSON.parse(ress[0]);
					let ID = data["id"];
					testdb.api_db_query1(JSON.stringify({"id":ID}),"room").then((response)=>{
						let Last = JSON.parse(response);
						let Num = Last["roomNum"];
						let LastNum = (parseInt(Num)+1).toString();
						testdb.api_db_update(JSON.stringify({"id":ID}),JSON.stringify({"roomNum":LastNum}),"room");
						console.log("退房成功了，数据库进行了更新");
					})

				})
				websocket2.first({"status":"已经被后台取消啦"});
			}else {
				console.log("小程序开始退房了  取消了");
				option = {"counters":parseInt(objparse["counters"])}//传输的数据是不一样的  需要注意判断
				console.log(option);
				console.log(option2);
				testdb.api_db_update(JSON.stringify(option),JSON.stringify(option2),"order");
				testdb.api_db_query1(JSON.stringify({"id":objparse["2"]}),"room").then((ress)=>{
					let data = JSON.parse(ress[0]);
					let ID = data["id"];
					testdb.api_db_query1(JSON.stringify({"id":ID}),"room").then((response)=>{
						let Last = JSON.parse(response);
						let Num = Last["roomNum"];
						let LastNum = (parseInt(Num)+1).toString();
						testdb.api_db_update(JSON.stringify({"id":ID}),JSON.stringify({"roomNum":LastNum}),"room");
						console.log("退房成功了，数据库进行了更新");
					})
				})
				websocket.first(objparse);
				websocket.first({"status":"已经被小程序取消啦"});
			}
			//已经取消
			res.send("已经取消")

		}else if(objparse.status == "已入住") {
			testdb.api_db_update(JSON.stringify(option), JSON.stringify(option2), "order");
			//两个方向都进行websocket的发送，只需要对方进行辨认
			testdb.api_db_query1(JSON.stringify(option), "order").then((orderhis) => {
				let objparse = 	JSON.parse(orderhis[0]);
				console.log(objparse);
				console.log("我的查找");
			testdb.api_db_query1(JSON.stringify({"request": objparse.id,"frequency_day":"每天一张"}), "coupon_role").then((ress) => {
				//res.json(ress);
				console.log(ress);//进行优惠券的插入;
				let List_role = []
				ress.forEach(function (query_ru) {
					List_role.push(JSON.parse(query_ru))
				})
				//插入优惠券
				console.log(List_role);
				console.log("需要插入的");
				let coupon_id = []
				let time = new Date();
				List_role.forEach(function (date) {
					try {

						if (new Date(date.validTime[0].replace("/-/g", "/")) <= time && new Date(date.validTime[1].replace("/-/g", "/")) >= time || date.validTime[0].length == 0) {
							coupon_id.push(date["_id"]);//把所有要进行插入的都选出来
						}
					} catch (e) {

					}
				})
				console.log(coupon_id);
				console.log("-----------------------------------------------")
				//通过这两个_id进行插入  拿前面的数据;
				List_role.forEach(function (insert) {
					//是一条记录  通过_id看看是不是需要插入
					coupon_id.forEach(function (ID) {
						if (insert["_id"] == ID) {
							//进行优惠券的插入
							//构造一个coupon的插入对象
							let date = insert;
							let type = insert["discount"].includes("%") ? "discount" : "money";
							let accout;
							if (type == 'discount') {
								accout = insert["discount"].substring(0, insert["discount"].Length - 1);
								accout = parseInt(insert["discount"]);
							} else {
								accout = insert["discount"];
								accout = parseInt(accout);
							}
							console.log("数字大小" + accout);
							let endDate, endTime, startTime, startDate;
							if (date.validTime[0].length == 0) {
								endDate = "";
								endTime = "";
								startTime = "";
								startDate = "";
							} else {
								endDate = new Date(date.validTime[1].replace("/-/g", "/")).getDate();
								endTime = new Date(date.validTime[1].replace("/-/g", "/")).getTime();
								startDate = new Date(date.validTime[0].replace("/-/g", "/")).getDate();
								startTime = new Date(date.validTime[0].replace("/-/g", "/")).getTime();
							}
							option = {
								"id": insert["id"],
								"openid": objparse["openid"],
								"user": objparse["form"]["order_name"],
								"type": insert["type"],
								"title": insert["name"],
								"message": {
									"condition": insert["moneysill"], "num": accout, "type": type,
									"status": "可使用"
								},
								"endDate": endDate,
								"endTime": endTime,
								"startDate": startDate,
								"startTime": startTime
							}
							testdb.api_db(JSON.stringify(option), "coupon")
							console.log(insert);
							console.log("插入优惠券啦");
						}
					})

				})
			});
			testdb.api_db_query1(JSON.stringify({"request": 0,"frequency_day":"每天一张"}), "coupon_role").then((ress) => {
				console.log("插入所有用户的那种");
				// res.json(ress);
				console.log(ress);//进行优惠券的插入; 表示全体的用户
				let List_role = []
				ress.forEach(function (query_ru) {
					List_role.push(JSON.parse(query_ru))
				})
				//插入优惠券

				let coupon_id = []
				let time = new Date();
				List_role.forEach(function (date) {
					if (new Date(date.validTime[0].replace("/-/g", "/")) <= time && new Date(date.validTime[1].replace("/-/g", "/")) >= time || date.validTime[0].length == 0) {
						coupon_id.push(date["_id"]);//把所有要进行插入的都选出来
					}
				})
				//通过这两个_id进行插入  拿前面的数据;
				List_role.forEach(function (insert) {
					//是一条记录  通过_id看看是不是需要插入
					coupon_id.forEach(function (ID) {
						if (insert["_id"] == ID) {
							//进行优惠券的插入
							//构造一个coupon的插入对象
							let date = insert;
							let accout;
							let type = insert["discount"].includes("%") ? "discount" : "money";
							if (type == 'discount') {
								accout = insert["discount"].substring(0, insert["discount"].Length - 1);
								accout = parseInt(insert["discount"]);
							} else {
								accout = insert["discount"];
								accout = parseInt(accout);
							}
							console.log(accout+"-------------------------------");
							accout = parseInt(insert["discount"]);
							let endDate, endTime, startTime, startDate;
							if (date.validTime[0].length == 0) {
								endDate = "";
								endTime = "";
								startTime = "";
								startDate = "";
							} else {
								endDate = new Date(date.validTime[1].replace("/-/g", "/")).getDate();
								endTime = new Date(date.validTime[1].replace("/-/g", "/")).getTime();
								startDate = new Date(date.validTime[0].replace("/-/g", "/")).getDate();
								startTime = new Date(date.validTime[0].replace("/-/g", "/")).getTime();
							}
							option = {
								"id": insert["id"],
								"openid": objparse["openid"],
								"user": objparse["form"]["order_name"],
								"type": insert["type"],
								"title": insert["name"],
								"message": {
									"condition": insert["moneysill"], "num": accout, "type": type,
									"status": "可使用"
								},
								"endDate": endDate,
								"endTime": endTime,
								"startDate": startDate,
								"startTime": startTime
							}
							testdb.api_db(JSON.stringify(option), "coupon")
							console.log(insert);
							console.log("插入优惠券啦");
						}
					})

				})
			});
		})
			res.send("已经入住")
		}else {
			res.send("错误啦  status不对");
		}

		// mess.requestPhone({phonenumber:"18973281132",code:{"code":"111111"}});
		//新建对应的优惠券的规则;
		//用id进行查询 分为两步查；先查有没有房源还  有的话先改表;

						//状态也需要写明 是还在等待的状态;
						//状态进行update 也就是状态的更新 -- 主要的作用是用于订单已经完成
		// testdb.api_db(JSON.stringify(objparse),"order").then((response)=>{
		// 	console.log("成功啦  创建订单");
		// 	websocket.first(objparse);
		// 	//电话接入
		// 	res.send("succ\n"+JSON.stringify(response));
		// });



		//res.send("yes");
	}catch(err){
		res.send("error");
	}
	//进行解析十分的方便：fields是表单域，而对应的file是文件域,图片上传方便；//接入云数据库需要 本地的path直接进入云存储

})
router.post('/delete',function(req,res,next){
	try{
		console.log(req.body);//删除某一个房间，进行房间的删除；使用formidable进行传入最好解析
		let obj = req.body;
		let objparse = obj;
		let option = {"id":objparse["id"]};
		testdb.api_db_delete(JSON.stringify(option),"order").then((response)=>{
			res.send("delete succ\n"+JSON.stringify(response));
		});
	}catch(err){
		console("error");
	}
})
router.post('/fix',function(req,res,next){
	try{
		console.log(req.body);//房间的修改 --- 使用一个房间的ID，改哪一些信息等如何 考虑  ---- 字段来进行判断
		let obj = req.body;
		let objparse = obj;
		let option = {"id":objparse["id"]};
		console.log(objparse);
		testdb.api_db_update(JSON.stringify(option),JSON.stringify(objparse),"order").then((response)=>{
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
		testdb.api_db_delete(JSON.stringify({}),"order",'all').then((response)=>{
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
		// dboptions1 = {"id":"4","picture":{"P_1":"111"}};//构建一个插入对象 -
		// dboptions = {"id":"1"};
		// dboptions2 = {"picture":{"P_1":"12"}};
		// if(files.img)
		// 	request.api_yun({"env":"test-yb8a7","path":files.img.path},res);
		// console.log(JSON.stringify(dboptions))
		// // testdb.api_db(JSON.stringify(dboptions1),"room");
		// // testdb.api_db_update(JSON.stringify(dboptions),JSON.stringify(dboptions2),"room");
		// testdb.api_db(JSON.stringify(dboptions1),"room").then((data)=>{
		// 	console.log("查询的数据");
		// 	console.log(data);
		// });
		//console.log(fields);
		//用来上传图片，其中图片上传使用files进行获取，而订房房间的id通过fields进行获取，最终通过id进行插入云数据库；
		console.log("pic _yes")
		res.send(files.file.path);//进行解析十分的方便：fields是表单域，而对应的file是文件域,图片上传方便；//接入云数据库需要 本地的path直接进入云存储
	});
})


module.exports = router;
