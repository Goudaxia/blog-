var express = require('express');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/blog6";
var router = express.Router();
const ObjectId = require('objectid');
const markdown = require('markdown').markdown;

/* GET users listing. */
router.get('/', function(req, res, next) {
	let id = req.query.id ;
	MongoClient.connect(url,(err,db) => {
		if(err) throw err;
		let category = db.collection('category');
		let posts = db.collection('posts');
		posts.update({_id:ObjectId(id)},{$inc:{count:1}},(err,result) => {
			if(err) throw err;
			category.find().toArray((err,result1) => {
				if(err) throw err;
				posts.findOne({_id:ObjectId(id)},(err,result2) => {
					if(err) throw err;
					posts.find().sort({count:-1}).limit(10).toArray((err,result3) => {
						 res.render('home/posts',{cats:result1,post:result2,hot:result3});
					});
				});
			});
		});
	});
});


router.get('/md',(req,res) => {
    let str = markdown.toHTML('这是一个[markdown](http://baidu.com)');
    res.send(str);
});
module.exports = router;
