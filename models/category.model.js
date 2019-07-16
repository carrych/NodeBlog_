const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        category: {
            type: String,
            unique: true,
            uppercase: true,
            match: /^[a-zA-Z]+$/,
            required: true
        }
    }, {
        collection: 'categories'
    }
);

module.exports = mongoose.model('Category', CategorySchema);