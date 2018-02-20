var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DragonballSchema = new Schema({
  name: {
        type: String,
    },
  number: {
        type: String,
    }
});

module.exports = mongoose.model('Dragonball', DragonballSchema);