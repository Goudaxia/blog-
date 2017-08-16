var express = require('express');
const path = require('path');
const ObjectId = require('objectid');
const multiparty = require('multiparty');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/blog6";
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	let page = req.query.page || 1;
	let count = +req.query.count ||2;
	let offset = (page-1)*count;
	MongoClient.connect(url,(err,db) => {
		if(err) throw err;
		let posts = db.collection('posts');
		posts.find().skip(offset).limit(count).sort({time:-1}).toArray((err,result) => {
			if(err) throw err;
			posts.find().count().then(response => {
				let total = response;
				let size = Math.ceil(total/count);
				console.log({data:result,page,count,size})
				res.render('admin/article_list',{data:result,page,count,size});
			}).catch(err => {console.log(err)});
		});
	});
});
router.get('/add', function(req, res, next) {
	MongoClient.connect(url,(err,db) => {
		if(err) throw err;
		let category = db.collection('category');
		category.find().toArray((err,result) => {
			 res.render('admin/article_add',{data:result});
		});
	});
});
router.post('/insert',(req,res) => {
	let uploadDir = path.join(__dirname,'../../public/temp');
	let form = new multiparty.Form({uploadDir});
	form.parse(req,(err,fields,files) => {

		if(files.cover[0].size){
			let oldPath = files.cover[0].path;
			let newPath = path.join(__dirname,'../../public/uploads',files.cover[0].originalFilename);
			fs.rename(oldPath,newPath,(err) => {
				if(err) throw err;
				let category = fields.category[0];
				let subject = fields.subject[0];
				let summary = fields.summary[0];
				let content = fields.content[0];
				let time = new Date().toLocaleString();
				let count = Math.ceil(Math.random()*100);
				let cover = '/uploads/'+files.cover[0].originalFilename;
				if(!subject){
					 res.render("admin/message",{msg : '标题不能为空'});
					 return;
				}
				MongoClient.connect(url,(err,db) => {
                    if (err) throw err;
                    let posts = db.collection('posts');
                    posts.insert({category,subject,summary,content,time,count,cover},(err,result) => {
                        if (err) throw err;
                        res.render('admin/message',{msg : '添加文章成功'});
                    });
                });
			});
		}else{
			 //没有上传
            let category = fields.category[0];
            let subject = fields.subject[0];
            let summary = fields.summary[0];
            let content = fields.content[0];
            // //需要获取当前时间
            let time = new Date().toLocaleString();
            // //需要设置一个浏览次数，随机一个
            let count = Math.ceil(Math.random() * 100);
            let cover = "";
            //2.数据的有效性验证
            if (!subject) {
                res.render("admin/message",{msg : '标题不能为空'});
            }
            //3.完成数据的插入
            MongoClient.connect(url,(err,db) => {
                if (err) throw err;
                let posts = db.collection('posts');
                posts.insert({category,subject,summary,content,time,count,cover},(err,result) => {
                    if (err) throw err;
                    res.render('admin/message',{msg : '添加文章成功'});
                });
            });
		}
		
	});
});
router.get('/edit', function(req, res, next) {
	let id = req.query.id;
	MongoClient.connect(url,(err,db) => {
		if(err) throw err;
		let posts = db.collection('posts');
		posts.findOne({_id:ObjectId(id)}).then(response => {
			res.render('admin/article_edit',{data:response});
		}).catch(err => {console.log(err)});
	});
});
router.post('/update',(req,res) => {
	let id = req.query.id;
	let uploadDir = path.join(__dirname,'../../public/temp');
	let form = new multiparty.Form({uploadDir});
	form.parse(req,(err,fields,files) => {

		if(files.cover[0].size){
			let oldPath = files.cover[0].path;
			let newPath = path.join(__dirname,'../../public/uploads',files.cover[0].originalFilename);
			fs.rename(oldPath,newPath,(err) => {
				if(err) throw err;
				let category = fields.category[0];
				let subject = fields.subject[0];
				let summary = fields.summary[0];
				let content = fields.content[0];
				let time = new Date().toLocaleString();
				let count = Math.ceil(Math.random()*100);
				let cover = '/uploads/'+files.cover[0].originalFilename;
				if(!subject){
					 res.render("admin/message",{msg : '标题不能为空'});

				}
				MongoClient.connect(url,(err,db) => {
                    if (err) throw err;
                    let posts = db.collection('posts');
                    posts.update({_id:ObjectId(id)},{_id:ObjectId(id),category,subject,summary,content,time,count,cover},(err,result) => {
                        if (err) throw err;
                        res.render('admin/message',{msg : '更新文章成功'});
                    });
                });
			});
		}else{
			 //没有上传
            let category = fields.category[0];
            let subject = fields.subject[0];
            let summary = fields.summary[0];
            let content = fields.content[0];
            // //需要获取当前时间
            let time = new Date().toLocaleString();
            // //需要设置一个浏览次数，随机一个
            let count = Math.ceil(Math.random() * 100);
            // let cover = "";
            //2.数据的有效性验证
            if (!subject) {
                res.render("admin/message",{msg : '标题不能为空'});
            }
            //3.完成数据的插入
            MongoClient.connect(url,(err,db) => {
                if (err) throw err;
                let posts = db.collection('posts');
                posts.findOne({_id:ObjectId(id)}).then(result => {
                	let cover = result.cover;
                	posts.update({_id:ObjectId(id)},{_id:ObjectId(id),category,subject,summary,content,time,count,cover},(err,result) => {
	                    if (err) throw err;
	                    res.render('admin/message',{msg : '更新文章成功'});
	                });
                }).catch(err => {console.log(err)});
            });
		}
	});
	// res.render('admin/message',{msg : '更新文章成功'});
});
router.get('/delete', function(req, res, next) {
	let id = req.query.id;
	MongoClient.connect(url,(err,db) => {
		if (err) throw err;
        let posts = db.collection('posts');
        posts.remove({_id:ObjectId(id)});
	});
  	 res.render('admin/message',{msg : '删除文章成功'});
});

module.exports = router;
