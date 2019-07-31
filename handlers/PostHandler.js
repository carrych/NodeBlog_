const Post = require('../models/post.model');
const mongoose = require('mongoose');

class PostHandler {

//if we have img in req.body - create user with this img else use default img

    async CreatePost(in_request) {

        const {title, postContent, category, mainimage} = in_request.body;
        const {_id} = in_request.user;

        let newPost = new Post({
            _id: mongoose.mongo.ObjectId(),
            title,
            postContent,
            category,
            author: _id
        });

        if (mainimage)
            newPost.mainimage = mainimage;

        return newPost;
    }

    //populate data for post

    async PopulateAuthorAndCategory(newPost) {

        return Post.findOne({title: newPost.title}).populate('author');
    }

}

module.exports = new PostHandler;
