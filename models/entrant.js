var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var entrantSchema = new Schema({
    steam_id      : { type: String, required: true, unique: true  }
  , profile_name  : { type: String, required: true }
  , profile_url   : { type: String, required: true }
  , icon_url      : { type: String, required: true }
  , winner        : { type: Boolean, default: false  }
  , created_at    : { type: Date }
  , updated_at    : { type: Date }
});

entrantSchema.pre('save', function(next) {
  var now = new Date();

  this.updated_at = now;

  if (!this.created_at) this.created_at = now;

  next();
});

module.exports = mongoose.model('Entrant', entrantSchema);
