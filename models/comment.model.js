const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', required: true,
    },
    comment:{
        type: String,
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
