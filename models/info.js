var mongoose = require('mongoose');
var infoSchema = mongoose.Schema({
  username: String,
  info: String,
  time:String
});
var info = mongoose.model('info',infoSchema);
module.exports = info;
