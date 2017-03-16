var qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'z99yxK4DvZlwf-psIF9v8Yn3PJA_LpfOdQx7j_0E';
qiniu.conf.SECRET_KEY = '9UJtJtOG8NBW5EBmWi3LdWWy3tYMf-nC9QclRuR9';

function myupload(name,filepath){
    //要上传的空间
    bucket = 'uploadtest';
    //上传到七牛后保存的文件名
    key = name;
    //构建上传策略函数
    function uptoken(bucket, key) {
      var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
      return putPolicy.token();
    }
    //生成上传 Token
    token = uptoken(bucket, key);
    //要上传文件的本地路径
    filePath = filepath;
    //构造上传函数
    function uploadFile(uptoken, key, localFile) {
      var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
          if(!err) {
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId);
          } else {
            // 上传失败， 处理返回代码
            console.log(err);
          }
      });
    }
    //调用uploadFile上传
    uploadFile(token, key, filePath);
}


module.exports = myupload;
