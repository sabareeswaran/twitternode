var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokboxSchema = new Schema({
    inappID: { type: String },
    session: { type: String },
    token: { type: String },
});

module.exports = mongoose.model('Tokbox', TokboxSchema);