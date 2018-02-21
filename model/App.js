var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppSchema = new Schema({
  name: {
        type: String,
    },
  version: {
        type: String,
    },
    update:{
        type:String
    }
});

module.exports = mongoose.model('App', AppSchema);