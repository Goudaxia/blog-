var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('objectid');
const url = "mongodb://localhost:27017/blog6";
const Category = require('../../models/category');

/* GET home page. */
router.get('/', function(req, res, next) {
	Category.getCats((err,result) => {
		if(err) throw err;
		res.render('admin/category_list',{data:result});
	});
	// MongoClient.connect(url,(err,db) => {
	// 	if(err) throw err;
	// 	let category = db.collection('category');
	// 	category.find({},{}).toArray((err,result) => {
	// 		if(err) throw err;
	// 		res.render('admin/category_list',{data:result});
	// 	});
	// });
});
router.get('/add', function(req, res, next) {
   res.render('admin/category_add');
});
router.post('/insert',(req,res) => {
	let title = req.body.title.trim();
	let order = req.body.order.trim();
	if(!title){
		res.render('admin/message',{msg:'分类名称不能为空'});
		return;
	}
	if(!(+order==order)){
		res.render('admin/message',{msg:'排序依据是数字'});
		return;
	}
	let cat = new Category(title,order);
	cat.add((err,result) => {
		if(err) throw err;
		res.render('admin/message',{msg:'插入分类'});
	});
	// MongoClient.connect(url,(err,db) => {
	// 	if(err) throw err;
	// 	let category = db.collection('category');
	// 	category.insert({title,order},(err,result) => {
	// 		if(err) throw err;
	// 		res.render('admin/message',{msg:'插入分类'});
	// 	});
	// });
});
router.get('/edit', function(req, res, next) {
	let id = req.query.id;
	let cat = new Category('','',id);
	cat.edit((err,result) => {
		if(err) throw err;
			res.render('admin/category_edit',{data:result});
	});
	// MongoClient.connect(url,(err,db) => {
	// 	if(err) throw err;
	// 	let category = db.collection('category');
	// 	category.findOne({_id:ObjectId(id)},(err,result) => {
	// 		if(err) throw err;
	// 		console.log(result);
	// 		res.render('admin/category_edit',{data:result});
	// 	});
	// });
});
router.post('/update',(req,res) => {
	let title = req.body.title.trim();
	let order = req.body.order.trim();
	let id = req.body.id;
	if(!title){
		res.render('admin/message',{msg:'分类名称不能为空'});
		return;
	}
	if(!(+order==order)){
		res.render('admin/message',{msg:'排序依据是数字'});
		return;
	}
	let cat = new Category(title,order,id);
	cat.update((err,result) => {
		if(err) throw err;
			res.render('admin/message',{msg:'更新分类'});
	});
	// MongoClient.connect(url,(err,db) => {
	// 	if(err) throw err;
	// 	let category = db.collection('category');
	// 	category.update({_id:ObjectId(id)},{title,order},(err,result) => {
	// 		res.render('admin/message',{msg:'更新分类'});
	// 	});
	// });
});
router.get('/delete', function(req, res, next) {
   res.render('<h2>删除分类</h2>');
});

module.exports = router;
