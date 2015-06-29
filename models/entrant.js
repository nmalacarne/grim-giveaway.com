var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var entrantSchema = new Schema({
    steam_id      : { type: String, required: true, unique: true  }
  , profile_name  : { type: String, required: true }
  , profile_url   : { type: String, required: true }
  , icon_url      : { type: String, required: true }
  , winner        : { type: Boolean, default: false  }
});

module.exports = mongoose.model('Entrant', entrantSchema);
