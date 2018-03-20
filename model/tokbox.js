var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokboxSchema = new Schema({
    inappID: { type: String },
    sessionId: { type: String},
    token: { type: String },
    apiKey:{type:String,unique:true}
});

module.exports = mongoose.model('Tokbox', TokboxSchema);