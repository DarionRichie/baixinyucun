var express = require('express');
var router = express.Router();
var formidable = require('formidable');//获取上传的图片
var request = require('../utils/api.js');
var testdb = require('../utils/test.js');
var url = require("url");
//使用API获取云数据库的所有的房间的信息：包括：房间的图片，房间的订房数量，房间的类型等   ///这里只需要进行post，通过图片路径的进行传递
/* GET users listing. */
router.get('/', function(req, res, next) {
    try {//使用openid进行某一个人的直接访问;
        var options = {};
        if (req.url == '/') {
            options = {};
        } else {
            options = url.parse(req.url,true).query;
        }

        testdb.api_db_query1(JSON.stringify(options), "coupon_role").then((ress) => {
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
        console.log(objparse)
        console.log("-----------------------------------------")
        if(objparse["request"]==''){
            testdb.api_db_query1(JSON.stringify({}),"rootuser").then((datas)=>{
                datas.forEach(function (data) {
                    console.log("userbiao用户");
                    console.log(data)
                    let insert = objparse;
                    let objparse1 = JSON.parse(data);
                    let date = objparse;
                    let accout;
                    let type = insert["discount"].includes("%") ? "discount" : "money";
                    if (type == 'discount') {
                        accout = insert["discount"].substring(0, insert["discount"].Length - 1);
                        accout = parseInt(insert["discount"]);
                    } else {
                        accout = insert["discount"];
                        accout = parseInt(accout);
                    }
                    let endDate,endTime,startTime,startDate;
                    if(date.validTime[0].length == 0){
                        endDate = "";
                        endTime = "";
                        startTime = "";
                        startDate = "";
                    }else {
                        endDate = new Date(date.validTime[1].replace("/-/g", "/")).getDate();
                        endTime = new Date(date.validTime[1].replace("/-/g", "/")).getTime();
                        startDate = new Date(date.validTime[0].replace("/-/g", "/")).getDate();
                        startTime = new Date(date.validTime[0].replace("/-/g", "/")).getTime();
                    }
                    option = {"id":insert["id"],"openid":objparse1["openid"],"user":objparse1["user"],"type":insert["type"],"title":insert["name"],"message":{"condition":insert["moneysill"],"num":accout,"type":type,
                            "status":"可使用"},"endDate":endDate,"endTime":endTime,"startDate":startDate,"startTime":startTime}
                    testdb.api_db(JSON.stringify(option),"coupon");
                    console.log("插入啦");
                })
            })
        }else if(objparse["每天一张"]=='一次性发放'){
            testdb.api_db_query1(JSON.stringify({}),"rootuser").then((ress)=>{
                let list = [];

                testdb.api_db_query1(JSON.stringify({"id":objparse["request"]}),"order").then((ress2)=>{
                    ress2.forEach(function (item) {
                        list.push(JSON.parse(item)["openid"]);//把其中房源的人放进去一个list里面
                    })
                    //对ress进行遍历:
                    let datas = ress;
                    datas.forEach(function (data) {
                        if (list.includes(JSON.parse(data)["openid"])) {
                            console.log("userbiao用户");
                            console.log(data)
                            let insert = objparse;
                            let objparse1 = JSON.parse(data);
                            let date = objparse;
                            let accout;
                            let type = insert["discount"].includes("%") ? "discount" : "money";
                            if (type == 'discount') {
                                accout = insert["discount"].substring(0, insert["discount"].Length - 1);
                                accout = parseInt(insert["discount"]);
                            } else {
                                accout = insert["discount"];
                                accout = parseInt(accout);
                            }
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
                                "openid": objparse1["openid"],
                                "user": objparse1["user"],
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
                            testdb.api_db(JSON.stringify(option), "coupon");
                            console.log("插入啦");
                        }
                    })

                })

            })

        }

        testdb.api_db(JSON.stringify(objparse),"coupon_role").then((response)=>{
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
        testdb.api_db_delete(JSON.stringify(option),"coupon_role").then((response)=>{
            res.send("delete succ\n"+JSON.stringify(response));
        });
    }catch(err){
        console("error");
    }
})
router.post('/fix',function(req,res,next){
    try{
        console.log(req.body);//房间的修改 --- 使用一个房间的ID，改哪一些信息等如何 考虑  ---- 字段来进行判断
        let obj = Object.keys(req.body)[0];
        console.log("表单结构");
        let objparse = JSON.parse(obj);
        let option = {"id":objparse["id"]};
        //console.log(objparse);
        testdb.api_db_update(JSON.stringify(option),JSON.stringify(objparse),"coupon_role").then((response)=>{
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
        testdb.api_db_delete(JSON.stringify({}),"coupon_role",'all').then((response)=>{
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
        res.json({fields,files});//进行解析十分的方便：fields是表单域，而对应的file是文件域,图片上传方便；//接入云数据库需要 本地的path直接进入云存储
    });
})


module.exports = router;
