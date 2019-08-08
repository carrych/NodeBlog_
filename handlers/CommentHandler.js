const Comment = require('../models/comment.model');
const mongoose = require('mongoose');

class CommentHandler {

    async CreateComment(in_request) {

        const {id: postId} = in_request.params;
        const {comment, guestName} = in_request.body;

        let author;

        if (in_request.user)
            author = in_request.user._id;

        let newComment = new Comment({
            _id: mongoose.mongo.ObjectId(),
            comment,
            guestName,
            postId,
            author
        });

        return newComment;
    }

    //populate data for post

    async PopulateAuthor(newComment) {

        return Comment.findOne({_id: newComment._id}).populate('author');
    }

    async AllCommentsForPost(postId) {

        const allComments = await Comment.find({postId: postId});

        const newAllComments = await Promise.all(allComments.map(async oneComment => {
                const {_id, postId, comment, commentDate, guestName} = oneComment;
                const {author} = await this.PopulateAuthor(oneComment);
                let fullComment;

                if (guestName) {
                    fullComment = {
                        _id,
                        postId,
                        comment,
                        guestName,
                        commentDate
                    };
                }
                else {
                    fullComment = {
                        _id,
                        postId,
                        comment,
                        author,
                        commentDate
                    };
                }
                return fullComment;
            }
        ));

        return newAllComments;
    }
}

module.exports = new CommentHandler;
