const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        title:{
            type: String,
            required: true,
            unique: true
        },
        postContent:{
            type: String,
            maxLength: 30000,
            required: true,
            unique: true
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        category:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        mainimage:{
            type: String,
            default: 'defaultPost.jpg',
            required: false
        },
        date:{
            type: Date,
            default: Date.now,
            required: true
        },
    },
    {
        collection: 'posts'
    });

module.exports = mongoose.model('Post', UserSchema);
