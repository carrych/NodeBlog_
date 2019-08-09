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

        if (in_request.file)
            newPost.mainimage = in_request.file.filename;

        return newPost;
    }

    //populate data for post

    async PopulateAuthor(newPost) {

        return Post.findOne({_id: newPost._id}).populate('author');
    }

    async PopulateCategory(newPost) {

        return Post.findOne({_id: newPost._id}).populate('category');
    }

    async AllPostsWithFullInfo() {

        const allPosts = await Post.find();

        const newAllPosts = await Promise.all(allPosts.map(async post => {
                const {_id, title, postContent, mainimage, date} = post;
                const {author} = await this.PopulateAuthor(post);
                const {category} = await this.PopulateCategory(post);

                const fullPostData = {
                    _id,
                    title,
                    postContent,
                    mainimage,
                    date,
                    author,
                    category
                };

                return fullPostData;
            }
        ));

        newAllPosts.reverse();
        return newAllPosts;
    }

    async PostWithFullInfo(id) {

        const post = await Post.findById(id);

        const newPost = await (async ()=> {
                const {_id, title, postContent, mainimage, date} = post;
                const {author} = await this.PopulateAuthor(post);
                const {category} = await this.PopulateCategory(post);

                const fullPost = {
                    _id,
                    title,
                    postContent,
                    mainimage,
                    date,
                    author,
                    category
                };

                console.log(fullPost);
                return fullPost;
            }
        )();

        return newPost;
    }
}

module.exports = new PostHandler;
