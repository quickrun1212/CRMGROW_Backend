const mongoose = require('mongoose');

const File = mongoose.model('file', {
  name: String,
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  type: String,
  created_at: Date,
  updated_at: Date,
});

module.exports = File;
