var fs = require('fs');
var path=require('path');
var uuid = require('node-uuid');
var url = require('url');
var user = require('./models/user');
var info = require('./models/info');
var mongoose = require('mongoose');
var sha1 = require('sha1');
var jwt = require('./models/jwt_auth');
var moment = require('moment');

var MIME_TYPE = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

moment.locale('zh-cn');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://xiaobo:xiaoboma@ds163699.mlab.com:63699/dazhequan');
// mongoose.connect('mongodb://localhost:27017/user')
function register(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = JSON.parse(post);
    user.find({'username':post.username},function(err,doc){
      if(err) {
        console.log(err);
        return false;
      }else{
        if(doc.length>0){
          res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
          var info = {
            right:'no',
            token:''
          }
          res.write(JSON.stringify(info));
          res.end();
        }else{
          var userinfo = new user({
            username:post.username,
            password:sha1(post.password)
          })
          userinfo.save(function(err,data){
            if(err){
              console.log(err);
            }else {
              console.log('ok');
              // console.log(data);
              res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
              var info = {
                right:'yes',
                token:jwt.encode(data.username)
              }
              res.write(JSON.stringify(info));
              res.end();
            }
          })
        }
      }
    })
  });
}
function login(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = JSON.parse(post);
    console.log(post);
    // console.log(user.find({'username':post.username}));
    user.findOne({'username':post.username},function(err,doc){
      if(err) {
        console.log(err);
        return false;
      }else{
        console.log(doc);
        if(doc === null){
          res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
          var info = {
            right:'no username',
            token:''
          }
          res.write(JSON.stringify(info));
          res.end();
        }else{
          var userinfo = new user({
            username:post.username,
            password:sha1(post.password)
          })
          if(doc.password === userinfo.password)
          {
            res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
            var info = {
              right:'yes',
              token:jwt.encode(userinfo.username)
            }
            res.write(JSON.stringify(info));
            res.end();
          }else{
            res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
            var info = {
            right:'password wrong',
            token:''
          }
            res.write(JSON.stringify(info));
            res.end();
          }
        }
      }
    })
  });

};
function logout(){};
function homepage(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
    var news = '';
    info.find({}).sort({_id:-1}).limit(10).exec(function(err,doc){
      if(err){
        console.log(err);
      }else{
        doc.forEach(function(item){
          item.time = moment(item.time).fromNow();
          item.content = null;
        })
        news = JSON.stringify(doc);
        res.write(news);
        res.end();
      }
    });
  })

};
function moren(){};

function post(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = JSON.parse(post);
    if(post.token){
      var result = jwt.decode(post.token);
      if(result!='error'){
        res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
        res.write('yes');
        res.end();
        var myinfo = new info({
          username:result.iss,
          title:post.title,
          content: post.info,
          time: moment().format(),
          imgsrc:[]
        });
        if(post.img_data.length>0){
            var funcs = post.img_data.map(function(item){
              return new Promise(function(resolve,reject){
                item = item.replace(/^data:image\/\w+;base64,/, "");
                var dataBuffer = new Buffer(item, 'base64');
                var name = uuid.v1();
                fs.writeFile(path.resolve(__dirname,"/upload/"+name+'.jpg'), dataBuffer, function(err) {
                    if(err){
                      reject(err);
                      console.log(err);
                    }else{
                      resolve(name+'.jpg');
                    }
                });
              })
            })
            Promise.all(funcs).then(function(value){
              myinfo.imgsrc = value;
              myinfo.save(function(err,data){
                if(err){
                  console.log(err);
                }else {
                  console.log('ok');
                }
              })
            }).catch(function(value){
              console.log(value);
            })
        }else
        {
          myinfo.save(function(err,data){
          if(err){
            console.log(err);
          }else {
            console.log('ok');
          }
        })
        }
      }
    }else {
      res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
      res.write('no');
      res.end();
    }
  })
}
function paper(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = JSON.parse(post);
    res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
    var news = '';
    console.log(post);
    info.findOne({'_id':post._id},function(err,doc){
      if(err){
        console.log(err);
      }else{
        doc.time = moment(doc.time).fromNow();
        news = JSON.stringify(doc);
        res.write(news);
        res.end();
      }
    });
  })
}

function like(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = JSON.parse(post);
    res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
    var news = '';
    console.log(post);
    info.findOne({'_id':post._id},function(err,doc){
      if(err){
        console.log(err);
      }else{
        if(doc.like.length>0){
          var _like = doc.like.filter(function(item){
            return item !== post.username;
          });
          console.log(_like);
          if(_like.length < doc.like.length){
            doc.like = _like;
          }else {
            doc.like.push(post.username);
          }
        }else{
          doc.like.push(post.username);
        }
        doc.save();
        res.write('yes');
        res.end();
      }
    });
  })
}


function static(req,res){
    var filePath='./';
    console.log(req.url);
    if(/^\/upload/.test(req.url)){
      console.log(1);
      filePath = "./" + url.parse(req.url).pathname;
    }

    fs.exists(filePath,function(err){
        if(!err){
            res.writeHead(200,{'content-type':'text/html'});
            res.end("sorry,404");
        }else{
            var ext = path.extname(filePath);
            ext = ext?ext.slice(1) : 'unknown';
            var contentType = MIME_TYPE[ext] || "text/plain";
            fs.readFile(filePath,function(err,data){
                if(err){
                    res.end("<h1>500</h1>服务器内部错误！");
                }else{
                    res.writeHead(200,{'content-type':contentType});
                    console.log(contentType);
                    res.end(data);
                }
            });//fs.readfile
        }
    })//path.exists

}
module.exports = function(req,res){
  var pathname = url.parse(req.url).pathname;
  console.log(pathname);
  switch(pathname){
    case '/register':register(req,res);break;
    case '/login':login(req,res);break;
    case '/logout':logout(req,res);break;
    case '/':homepage(req,res);break;
    case '/post':post(req,res);break;
    case '/paper':paper(req,res);break;
    case '/like':like(req,res);break;
    default: static(req,res);break;
  }
}
