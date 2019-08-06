const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', required: true,
    },
    comment: {
        type: String,
        required: true
    },
    guestName: {
        type: String,
        required: false
    },
    commentDate: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    collection: 'comments'
});

module.exports = mongoose.model('Comment', CommentSchema);
