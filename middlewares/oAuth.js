const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const oAuth = (req,res,next)=>{
	res.set("Content-Type",'application/json;charset=utf-8');
	let token = req.header('X-Access-Token');
	console.log(token);
	let cert =  '123';
	jwt.verify(token,cert,(error,decode)=>{
		if(error){
			console.log(11);
			// res.send("fail",{
			// 	data:JSON.stringify({
			// 		isSignin:false
			// 	})
			// })
			res.json({'status':"fail","data":JSON.stringify({isSignin:false})});
		}else{
			console.log(22);
			next();
			
		}
	})
}

module.exports = oAuth;