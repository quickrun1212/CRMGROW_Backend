const mongoose = require('mongoose');

const Video = mongoose.model('video',{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: String,
    company: {type: String},
    description: String,
    thumbnail: String,
    preview: String,
    converted: { type: Boolean, default: false},
    custom_thumbnail: { type: Boolean, default: false},
    recording: {type: Boolean, default: false},
    path: String,
    type: String,
    duration: Number,
    url: String,
    role: String,
    default_edited: {type: Boolean, default: false},
    priority: { type: Number, default: 1000},
    del: { type: Boolean, default: false},
    created_at: Date,
    updated_at: Date,
 });

 module.exports = Video