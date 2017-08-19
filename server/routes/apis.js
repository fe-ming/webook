var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
//日志
var winston = require('winston');
var MongoDB = require('winston-mongodb').MongoDB;
//图像处理
var gm = require('gm').subClass({imageMagick: true});
//var images = require("images");
var path = require('path');
var glob = require('glob');
//token
var token = require('../token.js')
var tk = token.createToken({
	"iss": "ninghao.net",
	 "exp": "1438955445"
},60)
//mongojs
var mongojs = require('mongojs');
//var db = mongojs('admin:admin@127.0.0.1/webook?authSource=admin', ['article'])
var db = mongojs('webook:webook59897b63@139.129.252.72:27017/webook?authSource=mlamp', ['article'])
var fileSaveDir = '/usr/local/data/webook/';
var fileSaveDir400 = '/usr/local/data/webook/400/';
var fileSaveDir800 = '/usr/local/data/webook/800/';
winston.configure({
    transports: [
      //new (MongoDB)({ db: 'mongodb://127.0.0.1/webook',username:'webook',password:'webook' })
      new (MongoDB)({ db: 'mongodb://139.129.252.72:27017/webook',username:'webook',password:'webook' })
    ]
});
/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log(token.decodeToken(tk));
	console.log(token.checkToken(tk));
  	res.send('respond with a resource');
});

router.get('/upload', function(req, res, next) {
  	res.send('respond with a resource');
});

router.post('/upload', function(req, res, next) {
	if (!fs.existsSync(fileSaveDir)) {
		fs.mkdirSync(fileSaveDir)
  	}
	var form = new formidable.IncomingForm();
	var responseData = [];
	form.uploadDir = fileSaveDir;
	form.type = true;
	form.keepExtensions = true;
	form.parse(req, function(err, fields, files){
		if(!err) {
		  Object.keys(files).forEach(function(key){
		    var file = files[key];
		    var filename = path.basename(file.path);
		    /**
		    gm(fileSaveDir+filename)
			.resize(800)
			.write(fileSaveDir800+filename, function (err) {
			  if (err) console.log(err);
			});
			**/
			gm(fileSaveDir+filename)
			.resize(400)
			.write(fileSaveDir400+filename, function (err) {
			  if (err) console.log(err);
			});
		    /**
		    images(fileSaveDir + filename)
			    .resize(800)
			    .save(fileSaveDir400 + filename)
			    .resize(400)
			    .save(fileSaveDir800 + filename);
			**/
		    /**
		    //每张图片给予一分钟保存时间
		    setTimeout(function() {
		      if (!fs.existsSync(file.path)) return;

		      console.log("\x1B[33m删除文件" + filename + "\x1B[0m");
		      fs.unlinkSync(file.path);
		    }, 60 * 1000);
			**/
		    // 塞入响应数据中
		    responseData.push({
		      type: file.type,
		      name: filename,
		      path: '/public/upload/' + filename,
		      size: file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB"
		    });
		  });
		} else {
		  console.warn(err);
		}
		res.writeHead(200);
		res.end(JSON.stringify(responseData));
	})
});

router.post('/create', function(req, res, next) {
	//console.log(req.body);
	if(req.body.id) {
		db.article.findAndModify({
		    query: { _id: mongojs.ObjectId(req.body.id)},
		    update: { $set: req.body },
		    new: true
		}, function (err, doc, lastErrorObject) {
		    // doc.tag === 'maintainer' 
		    res.send(req.body);
		})
	}else{
		db.article.save(req.body,function(err,doc){
			//console.log(doc);
			res.send(req.body);
		});
	}
});

router.get('/article/:app', function(req, res, next) {
	//console.log(req.params);
	db.article.find({app:req.params.app},{_id:1,contentTitle:1},function(err,docs){
		//console.log(doc);
		res.send(docs);
	});
});

router.get('/article/id/:id', function(req, res, next) {
	var referer = req.get('Referer');
	var ua = req.get('User-Agent');
  	winston.log('info', 'findArticle',{referer:referer,id:req.params.id,ip: req.ip,ua:ua});
	db.article.findOne({ _id: mongojs.ObjectId(req.params.id)},function(err,doc){
		//console.log(err);
		res.send(doc);
	});
});

router.get('/visitors/id/:id', function(req, res, next) {
	//options必须放在方法内，否则刷新页面数据舞变化
	var options = {
		//from: new Date - 24 * 60 * 60 * 1000,
		//until: new Date,
		limit: 2000000000,
		//start: 0,
		//order: 'desc',
		fields: ['meta']	//level/message/meta
	};
	winston.query(options, function (err, results) {
		if (err) {
		  throw err;
		}
		//console.log(results.mongodb);
		var visitors = results.mongodb.filter(function(result){
			return result.meta.id == req.params.id;
		})
		//console.log(visitors);
		res.json({'visitors':visitors.length})
	});
});

router.delete('/article/id/:id', function(req, res, next) {
	//console.log(req.params);
	db.article.remove({ _id: mongojs.ObjectId(req.params.id)},function(err,doc){
		//console.log(err);
		res.send(doc);
	});
});
router.get('/compressImages', function(req, res, next) {
	var imagesArr = glob.sync(fileSaveDir + '*.{jpeg,jpg,png,bmp}');
	imagesArr.forEach(function(file){
		var filename = path.basename(file);
		/**
		gm(fileSaveDir+filename)
		.resize(800)
		.write(fileSaveDir800+filename, function (err) {
		  if (err) console.log(err);
		});
		**/
		gm(fileSaveDir+filename)
		.resize(400)
		.write(fileSaveDir400+filename, function (err) {
		  if (err) console.log(err);
		});
	})
	res.send("图片处理成功！"); 
});
module.exports = router;
