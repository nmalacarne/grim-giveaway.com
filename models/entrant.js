var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var entrantSchema = new Schema({
    account_name  : { type: String, required: true, unique: true  }
  , winner        : { type: Boolean, default: false  }
});

module.exports = mongoose.model('Entrant', entrantSchema);
