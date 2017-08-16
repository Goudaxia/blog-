const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/blog6";

router.get('/login',(req,res) => {
	res.render('admin/login');
});

router.post('/signin',(req,res) => {
	let username = req.body.username;
	let password = req.body.password;
	if (username == '' || password == '' ){
        res.render('admin/message',{msg : '用户名或密码不能为空'});
        return;
    }
	MongoClient.connect(url,(err,db) =>{
		if(err) throw err;
		let user = db.collection('user');
		user.findOne({username,password}).then(response => {
			if(response){
				req.session.isLogin=1;
				res.redirect('/admin');
			}else{
				res.redirect('/user/login');
			}
		}).catch(err => {console.log(err)});
	});
});

router.get('/logout',(req,res) => {
	delete req.session.isLogin;
	res.redirect('/admin');
});

module.exports= router;