var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataSchema = new Schema({
	data:{type:String}
});


module.exports = mongoose.model('Data', DataSchema);