const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        default: 0,
        required: true
    },
    commentDate:{
        type: Date,
        default: Date.now,
        required: true
    }
},{
    collection: 'comments'
});

module.exports = mongoose.model('Comment', CommentSchema);