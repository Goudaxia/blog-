var express = require('express');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/blog6";
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	let cat = req.query.cat;
	let page = req.query.page || 1;
	let count = +req.query.count ||2;
	MongoClient.connect(url,(err,db) => {
		if(err) throw err;
		let category = db.collection('category');
		let posts = db.collection('posts');
		category.find().toArray((err,result1) => {
			if(err) throw err;
			posts.find({category:cat}).sort({time:-1}).toArray((err,result2) => {
				if(err) throw err;
				posts.find({category:cat}).count().then(response => {
					let total = response;
					let size = Math.ceil(total/count);
					posts.find().sort({count:-1}).limit(10).toArray((err,result3) => {
						 res.render('home/index',{cats:result1,post:result2,hot:result3,page,count,size});
					});
				}).catch(err => {console.log(err)});
			});
		});
	});
});

module.exports = router;
