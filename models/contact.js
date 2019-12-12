const mongoose = require('mongoose');

const Contact = mongoose.model('contact',{
     first_name: String,
     last_name: {type: String, default: ''},
     email: {type: String, default: ''},
     user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
     last_activity: { type: mongoose.Schema.Types.ObjectId, ref: 'activity' },   
     address: String,
     city: String,
     state: String,
     zip: String,
     label: String,
     cell_phone: {type: String, default: ''},
     country: {type: String, default: ''},
     source: String,
     brokerage: String,
     tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tag' }],
     tags: Array,
     recruiting_stage: String,
     created_at: Date,
     updated_at: Date,
 });

 module.exports = Contact