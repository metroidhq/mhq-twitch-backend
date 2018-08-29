var mongoose = require('mongoose');

var objectSchema = new mongoose.Schema({
  _key: {
    type: String,
  },
});

module.exports = mongoose.model('objects', objectSchema);
