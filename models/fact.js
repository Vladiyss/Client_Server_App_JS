const mongoose = require('mongoose');

const factScheme = new mongoose.Schema({
  date: Date,
  title: {type: String, default: ''},
  content: {type: String, default: ''},
  author: {type: mongoose.Schema.ObjectId, ref: 'User'},
  image: {type: String, default: ''},
  likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = new mongoose.model('Fact', factScheme); 