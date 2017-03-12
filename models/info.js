var mongoose = require('mongoose');
var infoSchema = mongoose.Schema({
  username: String,
  title: String,
  content: String,
  like:Array,
  time:String
});
var info = mongoose.model('info',infoSchema);
module.exports = info;
